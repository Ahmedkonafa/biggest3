
import React, { useState } from 'react';

const Contact: React.FC = () => {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="pt-32 pb-20 px-4">
      <div className="max-w-3xl mx-auto bg-white/5 border border-white/10 p-8 rounded-2xl shadow-2xl">
        <h1 className="text-3xl font-black mb-2 text-center">تواصل مع الإدارة</h1>
        <p className="text-gray-400 text-center mb-8">نحن هنا للإجابة على استفساراتك واقتراحاتك</p>

        {sent ? (
          <div className="bg-green-600/20 border border-green-600 text-green-400 p-6 rounded-xl text-center">
            <p className="font-bold text-lg">تم إرسال رسالتك بنجاح!</p>
            <p className="text-sm mt-2">سنقوم بالرد عليك في أقرب وقت ممكن.</p>
            <button onClick={() => setSent(false)} className="mt-4 text-white underline text-sm">إرسال رسالة أخرى</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-300">الاسم الكامل</label>
                <input required type="text" className="w-full bg-black border border-white/20 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors" placeholder="أدخل اسمك" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-300">البريد الإلكتروني</label>
                <input required type="email" className="w-full bg-black border border-white/20 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors" placeholder="email@example.com" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-300">الموضوع</label>
              <input required type="text" className="w-full bg-black border border-white/20 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors" placeholder="عن ماذا تريد التحدث؟" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-300">الرسالة</label>
              <textarea required rows={5} className="w-full bg-black border border-white/20 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors" placeholder="اكتب استفسارك هنا..."></textarea>
            </div>
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-lg transition-all text-lg shadow-lg">إرسال الرسالة</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Contact;
