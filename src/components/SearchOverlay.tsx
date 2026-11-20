import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  X,
  BookOpen,
  Briefcase,
  Layers,
  ArrowLeft,
  Sparkles,
  ExternalLink,
  Code2,
  TrendingUp,
  Globe,
  Palette,
  ChevronLeft,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { fetchPublicBlogPosts, BlogPost } from '../services/apiClient';
import { SERVICES_DATA, PORTFOLIO_PROJECTS } from '../data';
import { PortfolioProject, ServiceItem } from '../types';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectArticle?: (post: BlogPost) => void;
  onSelectProject?: (project: PortfolioProject) => void;
  onNavigateServices?: () => void;
  onNavigateWebDesign?: () => void;
  onNavigateSeo?: () => void;
  onNavigateAbout?: () => void;
  onNavigateContact?: () => void;
  onNavigateBlog?: () => void;
  onViewAllProjects?: () => void;
  onOpenConsultation?: () => void;
}

export const SearchOverlay: React.FC<SearchOverlayProps> = ({
  isOpen,
  onClose,
  onSelectArticle,
  onSelectProject,
  onNavigateServices,
  onNavigateWebDesign,
  onNavigateSeo,
  onNavigateAbout,
  onNavigateContact,
  onNavigateBlog,
  onViewAllProjects,
  onOpenConsultation
}) => {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'blog' | 'services' | 'projects'>('all');
  const [isSearching, setIsSearching] = useState(false);
  const [blogResults, setBlogResults] = useState<BlogPost[]>([]);
  const [serviceResults, setServiceResults] = useState<ServiceItem[]>([]);
  const [projectResults, setProjectResults] = useState<PortfolioProject[]>([]);
  const [initialBlogPosts, setInitialBlogPosts] = useState<BlogPost[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load initial blog posts for instant offline / local search fallback
  useEffect(() => {
    fetchPublicBlogPosts().then(posts => {
      if (posts && posts.length > 0) {
        setInitialBlogPosts(posts);
      }
    }).catch(() => {});
  }, []);

  // Lock body scroll and focus input when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = 'unset';
      };
    } else {
      document.body.style.overflow = 'unset';
      setQuery('');
      setBlogResults([]);
      setServiceResults([]);
      setProjectResults([]);
      setActiveTab('all');
    }
  }, [isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Normalize Persian/Arabic letters for resilient matching
  const normalize = (str?: string) => {
    if (!str) return '';
    return str
      .toLowerCase()
      .replace(/ي/g, 'ی')
      .replace(/ك/g, 'ک')
      .replace(/ة/g, 'ه')
      .replace(/[\u200B-\u200D\uFEFF]/g, '') // remove zero-width spaces
      .trim();
  };

  // Perform instant multi-source search
  useEffect(() => {
    const rawQuery = query.trim();
    if (!rawQuery) {
      setBlogResults([]);
      setServiceResults([]);
      setProjectResults([]);
      setIsSearching(false);
      return;
    }

    const q = normalize(rawQuery);
    setIsSearching(true);

    // 1. Instant local search in Services
    const matchedServices = SERVICES_DATA.filter(s => {
      return (
        normalize(s.title).includes(q) ||
        normalize(s.subtitle).includes(q) ||
        normalize(s.description).includes(q) ||
        s.features?.some(f => normalize(f).includes(q)) ||
        s.techStack?.some(t => normalize(t).includes(q))
      );
    });
    setServiceResults(matchedServices);

    // 2. Instant local search in Projects
    const matchedProjects = PORTFOLIO_PROJECTS.filter(p => {
      return (
        normalize(p.title).includes(q) ||
        normalize(p.client).includes(q) ||
        normalize(p.summary).includes(q) ||
        normalize(p.fullDescription).includes(q) ||
        normalize(p.category).includes(q) ||
        p.tags?.some(t => normalize(t).includes(q))
      );
    });
    setProjectResults(matchedProjects);

    // 3. Instant local search in already loaded blog posts
    const localBlogMatches = initialBlogPosts.filter(p => {
      return (
        normalize(p.title).includes(q) ||
        normalize(p.excerpt).includes(q) ||
        normalize(p.category).includes(q) ||
        p.tags?.some(t => normalize(t).includes(q)) ||
        normalize(p.author).includes(q)
      );
    });
    setBlogResults(localBlogMatches);

    // 4. Also fetch from backend public search API (category=undefined, search=rawQuery)
    const timer = setTimeout(async () => {
      try {
        const remotePosts = await fetchPublicBlogPosts(undefined, rawQuery);
        if (remotePosts && remotePosts.length > 0) {
          // Merge unique posts
          const map = new Map<string, BlogPost>();
          localBlogMatches.forEach(p => map.set(p.id, p));
          remotePosts.forEach(p => map.set(p.id, p));
          setBlogResults(Array.from(map.values()));
        }
      } catch (err) {
        console.warn('Backend search error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [query, initialBlogPosts]);

  if (typeof document === 'undefined') return null;

  const totalResults = blogResults.length + serviceResults.length + projectResults.length;
  const isQueryEmpty = query.trim().length === 0;

  const content = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[999999] flex flex-col justify-start items-center overflow-hidden" dir="rtl">
          {/* Backdrop Blur Overlay - Click to close */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#06050a]/95 backdrop-blur-2xl cursor-pointer -z-10"
            aria-label="بستن جستجو"
          />

          {/* Top Control Bar */}
          <div className="w-full border-b border-amber-500/20 px-4 sm:px-8 py-3.5 flex items-center justify-between bg-[#0e0c14]/90 backdrop-blur-md shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-[5px] bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Search className="w-4 h-4" />
              </div>
              <div>
                <span className="text-sm font-bold text-white tracking-wide block">
                  جستجوی هوشمند در سیگنالوکس
                </span>
                <span className="text-[10px] text-amber-200/60 font-mono hidden sm:block">
                  Live Ajax Search across Services, Blog & Portfolio
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/5 border border-white/10 rounded-[5px] text-[11px] font-mono text-white/50">
                <span>بستن با</span>
                <kbd className="bg-white/15 px-1.5 py-0.5 rounded text-amber-300 font-bold">ESC</kbd>
              </span>
              <button
                onClick={onClose}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-[5px] bg-amber-500/10 hover:bg-amber-500/25 text-amber-300 hover:text-white border border-amber-500/30 hover:border-amber-400 transition-all cursor-pointer font-bold text-xs"
                aria-label="بستن پنجره جستجو"
              >
                <span>بستن</span>
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Search Input Box */}
          <div className="max-w-4xl w-full mx-auto px-4 sm:px-6 pt-6 pb-3 shrink-0">
            <div className="relative">
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-amber-400">
                {isSearching ? (
                  <div className="w-5 h-5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Search className="w-5 h-5" />
                )}
              </div>

              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="جستجو در مقالات، خدمات، پروژه‌ها و مستندات سیگنالوکس..."
                className="w-full bg-[#120e1a] border-2 border-amber-500/30 focus:border-amber-400 text-white placeholder-white/40 text-sm sm:text-base pr-12 pl-12 py-3.5 rounded-[8px] shadow-[0_0_30px_rgba(212,175,55,0.15)] focus:outline-none transition-all"
              />

              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-1 text-white/50 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
                  title="پاک کردن عبارت جستجو"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Filter Tabs & Stats */}
            {!isQueryEmpty && (
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 text-amber-300/90 font-medium">
                  {isSearching ? (
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                      در حال جستجوی بلادرنگ...
                    </span>
                  ) : (
                    <span>
                      <span className="text-white font-bold">{totalResults}</span> نتیجه برای «
                      <span className="text-amber-400 font-bold">{query}</span>» یافت شد:
                    </span>
                  )}
                </div>

                {/* Tabs */}
                {totalResults > 0 && (
                  <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                    <button
                      onClick={() => setActiveTab('all')}
                      className={`px-3 py-1 rounded-[5px] text-xs transition-colors cursor-pointer font-bold ${
                        activeTab === 'all'
                          ? 'bg-amber-500 text-slate-950 shadow-md'
                          : 'bg-white/5 text-white/70 hover:text-white border border-white/10'
                      }`}
                    >
                      همه نتایج ({totalResults})
                    </button>
                    {serviceResults.length > 0 && (
                      <button
                        onClick={() => setActiveTab('services')}
                        className={`px-3 py-1 rounded-[5px] text-xs transition-colors cursor-pointer font-bold ${
                          activeTab === 'services'
                            ? 'bg-amber-500 text-slate-950 shadow-md'
                            : 'bg-white/5 text-white/70 hover:text-white border border-white/10'
                        }`}
                      >
                        خدمات ({serviceResults.length})
                      </button>
                    )}
                    {blogResults.length > 0 && (
                      <button
                        onClick={() => setActiveTab('blog')}
                        className={`px-3 py-1 rounded-[5px] text-xs transition-colors cursor-pointer font-bold ${
                          activeTab === 'blog'
                            ? 'bg-amber-500 text-slate-950 shadow-md'
                            : 'bg-white/5 text-white/70 hover:text-white border border-white/10'
                        }`}
                      >
                        مقالات ({blogResults.length})
                      </button>
                    )}
                    {projectResults.length > 0 && (
                      <button
                        onClick={() => setActiveTab('projects')}
                        className={`px-3 py-1 rounded-[5px] text-xs transition-colors cursor-pointer font-bold ${
                          activeTab === 'projects'
                            ? 'bg-amber-500 text-slate-950 shadow-md'
                            : 'bg-white/5 text-white/70 hover:text-white border border-white/10'
                        }`}
                      >
                        نمونه‌کارها ({projectResults.length})
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Results Container (Scrollable) */}
          <div className="flex-1 w-full overflow-y-auto px-4 sm:px-6 pb-16 max-w-4xl mx-auto">
            {/* Active Search Results (Only shown when user types) */}
            {!isQueryEmpty && (
              <div className="space-y-6 pt-2">
                {/* No Results Fallback */}
                {!isSearching && totalResults === 0 && (
                  <div className="text-center py-12 px-4 bg-[#120e1a] border border-amber-500/20 rounded-[8px]">
                    <div className="w-12 h-12 mx-auto rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-3">
                      <Search className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-white mb-1.5">نتیجه‌ای با عبارت «{query}» یافت نشد</h3>
                    <p className="text-xs text-amber-100/60 max-w-md mx-auto mb-5 leading-relaxed">
                      پیشنهاد می‌کنیم از کلمات کلیدی عام‌تر مانند «سئو»، «طراحی سایت»، «وردپرس» یا «مشاوره» استفاده فرمایید.
                    </p>
                    <div className="flex flex-wrap justify-center gap-2">
                      <button
                        onClick={() => setQuery('')}
                        className="px-4 py-2 bg-white/5 border border-white/10 hover:border-amber-400 text-xs text-white rounded-[5px] transition-colors cursor-pointer"
                      >
                        مشاهده همه گزینه‌ها
                      </button>
                      {onOpenConsultation && (
                        <button
                          onClick={() => {
                            onClose();
                            onOpenConsultation();
                          }}
                          className="px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-bold text-xs rounded-[5px] transition-all cursor-pointer"
                        >
                          درخواست مشاوره اختصاصی
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Section A: Services Results */}
                {(activeTab === 'all' || activeTab === 'services') && serviceResults.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-3 text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <Layers className="w-4 h-4" />
                        <span>خدمات مرتبط ({serviceResults.length})</span>
                      </div>
                      {onNavigateServices && (
                        <button
                          onClick={() => {
                            onClose();
                            onNavigateServices();
                          }}
                          className="text-xs text-amber-300 hover:text-white flex items-center gap-1 transition-colors cursor-pointer font-sans"
                        >
                          <span>مشاهده همه خدمات</span>
                          <ChevronLeft className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 gap-2.5">
                      {serviceResults.map(service => (
                        <div
                          key={service.id}
                          onClick={() => {
                            onClose();
                            if (service.id.includes('wp') || service.id.includes('web')) {
                              if (onNavigateWebDesign) onNavigateWebDesign();
                              else if (onNavigateServices) onNavigateServices();
                            } else if (service.id.includes('seo')) {
                              if (onNavigateSeo) onNavigateSeo();
                              else if (onNavigateServices) onNavigateServices();
                            } else {
                              if (onNavigateServices) onNavigateServices();
                            }
                          }}
                          className="p-3.5 bg-[#120e1a] border border-amber-500/20 hover:border-amber-400/60 rounded-[6px] flex items-start justify-between gap-4 cursor-pointer group transition-all hover:bg-amber-500/5"
                        >
                          <div className="space-y-1 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 bg-amber-500/10 text-amber-300 text-[10px] font-mono rounded-[3px] border border-amber-500/20">
                                خدمات تخصصی
                              </span>
                              <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                                {service.title}
                              </h4>
                            </div>
                            <p className="text-xs text-amber-100/60 font-light leading-relaxed">
                              {service.description}
                            </p>
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {service.techStack.map((tech, tIdx) => (
                                <span
                                  key={tIdx}
                                  className="px-1.5 py-0.5 bg-[#070609] text-amber-200/70 text-[10px] font-mono rounded border border-white/5"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>
                          <ArrowLeft className="w-4 h-4 text-amber-400 group-hover:-translate-x-1.5 transition-transform shrink-0 mt-1" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Section B: Blog Posts Results */}
                {(activeTab === 'all' || activeTab === 'blog') && blogResults.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-3 text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        <span>مقالات و آموزش‌های مرتبط ({blogResults.length})</span>
                      </div>
                      {onNavigateBlog && (
                        <button
                          onClick={() => {
                            onClose();
                            onNavigateBlog();
                          }}
                          className="text-xs text-amber-300 hover:text-white flex items-center gap-1 transition-colors cursor-pointer font-sans"
                        >
                          <span>مشاهده همه مقالات</span>
                          <ChevronLeft className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 gap-2.5">
                      {blogResults.map(post => (
                        <div
                          key={post.id}
                          onClick={() => {
                            onClose();
                            if (onSelectArticle) onSelectArticle(post);
                          }}
                          className="p-3.5 bg-[#120e1a] border border-amber-500/20 hover:border-amber-400/60 rounded-[6px] flex items-start justify-between gap-4 cursor-pointer group transition-all hover:bg-amber-500/5"
                        >
                          <div className="space-y-1 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 bg-amber-500/10 text-amber-300 text-[10px] font-mono rounded-[3px] border border-amber-500/20">
                                {post.category || 'وبلاگ'}
                              </span>
                              <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                                {post.title}
                              </h4>
                            </div>
                            <p className="text-xs text-amber-100/60 font-light leading-relaxed line-clamp-2">
                              {post.excerpt}
                            </p>
                            <div className="flex items-center gap-3 text-[10px] font-mono text-amber-100/40 pt-1">
                              <span>زمان مطالعه: {post.readingTime || '۵ دقیقه'}</span>
                              <span>•</span>
                              <span>نویسنده: {post.author}</span>
                            </div>
                          </div>
                          <ArrowLeft className="w-4 h-4 text-amber-400 group-hover:-translate-x-1.5 transition-transform shrink-0 mt-1" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Section C: Portfolio Projects Results */}
                {(activeTab === 'all' || activeTab === 'projects') && projectResults.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-3 text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4" />
                        <span>پروژه‌ها و نمونه‌کارها ({projectResults.length})</span>
                      </div>
                      {onViewAllProjects && (
                        <button
                          onClick={() => {
                            onClose();
                            onViewAllProjects();
                          }}
                          className="text-xs text-amber-300 hover:text-white flex items-center gap-1 transition-colors cursor-pointer font-sans"
                        >
                          <span>مشاهده همه پروژه‌ها</span>
                          <ChevronLeft className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {projectResults.map(project => (
                        <div
                          key={project.id}
                          onClick={() => {
                            onClose();
                            if (onSelectProject) onSelectProject(project);
                          }}
                          className="p-3.5 bg-[#120e1a] border border-amber-500/20 hover:border-amber-400/60 rounded-[6px] flex flex-col justify-between cursor-pointer group transition-all hover:bg-amber-500/5"
                        >
                          <div>
                            <div className="flex items-center justify-between gap-2 mb-1.5">
                              <span className="text-[10px] font-mono text-amber-400/80">
                                {project.client}
                              </span>
                              <span className="text-[10px] px-1.5 py-0.5 bg-amber-500/10 text-amber-300 rounded">
                                {project.year || '۲۰۲۵'}
                              </span>
                            </div>
                            <h4 className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors mb-1">
                              {project.title}
                            </h4>
                            <p className="text-[11px] text-amber-100/50 font-light line-clamp-2 mb-3">
                              {project.summary}
                            </p>
                          </div>
                          <div className="flex items-center justify-between text-[10px] text-amber-400 pt-2 border-t border-white/5">
                            <span>مشاهده جزئیات پروژه</span>
                            <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Bottom Master View All Results Button */}
                {totalResults > 0 && (
                  <div className="pt-6 border-t border-amber-500/20 text-center flex flex-wrap justify-center gap-3">
                    {onNavigateBlog && blogResults.length > 0 && (
                      <button
                        onClick={() => {
                          onClose();
                          onNavigateBlog();
                        }}
                        className="px-5 py-2.5 rounded-[6px] bg-[#14101c] hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold transition-all cursor-pointer flex items-center gap-2"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>مشاهده همه مقالات در آرشیو وبلاگ</span>
                      </button>
                    )}
                    {onViewAllProjects && projectResults.length > 0 && (
                      <button
                        onClick={() => {
                          onClose();
                          onViewAllProjects();
                        }}
                        className="px-5 py-2.5 rounded-[6px] bg-[#14101c] hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold transition-all cursor-pointer flex items-center gap-2"
                      >
                        <Briefcase className="w-3.5 h-3.5" />
                        <span>مشاهده همه نمونه‌کارها</span>
                      </button>
                    )}
                    {onNavigateServices && serviceResults.length > 0 && (
                      <button
                        onClick={() => {
                          onClose();
                          onNavigateServices();
                        }}
                        className="px-5 py-2.5 rounded-[6px] bg-[#14101c] hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold transition-all cursor-pointer flex items-center gap-2"
                      >
                        <Layers className="w-3.5 h-3.5" />
                        <span>مشاهده همه خدمات در برگه خدمات</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </AnimatePresence>
  );

  return createPortal(content, document.body);
};
