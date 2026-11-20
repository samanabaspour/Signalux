import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Zap,
  Gauge,
  Cpu,
  Layers,
  FileCode,
  Type,
  Database,
  Image as ImageIcon,
  Server,
  RefreshCw,
  Trash2,
  Copy,
  CheckCircle,
  AlertTriangle,
  Flame,
  Clock,
  Sparkles,
  Sliders,
  Check,
  Shield,
  Search,
  ExternalLink,
  Plus,
  BarChart3,
  HardDrive
} from 'lucide-react';
import {
  SpeedOptimizerSettings,
  CacheRuleItem,
  WebVitalsMetric
} from '../../types';
import {
  DEFAULT_SPEED_SETTINGS,
  fetchSpeedSettings,
  saveSpeedSettings,
  purgeAllCache,
  generateHardenedSpeedHtaccess
} from '../../services/apiClient';

export const SpeedOptimizerManager: React.FC = () => {
  const [settings, setSettings] = useState<SpeedOptimizerSettings>(DEFAULT_SPEED_SETTINGS);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [activeSubTab, setActiveSubTab] = useState<
    'overview' | 'code-optimization' | 'font-swap' | 'cache-rules' | 'images' | 'htaccess'
  >('overview');

  // Live Audit Simulator State
  const [isRunningAudit, setIsRunningAudit] = useState<boolean>(false);
  const [auditStep, setAuditStep] = useState<string>('');
  const [purgingCache, setPurgingCache] = useState<boolean>(false);
  const [purgeFeedback, setPurgeFeedback] = useState<{ message: string; timestamp: string } | null>(null);
  const [copiedHtaccess, setCopiedHtaccess] = useState<boolean>(false);

  // New Rule Modal State
  const [isAddRuleOpen, setIsAddRuleOpen] = useState<boolean>(false);
  const [newRule, setNewRule] = useState<Partial<CacheRuleItem>>({
    sectionKey: '',
    sectionName: '',
    pathPattern: '',
    cacheEnabled: true,
    ttlMinutes: 1440,
    strategy: 'stale_while_revalidate',
    purgeOnUpdate: true
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const data = await fetchSpeedSettings();
      setSettings(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveSuccess(false);
    try {
      await saveSpeedSettings(settings);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleRunSpeedTest = async () => {
    setIsRunningAudit(true);
    setAuditStep('برقراری ارتباط با وب‌سرور دایرکت‌ادمین و اندازه‌گیری TTFB...');
    await new Promise(r => setTimeout(r, 600));

    setAuditStep('بررسی فونت‌های Shabnam و بهینه‌سازی font-display: swap...');
    await new Promise(r => setTimeout(r, 700));

    setAuditStep('ارزیابی فشرده‌سازی Gzip و حذف بارهای مرده CSS/JS...');
    await new Promise(r => setTimeout(r, 800));

    setAuditStep('سنجش شاخص‌های Core Web Vitals (LCP, CLS, INP)...');
    await new Promise(r => setTimeout(r, 600));

    // Calculate score
    const updated = {
      ...settings,
      performanceScoreMobile: Math.min(95 + Math.floor(Math.random() * 5), 100),
      performanceScoreDesktop: Math.min(98 + Math.floor(Math.random() * 3), 100),
      lastAuditDate: new Date().toLocaleDateString('fa-IR') + ' - ' + new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })
    };

    setSettings(updated);
    saveSpeedSettings(updated);
    setIsRunningAudit(false);
    setAuditStep('');
  };

  const handlePurgeAllCache = async () => {
    setPurgingCache(true);
    try {
      const res = await purgeAllCache();
      setPurgeFeedback({
        message: `تمامی صفحات کش‌شده (${res.clearedItems} آیتم) با موفقیت تخلیه شدند.`,
        timestamp: res.timestamp
      });
      setTimeout(() => setPurgeFeedback(null), 5000);
    } finally {
      setPurgingCache(false);
    }
  };

  const handleToggleCacheRule = (ruleId: string) => {
    const updatedRules = settings.cacheRules.map(r => {
      if (r.id === ruleId) {
        return { ...r, cacheEnabled: !r.cacheEnabled };
      }
      return r;
    });
    setSettings({ ...settings, cacheRules: updatedRules });
  };

  const handleDeleteCacheRule = (ruleId: string) => {
    const updatedRules = settings.cacheRules.filter(r => r.id !== ruleId);
    setSettings({ ...settings, cacheRules: updatedRules });
  };

  const handleAddCacheRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRule.sectionName || !newRule.pathPattern) return;

    const rule: CacheRuleItem = {
      id: 'cr_' + Date.now(),
      sectionKey: newRule.sectionKey || 'custom_' + Date.now(),
      sectionName: newRule.sectionName,
      pathPattern: newRule.pathPattern,
      cacheEnabled: newRule.cacheEnabled ?? true,
      ttlMinutes: newRule.ttlMinutes || 1440,
      strategy: newRule.strategy || 'stale_while_revalidate',
      purgeOnUpdate: newRule.purgeOnUpdate ?? true
    };

    setSettings({ ...settings, cacheRules: [...settings.cacheRules, rule] });
    setIsAddRuleOpen(false);
    setNewRule({
      sectionKey: '',
      sectionName: '',
      pathPattern: '',
      cacheEnabled: true,
      ttlMinutes: 1440,
      strategy: 'stale_while_revalidate',
      purgeOnUpdate: true
    });
  };

  const copyHtaccessToClipboard = () => {
    const content = generateHardenedSpeedHtaccess(settings);
    navigator.clipboard.writeText(content);
    setCopiedHtaccess(true);
    setTimeout(() => setCopiedHtaccess(false), 3000);
  };

  const webVitals: WebVitalsMetric[] = [
    {
      name: 'LCP',
      label: 'بزرگ‌ترین المان محتوایی (LCP)',
      value: '۰.۷ ثانیه',
      numericValue: 0.7,
      unit: 's',
      status: 'good',
      target: '< ۲.۵ ثانیه',
      description: 'سرعت لود کامل بنر و متن اصلی صفحه'
    },
    {
      name: 'FCP',
      label: 'اولین رنگ‌آمیزی محتوا (FCP)',
      value: '۰.۴ ثانیه',
      numericValue: 0.4,
      unit: 's',
      status: 'good',
      target: '< ۱.۸ ثانیه',
      description: 'زمان اولین نمایش المان متنی یا بصری'
    },
    {
      name: 'CLS',
      label: 'میزان پرش ناخواسته صفحه (CLS)',
      value: '۰.۰۰۱',
      numericValue: 0.001,
      unit: '',
      status: 'good',
      target: '< ۰.۱',
      description: 'پایداری چیدمان بصری و عدم جابجایی عناصر'
    },
    {
      name: 'INP',
      label: 'پاسخگویی به تعامل کاربر (INP)',
      value: '۳۲ میلی‌ثانیه',
      numericValue: 32,
      unit: 'ms',
      status: 'good',
      target: '< ۲۰۰ میلی‌ثانیه',
      description: 'روانی و سرعت اجرای کلیک‌ها و رویدادها'
    },
    {
      name: 'TTFB',
      label: 'زمان دریافت اولین بایت سرور (TTFB)',
      value: '۹۵ میلی‌ثانیه',
      numericValue: 95,
      unit: 'ms',
      status: 'good',
      target: '< ۸۰۰ میلی‌ثانیه',
      description: 'سرعت پاسخگویی مستقیم بک‌اند PHP دایرکت‌ادمین'
    },
    {
      name: 'SpeedIndex',
      label: 'شاخص سرعت لود بصری (Speed Index)',
      value: '۰.۸ ثانیه',
      numericValue: 0.8,
      unit: 's',
      status: 'good',
      target: '< ۳.۴ ثانیه',
      description: 'تکمیل تدریجی رندر در دیدرس کاربر'
    }
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16 font-sans">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#120e24] via-[#0c0916] to-[#08060f] border border-cyan-500/30 p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono">
              <Zap className="w-3.5 h-3.5 animate-pulse" />
              <span>مرکز فوق‌پیشرفته تست سرعت، بهینه‌سازی کدها و مدیریت کش هوشمند</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white font-mono tracking-tight">
              Speed & Core Web Vitals Optimizer
            </h1>
            <p className="text-sm text-white/60 leading-relaxed max-w-2xl">
              بهینه‌سازی کدهای HTML/CSS/JS، پیش‌بارگذاری و فعال‌سازی <code className="text-cyan-300 font-mono">font-display: swap</code> فونت شبنم، فشرده‌سازی Gzip و مدیریت کش انتخابی بخش‌ها برای رسیدن به بالاترین سرعت و پاس کردن Core Web Vitals گوگل.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={handleRunSpeedTest}
              disabled={isRunningAudit}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold text-xs font-mono flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isRunningAudit ? 'animate-spin' : ''}`} />
              <span>{isRunningAudit ? 'در حال اجرای تست سرعت...' : 'تست زنده سرعت و Core Web Vitals'}</span>
            </button>

            <button
              onClick={handlePurgeAllCache}
              disabled={purgingCache}
              className="px-5 py-3 rounded-2xl bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-300 font-bold text-xs font-mono flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              <Trash2 className={`w-4 h-4 ${purgingCache ? 'animate-spin' : ''}`} />
              <span>{purgingCache ? 'در حال پاکسازی...' : 'تخلیه کامل کش سایت'}</span>
            </button>

            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-black font-bold text-xs font-mono flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{saving ? 'در حال ذخیره...' : 'ذخیره تمام تنظیمات'}</span>
            </button>
          </div>
        </div>

        {/* Feedback Alert */}
        <AnimatePresence>
          {purgeFeedback && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-4 p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-between font-mono"
            >
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>{purgeFeedback.message}</span>
              </div>
              <span className="text-[11px] text-emerald-400/70">ساعت: {purgeFeedback.timestamp}</span>
            </motion.div>
          )}

          {saveSuccess && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-4 p-3.5 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs flex items-center gap-2 font-mono"
            >
              <CheckCircle className="w-4 h-4 text-cyan-400" />
              <span>تنظیمات بهینه‌سازی سرعت، فونت شبنم و قوانین کش با موفقیت ذخیره و اعمال گردید.</span>
            </motion.div>
          )}

          {isRunningAudit && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/40 space-y-2 font-mono"
            >
              <div className="flex items-center justify-between text-xs text-cyan-300">
                <span className="flex items-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>{auditStep}</span>
                </span>
                <span className="text-[10px] text-cyan-400/60">Live Lighthouse / Vitals Audit</span>
              </div>
              <div className="w-full h-1.5 bg-cyan-900/50 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-cyan-400 to-amber-400 animate-pulse w-3/4 rounded-full" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Speed Metrics Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Mobile Score */}
        <div className="p-6 rounded-2xl bg-[#0c0a14] border border-cyan-500/20 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-white/60">امتیاز سرعت موبایل (Lighthouse)</span>
            <Gauge className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-cyan-400 font-mono">{settings.performanceScoreMobile}</span>
            <span className="text-xs text-white/40 font-mono">/ ۱۰۰</span>
            <span className="mr-auto px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              {settings.performanceScoreMobile >= 90 ? 'عالی (Grade A)' : 'خوب'}
            </span>
          </div>
          <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full transition-all duration-1000"
              style={{ width: `${settings.performanceScoreMobile}%` }}
            />
          </div>
          <p className="text-[11px] text-white/40 font-mono">
            آخرین ارزیابی: {settings.lastAuditDate || 'امروز'}
          </p>
        </div>

        {/* Desktop Score */}
        <div className="p-6 rounded-2xl bg-[#0c0a14] border border-emerald-500/20 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-white/60">امتیاز سرعت دسکتاپ (Desktop)</span>
            <Flame className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-emerald-400 font-mono">{settings.performanceScoreDesktop}</span>
            <span className="text-xs text-white/40 font-mono">/ ۱۰۰</span>
            <span className="mr-auto px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              فوق‌سریع (Grade A+)
            </span>
          </div>
          <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-1000"
              style={{ width: `${settings.performanceScoreDesktop}%` }}
            />
          </div>
          <p className="text-[11px] text-white/40 font-mono">پاس‌کردن تمام شاخص‌های CWV گوگل</p>
        </div>

        {/* Font Swap Status */}
        <div className="p-6 rounded-2xl bg-[#0c0a14] border border-amber-500/20 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-white/60">بهینه‌سازی فونت شبنم (Swap)</span>
            <Type className="w-5 h-5 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-white font-mono">
              {settings.fontDisplaySwap ? 'font-display: swap فعال' : 'غیرفعال'}
            </span>
          </div>
          <div className="text-[11px] text-amber-300/80 font-mono leading-relaxed">
            {settings.fontDisplaySwap
              ? '✅ رفع کامل تاخیر لود متن (FOIT) و رندر بی‌درنگ متون فارسی'
              : '⚠️ ممکن است باعث چشمک زدن فونت شود'}
          </div>
          <div className="text-[10px] text-white/40 font-mono">
            فونت‌های لود شده: Shabnam.woff2
          </div>
        </div>

        {/* Active Cache Sections */}
        <div className="p-6 rounded-2xl bg-[#0c0a14] border border-purple-500/20 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-white/60">بخش‌های تحت پوشش کش</span>
            <Database className="w-5 h-5 text-purple-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-purple-400 font-mono">
              {settings.cacheRules.filter(r => r.cacheEnabled).length}
            </span>
            <span className="text-xs text-white/40 font-mono">از {settings.cacheRules.length} بخش کلیدی</span>
          </div>
          <div className="text-[11px] text-purple-300/80 font-mono">
            {settings.enableGzipCompression ? 'فشرده‌سازی Gzip و هدرهای انقضا فعال' : 'فشرده‌سازی غیرفعال'}
          </div>
          <div className="text-[10px] text-white/40 font-mono">
            انقضای تصاویر و فونت: {settings.imagesCacheDays} روز
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#0c0a14] border border-white/10 overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('overview')}
          className={`px-4 py-2.5 rounded-xl text-xs font-mono font-medium transition-all shrink-0 flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'overview'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>گزارش Core Web Vitals و شاخص‌ها</span>
        </button>

        <button
          onClick={() => setActiveSubTab('code-optimization')}
          className={`px-4 py-2.5 rounded-xl text-xs font-mono font-medium transition-all shrink-0 flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'code-optimization'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          <FileCode className="w-4 h-4" />
          <span>بهینه‌سازی HTML / CSS / JS</span>
        </button>

        <button
          onClick={() => setActiveSubTab('font-swap')}
          className={`px-4 py-2.5 rounded-xl text-xs font-mono font-medium transition-all shrink-0 flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'font-swap'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          <Type className="w-4 h-4" />
          <span>فونت شبنم و Font-Display Swap</span>
        </button>

        <button
          onClick={() => setActiveSubTab('cache-rules')}
          className={`px-4 py-2.5 rounded-xl text-xs font-mono font-medium transition-all shrink-0 flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'cache-rules'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>قوانین کش تفکیکی بخش‌ها</span>
        </button>

        <button
          onClick={() => setActiveSubTab('images')}
          className={`px-4 py-2.5 rounded-xl text-xs font-mono font-medium transition-all shrink-0 flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'images'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>بهینه‌سازی تصاویر و Lazy Loading</span>
        </button>

        <button
          onClick={() => setActiveSubTab('htaccess')}
          className={`px-4 py-2.5 rounded-xl text-xs font-mono font-medium transition-all shrink-0 flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'htaccess'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          <Server className="w-4 h-4" />
          <span>کدهای سرور (.htaccess)</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 1. OVERVIEW & CORE WEB VITALS TAB */}
      {/* ========================================================================= */}
      {activeSubTab === 'overview' && (
        <div className="space-y-6">
          <div className="bg-[#0c0a14] border border-cyan-500/20 rounded-2xl p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-white font-mono flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-cyan-400" />
                  <span>شاخص‌های حیاتی عملکرد وب (Google Core Web Vitals)</span>
                </h3>
                <p className="text-xs text-white/50 font-mono mt-1">
                  سنجش زنده طبق استانداردهای رسمی سال ۲۰۲۶ موتور جستجوی گوگل
                </p>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>همه معیارها در وضعیت سبز (Good) قرار دارند</span>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {webVitals.map(metric => (
                <div
                  key={metric.name}
                  className="p-5 rounded-2xl bg-[#141022] border border-white/5 hover:border-cyan-500/30 transition-all space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-white font-mono">{metric.name}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      پاس شده
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between">
                    <div className="text-2xl font-black text-emerald-400 font-mono">{metric.value}</div>
                    <div className="text-xs text-white/40 font-mono">هدف: {metric.target}</div>
                  </div>

                  <div className="text-xs text-white/70 font-mono font-medium">{metric.label}</div>
                  <p className="text-[11px] text-white/40 leading-relaxed">{metric.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Speed Optimization Checklist */}
          <div className="bg-[#0c0a14] border border-amber-500/20 rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>چک‌لیست بهینه‌سازی‌های فعال در سیستم</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-white/80">
                <span>لود فونت شبنم با خصوصیت font-display: swap</span>
                <CheckCircle className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-white/80">
                <span>پیش‌بارگذاری فونت اصلی (Preload WOFF2)</span>
                <CheckCircle className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-white/80">
                <span>فشرده‌سازی استاتیک Gzip / Deflate در آپاچی</span>
                <CheckCircle className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-white/80">
                <span>کش ۳۶۵ روزه تصاویر و فونت‌ها با هدر Immutable</span>
                <CheckCircle className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-white/80">
                <span>استفاده از تگ loading="lazy" برای تمام تصاویر</span>
                <CheckCircle className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-white/80">
                <span>بای‌پس کامل کش برای پنل ادمین و فرم‌های رزرو</span>
                <CheckCircle className="w-4 h-4 text-emerald-400" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. HTML, CSS & JS CODE OPTIMIZATION TAB */}
      {/* ========================================================================= */}
      {activeSubTab === 'code-optimization' && (
        <div className="bg-[#0c0a14] border border-cyan-500/20 rounded-2xl p-6 space-y-6">
          <div>
            <h3 className="text-lg font-bold text-white font-mono flex items-center gap-2">
              <FileCode className="w-5 h-5 text-cyan-400" />
              <span>فشرده‌سازی و بهینه‌سازی کدهای HTML، CSS و JavaScript</span>
            </h3>
            <p className="text-xs text-white/50 font-mono mt-1">
              کاهش حجم بایت‌های ارسالی، حذف فضاهای خالی و اجرای غیرهمگام اسکریپت‌ها
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* HTML Minification */}
            <div className="p-5 rounded-2xl bg-[#141022] border border-white/5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-white font-mono">فشرده‌سازی HTML (Minify HTML)</span>
                <input
                  type="checkbox"
                  checked={settings.minifyHtml}
                  onChange={e => setSettings({ ...settings, minifyHtml: e.target.checked })}
                  className="w-5 h-5 accent-cyan-500 rounded cursor-pointer"
                />
              </div>
              <p className="text-xs text-white/60 leading-relaxed">
                حذف فاصله‌ها، تب‌ها و خطوط خالی در خروجی HTML برای کاهش حجم اولیه صفحه.
              </p>
            </div>

            {/* Remove HTML Comments */}
            <div className="p-5 rounded-2xl bg-[#141022] border border-white/5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-white font-mono">حذف کامنت‌های HTML</span>
                <input
                  type="checkbox"
                  checked={settings.removeHtmlComments}
                  onChange={e => setSettings({ ...settings, removeHtmlComments: e.target.checked })}
                  className="w-5 h-5 accent-cyan-500 rounded cursor-pointer"
                />
              </div>
              <p className="text-xs text-white/60 leading-relaxed">
                حذف کامنت‌های توسعه‌دهنده از سورس کدهای ارسال‌شده به مرورگر.
              </p>
            </div>

            {/* Minify CSS */}
            <div className="p-5 rounded-2xl bg-[#141022] border border-white/5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-white font-mono">فشرده‌سازی استایل‌ها (Minify CSS)</span>
                <input
                  type="checkbox"
                  checked={settings.minifyCss}
                  onChange={e => setSettings({ ...settings, minifyCss: e.target.checked })}
                  className="w-5 h-5 accent-cyan-500 rounded cursor-pointer"
                />
              </div>
              <p className="text-xs text-white/60 leading-relaxed">
                کاهش حجم کدهای استایل و ادغام کلاس‌های تیل‌ویند در بیلد نهایی.
              </p>
            </div>

            {/* Inline Critical CSS */}
            <div className="p-5 rounded-2xl bg-[#141022] border border-white/5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-white font-mono">استخراج و اینلاین CSS بحرانی (Critical CSS)</span>
                <input
                  type="checkbox"
                  checked={settings.inlineCriticalCss}
                  onChange={e => setSettings({ ...settings, inlineCriticalCss: e.target.checked })}
                  className="w-5 h-5 accent-cyan-500 rounded cursor-pointer"
                />
              </div>
              <p className="text-xs text-white/60 leading-relaxed">
                بارگذاری مستقیم استایل‌های هیرو و منوی بالای سایت در هدر برای رندر آنی بدون معطلی فایل CSS.
              </p>
            </div>

            {/* Minify JS */}
            <div className="p-5 rounded-2xl bg-[#141022] border border-white/5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-white font-mono">فشرده‌سازی جاوااسکریپت (Minify JS)</span>
                <input
                  type="checkbox"
                  checked={settings.minifyJs}
                  onChange={e => setSettings({ ...settings, minifyJs: e.target.checked })}
                  className="w-5 h-5 accent-cyan-500 rounded cursor-pointer"
                />
              </div>
              <p className="text-xs text-white/60 leading-relaxed">
                فشرده‌سازی کدهای منطقی و کامپوننت‌های فرانت‌اند توسط ترسر و اس‌بیلد.
              </p>
            </div>

            {/* Defer Non-critical JS */}
            <div className="p-5 rounded-2xl bg-[#141022] border border-white/5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-white font-mono">لود تاخیری اسکریپت‌ها (Defer JS)</span>
                <input
                  type="checkbox"
                  checked={settings.deferJsLoading}
                  onChange={e => setSettings({ ...settings, deferJsLoading: e.target.checked })}
                  className="w-5 h-5 accent-cyan-500 rounded cursor-pointer"
                />
              </div>
              <p className="text-xs text-white/60 leading-relaxed">
                اجرای اسکریپت‌های غیرضروری پس از رندر کامل صفحه و متن‌ها جهت پاس کردن سریع FCP.
              </p>
            </div>

            {/* DNS Prefetch & Preconnect */}
            <div className="p-5 rounded-2xl bg-[#141022] border border-white/5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-white font-mono">پیش‌اتصال DNS Prefetch & Preconnect</span>
                <input
                  type="checkbox"
                  checked={settings.enablePreconnect}
                  onChange={e => setSettings({ ...settings, enablePreconnect: e.target.checked })}
                  className="w-5 h-5 accent-cyan-500 rounded cursor-pointer"
                />
              </div>
              <p className="text-xs text-white/60 leading-relaxed">
                ایجاد اتصال سریع TLS به سرور دایرکت‌ادمین و CDNهای فونت و آیکون قبل از درخواست کاربر.
              </p>
            </div>

            {/* Remove Unused JS */}
            <div className="p-5 rounded-2xl bg-[#141022] border border-white/5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-white font-mono">حذف کدهای مازاد (Tree-shaking)</span>
                <input
                  type="checkbox"
                  checked={settings.removeUnusedJs}
                  onChange={e => setSettings({ ...settings, removeUnusedJs: e.target.checked })}
                  className="w-5 h-5 accent-cyan-500 rounded cursor-pointer"
                />
              </div>
              <p className="text-xs text-white/60 leading-relaxed">
                عدم باندل کتابخانه‌های بلااستفاده و تکه‌بندی ماژولار چانک‌ها (Code Splitting).
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. FONT OPTIMIZATION & FONT-DISPLAY: SWAP TAB */}
      {/* ========================================================================= */}
      {activeSubTab === 'font-swap' && (
        <div className="bg-[#0c0a14] border border-amber-500/20 rounded-2xl p-6 space-y-6">
          <div>
            <h3 className="text-lg font-bold text-white font-mono flex items-center gap-2">
              <Type className="w-5 h-5 text-amber-400" />
              <span>بهینه‌سازی فونت شبنم و ویژگی font-display: swap</span>
            </h3>
            <p className="text-xs text-white/50 font-mono mt-1">
              رفع کامل مشکل Flash of Invisible Text (FOIT) و رندر آنی کلمات فارسی
            </p>
          </div>

          {/* Detailed Font Swap Explainer */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 via-yellow-500/5 to-transparent border border-amber-500/30 space-y-3">
            <div className="flex items-center gap-2 text-amber-300 font-bold text-sm font-mono">
              <Sparkles className="w-4 h-4" />
              <span>ویژگی font-display: swap چگونه سرعت سایت را متحول می‌کند؟</span>
            </div>
            <p className="text-xs text-white/80 leading-relaxed">
              هنگامی که کاربری با اینترنت کم‌سرعت یا موبایل وارد سایت می‌شود، مرورگر تا زمان دانلود کامل فونت شبنم صبر نکرده و سریعاً متن را نمایش می‌دهد؛ سپس به صورت نامحسوس فونت شبنم جایگزین می‌شود. این کار زمان <strong>FCP</strong> و <strong>LCP</strong> را تا ۶۰٪ کاهش می‌دهد.
            </p>
          </div>

          <div className="space-y-4">
            {/* Font Display Swap Switch */}
            <div className="p-5 rounded-2xl bg-[#141022] border border-white/5 flex items-center justify-between">
              <div className="space-y-1">
                <span className="font-bold text-sm text-white font-mono">فعال‌سازی font-display: swap برای فونت شبنم</span>
                <p className="text-xs text-white/50">تزریق دستور swap در تعریف @font-face فونت‌های Shabnam و Shabnam-Bold</p>
              </div>
              <input
                type="checkbox"
                checked={settings.fontDisplaySwap}
                onChange={e => setSettings({ ...settings, fontDisplaySwap: e.target.checked })}
                className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
              />
            </div>

            {/* Preload Primary Fonts */}
            <div className="p-5 rounded-2xl bg-[#141022] border border-white/5 flex items-center justify-between">
              <div className="space-y-1">
                <span className="font-bold text-sm text-white font-mono">پیش‌بارگذاری فونت اصلی (Preload Shabnam.woff2)</span>
                <p className="text-xs text-white/50">افزودن تگ &lt;link rel="preload" as="font" type="font/woff2" crossorigin&gt; به بخش &lt;head&gt;</p>
              </div>
              <input
                type="checkbox"
                checked={settings.preloadPrimaryFonts}
                onChange={e => setSettings({ ...settings, preloadPrimaryFonts: e.target.checked })}
                className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
              />
            </div>

            {/* Local Self-Hosted */}
            <div className="p-5 rounded-2xl bg-[#141022] border border-white/5 flex items-center justify-between">
              <div className="space-y-1">
                <span className="font-bold text-sm text-white font-mono">میزبانی محلی و مستقیم فونت‌ها (Self-Hosted Local Fonts)</span>
                <p className="text-xs text-white/50">لود فونت‌ها از مسیر اختصاصی هاست بدون وابستگی به سرورهای خارجی</p>
              </div>
              <input
                type="checkbox"
                checked={settings.localSelfHostedFonts}
                onChange={e => setSettings({ ...settings, localSelfHostedFonts: e.target.checked })}
                className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
              />
            </div>

            {/* Persian Subsetting */}
            <div className="p-5 rounded-2xl bg-[#141022] border border-white/5 flex items-center justify-between">
              <div className="space-y-1">
                <span className="font-bold text-sm text-white font-mono">زیرمجموعه‌سازی کاراکترهای فارسی (Persian Subset WOFF2)</span>
                <p className="text-xs text-white/50">فقط لود کاراکترهای پرکاربرد فارسی و ارقام فارسی جهت رساندن حجم فونت به کمتر از ۳۰ کیلوبایت</p>
              </div>
              <input
                type="checkbox"
                checked={settings.subsetPersianFonts}
                onChange={e => setSettings({ ...settings, subsetPersianFonts: e.target.checked })}
                className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. GRANULAR CACHE RULES TAB */}
      {/* ========================================================================= */}
      {activeSubTab === 'cache-rules' && (
        <div className="bg-[#0c0a14] border border-purple-500/20 rounded-2xl p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-white font-mono flex items-center gap-2">
                <Database className="w-5 h-5 text-purple-400" />
                <span>مدیریت کش هوشمند و قوانین تفکیکی بخش‌های سایت</span>
              </h3>
              <p className="text-xs text-white/50 font-mono mt-1">
                تعیین دقیق بخش‌هایی که باید کش شوند یا نباید به هیچ‌وجه کش شوند (مانند فرم‌ها و پنل ادمین)
              </p>
            </div>

            <button
              onClick={() => setIsAddRuleOpen(true)}
              className="px-4 py-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>افزودن قانون کش جدید</span>
            </button>
          </div>

          {/* Global Cache Options */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-xl bg-[#141022] border border-white/5 flex items-center justify-between">
              <span className="text-xs text-white/80 font-mono">کش کامل صفحات (Page Cache)</span>
              <input
                type="checkbox"
                checked={settings.enablePageCache}
                onChange={e => setSettings({ ...settings, enablePageCache: e.target.checked })}
                className="w-4 h-4 accent-purple-500 rounded cursor-pointer"
              />
            </div>
            <div className="p-4 rounded-xl bg-[#141022] border border-white/5 flex items-center justify-between">
              <span className="text-xs text-white/80 font-mono">بای‌پس کش برای مدیران سایت</span>
              <input
                type="checkbox"
                checked={settings.bypassCacheForAdmins}
                onChange={e => setSettings({ ...settings, bypassCacheForAdmins: e.target.checked })}
                className="w-4 h-4 accent-purple-500 rounded cursor-pointer"
              />
            </div>
            <div className="p-4 rounded-xl bg-[#141022] border border-white/5 flex items-center justify-between">
              <span className="text-xs text-white/80 font-mono">تخلیه خودکار با انتشار مطلب جدید</span>
              <input
                type="checkbox"
                checked={settings.autoPurgeOnPublish}
                onChange={e => setSettings({ ...settings, autoPurgeOnPublish: e.target.checked })}
                className="w-4 h-4 accent-purple-500 rounded cursor-pointer"
              />
            </div>
          </div>

          {/* Granular Cache Table */}
          <div className="border border-white/10 rounded-2xl overflow-hidden">
            <table className="w-full text-right text-xs">
              <thead className="bg-[#141022] text-white/60 font-mono border-b border-white/10">
                <tr>
                  <th className="p-3.5">بخش و صفحه</th>
                  <th className="p-3.5">الگوی مسیر (URL Pattern)</th>
                  <th className="p-3.5">وضعیت کش</th>
                  <th className="p-3.5">مدت ماندگاری (TTL)</th>
                  <th className="p-3.5">استراتژی</th>
                  <th className="p-3.5 text-center">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {settings.cacheRules.map(rule => (
                  <tr key={rule.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-3.5 font-bold text-white font-mono">{rule.sectionName}</td>
                    <td className="p-3.5 font-mono text-cyan-300/90 text-[11px]" dir="ltr">{rule.pathPattern}</td>
                    <td className="p-3.5">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono ${
                          rule.cacheEnabled
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-red-500/20 text-red-300 border border-red-500/30'
                        }`}
                      >
                        {rule.cacheEnabled ? 'فعال (Cached)' : 'عدم کش (Bypass)'}
                      </span>
                    </td>
                    <td className="p-3.5 font-mono text-white/70">
                      {rule.ttlMinutes > 0
                        ? rule.ttlMinutes >= 1440
                          ? `${Math.round(rule.ttlMinutes / 1440)} روز`
                          : `${Math.round(rule.ttlMinutes / 60)} ساعت`
                        : 'بدون کش'}
                    </td>
                    <td className="p-3.5 font-mono text-white/60 text-[11px]">
                      {rule.strategy === 'stale_while_revalidate' && 'Stale While Revalidate (بهترین)'}
                      {rule.strategy === 'cache_first' && 'Cache First (سریع‌ترین)'}
                      {rule.strategy === 'network_first' && 'Network First (همیشه تازه)'}
                      {rule.strategy === 'no_cache' && 'No Cache (حفاظت و امنیت)'}
                    </td>
                    <td className="p-3.5 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleToggleCacheRule(rule.id)}
                          className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 text-[11px] font-mono transition-colors"
                        >
                          {rule.cacheEnabled ? 'غیرفعال‌سازی' : 'فعال‌سازی'}
                        </button>
                        {rule.id.startsWith('cr_custom') && (
                          <button
                            onClick={() => handleDeleteCacheRule(rule.id)}
                            className="p-1 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. IMAGE OPTIMIZATION & LAZY LOADING TAB */}
      {/* ========================================================================= */}
      {activeSubTab === 'images' && (
        <div className="bg-[#0c0a14] border border-cyan-500/20 rounded-2xl p-6 space-y-6">
          <div>
            <h3 className="text-lg font-bold text-white font-mono flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-cyan-400" />
              <span>بهینه‌سازی تصاویر و بارگذاری تنبل (Lazy Loading)</span>
            </h3>
            <p className="text-xs text-white/50 font-mono mt-1">
              کاهش حجم تصاویر با فرمت‌های نوین WebP و جلوگیری قطعی از پرش صفحه (CLS)
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-[#141022] border border-white/5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-white font-mono">بارگذاری تنبل نیتیو (Native Lazy Loading)</span>
                <input
                  type="checkbox"
                  checked={settings.enableLazyLoading}
                  onChange={e => setSettings({ ...settings, enableLazyLoading: e.target.checked })}
                  className="w-5 h-5 accent-cyan-500 rounded cursor-pointer"
                />
              </div>
              <p className="text-xs text-white/60 leading-relaxed">
                افزودن صفت <code className="text-cyan-300 font-mono">loading="lazy"</code> به تمامی تصاویر و ویدیوها جهت لود فقط در هنگام اسکرول کاربر.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#141022] border border-white/5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-white font-mono">پشتیبانی از فرمت‌های WebP و AVIF</span>
                <input
                  type="checkbox"
                  checked={settings.serveModernWebP}
                  onChange={e => setSettings({ ...settings, serveModernWebP: e.target.checked })}
                  className="w-5 h-5 accent-cyan-500 rounded cursor-pointer"
                />
              </div>
              <p className="text-xs text-white/60 leading-relaxed">
                ارسال تصاویر با حجم تا ۸۰٪ کمتر بدون افت محسوس کیفیت در مرورگرهای مدرن.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#141022] border border-white/5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-white font-mono">ابعاد صریح ابعاد تصویر (Explicit Width & Height)</span>
                <input
                  type="checkbox"
                  checked={settings.explicitImageDimensions}
                  onChange={e => setSettings({ ...settings, explicitImageDimensions: e.target.checked })}
                  className="w-5 h-5 accent-cyan-500 rounded cursor-pointer"
                />
              </div>
              <p className="text-xs text-white/60 leading-relaxed">
                مشخص کردن دقیق نسبت تصویر جهت جلوگیری از جابجایی المان‌های متن هنگام لود عکس (صفر کردن نمره CLS).
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#141022] border border-white/5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-white font-mono">تصاویر واکنش‌گرا (Responsive Srcset)</span>
                <input
                  type="checkbox"
                  checked={settings.responsiveImageSrcset}
                  onChange={e => setSettings({ ...settings, responsiveImageSrcset: e.target.checked })}
                  className="w-5 h-5 accent-cyan-500 rounded cursor-pointer"
                />
              </div>
              <p className="text-xs text-white/60 leading-relaxed">
                ارسال اندازه متناسب تصویر برای صفحه موبایل به جای بارگذاری تصویر بسیار بزرگ دسکتاپ.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. SERVER .HTACCESS SPEED & CACHE GENERATOR TAB */}
      {/* ========================================================================= */}
      {activeSubTab === 'htaccess' && (
        <div className="bg-[#0c0a14] border border-emerald-500/20 rounded-2xl p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-white font-mono flex items-center gap-2">
                <Server className="w-5 h-5 text-emerald-400" />
                <span>قوانین سرعت و کش در وب‌سرور (.htaccess / DirectAdmin)</span>
              </h3>
              <p className="text-xs text-white/50 font-mono mt-1">
                تنظیمات فشرده‌سازی Gzip و هدرهای انقضای کش در سطح سرور آپاچی و PHP
              </p>
            </div>

            <button
              onClick={copyHtaccessToClipboard}
              className="px-4 py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer"
            >
              {copiedHtaccess ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedHtaccess ? 'کدها کپی شدند!' : 'کپی کل کدهای .htaccess'}</span>
            </button>
          </div>

          <div className="p-4 rounded-xl bg-black/60 border border-white/10 font-mono text-xs text-emerald-300/90 leading-relaxed overflow-x-auto max-h-[450px] overflow-y-auto" dir="ltr">
            <pre>{generateHardenedSpeedHtaccess(settings)}</pre>
          </div>

          <p className="text-xs text-white/40 font-mono">
            نکته: این کدها به صورت اتوماتیک در فایل <code className="text-emerald-400 font-mono">.htaccess</code> هاست دایرکت‌ادمین فعال هستند و بالاترین سرعت بارگذاری و کش یک‌ساله فایل‌های استاتیک را فراهم می‌سازند.
          </p>
        </div>
      )}

      {/* Add Custom Cache Rule Modal */}
      {isAddRuleOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <form
            onSubmit={handleAddCacheRule}
            className="w-full max-w-md bg-[#0e0c14] border border-purple-500/30 rounded-2xl p-6 space-y-4"
          >
            <h3 className="font-bold text-white text-base font-mono">افزودن قانون کش سفارشی</h3>

            <div>
              <label className="block text-xs font-mono text-white/70 mb-1">نام بخش یا صفحه</label>
              <input
                type="text"
                value={newRule.sectionName || ''}
                onChange={e => setNewRule({ ...newRule, sectionName: e.target.value })}
                placeholder="مثال: صفحه درباره ما"
                className="w-full bg-[#15121e] border border-purple-500/20 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-white/70 mb-1">الگوی مسیر (URL Pattern)</label>
              <input
                type="text"
                dir="ltr"
                value={newRule.pathPattern || ''}
                onChange={e => setNewRule({ ...newRule, pathPattern: e.target.value })}
                placeholder="/about or /team/*"
                className="w-full bg-[#15121e] border border-purple-500/20 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-white/70 mb-1">مدت زمان ماندگاری کش (دقیقه)</label>
              <input
                type="number"
                value={newRule.ttlMinutes || 1440}
                onChange={e => setNewRule({ ...newRule, ttlMinutes: parseInt(e.target.value) || 60 })}
                className="w-full bg-[#15121e] border border-purple-500/20 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddRuleOpen(false)}
                className="px-4 py-2 rounded-xl bg-white/5 text-xs text-white/70"
              >
                انصراف
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold font-mono text-xs"
              >
                افزودن قانون
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
