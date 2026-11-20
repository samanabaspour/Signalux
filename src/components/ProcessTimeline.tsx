import React from 'react';
import { motion } from 'motion/react';
import { PROCESS_STEPS } from '../data';
import { Search, Compass, Cpu, Rocket, Activity, CheckCircle2 } from 'lucide-react';

export const ProcessTimeline: React.FC = () => {
  const getStepIcon = (icon: string) => {
    switch (icon) {
      case 'Search':
        return <Search className="w-5 h-5 text-amber-400" />;
      case 'Compass':
        return <Compass className="w-5 h-5 text-amber-300" />;
      case 'Cpu':
        return <Cpu className="w-5 h-5 text-yellow-500" />;
      case 'Rocket':
        return <Rocket className="w-5 h-5 text-amber-400" />;
      case 'Activity':
        return <Activity className="w-5 h-5 text-amber-300" />;
      default:
        return <CheckCircle2 className="w-5 h-5 text-amber-400" />;
    }
  };

  return (
    <section id="process" className="relative py-28 px-4 sm:px-6 lg:px-8 bg-[#070609] border-b border-amber-500/15 overflow-hidden">
      {/* Lighting Globs */}
      <div className="absolute top-1/2 right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-[1280px] mx-auto relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#121017] border border-amber-500/30 text-amber-200 text-[11px] font-mono uppercase tracking-[0.2em] mb-4 rounded-[5px]"
          >
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span>نقشه راه شفاف و ۵ مرحله‌ای</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ delay: 0.1 }}
            className="text-[24px] font-black text-white tracking-tight leading-tight mb-4 uppercase"
          >
            فرآیند همگام‌سازی و <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500">تحویل پروژه</span>
          </motion.h2>
        </div>

        {/* Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative">
          {/* Connector Line for desktop */}
          <div className="hidden md:block absolute top-12 inset-x-12 h-[2px] bg-gradient-to-r from-amber-500/30 via-yellow-500/30 to-amber-300/30 -z-0" />

          {PROCESS_STEPS.map((step, idx) => (
            <motion.div
              key={step.stepNumber}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="glass-card p-6 border border-amber-500/15 flex flex-col justify-between relative z-10 group hover:border-amber-400/50 transition-all duration-300 rounded-[5px]"
            >
              <div>
                {/* Step Circle & Number */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 bg-[#070609] border border-amber-500/20 flex items-center justify-center group-hover:bg-amber-500/10 transition-colors rounded-[5px]">
                    {getStepIcon(step.icon)}
                  </div>
                  <span className="text-2xl font-black font-mono text-amber-400">
                    {step.stepNumber}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-3 uppercase">
                  {step.title}
                </h3>

                <p className="text-xs text-amber-100/70 font-light leading-relaxed">
                  {step.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-amber-500/20 flex items-center gap-1.5 text-[11px] font-mono text-amber-200/50 uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span>فاز {idx + 1} اجرایی</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

