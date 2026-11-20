import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Smartphone,
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  User,
  ExternalLink
} from 'lucide-react';
import { sendPhoneOtp, verifyPhoneOtp, loginWithGoogleCredential, AppUser } from '../services/apiClient';

interface UserAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: AppUser) => void;
}

export const UserAuthModal: React.FC<UserAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [tab, setTab] = useState<'otp' | 'google' | 'password'>('otp');

  // OTP State
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [otpStep, setOtpStep] = useState<'phone' | 'verify'>('phone');
  const [timer, setTimer] = useState(120);
  const [timerActive, setTimerActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [mockHintCode, setMockHintCode] = useState<string | null>(null);

  // Password Login State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Countdown timer effect
  useEffect(() => {
    let interval: any;
    if (timerActive && timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    } else if (timer === 0) {
      setTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [timerActive, timer]);

  if (!isOpen) return null;

  // Handle Send OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    // Normalize phone number (handle Persian digits)
    const normalizedPhone = phone
      .replace(/[۰-۹]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d).toString())
      .replace(/\s+/g, '');

    if (!/^09[0-9]{9}$/.test(normalizedPhone)) {
      setErrorMsg('شماره موبایل باید ۱۱ رقم و با 09 شروع شود (مثال: 09123456789).');
      return;
    }

    setLoading(true);
    const res = await sendPhoneOtp(normalizedPhone);
    setLoading(false);

    if (res.success) {
      setOtpStep('verify');
      setTimer(120);
      setTimerActive(true);
      setSuccessMsg(res.message);
      if (res.mockCode) {
        setMockHintCode(res.mockCode);
      }
    } else {
      setErrorMsg(res.message || 'خطا در ارسال پیامک. لطفاً دوباره تلاش کنید.');
    }
  };

  // Handle Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const normalizedPhone = phone
      .replace(/[۰-۹]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d).toString())
      .replace(/\s+/g, '');

    const normalizedCode = code
      .replace(/[۰-۹]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d).toString())
      .trim();

    if (!normalizedCode || normalizedCode.length < 4) {
      setErrorMsg('لطفاً کد تایید ۵ رقمی پیامک شده را وارد کنید.');
      return;
    }

    setLoading(true);
    const res = await verifyPhoneOtp({
      phone: normalizedPhone,
      code: normalizedCode,
      firstName: firstName.trim() || undefined,
      lastName: lastName.trim() || undefined
    });
    setLoading(false);

    if (res.success && res.user) {
      setSuccessMsg('ورود با موفقیت انجام شد!');
      setTimeout(() => {
        onSuccess(res.user!);
        onClose();
      }, 700);
    } else {
      setErrorMsg(res.message || 'کد تایید وارد شده نامعتبر یا منقضی شده است.');
    }
  };

  // Handle Google Login
  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      // Direct Google Auth Flow Simulation & Backend Integration
      const mockGoogleToken = 'google_token_' + Date.now();
      const res = await loginWithGoogleCredential(mockGoogleToken, {
        name: 'کاربر حساب گوگل',
        email: 'user@gmail.com'
      });
      setLoading(false);

      if (res.success && res.user) {
        setSuccessMsg('ورود با موفقیت از طریق حساب گوگل انجام شد.');
        setTimeout(() => {
          onSuccess(res.user!);
          onClose();
        }, 700);
      } else {
        setErrorMsg(res.message || 'ورود با گوگل انجام نشد.');
      }
    } catch (err) {
      setLoading(false);
      setErrorMsg('خطا در ارتباط با سرویس گوگل.');
    }
  };

  // Handle Password Login
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!email || !password) {
      setErrorMsg('ایمیل و رمز عبور الزامی است.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const json = await res.json();
      setLoading(false);

      if (json.success && json.data) {
        if (json.data.accessToken) {
          localStorage.setItem('signalux_user_token', json.data.accessToken);
        }
        if (json.data.user) {
          localStorage.setItem('signalux_user_profile', JSON.stringify(json.data.user));
          setSuccessMsg('ورود به سیستم با موفقیت انجام شد.');
          setTimeout(() => {
            onSuccess(json.data.user);
            onClose();
          }, 700);
        }
      } else {
        setErrorMsg(json.error?.message || json.message || 'اطلاعات ورود نادرست است.');
      }
    } catch (err) {
      setLoading(false);
      setErrorMsg('خطا در ورود به سیستم.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
      />

      {/* Modal Card */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="relative w-full max-w-md bg-[#0d0b12] border border-amber-500/30 rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_40px_rgba(212,175,55,0.15)] overflow-hidden text-right z-10"
        dir="rtl"
      >
        {/* Glow ambient background */}
        <div className="absolute top-0 right-1/4 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-amber-500/20 bg-[#120f18]/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-yellow-400 p-[1px]">
              <div className="w-full h-full bg-[#0d0b12] rounded-[7px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-amber-400" />
              </div>
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-mono">ورود / عضویت سیگنالوکس</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-amber-500/15 p-1 bg-[#09080e]">
          <button
            onClick={() => { setTab('otp'); setErrorMsg(''); }}
            className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-mono font-medium transition-all flex items-center justify-center gap-1.5 ${
              tab === 'otp'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>پیامک سریع (OTP)</span>
          </button>

          <button
            onClick={() => { setTab('google'); setErrorMsg(''); }}
            className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-mono font-medium transition-all flex items-center justify-center gap-1.5 ${
              tab === 'google'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <Mail className="w-3.5 h-3.5 text-red-400" />
            <span>حساب گوگل</span>
          </button>

          <button
            onClick={() => { setTab('password'); setErrorMsg(''); }}
            className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-mono font-medium transition-all flex items-center justify-center gap-1.5 ${
              tab === 'password'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>کلمه عبور</span>
          </button>
        </div>

        {/* Notification Alerts */}
        <div className="px-5 pt-4">
          <AnimatePresence>
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-3 mb-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-300 flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{errorMsg}</span>
              </motion.div>
            )}

            {successMsg && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-3 mb-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{successMsg}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Content Body */}
        <div className="p-5 pt-1">
          {/* 1. OTP Tab */}
          {tab === 'otp' && (
            <div>
              {otpStep === 'phone' ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono text-amber-200/80 mb-1.5">
                      شماره تلفن همراه
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        dir="ltr"
                        placeholder="09123456789"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-[#16121f] border border-amber-500/20 focus:border-amber-400 rounded-xl px-4 py-3 text-sm text-white font-mono placeholder:text-white/20 focus:outline-none transition-colors"
                        autoFocus
                      />
                      <Smartphone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400/50" />
                    </div>
                    <p className="text-[11px] text-white/40 mt-1.5">
                      کد تایید ۵ رقمی از طریق سامانه پیامکی ملی‌پیامک برای شما ارسال خواهد شد.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-black font-bold font-mono py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {loading ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <span>دریافت کد تایید پیامکی</span>
                        <ArrowRight className="w-4 h-4 rotate-180" />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div className="flex items-center justify-between text-xs font-mono text-amber-200/70 mb-1">
                    <span>کد تایید ارسال شده به {phone}:</span>
                    <button
                      type="button"
                      onClick={() => setOtpStep('phone')}
                      className="text-amber-400 hover:underline"
                    >
                      ویرایش شماره
                    </button>
                  </div>

                  <div>
                    <input
                      type="text"
                      dir="ltr"
                      maxLength={6}
                      placeholder="• • • • •"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      className="w-full bg-[#16121f] border border-amber-500/30 focus:border-amber-400 rounded-xl px-4 py-3 text-center tracking-[0.6em] text-lg font-bold text-amber-300 font-mono focus:outline-none transition-colors"
                      autoFocus
                    />
                    {mockHintCode && (
                      <p className="text-[11px] text-amber-400/80 mt-1 text-center font-mono">
                        کد تایید تست: <span className="font-bold underline">{mockHintCode}</span>
                      </p>
                    )}
                  </div>

                  {/* Optional Name fields on first registration */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div>
                      <input
                        type="text"
                        placeholder="نام (اختیاری)"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full bg-[#16121f] border border-amber-500/20 rounded-xl px-3 py-2 text-xs text-white placeholder:text-white/30 focus:outline-none"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="نام خانوادگی"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full bg-[#16121f] border border-amber-500/20 rounded-xl px-3 py-2 text-xs text-white placeholder:text-white/30 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Resend Timer */}
                  <div className="flex items-center justify-between text-xs font-mono text-white/50 pt-1">
                    {timerActive ? (
                      <span>امکان ارسال مجدد تا {timer} ثانیه دیگر</span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        className="text-amber-400 hover:text-amber-300 flex items-center gap-1 font-bold"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>ارسال مجدد کد تایید</span>
                      </button>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-black font-bold font-mono py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {loading ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>تایید و ورود به حساب</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* 2. Google OAuth Tab */}
          {tab === 'google' && (
            <div className="space-y-4 py-2 text-center">
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-3">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mx-auto">
                  <svg className="w-6 h-6" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                    />
                  </svg>
                </div>
                <h4 className="text-sm font-bold text-white font-mono">ورود امن و یکپارچه با حساب گوگل</h4>
                <p className="text-xs text-white/50 leading-relaxed">
                  با استفاده از حساب گوگل خود می‌توانید بدون نیاز به دریافت پیامک یا رمز عبور، بلافاصله وارد پنل کاربری شوید.
                </p>
              </div>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full bg-white hover:bg-gray-100 text-gray-900 font-bold font-mono py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-3 shadow-lg disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-gray-700" />
                ) : (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                      />
                    </svg>
                    <span>ورود با حساب گوگل (Sign In with Google)</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* 3. Password Tab */}
          {tab === 'password' && (
            <form onSubmit={handlePasswordLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-amber-200/80 mb-1.5">
                  پست الکترونیک (ایمیل)
                </label>
                <div className="relative">
                  <input
                    type="email"
                    dir="ltr"
                    placeholder="admin@signalux.ir"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#16121f] border border-amber-500/20 focus:border-amber-400 rounded-xl px-4 py-2.5 text-sm text-white font-mono placeholder:text-white/20 focus:outline-none"
                    autoFocus
                  />
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400/50" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-amber-200/80 mb-1.5">
                  کلمه عبور
                </label>
                <div className="relative">
                  <input
                    type="password"
                    dir="ltr"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#16121f] border border-amber-500/20 focus:border-amber-400 rounded-xl px-4 py-2.5 text-sm text-white font-mono placeholder:text-white/20 focus:outline-none"
                  />
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400/50" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-black font-bold font-mono py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>ورود با کلمه عبور</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Footer Note */}
        <div className="p-4 border-t border-amber-500/10 bg-[#0a0810] text-center text-[11px] text-white/40">
          با ورود یا عضویت، قوانین و حریم خصوصی استودیو سیگنالوکس را می‌پذیرید.
        </div>
      </motion.div>
    </div>
  );
};
