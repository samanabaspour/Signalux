import React, { useState, useEffect } from 'react';
import {
  Layers,
  Save,
  Globe,
  CheckCircle,
  Eye,
  Sliders,
  Sparkles,
  RefreshCw,
  ExternalLink,
  ChevronLeft,
  ChevronDown,
  Layout,
  FileText,
  Search,
  Image as ImageIcon,
  Check,
  ToggleLeft,
  ToggleRight,
  PhoneCall,
  Mail,
  MessageSquare,
  MapPin,
  Clock,
  Send,
  Plus,
  Trash2,
  Phone
} from 'lucide-react';
import { PageCustomSettings, ContactPageDetails } from '../../types';
import { fetchPagesConfig, savePageConfig, DEFAULT_PAGES_CONFIG, DEFAULT_CONTACT_DETAILS } from '../../services/apiClient';

export const PagesManager: React.FC = () => {
  const [pages, setPages] = useState<PageCustomSettings[]>(DEFAULT_PAGES_CONFIG);
  const [selectedPageId, setSelectedPageId] = useState<string>('page_home');
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [successToast, setSuccessToast] = useState<string>('');
  const [activeSubTab, setActiveSubTab] = useState<'content' | 'contact-details' | 'seo' | 'sections' | 'preview'>('content');

  useEffect(() => {
    loadPages();
  }, []);

  const loadPages = async () => {
    setLoading(true);
    const data = await fetchPagesConfig();
    if (data && data.length > 0) {
      setPages(data);
    }
    setLoading(false);
  };

  const selectedPage = pages.find(p => p.id === selectedPageId) || pages[0];
  const isContactPage = selectedPage?.slug === 'contact' || selectedPage?.id === 'page_contact';

  const handleUpdateField = <K extends keyof PageCustomSettings>(
    field: K,
    value: PageCustomSettings[K]
  ) => {
    setPages(prev =>
      prev.map(page =>
        page.id === selectedPage.id ? { ...page, [field]: value } : page
      )
    );
  };

  const handleUpdateContactDetail = <K extends keyof ContactPageDetails>(
    field: K,
    value: ContactPageDetails[K]
  ) => {
    const currentDetails = selectedPage.contactDetails || DEFAULT_CONTACT_DETAILS;
    const updated = { ...currentDetails, [field]: value };
    handleUpdateField('contactDetails', updated);
  };

  const handleAddServiceOption = () => {
    const currentDetails = selectedPage.contactDetails || DEFAULT_CONTACT_DETAILS;
    const list = [...(currentDetails.formServicesList || [])];
    list.push({ id: `srv_${Date.now()}`, label: 'خدمت جدید' });
    handleUpdateContactDetail('formServicesList', list);
  };

  const handleRemoveServiceOption = (index: number) => {
    const currentDetails = selectedPage.contactDetails || DEFAULT_CONTACT_DETAILS;
    const list = (currentDetails.formServicesList || []).filter((_, i) => i !== index);
    handleUpdateContactDetail('formServicesList', list);
  };

  const handleUpdateServiceOption = (index: number, label: string) => {
    const currentDetails = selectedPage.contactDetails || DEFAULT_CONTACT_DETAILS;
    const list = [...(currentDetails.formServicesList || [])];
    list[index] = { ...list[index], label };
    handleUpdateContactDetail('formServicesList', list);
  };

  const handleSaveCurrentPage = async () => {
    if (!selectedPage) return;
    setSaving(true);
    const ok = await savePageConfig(selectedPage);
    setSaving(false);
    if (ok) {
      setSuccessToast(`تنظیمات برگه «${selectedPage.title}» با موفقیت ذخیره و اعمال شد.`);
      setTimeout(() => setSuccessToast(''), 4000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-l from-indigo-950/40 via-amber-950/20 to-purple-950/40 border border-indigo-500/20 rounded-2xl p-6 relative overflow-hidden backdrop-blur-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-1.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300">
                <Layers className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-white tracking-wide">
                مدیریت برگه‌ها و صفحات سایت
              </h2>
            </div>
            <p className="text-xs text-white/60 font-light max-w-2xl leading-relaxed">
              کنترل یکپارچه محتوا، سربرگ هیرو، تصاویر بنر، اطلاعات اختصاصی تماس، دکمه‌های اقدام (CTA)، سئوی اختصاصی و تنظیمات فعال‌سازی بخش‌های تمام صفحات وب‌سایت سیگنالوکس.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadPages}
              disabled={loading}
              className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer"
              title="بارگذاری مجدد"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>تازه‌سازی</span>
            </button>

            <button
              onClick={handleSaveCurrentPage}
              disabled={saving}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white text-xs font-bold font-mono transition-all shadow-lg shadow-indigo-500/20 flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'در حال ذخیره...' : 'ذخیره تغییرات برگه'}</span>
            </button>
          </div>
        </div>

        {/* Success Toast */}
        {successToast && (
          <div className="mt-4 p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{successToast}</span>
          </div>
        )}
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Pages List (4 Cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="bg-[#120e1a]/90 border border-indigo-500/20 rounded-2xl p-4 shadow-xl">
            <div className="text-[11px] font-mono uppercase tracking-wider text-indigo-300/70 mb-3 px-2 flex items-center justify-between">
              <span>فهرست صفحات سایت ({pages.length})</span>
              <Layout className="w-3.5 h-3.5" />
            </div>

            <div className="space-y-1.5">
              {pages.map(page => {
                const isSelected = page.id === selectedPageId;
                return (
                  <button
                    key={page.id}
                    onClick={() => {
                      setSelectedPageId(page.id);
                      if (page.slug === 'contact' || page.id === 'page_contact') {
                        setActiveSubTab('contact-details');
                      } else if (activeSubTab === 'contact-details') {
                        setActiveSubTab('content');
                      }
                    }}
                    className={`w-full text-right p-3 rounded-xl transition-all cursor-pointer flex items-center justify-between border ${
                      isSelected
                        ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border-indigo-500/40 text-white shadow-md'
                        : 'bg-white/5 hover:bg-white/10 border-white/5 text-white/70 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          page.isVisible ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' : 'bg-red-400'
                        }`}
                      />
                      <div>
                        <div className="text-xs font-bold flex items-center gap-1.5">
                          <span>{page.title}</span>
                          {(page.slug === 'contact' || page.id === 'page_contact') && (
                            <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[9px] font-mono">
                              تماس و آدرس
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-white/40 font-mono mt-0.5">
                          مسیر: /{page.slug}
                        </div>
                      </div>
                    </div>

                    <ChevronLeft
                      className={`w-4 h-4 transition-transform ${
                        isSelected ? 'text-indigo-400 translate-x-0' : 'text-white/30 -translate-x-1'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Page Info Card */}
          {selectedPage && (
            <div className="bg-[#120e1a]/80 border border-white/10 rounded-2xl p-4 text-xs space-y-2.5">
              <div className="text-[11px] font-mono text-white/50 uppercase">مشخصات فنی برگه</div>
              <div className="flex justify-between items-center py-1 border-b border-white/5">
                <span className="text-white/60">شناسه سیستمی:</span>
                <span className="font-mono text-indigo-300">{selectedPage.id}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-white/5">
                <span className="text-white/60">نام در منو:</span>
                <span className="text-white font-medium">{selectedPage.navTitle}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-white/5">
                <span className="text-white/60">وضعیت انتشار:</span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                    selectedPage.isVisible
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : 'bg-red-500/20 text-red-300'
                  }`}
                >
                  {selectedPage.isVisible ? 'فعال و نمایان' : 'غیرفعال / پیش‌نویس'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Active Page Settings Editor (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          {selectedPage && (
            <div className="bg-[#120e1a]/95 border border-indigo-500/20 rounded-2xl p-6 shadow-2xl space-y-6">
              {/* Tabs Navigation within Selected Page */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-indigo-300 bg-indigo-500/20 px-2 py-1 rounded-md">
                    /{selectedPage.slug}
                  </span>
                  <h3 className="text-sm font-bold text-white">{selectedPage.title}</h3>
                </div>

                <div className="flex flex-wrap items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10">
                  {isContactPage && (
                    <button
                      onClick={() => setActiveSubTab('contact-details')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer flex items-center gap-1.5 ${
                        activeSubTab === 'contact-details'
                          ? 'bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/20'
                          : 'text-amber-300 hover:text-white'
                      }`}
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>اطلاعات اختصاصی تماس و دفتر</span>
                    </button>
                  )}
                  <button
                    onClick={() => setActiveSubTab('content')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                      activeSubTab === 'content'
                        ? 'bg-indigo-600 text-white font-bold'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    محتوای هیرو و متن‌ها
                  </button>
                  <button
                    onClick={() => setActiveSubTab('sections')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                      activeSubTab === 'sections'
                        ? 'bg-indigo-600 text-white font-bold'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    بخش‌ها و سکشن‌ها
                  </button>
                  <button
                    onClick={() => setActiveSubTab('seo')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                      activeSubTab === 'seo'
                        ? 'bg-indigo-600 text-white font-bold'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    سئو و متادیتا
                  </button>
                  <button
                    onClick={() => setActiveSubTab('preview')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                      activeSubTab === 'preview'
                        ? 'bg-indigo-600 text-white font-bold'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    پیش‌نمایش
                  </button>
                </div>
              </div>

              {/* DEDICATED TAB: CONTACT DETAILS FOR CONTACT PAGE */}
              {activeSubTab === 'contact-details' && isContactPage && (
                <div className="space-y-6">
                  {/* Notice */}
                  <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-200 text-xs flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <PhoneCall className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>تمام اطلاعات این بخش مستقیماً در برگه تماس با ما (و بخش‌های ارتباطی سایت) نمایش داده می‌شوند.</span>
                    </div>
                    <span className="text-[10px] font-mono bg-amber-500/20 px-2 py-0.5 rounded text-amber-300">
                      همگام‌سازی لحظه‌ای
                    </span>
                  </div>

                  {/* Section 1: Direct Phone Call */}
                  <div className="bg-[#171322] border border-amber-500/20 rounded-xl p-4.5 space-y-3.5">
                    <div className="flex items-center gap-2 border-b border-white/5 pb-2.5">
                      <div className="p-1.5 bg-amber-500/20 text-amber-300 rounded-lg">
                        <Phone className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">۱. کارت تماس تلفنی مستقیم</h4>
                        <p className="text-[10px] text-white/50">تنظیم عنوان، ساعات پاسخگویی و شماره تماس رسمی</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-mono text-white/70 mb-1">عنوان کارت تماس</label>
                        <input
                          type="text"
                          value={selectedPage.contactDetails?.phoneTitle || 'تماس تلفنی مستقیم'}
                          onChange={e => handleUpdateContactDetail('phoneTitle', e.target.value)}
                          className="w-full bg-[#120e1a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-mono text-white/70 mb-1">زیرعنوان / روزها و ساعات تماس</label>
                        <input
                          type="text"
                          value={selectedPage.contactDetails?.phoneSubtitle || 'شنبه تا چهارشنبه - ۹:۰۰ الی ۱۸:۰۰'}
                          onChange={e => handleUpdateContactDetail('phoneSubtitle', e.target.value)}
                          className="w-full bg-[#120e1a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-mono text-white/70 mb-1">شماره تماس (جهت نمایش)</label>
                        <input
                          type="text"
                          dir="ltr"
                          value={selectedPage.contactDetails?.phoneNumber || '۰۹۳۵ ۲۹۹ ۷۲۷۲'}
                          onChange={e => handleUpdateContactDetail('phoneNumber', e.target.value)}
                          className="w-full bg-[#120e1a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-mono text-white/70 mb-1">شماره خام تماس (جهت کلیک و شماره‌گیری tel:)</label>
                        <input
                          type="text"
                          dir="ltr"
                          placeholder="09352997272"
                          value={selectedPage.contactDetails?.phoneRaw || '09352997272'}
                          onChange={e => handleUpdateContactDetail('phoneRaw', e.target.value)}
                          className="w-full bg-[#120e1a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Direct Email */}
                  <div className="bg-[#171322] border border-amber-500/20 rounded-xl p-4.5 space-y-3.5">
                    <div className="flex items-center gap-2 border-b border-white/5 pb-2.5">
                      <div className="p-1.5 bg-amber-500/20 text-amber-300 rounded-lg">
                        <Mail className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">۲. کارت ارسال ایمیل مستقیم</h4>
                        <p className="text-[10px] text-white/50">تنظیم آدرس ایمیل، توضیحات و دکمه کپی</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-mono text-white/70 mb-1">عنوان کارت ایمیل</label>
                        <input
                          type="text"
                          value={selectedPage.contactDetails?.emailTitle || 'ارسال ایمیل مستقیم'}
                          onChange={e => handleUpdateContactDetail('emailTitle', e.target.value)}
                          className="w-full bg-[#120e1a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-mono text-white/70 mb-1">زیرعنوان راهنما</label>
                        <input
                          type="text"
                          value={selectedPage.contactDetails?.emailSubtitle || 'پاسخگویی سریع برای درخواست‌های رسمی'}
                          onChange={e => handleUpdateContactDetail('emailSubtitle', e.target.value)}
                          className="w-full bg-[#120e1a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-[11px] font-mono text-white/70 mb-1">آدرس ایمیل سازمانی</label>
                        <input
                          type="email"
                          dir="ltr"
                          value={selectedPage.contactDetails?.emailAddress || 'hello@signalux.ir'}
                          onChange={e => handleUpdateContactDetail('emailAddress', e.target.value)}
                          className="w-full bg-[#120e1a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section 3: Messengers (Telegram & WhatsApp) */}
                  <div className="bg-[#171322] border border-amber-500/20 rounded-xl p-4.5 space-y-3.5">
                    <div className="flex items-center gap-2 border-b border-white/5 pb-2.5">
                      <div className="p-1.5 bg-amber-500/20 text-amber-300 rounded-lg">
                        <MessageSquare className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">۳. کارت پیام‌رسان‌ها (تلگرام و واتس‌اپ)</h4>
                        <p className="text-[10px] text-white/50">تنظیم نام کاربری، لینک‌های گفتگو و مشاوره آنلاین</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-mono text-white/70 mb-1">عنوان کارت پیام‌رسان‌ها</label>
                        <input
                          type="text"
                          value={selectedPage.contactDetails?.messengersTitle || 'پیام‌رسان‌های تلگرام و واتس‌اپ'}
                          onChange={e => handleUpdateContactDetail('messengersTitle', e.target.value)}
                          className="w-full bg-[#120e1a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-mono text-white/70 mb-1">زیرعنوان پیام‌رسان‌ها</label>
                        <input
                          type="text"
                          value={selectedPage.contactDetails?.messengersSubtitle || 'مشاوره آنلاین فوری و ارسال فایل پروژه‌ها'}
                          onChange={e => handleUpdateContactDetail('messengersSubtitle', e.target.value)}
                          className="w-full bg-[#120e1a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-mono text-white/70 mb-1">شناسه تلگرام (Telegram ID)</label>
                        <input
                          type="text"
                          dir="ltr"
                          value={selectedPage.contactDetails?.telegramId || '@Signalux_Studio'}
                          onChange={e => handleUpdateContactDetail('telegramId', e.target.value)}
                          className="w-full bg-[#120e1a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-mono text-white/70 mb-1">لینک مستقیم تلگرام</label>
                        <input
                          type="url"
                          dir="ltr"
                          placeholder="https://t.me/Signalux_Studio"
                          value={selectedPage.contactDetails?.telegramLink || 'https://t.me/Signalux_Studio'}
                          onChange={e => handleUpdateContactDetail('telegramLink', e.target.value)}
                          className="w-full bg-[#120e1a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-mono text-white/70 mb-1">لینک یا شماره واتس‌اپ</label>
                        <input
                          type="url"
                          dir="ltr"
                          placeholder="https://wa.me/989195466400"
                          value={selectedPage.contactDetails?.whatsappLink || 'https://wa.me/989195466400'}
                          onChange={e => handleUpdateContactDetail('whatsappLink', e.target.value)}
                          className="w-full bg-[#120e1a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-mono text-white/70 mb-1">متن دکمه تلگرام</label>
                        <input
                          type="text"
                          value={selectedPage.contactDetails?.telegramButtonText || 'ارسال پیام در تلگرام'}
                          onChange={e => handleUpdateContactDetail('telegramButtonText', e.target.value)}
                          className="w-full bg-[#120e1a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section 4: Consultation Form Customization */}
                  <div className="bg-[#171322] border border-amber-500/20 rounded-xl p-4.5 space-y-3.5">
                    <div className="flex items-center gap-2 border-b border-white/5 pb-2.5">
                      <div className="p-1.5 bg-amber-500/20 text-amber-300 rounded-lg">
                        <Send className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">۴. فرم ثبت درخواست مشاوره و پیام مستقیم</h4>
                        <p className="text-[10px] text-white/50">شخصی‌سازی متون، عناوین فیلدها و گزینه‌های لیست خدمات</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-mono text-white/70 mb-1">تیتر اصلی فرم</label>
                        <input
                          type="text"
                          value={selectedPage.contactDetails?.formTitle || 'فرم ثبت درخواست مشاوره و پیام مستقیم'}
                          onChange={e => handleUpdateContactDetail('formTitle', e.target.value)}
                          className="w-full bg-[#120e1a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-mono text-white/70 mb-1">توضیح زیر تیتر فرم</label>
                        <input
                          type="text"
                          value={selectedPage.contactDetails?.formSubtitle || 'اطلاعات خود را وارد کنید تا کارشناسان ما در سریع‌ترین زمان تماس بگیرند.'}
                          onChange={e => handleUpdateContactDetail('formSubtitle', e.target.value)}
                          className="w-full bg-[#120e1a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-mono text-white/70 mb-1">متن راهنمای نام (Placeholder)</label>
                        <input
                          type="text"
                          value={selectedPage.contactDetails?.formNamePlaceholder || 'مثال: علی محمدی / شرکت آریا'}
                          onChange={e => handleUpdateContactDetail('formNamePlaceholder', e.target.value)}
                          className="w-full bg-[#120e1a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-mono text-white/70 mb-1">متن دکمه ارسال فرم</label>
                        <input
                          type="text"
                          value={selectedPage.contactDetails?.formSubmitButtonText || 'ثبت و ارسال پیام به تیم پشتیبانی'}
                          onChange={e => handleUpdateContactDetail('formSubmitButtonText', e.target.value)}
                          className="w-full bg-[#120e1a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-bold focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>

                    {/* Form Services List Manager */}
                    <div className="pt-2">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-[11px] font-mono text-white/70">گزینه‌های دسته‌بندی خدمت مورد نظر در فرم</label>
                        <button
                          type="button"
                          onClick={handleAddServiceOption}
                          className="text-[10px] font-mono bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 px-2 py-1 rounded-lg flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                          <span>افزودن خدمت جدید</span>
                        </button>
                      </div>

                      <div className="space-y-2">
                        {(selectedPage.contactDetails?.formServicesList || DEFAULT_CONTACT_DETAILS.formServicesList).map((srv, idx) => (
                          <div key={srv.id || idx} className="flex items-center gap-2">
                            <input
                              type="text"
                              value={srv.label}
                              onChange={e => handleUpdateServiceOption(idx, e.target.value)}
                              className="flex-1 bg-[#120e1a] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveServiceOption(idx)}
                              className="p-1.5 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 cursor-pointer"
                              title="حذف این گزینه"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Section 5: HQ Office & Location */}
                  <div className="bg-[#171322] border border-amber-500/20 rounded-xl p-4.5 space-y-3.5">
                    <div className="flex items-center gap-2 border-b border-white/5 pb-2.5">
                      <div className="p-1.5 bg-amber-500/20 text-amber-300 rounded-lg">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">۵. دفتر مرکزی و نقشه موقعیت</h4>
                        <p className="text-[10px] text-white/50">تنظیم آدرس، لینک نقشه و نکات حضور در دفتر</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-mono text-white/70 mb-1">عنوان دفتر مرکزی</label>
                        <input
                          type="text"
                          value={selectedPage.contactDetails?.officeTitle || 'دفتر مرکزی سیگنالوکس'}
                          onChange={e => handleUpdateContactDetail('officeTitle', e.target.value)}
                          className="w-full bg-[#120e1a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-mono text-white/70 mb-1">آدرس متنی و موقعیت</label>
                        <input
                          type="text"
                          value={selectedPage.contactDetails?.officeAddress || 'کرج / محمدشهر'}
                          onChange={e => handleUpdateContactDetail('officeAddress', e.target.value)}
                          className="w-full bg-[#120e1a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-mono text-white/70 mb-1">یادداشت ملاقات حضوری</label>
                        <input
                          type="text"
                          value={selectedPage.contactDetails?.officeAppointmentNote || 'ملاقات حضوری با هماهنگی قبلی'}
                          onChange={e => handleUpdateContactDetail('officeAppointmentNote', e.target.value)}
                          className="w-full bg-[#120e1a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-mono text-white/70 mb-1">لینک نقشه گوگل یا مسیریاب (URL)</label>
                        <input
                          type="url"
                          dir="ltr"
                          placeholder="https://maps.google.com/?q=..."
                          value={selectedPage.contactDetails?.officeMapLink || 'https://maps.google.com/?q=Karaj+Mohammadshahr'}
                          onChange={e => handleUpdateContactDetail('officeMapLink', e.target.value)}
                          className="w-full bg-[#120e1a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section 6: Working Hours */}
                  <div className="bg-[#171322] border border-amber-500/20 rounded-xl p-4.5 space-y-3.5">
                    <div className="flex items-center gap-2 border-b border-white/5 pb-2.5">
                      <div className="p-1.5 bg-amber-500/20 text-amber-300 rounded-lg">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">۶. ساعات کاری و پشتیبانی</h4>
                        <p className="text-[10px] text-white/50">تنظیم ساعات شنبه تا چهارشنبه، پنجشنبه و روزهای تعطیل</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-mono text-white/70 mb-1">عنوان باکس ساعات کاری</label>
                        <input
                          type="text"
                          value={selectedPage.contactDetails?.workingHoursTitle || 'ساعات کاری و پاسخگویی'}
                          onChange={e => handleUpdateContactDetail('workingHoursTitle', e.target.value)}
                          className="w-full bg-[#120e1a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-mono text-white/70 mb-1">متن نشان بالای برگه (Response Badge)</label>
                        <input
                          type="text"
                          value={selectedPage.contactDetails?.responseCommitmentBadge || 'پاسخگویی فعال (کمتر از ۲ ساعت)'}
                          onChange={e => handleUpdateContactDetail('responseCommitmentBadge', e.target.value)}
                          className="w-full bg-[#120e1a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-mono text-white/70 mb-1">ساعات شنبه تا چهارشنبه</label>
                        <input
                          type="text"
                          value={selectedPage.contactDetails?.hoursWeekdays || '۰۹:۰۰ الی ۱۸:۰۰'}
                          onChange={e => handleUpdateContactDetail('hoursWeekdays', e.target.value)}
                          className="w-full bg-[#120e1a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-mono text-white/70 mb-1">ساعات پنج‌شنبه‌ها</label>
                        <input
                          type="text"
                          value={selectedPage.contactDetails?.hoursThursday || '۰۹:۰۰ الی ۱۳:۰۰'}
                          onChange={e => handleUpdateContactDetail('hoursThursday', e.target.value)}
                          className="w-full bg-[#120e1a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-[11px] font-mono text-white/70 mb-1">جمعه‌ها و ایام تعطیل</label>
                        <input
                          type="text"
                          value={selectedPage.contactDetails?.hoursFriday || 'پشتیبانی اضطراری ایمیل'}
                          onChange={e => handleUpdateContactDetail('hoursFriday', e.target.value)}
                          className="w-full bg-[#120e1a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 1: HERO & CONTENT */}
              {activeSubTab === 'content' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-white/70 mb-1">
                        عنوان اصلی برگه (Page Title)
                      </label>
                      <input
                        type="text"
                        value={selectedPage.title}
                        onChange={e => handleUpdateField('title', e.target.value)}
                        className="w-full bg-[#171322] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-white/70 mb-1">
                        عنوان در منوی ناوبری (Nav Label)
                      </label>
                      <input
                        type="text"
                        value={selectedPage.navTitle}
                        onChange={e => handleUpdateField('navTitle', e.target.value)}
                        className="w-full bg-[#171322] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-white/70 mb-1">
                      برچسب هدر / نشان کوچک (Badge Text / Eyebrow)
                    </label>
                    <input
                      type="text"
                      dir="ltr"
                      placeholder="e.g. NEXT-GEN DIGITAL AGENCY"
                      value={selectedPage.badgeText || ''}
                      onChange={e => handleUpdateField('badgeText', e.target.value)}
                      className="w-full bg-[#171322] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-white/70 mb-1">
                      تیتر اصلی هیرو (Hero Headline - H1)
                    </label>
                    <input
                      type="text"
                      value={selectedPage.heroHeadline}
                      onChange={e => handleUpdateField('heroHeadline', e.target.value)}
                      className="w-full bg-[#171322] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white font-bold focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-white/70 mb-1">
                      توضیحات و زیرعنوان هیرو (Hero Subtitle)
                    </label>
                    <textarea
                      rows={3}
                      value={selectedPage.heroSubtitle}
                      onChange={e => handleUpdateField('heroSubtitle', e.target.value)}
                      className="w-full bg-[#171322] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500 resize-none leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-white/70 mb-1">
                      آدرس تصویر بنر / کاور هیرو (Banner Image URL)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        dir="ltr"
                        placeholder="https://..."
                        value={selectedPage.heroBannerImage || ''}
                        onChange={e => handleUpdateField('heroBannerImage', e.target.value)}
                        className="flex-1 bg-[#171322] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
                      />
                      {selectedPage.heroBannerImage && (
                        <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/20 shrink-0">
                          <img
                            src={selectedPage.heroBannerImage}
                            alt="Banner preview"
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="block text-xs font-mono text-white/70 mb-1">
                        متن دکمه اصلی اقدام (CTA Button Text)
                      </label>
                      <input
                        type="text"
                        value={selectedPage.ctaButtonText || ''}
                        onChange={e => handleUpdateField('ctaButtonText', e.target.value)}
                        className="w-full bg-[#171322] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-white/70 mb-1">
                        لینک دکمه اصلی (CTA Button Link)
                      </label>
                      <input
                        type="text"
                        dir="ltr"
                        value={selectedPage.ctaButtonLink || ''}
                        onChange={e => handleUpdateField('ctaButtonLink', e.target.value)}
                        className="w-full bg-[#171322] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: SECTIONS & VISIBILITY */}
              {activeSubTab === 'sections' && (
                <div className="space-y-4">
                  <div className="p-4 bg-white/5 border border-white/10 rounded-xl text-xs text-white/70 leading-relaxed">
                    کنترل نمایش یا عدم نمایش ماژول‌های زیرساختی در این برگه:
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label className="flex items-center justify-between p-3.5 bg-[#171322] border border-white/10 rounded-xl cursor-pointer hover:bg-white/5 transition-all">
                      <div className="text-xs">
                        <div className="font-bold text-white">انتشار و نمایش عمومی برگه</div>
                        <div className="text-[11px] text-white/50">آیا این برگه برای کاربران قابل دسترسی باشد؟</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={selectedPage.isVisible}
                        onChange={e => handleUpdateField('isVisible', e.target.checked)}
                        className="w-4 h-4 accent-indigo-500"
                      />
                    </label>

                    <label className="flex items-center justify-between p-3.5 bg-[#171322] border border-white/10 rounded-xl cursor-pointer hover:bg-white/5 transition-all">
                      <div className="text-xs">
                        <div className="font-bold text-white">فرم ثبت درخواست مشاوره</div>
                        <div className="text-[11px] text-white/50">نمایش فرم دریافت لید در انتهای برگه</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={!!selectedPage.showConsultationForm}
                        onChange={e => handleUpdateField('showConsultationForm', e.target.checked)}
                        className="w-4 h-4 accent-indigo-500"
                      />
                    </label>

                    <label className="flex items-center justify-between p-3.5 bg-[#171322] border border-white/10 rounded-xl cursor-pointer hover:bg-white/5 transition-all">
                      <div className="text-xs">
                        <div className="font-bold text-white">اسلایدر نظرات مشتریان</div>
                        <div className="text-[11px] text-white/50">نمایش بخش رضایت کارفرمایان</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={!!selectedPage.showTestimonials}
                        onChange={e => handleUpdateField('showTestimonials', e.target.checked)}
                        className="w-4 h-4 accent-indigo-500"
                      />
                    </label>

                    <label className="flex items-center justify-between p-3.5 bg-[#171322] border border-white/10 rounded-xl cursor-pointer hover:bg-white/5 transition-all">
                      <div className="text-xs">
                        <div className="font-bold text-white">بخش سوالات متداول (FAQ)</div>
                        <div className="text-[11px] text-white/50">نمایش آکاردئون پرسش و پاسخ</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={!!selectedPage.showFaq}
                        onChange={e => handleUpdateField('showFaq', e.target.checked)}
                        className="w-4 h-4 accent-indigo-500"
                      />
                    </label>

                    <label className="flex items-center justify-between p-3.5 bg-[#171322] border border-white/10 rounded-xl cursor-pointer hover:bg-white/5 transition-all">
                      <div className="text-xs">
                        <div className="font-bold text-white">تایم‌لاین فرآیند کاری (Process)</div>
                        <div className="text-[11px] text-white/50">نمایش گام‌های ۴ گانه اجرای پروژه</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={!!selectedPage.showProcessTimeline}
                        onChange={e => handleUpdateField('showProcessTimeline', e.target.checked)}
                        className="w-4 h-4 accent-indigo-500"
                      />
                    </label>
                  </div>
                </div>
              )}

              {/* TAB 3: SEO METADATA */}
              {activeSubTab === 'seo' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono text-white/70 mb-1">
                      عنوان سئوی برگه (Meta Title)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. طراحی سایت اختصاصی | سیگنالوکس"
                      value={selectedPage.seoMetaTitle || ''}
                      onChange={e => handleUpdateField('seoMetaTitle', e.target.value)}
                      className="w-full bg-[#171322] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                    <div className="flex justify-between text-[10px] text-white/40 mt-1 font-mono">
                      <span>پیشنهادی: ۵۰ تا ۶۰ کاراکتر</span>
                      <span>طول فعلی: {(selectedPage.seoMetaTitle || '').length}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-white/70 mb-1">
                      متای توضیحات سئو (Meta Description)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="توضیحات جذاب و خلاصه برای نمایش در نتایج گوگل..."
                      value={selectedPage.seoMetaDescription || ''}
                      onChange={e => handleUpdateField('seoMetaDescription', e.target.value)}
                      className="w-full bg-[#171322] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500 resize-none leading-relaxed"
                    />
                    <div className="flex justify-between text-[10px] text-white/40 mt-1 font-mono">
                      <span>پیشنهادی: ۱۳۰ تا ۱۶۰ کاراکتر</span>
                      <span>طول فعلی: {(selectedPage.seoMetaDescription || '').length}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-white/70 mb-1">
                      کلمات کلیدی برگه (Meta Keywords - جدا شده با کاما)
                    </label>
                    <input
                      type="text"
                      placeholder="طراحی سایت, سئو, توسعه وب"
                      value={selectedPage.seoKeywords || ''}
                      onChange={e => handleUpdateField('seoKeywords', e.target.value)}
                      className="w-full bg-[#171322] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="pt-2">
                    <label className="flex items-center gap-2 text-xs text-white cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!!selectedPage.noIndex}
                        onChange={e => handleUpdateField('noIndex', e.target.checked)}
                        className="w-4 h-4 accent-red-500"
                      />
                      <span className="font-bold text-red-300">
                        اعمال تگ NoIndex (عدم ایندکس توسط موتورهای جستجو)
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {/* TAB 4: VISUAL SIMULATION PREVIEW */}
              {activeSubTab === 'preview' && (
                <div className="space-y-4">
                  <div className="border border-white/10 rounded-2xl overflow-hidden bg-black/60">
                    <div className="bg-white/5 border-b border-white/10 p-3 flex items-center justify-between text-xs font-mono text-white/50">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                        <span className="ml-2">https://signalux.ir/{selectedPage.slug}</span>
                      </div>
                      <span className="text-[10px] text-indigo-400">پیش‌نمایش بصری هیرو</span>
                    </div>

                    <div className="p-8 text-center space-y-4 relative overflow-hidden">
                      {selectedPage.heroBannerImage && (
                        <div className="absolute inset-0 opacity-15 pointer-events-none">
                          <img
                            src={selectedPage.heroBannerImage}
                            alt="hero bg"
                            className="w-full h-full object-cover blur-sm"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      )}

                      {selectedPage.badgeText && (
                        <span className="inline-block px-3 py-1 rounded-full text-[10px] font-mono tracking-widest bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          {selectedPage.badgeText}
                        </span>
                      )}

                      <h1 className="text-2xl font-bold text-white max-w-xl mx-auto leading-tight">
                        {selectedPage.heroHeadline}
                      </h1>

                      <p className="text-xs text-white/70 max-w-lg mx-auto leading-relaxed">
                        {selectedPage.heroSubtitle}
                      </p>

                      <div className="flex items-center justify-center gap-3 pt-2">
                        {selectedPage.ctaButtonText && (
                          <div className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-bold text-xs font-mono shadow-md">
                            {selectedPage.ctaButtonText}
                          </div>
                        )}
                        {selectedPage.secondaryButtonText && (
                          <div className="px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-xs font-mono">
                            {selectedPage.secondaryButtonText}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Bottom Action Footer */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-[11px] text-white/40 font-mono">
                  آخرین بروزرسانی: {selectedPage.updatedAt ? new Date(selectedPage.updatedAt).toLocaleDateString('fa-IR') : 'پیش‌فرض'}
                </span>

                <button
                  onClick={handleSaveCurrentPage}
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white text-xs font-bold font-mono transition-all shadow-lg shadow-indigo-500/20 flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'در حال ذخیره...' : `ذخیره برگه «${selectedPage.title}»`}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
