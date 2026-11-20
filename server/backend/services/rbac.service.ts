import { prismaService } from './prisma.service';

export const SYSTEM_ROLES = [
  { name: 'SUPER_ADMIN', labelPersian: 'مدیر کل', description: 'دسترسی کامل و بدون محدودیت به تمام بخش‌ها' },
  { name: 'CONTENT_MANAGER', labelPersian: 'مدیر محتوا', description: 'مدیریت کامل محتوای وب‌سایت، خدمات، پروژه‌ها و نظرات' },
  { name: 'AUTHOR', labelPersian: 'نویسنده', description: 'ایجاد و ویرایش مقالات وبلاگ و محتوای متنی' },
  { name: 'OPERATOR', labelPersian: 'اپراتور لید', description: 'بررسی و پیگیری درخواست‌های مشاوره و تماس' },
  { name: 'ANALYST', labelPersian: 'تحلیلگر', description: 'مشاهده گزارش‌ها، آمار و سناریوهای بازدهی' },
];

export const SYSTEM_PERMISSIONS = [
  // Dashboard
  { key: 'dashboard.view', group: 'داشبورد', description: 'مشاهده آمار کلی داشبورد' },

  // User Management
  { key: 'users.view', group: 'کاربران', description: 'مشاهده لیست کاربران' },
  { key: 'users.create', group: 'کاربران', description: 'ایجاد کاربر جدید' },
  { key: 'users.update', group: 'کاربران', description: 'ویرایش اطلاعات کاربر' },
  { key: 'users.delete', group: 'کاربران', description: 'حذف یا تعلیق کاربر' },

  // Roles & Permissions
  { key: 'roles.view', group: 'نقش‌ها', description: 'مشاهده نقش‌ها و دسترسی‌ها' },
  { key: 'roles.manage', group: 'نقش‌ها', description: 'مدیریت سطح دسترسی نقش‌ها' },

  // Services
  { key: 'services.view', group: 'خدمات', description: 'مشاهده لیست خدمات' },
  { key: 'services.manage', group: 'خدمات', description: 'افزودن، ویرایش و حذف خدمات' },

  // Projects / Portfolio
  { key: 'projects.view', group: 'پروژه‌ها', description: 'مشاهده نمونه‌کارها' },
  { key: 'projects.manage', group: 'پروژه‌ها', description: 'افزودن، ویرایش و حذف پروژه‌ها' },

  // Testimonials
  { key: 'testimonials.view', group: 'نظرات', description: 'مشاهده نظرات مشتریان' },
  { key: 'testimonials.manage', group: 'نظرات', description: 'مدیریت نظرات کارفرمایان' },

  // FAQs
  { key: 'faqs.view', group: 'سوالات متداول', description: 'مشاهده سوالات متداول' },
  { key: 'faqs.manage', group: 'سوالات متداول', description: 'مدیریت سوالات متداول' },

  // Leads
  { key: 'leads.view', group: 'لیدها', description: 'مشاهده پیام‌ها و درخواست‌های مشاوره' },
  { key: 'leads.manage', group: 'لیدها', description: 'تغییر وضعیت و حذف درخواست‌ها' },

  // Settings
  { key: 'settings.view', group: 'تنظیمات', description: 'مشاهده تنظیمات سایت' },
  { key: 'settings.manage', group: 'تنظیمات', description: 'ویرایش تنظیمات اصلی سایت' },

  { key: 'blog.manage', group: 'بلاگ', description: 'مدیریت مقاله‌ها' },
  { key: 'comments.manage', group: 'دیدگاه‌ها', description: 'بازبینی دیدگاه‌ها' },
  { key: 'seo.manage', group: 'سئو', description: 'ویرایش تنظیمات سئو' },
  { key: 'tickets.manage', group: 'پشتیبانی', description: 'مشاهده و پاسخ‌گویی تیکت‌ها' },
  { key: 'tickets.delete', group: 'پشتیبانی', description: 'حذف تیکت‌ها' },

  // Media
  { key: 'media.view', group: 'رسانه', description: 'مشاهده کتابخانه رسانه' },
  { key: 'media.upload', group: 'رسانه', description: 'آپلود و مدیریت فایل‌ها' },
];

class RbacService {
  /**
   * Get roles and permissions for a user
   */
  public async getUserAuthContext(userId: string): Promise<{ roles: string[]; permissions: string[] }> {
    const userRoles = await prismaService.prisma.userRole.findMany({
      where: { userId },
      include: { role: { include: { rolePermissions: { include: { permission: true } } } } },
    });
    const roles = userRoles.map(({ role }) => role.name);
    const permissions = roles.includes('SUPER_ADMIN')
      ? SYSTEM_PERMISSIONS.map(({ key }) => key)
      : [...new Set(userRoles.flatMap(({ role }) => role.rolePermissions.map(({ permission }) => permission.key)))];
    return { roles, permissions };
  }

  /**
   * Check if permissions list contains target permission
   */
  public hasPermission(userPermissions: string[], requiredPermission: string): boolean {
    if (userPermissions.includes('SUPER_ADMIN')) return true;
    return userPermissions.includes(requiredPermission);
  }
}

export const rbacService = new RbacService();
