import React from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  Sparkles,
  TrendingUp,
  Search,
  BarChart3,
  Target,
  Zap,
  CheckCircle2,
  Home,
  ShieldCheck,
  FileText,
  Layers,
  Globe2,
  LineChart
} from 'lucide-react';

interface SeoPageProps {
  onBackToHome: () => void;
  onOpenConsultation: () => void;
}

export const SeoPage: React.FC<SeoPageProps> = ({
  onBackToHome,
  onOpenConsultation
}) => {
  const seoPillars = [
    {
      icon: Search,
      title: 'سئوی فنی و ساختاری (Technical SEO)',
      desc: 'رفع کامل خطاهای Crawl، بهینه‌سازی فایل Sitemap، فایل Robots.txt، بهبود سرعت بارگذاری و پیاده‌سازی متاداده‌های ساختاریافته (Schema Markup).'
    },
    {
      icon: Layers,
      title: 'استراتژی کلاسترینگ و معماری محتوا',
      desc: 'تحقیق عمیق کلمات کلیدی، آنالیز قصد کاربر (Search Intent)، ایجاد خوشه‌های محتوایی (Topic Clusters) و لینک‌سازی داخلی هوشمندانه.'
    },
    {
      icon: BarChart3,
      title: 'بهینه‌سازی نرخ تبدیل (CRO) و Core Web Vitals',
      desc: 'کاهش نرخ پرش (Bounce Rate)، بهبود شاخص‌های LCP، INP و CLS و هدایت ورودی‌های گوگل به سمت خرید و ثبت سفارش.'
    },
    {
      icon: Globe2,
      title: 'لینک‌سازی خارجی کلاه‌سفید و اعتبارسنجی برند',
      desc: 'کمپین‌های رئورپورتاژ آگهی تحلیل‌شده، جذب بک‌لینک‌های طبیعی و باکیفیت و ارتقای دامنه در الگوریتم‌های گوگل.'
    }
  ];

  const processSteps = [
    {
      num: '۰۱',
      title: 'ممیزی عمیق و آنالیز رقبای اصلی',
      desc: 'استخراج بیش از ۱۰۰ شاخص فنی، بررسی جایگاه فعلی کلمات کلیدی و آنالیز نقاط ضعف و قوت رقبای اصلی در حوزه شما.'
    },
    {
      num: '۰۲',
      title: 'رفع خطاهای فنی و بهینه‌سازی کدهای وب‌سایت',
      desc: 'اصلاح ساختار کدهای فرانت‌اند، بهینه‌سازی Core Web Vitals و فراهم کردن بستری امن و چابک برای موتورهای جستجو.'
    },
    {
      num: '۰۳',
      title: 'تولید و انتشار محتوای ارزش‌آفرین خوشه‌ای',
      desc: 'تدوین تقویم محتوایی هدفمند بر اساس پرسونای مخاطب و خلق مقالات و صفحات خدماتی متمایز.'
    },
    {
      num: '۰۴',
      title: 'تحلیل داده با GA4 و ارائه گزارش‌های شفاف',
      desc: 'مانیتورینگ مستمر رتبه‌ها، ورودی ارگانیک و نرخ تبدیل به همراه گزارش‌های رسمی ماهانه زنده.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#070609] text-gray-100 pt-24 pb-20 relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute top-10 right-0 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[220px] pointer-events-none" />
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-yellow-500/10 rounded-full blur-[200px] pointer-events-none" />

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header Breadcrumb Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-amber-500/15">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-200/50">
            <button onClick={onBackToHome} className="hover:text-white transition-colors flex items-center gap-1">
              <Home className="w-3.5 h-3.5 text-amber-400" />
              <span>صفحه اصلی</span>
            </button>
            <span>/</span>
            <span className="text-amber-400 font-semibold">سئو و بهینه‌سازی موتورهای جستجو</span>
          </div>

        </div>

        {/* Hero Banner */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#121017] border border-amber-500/30 text-amber-200 text-[11px] font-mono uppercase tracking-[0.2em] mb-4 rounded-[5px]">
            <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
            <span>رشد ارگانیک پایدار و ماندگار در گوگل</span>
          </span>

          <h1 className="text-[24px] font-black text-white tracking-tight leading-tight mb-6 uppercase">
            سئو و بهینه‌سازی دیتامحور <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500">
              تسلط بر صفحه اول گوگل
            </span>
          </h1>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onOpenConsultation}
              className="px-8 py-4 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold text-xs uppercase tracking-widest rounded-[5px] transition-all duration-300 cursor-pointer shadow-[0_0_20px_rgba(212,175,55,0.35)] flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>درخواست مشاوره و ممیزی سئو</span>
            </button>
          </div>
        </div>

        {/* Pillars Grid */}
        <div className="mb-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-mono text-amber-400 uppercase tracking-widest block mb-2">ارکان سئوی تخصصی</span>
            <h2 className="text-2xl sm:text-3xl font-black text-white uppercase">چهار ستون اصلی موفقیت در گوگل</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {seoPillars.map((p, idx) => {
              const Icon = p.icon;
              return (
                <div key={idx} className="glow-border-card trionn-tilt-card p-8 border border-amber-500/20 rounded-[5px] bg-[#121017]">
                  <div className="p-3 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-[5px] w-fit mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 uppercase">{p.title}</h3>
                  <p className="text-xs text-amber-100/70 font-light leading-relaxed">{p.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Process Steps */}
        <div className="mb-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-mono text-amber-400 uppercase tracking-widest block mb-2">فرآیند شفاف اجرا</span>
            <h2 className="text-2xl sm:text-3xl font-black text-white uppercase">مراحل پروژه سئو در سیگنالوکس</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {processSteps.map((s, idx) => (
              <div key={idx} className="glow-border-card p-6 border border-amber-500/20 rounded-[5px] bg-[#121017] relative">
                <span className="text-3xl font-mono font-black text-amber-400/30 block mb-2">{s.num}</span>
                <h3 className="text-base font-bold text-white mb-2 uppercase">{s.title}</h3>
                <p className="text-xs text-amber-100/60 font-light leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Banner */}
        <div className="glow-border-card p-8 sm:p-12 border border-amber-500/40 rounded-[5px] bg-gradient-to-r from-[#121017] via-[#1A1622] to-[#121017] text-center max-w-4xl mx-auto shadow-[0_0_30px_rgba(212,175,55,0.25)]">
          <LineChart className="w-8 h-8 text-amber-400 mx-auto mb-4" />
          <h2 className="text-2xl sm:text-3xl font-black text-white uppercase mb-8">می‌خواهید ورودی ارگانیک سایت خود را ۳ تا ۵ برابر کنید؟</h2>
          <button
            onClick={onOpenConsultation}
            className="px-8 py-4 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold text-xs uppercase tracking-widest rounded-[5px] transition-all cursor-pointer inline-flex items-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.4)]"
          >
            <span>درخواست آنالیز سئو و استعلام قیمت</span>
            <ArrowRight className="w-4 h-4 rotate-180" />
          </button>
        </div>

      </div>
    </div>
  );
};
