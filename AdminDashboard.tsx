
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_MEDIA } from '../constants';
import { MediaItem } from '../types';

interface InteractionStats {
  total_watch: number;
  total_download: number;
  media_stats: Record<string, any>;
}

const AdminDashboard: React.FC = () => {
  const [realTimeStats, setRealTimeStats] = useState<InteractionStats>({
    total_watch: 0,
    total_download: 0,
    media_stats: {}
  });
  const [activeTab, setActiveTab] = useState<'stats' | 'content' | 'users' | 'publish'>('stats');
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [isBotShieldActive, setIsBotShieldActive] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<MediaItem | null>(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    posterUrl: '',
    backdropUrl: '',
    category: 'أكشن',
    year: 2024,
    description: '',
    type: 'movie' as 'movie' | 'series'
  });

  useEffect(() => {
    const userStr = localStorage.getItem('bgbest_user');
    if (!userStr || JSON.parse(userStr).role !== 'admin') {
      navigate('/login');
      return;
    }

    const savedStats = localStorage.getItem('bgbest_interaction_stats');
    if (savedStats) setRealTimeStats(JSON.parse(savedStats));

    const savedMedia = localStorage.getItem('bgbest_custom_media');
    if (savedMedia) setMediaList(JSON.parse(savedMedia));
    else setMediaList(MOCK_MEDIA);

    const dbUsers = JSON.parse(localStorage.getItem('bgbest_users_db') || '[]');
    setUsersList(dbUsers);

    // تحميل حالة حماية الروبوتات
    const botShield = localStorage.getItem('bgbest_bot_shield') === 'true';
    setIsBotShieldActive(botShield);
  }, [navigate]);

  const toggleBotShield = () => {
    const newState = !isBotShieldActive;
    setIsBotShieldActive(newState);
    localStorage.setItem('bgbest_bot_shield', newState.toString());
    alert(newState ? 'تم تفعيل درع الحماية بنجاح! سيطلب الموقع كود تحقق من الزوار الآن 🛡️' : 'تم إيقاف درع الحماية. الدخول متاح للجميع الآن 🔓');
  };

  const handleSaveMedia = (e: React.FormEvent) => {
    e.preventDefault();
    let newList = editItem 
      ? mediaList.map(m => m.id === editItem.id ? { ...m, ...formData } : m)
      : [{ ...formData, id: 'custom_' + Date.now(), rating: 8.5, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }, ...mediaList];
    
    setMediaList(newList);
    localStorage.setItem('bgbest_custom_media', JSON.stringify(newList));
    window.dispatchEvent(new Event('storage'));
    setShowModal(false);
  };

  const handleBlockUser = (id: string) => {
    const dbUsers = JSON.parse(localStorage.getItem('bgbest_users_db') || '[]');
    const updatedUsers = dbUsers.map((u: any) => {
      if (u.id === id && u.role !== 'admin') {
        return { ...u, status: u.status === 'active' ? 'blocked' : 'active' };
      }
      return u;
    });
    localStorage.setItem('bgbest_users_db', JSON.stringify(updatedUsers));
    setUsersList(updatedUsers);
  };

  return (
    <div className="pt-24 pb-20 px-4 md:px-8 bg-[#050505] min-h-screen text-right" dir="rtl">
      <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
        <aside className="lg:w-72 space-y-4 flex-shrink-0">
          <div className="p-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-[2.5rem] shadow-2xl mb-8 relative overflow-hidden">
            <h2 className="text-2xl font-black text-white relative z-10">مدير Bgbest</h2>
            <p className="text-blue-100 text-xs mt-1 font-bold relative z-10">نظام الحماية والتحكم</p>
          </div>
          <nav className="grid grid-cols-2 lg:grid-cols-1 gap-3">
            <NavBtn active={activeTab === 'stats'} onClick={() => setActiveTab('stats')} icon="📊" label="الإحصائيات" />
            <NavBtn active={activeTab === 'content'} onClick={() => setActiveTab('content')} icon="🎞️" label="المكتبة" />
            <NavBtn active={activeTab === 'users'} onClick={() => setActiveTab('users')} icon="👥" label="الأعضاء" />
            <NavBtn active={activeTab === 'publish'} onClick={() => setActiveTab('publish')} icon="🚀" label="النشر" />
          </nav>
        </aside>

        <main className="flex-1">
          {activeTab === 'stats' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="المشاهدات" value={realTimeStats.total_watch} color="blue" icon="👁️" />
                <StatCard title="التحميلات" value={realTimeStats.total_download} color="green" icon="📥" />
                <StatCard title="الأعضاء" value={usersList.length} color="purple" icon="👥" />
              </div>

              {/* نظام التحكم في الروبوتات - بديل للقسم القديم */}
              <section className="bg-gradient-to-br from-red-600/10 to-transparent border border-white/10 rounded-[2.5rem] p-10 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent"></div>
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="text-center md:text-right">
                    <div className="inline-flex items-center gap-2 bg-red-600/20 text-red-500 px-4 py-1 rounded-full text-[10px] font-black mb-4 border border-red-500/20">
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping"></span>
                      مركز أمان الموقع
                    </div>
                    <h3 className="text-3xl font-black text-white mb-3">حماية درع البوت (Anti-Bot)</h3>
                    <p className="text-gray-400 font-bold max-w-md leading-relaxed">
                      عند تفعيل هذا الخيار، سيقوم الموقع بطلب كود تحقق (CAPTCHA) من أي شخص يحاول تسجيل الدخول لمنع الهجمات الوهمية والسكريبتات.
                    </p>
                  </div>
                  
                  <div className="flex flex-col items-center gap-4">
                    <button 
                      onClick={toggleBotShield}
                      className={`w-24 h-12 rounded-full transition-all relative flex items-center px-2 ${isBotShieldActive ? 'bg-red-600 shadow-[0_0_30px_rgba(220,38,38,0.4)]' : 'bg-gray-800'}`}
                    >
                      <div className={`w-8 h-8 bg-white rounded-full transition-all shadow-xl flex items-center justify-center font-bold text-[10px] text-black ${isBotShieldActive ? 'translate-x-12' : 'translate-x-0'}`}>
                        {isBotShieldActive ? 'ON' : 'OFF'}
                      </div>
                    </button>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${isBotShieldActive ? 'text-red-500' : 'text-gray-500'}`}>
                      {isBotShieldActive ? 'الحماية مفعلة حالياً' : 'الحماية متوقفة'}
                    </span>
                  </div>
                </div>
              </section>
            </div>
          )}

          {activeTab === 'users' && (
             <div className="space-y-6">
               <h1 className="text-3xl font-black text-white">إدارة الأعضاء الحقيقيين</h1>
               <div className="bg-white/5 border border-white/10 rounded-[2rem] overflow-hidden">
                 <table className="w-full text-right">
                    <thead className="bg-white/5 text-[10px] font-black text-gray-500">
                      <tr><th className="p-5">الاسم</th><th className="p-5">البريد</th><th className="p-5">الحالة</th><th className="p-5">إجراء</th></tr>
                    </thead>
                    <tbody>
                      {usersList.map(user => (
                        <tr key={user.id} className="border-b border-white/5">
                          <td className="p-5 text-white font-bold">{user.name}</td>
                          <td className="p-5 text-gray-400 font-bold text-sm">{user.email}</td>
                          <td className={`p-5 font-black text-[10px] ${user.status === 'active' ? 'text-green-500' : 'text-red-500'}`}>{user.status === 'active' ? 'نشط' : 'محظور'}</td>
                          <td className="p-5">
                            {user.role !== 'admin' && (
                              <button onClick={() => handleBlockUser(user.id)} className="px-4 py-2 bg-white/5 rounded-lg text-[10px] font-black hover:bg-red-600 hover:text-white transition-all">
                                {user.status === 'active' ? 'حظر' : 'تفعيل'}
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                 </table>
               </div>
             </div>
          )}

          {/* ... بقية التبويبات (Content, Publish) تعمل كالسابق ... */}
          {activeTab === 'content' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h1 className="text-3xl font-black text-white">المكتبة السينمائية</h1>
                <button onClick={() => { setEditItem(null); setShowModal(true); }} className="bg-blue-600 hover:bg-blue-500 text-white font-black px-8 py-4 rounded-2xl">إضافة عمل</button>
              </div>
              <div className="grid gap-4">
                {mediaList.map(media => (
                  <div key={media.id} className="bg-white/5 border border-white/10 p-4 rounded-3xl flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <img src={media.posterUrl} className="w-16 h-20 rounded-xl object-cover" alt="" />
                      <div><h4 className="font-black text-white">{media.title}</h4><p className="text-xs text-gray-500 font-bold">{media.category}</p></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4">
          <form onSubmit={handleSaveMedia} className="bg-[#111] w-full max-w-2xl rounded-[2.5rem] p-10 space-y-6">
             <h2 className="text-2xl font-black text-white">إضافة / تعديل عمل</h2>
             <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} type="text" className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white font-bold" placeholder="العنوان" />
             <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white font-bold h-24" placeholder="الوصف"></textarea>
             <button type="submit" className="w-full bg-blue-600 text-white font-black py-5 rounded-2xl">حفظ</button>
             <button type="button" onClick={() => setShowModal(false)} className="w-full text-gray-500 font-bold">إلغاء</button>
          </form>
        </div>
      )}
    </div>
  );
};

const NavBtn = ({ active, onClick, icon, label }: any) => (
  <button onClick={onClick} className={`w-full text-right px-6 py-4 rounded-2xl font-black transition-all flex items-center gap-3 border ${active ? 'bg-blue-600 border-blue-500 text-white' : 'bg-white/5 border-transparent text-gray-500'}`}>
    <span className="text-xl">{icon}</span><span className="text-sm">{label}</span>
  </button>
);

const StatCard = ({ title, value, color, icon }: any) => (
  <div className="p-8 bg-white/5 border border-white/10 rounded-[2rem] text-center">
    <div className="text-4xl mb-4">{icon}</div>
    <p className="text-[10px] text-gray-500 font-black mb-1 uppercase">{title}</p>
    <p className={`text-4xl font-black text-${color}-500`}>{value.toLocaleString()}</p>
  </div>
);

export default AdminDashboard;
