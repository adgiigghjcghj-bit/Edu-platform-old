import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('currentUser'));
    if (savedUser) {
      setUser(savedUser);
    }
  }, []);

  const login = (identifier) => {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const foundUser = users.find(u => u.userId === identifier || u.phone === identifier);
    
    if (foundUser) {
      localStorage.setItem('currentUser', JSON.stringify(foundUser));
      setUser(foundUser);
      return true;
    }
    return false;
  };

  const register = (userData) => {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    // التأكد إن الـ ID أو التليفون مش متكررين
    const exists = users.some(u => u.userId === userData.userId || u.phone === userData.phone);
    
    if (exists) {
      return false; // الحساب موجود من قبل
    }

    users.push(userData);
    localStorage.setItem('users', JSON.stringify(users));
    login(userData.userId); // تسجيل دخول تلقائي بعد التسجيل
    return true;
  };

  const logout = () => {
    localStorage.removeItem('currentUser');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}