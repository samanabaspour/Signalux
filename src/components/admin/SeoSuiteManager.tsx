import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Globe,
  FileCode,
  ShieldAlert,
  Search,
  ExternalLink,
  Copy,
  Check,
  RefreshCw,
  Save,
  Plus,
  Trash2,
  Code2,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Layers,
  Sparkles,
  Link2,
  Download
} from 'lucide-react';
import { SeoGlobalSettings, SeoRedirectRule, PageSeoRule } from '../../types';
import { fetchSeoSettings, updateSeoSettings, fetchSitemapXml, fetchRobotsTxt } from '../../services/apiClient';

export const SeoSuiteManager: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'global' | 'sitemap' | 'robots' | 'pages' | 'redirects'>('global');
  const [seoSettings, setSeoSettings] = useState<SeoGlobalSettings | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saveLoading, setSaveLoading] = useState<boolean>(false);
  const [sitemapData, setSitemapData] = useState<{ sitemapXml: string; urlCount: number; baseUrl: string } | null>(null);
  const [sitemapLoading, setSitemapLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Redirect Form
  const [newRedirect, setNewRedirect] = useState<{ sourcePath: string; targetPath: string; type: 301 | 302 }>({
    sourcePath: '',
    targetPath: '',
    type: 301
  });

  // New Page Rule Form
  const [newPageRule, setNewPageRule] = useState<Partial<PageSeoRule>>({
    pagePath: '',
    pageName: '',
    metaTitle: '',
    metaDescription: '',
    noIndex: false
  });

  const loadSettings = async () => {
    setLoading(true);
    const data = await fetchSeoSettings();
    if (data) {
      setSeoSettings(data);
    }
    setLoading(false);
  };

  const loadSitemap = async () => {
    setSitemapLoading(true);
    const res = await fetchSitemapXml();
    if (res) {
      setSitemapData(res);
    }
    setSitemapLoading(false);
  };

  useEffect(() => {
    loadSettings();
    loadSitemap();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2500);
    showToast('متن در کلیپ‌بورد کپی شد.');
  };

  const handleSaveGlobal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!seoSettings) return;

    setSaveLoading(true);
    const res = await updateSeoSettings(seoSettings);
    if (res) {
      setSeoSettings(res);
      showToast('تنظیمات سئو با موفقیت در پایگاه داده ذخیره شد.');
      loadSitemap();
    }
    setSaveLoading(false);
  };

  const handleAddRedirect = async () => {
    if (!newRedirect.sourcePath || !newRedirect.targetPath || !seoSettings) return;
    const redirectItem: SeoRedirectRule = {
      id: `red-${Date.now()}`,
      sourcePath: newRedirect.sourcePath,
      targetPath: newRedirect.targetPath,
      type: newRedirect.type,
      isActive: true,
      createdAt: new Date().toISOString()
    };
    const updatedRedirects = [...(seoSettings.redirects || []), redirectItem];
    const updated = await updateSeoSettings({ ...seoSettings, redirects: updatedRedirects });
    if (updated) {
      setSeoSettings(updated);
      setNewRedirect({ sourcePath: '', targetPath: '', type: 301 });
      showToast('قانون ریدایرکت جدید اضافه شد.');
    }
  };

  const handleDeleteRedirect = async (id: string) => {
    if (!seoSettings) return;
    const updatedRedirects = (seoSettings.redirects || []).filter(r => r.id !== id);
    const updated = await updateSeoSettings({ ...seoSettings, redirects: updatedRedirects });
    if (updated) {
      setSeoSettings(updated);
      showToast('قانون ریدایرکت حذف گردید.');
    }
  };

  const handleAddPageRule = async () => {
    if (!newPageRule.pagePath || !newPageRule.metaTitle || !seoSettings) return;
    const ruleItem: PageSeoRule = {
      id: `page-${Date.now()}`,
      pagePath: newPageRule.pagePath,
      pageName: newPageRule.pageName || newPageRule.pagePath,
      metaTitle: newPageRule.metaTitle,
      metaDescription: newPageRule.metaDescription || '',
      metaKeywords: newPageRule.metaKeywords || '',
      noIndex: !!newPageRule.noIndex
    };
    const updatedRules = [...(seoSettings.pageRules || []), ruleItem];
    const updated = await updateSeoSettings({ ...seoSettings, pageRules: updatedRules });
    if (updated) {
      setSeoSettings(updated);
      setNewPageRule({ pagePath: '', pageName: '', metaTitle: '', metaDescription: '', noIndex: false });
      showToast('تنظیمات سئوی اختصاصی صفحه ذخیره شد.');
    }
  };

  const handleDeletePageRule = async (id: string) => {
    if (!seoSettings) return;
    const updatedRules = (seoSettings.pageRules || []).filter(p => p.id !== id);
    const updated = await updateSeoSettings({ ...seoSettings, pageRules: updatedRules });
    if (updated) {
      setSeoSettings(updated);
      showToast('تنظیمات صفحه حذف شد.');
    }
  };

  const handleDownloadSitemap = () => {
    if (!sitemapData?.sitemapXml) return;
    const blob = new Blob([sitemapData.sitemapXml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sitemap.xml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div id="admin-seo-suite-manager" className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-zinc-900 via-zinc-900 to-zinc-950 border border-zinc-800">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Globe className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-white">مرکز فرماندهی سئو و بهینه‌سازی تکنیکال (SEO Suite)</h2>
          </div>
          <p className="text-sm text-zinc-400 max-w-3xl leading-relaxed">
            مدیریت متاداده‌های ساختاریافته، تولید لحظه‌ای نقشه سایت دینامیک (Sitemap.xml)، ویرایش فایل Robots.txt، تنظیم کدهای اعتبارسنجی سرچ‌کنسول و مدیریت ریدایرکت‌های ۳۰۱.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              loadSettings();
              loadSitemap();
            }}
            disabled={loading || sitemapLoading}
            className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
            title="بروزرسانی داده‌ها"
          >
            <RefreshCw className={`w-4 h-4 ${loading || sitemapLoading ? 'animate-spin' : ''}`} />
          </button>

          <a
            href="/sitemap.xml"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 text-sm font-semibold transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            مشاهده sitemap.xml
          </a>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-zinc-800 pb-3">
        {[
          { id: 'global', label: 'تنظیمات کلی و تگ‌های متا', icon: Globe },
          { id: 'sitemap', label: 'نقشه سایت (Sitemap.xml)', icon: FileCode },
          { id: 'robots', label: 'فایل Robots.txt', icon: FileText },
          { id: 'pages', label: 'سئوی اختصاصی صفحات', icon: Layers },
          { id: 'redirects', label: 'ریدایرکت‌ها (301 / 302)', icon: Link2 }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-emerald-500 text-zinc-950 font-bold shadow-lg shadow-emerald-500/20'
                  : 'bg-zinc-900/60 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800/80'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* SUB-TAB 1: GLOBAL SEO SETTINGS */}
      {activeSubTab === 'global' && seoSettings && (
        <form onSubmit={handleSaveGlobal} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Meta Titles & Hierarchy */}
            <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Globe className="w-4 h-4 text-emerald-400" />
                الگوی عنوان و متای پیش‌فرض
              </h3>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">عنوان سایت (Site Title)</label>
                <input
                  type="text"
                  value={seoSettings.siteTitle || ''}
                  onChange={e => setSeoSettings({ ...seoSettings, siteTitle: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">جداکننده عناوین</label>
                  <input
                    type="text"
                    value={seoSettings.titleSeparator || '|'}
                    onChange={e => setSeoSettings({ ...seoSettings, titleSeparator: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500 text-center font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">دامنه پایه (Canonical URL)</label>
                  <input
                    type="url"
                    value={seoSettings.canonicalBaseUrl || 'https://signalux.ir'}
                    onChange={e => setSeoSettings({ ...seoSettings, canonicalBaseUrl: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">توضیحات متای پیش‌فرض (Meta Description)</label>
                <textarea
                  rows={3}
                  value={seoSettings.defaultMetaDescription || ''}
                  onChange={e => setSeoSettings({ ...seoSettings, defaultMetaDescription: e.target.value })}
                  placeholder="توضیحات جامع آژانس جهت رتبه‌بندی در گوگل..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500 leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">کلمات کلیدی اصلی (Keywords)</label>
                <input
                  type="text"
                  value={seoSettings.defaultMetaKeywords || ''}
                  onChange={e => setSeoSettings({ ...seoSettings, defaultMetaKeywords: e.target.value })}
                  placeholder="طراحی سایت, سئو سایت, دیجیتال مارکتینگ"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Search Engine Verifications & Schema */}
            <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-emerald-400" />
                تأییدیه موتورهای جستجو و Schema.org
              </h3>

              <p className="text-xs text-zinc-300">
                برای روش متاتگ Google Search Console از متغیر سرور
                <code dir="ltr"> GSC_VERIFICATION_CODE </code>
                استفاده کنید.
              </p>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  کد تأیید Bing Webmaster Tools
                </label>
                <input
                  type="text"
                  value={seoSettings.bingVerificationCode || ''}
                  onChange={e => setSeoSettings({ ...seoSettings, bingVerificationCode: e.target.value })}
                  placeholder="محتوای متاتگ بینگ"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-white">فعال‌سازی اسکیما JSON-LD سازمانی</div>
                    <div className="text-xs text-zinc-400">تولید خودکار اسکیما Organization و WebSite برای گوگل</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={seoSettings.enableJsonLdSchema ?? true}
                    onChange={e => setSeoSettings({ ...seoSettings, enableJsonLdSchema: e.target.checked })}
                    className="w-4 h-4 rounded text-emerald-500 bg-zinc-900 border-zinc-700 focus:ring-emerald-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1">نام سازمان در اسکیما</label>
                  <input
                    type="text"
                    value={seoSettings.organizationName || ''}
                    onChange={e => setSeoSettings({ ...seoSettings, organizationName: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saveLoading}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-sm transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saveLoading ? 'در حال ذخیره‌سازی...' : 'ذخیره تنظیمات سئو'}
            </button>
          </div>
        </form>
      )}

      {/* SUB-TAB 2: DYNAMIC SITEMAP.XML */}
      {activeSubTab === 'sitemap' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-zinc-800">
              <div>
                <h3 className="font-bold text-base text-white flex items-center gap-2">
                  <FileCode className="w-5 h-5 text-emerald-400" />
                  نقشه سایت داینامیک استاندارد موتورهای جستجو (Sitemap.xml)
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  شامل تمام صفحات استاتیک، خدمات، مقالات وبلاگ و نمونه‌کارها با خروجی معتبر XML.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => sitemapData && handleCopy(sitemapData.sitemapXml, 'sitemap')}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-800 text-zinc-200 hover:text-white text-xs font-semibold transition-colors"
                >
                  {copied === 'sitemap' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  کپی کد XML
                </button>

                <button
                  onClick={handleDownloadSitemap}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500 text-zinc-950 hover:bg-emerald-400 text-xs font-bold transition-colors"
                >
                  <Download className="w-4 h-4" />
                  دانلود sitemap.xml
                </button>
              </div>
            </div>

            {/* Sitemap Info Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800">
                <div className="text-xs text-zinc-400">تعداد URLهای نمایه شده</div>
                <div className="text-xl font-bold text-emerald-400 mt-1">
                  {sitemapData?.urlCount || 0} آدرس فعال
                </div>
              </div>
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800">
                <div className="text-xs text-zinc-400">آدرس عمومی نقشه سایت</div>
                <div className="text-xs font-mono text-zinc-300 mt-1.5 truncate">
                  {sitemapData?.baseUrl || 'https://signalux.ir'}/sitemap.xml
                </div>
              </div>
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800">
                <div className="text-xs text-zinc-400">وضعیت اعتبار XML</div>
                <div className="text-xs font-semibold text-emerald-400 mt-1.5 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  استاندارد Sitemaps.org 0.9
                </div>
              </div>
            </div>

            {/* XML Code Preview */}
            <div className="relative rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950">
              <div className="flex items-center justify-between px-4 py-2 bg-zinc-900 border-b border-zinc-800 text-xs text-zinc-400 font-mono">
                <span>preview: sitemap.xml</span>
                <span>UTF-8</span>
              </div>
              <pre className="p-4 text-xs font-mono text-emerald-400/90 overflow-x-auto max-h-96 leading-relaxed">
                {sitemapLoading ? 'در حال ایجاد ساختار نقشه سایت...' : sitemapData?.sitemapXml}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: ROBOTS.TXT */}
      {activeSubTab === 'robots' && seoSettings && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-base text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-400" />
                  ویرایشگر مستقیم فایل Robots.txt
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  کنترل دسترسی خزنده‌ها و ربات‌های جستجوگر مانند Googlebot به بخش‌های مختلف سایت.
                </p>
              </div>

              {/* Presets */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const preset = `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/v1/admin/\n\nSitemap: ${(seoSettings.canonicalBaseUrl || 'https://signalux.ir').replace(/\/$/, '')}/sitemap.xml`;
                    setSeoSettings({ ...seoSettings, robotsTxt: preset });
                  }}
                  className="px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-300 hover:text-white text-xs"
                >
                  قالب پیشنهادی سیگنالوکس
                </button>
              </div>
            </div>

            <div>
              <textarea
                rows={10}
                value={seoSettings.robotsTxt || ''}
                onChange={e => setSeoSettings({ ...seoSettings, robotsTxt: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-sm font-mono text-emerald-400 focus:outline-none focus:border-emerald-500 leading-relaxed"
              />
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSaveGlobal}
                disabled={saveLoading}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-sm transition-all shadow-lg shadow-emerald-500/20"
              >
                <Save className="w-4 h-4" />
                ذخیره تغییرات Robots.txt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: PAGE-SPECIFIC SEO */}
      {activeSubTab === 'pages' && seoSettings && (
        <div className="space-y-6">
          {/* Add Page Rule */}
          <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-emerald-400" />
              تعریف سئوی اختصاصی برای یک صفحه خاص
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">مسیر صفحه (Route Path) *</label>
                <input
                  type="text"
                  placeholder="/web-design یا /contact-us"
                  value={newPageRule.pagePath || ''}
                  onChange={e => setNewPageRule({ ...newPageRule, pagePath: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-sm text-zinc-200 font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">نام صفحه</label>
                <input
                  type="text"
                  placeholder="مثال: طراحی سایت اختصاصی"
                  value={newPageRule.pageName || ''}
                  onChange={e => setNewPageRule({ ...newPageRule, pageName: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">عنوان سئو (Meta Title) *</label>
                <input
                  type="text"
                  placeholder="عنوان ویژه در نتایج گوگل"
                  value={newPageRule.metaTitle || ''}
                  onChange={e => setNewPageRule({ ...newPageRule, metaTitle: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">توضیحات متا (Meta Description)</label>
              <input
                type="text"
                placeholder="توضیحات هدفمند برای جذب کلیک این صفحه..."
                value={newPageRule.metaDescription || ''}
                onChange={e => setNewPageRule({ ...newPageRule, metaDescription: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newPageRule.noIndex || false}
                  onChange={e => setNewPageRule({ ...newPageRule, noIndex: e.target.checked })}
                  className="rounded text-rose-500 focus:ring-rose-400 bg-zinc-900"
                />
                <span>دستور noindex (عدم ثبت این صفحه در گوگل)</span>
              </label>

              <button
                type="button"
                onClick={handleAddPageRule}
                className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs transition-all shadow-md"
              >
                ثبت سئوی صفحه
              </button>
            </div>
          </div>

          {/* List of Page Rules */}
          <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/40">
            <table className="w-full text-right text-sm text-zinc-300">
              <thead className="bg-zinc-900/90 text-xs text-zinc-400 border-b border-zinc-800">
                <tr>
                  <th className="px-6 py-3.5 font-semibold">مسیر صفحه</th>
                  <th className="px-6 py-3.5 font-semibold">عنوان سئو</th>
                  <th className="px-6 py-3.5 font-semibold">توضیحات متا</th>
                  <th className="px-6 py-3.5 font-semibold text-center">وضعیت Index</th>
                  <th className="px-6 py-3.5 font-semibold text-center">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-xs">
                {(seoSettings.pageRules || []).map(rule => (
                  <tr key={rule.id} className="hover:bg-zinc-800/30">
                    <td className="px-6 py-3 font-mono text-emerald-400">{rule.pagePath}</td>
                    <td className="px-6 py-3 font-medium text-white">{rule.metaTitle}</td>
                    <td className="px-6 py-3 text-zinc-400 max-w-xs truncate">{rule.metaDescription || '-'}</td>
                    <td className="px-6 py-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${rule.noIndex ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                        {rule.noIndex ? 'noindex' : 'index, follow'}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-center">
                      <button
                        onClick={() => handleDeletePageRule(rule.id)}
                        className="p-1 rounded text-zinc-400 hover:text-rose-400"
                        title="حذف"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 5: REDIRECTS (301 / 302) */}
      {activeSubTab === 'redirects' && seoSettings && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <Link2 className="w-4 h-4 text-emerald-400" />
              افزودن ریدایرکت جدید (301 Permanent / 302 Temporary)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">آدرس مبدأ (Source Path) *</label>
                <input
                  type="text"
                  placeholder="/old-page-url"
                  value={newRedirect.sourcePath}
                  onChange={e => setNewRedirect({ ...newRedirect, sourcePath: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-sm text-zinc-200 font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">آدرس مقصد (Target Path) *</label>
                <input
                  type="text"
                  placeholder="/new-page-url"
                  value={newRedirect.targetPath}
                  onChange={e => setNewRedirect({ ...newRedirect, targetPath: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-sm text-zinc-200 font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">نوع ریدایرکت</label>
                <select
                  value={newRedirect.type}
                  onChange={e => setNewRedirect({ ...newRedirect, type: parseInt(e.target.value, 10) as 301 | 302 })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500 font-mono"
                >
                  <option value={301}>301 Permanent (انتقال دائمی - سئو پسند)</option>
                  <option value={302}>302 Temporary (انتقال موقت)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleAddRedirect}
                className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs transition-all shadow-md"
              >
                افزودن به ریدایرکت‌ها
              </button>
            </div>
          </div>

          {/* Redirects Table */}
          <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/40">
            <table className="w-full text-right text-sm text-zinc-300">
              <thead className="bg-zinc-900/90 text-xs text-zinc-400 border-b border-zinc-800">
                <tr>
                  <th className="px-6 py-3.5 font-semibold">آدرس مبدأ</th>
                  <th className="px-6 py-3.5 font-semibold">آدرس مقصد</th>
                  <th className="px-6 py-3.5 font-semibold text-center">کد وضعیت</th>
                  <th className="px-6 py-3.5 font-semibold text-center">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-xs">
                {(seoSettings.redirects || []).length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-zinc-500">
                      هیچ ریدایرکتی تعریف نشده است.
                    </td>
                  </tr>
                ) : (
                  (seoSettings.redirects || []).map(red => (
                    <tr key={red.id} className="hover:bg-zinc-800/30">
                      <td className="px-6 py-3 font-mono text-rose-400">{red.sourcePath}</td>
                      <td className="px-6 py-3 font-mono text-emerald-400">{red.targetPath}</td>
                      <td className="px-6 py-3 text-center">
                        <span className="px-2 py-0.5 rounded bg-zinc-800 text-amber-400 font-mono font-bold">
                          {red.type}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-center">
                        <button
                          onClick={() => handleDeleteRedirect(red.id)}
                          className="p-1 rounded text-zinc-400 hover:text-rose-400"
                          title="حذف"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

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
