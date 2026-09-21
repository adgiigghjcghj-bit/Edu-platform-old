export default function Footer() {
  const whatsappNumber = "201098435957"; 
  const whatsappMessage = "مرحباً، أريد الاستفسار عن خدمات المنصة الذكية";
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <footer className="w-full max-w-6xl mx-auto border-t border-gray-800 py-8 px-4 text-center sm:text-right flex flex-col sm:flex-row justify-between items-center gap-6 text-gray-400 text-sm mt-auto" dir="rtl">
      {/* معلومات الحقوق والمطور */}
      <div className="space-y-1">
        <p className="font-semibold text-gray-300">منصتنا الذكية لإدارة الشؤون الطلابية</p>
        <p className="text-xs text-gray-500">تم التطوير والإدارة بواسطة Eng. Abdulrahman Sherif © {new Date().getFullYear()} 🚀</p>
      </div>

      {/* روابط وسوشيال ميديا بالأيقونات والصور الحقيقية من public */}
      <div className="flex flex-wrap justify-center items-center gap-3">
        {/* فيسبوك */}
        <a 
          href="https://facebook.com" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="px-3 py-1.5 bg-gray-800/80 hover:bg-gray-700 rounded-lg border border-gray-700 transition flex items-center gap-2 text-xs text-white"
        >
          <img src="/facebook.png" alt="Facebook" className="w-4 h-4 object-contain" />
          <span>فيسبوك</span>
        </a>

        {/* إنستجرام */}
        <a 
          href="https://instagram.com" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="px-3 py-1.5 bg-gray-800/80 hover:bg-gray-700 rounded-lg border border-gray-700 transition flex items-center gap-2 text-xs text-white"
        >
          <img src="/instagram.png" alt="Instagram" className="w-4 h-4 object-contain" />
          <span>إنستجرام</span>
        </a>

        {/* يوتيوب */}
        <a 
          href="https://youtube.com" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="px-3 py-1.5 bg-gray-800/80 hover:bg-gray-700 rounded-lg border border-gray-700 transition flex items-center gap-2 text-xs text-white"
        >
          <img src="/youtube.png" alt="YouTube" className="w-4 h-4 object-contain" />
          <span>يوتيوب</span>
        </a>

        {/* الواتساب (بالصورة والرابط الديناميكي) */}
        <a 
          href={whatsappLink} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="px-3 py-1.5 bg-gray-800/80 hover:bg-gray-700 rounded-lg border border-gray-700 transition flex items-center gap-2 text-xs text-white"
          dir="ltr"
        >
          <img src="/whatsapp.png" alt="WhatsApp" className="w-4 h-4 object-contain" />
          <span className="text-emerald-400 font-bold">+20 109 843 5957</span>
        </a>

        {/* البريد الإلكتروني (Gmail بالصورة) */}
        <a 
          href="mailto:your-email@gmail.com" 
          className="px-3 py-1.5 bg-gray-800/80 hover:bg-gray-700 rounded-lg border border-gray-700 transition flex items-center gap-2 text-xs text-white"
        >
          <img src="/gmail.png" alt="Gmail" className="w-4 h-4 object-contain" />
          <span>البريد</span>
        </a>
      </div>
    </footer>
  );
}