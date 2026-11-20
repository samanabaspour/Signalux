import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  Sparkles,
  Code2,
  TrendingUp,
  Megaphone,
  CheckCircle2,
  Zap,
  Cpu,
  Layers,
  Calculator,
  HelpCircle,
  Home,
  Check,
  LayoutTemplate,
  Palette
} from 'lucide-react';
import { SERVICES, SERVICE_PRICING_ESTIMATOR } from '../data';

interface ServicesPageProps {
  onBackToHome: () => void;
  onOpenConsultation: () => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({
  onBackToHome,
  onOpenConsultation
}) => {
  // Service Cost Estimator state
  const [selectedPillar, setSelectedPillar] = useState<'web' | 'seo' | 'marketing'>('web');
  const [scaleOptionIdx, setScaleOptionIdx] = useState(1); // Standard default

  const currentPillarData = SERVICE_PRICING_ESTIMATOR[selectedPillar];
  const currentOption = currentPillarData.options[scaleOptionIdx];

  const serviceCategories = [
    {
      id: 'web',
      icon: Code2,
      title: 'معماری و توسعه وب‌سایت‌های اختصاصی',
      subtitle: 'HIGH-PERFORMANCE WEB DEVELOPMENT',
      desc: 'ساخت پلتفرم‌های مدرن با React ،Next.js و افکت‌های سه‌بعدی WebGL با لود بار زیر ۱ ثانیه و امنیت کامل.',
      features: [
        'معماری اختصاصی بدون استفاده از قالب‌های سنگین آمادگی',
        'طراحی سیستم‌های طراحی (Design System) تعاملی و واکنش‌گرا',
        'امتیاز ۱۰۰ در تست‌های سرعت و عملکرد Google Lighthouse',
        'اتصال مستقیم به کلیه درگاه‌های بانکی، CRM و سرویس‌های API'
      ],
      techs: ['React 18', 'Next.js', 'TypeScript', 'Tailwind CSS', 'WebGL', 'Node.js']
    },
    {
      id: 'wp-custom',
      icon: Palette,
      title: 'طراحی سایت وردپرسی قالب اختصاصی',
      subtitle: 'CUSTOM WORDPRESS THEME DEVELOPMENT',
      desc: 'طراحی صفر تا صد گرافیک UI/UX در Figma و پیاده‌سازی پوسته کاملاً اختصاصی و کدنویسی‌شده وردپرس بدون کدهای زائد با سرعت نوری.',
      features: [
        'کدنویسی پوسته اختصاصی از پایه بر اساس فیگما بدون وابستگی به صفحه‌سازهای سنگین',
        'طراحی ساختار سفارشی و فیلدهای پیشرفته (ACF Pro) برای پنل مدیریت بسیار ساده',
        'سرعت لود فوق‌العاده بالا و سازگاری بی‌نقص با استانداردهای گوگل و سئو',
        'امنیت سخت‌گیرانه، بهینه‌سازی دیتابیس و کدهای سبک و تمیز PHP 8'
      ],
      techs: ['WordPress Dev', 'PHP 8+', 'ACF Pro', 'Tailwind CSS', 'Figma', 'MySQL']
    },
    {
      id: 'wp-ready',
      icon: LayoutTemplate,
      title: 'طراحی سایت وردپرسی قالب آماده',
      subtitle: 'WORDPRESS READY-MADE TEMPLATE DESIGN',
      desc: 'راه‌اندازی فوق‌العاده سریع و اقتصادی وب‌سایت‌های شرکتی، فروشگاهی و شخصی با قالب‌های مدرن، سبک و استانداردهای روز دنیا.',
      features: [
        'تحویل و راه‌اندازی فوری در سریع‌ترین زمان ممکن (۳ الی ۷ روز کاری)',
        'شخصی‌سازی دقیق هویت بصری، پالت رنگی و چیدمان متناسب با برند شما',
        'کانفیگ کامل افزونه‌های امنیتی، کش و شتاب‌دهنده سرعت (WP Rocket) و سئو پایه',
        'پنل کاربری و مدیریت ۱۰۰٪ فارسی همراه با آموزش کاربری کامل'
      ],
      techs: ['WordPress', 'Elementor Pro', 'WooCommerce', 'WP Rocket', 'Rank Math']
    },
    {
      id: 'seo',
      icon: TrendingUp,
      title: 'سئو و بهینه‌سازی دیتامحور موتورهای جستجو',
      subtitle: 'DATA-DRIVEN TECHNICAL SEO',
      desc: 'ارتقای پایدار رتبه وب‌سایت در رقابتی‌ترین کلمات کلیدی، بهینه‌سازی ساختار فنی و تولید محتوای ارزشمند.',
      features: [
        'آنالیز فنی و رفع عمیق خطاهای Technical SEO',
        'بهینه‌سازی شاخص‌های Core Web Vitals و سرعت ایندکس‌گذاری',
        'تدوین استراتژی محتوایی هدفمند و ایجاد ساختار کلاستری (Topic Clusters)',
        'افزایش نرخ تبدیل ورودی‌های ارگانیک به خریداران واقعی'
      ],
      techs: ['Search Console', 'Ahrefs', 'Semrush', 'Screaming Frog', 'Schema.org', 'GA4']
    },
    {
      id: 'marketing',
      icon: Megaphone,
      title: 'دیجیتال مارکتینگ و رشد ۳۶۰ درجه برند',
      subtitle: 'PERFORMANCE DIGITAL MARKETING',
      desc: 'طراحی کمپین‌های پربازده، افزایش آگاهی از برند و تحلیل مستمر رفتار کاربران برای بیشترین بازگشت سرمایه.',
      features: [
        'مدیریت و اجرای کمپین‌های تبلیغات کلیکی (Google Ads & Native)',
        'بهینه‌سازی نرخ تبدیل (CRO) و بازطراحی مسیر خریدار',
        'تحلیل دقیق قیف فروش و داده‌های رفتار کاربر (Heatmaps & Analytics)',
        'مدیریت هویت بصری و تولید محتوای اثرگذار برای شبکه‌های اجتماعی'
      ],
      techs: ['Google Ads', 'Hotjar', 'Google Analytics 4', 'Meta Business', 'Looker Studio']
    }
  ];

  const faqs = [
    {
      q: 'چرا ساخت وب‌سایت اختصاصی در سیگنالوکس برتر از قالب‌های آماده است؟',
      a: 'کدنویسی اختصاصی سرعت لود را تا ۵ برابر افزایش می‌دهد، امنیت کامل در برابر نفوذ را تضمین می‌کند و امکان توسعه بدون محدودیت را در آینده فراهم می‌سازد.'
    },
    {
      q: 'نتایج پروژه‌های سئو چقدر زمان می‌برد تا نمایان شود؟',
      a: 'بهینه‌سازی‌های فنی بلافاصله اثرگذارند. نتایج اولیه رشد ورودی گوگل معمولاً در ۶ تا ۱۲ هفته نخست قابل مشاهده است.'
    },
    {
      q: 'آیا پس از تحویل پروژه پشتیبانی فنی ارائه می‌شود؟',
      a: 'بله، تمامی پروژه‌های سیگنالوکس شامل پشتیبانی تضمین‌شده ۶ ماهه رایگان و آموزش کامل تیم شما می‌باشند.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#070609] text-gray-100 pt-24 pb-20 relative overflow-hidden">
      {/* Lighting Globs */}
      <div className="absolute top-10 right-0 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[220px] pointer-events-none" />
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-yellow-500/10 rounded-full blur-[200px] pointer-events-none" />

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-amber-500/15">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#121017] border border-amber-500/20 hover:border-amber-400/50 text-white text-xs font-bold uppercase tracking-wider rounded-[5px] transition-all cursor-pointer group"
          >
            <ArrowRight className="w-4 h-4 text-amber-400 group-hover:-translate-x-1 transition-transform" />
            <span>بازگشت به صفحه اصلی</span>
          </button>

          <div className="flex items-center gap-2 text-xs font-mono text-amber-200/50">
            <button onClick={onBackToHome} className="hover:text-white transition-colors flex items-center gap-1">
              <Home className="w-3.5 h-3.5 text-amber-400" />
              <span>صفحه اصلی</span>
            </button>
            <span>/</span>
            <span className="text-amber-400 font-semibold">خدمات تخصصی سیگنالوکس</span>
          </div>

          <button
            onClick={onOpenConsultation}
            className="px-4 py-2.5 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-slate-950 text-xs font-bold uppercase tracking-wider rounded-[5px] transition-all cursor-pointer flex items-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.25)]"
          >
            <Sparkles className="w-4 h-4 text-slate-950" />
            <span>استعلام هزینه و مشاوره</span>
          </button>
        </div>

        {/* Hero Banner */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#121017] border border-amber-500/30 text-amber-200 text-[11px] font-mono uppercase tracking-[0.2em] mb-4 rounded-[5px]">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>راهکارهای دیجیتال با بالاترین استاندارد</span>
          </span>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight mb-6 uppercase">
            خدمات تخصصی <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500">سیگنالوکس</span>
          </h1>
        </div>

        {/* Core Services Breakdown */}
        <div className="space-y-12 mb-20">
          {serviceCategories.map((sc, idx) => {
            const Icon = sc.icon;
            return (
              <div
                key={sc.id}
                className="glow-border-card trionn-tilt-card p-8 sm:p-10 border border-amber-500/20 rounded-[5px] bg-[#121017]"
                data-cursor-text="خدمت"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                  {/* Service Info */}
                  <div className="lg:col-span-7 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-[5px]">
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest block">{sc.subtitle}</span>
                        <h2 className="text-xl sm:text-2xl font-bold text-white uppercase">{sc.title}</h2>
                      </div>
                    </div>

                    <p className="text-amber-100/70 text-sm font-light leading-relaxed">
                      {sc.desc}
                    </p>

                    <div className="space-y-2.5 pt-2">
                      {sc.features.map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-start gap-2 text-xs text-amber-100/80">
                          <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tech Stack & CTA */}
                  <div className="lg:col-span-5 p-6 bg-[#070609] border border-amber-500/20 rounded-[5px] space-y-4">
                    <span className="text-xs font-mono text-amber-200/50 uppercase tracking-wider block">فناوری‌ها و ابزارهای مورد استفاده</span>
                    <div className="flex flex-wrap gap-2">
                      {sc.techs.map((t, tIdx) => (
                        <span key={tIdx} className="px-3 py-1 bg-[#121017] border border-amber-500/20 text-xs font-mono text-amber-300 rounded-[5px]">
                          {t}
                        </span>
                      ))}
                    </div>

                    <div className="pt-4 border-t border-amber-500/20">
                      <button
                        onClick={onOpenConsultation}
                        className="w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 text-xs font-bold uppercase tracking-wider rounded-[5px] transition-all cursor-pointer flex items-center justify-center gap-2"
                      >
                        <Sparkles className="w-4 h-4 text-slate-950" />
                        <span>ثبت سفارش برای {sc.title}</span>
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {/* Interactive Price & Timeline Estimator Widget */}
        <div className="glow-border-card p-8 sm:p-12 border border-amber-500/40 rounded-[5px] bg-[#121017] mb-20">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-amber-500/20">
            <Calculator className="w-6 h-6 text-amber-400" />
            <div>
              <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest block">برآورد هوشمند زمان و سرمایه‌گذاری</span>
              <h2 className="text-xl sm:text-2xl font-bold text-white uppercase">تخمین‌گر آنلاین هزینه و زمان پروژه</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* Controls */}
            <div className="lg:col-span-7 space-y-6">

              {/* Service Selection */}
              <div>
                <label className="text-xs font-mono text-amber-100/70 block mb-3">۱. انتخاب حوزه خدمت مورد نیاز:</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'web', label: 'توسعه وب' },
                    { id: 'seo', label: 'سئو و بهینه‌سازی' },
                    { id: 'marketing', label: 'دیجیتال مارکتینگ' },
                  ].map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setSelectedPillar(p.id as any);
                        setScaleOptionIdx(0);
                      }}
                      className={`py-3 px-2 text-xs font-bold uppercase tracking-wider rounded-[5px] border transition-all cursor-pointer text-center ${
                        selectedPillar === p.id
                          ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(212,175,55,0.3)]'
                          : 'bg-[#070609] border-amber-500/15 text-amber-100/60 hover:text-white'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Scale Options */}
              <div>
                <label className="text-xs font-mono text-amber-100/70 block mb-3">۲. انتخاب سطح و مقیاس پروژه:</label>
                <div className="space-y-3">
                  {currentPillarData.options.map((opt, idx) => (
                    <div
                      key={idx}
                      onClick={() => setScaleOptionIdx(idx)}
                      className={`p-4 rounded-[5px] border transition-all cursor-pointer flex items-center justify-between ${
                        scaleOptionIdx === idx
                          ? 'bg-amber-500/10 border-amber-400 text-white'
                          : 'bg-[#070609] border-amber-500/15 text-amber-100/70 hover:border-amber-400/30'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-bold uppercase mb-1">{opt.title}</div>
                        <div className="text-[11px] text-amber-200/50 font-light">{opt.desc}</div>
                      </div>
                      <div className="w-5 h-5 rounded-full border border-amber-400 flex items-center justify-center shrink-0 mr-3">
                        {scaleOptionIdx === idx && <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Estimation Results Panel */}
            <div className="lg:col-span-5 p-6 bg-[#070609] border border-amber-500/20 rounded-[5px] flex flex-col justify-between">
              <div className="space-y-4">
                <span className="text-xs font-mono text-amber-400 uppercase tracking-widest block">نتیجه برآورد اختصاصی</span>

                <div className="p-4 bg-[#121017] border border-amber-500/20 rounded-[5px]">
                  <span className="text-[10px] font-mono text-amber-200/50 uppercase block mb-1">حدود زمان تحویل پروژه</span>
                  <span className="text-xl font-bold font-mono text-amber-300">{currentOption.duration}</span>
                </div>

                <div className="p-4 bg-[#121017] border border-amber-400/50 rounded-[5px]">
                  <span className="text-[10px] font-mono text-amber-200/50 uppercase block mb-1">حدود سرمایه‌گذاری متناسب</span>
                  <span className="text-2xl font-black font-mono text-amber-400">{currentOption.priceRange}</span>
                </div>

                <div className="p-4 bg-[#121017] border border-amber-500/20 rounded-[5px]">
                  <span className="text-[10px] font-mono text-amber-200/50 uppercase block mb-2">دستاوردهای کلیدی شامل شده:</span>
                  <div className="space-y-1.5">
                    {currentOption.features.map((f, fIdx) => (
                      <div key={fIdx} className="text-[11px] text-amber-100/80 flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-amber-400" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={onOpenConsultation}
                className="w-full mt-6 py-3.5 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-slate-950 text-xs font-bold uppercase tracking-wider rounded-[5px] cursor-pointer hover:from-amber-400 hover:to-yellow-400 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.25)]"
              >
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>ثبت سفارش بر اساس این برآورد</span>
              </button>
            </div>

          </div>
        </div>

        {/* FAQs */}
        <div className="mb-16">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-mono text-amber-400 uppercase tracking-widest block mb-1">پاسخ به ابهامات</span>
            <h2 className="text-2xl sm:text-3xl font-black text-white uppercase">سوالات متداول کارفرمایان</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {faqs.map((faq, idx) => (
              <div key={idx} className="glow-border-card trionn-tilt-card p-6 border border-amber-500/20 rounded-[5px] bg-[#121017]">
                <HelpCircle className="w-5 h-5 text-amber-400 mb-3" />
                <h3 className="text-sm font-bold text-white mb-2">{faq.q}</h3>
                <p className="text-xs text-amber-100/60 font-light leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
