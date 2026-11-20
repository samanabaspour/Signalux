import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Sparkles,
  Layers,
  Filter,
  Eye,
  TrendingUp,
  CheckCircle2,
  Globe,
  Home,
  Check
} from 'lucide-react';
import { PortfolioProject } from '../types';
import { PORTFOLIO_PROJECTS } from '../data';
import { Pagination } from './Pagination';

interface AllProjectsPageProps {
  onBackToHome: () => void;
  onSelectProject: (project: PortfolioProject) => void;
  onOpenConsultation: () => void;
}

const ITEMS_PER_PAGE = 8;

export const AllProjectsPage: React.FC<AllProjectsPageProps> = ({
  onBackToHome,
  onSelectProject,
  onOpenConsultation
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'web' | 'marketing' | 'seo'>('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Filter projects
  const filteredProjects = PORTFOLIO_PROJECTS.filter((p) => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch =
      !searchQuery.trim() ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  // Reset to first page when search or category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

  const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE);
  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const filterSection = document.getElementById('projects-filter-bar');
    if (filterSection) {
      filterSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 350, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#070609] text-gray-100 pt-24 pb-20 relative overflow-hidden">
      {/* Background Lighting Globs */}
      <div className="absolute top-10 right-0 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[220px] pointer-events-none" />
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-yellow-500/10 rounded-full blur-[200px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/3 w-[450px] h-[450px] bg-amber-600/10 rounded-full blur-[200px] pointer-events-none" />

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Top Header & Breadcrumb Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-amber-500/15">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-xs font-mono text-amber-200/50">
            <button onClick={onBackToHome} className="hover:text-white transition-colors flex items-center gap-1">
              <Home className="w-3.5 h-3.5 text-amber-400" />
              <span>صفحه اصلی</span>
            </button>
            <span>/</span>
            <span className="text-amber-400 font-semibold">آرشیو کامل نمونه‌کارها</span>
          </div>

        </div>

        {/* Hero Title Section */}
        <div className="text-center max-w-4xl mx-auto mb-12">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#121017] border border-amber-500/30 text-amber-200 text-[11px] font-mono uppercase tracking-[0.2em] mb-4 rounded-[5px]">
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            <span>آرشیو جامع پروژه‌های پیاده‌سازی‌شده</span>
          </span>

          <h1 className="text-[24px] font-black text-white tracking-tight leading-tight uppercase">
            همه نمونه‌کارهای <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500">سیگنالوکس</span>
          </h1>
        </div>

        {/* Quick Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-[#121017] border border-amber-500/20 rounded-[5px] mb-10">
          <div className="text-center border-l sm:border-l-0 sm:border-r border-amber-500/15 p-2">
            <span className="text-[10px] font-mono text-amber-200/50 uppercase tracking-widest block mb-1">کل پروژه‌های فعال</span>
            <span className="text-2xl font-black font-mono text-amber-400">{PORTFOLIO_PROJECTS.length} پروژه</span>
          </div>
          <div className="text-center sm:border-r border-amber-500/15 p-2">
            <span className="text-[10px] font-mono text-amber-200/50 uppercase tracking-widest block mb-1">میزان رضایت کارفرمایان</span>
            <span className="text-2xl font-black font-mono text-yellow-400">۹۹.۴٪</span>
          </div>
          <div className="text-center border-l sm:border-l-0 sm:border-r border-amber-500/15 p-2">
            <span className="text-[10px] font-mono text-amber-200/50 uppercase tracking-widest block mb-1">حوزه کارکرد</span>
            <span className="text-2xl font-black font-mono text-amber-300">۳ دسیپلین</span>
          </div>
          <div className="text-center p-2">
            <span className="text-[10px] font-mono text-amber-200/50 uppercase tracking-widest block mb-1">نرخ تحویل به‌موقع</span>
            <span className="text-2xl font-black font-mono text-amber-400">۱۰۰٪</span>
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div id="projects-filter-bar" className="glass-card p-6 border border-amber-500/20 rounded-[5px] mb-10 space-y-6 bg-[#121017]">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">

            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-200/40" />
              <input
                type="text"
                placeholder="جستجو در عنوان پروژه، نام برند یا ابزارها..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-10 pl-4 py-2.5 bg-[#070609] border border-amber-500/20 focus:border-amber-400/80 text-white text-xs rounded-[5px] transition-all outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-amber-200/40 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              {[
                { id: 'all', label: 'همه پروژه‌ها' },
                { id: 'web', label: 'توسعه وب' },
                { id: 'seo', label: 'سئو و بهینه‌سازی' },
                { id: 'marketing', label: 'دیجیتال مارکتینگ' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id as any)}
                  className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-[5px] border transition-all cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 border-amber-400 text-slate-950 shadow-[0_0_15px_rgba(212,175,55,0.3)]'
                      : 'bg-[#121017] border-amber-500/20 text-amber-100/60 hover:text-white hover:border-amber-400/40'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

          </div>
        </div>

        {/* Results Counter & Reset Filter Option */}
        <div className="flex items-center justify-between mb-6 text-xs text-amber-100/60 font-mono">
          <div>
            نمایش <span className="text-amber-400 font-bold">{filteredProjects.length}</span> پروژه از مجموع <span className="text-white font-bold">{PORTFOLIO_PROJECTS.length}</span>
            {totalPages > 1 && (
              <span className="text-amber-200/60 mr-2">
                (صفحه <span className="text-amber-400 font-bold">{currentPage}</span> از {totalPages})
              </span>
            )}
          </div>

          {(searchQuery || selectedCategory !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="text-amber-400 hover:underline cursor-pointer"
            >
              پاک کردن همه فیلترها
            </button>
          )}
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-20 glass-card border border-amber-500/20 bg-[#121017] rounded-[5px] my-10">
            <Filter className="w-12 h-12 text-amber-200/20 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">پروژه‌ای با این مشخصات یافت نشد</h3>
            <p className="text-amber-100/50 text-xs font-light max-w-md mx-auto mb-6">
              لطفاً عبارات دیگری را جستجو کنید یا فیلترهای اعمال‌شده را بازنشانی نمایید.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 text-xs font-bold rounded-[5px]"
            >
              نمایش همه پروژه‌ها
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-10">
              <AnimatePresence mode="popLayout">
                {paginatedProjects.map((project, idx) => (
                  <motion.div
                    key={project.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                    data-cursor-text="مشاهده"
                    className="glass-card trionn-tilt-card border border-amber-500/20 bg-[#121017] overflow-hidden flex flex-col justify-between group hover:border-amber-400/50 transition-all duration-300 rounded-[5px]"
                  >
                    {/* Thumbnail & Badges */}
                    <div className="relative h-64 sm:h-72 overflow-hidden bg-[#070609] rounded-t-[5px]">
                      <img
                        src={project.thumbnail}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#121017] via-transparent to-transparent opacity-90" />

                      {/* Category & Year */}
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

                      {/* Impact metrics highlight bar */}
                      <div className="absolute bottom-4 inset-x-4 flex items-center justify-around p-3 bg-[#070609]/90 border border-amber-500/20 rounded-[5px]">
                        {project.impactMetrics.map((m, mIdx) => (
                          <div key={mIdx} className="text-center">
                            <span className="text-[10px] text-amber-100/50 uppercase tracking-widest block">{m.label}</span>
                            <span className="text-sm font-bold font-mono text-amber-400">{m.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Body Content */}
                    <div className="p-6 sm:p-8 flex flex-col justify-between flex-grow">
                      <div>
                        <div className="text-xs font-mono text-amber-400 mb-1 uppercase tracking-widest">{project.client}</div>
                        <h3 className="text-xl font-bold text-white mb-3 uppercase">
                          {project.title}
                        </h3>
                        <p className="text-amber-100/70 text-xs sm:text-sm font-light leading-relaxed mb-6 line-clamp-3">
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

                      {/* Action Button */}
                      <button
                        onClick={() => onSelectProject(project)}
                        className="w-full py-3.5 bg-[#121017] border border-amber-500/20 hover:bg-gradient-to-r hover:from-amber-500 hover:to-yellow-500 hover:text-slate-950 hover:border-amber-400 text-amber-100 text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 cursor-pointer group/btn rounded-[5px] shadow-lg"
                      >
                        <Eye className="w-4 h-4 text-amber-400 group-hover/btn:text-slate-950" />
                        <span>مشاهده جزئیات کامل پروژه (بدون پاپ آپ)</span>
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Pagination Component */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredProjects.length}
              itemsPerPage={ITEMS_PER_PAGE}
              itemLabel="پروژه"
              onPageChange={handlePageChange}
            />
          </>
        )}

        {/* Bottom CTA Banner */}
        <div className="glass-card p-8 sm:p-12 border border-amber-500/40 rounded-[5px] relative overflow-hidden text-center bg-gradient-to-r from-[#121017] via-[#1A1622] to-[#121017] shadow-[0_0_30px_rgba(212,175,55,0.2)]">
          <div className="max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-200 text-[11px] font-mono uppercase tracking-[0.2em] mb-4 rounded-[5px]">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>مشاوره و استراتژی اختصاصی</span>
            </span>

            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight mb-8 uppercase">
              پروژه بعدی شما می‌تواند در <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500">صدر این لیست</span> باشد
            </h2>

            <button
              onClick={onOpenConsultation}
              className="px-8 py-4 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold text-xs uppercase tracking-widest transition-all duration-300 flex items-center gap-2 rounded-[5px] mx-auto cursor-pointer shadow-[0_0_20px_rgba(212,175,55,0.4)]"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>درخواست مشاوره و برآورد رایگان پروژه</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
