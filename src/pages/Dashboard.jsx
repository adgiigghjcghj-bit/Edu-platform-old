import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [allStudents, setAllStudents] = useState([]);
  const [editingStudent, setEditingStudent] = useState(null);
  
  // حالات البحث والفلترة
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGradeFilter, setSelectedGradeFilter] = useState('الكل');
  const [statusFilter, setStatusFilter] = useState('الكل');

  // إشعارات الـ Toast
  const [toastMessage, setToastMessage] = useState(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('current_user'));
    if (!currentUser) {
      navigate('/login');
    } else {
      setUser(currentUser);
      loadStudentsData();
    }
  }, [navigate]);

  const loadStudentsData = () => {
    try {
      const data = JSON.parse(localStorage.getItem('students_list') || '[]');
      setAllStudents(data);
    } catch (err) {
      console.error('Error loading students:', err);
      showToast('⚠️ حدث خطأ أثناء جلب بيانات الطلاب.');
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleDeleteStudent = (id) => {
    if (confirm('هل أنت متأكد من حذف هذا الطالب نهائياً من المنصة؟')) {
      try {
        const updatedStudents = allStudents.filter(student => student.id !== id);
        setAllStudents(updatedStudents);
        localStorage.setItem('students_list', JSON.stringify(updatedStudents));
        showToast('🗑️ تم حذف الطالب بنجاح من النظام.');
        
        if (user && user.id === id) {
          localStorage.removeItem('current_user');
          navigate('/login');
        }
      } catch (err) {
        console.error('Error deleting student:', err);
        showToast('⚠️ حدث خطأ أثناء حذف الطالب.');
      }
    }
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    try {
      const updatedStudents = allStudents.map(student => 
        student.id === editingStudent.id ? editingStudent : student
      );
      
      setAllStudents(updatedStudents);
      localStorage.setItem('students_list', JSON.stringify(updatedStudents));

      if (user && user.id === editingStudent.id) {
        localStorage.setItem('current_user', JSON.stringify(editingStudent));
        setUser(editingStudent);
      }

      setEditingStudent(null);
      showToast('🎉 تم تحديث وحفظ بيانات الطالب بنجاح!');
    } catch (err) {
      console.error('Error updating student:', err);
      showToast('⚠️ حدث خطأ أثناء تحديث بيانات الطالب.');
    }
  };

  const handleUpdateStatus = (id, newStatus) => {
    try {
      const updated = allStudents.map(student => {
        if (student.id === id) {
          return { ...student, status: newStatus };
        }
        return student;
      });
      setAllStudents(updated);
      localStorage.setItem('students_list', JSON.stringify(updated));
      showToast(`✅ تم تحديث حالة الطالب إلى (${newStatus}) بنجاح.`);
    } catch (err) {
      console.error('Error updating status:', err);
      showToast('⚠️ حدث خطأ أثناء تحديث حالة الطالب.');
    }
  };

  const exportToCSV = () => {
    if (allStudents.length === 0) {
      alert('لا توجد بيانات طلاب لتصديرها!');
      return;
    }

    const headers = ['الاسم الكامل', 'الرقم القومي', 'المرحلة الدراسية', 'العنوان', 'رقم الطالب', 'رقم الواتساب', 'رقم الأب', 'رقم الأم', 'الحالة'];
    
    const rows = allStudents.map(s => [
      `"${s.fullName || ''}"`,
      `="${s.nationalId || ''}"`,
      `"${s.grade || ''}"`,
      `"${s.address || ''}"`,
      `="${s.studentPhone || ''}"`,
      `="${s.whatsappNumber || ''}"`,
      `="${s.fatherPhone || ''}"`,
      `="${s.motherPhone || ''}"`,
      `"${s.status || ''}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Students_Report_${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('📥 تم تحميل تقرير إكسيل للطلاب بنجاح!');
  };

  if (!user) return null;

  const totalStudents = allStudents.length;
  const acceptedStudents = allStudents.filter(s => s.status === 'مقبول').length;
  const pendingStudents = allStudents.filter(s => s.status === 'قيد المراجعة' || !s.status).length;
  const acceptanceRate = totalStudents > 0 ? Math.round((acceptedStudents / totalStudents) * 100) : 0;

  const filteredStudents = allStudents.filter(student => {
    const matchesSearch = 
      (student.fullName && student.fullName.toLowerCase().includes(searchTerm.toLowerCase())) || 
      (student.nationalId && student.nationalId.includes(searchTerm)) ||
      (student.whatsappNumber && student.whatsappNumber.includes(searchTerm));
    
    const matchesGrade = selectedGradeFilter === 'الكل' || student.grade === selectedGradeFilter;
    const matchesStatus = statusFilter === 'الكل' || student.status === statusFilter;

    return matchesSearch && matchesGrade && matchesStatus;
  });

  // لوحة تحكم الفنيين (Technician Dashboard)
  if (user.role === 'technician') {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10 relative" dir="rtl">
        {toastMessage && (
          <div className="fixed top-6 right-6 z-50 bg-blue-600 text-white px-6 py-3 rounded-2xl shadow-2xl border border-blue-400/30 flex items-center gap-3 animate-bounce">
            <span className="text-lg">📢</span>
            <span className="font-semibold text-sm">{toastMessage}</span>
          </div>
        )}

        <div className="bg-linear-to-r from-slate-900 via-purple-900 to-indigo-900 rounded-3xl p-8 shadow-2xl mb-8 text-white flex flex-col md:flex-row justify-between items-center gap-6 border border-purple-500/20">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-purple-500/20 text-purple-400 border border-purple-500/30 px-3 py-1 rounded-full text-xs font-bold">بوابة الإدارة المركزية</span>
              <span className="text-gray-400 text-xs">إصدار النظام: v3.2 Local Pro</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">لوحة تحكم الفنيين والدعم الفني ⚙️</h1>
            <p className="text-gray-300 text-sm mt-1">التحكم الكامل في شؤون الطلاب، المراجعة السريعة، وتصدير التقارير.</p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={loadStudentsData}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-purple-300 border border-purple-500/30 rounded-xl text-sm font-bold transition shadow"
            >
              🔄 تحديث البيانات
            </button>
            <button
              onClick={exportToCSV}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold transition shadow-lg flex items-center gap-2"
            >
              📥 تصدير تقرير Excel
            </button>
            <button
              onClick={() => { localStorage.removeItem('current_user'); navigate('/login'); }}
              className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-bold transition shadow-lg"
            >
              تسجيل الخروج
            </button>
          </div>
        </div>

        {/* إحصائيات سريعة */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 mb-8">
          <div className="bg-gray-800/85 backdrop-blur-md border border-gray-700 rounded-2xl p-6 shadow-xl flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs font-semibold">إجمالي الطلاب المسجلين</p>
              <h3 className="text-3xl font-extrabold text-white mt-1">{totalStudents}</h3>
            </div>
            <div className="w-14 h-14 bg-blue-600/20 text-blue-400 rounded-2xl flex items-center justify-center font-bold text-xl border border-blue-500/30">👥</div>
          </div>

          <div className="bg-gray-800/85 backdrop-blur-md border border-gray-700 rounded-2xl p-6 shadow-xl flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs font-semibold">الطلاب المقبولون</p>
              <h3 className="text-3xl font-extrabold text-green-400 mt-1">{acceptedStudents}</h3>
            </div>
            <div className="w-14 h-14 bg-green-600/20 text-green-400 rounded-2xl flex items-center justify-center font-bold text-xl border border-green-500/30">✓</div>
          </div>

          <div className="bg-gray-800/85 backdrop-blur-md border border-gray-700 rounded-2xl p-6 shadow-xl flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs font-semibold">قيد المراجعة الفنية</p>
              <h3 className="text-3xl font-extrabold text-amber-400 mt-1">{pendingStudents}</h3>
            </div>
            <div className="w-14 h-14 bg-amber-600/20 text-amber-400 rounded-2xl flex items-center justify-center font-bold text-xl border border-amber-500/30">⏳</div>
          </div>

          <div className="bg-gray-800/85 backdrop-blur-md border border-gray-700 rounded-2xl p-6 shadow-xl flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs font-semibold">نسبة القبول العامة</p>
              <h3 className="text-3xl font-extrabold text-purple-400 mt-1">{acceptanceRate}%</h3>
            </div>
            <div className="w-14 h-14 bg-purple-600/20 text-purple-400 rounded-2xl flex items-center justify-center font-bold text-xl border border-purple-500/30">📊</div>
          </div>
        </div>

        {/* أدوات البحث والفلترة */}
        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 shadow-xl mb-8 flex flex-col lg:flex-row gap-4 justify-between items-center">
          <div className="w-full lg:w-1/3">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="🔍 بحث سريع (الاسم، الرقم القومي، أو الواتساب)..."
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="w-full lg:w-1/3 flex items-center gap-2">
            <label className="text-sm text-gray-400 whitespace-nowrap">المرحلة:</label>
            <select
              value={selectedGradeFilter}
              onChange={(e) => setSelectedGradeFilter(e.target.value)}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="الكل">جميع المراحل الدراسية</option>
              <option value="الصف الأول الابتدائي">الصف الأول الابتدائي</option>
              <option value="الصف الثاني الابتدائي">الصف الثاني الابتدائي</option>
              <option value="الصف الثالث الابتدائي">الصف الثالث الابتدائي</option>
              <option value="الصف الرابع الابتدائي">الصف الرابع الابتدائي</option>
              <option value="الصف الخامس الابتدائي">الصف الخامس الابتدائي</option>
              <option value="الصف السادس الابتدائي">الصف السادس الابتدائي</option>
              <option value="الصف الأول الإعدادي">الصف الأول الإعدادي</option>
              <option value="الصف الثاني الإعدادي">الصف الثاني الإعدادي</option>
              <option value="الصف الثالث الإعدادي">الصف الثالث الإعدادي</option>
              <option value="الصف الأول الثانوي">الصف الأول الثانوي</option>
              <option value="الصف الثاني الثانوي">الصف الثاني الثانوي</option>
              <option value="الصف الثالث الثانوي">الصف الثالث الثانوي</option>
            </select>
          </div>

          <div className="w-full lg:w-1/3 flex items-center gap-2">
            <label className="text-sm text-gray-400 whitespace-nowrap">الحالة:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="الكل">جميع الحالات</option>
              <option value="مقبول">مقبول فقط</option>
              <option value="قيد المراجعة">قيد المراجعة فقط</option>
              <option value="مرفوض">مرفوض فقط</option>
            </select>
          </div>
        </div>

        {/* Modal تعديل الطالب */}
        {editingStudent && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 border border-purple-500/30 rounded-3xl p-8 max-w-xl w-full text-white shadow-2xl">
              <h3 className="text-2xl font-extrabold text-purple-400 mb-2">✏️ تعديل بيانات الطالب الاحترافية</h3>
              <p className="text-gray-400 text-xs mb-6">تعديل بيانات الحساب مباشرة من لوحة الدعم الفني</p>
              
              <form onSubmit={handleSaveEdit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">الاسم الكامل</label>
                  <input
                    type="text"
                    value={editingStudent.fullName || ''}
                    onChange={(e) => setEditingStudent({...editingStudent, fullName: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">الرقم القومي (14 رقم)</label>
                    <input
                      type="text"
                      maxLength="14"
                      value={editingStudent.nationalId || ''}
                      onChange={(e) => setEditingStudent({...editingStudent, nationalId: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-sm text-white focus:outline-none"
                      dir="ltr"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">رقم الواتساب</label>
                    <input
                      type="text"
                      value={editingStudent.whatsappNumber || ''}
                      onChange={(e) => setEditingStudent({...editingStudent, whatsappNumber: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-sm text-white focus:outline-none"
                      dir="ltr"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">المرحلة الدراسية</label>
                  <input
                    type="text"
                    value={editingStudent.grade || ''}
                    onChange={(e) => setEditingStudent({...editingStudent, grade: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-sm text-white focus:outline-none"
                    required
                  />
                </div>
                <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-700">
                  <button
                    type="button"
                    onClick={() => setEditingStudent(null)}
                    className="px-5 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-xl text-sm font-bold transition"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-sm transition shadow-lg"
                  >
                    حفظ التعديلات نهائياً
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* جدول الطلاب */}
        <div className="bg-gray-800 border border-gray-700 rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-6 border-b border-gray-700 flex justify-between items-center bg-gray-900/50">
            <h3 className="text-xl font-bold text-purple-400">📋 سجل قيد الطلاب (النتائج المعروضة: {filteredStudents.length})</h3>
            <span className="text-xs text-gray-400">التخزين المحلي (Local Storage)</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead className="bg-gray-900 text-gray-400 uppercase text-xs">
                <tr>
                  <th className="px-6 py-4">اسم الطالب</th>
                  <th className="px-6 py-4">المرحلة الدراسية</th>
                  <th className="px-6 py-4">الرقم القومي</th>
                  <th className="px-6 py-4">واتساب</th>
                  <th className="px-6 py-4">حالة الطلب</th>
                  <th className="px-6 py-4 text-center">أدوات التحكم الشاملة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700 text-gray-300">
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-750 transition">
                      <td className="px-6 py-4 font-bold text-white">{student.fullName}</td>
                      <td className="px-6 py-4">
                        <span className="bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 px-3 py-1 rounded-full text-xs font-medium">
                          {student.grade}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono text-gray-300" dir="ltr">{student.nationalId}</td>
                      <td className="px-6 py-4 font-mono text-green-400" dir="ltr">{student.whatsappNumber}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                          student.status === 'مقبول' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                          student.status === 'مرفوض' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                          'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}>
                          {student.status || 'قيد المراجعة'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center space-x-1.5 space-x-reverse">
                        <button onClick={() => handleUpdateStatus(student.id, 'مقبول')} className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold transition shadow">قبول</button>
                        <button onClick={() => handleUpdateStatus(student.id, 'مرفوض')} className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition shadow">رفض</button>
                        <button onClick={() => setEditingStudent(student)} className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition shadow">تعديل</button>
                        <button onClick={() => handleDeleteStudent(student.id)} className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white rounded-xl text-xs font-bold transition shadow">حذف</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-12 text-gray-400">
                      ⚠️ عذراً، لا توجد نتائج مطابقة لخيارات البحث أو الفلتر المحدد.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // لوحة تحكم الطالب العادي (Student Dashboard)
  return (
    <div className="max-w-4xl mx-auto px-4 py-10" dir="rtl">
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-blue-600 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce">
          <span>📢</span>
          <span className="font-semibold text-sm">{toastMessage}</span>
        </div>
      )}

      <div className="bg-gray-800 border border-gray-700 rounded-3xl p-8 text-white shadow-2xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b border-gray-700 pb-5 gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-blue-400">أهلاً بك يا بطل، {user.fullName} 👋</h1>
            <p className="text-gray-400 text-xs mt-1">بوابة الطالب الشخصية لمتابعة حالة التسجيل والبيانات</p>
          </div>
          <button
            onClick={() => navigate('/edit-profile')}
            className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition shadow-lg flex items-center gap-1.5"
          >
            تعديل بياناتي الشخصية ✏️
          </button>
        </div>
        
        <div className="bg-gray-900/60 p-6 rounded-2xl border border-gray-700 space-y-4">
          <div className="flex justify-between items-center border-b border-gray-800 pb-3">
            <span className="text-gray-400 text-sm">حالة الطلب بالمنصة:</span>
            <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-amber-500/20 text-amber-400 border border-amber-500/30">
              {user.status || 'قيد المراجعة'}
            </span>
          </div>
          <div className="flex justify-between items-center border-b border-gray-800 pb-3">
            <span className="text-gray-400 text-sm">المرحلة الدراسية:</span>
            <span className="font-bold text-white text-sm">{user.grade}</span>
          </div>
          <div className="flex justify-between items-center border-b border-gray-800 pb-3">
            <span className="text-gray-400 text-sm">الرقم القومي:</span>
            <span className="font-mono text-white text-sm" dir="ltr">{user.nationalId}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">رقم الواتساب للمتابعة:</span>
            <span className="font-mono text-green-400 text-sm" dir="ltr">{user.whatsappNumber}</span>
          </div>
        </div>

        <button
          onClick={() => { localStorage.removeItem('current_user'); navigate('/login'); }}
          className="mt-6 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-bold transition shadow-lg"
        >
          تسجيل الخروج
        </button>
      </div>
    </div>
  );
}