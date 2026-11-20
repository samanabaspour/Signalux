import React, { useState } from 'react';
import { motion } from 'motion/react';
import { TrendingUp, Zap, BarChart3, ArrowUpRight } from 'lucide-react';

export const ResultsMetrics: React.FC = () => {
  const [sliderValue, setSliderValue] = useState(50);

  // Math simulation based on slider
  const baselineMonthlyVisits = 10000;
  const currentVisits = Math.round(baselineMonthlyVisits * (1 + (sliderValue / 100) * 3.5));
  const conversionRate = (2.1 + (sliderValue / 100) * 2.8).toFixed(1);
  const estimatedLeads = Math.round((currentVisits * parseFloat(conversionRate)) / 100);

  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-[#070609] border-b border-amber-500/15 overflow-hidden">
      {/* Lighting Globs */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-[1280px] mx-auto relative z-10">
        <div className="glass-card p-8 sm:p-12 border border-amber-500/30 relative overflow-hidden rounded-[5px]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#121017] border border-amber-500/30 text-amber-200 text-[11px] font-mono uppercase tracking-[0.2em] mb-4 rounded-[5px]">
                <BarChart3 className="w-3.5 h-3.5 text-amber-400" />
                <span>محاسبه‌گر تخمین رشد کسب‌وکار شما</span>
              </div>

              <h2 className="text-[24px] font-black text-white leading-tight mb-4 uppercase">
                تأثیر واقعی <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500">طراحی و سئوی سیگنالوکس</span> بر شاخص‌های کلیدی
              </h2>

              <p className="text-amber-100/70 text-sm sm:text-base font-light leading-relaxed mb-8">
                با تنظیم اهداف میزان بهینه‌سازی، ببینید چگونه ارتقای سرعت وب‌سایت، بهبود تجربه کاربری و سئوی فنی می‌تواند لیدهای فروش شما را چندبرابر کند.
              </p>

              {/* Slider Input */}
              <div className="space-y-4 bg-[#070609] p-6 border border-amber-500/20 mb-6 rounded-[5px]">
                <div className="flex justify-between items-center text-xs text-amber-100/80 font-semibold uppercase tracking-wider">
                  <span>سطح بهینه‌سازی و بازطراحی:</span>
                  <span className="text-amber-400 font-mono text-sm font-bold">{sliderValue}٪ پیشرفته</span>
                </div>

                <input
                  type="range"
                  min="10"
                  max="100"
                  value={sliderValue}
                  onChange={(e) => setSliderValue(Number(e.target.value))}
                  className="w-full h-2 bg-white/10 appearance-none cursor-pointer accent-amber-400 rounded-[5px]"
                />

                <div className="flex justify-between text-[10px] text-amber-200/50 font-mono uppercase">
                  <span>اصلاح مقدماتی</span>
                  <span>بازطراحی کامل + سئو ارگانیک</span>
                </div>
              </div>
            </div>

            {/* Right Interactive Dashboard Card */}
            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-6 bg-[#070609] border border-amber-500/20 rounded-[5px]">
                <div className="text-xs text-amber-200/50 uppercase tracking-wider mb-1">بازدیدکننده ماهانه تخمینی</div>
                <div className="text-2xl sm:text-3xl font-black text-white font-mono mb-2">
                  {currentVisits.toLocaleString('fa-IR')}
                </div>
                <div className="text-xs text-amber-400 flex items-center gap-1 font-mono uppercase">
                  <ArrowUpRight className="w-4 h-4" />
                  <span>+{Math.round(sliderValue * 3.5)}٪ رشد ترافیک</span>
                </div>
              </div>

              <div className="p-6 bg-[#070609] border border-amber-500/20 rounded-[5px]">
                <div className="text-xs text-amber-200/50 uppercase tracking-wider mb-1">نرخ تبدیل (Conversion Rate)</div>
                <div className="text-2xl sm:text-3xl font-black text-amber-300 font-mono mb-2">
                  {conversionRate}٪
                </div>
                <div className="text-xs text-amber-100/80 flex items-center gap-1 font-mono uppercase">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>بهینه‌سازی شده برای خرید</span>
                </div>
              </div>

              <div className="sm:col-span-2 p-6 bg-[#070609] border border-amber-400 rounded-[5px] shadow-[0_0_20px_rgba(212,175,55,0.25)]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-white font-semibold uppercase tracking-wider">لید و درخواست‌های معتبر ماهانه:</span>
                  <span className="px-2.5 py-0.5 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 text-[10px] font-mono uppercase tracking-widest font-bold rounded-[5px]">
                    خروجی درآمدزا
                  </span>
                </div>
                <div className="text-3xl sm:text-4xl font-black text-amber-300 font-mono mb-2">
                  {estimatedLeads.toLocaleString('fa-IR')} <span className="text-sm font-normal text-amber-100/50">مشتری بالقوه</span>
                </div>
                <p className="text-xs text-amber-100/60 font-light">
                  این اعداد بر اساس میانگین بازدهی پروژه‌های واقعی پیاده‌سازی شده توسط تیم سیگنالوکس برآورد شده است.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

