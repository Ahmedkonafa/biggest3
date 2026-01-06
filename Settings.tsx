
import React, { useState, useEffect } from 'react';

const Settings: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [quality, setQuality] = useState('1080p');
  const [autoPlay, setAutoPlay] = useState(true);
  const [statusMsg, setStatusMsg] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // تحميل بيانات المستخدم
    const savedUser = localStorage.getItem('bgbest_user');
    if (savedUser) setUser(JSON.parse(savedUser));

    // تحميل الإعدادات المحفوظة فعلياً
    const savedSettings = localStorage.getItem('bgbest_app_settings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setQuality(settings.quality || '1080p');
      setAutoPlay(settings.autoPlay !== undefined ? settings.autoPlay : true);
    }
  }, []);

  const clearStats = () => {
    if (window.confirm('هل أنت متأكد من مسح سجل المشاهدات والتفاعل؟ سيؤدي هذا لتصفير إحصائيات الأدمن أيضاً.')) {
      localStorage.removeItem('bgbest_interaction_stats');
      setStatusMsg('تم مسح السجل وتصفير الإحصائيات بنجاح ✅');
      setTimeout(() => setStatusMsg(''), 3000);
    }
  };

  const handleSave = () => {
    setIsSaving(true);
    
    // إنشاء كائن الإعدادات الجديد
    const newSettings = {
      quality,
      autoPlay,
      lastUpdated: new Date().toISOString()
    };

    // حفظ في التخزين المحلي بشكل حقيقي
    localStorage.setItem('bgbest_app_settings', JSON.stringify(newSettings));
    
    // محاكاة وقت المعالجة لإعطاء شعور بالاحترافية
    setTimeout(() => {
      setIsSaving(false);
      setStatusMsg('تم حفظ كافة التفضيلات بنجاح! سيتم تطبيقها في زيارتك القادمة ✅');
      setTimeout(() => setStatusMsg(''), 4000);
    }, 800);
  };

  if (!user) return (
    <div className="pt-40 text-center text-gray-500 font-bold">جاري تحميل إعدادات حسابك...</div>
  );

  return (
    <div className="pt-28 pb-20 px-4 max-w-4xl mx-auto text-right" dir="rtl">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-white">إعدادات الحساب</h1>
          <p className="text-gray-500 mt-2 font-bold">تخصيص تجربتك السينمائية في Bgbest</p>
        </div>
        <div className="text-[10px] font-black text-gray-700 bg-white/5 px-3 py-1 rounded-full border border-white/5 uppercase">
          Version 2.4.0-Stable
        </div>
      </header>

      {statusMsg && (
        <div className="mb-6 p-5 bg-blue-600/10 border border-blue-500/30 text-blue-400 rounded-[1.5rem] font-black animate-in fade-in slide-in-from-top-4 duration-500 shadow-xl shadow-blue-900/10">
          <div className="flex items-center gap-3">
             <span className="text-xl">✨</span>
             {statusMsg}
          </div>
        </div>
      )}

      <div className="grid gap-8">
        {/* User Info */}
        <section className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-2xl">
          <h2 className="text-xl font-black text-white mb-8 flex items-center gap-3">
            <span className="w-2 h-6 bg-blue-500 rounded-full"></span>
            معلومات الهوية
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase mr-1 tracking-widest">اسم المستخدم</label>
              <div className="bg-black/40 border border-white/5 p-5 rounded-2xl text-white font-bold text-lg">{user.name}</div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase mr-1 tracking-widest">البريد الإلكتروني الموثق</label>
              <div className="bg-black/40 border border-white/5 p-5 rounded-2xl text-white font-bold text-lg">{user.email}</div>
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-[10px] font-black text-gray-500 uppercase mr-1 tracking-widest">رتبة العضوية</label>
              <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/10 border border-blue-500/20 p-5 rounded-2xl flex items-center justify-between">
                <span className="text-blue-400 font-black text-xl">
                  {user.role === 'admin' ? 'المدير العام (Administrator)' : 'عضوية Bgbest المتميزة'}
                </span>
                <span className="text-[10px] font-black bg-blue-600 text-white px-3 py-1 rounded-lg">ACTIVE</span>
              </div>
            </div>
          </div>
        </section>

        {/* Video Settings */}
        <section className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-2xl">
          <h2 className="text-xl font-black text-white mb-8 flex items-center gap-3">
            <span className="w-2 h-6 bg-green-500 rounded-full"></span>
            تفضيلات المشاهدة
          </h2>
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 bg-black/40 rounded-3xl border border-white/5 group hover:border-green-500/30 transition-all">
              <div className="mb-4 sm:mb-0">
                <p className="font-black text-white text-lg">الجودة الافتراضية</p>
                <p className="text-xs text-gray-500 font-bold mt-1">سيتم تحميل السيرفرات التي تدعم هذه الجودة أولاً</p>
              </div>
              <select 
                value={quality} 
                onChange={(e) => setQuality(e.target.value)}
                className="w-full sm:w-auto bg-[#111] border border-white/10 text-white rounded-xl px-6 py-3 font-black focus:outline-none focus:border-green-500 transition-all cursor-pointer"
              >
                <option value="1080p">1080p Full HD</option>
                <option value="720p">720p HD</option>
                <option value="480p">480p SD</option>
              </select>
            </div>

            <div className="flex items-center justify-between p-6 bg-black/40 rounded-3xl border border-white/5 group hover:border-blue-500/30 transition-all">
              <div>
                <p className="font-black text-white text-lg">التشغيل التلقائي (Auto-play)</p>
                <p className="text-xs text-gray-500 font-bold mt-1">بدء تشغيل الفيديو فوراً بمجرد دخول صفحة العرض</p>
              </div>
              <button 
                onClick={() => setAutoPlay(!autoPlay)}
                className={`w-16 h-8 rounded-full transition-all relative shadow-inner ${autoPlay ? 'bg-blue-600' : 'bg-gray-800'}`}
              >
                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all shadow-lg ${autoPlay ? 'left-1' : 'left-9'}`}></div>
              </button>
            </div>
          </div>
        </section>

        {/* Data & Privacy */}
        <section className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-2xl">
          <h2 className="text-xl font-black text-white mb-8 flex items-center gap-3">
            <span className="w-2 h-6 bg-red-500 rounded-full"></span>
            الخصوصية والبيانات الضخمة
          </h2>
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 p-8 bg-red-500/5 rounded-3xl border border-red-500/20">
             <div className="text-center lg:text-right">
                <p className="font-black text-red-500 text-lg">تصفير سجل النشاط المحلي</p>
                <p className="text-xs text-gray-500 font-bold mt-1">حذف كافة بيانات المشاهدة والتحميلات المسجلة على هذا الجهاز</p>
             </div>
             <button 
              onClick={clearStats}
              className="bg-red-600 hover:bg-red-700 text-white font-black px-10 py-4 rounded-2xl transition-all shadow-xl shadow-red-600/20 active:scale-95 whitespace-nowrap"
             >
               حذف السجل الآن
             </button>
          </div>
        </section>

        <div className="pt-10">
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className={`w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-6 rounded-[2rem] transition-all shadow-2xl shadow-blue-600/40 text-xl flex items-center justify-center gap-3 transform active:scale-[0.98] ${isSaving ? 'opacity-70 cursor-wait' : ''}`}
          >
            {isSaving ? (
              <>
                <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                جاري الحفظ...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                اعتماد وحفظ التغييرات
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
