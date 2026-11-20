import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Radio, Sparkles } from 'lucide-react';

interface LoaderProps {
  onComplete: () => void;
}

export const Loader: React.FC<LoaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('در حال دریافت سیگنال اولیه...');

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            onComplete();
          }, 350);
          return 100;
        }
        const increment = Math.floor(Math.random() * 10) + 6;
        const nextVal = Math.min(prev + increment, 100);

        if (nextVal > 25 && nextVal < 65) {
          setStatusText('کالیبراسیون کانون‌های نوری و شبکه سه‌بعدی...');
        } else if (nextVal >= 65 && nextVal < 90) {
          setStatusText('بارگذاری پروژه‌ها، ماژول‌های سئو و مارکتینگ...');
        } else if (nextVal >= 90) {
          setStatusText('آماده‌سازی تجربه اختصاصی سیگنالوکس...');
        }
        return nextVal;
      });
    }, 110);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.03, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#070609] text-white select-none px-4 overflow-hidden"
    >
      {/* Background Ambient Glows */}
      <div className="absolute w-[600px] h-[600px] bg-amber-500/10 blur-[180px] rounded-full pointer-events-none" />
      <div className="absolute w-[350px] h-[350px] bg-yellow-600/10 blur-[140px] rounded-full pointer-events-none" />

      {/* Floating Sparkle Particles in Loader */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-1/4 left-1/4 w-1.5 h-1.5 bg-amber-300 rounded-full animate-ping" />
        <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-yellow-400 rounded-full blur-[1px] animate-pulse" />
        <div className="absolute bottom-1/3 left-1/3 w-1 h-1 bg-amber-200 rounded-full animate-pulse" />
      </div>

      {/* Center Emblem Container */}
      <div className="relative z-10 flex flex-col items-center max-w-sm w-full text-center">
        {/* Animated Double Orbit Rings */}
        <div className="relative mb-8 flex items-center justify-center">
          {/* Outer clockwise spinning ring */}
          <div className="absolute w-32 h-32 rounded-full border border-amber-500/20 border-t-amber-400 border-r-amber-400/80 animate-spin" style={{ animationDuration: '3s' }} />
          
          {/* Inner counter-clockwise spinning ring */}
          <div className="absolute w-24 h-24 rounded-full border border-yellow-500/20 border-b-yellow-400 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '2s' }} />

          {/* Central Luxury Box */}
          <div className="w-16 h-16 rounded-[12px] bg-[#121017] border border-amber-500/40 backdrop-blur-xl flex items-center justify-center shadow-[0_0_30px_rgba(212,175,55,0.25)] relative group">
            <Radio className="w-8 h-8 text-amber-400 animate-pulse" />
            <Sparkles className="w-3.5 h-3.5 text-yellow-300 absolute -top-1.5 -right-1.5 animate-bounce" />
          </div>
        </div>

        {/* Brand Title */}
        <h1 className="text-3xl font-black tracking-wider text-white mb-1.5 font-mono uppercase">
          SIGNAL<span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500">UX</span>
        </h1>
        <p className="text-[10px] tracking-[0.25em] text-amber-200/60 font-mono uppercase mb-8">
          ACADEMY & DESIGN STUDIO
        </p>

        {/* Progress Bar Track */}
        <div className="w-full bg-[#121017] border border-amber-500/25 rounded-full h-2 p-0.5 mb-4 relative overflow-hidden backdrop-blur-md shadow-inner">
          <motion.div
            className="h-full bg-gradient-to-r from-amber-600 via-amber-400 to-yellow-400 rounded-full relative"
            style={{ width: `${progress}%` }}
            transition={{ ease: 'easeOut' }}
          >
            <div className="absolute top-0 right-0 bottom-0 w-8 bg-white/60 blur-[3px] animate-pulse" />
          </motion.div>
        </div>

        {/* Status Info Row */}
        <div className="w-full flex justify-between items-center text-[11px] font-mono">
          <span className="truncate max-w-[280px] text-amber-100/70 font-light">{statusText}</span>
          <span className="text-amber-400 font-bold font-mono mr-2">{progress}%</span>
        </div>
      </div>
    </motion.div>
  );
};
