import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Eye, Layers, Sparkles, Terminal, CheckCircle2 } from 'lucide-react';

export const AboutPhilosophy: React.FC = () => {
  const [activePillar, setActivePillar] = useState(0);

  const pillars = [
    {
      id: 'tech-edge',
      num: '۰۱',
      title: 'دقت در لبه فناوری ۲۰۲۶',
      subtitle: 'کدنویسی اختصاصی بدون وابستگی به قالب‌های آماده سنگین',
      icon: Terminal,
      description: 'کدهای ما خط‌به‌خط بر پایه استانداردهای جهانی نوشته می‌شوند. ما به جای قالب‌های آماده و افزونه‌های کند، وب‌اپلیکیشن‌های اختصاصی با React، TypeScript و Vite می‌سازیم که سرعت بارگذاری آن کمتر از ۱ ثانیه است.',
      highlights: [
        'کاهش حجم کدهای فرانت‌اند تا ۷۵٪',
        'سازگاری کامل با دستگاه‌های لمسی و نمایشگرهای Retina',
        'معماری قابل توسعه و تمیز برای تیم‌های فنی مشتریان',
        'گواهی‌نامه تست عملکرد لایت‌هاوس بالاتر از ۹۵٪'
      ]
    },
    {
      id: 'noise-free',
      num: '۰۲',
      title: 'معماری بدون نویز (Noise-Free)',
      subtitle: 'تمرکز خالص بر تجربه کاربری روان و بهینه‌سازی مسیر خرید',
      icon: Layers,
      description: 'طراحی ما از المان‌های بی‌پایده و شلوغی‌های بصری امتناع می‌کند. ما الهام‌گرفته از استودیوهای ممتاز جهانی، فضاهای منفی متوازن و تایپوگرافی پراعتمادبه‌نفس ایجاد می‌کنیم تا کاربر فوراً به مقصد هدایت شود.',
      highlights: [
        'کاهش نرخ پرش (Bounce Rate) تا ۴۰٪',
        'انیمیشن‌های نرم مبتنی بر شتاب‌دهنده سخت‌افزاری (GPU)',
        'تایپوگرافی فارسی هماهنگ و وریابل با خوانایی عالی',
        'تجربه کاربری همگام در تمام ابعاد صفحه'
      ]
    },
    {
      id: 'data-growth',
      num: '۰۳',
      title: 'شفافیت و خروجی درآمدزا',
      subtitle: 'دیجیتال مارکتینگ و سئویی که مستقیم روی سود شما تاثیر می‌گذارد',
      icon: Eye,
      description: 'زیبایی بصری بدون ورودی ارگانیک و نرخ تبدیل بالا کافی نیست. ما با اتصال ابزارهای دقیق تحلیل داده و سئوی کلاه سفید فنی، تضمین می‌کنیم که سرمایه‌گذاری شما بر روی وب‌سایت در کوتاه‌ترین زمان ممکن بازگردد.',
      highlights: [
        'داشبورد گزارش‌دهی شفاف و زنده بدون گنگی',
        'کاهش هزینه‌های جذب مشتری (CAC)',
        'استراتژی لینک‌سازی طبیعی و کلاسترهای محتوایی',
        'بازگشت سرمایه قابل اندازه‌گیری در کمپین‌ها'
      ]
    }
  ];

  return (
    <section id="about" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-[#070609] overflow-hidden border-t border-b border-amber-500/15">
      {/* Ambient Lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-[1280px] mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#121017] border border-amber-500/30 text-amber-200 text-[11px] font-mono uppercase tracking-[0.2em] mb-4 rounded-[5px]"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>فلسفه و تفکر سیگنالوکس</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ delay: 0.1 }}
            className="text-[24px] font-black text-white tracking-tight leading-tight mb-6 uppercase"
          >
            چرا دیگران، <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500">سیگنالوکس</span> را انتخاب می‌کنند؟
          </motion.h2>
        </div>

        {/* Interactive Storytelling Pillars Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left / Navigation Column */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {pillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              const isSelected = activePillar === idx;
              return (
                <button
                  key={pillar.id}
                  onClick={() => setActivePillar(idx)}
                  className={`w-full text-right p-6 transition-all duration-300 border cursor-pointer relative rounded-[5px] ${
                    isSelected
                      ? 'glass-card border-amber-400 shadow-[0_0_20px_rgba(212,175,55,0.25)]'
                      : 'bg-[#121017] border-amber-500/20 hover:border-amber-400/40 text-amber-100/60'
                  }`}
                >
                  <div className="absolute top-3 left-4 text-3xl font-serif italic text-amber-200/10">
                    {pillar.num}
                  </div>
                  <div className="flex items-center gap-4 relative z-10">
                    <div className={`w-10 h-10 flex items-center justify-center shrink-0 border rounded-[5px] ${isSelected ? 'bg-gradient-to-r from-amber-500 to-yellow-500 border-amber-400 text-slate-950' : 'bg-white/5 border-amber-500/20 text-amber-400'}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className={`text-base font-bold ${isSelected ? 'text-white' : 'text-amber-100/80'}`}>
                        {pillar.title}
                      </h3>
                      <p className="text-xs text-amber-100/50 mt-1 line-clamp-1">
                        {pillar.subtitle}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right / Content Panel */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={activePillar}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.4 }}
                className="glass-card p-5 sm:p-8 lg:p-10 border border-amber-500/20 relative min-h-[420px] flex flex-col justify-between rounded-[5px]"
              >
                {/* Decorative Top Accent line */}
                <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-amber-500 via-amber-300 to-yellow-500" />

                <div>
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                    <span className="text-[11px] sm:text-xs font-mono font-bold px-3 py-1 bg-amber-500/10 text-amber-300 border border-amber-500/30 uppercase tracking-wider rounded-[5px] shrink-0 whitespace-nowrap">
                      پایه {pillars[activePillar].num} از ۰۳
                    </span>
                    <span className="text-[10px] sm:text-xs text-amber-200/50 font-mono tracking-wider sm:tracking-widest uppercase" dir="ltr">
                      SIGNALUX CORE ARCHITECTURE
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-black text-white mb-4 uppercase">
                    {pillars[activePillar].title}
                  </h3>

                  <p className="text-amber-100/70 text-sm sm:text-base leading-relaxed sm:leading-loose mb-8 font-light">
                    {pillars[activePillar].description}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {pillars[activePillar].highlights.map((highlight, hIdx) => (
                      <div key={hIdx} className="flex items-center gap-2.5 p-3 bg-[#070609] border border-amber-500/20 rounded-[5px]">
                        <CheckCircle2 className="w-4 h-4 shrink-0 text-amber-400" />
                        <span className="text-xs font-medium text-amber-100/90">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

