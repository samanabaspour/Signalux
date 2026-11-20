import React from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  Sparkles,
  Code2,
  Zap,
  Globe,
  Layers,
  Cpu,
  ShieldCheck,
  CheckCircle2,
  Home,
  Monitor,
  Smartphone,
  Gauge,
  Terminal,
  Layout,
  ExternalLink
} from 'lucide-react';

interface WebDesignPageProps {
  onBackToHome: () => void;
  onOpenConsultation: () => void;
  onViewProjects?: () => void;
}

export const WebDesignPage: React.FC<WebDesignPageProps> = ({
  onBackToHome,
  onOpenConsultation,
  onViewProjects
}) => {
  const capabilities = [
    {
      icon: Code2,
      title: 'معماری و کدنویسی اختصاصی بدون وردپرس/قالب آماده',
      desc: 'توسعه وب‌سایت با React 18، Next.js و TypeScript. ساختار کد به‌طور کامل برای بالاترین کارایی و بدون کدهای اضافی بهینه‌سازی می‌شود.'
    },
    {
      icon: Gauge,
      title: 'سرعت لود فوق‌العاده و امتیاز ۱۰۰ در Google Lighthouse',
      desc: 'بهینه‌سازی عمیق دارایی‌ها (Asset Optimization)، لود پیش‌رونده، رندر سمت سرور و کاهش تاخیر تا زیر ۵۰۰ میلی‌ثانیه.'
    },
    {
      icon: Layout,
      title: 'سیستم دیزاین اختصاصی و UI/UX منحصر‌به‌فرد',
      desc: 'طراحی گام‌به‌گام رابط کاربری در Figma بر اساس هویت بصری برند شما، با تمرکز بر انیمیشن‌های روان و تجربه کاربری بی‌نقص.'
    },
    {
      icon: ShieldCheck,
      title: 'امنیت چندلایه و مقاوم در برابر حملات DDoS',
      desc: 'زیرساخت‌های توزیع‌شده سرور، رمزنگاری اطلاعات، فایروال هوشمند API و گواهی‌های امنیتی معتبر.'
    },
    {
      icon: Smartphone,
      title: 'واکنش‌گرایی ۱۰۰٪ در تمامی دستگاه‌ها و صفحه‌نمایش‌ها',
      desc: 'نمایش بی‌نقص در تمامی ابعاد از موبایل‌های کوچک تا نمایشگرهای عریض ۴K با نرخ نوسازی ۶۰ فریم بر ثانیه.'
    },
    {
      icon: Terminal,
      title: 'اتصال آسان به کلیه درگاه‌ها، CRM و APIهای سازمانی',
      desc: 'قابلیت یکپارچه‌سازی کامل با درگاه‌های پرداخت، سیستم‌های حسابداری، انبارداری و پنل‌های پیامکی.'
    }
  ];

  const packages = [
    {
      title: 'وب‌سایت شرکتی و پرنتیک استاندارد',
      subtitle: 'مناسب برندها و شرکت‌های پیشرو جهت معرفی خدمات و اعتبار',
      features: [
        'طراحی اختصاصی UI/UX بر پایه هویت برند',
        'توسعه وب با React / Next.js',
        'پنل مدیریت محتوای فارسی و کاربرپسند',
        'بهینه‌سازی کامل سرعت و سئوی پایه',
        'پشتیبانی رایگان ۶ ماهه کتبی'
      ],
      tag: 'محبوب‌ترین انتخاب شرکت‌ها'
    },
    {
      title: 'پلتفرم فروشگاهی و E-Commerce پیشرفته',
      subtitle: 'برای فروشگاه‌های آنلاین با تراکنش بالا و نیاز به انبارداری هوشمند',
      features: [
        'سیستم سبد خرید چابک بدون رندر مجدد',
        'اتصال مستقیم به درگاه‌های پرداخت و پست',
        'جستجوی لحظه‌ای و فیلترهای پیشرفته محصولات',
        'پنل گزارش‌گیری مالی و انبارداری چندگانه',
        'پشتیبانی ۱۲ ماهه فنی و به‌روزرسانی'
      ],
      tag: 'مقیاس‌پذیر برای فروش بالا'
    },
    {
      title: 'سامانه و وب‌اپلیکیشن اختصاصی (SaaS)',
      subtitle: 'برای سامانه‌های پیچیده، پنل‌های کاربری اختصاصی و استارت‌آپ‌ها',
      features: [
        'معماری فرانت‌اند و بک‌اند اختصاصی',
        'احراز هویت چندعاملی و نقش‌های دسترسی',
        'یکپارچه‌سازی با هوش مصنوعی و سرویس‌های ابری',
        'تست‌های خودکار کارایی و نفوذپذیری',
        'پشتیبانی ۲۴/۷ اختصاصی و SLA'
      ],
      tag: 'سفارشی‌سازی ۱۰۰٪'
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
            <span className="text-amber-400 font-semibold">طراحی و توسعه وب‌سایت</span>
          </div>

        </div>

        {/* Hero Title */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#121017] border border-amber-500/30 text-amber-200 text-[11px] font-mono uppercase tracking-[0.2em] mb-4 rounded-[5px]">
            <Code2 className="w-3.5 h-3.5 text-amber-400" />
            <span>توسعه وب بر پایه استانداردهای جهانی ۲۰۲۶</span>
          </span>

          <h1 className="text-[24px] font-black text-white tracking-tight leading-tight mb-6 uppercase">
            طراحی و معماری وب‌سایت‌های <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500">
              اختصاصی، فوق‌سریع و امن
            </span>
          </h1>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onOpenConsultation}
              className="px-8 py-4 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold text-xs uppercase tracking-widest rounded-[5px] transition-all duration-300 cursor-pointer shadow-[0_0_20px_rgba(212,175,55,0.35)] flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>شروع مشاوره تخصصی طراحی سایت</span>
            </button>

            {onViewProjects && (
              <button
                onClick={onViewProjects}
                className="px-6 py-4 bg-[#121017] border border-amber-500/20 hover:border-amber-400 text-white text-xs font-bold uppercase tracking-wider rounded-[5px] transition-all cursor-pointer flex items-center gap-2"
              >
                <Monitor className="w-4 h-4 text-amber-400" />
                <span>مشاهده نمونه کارهای طراحی وب</span>
              </button>
            )}
          </div>
        </div>

        {/* Feature Grid */}
        <div className="mb-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-mono text-amber-400 uppercase tracking-widest block mb-2">تفاوت مهندسی سیگنالوکس</span>
            <h2 className="text-2xl sm:text-3xl font-black text-white uppercase">ویژگی‌های کلیدی پلتفرم‌های طراحی‌شده</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {capabilities.map((cap, idx) => {
              const Icon = cap.icon;
              return (
                <div key={idx} className="glow-border-card trionn-tilt-card p-6 border border-amber-500/20 rounded-[5px] bg-[#121017] flex flex-col justify-between">
                  <div>
                    <div className="p-3 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-[5px] w-fit mb-4">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-white mb-2 uppercase">{cap.title}</h3>
                    <p className="text-xs text-amber-100/60 font-light leading-relaxed mb-4">{cap.desc}</p>
                  </div>
                  <div className="pt-3 border-t border-amber-500/15 text-[11px] font-mono text-amber-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>تضمین اجرا با تست Lighthouse</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Development Packages */}
        <div className="mb-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-mono text-amber-400 uppercase tracking-widest block mb-2">سطوح سرمایه‌گذاری متناسب</span>
            <h2 className="text-2xl sm:text-3xl font-black text-white uppercase">پکیج‌های طراحی و توسعه وب</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {packages.map((pkg, idx) => (
              <div key={idx} className="glow-border-card p-8 border border-amber-500/20 rounded-[5px] bg-[#121017] flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600" />
                <div>
                  <span className="inline-block px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-mono uppercase rounded-[5px] mb-4">
                    {pkg.tag}
                  </span>
                  <h3 className="text-lg font-bold text-white mb-2 uppercase">{pkg.title}</h3>
                  <p className="text-xs text-amber-100/60 font-light mb-6 leading-relaxed">{pkg.subtitle}</p>

                  <div className="space-y-3 mb-8">
                    {pkg.features.map((f, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2 text-xs text-amber-100/80 font-light">
                        <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={onOpenConsultation}
                  className="w-full py-3.5 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold text-xs uppercase tracking-widest rounded-[5px] transition-all cursor-pointer flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(212,175,55,0.2)]"
                >
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>سفارش و مشاوره این پکیج</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Banner */}
        <div className="glow-border-card p-8 sm:p-12 border border-amber-500/40 rounded-[5px] bg-gradient-to-r from-[#121017] via-[#1A1622] to-[#121017] text-center max-w-4xl mx-auto shadow-[0_0_30px_rgba(212,175,55,0.25)]">
          <Sparkles className="w-8 h-8 text-amber-400 mx-auto mb-4" />
          <h2 className="text-2xl sm:text-3xl font-black text-white uppercase mb-4">آماده راه‌اندازی وب‌سایتی فراتر از انتظارات هستید؟</h2>
          <p className="text-amber-100/70 text-sm font-light mb-8 max-w-xl mx-auto">
            کارشناسان ما به صورت اختصاصی نیازهای پروژه شما را آنالیز کرده و پروپوزال فنی رایگان ارسال خواهند کرد.
          </p>
          <button
            onClick={onOpenConsultation}
            className="px-8 py-4 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold text-xs uppercase tracking-widest rounded-[5px] transition-all cursor-pointer inline-flex items-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.4)]"
          >
            <span>درخواست برآورد هزینه و جلسه مشاوره</span>
            <ArrowRight className="w-4 h-4 rotate-180" />
          </button>
        </div>

      </div>
    </div>
  );
};
