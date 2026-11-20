import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  ArrowLeft,
  Calendar,
  Clock,
  Eye,
  Share2,
  ThumbsUp,
  Check,
  BookOpen,
  ChevronLeft,
  Sparkles,
  MessageSquareText,
  MessageSquare,
  User,
  ExternalLink,
  Send,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  CornerDownLeft
} from 'lucide-react';
import { BlogPost, BlogComment } from '../types';
import { fetchPublicBlogPosts, fetchPublicBlogPostBySlug, fetchBlogComments, submitBlogComment } from '../services/apiClient';

interface BlogPostDetailPageProps {
  post?: BlogPost | null;
  slugParam?: string;
  onBack: () => void;
  onBackToHome?: () => void;
  onSelectPost: (post: BlogPost) => void;
  onOpenConsultation?: () => void;
}

export const BlogPostDetailPage: React.FC<BlogPostDetailPageProps> = ({
  post: initialPost,
  slugParam,
  onBack,
  onBackToHome,
  onSelectPost,
  onOpenConsultation
}) => {
  const [currentPost, setCurrentPost] = useState<BlogPost | null>(initialPost || null);
  const [loading, setLoading] = useState<boolean>(!initialPost);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [likesCount, setLikesCount] = useState<number>(initialPost?.likesCount || 0);
  const [copiedShare, setCopiedShare] = useState<boolean>(false);

  // Comments state
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [loadingComments, setLoadingComments] = useState<boolean>(false);
  const [commentAuthor, setCommentAuthor] = useState('');
  const [commentEmail, setCommentEmail] = useState('');
  const [commentContent, setCommentContent] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [commentSuccess, setCommentSuccess] = useState('');
  const [commentError, setCommentError] = useState('');

  const loadComments = async (postIdOrSlug: string) => {
    setLoadingComments(true);
    try {
      const data = await fetchBlogComments(postIdOrSlug);
      setComments(data);
    } catch (err) {
      console.error('Failed to load comments:', err);
    } finally {
      setLoadingComments(false);
    }
  };

  useEffect(() => {
    const slugToLoad = slugParam || initialPost?.slug || initialPost?.id;
    if (!slugToLoad && !initialPost) {
      setLoading(false);
      return;
    }

    if (initialPost) {
      setCurrentPost(initialPost);
      setLikesCount(initialPost.likesCount || 0);
      loadComments(initialPost.slug || initialPost.id);
    }

    // Fetch fresh post to update view count and full content
    const loadFresh = async () => {
      if (slugToLoad) {
        setLoading(!initialPost);
        const fresh = await fetchPublicBlogPostBySlug(slugToLoad);
        if (fresh) {
          setCurrentPost(fresh);
          setLikesCount(fresh.likesCount || 0);
          loadComments(fresh.slug || fresh.id);
          // Fetch related articles
          const all = await fetchPublicBlogPosts(fresh.category);
          const filtered = all.filter(p => p.id !== fresh.id && p.slug !== fresh.slug).slice(0, 3);
          setRelatedPosts(filtered);
        }
        setLoading(false);
      }
    };
    loadFresh();

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [initialPost?.id, initialPost?.slug, slugParam]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPost) return;
    if (!commentAuthor.trim() || !commentContent.trim()) {
      setCommentError('لطفاً نام و متن دیدگاه خود را وارد کنید.');
      return;
    }
    setSubmittingComment(true);
    setCommentError('');
    setCommentSuccess('');

    const res = await submitBlogComment(currentPost.slug || currentPost.id, {
      authorName: commentAuthor.trim(),
      authorEmail: commentEmail.trim() || undefined,
      content: commentContent.trim()
    });

    if (res) {
      setCommentSuccess('دیدگاه شما با موفقیت ثبت شد و پس از بررسی و تأیید تیم تحریریه نمایش داده خواهد شد.');
      setCommentAuthor('');
      setCommentEmail('');
      setCommentContent('');
      loadComments(currentPost.slug || currentPost.id);
    } else {
      setCommentError('خطا در ثبت دیدگاه. لطفاً لحظاتی دیگر تلاش کنید.');
    }
    setSubmittingComment(false);
  };

  const handleToggleLike = () => {
    if (isLiked) {
      setIsLiked(false);
      setLikesCount(prev => Math.max(0, prev - 1));
    } else {
      setIsLiked(true);
      setLikesCount(prev => prev + 1);
    }
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0B0F] text-zinc-100 pt-32 pb-24 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-mono text-amber-200/70">در حال دریافت و بارگذاری محتوای مقاله...</p>
        </div>
      </div>
    );
  }

  if (!currentPost) {
    return (
      <div className="min-h-screen bg-[#0B0B0F] text-zinc-100 pt-32 pb-24 flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md mx-auto px-4">
          <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-center mx-auto text-amber-400">
            <BookOpen className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-white">مقاله مورد نظر یافت نشد</h2>
          <p className="text-sm text-zinc-400 leading-relaxed">
            ممکن است آدرس مقاله تغییر کرده باشد یا موقتاً در دسترس نباشد.
          </p>
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 hover:bg-amber-400 transition-all cursor-pointer"
          >
            <ArrowRight className="w-4 h-4" />
            <span>مشاهده همه مقالات</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <article className="min-h-screen bg-[#0B0B0F] text-zinc-100 pt-28 pb-24 relative selection:bg-amber-500/30 selection:text-amber-200">
      {/* Background ambient lighting */}
      <div className="absolute top-20 right-1/4 w-[600px] h-[350px] bg-amber-500/5 blur-[160px] pointer-events-none -z-10 overflow-hidden" />
      <div className="absolute bottom-20 left-10 w-[500px] h-[300px] bg-yellow-500/5 blur-[140px] pointer-events-none -z-10 overflow-hidden" />

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb & Back Button */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-amber-500/10">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-zinc-400">
            <button
              onClick={onBackToHome || onBack}
              className="hover:text-amber-300 transition-colors cursor-pointer"
            >
              صفحه اصلی
            </button>
            <span className="text-zinc-600">/</span>
            <button
              onClick={onBack}
              className="hover:text-amber-300 transition-colors cursor-pointer"
            >
              مقالات و پایگاه دانش
            </button>
            <span className="text-zinc-600">/</span>
            <span className="text-amber-400 font-medium truncate max-w-[180px] sm:max-w-xs">
              {currentPost.category}
            </span>
          </div>

          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900/90 border border-amber-500/20 text-xs sm:text-sm text-zinc-300 hover:text-amber-300 hover:border-amber-500/40 hover:bg-zinc-800 transition-all cursor-pointer"
          >
            <ArrowRight className="w-4 h-4 text-amber-400" />
            <span>بازگشت به مقالات</span>
          </button>
        </div>

        {/* Article Header */}
        <header className="mb-10">
          {/* Category Badge & Reading Time */}
          <div className="flex flex-wrap items-center gap-3 mb-5">
            <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              {currentPost.category}
            </span>

            <div className="flex items-center gap-1.5 text-xs text-zinc-400 bg-zinc-900/80 px-3 py-1.5 rounded-full border border-zinc-800">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>زمان مطالعه: {currentPost.readingTime || '۵ دقیقه'}</span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-zinc-400 bg-zinc-900/80 px-3 py-1.5 rounded-full border border-zinc-800">
              <Eye className="w-3.5 h-3.5 text-amber-400" />
              <span>{currentPost.viewsCount || 0} بازدید</span>
            </div>
          </div>

          {/* Main Title (Reduced to half size) */}
          <h1 className="text-base sm:text-xl md:text-2xl font-bold text-white leading-snug tracking-tight mb-5">
            {currentPost.title}
          </h1>

          {/* Author & Publication Meta */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-zinc-900/70 border border-zinc-800/80">
            <div className="flex items-center gap-3">
              <img
                src={
                  currentPost.authorAvatar ||
                  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80'
                }
                alt={currentPost.author}
                className="w-12 h-12 rounded-full object-cover border-2 border-amber-500/30 shadow-md shadow-amber-500/10"
              />
              <div>
                <div className="text-sm font-bold text-white flex items-center gap-1.5">
                  <span>{currentPost.author}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-normal">
                    نویسنده
                  </span>
                </div>
                <div className="text-xs text-zinc-400 mt-0.5">
                  {currentPost.authorRole || 'استودیو دیجیتال مارکتینگ سیگنالوکس'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-left hidden sm:block">
                <div className="text-xs text-zinc-500">تاریخ انتشار</div>
                <div className="text-xs font-semibold text-zinc-300 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                  {currentPost.publishedAt
                    ? new Date(currentPost.publishedAt).toLocaleDateString('fa-IR')
                    : 'بهار ۱۴۰۵'}
                </div>
              </div>

              {/* Share Button */}
              <button
                onClick={handleShare}
                className="p-2.5 rounded-xl bg-zinc-800/90 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700/60 transition-all flex items-center gap-1.5 text-xs font-medium cursor-pointer"
                title="اشتراک‌گذاری مقاله"
              >
                {copiedShare ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400">لینک کپی شد</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4 text-amber-400" />
                    <span>اشتراک‌گذاری</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </header>

        {/* Featured Banner Image */}
        <div className="mb-10 rounded-3xl overflow-hidden border border-amber-500/20 bg-zinc-950 shadow-2xl relative group">
          <img
            src={currentPost.featuredImage}
            alt={currentPost.title}
            className="w-full max-h-[500px] object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0F] via-transparent to-transparent opacity-60" />
        </div>

        {/* 12-Column Grid Layout for 1280px Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Main Article Content Column (8 Cols) */}
          <div className="lg:col-span-8">
            {/* Excerpt Lead Callout */}
            {currentPost.excerpt && (
              <div className="mb-10 p-6 rounded-2xl bg-gradient-to-l from-amber-500/10 via-amber-500/5 to-transparent border-r-4 border-amber-400 text-amber-100 text-base sm:text-lg leading-relaxed font-normal shadow-sm">
                {currentPost.excerpt}
              </div>
            )}

            {/* Article Body Content */}
            <div className="text-zinc-200 text-base sm:text-lg leading-loose space-y-6 font-sans">
              {currentPost.content.split('\n\n').map((para, idx) => {
                if (para.startsWith('## ')) {
                  return (
                    <h2
                      key={idx}
                      className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white mt-12 mb-4 pr-4 border-r-4 border-amber-400 leading-snug"
                    >
                      {para.replace('## ', '')}
                    </h2>
                  );
                }
                if (para.startsWith('### ')) {
                  return (
                    <h3
                      key={idx}
                      className="text-lg sm:text-xl font-bold text-amber-300 mt-8 mb-3 pr-2"
                    >
                      {para.replace('### ', '')}
                    </h3>
                  );
                }
                if (para.startsWith('- ')) {
                  return (
                    <ul
                      key={idx}
                      className="space-y-3 pr-4 my-6 bg-zinc-900/40 p-5 rounded-2xl border border-zinc-800/80"
                    >
                      {para.split('\n').map((item, j) => (
                        <li key={j} className="flex items-start gap-2.5 text-zinc-300 text-sm sm:text-base">
                          <span className="w-2 h-2 rounded-full bg-amber-400 mt-2.5 shrink-0" />
                          <span>{item.replace('- ', '')}</span>
                        </li>
                      ))}
                    </ul>
                  );
                }
                return (
                  <p key={idx} className="text-zinc-300/95 leading-relaxed text-sm sm:text-base">
                    {para}
                  </p>
                );
              })}
            </div>

            {/* Blog Post Comments & Discussion Section */}
            <div className="mt-14 pt-8 border-t border-zinc-800 space-y-8" id="comments">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <MessageSquare className="w-5 h-5 text-amber-400" />
                  <h3 className="text-xl font-bold text-white">
                    نظرات و دیدگاه‌های کاربران
                    {comments.length > 0 && (
                      <span className="mr-2 text-xs font-mono px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {comments.length}
                      </span>
                    )}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleToggleLike}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      isLiked
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-amber-300 border border-zinc-700'
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>{likesCount}</span>
                  </button>
                  <button
                    onClick={handleShare}
                    className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-amber-300 border border-zinc-700 transition-colors cursor-pointer"
                    title="اشتراک‌گذاری مقاله"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Comments List */}
              {loadingComments ? (
                <div className="p-8 text-center text-zinc-400 text-xs font-mono">
                  در حال بارگذاری دیدگاه‌ها...
                </div>
              ) : comments.length === 0 ? (
                <div className="p-8 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 text-center text-zinc-400 text-xs space-y-2">
                  <p>هنوز دیدگاهی برای این مقاله ثبت نشده است.</p>
                  <p className="text-zinc-500 text-[11px]">اولین نفری باشید که دیدگاه یا پرسش خود را به اشتراک می‌گذارید.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {comments.map(c => (
                    <div
                      key={c.id}
                      className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-xs">
                            {c.authorName ? c.authorName[0] : 'U'}
                          </div>
                          <div>
                            <span className="text-sm font-bold text-white block">
                              {c.authorName}
                            </span>
                            <span className="text-[10px] text-zinc-500 font-mono">
                              {new Date(c.createdAt).toLocaleDateString('fa-IR')}
                            </span>
                          </div>
                        </div>
                      </div>

                      <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">
                        {c.content}
                      </p>

                      {/* Admin Reply */}
                      {c.adminReply && (
                        <div className="mt-3 mr-4 sm:mr-8 p-4 rounded-xl bg-amber-500/10 border-r-2 border-amber-400 space-y-1.5">
                          <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                            <span>پاسخ تیم تحریریه سیگنالوکس</span>
                            {c.adminReply.repliedAt && (
                              <span className="text-[10px] text-amber-400/60 font-mono font-normal">
                                ({new Date(c.adminReply.repliedAt).toLocaleDateString('fa-IR')})
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-amber-100/90 leading-relaxed whitespace-pre-wrap">
                            {c.adminReply.content}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Submit Comment Form */}
              <div className="p-6 sm:p-8 rounded-3xl bg-zinc-900/80 border border-amber-500/30 space-y-5">
                <div className="flex items-center gap-2 text-white">
                  <CornerDownLeft className="w-4 h-4 text-amber-400" />
                  <h4 className="text-base font-bold">ثبت دیدگاه یا پرسش شما</h4>
                </div>

                {commentSuccess && (
                  <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                    <span>{commentSuccess}</span>
                  </div>
                )}

                {commentError && (
                  <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-xs text-rose-300 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                    <span>{commentError}</span>
                  </div>
                )}

                <form onSubmit={handleSubmitComment} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-zinc-300 mb-1.5">
                        نام و نام خانوادگی <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={commentAuthor}
                        onChange={e => setCommentAuthor(e.target.value)}
                        placeholder="مثال: رضا صادقی"
                        required
                        className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-400 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-zinc-300 mb-1.5">
                        ایمیل (جهت اطلاع از پاسخ - منتشر نمی‌شود)
                      </label>
                      <input
                        type="email"
                        value={commentEmail}
                        onChange={e => setCommentEmail(e.target.value)}
                        placeholder="name@example.com"
                        className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-400 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-zinc-300 mb-1.5">
                      متن دیدگاه یا سوال <span className="text-rose-400">*</span>
                    </label>
                    <textarea
                      rows={4}
                      value={commentContent}
                      onChange={e => setCommentContent(e.target.value)}
                      placeholder="دیدگاه، نقد، پیشنهاد یا پرسش خود درباره این مقاله را بنویسید..."
                      required
                      className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-400 rounded-xl p-4 text-xs text-white placeholder:text-zinc-600 focus:outline-none transition-colors leading-relaxed"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={submittingComment || !commentAuthor.trim() || !commentContent.trim()}
                      className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs font-mono flex items-center gap-2 transition-all disabled:opacity-40 cursor-pointer shadow-md"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{submittingComment ? 'در حال ارسال...' : 'ارسال دیدگاه'}</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Sticky Sidebar Column (4 Cols) */}
          <div className="lg:col-span-4 lg:sticky lg:top-28 self-start space-y-6">
            {/* Author Bio Box */}
            <div className="p-6 rounded-3xl bg-zinc-900/80 border border-zinc-800 space-y-4">
              <div className="flex items-center gap-4">
                <img
                  src={
                    currentPost.authorAvatar ||
                    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
                  }
                  alt={currentPost.author}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-500/30 shrink-0"
                />
                <div>
                  <h4 className="text-base font-bold text-white">{currentPost.author}</h4>
                  <span className="text-[11px] text-amber-400 font-mono">SIGNALUX EDITORIAL</span>
                </div>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                عضو تیم استراتژی و تحریریه سیگنالوکس، متمرکز بر تحول دیجیتال، سئوی پایدار و توسعه پلتفرم‌های مقیاس‌پذیر مدرن.
              </p>
            </div>

            {/* Quick Consultation Card */}
            <div className="p-6 rounded-3xl bg-gradient-to-b from-[#161320] to-[#0d0c14] border border-amber-500/30 space-y-4 text-center">
              <Sparkles className="w-8 h-8 text-amber-400 mx-auto" />
              <h4 className="text-base font-bold text-white">مشاوره تخصصی رشد کسب‌وکار</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                برای اجرای استراتژی‌های مطرح‌شده در این مقاله در پروژه خود، با کارشناسان سیگنالوکس همراه شوید.
              </p>
              <button
                onClick={onOpenConsultation}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-amber-500/20"
              >
                درخواست مشاوره رایگان
              </button>
            </div>
          </div>
        </div>

        {/* Related Articles Section */}
        {relatedPosts.length > 0 && (
          <section className="mt-20 pt-12 border-t border-zinc-800">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider block mb-1">
                  پیشنهاد مطالعه
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  سایر مقالات مرتبط در این حوزه
                </h3>
              </div>

              <button
                onClick={onBack}
                className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-semibold cursor-pointer"
              >
                <span>مشاهده همه مقالات</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map(relPost => (
                <div
                  key={relPost.id}
                  onClick={() => onSelectPost(relPost)}
                  className="group bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800 hover:border-amber-500/40 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-44 overflow-hidden bg-zinc-950">
                      <img
                        src={relPost.featuredImage}
                        alt={relPost.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute top-3 right-3">
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#0B0B0F]/90 text-amber-300 border border-amber-500/30">
                          {relPost.category}
                        </span>
                      </div>
                    </div>

                    <div className="p-5">
                      <div className="flex items-center gap-2 text-[11px] text-zinc-500 mb-2">
                        <Clock className="w-3 h-3 text-amber-400" />
                        <span>{relPost.readingTime || '۵ دقیقه'}</span>
                      </div>

                      <h4 className="font-bold text-sm sm:text-base text-white group-hover:text-amber-300 transition-colors line-clamp-2 leading-snug mb-2">
                        {relPost.title}
                      </h4>

                      <p className="text-zinc-400 text-xs line-clamp-2 leading-relaxed">
                        {relPost.excerpt}
                      </p>
                    </div>
                  </div>

                  <div className="p-5 pt-0 border-t border-zinc-800/40 mt-3 flex items-center justify-between text-xs text-amber-400 font-semibold">
                    <span>مطالعه مقاله</span>
                    <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
};
