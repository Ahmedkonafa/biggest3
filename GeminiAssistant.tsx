
import React, { useState, useRef, useEffect } from 'react';
import { chatWithGemini, analyzeImage, generateSpeech, decodeBase64, decodeAudioData } from '../services/geminiService';

const GeminiAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'model', text: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() && !imagePreview) return;

    if (!process.env.API_KEY || process.env.API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
      setMessages(prev => [...prev, { 
        role: 'model', 
        text: "❌ مفتاح الـ API غير مضبوط!" 
      }]);
      return;
    }

    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg || "تحليل صورة" }]);
    setInput('');
    setIsLoading(true);

    try {
      let responseText = '';
      if (imagePreview) {
        const base64 = imagePreview.split(',')[1];
        responseText = await analyzeImage(base64, userMsg);
        setImagePreview(null);
      } else {
        responseText = await chatWithGemini(userMsg);
      }
      setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    } catch (error: any) {
      setMessages(prev => [...prev, { role: 'model', text: "عذراً، حدث خطأ في الاتصال." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const playTTS = async (text: string) => {
    try {
      const base64Audio = await generateSpeech(text.substring(0, 200));
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const audioData = decodeBase64(base64Audio);
      const buffer = await decodeAudioData(audioData, audioCtx);
      const source = audioCtx.createBufferSource();
      source.buffer = buffer;
      source.connect(audioCtx.destination);
      source.start();
    } catch (error) {
      console.error("TTS Error:", error);
    }
  };

  return (
    <div className="fixed bottom-24 md:bottom-6 left-6 z-[60]">
      {isOpen ? (
        <div className="fixed inset-x-4 bottom-24 md:relative md:inset-auto md:w-96 bg-[#0f1115] border border-white/10 rounded-[2rem] shadow-2xl flex flex-col h-[500px] md:h-[550px] overflow-hidden animate-in zoom-in duration-300">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <h3 className="font-black text-white text-sm">مساعد Bgbest</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white bg-white/10 p-1 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4 bg-[#0a0a0a]">
            {messages.length === 0 && (
              <div className="text-center py-10">
                <div className="text-4xl mb-4">🎬</div>
                <p className="text-gray-400 text-xs font-bold leading-relaxed px-6">
                  أهلاً! اسألني عن أي مسلسل أو ارفع صورة بوستر لأعرفك عليه.
                </p>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[90%] p-4 rounded-2xl text-[11px] font-bold relative group whitespace-pre-wrap shadow-lg ${
                  m.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white/5 text-gray-200 rounded-tl-none border border-white/10'
                }`}>
                  {m.text}
                  {m.role === 'model' && (
                    <button onClick={() => playTTS(m.text)} className="absolute -left-8 top-2 opacity-0 group-hover:opacity-100 transition-opacity bg-blue-600/20 p-2 rounded-full text-blue-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
                    </button>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-end">
                <div className="bg-white/5 p-3 rounded-2xl flex gap-1.5">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-[#0a0a0a] border-t border-white/5 space-y-3">
            <div className="flex items-center gap-2">
              <button onClick={() => fileInputRef.current?.click()} className="p-3 text-gray-400 hover:text-blue-500 bg-white/5 rounded-2xl">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </button>
              <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
              <input
                type="text"
                placeholder="اسألني..."
                className="flex-1 bg-white/5 border border-white/10 text-white rounded-2xl px-4 py-3 text-xs font-bold focus:outline-none focus:border-blue-500"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              />
              <button onClick={handleSend} disabled={isLoading} className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-600/20 active:scale-90">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white transform rotate-180" viewBox="0 0 20 20" fill="currentColor"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 w-14 h-14 md:w-16 md:h-16 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all border-4 border-[#0a0a0a]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 md:h-8 md:w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
        </button>
      )}
    </div>
  );
};

export default GeminiAssistant;
