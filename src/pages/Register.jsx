import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: '',
    nationalId: '',
    grade: 'الصف الثاني الابتدائي',
    address: '',
    studentPhone: '',
    whatsappNumber: '',
    fatherPhone: '',
    motherPhone: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setError('');

    // التحقق من الرقم القومي (14 رقم)
    if (formData.nationalId.length !== 14 || isNaN(formData.nationalId)) {
      setError('⚠️ الرقم القومي يجب أن يكون 14 رقماً صحيحاً.');
      return;
    }

    // جلب الطلاب المسجلين مسبقاً من الـ localStorage أو مصفوفة فارغة
    const existingStudents = JSON.parse(localStorage.getItem('students_list') || '[]');

    // التحقق إذا كان الرقم القومي مسجل من قبل
    const found = existingStudents.find(s => s.nationalId === formData.nationalId);
    if (found) {
      setError('⚠️ هذا الرقم القومي مسجل من قبل بالفعل!');
      return;
    }

    // إضافة الطالب الجديد
    const newStudent = { ...formData, status: 'قيد المراجعة', id: Date.now() };
    existingStudents.push(newStudent);

    // حفظ القائمة في الـ localStorage
    localStorage.setItem('students_list', JSON.stringify(existingStudents));
    // حفظ المستخدم الحالي للجلسة
    localStorage.setItem('current_user', JSON.stringify(newStudent));

    alert('🎉 تم إنشاء الحساب بنجاح يا عالمي!');
    navigate('/dashboard');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10" dir="rtl">
      <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl p-8 text-white">
        <h2 className="text-2xl font-bold text-center mb-2 text-blue-400">إنشاء حساب جديد للطالب 🚀</h2>
        <p className="text-center text-gray-400 text-sm mb-6">يرجى إدخال بياناتك الدراسية والشخصية بدقة لتفعيل الحساب</p>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* الاسم الكامل */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">الاسم الكامل</label>
              <input
                type="text"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
                placeholder="أدخل اسمك ثلاثي"
                className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
              />
            </div>

            {/* الرقم القومي */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">الرقم القومي (14 رقماً)</label>
              <input
                type="text"
                name="nationalId"
                maxLength="14"
                required
                value={formData.nationalId}
                onChange={handleChange}
                placeholder="أدخل الرقم القومي المكون من 14 رقم"
                className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                dir="ltr"
              />
            </div>

            {/* المرحلة الدراسية */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">المرحلة الدراسية / السنة</label>
              <select
                name="grade"
                value={formData.grade}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
              >
                <optgroup label="المرحلة الابتدائية">
                  <option value="الصف الأول الابتدائي">الصف الأول الابتدائي</option>
                  <option value="الصف الثاني الابتدائي">الصف الثاني الابتدائي</option>
                  <option value="الصف الثالث الابتدائي">الصف الثالث الابتدائي</option>
                  <option value="الصف الرابع الابتدائي">الصف الرابع الابتدائي</option>
                  <option value="الصف الخامس الابتدائي">الصف الخامس الابتدائي</option>
                  <option value="الصف السادس الابتدائي">الصف السادس الابتدائي</option>
                </optgroup>
                <optgroup label="المرحلة الإعدادية">
                  <option value="الصف الأول الإعدادي">الصف الأول الإعدادي</option>
                  <option value="الصف الثاني الإعدادي">الصف الثاني الإعدادي</option>
                  <option value="الصف الثالث الإعدادي">الصف الثالث الإعدادي</option>
                </optgroup>
                <optgroup label="المرحلة الثانوية">
                  <option value="الصف الأول الثانوي">الصف الأول الثانوي</option>
                  <option value="الصف الثاني الثانوي">الصف الثاني الثانوي</option>
                  <option value="الصف الثالث الثانوي">الصف الثالث الثانوي</option>
                </optgroup>
              </select>
            </div>

            {/* العنوان / السكن */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">العنوان (السكن بالتفصيل)</label>
              <input
                type="text"
                name="address"
                required
                value={formData.address}
                onChange={handleChange}
                placeholder="المدينة / الشارع / الحارة"
                className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
              />
            </div>

            {/* رقم تليفون الطالب */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">رقم تليفون الطالب</label>
              <input
                type="tel"
                name="studentPhone"
                required
                value={formData.studentPhone}
                onChange={handleChange}
                placeholder="01xxxxxxxx"
                className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                dir="ltr"
              />
            </div>

            {/* رقم الواتساب للمتابعة */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">رقم الواتساب (لجروب المتابعة)</label>
              <input
                type="tel"
                name="whatsappNumber"
                required
                value={formData.whatsappNumber}
                onChange={handleChange}
                placeholder="01xxxxxxxx"
                className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                dir="ltr"
              />
            </div>

            {/* رقم تليفون الأب */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">رقم تليفون الأب</label>
              <input
                type="tel"
                name="fatherPhone"
                required
                value={formData.fatherPhone}
                onChange={handleChange}
                placeholder="01xxxxxxxx"
                className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                dir="ltr"
              />
            </div>

            {/* رقم تليفون الأم */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">رقم تليفون الأم</label>
              <input
                type="tel"
                name="motherPhone"
                required
                value={formData.motherPhone}
                onChange={handleChange}
                placeholder="01xxxxxxxx"
                className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-width text-white focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                dir="ltr"
              />
            </div>
          </div>

          {/* كلمة المرور */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">كلمة المرور الخاصة بالحساب</label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition duration-200 shadow-lg text-base mt-2"
          >
            إتمام التسجيل وحفظ البيانات 🚀
          </button>

          <p className="text-center text-sm text-gray-400 mt-4">
            لديك حساب بالفعل؟{' '}
            <Link to="/login" className="text-blue-400 hover:underline font-semibold">
              تسجيل الدخول
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}