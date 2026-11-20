import { randomUUID } from 'node:crypto';
import { SERVICES_DATA, PORTFOLIO_PROJECTS, CERTIFICATES_DATA, TESTIMONIALS_DATA } from '../src/data';
import {
  ServiceItem,
  PortfolioProject,
  CertificateItem,
  Testimonial,
  AdminUser,
  BlogPost,
  SeoGlobalSettings,
  TicketItem,
  TicketMessage,
  TicketStatus,
  TicketDepartment,
  TicketPriority,
  BlogComment
} from '../src/types';

export interface LeadSubmission {
  id: string;
  type: 'consultation' | 'contact';
  name: string;
  email: string;
  phone?: string;
  service?: string;
  budget?: string;
  message?: string;
  createdAt: string;
  status: 'new' | 'contacted' | 'closed';
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface SiteSettings {
  siteTitle: string;
  heroHeadline: string;
  heroSubtitle: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  instagramUrl: string;
  linkedinUrl: string;
  telegramUrl: string;
  githubUrl: string;

  // Typography Settings
  fontFamily: string;
  fontSizeBase: string;
  fontHeadingScale: string;
  fontWeightBase: string;
  lineHeightScale?: string;

  // Google & SMS
  gtmContainerId?: string;
  gtmEnabled?: boolean;
  gscVerificationCode?: string;
  googleClientId?: string;
  googleLoginEnabled?: boolean;
  melipayamakUsername?: string;
  melipayamakSenderNumber?: string;
  melipayamakOtpBodyId?: number | string;
  melipayamakEnabled?: boolean;
}

const INITIAL_ADMIN_USERS: AdminUser[] = [
  {
    id: 'adm-1',
    username: 'admin',
    fullName: 'مهندس سهیل سلیمانی',
    email: 'admin@signalux.ir',
    phone: '۰۹۱۲۰۰۰۰۰۰۱',
    role: 'admin',
    permissions: ['all'],
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    isActive: true,
    createdAt: '2026-01-01T10:00:00.000Z',
    lastLogin: '2026-03-12T11:30:00.000Z'
  },
  {
    id: 'adm-2',
    username: 'seo_expert',
    fullName: 'کیانوش رضوانی (متخصص سئو)',
    email: 'seo@signalux.ir',
    phone: '۰۹۱۲۰۰۰۰۰۰۲',
    role: 'seo',
    permissions: ['seo', 'sitemap', 'robots', 'blog', 'google'],
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    isActive: true,
    createdAt: '2026-01-10T14:00:00.000Z',
    lastLogin: '2026-03-11T09:20:00.000Z'
  },
  {
    id: 'adm-3',
    username: 'support_agent',
    fullName: 'مونا احمدی (کارشناس پشتیبانی)',
    email: 'support@signalux.ir',
    phone: '۰۹۱۲۰۰۰۰۰۰۳',
    role: 'support',
    permissions: ['tickets', 'leads', 'faqs'],
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    isActive: true,
    createdAt: '2026-01-15T08:30:00.000Z',
    lastLogin: '2026-03-12T10:05:00.000Z'
  },
  {
    id: 'adm-4',
    username: 'content_writer',
    fullName: 'آرش درخشان (نویسنده ارشد وبلاگ)',
    email: 'content@signalux.ir',
    phone: '۰۹۱۲۰۰۰۰۰۰۴',
    role: 'writer',
    permissions: ['blog', 'media'],
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    isActive: true,
    createdAt: '2026-02-01T16:45:00.000Z',
    lastLogin: '2026-03-10T17:15:00.000Z'
  }
];

const INITIAL_BLOG_POSTS: BlogPost[] = [
  {
    id: 'post-1',
    title: 'راهنمای جامع سئوی تکنیکال ۲۰۲۶؛ چگونه به رتبه ۱ گوگل برسیم؟',
    slug: 'technical-seo-guide-2026',
    excerpt: 'سئوی فنی پایه و اساس هر وب‌سایت موفق است. در این مقاله به بررسی چک‌لیست طلایی سرعت لود، ساختار URL، فایل robots.txt و نشانه‌گذاری اسکیما می‌پردازیم.',
    content: `## مقدمه بر سئوی تکنیکال مدرن

سئوی تکنیکال یا فنی به فرآیند بهینه‌سازی زیرساخت‌های وب‌سایت به منظور تسهیل خزش (Crawling) و نمایه‌سازی (Indexing) صفحات توسط موتورهای جستجو مانند گوگل اطلاق می‌شود.

### ۱. بهینه‌سازی سرعت و Core Web Vitals
سرعت بارگذاری سایت نه تنها بر تجربه کاربری بلکه مستقیماً بر فاکتورهای رتبه‌بندی گوگل اثرگذار است. معیارهای LCP (بزرگ‌ترین عنصر محتوا)، FID یا INP (میزان تعاملی بودن) و CLS (تغییرات چیدمان بصری) سه ستون اصلی این بخش هستند.

### ۲. معماری آدرس‌ها و نقشه سایت (Sitemap.xml)
نقشه سایت باید همیشه به‌روز، سبک و شامل صفحات با کد وضعیت ۲۰۰ باشد. از قرار دادن صفحات ریدایرکت شده یا صفحات بدون ایندکس در سایت‌مپ اکیداً خودداری نمایید.

### ۳. نشانه‌گذاری اسکیما و داده‌های ساختاریافته (Schema.org)
با استفاده از اسکیماهای Organization, Article, LocalBusiness و BreadcrumbList به ربات‌های گوگل کمک کنید مفهوم واقعی کسب‌وکار شما را درک کنند.`,
    featuredImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1000&q=80',
    category: 'سئو و بهینه‌سازی',
    tags: ['سئو تکنیکال', 'گوگل سرچ کنسول', 'سرعت سایت', 'اسکیما'],
    author: 'کیانوش رضوانی',
    authorRole: 'مدیر دپارتمان سئو',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    readingTime: '۶ دقیقه',
    status: 'published',
    publishedAt: '2026-03-01T10:30:00.000Z',
    viewsCount: 1240,
    likesCount: 84,
    metaTitle: 'راهنمای جامع سئوی تکنیکال ۲۰۲۶ | استودیو سیگنالوکس',
    metaDescription: 'آموزش کامل سئوی تکنیکال، بهینه‌سازی سرعت و نشانه‌گذاری داده‌های ساختاریافته برای افزایش ترافیک ارگانیک گوگل.',
    focusKeyword: 'سئوی تکنیکال',
    canonicalUrl: 'https://signalux.ir/blog/technical-seo-guide-2026'
  },
  {
    id: 'post-2',
    title: 'طراحی رابط کاربری لوکس با متد Glassmorphism و تایپوگرافی اختصاصی',
    slug: 'luxury-ui-ux-design-principles',
    excerpt: 'بررسی تکنیک‌های نوین دیزاین وب در سال ۲۰۲۶، هارمونی رنگ‌های شبانه با نورهای متمرکز و بهینه‌سازی خوانایی فونت‌های فارسی در محیط‌های تاریک.',
    content: `## فلسفه دیزاین سیستم در عصر جدید

طراحی رابط کاربری فراتر از چیدمان ساده المان‌هاست؛ این یک زبان بصری برای انتقال حس اعتماد، پرستیژ و نوآوری است.

### هماهنگی نور و سایه
در طراحی دارک‌مود مدرن، استفاده از گرادیان‌های نوری دقیق به جای خطوط ضخیم، عمق بصری شگفت‌انگیزی به محصول می‌بخشد.

### استانداردهای تایپوگرافی فارسی
انتخاب اندازه پایه متون (مانند ۱۶ پیکسل) و مقیاس تیترها با نسبت ۱.۲۵ یا ۱.۳۵، تجربه‌ای خوانا و آرامش‌بخش برای چشمان مخاطبان فراهم می‌آورد.`,
    featuredImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=80',
    category: 'طراحی وب و رابط کاربری',
    tags: ['طراحی UI/UX', 'تایپوگرافی فارسی', 'طراحی وب', 'دیزاین سیستم'],
    author: 'سهیل سلیمانی',
    authorRole: 'طراح ارشد تجربه کاربری',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    readingTime: '۴ دقیقه',
    status: 'published',
    publishedAt: '2026-03-05T14:15:00.000Z',
    viewsCount: 890,
    likesCount: 62,
    metaTitle: 'اصول طراحی رابط کاربری لوکس و مدرن | وبلاگ سیگنالوکس',
    metaDescription: 'بررسی استانداردها و تکنیک‌های خلق رابط کاربری لوکس، دارک‌مود و دیزاین سیستم اختصاصی با تایپوگرافی فارسی.',
    focusKeyword: 'طراحی UI/UX'
  },
  {
    id: 'post-3',
    title: 'چگونه هوش مصنوعی فرآیند دیجیتال مارکتینگ و فروش را متحول می‌کند؟',
    slug: 'ai-digital-marketing-transformation',
    excerpt: 'نقش مدل‌های زبانی هوشمند در شخصی‌سازی کمپین‌ها، بهینه‌سازی نرخ تبدیل (CRO) و تحلیل داده‌های لحظه‌ای مشتریان.',
    content: `## ورود هوش مصنوعی مولد به دنیای تبلیغات

ابزارهای هوش مصنوعی اکنون قادرند سناریوهای تبلیغاتی چندگانه تولید کرده و بهترین نسخه را بر اساس رفتار کاربران گزینش کنند.

### بهینه‌سازی هوشمند بودجه کمپین‌ها
با تجزیه و تحلیل هم‌زمان نرخ تبدیل و هزینه هر اکتساب مشتری (CPA)، بودجه تبلیغات گوگل و متا در هر لحظه به سودآورترین مسیر هدایت می‌شود.`,
    featuredImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1000&q=80',
    category: 'دیجیتال مارکتینگ',
    tags: ['هوش مصنوعی', 'مارکتینگ اتومیشن', 'دیجیتال مارکتینگ', 'فروش'],
    author: 'آرش درخشان',
    authorRole: 'نویسنده ارشد محتوا',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    readingTime: '۵ دقیقه',
    status: 'published',
    publishedAt: '2026-03-10T09:00:00.000Z',
    viewsCount: 1560,
    likesCount: 110,
    metaTitle: 'هوش مصنوعی در دیجیتال مارکتینگ و افزایش فروش | سیگنالوکس',
    metaDescription: 'آشنایی با کاربردهای هوش مصنوعی در اتوماسیون بازاریابی، بهینه‌سازی کمپین‌ها و نرخ بازگشت سرمایه.',
    focusKeyword: 'هوش مصنوعی در مارکتینگ'
  },
  {
    id: 'post-4',
    title: 'چک‌لیست بهینه‌سازی Core Web Vitals و افزایش سرعت لود به زیر ۸۰۰ میلی‌ثانیه',
    slug: 'core-web-vitals-optimization-checklist',
    excerpt: 'راهنمای فنی بهینه‌سازی INP، LCP و CLS در فریمورک‌های مدرن برای بهبود رتبه‌بندی در نتایج جستجوی گوگل.',
    content: `## فاکتورهای حیاتی سرعت سایت در سال ۲۰۲۶

گوگل در الگوریتم‌های جدید خود تجربه کاربری و سرعت تعاملی را به عنوان شاخص کلیدی در رتبه‌بندی لحاظ می‌کند.

### راهکارهای کاهش LCP
استفاده از فرمت‌های تصویری نسل جدید مانند AVIF و WebP و پیاده‌سازی CDN توزیع‌شده با قابلیت کش محلی.`,
    featuredImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1000&q=80',
    category: 'سئو و بهینه‌سازی',
    tags: ['سرعت سایت', 'Core Web Vitals', 'سئو تکنیکال', 'بهینه‌سازی'],
    author: 'کیانوش رضوانی',
    authorRole: 'مدیر دپارتمان سئو',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    readingTime: '۷ دقیقه',
    status: 'published',
    publishedAt: '2026-03-08T11:00:00.000Z',
    viewsCount: 1120,
    likesCount: 79,
    metaTitle: 'چک‌لیست Core Web Vitals ۲۰۲۶ | وبلاگ سیگنالوکس',
    metaDescription: 'روش‌های علمی و تست‌شده برای بهینه‌سازی سرعت سایت و پاس کردن آزمون Core Web Vitals گوگل.',
    focusKeyword: 'سرعت سایت'
  },
  {
    id: 'post-5',
    title: 'اصول معماری Headless CMS و وب‌اپلیکیشن‌های نسل جدید در ۲۰۲۶',
    slug: 'headless-cms-architecture-2026',
    excerpt: 'چرا برندهای پیشرو به سمت معماری Decoupled و Headless حرکت می‌کنند؟ بررسی مزایا، امنیت و سرعت توسعه.',
    content: `## گذار از CMS سنتی به Headless

معماری Headless با جداسازی فرانت‌اند و بک‌اند، امکان توسعه مستقل، امنیت فوق‌العاده و پرفورمنس بی‌رقیب را به ارمغان می‌آورد.`,
    featuredImage: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1000&q=80',
    category: 'طراحی وب و رابط کاربری',
    tags: ['Headless CMS', 'توسعه فرانت‌اند', 'معماری وب', 'Next.js'],
    author: 'سهیل سلیمانی',
    authorRole: 'طراح ارشد تجربه کاربری',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    readingTime: '۶ دقیقه',
    status: 'published',
    publishedAt: '2026-03-06T15:30:00.000Z',
    viewsCount: 940,
    likesCount: 58,
    metaTitle: 'معماری Headless CMS در سال ۲۰۲۶ | سیگنالوکس',
    metaDescription: 'بررسی مزایای معماری بدون سر (Headless) در توسعه وب‌سایت‌های سازمانی و فروشگاهی.',
    focusKeyword: 'Headless CMS'
  },
  {
    id: 'post-6',
    title: 'استراتژی کلاسترینگ محتوا (Content Hub) برای تسخیر کلمات کلیدی پررقابت',
    slug: 'content-clustering-strategy-guide',
    excerpt: 'چگونه با پیاده‌سازی ساختار Pillar-Cluster ساختار محتوایی سایت را برای اتوریتی موضوعی گوگل بهینه‌سازی کنیم.',
    content: `## اتوریتی موضوعی (Topical Authority) چیست؟

موتورهای جستجو به وب‌سایت‌هایی که پوشش عمیق و تخصصی از یک حوزه ارائه می‌دهند اعتماد بیشتری دارند.`,
    featuredImage: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&w=1000&q=80',
    category: 'سئو و بهینه‌سازی',
    tags: ['تولید محتوا', 'کلاسترینگ', 'استراتژی سئو', 'اتوریتی'],
    author: 'کیانوش رضوانی',
    authorRole: 'مدیر دپارتمان سئو',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    readingTime: '۸ دقیقه',
    status: 'published',
    publishedAt: '2026-03-04T08:45:00.000Z',
    viewsCount: 1430,
    likesCount: 95,
    metaTitle: 'کلاسترینگ محتوا و پیلار پیج در سئو | سیگنالوکس',
    metaDescription: 'آموزش طراحی ساختار پیلار و کلاستر برای افزایش اتوریتی موضوعی و ترافیک ارگانیک.',
    focusKeyword: 'کلاسترینگ محتوا'
  },
  {
    id: 'post-7',
    title: 'روانشناسی رنگ‌ها و میکرواینترکشن‌ها در افزایش نرخ تبدیل (CRO)',
    slug: 'color-psychology-micro-interactions-cro',
    excerpt: 'چگونه انیمیشن‌های ظریف و پالت رنگی هماهنگ، اعتماد کاربر را جلب کرده و نرخ خرید را تا ۴۰٪ ارتقا می‌دهند.',
    content: `## جزئیات پنهان تجربه کاربری

حرکات نرم المان‌ها و فیدبک‌های بصری لمسی به کاربر احساس کنترل و اطمینان خاطر در فرآیند ثبت سفارش می‌بخشد.`,
    featuredImage: 'https://images.unsplash.com/photo-1508830524289-0adcbe822b40?auto=format&fit=crop&w=1000&q=80',
    category: 'طراحی وب و رابط کاربری',
    tags: ['نرخ تبدیل', 'روانشناسی رنگ', 'میکرواینترکشن', 'UI/UX'],
    author: 'سهیل سلیمانی',
    authorRole: 'طراح ارشد تجربه کاربری',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    readingTime: '۵ دقیقه',
    status: 'published',
    publishedAt: '2026-03-02T13:00:00.000Z',
    viewsCount: 780,
    likesCount: 51,
    metaTitle: 'روانشناسی رنگ و نرخ تبدیل در طراحی وب | سیگنالوکس',
    metaDescription: 'تاثیر روانشناسی رنگ‌ها و انیمیشن‌های ظریف در بهبود تجربه کاربری و افزایش فروش.',
    focusKeyword: 'نرخ تبدیل'
  },
  {
    id: 'post-8',
    title: 'تبلیغات گوگل (Google Ads) در برابر سئو؛ کدام یک برای کسب‌وکار شما مناسب‌تر است؟',
    slug: 'google-ads-vs-seo-comparison',
    excerpt: 'مقایسه همه‌جانبه هزینه‌ها، نرخ بازگشت سرمایه و ماندگاری نتایج بین بازاریابی ارگانیک و تبلیغات کلیکی.',
    content: `## استراتژی ترکیبی رشد دیجیتال

سرمایه‌گذاری روی سئو رشد پایدار بلندمدت می‌سازد و تبلیغات گوگل دسترسی سریع به لیدهای باکیفیت را تضمین می‌کند.`,
    featuredImage: 'https://images.unsplash.com/photo-1533750516457-a7f992034fec?auto=format&fit=crop&w=1000&q=80',
    category: 'دیجیتال مارکتینگ',
    tags: ['گوگل ادز', 'سئو', 'دیجیتال مارکتینگ', 'تبلیغات کلیکی'],
    author: 'آرش درخشان',
    authorRole: 'نویسنده ارشد محتوا',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    readingTime: '۶ دقیقه',
    status: 'published',
    publishedAt: '2026-02-28T10:00:00.000Z',
    viewsCount: 1680,
    likesCount: 122,
    metaTitle: 'گوگل ادز یا سئو؟ مقایسه بازدهی و هزینه | سیگنالوکس',
    metaDescription: 'راهنمای جامع انتخاب بین تبلیغات کلیکی گوگل ادز و سئو ارگانیک برای کسب‌وکارهای ایرانی.',
    focusKeyword: 'گوگل ادز یا سئو'
  },
  {
    id: 'post-9',
    title: 'امنیت وب‌سایت در برابر حملات DDoS و تزریق کدهای مخرب در سال ۲۰۲۶',
    slug: 'web-security-ddos-protection-2026',
    excerpt: 'بررسی لایه‌های امنیتی WAF، هدرهای امنیتی HTTP و سیستم‌های مانیتورینگ بلادرنگ برای حفاظت از داده‌های کاربران.',
    content: `## استانداردهای امنیتی مدرن

امنیت زیرساخت وب نه تنها از دارایی‌های اطلاعاتی محافظت می‌کند، بلکه پیش‌شرط حفظ رتبه و اعتبار در گوگل است.`,
    featuredImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1000&q=80',
    category: 'طراحی وب و رابط کاربری',
    tags: ['امنیت وب', 'فایروال WAF', 'DDoS', 'حفاظت داده'],
    author: 'سهیل سلیمانی',
    authorRole: 'طراح ارشد تجربه کاربری',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    readingTime: '۵ دقیقه',
    status: 'published',
    publishedAt: '2026-02-25T16:00:00.000Z',
    viewsCount: 820,
    likesCount: 64,
    metaTitle: 'امنیت وب‌سایت و مقابله با حملات سایبری ۲۰۲۶ | سیگنالوکس',
    metaDescription: 'راهنمای جامع پیکربندی هدرهای امنیتی، فایروال و مقابله با نفوذ در وب‌سایت‌های سازمانی.',
    focusKeyword: 'امنیت وب'
  },
  {
    id: 'post-10',
    title: 'اتوماسیون بازاریابی ایمیلی و پیامکی؛ ساخت قیف‌های فروش هوشمند با بازدهی بالا',
    slug: 'marketing-automation-email-sms-funnels',
    excerpt: 'طراحی سناریوهای بازاریابی خودکار بر اساس رفتار کاربر در سایت، ریتارگتینگ و افزایش ارزش طول عمر مشتری (LTV).',
    content: `## اتوماسیون هوشمند ارتباط با مشتری

با ارسال پیام‌های متناسب در زمان دقیق، لیدهای سرد به خریداران وفادار تبدیل می‌شوند.`,
    featuredImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1000&q=80',
    category: 'دیجیتال مارکتینگ',
    tags: ['اتوماسیون', 'قیف فروش', 'ریتارگتینگ', 'SMS مارکتینگ'],
    author: 'آرش درخشان',
    authorRole: 'نویسنده ارشد محتوا',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    readingTime: '۶ دقیقه',
    status: 'published',
    publishedAt: '2026-02-22T09:30:00.000Z',
    viewsCount: 1290,
    likesCount: 88,
    metaTitle: 'اتوماسیون مارکتینگ و قیف فروش | وبلاگ سیگنالوکس',
    metaDescription: 'چگونگی پیاده‌سازی اتوماسیون بازاریابی برای افزایش نرخ تبدیل و ماندگاری مشتریان.',
    focusKeyword: 'اتوماسیون مارکتینگ'
  }
];

const INITIAL_SEO_SETTINGS: SeoGlobalSettings = {
  siteTitle: 'آژانس دیجیتال سیگنالوکس (Signalux)',
  titleSeparator: '|',
  defaultMetaDescription: 'سیگنالوکس؛ آژانس پیشرو در طراحی اختصاصی وب‌سایت، سئو تخصصی و دیجیتال مارکتینگ داده‌محور با متدهای ۲۰۲۶',
  defaultMetaKeywords: 'طراحی سایت, سئو سایت, دیجیتال مارکتینگ, آژانس دیجیتال, توسعه وب, سئو تضمینی',
  canonicalBaseUrl: 'https://signalux.ir',
  robotsTxt: `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/v1/admin/\n\nSitemap: https://signalux.ir/sitemap.xml`,
  sitemapEnabled: true,
  sitemapChangefreq: 'weekly',
  sitemapPriority: '0.8',
  googleVerificationCode: 'google-site-verification=abcdef1234567890',
  bingVerificationCode: '',
  enableJsonLdSchema: true,
  organizationName: 'استودیو دیجیتال سیگنالوکس',
  organizationLogo: '',
  organizationPhone: '۰۹۳۵۲۹۹۷۲۷۲',
  twitterHandle: '@signalux_ir',
  defaultOgImage: '',
  redirects: [
    {
      id: 'red-1',
      sourcePath: '/old-services',
      targetPath: '/services',
      type: 301,
      isActive: true,
      createdAt: '2026-01-01T00:00:00.000Z'
    }
  ],
  pageRules: [
    {
      id: 'page-1',
      pagePath: '/',
      pageName: 'صفحه اصلی',
      metaTitle: 'آژانس دیجیتال مارکتینگ و طراحی وب سیگنالوکس',
      metaDescription: 'خلق تجربه‌های دیجیتال بدون مرز با استودیو سیگنالوکس، طراحی وب اختصاصی و سئو پایدار',
      metaKeywords: 'طراحی سایت, سئو, مارکتینگ',
      noIndex: false
    },
    {
      id: 'page-2',
      pagePath: '/services',
      pageName: 'خدمات تخصصی',
      metaTitle: 'خدمات توسعه وب و مارکتینگ دیجیتال | سیگنالوکس',
      metaDescription: 'ارائه خدمات طراحی وب‌سایت‌های واکنش‌گرا، سئو تخصصی و کمپین‌های تبلیغاتی پربازده',
      metaKeywords: 'خدمات سئو, خدمات طراحی سایت',
      noIndex: false
    },
    {
      id: 'page-3',
      pagePath: '/blog',
      pageName: 'وبلاگ و مقالات',
      metaTitle: 'وبلاگ تخصصی طراحی وب و سئو | سیگنالوکس',
      metaDescription: 'جدیدترین مقالات آموزشی، ترندهای ۲۰۲۶ و استراتژی‌های رشد آنلاین در پایگاه دانش سیگنالوکس',
      metaKeywords: 'مقالات سئو, وبلاگ طراحی سایت',
      noIndex: false
    }
  ]
};

const INITIAL_SITE_SETTINGS: SiteSettings = {
  siteTitle: 'آژانس دیجیتال سیگنالوکس (Signalux)',
  heroHeadline: 'خلق تجربه‌های دیجیتال بدون مرز و متناسب با رشد کسب‌وکار شما',
  heroSubtitle: 'استودیو سیگنالوکس با بهره‌گیری از طراحی مدرن وب، استراتژی سئوی داده‌محور و دیزاین سیستم‌های منحصر‌به‌فرد، برند شما را در فضای دیجیتال ممتاز می‌کند.',
  contactEmail: 'info@signalux.ir',
  contactPhone: '۰۹۳۵۲۹۹۷۲۷۲',
  contactAddress: 'تهران، خیابان ولیعصر، برج فناوری سیگنال، طبقه ۸',
  instagramUrl: 'https://instagram.com/signalux',
  linkedinUrl: 'https://linkedin.com/company/signalux',
  telegramUrl: 'https://t.me/samanabaspour',
  githubUrl: 'https://github.com/signalux',
  
  // Typography
  fontFamily: 'Shabnam',
  fontSizeBase: '16px',
  fontHeadingScale: '1.25',
  fontWeightBase: '400',
  lineHeightScale: '1.65',

  gtmContainerId: '',
  gtmEnabled: false,
  gscVerificationCode: '',
  googleClientId: '1234567890-signalux.apps.googleusercontent.com',
  googleLoginEnabled: true,
  melipayamakUsername: 'signalux_sms',
  melipayamakSenderNumber: '50004000123456',
  melipayamakOtpBodyId: 123456,
  melipayamakEnabled: true
};

const INITIAL_FAQS: FAQItem[] = [
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
    category: 'دیجیتال مارکتینگ',
    question: 'آیا گزارش‌های تحلیلی کمپین‌ها ارائه می‌شود؟',
    answer: 'بله، تمامی کمپین‌ها به صورت هفتگی و ماهانه همراه با معیارهای شفاف ROI و ROAS گزارش می‌شوند.'
  }
];

class DataStore {
  private services: ServiceItem[] = [...SERVICES_DATA];
  private projects: PortfolioProject[] = [...PORTFOLIO_PROJECTS];
  private certificates: CertificateItem[] = [...CERTIFICATES_DATA];
  private testimonials: Testimonial[] = [...TESTIMONIALS_DATA];
  private faqs: FAQItem[] = [...INITIAL_FAQS];
  private settings: SiteSettings = { ...INITIAL_SITE_SETTINGS };
  private leads: LeadSubmission[] = [
    {
      id: 'lead-demo-1',
      type: 'consultation',
      name: 'رضا طباطبایی',
      email: 'reza.t@example.com',
      phone: '۰۹۱۲۳۴۵۶۷۸۹',
      service: 'طراحی و توسعه وب‌سایت اختصاصی',
      budget: '۵۰ تا ۱۰۰ میلیون تومان',
      message: 'نیاز به بازطراحی مارکت‌پلیس و افزودن PWA داریم.',
      createdAt: new Date().toISOString(),
      status: 'new'
    }
  ];

  // Services
  getServices(): ServiceItem[] { return this.services; }
  getServiceById(id: string): ServiceItem | undefined { return this.services.find(s => s.id === id); }
  createService(data: Omit<ServiceItem, 'id'>): ServiceItem {
    const newService: ServiceItem = { ...data, id: `srv-${Date.now()}` };
    this.services.unshift(newService);
    return newService;
  }
  addService(data: Omit<ServiceItem, 'id'>): ServiceItem {
    return this.createService(data);
  }
  updateService(id: string, data: Partial<ServiceItem>): ServiceItem | null {
    const idx = this.services.findIndex(s => s.id === id);
    if (idx === -1) return null;
    this.services[idx] = { ...this.services[idx], ...data };
    return this.services[idx];
  }
  deleteService(id: string): boolean {
    const initLen = this.services.length;
    this.services = this.services.filter(s => s.id !== id);
    return this.services.length < initLen;
  }

  // Projects
  getProjects(): PortfolioProject[] { return this.projects; }
  getProjectById(id: string): PortfolioProject | undefined { return this.projects.find(p => p.id === id || p.slug === id); }
  createProject(data: Omit<PortfolioProject, 'id'>): PortfolioProject {
    const newProject: PortfolioProject = { ...data, id: `proj-${Date.now()}` };
    this.projects.unshift(newProject);
    return newProject;
  }
  addProject(data: Omit<PortfolioProject, 'id'>): PortfolioProject {
    return this.createProject(data);
  }
  updateProject(id: string, data: Partial<PortfolioProject>): PortfolioProject | null {
    const idx = this.projects.findIndex(p => p.id === id);
    if (idx === -1) return null;
    this.projects[idx] = { ...this.projects[idx], ...data };
    return this.projects[idx];
  }
  deleteProject(id: string): boolean {
    const initLen = this.projects.length;
    this.projects = this.projects.filter(p => p.id !== id);
    return this.projects.length < initLen;
  }

  // Testimonials
  getTestimonials(): Testimonial[] { return this.testimonials; }
  createTestimonial(data: Omit<Testimonial, 'id'>): Testimonial {
    const newTestimonial: Testimonial = { ...data, id: `testi-${Date.now()}` };
    this.testimonials.unshift(newTestimonial);
    return newTestimonial;
  }
  addTestimonial(data: Omit<Testimonial, 'id'>): Testimonial {
    return this.createTestimonial(data);
  }
  updateTestimonial(id: string, data: Partial<Testimonial>): Testimonial | null {
    const idx = this.testimonials.findIndex(t => t.id === id);
    if (idx === -1) return null;
    this.testimonials[idx] = { ...this.testimonials[idx], ...data };
    return this.testimonials[idx];
  }
  deleteTestimonial(id: string): boolean {
    const initLen = this.testimonials.length;
    this.testimonials = this.testimonials.filter(t => t.id !== id);
    return this.testimonials.length < initLen;
  }

  // Certificates
  getCertificates(): CertificateItem[] { return this.certificates; }
  createCertificate(data: Omit<CertificateItem, 'id'>): CertificateItem {
    const newCert: CertificateItem = { ...data, id: `cert-${Date.now()}` };
    this.certificates.unshift(newCert);
    return newCert;
  }
  addCertificate(data: Omit<CertificateItem, 'id'>): CertificateItem {
    return this.createCertificate(data);
  }
  updateCertificate(id: string, data: Partial<CertificateItem>): CertificateItem | null {
    const idx = this.certificates.findIndex(c => c.id === id);
    if (idx === -1) return null;
    this.certificates[idx] = { ...this.certificates[idx], ...data };
    return this.certificates[idx];
  }
  deleteCertificate(id: string): boolean {
    const initLen = this.certificates.length;
    this.certificates = this.certificates.filter(c => c.id !== id);
    return this.certificates.length < initLen;
  }

  // FAQs
  getFaqs(): FAQItem[] { return this.faqs; }
  createFaq(data: Omit<FAQItem, 'id'>): FAQItem {
    const newFaq: FAQItem = { ...data, id: `faq-${Date.now()}` };
    this.faqs.unshift(newFaq);
    return newFaq;
  }
  addFaq(data: Omit<FAQItem, 'id'>): FAQItem {
    return this.createFaq(data);
  }
  updateFaq(id: string, data: Partial<FAQItem>): FAQItem | null {
    const idx = this.faqs.findIndex(f => f.id === id);
    if (idx === -1) return null;
    this.faqs[idx] = { ...this.faqs[idx], ...data };
    return this.faqs[idx];
  }
  deleteFaq(id: string): boolean {
    const initLen = this.faqs.length;
    this.faqs = this.faqs.filter(f => f.id !== id);
    return this.faqs.length < initLen;
  }

  // Settings
  getSettings(): SiteSettings { return this.settings; }
  updateSettings(data: Partial<SiteSettings>): SiteSettings {
    const allowed = Object.fromEntries(Object.entries(data).filter(([key]) =>
      Object.hasOwn(INITIAL_SITE_SETTINGS, key)
    ));
    this.settings = { ...this.settings, ...allowed };
    return this.settings;
  }

  // Admin RBAC Users
  private adminUsers: AdminUser[] = [...INITIAL_ADMIN_USERS];
  getAdminUsers(): AdminUser[] { return this.adminUsers; }
  getAdminUserById(id: string): AdminUser | undefined { return this.adminUsers.find(u => u.id === id); }
  createAdminUser(data: Omit<AdminUser, 'id' | 'createdAt'>): AdminUser {
    const newUser: AdminUser = {
      ...data,
      id: `adm-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    this.adminUsers.push(newUser);
    return newUser;
  }
  updateAdminUser(id: string, data: Partial<AdminUser>): AdminUser | null {
    const idx = this.adminUsers.findIndex(u => u.id === id);
    if (idx === -1) return null;
    this.adminUsers[idx] = { ...this.adminUsers[idx], ...data };
    return this.adminUsers[idx];
  }
  deleteAdminUser(id: string): boolean {
    if (id === 'adm-1') return false; // Protected
    const initLen = this.adminUsers.length;
    this.adminUsers = this.adminUsers.filter(u => u.id !== id);
    return this.adminUsers.length < initLen;
  }

  // Blog Posts
  private blogPosts: BlogPost[] = [...INITIAL_BLOG_POSTS];
  getBlogPosts(status?: string): BlogPost[] {
    if (status) {
      return this.blogPosts.filter(p => p.status === status);
    }
    return this.blogPosts;
  }
  getBlogPostBySlug(slug: string): BlogPost | undefined {
    const post = this.findBlogPost(slug);
    if (post) {
      post.viewsCount = (post.viewsCount || 0) + 1;
    }
    return post;
  }
  findBlogPost(slugOrId: string): BlogPost | undefined {
    return this.blogPosts.find(post => post.slug === slugOrId || post.id === slugOrId);
  }
  getBlogPostById(id: string): BlogPost | undefined {
    return this.blogPosts.find(p => p.id === id);
  }
  createBlogPost(data: Omit<BlogPost, 'id' | 'publishedAt' | 'viewsCount'>): BlogPost {
    const newPost: BlogPost = {
      ...data,
      id: `post-${Date.now()}`,
      publishedAt: new Date().toISOString(),
      viewsCount: 0
    };
    this.blogPosts.unshift(newPost);
    return newPost;
  }
  updateBlogPost(id: string, data: Partial<BlogPost>): BlogPost | null {
    const idx = this.blogPosts.findIndex(p => p.id === id);
    if (idx === -1) return null;
    this.blogPosts[idx] = { ...this.blogPosts[idx], ...data, updatedAt: new Date().toISOString() };
    return this.blogPosts[idx];
  }
  deleteBlogPost(id: string): boolean {
    const initLen = this.blogPosts.length;
    this.blogPosts = this.blogPosts.filter(p => p.id !== id);
    return this.blogPosts.length < initLen;
  }

  // SEO Settings
  private seoSettings: SeoGlobalSettings = { ...INITIAL_SEO_SETTINGS };
  getSeoSettings(): SeoGlobalSettings { return this.seoSettings; }
  updateSeoSettings(data: Partial<SeoGlobalSettings>): SeoGlobalSettings {
    this.seoSettings = { ...this.seoSettings, ...data };
    return this.seoSettings;
  }

  // Leads
  getLeads(): LeadSubmission[] { return this.leads; }
  createLead(data: Omit<LeadSubmission, 'id' | 'createdAt' | 'status'>): LeadSubmission {
    const newLead: LeadSubmission = {
      ...data,
      id: `lead-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'new'
    };
    this.leads.unshift(newLead);
    return newLead;
  }
  addLead(data: Omit<LeadSubmission, 'id' | 'createdAt' | 'status'>): LeadSubmission {
    return this.createLead(data);
  }
  updateLeadStatus(id: string, status: 'new' | 'contacted' | 'closed'): boolean {
    const lead = this.leads.find(l => l.id === id);
    if (!lead) return false;
    lead.status = status;
    return true;
  }
  deleteLead(id: string): boolean {
    const initLen = this.leads.length;
    this.leads = this.leads.filter(l => l.id !== id);
    return this.leads.length < initLen;
  }

  // --- TICKETS SUPPORT SYSTEM ---
  private tickets: TicketItem[] = [
    {
      id: 'TK-1082',
      userName: 'علی حسینی',
      userPhone: '09123456789',
      userEmail: 'ali.hosseini@gmail.com',
      department: 'technical',
      priority: 'high',
      subject: 'بررسی لودینگ اسکریپت‌های سرچ کنسول و تگ منیجر',
      status: 'answered',
      createdAt: '2026-09-05T08:30:00.000Z',
      updatedAt: '2026-09-05T11:45:00.000Z',
      messages: [
        {
          id: 'msg-1',
          ticketId: 'TK-1082',
          senderType: 'user',
          senderName: 'علی حسینی',
          message: 'سلام وقت بخیر، پس از فعال‌سازی کدهای GTM، در پنل گوگل ارور لودینگ رخ می‌دهد. آیا نیاز به تنظیم دوباره پترن دارد؟',
          createdAt: '2026-09-05T08:30:00.000Z'
        },
        {
          id: 'msg-2',
          ticketId: 'TK-1082',
          senderType: 'admin',
          senderName: 'پشتیبانی فنی سیگنالوکس',
          message: 'درود بر شما جناب حسینی عزیز، کانتینر شما بررسی شد و تگ سرچ‌کنسول به صورت امن در هدر تزریق گردید. لطفاً کش مرورگر خود را پاک نموده و مجدداً تست فرمایید.',
          createdAt: '2026-09-05T11:45:00.000Z'
        }
      ]
    },
    {
      id: 'TK-1085',
      userName: 'مریم بهرامی',
      userPhone: '09351112233',
      userEmail: 'maryam.b@gmail.com',
      department: 'seo_design',
      priority: 'urgent',
      subject: 'درخواست جلسه مشاوره آنلاین سئو برای پروژه فروشگاهی',
      status: 'open',
      createdAt: '2026-09-08T14:10:00.000Z',
      updatedAt: '2026-09-08T14:10:00.000Z',
      messages: [
        {
          id: 'msg-3',
          ticketId: 'TK-1085',
          senderType: 'user',
          senderName: 'مریم بهرامی',
          message: 'با سلام، برای توسعه شاخه جدید فروشگاه نیازمند بازبینی معماری صفحات دسته‌بندی و تحقیق کلمات کلیدی هستیم. لطفاً زمان جلسه را هماهنگ فرمایید.',
          createdAt: '2026-09-08T14:10:00.000Z'
        }
      ]
    }
  ];

  getTickets(phone?: string): TicketItem[] {
    if (phone) {
      const cleanPhone = phone.trim();
      return this.tickets.filter(t => t.userPhone === cleanPhone);
    }
    return this.tickets;
  }

  getTicketById(id: string): TicketItem | undefined {
    return this.tickets.find(t => t.id === id);
  }

  createTicket(payload: {
    userId: string;
    userName: string;
    userPhone: string;
    userEmail?: string;
    department: TicketDepartment;
    priority: TicketPriority;
    subject: string;
    message: string;
    attachments?: string[];
  }): TicketItem {
    const ticketId = 'TK-' + randomUUID();
    const now = new Date().toISOString();
    const firstMsg: TicketMessage = {
      id: 'msg-' + randomUUID(),
      ticketId,
      senderType: 'user',
      senderName: payload.userName,
      message: payload.message,
      attachments: payload.attachments,
      createdAt: now
    };

    const newTicket: TicketItem = {
      id: ticketId,
      userId: payload.userId,
      userName: payload.userName,
      userPhone: payload.userPhone,
      userEmail: payload.userEmail || '',
      department: payload.department,
      priority: payload.priority,
      subject: payload.subject,
      status: 'open',
      createdAt: now,
      updatedAt: now,
      messages: [firstMsg]
    };

    this.tickets.unshift(newTicket);
    return newTicket;
  }

  replyTicket(ticketId: string, payload: {
    senderType: 'user' | 'admin';
    senderName: string;
    message: string;
    attachments?: string[];
  }): TicketItem | null {
    const ticket = this.tickets.find(t => t.id === ticketId);
    if (!ticket) return null;

    const now = new Date().toISOString();
    const newMsg: TicketMessage = {
      id: 'msg-' + randomUUID(),
      ticketId,
      senderType: payload.senderType,
      senderName: payload.senderName,
      message: payload.message,
      attachments: payload.attachments,
      createdAt: now
    };

    ticket.messages.push(newMsg);
    ticket.updatedAt = now;
    if (payload.senderType === 'admin') {
      ticket.status = 'answered';
    } else {
      ticket.status = 'open';
    }

    return ticket;
  }

  updateTicketStatus(ticketId: string, status: TicketStatus): TicketItem | null {
    const ticket = this.tickets.find(t => t.id === ticketId);
    if (!ticket) return null;
    ticket.status = status;
    ticket.updatedAt = new Date().toISOString();
    return ticket;
  }

  deleteTicket(ticketId: string): boolean {
    const initLen = this.tickets.length;
    this.tickets = this.tickets.filter(t => t.id !== ticketId);
    return this.tickets.length < initLen;
  }

  // --- BLOG COMMENTS SYSTEM ---
  private comments: BlogComment[] = [
    {
      id: 'comm-1',
      postId: 'core-web-vitals-2025',
      postTitle: 'راهنمای جامع Core Web Vitals و بهینه‌سازی سرعت سایت در سال ۲۰۲۵',
      authorName: 'مهرداد رضایی',
      authorEmail: 'm.rezaei@gmail.com',
      authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80',
      content: 'بسیار مقاله عالی و کاربردی بود. ما پس از مطالعه این مقاله توانستیم زمان LCP سایت شرکتی‌مان را از ۴.۲ ثانیه به ۱.۴ ثانیه برسانیم.',
      createdAt: '2026-08-15T10:30:00.000Z',
      status: 'approved',
      rating: 5,
      likesCount: 12,
      adminReply: {
        author: 'مهندس سهیل سلیمانی',
        content: 'سلام و درود جناب رضایی عزیز، بسیار خرسندیم که این راهکارها برای شما اثربخش بوده است. موفق و پرفروش باشید.',
        createdAt: '2026-08-15T14:20:00.000Z'
      }
    },
    {
      id: 'comm-2',
      postId: 'ecommerce-conversion-rate-optimization',
      postTitle: '۱۰ تکنیک روانشناسی طراحی UI/UX برای انفجار نرخ تبدیل فروشگاه‌های آنلاین',
      authorName: 'سارا کاظمی',
      authorEmail: 'sara.kazemi@outlook.com',
      authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80',
      content: 'نکته‌ای که درباره مراحل پرداخت یک‌مرحله‌ای فرمودید دقیقاً همان مشکلی بود که ما در درگاه پرداخت با رها شدن سبد خرید داشتیم. ممنون از تحلیل دقیق‌تون.',
      createdAt: '2026-08-18T18:45:00.000Z',
      status: 'approved',
      rating: 5,
      likesCount: 8
    },
    {
      id: 'comm-3',
      postId: 'core-web-vitals-2025',
      postTitle: 'راهنمای جامع Core Web Vitals و بهینه‌سازی سرعت سایت در سال ۲۰۲۵',
      authorName: 'فرزاد نعمتی',
      authorEmail: 'f.nemati@company.ir',
      content: 'آیا برای سایت‌های وردپرسی استفاده از پلاگین WP Rocket کافیه یا نیاز به تنظیمات وب‌سرور Nginx و LiteSpeed هم هست؟',
      createdAt: '2026-09-02T09:15:00.000Z',
      status: 'pending',
      rating: 4,
      likesCount: 2
    }
  ];

  getComments(postId?: string, status?: string): BlogComment[] {
    let list = this.comments;
    if (postId) {
      list = list.filter(c => c.postId === postId);
    }
    if (status && status !== 'all') {
      list = list.filter(c => c.status === status);
    }
    return list;
  }

  getCommentById(id: string): BlogComment | undefined {
    return this.comments.find(c => c.id === id);
  }

  createComment(payload: {
    postId: string;
    postTitle?: string;
    authorName: string;
    authorEmail: string;
    content: string;
    rating?: number;
    authorAvatar?: string;
  }): BlogComment {
    const newComm: BlogComment = {
      id: `comm-${Date.now()}`,
      postId: payload.postId,
      postTitle: payload.postTitle || '',
      authorName: payload.authorName,
      authorEmail: payload.authorEmail,
      authorAvatar: payload.authorAvatar,
      content: payload.content,
      createdAt: new Date().toISOString(),
      status: 'pending',
      rating: payload.rating || 5,
      likesCount: 0
    };
    this.comments.unshift(newComm);
    return newComm;
  }

  updateCommentStatus(id: string, status: 'pending' | 'approved' | 'rejected'): BlogComment | null {
    const comm = this.comments.find(c => c.id === id);
    if (!comm) return null;
    comm.status = status;
    return comm;
  }

  replyComment(id: string, reply: { author: string; content: string }): BlogComment | null {
    const comm = this.comments.find(c => c.id === id);
    if (!comm) return null;
    comm.adminReply = {
      author: reply.author || 'مدیریت سیگنالوکس',
      content: reply.content,
      createdAt: new Date().toISOString()
    };
    return comm;
  }

  deleteComment(id: string): boolean {
    const initLen = this.comments.length;
    this.comments = this.comments.filter(c => c.id !== id);
    return this.comments.length < initLen;
  }
}

export const store = new DataStore();
