import React from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  Sparkles,
  Award,
  Users,
  Target,
  ShieldCheck,
  Zap,
  Globe,
  Cpu,
  Compass,
  CheckCircle2,
  Home,
  Linkedin,
  Instagram,
  Youtube,
  Mail
} from 'lucide-react';

interface AboutUsPageProps {
  onBackToHome: () => void;
  onOpenConsultation: () => void;
  onViewServices: () => void;
}

export const AboutUsPage: React.FC<AboutUsPageProps> = ({
  onBackToHome,
  onOpenConsultation,
  onViewServices
}) => {
  const teamMembers = [
    {
      name: 'سامان عباسپور',
      role: 'بنیان‌گذار و مدیر ارشد استراتژی',
      bio: '۱۰+ سال سابقه در معماری سیستم‌های توزیع‌شده، سئوی پیشرفته دیتامحور و رهبری تیم‌های فنی بومی.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
      socials: {
        instagram: 'https://instagram.com',
        youtube: 'https://youtube.com',
        linkedin: 'https://linkedin.com'
      }
    },
    {
      name: 'محمد یزدانی',
      role: 'رهبر فنی و معمار Front-End',
      bio: 'متخصص WebGL، توسعه تعاملی در وب و بهینه‌سازی عملکرد (Core Web Vitals) در مقیاس بالا.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
      socials: {
        instagram: 'https://instagram.com',
        youtube: 'https://youtube.com',
        linkedin: 'https://linkedin.com'
      }
    },
    {
      name: 'سجاد حمیدی',
      role: 'مدیر ارشد سئو و مارکتینگ',
      bio: 'طراح استراتژی‌های پیشرفته سئو تکنیکال و کمپین‌های رشد ارگانیک با تمرکز بر بازگشت سرمایه (ROI).',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400',
      socials: {
        instagram: 'https://instagram.com',
        youtube: 'https://youtube.com',
        linkedin: 'https://linkedin.com'
      }
    },
    {
      name: 'پویا رادمنش',
      role: 'طراح ارشد رابط کاربری (UI/UX)',
      bio: 'خالق دیزاین‌سیستم‌های مدرن، هویت بصری لوکس و تجربه‌های تعاملی خیره‌کننده با تمرکز بر روان‌شناسی کاربر.',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
      socials: {
        instagram: 'https://instagram.com',
        youtube: 'https://youtube.com',
        linkedin: 'https://linkedin.com'
      }
    }
  ];

  const coreValues = [
    {
      icon: ShieldCheck,
      title: 'معماری بدون تسلیم',
      desc: 'هیچ کد غیرضروری یا الگوی موقت در پروژه‌ها جای ندارد. تمام خطوط کد با متدولوژی‌های استاندارد بین‌المللی نوشتن می‌شوند.'
    },
    {
      icon: Target,
      title: 'نتیجه‌گرایی دیتامحور',
      desc: 'زیبایی بصری بدون خروجی مالی بی‌معناست. ما تمام فرایند دیزاین و سئو را براساس شاخص‌های کلیدی عملکرد (KPI) اندازه‌گیری می‌کنیم.'
    },
    {
      icon: Zap,
      title: 'سرعت و عملکرد فوق‌العاده',
      desc: 'لود بار زیر ۱ ثانیه، امتیاز ۱۰۰ در Google Lighthouse و پایداری کامل در زمان ترافیک‌های میلیونی.'
    },
    {
      icon: Compass,
      title: 'پشتیبانی و شفافیت کامل',
      desc: 'گزارش‌دهی شفاف مستمر، دسترسی مستقیم به داشبورد پروژه‌ها و پشتیبانی تخصصی ۲۴/۷ بدون واسطه.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#070609] text-gray-100 pt-24 pb-20 relative overflow-hidden">
      {/* Ambient Background Lights */}
      <div className="absolute top-10 right-0 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[220px] pointer-events-none" />
      <div className="absolute top-1/3 left-0 w-[500px] h-[500px] bg-yellow-500/10 rounded-full blur-[200px] pointer-events-none" />

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Navigation Bar Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-amber-500/15">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-200/50">
            <button onClick={onBackToHome} className="hover:text-white transition-colors flex items-center gap-1">
              <Home className="w-3.5 h-3.5 text-amber-400" />
              <span>صفحه اصلی</span>
            </button>
            <span>/</span>
            <span className="text-amber-400 font-semibold">درباره آژانس سیگنالوکس</span>
          </div>

        </div>

        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#121017] border border-amber-500/30 text-amber-200 text-[11px] font-mono uppercase tracking-[0.2em] mb-4 rounded-[5px]">
            <Globe className="w-3.5 h-3.5 text-amber-400" />
            <span>داستان، چشم‌انداز و فلسفه کاری ما</span>
          </span>

          <h1 className="text-[24px] font-black text-white tracking-tight leading-tight mb-6 uppercase">
            درباره آژانس خلق سیگنال‌های دیجیتال <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500">سیگنالوکس</span>
          </h1>
        </div>

        {/* Stats Grid with Glowing Border Hover Effect */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {[
            { label: 'پروژه‌های موفق تحویل داده شده', val: '۱۲۵+' },
            { label: 'میانگین افزایش فروش کارفرمایان', val: '۳۲۰٪' },
            { label: 'گواهی‌نامه‌های تخصصی بین‌المللی', val: '۱۲+' },
            { label: 'میزان پایداری و رضایت مشتریان', val: '۹۹.۴٪' },
          ].map((st, i) => (
            <div
              key={i}
              className="glow-border-card trionn-tilt-card p-6 text-center border border-amber-500/20 rounded-[5px]"
              data-cursor-text="آمار"
            >
              <div className="text-3xl sm:text-4xl font-black font-mono text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500 mb-2">
                {st.val}
              </div>
              <div className="text-xs text-amber-200/60 font-mono uppercase tracking-wider">{st.label}</div>
            </div>
          ))}
        </div>

        {/* Agency Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
          <div className="space-y-6">
            <span className="text-xs font-mono text-amber-400 uppercase tracking-widest block">فلسفه وجودی سیگنالوکس</span>
            <h2 className="text-[24px] font-black text-white leading-tight uppercase">
              ما وب‌سایت نمی‌سازیم؛ ما <span className="text-amber-400">زیرساخت رشد کسب‌وکار</span> شما را معماری می‌کنیم
            </h2>
            <p className="text-amber-100/70 text-sm sm:text-base leading-relaxed font-light text-justify">
              در دنیایی که هزاران وب‌سایت بی‌کیفیت و قالب‌های آماده حضور دارند، سیگنالوکس با الگوی کدنویسی اختصاصی، بهینه‌سازی دقیق سرعت و استراتژی‌های هوشمندانه سئو متولد شد.
            </p>
            <p className="text-amber-100/70 text-sm sm:text-base leading-relaxed font-light text-justify">
              تیم ما متشکل از مهندسان ارشد نرم‌افزار، استراتژیست‌های سئو و طراحان تجربه کاربری است که با تمرکز روی جزییات، استانداردهای متفاوتی را در صنعت دیجیتال ایران پیاده‌سازی می‌کنند.
            </p>

            <div className="pt-4 flex flex-wrap gap-4">
              <button
                onClick={onViewServices}
                className="px-6 py-3.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 text-xs font-bold uppercase tracking-wider rounded-[5px] transition-all cursor-pointer flex items-center gap-2"
              >
                <span>مشاهده خدمات تخصصی ما</span>
                <ArrowRight className="w-4 h-4 rotate-180" />
              </button>
            </div>
          </div>

          {/* Code & Architectural Visual Card */}
          <div className="glow-border-card trionn-tilt-card p-8 border border-amber-500/30 rounded-[5px] bg-[#121017]">
            <div className="flex items-center justify-between pb-4 border-b border-amber-500/20 mb-6">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-amber-400" />
                <span className="text-xs font-mono font-bold text-white uppercase">SIGNALUX CORE STACK</span>
              </div>
              <span className="text-[10px] font-mono text-amber-300 px-2 py-0.5 bg-amber-500/10 border border-amber-500/30 rounded-[5px]">
                Active Engine
              </span>
            </div>

            <div className="space-y-4 font-mono text-xs text-amber-100/80">
              <div className="p-3 bg-[#070609] border border-amber-500/20 rounded-[5px] flex items-center justify-between">
                <span className="text-amber-300">Architecture:</span>
                <span className="text-white">Headless Microservices & Edge Rendering</span>
              </div>
              <div className="p-3 bg-[#070609] border border-amber-500/20 rounded-[5px] flex items-center justify-between">
                <span className="text-yellow-300">SEO Standard:</span>
                <span className="text-white">Semantic Schema, Dynamic SSR & Speed 100</span>
              </div>
              <div className="p-3 bg-[#070609] border border-amber-500/20 rounded-[5px] flex items-center justify-between">
                <span className="text-amber-200">Security Level:</span>
                <span className="text-white">Enterprise DDoS Defense & SSL+ Encrypted</span>
              </div>
              <div className="p-3 bg-[#070609] border border-amber-500/20 rounded-[5px] flex items-center justify-between">
                <span className="text-amber-400">Uptime Guarantee:</span>
                <span className="text-white">99.99% Cloud Infrastructure</span>
              </div>
            </div>
          </div>
        </div>

        {/* Core Values Section */}
        <div className="mb-24">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-mono text-amber-400 uppercase tracking-widest block mb-2">ارزش‌های بنیادین</span>
            <h2 className="text-[24px] font-black text-white uppercase">اصول راهبردی ما در هر پروژه</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreValues.map((v, idx) => {
              const Icon = v.icon;
              return (
                <div
                  key={idx}
                  className="glow-border-card trionn-tilt-card p-6 border border-amber-500/20 rounded-[5px] flex flex-col justify-between"
                  data-cursor-text="ارزش‌ها"
                >
                  <div>
                    <div className="p-3 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-[5px] w-fit mb-4">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-white mb-2 uppercase">{v.title}</h3>
                    <p className="text-xs text-amber-100/60 leading-relaxed font-light">{v.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Leadership Team Section - 4 Team Member Cards */}
        <div className="mb-24">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-mono uppercase tracking-[0.2em] mb-3 rounded-[5px]">
              <Users className="w-3.5 h-3.5 text-amber-400" />
              <span>نیروهای پیشران سیگنالوکس</span>
            </span>
            <h2 className="text-[24px] font-black text-white tracking-tight mb-4">
              تیم رهبری و <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500">متخصصان ما</span>
            </h2>
            <p className="text-amber-100/60 text-xs sm:text-sm font-light leading-relaxed">
              ترکیبی از برترین معماران کدنویسی، استراتژیست‌های سئو و طراحان تجربه کاربری برای خلق پروژه‌های متمایز و پربازده.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {teamMembers.map((member, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="glow-border-card trionn-tilt-card bg-[#121017] border border-amber-500/20 hover:border-amber-400/60 rounded-[8px] p-5 flex flex-col justify-between h-full transition-all duration-300 group hover:shadow-[0_10px_30px_rgba(212,175,55,0.15)]"
              >
                <div className="flex-1 flex flex-col">
                  {/* Avatar Container */}
                  <div className="relative mb-5 overflow-hidden rounded-[6px] border border-amber-500/25 bg-[#070609] aspect-square">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#070609] via-transparent to-transparent opacity-60" />
                    
                    <span className="absolute bottom-2.5 right-2.5 px-2.5 py-1 bg-[#0c0a10]/90 backdrop-blur-md border border-amber-500/40 text-[10px] font-mono text-amber-300 rounded-[4px]">
                      عضو تیم
                    </span>
                  </div>

                  {/* Name & Role */}
                  <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors mb-1.5">
                    {member.name}
                  </h3>
                  <div className="text-xs font-semibold text-amber-400/90 mb-3">
                    {member.role}
                  </div>

                  {/* Bio */}
                  <p className="text-xs text-amber-100/60 font-light leading-relaxed mb-4 min-h-[56px] line-clamp-3 flex-1">
                    {member.bio}
                  </p>
                </div>

                {/* Social Media Links & Horizontal Divider Aligned across cards */}
                <div className="mt-auto pt-3.5 border-t border-amber-500/20">
                  <div className="flex items-center justify-center gap-2.5">
                    <a
                      href={member.socials.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-[5px] bg-[#070609] border border-amber-500/20 hover:border-amber-400 text-amber-200/70 hover:text-amber-300 hover:bg-amber-500/10 flex items-center justify-center transition-all cursor-pointer"
                      title={`اینستاگرام ${member.name}`}
                    >
                      <Instagram className="w-3.5 h-3.5" />
                    </a>
                    <a
                      href={member.socials.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-[5px] bg-[#070609] border border-amber-500/20 hover:border-amber-400 text-amber-200/70 hover:text-amber-300 hover:bg-amber-500/10 flex items-center justify-center transition-all cursor-pointer"
                      title={`یوتیوب ${member.name}`}
                    >
                      <Youtube className="w-3.5 h-3.5" />
                    </a>
                    <a
                      href={member.socials.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-[5px] bg-[#070609] border border-amber-500/20 hover:border-amber-400 text-amber-200/70 hover:text-amber-300 hover:bg-amber-500/10 flex items-center justify-center transition-all cursor-pointer"
                      title={`لینکدین ${member.name}`}
                    >
                      <Linkedin className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Banner */}
        <div className="glow-border-card p-8 sm:p-12 border border-amber-500/40 rounded-[5px] text-center bg-gradient-to-r from-[#121017] via-[#1A1722] to-[#121017] shadow-[0_0_30px_rgba(212,175,55,0.2)]">
          <div className="max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-mono uppercase tracking-[0.2em] mb-4 rounded-[5px]">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>آماده ایجاد تحول دیجیتال هستید؟</span>
            </span>

            <h2 className="text-[24px] font-black text-white tracking-tight leading-tight mb-8 uppercase">
              همین امروز با متخصصان <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500">سیگنالوکس</span> مشورت کنید
            </h2>

            <button
              onClick={onOpenConsultation}
              className="px-8 py-4 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold text-xs uppercase tracking-widest transition-all duration-300 flex items-center gap-2 rounded-[5px] mx-auto cursor-pointer shadow-[0_0_20px_rgba(212,175,55,0.3)]"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>درخواست جلسه مشاوره اختصاصی</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
