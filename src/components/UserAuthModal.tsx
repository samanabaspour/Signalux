import React, { useEffect, useRef, useState } from 'react';
import { Lock, Mail, Smartphone, X } from 'lucide-react';
import type { AppUser } from '../types';

interface UserAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: AppUser) => void;
}

type Method = 'password' | 'google' | 'sms';
type AuthOptions = Record<Method, boolean>;
type AuthSession = { accessToken: string; user: AppUser };
type GoogleIdentity = {
  initialize(config: {
    client_id: string;
    nonce: string;
    callback: (response: { credential: string }) => void;
  }): void;
  renderButton(element: HTMLElement, options: { theme: string; size: string; text: string }): void;
};
type GoogleWindow = Window & { google?: { accounts?: { id?: GoogleIdentity } } };

async function requestAuth<T>(endpoint: string, payload?: object): Promise<T> {
  const response = await fetch('/api/v1/auth/' + endpoint, payload && {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const result = await response.json().catch(() => null);
  if (!response.ok || !result?.success) {
    throw new Error(result?.error?.message || 'ارتباط با سرویس ورود برقرار نشد.');
  }
  return result.data as T;
}

let googleScriptLoading: Promise<GoogleIdentity> | undefined;

function loadGoogleIdentity() {
  const gis = (window as GoogleWindow).google?.accounts?.id;
  if (gis) return Promise.resolve(gis);
  if (!googleScriptLoading) {
    googleScriptLoading = new Promise<GoogleIdentity>((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      const fail = () => {
        script.remove();
        reject(new Error('بارگیری سرویس ورود گوگل انجام نشد.'));
      };
      const timer = window.setTimeout(fail, 10_000);
      script.onload = () => {
        window.clearTimeout(timer);
        const loaded = (window as GoogleWindow).google?.accounts?.id;
        if (loaded) resolve(loaded);
        else fail();
      };
      script.onerror = () => { window.clearTimeout(timer); fail(); };
      document.head.append(script);
    }).catch(error => {
      googleScriptLoading = undefined;
      throw error;
    });
  }
  return googleScriptLoading;
}

function GoogleButton({ complete }: { complete: (session: AuthSession) => void }) {
  const button = useRef<HTMLDivElement>(null);
  const completeRef = useRef(complete);
  completeRef.current = complete;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    const element = button.current!;
    const fail = (exception: unknown) => {
      if (!active) return;
      setError(exception instanceof Error ? exception.message : 'ورود با گوگل انجام نشد.');
      setLoading(false);
    };
    void (async () => {
      try {
        const gis = await loadGoogleIdentity();
        if (!active) return;
        const { clientId, nonce } = await requestAuth<{ clientId: string; nonce: string }>('google/challenge', {});
        if (!active) return;
        gis.initialize({
          client_id: clientId, nonce,
          callback: async ({ credential }) => {
            if (!active) return;
            setLoading(true);
            try {
              const session = await requestAuth<AuthSession>('google', { credential });
              if (active) completeRef.current(session);
            } catch (exception) {
              fail(exception);
            }
          },
        });
        gis.renderButton(element, { theme: 'filled_black', size: 'large', text: 'continue_with' });
        setLoading(false);
      } catch (exception) {
        fail(exception);
      }
    })();
    return () => {
      active = false;
      element.replaceChildren();
    };
  }, [attempt]);

  return (
    <div className="space-y-3">
      <div ref={button} dir="ltr" className="flex justify-center" hidden={Boolean(error)} />
      {loading && <p role="status" className="text-sm text-zinc-300">در حال برقراری ارتباط با گوگل…</p>}
      {error && (
        <div className="space-y-2">
          <p role="alert" className="text-sm text-red-300">{error}</p>
          <button type="button" className="text-sm text-amber-300 underline" onClick={() => {
            setError('');
            setLoading(true);
            setAttempt(value => value + 1);
          }}>تلاش دوباره</button>
        </div>
      )}
    </div>
  );
}

const inputClass = 'w-full rounded-lg border border-white/15 bg-zinc-950 px-3 py-2.5 text-sm text-white outline-none focus:border-amber-400';
const submitClass = 'w-full rounded-lg bg-amber-400 px-4 py-2.5 text-sm font-bold text-zinc-950 hover:bg-amber-300 disabled:opacity-50';

function digits(value: string) {
  return value.replace(/[۰-۹٠-٩]/g, character =>
    String(character.charCodeAt(0) - (character.charCodeAt(0) >= 0x6f0 ? 0x6f0 : 0x660)));
}

function AuthDialog({ onClose, onSuccess }: Omit<UserAuthModalProps, 'isOpen'>) {
  const [method, setMethod] = useState<Method>('password');
  const [options, setOptions] = useState<AuthOptions>();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [challenge, setChallenge] = useState<{ id: string; expiresAt: number; resendAt: number }>();
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    let active = true;
    requestAuth<AuthOptions>('options').then(value => {
      if (active) setOptions(value);
    }).catch(exception => {
      if (active) setError(exception.message);
    });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!challenge) return;
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [challenge]);

  const complete = (session: AuthSession) => {
    sessionStorage.setItem('signalux_user_token', session.accessToken);
    sessionStorage.setItem('signalux_user_profile', JSON.stringify(session.user));
    onSuccess(session.user);
    onClose();
  };

  const duringRequest = async (operation: () => Promise<void>) => {
    setError('');
    setLoading(true);
    try {
      await operation();
    } catch (exception) {
      setError(exception instanceof Error ? exception.message : 'درخواست ورود انجام نشد.');
    } finally {
      setLoading(false);
    }
  };

  const sendCode = () => duringRequest(async () => {
    const data = await requestAuth<{ challengeId: string; expiresIn: number; retryAfter: number }>('otp/send', { phone });
    const time = Date.now();
    setNow(time);
    setChallenge({ id: data.challengeId, expiresAt: time + data.expiresIn * 1000, resendAt: time + data.retryAfter * 1000 });
    setCode('');
  });

  const retryIn = challenge ? Math.max(0, Math.ceil((challenge.resendAt - now) / 1000)) : 0;
  const expired = Boolean(challenge && challenge.expiresAt <= now);
  const methods = [
    { id: 'password', label: 'ایمیل و رمز', icon: Lock },
    { id: 'sms', label: 'پیامک سریع', icon: Smartphone },
    { id: 'google', label: 'حساب گوگل', icon: Mail },
  ] as const;

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-black/75 p-4" onClick={onClose}>
      <section role="dialog" aria-modal="true" aria-labelledby="customer-auth-title" dir="rtl"
        onClick={event => event.stopPropagation()}
        onKeyDown={event => { if (event.key === 'Escape') onClose(); }}
        className="max-h-[90vh] w-full max-w-md space-y-5 overflow-auto rounded-2xl border border-amber-400/25 bg-[#121017] p-5 text-white shadow-2xl sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <h2 id="customer-auth-title" className="text-base font-bold">ورود / عضویت سیگنالوکس</h2>
          <button type="button" autoFocus aria-label="بستن پنجره ورود" onClick={onClose} className="rounded-lg p-2 hover:bg-white/10">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="grid grid-cols-3 gap-1 rounded-lg bg-black/20 p-1">
          {methods.map(({ id, label, icon: Icon }) => (
            <button key={id} type="button" aria-pressed={method === id} disabled={loading}
              onClick={() => { setMethod(id); setError(''); }}
              className={`flex items-center justify-center gap-1 rounded-md px-2 py-2.5 text-xs ${method === id ? 'bg-amber-400/15 text-amber-300' : 'text-zinc-300 hover:bg-white/10'}`}>
              <Icon className="h-4 w-4" />{label}
            </button>
          ))}
        </div>
        {error && <p role="alert" className="rounded-md bg-red-950/60 px-3 py-2 text-sm text-red-200">{error}</p>}
        {!options && !error && <p role="status" className="text-sm text-zinc-300">در حال بررسی روش‌های ورود…</p>}
        {options && !options[method] && (
          <p className="rounded-md border border-white/10 px-3 py-2.5 text-sm text-zinc-200">
            {method === 'password' ? 'سرویس ورود به حساب در این محیط در دسترس نیست.'
              : method === 'google' ? 'ورود با گوگل برای این محیط پیکربندی نشده است.'
                : 'ارسال پیامک برای این محیط پیکربندی نشده است.'}
          </p>
        )}
        {method === 'password' && options?.password && (
          <form className="space-y-3" onSubmit={event => {
            event.preventDefault();
            const data = new FormData(event.currentTarget);
            void duringRequest(async () => complete(await requestAuth<AuthSession>('login', Object.fromEntries(data))));
          }}>
            <label className="block space-y-1 text-sm">ایمیل
              <input type="email" name="email" dir="ltr" autoComplete="username" required className={inputClass} />
            </label>
            <label className="block space-y-1 text-sm">رمز عبور
              <input type="password" name="password" dir="ltr" autoComplete="current-password" required className={inputClass} />
            </label>
            <button disabled={loading} className={submitClass}>ورود به حساب</button>
          </form>
        )}
        {method === 'sms' && options?.sms && (
          challenge ? (
            <form className="space-y-3" onSubmit={event => {
              event.preventDefault();
              if (expired) return;
              void duringRequest(async () => complete(await requestAuth<AuthSession>('otp/verify', {
                challengeId: challenge.id, code,
              })));
            }}>
              <p className="text-sm text-zinc-200">کد شش‌رقمی ارسال‌شده به <bdi>{phone}</bdi> را وارد کنید.</p>
              <label className="block space-y-1 text-sm">کد تأیید
                <input value={code} onChange={event => setCode(digits(event.target.value).replace(/\D/g, '').slice(0, 6))}
                  dir="ltr" inputMode="numeric" autoComplete="one-time-code" required minLength={6} maxLength={6} className={inputClass} />
              </label>
              {expired && <p role="status" className="text-sm text-amber-200">زمان استفاده از کد تمام شد.</p>}
              <button className={submitClass} disabled={loading || expired || code.length !== 6}>تأیید و ورود</button>
              <div className="flex justify-between gap-2 text-xs text-amber-300">
                <button type="button" disabled={loading || retryIn > 0} onClick={sendCode} className="disabled:text-zinc-400">
                  {retryIn ? `ارسال مجدد تا ${retryIn} ثانیه` : 'ارسال دوبارهٔ کد'}
                </button>
                <button type="button" disabled={loading} onClick={() => {
                  setChallenge(undefined);
                  setCode('');
                  setError('');
                }}>تغییر شماره</button>
              </div>
            </form>
          ) : (
            <form className="space-y-3" onSubmit={event => { event.preventDefault(); void sendCode(); }}>
              <label className="block space-y-1 text-sm">شمارهٔ موبایل
                <input type="tel" value={phone} onChange={event => setPhone(event.target.value)} dir="ltr"
                  autoComplete="tel" placeholder="09123456789" maxLength={20} required className={inputClass} />
              </label>
              <button disabled={loading} className={submitClass}>ارسال کد ورود</button>
            </form>
          )
        )}
        {method === 'google' && options?.google && <GoogleButton complete={complete} />}
      </section>
    </div>
  );
}

export function UserAuthModal({ isOpen, ...props }: UserAuthModalProps) {
  return isOpen ? <AuthDialog {...props} /> : null;
}
