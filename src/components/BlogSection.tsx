import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import {
  Search,
  Clock,
  Eye,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { BlogPost } from '../types';
import { fetchPublicBlogPosts } from '../services/apiClient';
import { Pagination } from './Pagination';

interface BlogSectionProps {
  onArticleSelect?: (post: BlogPost) => void;
  isHomePage?: boolean;
  showFilters?: boolean;
  onViewAllArticles?: () => void;
  onBackToHome?: () => void;
}

const ITEMS_PER_PAGE = 9;

function advanceArticle(track: HTMLDivElement, direction: number, total: number) {
  const width = track.clientWidth;
  if (!width) return;
  const current = Math.round(Math.abs(track.scrollLeft) / width);
  const next = (current + direction + total) % total;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  track.scrollTo({
    left: -next * width,
    behavior: reduceMotion || Math.abs(next - current) > 1 ? 'instant' : 'smooth',
  });
}

export const BlogSection: React.FC<BlogSectionProps> = ({
  onArticleSelect,
  isHomePage = true,
  showFilters = false,
  onViewAllArticles,
  onBackToHome
}) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [paused, setPaused] = useState(false);
  const articleTrack = useRef<HTMLDivElement>(null);
  const lastScroll = useRef(0);

  const categories = [
    { id: 'all', label: 'همه مقالات' },
    { id: 'سئو و بهینه‌سازی', label: 'سئو و بهینه‌سازی' },
    { id: 'طراحی وب و رابط کاربری', label: 'طراحی وب و UI/UX' },
    { id: 'دیجیتال مارکتینگ', label: 'دیجیتال مارکتینگ' },
    { id: 'هوش مصنوعی و اتوماسیون', label: 'هوش مصنوعی' }
  ];

  const loadPosts = async () => {
    setLoading(true);
    const data = await fetchPublicBlogPosts(
      showFilters ? selectedCategory : undefined,
      showFilters ? searchQuery : undefined
    );
    setPosts(data);
    setLoading(false);
  };

  useEffect(() => {
    loadPosts();
  }, [selectedCategory, searchQuery, showFilters]);

  // Reset to first page when category or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery]);

  const totalPages = Math.ceil(posts.length / ITEMS_PER_PAGE);
  const displayedPosts = isHomePage
    ? posts.slice(0, 6)
    : posts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  useEffect(() => {
    const track = articleTrack.current;
    if (!isHomePage || paused || !track || displayedPosts.length < 2) return;
    const mobile = window.matchMedia('(max-width: 47.999rem)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let visible = false;
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
    observer.observe(track);
    const timer = window.setInterval(() => {
      if (mobile.matches && visible && !document.hidden && !reducedMotion.matches &&
        !track.matches(':focus-within') && performance.now() - lastScroll.current > 1200) {
        advanceArticle(track, 1, displayedPosts.length);
      }
    }, 4500);
    return () => {
      observer.disconnect();
      window.clearInterval(timer);
    };
  }, [isHomePage, loading, paused, displayedPosts.length]);

  function moveArticle(direction: number) {
    if (articleTrack.current) advanceArticle(articleTrack.current, direction, displayedPosts.length);
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const blogEl = document.getElementById('blog-section');
    if (blogEl) {
      blogEl.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleOpenArticle = (post: BlogPost) => {
    if (onArticleSelect) {
      onArticleSelect(post);
    }
  };

  return (
    <section id="blog-section" className="py-20 sm:py-24 relative overflow-hidden bg-[#0B0B0F] text-white">
      {/* Background Subtle Ambient Glows (Warm Amber / Gold Theme) */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-amber-500/5 blur-[150px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[300px] bg-yellow-500/5 blur-[130px] pointer-events-none -z-10" />

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb if standalone blog page */}
        {!isHomePage && onBackToHome && (
          <div className="flex items-center gap-2 text-xs sm:text-sm text-zinc-400 mb-8 pb-4 border-b border-amber-500/10">
            <button
              onClick={onBackToHome}
              className="hover:text-amber-300 transition-colors cursor-pointer"
            >
              صفحه اصلی
            </button>
            <span className="text-zinc-600">/</span>
            <span className="text-amber-400 font-medium">وبلاگ و پایگاه دانش تخصصی</span>
          </div>
        )}

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-4 tracking-wide shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>پایگاه دانش و وبلاگ سیگنالوکس</span>
          </div>

          <h2 className="text-[24px] font-extrabold text-white tracking-tight mb-5 leading-tight">
            جدیدترین مقالات و ترندهای{' '}
            <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-200 bg-clip-text text-transparent">
              سئو و توسعه وب
            </span>
          </h2>
        </div>

        {/* Blog Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className={`h-96 rounded-3xl bg-zinc-900/40 border border-zinc-800 animate-pulse ${
                isHomePage && i > 1 ? 'hidden md:block' : ''
              }`} />
            ))}
          </div>
        ) : displayedPosts.length === 0 ? (
          <div className="py-20 text-center rounded-3xl bg-zinc-900/30 border border-zinc-800/80">
            <BookOpen className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-zinc-300 mb-2">مقاله‌ای یافت نشد</h3>
            <p className="text-sm text-zinc-500">لطفاً دسته‌بندی دیگری انتخاب کرده یا عبارت جستجو را تغییر دهید.</p>
          </div>
        ) : (
          <>
            <div
              ref={isHomePage ? articleTrack : undefined}
              onScroll={isHomePage ? () => { lastScroll.current = performance.now(); } : undefined}
              dir={isHomePage ? 'rtl' : undefined}
              className={isHomePage
                ? 'flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] md:grid md:grid-cols-2 md:gap-8 md:overflow-visible lg:grid-cols-3'
                : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'}
            >
              {displayedPosts.map((post, idx) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  onClick={() => handleOpenArticle(post)}
                  className={`group bg-zinc-900/60 hover:bg-zinc-900/90 border border-zinc-800/80 hover:border-amber-500/40 rounded-3xl overflow-hidden transition-all duration-300 flex flex-col justify-between cursor-pointer hover:shadow-2xl hover:shadow-amber-500/10 ${
                    isHomePage ? 'max-md:w-full max-md:shrink-0 max-md:snap-start' : ''
                  }`}
                >
                  <div>
                    {/* Featured Image */}
                    <div className="relative h-56 w-full overflow-hidden bg-zinc-950">
                      <img
                        src={post.featuredImage}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
                      
                      {/* Category Tag */}
                      <div className="absolute top-4 right-4">
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#0B0B0F]/90 backdrop-blur-md text-amber-300 border border-amber-500/30 shadow-md">
                          {post.category}
                        </span>
                      </div>

                      {/* Reading Time */}
                      <div className="absolute bottom-4 right-4 flex items-center gap-1.5 text-xs text-zinc-300 bg-black/70 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-zinc-800">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        <span>{post.readingTime}</span>
                      </div>
                    </div>

                    {/* Body Content */}
                    <div className="p-6">
                      <div className="flex items-center gap-2 text-xs text-zinc-500 mb-3">
                        <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                        <span>{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('fa-IR') : 'بهار ۱۴۰۵'}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5 text-amber-500/70" />
                          {post.viewsCount || 0}
                        </span>
                      </div>

                      <h3 className="font-bold text-lg text-white group-hover:text-amber-300 transition-colors line-clamp-2 mb-3 leading-snug">
                        {post.title}
                      </h3>

                      <p className="text-zinc-400 text-xs sm:text-sm line-clamp-3 leading-relaxed mb-4">
                        {post.excerpt}
                      </p>

                      {/* Tags - Without # character as requested */}
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          {post.tags.slice(0, 3).map((tag, tIdx) => {
                            const cleanTag = tag.replace(/^#+/, '').trim();
                            return (
                              <span
                                key={tIdx}
                                className="text-[11px] px-2.5 py-0.5 rounded-md bg-zinc-800/80 text-zinc-300 border border-zinc-700/50"
                              >
                                {cleanTag}
                              </span>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Footer / Author */}
                  <div className="p-6 pt-0 flex items-center justify-between border-t border-zinc-800/40 mt-4">
                    <div className="flex items-center gap-2.5 pt-4">
                      <img
                        src={post.authorAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80'}
                        alt={post.author}
                        className="w-8 h-8 rounded-full object-cover border border-amber-500/30"
                      />
                      <div>
                        <div className="text-xs font-semibold text-zinc-200">{post.author}</div>
                        <div className="text-[10px] text-zinc-500">{post.authorRole || 'استودیو سیگنالوکس'}</div>
                      </div>
                    </div>

                    <div className="pt-4">
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-400 group-hover:translate-x-[-4px] transition-transform">
                        مطالعه مقاله
                        <ChevronLeft className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
            {isHomePage && displayedPosts.length > 1 && (
              <div className="mt-4 flex justify-center gap-2 md:hidden">
                <button type="button" aria-label="مقالهٔ قبلی" onClick={() => moveArticle(-1)}
                  className="grid size-11 place-items-center rounded-md border border-amber-500/30 text-amber-300">
                  <ChevronRight size={18} aria-hidden="true" />
                </button>
                <button type="button" aria-label="توقف نمایش خودکار مقالات" aria-pressed={paused} onClick={() => setPaused(value => !value)}
                  className="grid size-11 place-items-center rounded-md border border-amber-500/30 text-amber-300">
                  {paused ? <Play size={17} aria-hidden="true" /> : <Pause size={17} aria-hidden="true" />}
                </button>
                <button type="button" aria-label="مقالهٔ بعدی" onClick={() => moveArticle(1)}
                  className="grid size-11 place-items-center rounded-md border border-amber-500/30 text-amber-300">
                  <ChevronLeft size={18} aria-hidden="true" />
                </button>
              </div>
            )}

            {/* Pagination for Archive Page */}
            {!isHomePage && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={posts.length}
                itemsPerPage={ITEMS_PER_PAGE}
                itemLabel="مقاله"
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}

        {/* View All Articles Button for Homepage */}
        {isHomePage && onViewAllArticles && posts.length > 0 && (
          <div className="mt-14 text-center">
            <button
              onClick={onViewAllArticles}
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-850 text-amber-300 hover:text-amber-200 border border-amber-500/30 hover:border-amber-500/60 font-bold text-sm shadow-lg hover:shadow-amber-500/10 transition-all cursor-pointer group"
            >
              <span>مشاهده آرشیو کامل مقالات و پایگاه دانش</span>
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-amber-400" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
