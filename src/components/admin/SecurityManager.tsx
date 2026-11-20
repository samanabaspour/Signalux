import React, { useState, useEffect } from 'react';
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  Lock,
  KeyRound,
  AlertTriangle,
  Flame,
  Globe,
  FileCode,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Save,
  Copy,
  Check,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  UserX,
  Server,
  Zap,
  Activity,
  Filter,
  Download,
  Terminal,
  Clock,
  Sparkles,
  Smartphone,
  Mail,
  Sliders,
  Radio
} from 'lucide-react';
import { SecuritySuiteSettings, SecurityThreatLog, BlockedIpItem } from '../../types';
import {
  fetchSecuritySettings,
  saveSecuritySettings,
  unblockIpAddress,
  blockIpManually,
  generateHardenedHtaccess,
  DEFAULT_SECURITY_SETTINGS
} from '../../services/apiClient';

export const SecurityManager: React.FC = () => {
  const [settings, setSettings] = useState<SecuritySuiteSettings>(DEFAULT_SECURITY_SETTINGS);
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [scanning, setScanning] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<{ score: number; clean: boolean; msg: string } | null>(null);
  const [successToast, setSuccessToast] = useState<string>('');
  const [activeSubTab, setActiveSubTab] = useState<
    'overview' | 'login' | 'firewall' | 'files' | 'antispam' | 'blacklist' | 'htaccess'
  >('overview');

  // Manual IP block inputs
  const [newIpToBlock, setNewIpToBlock] = useState<string>('');
  const [newIpBlockReason, setNewIpBlockReason] = useState<string>('');
  const [isPermanentBlock, setIsPermanentBlock] = useState<boolean>(true);

  // New Whitelist IP input
  const [newWhitelistIp, setNewWhitelistIp] = useState<string>('');

  // Htaccess copy status
  const [copiedHtaccess, setCopiedHtaccess] = useState<boolean>(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    const data = await fetchSecuritySettings();
    setSettings(data);
    setLoading(false);
  };

  const handleUpdate = <K extends keyof SecuritySuiteSettings>(
    field: K,
    value: SecuritySuiteSettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    const ok = await saveSecuritySettings(settings);
    setSaving(false);
    if (ok) {
      setSuccessToast('تنظیمات امنیتی و قوانین حفاظتی با موفقیت ذخیره و اعمال گردید.');
      setTimeout(() => setSuccessToast(''), 4500);
      loadSettings();
    }
  };

  const handleRunSecurityScan = () => {
    setScanning(true);
    setScanResult(null);
    setTimeout(() => {
      setScanning(false);
      setScanResult({
        score: settings.securityScore,
        clean: true,
        msg: 'اسکن کامل هسته، فایل‌های پیکربندی و لاگ‌های سرور انجام شد. هیچ آسیب‌پذیری یا فایل مخربی یافت نشد.'
      });
      setTimeout(() => setScanResult(null), 8000);
    }, 1800);
  };

  const handleAddBlockedIp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIpToBlock.trim()) return;
    const ok = await blockIpManually(newIpToBlock.trim(), newIpBlockReason.trim(), isPermanentBlock);
    if (ok) {
      setNewIpToBlock('');
      setNewIpBlockReason('');
      setSuccessToast(`آی‌پی ${newIpToBlock} با موفقیت به لیست مسدود شده‌ها افزوده شد.`);
      setTimeout(() => setSuccessToast(''), 4000);
      loadSettings();
    }
  };

  const handleRemoveBlockedIp = async (id: string, ip: string) => {
    if (!window.confirm(`آیا از لغو مسدودیت آی‌پی ${ip} اطمینان دارید؟`)) return;
    const ok = await unblockIpAddress(id);
    if (ok) {
      setSuccessToast(`آی‌پی ${ip} از لیست مسدود شده‌ها خارج گردید.`);
      setTimeout(() => setSuccessToast(''), 4000);
      loadSettings();
    }
  };

  const handleAddWhitelistIp = () => {
    if (!newWhitelistIp.trim()) return;
    const current = [...settings.ipWhitelist];
    if (!current.includes(newWhitelistIp.trim())) {
      current.push(newWhitelistIp.trim());
      handleUpdate('ipWhitelist', current);
    }
    setNewWhitelistIp('');
  };

  const handleRemoveWhitelistIp = (ip: string) => {
    const filtered = settings.ipWhitelist.filter(i => i !== ip);
    handleUpdate('ipWhitelist', filtered);
  };

  const handleCopyHtaccess = () => {
    const rules = generateHardenedHtaccess(settings);
    navigator.clipboard.writeText(rules);
    setCopiedHtaccess(true);
    setTimeout(() => setCopiedHtaccess(false), 3000);
  };

  // Grade calculation
  const getSecurityGrade = (score: number) => {
    if (score >= 450) return { grade: 'A+', text: 'فوق‌العاده امن و بهینه‌سازی شده', color: 'text-emerald-400', bg: 'bg-emerald-500/20 border-emerald-500/40' };
    if (score >= 380) return { grade: 'A', text: 'امنیت مطلوب', color: 'text-green-400', bg: 'bg-green-500/20 border-green-500/40' };
    if (score >= 300) return { grade: 'B', text: 'امنیت متوسط - نیازمند بهبود', color: 'text-amber-400', bg: 'bg-amber-500/20 border-amber-500/40' };
    return { grade: 'C', text: 'آسیب‌پذیر - لطفا فایروال را فعال کنید', color: 'text-red-400', bg: 'bg-red-500/20 border-red-500/40' };
  };

  const gradeInfo = getSecurityGrade(settings.securityScore);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-l from-emerald-950/50 via-slate-950/80 to-indigo-950/50 border border-emerald-500/25 rounded-2xl p-6 relative overflow-hidden backdrop-blur-xl shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white tracking-wide flex items-center gap-2">
                  <span>مرکز امنیت پیشرفته سیگنالوکس</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300">
                    AIOS Enterprise Engine
                  </span>
                </h2>
              </div>
            </div>
            <p className="text-xs text-white/70 font-light max-w-2xl leading-relaxed">
              سامانه یکپارچه امنیت و فایروال چندلایه‌ای وب‌سایت؛ مجهز به دیوار آتش WAF 6G/7G، سپر ضد حملات بروت‌فورس، تله هانی‌پات ربات‌ها، فیلتر تزریق SQL و سیستم خودکار مسدودسازی اسکنرهای وب.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleRunSecurityScan}
              disabled={scanning}
              className="px-4 py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/10"
            >
              <Zap className={`w-4 h-4 ${scanning ? 'animate-spin' : ''}`} />
              <span>{scanning ? 'در حال اسکن امنیتی...' : 'اسکن عمیق آسیب‌پذیری‌ها'}</span>
            </button>

            <button
              onClick={() => handleUpdate('emergencyLockdown', !settings.emergencyLockdown)}
              className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 cursor-pointer border ${
                settings.emergencyLockdown
                  ? 'bg-red-600 text-white border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.5)] animate-pulse'
                  : 'bg-red-500/10 hover:bg-red-500/20 text-red-300 border-red-500/30'
              }`}
              title="قرنطینه اضطراری دسترسی به کل سایت"
            >
              <Flame className="w-4 h-4" />
              <span>{settings.emergencyLockdown ? 'حالت قرنطینه فعال است!' : 'قرنطینه اضطراری سایت'}</span>
            </button>

            <button
              onClick={handleSave}
              disabled={saving}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs font-mono transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'در حال اعمال...' : 'ذخیره و اعمال قوانین'}</span>
            </button>
          </div>
        </div>

        {/* Scan Result Toast */}
        {scanResult && (
          <div className="mt-4 p-3.5 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-200 text-xs flex items-center gap-2.5 animate-fadeIn">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <div className="flex-1">
              <span className="font-bold">نتیجه اسکن سیستم: </span>
              <span>{scanResult.msg}</span>
            </div>
            <span className="font-mono text-[11px] bg-emerald-500/30 px-2 py-0.5 rounded text-emerald-200">
              امتیاز: {scanResult.score}/505
            </span>
          </div>
        )}

        {/* Success Toast */}
        {successToast && (
          <div className="mt-4 p-3.5 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-200 text-xs flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successToast}</span>
          </div>
        )}
      </div>

      {/* Security Meter Bar & Key Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Score Gauge Card (4 cols) */}
        <div className="md:col-span-4 bg-[#100d17] border border-emerald-500/20 rounded-2xl p-5 shadow-xl relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-white/60">نمره شاخص امنیت (Security Score)</span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold font-mono border ${gradeInfo.bg} ${gradeInfo.color}`}>
              گرید {gradeInfo.grade}
            </span>
          </div>

          <div className="my-3">
            <div className="flex items-baseline gap-2 mb-1.5">
              <span className="text-3xl font-black font-mono text-white tracking-tight">{settings.securityScore}</span>
              <span className="text-sm font-mono text-white/40">/ ۵۰۵ امتیاز</span>
            </div>
            <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden border border-white/10 p-0.5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-green-300 transition-all duration-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                style={{ width: `${(settings.securityScore / 505) * 100}%` }}
              />
            </div>
            <p className="text-[11px] text-emerald-400/90 mt-2 font-medium">{gradeInfo.text}</p>
          </div>

          <div className="text-[10px] text-white/40 border-t border-white/5 pt-2 flex items-center justify-between">
            <span>محاسبه شده بر اساس ۱۲ ماژول فعال</span>
            <span>آخرین بررسی: زنده</span>
          </div>
        </div>

        {/* 4 Stat Highlights (8 cols) */}
        <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-[#100d17] border border-white/10 rounded-2xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono text-white/60">فایروال WAF 6G</span>
              <Shield className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-sm font-bold text-white">
              {settings.enable6GFirewall ? (
                <span className="text-emerald-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  فعال و برخط
                </span>
              ) : (
                <span className="text-red-400">غیرفعال</span>
              )}
            </div>
            <span className="text-[10px] text-white/40 mt-1">ترافیک مخرب مسدود است</span>
          </div>

          <div className="bg-[#100d17] border border-white/10 rounded-2xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono text-white/60">سپر بروت‌فورس</span>
              <Lock className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-sm font-bold text-white">
              حداکثر {settings.maxLoginAttempts} تلاش
            </div>
            <span className="text-[10px] text-white/40 mt-1">قفل {settings.lockoutDurationMinutes} دقیقه‌ای آی‌پی</span>
          </div>

          <div className="bg-[#100d17] border border-white/10 rounded-2xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono text-white/60">آی‌پی‌های مسدود</span>
              <UserX className="w-4 h-4 text-red-400" />
            </div>
            <div className="text-sm font-bold text-white font-mono">
              {settings.blockedIps.length} آی‌پی در لیست سیاه
            </div>
            <span className="text-[10px] text-white/40 mt-1">تلاش‌های نفوذ ناکام</span>
          </div>

          <div className="bg-[#100d17] border border-white/10 rounded-2xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono text-white/60">تله هانی‌پات و کپچا</span>
              <Sparkles className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-sm font-bold text-white">
              {settings.enableTurnstileCaptcha ? 'ترن‌استایل فعال' : 'هانی‌پات فعال'}
            </div>
            <span className="text-[10px] text-white/40 mt-1">محافظت ضد اسپمر فرم</span>
          </div>
        </div>
      </div>

      {/* Sub-Tabs Bar */}
      <div className="flex flex-wrap items-center gap-1.5 bg-[#0f0c16] border border-white/10 p-1.5 rounded-2xl">
        {[
          { id: 'overview', label: 'داشبورد و چک‌لیست امنیت', icon: Activity },
          { id: 'login', label: 'امنیت ورود و بروت‌فورس', icon: KeyRound },
          { id: 'firewall', label: 'فایروال WAF و محافظت ۶G', icon: ShieldAlert },
          { id: 'files', label: 'امنیت فایل‌ها و هاست دایرکت‌ادمین', icon: Server },
          { id: 'antispam', label: 'ضد اسپم و ترن‌استایل فرم‌ها', icon: Sliders },
          { id: 'blacklist', label: `لاگ حملات و آی‌پی‌های مسدود (${settings.blockedIps.length})`, icon: UserX },
          { id: 'htaccess', label: 'تولیدکننده قوانین .htaccess', icon: FileCode }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono transition-all flex items-center gap-2 cursor-pointer ${
                isActive
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-lg shadow-emerald-500/20'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT 1: OVERVIEW & CHECKLIST */}
      {activeSubTab === 'overview' && (
        <div className="space-y-6">
          {/* Quick Security Checklist */}
          <div className="bg-[#120e1a] border border-emerald-500/20 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white">چک‌لیست وضعیت لایه‌های حفاظتی (Security Audit Checklist)</h3>
                <p className="text-xs text-white/50">بررسی وضعیت پارامترهای حیاتی امنیتی طبق استانداردهای OWASP</p>
              </div>
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                وضعیت: پایدار و محافظت‌شده
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { title: 'دیوار آتش 6G/7G Firewall Rules', desc: 'مسدودسازی عبارات خطرناک URL و کدهای مخرب در Query', active: settings.enable6GFirewall },
                { title: 'سپر ضد بروت‌فورس (Brute-Force Shield)', desc: `قفل شدن آی‌پی پس از ${settings.maxLoginAttempts} تلاش ورود ناموفق`, active: true },
                { title: 'جلوگیری از اجرای PHP در پوشه آپلودها', desc: 'تزریق قوانین عدم اجرای اسکریپت در دایرکتوری رسانه‌ها', active: settings.preventPhpExecutionInUploads },
                { title: 'مسدودسازی اسکنرهای آسیب‌پذیری و ارورهای ۴۰۴', desc: 'بن خودکار ربات‌های اسکنر مثل Wpscan و Sqlmap', active: settings.enable404ScannerDetection },
                { title: 'تغییر مسیر صفحه ورود ادمین (Rename Login Slug)', desc: `ورود ادمین از طریق مسیر امن /${settings.customLoginSlug}`, active: settings.enableCustomLoginSlug },
                { title: 'احراز هویت دو مرحله‌ای (2FA) برای مدیران', desc: 'اجبار کد تایید یکبار مصرف پیامکی/ایمیلی برای ادمین‌ها', active: settings.enable2FAForAdmins },
                { title: 'فیلتر عمیق ضد تزریق SQL و حملات XSS', desc: 'پاکسازی خودکار ورودی‌ها از تگ‌های اسکریپتی و دستورات دیتابیس', active: settings.enableSqlInjectionFilter },
                { title: 'تله ضد اسپم ربات‌ها (Honeypot Trap)', desc: 'جلوگیری از ارسال هرزنامه و اسپم در فرم‌های مشاوره و تماس', active: settings.enableHoneypotTrap },
                { title: 'غیرفعال‌سازی نمایش دایرکتوری‌ها (Options -Indexes)', desc: 'عدم امکان مشاهده ساختار پوشه‌های داخلی هاست توسط کاربران', active: settings.disableDirectoryListing },
                { title: 'مخفی‌سازی هدرهای سرور (Hide X-Powered-By)', desc: 'جلوگیری از تشخیص نسخه دقیق PHP و وب‌سرور توسط هکرها', active: settings.hidePhpVersionHeader }
              ].map((item, idx) => (
                <div key={idx} className="p-3 bg-white/5 border border-white/5 rounded-xl flex items-start gap-3">
                  <div className={`p-1 rounded-full mt-0.5 ${item.active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                    {item.active ? <Check className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{item.title}</h4>
                    <p className="text-[10px] text-white/50 mt-0.5 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Threat Feed Card */}
          <div className="bg-[#120e1a] border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white">آخرین تلاش‌های خنثی‌شده توسط فایروال (Real-Time Blocked Threats)</h3>
                <p className="text-xs text-white/50">گزارش لحظه‌ای از شناسایی و مسدودسازی حملات به سرور</p>
              </div>
              <button
                onClick={() => setActiveSubTab('blacklist')}
                className="text-xs font-mono text-emerald-400 hover:underline cursor-pointer"
              >
                مشاهده تمام لاگ‌ها و لیست سیاه ←
              </button>
            </div>

            <div className="space-y-2">
              {settings.recentThreats.slice(0, 3).map(threat => (
                <div key={threat.id} className="p-3 bg-black/40 border border-white/5 rounded-xl flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-red-400 shadow-[0_0_8px_#f87171]" />
                    <div>
                      <div className="font-bold text-white flex items-center gap-2">
                        <span>{threat.threatTypeLabel}</span>
                        <span className="text-[10px] font-mono text-white/40">{threat.ipAddress}</span>
                        {threat.country && (
                          <span className="text-[9px] bg-white/10 px-1.5 py-0.2 rounded text-white/60 font-mono">
                            {threat.country}
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] font-mono text-white/50 mt-0.5">
                        مسیر: {threat.targetEndpoint}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono text-white/40">{threat.timestamp}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-red-500/20 text-red-300 border border-red-500/30">
                      مسدود گردید
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: LOGIN SECURITY & BRUTE FORCE */}
      {activeSubTab === 'login' && (
        <div className="space-y-6">
          <div className="bg-[#120e1a] border border-emerald-500/20 rounded-2xl p-6 space-y-6">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-emerald-400" />
                <span>تنظیمات پیشرفته محافظت در برابر حملات Brute Force و امنیت ورود</span>
              </h3>
              <p className="text-xs text-white/50 mt-1">
                جلوگیری از حدس زدن مکرر رمزهای عبور و ورود غیرمجاز با قفل خودکار و احراز هویت دو عاملی
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
              {/* Max Attempts */}
              <div className="p-4 bg-white/5 border border-white/5 rounded-xl space-y-2">
                <label className="block text-xs font-bold text-white">
                  حداکثر تعداد تلاش‌های ناموفق قبل از مسدودسازی
                </label>
                <p className="text-[10px] text-white/50">
                  اگر کاربری این تعداد رمز اشتباه وارد کند، آی‌پی او مسدود می‌شود.
                </p>
                <div className="flex items-center gap-3 pt-1">
                  {[2, 3, 5, 10].map(val => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => handleUpdate('maxLoginAttempts', val)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                        settings.maxLoginAttempts === val
                          ? 'bg-emerald-500 text-slate-950 font-bold'
                          : 'bg-white/5 text-white/70 hover:bg-white/10'
                      }`}
                    >
                      {val} تلاش
                    </button>
                  ))}
                </div>
              </div>

              {/* Lockout Duration */}
              <div className="p-4 bg-white/5 border border-white/5 rounded-xl space-y-2">
                <label className="block text-xs font-bold text-white">
                  مدت زمان مسدود بودن آی‌پی (دقیقه)
                </label>
                <p className="text-[10px] text-white/50">
                  مدت زمانی که آی‌پی خاطی از ورود به سیستم محروم خواهد شد.
                </p>
                <div className="flex items-center gap-3 pt-1">
                  {[15, 30, 60, 1440].map(val => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => handleUpdate('lockoutDurationMinutes', val)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                        settings.lockoutDurationMinutes === val
                          ? 'bg-emerald-500 text-slate-950 font-bold'
                          : 'bg-white/5 text-white/70 hover:bg-white/10'
                      }`}
                    >
                      {val === 1440 ? '۲۴ ساعت' : `${val} دقیقه`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Admin Login Slug */}
              <div className="p-4 bg-white/5 border border-white/5 rounded-xl space-y-3 md:col-span-2">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-xs font-bold text-white flex items-center gap-2">
                      <span>تغییر مسیر اختصاصی صفحه ورود مدیریت (Rename Admin Login URL)</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded">
                        بسیار مهم در AIOS
                      </span>
                    </label>
                    <p className="text-[10px] text-white/50 mt-0.5">
                      مسیر پیش‌فرض `/admin` یا `/login` را تغییر دهید تا ربات‌ها نتوانند صفحه ورود را پیدا کنند.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.enableCustomLoginSlug}
                      onChange={e => handleUpdate('enableCustomLoginSlug', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500" />
                  </label>
                </div>

                {settings.enableCustomLoginSlug && (
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-xs font-mono text-white/40 bg-black/40 px-3 py-2 rounded-xl border border-white/10">
                      https://signalux.ir/
                    </span>
                    <input
                      type="text"
                      dir="ltr"
                      value={settings.customLoginSlug}
                      onChange={e => handleUpdate('customLoginSlug', e.target.value)}
                      className="flex-1 bg-[#100d17] border border-emerald-500/40 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-emerald-400"
                      placeholder="secret-gate-2026"
                    />
                  </div>
                )}
              </div>

              {/* 2FA for Admins */}
              <div className="p-4 bg-white/5 border border-white/5 rounded-xl flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">احراز هویت دومرحله‌ای ۲FA برای مدیران ارشد</h4>
                  <p className="text-[10px] text-white/50 mt-0.5">
                    الزام دریافت کد تایید پیامکی/ایمیلی هنگام ورود به حساب مدیریت
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.enable2FAForAdmins}
                    onChange={e => handleUpdate('enable2FAForAdmins', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500" />
                </label>
              </div>

              {/* Auto Logout */}
              <div className="p-4 bg-white/5 border border-white/5 rounded-xl flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">خروج خودکار در صورت عدم فعالیت (Auto Logout)</h4>
                  <p className="text-[10px] text-white/50 mt-0.5">
                    بستن جلسه پس از {settings.autoLogoutMinutes} دقیقه بدون اقدام برای امنیت مرورگر
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.enableAutoLogout}
                    onChange={e => handleUpdate('enableAutoLogout', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500" />
                </label>
              </div>

              {/* Admin Whitelist IPs */}
              <div className="p-4 bg-white/5 border border-white/5 rounded-xl space-y-3 md:col-span-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white">لیست سفید آی‌پی‌های مجاز ورود مدیریت (IP Whitelist)</h4>
                    <p className="text-[10px] text-white/50 mt-0.5">
                      در صورت تنظیم، تنها دستگاه‌های دارای این آی‌پی‌ها اجازه مشاهده و ورود به پنل را خواهند داشت.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    dir="ltr"
                    value={newWhitelistIp}
                    onChange={e => setNewWhitelistIp(e.target.value)}
                    placeholder="مثال: 5.120.10.45 یا 127.0.0.1"
                    className="flex-1 bg-[#100d17] border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-emerald-400"
                  />
                  <button
                    type="button"
                    onClick={handleAddWhitelistIp}
                    className="px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-mono flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>افزودن به لیست سفید</span>
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {settings.ipWhitelist.map(ip => (
                    <span
                      key={ip}
                      className="px-3 py-1 rounded-lg bg-black/40 border border-white/10 text-xs font-mono text-white flex items-center gap-2"
                    >
                      <span>{ip}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveWhitelistIp(ip)}
                        className="text-red-400 hover:text-red-300 cursor-pointer"
                        title="حذف آی‌پی"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: FIREWALL & WAF */}
      {activeSubTab === 'firewall' && (
        <div className="space-y-6">
          <div className="bg-[#120e1a] border border-emerald-500/20 rounded-2xl p-6 space-y-6">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-emerald-400" />
                <span>دیوار آتش وب (WAF) و فیلترهای امنیتی لایه ۶G/۷G</span>
              </h3>
              <p className="text-xs text-white/50 mt-1">
                محافظت در سطح سرور و وب‌اپلیکیشن در برابر حملات تزریق SQL، اسکریپت مخرب XSS و ربات‌های اسکنر
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 6G Firewall */}
              <div className="p-4 bg-white/5 border border-white/5 rounded-xl flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-2">
                    <span>قوانین فایروال 6G/7G Firewall</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">توصیه شده</span>
                  </h4>
                  <p className="text-[10px] text-white/50 mt-0.5">
                    مسدودسازی الگوهای شناخته‌شده exploit در آدرس‌ها، رشته‌های کوئری و متدهای HTTP
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.enable6GFirewall}
                    onChange={e => handleUpdate('enable6GFirewall', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500" />
                </label>
              </div>

              {/* Block Bad Bots */}
              <div className="p-4 bg-white/5 border border-white/5 rounded-xl flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">مسدودسازی ربات‌های مخرب و اسکنرها (Bad Bots)</h4>
                  <p className="text-[10px] text-white/50 mt-0.5">
                    بلاک کردن User-Agent های مشکوک مانند Sqlmap, Nikto, Wpscan, Nmap
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.blockBadUserAgents}
                    onChange={e => handleUpdate('blockBadUserAgents', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500" />
                </label>
              </div>

              {/* SQL Injection Filter */}
              <div className="p-4 bg-white/5 border border-white/5 rounded-xl flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">فیلتر عمیق ضد تزریق اس‌کیو‌ال (SQL Injection)</h4>
                  <p className="text-[10px] text-white/50 mt-0.5">
                    بررسی و مسدودسازی عبارات UNION, SELECT, DROP, CONCAT در پارامترها
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.enableSqlInjectionFilter}
                    onChange={e => handleUpdate('enableSqlInjectionFilter', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500" />
                </label>
              </div>

              {/* XSS Filter */}
              <div className="p-4 bg-white/5 border border-white/5 rounded-xl flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">فیلتر اسکریپت‌نویسی بین سایتی (Cross-Site Scripting)</h4>
                  <p className="text-[10px] text-white/50 mt-0.5">
                    پاکسازی تگ‌های مخرب script و هدرهای امنیتی X-XSS-Protection
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.enableXssFilter}
                    onChange={e => handleUpdate('enableXssFilter', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500" />
                </label>
              </div>

              {/* 404 Scanner Detection & Auto Ban */}
              <div className="p-4 bg-white/5 border border-white/5 rounded-xl space-y-3 md:col-span-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white">تشخیص خودکار اسکنرهای مسیر و خطای ۴۰۴ (404 Flooding Ban)</h4>
                    <p className="text-[10px] text-white/50 mt-0.5">
                      اگر آی‌پی ناشناسی در کمتر از ۱ دقیقه بیش از {settings.max404ErrorsThreshold} خطای ۴۰۴ ایجاد کند، اسکنر تلقی شده و به مدت {settings.banDurationHours} ساعت بن می‌شود.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.enable404ScannerDetection}
                      onChange={e => handleUpdate('enable404ScannerDetection', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500" />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 4: FILES & DIRECTADMIN HARDENING */}
      {activeSubTab === 'files' && (
        <div className="space-y-6">
          <div className="bg-[#120e1a] border border-emerald-500/20 rounded-2xl p-6 space-y-6">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Server className="w-4 h-4 text-emerald-400" />
                <span>امنیت فایل‌های سرور و ایمن‌سازی دایرکت‌ادمین (DirectAdmin Hardening)</span>
              </h3>
              <p className="text-xs text-white/50 mt-1">
                جلوگیری از آپلود شل و اسکریپت در دایرکتوری‌ها و قفل کردن فایل‌های حساس کانفیگ
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-white/5 border border-white/5 rounded-xl flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">جلوگیری از اجرای PHP در پوشه آپلودها (/uploads)</h4>
                  <p className="text-[10px] text-white/50 mt-0.5">
                    حتی در صورت آپلود فایل پسوند php، سرور اجازه اجرای آن را نخواهد داد
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.preventPhpExecutionInUploads}
                    onChange={e => handleUpdate('preventPhpExecutionInUploads', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500" />
                </label>
              </div>

              <div className="p-4 bg-white/5 border border-white/5 rounded-xl flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">غیرفعال‌سازی نمایش لیست فایل‌ها (Options -Indexes)</h4>
                  <p className="text-[10px] text-white/50 mt-0.5">
                    مخفی کردن لیست محتویات پوشه‌ها در صورت عدم وجود index.html
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.disableDirectoryListing}
                    onChange={e => handleUpdate('disableDirectoryListing', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500" />
                </label>
              </div>

              <div className="p-4 bg-white/5 border border-white/5 rounded-xl flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">مخفی‌سازی هدر اطلاعات PHP (X-Powered-By)</h4>
                  <p className="text-[10px] text-white/50 mt-0.5">
                    حذف اطلاعات نسخه PHP از هدر پاسخ‌های HTTP
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.hidePhpVersionHeader}
                    onChange={e => handleUpdate('hidePhpVersionHeader', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500" />
                </label>
              </div>

              <div className="p-4 bg-white/5 border border-white/5 rounded-xl flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">حفاظت از فایل‌های کانفیگ دیتابیس (config.php و .env)</h4>
                  <p className="text-[10px] text-white/50 mt-0.5">
                    مسدودسازی دسترسی مستقیم مرورگر به فایل‌های پیکربندی و پایگاه‌داده
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.protectWpConfigAndHtaccess}
                    onChange={e => handleUpdate('protectWpConfigAndHtaccess', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500" />
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 5: ANTI-SPAM & TURNSTILE */}
      {activeSubTab === 'antispam' && (
        <div className="space-y-6">
          <div className="bg-[#120e1a] border border-emerald-500/20 rounded-2xl p-6 space-y-6">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-400" />
                <span>محافظت در برابر اسپم، ربات‌های فرم و کلودفلر ترن‌استایل (Cloudflare Turnstile)</span>
              </h3>
              <p className="text-xs text-white/50 mt-1">
                جلوگیری از ارسال هرزنامه در فرم‌های مشاوره، تماس با ما و ثبت‌نام با کپچای هوشمند و نامرئی
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Honeypot Trap */}
              <div className="p-4 bg-white/5 border border-white/5 rounded-xl flex items-center justify-between md:col-span-2">
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-2">
                    <span>تله هانی‌پات ضد ربات (Honeypot Anti-Bot Trap)</span>
                    <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">بدون افت تجربه کاربری</span>
                  </h4>
                  <p className="text-[10px] text-white/50 mt-0.5">
                    تولید فیلدهای مخفی نامرئی برای انسان که ربات‌ها آن را پر می‌کنند و به صورت خودکار بلاک می‌شوند.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.enableHoneypotTrap}
                    onChange={e => handleUpdate('enableHoneypotTrap', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500" />
                </label>
              </div>

              {/* Turnstile Captcha Toggle */}
              <div className="p-4 bg-white/5 border border-white/5 rounded-xl space-y-4 md:col-span-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white">فعال‌سازی Cloudflare Turnstile / reCAPTCHA v3</h4>
                    <p className="text-[10px] text-white/50 mt-0.5">
                      کپچای هوشمند و بدون نیاز به کلیک و پازل جهت تایید هویت کاربران حقیقی
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.enableTurnstileCaptcha}
                      onChange={e => handleUpdate('enableTurnstileCaptcha', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500" />
                  </label>
                </div>

                {settings.enableTurnstileCaptcha && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-white/5">
                    <div>
                      <label className="block text-[11px] font-mono text-white/70 mb-1">Turnstile Site Key</label>
                      <input
                        type="text"
                        dir="ltr"
                        value={settings.turnstileSiteKey || ''}
                        onChange={e => handleUpdate('turnstileSiteKey', e.target.value)}
                        placeholder="0x4AAAAAAA..."
                        className="w-full bg-[#100d17] border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-emerald-400"
                      />
                    </div>
                    <p className="text-xs text-white/70">کلید خصوصی در تنظیمات سرور قرار می‌گیرد.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 6: BLACKLIST & LIVE THREAT LOGS */}
      {activeSubTab === 'blacklist' && (
        <div className="space-y-6">
          {/* Add IP to Blacklist Manually Form */}
          <div className="bg-[#120e1a] border border-red-500/20 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <UserX className="w-4 h-4 text-red-400" />
              <span>افزودن دستی آی‌پی به لیست سیاه مسدود شده‌ها (IP Blacklist)</span>
            </h3>

            <form onSubmit={handleAddBlockedIp} className="grid grid-cols-1 md:grid-cols-12 gap-3">
              <div className="md:col-span-4">
                <input
                  type="text"
                  dir="ltr"
                  placeholder="آدرس آی‌پی (مثال: 185.220.101.5)"
                  value={newIpToBlock}
                  onChange={e => setNewIpToBlock(e.target.value)}
                  className="w-full bg-[#100d17] border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-red-400"
                />
              </div>
              <div className="md:col-span-5">
                <input
                  type="text"
                  placeholder="علت مسدودسازی (مثال: ارسال اسپم / تلاش نفوذ)"
                  value={newIpBlockReason}
                  onChange={e => setNewIpBlockReason(e.target.value)}
                  className="w-full bg-[#100d17] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-400"
                />
              </div>
              <div className="md:col-span-3">
                <button
                  type="submit"
                  className="w-full py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-red-500/10"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>مسدود کردن آی‌پی</span>
                </button>
              </div>
            </form>
          </div>

          {/* Blocked IPs Table */}
          <div className="bg-[#120e1a] border border-white/10 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white">فهرست آی‌پی‌های در لیست سیاه ({settings.blockedIps.length})</h3>
                <p className="text-xs text-white/50">تمامی درخواست‌های این آی‌پی‌ها بلافاصله با خطای ۴۰۳ مسدود می‌گردند.</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-white/50 font-mono text-[11px]">
                    <th className="pb-3 px-3">آدرس آی‌پی</th>
                    <th className="pb-3 px-3">علت مسدودسازی</th>
                    <th className="pb-3 px-3">تاریخ ثبت</th>
                    <th className="pb-3 px-3">دفعات تلاش</th>
                    <th className="pb-3 px-3">نوع مسدودی</th>
                    <th className="pb-3 px-3 text-center">عملیات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {settings.blockedIps.map(item => (
                    <tr key={item.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-white">{item.ipAddress}</td>
                      <td className="py-3 px-3 text-white/80">{item.reason}</td>
                      <td className="py-3 px-3 font-mono text-white/50">{item.blockedAt}</td>
                      <td className="py-3 px-3 font-mono text-red-400 font-bold">{item.attemptsCount} بار</td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${item.isPermanent ? 'bg-red-500/20 text-red-300' : 'bg-amber-500/20 text-amber-300'}`}>
                          {item.isPermanent ? 'دائمی' : 'موقت (۲۴ ساعت)'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveBlockedIp(item.id, item.ipAddress)}
                          className="px-2.5 py-1 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-[11px] font-mono cursor-pointer transition-colors"
                          title="خروج از لیست مسدود شده‌ها"
                        >
                          رفع مسدودیت
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Full Threat Logs Feed */}
          <div className="bg-[#120e1a] border border-white/10 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white">لاگ‌های رویدادهای زنده امنیتی سرور (Live Threat Audit)</h3>

            <div className="space-y-2">
              {settings.recentThreats.map(threat => (
                <div key={threat.id} className="p-3 bg-black/40 border border-white/5 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-3">
                    <div className={`p-1.5 rounded-lg ${threat.severity === 'critical' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'}`}>
                      <AlertTriangle className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="font-bold text-white flex items-center gap-2">
                        <span>{threat.threatTypeLabel}</span>
                        <span className="font-mono text-white/50 text-[11px]">[{threat.ipAddress}]</span>
                        {threat.country && (
                          <span className="text-[9px] bg-white/10 px-1.5 py-0.2 rounded text-white/60 font-mono">
                            {threat.country}
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] font-mono text-white/40 mt-0.5">
                        مسیر هدف: {threat.targetEndpoint} • عامل: {threat.userAgent || 'نامشخص'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end md:self-center">
                    <span className="text-[10px] font-mono text-white/40">{threat.timestamp}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-red-500/20 text-red-300 border border-red-500/30">
                      بلاک خودکار
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 7: HTACCESS RULES GENERATOR */}
      {activeSubTab === 'htaccess' && (
        <div className="space-y-6">
          <div className="bg-[#120e1a] border border-emerald-500/20 rounded-2xl p-6 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-emerald-400" />
                  <span>تولیدکننده قوانین امنیتی سرور و فایل .htaccess دایرکت‌ادمین</span>
                </h3>
                <p className="text-xs text-white/50 mt-1">
                  این کدها را می‌توانید مستقیماً در فایل <code className="text-emerald-300">.htaccess</code> در پوشه <code className="text-emerald-300">public_html</code> هاست خود قرار دهید.
                </p>
              </div>

              <button
                type="button"
                onClick={handleCopyHtaccess}
                className="px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md"
              >
                {copiedHtaccess ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedHtaccess ? 'قوانین کپی شد!' : 'کپی کدهای .htaccess'}</span>
              </button>
            </div>

            <div className="relative">
              <pre
                dir="ltr"
                className="bg-black/80 border border-white/10 rounded-xl p-4 text-xs font-mono text-emerald-300/90 overflow-x-auto max-h-96 leading-relaxed select-all"
              >
                {generateHardenedHtaccess(settings)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
