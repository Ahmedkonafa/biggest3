
import React, { useState, useEffect, useMemo } from 'react';
import MovieCard from '../components/MovieCard';
import { MOCK_MEDIA } from '../constants';
import { MediaItem } from '../types';

const Home: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('الكل');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // تحميل البيانات من LocalStorage
    const loadMedia = () => {
      const savedMedia = localStorage.getItem('bgbest_custom_media');
      if (savedMedia) {
        setMediaItems(JSON.parse(savedMedia));
      } else {
        // إذا كان المتصفح فارغاً، نضع بيانات افتراضية
        setMediaItems(MOCK_MEDIA);
        localStorage.setItem('bgbest_custom_media', JSON.stringify(MOCK_MEDIA));
      }
      setLoading(false);
    };

    loadMedia();

    // الاستماع لحدث البحث القادم من Navbar
    const handleSearchEvent = (e: any) => {
      setSearchQuery(e.detail || '');
    };
    window.addEventListener('bgbest_search', handleSearchEvent);
    
    // إعادة التحميل إذا تغيرت البيانات من لوحة التحكم
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'bgbest_custom_media') {
        loadMedia();
      }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('bgbest_search', handleSearchEvent);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const categories = ['الكل', 'رمضان 2026', 'أكشن', 'تركية', 'عربية', 'أنمي', 'كرتون', 'مدبلج'];

  const filteredItems = useMemo(() => {
    let items = mediaItems;
    
    // تصفية حسب البحث
    if (searchQuery) {
      items = items.filter(m => 
        m.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        m.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // تصفية حسب التصنيف
    if (activeCategory !== 'الكل') {
      if (activeCategory === 'مدبلج') {
        items = items.filter(item => item.isDubbed);
      } else {
        items = items.filter(item => item.category === activeCategory);
      }
    }
    
    return items;
  }, [activeCategory, mediaItems, searchQuery]);

  const featured = useMemo(() => {
    return mediaItems.find(m => m.category === 'رمضان 2026') || mediaItems[0];
  }, [mediaItems]);

  const handleAPKDownload = () => {
    setIsDownloading(true);
    setTimeout(() => {
      alert('سيتم بدء تحميل تطبيق Bgbest Mobile APK الآن...');
      setIsDownloading(false);
    }, 1500);
  };

  if (loading) return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
       <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="pt-16 pb-20">
      {/* عرض البانر الكبير فقط في حالة عدم البحث */}
      {!searchQuery && featured && (
        <section className="relative h-[70vh] sm:h-[90vh] w-full overflow-hidden animate-in fade-in duration-1000">
          <img 
            src={featured.backdropUrl || featured.posterUrl} 
            alt={featured.title} 
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/50 to-transparent"></div>
          <div className="absolute bottom-0 right-0 p-6 sm:p-16 w-full max-w-3xl text-right">
            <div className="flex items-center gap-3 mb-4">
               <span className="bg-blue-600 text-xs font-black px-4 py-1.5 rounded-full shadow-xl animate-pulse">حصرياً في رمضان</span>
               <span className="bg-white/10 backdrop-blur-md text-[10px] font-black px-3 py-1 rounded-full border border-white/20 uppercase tracking-widest text-white">4K ULTRA HD</span>
            </div>
            <h1 className="text-5xl sm:text-8xl font-black mb-6 drop-shadow-2xl">{featured.title}</h1>
            <p className="text-gray-200 text-sm sm:text-xl mb-10 line-clamp-3 leading-relaxed font-bold max-w-2xl drop-shadow-lg">
              {featured.description}
            </p>
            <button 
              onClick={() => window.location.href = `#/media/${featured.id}`}
              className="bg-blue-600 hover:bg-blue-700 text-white font-black px-12 py-5 rounded-2xl flex items-center gap-3 transition-all transform hover:scale-105 shadow-2xl shadow-blue-600/40 text-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
              مشاهدة الآن
            </button>
          </div>
        </section>
      )}

      <div className="max-w-7xl mx-auto px-4 mt-16">
        {/* شريط التصنيفات */}
        <div className="flex items-center gap-4 overflow-x-auto pb-6 no-scrollbar">
          {categories.map((cat) => (
            <button 
              key={cat} 
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap px-10 py-4 rounded-[2rem] border-2 transition-all text-sm font-black transform active:scale-95 shadow-lg ${
                activeCategory === cat 
                ? 'bg-blue-600 border-blue-500 text-white shadow-blue-600/40 scale-105' 
                : 'border-white/5 bg-white/5 text-gray-500 hover:bg-white/10 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* شبكة الأفلام */}
        <section className="mt-16">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-4xl font-black border-r-8 border-blue-600 pr-8">
              {searchQuery ? `نتائج البحث عن: ${searchQuery}` : activeCategory === 'الكل' ? 'أحدث الإضافات' : `محتوى ${activeCategory}`}
            </h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-10">
            {filteredItems.map(item => (
              <MovieCard key={item.id} item={item} />
            ))}
            {filteredItems.length === 0 && (
              <div className="col-span-full py-20 text-center text-gray-500 font-bold bg-white/5 rounded-3xl border border-dashed border-white/10 animate-pulse">
                 لا توجد نتائج مطابقة لبحثك أو تصنيفك المختار.
              </div>
            )}
          </div>
        </section>

        {/* بانر تحميل التطبيق */}
        {!searchQuery && (
          <section className="mt-32 rounded-[4rem] bg-gradient-to-tr from-[#001f3f] via-[#050505] to-black border border-blue-900/30 p-16 text-center shadow-2xl relative overflow-hidden group">
             <div className="absolute top-0 left-0 w-full h-full bg-blue-600/5 group-hover:bg-blue-600/10 transition-colors"></div>
             <h2 className="text-5xl md:text-6xl font-black mb-6 text-white tracking-tighter relative z-10">Bgbest في جيبك! 📱</h2>
             <p className="text-gray-400 text-xl mb-12 max-w-3xl mx-auto font-bold leading-relaxed relative z-10">استمتع بمشاهدة أفلامك ومسلسلاتك المفضلة في أي مكان، بجودة 4K وبدون إعلانات مزعجة.</p>
             <button 
              onClick={handleAPKDownload}
              disabled={isDownloading}
              className="bg-white text-black font-black px-16 py-6 rounded-3xl flex items-center gap-4 mx-auto hover:bg-blue-600 hover:text-white transition-all transform hover:scale-110 shadow-2xl disabled:opacity-50 text-xl relative z-10"
             >
                {isDownloading ? 'جاري التحضير...' : 'تحميل التطبيق الرسمي'}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
             </button>
          </section>
        )}
      </div>
    </div>
  );
};

export default Home;
