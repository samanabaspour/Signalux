import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users,
  Shield,
  UserPlus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Search,
  RefreshCw,
  Mail,
  Phone,
  Calendar,
  Lock,
  Eye,
  Check,
  AlertCircle
} from 'lucide-react';
import { AdminUser, AdminRole } from '../../types';
import { fetchAdminUsers, createAdminUser, updateAdminUser, deleteAdminUser } from '../../services/apiClient';

const ROLE_INFO: Record<AdminRole, { title: string; color: string; bg: string; border: string; desc: string }> = {
  admin: {
    title: 'مدیر کل (Super Admin)',
    color: 'text-blue-700',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    desc: 'دسترسی کامل و نامحدود به تمامی بخش‌ها، تنظیمات سرور، مالی و اعضای تیم'
  },
  seo: {
    title: 'متخصص سئو (SEO Specialist)',
    color: 'text-emerald-700',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    desc: 'دسترسی به ماژول سئو، ویرایش سایت‌مپ و robots.txt، بهینه‌سازی مقالات و اتصال گوگل سرچ‌کنسول'
  },
  support: {
    title: 'کارشناس پشتیبانی (Support Agent)',
    color: 'text-slate-700',
    bg: 'bg-slate-50',
    border: 'border-slate-200',
    desc: 'دسترسی به مدیریت تیکت‌های مشتریان، لیدها و درخواست‌های مشاوره و پرسش‌های متداول'
  },
  writer: {
    title: 'محتوانویس و بلاگر (Content Writer)',
    color: 'text-indigo-700',
    bg: 'bg-indigo-50',
    border: 'border-indigo-200',
    desc: 'دسترسی به ایجاد، ویرایش و مدیریت مقالات وبلاگ، دسته‌بندی‌ها و رسانه‌ها'
  }
};

const ALL_PERMISSIONS: { id: string; label: string; group: string }[] = [
  { id: 'all', label: 'دسترسی کامل نامحدود', group: 'سیستم' },
  { id: 'blog', label: 'مدیریت مقالات و وبلاگ', group: 'محتوا' },
  { id: 'media', label: 'مدیریت رسانه‌ها و تصاویر', group: 'محتوا' },
  { id: 'seo', label: 'تنظیمات سئو و متا تگ‌ها', group: 'سئو' },
  { id: 'sitemap', label: 'مدیریت Sitemap و Robots', group: 'سئو' },
  { id: 'google', label: 'گوگل تگ‌منیجر و سرچ‌کنسول', group: 'سئو' },
  { id: 'tickets', label: 'پاسخگویی به تیکت‌ها', group: 'پشتیبانی' },
  { id: 'leads', label: 'مشاهده و مدیریت لیدها', group: 'پشتیبانی' },
  { id: 'faqs', label: 'مدیریت پرسش و پاسخ‌ها', group: 'پشتیبانی' },
  { id: 'services', label: 'مدیریت خدمات و نمونه‌کارها', group: 'مدیریت سایت' },
  { id: 'typography', label: 'تنظیمات فونت و ظاهر سایت', group: 'مدیریت سایت' },
  { id: 'sms', label: 'سامانه پیامک ملی‌پیامک', group: 'سیستم' },
  { id: 'users', label: 'مدیریت کاربران و دسترسی‌ها', group: 'سیستم' }
];

export const AdminTeamManager: React.FC = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [editingUser, setEditingUser] = useState<Partial<AdminUser> | null>(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState<boolean>(false);
  const [saveLoading, setSaveLoading] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadUsers = async () => {
    setLoading(true);
    const data = await fetchAdminUsers();
    setUsers(data);
    setLoading(false);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser?.fullName || !editingUser?.username || !editingUser?.email) {
      alert('لطفاً فیلدهای ضروری نام کامل، نام کاربری و ایمیل را تکمیل نمایید.');
      return;
    }

    setSaveLoading(true);
    if (editingUser.id) {
      const res = await updateAdminUser(editingUser.id, editingUser);
      if (res) {
        showToast('اطلاعات کاربر با موفقیت به‌روزرسانی شد.');
        setEditingUser(null);
        loadUsers();
      }
    } else {
      const res = await createAdminUser(editingUser);
      if (res) {
        showToast('کاربر جدید با نقش و دسترسی‌های مشخص ایجاد شد.');
        setIsNewModalOpen(false);
        setEditingUser(null);
        loadUsers();
      }
    }
    setSaveLoading(false);
  };

  const handleDelete = async (id: string, name: string) => {
    if (id === 'adm-1') {
      alert('کاربر اصلی سیستم غیرقابل حذف است.');
      return;
    }
    if (window.confirm(`آیا از حذف دسترسی کاربر "${name}" اطمینان دارید؟`)) {
      const ok = await deleteAdminUser(id);
      if (ok) {
        showToast('کاربر از لیست دسترسی‌های تیم حذف شد.');
        loadUsers();
      }
    }
  };

  const handleToggleStatus = async (user: AdminUser) => {
    if (user.id === 'adm-1') return;
    const ok = await updateAdminUser(user.id, { isActive: !user.isActive });
    if (ok) {
      showToast(`وضعیت کاربر ${user.fullName} به ${!user.isActive ? 'فعال' : 'غیرفعال'} تغییر یافت.`);
      loadUsers();
    }
  };

  const togglePermission = (permId: string) => {
    if (!editingUser) return;
    const currentPerms = editingUser.permissions || [];
    if (currentPerms.includes(permId)) {
      setEditingUser({
        ...editingUser,
        permissions: currentPerms.filter(p => p !== permId)
      });
    } else {
      setEditingUser({
        ...editingUser,
        permissions: [...currentPerms, permId]
      });
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch =
      u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div id="admin-team-manager" className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-zinc-900 via-zinc-900 to-zinc-950 border border-zinc-800">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Shield className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-white">مدیریت اعضای تیم و سطوح دسترسی (RBAC)</h2>
          </div>
          <p className="text-sm text-zinc-400 max-w-3xl leading-relaxed">
            تعریف نقش‌ها و دسترسی‌های تفکیک‌شده برای <span className="text-amber-400 font-medium">مدیر کل</span>،{' '}
            <span className="text-emerald-400 font-medium">سئوکار</span>،{' '}
            <span className="text-blue-400 font-medium">پشتیبان</span> و{' '}
            <span className="text-purple-400 font-medium">محتوانویس وبلاگ</span> جهت کنترل دقیق پنل ادمین.
          </p>
        </div>

        <button
          id="btn-add-team-member"
          onClick={() => {
            setEditingUser({
              role: 'writer',
              permissions: ['blog', 'media'],
              isActive: true,
              avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
            });
            setIsNewModalOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-sm transition-all shadow-lg shadow-amber-500/20"
        >
          <UserPlus className="w-4 h-4" />
          افزودن عضو جدید
        </button>
      </div>

      {/* Role Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {(['admin', 'seo', 'support', 'writer'] as AdminRole[]).map(roleKey => {
          const info = ROLE_INFO[roleKey];
          const count = users.filter(u => u.role === roleKey).length;
          return (
            <div
              key={roleKey}
              className={`p-4 rounded-xl border ${info.border} ${info.bg} flex flex-col justify-between transition-all`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${info.bg} ${info.color} border ${info.border}`}>
                    {info.title.split(' ')[0]}
                  </span>
                  <span className="text-lg font-bold text-white">{count} نفر</span>
                </div>
                <h4 className={`text-sm font-semibold mb-1 ${info.color}`}>{info.title}</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">{info.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-zinc-900/60 p-4 rounded-xl border border-zinc-800">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-500 absolute right-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="جستجو بر اساس نام، نام کاربری یا ایمیل..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pr-9 pl-4 py-2 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-500/50"
          />
        </div>

        <div className="flex items-center gap-3">
          <select
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
            className="bg-zinc-950 border border-zinc-800 text-zinc-300 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-amber-500/50"
          >
            <option value="all">همه نقش‌ها</option>
            <option value="admin">مدیران کل</option>
            <option value="seo">متخصصان سئو</option>
            <option value="support">تیم پشتیبانی</option>
            <option value="writer">نویسندگان محتوا</option>
          </select>

          <button
            onClick={loadUsers}
            disabled={loading}
            className="p-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors"
            title="تازه سازی"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/40">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm text-zinc-300">
            <thead className="bg-zinc-900/90 text-xs text-zinc-400 border-b border-zinc-800 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-semibold">عضو تیم</th>
                <th className="px-6 py-4 font-semibold">نقش سازمانی</th>
                <th className="px-6 py-4 font-semibold">دسترسی‌های فعال</th>
                <th className="px-6 py-4 font-semibold">وضعیت</th>
                <th className="px-6 py-4 font-semibold">آخرین ورود</th>
                <th className="px-6 py-4 font-semibold text-center">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-zinc-500">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-amber-400" />
                    در حال بارگذاری اعضای تیم...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-zinc-500">
                    هیچ کاربری با این مشخصات یافت نشد.
                  </td>
                </tr>
              ) : (
                filteredUsers.map(user => {
                  const roleStyle = ROLE_INFO[user.role] || ROLE_INFO.support;
                  return (
                    <tr key={user.id} className="hover:bg-zinc-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                            alt={user.fullName}
                            className="w-10 h-10 rounded-full object-cover border border-zinc-700"
                          />
                          <div>
                            <div className="font-semibold text-white flex items-center gap-1.5">
                              {user.fullName}
                              {user.id === 'adm-1' && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-normal">
                                  مالک اصلی
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-zinc-400 font-mono flex items-center gap-2 mt-0.5">
                              <span>@{user.username}</span>
                              <span className="text-zinc-600">•</span>
                              <span className="text-zinc-400">{user.email}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold border ${roleStyle.border} ${roleStyle.bg} ${roleStyle.color}`}>
                          <Shield className="w-3.5 h-3.5" />
                          {roleStyle.title}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {user.permissions.includes('all') ? (
                            <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-medium">
                              دسترسی کامل نامحدود
                            </span>
                          ) : (
                            user.permissions.slice(0, 3).map(p => (
                              <span key={p} className="text-[11px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                                {ALL_PERMISSIONS.find(ap => ap.id === p)?.label || p}
                              </span>
                            ))
                          )}
                          {!user.permissions.includes('all') && user.permissions.length > 3 && (
                            <span className="text-[11px] px-1.5 py-0.5 rounded bg-zinc-800/80 text-zinc-400">
                              +{user.permissions.length - 3} مورد دیگر
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleToggleStatus(user)}
                          disabled={user.id === 'adm-1'}
                          className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full transition-colors ${
                            user.isActive
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25'
                              : 'bg-rose-500/15 text-rose-400 border border-rose-500/30 hover:bg-rose-500/25'
                          }`}
                        >
                          {user.isActive ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                          {user.isActive ? 'فعال' : 'مسدود'}
                        </button>
                      </td>

                      <td className="px-6 py-4 text-xs text-zinc-400">
                        {user.lastLogin ? (
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                            {new Date(user.lastLogin).toLocaleDateString('fa-IR')}
                          </div>
                        ) : (
                          <span className="text-zinc-600">-</span>
                        )}
                      </td>

                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => setEditingUser(user)}
                            className="p-1.5 rounded-lg bg-zinc-800/80 text-zinc-300 hover:text-amber-400 hover:bg-zinc-700 transition-colors"
                            title="ویرایش نقش و دسترسی‌ها"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          {user.id !== 'adm-1' && (
                            <button
                              onClick={() => handleDelete(user.id, user.fullName)}
                              className="p-1.5 rounded-lg bg-zinc-800/80 text-zinc-400 hover:text-rose-400 hover:bg-rose-950/40 transition-colors"
                              title="حذف کاربر"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit / Create Modal */}
      <AnimatePresence>
        {(isNewModalOpen || editingUser) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden my-8"
            >
              <div className="flex items-center justify-between p-6 border-b border-zinc-800 bg-zinc-950/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                    <Shield className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-lg text-white">
                    {editingUser?.id ? `ویرایش دسترسی: ${editingUser.fullName}` : 'افزودن عضو جدید به تیم'}
                  </h3>
                </div>
                <button
                  onClick={() => {
                    setIsNewModalOpen(false);
                    setEditingUser(null);
                  }}
                  className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">نام و نام‌خانوادگی *</label>
                    <input
                      type="text"
                      required
                      value={editingUser?.fullName || ''}
                      onChange={e => setEditingUser({ ...editingUser, fullName: e.target.value })}
                      placeholder="مثال: کیانوش رضوانی"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">نام کاربری ورود *</label>
                    <input
                      type="text"
                      required
                      value={editingUser?.username || ''}
                      onChange={e => setEditingUser({ ...editingUser, username: e.target.value })}
                      placeholder="مثال: seo_expert"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-amber-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">ایمیل سازمانی *</label>
                    <input
                      type="email"
                      required
                      value={editingUser?.email || ''}
                      onChange={e => setEditingUser({ ...editingUser, email: e.target.value })}
                      placeholder="user@signalux.ir"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-amber-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">شماره همراه</label>
                    <input
                      type="text"
                      value={editingUser?.phone || ''}
                      onChange={e => setEditingUser({ ...editingUser, phone: e.target.value })}
                      placeholder="۰۹۱۲۰۰۰۰۰۰۰"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-amber-500 font-mono"
                    />
                  </div>
                </div>

                {/* Role Selector */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-2">انتخاب نقش سازمانی *</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(['admin', 'seo', 'support', 'writer'] as AdminRole[]).map(r => {
                      const info = ROLE_INFO[r];
                      const isSelected = editingUser?.role === r;
                      return (
                        <div
                          key={r}
                          onClick={() => {
                            let defaultPerms: string[] = [];
                            if (r === 'admin') defaultPerms = ['all'];
                            else if (r === 'seo') defaultPerms = ['seo', 'sitemap', 'robots', 'blog', 'google'];
                            else if (r === 'support') defaultPerms = ['tickets', 'leads', 'faqs'];
                            else if (r === 'writer') defaultPerms = ['blog', 'media'];

                            setEditingUser({
                              ...editingUser,
                              role: r,
                              permissions: defaultPerms
                            });
                          }}
                          className={`p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                            isSelected
                              ? `${info.bg} ${info.border} ring-2 ring-amber-400/30`
                              : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <span className={`text-sm font-bold ${isSelected ? info.color : 'text-white'}`}>
                              {info.title}
                            </span>
                            {isSelected && <Check className="w-4 h-4 text-amber-400" />}
                          </div>
                          <p className="text-xs text-zinc-400 leading-relaxed">{info.desc}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Custom Permissions Checklist */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-2">
                    دسترسی‌های اختصاصی ماژول‌ها:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                    {ALL_PERMISSIONS.map(perm => {
                      const isChecked = editingUser?.permissions?.includes(perm.id) || editingUser?.permissions?.includes('all');
                      return (
                        <label
                          key={perm.id}
                          className="flex items-center gap-2.5 text-xs text-zinc-300 hover:text-white cursor-pointer p-1.5 rounded-lg hover:bg-zinc-900 transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            disabled={editingUser?.role === 'admin' && perm.id !== 'all'}
                            onChange={() => togglePermission(perm.id)}
                            className="rounded border-zinc-700 text-amber-500 focus:ring-amber-400 bg-zinc-900"
                          />
                          <span>{perm.label}</span>
                          <span className="text-[10px] text-zinc-500 bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800 mr-auto">
                            {perm.group}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Active Status */}
                <div className="flex items-center justify-between p-3.5 bg-zinc-950 rounded-xl border border-zinc-800">
                  <div>
                    <div className="text-sm font-semibold text-white">وضعیت حساب کاربری</div>
                    <div className="text-xs text-zinc-400">امکان ورود و دسترسی به پنل مدیریت</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingUser?.isActive ?? true}
                      onChange={e => setEditingUser({ ...editingUser, isActive: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                  </label>
                </div>

                {/* Submit Actions */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
                  <button
                    type="button"
                    onClick={() => {
                      setIsNewModalOpen(false);
                      setEditingUser(null);
                    }}
                    className="px-5 py-2.5 rounded-xl border border-zinc-700 text-zinc-300 hover:bg-zinc-800 text-sm font-medium transition-colors"
                  >
                    انصراف
                  </button>
                  <button
                    type="submit"
                    disabled={saveLoading}
                    className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-sm transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50"
                  >
                    {saveLoading ? 'در حال ذخیره‌سازی...' : editingUser?.id ? 'ذخیره تغییرات' : 'ایجاد کاربر جدید'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 p-4 rounded-xl bg-emerald-500 text-zinc-950 font-bold text-sm shadow-xl flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" />
          {toastMessage}
        </div>
      )}
    </div>
  );
};
