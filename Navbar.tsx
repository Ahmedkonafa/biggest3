
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppNotification } from '../types';

interface NavbarProps {
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onLogout }) => {
  const [search, setSearch] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [copyText, setCopyText] = useState('نسخ الرابط');
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  const [notifications] = useState<AppNotification[]>([
    {
      id: '1',
      title: 'حلقة جديدة!',
      message: 'الحلقة 5 من مسلسل الحشاشين متوفرة الآن.',
      date: 'منذ دقيقتين',
      isRead: false,
      link: '/media/r1',
      type: 'new_episode'
    }
  ]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearch(query);
    window.dispatchEvent(new CustomEvent('bgbest_search', { detail: query }));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogoutClick = () => {
    if (window.confirm('هل أنت متأكد من تسجيل الخروج؟')) {
      setIsLoggingOut(true);
      setTimeout(() => {
        onLogout();
        navigate('/login');
      }, 500);
    }
  };

  const copySiteLink = () => {
    const currentUrl = window.location.origin + window.location.pathname + window.location.hash;
    navigator.clipboard.writeText(currentUrl);
    setCopyText('تم النسخ! ✅');
    setTimeout(() => setCopyText('نسخ الرابط'), 2000);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-xl border-b border-white/10 px-4 py-2 md:py-3" dir="rtl">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-xl md:text-3xl font-black text-blue-500 tracking-tighter hover:scale-105 transition-transform italic">Bgbest</Link>
          <div className="hidden lg:flex items-center gap-6 text-sm font-black">
            <Link to="/" className="hover:text-blue-500 transition-colors">الرئيسية</Link>
            <Link to="/admin" className="text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1 border border-purple-400/30 px-3 py-1 rounded-full">
              لوحة الإدارة
            </Link>
          </div>
        </div>

        <div className="flex-1 max-w-md hidden sm:block">
          <div className="relative">
            <input
              type="text"
              placeholder="ابحث..."
              className="w-full bg-white/5 border border-white/10 rounded-full py-1.5 md:py-2 px-10 focus:outline-none focus:border-blue-500 transition-all text-xs md:text-sm text-white font-bold"
              value={search}
              onChange={handleSearch}
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={copySiteLink}
            className="hidden md:flex items-center gap-2 px-3 py-2 text-[10px] font-black bg-blue-600/10 text-blue-400 border border-blue-500/20 rounded-lg hover:bg-blue-600 hover:text-white transition-all shadow-lg"
          >
            {copyText}
          </button>

          <div className="relative" ref={notificationRef}>
            <button onClick={() => setShowNotifications(!showNotifications)} className="relative p-2 text-gray-400 hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
              <span className="absolute top-1.5 right-1.5 w-3.5 h-3.5 bg-red-600 text-[8px] font-bold text-white rounded-full flex items-center justify-center border border-black animate-pulse">1</span>
            </button>
            {showNotifications && (
              <div className="absolute left-0 mt-3 w-64 md:w-72 bg-[#151515] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-4 border-b border-white/5 bg-white/5 font-bold text-xs">التنبيهات</div>
                <div className="p-4 border-b border-white/5 bg-blue-600/5 hover:bg-white/5 transition-colors cursor-pointer">
                  <p className="text-xs font-black text-white">حلقة جديدة!</p>
                  <p className="text-[10px] text-gray-400 mt-1">الحلقة 5 من مسلسل الحشاشين متوفرة الآن.</p>
                </div>
              </div>
            )}
          </div>

          <button 
            onClick={handleLogoutClick} 
            disabled={isLoggingOut}
            className={`p-2 rounded-full transition-all active:scale-90 ${isLoggingOut ? 'text-gray-500' : 'text-red-500 hover:bg-red-500/10'}`}
          >
            {isLoggingOut ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
