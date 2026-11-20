import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FileText,
  Plus,
  Edit2,
  Trash2,
  Search,
  Eye,
  Calendar,
  Tag,
  Folder,
  User,
  CheckCircle,
  Clock,
  Globe,
  Sparkles,
  ExternalLink,
  RefreshCw,
  Image as ImageIcon,
  Share2,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { BlogPost, BlogPostStatus } from '../../types';
import { fetchAdminBlogPosts, createAdminBlogPost, updateAdminBlogPost, deleteAdminBlogPost } from '../../services/apiClient';

const CATEGORIES = [
  'سئو و بهینه‌سازی',
  'طراحی وب و رابط کاربری',
  'دیجیتال مارکتینگ',
  'هوش مصنوعی و اتوماسیون',
  'امنیت و زیرساخت وب',
  'تایپوگرافی و برندینگ'
];

export const BlogManager: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [editingPost, setEditingPost] = useState<Partial<BlogPost> | null>(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState<boolean>(false);
  const [saveLoading, setSaveLoading] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeTabForm, setActiveTabForm] = useState<'content' | 'seo' | 'preview'>('content');

  const loadPosts = async () => {
    setLoading(true);
    const data = await fetchAdminBlogPosts();
    setPosts(data);
    setLoading(false);
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost?.title || !editingPost?.content) {
      alert('لطفاً عنوان و محتوای مقاله را وارد کنید.');
      return;
    }

    setSaveLoading(true);
    const slug = editingPost.slug || editingPost.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\u0600-\u06FF-]/g, '');

    const postPayload = {
      ...editingPost,
      slug,
      metaTitle: editingPost.metaTitle || editingPost.title,
      metaDescription: editingPost.metaDescription || editingPost.excerpt || '',
      featuredImage: editingPost.featuredImage || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1000&q=80',
      category: editingPost.category || CATEGORIES[0],
      tags: Array.isArray(editingPost.tags) ? editingPost.tags : (typeof editingPost.tags === 'string' ? (editingPost.tags as string).split(',').map(t => t.trim()).filter(Boolean) : []),
      author: editingPost.author || 'تیم تحریریه سیگنالوکس',
      readingTime: editingPost.readingTime || '۵ دقیقه',
      status: editingPost.status || 'published'
    };

    if (editingPost.id) {
      const res = await updateAdminBlogPost(editingPost.id, postPayload);
      if (res) {
        showToast('مقاله با موفقیت به‌روزرسانی شد.');
        setEditingPost(null);
        loadPosts();
      }
    } else {
      const res = await createAdminBlogPost(postPayload);
      if (res) {
        showToast('مقاله جدید با موفقیت منتشر گردید.');
        setIsNewModalOpen(false);
        setEditingPost(null);
        loadPosts();
      }
    }
    setSaveLoading(false);
  };

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`آیا از حذف مقاله "${title}" اطمینان دارید؟`)) {
      const ok = await deleteAdminBlogPost(id);
      if (ok) {
        showToast('مقاله با موفقیت حذف شد.');
        loadPosts();
      }
    }
  };

  const filteredPosts = posts.filter(p => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div id="admin-blog-manager" className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-zinc-900 via-zinc-900 to-zinc-950 border border-zinc-800">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <FileText className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-white">مدیریت وبلاگ و مقالات تخصصی</h2>
          </div>
          <p className="text-sm text-zinc-400 max-w-3xl leading-relaxed">
            تولید و انتشار مقالات سئو محور، مدیریت برچسب‌ها، زمان مطالعه، متاداده‌های اختصاصی، تنظیمات اوپن‌گراف و نظارت بر آمار بازدید.
          </p>
        </div>

        <button
          id="btn-create-new-article"
          onClick={() => {
            setEditingPost({
              category: CATEGORIES[0],
              status: 'published',
              readingTime: '۵ دقیقه',
              author: 'کیانوش رضوانی (متخصص سئو)',
              featuredImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1000&q=80',
              tags: ['سئو', 'توسعه وب']
            });
            setIsNewModalOpen(true);
            setActiveTabForm('content');
          }}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm transition-all shadow-lg shadow-purple-600/20"
        >
          <Plus className="w-4 h-4" />
          نگارش مقاله جدید
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/50">
          <div className="text-xs text-zinc-400 mb-1">کل مقالات</div>
          <div className="text-2xl font-bold text-white">{posts.length} مقاله</div>
        </div>
        <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/50">
          <div className="text-xs text-zinc-400 mb-1">منتشر شده</div>
          <div className="text-2xl font-bold text-emerald-400">
            {posts.filter(p => p.status === 'published').length}
          </div>
        </div>
        <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/50">
          <div className="text-xs text-zinc-400 mb-1">پیش‌نویس‌ها</div>
          <div className="text-2xl font-bold text-amber-400">
            {posts.filter(p => p.status === 'draft').length}
          </div>
        </div>
        <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/50">
          <div className="text-xs text-zinc-400 mb-1">مجموع بازدید مقالات</div>
          <div className="text-2xl font-bold text-purple-400">
            {posts.reduce((acc, p) => acc + (p.viewsCount || 0), 0).toLocaleString('fa-IR')}
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-zinc-900/60 p-4 rounded-xl border border-zinc-800">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-500 absolute right-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="جستجو در عنوان، متن یا دسته‌بندی مقالات..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pr-9 pl-4 py-2 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-purple-500"
          />
        </div>

        <div className="flex items-center gap-3">
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="bg-zinc-950 border border-zinc-800 text-zinc-300 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500"
          >
            <option value="all">همه دسته‌ها</option>
            {CATEGORIES.map(c => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="bg-zinc-950 border border-zinc-800 text-zinc-300 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500"
          >
            <option value="all">همه وضعیت‌ها</option>
            <option value="published">منتشر شده</option>
            <option value="draft">پیش‌نویس</option>
            <option value="archived">آرشیو</option>
          </select>

          <button
            onClick={loadPosts}
            disabled={loading}
            className="p-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-12 text-center text-zinc-500">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-purple-500" />
            در حال بارگذاری مقالات...
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="col-span-full py-12 text-center text-zinc-500 bg-zinc-900/30 rounded-2xl border border-zinc-800">
            هیچ مقاله‌ای با شرایط انتخاب شده یافت نشد.
          </div>
        ) : (
          filteredPosts.map(post => (
            <div
              key={post.id}
              className="bg-zinc-900/70 border border-zinc-800 hover:border-zinc-700 rounded-2xl overflow-hidden flex flex-col justify-between transition-all group"
            >
              <div>
                <div className="relative h-48 w-full overflow-hidden bg-zinc-950">
                  <img
                    src={post.featuredImage}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 flex items-center gap-2">
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-purple-300 border border-purple-500/30">
                      {post.category}
                    </span>
                  </div>
                  <div className="absolute top-3 left-3">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        post.status === 'published'
                          ? 'bg-emerald-500/80 text-white'
                          : post.status === 'draft'
                          ? 'bg-amber-500/80 text-black'
                          : 'bg-zinc-700 text-zinc-300'
                      }`}
                    >
                      {post.status === 'published' ? 'منتشر شده' : post.status === 'draft' ? 'پیش‌نویس' : 'آرشیو'}
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-center gap-3 text-xs text-zinc-500 mb-2">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {post.readingTime}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      {post.viewsCount || 0} بازدید
                    </span>
                    <span>•</span>
                    <span>{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('fa-IR') : ''}</span>
                  </div>

                  <h3 className="font-bold text-base text-white line-clamp-2 mb-2 group-hover:text-purple-300 transition-colors">
                    {post.title}
                  </h3>

                  <p className="text-xs text-zinc-400 line-clamp-3 leading-relaxed mb-4">{post.excerpt}</p>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {post.tags?.slice(0, 3).map(tag => (
                      <span key={tag} className="text-[10px] px-2 py-0.5 rounded bg-zinc-800/80 text-zinc-400">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-zinc-800/80 bg-zinc-950/40 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img
                    src={post.authorAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80'}
                    alt={post.author}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <span className="text-xs text-zinc-400">{post.author}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setEditingPost(post);
                      setActiveTabForm('content');
                    }}
                    className="p-1.5 rounded-lg bg-zinc-800 text-zinc-300 hover:text-purple-400 hover:bg-zinc-700 transition-colors"
                    title="ویرایش مقاله"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(post.id, post.title)}
                    className="p-1.5 rounded-lg bg-zinc-800 text-zinc-400 hover:text-rose-400 hover:bg-rose-950/40 transition-colors"
                    title="حذف مقاله"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit / Create Article Modal */}
      <AnimatePresence>
        {(isNewModalOpen || editingPost) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="w-full max-w-4xl bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden my-6"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-zinc-800 bg-zinc-950/60">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-white">
                      {editingPost?.id ? `ویرایش مقاله: ${editingPost.title}` : 'نگارش مقاله جدید در وبلاگ'}
                    </h3>
                    <p className="text-xs text-zinc-400">مدیریت محتوا، سئوی On-Page و برچسب‌های وبلاگ</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex bg-zinc-950 p-1 rounded-xl border border-zinc-800 text-xs">
                    <button
                      type="button"
                      onClick={() => setActiveTabForm('content')}
                      className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
                        activeTabForm === 'content' ? 'bg-purple-600 text-white' : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      محتوا و متن
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTabForm('seo')}
                      className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
                        activeTabForm === 'seo' ? 'bg-purple-600 text-white' : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      سئو و متا تگ‌ها
                    </button>
                  </div>
                  <button
                    onClick={() => {
                      setIsNewModalOpen(false);
                      setEditingPost(null);
                    }}
                    className="text-zinc-400 hover:text-white p-2 rounded-xl hover:bg-zinc-800 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleSave} className="p-6 max-h-[72vh] overflow-y-auto space-y-5">
                {activeTabForm === 'content' ? (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-zinc-300 mb-1.5">عنوان اصلی مقاله (H1) *</label>
                        <input
                          type="text"
                          required
                          value={editingPost?.title || ''}
                          onChange={e => setEditingPost({ ...editingPost, title: e.target.value })}
                          placeholder="مثال: راهنمای جامع سئوی تکنیکال ۲۰۲۶"
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-purple-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-zinc-300 mb-1.5">دسته‌بندی مقاله *</label>
                        <select
                          value={editingPost?.category || CATEGORIES[0]}
                          onChange={e => setEditingPost({ ...editingPost, category: e.target.value })}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-purple-500"
                        >
                          {CATEGORIES.map(c => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-zinc-300 mb-1.5">نامک آدرس (URL Slug)</label>
                        <input
                          type="text"
                          value={editingPost?.slug || ''}
                          onChange={e => setEditingPost({ ...editingPost, slug: e.target.value })}
                          placeholder="technical-seo-guide-2026"
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-sm text-zinc-200 font-mono focus:outline-none focus:border-purple-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-zinc-300 mb-1.5">نویسنده مقاله</label>
                        <input
                          type="text"
                          value={editingPost?.author || ''}
                          onChange={e => setEditingPost({ ...editingPost, author: e.target.value })}
                          placeholder="کیانوش رضوانی"
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-sm text-zinc-200 focus:outline-none focus:border-purple-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-zinc-300 mb-1.5">زمان تخمینی مطالعه</label>
                        <input
                          type="text"
                          value={editingPost?.readingTime || '۵ دقیقه'}
                          onChange={e => setEditingPost({ ...editingPost, readingTime: e.target.value })}
                          placeholder="۵ دقیقه"
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-sm text-zinc-200 focus:outline-none focus:border-purple-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1.5">تصویر شاخص (URL Image)</label>
                      <div className="flex gap-3">
                        <input
                          type="url"
                          value={editingPost?.featuredImage || ''}
                          onChange={e => setEditingPost({ ...editingPost, featuredImage: e.target.value })}
                          placeholder="https://images.unsplash.com/..."
                          className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-sm text-zinc-200 font-mono focus:outline-none focus:border-purple-500"
                        />
                        {editingPost?.featuredImage && (
                          <img
                            src={editingPost.featuredImage}
                            alt="preview"
                            className="w-10 h-10 rounded-lg object-cover border border-zinc-700"
                          />
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1.5">چکیده مقاله (Excerpt)</label>
                      <textarea
                        rows={2}
                        value={editingPost?.excerpt || ''}
                        onChange={e => setEditingPost({ ...editingPost, excerpt: e.target.value })}
                        placeholder="خلاصه‌ای جذاب و کوتاه از مقاله جهت نمایش در کارت‌ها و پیش‌نمایش شبکه‌های اجتماعی..."
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                        متن کامل مقاله (Markdown & HTML Supported) *
                      </label>
                      <textarea
                        rows={10}
                        required
                        value={editingPost?.content || ''}
                        onChange={e => setEditingPost({ ...editingPost, content: e.target.value })}
                        placeholder="## عنوان تیتر اول\n\nمتن پاراگراف مقاله به زبان فارسی...\n\n### زیرعنوان\n- مورد اول\n- مورد دوم"
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-sm text-zinc-100 font-mono leading-relaxed focus:outline-none focus:border-purple-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-zinc-300 mb-1.5">برچسب‌ها (با ویرگول جدا کنید)</label>
                        <input
                          type="text"
                          value={Array.isArray(editingPost?.tags) ? editingPost?.tags.join(', ') : editingPost?.tags || ''}
                          onChange={e =>
                            setEditingPost({
                              ...editingPost,
                              tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean)
                            })
                          }
                          placeholder="سئو, طراحی سایت, گوگل"
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-sm text-zinc-200 focus:outline-none focus:border-purple-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-zinc-300 mb-1.5">وضعیت انتشار</label>
                        <select
                          value={editingPost?.status || 'published'}
                          onChange={e => setEditingPost({ ...editingPost, status: e.target.value as BlogPostStatus })}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-sm text-zinc-200 focus:outline-none focus:border-purple-500"
                        >
                          <option value="published">منتشر شده و فعال</option>
                          <option value="draft">پیش‌نویس (عدم نمایش عمومی)</option>
                          <option value="archived">آرشیو شده</option>
                        </select>
                      </div>
                    </div>
                  </>
                ) : (
                  /* SEO Tab */
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
                      <Sparkles className="w-5 h-5 flex-shrink-0" />
                      این متاداده‌ها به صورت استاندارد در هدر HTML و نقشه سایت قرار می‌گیرند تا بالاترین رتبه را در گوگل دریافت کنید.
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1.5">عنوان سئو (Meta Title)</label>
                      <input
                        type="text"
                        value={editingPost?.metaTitle || ''}
                        onChange={e => setEditingPost({ ...editingPost, metaTitle: e.target.value })}
                        placeholder="عنوان جذاب سئو شامل کلمه کلیدی اصلی (حداکثر ۶۰ کاراکتر)"
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1.5">توضیحات متا (Meta Description)</label>
                      <textarea
                        rows={3}
                        value={editingPost?.metaDescription || ''}
                        onChange={e => setEditingPost({ ...editingPost, metaDescription: e.target.value })}
                        placeholder="توضیحات گیرا و ترغیب‌کننده برای جذب کلیک در صفحه نتایج گوگل (حدود ۱۵۰ تا ۱۶۰ کاراکتر)..."
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-purple-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-zinc-300 mb-1.5">کلمه کلیدی کانونی (Focus Keyword)</label>
                        <input
                          type="text"
                          value={editingPost?.focusKeyword || ''}
                          onChange={e => setEditingPost({ ...editingPost, focusKeyword: e.target.value })}
                          placeholder="مثال: سئوی تکنیکال"
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-purple-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-zinc-300 mb-1.5">آدرس کانونیکال (Canonical URL)</label>
                        <input
                          type="url"
                          value={editingPost?.canonicalUrl || ''}
                          onChange={e => setEditingPost({ ...editingPost, canonicalUrl: e.target.value })}
                          placeholder="https://signalux.ir/blog/article-slug"
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-200 font-mono focus:outline-none focus:border-purple-500"
                        />
                      </div>
                    </div>

                    {/* Google SERP Simulator */}
                    <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 mt-4">
                      <div className="text-xs font-bold text-zinc-400 mb-2 flex items-center gap-1.5">
                        <Globe className="w-4 h-4 text-emerald-400" />
                        پیش‌نمایش در نتایج جستجوی گوگل (SERP Snippet Preview):
                      </div>
                      <div className="p-4 rounded-lg bg-zinc-900 border border-zinc-800 space-y-1 font-sans">
                        <div className="text-xs text-zinc-400 font-mono">
                          https://signalux.ir › blog › {editingPost?.slug || 'article-slug'}
                        </div>
                        <div className="text-base text-blue-400 hover:underline cursor-pointer font-medium">
                          {editingPost?.metaTitle || editingPost?.title || 'عنوان مقاله شما در گوگل'}
                        </div>
                        <div className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                          {editingPost?.metaDescription || editingPost?.excerpt || 'توضیحات متای مقاله در این بخش نمایش داده خواهد شد...'}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Form Actions */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
                  <button
                    type="button"
                    onClick={() => {
                      setIsNewModalOpen(false);
                      setEditingPost(null);
                    }}
                    className="px-5 py-2.5 rounded-xl border border-zinc-700 text-zinc-300 hover:bg-zinc-800 text-sm font-medium transition-colors"
                  >
                    انصراف
                  </button>
                  <button
                    type="submit"
                    disabled={saveLoading}
                    className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm transition-all shadow-lg shadow-purple-600/20 disabled:opacity-50"
                  >
                    {saveLoading ? 'در حال ذخیره‌سازی...' : editingPost?.id ? 'ذخیره ویرایش مقاله' : 'انتشار مقاله'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 p-4 rounded-xl bg-purple-600 text-white font-bold text-sm shadow-xl flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          {toastMessage}
        </div>
      )}
    </div>
  );
};
