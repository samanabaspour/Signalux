import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MessageSquare,
  CheckCircle2,
  XCircle,
  Trash2,
  CornerDownLeft,
  Search,
  Filter,
  RefreshCw,
  Clock,
  ShieldCheck,
  Send,
  AlertCircle,
  FileText,
  ExternalLink
} from 'lucide-react';
import { BlogComment } from '../../types';
import {
  fetchAdminComments,
  updateAdminCommentStatus,
  replyAdminComment,
  deleteAdminComment
} from '../../services/apiClient';

export const CommentsManager: React.FC = () => {
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [replyingCommentId, setReplyingCommentId] = useState<string | null>(null);
  const [replyAuthor, setReplyAuthor] = useState<string>('تیم تحریریه سیگنالوکس');
  const [replyText, setReplyText] = useState<string>('');
  const [submittingReply, setSubmittingReply] = useState<boolean>(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const loadComments = async () => {
    setLoading(true);
    try {
      const data = await fetchAdminComments(statusFilter === 'all' ? undefined : statusFilter);
      setComments(data);
    } catch (err) {
      console.error('Failed to load admin comments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComments();
  }, [statusFilter]);

  const notify = (msg: string) => {
    setActionMessage(msg);
    setTimeout(() => setActionMessage(null), 3500);
  };

  const handleStatusChange = async (id: string, status: 'approved' | 'rejected') => {
    const updated = await updateAdminCommentStatus(id, status);
    if (updated) {
      setComments(prev => prev.map(c => (c.id === id ? updated : c)));
      notify(status === 'approved' ? 'دیدگاه با موفقیت تأیید شد و در سایت نمایش داده می‌شود.' : 'دیدگاه رد شد.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('آیا از حذف کامل این دیدگاه اطمینان دارید؟')) return;
    const ok = await deleteAdminComment(id);
    if (ok) {
      setComments(prev => prev.filter(c => c.id !== id));
      notify('دیدگاه حذف شد.');
    }
  };

  const handleSendReply = async (e: React.FormEvent, commentId: string) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    setSubmittingReply(true);
    const updated = await replyAdminComment(commentId, {
      author: replyAuthor.trim() || 'تیم تحریریه سیگنالوکس',
      content: replyText.trim()
    });

    if (updated) {
      setComments(prev => prev.map(c => (c.id === commentId ? updated : c)));
      setReplyingCommentId(null);
      setReplyText('');
      notify('پاسخ مدیر با موفقیت ثبت شد و دیدگاه تأیید گردید.');
    }
    setSubmittingReply(false);
  };

  const filteredComments = comments.filter(c => {
    const matchQuery =
      c.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.postTitle && c.postTitle.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchQuery;
  });

  const pendingCount = comments.filter(c => c.status === 'pending').length;

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">مدیریت دیدگاه‌ها و نظرات مقالات</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              بررسی، تأیید، پاسخ‌دهی و مدیریت دیدگاه‌های ارسال شده توسط کاربران در وبلاگ
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {pendingCount > 0 && (
            <span className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-800 border border-blue-200 text-xs font-bold flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              <span>{pendingCount} دیدگاه در انتظار تأیید</span>
            </span>
          )}
          <button
            onClick={loadComments}
            disabled={loading}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
            title="بروزرسانی لیست دیدگاه‌ها"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {actionMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Filters & Search */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
          {[
            { id: 'all', label: 'همه دیدگاه‌ها' },
            { id: 'pending', label: 'در انتظار تأیید' },
            { id: 'approved', label: 'تأیید شده' },
            { id: 'rejected', label: 'رد شده' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
                statusFilter === tab.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="جستجو در نام، مقاله یا متن دیدگاه..."
            className="w-full bg-slate-50 border border-slate-300 rounded-xl pr-9 pl-4 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
          />
        </div>
      </div>

      {/* Comments List */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-slate-500 text-xs font-mono">
            در حال دریافت اطلاعات دیدگاه‌ها...
          </div>
        ) : filteredComments.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs space-y-2">
            <MessageSquare className="w-10 h-10 text-slate-300 mx-auto" />
            <p>هیچ دیدگاهی مطابق فیلترهای انتخابی یافت نشد.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredComments.map(comment => (
              <div key={comment.id} className="p-6 hover:bg-slate-50/70 transition-colors space-y-4">
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-sm">
                      {comment.authorName ? comment.authorName[0] : 'U'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-slate-900 text-sm">{comment.authorName}</span>
                        {comment.authorEmail && (
                          <span className="text-[11px] text-slate-400 font-mono">({comment.authorEmail})</span>
                        )}
                        <span className="text-[11px] text-slate-400 font-mono">
                          {new Date(comment.createdAt).toLocaleDateString('fa-IR')}
                        </span>
                      </div>
                      {comment.postTitle && (
                        <div className="flex items-center gap-1 text-xs text-blue-700 mt-0.5">
                          <FileText className="w-3 h-3 text-blue-500" />
                          <span>مقاله: {comment.postTitle}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Status & Actions */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                        comment.status === 'approved'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : comment.status === 'rejected'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : 'bg-blue-50 text-blue-700 border-blue-200'
                      }`}
                    >
                      {comment.status === 'approved'
                        ? 'تأیید و منتشر شده'
                        : comment.status === 'rejected'
                        ? 'رد شده'
                        : 'در انتظار بررسی'}
                    </span>

                    {comment.status !== 'approved' && (
                      <button
                        onClick={() => handleStatusChange(comment.id, 'approved')}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer shadow-xs"
                        title="تأیید و نمایش در سایت"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>تأیید</span>
                      </button>
                    )}

                    {comment.status !== 'rejected' && (
                      <button
                        onClick={() => handleStatusChange(comment.id, 'rejected')}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-slate-300 hover:border-rose-200 text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                        title="عدم انتشار دیدگاه"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>رد دیدگاه</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setReplyingCommentId(replyingCommentId === comment.id ? null : comment.id);
                        setReplyText(comment.adminReply?.content || '');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <CornerDownLeft className="w-3.5 h-3.5" />
                      <span>{comment.adminReply ? 'ویرایش پاسخ' : 'ارسال پاسخ'}</span>
                    </button>

                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="حذف دیدگاه"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Comment Content */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {comment.content}
                </div>

                {/* Existing Admin Reply */}
                {comment.adminReply && replyingCommentId !== comment.id && (
                  <div className="mr-6 p-4 rounded-xl bg-blue-50/60 border-r-4 border-blue-600 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                      <ShieldCheck className="w-4 h-4 text-blue-600" />
                      <span>{comment.adminReply.author}</span>
                      {comment.adminReply.repliedAt && (
                        <span className="text-[10px] text-slate-500 font-mono font-normal">
                          ({new Date(comment.adminReply.repliedAt).toLocaleDateString('fa-IR')})
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-800 leading-relaxed whitespace-pre-wrap">
                      {comment.adminReply.content}
                    </p>
                  </div>
                )}

                {/* Inline Reply Form */}
                {replyingCommentId === comment.id && (
                  <form
                    onSubmit={e => handleSendReply(e, comment.id)}
                    className="mr-6 p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                        <CornerDownLeft className="w-4 h-4 text-blue-600" />
                        <span>پاسخ به دیدگاه {comment.authorName}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setReplyingCommentId(null)}
                        className="text-xs text-slate-500 hover:text-slate-800"
                      >
                        انصراف
                      </button>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        عنوان پاسخ‌دهنده:
                      </label>
                      <input
                        type="text"
                        value={replyAuthor}
                        onChange={e => setReplyAuthor(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        متن پاسخ رسمی مدیر:
                      </label>
                      <textarea
                        rows={3}
                        value={replyText}
                        onChange={e => setReplyText(e.target.value)}
                        placeholder="متن پاسخ خود را به صورت محترمانه و دقیق بنویسید..."
                        required
                        className="w-full bg-white border border-slate-300 rounded-lg p-3 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 leading-relaxed"
                      />
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={submittingReply || !replyText.trim()}
                        className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs disabled:opacity-50"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{submittingReply ? 'در حال ثبت...' : 'ثبت و انتشار پاسخ'}</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
