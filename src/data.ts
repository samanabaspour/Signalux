import { ServiceItem, PortfolioProject, CertificateItem, Testimonial } from './types';

export const SERVICES_DATA: ServiceItem[] = [
  {
    id: 'web-development',
    title: 'طراحی و توسعه وب‌سایت اختصاصی',
    subtitle: 'معماری مدرن، سرعت خارق‌العاده و تجربه کاربری لوکس',
    category: 'web',
    iconName: 'Code2',
    description: 'توسعه فرانت‌اند و بک‌اند با آخرین متدهای ۲۰۲۶، بهینه‌سازی شده برای بالا‌ترین نرخ تبدیل و رابط‌کاربری پاسخگو روی تمام دستگاه‌ها.',
    features: [
      'توسعه بر پایه React / Next.js و PWA',
      'طراحی UI/UX اختصاصی مطابق استاندارد Karo Studio',
      'سرعت بارگذاری لایت‌هاوس بالای ۹۵٪',
      'امنیت چندلایه‌ای و معماری مقیاس‌پذیر'
    ],
    metrics: 'میانگین افزایش ۳.۲ برابری ماندگاری کاربر (Dwell Time)',
    deliverables: ['فرانت‌اند React/Vite', 'داشبورد مدیریتی اختصاصی', 'بهینه‌سازی کامل SEO فنی', 'پشتیبانی ۱۲ ماهه فنی'],
    techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Three.js'],
    gradient: 'from-cyan-500/20 via-indigo-500/10 to-transparent'
  },
  {
    id: 'wp-custom-theme',
    title: 'طراحی سایت وردپرسی قالب اختصاصی',
    subtitle: 'کدنویسی اختصاصی، سرعت نوری و پنل سفارشی بدون افزونه سنگین',
    category: 'web',
    iconName: 'Palette',
    description: 'طراحی صفر تا صد گرافیک UI/UX در فیگما و پیاده‌سازی پوسته کاملاً اختصاصی و کدنویسی‌شده وردپرس با کدهای استاندارد PHP 8 و فیلدهای پیشرفته ACF Pro.',
    features: [
      'کدنویسی پوسته ۱۰۰٪ اختصاصی از پایه بر اساس فیگما',
      'سرعت لود فوق‌العاده بالا و سازگاری بی‌نقص با استانداردهای گوگل',
      'پنل مدیریت فوق‌العاده ساده با فیلدهای سفارشی ACF Pro',
      'امنیت ارتقایافته و بهینه‌سازی شده برای سئو'
    ],
    metrics: 'میانگین سرعت لود زیر ۱ ثانیه با گرید A جی‌تی‌متریکس',
    deliverables: ['طراحی اختصاصی UI/UX فیگما', 'قالب اختصاصی وردپرس', 'آموزش ویدیویی مدیریت سایت', 'پشتیبانی ۶ ماهه'],
    techStack: ['WordPress Dev', 'PHP 8+', 'ACF Pro', 'Tailwind CSS', 'MySQL'],
    gradient: 'from-amber-500/20 via-yellow-500/10 to-transparent'
  },
  {
    id: 'wp-ready-template',
    title: 'طراحی سایت وردپرسی قالب آماده',
    subtitle: 'راه‌اندازی فوری، اقتصادی و متناسب با بودجه استارتاپ‌ها',
    category: 'web',
    iconName: 'LayoutTemplate',
    description: 'راه‌اندازی فوق‌العاده سریع و اقتصادی وب‌سایت‌های شرکتی، فروشگاهی و شخصی با قالب‌های مدرن، سبک و استانداردهای روز دنیا همراه با شخصی‌سازی کامل.',
    features: [
      'تحویل و راه‌اندازی فوری در سریع‌ترین زمان ممکن (۳ الی ۷ روز)',
      'شخصی‌سازی دقیق هویت بصری، رنگ‌بندی و چیدمان برند شما',
      'نصب و کانفیگ افزونه‌های امنیتی، شتاب‌دهنده سرعت و سئو پایه',
      'پنل کاربری و مدیریت ۱۰۰٪ فارسی با پشتیبانی تضمینی'
    ],
    metrics: 'راه‌اندازی سریع در کمتر از ۱ هفته با حداقل هزینه اولیه',
    deliverables: ['نصب و پیکربندی قالب استاندارد', 'درگاه پرداخت آنلاین', 'آموزش کار با پنل مدیریت', 'پشتیبانی فنی'],
    techStack: ['WordPress', 'Elementor Pro', 'WooCommerce', 'WP Rocket', 'Rank Math'],
    gradient: 'from-blue-500/20 via-cyan-500/10 to-transparent'
  },
  {
    id: 'digital-marketing',
    title: 'دیجیتال مارکتینگ و رشد برند',
    subtitle: 'کمپین‌های هدفمند، تحلیل داده‌محور و جذب مخاطب واقعی',
    category: 'marketing',
    iconName: 'TrendingUp',
    description: 'مدیریت علمی کمپین‌های تبلیغاتی، بازاریابی عملکردی (Performance Marketing) و تدوین قیف‌های فروش با حداکثر نرخ بازگشت سرمایه (ROI).',
    features: [
      'استراتژی جامع جذب و نگه‌داشت مشتری',
      'کمپین‌های عملکردی در شبکه‌های اجتماعی و گوگل',
      'بازاریابی محتوای ویروسی و سناریونویسی',
      'بهینه‌سازی قیف فروش و نرخ تبدیل (CRO)'
    ],
    metrics: 'افزایش متوسط ۲۴۰ درصدی نرخ بازگشت سرمایه (ROAS)',
    deliverables: ['سند استراتژی مارکتینگ', 'تقویم محتوایی اختصاصی', 'گزارش تحلیلی هفتگی و ماهانه', 'A/B تست صفحات فرود'],
    techStack: ['Google Analytics 4', 'Meta Business', 'HubSpot', 'Mixpanel'],
    gradient: 'from-purple-500/20 via-pink-500/10 to-transparent'
  },
  {
    id: 'seo-optimization',
    title: 'سئو و بهینه‌سازی موتورهای جستجو',
    subtitle: 'تثبیت رتبه ۱ گوگل با سئوی کلاه سفید و ارگانیک',
    category: 'seo',
    iconName: 'SearchCheck',
    description: 'سئوی عمیق فنی (Technical SEO)، آنالیز رفتاری گوگل، استراتژی لینک‌سازی طبیعی و تولید محتوای هوشمند برای کسب رتبه‌های پایدار.',
    features: [
      'ممیزی فنی و برطرف‌سازی خطاهای گوگل سرچ کنسول',
      'تحقیق کلمات کلیدی درآمدزا و کلاسترینگ محتوا',
      'استراتژی لینک‌سازی کلاه سفید با اتوریتی بالا',
      'بهینه‌سازی نشانه‌گذاری اسکیما (Schema Markup)'
    ],
    metrics: 'رشد متوسط ۴۵۰ درصدی ورودی ارگانیک در ۶ ماه',
    deliverables: ['گزارش آنالیز رقبای صنعتی', 'نقشه راه سئوی ۱ ساله', 'داشبورد اختصاصی پایش رتبه‌ها', 'تولید و بهینه‌سازی مقالات پایه'],
    techStack: ['Ahrefs', 'Screaming Frog', 'Search Console', 'Semrush'],
    gradient: 'from-emerald-500/20 via-teal-500/10 to-transparent'
  }
];

export const PORTFOLIO_PROJECTS: PortfolioProject[] = [
  {
    id: 'berlin-beauty',
    title: 'وب‌سایت و فروشگاه تخصصی آنلاین برلین بیوتی',
    client: 'برلین بیوتی (Berlin Beauty)',
    clientRole: 'مدیر برند و فروشگاه',
    clientAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    category: 'web',
    categoryLabel: 'فروشگاه آنلاین آرایشی و زیبایی',
    thumbnail: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1000&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1200&q=80'
    ],
    year: '۲۰۲۵',
    duration: '۲ ماه زمان توسعه',
    summary: 'طراحی وب‌سایت فروشگاهی لوکس محصولات مراقبت پوست و زیبایی برلین بیوتی با تجربه خرید چابک.',
    impactMetrics: [
      { label: 'افزایش فروش آنلاین', value: '+۲۱۰٪', change: 'رشد ۲.۱ برابری' },
      { label: 'سرعت لود صفحه', value: '۰.۸ ثانیه', change: 'لود آنی محصولات' },
      { label: 'نرخ تبدیل فروش', value: '۴.۲٪', change: 'بهینه‌سازی UI/UX' }
    ],
    tags: ['React', 'E-Commerce', 'Tailwind CSS', 'Cosmetics', 'Fast Checkout'],
    fullDescription: 'فروشگاه برلین بیوتی یکی از مراکز معتبر عرضه محصولات آرایشی و بهداشتی اصل است. تیم سیگنالوکس با طراحی رابط کاربری شیک، سیستم فیلتر هوشمند محصولات بر اساس نوع پوست و برند، و تسویه‌حساب ۳۰ ثانیه‌ای، فروش آنلاین این برند را به حد بالایی ارتقا داد.',
    challengeText: 'سایت قبلی دارای کندی در بارگذاری تصاویر محصولات آرایشی و فرآیند پیچیده سبد خرید بود که باعث منصرف شدن مشتریان در مرحله پرداخت می‌شد.',
    solutionText: 'بازطراحی کامل با React و Tailwind CSS، فشرده‌سازی خودکار تصاویر، و ساده‌سازی فرایند خرید به دو گام کوتاه.',
    resultsText: 'افزایش بیش از ۲۱۰ درصدی سفارشات آنلاین ماهانه و کاهش نرخ انصراف از خرید به زیر ۱۵ درصد.',
    techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Node.js API', 'Zarinpal Payment'],
    clientQuote: 'طراحی فوق‌العاده و سرعت عالی سایت برلین بیوتی رضایت مشتریان ما را صدچندان کرده است.'
  },
  {
    id: 'xiaomi-tehran',
    title: 'پلتفرم فروشگاهی و عرضه محصولات شیائومی تهران',
    client: 'شیائومی تهران',
    clientRole: 'مدیر فروشگاه و زنجیره تامین',
    clientAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    category: 'web',
    categoryLabel: 'فروشگاه لوازم دیجیتال و گجت',
    thumbnail: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1000&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=1200&q=80'
    ],
    year: '۲۰۲۵',
    duration: '۳ ماه زمان اجرا',
    summary: 'طراحی پلتفرم عرضه گوشی‌های هوشمند، گجت‌ها و لوازم خانگی شیائومی با همگام‌سازی لحظه‌ای موجودی.',
    impactMetrics: [
      { label: 'سفارشات روزانه', value: '+۳۵۰٪', change: 'افزایش حجم فروش' },
      { label: 'ترافیک همزمان', value: '۵۰,۰۰۰+', change: 'پاسخگویی بی‌نقص' },
      { label: 'رضایت خریداران', value: '۹۹٪', change: 'تحویل سریع' }
    ],
    tags: ['Xiaomi', 'Mobile Store', 'Next.js', 'Realtime Inventory', 'PWA'],
    fullDescription: 'پلتفرم شیائومی تهران مرجع تخصصی خریداران محصولات و گجت‌های هوشمند برند شیائومی است. سیگنالوکس این وب‌سایت را با قابلیت مقایسه فنی هوشمند محصولات، استعلام اصالت کالا با کد رجیستری و سیستم انبارداری زنده پیاده‌سازی کرد.',
    challengeText: 'ترافیک بالای خریداران در زمان تخفیف‌های ویژه باعث کندی و قطعی وب‌سایت قبلی می‌شد.',
    solutionText: 'پیاده‌سازی معماری SSR و کش‌گذاری چندلایه همراه با بهینه‌سازی دیتابیس برای پاسخگویی به ده‌ها هزار کاربر همزمان.',
    resultsText: 'مدیریت بی‌نقص ترافیک در جشنواره‌های فروش بدون حتی یک ثانیه قطعی و رشد ۳.۵ برابری تراکنش‌ها.',
    techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Express Server', 'Redis Cache'],
    clientQuote: 'سیگنالوکس زیرساختی قوی برای شیائومی تهران ایجاد کرد که حتی در شلوغ‌ترین روزهای سال پاسخگوی مشتریان است.'
  },
  {
    id: 'toynet98',
    title: 'بهینه‌سازی سئو و بازاریابی دیجیتال توی نت ۹۸',
    client: 'توی نت ۹۸ (ToyNet 98)',
    clientRole: 'مدیر مارکتینگ',
    clientAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    category: 'seo',
    categoryLabel: 'سئو و بهینه‌سازی فروشگاه اسباب‌بازی',
    thumbnail: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=1000&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=1200&q=80'
    ],
    year: '۲۰۲۴',
    duration: '۶ ماه سئوی پیوسته',
    summary: 'ارتقای رتبه‌های ارگانیک فروشگاه آنلاین اسباب‌بازی و سرگرمی توی نت ۹۸ به رتبه‌های برتر گوگل.',
    impactMetrics: [
      { label: 'رشد ورودی گوگل', value: '+۴۲۰٪', change: 'از گوگل سرچ کنسول' },
      { label: 'کلمات رتبه ۱', value: '۸۵ کلمه', change: 'کلمات پرجستجو' },
      { label: 'کاهش نرخ پرش', value: '-۳۵٪', change: 'بهبود تجربه کاربر' }
    ],
    tags: ['SEO', 'Toys Store', 'Technical SEO', 'Content Strategy', 'Google Rank'],
    fullDescription: 'فروشگاه توی نت ۹۸ یکی از مجموعه‌های بزرگ عرضه اسباب‌بازی، بازی‌های فکری و سرگرمی کودک و نوجوان است. تیم سئوی سیگنالوکس با کلاسترینگ کلمات کلیدی، بهینه‌سازی فنی صفحات دسته و استراتژی لینک‌سازی کلاه‌سفید، ترافیک ارگانیک سایت را چندبرابر کرد.',
    challengeText: 'سایت توی نت ۹۸ در کلمات کلیدی پرجستجوی اسباب‌بازی به دلیل مشکلات فنی و محتوایی در صفحات سوم و چهارم گوگل حضور داشت.',
    solutionText: 'ممیزی سئوی فنی، بهبود سرعت صفحات محصول، ساخت خوشه‌های محتوایی و اجرای استراتژی ریپورتاژ آگهی هدفمند.',
    resultsText: 'رسیدن به لینک‌های بالای گوگل در کلماتی نظیر «خرید اسباب‌بازی آنلاین»، «بازی فکری کودک» و رشد ۴۲۰ درصدی فروش ارگانیک.',
    techStack: ['Ahrefs', 'Google Search Console', 'Screaming Frog', 'Technical SEO'],
    clientQuote: 'با خدمات سئوی سیگنالوکس، توی نت ۹۸ هم‌اکنون در خط مقدم فروش آنلاین اسباب‌بازی کشور قرار دارد.'
  },
  {
    id: 'irtcishop',
    title: 'طراحی وب‌سایت فروشگاهی اختصاصی IRTCISHOP',
    client: 'مجموعه IRTCISHOP',
    clientRole: 'مدیر فروشگاه',
    clientAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    category: 'web',
    categoryLabel: 'توسعه وب و E-Commerce',
    thumbnail: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=1000&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=1200&q=80'
    ],
    year: '۲۰۲۵',
    duration: '۲ ماه زمان اجرا',
    summary: 'طراحی و پیاده‌سازی سامانه فروشگاهی نوین با سرعت لود فوق‌العاده و اتصال به درگاه‌های پرداخت متکثر.',
    impactMetrics: [
      { label: 'سرعت لود', value: '۱.۱ ثانیه', change: 'بسیار چابک' },
      { label: 'افزایش تراکنش', value: '+۱۹۰٪', change: 'رشد خریداران' },
      { label: 'امتیاز لایت‌هاوس', value: '۹۶ از ۱۰۰', change: 'بهینه‌سازی کامل' }
    ],
    tags: ['React', 'IRTCISHOP', 'Tailwind', 'E-Commerce', 'Responsive'],
    fullDescription: 'طراحی پروژه IRTCISHOP با هدف ایجاد پلتفرمی مدرن و سریع برای ارائه خریدی امن و آسوده پیاده‌سازی شد. سیستم مدیریت سفارشات شفاف و ظاهر نوری آن تجربه کاربری متفاوتی برای مشتریان به ارمغان آورده است.',
    challengeText: 'نیاز به سامانه‌ای با ماندگاری بالا و قابلیت جستجوی هوشمند در بین هزاران قلم کالا.',
    solutionText: 'توسعه بر پایه React و تایپ‌اسکریپت با موتور جستجوی محلی فرانت‌اند بدون نیاز به رندر مجدد.',
    resultsText: 'افزایش چشمگیر رضایت مشتریان و ثبت سفارشات بدون وقفه.',
    techStack: ['React', 'TypeScript', 'Tailwind CSS', 'REST API'],
    clientQuote: 'سرعت و دقت تیم سیگنالوکس در اجرای پروژه IRTCISHOP قابل تحسین است.'
  },
  {
    id: 'pika-kids',
    title: 'پلتفرم فروشگاهی پوشاک و ملزومات کودک پیکا کیدز',
    client: 'پیکا کیدز (Pika Kids)',
    clientRole: 'بنیان‌گذار برند',
    clientAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    category: 'web',
    categoryLabel: 'فروشگاه پوشاک و کودک',
    thumbnail: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1000&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1200&q=80'
    ],
    year: '۲۰۲۴',
    duration: '۴۵ روز زمان توسعه',
    summary: 'طراحی رابط کاربری شاد، جذاب و چابک برای خرید آنلاین پوشاک بچه‌گانه با راهنمای سایزبندی هوشمند.',
    impactMetrics: [
      { label: 'کاهش مرجوعی سایز', value: '-۶۵٪', change: 'با راهنمای سایز' },
      { label: 'رشد فروش آنلاین', value: '+۲۸۰٪', change: 'ثبت سفارش آسان' },
      { label: 'ترافیک موبایل', value: '۸۸٪', change: 'کاملا موبایل فرندلی' }
    ],
    tags: ['Kids Fashion', 'React', 'UI/UX Design', 'Mobile First', 'Size Guide'],
    fullDescription: 'پیکا کیدز برند محبوب پوشاک کودک است. در این پروژه علاوه بر UI جذاب و متناسب با دنیای کودکان، یک راهنمای سایزبندی تعاملی دقیق طراحی شد تا والدین بتوانند با اطمینان کامل سایز مناسب فرزندشان را انتخاب کنند.',
    challengeText: 'بالا بودن آمار مرجوعی لباس‌ها به دلیل اشتباه در انتخاب سایز و کندی مرور محصولات در موبایل.',
    solutionText: 'طراحی راهنمای سایز هوشمند با دریافت قد و سن کودک و بهینه‌سازی ۱۰۰٪ UI برای نمایش در گوشی‌های همراه.',
    resultsText: 'کاهش ۶۵ درصدی مرجوعی‌ها و افزایش ۲۸۰ درصدی خریدهای موفق آنلاین.',
    techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
    clientQuote: 'والدین عاشق سادگی خرید و راهنمای سایز پیکا کیدز شده‌اند. ممنون از سیگنالوکس!'
  },
  {
    id: 'mahsin-print',
    title: 'سامانه ثبت سفارش آنلاین چاپ و بسته‌بندی مهسین',
    client: 'چاپ مهسین (Mahsin Print)',
    clientRole: 'مدیر مجتمع چاپ',
    clientAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80',
    category: 'web',
    categoryLabel: 'وب‌سایت آنلاین چاپ و خدمات صنعتی',
    thumbnail: 'https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?auto=format&fit=crop&w=1000&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?auto=format&fit=crop&w=1200&q=80'
    ],
    year: '۲۰۲۵',
    duration: '۲.۵ ماه زمان اجرا',
    summary: 'طراحی پلتفرم محاسبه قیمت زنده و دریافت آنلاین فایل‌های سفارش چاپ و بسته‌بندی اختصاصی.',
    impactMetrics: [
      { label: 'محاسبه زنده قیمت', value: 'آنی', change: 'بدون استعلام تلفنی' },
      { label: 'رشد سفارشات آنلاین', value: '+۲۳۰٪', change: 'صرفه‌جویی در زمان' },
      { label: 'کاهش خطای چاپ', value: '-۹۰٪', change: 'بررسی خودکار فایل' }
    ],
    tags: ['Printing', 'Online Estimator', 'React', 'File Upload', 'Custom Calculator'],
    fullDescription: 'مجتمع چاپ مهسین ارائه دهنده خدمات مدرن چاپ کارت ویزیت، کاتالوگ، جعبه و بسته‌بندی است. با طراحی ماشین حساب آنلاین قیمت بر اساس ابعاد، تیراژ و جنس کاغذ، مشتریان بدون نیاز به تماس تلفنی قیمت دقیق را دریافت کرده و فایل‌های خود را آپلود می‌کنند.',
    challengeText: 'استعلام‌های مداوم تلفنی وقت زیادی از اپراتورها می‌گرفت و باعث اتلاف زمان مشتریان می‌شد.',
    solutionText: 'طراحی فرم هوشمند محاسبه آنلاین قیمت چاپ با فرمول‌های پیچیده ریاضی و چک‌کننده پسوند و ابعاد فایل.',
    resultsText: 'خودکارسازی ۸۰٪ ثبت سفارشات و افزایش ۲۳۰ درصدی حجم سفارشات چاپی از سراسر کشور.',
    techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Node.js File Stream'],
    clientQuote: 'سیگنالوکس مجتمع چاپ مهسین را به یک چاپخانه آنلاین پیشرفته تبدیل کرد.'
  },
  {
    id: 'chapilda',
    title: 'سئو و برندینگ دیجیتال مرکز چاپ و تبلیغات چاپیلدا',
    client: 'چاپیلدا (Chapilda)',
    clientRole: 'مدیر تبلیغات و سئو',
    clientAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80',
    category: 'seo',
    categoryLabel: 'سئو و استراتژی رشد ارگانیک',
    thumbnail: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1000&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80'
    ],
    year: '۲۰۲۴',
    duration: '۵ ماه اجرای سئو',
    summary: 'تثبیت رتبه‌های نخست گوگل در خدمات چاپ آنلاین، چاپ لیبل و بسته‌بندی با استراتژی سئوی فنی.',
    impactMetrics: [
      { label: 'رتبه ۱ گوگل', value: '۴۵ کلمه کلیدی', change: 'حوزه چاپ و بسته‌بندی' },
      { label: 'رشد ورودی ارگانیک', value: '+۳۸۰٪', change: 'افزایش تماس‌های کاری' },
      { label: 'ارزش لیدهای جذب شده', value: 'بسیار بالا', change: 'سفارشات عمده B2B' }
    ],
    tags: ['SEO', 'Chapilda', 'B2B SEO', 'Content Strategy', 'Google Rank 1'],
    fullDescription: 'برند چاپیلدا در زمینه چاپ اختصاصی، هدایای تبلیغاتی و بسته‌بندی فعالیت دارد. با بهینه‌سازی کلمات کلیدی کلیدی کلیدی B2B، تولید محتوای تخصصی و رفع باگ‌های فنی، چاپیلدا به لیدر آنلاین صنعت چاپ تبدیل شد.',
    challengeText: 'رقابت سنگین در کلمات کلیدی «چاپ آنلاین»، «چاپ جعبه» و حضور رقبا با سابقه چندساله.',
    solutionText: 'پیاده‌سازی استراتژی خوشه‌ای صفحات خدماتی، لینک‌سازی تخصصی و بهینه‌سازی نرخ تبدیل صفحات فرود.',
    resultsText: 'دست‌یابی به لینک ۱ و ۲ گوگل در کلیدواژه‌های اصلی چاپ صنعتی و افزایش ورودی سفارشات عمده B2B.',
    techStack: ['Ahrefs Pro', 'Google Analytics 4', 'Search Console', 'Technical SEO Audit'],
    clientQuote: 'تیم سئوی سیگنالوکس دقیقا همان چیزی را که برای رشد چاپیلدا نیاز داشتیم محقق ساخت.'
  },
  {
    id: 'morvarid-haberdashery',
    title: 'فروشگاه جامع آنلاین خرازی مروارید',
    client: 'خرازی مروارید (Morvarid)',
    clientRole: 'مدیر فروشگاه',
    clientAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
    category: 'web',
    categoryLabel: 'فروشگاه آنلاین ملزومات خیاطی و خرازی',
    thumbnail: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=1000&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=1200&q=80'
    ],
    year: '۲۰۲۵',
    duration: '۲ ماه زمان اجرا',
    summary: 'پیاده‌سازی فروشگاه آنلاین تنوع بالایی از لوازم خیاطی، کاموا و خرازی با سیستم دسته‌بندی چندسطحی.',
    impactMetrics: [
      { label: 'تنوع کالاهای ثبت شده', value: '۱۰,۰۰۰+', change: 'دسته‌بندی منظم' },
      { label: 'افزایش فروش کشوری', value: '+۳۱۰٪', change: 'ارسال به سراسر ایران' },
      { label: 'سرعت جستجوی کالا', value: 'زیر ۵۰ms', change: 'فیلتر لحظه‌ای' }
    ],
    tags: ['E-Commerce', 'Haberdashery', 'React', 'Multi-category', 'Fast Search'],
    fullDescription: 'خرازی مروارید دارای هزاران قلم کالای ریز و درشت خیاطی و تزیینات است. سیگنالوکس با طراحی سیستم دسته‌بندی درخت‌واره‌ای و جستجوی آنی بدون تاخیر، تجربه خریدی لذت‌بخش برای خیاطان و هنرمندان فراهم کرد.',
    challengeText: 'سخت بودن پیدا کردن کالاهای کوچک در میان تنوع زیاد محصولات خرازی.',
    solutionText: 'طراحی موتور جستجوی هوشمند کلمات و دسته‌بندی بصری رنگی برای دسترسی سریع.',
    resultsText: 'پوشش سفارشات خیاطی از تمام استان‌های کشور و رشد ۳۱۰ درصدی فروش.',
    techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Fast Filtering Engine'],
    clientQuote: 'فروشگاه آنلاین خرازی مروارید با هنر سیگنالوکس به یکی از کامل‌ترین سایت‌های خرازی تبدیل شد.'
  },
  {
    id: 'almas-tajhiz',
    title: 'پورتال رسمی و فروشگاهی الماس تجهیز',
    client: 'الماس تجهیز (Almas Tajhiz)',
    clientRole: 'مدیر عامل',
    clientAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    category: 'web',
    categoryLabel: 'وب‌سایت صنعتی و تجهیزات تخصصی',
    thumbnail: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1000&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80'
    ],
    year: '۲۰۲۵',
    duration: '۳ ماه زمان توسعه',
    summary: 'طراحی کاتالوگ آنلاین و پلتفرم پیش‌فاکتور زنده تجهیزات صنعتی و آزمایشگاهی الماس تجهیز.',
    impactMetrics: [
      { label: 'صدور پیش‌فاکتور زنده', value: 'خودکار', change: 'درخواست آنلاین' },
      { label: 'افزایش استعلام‌های کاری', value: '+۲۶۰٪', change: 'جذب پروژه‌ها' },
      { label: 'رتبه فنی و امنیت', value: 'A+', change: 'استاندارد سازمانی' }
    ],
    tags: ['Industrial', 'B2B Portal', 'React', 'PDF Generator', 'Quotation Engine'],
    fullDescription: 'الماس تجهیز تامین‌کننده بزرگ تجهیزات تخصصی است. تیم سیگنالوکس پورتالی با قابلیت دانلود کاتالوگ‌های فنی، مقایسه ویژگی‌های دستگاه‌ها و صدور آنی پیش‌فاکتور رسمی با مهر دیجیتال پیاده‌سازی کرد.',
    challengeText: 'فرآیند زمان‌بر صدور دستی پیش‌فاکتور برای خریداران عمده تجهیزات.',
    solutionText: 'توسعه ماژول خودکار تولید PDF پیش‌فاکتور رسمی بر اساس قیمت‌ها و تخفیف‌های حجمی.',
    resultsText: 'کاهش ۹۰ درصدی زمان صدور پیش‌فاکتور و جذب قراردادهای بزرگ B2B.',
    techStack: ['React', 'TypeScript', 'Tailwind CSS', 'PDFkit Generator'],
    clientQuote: 'پورتال جدید الماس تجهیز پرستیژ کاری ما را نزد خریداران بزرگ صنعتی صدچندان کرد.'
  },
  {
    id: 'khurshid-decor',
    title: 'وب‌سایت تخصصی دکوراسیون و معماری خورشید دکور',
    client: 'خورشید دکور (Khurshid Decor)',
    clientRole: 'مدیر طراحی داخلی',
    clientAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    category: 'web',
    categoryLabel: 'دکوراسیون داخلی و معماری',
    thumbnail: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80'
    ],
    year: '۲۰۲۴',
    duration: '۲ ماه زمان اجرا',
    summary: 'نمایش نمونه‌کارها و کاتالوگ محصولات دکوراسیون داخلی با گالری‌های تصویری نوری باکیفیت.',
    impactMetrics: [
      { label: 'تعامل کاربران', value: '+۳۰۰٪', change: 'مشاهده ژورنال‌ها' },
      { label: 'سفارشات مشاوره دکور', value: '+۲۲۰٪', change: 'ثبت فرم آنلاین' },
      { label: 'سرعت نمایش عکس‌ها', value: 'فوق‌العاده', change: 'فرمت WebP' }
    ],
    tags: ['Decoration', 'Interior Design', 'React', 'Gallery UI', 'Luxury Layout'],
    fullDescription: 'خورشید دکور ارائه‌دهنده خدمات لوکس بازسازی، کاغذدیواری، پارکت و دکوراسیون داخلی است. با طراحی وب‌سایتی با تم تاریک لوکس و طلایی، حس کیفیت و ظرافت به بینندگان منتقل شد.',
    challengeText: 'کندی بارگذاری آلبوم نمونه‌کارهای باکیفیت بالا در وب‌سایت قدیمی.',
    solutionText: 'استفاده از سیستم بارگذاری lazy و فرمت‌های مدرن تصویر جهت بارگذاری فوری بدون افت کیفیت.',
    resultsText: 'افزایش ۳ برابری زمان حضور بازدیدکنندگان در سایت و ثبت ده‌ها سفارش اجرای دکوراسیون.',
    techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
    clientQuote: 'زیبایی چشمگیر سایت خورشید دکور دقیقا منعکس‌کننده کیفیت کارهای اجرایی ماست.'
  },
  {
    id: 'kavion-pharmed',
    title: 'پورتال شرکتی و دارویی کاویون فارمد',
    client: 'کاویون فارمد (Kavion Pharmed)',
    clientRole: 'مدیر روابط عمومی و بین‌الملل',
    clientAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    category: 'web',
    categoryLabel: 'وب‌سایت شرکتی دارویی و پزشکی',
    thumbnail: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1000&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1200&q=80'
    ],
    year: '۲۰۲۵',
    duration: '۲.۵ ماه زمان اجرا',
    summary: 'طراحی پورتال دو زبانه معرفی داروها، مکمل‌ها و استاندارد‌های پزشکی کاویون فارمد با امنیت بالا.',
    impactMetrics: [
      { label: 'پشتیبانی دو زبانه', value: 'فارسی / انگلیسی', change: 'صادراتی' },
      { label: 'امتیاز امنیت فنی', value: '۱۰۰٪', change: 'رمزنگاری کامل' },
      { label: 'دسترسی کاتالوگ دارویی', value: 'سریع و امن', change: 'استاندارد FDA' }
    ],
    tags: ['Pharma', 'Multilingual', 'React', 'Corporate Portal', 'Secure Architecture'],
    fullDescription: 'شرکت کاویون فارمد فعال در حوزه تولید و واردات محصولات دارویی و مکمل‌های سلامتی است. سیگنالوکس پورتال رسمی این شرکت را با رعایت دقیق استانداردهای دارویی و پزشکی طراحی و پیاده‌سازی نمود.',
    challengeText: 'نیاز به وب‌سایتی با دو زبان کامل جهت ارتباط با شرکای تجاری بین‌المللی و نمایش کاتالوگ داروهای تاییدشده.',
    solutionText: 'پیاده‌سازی معماری چندزبانه چابک، جستجوی بر اساس نام ژنریک داروها و قابلیت دانلود بروشورهای رسمی.',
    resultsText: 'ارتقای اعتبار برند در تعاملات خارجی و ایجاد مرجعی مطمئن برای پزشکان و داروخانه‌ها.',
    techStack: ['React', 'TypeScript', 'Tailwind CSS', 'i18n Engine'],
    clientQuote: 'پورتال کاویون فارمد استانداردهای بین‌المللی ما را در فضای وب به بهترین شکل به نمایش گذاشته است.'
  },
  {
    id: 'rush-set',
    title: 'دیجیتال مارکتینگ و فروشگاه پوشاک راش ست',
    client: 'راش ست (Rush Set)',
    clientRole: 'مدیر برند راش ست',
    clientAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    category: 'marketing',
    categoryLabel: 'مارکتینگ و توسعه وب‌سایت پوشاک',
    thumbnail: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=1000&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=1200&q=80'
    ],
    year: '۲۰۲۴',
    duration: '۳ ماه کمپین و توسعه',
    summary: 'طراحی فروشگاه آنلاین پوشاک اسپرت و ست‌های مدرن همراه با اجرای کمپین‌های تبلیغاتی موفق.',
    impactMetrics: [
      { label: 'نرخ بازگشت سرمایه ROAS', value: '۴۵۰٪', change: 'کمپین تبلیغاتی' },
      { label: 'فروش ست‌های آنلاین', value: '+۲۹۰٪', change: 'جهش فروش' },
      { label: 'دنبال‌کنندگان جدید', value: '+۳۵,۰۰۰', change: 'جذب مشتری' }
    ],
    tags: ['Apparel', 'E-Commerce', 'Performance Marketing', 'Rush Set', 'Social Ads'],
    fullDescription: 'برند راش ست ارائه‌دهنده ست‌های پوشاک مدرن، اسپرت و خیابانی است. ترکیب فروشگاه پرسرعت اختصاصی با کمپین‌های اینفلونسر مارکتینگ و گوگل ادز، راش ست را به ترند فروش آنلاین تبدیل کرد.',
    challengeText: 'شناخته‌نشده بودن برند در فضای آنلاین و اتکا به فروش حضوری.',
    solutionText: 'راه‌اندازی سایت مدرن با قابلیت ویدیو-محتوا و اجرای کمپین‌های پرفورمنس مارکتینگ.',
    resultsText: 'فروش فوق‌العاده تمام کالکشن‌های جدید راش ست در کمتر از یک هفته از رونمایی.',
    techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Meta Ads', 'Analytics'],
    clientQuote: 'با کمک تیم سیگنالوکس، راش ست از یک فروشگاه محلی به یک برند کشوری پوشاک تبدیل شد.'
  },
  {
    id: 'pixlim',
    title: 'پلتفرم خدمات دیجیتال و خلاقیت پیکسلیم',
    client: 'استودیو پیکسلیم (Pixlim)',
    clientRole: 'مدیر خلاقیت',
    clientAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    category: 'web',
    categoryLabel: 'توسعه وب‌سایت و پلتفرم گرافیک',
    thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1000&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80'
    ],
    year: '۲۰۲۵',
    duration: '۲ ماه زمان توسعه',
    summary: 'توسعه پلتفرم ارائه‌دهنده ابزارها، قالب‌های گرافیکی و خدمات دیجیتال پیکسلیم با سرعت نوری.',
    impactMetrics: [
      { label: 'دانلود فایل‌های دیجیتال', value: '۱۵۰,۰۰۰+', change: 'بدون کندی سرور' },
      { label: 'سرعت پاسخگویی پلتفرم', value: '۹۹ms', change: 'زیرساخت اختصاصی' },
      { label: 'رضایت طراحان', value: '۹۸.۵٪', change: 'تجربه کاربری روژ' }
    ],
    tags: ['Digital Assets', 'Pixlim', 'React', 'Fast Download', 'Dark UI'],
    fullDescription: 'پیکسلیم مرجع ارائه فایل‌های لایه‌باز، ابزارهای گرافیک و خدمات وب است. تیم سیگنالوکس پلتفرمی با قابلیت تحویل فوری فایل‌ها پس از خرید، پیش‌نمایش زنده طرح‌ها و داشبورد طراحان خلق کرد.',
    challengeText: 'حجم بالای دانلود همزمان فایل‌های سنگین گرافیکی و فشار روی پهنای باند.',
    solutionText: 'استفاده از شبکه‌های توزیع محتوا (CDN) پیشرفته و سرورهای توزیع‌شده برای تحویل آنی دانلودها.',
    resultsText: 'ارائه بی‌نقص خدمات به بیش از ۱۵۰ هزار طراح و طراح وب در سراسر کشور.',
    techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Node.js CDN Stream'],
    clientQuote: 'پیکسلیم با معماری فوق‌العاده سیگنالوکس به یکی از چابک‌ترین سایت‌های دانلود طرح تبدیل شد.'
  },
  {
    id: 'diako-cosmetic',
    title: 'بهینه‌سازی سئو و مارکتینگ دیاکو کازمتیک',
    client: 'دیاکو کازمتیک (Diako Cosmetic)',
    clientRole: 'مدیر فروش و سئو',
    clientAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
    category: 'seo',
    categoryLabel: 'سئو و برندینگ زیبایی',
    thumbnail: 'https://images.unsplash.com/photo-1522338228048-91118953610f?auto=format&fit=crop&w=1000&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1522338228048-91118953610f?auto=format&fit=crop&w=1200&q=80'
    ],
    year: '۲۰۲۴',
    duration: '۴ ماه سئوی پیوسته',
    summary: 'رشد ارگانیک و افزایش ۲۵۰ درصدی ترافیک گوگل در حوزه محصولات آرایشی، بهداشتی و تخصصی پوست.',
    impactMetrics: [
      { label: 'رشد ورودی گوگل', value: '+۲۵۰٪', change: 'ترافیک خریدار' },
      { label: 'کلمات صفحه اول', value: '۶۲ کلمه', change: 'حوزه آرایشی' },
      { label: 'افزایش فروش روزانه', value: '+۱۸۰٪', change: 'ثبت سفارش ارگانیک' }
    ],
    tags: ['SEO', 'Diako Cosmetic', 'Beauty SEO', 'Search Rank', 'Organic Sales'],
    fullDescription: 'دیاکو کازمتیک عرضه کننده محصولات تخصصی مراقبت از پوست و مو است. استراتژی سئوی دیتامحور سیگنالوکس شامل پاسخ به سوالات متداول مشتریان پوست، ممیزی فنی و لینک‌سازی طبیعی باعث ارتقای رتبه سایت در گوگل گردید.',
    challengeText: 'سخت بودن رقابت با سایت‌های قدیمی فروش دارو و محصولات آرایشی.',
    solutionText: 'تمرکز بر کلمات کلیدی تخصصی درمان پوست و تولید مقالات مشاوره خرید محصول.',
    resultsText: 'تصاحب لینک‌های برتر گوگل در کلمات کلیدی ارزشمند آرایشی و افزایش ۲.۵ برابری فروش.',
    techStack: ['Ahrefs', 'Search Console', 'Google Analytics 4', 'Schema Builder'],
    clientQuote: 'سئوی دیاکو کازمتیک با سیگنالوکس نتایجی فراتر از انتظارات ما به همراه داشت.'
  },
  {
    id: 'toranj-carpet',
    title: 'پلتفرم فروش آنلاین فرش‌های ماشینی و دستباف ترنج',
    client: 'فرش ترنج (Toranj Carpet)',
    clientRole: 'مدیر هلدینگ فرش ترنج',
    clientAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    category: 'web',
    categoryLabel: 'فروشگاه تخصصی فرش و دکوراسیون',
    thumbnail: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=1000&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=1200&q=80'
    ],
    year: '۲۰۲۵',
    duration: '۳ ماه زمان اجرای پروژه',
    summary: 'طراحی کاتالوگ لایه‌باز و فروشگاه آنلاین فرش با قابلیت زوم باکیفیت روی بافت و نقشه‌ها.',
    impactMetrics: [
      { label: 'زوم باکیفیت فرش', value: 'حداکثر دقت', change: 'نمایش تار و پود' },
      { label: 'فروش به سراسر کشور', value: '+۳۴0٪', change: 'ارسال مستقیم' },
      { label: 'مدت زمان حضور کاربر', value: '+۸ دقیقه', change: 'بررسی طرح‌ها' }
    ],
    tags: ['Carpet Store', 'Toranj', 'React', 'High-Res Zoom', 'E-Commerce'],
    fullDescription: 'فرش ترنج از برندهای باسابقه فرش کاشان و ایران است. تیم سیگنالوکس پلتفرمی اختصاصی برای نمایش طرح‌ها با قابلیت پرو مجازی در چیدمان خانه و امکان مشاهده جزئیات بافت فرش با زوم میکروسکوپی پیاده‌سازی کرد.',
    challengeText: 'تردید خریداران آنلاین در انتخاب طرح و رنگ واقعی فرش بدون دیدن از نزدیک.',
    solutionText: 'پیاده‌سازی ابزار پیش‌نمایش چیدمان فرش در پذیرایی و سیستم زوم پیشرفته بدون افت سرعت.',
    resultsText: 'ایجاد اطمینان کامل در خریداران و افزایش ۳۴۰ درصدی خریدهای غیرحضوری فرش.',
    techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Canvas Zoom Engine'],
    clientQuote: 'خریداران فرش ترنج اکنون با اطمینان کامل فرش منزل خود را آنلاین انتخاب می‌کنند.'
  },
  {
    id: 'afshan-carpet',
    title: 'استراتژی جامع سئوی فروشگاه آنلاین فرش افشان',
    client: 'فرش افشان (Afshan Carpet)',
    clientRole: 'مدیر دیجیتال مارکتینگ',
    clientAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80',
    category: 'seo',
    categoryLabel: 'سئو و رشد ارگانیک صنایع فرش',
    thumbnail: 'https://images.unsplash.com/photo-1575414003591-ece8d0416c7a?auto=format&fit=crop&w=1000&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1575414003591-ece8d0416c7a?auto=format&fit=crop&w=1200&q=80'
    ],
    year: '۲۰۲۴',
    duration: '۶ ماه سئوی تخصصی',
    summary: 'کسب رتبه‌های ۱ گوگل در کلمات پرجستجوی خرید فرش ۱۲۰۰ شانه، فرش کاشان و سجاده‌فرش.',
    impactMetrics: [
      { label: 'ورودی ارگانیک روزانه', value: '۴۰,۰۰۰+', change: 'از موتورهای جستجو' },
      { label: 'کلمات لینک ۱ گوگل', value: '۹۵ کلمه', change: 'کلمات خریدمحور' },
      { label: 'رشد درآمد آنلاین', value: '+۴۱۰٪', change: 'افزایش فروش نهایی' }
    ],
    tags: ['SEO', 'Afshan Carpet', 'Organic Growth', 'Content Strategy', 'Google Rank 1'],
    fullDescription: 'صنایع فرش افشان تولیدکننده انواع فرش‌های ماشینی ۱۲۰۰ و ۱۵۰۰ شانه است. سئوی عمیق فنی و ساخت کلاسترهای تخصصی فرش توسط سیگنالوکس، فرش افشان را در صدر نتایج گوگل قرار داد.',
    challengeText: 'حضور رقبا با هزینه‌های سنگین تبلیغاتی و نیاز به جذب ترافیک بدون اتکا به تبلیغات کلیکی.',
    solutionText: 'بهینه‌سازی فنی صفحات محصول، ساخت اسکیماهای قیمت و موجودی، و تولید محتوای تخصصی خرید فرش.',
    resultsText: 'تسلط کامل بر عبارت‌های پرجستجوی فرش در ایران و رشد ۴۱۰ درصدی درآمد.',
    techStack: ['Ahrefs', 'Search Console', 'Screaming Frog', 'Technical SEO'],
    clientQuote: 'فرش افشان به لطف برنامه‌ریزی سئوی سیگنالوکس، لیدر سئوی فرش ایران است.'
  },
  {
    id: 'behnam-jahanbakhshi',
    title: 'وب‌سایت شخصی و پرسونال برندینگ بهنام جهانبخشی',
    client: 'استاد بهنام جهانبخشی',
    clientRole: 'مدرس و مشاور ارشد',
    clientAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    category: 'web',
    categoryLabel: 'پرسونال برندینگ و پلتفرم آموزشی',
    thumbnail: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=1000&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=1200&q=80'
    ],
    year: '۲۰۲۵',
    duration: '۴۵ روز زمان اجرا',
    summary: 'طراحی پرسپکتیو لوکس شخصی، سیستم رزرو وقت مشاوره آنلاین و ارائه دوره‌های آموزشی اختصاصی.',
    impactMetrics: [
      { label: 'رزرو خودکار جلسات', value: '۱۰۰٪', change: 'درگاه آنلاین' },
      { label: 'رضایت مخاطبان', value: '۹۹.۸٪', change: 'تجربه کاربری عالی' },
      { label: 'ثبت‌نام دوره‌ها', value: '+۳۲۰٪', change: 'افزایش دانش‌پذیران' }
    ],
    tags: ['Personal Branding', 'Booking System', 'React', 'Education', 'Minimal UI'],
    fullDescription: 'استاد بهنام جهانبخشی مشاور و مدرس برجسته است. وب‌سایت شخصی ایشان با طراحی مینیمال، مدرن و شکیل با سیستم رزرو وقت جلسه، دریافت آنلاین حق مشاوره و دسترسی به ویدیوهای آموزشی پیاده‌سازی گردید.',
    challengeText: 'مدیریت دستی تقویم جلسات و تداخل وقت‌های مشاوره.',
    solutionText: 'طراحی تقویم هوشمند آنلاین با قابلیت انتخاب تایم‌های خالی و پرداخت آنی.',
    resultsText: 'خودکارسازی کامل رزرو جلسات و ارتقای پرستیژ پرسونال برندینگ.',
    techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Booking Engine'],
    clientQuote: 'وب‌سایت شخصی من با طراحی سیگنالوکس تمام انتظاراتم از یک پلتفرم حرفه‌ای را برآورده کرد.'
  },
  {
    id: 'hourglass-shapewear',
    title: 'کمپین فروش و توسعه وب‌سایت گن ساعت شنی',
    client: 'فروشگاه گن ساعت شنی',
    clientRole: 'مدیر فروشگاه',
    clientAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    category: 'marketing',
    categoryLabel: 'دیجیتال مارکتینگ و E-Commerce',
    thumbnail: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80'
    ],
    year: '۲۰۲۴',
    duration: '۲ ماه زمان اجرا',
    summary: 'طراحی لندینگ پیج‌های پرفروش و اجرای کمپین‌های تبلیغاتی با بازدهی بالای خریداران گن و شکم‌بند لاتکس.',
    impactMetrics: [
      { label: 'نرخ تبدیل لندینگ', value: '۶.۸٪', change: 'فوق‌العاده بالا' },
      { label: 'فروش روزانه محصول', value: '+۳۸۰٪', change: 'رشد بی‌سابقه' },
      { label: 'بازگشت سرمایه ROAS', value: '۵۲۰٪', change: 'کمپین‌های موفق' }
    ],
    tags: ['Landing Page', 'Shapewear', 'Marketing', 'High Conversion', 'Fast Checkout'],
    fullDescription: 'فروشگاه گن ساعت شنی مرجع اصلی ارائه انواع گن‌های لاتکس اصل کلمبیا است. سیگنالوکس لندینگ پیج‌های اختصاصی با متدهای روانشناسی فروش و گواهی اصالت کالا طراحی و کمپین‌های مارکتینگ پربازده اجرا کرد.',
    challengeText: 'وجود محصولات تقلب مشابه در بازار و نیاز به اعتمادسازی عمیق در خریداران.',
    solutionText: 'طراحی صفحات فرود با ویدیوهای تست کیفیت، جدول سایزبندی دقیق و ضمانت بازگشت وجه.',
    resultsText: 'ثبت رکورد فروش روزانه و جذب هزاران خریدار وفادار.',
    techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Conversion Funnel'],
    clientQuote: 'لندینگ پیج‌های سیگنالوکس قدرت فروشی فراتر از حد تصور برای گن ساعت شنی ایجاد کردند.'
  },
  {
    id: 'tagcell',
    title: 'پلتفرم فروشگاهی و تامین قطعات تگسل',
    client: 'تگسل (Tagcell)',
    clientRole: 'مدیر فناوری و B2B',
    clientAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80',
    category: 'web',
    categoryLabel: 'توسعه وب‌سایت و B2B قطعات',
    thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80'
    ],
    year: '۲۰۲۵',
    duration: '۳ ماه زمان اجرا',
    summary: 'سامانه یکپارچه سفارش‌گیری، استعلام قیمت عمده و توزیع قطعات الکترونیک و موبایل تگسل.',
    impactMetrics: [
      { label: 'سفارشات عمده B2B', value: '+۲۷۰٪', change: 'خودکارسازی سیستم' },
      { label: 'تعداد تعمیرکاران عضو', value: '۱۲,۰۰۰+', change: 'شبکه تامین' },
      { label: 'زمان پردازش سفارش', value: 'زیر ۵ دقیقه', change: 'انبارداری هوشمند' }
    ],
    tags: ['B2B Store', 'Tagcell', 'React', 'Electronics Parts', 'Wholesale Engine'],
    fullDescription: 'تگسل تامین‌کننده بزرگ قطعات جانبی، بردها و آی‌سی‌های الکترونیکی به تعمیرکاران سراسر کشور است. سیستم قیمت‌گذاری سطح‌بندی شده برای همکاران و ثبت سفارشات عمده توسط سیگنالوکس پیاده‌سازی شد.',
    challengeText: 'پیچیدگی قیمت‌گذاری متفاوت برای مشتریان خرد و همکاران عمده‌فروش.',
    solutionText: 'طراحی سیستم سطوح کاربری با نمایش اتوماتیک تخفیف‌های همکاری پس از احراز هویت.',
    resultsText: 'عضویت بیش از ۱۲ هزار همکار و تعمیرکار و تسهیل کامل فرآیند توزیع.',
    techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Role-based Access'],
    clientQuote: 'تگسل با پلتفرم اختصاصی سیگنالوکس به بزرگترین شبکه تامین قطعات الکترونیک تبدیل شد.'
  },
  {
    id: 'bahman-melk',
    title: 'سامانه هوشمند املاک و سرمایه‌گذاری بهمن ملک',
    client: 'دپارتمان املاک بهمن ملک',
    clientRole: 'مدیر دپارتمان املاک',
    clientAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    category: 'web',
    categoryLabel: 'پلتفرم املاک و مستغلات',
    thumbnail: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1000&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80'
    ],
    year: '۲۰۲۵',
    duration: '۳ ماه زمان توسعه',
    summary: 'طراحی سامانه ثبت و جستجوی پیشرفته فایل‌های ملکی، نقشه تعاملی و ثبت آنلاین ملک توسط مالکین.',
    impactMetrics: [
      { label: 'فایل‌های ملکی ثبت شده', value: '۲۵,۰۰۰+', change: 'نقشه تعاملی' },
      { label: 'جذب خریداران سرمایه‌گذار', value: '+۳۱۰٪', change: 'ارائه تحلیل ملک' },
      { label: 'زمان جستجوی ملک', value: 'زیر ۱۰ ثانیه', change: 'فیلتر هوشمند' }
    ],
    tags: ['Real Estate', 'Bahman Melk', 'React', 'Interactive Map', 'Property Search'],
    fullDescription: 'دپارتمان بهمن ملک فعال در حوزه خرید، فروش و سرمایه‌گذاری ملکی است. با طراحی سامانه بهمن ملک، کاربران می‌توانند فایل‌های ملکی را روی نقشه ببینند، ویدیو تور مجازی ملک را مشاهده کنند و با مشاور مربوطه ارتباط بگیرند.',
    challengeText: 'سختی پیدا کردن ملک‌های مناسب بر روی نقشه با فیلترهای قیمت، متراژ و منطقه.',
    solutionText: 'پیاده‌سازی نقشه هوشمند آنلاین با فیلترهای چندگانه و فرم ثبت رایگان ملک برای مالکین.',
    resultsText: 'افزایش ۳۱۰ درصدی تماس‌های متقاضیان واقعی خرید و فروش ملک.',
    techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Map Engine'],
    clientQuote: 'سامانه بهمن ملک سرعت و شفافیت معاملاتی ما را به شکلی استثنایی افزایش داد.'
  },
  {
    id: 'milad-berluti',
    title: 'پلتفرم لوکس، وب‌اپلیکیشن و فروشگاه آنلاین میلاد برلوتی',
    client: 'برند میلاد برلوتی (Milad Berluti)',
    clientRole: 'مدیر ارشد برند',
    clientAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    category: 'web',
    categoryLabel: 'فروشگاه لوکس پوشاک و استایل',
    thumbnail: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1000&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1200&q=80'
    ],
    year: '۲۰۲۵',
    duration: '۲.۵ ماه زمان توسعه',
    summary: 'طراحی وب‌سایت و وب‌اپلیکیشن اختصاصی برند میلاد برلوتی با معماری نوری، شخصی‌سازی و خرید چابک.',
    impactMetrics: [
      { label: 'رشد فروش آنلاین', value: '+۲۸۰٪', change: 'سفارشات کشوری' },
      { label: 'زمان حضور کاربر', value: '۸.۵ دقیقه', change: 'تعامل بالای visual' },
      { label: 'سرعت بارگذاری', value: '۰.۹ ثانیه', change: 'لود آنی گالری' }
    ],
    tags: ['Milad Berluti', 'Luxury Store', 'React', 'Fashion', 'Fast Checkout'],
    fullDescription: 'برند میلاد برلوتی ارائه‌دهنده پوشاک و استایل لاکچری مردانه است. تیم سیگنالوکس با طراحی و توسعه وب‌سایتی بسیار شیک با تم مشکی طلایی، نمایش ۳۶۰ درجه محصولات و سیستم ثبت سفارش روان، تجربه خرید فوق‌العاده‌ای را رقم زد.',
    challengeText: 'نیاز به انعکاس حس لوکس بودن برند در فضای دیجیتال و نمایش تصاویر باکیفیت بدون افت سرعت.',
    solutionText: 'پیاده‌سازی رابط کاربری مدرن با انیمیشن‌های روان، بهینه‌سازی فرمت تصاویر به WebP و تسویه‌حساب دو مرحله‌ای.',
    resultsText: 'افزایش ۲۸۰ درصدی خریدهای آنلاین غیرحضوری و جلب رضایت مشتریان خاص برند میلاد برلوتی.',
    techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Node.js API'],
    clientQuote: 'سیگنالوکس تمام ظرافت و لوکس بودن برند میلاد برلوتی را به فضای وب منتقل کرد.'
  },
  {
    id: 'one-posh-boutique',
    title: 'فروشگاه آنلاین و برندینگ دیجیتال بوتیک وان پوش',
    client: 'بوتیک وان پوش (One Posh Boutique)',
    clientRole: 'مدیر بوتیک وان پوش',
    clientAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    category: 'web',
    categoryLabel: 'فروشگاه پوشاک و استایل زنانه',
    thumbnail: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1000&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80'
    ],
    year: '۲۰۲۴',
    duration: '۲ ماه زمان اجرا',
    summary: 'طراحی پلتفرم فروشگاهی اختصاصی پوشاک زنانه، کالکشن‌های فصلی و ثبت سفارش سریع آنلاین.',
    impactMetrics: [
      { label: 'افزایش فروش کالکشن‌ها', value: '+۳۲۰٪', change: 'رشد خریداران' },
      { label: 'بازدیدهای موبایل', value: '۹۱٪', change: 'بهینه‌سازی کامل' },
      { label: 'کاهش انصراف از خرید', value: '-۵۰٪', change: 'تسویه آسان' }
    ],
    tags: ['Boutique', 'One Posh', 'Fashion', 'React', 'Mobile First'],
    fullDescription: 'بوتیک وان پوش ارائه‌دهنده جدیدترین کالکشن‌های پوشاک و اکسسوری زنانه است. تیم سیگنالوکس با ایجاد محیطی جذاب، فیلتر سایز و رنگ هوشمند و اتصال به درگاه پرداخت مستقیم، فرآیند خرید آنلاین را بسیار آسان و دلنشین ساخت.',
    challengeText: 'سرعت پایین بارگذاری لباس‌ها در اینستاگرام و ریزش مشتریان در پاسخگویی دایرکت.',
    solutionText: 'انتقال کامل خریداران به وب‌سایت اختصاصی با قابلیت مشاهده زنده موجودی و فیلتر بر اساس سایز.',
    resultsText: 'کاهش بار کاری پشتیبانی دایرکت و ثبت ۳۲۰٪ سفارشات بیشتر به صورت اتوماتیک از طریق سایت.',
    techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Fast Checkout Engine'],
    clientQuote: 'با وب‌سایت وان پوش، فروشگاه ما ۲۴ ساعته بدون وقفه در حال ثبت سفارش است.'
  },
  {
    id: 'netshop-persian-gulf',
    title: 'پلتفرم جامع فروشگاهی و تجارت الکترونیک نت شاپ خلیج فارس',
    client: 'نت شاپ خلیج فارس (NetShop Persian Gulf)',
    clientRole: 'مدیر فناوری و بازرگانی',
    clientAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    category: 'web',
    categoryLabel: 'پلتفرم E-Commerce و کالا',
    thumbnail: 'https://images.unsplash.com/photo-1556742049-0a670f4a4591?auto=format&fit=crop&w=1000&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1556742049-0a670f4a4591?auto=format&fit=crop&w=1200&q=80'
    ],
    year: '۲۰۲۵',
    duration: '۳ ماه زمان توسعه',
    summary: 'طراحی سامانه فروشگاهی پرسرعت نت شاپ خلیج فارس با قابلیت مدیریت هزاران کالا و سیستم پرداخت چندگانه.',
    impactMetrics: [
      { label: 'تراکنش‌های موفق روزانه', value: '+۳۵۰٪', change: 'رشد حجم فروش' },
      { label: 'جستجوی آنی محصولات', value: '۴۵ms', change: 'موتور فیلتر سریع' },
      { label: 'مشتریان وفادار', value: '۱۸,۰۰۰+', change: 'سیستم باشگاه مشتریان' }
    ],
    tags: ['NetShop', 'E-Commerce', 'React', 'Persian Gulf', 'Fast Search'],
    fullDescription: 'نت شاپ خلیج فارس مرکز بزرگ عرضه کالا، لوازم دیجیتال و خانگی در جنوب کشور است. سیگنالوکس پلتفرم فروشگاهی پرقدرتی با جستجوی هوشمند، محاسبه خودکار هزینه پست و باربری و پنل پیگیری سفارشات لحظه‌ای پیاده‌سازی کرد.',
    challengeText: 'نیاز به سامانه‌ای با توانایی مدیریت تنوع بالایی از محصولات و محاسبه دقیق هزینه ارسال به سراسر کشور.',
    solutionText: 'توسعه فرانت‌اند چندلایه چابک با اتکای به React، استعلام آنی کد رهگیری پستی و فیلتر دقیق کالاها.',
    resultsText: 'دست‌یابی به رشد ۳۵۰ درصدی تراکنش‌ها و رضایت بالای خریداران از سراسر ایران.',
    techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Shipping Calculator', 'Node.js Express'],
    clientQuote: 'نت شاپ خلیج فارس با زیرساخت سیگنالوکس به یکی از مطرح‌ترین فروشگاه‌های آنلاین کشور بدل شده است.'
  }
];

export const CERTIFICATES_DATA: CertificateItem[] = [
  {
    id: 'google-analytics-4-master',
    title: 'گواهی‌نامه تخصصی گوگل آنالیتیکس ۴ (GA4)',
    issuer: 'Google Skillshop / Digital Academy',
    issueDate: 'نوامبر ۲۰۲۵',
    credentialId: 'GA4-SIG-99824',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
    badgeType: 'cyan',
    description: 'تایید صلاحیت حرفه‌ای در تحلیل رفتاری کاربران، پیاده‌سازی ایونت‌های اختصاصی و مدل‌سازی نرخ تبدیل داده‌محور.',
    skills: ['Event Tracking', 'Attribution Modeling', 'Custom Dashboards', 'User Journey Mapping']
  },
  {
    id: 'hubspot-inbound-marketing',
    title: 'مدرک بین‌المللی اینباند مارکتینگ هاب‌اسپات',
    issuer: 'HubSpot Academy',
    issueDate: 'آگوست ۲۰۲۵',
    credentialId: 'HS-INB-77201',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80',
    badgeType: 'gold',
    description: 'تسلط کامل بر تکنیک‌های جذب جاذبه‌ای مخاطب، اتوماسیون بازاریابی و بهینه‌سازی چرخه عمر مشتری (LTV).',
    skills: ['Inbound Strategy', 'Lead Nurturing', 'CRM Automation', 'Content Funnels']
  },
  {
    id: 'google-search-seo-expert',
    title: 'گواهی بهینه‌سازی فنی و محتوایی گوگل (SEO Professional)',
    issuer: 'Google Search Console Academy',
    issueDate: 'ژانویه ۲۰۲۶',
    credentialId: 'GSEO-CERT-2026-X',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
    badgeType: 'purple',
    description: 'گواهی پیشرفته معماران سئو شامل Core Web Vitals، بهینه‌سازی ساختار داده‌ها و معماری ایندکس سریع.',
    skills: ['Core Web Vitals', 'Structured Data', 'Technical Audit', 'Indexability']
  },
  {
    id: 'react-fullstack-architecture',
    title: 'دیپلم ارشد معماری وب‌اپلیکیشن‌های پیشرفته',
    issuer: 'International Web Standards Institute',
    issueDate: 'اکتبر ۲۰۲۵',
    credentialId: 'WSI-REACT-8819',
    image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80',
    badgeType: 'cyan',
    description: 'تخصص در توسعه برنامه‌های فرانت‌اند پرسرعت با React، انیمیشن‌های مبتنی بر GPU و دسترسی‌پذیری عالی.',
    skills: ['React 19', 'Performance Optimization', 'WebGL Animation', 'Accessibility']
  },
  {
    id: 'iso-9001-quality-service',
    title: 'گواهی‌نامه استاندارد مدیریت کیفیت خدمات فناوری ISO 9001',
    issuer: 'International Quality Assessment Group',
    issueDate: 'دسامبر ۲۰۲۵',
    credentialId: 'ISO-9001-SIG-2025',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
    badgeType: 'gold',
    description: 'تضمین کیفیت فرآیندهای توسعه، امنیت اطلاعات پروژه‌های مشتریان و مدیریت منظم زمان‌بندی تحویل.',
    skills: ['Quality Assurance', 'Project Governance', 'Risk Management', 'Agile Delivery']
  }
];

export const TESTIMONIALS_DATA: Testimonial[] = [
  {
    id: 'test-1',
    name: 'مهندس آرش شریفی',
    role: 'مدیرعامل و هم‌بنیان‌گذار',
    company: 'هلدینگ سرمایه‌گذاری نکسوس',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    quote: 'همکاری با سیگنالوکس سطح درک ما از کیفیت توسعه وب را تغییر داد. سرعت لود سایت و انیمیشن‌های فوق‌العاده روان، اعتماد مشتریان بزرگ سرمایه‌گذاری را جلب کرد.',
    rating: 5,
    resultsAchieved: 'رشد ۳.۵ برابری جذب مشتریان VIP'
  },
  {
    id: 'test-2',
    name: 'دکتر مریم امینی',
    role: 'مدیر مارکتینگ',
    company: 'شبکه کلینیک‌های زیبایی اورا',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    quote: 'کمپین دیجیتال مارکتینگ سیگنالوکس و سئوی منظم آن‌ها باعث شد ظرف چند ماه بدون هزینه‌های هنگفت تبلیغاتی، تمام ظرفیت‌های نوبت‌دهی ما پر شود.',
    rating: 5,
    resultsAchieved: 'تکمیل ۱۰۰٪ ظرفیت نوبت‌دهی آنلاین'
  },
  {
    id: 'test-3',
    name: 'رضا کامران',
    role: 'مدیر ارشد دیجیتال',
    company: 'فروشگاه‌های زنجیره‌ای آیرون',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    quote: 'تیم سئوی سیگنالوکس با دانش عمیق فنی، پیچیده‌ترین مشکلات سرچ کنسول و ساختار سایت ما را رفع کردند. رتبه‌های اول گوگل اکنون متعلق به ماست.',
    rating: 5,
    resultsAchieved: '+۴۸۰٪ ورودی ارگانیک در ۶ ماه'
  }
];

export const SERVICES = SERVICES_DATA;

export const SERVICE_PRICING_ESTIMATOR = {
  web: {
    title: 'توسعه وب‌سایت اختصاصی',
    options: [
      {
        title: 'سطح ۱: استارتاپ / شرکت استاندارد',
        desc: 'طراحی اختصاصی UI/UX، کدنویسی React/Next.js، پشتیبانی ۶ ماهه و تحویل سریع.',
        priceRange: '۳۵ تا ۶۵ میلیون تومان',
        duration: '۳ الی ۴ هفته کاری',
        features: ['طراحی اختصاصی بدون قالب آماده', 'پاسخگویی کاملاً واکنش‌گرا (Responsive)', 'سرعت لود زیر ۱.۵ ثانیه', 'پنل مدیریت اختصاصی']
      },
      {
        title: 'سطح ۲: پلتفرم تجاری / هلدینگ لوکس',
        desc: 'افکت‌های ۳D/WebGL، انیمیشن‌های پیشرفته Kinetic، سئوی فنی کامل و قابلیت‌های PWA.',
        priceRange: '۷۰ تا ۱۲۰ میلیون تومان',
        duration: '۵ الی ۷ هفته کاری',
        features: ['رندرینگ تعاملی سه‌بعدی Three.js', 'بهینه‌سازی کامل Core Web Vitals', 'اتصال به کلیه سرویس‌ها و APIها', 'پشتیبانی ۱ ساله تخصصی']
      },
      {
        title: 'سطح ۳: وب‌اپلیکیشن مقیاس‌پذیر اینترپرایز',
        desc: 'معماری میکروفرانت‌اند، سیستم نوبت‌دهی/مالی پیچیده، امنیت چندلایه و سرور اختصاصی.',
        priceRange: '۱۳۰ تا ۲۵۰+ میلیون تومان',
        duration: '۸ الی ۱۲ هفته کاری',
        features: ['معماری Micro-services', 'آزمایشات نفوذ و دژ امنیتی', 'داشبورد آنالیز زنده داده‌ها', 'SLA و پشتیبانی ۲۴/۷ VIP']
      }
    ]
  },
  seo: {
    title: 'سئو و بهینه‌سازی دیتامحور',
    options: [
      {
        title: 'پکیج پایه: ممیزی و سئوی محلی',
        desc: 'بهینه‌سازی فنی اولیه، گوگل مپ، رفع خطاهای سرچ کنسول و کلمات کلیدی محلی.',
        priceRange: '۱۵ تا ۲۵ میلیون تومان ماهانه',
        duration: 'حداقل دوره ۳ ماهه',
        features: ['ممیزی فنی ۱۰۰ نقطه‌ای', 'اصلاح ساختار لینک‌سازی', 'گزارش‌دهی ماهانه شفاف']
      },
      {
        title: 'پکیج پیشرفته: رشد ارگانیک و رقابتی',
        desc: 'کلاسترینگ محتوایی، لینک‌سازی کلاه سفید، اسکیما نویسی اتوماتیک و رقابت در کلمات اصلی.',
        priceRange: '۳۰ تا ۵۰ میلیون تومان ماهانه',
        duration: 'حداقل دوره ۶ ماهه',
        features: ['کلاسترینگ هوشمند کلمات کلیدی', 'تولید محتوای عمیق تخصصی', 'بهینه‌سازی شاخص‌های سرعت گوگل']
      },
      {
        title: 'پکیج رهبری بازار (Enterprise SEO)',
        desc: 'تثبیت لینک ۱ گوگل در پررقابت‌ترین کلمات کلیدی صنعت، سئوی بین‌المللی و مانیتورینگ آنلاین.',
        priceRange: '۶۰ تا ۹۰+ میلیون تومان ماهانه',
        duration: 'حداقل دوره ۱ ساله',
        features: ['استراتژی لیدربورد صنعت', 'تیم اختصاصی سئو و تولید محتوا', 'پایش لحظه‌ای تغییرات الگوریتم']
      }
    ]
  },
  marketing: {
    title: 'دیجیتال مارکتینگ و پرفورمنس',
    options: [
      {
        title: 'سطح ۱: کمپین‌های تبلیغاتی پربازده',
        desc: 'مدیریت گوگل ادز، تبلیغات همسان (Native) و A/B تست صفحات فرود.',
        priceRange: '۲۰ تا ۳۵ میلیون تومان + بودجه رسانه',
        duration: 'پروژه‌ای یا ماهانه',
        features: ['طراحی لندینگ پیج اختصاصی', 'تنظیم پیکسل‌ها و ردیابی رویدادها', 'گزارش دقیق ROAS']
      },
      {
        title: 'سطح ۲: مارکتینگ ۳۶۰ درجه رشد',
        desc: 'بازطراحی قیف فروش، بازاریابی محتوایی ویروسی، سناریونویسی و مدیریت شبکه‌های اجتماعی.',
        priceRange: '۴۵ تا ۷۵ میلیون تومان ماهانه',
        duration: 'حداقل دوره ۳ ماهه',
        features: ['سناریونویسی و ساخت تیزر', 'مدیریت کامل شبکه اجتماعی', 'بهینه‌سازی نرخ تبدیل CRO']
      },
      {
        title: 'سطح ۳: راهبرد جامع ریبرندینگ و مقیاس',
        desc: 'هویت بصری لوکس، مدیریت شهرت برند (ORM)، کمپین‌های PR و مارکتینگ بین‌المللی.',
        priceRange: '۸۰ تا ۱۵۰+ میلیون تومان',
        duration: 'سفارشی',
        features: ['سند هویت بصری جامع', 'کمپین‌های روابط عمومی (PR)', 'تحلیل دقیق رفتار کاربر در GA4']
      }
    ]
  }
};

export const PROCESS_STEPS = [
  {
    stepNumber: '۰۱',
    title: 'آنالیز و سیگنال‌سنجی اولیه',
    description: 'بررسی دقیق کسب‌وکار، تحلیل رقبا، شناسایی نقاط ضعف دیجیتال و تحلیل نیازهای واقعی جامعه هدف.',
    icon: 'Search'
  },
  {
    stepNumber: '۰۲',
    title: 'تدوین استراتژی نوری و نقشه راه',
    description: 'طراحی نقشه راه اختصاصی شامل معماری فنی وب، تقویم مارکتینگ و سناریوی رشد بر پایه داده.',
    icon: 'Compass'
  },
  {
    stepNumber: '۰۳',
    title: 'طراحی، کدنویسی و خلق متمایز',
    description: 'پیاده‌سازی دقیق با جدیدترین فناوری‌ها، رابط کاربری با حس لایت و لوکس، و تست‌های فنی چندگانه.',
    icon: 'Cpu'
  },
  {
    stepNumber: '۰۴',
    title: 'اجرای کمپین و بهینه‌سازی پیوسته',
    description: 'انتشار وب‌سایت، شروع کمپین‌های عملکردی، پایش لحظه‌ای رفتار کاربران و A/B تست مداوم.',
    icon: 'Rocket'
  },
  {
    stepNumber: '۰۵',
    title: 'پایش هوشمند و مقیاس‌پذیری',
    description: 'ارائه گزارش‌های تحلیلی شفافه پشتیبانی فنی ۲۴/۷ و ارتقای مداوم پلتفرم بر اساس داده‌های درآمدی.',
    icon: 'Activity'
  }
];
