import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  ArrowLeft,
  ExternalLink,
  Sparkles,
  Clock,
  Calendar,
  User,
  Layers,
  TrendingUp,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Cpu,
  Globe,
  Share2,
  PhoneCall,
  Check,
  ChevronLeft
} from 'lucide-react';
import { PortfolioProject } from '../types';
import { PORTFOLIO_PROJECTS } from '../data';

interface ProjectDetailPageProps {
  project?: PortfolioProject | null;
  projectId?: string;
  onBack: () => void;
  onSelectProject: (p: PortfolioProject) => void;
  onOpenConsultation: () => void;
}

export const ProjectDetailPage: React.FC<ProjectDetailPageProps> = ({
  project: initialProject,
  projectId,
  onBack,
  onSelectProject,
  onOpenConsultation
}) => {
  const resolvedProject = initialProject || (projectId ? PORTFOLIO_PROJECTS.find(p => p.id === projectId) : null);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [projectId, initialProject?.id]);

  if (!resolvedProject) {
    return (
      <div className="min-h-screen bg-[#070609] text-gray-100 pt-32 pb-24 flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md mx-auto px-4">
          <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-center mx-auto text-amber-400">
            <Layers className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-white">پروژه مورد نظر یافت نشد</h2>
          <p className="text-sm text-zinc-400 leading-relaxed">
            پروژه درخواستی وجود ندارد یا آدرس آن تغییر کرده است.
          </p>
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 hover:bg-amber-400 transition-all cursor-pointer"
          >
            <ArrowRight className="w-4 h-4" />
            <span>مشاهده همه نمونه‌کارها</span>
          </button>
        </div>
      </div>
    );
  }

  const project = resolvedProject;
  const images = project.galleryImages && project.galleryImages.length > 0
    ? project.galleryImages
    : [project.thumbnail];

  const relatedProjects = PORTFOLIO_PROJECTS.filter((p) => p.id !== project.id);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#070609] text-gray-100 pt-24 pb-20 relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-10 right-0 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[200px] pointer-events-none" />
      <div className="absolute top-1/3 left-0 w-[500px] h-[500px] bg-yellow-500/10 rounded-full blur-[200px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[400px] h-[400px] bg-amber-600/10 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Navigation & Breadcrumb Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-amber-500/15">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#121017] border border-amber-500/20 hover:border-amber-400/50 text-white text-xs font-bold uppercase tracking-wider rounded-[5px] transition-all cursor-pointer group"
          >
            <ArrowRight className="w-4 h-4 text-amber-400 group-hover:-translate-x-1 transition-transform" />
            <span>بازگشت به همه پروژه‌ها</span>
          </button>

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-mono text-amber-200/50">
            <button onClick={onBack} className="hover:text-white transition-colors">صفحه اصلی</button>
            <span>/</span>
            <button onClick={onBack} className="hover:text-white transition-colors">نمونه‌کارها</button>
            <span>/</span>
            <span className="text-amber-400 font-semibold">{project.title}</span>
          </div>

          {/* Share & Consultation quick buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleShare}
              className="p-2.5 bg-[#121017] border border-amber-500/20 hover:border-amber-400/50 text-amber-100 hover:text-white text-xs font-mono rounded-[5px] transition-all cursor-pointer flex items-center gap-1.5"
              title="کپی لینک پروژه"
            >
              {copiedLink ? <Check className="w-4 h-4 text-amber-400" /> : <Share2 className="w-4 h-4 text-amber-400" />}
              <span className="hidden sm:inline">{copiedLink ? 'کپی شد' : 'اشتراک‌گذاری'}</span>
            </button>

            <button
              onClick={onOpenConsultation}
              className="px-4 py-2.5 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-slate-950 text-xs font-bold uppercase tracking-wider rounded-[5px] transition-all cursor-pointer flex items-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.25)]"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>سفارش پروژه مشابه</span>
            </button>
          </div>
        </div>

        {/* Hero Meta Header */}
        <div className="mb-12">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="px-3.5 py-1.5 bg-[#121017] border border-amber-500/30 text-amber-400 text-xs font-mono font-semibold uppercase tracking-widest rounded-[5px]">
              {project.categoryLabel}
            </span>
            <span className="px-3 py-1 bg-white/5 border border-amber-500/20 text-amber-100/70 text-xs font-mono rounded-[5px] flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span>سال اجرا: {project.year}</span>
            </span>
            {project.duration && (
              <span className="px-3 py-1 bg-white/5 border border-amber-500/20 text-amber-100/70 text-xs font-mono rounded-[5px] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-yellow-400" />
                <span>{project.duration}</span>
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-6">
            {project.title}
          </h1>

          <p className="text-amber-100/80 text-base sm:text-lg font-light leading-relaxed max-w-4xl mb-8">
            {project.fullDescription}
          </p>

          {/* Quick Client Info & Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-6 bg-[#121017] border border-amber-500/20 rounded-[5px]">
            <div className="space-y-1">
              <span className="text-[11px] font-mono text-amber-200/50 uppercase tracking-wider block">نام کارفرما / برند</span>
              <span className="text-sm font-bold text-white flex items-center gap-2">
                <User className="w-4 h-4 text-amber-400" />
                <span>{project.client}</span>
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-mono text-amber-200/50 uppercase tracking-wider block">دسته‌بندی تخصصی</span>
              <span className="text-sm font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-yellow-400" />
                <span>{project.categoryLabel}</span>
              </span>
            </div>

            <div className="space-y-1 lg:col-span-2">
              <span className="text-[11px] font-mono text-amber-200/50 uppercase tracking-wider block mb-1">تکنولوژی‌های کلیدی</span>
              <div className="flex flex-wrap gap-1.5">
                {project.tags.map((tag, idx) => (
                  <span key={idx} className="px-2.5 py-0.5 bg-[#070609] border border-amber-500/20 text-[11px] font-mono text-amber-100/80 rounded-[5px]">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Key Impact Metrics Grid */}
        <div className="mb-14">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">شاخص‌های کلیدی رشد و دستاورد</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {project.impactMetrics.map((m, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="glass-card p-6 border border-amber-500/30 rounded-[5px] relative overflow-hidden group hover:border-amber-400 transition-all bg-[#121017]"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600" />
                <span className="text-xs text-amber-100/60 font-mono uppercase tracking-wider block mb-2">{m.label}</span>
                <div className="text-3xl sm:text-4xl font-black font-mono text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500 mb-2">
                  {m.value}
                </div>
                {m.change && (
                  <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-mono rounded-[5px]">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>{m.change}</span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Large Mockup / Screenshot Showcase Frame */}
        <div className="mb-16">
          <div className="glass-card border border-amber-500/20 rounded-[5px] overflow-hidden shadow-2xl bg-[#121017]">
            {/* Browser Header Bar */}
            <div className="bg-[#121017] px-4 py-3 border-b border-amber-500/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block" />
              </div>

              {/* URL Address Mockup */}
              <div className="flex-1 max-w-xl mx-4 px-3 py-1 bg-[#070609] border border-amber-500/20 text-amber-100/60 text-xs font-mono text-center truncate rounded-[5px] flex items-center justify-center gap-2">
                <Globe className="w-3.5 h-3.5 text-amber-400" />
                <span>{project.linkUrl || `https://signalux.studio/projects/${project.id}`}</span>
              </div>

              {project.linkUrl ? (
                <a
                  href={project.linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 bg-amber-500/10 hover:bg-amber-500 border border-amber-500/30 text-amber-300 hover:text-slate-950 text-[11px] font-mono rounded-[5px] transition-all flex items-center gap-1"
                >
                  <span>مشاهده زنده</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              ) : (
                <div className="w-16" />
              )}
            </div>

            {/* Main Featured Image Display */}
            <div className="relative h-[300px] sm:h-[480px] lg:h-[560px] bg-[#070609] overflow-hidden">
              <img
                src={images[activeImageIdx]}
                alt={project.title}
                className="w-full h-full object-cover transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#070609]/80 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Thumbnail switcher tabs if multiple images exist */}
            {images.length > 1 && (
              <div className="p-4 bg-[#121017] border-t border-amber-500/20 flex items-center justify-center gap-3 overflow-x-auto">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`relative w-20 h-14 rounded-[5px] overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                      activeImageIdx === idx ? 'border-amber-400 scale-105 shadow-[0_0_12px_rgba(212,175,55,0.5)]' : 'border-amber-500/20 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`تصویر ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Detailed Case Study Narrative (Challenge, Solution, Results) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Challenge Box */}
          <div className="glass-card p-8 border border-amber-500/20 bg-[#121017] rounded-[5px] relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-[5px]">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest block">فاز اول // صورت مسئله</span>
                <h3 className="text-lg font-bold text-white uppercase">چالش‌های اولیه پروژه</h3>
              </div>
            </div>
            <p className="text-amber-100/70 text-sm leading-relaxed font-light">
              {project.challengeText || project.summary}
            </p>
          </div>

          {/* Solution Box */}
          <div className="glass-card p-8 border border-amber-500/30 bg-[#121017] rounded-[5px] relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-[5px]">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest block">فاز دوم // راهکار تخصصی</span>
                <h3 className="text-lg font-bold text-white uppercase">اقدامات مهندسی سیگنالوکس</h3>
              </div>
            </div>
            <p className="text-amber-100/70 text-sm leading-relaxed font-light">
              {project.solutionText || project.fullDescription}
            </p>
          </div>

          {/* Results Box */}
          <div className="glass-card p-8 border border-yellow-500/30 bg-[#121017] rounded-[5px] relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 rounded-[5px]">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-yellow-400 uppercase tracking-widest block">فاز سوم // دستاورد نهایی</span>
                <h3 className="text-lg font-bold text-white uppercase">نتایج ملموس کسب‌وکار</h3>
              </div>
            </div>
            <p className="text-amber-100/70 text-sm leading-relaxed font-light">
              {project.resultsText || 'دستیابی به حداکثر رشد، تثبیت رتبه‌های برتر و ایجاد زیرساخت مقیاس‌پذیر برای جذب خریداران جدید.'}
            </p>
          </div>
        </div>

        {/* Tech Stack Details */}
        {project.techStack && project.techStack.length > 0 && (
          <div className="mb-16 glass-card p-8 border border-amber-500/20 bg-[#121017] rounded-[5px]">
            <h3 className="text-lg font-bold text-white uppercase mb-4 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-amber-400" />
              <span>پشته فناوری و ابزارهای معماری شده در پروژه</span>
            </h3>
            <div className="flex flex-wrap gap-3">
              {project.techStack.map((tech, idx) => (
                <div
                  key={idx}
                  className="px-4 py-2 bg-[#070609] border border-amber-500/20 text-amber-100/90 text-xs font-mono font-semibold rounded-[5px] flex items-center gap-2 hover:border-amber-400/50 transition-all"
                >
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span>{tech}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Client Quote / Testimonial Card */}
        {project.clientQuote && (
          <div className="mb-16 glass-card p-8 sm:p-10 border border-amber-500/30 rounded-[5px] relative overflow-hidden bg-[#121017]">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              {project.clientAvatar && (
                <img
                  src={project.clientAvatar}
                  alt={project.client}
                  className="w-16 h-16 rounded-[5px] object-cover border-2 border-amber-400 shrink-0"
                />
              )}
              <div>
                <blockquote className="text-white text-base sm:text-lg font-light italic leading-relaxed mb-3">
                  «{project.clientQuote}»
                </blockquote>
                <div className="text-xs font-bold text-amber-400 font-mono uppercase">
                  {project.client} {project.clientRole ? `— ${project.clientRole}` : ''}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Call-To-Action Banner */}
        <div className="mb-20 glass-card p-8 sm:p-12 border border-amber-500/40 rounded-[5px] relative overflow-hidden text-center bg-gradient-to-r from-[#121017] via-[#1A1622] to-[#121017] shadow-[0_0_30px_rgba(212,175,55,0.2)]">
          <div className="max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-200 text-[11px] font-mono uppercase tracking-[0.2em] mb-4 rounded-[5px]">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>شروع یک داستان موفقیت جدید</span>
            </span>

            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight mb-4 uppercase">
              آیا آماده‌اید پروژه‌ای مشابه برای <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500">برند خود</span> خلق کنید؟
            </h2>

            <p className="text-amber-100/70 text-sm sm:text-base font-light mb-8">
              همین امروز با متخصصان سیگنالوکس مشاوره رایگان داشته باشید تا تحلیل اختصاصی برای پروژه شما انجام دهیم.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={onOpenConsultation}
                className="px-8 py-4 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold text-xs uppercase tracking-widest transition-all duration-300 flex items-center gap-2 rounded-[5px] cursor-pointer shadow-[0_0_20px_rgba(212,175,55,0.4)]"
              >
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>ثبت درخواست مشاوره و برآورد هزینه</span>
              </button>

              <button
                onClick={onBack}
                className="px-6 py-4 bg-[#070609] border border-amber-500/20 hover:border-amber-400 text-white text-xs font-bold uppercase tracking-wider rounded-[5px] transition-all cursor-pointer"
              >
                مشاهده سایر نمونه‌کارها
              </button>
            </div>
          </div>
        </div>

        {/* Related Projects Section */}
        {relatedProjects.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-amber-500/15">
              <h3 className="text-xl font-bold text-white uppercase tracking-tight flex items-center gap-2">
                <Layers className="w-5 h-5 text-amber-400" />
                <span>سایر پروژه‌های مرتبط سیگنالوکس</span>
              </h3>
              <button
                onClick={onBack}
                className="text-xs text-amber-400 hover:text-white font-mono uppercase flex items-center gap-1 transition-colors"
              >
                <span>مشاهده همه</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProjects.slice(0, 3).map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => {
                    onSelectProject(rel);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="glass-card p-5 border border-amber-500/20 hover:border-amber-400/50 bg-[#121017] rounded-[5px] transition-all cursor-pointer group"
                >
                  <div className="h-44 rounded-[5px] overflow-hidden mb-4 relative">
                    <img
                      src={rel.thumbnail}
                      alt={rel.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 px-2.5 py-1 bg-[#070609]/80 backdrop-blur-md border border-amber-500/20 text-[10px] text-amber-400 font-mono rounded-[5px]">
                      {rel.categoryLabel}
                    </div>
                  </div>

                  <h4 className="text-base font-bold text-white mb-2 group-hover:text-amber-300 transition-colors">
                    {rel.title}
                  </h4>
                  <p className="text-xs text-amber-100/60 line-clamp-2 mb-4 font-light">
                    {rel.summary}
                  </p>

                  <div className="pt-3 border-t border-amber-500/15 flex items-center justify-between text-xs text-amber-400 font-bold font-mono">
                    <span>مشاهده جزئیات کامل</span>
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
