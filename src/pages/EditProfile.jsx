import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function EditProfile() {
  const [formData, setFormData] = useState({
    fullName: '',
    nationalId: '',
    grade: '',
    address: '',
    studentPhone: '',
    whatsappNumber: '',
    fatherPhone: '',
    motherPhone: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('current_user'));
    if (!currentUser || currentUser.role === 'technician') {
      navigate('/login');
    } else {
      setFormData(currentUser);
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    setError('');

    if (formData.nationalId.length !== 14 || isNaN(formData.nationalId)) {
      setError('⚠️ الرقم القومي يجب أن يكون 14 رقماً صحيحاً.');
      return;
    }

    const existingUsers = JSON.parse(localStorage.getItem('platform_users')) || [];
    const updatedUsers = existingUsers.map(user => 
      user.nationalId === formData.nationalId || (user.id && user.id === formData.id) ? formData : user
    );

    localStorage.setItem('platform_users', JSON.stringify(updatedUsers));
    localStorage.setItem('current_user', JSON.stringify(formData));

    alert('🎉 تم تعديل بياناتك بنجاح يا بطل!');
    navigate('/dashboard');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10" dir="rtl">
      <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl p-8 text-white">
        <h2 className="text-2xl font-bold text-center mb-2 text-blue-400">تعديل البيانات الشخصية ✏️</h2>
        <p className="text-center text-gray-400 text-sm mb-6">قم بتعديل بياناتك أو الرقم القومي بدقة</p>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleUpdate} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">الاسم الكامل</label>
              <input type="text" name="fullName" required value={formData.fullName} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">الرقم القومي (14 رقماً)</label>
              <input type="text" name="nationalId" maxLength="14" required value={formData.nationalId} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm" dir="ltr" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">المرحلة الدراسية</label>
              <input type="text" name="grade" required value={formData.grade} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">العنوان</label>
              <input type="text" name="address" required value={formData.address} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">رقم تليفون الطالب</label>
              <input type="tel" name="studentPhone" required value={formData.studentPhone} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm" dir="ltr" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">رقم الواتساب</label>
              <input type="tel" name="whatsappNumber" required value={formData.whatsappNumber} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm" dir="ltr" />
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            <button type="submit" className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-base">حفظ التعديلات 🚀</button>
            <button type="button" onClick={() => navigate('/dashboard')} className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-lg text-base">إلغاء</button>
          </div>
        </form>
      </div>
    </div>
  );
}