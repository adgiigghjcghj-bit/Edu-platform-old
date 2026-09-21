import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-[80vh] flex flex-col justify-between items-center px-4 py-12 text-white" dir="rtl">
      {/* القسم الرئيسي (Hero Section) */}
      <div className="max-w-4xl mx-auto text-center space-y-6 my-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-2">
          <span>✨ المنصة التعليمية الأذكى لإدارة الشؤون الطلابية</span>
        </div>
        
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight">
          أهلاً بك في <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-purple-500">منصتنا الذكية 🚀</span>
        </h1>
        
        <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          منصة احترافية متكاملة تتيح لك إدارة بيانات الطلاب، المتابعة اللحظية، وتسهيل التواصل بكل سهولة باستخدام الرقم القومي أو رقم التليفون الخاص بك.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
          <Link
            to="/register"
            className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition duration-200 shadow-lg text-base text-center"
          >
            إنشاء حساب جديد 🚀
          </Link>
          <Link
            to="/login"
            className="w-full sm:w-auto px-8 py-3.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white font-bold rounded-xl transition duration-200 text-base text-center"
          >
            تسجيل الدخول للنظام 🔑
          </Link>
        </div>
      </div>

      {/* قسم مميزات المنصة الاحترافية (Features Cards) */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 w-full">
        <div className="bg-gray-800/60 backdrop-blur-md border border-gray-700/80 p-6 rounded-2xl shadow-xl hover:border-blue-500/50 transition">
          <div className="w-12 h-12 bg-blue-600/20 text-blue-400 rounded-xl flex items-center justify-center font-bold text-xl mb-4 border border-blue-500/30">📊</div>
          <h3 className="text-lg font-bold text-white mb-2">إدارة شاملة للطلاب</h3>
          <p className="text-gray-400 text-sm leading-relaxed">تسجيل دقيق بالرقم القومي (14 رقم)، المراحل الدراسية، وأرقام أولياء الأمور بسهولة تامة.</p>
        </div>

        <div className="bg-gray-800/60 backdrop-blur-md border border-gray-700/80 p-6 rounded-2xl shadow-xl hover:border-purple-500/50 transition">
          <div className="w-12 h-12 bg-purple-600/20 text-purple-400 rounded-xl flex items-center justify-center font-bold text-xl mb-4 border border-purple-500/30">🛠️</div>
          <h3 className="text-lg font-bold text-white mb-2">لوحة تحكم الفنيين</h3>
          <p className="text-gray-400 text-sm leading-relaxed">تحكم كامل، قبول أو رفض الطلبات، تعديل البيانات، وتصدير تقارير Excel بضغطة زر واحدة.</p>
        </div>

        <div className="bg-gray-800/60 backdrop-blur-md border border-gray-700/80 p-6 rounded-2xl shadow-xl hover:border-emerald-500/50 transition">
          <div className="w-12 h-12 bg-emerald-600/20 text-emerald-400 rounded-xl flex items-center justify-center font-bold text-xl mb-4 border border-emerald-500/30">💬</div>
          <h3 className="text-lg font-bold text-white mb-2">دعم فني وتواصل ذكي</h3>
          <p className="text-gray-400 text-sm leading-relaxed">شات تفاعلي عائم لمساعدة الطلاب والرد على استفساراتهم طوال الوقت بكفاءة عالية.</p>
        </div>
      </div>
    </div>
  );
}