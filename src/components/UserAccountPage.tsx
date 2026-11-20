import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Headphones,
  PlusCircle,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  Send,
  ArrowRight,
  LogOut,
  ShieldCheck,
  Phone,
  Mail,
  Calendar,
  Sparkles,
  Paperclip,
  RefreshCw,
  FolderOpen
} from 'lucide-react';
import { AppUser, TicketItem, TicketDepartment, TicketPriority, TicketStatus } from '../types';
import { getCurrentUser, logoutUser } from '../utils/auth';

interface UserAccountPageProps {
  onBackToHome: () => void;
  onOpenAuth: () => void;
}

export const UserAccountPage: React.FC<UserAccountPageProps> = ({
  onBackToHome,
  onOpenAuth
}) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [activeTab, setActiveTab] = useState<'tickets' | 'profile'>('tickets');
  const [tickets, setTickets] = useState<TicketItem[]>([]);
  const [loadingTickets, setLoadingTickets] = useState(false);
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<TicketItem | null>(null);
  const [replyText, setReplyText] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);

  // New ticket form state
  const [subject, setSubject] = useState('');
  const [department, setDepartment] = useState<TicketDepartment>('technical');
  const [priority, setPriority] = useState<TicketPriority>('medium');
  const [message, setMessage] = useState('');
  const [submittingTicket, setSubmittingTicket] = useState(false);
  const [ticketError, setTicketError] = useState('');
  const [ticketSuccess, setTicketSuccess] = useState('');

  // Check auth
  useEffect(() => {
    const current = getCurrentUser();
    setUser(current);
    if (current) {
      loadTickets(current.phone);
    }
  }, []);

  const loadTickets = async (phone?: string) => {
    setLoadingTickets(true);
    try {
      const url = phone ? `/api/v1/tickets?phone=${encodeURIComponent(phone)}` : '/api/v1/tickets';
      const res = await fetch(url);
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setTickets(json.data);
      }
    } catch (err) {
      console.error('Failed to load tickets:', err);
    } finally {
      setLoadingTickets(false);
    }
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!subject.trim() || !message.trim()) {
      setTicketError('لطفاً عنوان و متن درخواست خود را وارد نمایید.');
      return;
    }

    setSubmittingTicket(true);
    setTicketError('');
    setTicketSuccess('');

    try {
      const res = await fetch('/api/v1/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName: `${user.firstName || 'کاربر'} ${user.lastName || ''}`.trim(),
          userPhone: user.phone || '',
          userEmail: user.email || '',
          department,
          priority,
          subject: subject.trim(),
          message: message.trim()
        })
      });
      const json = await res.json();
      if (json.success) {
        setTicketSuccess('تیکت شما با موفقیت ثبت شد و به زودی بررسی خواهد شد.');
        setSubject('');
        setMessage('');
        setIsNewTicketOpen(false);
        loadTickets(user.phone);
      } else {
        setTicketError(json.message || 'خطا در ثبت تیکت');
      }
    } catch {
      setTicketError('خطا در برقراری ارتباط با سرور.');
    } finally {
      setSubmittingTicket(false);
    }
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !replyText.trim() || !user) return;

    setSubmittingReply(true);
    try {
      const res = await fetch(`/api/v1/tickets/${selectedTicket.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderName: `${user.firstName || 'کاربر'} ${user.lastName || ''}`.trim(),
          senderType: 'user',
          message: replyText.trim()
        })
      });
      const json = await res.json();
      if (json.success && json.data) {
        setSelectedTicket(json.data);
        setReplyText('');
        loadTickets(user.phone);
      }
    } catch (err) {
      console.error('Failed to send reply:', err);
    } finally {
      setSubmittingReply(false);
    }
  };

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    setTickets([]);
  };

  const getStatusBadge = (status: TicketStatus) => {
    switch (status) {
      case 'answered':
        return { label: 'پاسخ داده شده', bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' };
      case 'open':
      case 'in_progress':
        return { label: 'در انتظار پاسخ کارشناس', bg: 'bg-amber-500/20 text-amber-300 border-amber-500/30' };
      case 'closed':
        return { label: 'بسته شده', bg: 'bg-slate-500/20 text-slate-400 border-slate-500/30' };
      default:
        return { label: 'جدید', bg: 'bg-blue-500/20 text-blue-300 border-blue-500/30' };
    }
  };

  const getDepartmentLabel = (dept: TicketDepartment) => {
    switch (dept) {
      case 'technical': return 'پشتیبانی فنی و سرور';
      case 'seo_design': return 'سئو، طراحی و بهینه‌سازی';
      case 'finance': return 'مالی و صورت‌حساب';
      case 'sales': return 'فروش و مشاوره پروژه';
      default: return 'عمومی';
    }
  };

  const getPriorityBadge = (pri: TicketPriority) => {
    switch (pri) {
      case 'urgent': return { label: 'فوری و آنی', text: 'text-rose-400 bg-rose-500/15 border-rose-500/30' };
      case 'high': return { label: 'اولویت بالا', text: 'text-amber-400 bg-amber-500/15 border-amber-500/30' };
      case 'medium': return { label: 'متوسط', text: 'text-blue-400 bg-blue-500/15 border-blue-500/30' };
      default: return { label: 'عادی', text: 'text-slate-400 bg-slate-500/15 border-slate-500/30' };
    }
  };

  // If user is not logged in:
  if (!user) {
    return (
      <div className="min-h-screen bg-[#070609] text-white pt-28 pb-20 px-4" dir="rtl">
        <div className="max-w-[1280px] mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-mono text-amber-200/60 mb-8">
            <button onClick={onBackToHome} className="hover:text-amber-400 transition-colors">
              صفحه اصلی
            </button>
            <span>/</span>
            <span className="text-amber-300">حساب کاربری و پشتیبانی تیکتی</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-xl mx-auto bg-[#0e0c14] border border-amber-500/30 rounded-2xl p-8 sm:p-10 shadow-2xl text-center relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 p-[1px] mx-auto mb-6 shadow-[0_0_30px_rgba(212,175,55,0.3)]">
              <div className="w-full h-full bg-[#0e0c14] rounded-2xl flex items-center justify-center">
                <Headphones className="w-8 h-8 text-amber-400" />
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white mb-3">
              سامانه پشتیبانی و تیکت اختصاصی
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed mb-8 max-w-md mx-auto">
              ارسال تیکت پشتیبانی و پیگیری وضعیت پروژه‌ها، به منظور حفظ امنیت و محرمانگی، تنها برای کارفرمایان و کاربران ثبت‌نام شده امکان‌پذیر است.
            </p>

            <div className="bg-[#14101d] border border-amber-500/20 rounded-xl p-4 text-right mb-8 space-y-3">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white mb-0.5">پشتیبانی مستقیم کارشناسان ارشد</h4>
                  <p className="text-[11px] text-slate-400">تیکت‌های شما مستقیماً توسط متخصصین ارشد سئو، طراحی و سرور بررسی می‌گردد.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white mb-0.5">پاسخگویی سریع و پیگیری پیامکی</h4>
                  <p className="text-[11px] text-slate-400">به محض ثبت پاسخ از سمت تیم پشتیبانی، پیامک اطلاع‌رسانی برای شما ارسال خواهد شد.</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={onOpenAuth}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold text-sm shadow-[0_0_25px_rgba(212,175,55,0.3)] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <User className="w-4 h-4" />
                <span>ورود / عضویت با شماره موبایل</span>
              </button>
              <button
                onClick={onBackToHome}
                className="px-6 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white text-sm font-mono transition-colors cursor-pointer"
              >
                بازگشت به خانه
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // User is logged in:
  return (
    <div className="min-h-screen bg-[#070609] text-white pt-28 pb-20 px-4" dir="rtl">
      <div className="max-w-[1280px] mx-auto">
        {/* Top Breadcrumb & Actions */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-200/60">
            <button onClick={onBackToHome} className="hover:text-amber-400 transition-colors">
              صفحه اصلی
            </button>
            <span>/</span>
            <span className="text-amber-300">پروفایل و تیکت‌های پشتیبانی</span>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-mono transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>خروج از حساب</span>
          </button>
        </div>

        {/* User Banner Card */}
        <div className="bg-[#0e0c14] border border-amber-500/30 rounded-2xl p-6 sm:p-8 mb-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 p-[1px] shrink-0">
              <div className="w-full h-full bg-[#070609] rounded-2xl flex items-center justify-center text-amber-400 font-black text-2xl">
                {user.firstName?.[0] || 'U'}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-3 flex-wrap mb-1">
                <h1 className="text-xl sm:text-2xl font-bold text-white">
                  {user.firstName} {user.lastName || ''}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  حساب کاربری معتبر
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs text-slate-400 flex-wrap font-mono">
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-amber-400" />
                  {user.phone || 'شماره ثبت نشده'}
                </span>
                {user.email && (
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-amber-400" />
                    {user.email}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  عضو فعال سیگنالوکس
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              setIsNewTicketOpen(true);
              setSelectedTicket(null);
            }}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold text-xs font-mono flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all cursor-pointer shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>ثبت تیکت پشتیبانی جدید</span>
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-8">
          <button
            onClick={() => setActiveTab('tickets')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
              activeTab === 'tickets'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Headphones className="w-4 h-4" />
            <span>تیکت‌ها و پشتیبانی اختصاصی</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-400/20 text-amber-300">
              {tickets.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <User className="w-4 h-4" />
            <span>مشخصات و امنیت حساب</span>
          </button>
        </div>

        {/* Tab 1: Support Tickets */}
        {activeTab === 'tickets' && (
          <div className="space-y-6">
            {/* New Ticket Modal */}
            <AnimatePresence>
              {isNewTicketOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-[#0e0c14] border border-amber-500/40 rounded-2xl p-6 sm:p-8 shadow-2xl relative mb-8"
                >
                  <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                    <div className="flex items-center gap-2.5">
                      <Sparkles className="w-5 h-5 text-amber-400" />
                      <h3 className="text-lg font-bold text-white">ارسال درخواست پشتیبانی جدید</h3>
                    </div>
                    <button
                      onClick={() => setIsNewTicketOpen(false)}
                      className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-white/5"
                    >
                      بستن
                    </button>
                  </div>

                  {ticketError && (
                    <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-300 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{ticketError}</span>
                    </div>
                  )}

                  {ticketSuccess && (
                    <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>{ticketSuccess}</span>
                    </div>
                  )}

                  <form onSubmit={handleCreateTicket} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono text-slate-300 mb-1.5">
                          دپارتمان مربوطه
                        </label>
                        <select
                          value={department}
                          onChange={e => setDepartment(e.target.value as TicketDepartment)}
                          className="w-full bg-[#15121e] border border-amber-500/30 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                        >
                          <option value="technical">پشتیبانی فنی و سرور</option>
                          <option value="seo_design">سئو و طراحی وب‌سایت</option>
                          <option value="finance">امور مالی و فاکتورها</option>
                          <option value="sales">مشاوره و قرارداد پروژه</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-slate-300 mb-1.5">
                          میزان اولویت
                        </label>
                        <select
                          value={priority}
                          onChange={e => setPriority(e.target.value as TicketPriority)}
                          className="w-full bg-[#15121e] border border-amber-500/30 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                        >
                          <option value="low">عادی</option>
                          <option value="medium">متوسط</option>
                          <option value="high">بالا</option>
                          <option value="urgent">فوری و اضطراری</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-300 mb-1.5">
                        موضوع درخواست یا مشکل
                      </label>
                      <input
                        type="text"
                        value={subject}
                        onChange={e => setSubject(e.target.value)}
                        placeholder="مثال: سوال درباره تنظیمات سرچ‌کنسول یا تغییر منوی سایت..."
                        className="w-full bg-[#15121e] border border-amber-500/30 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400 font-sans"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-300 mb-1.5">
                        متن و شرح کامل تیکت
                      </label>
                      <textarea
                        rows={5}
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        placeholder="لطفاً شرح کامل درخواست، لینک صفحه یا خطای مشاهده شده را شرح دهید..."
                        className="w-full bg-[#15121e] border border-amber-500/30 rounded-xl px-4 py-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400 font-sans leading-relaxed"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsNewTicketOpen(false)}
                        className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-slate-300 transition-colors"
                      >
                        انصراف
                      </button>
                      <button
                        type="submit"
                        disabled={submittingTicket}
                        className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs font-mono transition-all flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
                      >
                        {submittingTicket ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                        <span>ارسال و ثبت تیکت</span>
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Ticket Thread Drawer / Detail */}
            <AnimatePresence>
              {selectedTicket && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="bg-[#0e0c14] border border-amber-500/40 rounded-2xl p-6 sm:p-8 shadow-2xl mb-8 space-y-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                    <div>
                      <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
                        <span className="font-mono text-xs px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                          {selectedTicket.id}
                        </span>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${getStatusBadge(selectedTicket.status).bg}`}>
                          {getStatusBadge(selectedTicket.status).label}
                        </span>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${getPriorityBadge(selectedTicket.priority).text}`}>
                          {getPriorityBadge(selectedTicket.priority).label}
                        </span>
                      </div>
                      <h2 className="text-base sm:text-lg font-bold text-white">
                        {selectedTicket.subject}
                      </h2>
                    </div>

                    <button
                      onClick={() => setSelectedTicket(null)}
                      className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-slate-300 transition-colors self-start sm:self-auto cursor-pointer"
                    >
                      ← بستن گفتگو
                    </button>
                  </div>

                  {/* Messages Stream */}
                  <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                    {selectedTicket.messages.map(msg => (
                      <div
                        key={msg.id}
                        className={`p-4 rounded-xl text-xs leading-relaxed ${
                          msg.senderType === 'admin'
                            ? 'bg-amber-500/10 border border-amber-500/30 mr-4 sm:mr-10'
                            : 'bg-[#15121e] border border-white/10 ml-4 sm:ml-10'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-white/5 font-mono text-[11px]">
                          <span className={`font-bold flex items-center gap-1.5 ${msg.senderType === 'admin' ? 'text-amber-300' : 'text-slate-300'}`}>
                            {msg.senderType === 'admin' && <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />}
                            {msg.senderName}
                          </span>
                          <span className="text-slate-500">
                            {new Date(msg.createdAt).toLocaleDateString('fa-IR')}
                          </span>
                        </div>
                        <p className="text-slate-200 whitespace-pre-wrap">{msg.message}</p>
                      </div>
                    ))}
                  </div>

                  {/* Reply Form */}
                  <form onSubmit={handleSendReply} className="space-y-3 pt-4 border-t border-white/10">
                    <label className="block text-xs font-mono text-amber-300">
                      پاسخ به این تیکت:
                    </label>
                    <textarea
                      rows={3}
                      value={replyText}
                      onChange={e => setReplyText(e.target.value)}
                      placeholder="متن پاسخ خود را بنویسید..."
                      className="w-full bg-[#15121e] border border-amber-500/30 rounded-xl p-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
                    />
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={submittingReply || !replyText.trim()}
                        className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs font-mono flex items-center gap-2 transition-colors disabled:opacity-40 cursor-pointer"
                      >
                        {submittingReply ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                        <span>ارسال پاسخ</span>
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Tickets Table / List */}
            <div className="bg-[#0e0c14] border border-amber-500/20 rounded-2xl overflow-hidden shadow-xl">
              <div className="p-5 border-b border-white/10 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white mb-0.5">لیست تیکت‌های پشتیبانی شما</h3>
                  <p className="text-[11px] text-slate-400">تاریخچه کلیه پیام‌ها و پاسخ‌های کارشناسان استودیو سیگنالوکس</p>
                </div>
                <button
                  onClick={() => loadTickets(user.phone)}
                  disabled={loadingTickets}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-amber-400 transition-colors"
                  title="بروزرسانی تیکت‌ها"
                >
                  <RefreshCw className={`w-4 h-4 ${loadingTickets ? 'animate-spin' : ''}`} />
                </button>
              </div>

              {tickets.length === 0 ? (
                <div className="p-12 text-center text-slate-400 space-y-3">
                  <FolderOpen className="w-12 h-12 text-amber-400/40 mx-auto" />
                  <p className="text-xs">تاکنون تیکت پشتیبانی ثبت نکرده‌اید.</p>
                  <button
                    onClick={() => setIsNewTicketOpen(true)}
                    className="text-xs text-amber-400 hover:text-amber-300 font-bold underline cursor-pointer"
                  >
                    ثبت اولین تیکت پشتیبانی
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  {tickets.map(ticket => {
                    const statusInfo = getStatusBadge(ticket.status);
                    const priInfo = getPriorityBadge(ticket.priority);
                    return (
                      <div
                        key={ticket.id}
                        onClick={() => setSelectedTicket(ticket)}
                        className="p-5 hover:bg-white/5 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono text-xs text-amber-300 font-bold">
                              {ticket.id}
                            </span>
                            <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${statusInfo.bg}`}>
                              {statusInfo.label}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              دپارتمان: {getDepartmentLabel(ticket.department)}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-white group-hover:text-amber-300">
                            {ticket.subject}
                          </h4>
                          <p className="text-xs text-slate-400 line-clamp-1">
                            {ticket.messages[ticket.messages.length - 1]?.message || ''}
                          </p>
                        </div>

                        <div className="flex items-center gap-4 shrink-0 justify-between sm:justify-end">
                          <div className="text-right text-[11px] font-mono text-slate-500">
                            <div>آخرین بروزرسانی:</div>
                            <div>{new Date(ticket.updatedAt).toLocaleDateString('fa-IR')}</div>
                          </div>
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              setSelectedTicket(ticket);
                            }}
                            className="px-3.5 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-xs font-mono flex items-center gap-1.5 transition-colors"
                          >
                            <span>مشاهده</span>
                            <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Profile Settings */}
        {activeTab === 'profile' && (
          <div className="bg-[#0e0c14] border border-amber-500/30 rounded-2xl p-6 sm:p-8 shadow-xl max-w-2xl space-y-6">
            <div>
              <h3 className="text-base font-bold text-white mb-1">اطلاعات حساب کاربری</h3>
              <p className="text-xs text-slate-400">اطلاعات هویتی و شماره همراه برای احراز هویت تیکت‌ها و پیامک‌های اطلاع‌رسانی</p>
            </div>

            <div className="space-y-4 font-mono text-xs">
              <div>
                <label className="block text-slate-400 mb-1">نام و نام خانوادگی:</label>
                <input
                  type="text"
                  disabled
                  value={`${user.firstName || ''} ${user.lastName || ''}`}
                  className="w-full bg-[#14111d] border border-white/10 rounded-xl px-4 py-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">شماره همراه تایید شده:</label>
                <input
                  type="text"
                  disabled
                  value={user.phone || 'ثبت نشده'}
                  className="w-full bg-[#14111d] border border-white/10 rounded-xl px-4 py-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">آدرس ایمیل:</label>
                <input
                  type="email"
                  disabled
                  value={user.email || 'ثبت نشده'}
                  className="w-full bg-[#14111d] border border-white/10 rounded-xl px-4 py-2.5 text-white"
                />
              </div>

              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-200/80 leading-relaxed font-sans">
                برای تغییر شماره همراه یا انتقال مالکیت حساب، لطفاً با ارسال تیکت با دپارتمان پشتیبانی سیگنالوکس هماهنگ فرمایید.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
