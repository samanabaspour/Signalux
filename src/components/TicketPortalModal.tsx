import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  MessageSquare,
  Plus,
  Send,
  Clock,
  CheckCircle,
  AlertCircle,
  Headphones,
  Paperclip,
  RefreshCw,
  Search,
  ChevronLeft,
  User,
  Shield,
  Layers,
  ArrowRight
} from 'lucide-react';
import { TicketItem, TicketDepartment, TicketPriority } from '../types';
import {
  fetchUserTickets,
  createTicket,
  replyTicket,
  getCurrentUser,
  AppUser
} from '../services/apiClient';

interface TicketPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAuth: () => void;
}

const DEPARTMENTS: { key: TicketDepartment; label: string; icon: string }[] = [
  { key: 'technical', label: 'پشتیبانی فنی و هاستینگ', icon: '💻' },
  { key: 'seo_design', label: 'طراحی وب و بهینه‌سازی سئو', icon: '⚡' },
  { key: 'sales', label: 'مشاوره پروژه‌ها و فروش', icon: '💼' },
  { key: 'finance', label: 'امور مالی، فاکتور و قرارداد', icon: '💳' },
  { key: 'general', label: 'سایر موارد و پشتیبانی عمومی', icon: '🎯' }
];

const PRIORITIES: { key: TicketPriority; label: string; color: string }[] = [
  { key: 'low', label: 'عادی', color: 'text-gray-400 bg-gray-500/10 border-gray-500/30' },
  { key: 'medium', label: 'متوسط', color: 'text-blue-400 bg-blue-500/10 border-blue-500/30' },
  { key: 'high', label: 'مهم', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
  { key: 'urgent', label: 'بسیار فوری (پروژه فعال)', color: 'text-red-400 bg-red-500/10 border-red-500/30' }
];

export const TicketPortalModal: React.FC<TicketPortalModalProps> = ({
  isOpen,
  onClose,
  onOpenAuth
}) => {
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [activeTab, setActiveTab] = useState<'list' | 'create' | 'detail'>('list');
  const [tickets, setTickets] = useState<TicketItem[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<TicketItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');
  const [replyLoading, setReplyLoading] = useState(false);

  // New Ticket Form State
  const [newSubject, setNewSubject] = useState('');
  const [newDepartment, setNewDepartment] = useState<TicketDepartment>('technical');
  const [newPriority, setNewPriority] = useState<TicketPriority>('medium');
  const [newMessage, setNewMessage] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newName, setNewName] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');

  // Search
  const [searchQuery, setSearchQuery] = useState('');

  // Load User & Tickets
  useEffect(() => {
    if (isOpen) {
      const user = getCurrentUser();
      setCurrentUser(user);
      if (user) {
        setNewName(`${user.firstName} ${user.lastName}`.trim());
        setNewPhone(user.phone || '');
      }
      loadTickets(user?.phone);
    }
  }, [isOpen]);

  const loadTickets = async (phone?: string) => {
    setLoading(true);
    const data = await fetchUserTickets(phone);
    setTickets(data);
    setLoading(false);
  };

  if (!isOpen) return null;

  // Handle New Ticket Submit
  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitSuccess('');

    if (!newSubject.trim() || !newMessage.trim()) {
      setSubmitError('موضوع و متن پیام تیکت الزامی است.');
      return;
    }

    const senderName = newName.trim() || currentUser?.firstName || 'کاربر مهمان';
    const senderPhone = newPhone.trim() || currentUser?.phone || '09000000000';

    setLoading(true);
    const res = await createTicket({
      userName: senderName,
      userPhone: senderPhone,
      userEmail: currentUser?.email,
      department: newDepartment,
      priority: newPriority,
      subject: newSubject.trim(),
      message: newMessage.trim()
    });
    setLoading(false);

    if (res.success && res.ticket) {
      setSubmitSuccess('تیکت شما با موفقیت ثبت شد و کارشناسان سیگنالوکس به زودی پاسخ خواهند داد.');
      setTickets((prev) => [res.ticket!, ...prev]);
      setNewSubject('');
      setNewMessage('');
      setTimeout(() => {
        setSelectedTicket(res.ticket!);
        setActiveTab('detail');
        setSubmitSuccess('');
      }, 1000);
    } else {
      setSubmitError(res.message || 'خطا در ارسال تیکت.');
    }
  };

  // Handle Reply to existing ticket
  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !replyMessage.trim()) return;

    setReplyLoading(true);
    const senderName = currentUser ? `${currentUser.firstName} ${currentUser.lastName}`.trim() : selectedTicket.userName;
    const res = await replyTicket(selectedTicket.id, {
      senderName: senderName || 'کاربر',
      message: replyMessage.trim()
    });
    setReplyLoading(false);

    if (res.success && res.ticket) {
      setSelectedTicket(res.ticket);
      setTickets((prev) => prev.map((t) => (t.id === res.ticket!.id ? res.ticket! : t)));
      setReplyMessage('');
    }
  };

  const filteredTickets = tickets.filter(
    (t) =>
      t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-blue-500/10 text-blue-400 border border-blue-500/30">جدید</span>;
      case 'in_progress':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-amber-500/10 text-amber-400 border border-amber-500/30">در حال بررسی</span>;
      case 'answered':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">پاسخ داده شده</span>;
      case 'closed':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-gray-500/10 text-gray-400 border border-gray-500/30">بسته شده</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-blue-500/10 text-blue-400 border border-blue-500/30">در صف بررسی</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
      />

      {/* Modal Container */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="relative w-full max-w-3xl max-h-[90vh] bg-[#0d0b12] border border-amber-500/30 rounded-2xl shadow-[0_25px_70px_rgba(0,0,0,0.9),0_0_50px_rgba(212,175,55,0.15)] overflow-hidden flex flex-col text-right z-10"
        dir="rtl"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-amber-500/20 bg-[#120f18]/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 p-[1px]">
              <div className="w-full h-full bg-[#0d0b12] rounded-[11px] flex items-center justify-center">
                <Headphones className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white font-mono">
                  سامانه تیکتینگ و پشتیبانی ۲۴/۷
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  سیگنالوکس
                </span>
              </div>
              <p className="text-xs text-amber-200/60 font-mono">
                {currentUser ? `خوش آمدید، ${currentUser.firstName} ${currentUser.lastName}` : 'ثبت و پیگیری مستقیم تیکت‌های فنی و سفارش‌ها'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!currentUser && (
              <button
                onClick={onOpenAuth}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-mono transition-colors"
              >
                <User className="w-3.5 h-3.5" />
                <span>ورود به حساب</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-white/50 hover:text-white hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center justify-between border-b border-amber-500/15 p-2 bg-[#09080e] px-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('list')}
              className={`py-2 px-3.5 rounded-lg text-xs font-mono font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'list'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>تیکت‌های من ({tickets.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('create')}
              className={`py-2 px-3.5 rounded-lg text-xs font-mono font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'create'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>ارسال تیکت جدید</span>
            </button>
          </div>

          <button
            onClick={() => loadTickets(currentUser?.phone)}
            disabled={loading}
            className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-colors"
            title="بروزرسانی تیکت‌ها"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-amber-400' : ''}`} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {/* 1. Ticket List Tab */}
          {activeTab === 'list' && (
            <div className="space-y-4">
              {/* Search Box */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="جستجو در موضوع یا شناسه تیکت..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#16121f] border border-amber-500/20 rounded-xl px-4 py-2.5 pr-10 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-amber-400"
                />
                <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              </div>

              {loading ? (
                <div className="py-12 flex flex-col items-center justify-center text-amber-300 gap-2">
                  <RefreshCw className="w-6 h-6 animate-spin" />
                  <span className="text-xs font-mono">در حال دریافت لیست تیکت‌ها...</span>
                </div>
              ) : filteredTickets.length === 0 ? (
                <div className="py-12 text-center bg-white/[0.02] border border-white/5 rounded-2xl p-6">
                  <MessageSquare className="w-10 h-10 text-amber-400/40 mx-auto mb-3" />
                  <h4 className="text-sm font-bold text-white font-mono mb-1">تیکتی یافت نشد</h4>
                  <p className="text-xs text-white/40 mb-4">
                    هنوز هیچ تیکتی ثبت نکرده‌اید یا وارد حساب کاربری خود نشده‌اید.
                  </p>
                  <button
                    onClick={() => setActiveTab('create')}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-bold font-mono text-xs shadow-md cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>ارسال اولین تیکت پشتیبانی</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {filteredTickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      onClick={() => {
                        setSelectedTicket(ticket);
                        setActiveTab('detail');
                      }}
                      className="p-4 rounded-xl bg-[#14101d]/90 hover:bg-[#1b1527] border border-amber-500/15 hover:border-amber-500/40 transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 group"
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-sm text-white group-hover:text-amber-300 transition-colors">
                            {ticket.subject}
                          </span>
                          <span className="text-[10px] font-mono text-white/40">#{ticket.id}</span>
                          {getStatusBadge(ticket.status)}
                        </div>

                        <div className="flex items-center gap-3 text-[11px] text-white/50 flex-wrap">
                          <span>بخش: {DEPARTMENTS.find((d) => d.key === ticket.department)?.label || ticket.department}</span>
                          <span>•</span>
                          <span>اولویت: {PRIORITIES.find((p) => p.key === ticket.priority)?.label || ticket.priority}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{new Date(ticket.createdAt).toLocaleDateString('fa-IR')}</span>
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-amber-400/80 font-mono shrink-0">
                        <span>مشاهده گفتگو ({ticket.messages?.length || 1})</span>
                        <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 2. Create Ticket Tab */}
          {activeTab === 'create' && (
            <form onSubmit={handleCreateTicket} className="space-y-4">
              <AnimatePresence>
                {submitError && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-300 flex items-center gap-2"
                  >
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                    <span>{submitError}</span>
                  </motion.div>
                )}

                {submitSuccess && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{submitSuccess}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Guest / User Info if not logged in */}
              {!currentUser && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-amber-500/5 border border-amber-500/15 rounded-xl">
                  <div>
                    <label className="block text-xs font-mono text-amber-200/80 mb-1">
                      نام و نام خانوادگی
                    </label>
                    <input
                      type="text"
                      placeholder="علی رضایی"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="w-full bg-[#16121f] border border-amber-500/20 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-amber-200/80 mb-1">
                      شماره تلفن همراه (جهت دریافت پیامک پاسخ)
                    </label>
                    <input
                      type="tel"
                      dir="ltr"
                      placeholder="09123456789"
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      className="w-full bg-[#16121f] border border-amber-500/20 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Subject */}
              <div>
                <label className="block text-xs font-mono text-amber-200/80 mb-1.5">
                  موضوع تیکت
                </label>
                <input
                  type="text"
                  placeholder="مثال: درخواست تغییر در دیزاین هدر یا گزارش باگ فرم پرداخت"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="w-full bg-[#16121f] border border-amber-500/20 focus:border-amber-400 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none transition-colors"
                />
              </div>

              {/* Department & Priority */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-amber-200/80 mb-1.5">
                    دپارتمان مربوطه
                  </label>
                  <select
                    value={newDepartment}
                    onChange={(e) => setNewDepartment(e.target.value as TicketDepartment)}
                    className="w-full bg-[#16121f] border border-amber-500/20 focus:border-amber-400 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                  >
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept.key} value={dept.key}>
                        {dept.icon} {dept.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-amber-200/80 mb-1.5">
                    سطح اولویت
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as TicketPriority)}
                    className="w-full bg-[#16121f] border border-amber-500/20 focus:border-amber-400 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                  >
                    {PRIORITIES.map((p) => (
                      <option key={p.key} value={p.key}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Message Description */}
              <div>
                <label className="block text-xs font-mono text-amber-200/80 mb-1.5">
                  متن پیام و توضیحات کامل
                </label>
                <textarea
                  rows={5}
                  placeholder="جزئیات درخواست یا گزارش خود را با دقت بنویسید..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="w-full bg-[#16121f] border border-amber-500/20 focus:border-amber-400 rounded-xl p-3.5 text-xs text-white leading-relaxed focus:outline-none transition-colors resize-none"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('list')}
                  className="px-4 py-2.5 rounded-xl border border-white/10 text-xs text-white/60 hover:text-white transition-colors"
                >
                  انصراف و بازگشت
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-black font-bold font-mono text-xs rounded-xl shadow-lg disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                >
                  {loading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5 rotate-180" />
                      <span>ثبت و ارسال تیکت</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* 3. Ticket Detail & Thread Tab */}
          {activeTab === 'detail' && selectedTicket && (
            <div className="space-y-4">
              {/* Header Info */}
              <div className="p-4 rounded-xl bg-[#14101d] border border-amber-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveTab('list')}
                      className="p-1 rounded bg-white/5 hover:bg-white/10 text-white/70"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <h4 className="text-sm font-bold text-white font-mono">{selectedTicket.subject}</h4>
                    {getStatusBadge(selectedTicket.status)}
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-white/40">
                    <span>شناسه: #{selectedTicket.id}</span>
                    <span>•</span>
                    <span>بخش: {DEPARTMENTS.find((d) => d.key === selectedTicket.department)?.label}</span>
                    <span>•</span>
                    <span>ثبت: {new Date(selectedTicket.createdAt).toLocaleDateString('fa-IR')}</span>
                  </div>
                </div>
              </div>

              {/* Message Thread */}
              <div className="space-y-3 max-h-[350px] overflow-y-auto p-2">
                {selectedTicket.messages && selectedTicket.messages.length > 0 ? (
                  selectedTicket.messages.map((msg, idx) => (
                    <div
                      key={msg.id || idx}
                      className={`flex flex-col ${
                        msg.senderType === 'admin' ? 'items-start' : 'items-end'
                      }`}
                    >
                      <div
                        className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 space-y-1.5 shadow-md ${
                          msg.senderType === 'admin'
                            ? 'bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/40 text-amber-100 rounded-tr-none'
                            : 'bg-[#181324] border border-white/10 text-white rounded-tl-none'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3 text-[11px] opacity-70">
                          <span className="font-bold flex items-center gap-1">
                            {msg.senderType === 'admin' ? (
                              <>
                                <Shield className="w-3 h-3 text-amber-400" />
                                <span className="text-amber-300">پشتیبانی سیگنالوکس</span>
                              </>
                            ) : (
                              <>
                                <User className="w-3 h-3" />
                                <span>{msg.senderName || 'شما'}</span>
                              </>
                            )}
                          </span>
                          <span className="font-mono text-[10px]">
                            {new Date(msg.createdAt).toLocaleTimeString('fa-IR', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        <p className="text-xs leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-xs text-white/40">پیامی یافت نشد.</div>
                )}
              </div>

              {/* Reply Box */}
              {selectedTicket.status !== 'closed' ? (
                <form onSubmit={handleSendReply} className="space-y-2 pt-2 border-t border-amber-500/15">
                  <div className="relative">
                    <textarea
                      rows={3}
                      placeholder="پاسخ خود را بنویسید..."
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      className="w-full bg-[#16121f] border border-amber-500/20 focus:border-amber-400 rounded-xl p-3 text-xs text-white focus:outline-none resize-none"
                    />
                  </div>
                  <div className="flex items-center justify-end">
                    <button
                      type="submit"
                      disabled={replyLoading || !replyMessage.trim()}
                      className="px-5 py-2 bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-bold font-mono text-xs rounded-xl shadow-md disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                    >
                      {replyLoading ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <>
                          <Send className="w-3 h-3 rotate-180" />
                          <span>ارسال پاسخ</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="p-3 bg-gray-500/10 border border-gray-500/20 rounded-xl text-center text-xs text-gray-400 font-mono">
                  این تیکت بسته شده است. در صورت نیاز می‌توانید تیکت جدیدی ایجاد نمایید.
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
