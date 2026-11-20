export interface ServiceItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'web' | 'marketing' | 'seo';
  iconName: string;
  description: string;
  features: string[];
  metrics: string;
  deliverables: string[];
  techStack?: string[];
  gradient: string;
}

export interface PortfolioProject {
  id: string;
  title: string;
  client: string;
  clientRole?: string;
  clientAvatar?: string;
  category: 'web' | 'marketing' | 'seo';
  categoryLabel: string;
  thumbnail: string;
  galleryImages?: string[];
  year: string;
  duration?: string;
  summary: string;
  impactMetrics: { label: string; value: string; change?: string }[];
  tags: string[];
  fullDescription: string;
  challengeText?: string;
  solutionText?: string;
  resultsText?: string;
  techStack?: string[];
  clientQuote?: string;
  linkUrl?: string;
}

export interface CertificateItem {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  credentialId: string;
  image: string;
  badgeType: 'gold' | 'cyan' | 'purple';
  description: string;
  verificationUrl?: string;
  skills: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  quote: string;
  rating: number;
  resultsAchieved: string;
}

export interface PodcastEpisode {
  id: string;
  clientName: string;
  clientRole: string;
  company: string;
  avatar: string;
  title: string;
  audioUrl: string;
  duration: string;
  quote: string;
  tags: string[];
  rating?: number;
  isPublished?: boolean;
  sortOrder?: number;
  createdAt?: string;
}

export interface VideoTestimonial {
  id: string;
  clientName: string;
  clientRole: string;
  company: string;
  thumbnail: string;
  videoUrl: string;
  title: string;
  duration: string;
  quote: string;
  projectCategory?: string;
  rating?: number;
  isPublished?: boolean;
  sortOrder?: number;
  createdAt?: string;
}

export interface ConsultationFormData {
  fullName: string;
  phoneNumber: string;
  businessName: string;
  serviceType: string;
  budgetRange: string;
  message: string;
}

// -------------------------------------------------------------
// Typography & Font Configuration (Shabnam Specific & Per-Tag Settings)
// -------------------------------------------------------------
export type AvailableFontFamily = 'Shabnam';

export interface TagTypographyItem {
  fontSize: string; // e.g. '32px' or '2rem'
  fontWeight: string; // '300' | '400' | '500' | '600' | '700' | '800' | '900'
  lineHeight: string; // '1.2' | '1.4' | '1.6' | '1.8'
  letterSpacing?: string;
}

export interface TagTypographySettings {
  h1: TagTypographyItem;
  h2: TagTypographyItem;
  h3: TagTypographyItem;
  h4: TagTypographyItem;
  h5: TagTypographyItem;
  h6: TagTypographyItem;
  p: TagTypographyItem;
  button: TagTypographyItem;
  small: TagTypographyItem;
  navbar: TagTypographyItem;
}

export interface FontSettings {
  fontFamily: AvailableFontFamily;
  fontSizeBase: string; // '14px' | '15px' | '16px' | '17px' | '18px' | '20px'
  fontHeadingScale: string; // '1.15' | '1.25' | '1.35' | '1.45'
  fontWeightBase: string; // '300' | '400' | '500'
  lineHeightScale?: string; // '1.5' | '1.65' | '1.8'
  letterSpacing?: string; // '-0.02em' | '0' | '0.02em'
  tags?: TagTypographySettings;
}

export interface SiteSettings {
  id?: string;
  siteTitle: string;
  heroHeadline: string;
  heroSubtitle: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  instagramUrl?: string;
  linkedinUrl?: string;
  telegramUrl?: string;
  githubUrl?: string;
  
  // Font & Typography (Exclusive Shabnam)
  fontFamily: AvailableFontFamily | string;
  fontSizeBase: string;
  fontHeadingScale: string;
  fontWeightBase: string;
  lineHeightScale?: string;
  tagsTypography?: TagTypographySettings;

  // Google Integrations
  gtmContainerId?: string;
  gtmEnabled?: boolean;
  gscVerificationCode?: string;
  googleClientId?: string;
  googleLoginEnabled?: boolean;

  // MeliPayamak
  melipayamakUsername?: string;
  melipayamakSenderNumber?: string;
  melipayamakOtpBodyId?: number | string;
  melipayamakEnabled?: boolean;

  // Contact Page Details (All Sections)
  contactDetails?: ContactPageDetails;
}

// -------------------------------------------------------------
// Contact Us Page Comprehensive Details Configuration
// -------------------------------------------------------------
export interface ContactPageDetails {
  // 1. Direct Phone Section
  phoneTitle: string;
  phoneSubtitle: string;
  phoneNumber: string;
  phoneRaw: string;
  phoneCopyButtonText: string;

  // 2. Direct Email Section
  emailTitle: string;
  emailSubtitle: string;
  emailAddress: string;
  emailCopyButtonText: string;

  // 3. Direct Messengers Section
  messengersTitle: string;
  messengersSubtitle: string;
  telegramId: string;
  telegramLink: string;
  whatsappNumber: string;
  whatsappLink: string;
  telegramButtonText: string;
  whatsappButtonText: string;

  // 4. Consultation & Direct Message Form Section
  formTitle: string;
  formSubtitle: string;
  formNamePlaceholder: string;
  formPhonePlaceholder: string;
  formEmailPlaceholder: string;
  formServiceLabel: string;
  formServicesList: { id: string; label: string }[];
  formMessagePlaceholder: string;
  formSubmitButtonText: string;
  formSuccessTitle: string;
  formSuccessDescription: string;

  // 5. HQ Office & Map Section
  officeTitle: string;
  officeAddress: string;
  officeMapLabel: string;
  officeAppointmentNote: string;
  officeMapEmbedUrl?: string;
  officeMapLink?: string;

  // 6. Working Hours & Support Section
  workingHoursTitle: string;
  hoursWeekdays: string;
  hoursThursday: string;
  hoursFriday: string;
  responseCommitmentBadge: string;
}

// -------------------------------------------------------------
// Site Pages & Sub-pages Configuration
// -------------------------------------------------------------
export interface PageCustomSettings {
  id: string;
  slug: string;
  title: string;
  navTitle: string;
  badgeText?: string;
  heroHeadline: string;
  heroSubtitle: string;
  heroBannerImage?: string;
  ctaButtonText?: string;
  ctaButtonLink?: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  seoMetaTitle?: string;
  seoMetaDescription?: string;
  seoKeywords?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
  isVisible: boolean;
  showConsultationForm?: boolean;
  showTestimonials?: boolean;
  showFaq?: boolean;
  showProcessTimeline?: boolean;
  customNotes?: string;
  contactDetails?: ContactPageDetails;
  updatedAt?: string;
}

// -------------------------------------------------------------
// Ticket & Support Types
// -------------------------------------------------------------
export type TicketStatus = 'new' | 'open' | 'in_progress' | 'answered' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TicketDepartment = 'technical' | 'sales' | 'finance' | 'seo_design' | 'general';

export interface TicketMessage {
  id: string;
  ticketId: string;
  senderType: 'user' | 'admin';
  senderName: string;
  message: string;
  attachments?: string[];
  createdAt: string;
}

export interface TicketItem {
  id: string;
  userId?: string;
  userName: string;
  userPhone: string;
  userEmail?: string;
  department: TicketDepartment;
  priority: TicketPriority;
  subject: string;
  status: TicketStatus;
  createdAt: string;
  updatedAt: string;
  messages: TicketMessage[];
}

// -------------------------------------------------------------
// SMS & MeliPayamak Types
// -------------------------------------------------------------
export interface MelipayamakConfig {
  username: string;
  password?: string;
  senderNumber: string;
  patternCode: string;
  patternParamName: string;
  isSandbox: boolean;
}

export interface SmsLogItem {
  id: string;
  phone: string;
  code: string;
  patternCode: string;
  status: 'SENT' | 'FAILED' | 'MOCK_SENT';
  messageId?: string;
  createdAt: string;
  details?: string;
}

// -------------------------------------------------------------
// Google Integrations Types
// -------------------------------------------------------------
export interface GoogleIntegrationsConfig {
  // GTM
  gtmId: string;
  gtmEnabled: boolean;
  
  // Google Search Console
  gscVerificationCode: string;
  gscEnabled: boolean;

  // Google OAuth / Gmail Login
  googleClientId: string;
  googleClientSecret?: string;
  googleLoginEnabled: boolean;
  googleRedirectUri: string;
}

// -------------------------------------------------------------
// Admin RBAC & User Management Types
// -------------------------------------------------------------
export type AdminRole = 'admin' | 'seo' | 'support' | 'writer';

export interface AdminUser {
  id: string;
  username: string;
  password?: string;
  fullName: string;
  email: string;
  phone?: string;
  role: AdminRole;
  permissions: string[];
  isActive: boolean;
  avatar?: string;
  createdAt: string;
  lastLogin?: string;
}

// -------------------------------------------------------------
// Blog & Articles Types
// -------------------------------------------------------------
export type BlogPostStatus = 'published' | 'draft' | 'archived';

export interface BlogComment {
  id: string;
  postId: string;
  postTitle?: string;
  authorName: string;
  authorEmail: string;
  authorAvatar?: string;
  content: string;
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected';
  rating?: number;
  likesCount?: number;
  adminReply?: {
    author: string;
    content: string;
    createdAt: string;
  };
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  category: string;
  tags: string[];
  author: string;
  authorRole?: string;
  authorAvatar?: string;
  readingTime: string; // e.g. '۵ دقیقه'
  status: BlogPostStatus;
  publishedAt: string;
  updatedAt?: string;
  viewsCount: number;
  likesCount?: number;
  
  // SEO Metadata per Article
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  focusKeyword?: string;
  canonicalUrl?: string;
  ogImage?: string;
  noIndex?: boolean;
}

// -------------------------------------------------------------
// SEO Suite & Site Control Types
// -------------------------------------------------------------
export interface SeoRedirectRule {
  id: string;
  sourcePath: string;
  targetPath: string;
  type: 301 | 302;
  isActive: boolean;
  createdAt?: string;
}

export interface PageSeoRule {
  id: string;
  pagePath: string;
  pageName: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  canonicalUrl?: string;
  ogImage?: string;
  noIndex?: boolean;
}

export interface SeoGlobalSettings {
  siteTitle: string;
  titleSeparator: string;
  defaultMetaDescription: string;
  defaultMetaKeywords: string;
  canonicalBaseUrl: string;
  robotsTxt: string;
  sitemapEnabled: boolean;
  sitemapChangefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  sitemapPriority: string;
  googleVerificationCode?: string;
  bingVerificationCode?: string;
  enableJsonLdSchema: boolean;
  organizationName: string;
  organizationLogo: string;
  organizationPhone: string;
  twitterHandle?: string;
  defaultOgImage?: string;
  redirects: SeoRedirectRule[];
  pageRules: PageSeoRule[];
}

// -------------------------------------------------------------
// User Auth Types
// -------------------------------------------------------------
export interface AppUser {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  avatar?: string;
  roles: string[];
  authProvider?: 'phone_otp' | 'google' | 'password';
  createdAt?: string;
}

// -------------------------------------------------------------
// Enterprise Security Suite Types (AIOS Equivalent)
// -------------------------------------------------------------
export interface SecurityThreatLog {
  id: string;
  timestamp: string;
  ipAddress: string;
  threatType: 'brute_force' | 'sqli_attempt' | 'xss_payload' | 'scanner_404' | 'bad_bot' | 'unauthorized_admin';
  threatTypeLabel: string;
  targetEndpoint: string;
  userAgent?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  actionTaken: 'blocked' | 'logged' | 'temp_lockout' | 'permanent_ban';
  country?: string;
}

export interface BlockedIpItem {
  id: string;
  ipAddress: string;
  reason: string;
  blockedAt: string;
  expiresAt?: string;
  isPermanent: boolean;
  attemptsCount: number;
}

export interface SecuritySuiteSettings {
  // General & Security Score
  securityScore: number;
  emergencyLockdown: boolean;
  maintenanceMode: boolean;
  debugMode: boolean;

  // 1. Login Security & Brute-Force Shield
  maxLoginAttempts: number;
  lockoutDurationMinutes: number;
  enableCustomLoginSlug: boolean;
  customLoginSlug: string;
  enableAutoLogout: boolean;
  autoLogoutMinutes: number;
  enable2FAForAdmins: boolean;
  forceStrongPasswords: boolean;
  notifyAdminOnFailedLogin: boolean;
  notifyAdminOnSuccessfulLogin: boolean;
  loginAlertEmail: string;
  ipWhitelist: string[];

  // 2. Web Application Firewall (WAF 6G/7G)
  enable6GFirewall: boolean;
  blockBadUserAgents: boolean;
  enableSqlInjectionFilter: boolean;
  enableXssFilter: boolean;
  enable404ScannerDetection: boolean;
  max404ErrorsThreshold: number;
  autoBan404Scanners: boolean;
  banDurationHours: number;
  blockProxyAndTor: boolean;
  enableHttpSecurityHeaders: boolean;

  // 3. File System & Server Hardening
  preventPhpExecutionInUploads: boolean;
  disableDirectoryListing: boolean;
  hidePhpVersionHeader: boolean;
  disableXmlRpc: boolean;
  protectWpConfigAndHtaccess: boolean;

  // 4. Anti-Spam & Bot Mitigation
  enableHoneypotTrap: boolean;
  enableTurnstileCaptcha: boolean;
  turnstileSiteKey?: string;
  turnstileSecretKey?: string;
  enableFormRateLimiting: boolean;
  maxFormSubmissionsPerHour: number;

  // 5. Threat Logs & Blacklist
  blockedIps: BlockedIpItem[];
  recentThreats: SecurityThreatLog[];
  lastScanDate?: string;
  lastScanIssuesCount: number;
}

// -------------------------------------------------------------
// Speed, Performance & Cache Optimization Suite Types
// -------------------------------------------------------------
export interface CacheRuleItem {
  id: string;
  sectionKey: string;
  sectionName: string;
  pathPattern: string;
  cacheEnabled: boolean;
  ttlMinutes: number; // Time to Live in minutes
  strategy: 'cache_first' | 'network_first' | 'stale_while_revalidate' | 'no_cache';
  purgeOnUpdate: boolean;
}

export interface WebVitalsMetric {
  name: 'LCP' | 'FCP' | 'CLS' | 'INP' | 'TTFB' | 'SpeedIndex';
  label: string;
  value: string;
  numericValue: number;
  unit: 'ms' | 's' | '';
  status: 'good' | 'needs_improvement' | 'poor';
  target: string;
  description: string;
}

export interface SpeedOptimizerSettings {
  // General & Score
  performanceScoreMobile: number; // 0 - 100
  performanceScoreDesktop: number; // 0 - 100
  lastAuditDate?: string;

  // 1. HTML, CSS & JavaScript Optimization
  minifyHtml: boolean;
  removeHtmlComments: boolean;
  minifyCss: boolean;
  combineCss: boolean;
  inlineCriticalCss: boolean;
  minifyJs: boolean;
  deferJsLoading: boolean; // Defer non-critical JS
  asyncJsLoading: boolean;
  removeUnusedJs: boolean;
  enableDnsPrefetch: boolean;
  enablePreconnect: boolean;

  // 2. Font Optimization & Font-Display Swap
  fontDisplaySwap: boolean; // font-display: swap for Shabnam & icons
  preloadPrimaryFonts: boolean; // <link rel="preload" as="font">
  localSelfHostedFonts: boolean;
  subsetPersianFonts: boolean;
  disableGoogleFontsRemote: boolean;

  // 3. Cache Management & Granular Rules
  enablePageCache: boolean;
  enableBrowserCache: boolean;
  defaultCacheTtlHours: number;
  enableGzipCompression: boolean;
  enableBrotliCompression: boolean;
  cacheRules: CacheRuleItem[];
  bypassCacheForAdmins: boolean;
  bypassCacheForLoggedUsers: boolean;
  autoPurgeOnPublish: boolean;

  // 4. Image & Media Optimization
  enableLazyLoading: boolean; // loading="lazy" for <img> & <iframe>
  serveModernWebP: boolean;
  responsiveImageSrcset: boolean;
  explicitImageDimensions: boolean; // prevent CLS

  // 5. Server & .htaccess Cache Expiry
  imagesCacheDays: number; // default 365
  cssJsCacheDays: number; // default 30
  fontsCacheDays: number; // default 365
}

