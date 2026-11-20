import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { CERTIFICATES_DATA } from '../data';
import { CertificateItem } from '../types';
import { Award, ChevronLeft, ChevronRight, Maximize2, CheckCircle } from 'lucide-react';

interface Certificate3DSliderProps {
  onSelectCertificate: (cert: CertificateItem) => void;
}

export const Certificate3DSlider: React.FC<Certificate3DSliderProps> = ({ onSelectCertificate }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const total = CERTIFICATES_DATA.length;

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % total);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  };

  // Auto rotation loop every 5 seconds
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % total);
    }, 5000);

    return () => clearInterval(interval);
  }, [total, isPaused]);

  return (
    <section id="certificates" className="relative py-28 px-4 sm:px-6 lg:px-8 bg-[#070609] border-b border-amber-500/15 overflow-hidden">
      {/* Background Lighting Globs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[200px] pointer-events-none" />

      <div className="max-w-[1280px] mx-auto relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#121017] border border-amber-500/30 text-amber-200 text-[11px] font-mono uppercase tracking-[0.2em] mb-4 rounded-[5px]"
          >
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>مدارک، گواهینامه‌ها و صلاحیت‌های تخصصی</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ delay: 0.1 }}
            className="text-[24px] font-black text-white tracking-tight leading-tight mb-4 uppercase"
          >
            اعتبارات بین‌المللی و <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500">تضمین دانش فنی</span>
          </motion.h2>
        </div>

        {/* 3D Stack / Coverflow Container */}
        <div
          className="relative max-w-4xl mx-auto h-[480px] sm:h-[520px] flex items-center justify-center"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="relative w-full h-full flex items-center justify-center">
            {CERTIFICATES_DATA.map((cert, index) => {
              // Calculate offset relative to currentIndex
              let offset = index - currentIndex;
              if (offset < -Math.floor(total / 2)) offset += total;
              if (offset > Math.floor(total / 2)) offset -= total;

              const isCenter = offset === 0;
              const isVisible = Math.abs(offset) <= 2;

              if (!isVisible) return null;

              // 3D Coverflow positioning math
              const translateX = offset * 220; // horizontal spacing in RTL/LTR
              const rotateY = offset * -25; // 3D rotation angle
              const scale = isCenter ? 1 : 1 - Math.abs(offset) * 0.15;
              const opacity = isCenter ? 1 : 1 - Math.abs(offset) * 0.4;
              const zIndex = 30 - Math.abs(offset) * 10;

              return (
                <motion.div
                  key={cert.id}
                  animate={{
                    x: translateX,
                    rotateY: rotateY,
                    scale: scale,
                    opacity: opacity,
                  }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  onClick={() => {
                    if (isCenter) {
                      onSelectCertificate(cert);
                    } else {
                      setCurrentIndex(index);
                    }
                  }}
                  style={{
                    zIndex,
                    transformStyle: 'preserve-3d',
                  }}
                  className={`absolute w-[300px] sm:w-[380px] h-[400px] sm:h-[440px] p-6 glass-card border transition-all cursor-pointer select-none flex flex-col justify-between rounded-[5px] ${
                    isCenter ? 'border-amber-400 shadow-[0_0_30px_rgba(212,175,55,0.25)]' : 'border-amber-500/15 hover:border-amber-400/30'
                  }`}
                >
                  {/* Top Certificate Header */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-mono flex items-center gap-1.5 uppercase tracking-wider rounded-[5px]">
                        <CheckCircle className="w-3 h-3 text-amber-400" />
                        <span>تاییدشده</span>
                      </span>
                      <span className="text-[11px] font-mono text-amber-200/50">{cert.issueDate}</span>
                    </div>

                    {/* Image Thumbnail */}
                    <div className="relative h-40 overflow-hidden mb-4 border border-amber-500/20 group bg-[#070609] rounded-[5px]">
                      <img
                        src={cert.image}
                        alt={cert.title}
                        className={`w-full h-full object-cover transition-all duration-700 ${
                          isCenter ? 'filter-none grayscale-0 scale-100 group-hover:scale-105' : 'grayscale opacity-70 scale-95'
                        }`}
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                        <div className="flex items-center gap-1 text-[11px] text-amber-300 font-mono uppercase tracking-wider">
                          <Maximize2 className="w-3.5 h-3.5" />
                          <span>برای بزرگ‌نمایی کلیک کنید</span>
                        </div>
                      </div>
                    </div>

                    {/* Title & Issuer */}
                    <h3 className="text-base sm:text-lg font-bold text-white mb-1 line-clamp-2 uppercase">
                      {cert.title}
                    </h3>
                    <p className="text-xs text-amber-400 font-semibold tracking-wider mb-3">
                      {cert.issuer}
                    </p>
                  </div>

                  {/* Footer ID & Skills */}
                  <div>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {cert.skills.slice(0, 3).map((sk, sIdx) => (
                        <span key={sIdx} className="px-2 py-0.5 bg-white/5 border border-amber-500/20 text-[10px] text-amber-100/60 font-mono uppercase rounded-[5px]">
                          {sk}
                        </span>
                      ))}
                    </div>

                    <div className="pt-3 border-t border-amber-500/20 flex items-center justify-between text-[11px] text-amber-200/50 font-mono uppercase">
                      <span>شناسه گواهی:</span>
                      <span className="text-amber-400 font-bold">{cert.credentialId}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Controls Arrow Buttons */}
          <button
            onClick={handlePrev}
            className="absolute left-2 sm:left-6 z-40 p-3 bg-[#121017] border border-amber-500/20 text-amber-100 hover:bg-gradient-to-r hover:from-amber-500 hover:to-yellow-500 hover:text-slate-950 transition-all cursor-pointer rounded-[5px]"
            aria-label="مدرک قبلی"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-2 sm:right-6 z-40 p-3 bg-[#121017] border border-amber-500/20 text-amber-100 hover:bg-gradient-to-r hover:from-amber-500 hover:to-yellow-500 hover:text-slate-950 transition-all cursor-pointer rounded-[5px]"
            aria-label="مدرک بعدی"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        </div>

        {/* Indicators */}
        <div className="flex justify-center items-center gap-2 mt-8">
          {CERTIFICATES_DATA.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 transition-all cursor-pointer rounded-[5px] ${
                currentIndex === idx ? 'w-8 bg-gradient-to-r from-amber-400 to-yellow-500' : 'w-3 bg-amber-500/20 hover:bg-amber-500/40'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

