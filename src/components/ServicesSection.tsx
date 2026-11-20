import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { SERVICES_DATA } from '../data';
import { ServiceItem } from '../types';
import { fetchServices } from '../services/apiClient';
import { Code2, TrendingUp, SearchCheck, CheckCircle2, ArrowLeft, Calculator, Sparkles, X } from 'lucide-react';

interface ServicesSectionProps {
  onSelectService: (service: ServiceItem) => void;
  onOpenConsultation: () => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  onSelectService,
  onOpenConsultation,
}) => {
  const [servicesList, setServicesList] = useState<ServiceItem[]>(SERVICES_DATA);
  const [calculatorOpen, setCalculatorOpen] = useState(false);
  const [calcServiceType, setCalcServiceType] = useState<'web' | 'marketing' | 'seo'>('web');
  const [calcScale, setCalcScale] = useState<'startup' | 'growth' | 'enterprise'>('growth');

  useEffect(() => {
    fetchServices().then(data => {
      if (data && data.length > 0) {
        setServicesList(data);
      }
    });
  }, []);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Code2':
        return <Code2 className="w-7 h-7 text-amber-400" />;
      case 'TrendingUp':
        return <TrendingUp className="w-7 h-7 text-amber-300" />;
      case 'SearchCheck':
        return <SearchCheck className="w-7 h-7 text-yellow-500" />;
      default:
        return <Code2 className="w-7 h-7 text-amber-400" />;
    }
  };

  // Estimator calculation helper
  const getEstimation = () => {
    let days = '۱۴ الی ۲۱ روز کاری';
    let team = '۳ متخصص فرانت، بک و UI/UX';
    let guarantee = '۱۲ ماه پشتیبانی طلایی کتبی';

    if (calcServiceType === 'web') {
      if (calcScale === 'startup') days = '۱۰ الی ۱۵ روز کاری';
      if (calcScale === 'growth') days = '۲۰ الی ۳۰ روز کاری';
      if (calcScale === 'enterprise') days = '۴۰ الی ۶۰ روز کاری (تیم اختصاصی)';
    } else if (calcServiceType === 'seo') {
      if (calcScale === 'startup') days = '۳ ماه (فاز اولیه تثبیت رتبه)';
      if (calcScale === 'growth') days = '۶ ماه (تسلط کامل بر کلمات کلیدی)';
      if (calcScale === 'enterprise') days = '۱۲ ماه (مارکت لیدری در صنعت)';
    } else {
      if (calcScale === 'startup') days = '۱ ماه تست و بهینه‌سازی اولیه‌';
      if (calcScale === 'growth') days = '۳ ماه رشد مستمر نرخ تبدیل';
      if (calcScale === 'enterprise') days = '۶ ماه کمپین ۳۶۰ درجه و پرفورمنس';
    }

    return { days, team, guarantee };
  };

  return (
    <section id="services" className="relative py-28 px-4 sm:px-6 lg:px-8 bg-[#070609] border-b border-amber-500/15 overflow-hidden">
      {/* Background Lighting Globs */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-96 h-96 bg-yellow-600/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-[1280px] mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#121017] border border-amber-500/30 text-amber-200 text-[11px] font-mono uppercase tracking-[0.2em] mb-4 rounded-[5px]"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>خدمات تخصصی ۳۶۰ درجه</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: 0.1 }}
              className="text-[24px] font-black text-white tracking-tight uppercase"
            >
              خدمات <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500">رشد دیجیتال شما</span>
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ delay: 0.2 }}
          >
            <button
              onClick={() => setCalculatorOpen(true)}
              className="px-5 py-3 bg-[#121017] border border-amber-500/30 text-amber-100 hover:border-amber-400 hover:text-amber-300 transition-all text-xs font-bold uppercase tracking-widest flex items-center gap-2.5 cursor-pointer rounded-[5px] shadow-[0_0_15px_rgba(212,175,55,0.15)]"
            >
              <Calculator className="w-4 h-4 text-amber-400" />
              <span>تخمین‌گر هوشمند زمان و محدوده پروژه</span>
            </button>
          </motion.div>
        </div>

        {/* 3 Main Service Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {servicesList.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="glass-card p-8 border border-amber-500/15 flex flex-col justify-between relative group hover:border-amber-400/50 transition-all duration-300 rounded-[5px]"
            >
              {/* Top gradient edge */}
              <div className="absolute top-0 inset-x-0 h-[2px] bg-amber-500/10 group-hover:bg-gradient-to-r group-hover:from-amber-400 group-hover:to-yellow-500 transition-colors" />

              <div>
                {/* Header Icon & Badge */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 bg-[#070609] border border-amber-500/20 flex items-center justify-center group-hover:bg-amber-500/10 transition-colors duration-300 rounded-[5px]">
                    {getIcon(service.iconName)}
                  </div>
                  <span className="text-[11px] font-mono px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-200/60 tracking-widest uppercase rounded-[5px]">
                    0{index + 1}
                  </span>
                </div>

                {/* Title & Subtitle */}
                <h3 className="text-2xl font-bold text-white mb-2 uppercase">
                  {service.title}
                </h3>
                <p className="text-xs text-amber-400 mb-4 font-semibold tracking-wider">
                  {service.subtitle}
                </p>
                <p className="text-amber-100/70 text-sm font-light leading-relaxed mb-6">
                  {service.description}
                </p>

                {/* Metrics Highlight Badge */}
                <div className="p-3.5 bg-[#070609] border border-amber-500/20 text-xs font-semibold text-amber-100 mb-6 flex items-center gap-2 rounded-[5px]">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0" />
                  <span>{service.metrics}</span>
                </div>

                {/* Key Features List */}
                <div className="space-y-2.5 mb-8">
                  {service.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2.5 text-xs text-amber-100/80">
                      <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card Footer Button */}
              <button
                onClick={onOpenConsultation}
                className="w-full py-3.5 bg-[#121017] border border-amber-500/20 hover:bg-gradient-to-r hover:from-amber-500 hover:to-yellow-500 hover:text-slate-950 hover:border-amber-400 text-amber-100 font-bold text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer group/btn rounded-[5px]"
              >
                <span>درخواست این خدمت</span>
                <ArrowLeft className="w-4 h-4 text-amber-300/60 group-hover/btn:text-slate-950 group-hover/btn:-translate-x-1 transition-all" />
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Estimator Modal */}
      {calculatorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="glass-card p-6 sm:p-8 max-w-xl w-full border border-fuchsia-500/30 relative shadow-2xl rounded-[5px]"
          >
            <button
              onClick={() => setCalculatorOpen(false)}
              className="absolute top-6 left-6 p-2 bg-white/5 border border-white/10 text-white/60 hover:text-white rounded-[5px]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-fuchsia-500/10 border border-fuchsia-500/30 flex items-center justify-center text-fuchsia-400 rounded-[5px]">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white uppercase tracking-wider">تخمین‌گر هوشمند پروژه</h3>
                <p className="text-xs text-white/50">انتخاب شاخص‌ها برای دریافت زمان‌بندی و ساختار تیم</p>
              </div>
            </div>

            {/* Form selections */}
            <div className="space-y-6 mb-8">
              <div>
                <label className="block text-xs font-semibold text-white/80 mb-2 uppercase tracking-wider">نوع خدمت مورد نظر:</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setCalcServiceType('web')}
                    className={`py-2.5 px-3 text-xs font-bold border transition-all rounded-[5px] ${
                      calcServiceType === 'web'
                        ? 'bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 border-amber-400 text-slate-950 font-black shadow-[0_0_15px_rgba(212,175,55,0.3)]'
                        : 'bg-[#0B0B0F] border-white/10 text-white/60 hover:text-white'
                    }`}
                  >
                    توسعه وب
                  </button>
                  <button
                    onClick={() => setCalcServiceType('marketing')}
                    className={`py-2.5 px-3 text-xs font-bold border transition-all rounded-[5px] ${
                      calcServiceType === 'marketing'
                        ? 'bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 border-amber-400 text-slate-950 font-black shadow-[0_0_15px_rgba(212,175,55,0.3)]'
                        : 'bg-[#0B0B0F] border-white/10 text-white/60 hover:text-white'
                    }`}
                  >
                    مارکتینگ
                  </button>
                  <button
                    onClick={() => setCalcServiceType('seo')}
                    className={`py-2.5 px-3 text-xs font-bold border transition-all rounded-[5px] ${
                      calcServiceType === 'seo'
                        ? 'bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 border-amber-400 text-slate-950 font-black shadow-[0_0_15px_rgba(212,175,55,0.3)]'
                        : 'bg-[#0B0B0F] border-white/10 text-white/60 hover:text-white'
                    }`}
                  >
                    سئو و داده
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/80 mb-2 uppercase tracking-wider">مقیاس و حجم پروژه:</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setCalcScale('startup')}
                    className={`py-2.5 px-3 text-xs font-bold border transition-all rounded-[5px] ${
                      calcScale === 'startup'
                        ? 'bg-white border-white text-black'
                        : 'bg-[#0B0B0F] border-white/10 text-white/60 hover:text-white'
                    }`}
                  >
                    استارتاپی / پایه
                  </button>
                  <button
                    onClick={() => setCalcScale('growth')}
                    className={`py-2.5 px-3 text-xs font-bold border transition-all rounded-[5px] ${
                      calcScale === 'growth'
                        ? 'bg-white border-white text-black'
                        : 'bg-[#0B0B0F] border-white/10 text-white/60 hover:text-white'
                    }`}
                  >
                    رشد و استاندارد
                  </button>
                  <button
                    onClick={() => setCalcScale('enterprise')}
                    className={`py-2.5 px-3 text-xs font-bold border transition-all rounded-[5px] ${
                      calcScale === 'enterprise'
                        ? 'bg-white border-white text-black'
                        : 'bg-[#0B0B0F] border-white/10 text-white/60 hover:text-white'
                    }`}
                  >
                    سازمانی (Enterprise)
                  </button>
                </div>
              </div>

              {/* Estimation result box */}
              <div className="p-4 bg-[#0B0B0F] border border-amber-500/20 text-right space-y-2 rounded-[5px]">
                <div className="text-xs text-amber-200/50 font-mono uppercase tracking-widest">تخمین اولیه سیستم سیگنالوکس:</div>
                <div className="text-sm font-bold text-white flex items-center justify-between">
                  <span>زمان‌بندی اجرا:</span>
                  <span className="text-amber-400 font-mono font-black">{getEstimation().days}</span>
                </div>
                <div className="text-sm font-bold text-white flex items-center justify-between">
                  <span>تیم اختصاصی:</span>
                  <span className="text-white/80">{getEstimation().team}</span>
                </div>
                <div className="text-sm font-bold text-white flex items-center justify-between">
                  <span>تضمین کیفیت:</span>
                  <span className="text-amber-300 font-semibold">{getEstimation().guarantee}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setCalculatorOpen(false);
                onOpenConsultation();
              }}
              className="w-full py-3.5 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all rounded-[5px] shadow-[0_0_20px_rgba(212,175,55,0.25)]"
            >
              <span>درخواست پروپوزال رسمی بر اساس این تخمین</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      )}
    </section>
  );
};

