import { useState, useRef, useEffect } from 'react';

export default function LiveChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'support', text: 'أهلاً بك يا هندسه في منصتنا! 🚀 كيف يمكنني مساعدتك اليوم؟' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const getSmartReply = (userText) => {
    const text = userText.toLowerCase();
    if (text.includes('ازيك') || text.includes('إزيك') || text.includes('سلام عليكم')) {
      return 'الحمد لله يا غالي، أنا شغال تمام وبخير! إيه اللي مشغل بالك وعايز نظبطه في المنصة؟ 😊';
    } else if (text.includes('عامل ايه') || text.includes('اخبارك')) {
      return 'كله تمام والمنصة حديد بفضل الله.. أنت اخبارك إيه؟';
    } else {
      return `يا هلا بيك! وصلتنا رسالتك: "${userText}"، وفريق الدعم هيتابع معاك فوراً.`;
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userText = inputMessage;
    setMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setInputMessage('');

    setTimeout(() => {
      const botReply = getSmartReply(userText);
      setMessages((prev) => [...prev, { sender: 'support', text: botReply }]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 left-6 z-50" dir="rtl">
      {isOpen && (
        <div className="mb-4 w-80 sm:w-96 bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-white">
          <div className="bg-blue-600 px-4 py-3 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>
              <h3 className="font-bold text-sm">الدعم الفني المباشر 💬</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white font-bold text-lg px-2">×</button>
          </div>

          <div className="p-4 h-72 overflow-y-auto space-y-3 bg-gray-900/50 text-sm">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[80%] px-4 py-2 rounded-xl leading-relaxed ${msg.sender === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-700 text-gray-200 rounded-bl-none'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="p-3 bg-gray-800 border-t border-gray-700 flex gap-2">
            <input type="text" value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} placeholder="اكتب رسالتك هنا..." className="grow px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none" />
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 px-4 py-2 text-white text-sm font-semibold rounded-lg">إرسال</button>
          </form>
        </div>
      )}

      <button onClick={() => setIsOpen(!isOpen)} className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-2xl flex items-center justify-center transition-transform hover:scale-110 relative">
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 border-2 border-gray-900 rounded-full"></span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      </button>
    </div>
  );
}