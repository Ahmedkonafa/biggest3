
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import GeminiAssistant from './components/GeminiAssistant';
import MobileBottomNav from './components/MobileBottomNav';
import Home from './pages/Home';
import MovieDetails from './pages/MovieDetails';
import Login from './pages/Login';
import Contact from './pages/Contact';
import AdminDashboard from './pages/AdminDashboard';
import Settings from './pages/Settings';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const user = localStorage.getItem('bgbest_user');
    if (user) {
      setIsLoggedIn(true);
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('bgbest_user');
    setIsLoggedIn(false);
  };

  if (loading) return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <Router>
      <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-blue-600/30">
        {isLoggedIn && <Navbar onLogout={handleLogout} />}
        
        <main className={isLoggedIn ? "pb-20 md:pb-0" : ""}>
          <Routes>
            {!isLoggedIn ? (
              <>
                <Route path="/login" element={<Login onLogin={() => setIsLoggedIn(true)} />} />
                <Route path="*" element={<Navigate to="/login" replace />} />
              </>
            ) : (
              <>
                <Route path="/" element={<Home />} />
                <Route path="/media/:id" element={<MovieDetails />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/login" element={<Navigate to="/" replace />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </>
            )}
          </Routes>
        </main>

        {isLoggedIn && (
          <>
            <footer className="hidden md:block bg-black/80 border-t border-white/10 py-10 mt-20">
              <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8 text-right" dir="rtl">
                <div className="text-center md:text-right">
                  <h2 className="text-2xl font-black text-blue-500 mb-2 italic">Bgbest</h2>
                  <p className="text-gray-400 text-sm">منصة المسلسلات العربية الأولى.</p>
                </div>
                <div className="flex gap-6 text-sm text-gray-400 font-bold">
                  <a href="#" className="hover:text-blue-500 transition-colors">سياسة الخصوصية</a>
                  <a href="#/contact" className="hover:text-blue-500 transition-colors">تواصل معنا</a>
                </div>
                <div className="text-gray-500 text-[10px] font-bold">
                  &copy; {new Date().getFullYear()} Bgbest.
                </div>
              </div>
            </footer>
            <MobileBottomNav />
            <GeminiAssistant />
          </>
        )}
      </div>
    </Router>
  );
};

export default App;
