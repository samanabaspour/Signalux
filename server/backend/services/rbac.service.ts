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

  // Media
  { key: 'media.view', group: 'رسانه', description: 'مشاهده کتابخانه رسانه' },
  { key: 'media.upload', group: 'رسانه', description: 'آپلود و مدیریت فایل‌ها' },
];

class RbacService {
  /**
   * Get roles and permissions for a user
   */
  public async getUserAuthContext(userId: string): Promise<{ roles: string[]; permissions: string[] }> {
    if (!prismaService.status) {
      // In-memory or initial fallback
      return {
        roles: ['SUPER_ADMIN'],
        permissions: SYSTEM_PERMISSIONS.map(p => p.key),
      };
    }

    try {
      const userRoles = await prismaService.prisma.userRole.findMany({
        where: { userId },
        include: {
          role: {
            include: {
              rolePermissions: {
                include: {
                  permission: true,
                },
              },
            },
          },
        },
      });

      const roles = userRoles.map(ur => ur.role.name);
      
      // If Super Admin, grant all permissions automatically
      if (roles.includes('SUPER_ADMIN')) {
        return {
          roles,
          permissions: SYSTEM_PERMISSIONS.map(p => p.key),
        };
      }

      const permissionSet = new Set<string>();
      userRoles.forEach(ur => {
        ur.role.rolePermissions.forEach(rp => {
          permissionSet.add(rp.permission.key);
        });
      });

      return {
        roles,
        permissions: Array.from(permissionSet),
      };
    } catch (err) {
      console.error('Error fetching RBAC context:', err);
      return { roles: ['SUPER_ADMIN'], permissions: SYSTEM_PERMISSIONS.map(p => p.key) };
    }
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
