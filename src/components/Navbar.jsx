import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // قراءة المستخدم الحالي من التخزين المحلي
    const checkUser = () => {
      const storedUser = JSON.parse(localStorage.getItem('current_user'));
      setUser(storedUser);
    };

    checkUser();
    window.addEventListener('storage', checkUser);
    return () => window.removeEventListener('storage', checkUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('current_user');
    setUser(null);
    alert('🔒 تم تسجيل الخروج بنجاح!');
    navigate('/login');
  };

  return (
    <nav className="bg-gray-800 border-b border-gray-700 px-6 py-4 shadow-md" dir="rtl">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-extrabold text-blue-400 flex items-center gap-2">
          <span>"طريقك الأمثل نحو التميز والفهم العميق🚀."</span>
        </Link>

        <div className="flex items-center gap-4 text-sm font-semibold">
          <Link to="/" className="text-gray-300 hover:text-blue-400 transition">الرئيسية</Link>
          
          {user ? (
            <>
              <Link to="/dashboard" className="text-gray-300 hover:text-blue-400 transition">لوحة التحكم</Link>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl transition shadow"
              >
                تسجيل الخروج
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-300 hover:text-blue-400 transition">تسجيل الدخول</Link>
              <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition shadow">
                إنشاء حساب
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}