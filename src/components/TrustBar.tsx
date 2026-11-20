import React from 'react';
import { motion } from 'motion/react';
import { Award, Briefcase, Smile, TrendingUp } from 'lucide-react';

export const TrustBar: React.FC = () => {
  const stats = [
    {
      id: 'projects',
      num: '۰۱',
      value: '۲۵۰+',
      label: 'پروژه موفق پیاده‌سازی‌شده',
      icon: Briefcase,
    },
    {
      id: 'experience',
      num: '۰۲',
      value: '۸+',
      label: 'سال تجربه تخصصی صنعت',
      icon: Award,
    },
    {
      id: 'satisfaction',
      num: '۰۳',
      value: '۹۹.۴٪',
      label: 'رضایت کامل مشتریان',
      icon: Smile,
    },
    {
      id: 'growth',
      num: '۰۴',
      value: '۳.۸x',
      label: 'میانگین رشد نرخ تبدیل (CR)',
      icon: TrendingUp,
    },
  ];

  return (
    <section className="relative z-20 py-10 -mt-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1280px] mx-auto">
        <div className="glass-card p-6 sm:p-8 border border-amber-500/25 shadow-2xl relative overflow-hidden rounded-[5px]">
          {/* Top gradient glowing border */}
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-amber-500 via-amber-300 to-yellow-500" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-center gap-4 p-4 bg-[#121017] border border-amber-500/20 hover:border-amber-400/50 transition-all duration-300 group relative rounded-[5px]"
                >
                  <div className="absolute top-2 left-2 text-2xl font-serif italic text-amber-200/10 group-hover:text-amber-400/30 transition-colors">
                    {stat.num}
                  </div>
                  <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0 group-hover:bg-amber-500/20 transition-colors duration-300 rounded-[5px]">
                    <Icon className="w-5 h-5 text-amber-400" />
                  </div>
                  <div className="flex flex-col relative z-10">
                    <span className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
                      {stat.value}
                    </span>
                    <span className="text-xs font-bold text-amber-100/90 mt-0.5 uppercase tracking-wider">
                      {stat.label}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

