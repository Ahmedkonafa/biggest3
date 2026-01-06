
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot' | 'verify'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [isBotShieldEnabled, setIsBotShieldEnabled] = useState(false);
  const [userCaptcha, setUserCaptcha] = useState('');
  const [generatedCaptcha, setGeneratedCaptcha] = useState('');

  const [sentEmailCode, setSentEmailCode] = useState('');
  const [userEmailCode, setUserEmailCode] = useState('');
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const shield = localStorage.getItem('bgbest_bot_shield') === 'true';
    setIsBotShieldEnabled(shield);
    if (shield) generateNewCaptcha();

    const users = localStorage.getItem('bgbest_users_db');
    if (!users) {
      localStorage.setItem('bgbest_users_db', JSON.stringify([
        { id: '1', name: 'مدير الموقع', email: 'admin@bgbest.com', password: 'admin123', role: 'admin', status: 'active' }
      ]));
    }
  }, []);

  useEffect(() => {
    let interval: any;
    if (mode === 'verify' && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else if (resendTimer === 0) {
      setCanResend(true);
      if (interval) clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [mode, resendTimer]);

  const generateNewCaptcha = () => {
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedCaptcha(code);
  };

  const generateEmailCode = () => {
    return Math.floor(100000 + Math.random() * 899999).toString();
  };

  const handleResendCode = () => {
    if (!canResend) return;
    setIsSendingCode(true);
    const newCode = generateEmailCode();
    setSentEmailCode(newCode);
    setResendTimer(60);
    setCanResend(false);
    setUserEmailCode('');
    setTimeout(() => {
      setIsSendingCode(false);
      alert(`📧 كود جديد: ${newCode}`);
    }, 1000);
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const usersDb = JSON.parse(localStorage.getItem('bgbest_users_db') || '[]');

    if (mode === 'login') {
      if (isBotShieldEnabled && userCaptcha !== generatedCaptcha) {
        setError('خطأ في كود التحقق!');
        generateNewCaptcha();
        return;
      }
      const user = usersDb.find((u: any) => u.email === email && u.password === password);
      if (user) {
        if (user.status === 'blocked') { setError('حساب محظور!'); return; }
        localStorage.setItem('bgbest_user', JSON.stringify(user));
        onLogin();
        navigate(user.role === 'admin' ? '/admin' : '/');
      } else {
        setError('بيانات الدخول غير صحيحة!');
      }
    } 
    else if (mode === 'signup') {
      if (password !== confirmPassword) { setError('كلمات المرور لا تتطابق!'); return; }
      if (isBotShieldEnabled && userCaptcha !== generatedCaptcha) {
        setError('خطأ في كود التحقق!');
        generateNewCaptcha();
        return;
      }
      setIsSendingCode(true);
      const code = generateEmailCode();
      setSentEmailCode(code);
      setTimeout(() => {
        setIsSendingCode(false);
        setMode('verify');
        setResendTimer(60);
        alert(`📧 كود التأكيد: ${code}`);
      }, 1500);
    } 
    else if (mode === 'verify') {
      if (userEmailCode === sentEmailCode) {
        const newUser = { id: Date.now().toString(), name, email, password, role: 'user', status: 'active' };
        usersDb.push(newUser);
        localStorage.setItem('bgbest_users_db', JSON.stringify(usersDb));
        setSuccess('تم تفعيل الحساب!');
        setMode('login');
      } else {
        setError('الكود خاطئ!');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#0a0a0a]">
      <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl">
        <div className="text-center mb-10">
          <h2 className="text-5xl font-black text-blue-500 italic">Bgbest</h2>
          <p className="text-gray-400 font-bold text-[10px] uppercase mt-2">عالمك السينمائي الموثق</p>
        </div>

        {error && <div className="bg-red-600/20 border border-red-500/30 text-red-500 p-4 rounded-xl text-xs font-black mb-6 text-center">{error}</div>}
        {success && <div className="bg-green-600/20 border border-green-500/30 text-green-500 p-4 rounded-xl text-xs font-black mb-6 text-center">{success}</div>}

        <form onSubmit={handleAuth} className="space-y-4">
          {mode === 'verify' ? (
            <div className="space-y-6 text-center">
              <p className="text-gray-400 text-sm font-bold">أدخل كود التأكيد المرسل لـ <br/><span className="text-blue-500">{email}</span></p>
              <input required type="text" maxLength={6} placeholder="000000" className="w-full bg-black/60 border-2 border-blue-500/30 p-5 rounded-2xl text-white text-center font-black outline-none text-3xl tracking-widest" value={userEmailCode} onChange={e => setUserEmailCode(e.target.value)} />
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-xl shadow-xl transition-all">تفعيل الحساب</button>
              <div className="pt-4">
                {canResend ? (
                  <button type="button" onClick={handleResendCode} className="text-blue-500 font-black text-xs hover:underline animate-pulse">إعادة إرسال الكود الآن 📩</button>
                ) : (
                  <p className="text-gray-500 text-[10px] font-bold">يمكنك إعادة الإرسال بعد {resendTimer} ثانية</p>
                )}
              </div>
            </div>
          ) : (
            <>
              {mode === 'signup' && (
                <input required type="text" placeholder="الاسم الكامل" className="w-full bg-black/40 border border-white/10 p-4 rounded-xl text-white text-right font-bold outline-none focus:border-blue-500" value={name} onChange={e => setName(e.target.value)} />
              )}
              <input required type="email" placeholder="البريد الإلكتروني" className="w-full bg-black/40 border border-white/10 p-4 rounded-xl text-white text-right font-bold outline-none focus:border-blue-500" value={email} onChange={e => setEmail(e.target.value)} />
              <input required type="password" placeholder="كلمة المرور" className="w-full bg-black/40 border border-white/10 p-4 rounded-xl text-white text-right font-bold outline-none focus:border-blue-500" value={password} onChange={e => setPassword(e.target.value)} />
              {mode === 'signup' && (
                <input required type="password" placeholder="تأكيد كلمة المرور" className="w-full bg-black/40 border border-white/10 p-4 rounded-xl text-white text-right font-bold outline-none focus:border-blue-500" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
              )}
              {isBotShieldEnabled && (
                <div className="bg-blue-600/5 border border-blue-500/20 p-4 rounded-xl space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-blue-500 uppercase">كود التحقق</span>
                    <span className="bg-white/10 px-3 py-1 rounded font-black text-white tracking-widest">{generatedCaptcha}</span>
                  </div>
                  <input required type="number" placeholder="أدخل الكود الظاهر" className="w-full bg-black/60 border border-white/10 p-2 rounded-lg text-white text-center font-black outline-none" value={userCaptcha} onChange={e => setUserCaptcha(e.target.value)} />
                </div>
              )}
              <button type="submit" disabled={isSendingCode} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-xl shadow-lg transition-all disabled:opacity-50">
                {isSendingCode ? 'جاري المعالجة...' : mode === 'login' ? 'دخول' : 'تسجيل جديد'}
              </button>
            </>
          )}
        </form>
        <div className="mt-8 text-center pt-6 border-t border-white/5">
          <button onClick={() => setMode(mode === 'login' ? 'signup' : 'login')} className="text-xs text-gray-500 font-bold hover:text-white transition-colors">
            {mode === 'login' ? 'لا تملك حساباً؟ سجل الآن' : 'لديك حساب؟ سجل دخولك'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
