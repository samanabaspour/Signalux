import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TESTIMONIALS_DATA } from '../data';
import { Testimonial } from '../types';
import { fetchTestimonials } from '../services/apiClient';
import { ChevronLeft, ChevronRight, MessageSquare, Quote, Star, Verified } from 'lucide-react';
import { SingularityVisual } from './SingularityVisual';

export const TestimonialsSection: React.FC = () => {
  const [testimonialsList, setTestimonialsList] = useState<Testimonial[]>(TESTIMONIALS_DATA);
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    fetchTestimonials().then(data => {
      if (data && data.length > 0) {
        setTestimonialsList(data);
      }
    });
  }, []);

  const handleNext = () => {
    setCurrentIdx((prev) => (prev + 1) % testimonialsList.length);
  };

  const handlePrev = () => {
    setCurrentIdx((prev) => (prev - 1 + testimonialsList.length) % testimonialsList.length);
  };

  const activeTestimonial = testimonialsList[currentIdx] || testimonialsList[0];

  return (
    <section id="testimonials" className="relative py-28 px-4 sm:px-6 lg:px-8 bg-[#070609] border-b border-amber-500/15 overflow-hidden">
      {/* Background Lighting Globs */}
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-[1280px] mx-auto relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#121017] border border-amber-500/30 text-amber-200 text-[11px] font-mono uppercase tracking-[0.2em] mb-4 rounded-[5px]">
            <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
            <span>تجربه مدیران و کارفرمایان</span>
          </div>

          <h2 className="text-[24px] font-black text-white tracking-tight leading-tight mb-4 uppercase">
            نظرات آن‌ها که مسیر رشد را با <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500">سیگنالوکس</span> پیموده‌اند
          </h2>
        </div>

        {/* Testimonials Container with 3D Singularity / Accretion Disk */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Singularity / Accretion Disk Visual Column */}
          <div className="lg:col-span-4 flex items-center justify-center order-2 lg:order-1">
            <SingularityVisual />
          </div>

          {/* Testimonial Card Column */}
          <div className="lg:col-span-8 order-1 lg:order-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial.id}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.4 }}
                className="glass-card p-6 sm:p-10 border border-amber-500/30 relative overflow-hidden rounded-[5px] shadow-[0_0_25px_rgba(212,175,55,0.15)]"
              >
                {/* Background Quote Watermark */}
                <Quote className="absolute top-6 left-6 w-20 h-20 text-amber-500/10 pointer-events-none" />

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  {/* Avatar & Client info */}
                  <div className="md:col-span-4 flex flex-col items-center text-center border-b md:border-b-0 md:border-l border-amber-500/20 pb-6 md:pb-0 md:pl-6">
                    <div className="relative mb-3">
                      <img
                        src={activeTestimonial.avatar}
                        alt={activeTestimonial.name}
                        className="w-20 h-20 sm:w-22 sm:h-22 object-cover border-2 border-amber-400 rounded-[5px]"
                      />
                      <div className="absolute bottom-0 right-0 p-1.5 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 rounded-[5px]">
                        <Verified className="w-4 h-4" />
                      </div>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-white mb-1 uppercase">{activeTestimonial.name}</h3>
                    <p className="text-xs text-amber-400 font-semibold tracking-wider mb-1">{activeTestimonial.role}</p>
                    <p className="text-xs text-amber-100/50 font-light mb-3">{activeTestimonial.company}</p>

                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(activeTestimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>

                  {/* Quote Content */}
                  <div className="md:col-span-8 flex flex-col justify-between">
                    <blockquote className="text-sm sm:text-base text-amber-100/90 font-light leading-relaxed mb-6 italic">
                      «{activeTestimonial.quote}»
                    </blockquote>

                    <div className="p-3.5 bg-[#070609] border border-amber-500/20 flex items-center justify-between rounded-[5px]">
                      <span className="text-xs text-amber-200/50 uppercase tracking-wider">نتیجه کلیدی حاصل شده:</span>
                      <span className="text-xs font-bold font-mono text-amber-300 uppercase">
                        {activeTestimonial.resultsAchieved}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Controls */}
            <div className="flex items-center justify-between mt-6">
              <div className="flex items-center gap-2">
                {TESTIMONIALS_DATA.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIdx(idx)}
                    className={`h-1.5 transition-all cursor-pointer rounded-[5px] ${
                      currentIdx === idx ? 'w-8 bg-gradient-to-r from-amber-400 to-yellow-500' : 'w-2 bg-amber-500/20'
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handlePrev}
                  className="p-3 bg-[#121017] border border-amber-500/20 text-amber-100 hover:bg-gradient-to-r hover:from-amber-500 hover:to-yellow-500 hover:text-slate-950 transition-all cursor-pointer rounded-[5px]"
                  aria-label="نظر قبلی"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNext}
                  className="p-3 bg-[#121017] border border-amber-500/20 text-amber-100 hover:bg-gradient-to-r hover:from-amber-500 hover:to-yellow-500 hover:text-slate-950 transition-all cursor-pointer rounded-[5px]"
                  aria-label="نظر بعدی"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};


