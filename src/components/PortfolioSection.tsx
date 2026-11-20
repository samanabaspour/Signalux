import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PORTFOLIO_PROJECTS } from '../data';
import { PortfolioProject } from '../types';
import { fetchProjects } from '../services/apiClient';
import { Eye, Sparkles, Layers, ArrowLeft } from 'lucide-react';

interface PortfolioSectionProps {
  onSelectProject: (project: PortfolioProject) => void;
  onViewAllProjects?: () => void;
}

export const PortfolioSection: React.FC<PortfolioSectionProps> = ({
  onSelectProject,
  onViewAllProjects
}) => {
  const [projectsList, setProjectsList] = useState<PortfolioProject[]>(PORTFOLIO_PROJECTS);

  useEffect(() => {
    fetchProjects().then(data => {
      if (data && data.length > 0) {
        setProjectsList(data);
      }
    });
  }, []);

  const displayedProjects = projectsList.slice(0, 4);

  return (
    <section id="portfolio" className="relative py-28 px-4 sm:px-6 lg:px-8 bg-[#070609] border-b border-amber-500/15 overflow-hidden">
      {/* Background Lighting Globs */}
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-yellow-600/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-[1280px] mx-auto relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#121017] border border-amber-500/30 text-amber-200 text-[11px] font-mono uppercase tracking-[0.2em] mb-4 rounded-[5px]"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>ویترین نمونه‌کارهای شاخص</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ delay: 0.1 }}
            className="text-[24px] font-black text-white tracking-tight leading-tight mb-4 uppercase"
          >
            پروژه‌هایی که معیار کیفیت را <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500">تغییر داده‌اند</span>
          </motion.h2>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <AnimatePresence mode="popLayout">
            {displayedProjects.map((project, idx) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                data-cursor-text="مشاهده"
                className="glass-card trionn-tilt-card border border-amber-500/15 overflow-hidden flex flex-col justify-between group hover:border-amber-400/50 transition-colors duration-300 rounded-[5px]"
              >
                {/* Image Container with overlay */}
                <div className="relative h-64 sm:h-72 overflow-hidden bg-[#070609] rounded-t-[5px]">
                  <img
                    src={project.thumbnail}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#121017] via-transparent to-transparent opacity-90" />

                  {/* Top Badges */}
                  <div className="absolute top-4 right-4 flex items-center gap-2">
                    <span className="px-3 py-1 bg-[#070609]/90 border border-amber-500/30 text-[10px] font-mono text-amber-300 uppercase tracking-wider rounded-[5px]">
                      {project.categoryLabel}
                    </span>
                  </div>

                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-[#070609]/90 border border-amber-500/20 text-[10px] font-mono text-amber-100/60 tracking-wider rounded-[5px]">
                      {project.year}
                    </span>
                  </div>

                  {/* Impact metrics highlight floating bar */}
                  <div className="absolute bottom-4 inset-x-4 flex items-center justify-around p-3 bg-[#070609]/90 border border-amber-500/20 rounded-[5px]">
                    {project.impactMetrics.map((m, mIdx) => (
                      <div key={mIdx} className="text-center">
                        <span className="text-[10px] text-amber-100/50 uppercase tracking-widest block">{m.label}</span>
                        <span className="text-sm font-bold font-mono text-amber-400">{m.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 sm:p-8 flex flex-col justify-between flex-grow">
                  <div>
                    <div className="text-xs font-mono text-amber-400 mb-1 uppercase tracking-widest">{project.client}</div>
                    <h3 className="text-xl font-bold text-white mb-3 uppercase">
                      {project.title}
                    </h3>
                    <p className="text-amber-100/70 text-xs sm:text-sm font-light leading-relaxed mb-6 line-clamp-2">
                      {project.summary}
                    </p>

                    {/* Tech Tags */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.tags.map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-2.5 py-1 bg-[#070609] border border-amber-500/20 text-[10px] font-mono text-amber-200/50 uppercase tracking-wider rounded-[5px]"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectProject(project)}
                    className="w-full py-3 bg-[#121017] border border-amber-500/20 hover:bg-gradient-to-r hover:from-amber-500 hover:to-yellow-500 hover:text-slate-950 hover:border-amber-400 text-amber-100 text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 cursor-pointer group/btn rounded-[5px]"
                  >
                    <Eye className="w-4 h-4 text-amber-400 group-hover/btn:text-slate-950" />
                    <span>مشاهده جزئیات پروژه و نتایج</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {onViewAllProjects && (
          <div className="mt-14 text-center">
            <button
              onClick={onViewAllProjects}
              className="inline-flex items-center gap-3 px-8 py-4 bg-[#121017] border border-amber-500/40 hover:border-amber-400 hover:bg-gradient-to-r hover:from-amber-500 hover:to-yellow-500 hover:text-slate-950 text-amber-100 text-xs font-bold uppercase tracking-widest rounded-[5px] transition-all duration-300 cursor-pointer shadow-[0_0_20px_rgba(212,175,55,0.2)] group"
            >
              <Layers className="w-4 h-4 text-amber-400 group-hover:text-slate-950" />
              <span>مشاهده همه پروژه ها</span>
              <ArrowLeft className="w-4 h-4 text-amber-400 group-hover:text-slate-950 group-hover:-translate-x-1.5 transition-all" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

