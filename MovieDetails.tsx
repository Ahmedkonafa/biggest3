
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MOCK_MEDIA } from '../constants';
import { MediaItem } from '../types';

const MovieDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [showPlayer, setShowPlayer] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [shareText, setShareText] = useState('مشاركة');
  const [media, setMedia] = useState<MediaItem | null>(null);
  const [settings, setSettings] = useState({ quality: '1080p', autoPlay: true });
  
  useEffect(() => {
    // تحميل الميديا
    const savedMedia = localStorage.getItem('bgbest_custom_media');
    const allMedia: MediaItem[] = savedMedia ? JSON.parse(savedMedia) : MOCK_MEDIA;
    const found = allMedia.find(m => m.id === id);
    setMedia(found || null);

    // تحميل الإعدادات الحقيقية
    const savedSettings = localStorage.getItem('bgbest_app_settings');
    if (savedSettings) {
      const parsedSettings = JSON.parse(savedSettings);
      setSettings(parsedSettings);
      
      // تفعيل التشغيل التلقائي إذا كان الخيار مفعلاً
      if (parsedSettings.autoPlay && found) {
        // تأخير بسيط لإعطاء فرصة للصفحة للتحميل
        setTimeout(() => setShowPlayer(true), 1000);
      }
    }

    window.scrollTo(0, 0);
  }, [id]);

  if (!media) return (
    <div className="pt-40 text-center space-y-4">
      <div className="text-6xl animate-bounce">🔍</div>
      <h2 className="text-2xl font-black text-white">عذراً، هذا العمل غير متوفر حالياً.</h2>
      <button onClick={() => window.history.back()} className="text-blue-500 font-bold hover:underline">العودة للرئيسية</button>
    </div>
  );

  const trackInteraction = (type: 'watch' | 'download') => {
    const statsKey = 'bgbest_interaction_stats';
    const currentStats = JSON.parse(localStorage.getItem(statsKey) || '{"total_watch": 0, "total_download": 0, "media_stats": {}}');
    
    if (type === 'watch') currentStats.total_watch += 1;
    if (type === 'download') currentStats.total_download += 1;
    
    if (!currentStats.media_stats[media.id]) {
      currentStats.media_stats[media.id] = { title: media.title, watch: 0, download: 0 };
    }
    currentStats.media_stats[media.id][type] += 1;
    
    localStorage.setItem(statsKey, JSON.stringify(currentStats));
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: media.title, url: window.location.href });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setShareText('تم نسخ الرابط! ✅');
        setTimeout(() => setShareText('مشاركة'), 2000);
      }
    } catch (err) { console.error(err); }
  };

  const handleDownloadClick = (url: string) => {
    trackInteraction('download');
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen pb-20 bg-[#0a0a0a] text-right" dir="rtl">
      {/* Backdrop */}
      <div className="relative h-[65vh] w-full">
        <img src={media.backdropUrl || media.posterUrl} className="w-full h-full object-cover" alt="" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/70 to-transparent"></div>
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-56 relative z-10">
        <div className="flex flex-col md:flex-row gap-12">
          {/* Poster */}
          <div className="w-80 flex-shrink-0 mx-auto md:mx-0">
            <div className="shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-[2.5rem] overflow-hidden border border-white/10 group relative transform hover:rotate-1 transition-transform duration-500">
              <img src={media.posterUrl} alt={media.title} className="w-full aspect-[2/3] object-cover" />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 pt-12 md:pt-56">
            <div className="flex flex-wrap items-center gap-4 mb-8">
              <span className="bg-blue-600 px-5 py-2 rounded-full text-xs font-black shadow-2xl">{media.category}</span>
              <span className="text-gray-300 font-bold bg-white/5 px-4 py-2 rounded-full border border-white/10">{media.year}</span>
              <span className="flex items-center gap-2 text-yellow-500 font-black bg-yellow-500/10 px-4 py-2 rounded-full border border-yellow-500/20">★ {media.rating}</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight text-white drop-shadow-2xl">{media.title}</h1>
            <p className="text-gray-400 leading-relaxed text-xl mb-12 max-w-4xl bg-white/5 backdrop-blur-md p-8 rounded-[2rem] border-r-8 border-blue-600 shadow-xl font-bold">
              {media.description}
            </p>
            
            <div className="flex flex-wrap gap-6">
              <button 
                onClick={() => { setShowPlayer(true); setIsVideoLoading(true); trackInteraction('watch'); }} 
                className="bg-blue-600 hover:bg-blue-700 text-white font-black px-14 py-5 rounded-[1.5rem] flex items-center gap-4 transition-all transform hover:scale-105 shadow-[0_15px_40px_rgba(37,99,235,0.4)] text-lg"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                مشاهدة فورية
              </button>
              <button 
                onClick={() => document.getElementById('download-section')?.scrollIntoView({ behavior: 'smooth' })} 
                className="bg-green-600 hover:bg-green-500 text-white font-black px-12 py-5 rounded-[1.5rem] shadow-[0_15px_40px_rgba(22,163,74,0.3)] transition-all text-lg flex items-center gap-3 transform hover:scale-105"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                تحميل مباشر
              </button>
              <button 
                onClick={handleShare} 
                className="bg-white/5 hover:bg-white/10 text-white border border-white/20 font-black px-10 py-5 rounded-[1.5rem] flex items-center gap-3 transition-all text-lg"
              >
                {shareText}
              </button>
            </div>
          </div>
        </div>

        {/* Video Player Overlay */}
        {showPlayer && (
          <div className="fixed inset-0 z-[100] bg-black/98 flex items-center justify-center p-4 backdrop-blur-xl animate-in fade-in duration-300">
            <button 
              onClick={() => setShowPlayer(false)} 
              className="absolute top-8 left-8 text-white/50 hover:text-white transition-all z-[110] bg-white/5 p-3 rounded-full hover:bg-red-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            
            <div className="relative w-full max-w-6xl aspect-video bg-black rounded-[3rem] overflow-hidden shadow-[0_0_150px_rgba(37,99,235,0.3)] border border-white/10">
              {isVideoLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-blue-500 bg-[#050505]">
                   <div className="w-20 h-20 border-8 border-blue-600 border-t-transparent rounded-full animate-spin mb-6"></div>
                   <p className="text-2xl font-black animate-pulse">جاري تشغيل سيرفر Bgbest السريع...</p>
                </div>
              )}
              <iframe 
                src={`${media.videoUrl}${media.videoUrl?.includes('?') ? '&' : '?'}autoplay=${settings.autoPlay ? 1 : 0}`} 
                className="w-full h-full" 
                allowFullScreen 
                onLoad={() => setIsVideoLoading(false)}
                title={media.title}
              ></iframe>
            </div>
          </div>
        )}

        {/* Download Section */}
        <div id="download-section" className="mt-40">
          <div className="flex items-center justify-between mb-16">
             <h2 className="text-5xl font-black border-r-8 border-green-600 pr-8">سيرفرات التحميل</h2>
          </div>
          <div className="grid gap-6">
            {(media.downloadLinks || [{ server: 'Bgbest Direct Server', quality: '1080p', size: '1.4 GB', url: '#' }]).map((link, idx) => (
              <div key={idx} className={`bg-white/5 border rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-8 hover:bg-white/10 transition-all group ${link.quality === settings.quality ? 'border-blue-500/50 bg-blue-500/5' : 'border-white/10'}`}>
                <div className="flex items-center gap-8">
                  <div className={`w-20 h-20 rounded-3xl flex items-center justify-center font-black text-2xl group-hover:text-white transition-all ${link.quality === settings.quality ? 'bg-blue-600 text-white' : 'bg-green-600/20 text-green-500 group-hover:bg-green-600'}`}>
                    {link.quality}
                  </div>
                  <div>
                    <h4 className="font-black text-2xl text-white">
                       {link.server}
                       {link.quality === settings.quality && <span className="mr-3 text-xs bg-blue-600 px-2 py-1 rounded-lg text-white font-bold">مفضل لك</span>}
                    </h4>
                    <p className="text-gray-500 font-bold text-lg mt-1">الحجم: {link.size} • النوع: WEB-DL</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleDownloadClick(link.url)} 
                  className={`w-full md:w-auto font-black px-16 py-5 rounded-2xl shadow-2xl transition-all transform hover:scale-105 text-lg ${link.quality === settings.quality ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-green-600 hover:bg-green-500 text-white'}`}
                >
                  تحميل الآن
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
