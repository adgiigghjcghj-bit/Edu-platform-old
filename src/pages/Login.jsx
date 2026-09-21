import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    // فحص دخول الفني أو الدعم الفني
    if (identifier === 'support' || identifier === '01000000000') {
      if (password === 'tech123') {
        const techUser = {
          fullName: 'فريق الدعم الفني والتقني',
          role: 'technician',
          grade: 'إدارة النظام',
          nationalId: '00000000000000'
        };
        localStorage.setItem('current_user', JSON.stringify(techUser));
        alert('🛠️ أهلاً بك يا باشمهندس في لوحة تحكم الفنيين!');
        navigate('/dashboard');
        return;
      }
    }

    // جلب الطلاب المسجلين
    const existingUsers = JSON.parse(localStorage.getItem('students_list')) || [];
    const foundUser = existingUsers.find(
      (user) => 
        (user.nationalId === identifier || user.studentPhone === identifier) && 
        user.password === password
    );

    if (foundUser) {
      localStorage.setItem('current_user', JSON.stringify(foundUser));
      alert(`🎉 أهلاً بك يا بطل، تم تسجيل الدخول بنجاح!`);
      navigate('/dashboard');
    } else {
      setError('⚠️ بيانات الدخول غير صحيحة! تأكد من الرقم القومي، رقم التليفون، أو كلمة المرور.');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16" dir="rtl">
      <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl p-8 text-white">
        <h2 className="text-2xl font-bold text-center mb-2 text-blue-400">تسجيل الدخول للمنصة 🚀</h2>
        <p className="text-center text-gray-400 text-sm mb-6">للطلاب أو فريق الدعم الفني</p>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">الرقم القومي / رقم التليفون / (كود الفني)</label>
            <input
              type="text"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="أدخل بياناتك أو كود الدعم"
              className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
              dir="ltr"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">كلمة المرور</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition duration-200 shadow-lg text-base mt-2"
          >
            دخول للنظام 🚀
          </button>
        </form>
      </div>
    </div>
  );
}