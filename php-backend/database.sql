-- ============================================================
-- Signalux Digital Agency - DirectAdmin MySQL Database Schema & Seeds
-- Database: soheils4_signalux
-- Engine: InnoDB | Character Set: utf8mb4 | Collation: utf8mb4_unicode_ci
-- ============================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ------------------------------------------------------------
-- 1. Table: users
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
  `id` VARCHAR(36) NOT NULL,
  `firstName` VARCHAR(100) NOT NULL,
  `lastName` VARCHAR(100) NOT NULL,
  `email` VARCHAR(191) NOT NULL UNIQUE,
  `phone` VARCHAR(30) DEFAULT NULL,
  `avatar` TEXT DEFAULT NULL,
  `passwordHash` VARCHAR(255) NOT NULL,
  `status` ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED') NOT NULL DEFAULT 'ACTIVE',
  `isEmailVerified` TINYINT(1) NOT NULL DEFAULT 1,
  `lastLoginAt` DATETIME DEFAULT NULL,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 2. Table: roles
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `roles` (
  `id` VARCHAR(36) NOT NULL,
  `name` VARCHAR(50) NOT NULL UNIQUE,
  `labelPersian` VARCHAR(100) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 3. Table: permissions
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `permissions` (
  `id` VARCHAR(36) NOT NULL,
  `key` VARCHAR(100) NOT NULL UNIQUE,
  `group` VARCHAR(50) NOT NULL,
  `description` VARCHAR(255) DEFAULT NULL,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 4. Table: user_roles
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `user_roles` (
  `userId` VARCHAR(36) NOT NULL,
  `roleId` VARCHAR(36) NOT NULL,
  `assignedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`userId`, `roleId`),
  CONSTRAINT `fk_ur_user` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_ur_role` FOREIGN KEY (`roleId`) REFERENCES `roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 5. Table: role_permissions
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `role_permissions` (
  `roleId` VARCHAR(36) NOT NULL,
  `permissionId` VARCHAR(36) NOT NULL,
  `assignedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`roleId`, `permissionId`),
  CONSTRAINT `fk_rp_role` FOREIGN KEY (`roleId`) REFERENCES `roles` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_rp_perm` FOREIGN KEY (`permissionId`) REFERENCES `permissions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 6. Table: refresh_tokens
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `refresh_tokens` (
  `id` VARCHAR(36) NOT NULL,
  `userId` VARCHAR(36) NOT NULL,
  `tokenHash` VARCHAR(64) NOT NULL UNIQUE,
  `expiresAt` DATETIME NOT NULL,
  `revokedAt` DATETIME DEFAULT NULL,
  `ipAddress` VARCHAR(45) DEFAULT NULL,
  `userAgent` TEXT DEFAULT NULL,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_rf_user` (`userId`),
  CONSTRAINT `fk_rf_user` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 7. Table: otp_codes (Mobile verification & login)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `otp_codes` (
  `id` VARCHAR(36) NOT NULL,
  `phone` VARCHAR(30) NOT NULL,
  `code` VARCHAR(10) NOT NULL,
  `expiresAt` DATETIME NOT NULL,
  `isUsed` TINYINT(1) NOT NULL DEFAULT 0,
  `ipAddress` VARCHAR(45) DEFAULT NULL,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_otp_phone` (`phone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 8. Table: tickets (User Support System)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `tickets` (
  `id` VARCHAR(36) NOT NULL,
  `ticketNumber` VARCHAR(20) NOT NULL UNIQUE,
  `userId` VARCHAR(36) NOT NULL,
  `userName` VARCHAR(150) NOT NULL,
  `userPhone` VARCHAR(30) DEFAULT NULL,
  `userEmail` VARCHAR(191) DEFAULT NULL,
  `subject` VARCHAR(255) NOT NULL,
  `department` VARCHAR(100) NOT NULL DEFAULT 'technical',
  `priority` ENUM('low', 'medium', 'high', 'critical') NOT NULL DEFAULT 'medium',
  `status` ENUM('open', 'answered', 'in_progress', 'closed') NOT NULL DEFAULT 'open',
  `unreadByUser` TINYINT(1) NOT NULL DEFAULT 0,
  `unreadByAdmin` TINYINT(1) NOT NULL DEFAULT 1,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_ticket_user` (`userId`),
  KEY `idx_ticket_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 9. Table: ticket_messages
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `ticket_messages` (
  `id` VARCHAR(36) NOT NULL,
  `ticketId` VARCHAR(36) NOT NULL,
  `senderType` ENUM('user', 'admin') NOT NULL,
  `senderName` VARCHAR(100) NOT NULL,
  `senderId` VARCHAR(36) DEFAULT NULL,
  `message` TEXT NOT NULL,
  `attachments` LONGTEXT DEFAULT NULL,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_msg_ticket` (`ticketId`),
  CONSTRAINT `fk_msg_ticket` FOREIGN KEY (`ticketId`) REFERENCES `tickets` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 10. Table: sms_logs (MeliPayamak Tracking)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `sms_logs` (
  `id` VARCHAR(36) NOT NULL,
  `phone` VARCHAR(30) NOT NULL,
  `bodyId` INT DEFAULT NULL,
  `args` TEXT DEFAULT NULL,
  `message` TEXT DEFAULT NULL,
  `status` ENUM('SENT', 'FAILED') NOT NULL DEFAULT 'SENT',
  `responseCode` VARCHAR(100) DEFAULT NULL,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_sms_phone` (`phone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 11. Table: audit_logs
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `audit_logs` (
  `id` VARCHAR(36) NOT NULL,
  `userId` VARCHAR(36) DEFAULT NULL,
  `action` VARCHAR(100) NOT NULL,
  `entityType` VARCHAR(100) NOT NULL,
  `entityId` VARCHAR(36) DEFAULT NULL,
  `metadata` LONGTEXT DEFAULT NULL,
  `ipAddress` VARCHAR(45) DEFAULT NULL,
  `userAgent` TEXT DEFAULT NULL,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_audit_user` (`userId`),
  KEY `idx_audit_action` (`action`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 12. Table: services
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `services` (
  `id` VARCHAR(100) NOT NULL,
  `slug` VARCHAR(100) NOT NULL UNIQUE,
  `title` VARCHAR(255) NOT NULL,
  `subtitle` VARCHAR(255) DEFAULT NULL,
  `category` VARCHAR(50) NOT NULL DEFAULT 'web',
  `iconName` VARCHAR(50) NOT NULL DEFAULT 'Code2',
  `description` TEXT NOT NULL,
  `features` LONGTEXT DEFAULT NULL,
  `metrics` VARCHAR(255) DEFAULT NULL,
  `deliverables` LONGTEXT DEFAULT NULL,
  `techStack` LONGTEXT DEFAULT NULL,
  `gradient` VARCHAR(255) DEFAULT NULL,
  `isPublished` TINYINT(1) NOT NULL DEFAULT 1,
  `sortOrder` INT NOT NULL DEFAULT 0,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 13. Table: projects
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `projects` (
  `id` VARCHAR(100) NOT NULL,
  `slug` VARCHAR(100) NOT NULL UNIQUE,
  `title` VARCHAR(255) NOT NULL,
  `client` VARCHAR(255) DEFAULT NULL,
  `clientRole` VARCHAR(100) DEFAULT NULL,
  `clientAvatar` TEXT DEFAULT NULL,
  `category` VARCHAR(50) NOT NULL DEFAULT 'web',
  `categoryLabel` VARCHAR(100) DEFAULT NULL,
  `thumbnail` TEXT NOT NULL,
  `galleryImages` LONGTEXT DEFAULT NULL,
  `year` VARCHAR(20) NOT NULL DEFAULT '۱۴۰۳',
  `duration` VARCHAR(100) DEFAULT NULL,
  `summary` TEXT NOT NULL,
  `fullDescription` LONGTEXT DEFAULT NULL,
  `challengeText` TEXT DEFAULT NULL,
  `solutionText` TEXT DEFAULT NULL,
  `resultsText` TEXT DEFAULT NULL,
  `clientQuote` TEXT DEFAULT NULL,
  `tags` LONGTEXT DEFAULT NULL,
  `techStack` LONGTEXT DEFAULT NULL,
  `impactMetrics` LONGTEXT DEFAULT NULL,
  `isPublished` TINYINT(1) NOT NULL DEFAULT 1,
  `isFeatured` TINYINT(1) NOT NULL DEFAULT 0,
  `sortOrder` INT NOT NULL DEFAULT 0,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 14. Table: testimonials
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `testimonials` (
  `id` VARCHAR(100) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `role` VARCHAR(100) NOT NULL,
  `company` VARCHAR(100) DEFAULT NULL,
  `avatar` TEXT DEFAULT NULL,
  `quote` TEXT NOT NULL,
  `rating` INT NOT NULL DEFAULT 5,
  `resultsAchieved` VARCHAR(255) DEFAULT NULL,
  `projectTitle` VARCHAR(255) DEFAULT NULL,
  `videoUrl` TEXT DEFAULT NULL,
  `isPublished` TINYINT(1) NOT NULL DEFAULT 1,
  `sortOrder` INT NOT NULL DEFAULT 0,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 14.1. Table: podcast_testimonials (Voice & Audio Testimonials)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `podcast_testimonials` (
  `id` VARCHAR(100) NOT NULL,
  `clientName` VARCHAR(150) NOT NULL,
  `clientRole` VARCHAR(150) NOT NULL,
  `company` VARCHAR(150) DEFAULT NULL,
  `avatar` TEXT DEFAULT NULL,
  `title` VARCHAR(255) NOT NULL,
  `audioUrl` TEXT NOT NULL,
  `duration` VARCHAR(50) NOT NULL DEFAULT '03:00',
  `quote` TEXT NOT NULL,
  `tags` TEXT DEFAULT NULL,
  `rating` INT NOT NULL DEFAULT 5,
  `isPublished` TINYINT(1) NOT NULL DEFAULT 1,
  `sortOrder` INT NOT NULL DEFAULT 0,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 14.2. Table: video_testimonials (Video Interviews & Case Studies)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `video_testimonials` (
  `id` VARCHAR(100) NOT NULL,
  `clientName` VARCHAR(150) NOT NULL,
  `clientRole` VARCHAR(150) NOT NULL,
  `company` VARCHAR(150) DEFAULT NULL,
  `thumbnail` TEXT NOT NULL,
  `videoUrl` TEXT NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `duration` VARCHAR(50) NOT NULL DEFAULT '02:30',
  `quote` TEXT NOT NULL,
  `projectCategory` VARCHAR(150) DEFAULT NULL,
  `rating` INT NOT NULL DEFAULT 5,
  `isPublished` TINYINT(1) NOT NULL DEFAULT 1,
  `sortOrder` INT NOT NULL DEFAULT 0,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 15. Table: certificates
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `certificates` (
  `id` VARCHAR(100) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `issuer` VARCHAR(255) NOT NULL,
  `issueDate` VARCHAR(100) NOT NULL,
  `credentialId` VARCHAR(100) DEFAULT NULL,
  `image` TEXT NOT NULL,
  `badgeType` VARCHAR(50) NOT NULL DEFAULT 'gold',
  `description` TEXT DEFAULT NULL,
  `skills` LONGTEXT DEFAULT NULL,
  `isPublished` TINYINT(1) NOT NULL DEFAULT 1,
  `sortOrder` INT NOT NULL DEFAULT 0,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 16. Table: faqs
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `faqs` (
  `id` VARCHAR(100) NOT NULL,
  `category` VARCHAR(50) NOT NULL DEFAULT 'عمومی',
  `question` TEXT NOT NULL,
  `answer` TEXT NOT NULL,
  `isPublished` TINYINT(1) NOT NULL DEFAULT 1,
  `sortOrder` INT NOT NULL DEFAULT 0,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 17. Table: lead_submissions
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `lead_submissions` (
  `id` VARCHAR(100) NOT NULL,
  `type` ENUM('consultation', 'contact') NOT NULL DEFAULT 'consultation',
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(191) DEFAULT NULL,
  `phone` VARCHAR(50) DEFAULT NULL,
  `service` VARCHAR(100) DEFAULT NULL,
  `budget` VARCHAR(100) DEFAULT NULL,
  `message` TEXT DEFAULT NULL,
  `status` ENUM('new', 'contacted', 'closed') NOT NULL DEFAULT 'new',
  `ipAddress` VARCHAR(45) DEFAULT NULL,
  `userAgent` TEXT DEFAULT NULL,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 18. Table: site_settings (Includes Typography, GTM, GSC, MeliPayamak & Google OAuth)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `site_settings` (
  `id` VARCHAR(36) NOT NULL,
  `siteTitle` VARCHAR(255) NOT NULL DEFAULT 'آژانس دیجیتال سیگنالوکس (Signalux)',
  `heroHeadline` VARCHAR(255) NOT NULL DEFAULT 'خلق تجربه‌های دیجیتال بدون مرز و متناسب با رشد کسب‌وکار شما',
  `heroSubtitle` TEXT NOT NULL,
  `contactEmail` VARCHAR(191) NOT NULL DEFAULT 'info@signalux.ir',
  `contactPhone` VARCHAR(50) NOT NULL DEFAULT '۰۲۱-۸۸۹۹۰۰۱۱',
  `contactAddress` TEXT NOT NULL,
  `instagramUrl` VARCHAR(255) DEFAULT 'https://instagram.com/signalux',
  `linkedinUrl` VARCHAR(255) DEFAULT 'https://linkedin.com/company/signalux',
  `telegramUrl` VARCHAR(255) DEFAULT 'https://t.me/signalux_studio',
  `githubUrl` VARCHAR(255) DEFAULT 'https://github.com/signalux',
  
  -- Typography Settings (نوع و اندازه فونت)
  `fontFamily` VARCHAR(50) NOT NULL DEFAULT 'Shabnam',
  `fontSizeBase` VARCHAR(20) NOT NULL DEFAULT '16px',
  `fontHeadingScale` VARCHAR(20) NOT NULL DEFAULT '1.25',
  `fontWeightBase` VARCHAR(20) NOT NULL DEFAULT '400',
  `lineHeightScale` VARCHAR(20) NOT NULL DEFAULT '1.65',

  -- Google Integrations
  `gtmContainerId` VARCHAR(50) DEFAULT 'GTM-XXXXXXX',
  `gtmEnabled` TINYINT(1) NOT NULL DEFAULT 0,
  `gscVerificationCode` VARCHAR(255) DEFAULT '',
  `gscVerificationMethod` VARCHAR(30) NOT NULL DEFAULT 'meta_tag',
  `googleClientId` VARCHAR(255) DEFAULT '',
  `googleClientSecret` VARCHAR(255) DEFAULT '',
  `googleLoginEnabled` TINYINT(1) NOT NULL DEFAULT 1,
  
  -- MeliPayamak SMS Gateway
  `melipayamakUsername` VARCHAR(100) DEFAULT '',
  `melipayamakPassword` VARCHAR(100) DEFAULT '',
  `melipayamakSenderNumber` VARCHAR(50) DEFAULT '50004...',
  `melipayamakOtpBodyId` INT NOT NULL DEFAULT 123456,
  `melipayamakTicketBodyId` INT DEFAULT NULL,
  `melipayamakEnabled` TINYINT(1) NOT NULL DEFAULT 1,
  
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- SEED INITIAL DATA
-- ============================================================

-- 1. Insert Roles
INSERT INTO `roles` (`id`, `name`, `labelPersian`, `description`) VALUES
('r-super-admin', 'SUPER_ADMIN', 'مدیر کل', 'دسترسی کامل و بدون محدودیت به تمام بخش‌های سیستم'),
('r-content-mgr', 'CONTENT_MANAGER', 'مدیر محتوا', 'مدیریت کامل وب‌سایت، خدمات، نمونه‌کارها و نظرات'),
('r-author', 'AUTHOR', 'نویسنده', 'ایجاد و انتشار مقالات آموزشی و خبری'),
('r-operator', 'OPERATOR', 'اپراتور لید', 'بررسی و پاسخگویی به درخواست‌های مشاوره'),
('r-analyst', 'ANALYST', 'تحلیلگر', 'مشاهده گزارش‌ها و داشبورد آمار')
ON DUPLICATE KEY UPDATE `labelPersian` = VALUES(`labelPersian`);

-- 2. Insert Permissions
INSERT INTO `permissions` (`id`, `key`, `group`, `description`) VALUES
('p-dash-view', 'dashboard.view', 'داشبورد', 'مشاهده آمار کلی داشبورد'),
('p-users-view', 'users.view', 'کاربران', 'مشاهده لیست کاربران'),
('p-users-create', 'users.create', 'کاربران', 'ایجاد کاربر جدید'),
('p-users-update', 'users.update', 'کاربران', 'ویرایش اطلاعات کاربر'),
('p-users-delete', 'users.delete', 'کاربران', 'حذف یا تعلیق کاربر'),
('p-roles-view', 'roles.view', 'نقش‌ها', 'مشاهده نقش‌ها و دسترسی‌ها'),
('p-roles-manage', 'roles.manage', 'نقش‌ها', 'مدیریت سطح دسترسی نقش‌ها'),
('p-services-view', 'services.view', 'خدمات', 'مشاهده خدمات'),
('p-services-manage', 'services.manage', 'خدمات', 'مدیریت کامل خدمات'),
('p-projects-view', 'projects.view', 'پروژه‌ها', 'مشاهده پروژه‌ها'),
('p-projects-manage', 'projects.manage', 'پروژه‌ها', 'مدیریت کامل پروژه‌ها'),
('p-testimonials-view', 'testimonials.view', 'نظرات', 'مشاهده نظرات کارفرمایان'),
('p-testimonials-manage', 'testimonials.manage', 'نظرات', 'مدیریت نظرات کارفرمایان'),
('p-faqs-view', 'faqs.view', 'سوالات متداول', 'مشاهده سوالات متداول'),
('p-faqs-manage', 'faqs.manage', 'سوالات متداول', 'مدیریت سوالات متداول'),
('p-leads-view', 'leads.view', 'لیدها', 'مشاهده درخواست‌های مشاوره'),
('p-leads-manage', 'leads.manage', 'لیدها', 'پیگیری و تغییر وضعیت لیدها'),
('p-tickets-view', 'tickets.view', 'تیکت‌ها', 'مشاهده و پاسخ به تیکت‌های پشتیبانی'),
('p-tickets-manage', 'tickets.manage', 'تیکت‌ها', 'مدیریت کامل سیستم تیکتینگ'),
('p-sms-view', 'sms.view', 'سامانه پیامک', 'مشاهده لاگ‌ها و پترن‌های پیامک'),
('p-sms-manage', 'sms.manage', 'سامانه پیامک', 'تنظیمات درگاه ملی پیامک'),
('p-settings-view', 'settings.view', 'تنظیمات', 'مشاهده تنظیمات'),
('p-settings-manage', 'settings.manage', 'تنظیمات', 'ویرایش تنظیمات اصلی سیستم و ابزارهای گوگل'),
('p-media-view', 'media.view', 'رسانه', 'مشاهده کتابخانه فایل‌ها'),
('p-media-upload', 'media.upload', 'رسانه', 'آپلود فایل‌های جدید')
ON DUPLICATE KEY UPDATE `group` = VALUES(`group`);

-- 3. Link Super Admin to all permissions
INSERT IGNORE INTO `role_permissions` (`roleId`, `permissionId`)
SELECT 'r-super-admin', `id` FROM `permissions`;

-- 4. Initial Super Admin User (Pass: SignaluxSuperAdmin2026!)
-- Hash generated with password_hash('SignaluxSuperAdmin2026!', PASSWORD_BCRYPT)
INSERT INTO `users` (`id`, `firstName`, `lastName`, `email`, `phone`, `passwordHash`, `status`, `isEmailVerified`) VALUES
('u-admin-1', 'مدیر', 'ارشد', 'admin@signalux.ir', '۰۹۱۲۰۰۰۰۰۰۰', '$2y$10$tZ2cI0sC06e/Z2q2g0kP8OT7UjH.z81mH0/x6qI3m0.g4z5h9u1q2', 'ACTIVE', 1)
ON DUPLICATE KEY UPDATE `email` = VALUES(`email`);

INSERT IGNORE INTO `user_roles` (`userId`, `roleId`) VALUES
('u-admin-1', 'r-super-admin');

-- 5. Site Settings
INSERT INTO `site_settings` (`id`, `siteTitle`, `heroHeadline`, `heroSubtitle`, `contactEmail`, `contactPhone`, `contactAddress`, `instagramUrl`, `linkedinUrl`, `telegramUrl`, `githubUrl`, `gtmContainerId`, `gtmEnabled`, `gscVerificationCode`, `melipayamakOtpBodyId`, `melipayamakEnabled`, `googleLoginEnabled`) VALUES
('s-main-1', 'آژانس دیجیتال سیگنالوکس (Signalux)', 'خلق تجربه‌های دیجیتال بدون مرز و متناسب با رشد کسب‌وکار شما', 'استودیو سیگنالوکس با بهره‌گیری از طراحی مدرن وب، استراتژی سئوی داده‌محور و دیزاین سیستم‌های منحصر‌به‌فرد، برند شما را در فضای دیجیتال ممتاز می‌کند.', 'info@signalux.ir', '۰۲۱-۸۸۹۹۰۰۱۱', 'تهران، خیابان ولیعصر، برج فناوری سیگنال، طبقه ۸', 'https://instagram.com/signalux', 'https://linkedin.com/company/signalux', 'https://t.me/signalux_studio', 'https://github.com/signalux', 'GTM-T9K8LP', 1, 'google-site-verification=abcdef1234567890', 123456, 1, 1)
ON DUPLICATE KEY UPDATE `siteTitle` = VALUES(`siteTitle`);

-- 6. Initial Services
INSERT INTO `services` (`id`, `slug`, `title`, `subtitle`, `category`, `iconName`, `description`, `features`, `metrics`, `deliverables`, `techStack`, `gradient`, `sortOrder`) VALUES
('web-development', 'web-development', 'طراحی و توسعه وب‌سایت اختصاصی', 'معماری مدرن، سرعت خارق‌العاده و تجربه کاربری لوکس', 'web', 'Code2', 'توسعه فرانت‌اند و بک‌اند با آخرین متدهای ۲۰۲۶، بهینه‌سازی شده برای بالا‌ترین نرخ تبدیل و رابط‌کاربری پاسخگو روی تمام دستگاه‌ها.', '["توسعه بر پایه React / Next.js و PWA","طراحی UI/UX اختصاصی مطابق استاندارد Karo Studio","سرعت بارگذاری لایت‌هاوس بالای ۹۵٪","امنیت چندلایه‌ای و معماری مقیاس‌پذیر"]', 'میانگین افزایش ۳.۲ برابری ماندگاری کاربر (Dwell Time)', '["فرانت‌اند React/Vite","داشبورد مدیریتی اختصاصی","بهینه‌سازی کامل SEO فنی","پشتیبانی ۱۲ ماهه فنی"]', '["React","TypeScript","Tailwind CSS","Node.js","Three.js"]', 'from-cyan-500/20 via-indigo-500/10 to-transparent', 1),
('digital-marketing', 'digital-marketing', 'دیجیتال مارکتینگ و رشد برند', 'کمپین‌های هدفمند، تحلیل داده‌محور و جذب مخاطب واقعی', 'marketing', 'TrendingUp', 'مدیریت علمی کمپین‌های تبلیغاتی، بازاریابی عملکردی (Performance Marketing) و تدوین قیف‌های فروش با حداکثر نرخ بازگشت سرمایه (ROI).', '["استراتژی جامع جذب و نگه‌داشت مشتری","کمپین‌های عملکردی در شبکه‌های اجتماعی و گوگل","بازاریابی محتوای ویروسی و سناریونویسی","بهینه‌سازی قیف فروش و نرخ تبدیل (CRO)"]', 'افزایش متوسط ۲۴۰ درصدی نرخ بازگشت سرمایه (ROAS)', '["سند استراتژی مارکتینگ","تقویم محتوایی اختصاصی","گزارش تحلیلی هفتگی و ماهانه","A/B تست صفحات فرود"]', '["Google Analytics 4","Meta Business","HubSpot","Mixpanel"]', 'from-purple-500/20 via-pink-500/10 to-transparent', 2),
('seo-optimization', 'seo-optimization', 'سئو و بهینه‌سازی موتورهای جستجو', 'تثبیت رتبه ۱ گوگل با سئوی کلاه سفید و ارگانیک', 'seo', 'SearchCheck', 'سئوی عمیق فنی (Technical SEO)، آنالیز رفتاری گوگل، استراتژی لینک‌سازی طبیعی و تولید محتوای هوشمند برای کسب رتبه‌های پایدار.', '["ممیزی فنی و برطرف‌سازی خطاهای گوگل سرچ کنسول","تحقیق کلمات کلیدی درآمدزا و کلاسترینگ محتوا","استراتژی لینک‌سازی کلاه سفید با اتوریتی بالا","بهینه‌سازی نشانه‌گذاری اسکیما (Schema Markup)"]', 'رشد متوسط ۴۵۰ درصدی ورودی ارگانیک در ۶ ماه', '["گزارش آنالیز رقبای صنعتی","نقشه راه سئوی ۱ ساله","داشبورد اختصاصی پایش رتبه‌ها","تولید و بهینه‌سازی مقالات پایه"]', '["Ahrefs","Screaming Frog","Search Console","Semrush"]', 'from-emerald-500/20 via-teal-500/10 to-transparent', 3)
ON DUPLICATE KEY UPDATE `title` = VALUES(`title`);

-- 7. Initial Projects
INSERT INTO `projects` (`id`, `slug`, `title`, `client`, `clientRole`, `clientAvatar`, `category`, `categoryLabel`, `thumbnail`, `year`, `duration`, `summary`, `fullDescription`, `challengeText`, `solutionText`, `resultsText`, `clientQuote`, `tags`, `techStack`, `impactMetrics`, `sortOrder`) VALUES
('berlin-beauty', 'berlin-beauty', 'وب‌سایت و فروشگاه تخصصی آنلاین برلین بیوتی', 'برلین بیوتی (Berlin Beauty)', 'مدیر برند و فروشگاه', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80', 'web', 'فروشگاه آنلاین آرایشی و زیبایی', 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1000&q=80', '۲۰۲۵', '۲ ماه زمان توسعه', 'طراحی وب‌سایت فروشگاهی لوکس محصولات مراقبت پوست و زیبایی برلین بیوتی با تجربه خرید چابک.', 'فروشگاه برلین بیوتی یکی از مراکز معتبر عرضه محصولات آرایشی و بهداشتی اصل است. تیم سیگنالوکس با طراحی رابط کاربری شیک، سیستم فیلتر هوشمند محصولات بر اساس نوع پوست و برند، و تسویه‌حساب ۳۰ ثانیه‌ای، فروش آنلاین این برند را به حد بالایی ارتقا داد.', 'سایت قبلی دارای کندی در بارگذاری تصاویر محصولات آرایشی و فرآیند پیچیده سبد خرید بود که باعث منصرف شدن مشتریان در مرحله پرداخت می‌شد.', 'بازطراحی کامل با React و Tailwind CSS، فشرده‌سازی خودکار تصاویر، و ساده‌سازی فرایند خرید به دو گام کوتاه.', 'افزایش بیش از ۲۱۰ درصدی سفارشات آنلاین ماهانه و کاهش نرخ انصراف از خرید به زیر ۱۵ درصد.', 'طراحی فوق‌العاده و سرعت عالی سایت برلین بیوتی رضایت مشتریان ما را صدچندان کرده است.', '["React","E-Commerce","Tailwind CSS","Cosmetics","Fast Checkout"]', '["React","TypeScript","Tailwind CSS","Node.js API","Zarinpal Payment"]', '[{"label":"افزایش فروش آنلاین","value":"+۲۱۰٪","change":"رشد ۲.۱ برابری"},{"label":"سرعت لود صفحه","value":"۰.۸ ثانیه","change":"لود آنی محصولات"},{"label":"نرخ تبدیل فروش","value":"۴.۲٪","change":"بهینه‌سازی UI/UX"}]', 1),
('xiaomi-tehran', 'xiaomi-tehran', 'پلتفرم فروشگاهی و عرضه محصولات شیائومی تهران', 'شیائومی تهران', 'مدیر فروشگاه و زنجیره تامین', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80', 'web', 'فروشگاه لوازم دیجیتال و گجت', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1000&q=80', '۲۰۲۴', '۳ ماه زمان توسعه', 'توسعه پلتفرم فروشگاهی و گارانتی آنلاین محصولات و گجت‌های هوشمند شیائومی تهران با سیستم مدیریت موجودی انبار.', 'پروژه جامع فروشگاهی شیائومی تهران شامل اتصال به سیستم حسابداری انبار، رهگیری آنلاین گارانتی اصالت کالا و پرداخت سریع است.', 'حجم بالای سفارشات روزانه و عدم هماهنگی لحظه‌ای با سیستم انبارداری موجب عدم تطابق کالاها می‌شد.', 'پیاده‌سازی وب سرویس اختصاصی و صف‌بندی هوشمند سفارشات با ساختار کشینگ قوی.', 'کاهش ۱۰۰ درصدی خطای ثبت موجودی و افزایش رضایت خریداران گجت‌های هوشمند.', 'تیم سیگنالوکس دقیقا همان چیزی را پیاده کرد که برای رشد فروش به آن احتیاج داشتیم.', '["Next.js","E-Commerce","Warehouse Sync","Xiaomi Ecosystem"]', '["Next.js","MySQL","Redis","Tailwind CSS","Zibal Gateway"]', '[{"label":"ثبت موفق سفارش","value":"۹۹.۸٪","change":"بدون قطعی در ترافیک بالا"},{"label":"زمان استعلام گارانتی","value":"۰.۳ ثانیه","change":"پردازش آنی کد سریال"}]', 2)
ON DUPLICATE KEY UPDATE `title` = VALUES(`title`);

-- 8. Initial Testimonials
INSERT INTO `testimonials` (`id`, `name`, `role`, `company`, `avatar`, `quote`, `rating`, `resultsAchieved`, `projectTitle`) VALUES
('t-1', 'مهندس سهراب رحیمی', 'مدیر ارشد فنی', 'گروه صنعتی پتروآریا', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80', 'همکاری با سیگنالوکس یکی از بهترین تجربیات کاری ما بود. دیزاین سیستم اختصاصی و سئوی قدرتمند آنها ترافیک ورودی B2B ما را در ۳ ماه اول بیش از ۱۸۰ درصد افزایش داد.', 5, 'رشد ۱۸۰ درصدی لیدهای شرکتی', 'طراحی پورتال B2B پتروآریا'),
('t-2', 'دکتر فرناز سرمدی', 'بنیان‌گذار و مدیرعامل', 'مجموعه کلینیک‌های پوست هور', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80', 'رابط کاربری لوکس و سرعت بالای سایت نوبت‌دهی آنلاین باعث شد رضایت مراجعین ما به بالاترین حد ممکن برسد. تعهد و دقت تیم سیگنالوکس مثال‌زدنی است.', 5, 'افزایش ۳ برابری رزرو آنلاین', 'سیستم رزرواسیون هوشمند کلینیک هور')
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- 9. Initial FAQs
INSERT INTO `faqs` (`id`, `category`, `question`, `answer`, `sortOrder`) VALUES
('faq-1', 'طراحی وب', 'مدت زمان طراحی و توسعه یک وب‌سایت اختصاصی چقدر است؟', 'بسته به سطح پیچیدگی، معمولاً پروژه‌های اختصاصی بین ۳ تا ۶ هفته زمان نیاز دارند.', 1),
('faq-2', 'سئو', 'چقدر طول می‌کشد تا نتایج سئو مشخص شود؟', 'بهینه‌سازی سئو فرایندی تدریجی است؛ بهبود اولیه بین ۲ تا ۴ ماه و نتایج تثبیت‌شده در صفحه اول معمولاً بین ۴ تا ۸ ماه حاصل می‌شود.', 2),
('faq-3', 'دیجیتال مارکتینگ', 'آیا گزارش‌های تحلیلی کمپین‌ها ارائه می‌شود؟', 'بله، تمامی کمپین‌ها به صورت هفتگی و ماهانه همراه با معیارهای شفاف ROI و ROAS گزارش می‌شوند.', 3)
ON DUPLICATE KEY UPDATE `question` = VALUES(`question`);

-- 10. Sample Tickets
INSERT INTO `tickets` (`id`, `ticketNumber`, `userId`, `userName`, `userPhone`, `userEmail`, `subject`, `department`, `priority`, `status`, `unreadByUser`, `unreadByAdmin`) VALUES
('tk-101', 'TK-7841', 'u-admin-1', 'سهراب رحیمی', '۰۹۱۲۳۴۵۶۷۸۹', 'sohrab@petroarya.com', 'درخواست بهینه‌سازی سرعت سرور پورتال B2B', 'technical', 'high', 'answered', 1, 0)
ON DUPLICATE KEY UPDATE `subject` = VALUES(`subject`);

INSERT INTO `ticket_messages` (`id`, `ticketId`, `senderType`, `senderName`, `senderId`, `message`) VALUES
('msg-1', 'tk-101', 'user', 'سهراب رحیمی', 'u-admin-1', 'سلام و وقت بخیر، با توجه به افزایش حجم مراجعات، نیاز به بررسی کش سرور و فعال‌سازی Redis داریم.'),
('msg-2', 'tk-101', 'admin', 'پشتیبانی فنی سیگنالوکس', 'u-admin-1', 'سلام جناب رحیمی عزیز، کش ریدیس روی لایه وب‌سرویس فعال گردید و هم‌اکنون زمان پاسخگویی به زیر ۱۰۰ میلی‌ثانیه کاهش یافته است.')
ON DUPLICATE KEY UPDATE `message` = VALUES(`message`);

-- ------------------------------------------------------------
-- 15. Table: admin_users (RBAC Team Management)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `admin_users` (
  `id` VARCHAR(36) NOT NULL,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `passwordHash` VARCHAR(255) NOT NULL,
  `fullName` VARCHAR(150) NOT NULL,
  `email` VARCHAR(191) NOT NULL UNIQUE,
  `phone` VARCHAR(30) DEFAULT NULL,
  `role` ENUM('admin', 'seo', 'support', 'writer') NOT NULL DEFAULT 'admin',
  `permissions` LONGTEXT DEFAULT NULL,
  `avatar` TEXT DEFAULT NULL,
  `isActive` TINYINT(1) NOT NULL DEFAULT 1,
  `lastLogin` DATETIME DEFAULT NULL,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_admin_role` (`role`),
  KEY `idx_admin_user` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 16. Table: blog_posts (Articles & Content Hub)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `blog_posts` (
  `id` VARCHAR(36) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL UNIQUE,
  `excerpt` TEXT NOT NULL,
  `content` LONGTEXT NOT NULL,
  `featuredImage` TEXT NOT NULL,
  `category` VARCHAR(100) NOT NULL,
  `tags` LONGTEXT DEFAULT NULL,
  `author` VARCHAR(100) NOT NULL,
  `authorRole` VARCHAR(100) DEFAULT 'کارشناس ارشد محتوا',
  `authorAvatar` TEXT DEFAULT NULL,
  `readingTime` VARCHAR(50) NOT NULL DEFAULT '۵ دقیقه',
  `status` ENUM('published', 'draft', 'archived') NOT NULL DEFAULT 'published',
  `publishedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `viewsCount` INT NOT NULL DEFAULT 0,
  `likesCount` INT NOT NULL DEFAULT 0,
  
  -- SEO Specific Columns
  `metaTitle` VARCHAR(255) DEFAULT NULL,
  `metaDescription` TEXT DEFAULT NULL,
  `metaKeywords` TEXT DEFAULT NULL,
  `focusKeyword` VARCHAR(150) DEFAULT NULL,
  `canonicalUrl` TEXT DEFAULT NULL,
  `ogImage` TEXT DEFAULT NULL,
  `noIndex` TINYINT(1) NOT NULL DEFAULT 0,
  
  PRIMARY KEY (`id`),
  KEY `idx_blog_slug` (`slug`),
  KEY `idx_blog_category` (`category`),
  KEY `idx_blog_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 17. Table: seo_settings (Master SEO Suite, Sitemap & Robots)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `seo_settings` (
  `id` VARCHAR(36) NOT NULL,
  `siteTitle` VARCHAR(255) NOT NULL DEFAULT 'آژانس دیجیتال سیگنالوکس (Signalux)',
  `titleSeparator` VARCHAR(10) NOT NULL DEFAULT '|',
  `defaultMetaDescription` TEXT NOT NULL,
  `defaultMetaKeywords` TEXT DEFAULT NULL,
  `canonicalBaseUrl` VARCHAR(255) NOT NULL DEFAULT 'https://signalux.ir',
  `robotsTxt` LONGTEXT DEFAULT NULL,
  `sitemapEnabled` TINYINT(1) NOT NULL DEFAULT 1,
  `sitemapChangefreq` VARCHAR(20) NOT NULL DEFAULT 'weekly',
  `sitemapPriority` VARCHAR(10) NOT NULL DEFAULT '0.8',
  `googleVerificationCode` VARCHAR(255) DEFAULT NULL,
  `bingVerificationCode` VARCHAR(255) DEFAULT NULL,
  `enableJsonLdSchema` TINYINT(1) NOT NULL DEFAULT 1,
  `organizationName` VARCHAR(150) NOT NULL DEFAULT 'استودیو دیجیتال سیگنالوکس',
  `organizationLogo` TEXT DEFAULT NULL,
  `organizationPhone` VARCHAR(50) NOT NULL DEFAULT '۰۲۱-۸۸۹۹۰۰۱۱',
  `twitterHandle` VARCHAR(50) DEFAULT '@signalux_ir',
  `defaultOgImage` TEXT DEFAULT NULL,
  `redirects` LONGTEXT DEFAULT NULL,
  `pageRules` LONGTEXT DEFAULT NULL,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 18. Table: security_settings (AIOS Firewall & Hardening)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `security_settings` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY,
  `settings_json` LONGTEXT NOT NULL,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 19. Table: speed_settings (Performance & Cache Optimizer)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `speed_settings` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY,
  `settings_json` LONGTEXT NOT NULL,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- SEEDS FOR ADMIN USERS, BLOG POSTS & SEO
-- ------------------------------------------------------------

-- 1. Initial Admin Users with Roles
INSERT INTO `admin_users` (`id`, `username`, `passwordHash`, `fullName`, `email`, `phone`, `role`, `permissions`, `avatar`, `isActive`) VALUES
('adm-1', 'admin', '$2y$10$tZ2cI0sC06e/Z2q2g0kP8OT7UjH.z81mH0/x6qI3m0.g4z5h9u1q2', 'مهندس سهیل سلیمانی', 'admin@signalux.ir', '۰۹۱۲۰۰۰۰۰۰۱', 'admin', '["all"]', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80', 1),
('adm-2', 'seo_expert', '$2y$10$tZ2cI0sC06e/Z2q2g0kP8OT7UjH.z81mH0/x6qI3m0.g4z5h9u1q2', 'کیانوش رضوانی (متخصص سئو)', 'seo@signalux.ir', '۰۹۱۲۰۰۰۰۰۰۲', 'seo', '["seo","sitemap","robots","blog","google"]', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80', 1),
('adm-3', 'support_agent', '$2y$10$tZ2cI0sC06e/Z2q2g0kP8OT7UjH.z81mH0/x6qI3m0.g4z5h9u1q2', 'مونا احمدی (کارشناس پشتیبانی)', 'support@signalux.ir', '۰۹۱۲۰۰۰۰۰۰۳', 'support', '["tickets","leads","faqs"]', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80', 1),
('adm-4', 'content_writer', '$2y$10$tZ2cI0sC06e/Z2q2g0kP8OT7UjH.z81mH0/x6qI3m0.g4z5h9u1q2', 'آرش درخشان (نویسنده ارشد وبلاگ)', 'content@signalux.ir', '۰۹۱۲۰۰۰۰۰۰۴', 'writer', '["blog","media"]', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80', 1)
ON DUPLICATE KEY UPDATE `fullName` = VALUES(`fullName`);

-- 2. Initial Blog Posts
INSERT INTO `blog_posts` (`id`, `title`, `slug`, `excerpt`, `content`, `featuredImage`, `category`, `tags`, `author`, `authorRole`, `authorAvatar`, `readingTime`, `status`, `publishedAt`, `viewsCount`, `metaTitle`, `metaDescription`, `focusKeyword`) VALUES
('post-1', 'راهنمای جامع سئوی تکنیکال ۲۰۲۶؛ چگونه به رتبه ۱ گوگل برسیم؟', 'technical-seo-guide-2026', 'سئوی فنی پایه و اساس هر وب‌سایت موفق است. در این مقاله به بررسی چک‌لیست طلایی سرعت لود، ساختار URL، فایل robots.txt و نشانه‌گذاری اسکیما می‌پردازیم.', '## مقدمه بر سئوی تکنیکال مدرن\n\nسئوی تکنیکال یا فنی به فرآیند بهینه‌سازی زیرساخت‌های وب‌سایت به منظور تسهیل خزش (Crawling) و نمایه‌سازی (Indexing) صفحات توسط موتورهای جستجو مانند گوگل اطلاق می‌شود.\n\n### ۱. بهینه‌سازی سرعت و Core Web Vitals\nسرعت بارگذاری سایت نه تنها بر تجربه کاربری بلکه مستقیماً بر فاکتورهای رتبه‌بندی گوگل اثرگذار است. معیارهای LCP (بزرگ‌ترین عنصر محتوا)، FID یا INP (میزان تعاملی بودن) و CLS (تغییرات چیدمان بصری) سه ستون اصلی این بخش هستند.\n\n### ۲. معماری آدرس‌ها و نقشه سایت (Sitemap.xml)\nنقشه سایت باید همیشه به‌روز، سبک و شامل صفحات با کد وضعیت ۲۰۰ باشد. از قرار دادن صفحات ریدایرکت شده یا صفحات بدون ایندکس در سایت‌مپ اکیداً خودداری نمایید.\n\n### ۳. نشانه‌گذاری اسکیما و داده‌های ساختاریافته (Schema.org)\nبا استفاده از اسکیماهای Organization, Article, LocalBusiness و BreadcrumbList به ربات‌های گوگل کمک کنید مفهوم واقعی کسب‌وکار شما را درک کنند.', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1000&q=80', 'سئو و بهینه‌سازی', '["سئو تکنیکال","گوگل سرچ کنسول","سرعت سایت","اسکیما"]', 'کیانوش رضوانی', 'مدیر دپارتمان سئو', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80', '۶ دقیقه', 'published', '2026-03-01 10:30:00', 1240, 'راهنمای جامع سئوی تکنیکال ۲۰۲۶ | استودیو سیگنالوکس', 'آموزش کامل سئوی تکنیکال، بهینه‌سازی سرعت و نشانه‌گذاری داده‌های ساختاریافته برای افزایش ترافیک ارگانیک گوگل.', 'سئوی تکنیکال'),
('post-2', 'طراحی رابط کاربری لوکس با متد Glassmorphism و تایپوگرافی اختصاصی', 'luxury-ui-ux-design-principles', 'بررسی تکنیک‌های نوین دیزاین وب در سال ۲۰۲۶، هارمونی رنگ‌های شبانه با نورهای متمرکز و بهینه‌سازی خوانایی فونت‌های فارسی در محیط‌های تاریک.', '## فلسفه دیزاین سیستم در عصر جدید\n\nطراحی رابط کاربری فراتر از چیدمان ساده المان‌هاست؛ این یک زبان بصری برای انتقال حس اعتماد، پرستیژ و نوآوری است.\n\n### هماهنگی نور و سایه\nدر طراحی دارک‌مود مدرن، استفاده از گرادیان‌های نوری دقیق به جای خطوط ضخیم، عمق بصری شگفت‌انگیزی به محصول می‌بخشد.\n\n### استانداردهای تایپوگرافی فارسی\nانتخاب اندازه پایه متون (مانند ۱۶ پیکسل) و مقیاس تیترها با نسبت ۱.۲۵ یا ۱.۳۵، تجربه‌ای خوانا و آرامش‌بخش برای چشمان مخاطبان فراهم می‌آورد.', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=80', 'طراحی وب و رابط کاربری', '["طراحی UI/UX","تایپوگرافی فارسی","طراحی وب","دیزاین سیستم"]', 'سهیل سلیمانی', 'طراح ارشد تجربه کاربری', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80', '۴ دقیقه', 'published', '2026-03-05 14:15:00', 890, 'اصول طراحی رابط کاربری لوکس و مدرن | وبلاگ سیگنالوکس', 'بررسی استانداردها و تکنیک‌های خلق رابط کاربری لوکس، دارک‌مود و دیزاین سیستم اختصاصی با تایپوگرافی فارسی.', 'طراحی UI/UX'),
('post-3', 'چگونه هوش مصنوعی فرآیند دیجیتال مارکتینگ و فروش را متحول می‌کند؟', 'ai-digital-marketing-transformation', 'نقش مدل‌های زبانی هوشمند در شخصی‌سازی کمپین‌ها، بهینه‌سازی نرخ تبدیل (CRO) و تحلیل داده‌های لحظه‌ای مشتریان.', '## ورود هوش مصنوعی مولد به دنیای تبلیغات\n\nابزارهای هوش مصنوعی اکنون قادرند سناریوهای تبلیغاتی چندگانه تولید کرده و بهترین نسخه را بر اساس رفتار کاربران گزینش کنند.\n\n### بهینه‌سازی هوشمند بودجه کمپین‌ها\nبا تجزیه و تحلیل هم‌زمان نرخ تبدیل و هزینه هر اکتساب مشتری (CPA)، بودجه تبلیغات گوگل و متا در هر لحظه به سودآورترین مسیر هدایت می‌شود.', 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1000&q=80', 'دیجیتال مارکتینگ', '["هوش مصنوعی","مارکتینگ اتومیشن","دیجیتال مارکتینگ","فروش"]', 'آرش درخشان', 'نویسنده ارشد محتوا', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80', '۵ دقیقه', 'published', '2026-03-10 09:00:00', 1560, 'هوش مصنوعی در دیجیتال مارکتینگ و افزایش فروش | سیگنالوکس', 'آشنایی با کاربردهای هوش مصنوعی در اتوماسیون بازاریابی، بهینه‌سازی کمپین‌ها و نرخ بازگشت سرمایه.', 'هوش مصنوعی در مارکتینگ')
ON DUPLICATE KEY UPDATE `title` = VALUES(`title`);

-- 3. Initial SEO Suite Settings
INSERT INTO `seo_settings` (`id`, `siteTitle`, `titleSeparator`, `defaultMetaDescription`, `defaultMetaKeywords`, `canonicalBaseUrl`, `robotsTxt`, `sitemapEnabled`, `sitemapChangefreq`, `sitemapPriority`, `googleVerificationCode`, `enableJsonLdSchema`, `organizationName`, `organizationPhone`, `redirects`, `pageRules`) VALUES
('default-seo', 'آژانس دیجیتال سیگنالوکس (Signalux)', '|', 'سیگنالوکس؛ آژانس پیشرو در طراحی اختصاصی وب‌سایت، سئو تخصصی و دیجیتال مارکتینگ داده‌محور با تکیه بر متدهای ۲۰۲۶', 'طراحی سایت, سئو سایت, دیجیتال مارکتینگ, آژانس دیجیتال, توسعه وب, سئو تضمینی', 'https://signalux.ir', 'User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/v1/admin/\n\nSitemap: https://signalux.ir/sitemap.xml', 1, 'weekly', '0.8', 'google-site-verification=abcdef1234567890', 1, 'استودیو دیجیتال سیگنالوکس', '۰۲۱-۸۸۹۹۰۰۱۱', '[{"id":"red-1","sourcePath":"/old-services","targetPath":"/services","type":301,"isActive":true}]', '[{"id":"page-1","pagePath":"/","pageName":"صفحه اصلی","metaTitle":"آژانس دیجیتال مارکتینگ و طراحی وب سیگنالوکس","metaDescription":"خلق تجربه‌های دیجیتال بدون مرز با استودیو سیگنالوکس، طراحی وب اختصاصی و سئو پایدار","metaKeywords":"طراحی سایت, سئو, مارکتینگ","noIndex":false},{"id":"page-2","pagePath":"/services","pageName":"خدمات تخصصی","metaTitle":"خدمات توسعه وب و مارکتینگ دیجیتال | سیگنالوکس","metaDescription":"ارائه خدمات طراحی وب‌سایت‌های واکنش‌گرا، سئو تخصصی و کمپین‌های تبلیغاتی پربازده","metaKeywords":"خدمات سئو, خدمات طراحی سایت","noIndex":false},{"id":"page-3","pagePath":"/blog","pageName":"وبلاگ و مقالات","metaTitle":"وبلاگ تخصصی طراحی وب و سئو | سیگنالوکس","metaDescription":"جدیدترین مقالات آموزشی، ترندهای ۲۰۲۶ و استراتژی‌های رشد آنلاین در پایگاه دانش سیگنالوکس","metaKeywords":"مقالات سئو, وبلاگ طراحی سایت","noIndex":false}]')
ON DUPLICATE KEY UPDATE `siteTitle` = VALUES(`siteTitle`);

-- 11. Initial Site Settings (Typography & Core Info)
INSERT INTO `site_settings` (`id`, `siteTitle`, `heroHeadline`, `heroSubtitle`, `contactEmail`, `contactPhone`, `contactAddress`, `instagramUrl`, `linkedinUrl`, `telegramUrl`, `githubUrl`, `fontFamily`, `fontSizeBase`, `fontHeadingScale`, `fontWeightBase`, `lineHeightScale`, `gtmContainerId`, `gtmEnabled`, `gscVerificationCode`, `melipayamakOtpBodyId`, `melipayamakEnabled`, `googleLoginEnabled`) VALUES
('default-settings', 'آژانس دیجیتال سیگنالوکس (Signalux)', 'خلق تجربه‌های دیجیتال بدون مرز و متناسب با رشد کسب‌وکار شما', 'استودیو سیگنالوکس با بهره‌گیری از طراحی مدرن وب، استراتژی سئوی داده‌محور و دیزاین سیستم‌های منحصر‌به‌فرد، برند شما را در فضای دیجیتال ممتاز می‌کند.', 'info@signalux.ir', '۰۲۱-۸۸۹۹۰۰۱۱', 'تهران، خیابان ولیعصر، برج فناوری سیگنال، طبقه ۸', 'https://instagram.com/signalux', 'https://linkedin.com/company/signalux', 'https://t.me/signalux_studio', 'https://github.com/signalux', 'Shabnam', '16px', '1.25', '400', '1.65', 'GTM-T9K8LP', 1, 'google-site-verification=abcdef1234567890', 123456, 1, 1)
ON DUPLICATE KEY UPDATE `siteTitle` = VALUES(`siteTitle`);

SET FOREIGN_KEY_CHECKS = 1;
