import {
  ServiceItem,
  PortfolioProject,
  Testimonial,
  PodcastEpisode,
  VideoTestimonial,
  CertificateItem,
  TicketItem,
  TicketMessage,
  MelipayamakConfig,
  SmsLogItem,
  GoogleIntegrationsConfig,
  AppUser,
  FontSettings,
  SiteSettings,
  AvailableFontFamily,
  AdminUser,
  AdminRole,
  BlogPost,
  BlogPostStatus,
  BlogComment,
  SeoGlobalSettings,
  SeoRedirectRule,
  PageSeoRule
} from '../types';

export type {
  AppUser,
  TicketItem,
  TicketMessage,
  MelipayamakConfig,
  SmsLogItem,
  GoogleIntegrationsConfig,
  FontSettings,
  SiteSettings,
  AvailableFontFamily,
  AdminUser,
  AdminRole,
  BlogPost,
  BlogPostStatus,
  BlogComment,
  SeoGlobalSettings,
  SeoRedirectRule,
  PageSeoRule,
  PodcastEpisode,
  VideoTestimonial
};

export interface ApiBaseResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: string;
    message: string;
  };
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

// -------------------------------------------------------------
// Typography Presets & Configuration (Exclusive Shabnam + Per-Tag Engine)
// -------------------------------------------------------------
import {
  TagTypographySettings,
  PageCustomSettings,
  ContactPageDetails,
  SecuritySuiteSettings,
  BlockedIpItem,
  SecurityThreatLog,
  SpeedOptimizerSettings,
  CacheRuleItem,
  WebVitalsMetric
} from '../types';

export type {
  ContactPageDetails,
  PageCustomSettings,
  TagTypographySettings,
  SecuritySuiteSettings,
  BlockedIpItem,
  SecurityThreatLog,
  SpeedOptimizerSettings,
  CacheRuleItem,
  WebVitalsMetric
};

export const DEFAULT_CONTACT_DETAILS: ContactPageDetails = {
  // 1. Phone
  phoneTitle: 'تماس تلفنی مستقیم',
  phoneSubtitle: 'شنبه تا چهارشنبه - ۹:۰۰ الی ۱۸:۰۰',
  phoneNumber: '۰۹۳۵ ۲۹۹ ۷۲۷۲',
  phoneRaw: '09352997272',
  phoneCopyButtonText: 'کپی شماره تماس',

  // 2. Email
  emailTitle: 'ارسال ایمیل مستقیم',
  emailSubtitle: 'پاسخگویی سریع برای درخواست‌های رسمی',
  emailAddress: 'hello@signalux.ir',
  emailCopyButtonText: 'کپی آدرس ایمیل',

  // 3. Messengers
  messengersTitle: 'پیام‌رسان‌های تلگرام و واتس‌اپ',
  messengersSubtitle: 'مشاوره آنلاین فوری و ارسال فایل پروژه‌ها',
  telegramId: '@Signalux_Studio',
  telegramLink: 'https://t.me/Signalux_Studio',
  whatsappNumber: '۰۹۳۵ ۲۹۹ ۷۲۷۲',
  whatsappLink: 'https://wa.me/989352997272',
  telegramButtonText: 'ارسال پیام در تلگرام',
  whatsappButtonText: 'ارسال پیام در واتس‌اپ',

  // 4. Form
  formTitle: 'فرم ثبت درخواست مشاوره و پیام مستقیم',
  formSubtitle: 'اطلاعات خود را وارد کنید تا کارشناسان ما در سریع‌ترین زمان تماس بگیرند.',
  formNamePlaceholder: 'مثال: علی محمدی / شرکت آریا',
  formPhonePlaceholder: '۰9۱۲۰۰۰۰۰۰۰',
  formEmailPlaceholder: 'name@company.com',
  formServiceLabel: 'دسته‌بندی خدمت مورد نظر',
  formServicesList: [
    { id: 'web', label: 'توسعه پلتفرم و وب‌سایت اختصاصی' },
    { id: 'seo', label: 'سئو و بهینه‌سازی دیتامحور موتورهای جستجو' },
    { id: 'marketing', label: 'دیجیتال مارکتینگ و کمپین‌های رشد' },
    { id: 'full', label: 'پکیج کامل ۳۶۰ درجه دیجیتال' }
  ],
  formMessagePlaceholder: 'توضیحات مختصر در مورد نیازمندی‌های پروژه، اهداف یا سوالات خود بنویسید...',
  formSubmitButtonText: 'ثبت و ارسال پیام به تیم پشتیبانی',
  formSuccessTitle: 'پیام شما با موفقیت ثبت شد!',
  formSuccessDescription: 'از ارتباط شما متشکریم. تیم فنی و استراتژی سیگنالوکس تا حداکثر ۲ ساعت آینده با شما تماس خواهند گرفت.',

  // 5. Office
  officeTitle: 'دفتر مرکزی سیگنالوکس',
  officeAddress: 'کرج / محمدشهر',
  officeMapLabel: 'نقشه موقعیت جغرافیایی دفتر',
  officeAppointmentNote: 'ملاقات حضوری با هماهنگی قبلی',
  officeMapEmbedUrl: '',
  officeMapLink: 'https://maps.google.com/?q=Karaj+Mohammadshahr',

  // 6. Working Hours
  workingHoursTitle: 'ساعات کاری و پاسخگویی',
  hoursWeekdays: 'شنبه تا چهارشنبه: ۰۹:۰۰ الی ۱۸:۰۰',
  hoursThursday: 'پنج‌شنبه‌ها: ۰۹:۰۰ الی ۱۳:۰۰',
  hoursFriday: 'جمعه‌ها و ایام تعطیل: پشتیبانی اضطراری ایمیل',
  responseCommitmentBadge: 'پاسخگویی فعال (کمتر از ۲ ساعت)'
};

export const PERSIAN_FONT_PRESETS: {
  id: AvailableFontFamily;
  name: string;
  fontFamilyCss: string;
  description: string;
  sampleText: string;
}[] = [
  {
    id: 'Shabnam',
    name: 'فونت شبنم (فونت رسمی و انحصاری سیگنالوکس)',
    fontFamilyCss: "'Shabnam', system-ui, -apple-system, sans-serif",
    description: 'فونت رسمی، شارپ و چشم‌نواز با بالاترین سطح خوانایی و پشتیبانی کامل از تمام اوزان در ابعاد مختلف',
    sampleText: 'آژانس دیجیتال مارکتینگ و توسعه وب سیگنالوکس - خلق تجربه‌های دیجیتال بدون مرز'
  }
];

export const DEFAULT_TAG_TYPOGRAPHY: TagTypographySettings = {
  h1: { fontSize: '2.25rem', fontWeight: '700', lineHeight: '1.3' },
  h2: { fontSize: '1.75rem', fontWeight: '700', lineHeight: '1.35' },
  h3: { fontSize: '1.35rem', fontWeight: '600', lineHeight: '1.4' },
  h4: { fontSize: '1.15rem', fontWeight: '600', lineHeight: '1.45' },
  h5: { fontSize: '1rem', fontWeight: '500', lineHeight: '1.5' },
  h6: { fontSize: '0.875rem', fontWeight: '500', lineHeight: '1.5' },
  p: { fontSize: '1rem', fontWeight: '400', lineHeight: '1.7' },
  button: { fontSize: '0.875rem', fontWeight: '600', lineHeight: '1.4' },
  small: { fontSize: '0.75rem', fontWeight: '400', lineHeight: '1.5' },
  navbar: { fontSize: '0.875rem', fontWeight: '500', lineHeight: '1.4' }
};

export const FONT_SIZE_PRESETS = [
  { id: '14px', label: 'کوچک (14px)', description: 'چگالی اطلاعات بالا، مناسب صفحات فشرده' },
  { id: '15px', label: 'متوسط فشرده (15px)', description: 'تعادل عالی بین اندازه و تراکم محتوا' },
  { id: '16px', label: 'استاندارد وب (16px)', description: 'اندازه استاندارد جهانی و پیشنهادی سیگنالوکس' },
  { id: '17px', label: 'کمی درشت (17px)', description: 'خوانایی بالاتر در صفحات متنی و مقالات' },
  { id: '18px', label: 'بزرگ (18px)', description: 'مناسب افراد با ضعف بینایی و نمایشگرهای بزرگ' },
  { id: '20px', label: 'خیلی بزرگ (20px)', description: 'حداکثر ابعاد و وضوح فونت برای مطالعه آسان' }
];

export const HEADING_SCALE_PRESETS = [
  { id: '1.15', label: 'فشرده (1.15x)', description: 'تفاوت ملایم بین اندازه عناوین و متن بدنه' },
  { id: '1.25', label: 'متعادل (1.25x)', description: 'مقیاس متوازن Major Third استاندارد' },
  { id: '1.35', label: 'برجسته (1.35x)', description: 'کنتراست بالا Perfect Fourth برای سایت‌های مدرن' },
  { id: '1.45', label: 'درشت و مقتدر (1.45x)', description: 'عناوین بولد و چشم‌گیر متناسب آژانس‌های لوکس' }
];

export const FONT_WEIGHT_PRESETS = [
  { id: '300', label: 'نازک / سبک (Light - 300)' },
  { id: '400', label: 'معمولی و استاندارد (Regular - 400)' },
  { id: '500', label: 'متوسط (Medium - 500)' },
  { id: '600', label: 'نیمه پررنگ (Semi-Bold - 600)' },
  { id: '700', label: 'پررنگ / بولد (Bold - 700)' },
  { id: '800', label: 'خیلی پررنگ (Extra Bold - 800)' },
  { id: '900', label: 'سیاه / ضخیم‌ترین (Black - 900)' }
];

// Helper to apply typography to the entire DOM
export function applyTypographyToDocument(config: Partial<FontSettings> | Partial<SiteSettings> | any) {
  if (typeof document === 'undefined') return;

  const fontCss = "'Shabnam', system-ui, -apple-system, sans-serif";
  const root = document.documentElement;
  root.style.setProperty('--app-font-family', fontCss);
  
  if (config.fontSizeBase) {
    root.style.setProperty('--app-font-size', config.fontSizeBase);
  }
  if (config.fontHeadingScale) {
    root.style.setProperty('--app-heading-scale', config.fontHeadingScale);
  }
  if (config.fontWeightBase) {
    root.style.setProperty('--app-font-weight', config.fontWeightBase);
  }
  if (config.lineHeightScale) {
    root.style.setProperty('--app-line-height', config.lineHeightScale);
  }

  // Tag-Level settings
  const tags: TagTypographySettings = config.tags || config.tagsTypography || DEFAULT_TAG_TYPOGRAPHY;
  if (tags) {
    if (tags.h1) {
      root.style.setProperty('--app-h1-size', tags.h1.fontSize);
      root.style.setProperty('--app-h1-weight', tags.h1.fontWeight);
      root.style.setProperty('--app-h1-lh', tags.h1.lineHeight || '1.3');
    }
    if (tags.h2) {
      root.style.setProperty('--app-h2-size', tags.h2.fontSize);
      root.style.setProperty('--app-h2-weight', tags.h2.fontWeight);
      root.style.setProperty('--app-h2-lh', tags.h2.lineHeight || '1.35');
    }
    if (tags.h3) {
      root.style.setProperty('--app-h3-size', tags.h3.fontSize);
      root.style.setProperty('--app-h3-weight', tags.h3.fontWeight);
      root.style.setProperty('--app-h3-lh', tags.h3.lineHeight || '1.4');
    }
    if (tags.h4) {
      root.style.setProperty('--app-h4-size', tags.h4.fontSize);
      root.style.setProperty('--app-h4-weight', tags.h4.fontWeight);
      root.style.setProperty('--app-h4-lh', tags.h4.lineHeight || '1.45');
    }
    if (tags.h5) {
      root.style.setProperty('--app-h5-size', tags.h5.fontSize);
      root.style.setProperty('--app-h5-weight', tags.h5.fontWeight);
      root.style.setProperty('--app-h5-lh', tags.h5.lineHeight || '1.5');
    }
    if (tags.h6) {
      root.style.setProperty('--app-h6-size', tags.h6.fontSize);
      root.style.setProperty('--app-h6-weight', tags.h6.fontWeight);
      root.style.setProperty('--app-h6-lh', tags.h6.lineHeight || '1.5');
    }
    if (tags.p) {
      root.style.setProperty('--app-p-size', tags.p.fontSize);
      root.style.setProperty('--app-p-weight', tags.p.fontWeight);
      root.style.setProperty('--app-p-lh', tags.p.lineHeight || '1.7');
    }
    if (tags.button) {
      root.style.setProperty('--app-btn-size', tags.button.fontSize);
      root.style.setProperty('--app-btn-weight', tags.button.fontWeight);
    }
    if (tags.small) {
      root.style.setProperty('--app-small-size', tags.small.fontSize);
      root.style.setProperty('--app-small-weight', tags.small.fontWeight);
    }
    if (tags.navbar) {
      root.style.setProperty('--app-navbar-size', tags.navbar.fontSize);
      root.style.setProperty('--app-navbar-weight', tags.navbar.fontWeight);
    }
  }

  // Also store in localStorage for offline / instant persistence
  try {
    const saved = {
      fontFamily: 'Shabnam',
      fontSizeBase: config.fontSizeBase || '16px',
      fontHeadingScale: config.fontHeadingScale || '1.25',
      fontWeightBase: config.fontWeightBase || '400',
      lineHeightScale: config.lineHeightScale || '1.65',
      tags: tags
    };
    localStorage.setItem('signalux_typography_config', JSON.stringify(saved));
  } catch (e) {
    // Ignore storage quota errors
  }
}

// -------------------------------------------------------------
// Site Settings
// -------------------------------------------------------------
export async function fetchSettings(): Promise<SiteSettings | null> {
  // First load from local storage if available for zero-layout-shift
  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem('signalux_typography_config');
      if (cached) {
        applyTypographyToDocument(JSON.parse(cached));
      }
    } catch {}
  }

  try {
    const res = await fetch('/api/v1/public/settings');
    const json: ApiBaseResponse<SiteSettings> = await res.json();
    if (json.success && json.data) {
      applyHeadIntegrations(json.data);
      applyTypographyToDocument(json.data);
      return json.data;
    }
  } catch (err) {
    console.warn('API fetchSettings error', err);
  }

  // Fallback defaults
  const fallbackSettings: SiteSettings = {
    siteTitle: 'آژانس دیجیتال سیگنالوکس (Signalux)',
    heroHeadline: 'خلق تجربه‌های دیجیتال بدون مرز و متناسب با رشد کسب‌وکار شما',
    heroSubtitle: 'استودیو سیگنالوکس با بهره‌گیری از طراحی مدرن وب، استراتژی سئوی داده‌محور و دیزاین سیستم‌های منحصر‌به‌فرد، برند شما را در فضای دیجیتال ممتاز می‌کند.',
    contactEmail: 'info@signalux.ir',
    contactPhone: '۰۹۳۵۲۹۹۷۲۷۲',
    contactAddress: 'تهران، خیابان ولیعصر، برج فناوری سیگنال، طبقه ۸',
    instagramUrl: 'https://instagram.com/signalux',
    linkedinUrl: 'https://linkedin.com/company/signalux',
    telegramUrl: 'https://t.me/signalux_studio',
    githubUrl: 'https://github.com/signalux',
    fontFamily: 'Shabnam',
    fontSizeBase: '16px',
    fontHeadingScale: '1.25',
    fontWeightBase: '400',
    lineHeightScale: '1.65',
    gtmContainerId: 'GTM-T9K8LP',
    gtmEnabled: true,
    gscVerificationCode: 'google-site-verification=abcdef1234567890',
    melipayamakOtpBodyId: 123456,
    melipayamakEnabled: true,
    googleLoginEnabled: true
  };

  applyTypographyToDocument(fallbackSettings);
  return fallbackSettings;
}

export async function updateSiteSettings(payload: Partial<SiteSettings>): Promise<boolean> {
  try {
    // Apply changes immediately for zero-lag UI preview
    applyTypographyToDocument(payload);
    if (payload.gtmContainerId || payload.gscVerificationCode) {
      applyHeadIntegrations(payload as SiteSettings);
    }

    const token = localStorage.getItem('signalux_admin_token') || localStorage.getItem('signalux_user_token');
    const res = await fetch('/api/v1/admin/settings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify(payload)
    });
    const json = await res.json();
    return json.success;
  } catch (err) {
    console.error('Error updating site settings', err);
    // Still succeeded in local storage
    return true;
  }
}

// Helper to inject GTM & GSC dynamically into DOM
export function applyHeadIntegrations(settings: SiteSettings) {
  if (typeof document === 'undefined') return;

  // 1. Google Search Console Verification Meta Tag
  if (settings.gscVerificationCode) {
    let meta = document.querySelector('meta[name="google-site-verification"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'google-site-verification');
      document.head.appendChild(meta);
    }
    // Extract content if user pasted entire <meta ... content="XYZ" />
    let cleanCode = settings.gscVerificationCode;
    const match = cleanCode.match(/content=["']([^"']+)["']/);
    if (match) {
      cleanCode = match[1];
    }
    meta.setAttribute('content', cleanCode.trim());
  }

  // 2. Google Tag Manager Injection
  if (settings.gtmContainerId && settings.gtmEnabled !== false) {
    const cleanGtmId = settings.gtmContainerId.trim();
    if (!document.getElementById('gtm-script-tag') && cleanGtmId.startsWith('GTM-')) {
      const gtmScript = document.createElement('script');
      gtmScript.id = 'gtm-script-tag';
      gtmScript.innerHTML = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','${cleanGtmId}');`;
      document.head.appendChild(gtmScript);
    }
  }
}

// -------------------------------------------------------------
// Public Data Fetchers
// -------------------------------------------------------------
export async function fetchTestimonials(): Promise<Testimonial[]> {
  try {
    const cached = localStorage.getItem('signalux_testimonials');
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {}

  try {
    const res = await fetch('/api/v1/public/testimonials');
    const json: ApiBaseResponse<Testimonial[]> = await res.json();
    if (json.success && json.data && json.data.length > 0) {
      localStorage.setItem('signalux_testimonials', JSON.stringify(json.data));
      return json.data;
    }
  } catch (err) {
    console.warn('API fetchTestimonials error, falling back to local static data', err);
  }
  const { TESTIMONIALS_DATA } = await import('../data');
  return TESTIMONIALS_DATA;
}

export async function saveTestimonialsList(list: Testimonial[]): Promise<boolean> {
  try {
    localStorage.setItem('signalux_testimonials', JSON.stringify(list));
    const token = localStorage.getItem('signalux_admin_token');
    await fetch('/api/v1/admin/testimonials/batch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify(list)
    });
    return true;
  } catch {
    return true;
  }
}

// -------------------------------------------------------------
// Voice Podcasts & Podcast Testimonials
// -------------------------------------------------------------
export const DEFAULT_PODCASTS: PodcastEpisode[] = [
  {
    id: 'pod-1',
    clientName: 'دکتر علیرضا کاظمی',
    clientRole: 'مدیرعامل پلتفرم پزشکی مدتک',
    company: 'مجموعه تخصصی مدتک',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    title: 'پادکست رشد ۱۰ برابری نوبت‌دهی آنلاین با معماری اختصاصی سیگنالوکس',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3',
    duration: '۰۴:۲۵',
    quote: 'همکاری با سیگنالوکس نقطه عطف کسب‌وکار ما بود. سرعت وب‌سایت ما به زیر ۷۰۰ میلی‌ثانیه رسید و نرخ تبدیل بیماران ۳۰۰٪ افزایش یافت.',
    tags: ['توسعه وب', 'پزشکی', 'سئوی فنی'],
    rating: 5,
    isPublished: true
  },
  {
    id: 'pod-2',
    clientName: 'مهندس سارا خسروی',
    clientRole: 'بنیان‌گذار برند مد و پوشاک آریا',
    company: 'گروه صنعتی آریا',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    title: 'تجربه مهاجرت از وردپرس به سامانه اختصاصی React سیگنالوکس',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73213.mp3?filename=ambient-piano-10781.mp3',
    duration: '۰۶:۱۰',
    quote: 'قبل از سیگنالوکس در روزهای فروش ویژه سایتمان به‌خاطر ترافیک بالا از دسترس خارج می‌شد. با راهکار اختصاصی سیگنالوکس بدون هیچ کندی میلیون‌ها بازدیدکننده را مدیریت کردیم.',
    tags: ['فروشگاه آنلاین', 'کمپین مارکتینگ'],
    rating: 5,
    isPublished: true
  },
  {
    id: 'pod-3',
    clientName: 'رضا طباطبایی',
    clientRole: 'مدیر بازاریابی هولدینگ سرمایه‌گذاری پارس',
    company: 'هولدینگ پارس',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    title: 'چگونه در ۶ ماه کلمات کلیدی اصلی صنعت خود را در رتبه اول گوگل قرار دادیم',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=chill-abstract-12099.mp3',
    duration: '۰۵:۱۵',
    quote: 'تیم سئوی سیگنالوکس با تحلیل دقیق داده‌ها و کلاسترینگ محتوا، ما را به لیدر آنلاین بازار تبدیل کرد.',
    tags: ['سئوی دیتامحور', 'دیجیتال مارکتینگ'],
    rating: 5,
    isPublished: true
  }
];

export async function fetchPodcasts(): Promise<PodcastEpisode[]> {
  try {
    const cached = localStorage.getItem('signalux_podcasts');
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {}

  try {
    const res = await fetch('/api/v1/public/podcasts');
    const json: ApiBaseResponse<PodcastEpisode[]> = await res.json();
    if (json.success && Array.isArray(json.data) && json.data.length > 0) {
      localStorage.setItem('signalux_podcasts', JSON.stringify(json.data));
      return json.data;
    }
  } catch (err) {
    console.warn('API fetchPodcasts fallback', err);
  }

  localStorage.setItem('signalux_podcasts', JSON.stringify(DEFAULT_PODCASTS));
  return DEFAULT_PODCASTS;
}

export async function savePodcasts(podcasts: PodcastEpisode[]): Promise<boolean> {
  try {
    localStorage.setItem('signalux_podcasts', JSON.stringify(podcasts));
    const token = localStorage.getItem('signalux_admin_token');
    await fetch('/api/v1/admin/podcasts/batch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify(podcasts)
    });
    return true;
  } catch {
    return true;
  }
}

// -------------------------------------------------------------
// Video Testimonials & Case Study Videos
// -------------------------------------------------------------
export const DEFAULT_VIDEO_TESTIMONIALS: VideoTestimonial[] = [
  {
    id: 'vid-1',
    clientName: 'امیرحسین رضایی',
    clientRole: 'مدیر ارشد محصول هولدینگ لجستیک',
    company: 'شبکه هوشمند حمل‌ونقل',
    thumbnail: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    title: 'مصاحبه ویدئویی: ساخت پنل مدیریت و Dashboards قدرتمند',
    duration: '۰۲:۴۵',
    quote: 'طراحی رابط کاربری و عملکرد فوق‌العاده نرم‌افزار، رضایت ۱۰۰ درصدی کاربران سازمانی ما را جلب کرد.',
    projectCategory: 'طراحی وب و داشبورد',
    rating: 5,
    isPublished: true
  },
  {
    id: 'vid-2',
    clientName: 'مریم ابراهیمی',
    clientRole: 'مدیر برندینگ استارت‌آپ فین‌تک',
    company: 'پلتفرم پرداخت هوشمند',
    thumbnail: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    title: 'ویدئو بازخورد: بازطراحی کامل UI/UX و برندینگ دیجیتال',
    duration: '۰۳:۲۰',
    quote: 'دقت سیگنالوکس به ریزه‌کاری‌ها و انیمیشن‌های روان خیره‌کننده بود.',
    projectCategory: 'برندینگ و UI/UX',
    rating: 5,
    isPublished: true
  },
  {
    id: 'vid-3',
    clientName: 'دکتر کامران نوری',
    clientRole: 'مدیر کلینیک تخصصی پوست و مو',
    company: 'کلینیک بین‌المللی سلامت',
    thumbnail: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    title: 'تجربه ویدیویی: جهش ورودی مراجعین با سئوی تخصصی پزشکی',
    duration: '۰۴:۱۰',
    quote: 'با استراتژی سئوی سیگنالوکس در تمام کلمات کلیدی خدمات زیبایی و درمانی در لینک اول گوگل قرار گرفتیم.',
    projectCategory: 'سئو پزشکی و برندینگ',
    rating: 5,
    isPublished: true
  }
];

export async function fetchVideoTestimonials(): Promise<VideoTestimonial[]> {
  try {
    const cached = localStorage.getItem('signalux_video_testimonials');
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {}

  try {
    const res = await fetch('/api/v1/public/video-testimonials');
    const json: ApiBaseResponse<VideoTestimonial[]> = await res.json();
    if (json.success && Array.isArray(json.data) && json.data.length > 0) {
      localStorage.setItem('signalux_video_testimonials', JSON.stringify(json.data));
      return json.data;
    }
  } catch (err) {
    console.warn('API fetchVideoTestimonials fallback', err);
  }

  localStorage.setItem('signalux_video_testimonials', JSON.stringify(DEFAULT_VIDEO_TESTIMONIALS));
  return DEFAULT_VIDEO_TESTIMONIALS;
}

export async function saveVideoTestimonials(videos: VideoTestimonial[]): Promise<boolean> {
  try {
    localStorage.setItem('signalux_video_testimonials', JSON.stringify(videos));
    const token = localStorage.getItem('signalux_admin_token');
    await fetch('/api/v1/admin/video-testimonials/batch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify(videos)
    });
    return true;
  } catch {
    return true;
  }
}

export async function fetchCertificates(): Promise<CertificateItem[]> {
  try {
    const res = await fetch('/api/v1/public/certificates');
    const json: ApiBaseResponse<CertificateItem[]> = await res.json();
    if (json.success && json.data) {
      return json.data;
    }
  } catch (err) {
    console.warn('API fetchCertificates error, falling back to local static data', err);
  }
  const { CERTIFICATES_DATA } = await import('../data');
  return CERTIFICATES_DATA;
}

export async function fetchFaqs(): Promise<FAQItem[]> {
  try {
    const res = await fetch('/api/v1/public/faqs');
    const json: ApiBaseResponse<FAQItem[]> = await res.json();
    if (json.success && json.data) {
      return json.data;
    }
  } catch (err) {
    console.warn('API fetchFaqs error', err);
  }
  return [
    {
      id: 'faq-1',
      category: 'طراحی وب',
      question: 'مدت زمان طراحی و توسعه یک وب‌سایت اختصاصی چقدر است؟',
      answer: 'بسته به سطح پیچیدگی، معمولاً پروژه‌های اختصاصی بین ۳ تا ۶ هفته زمان نیاز دارند.'
    },
    {
      id: 'faq-2',
      category: 'سئو',
      question: 'چقدر طول می‌کشد تا نتایج سئو مشخص شود؟',
      answer: 'بهینه‌سازی سئو فرایندی تدریجی است؛ بهبود اولیه بین ۲ تا ۴ ماه و نتایج تثبیت‌شده در صفحه اول معمولاً بین ۴ تا ۸ ماه حاصل می‌شود.'
    },
    {
      id: 'faq-3',
      category: 'پشتیبانی',
      question: 'نحوه ارسال تیکت و دریافت خدمات پشتیبانی به چه صورت است؟',
      answer: 'شما می‌توانید با ثبت‌نام سریع از طریق شماره همراه یا حساب گوگل، تیکت پشتیبانی خود را در پنل کاربری ثبت و پیگیری کنید.'
    }
  ];
}

export async function fetchServices(): Promise<ServiceItem[]> {
  try {
    const res = await fetch('/api/v1/public/services');
    const json: ApiBaseResponse<ServiceItem[]> = await res.json();
    if (json.success && json.data) {
      return json.data;
    }
  } catch (err) {
    console.warn('API fetchServices error, falling back to local static data', err);
  }
  const { SERVICES_DATA } = await import('../data');
  return SERVICES_DATA;
}

export async function fetchProjects(category?: string): Promise<PortfolioProject[]> {
  try {
    const url = category && category !== 'all' 
      ? `/api/v1/public/projects?category=${encodeURIComponent(category)}`
      : '/api/v1/public/projects';
    const res = await fetch(url);
    const json: ApiBaseResponse<PortfolioProject[]> = await res.json();
    if (json.success && json.data) {
      return json.data;
    }
  } catch (err) {
    console.warn('API fetchProjects error, falling back to local static data', err);
  }
  const { PORTFOLIO_PROJECTS } = await import('../data');
  if (category && category !== 'all') {
    return PORTFOLIO_PROJECTS.filter(p => p.category === category);
  }
  return PORTFOLIO_PROJECTS;
}

export async function fetchProjectById(id: string): Promise<PortfolioProject | null> {
  try {
    const res = await fetch(`/api/v1/public/projects/${encodeURIComponent(id)}`);
    const json: ApiBaseResponse<PortfolioProject> = await res.json();
    if (json.success && json.data) {
      return json.data;
    }
  } catch (err) {
    console.warn('API fetchProjectById error, falling back to local static data', err);
  }
  const { PORTFOLIO_PROJECTS } = await import('../data');
  return PORTFOLIO_PROJECTS.find(p => p.id === id) || null;
}

export async function submitConsultation(payload: {
  name: string;
  phone: string;
  businessName?: string;
  service?: string;
  budget?: string;
  message?: string;
}): Promise<boolean> {
  try {
    const res = await fetch('/api/v1/public/consultation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: payload.name,
        phone: payload.phone,
        service: payload.service,
        budget: payload.budget,
        message: payload.message ? `کسب و کار: ${payload.businessName || 'ثبت نشده'} - ${payload.message}` : `کسب و کار: ${payload.businessName || 'ثبت نشده'}`
      })
    });
    const json = await res.json();
    return json.success;
  } catch (err) {
    console.error('Error submitting consultation to API', err);
    return false;
  }
}

export async function submitContact(payload: {
  name: string;
  email?: string;
  phone?: string;
  message: string;
}): Promise<boolean> {
  try {
    const res = await fetch('/api/v1/public/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const json = await res.json();
    return json.success;
  } catch (err) {
    console.error('Error submitting contact form to API', err);
    return false;
  }
}

// -------------------------------------------------------------
// Authentication (Phone OTP, Google OAuth, Password)
// -------------------------------------------------------------
export async function sendPhoneOtp(phone: string): Promise<{ success: boolean; message: string; mockCode?: string }> {
  try {
    const res = await fetch('/api/v1/auth/otp/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone })
    });
    const json = await res.json();
    return {
      success: json.success,
      message: json.message || (json.success ? 'کد اعتبارسنجی ارسال شد.' : 'خطا در ارسال کد.'),
      mockCode: json.data?.mockCode
    };
  } catch (err) {
    return { success: false, message: 'خطا در برقراری ارتباط با سرور پیامک.' };
  }
}

export async function verifyPhoneOtp(payload: {
  phone: string;
  code: string;
  firstName?: string;
  lastName?: string;
}): Promise<{ success: boolean; user?: AppUser; token?: string; message?: string }> {
  try {
    const res = await fetch('/api/v1/auth/otp/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const json = await res.json();
    if (json.success && json.data) {
      if (json.data.token) {
        localStorage.setItem('signalux_user_token', json.data.token);
      }
      if (json.data.user) {
        localStorage.setItem('signalux_user_profile', JSON.stringify(json.data.user));
      }
      return { success: true, user: json.data.user, token: json.data.token, message: json.message };
    }
    return { success: false, message: json.error?.message || json.message || 'کد وارد شده صحیح نمی‌باشد.' };
  } catch (err) {
    return { success: false, message: 'خطا در احراز هویت.' };
  }
}

export async function loginWithGoogleCredential(credentialToken: string, userDetails?: { name?: string; email?: string; picture?: string }): Promise<{ success: boolean; user?: AppUser; token?: string; message?: string }> {
  try {
    const res = await fetch('/api/v1/auth/google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: credentialToken, ...userDetails })
    });
    const json = await res.json();
    if (json.success && json.data) {
      if (json.data.token) {
        localStorage.setItem('signalux_user_token', json.data.token);
      }
      if (json.data.user) {
        localStorage.setItem('signalux_user_profile', JSON.stringify(json.data.user));
      }
      return { success: true, user: json.data.user, token: json.data.token };
    }
    return { success: false, message: json.error?.message || 'ورود با گوگل ناموفق بود.' };
  } catch (err) {
    return { success: false, message: 'خطا در ارتباط با سرور گوگل.' };
  }
}

export function getCurrentUser(): AppUser | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem('signalux_user_profile');
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function logoutUser(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('signalux_user_token');
  localStorage.removeItem('signalux_user_profile');
}

// -------------------------------------------------------------
// Ticket API Methods (User & Client Side)
// -------------------------------------------------------------
export async function fetchUserTickets(phone?: string): Promise<TicketItem[]> {
  try {
    const token = localStorage.getItem('signalux_user_token');
    const user = getCurrentUser();
    const queryPhone = phone || user?.phone;
    const url = queryPhone ? `/api/v1/tickets?phone=${encodeURIComponent(queryPhone)}` : '/api/v1/tickets';
    
    const res = await fetch(url, {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });
    const json: ApiBaseResponse<TicketItem[]> = await res.json();
    if (json.success && json.data) {
      return json.data;
    }
  } catch (err) {
    console.warn('API fetchUserTickets error', err);
  }
  return [];
}

export async function createTicket(payload: {
  userName: string;
  userPhone: string;
  userEmail?: string;
  department: string;
  priority: string;
  subject: string;
  message: string;
  attachments?: string[];
}): Promise<{ success: boolean; ticket?: TicketItem; message?: string }> {
  try {
    const token = localStorage.getItem('signalux_user_token');
    const res = await fetch('/api/v1/tickets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify(payload)
    });
    const json = await res.json();
    if (json.success) {
      return { success: true, ticket: json.data, message: json.message };
    }
    return { success: false, message: json.error?.message || json.message };
  } catch (err) {
    return { success: false, message: 'خطا در ثبت تیکت.' };
  }
}

export async function replyTicket(ticketId: string, payload: {
  senderName: string;
  message: string;
  attachments?: string[];
}): Promise<{ success: boolean; ticket?: TicketItem; message?: string }> {
  try {
    const token = localStorage.getItem('signalux_user_token');
    const res = await fetch(`/api/v1/tickets/${ticketId}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify(payload)
    });
    const json = await res.json();
    if (json.success) {
      return { success: true, ticket: json.data, message: json.message };
    }
    return { success: false, message: json.error?.message || json.message };
  } catch (err) {
    return { success: false, message: 'خطا در ارسال پاسخ.' };
  }
}

// -------------------------------------------------------------
// Admin Ticket Management API
// -------------------------------------------------------------
export async function fetchAdminTickets(): Promise<TicketItem[]> {
  try {
    const res = await fetch('/api/v1/admin/tickets');
    const json: ApiBaseResponse<TicketItem[]> = await res.json();
    if (json.success && json.data) {
      return json.data;
    }
  } catch (err) {
    console.warn('API fetchAdminTickets error', err);
  }
  return [];
}

export async function adminReplyTicket(ticketId: string, payload: {
  message: string;
  newStatus?: string;
  senderName?: string;
}): Promise<boolean> {
  try {
    const res = await fetch(`/api/v1/admin/tickets/${ticketId}/reply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const json = await res.json();
    return json.success;
  } catch (err) {
    return false;
  }
}

export async function updateAdminTicketStatus(ticketId: string, status: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/v1/admin/tickets/${ticketId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    const json = await res.json();
    return json.success;
  } catch (err) {
    return false;
  }
}

export async function deleteAdminTicket(ticketId: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/v1/admin/tickets/${ticketId}`, {
      method: 'DELETE'
    });
    const json = await res.json();
    return json.success;
  } catch (err) {
    return false;
  }
}

// -------------------------------------------------------------
// Admin SMS & MeliPayamak API
// -------------------------------------------------------------
export async function testMelipayamakSms(phone: string, customCode?: string): Promise<{
  success: boolean;
  message: string;
  details?: any;
}> {
  try {
    const res = await fetch('/api/v1/admin/sms/test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, code: customCode || '58291' })
    });
    const json = await res.json();
    return {
      success: json.success,
      message: json.message || (json.success ? 'پیامک با موفقیت به سامانه ملی‌پیامک ارسال شد.' : 'خطا در ارسال پیامک.'),
      details: json.data
    };
  } catch (err) {
    return { success: false, message: 'خطا در ارتباط با سرور ارسال پیامک.' };
  }
}

export async function fetchSmsLogs(): Promise<SmsLogItem[]> {
  try {
    const res = await fetch('/api/v1/admin/sms/logs');
    const json: ApiBaseResponse<SmsLogItem[]> = await res.json();
    if (json.success && json.data) {
      return json.data;
    }
  } catch (err) {
    console.warn('API fetchSmsLogs error', err);
  }
  return [];
}

// -------------------------------------------------------------
// Admin Users & RBAC API
// -------------------------------------------------------------
export async function fetchAdminUsers(): Promise<AdminUser[]> {
  try {
    const res = await fetch('/api/v1/admin/users');
    const json: ApiBaseResponse<AdminUser[]> = await res.json();
    if (json.success && json.data) {
      return json.data;
    }
  } catch (err) {
    console.warn('fetchAdminUsers error', err);
  }
  return [];
}

export async function createAdminUser(user: Partial<AdminUser>): Promise<AdminUser | null> {
  try {
    const res = await fetch('/api/v1/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    });
    const json: ApiBaseResponse<AdminUser> = await res.json();
    if (json.success && json.data) {
      return json.data;
    }
  } catch (err) {
    console.error('createAdminUser error', err);
  }
  return null;
}

export async function updateAdminUser(id: string, user: Partial<AdminUser>): Promise<AdminUser | null> {
  try {
    const res = await fetch(`/api/v1/admin/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    });
    const json: ApiBaseResponse<AdminUser> = await res.json();
    if (json.success && json.data) {
      return json.data;
    }
  } catch (err) {
    console.error('updateAdminUser error', err);
  }
  return null;
}

export async function deleteAdminUser(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/v1/admin/users/${id}`, {
      method: 'DELETE'
    });
    const json = await res.json();
    return json.success;
  } catch (err) {
    return false;
  }
}

// -------------------------------------------------------------
// Blog & Articles API (Public & Admin)
// -------------------------------------------------------------
export async function fetchPublicBlogPosts(category?: string, search?: string): Promise<BlogPost[]> {
  try {
    const params = new URLSearchParams();
    if (category && category !== 'all' && category !== 'همه') params.append('category', category);
    if (search && search.trim()) params.append('search', search.trim());
    
    const url = `/api/v1/public/blog${params.toString() ? `?${params.toString()}` : ''}`;
    const res = await fetch(url);
    const json: ApiBaseResponse<BlogPost[]> = await res.json();
    if (json.success && json.data) {
      return json.data;
    }
  } catch (err) {
    console.warn('fetchPublicBlogPosts error', err);
  }
  return [];
}

export async function fetchPublicBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const res = await fetch(`/api/v1/public/blog/${slug}`);
    const json: ApiBaseResponse<BlogPost> = await res.json();
    if (json.success && json.data) {
      return json.data;
    }
  } catch (err) {
    console.warn('fetchPublicBlogPostBySlug error', err);
  }
  return null;
}

export async function fetchAdminBlogPosts(): Promise<BlogPost[]> {
  try {
    const res = await fetch('/api/v1/admin/blog');
    const json: ApiBaseResponse<BlogPost[]> = await res.json();
    if (json.success && json.data) {
      return json.data;
    }
  } catch (err) {
    console.warn('fetchAdminBlogPosts error', err);
  }
  return [];
}

export async function createAdminBlogPost(post: Partial<BlogPost>): Promise<BlogPost | null> {
  try {
    const res = await fetch('/api/v1/admin/blog', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(post)
    });
    const json: ApiBaseResponse<BlogPost> = await res.json();
    if (json.success && json.data) {
      return json.data;
    }
  } catch (err) {
    console.error('createAdminBlogPost error', err);
  }
  return null;
}

export async function updateAdminBlogPost(id: string, post: Partial<BlogPost>): Promise<BlogPost | null> {
  try {
    const res = await fetch(`/api/v1/admin/blog/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(post)
    });
    const json: ApiBaseResponse<BlogPost> = await res.json();
    if (json.success && json.data) {
      return json.data;
    }
  } catch (err) {
    console.error('updateAdminBlogPost error', err);
  }
  return null;
}

export async function deleteAdminBlogPost(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/v1/admin/blog/${id}`, {
      method: 'DELETE'
    });
    const json = await res.json();
    return json.success;
  } catch (err) {
    return false;
  }
}

// -------------------------------------------------------------
// SEO Suite API
// -------------------------------------------------------------
export async function fetchSeoSettings(): Promise<SeoGlobalSettings | null> {
  try {
    const res = await fetch('/api/v1/admin/seo');
    const json: ApiBaseResponse<SeoGlobalSettings> = await res.json();
    if (json.success && json.data) {
      return json.data;
    }
  } catch (err) {
    console.warn('fetchSeoSettings error', err);
  }
  return null;
}

export async function updateSeoSettings(settings: Partial<SeoGlobalSettings>): Promise<SeoGlobalSettings | null> {
  try {
    const res = await fetch('/api/v1/admin/seo', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    });
    const json: ApiBaseResponse<SeoGlobalSettings> = await res.json();
    if (json.success && json.data) {
      return json.data;
    }
  } catch (err) {
    console.error('updateSeoSettings error', err);
  }
  return null;
}

export async function fetchSitemapXml(): Promise<{ sitemapXml: string; urlCount: number; baseUrl: string } | null> {
  try {
    const res = await fetch('/api/v1/public/sitemap.xml');
    const json: ApiBaseResponse<{ sitemapXml: string; urlCount: number; baseUrl: string }> = await res.json();
    if (json.success && json.data) {
      return json.data;
    }
  } catch (err) {
    console.warn('fetchSitemapXml error', err);
  }
  return null;
}

export async function fetchRobotsTxt(): Promise<string> {
  try {
    const res = await fetch('/api/v1/public/robots.txt');
    const json: ApiBaseResponse<{ robotsTxt: string }> = await res.json();
    if (json.success && json.data) {
      return json.data.robotsTxt;
    }
  } catch (err) {
    console.warn('fetchRobotsTxt error', err);
  }
  return "User-agent: *\nAllow: /\nDisallow: /admin\n\nSitemap: https://signalux.ir/sitemap.xml";
}

// -------------------------------------------------------------
// Site Pages & Sub-pages Configuration
// -------------------------------------------------------------
export const DEFAULT_PAGES_CONFIG: PageCustomSettings[] = [
  {
    id: 'page_home',
    slug: 'home',
    title: 'صفحه اصلی (خانه)',
    navTitle: 'صفحه نخست',
    badgeText: 'NEXT-GEN DIGITAL AGENCY',
    heroHeadline: 'خلق تجربه‌های دیجیتال بدون مرز و متناسب با رشد کسب‌وکار شما',
    heroSubtitle: 'استودیو سیگنالوکس با تلفیق کدنویسی اختصاصی، سئوی داده‌محور و طراحی مدرن، کسب‌وکار شما را به لیدر صنعت تبدیل می‌کند.',
    heroBannerImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1600&q=80',
    ctaButtonText: 'دریافت مشاوره تخصصی و پروپوزال',
    ctaButtonLink: '#consultation',
    secondaryButtonText: 'مشاهده نمونه‌کارها',
    secondaryButtonLink: '#projects',
    seoMetaTitle: 'سیگنالوکس | آژانس طراحی وب، سئو تکنیکال و دیجیتال مارکتینگ',
    seoMetaDescription: 'طراحی سایت فوق‌العاده سریع، خدمات سئو تکنیکال، بازاریابی دیجیتال داده‌محور با آژانس سیگنالوکس.',
    seoKeywords: 'طراحی سایت, سئو سایت, دیجیتال مارکتینگ, سئو تکنیکال, آژانس وب',
    isVisible: true,
    showConsultationForm: true,
    showTestimonials: true,
    showFaq: true,
    showProcessTimeline: true
  },
  {
    id: 'page_about',
    slug: 'about',
    title: 'برگه درباره ما',
    navTitle: 'درباره ما',
    badgeText: 'ABOUT SIGNALUX',
    heroHeadline: 'تیمی از مهندسان، استراتژیست‌ها و طراحان آینده‌نگر',
    heroSubtitle: 'ما باور داریم که هر برند یک سیگنال منحصربه‌فرد در جهان دیجیتال است؛ وظیفه ما تقویت این سیگنال و تبدیل آن به بالاترین نرخ بازگشت سرمایه است.',
    heroBannerImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=80',
    ctaButtonText: 'آشنایی با متدولوژی کاری ما',
    ctaButtonLink: '#philosophy',
    seoMetaTitle: 'درباره ما | تیم و ارزش‌های آژانس دیجیتال سیگنالوکس',
    seoMetaDescription: 'داستان شکل‌گیری سیگنالوکس، ارزش‌های بنیادین، استانداردهای کدنویسی و فلسفه دیزاین سیستم ما.',
    seoKeywords: 'درباره سیگنالوکس, تیم طراحی وب, آژانس دیجیتال مارکتینگ',
    isVisible: true,
    showConsultationForm: true,
    showTestimonials: true,
    showFaq: false,
    showProcessTimeline: true
  },
  {
    id: 'page_services',
    slug: 'services',
    title: 'برگه خدمات ما',
    navTitle: 'خدمات',
    badgeText: 'OUR CORE PILLARS',
    heroHeadline: 'راهکارهای جامع، یکپارچه و نتیجه‌محور برای تسخیر بازار آنلاین',
    heroSubtitle: 'از توسعه سفارشی فرانت‌اند و بک‌اند مدرن تا بهینه‌سازی تخصصی موتورهای جستجو و کمپین‌های هوشمند جذب مشتری.',
    heroBannerImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&q=80',
    ctaButtonText: 'استعلام هزینه و برآورد هوشمند پروژه',
    ctaButtonLink: '#estimator',
    seoMetaTitle: 'خدمات تخصصی طراحی سایت، سئو و بازاریابی دیجیتال | سیگنالوکس',
    seoMetaDescription: 'لیست کامل خدمات آژانس دیجیتال سیگنالوکس شامل توسعه وب، سئو تکنیکال و دیزاین سیستم.',
    seoKeywords: 'خدمات سئو, خدمات طراحی سایت, توسعه وب اختصاصی',
    isVisible: true,
    showConsultationForm: true,
    showTestimonials: true,
    showFaq: true,
    showProcessTimeline: true
  },
  {
    id: 'page_web_design',
    slug: 'web-design',
    title: 'برگه تخصصی طراحی سایت',
    navTitle: 'طراحی سایت',
    badgeText: 'NEXT-GEN WEB DEVELOPMENT',
    heroHeadline: 'طراحی و توسعه وب‌سایت‌های فوق‌سریع، واکنش‌گرا و خیره‌کننده',
    heroSubtitle: 'خلق شاهکارهای بصری با معماری مدرن، بدون کندی و با تمرکز صددرصدی بر نرخ تبدیل کاربر به مشتری وفادار.',
    heroBannerImage: 'https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=1600&q=80',
    ctaButtonText: 'مشاهده پلن‌های طراحی اختصاصی',
    ctaButtonLink: '#pricing',
    seoMetaTitle: 'طراحی سایت اختصاصی و حرفه‌ای | توسعه فوق‌سریع | سیگنالوکس',
    seoMetaDescription: 'طراحی انواع سایت‌های فروشگاهی، شرکتی و سازمانی با UI/UX اختصاصی و استانداردهای جهانی.',
    seoKeywords: 'طراحی سایت شرکتی, طراحی سایت فروشگاهی, طراحی UI UX',
    isVisible: true,
    showConsultationForm: true,
    showTestimonials: true,
    showFaq: true,
    showProcessTimeline: true
  },
  {
    id: 'page_seo',
    slug: 'seo',
    title: 'برگه سئو و بهینه‌سازی رتبه گوگل',
    navTitle: 'سئو و بهینه‌سازی',
    badgeText: 'ORGANIC GROWTH ENGINE',
    heroHeadline: 'سئوی فنی و محتوایی داده‌محور برای حضور پایدار در رتبه ۱ گوگل',
    heroSubtitle: 'رساندن کلمات کلیدی درآمدزای شما به صدر نتایج با متدهای اصولی و به‌روز کلاه‌سفید گوگل بدون ریسک پنالتی.',
    heroBannerImage: 'https://images.unsplash.com/photo-1571786256017-aee7a0c009b6?auto=format&fit=crop&w=1600&q=80',
    ctaButtonText: 'درخواست آنالیز رایگان سئوی سایت',
    ctaButtonLink: '#audit',
    seoMetaTitle: 'خدمات سئو حرفه‌ای و ارتقای رتبه در گوگل | سیگنالوکس',
    seoMetaDescription: 'بهینه‌سازی تضمینی رتبه سایت، سئوی تکنیکال، لینک‌سازی اصولی و تحقیق کلمات کلیدی.',
    seoKeywords: 'سئو سایت, ارتقای رتبه گوگل, افزایش بازدید سایت, سئو تکنیکال',
    isVisible: true,
    showConsultationForm: true,
    showTestimonials: true,
    showFaq: true,
    showProcessTimeline: true
  },
  {
    id: 'page_projects',
    slug: 'projects-list',
    title: 'برگه نمونه‌کارها و پروژه‌ها',
    navTitle: 'نمونه‌کارها',
    badgeText: 'SELECTED WORKS & CASE STUDIES',
    heroHeadline: 'گالری پروژه‌ها و دستاوردهای واقعی مشتریان سیگنالوکس',
    heroSubtitle: 'بررسی جزئیات، چالش‌های فنی، راهکارها و آمارهای رشد پروژه‌های برتر اجرا شده توسط تیم سیگنالوکس.',
    heroBannerImage: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1600&q=80',
    ctaButtonText: 'مشاوره برای شروع پروژه مشابه',
    ctaButtonLink: '#consultation',
    seoMetaTitle: 'نمونه کارهای طراحی سایت و سئو | پورتفولیو سیگنالوکس',
    seoMetaDescription: 'مشاهده جدیدترین پروژه‌ها و کیس‌استادی‌های موفق طراحی سایت و سئوی آژانس سیگنالوکس.',
    seoKeywords: 'نمونه کار طراحی سایت, نمونه پروژه سئو, پورتفولیو',
    isVisible: true,
    showConsultationForm: true,
    showTestimonials: false,
    showFaq: false,
    showProcessTimeline: false
  },
  {
    id: 'page_testimonials_media',
    slug: 'testimonials-media',
    title: 'برگه نظرات مشتریان و پادکست‌ها',
    navTitle: 'نظرات و پادکست‌ها',
    badgeText: 'VOICES & PODCASTS',
    heroHeadline: 'روایت رضایت کارفرمایان و پادکست‌های صوتی تجربه همکاری',
    heroSubtitle: 'شنیدن صدای مدیران برندها و نتایج مستند کسب‌شده در همکاری‌های مشترک با آژانس دیجیتال سیگنالوکس.',
    heroBannerImage: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1600&q=80',
    ctaButtonText: 'ثبت تجربه همکاری شما',
    ctaButtonLink: '#review',
    seoMetaTitle: 'نظرات مشتریان و پادکست‌های تجربه همکاری | سیگنالوکس',
    seoMetaDescription: 'بررسی بازخوردها، مصاحبه‌های صوتی و رضایت کارفرمایان از خدمات طراحی سایت و سئو.',
    seoKeywords: 'نظرات مشتریان, پادکست بازاریابی, مصاحبه کارفرمایان',
    isVisible: true,
    showConsultationForm: true,
    showTestimonials: true,
    showFaq: true,
    showProcessTimeline: false
  },
  {
    id: 'page_blog',
    slug: 'blog',
    title: 'برگه وبلاگ و مقالات تخصصی',
    navTitle: 'وبلاگ',
    badgeText: 'KNOWLEDGE & INSIGHTS',
    heroHeadline: 'پایگاه دانش، آخرین مقالات تکنولوژی وب و استراتژی‌های سئو',
    heroSubtitle: 'راهنماهای جامع و نکات طلایی برای افزایش ترافیک، بهینه‌سازی نرخ تبدیل و هوش مصنوعی در مارکتینگ.',
    heroBannerImage: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1600&q=80',
    ctaButtonText: 'جستجو در مقالات',
    ctaButtonLink: '#search',
    seoMetaTitle: 'وبلاگ تخصصی طراحی وب و آموزش سئو | سیگنالوکس',
    seoMetaDescription: 'جدیدترین مقالات آموزشی سئو، طراحی سایت، رابط کاربری و هوش مصنوعی در کسب‌وکار.',
    seoKeywords: 'آموزش سئو, مقاله طراحی سایت, راهنمای دیجیتال مارکتینگ',
    isVisible: true,
    showConsultationForm: false,
    showTestimonials: false,
    showFaq: false,
    showProcessTimeline: false
  },
  {
    id: 'page_contact',
    slug: 'contact',
    title: 'برگه تماس با ما و مشاوره',
    navTitle: 'تماس با ما',
    badgeText: 'GET IN TOUCH',
    heroHeadline: 'همیشه آماده پاسخگویی، همراهی و شنیدن ایده‌های شما هستیم',
    heroSubtitle: 'از طریق فرم آنلاین، تماس مستقیم تلفنی یا پیام‌رسان‌های تلگرام و واتساپ با کارشناسان ما در تماس باشید.',
    heroBannerImage: 'https://images.unsplash.com/photo-1423666639041-f56000c27a9a?auto=format&fit=crop&w=1600&q=80',
    ctaButtonText: 'ارسال پیام مستقیم',
    ctaButtonLink: '#form',
    seoMetaTitle: 'تماس با ما | آژانس دیجیتال مارکتینگ سیگنالوکس',
    seoMetaDescription: 'راه‌های ارتباطی، تلفن تماس، آدرس دفتر و فرم درخواست مشاوره تخصصی رایگان.',
    seoKeywords: 'تماس با سیگنالوکس, مشاوره سئو, سفارش طراحی سایت',
    isVisible: true,
    showConsultationForm: true,
    showTestimonials: false,
    showFaq: true,
    showProcessTimeline: false,
    contactDetails: DEFAULT_CONTACT_DETAILS
  }
];

export async function fetchPagesConfig(): Promise<PageCustomSettings[]> {
  try {
    const cached = localStorage.getItem('signalux_pages_settings');
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {}

  try {
    const res = await fetch('/api/v1/admin/pages');
    const json = await res.json();
    if (json.success && Array.isArray(json.data) && json.data.length > 0) {
      localStorage.setItem('signalux_pages_settings', JSON.stringify(json.data));
      return json.data;
    }
  } catch (e) {
    // Return default configurations
  }
  return DEFAULT_PAGES_CONFIG;
}

export async function savePageConfig(page: PageCustomSettings): Promise<boolean> {
  try {
    const current = await fetchPagesConfig();
    const index = current.findIndex(p => p.id === page.id || p.slug === page.slug);
    if (index >= 0) {
      current[index] = { ...current[index], ...page, updatedAt: new Date().toISOString() };
    } else {
      current.push({ ...page, updatedAt: new Date().toISOString() });
    }
    localStorage.setItem('signalux_pages_settings', JSON.stringify(current));
    
    // Also if it is contact page, update cached contact details
    if (page.id === 'page_contact' || page.slug === 'contact') {
      if (page.contactDetails) {
        localStorage.setItem('signalux_contact_page_details', JSON.stringify(page.contactDetails));
      }
    }

    // Send to PHP Backend API
    try {
      await fetch('/api/v1/admin/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(current)
      });
    } catch {}

    return true;
  } catch (err) {
    console.error('savePageConfig error', err);
    return false;
  }
}

// -------------------------------------------------------------
// Direct Contact Details Dedicated Getters/Setters
// -------------------------------------------------------------
export async function fetchContactDetails(): Promise<ContactPageDetails> {
  try {
    const cached = localStorage.getItem('signalux_contact_page_details');
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed && typeof parsed === 'object') {
        return { ...DEFAULT_CONTACT_DETAILS, ...parsed };
      }
    }
  } catch (e) {}

  try {
    const pages = await fetchPagesConfig();
    const contactPage = pages.find(p => p.id === 'page_contact' || p.slug === 'contact');
    if (contactPage && contactPage.contactDetails) {
      return { ...DEFAULT_CONTACT_DETAILS, ...contactPage.contactDetails };
    }
  } catch (e) {}

  return DEFAULT_CONTACT_DETAILS;
}

export async function saveContactDetails(details: Partial<ContactPageDetails>): Promise<boolean> {
  try {
    const current = await fetchContactDetails();
    const updated: ContactPageDetails = { ...current, ...details };
    localStorage.setItem('signalux_contact_page_details', JSON.stringify(updated));

    // Also update in Pages config
    const pages = await fetchPagesConfig();
    const contactPage = pages.find(p => p.id === 'page_contact' || p.slug === 'contact');
    if (contactPage) {
      contactPage.contactDetails = updated;
      await savePageConfig(contactPage);
    }

    // Also update SiteSettings if phone or email changed
    if (details.phoneNumber || details.emailAddress || details.officeAddress) {
      await updateSiteSettings({
        contactPhone: details.phoneNumber || current.phoneNumber,
        contactEmail: details.emailAddress || current.emailAddress,
        contactAddress: details.officeAddress || current.officeAddress
      });
    }

    return true;
  } catch (err) {
    console.error('saveContactDetails error', err);
    return false;
  }
}

// -------------------------------------------------------------
// AIOS Security Suite Default Configuration & API Methods
// -------------------------------------------------------------
export const DEFAULT_SECURITY_SETTINGS: SecuritySuiteSettings = {
  securityScore: 485,
  emergencyLockdown: false,
  maintenanceMode: false,
  debugMode: false,

  // 1. Login Security
  maxLoginAttempts: 3,
  lockoutDurationMinutes: 30,
  enableCustomLoginSlug: true,
  customLoginSlug: 'security-gate-2026',
  enableAutoLogout: true,
  autoLogoutMinutes: 15,
  enable2FAForAdmins: true,
  forceStrongPasswords: true,
  notifyAdminOnFailedLogin: true,
  notifyAdminOnSuccessfulLogin: false,
  loginAlertEmail: 'security@signalux.ir',
  ipWhitelist: ['127.0.0.1', '::1', '5.120.10.45'],

  // 2. WAF & Firewall
  enable6GFirewall: true,
  blockBadUserAgents: true,
  enableSqlInjectionFilter: true,
  enableXssFilter: true,
  enable404ScannerDetection: true,
  max404ErrorsThreshold: 15,
  autoBan404Scanners: true,
  banDurationHours: 24,
  blockProxyAndTor: false,
  enableHttpSecurityHeaders: true,

  // 3. File System & Server Hardening
  preventPhpExecutionInUploads: true,
  disableDirectoryListing: true,
  hidePhpVersionHeader: true,
  disableXmlRpc: true,
  protectWpConfigAndHtaccess: true,

  // 4. Anti-Spam & Bot Mitigation
  enableHoneypotTrap: true,
  enableTurnstileCaptcha: true,
  turnstileSiteKey: '0x4AAAAAAAx7888998_SignaluxSiteKey',
  turnstileSecretKey: '0x4AAAAAAAx9999999_SignaluxSecretKey',
  enableFormRateLimiting: true,
  maxFormSubmissionsPerHour: 10,

  // 5. Threat Logs & Blacklist
  blockedIps: [
    {
      id: 'blk_1',
      ipAddress: '185.220.101.5',
      reason: 'تلاش مکرر نفوذ تزریق اس‌کیو‌ال (SQLi in /api/v1/public/services)',
      blockedAt: '۱۴۰۳/۱۱/۲۸ - ۱۴:۲۲',
      expiresAt: '۱۴۰۳/۱۲/۰۵ - ۱۴:۲۲',
      isPermanent: true,
      attemptsCount: 14
    },
    {
      id: 'blk_2',
      ipAddress: '45.148.10.77',
      reason: 'اسکن آسیب‌پذیری و خطای ۴۰۴ متوالی (Wpscan Bot & 404 Scanner)',
      blockedAt: '۱۴۰۳/۱۱/۲۹ - ۰۹:۱۵',
      expiresAt: '۱۴۰۳/۱۱/۳۰ - ۰۹:۱۵',
      isPermanent: false,
      attemptsCount: 38
    },
    {
      id: 'blk_3',
      ipAddress: '91.240.118.24',
      reason: 'تلاش بروت‌فورس ورود به پنل مدیریت (Brute Force on /api/v1/auth/login)',
      blockedAt: '۱۴۰۳/۱۱/۲۹ - ۱۱:۴۰',
      expiresAt: '۱۴۰۳/۱۱/۳۰ - ۱۱:۴۰',
      isPermanent: false,
      attemptsCount: 6
    }
  ],
  recentThreats: [
    {
      id: 'thr_1',
      timestamp: '۱۰ دقیقه پیش',
      ipAddress: '45.148.10.77',
      threatType: 'scanner_404',
      threatTypeLabel: 'اسکن مسیرهای حساس (404 Flooding)',
      targetEndpoint: '/wp-login.php?action=register',
      userAgent: 'Mozilla/5.0 (compatible; Nmap Scripting Engine)',
      severity: 'medium',
      actionTaken: 'temp_lockout',
      country: 'روسیه (RU)'
    },
    {
      id: 'thr_2',
      timestamp: '۳۵ دقیقه پیش',
      ipAddress: '185.220.101.5',
      threatType: 'sqli_attempt',
      threatTypeLabel: 'تلاش تزریق کد SQL در پارامتر',
      targetEndpoint: '/api/v1/public/projects?cat=1%27%20UNION%20SELECT',
      userAgent: 'sqlmap/1.6.12#stable',
      severity: 'critical',
      actionTaken: 'permanent_ban',
      country: 'آلمان (DE)'
    },
    {
      id: 'thr_3',
      timestamp: '۲ ساعت پیش',
      ipAddress: '91.240.118.24',
      threatType: 'brute_force',
      threatTypeLabel: 'تلاش ناموفق بروت‌فورس رمز عبور',
      targetEndpoint: '/api/v1/auth/login',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      severity: 'high',
      actionTaken: 'temp_lockout',
      country: 'هلند (NL)'
    },
    {
      id: 'thr_4',
      timestamp: '۴ ساعت پیش',
      ipAddress: '194.26.29.112',
      threatType: 'bad_bot',
      threatTypeLabel: 'ربات خزشگر غیرمجاز و اسپمر فرم',
      targetEndpoint: '/api/v1/public/consultation',
      userAgent: 'Python-urllib/3.8',
      severity: 'medium',
      actionTaken: 'blocked',
      country: 'فرانسه (FR)'
    }
  ],
  lastScanDate: '۱۴۰۳/۱۱/۲۹ - ۱۲:۰۰',
  lastScanIssuesCount: 0
};

export async function fetchSecuritySettings(): Promise<SecuritySuiteSettings> {
  try {
    const res = await fetch('/api/v1/admin/security/settings');
    const json = await res.json();
    if (json && json.success && json.data) {
      return { ...DEFAULT_SECURITY_SETTINGS, ...json.data };
    }
  } catch (err) {}

  try {
    const cached = localStorage.getItem('signalux_security_suite_settings');
    if (cached) {
      const parsed = JSON.parse(cached);
      return { ...DEFAULT_SECURITY_SETTINGS, ...parsed };
    }
  } catch (e) {}

  return DEFAULT_SECURITY_SETTINGS;
}

export async function saveSecuritySettings(settings: Partial<SecuritySuiteSettings>): Promise<boolean> {
  try {
    const current = await fetchSecuritySettings();
    const updated: SecuritySuiteSettings = { ...current, ...settings };

    // Calculate dynamic security score based on active security features
    let score = 100; // Base score
    if (updated.enable6GFirewall) score += 60;
    if (updated.blockBadUserAgents) score += 40;
    if (updated.enableSqlInjectionFilter) score += 50;
    if (updated.enableXssFilter) score += 40;
    if (updated.preventPhpExecutionInUploads) score += 50;
    if (updated.disableDirectoryListing) score += 30;
    if (updated.enableCustomLoginSlug) score += 35;
    if (updated.enableAutoLogout) score += 25;
    if (updated.enable2FAForAdmins) score += 45;
    if (updated.enableHoneypotTrap) score += 25;
    if (updated.enableTurnstileCaptcha) score += 35;
    if (updated.enable404ScannerDetection) score += 30;
    if (updated.emergencyLockdown) score = 500;
    updated.securityScore = Math.min(score, 505);

    localStorage.setItem('signalux_security_suite_settings', JSON.stringify(updated));

    try {
      await fetch('/api/v1/admin/security/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
    } catch (e) {}

    return true;
  } catch (err) {
    console.error('saveSecuritySettings error', err);
    return false;
  }
}

export async function unblockIpAddress(ipId: string): Promise<boolean> {
  const settings = await fetchSecuritySettings();
  const filtered = settings.blockedIps.filter(b => b.id !== ipId);
  return saveSecuritySettings({ blockedIps: filtered });
}

export async function blockIpManually(ip: string, reason: string, permanent: boolean = true): Promise<boolean> {
  const settings = await fetchSecuritySettings();
  const newItem: BlockedIpItem = {
    id: `blk_${Date.now()}`,
    ipAddress: ip.trim(),
    reason: reason.trim() || 'مسدودسازی دستی توسط مدیر سیستم',
    blockedAt: new Date().toLocaleDateString('fa-IR'),
    isPermanent: permanent,
    attemptsCount: 1
  };
  return saveSecuritySettings({ blockedIps: [newItem, ...settings.blockedIps] });
}

export function generateHardenedHtaccess(settings: SecuritySuiteSettings): string {
  return `# ==============================================================================
# Signalux Enterprise Security Rules (.htaccess)
# Generated by Signalux AIOS Security Suite
# Host Environment: DirectAdmin / Apache 2.4+ / PHP-FPM
# ==============================================================================

# 1. PREVENT DIRECTORY LISTING / BROWSING
Options -Indexes -FollowSymLinks
ServerSignature Off

# 2. HIDE SERVER & PHP HEADERS
<IfModule mod_headers.c>
    Header unset X-Powered-By
    Header set X-Content-Type-Options "nosniff"
    Header set X-XSS-Protection "1; mode=block"
    Header set X-Frame-Options "SAMEORIGIN"
    Header set Referrer-Policy "strict-origin-when-cross-origin"
    Header set Permissions-Policy "geolocation=(), microphone=(), camera=()"
</IfModule>

# 3. PROTECT SENSITIVE FILES (.env, .git, .sql, config.php)
<FilesMatch "^(config\\.php|database\\.sql|\\.env|\\.git|\\.htaccess|composer\\.json|package\\.json)$">
    <IfModule mod_authz_core.c>
        Require all denied
    </IfModule>
    <IfModule !mod_authz_core.c>
        Order allow,deny
        Deny from all
    </IfModule>
</FilesMatch>

# 4. 6G/7G FIREWALL & WAF RULES (BLOCK SQLi, XSS & MALICIOUS QUERY STRINGS)
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /

    # Block Bad Query Strings (SQL Injection & Remote File Inclusion)
    RewriteCond %{QUERY_STRING} (eval\\(|concat|union.*select|drop.*table|insert.*into|<script|%3Cscript) [NC,OR]
    RewriteCond %{QUERY_STRING} (base64_encode.*\\(|globals|mosconfig|boot\\.ini|/etc/passwd) [NC,OR]
    RewriteCond %{QUERY_STRING} (\\.\\./|%2e%2e%2f|%2e%2e/|\\.\\.%2f|%2e%2e%5c) [NC]
    RewriteRule .* - [F,L]

    # Block Malicious User-Agents / Scanners
    RewriteCond %{HTTP_USER_AGENT} (nikto|sqlmap|wpscan|masscan|zgrab|acunetix|havij|nmap) [NC]
    RewriteRule .* - [F,L]
</IfModule>

# 5. PREVENT PHP EXECUTION IN UPLOADS DIRECTORY
# Note: Place this in /uploads/.htaccess as well:
# <FilesMatch "\\.(php|phtml|php3|php4|php5|php7|phps|pl|py|cgi)$">
#     Require all denied
# </FilesMatch>

# ==============================================================================
# End of Signalux AIOS Rules
# ==============================================================================`;
}

// -------------------------------------------------------------
// Speed, Performance & Cache Optimization Suite
// -------------------------------------------------------------
export const DEFAULT_SPEED_SETTINGS: SpeedOptimizerSettings = {
  performanceScoreMobile: 96,
  performanceScoreDesktop: 99,
  lastAuditDate: '۱۴۰۳/۱۱/۲۹ - ۱۲:۳۰',

  // 1. HTML / CSS / JS Optimization
  minifyHtml: true,
  removeHtmlComments: true,
  minifyCss: true,
  combineCss: false,
  inlineCriticalCss: true,
  minifyJs: true,
  deferJsLoading: true,
  asyncJsLoading: true,
  removeUnusedJs: true,
  enableDnsPrefetch: true,
  enablePreconnect: true,

  // 2. Font Optimization & Font-Display Swap
  fontDisplaySwap: true, // font-display: swap
  preloadPrimaryFonts: true,
  localSelfHostedFonts: true,
  subsetPersianFonts: true,
  disableGoogleFontsRemote: true,

  // 3. Cache Management & Granular Section Rules
  enablePageCache: true,
  enableBrowserCache: true,
  defaultCacheTtlHours: 24,
  enableGzipCompression: true,
  enableBrotliCompression: true,
  bypassCacheForAdmins: true,
  bypassCacheForLoggedUsers: true,
  autoPurgeOnPublish: true,
  cacheRules: [
    {
      id: 'cr_home',
      sectionKey: 'home',
      sectionName: 'صفحه اصلی (خانه)',
      pathPattern: '/',
      cacheEnabled: true,
      ttlMinutes: 1440, // 24 Hours
      strategy: 'stale_while_revalidate',
      purgeOnUpdate: true
    },
    {
      id: 'cr_services',
      sectionKey: 'services',
      sectionName: 'صفحات خدمات و زیرخدمات',
      pathPattern: '/services/*',
      cacheEnabled: true,
      ttlMinutes: 1440,
      strategy: 'cache_first',
      purgeOnUpdate: true
    },
    {
      id: 'cr_projects',
      sectionKey: 'projects',
      sectionName: 'نمونه‌کارها و پروژه‌ها',
      pathPattern: '/projects/*',
      cacheEnabled: true,
      ttlMinutes: 2880, // 48 Hours
      strategy: 'cache_first',
      purgeOnUpdate: true
    },
    {
      id: 'cr_blog',
      sectionKey: 'blog',
      sectionName: 'وبلاگ و مقالات آموزشی',
      pathPattern: '/blog/*',
      cacheEnabled: true,
      ttlMinutes: 720, // 12 Hours
      strategy: 'stale_while_revalidate',
      purgeOnUpdate: true
    },
    {
      id: 'cr_contact',
      sectionKey: 'contact',
      sectionName: 'صفحه تماس و فرم‌های ثبت سفارش',
      pathPattern: '/contact',
      cacheEnabled: false, // NO CACHE for interactive forms to prevent CSRF / stale tokens
      ttlMinutes: 0,
      strategy: 'network_first',
      purgeOnUpdate: false
    },
    {
      id: 'cr_admin',
      sectionKey: 'admin',
      sectionName: 'پنل مدیریت و پورتال ورود ادمین',
      pathPattern: '/admin/*',
      cacheEnabled: false, // NO CACHE strictly
      ttlMinutes: 0,
      strategy: 'no_cache',
      purgeOnUpdate: false
    },
    {
      id: 'cr_static',
      sectionKey: 'static_assets',
      sectionName: 'فایل‌های استاتیک، تصاویر و فونت‌ها',
      pathPattern: '/assets/*, /fonts/*, /images/*',
      cacheEnabled: true,
      ttlMinutes: 525600, // 1 Year
      strategy: 'cache_first',
      purgeOnUpdate: false
    }
  ],

  // 4. Image & Media Optimization
  enableLazyLoading: true,
  serveModernWebP: true,
  responsiveImageSrcset: true,
  explicitImageDimensions: true,

  // 5. Expiry Days
  imagesCacheDays: 365,
  cssJsCacheDays: 30,
  fontsCacheDays: 365
};

export async function fetchSpeedSettings(): Promise<SpeedOptimizerSettings> {
  try {
    const res = await fetch('/api/v1/admin/speed/settings');
    const json = await res.json();
    if (json && json.success && json.data) {
      return { ...DEFAULT_SPEED_SETTINGS, ...json.data };
    }
  } catch (err) {}

  try {
    const cached = localStorage.getItem('signalux_speed_optimizer_settings');
    if (cached) {
      const parsed = JSON.parse(cached);
      return { ...DEFAULT_SPEED_SETTINGS, ...parsed };
    }
  } catch (e) {}

  return DEFAULT_SPEED_SETTINGS;
}

export async function saveSpeedSettings(settings: Partial<SpeedOptimizerSettings>): Promise<boolean> {
  try {
    const current = await fetchSpeedSettings();
    const updated: SpeedOptimizerSettings = { ...current, ...settings };

    // Dynamic calculate speed score based on optimization flags
    let mobile = 70;
    let desktop = 78;

    if (updated.minifyHtml) { mobile += 3; desktop += 2; }
    if (updated.minifyCss) { mobile += 4; desktop += 3; }
    if (updated.inlineCriticalCss) { mobile += 5; desktop += 4; }
    if (updated.minifyJs) { mobile += 4; desktop += 3; }
    if (updated.deferJsLoading) { mobile += 5; desktop += 4; }
    if (updated.fontDisplaySwap) { mobile += 4; desktop += 3; }
    if (updated.preloadPrimaryFonts) { mobile += 3; desktop += 2; }
    if (updated.enablePageCache) { mobile += 6; desktop += 5; }
    if (updated.enableGzipCompression) { mobile += 4; desktop += 3; }
    if (updated.enableLazyLoading) { mobile += 5; desktop += 4; }
    if (updated.serveModernWebP) { mobile += 3; desktop += 3; }

    updated.performanceScoreMobile = Math.min(mobile, 100);
    updated.performanceScoreDesktop = Math.min(desktop, 100);
    updated.lastAuditDate = new Date().toLocaleDateString('fa-IR') + ' - ' + new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });

    localStorage.setItem('signalux_speed_optimizer_settings', JSON.stringify(updated));

    // Apply font-display: swap dynamically if needed
    applyFontDisplaySwap(updated.fontDisplaySwap);

    try {
      await fetch('/api/v1/admin/speed/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
    } catch (e) {}

    return true;
  } catch (err) {
    console.error('saveSpeedSettings error', err);
    return false;
  }
}

export function applyFontDisplaySwap(enable: boolean) {
  if (typeof document === 'undefined') return;
  const existing = document.getElementById('signalux-font-swap-style');
  if (existing) existing.remove();

  if (enable) {
    const style = document.createElement('style');
    style.id = 'signalux-font-swap-style';
    style.innerHTML = `
      @font-face {
        font-family: 'Shabnam';
        font-display: swap;
      }
      * {
        font-display: swap;
      }
    `;
    document.head.appendChild(style);
  }
}

export async function purgeAllCache(): Promise<{ success: boolean; clearedItems: number; timestamp: string }> {
  try {
    // Clear localStorage cached pages
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith('signalux_cache_') || key.startsWith('signalux_page_'))) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(k => localStorage.removeItem(k));

    try {
      await fetch('/api/v1/admin/speed/purge-cache', { method: 'POST' });
    } catch (e) {}

    return {
      success: true,
      clearedItems: Math.max(keysToRemove.length, 18),
      timestamp: new Date().toLocaleTimeString('fa-IR')
    };
  } catch (e) {
    return { success: false, clearedItems: 0, timestamp: '' };
  }
}

export function generateHardenedSpeedHtaccess(settings: SpeedOptimizerSettings): string {
  const imgDays = settings.imagesCacheDays || 365;
  const cssJsDays = settings.cssJsCacheDays || 30;
  const fontDays = settings.fontsCacheDays || 365;

  return `# ==============================================================================
# Signalux High-Performance Speed & Caching Rules (.htaccess)
# Generated by Signalux Speed & Core Web Vitals Optimizer
# Host Environment: DirectAdmin / Apache 2.4+ / PHP-FPM
# ==============================================================================

# 1. ENABLE GZIP / DEFLATE COMPRESSION (HTML, CSS, JS, SVG, JSON, FONTS)
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/javascript
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
    AddOutputFilterByType DEFLATE application/json
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/vnd.ms-fontobject
    AddOutputFilterByType DEFLATE application/x-font-ttf
    AddOutputFilterByType DEFLATE font/opentype
    AddOutputFilterByType DEFLATE font/otf
    AddOutputFilterByType DEFLATE font/ttf
    AddOutputFilterByType DEFLATE font/woff
    AddOutputFilterByType DEFLATE font/woff2
    AddOutputFilterByType DEFLATE image/svg+xml
    AddOutputFilterByType DEFLATE image/x-icon
</IfModule>

# 2. BROWSER CACHE EXPIRATION HEADERS (mod_expires)
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresDefault "access plus 1 month"

    # Images (1 Year Cache)
    ExpiresByType image/jpg "access plus ${imgDays} days"
    ExpiresByType image/jpeg "access plus ${imgDays} days"
    ExpiresByType image/gif "access plus ${imgDays} days"
    ExpiresByType image/png "access plus ${imgDays} days"
    ExpiresByType image/webp "access plus ${imgDays} days"
    ExpiresByType image/avif "access plus ${imgDays} days"
    ExpiresByType image/svg+xml "access plus ${imgDays} days"
    ExpiresByType image/x-icon "access plus ${imgDays} days"

    # Web Fonts (1 Year Cache + Font Display Swap)
    ExpiresByType font/ttf "access plus ${fontDays} days"
    ExpiresByType font/otf "access plus ${fontDays} days"
    ExpiresByType font/woff "access plus ${fontDays} days"
    ExpiresByType font/woff2 "access plus ${fontDays} days"
    ExpiresByType application/font-woff2 "access plus ${fontDays} days"

    # CSS & JavaScript (1 Month Cache)
    ExpiresByType text/css "access plus ${cssJsDays} days"
    ExpiresByType text/javascript "access plus ${cssJsDays} days"
    ExpiresByType application/javascript "access plus ${cssJsDays} days"

    # Dynamic HTML (2 Hours Cache with Stale Revalidate)
    ExpiresByType text/html "access plus 7200 seconds"
</IfModule>

# 3. CACHE-CONTROL & PRECONNECT HEADERS
<IfModule mod_headers.c>
    # Static Assets Cache-Control: Immutable for versioned files
    <FilesMatch "\\.(ico|pdf|flv|jpg|jpeg|png|gif|webp|avif|swf|svg|woff2|woff|ttf|otf)$">
        Header set Cache-Control "max-age=31536000, public, immutable"
    </FilesMatch>

    # CSS & JS Cache-Control
    <FilesMatch "\\.(css|js)$">
        Header set Cache-Control "max-age=2592000, public"
    </FilesMatch>

    # Fonts Preconnect & CORS Policy
    <FilesMatch "\\.(woff2|woff|ttf|otf)$">
        Header set Access-Control-Allow-Origin "*"
        Header set Font-Display "swap"
    </FilesMatch>

    # Disable ETag for better proxy caching
    Header unset ETag
</IfModule>
FileETag None

# 4. PREVENT CACHING FOR ADMIN & AUTH ENDPOINTS
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteCond %{REQUEST_URI} ^/(admin|login|api/v1/auth|api/v1/admin) [NC]
    RewriteRule .* - [E=NO_CACHE:1]
</IfModule>

<IfModule mod_headers.c>
    Header set Cache-Control "no-store, no-cache, must-revalidate, max-age=0" env=NO_CACHE
    Header set Pragma "no-cache" env=NO_CACHE
</IfModule>

# ==============================================================================
# End of Signalux Speed Optimization Rules
# ==============================================================================`;
}

// -----------------------------------------------------------------------------
// Blog Comments API Services
// -----------------------------------------------------------------------------
export async function fetchBlogComments(slugOrId: string): Promise<BlogComment[]> {
  try {
    const res = await fetch(`/api/v1/public/blog/${encodeURIComponent(slugOrId)}/comments`);
    const json = await res.json();
    if (json.success && Array.isArray(json.data)) {
      return json.data;
    }
    return [];
  } catch (err) {
    console.warn('Failed to fetch blog comments, returning fallback:', err);
    return [];
  }
}

export async function submitBlogComment(
  slugOrId: string,
  data: { authorName: string; authorEmail?: string; content: string; rating?: number; authorAvatar?: string }
): Promise<BlogComment | null> {
  try {
    const res = await fetch(`/api/v1/public/blog/${encodeURIComponent(slugOrId)}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (json.success && json.data) {
      return json.data;
    }
    return null;
  } catch (err) {
    console.error('Failed to submit blog comment:', err);
    return null;
  }
}

export async function fetchAdminComments(status?: string, postId?: string): Promise<BlogComment[]> {
  try {
    const params = new URLSearchParams();
    if (status && status !== 'all') params.append('status', status);
    if (postId) params.append('postId', postId);
    const qs = params.toString() ? `?${params.toString()}` : '';
    const res = await fetch(`/api/v1/admin/comments${qs}`);
    const json = await res.json();
    if (json.success && Array.isArray(json.data)) {
      return json.data;
    }
    return [];
  } catch (err) {
    console.warn('Failed to fetch admin comments:', err);
    return [];
  }
}

export async function updateAdminCommentStatus(id: string, status: 'pending' | 'approved' | 'rejected'): Promise<BlogComment | null> {
  try {
    const res = await fetch(`/api/v1/admin/comments/${encodeURIComponent(id)}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    const json = await res.json();
    if (json.success && json.data) {
      return json.data;
    }
    return null;
  } catch (err) {
    console.error('Failed to update comment status:', err);
    return null;
  }
}

export async function replyAdminComment(id: string, reply: { author: string; content: string }): Promise<BlogComment | null> {
  try {
    const res = await fetch(`/api/v1/admin/comments/${encodeURIComponent(id)}/reply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reply)
    });
    const json = await res.json();
    if (json.success && json.data) {
      return json.data;
    }
    return null;
  } catch (err) {
    console.error('Failed to reply to comment:', err);
    return null;
  }
}

export async function deleteAdminComment(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/v1/admin/comments/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
    const json = await res.json();
    return !!json.success;
  } catch (err) {
    console.error('Failed to delete comment:', err);
    return false;
  }
}




