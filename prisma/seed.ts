import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

const ROLES_DATA = [
  { name: 'SUPER_ADMIN', labelPersian: 'مدیر کل', description: 'دسترسی کامل و بدون محدودیت به تمام بخش‌های سیستم' },
  { name: 'CONTENT_MANAGER', labelPersian: 'مدیر محتوا', description: 'مدیریت کامل وب‌سایت، خدمات، نمونه‌کارها و نظرات' },
  { name: 'AUTHOR', labelPersian: 'نویسنده', description: 'ایجاد و انتشار مقالات آموزشی و خبری' },
  { name: 'OPERATOR', labelPersian: 'اپراتور لید', description: 'بررسی و پاسخگویی به درخواست‌های مشاوره' },
  { name: 'ANALYST', labelPersian: 'تحلیلگر', description: 'مشاهده گزارش‌ها و داشبورد آمار' },
];

const PERMISSIONS_DATA = [
  { key: 'dashboard.view', group: 'داشبورد', description: 'مشاهده آمار کلی داشبورد' },

  { key: 'users.view', group: 'کاربران', description: 'مشاهده لیست کاربران' },
  { key: 'users.create', group: 'کاربران', description: 'ایجاد کاربر جدید' },
  { key: 'users.update', group: 'کاربران', description: 'ویرایش اطلاعات کاربر' },
  { key: 'users.delete', group: 'کاربران', description: 'حذف یا تعلیق کاربر' },

  { key: 'roles.view', group: 'نقش‌ها', description: 'مشاهده نقش‌ها و دسترسی‌ها' },
  { key: 'roles.manage', group: 'نقش‌ها', description: 'مدیریت سطح دسترسی نقش‌ها' },

  { key: 'services.view', group: 'خدمات', description: 'مشاهده خدمات' },
  { key: 'services.manage', group: 'خدمات', description: 'مدیریت کامل خدمات' },

  { key: 'projects.view', group: 'پروژه‌ها', description: 'مشاهده پروژه‌ها' },
  { key: 'projects.manage', group: 'پروژه‌ها', description: 'مدیریت کامل پروژه‌ها' },

  { key: 'testimonials.view', group: 'نظرات', description: 'مشاهده نظرات کارفرمایان' },
  { key: 'testimonials.manage', group: 'نظرات', description: 'مدیریت نظرات کارفرمایان' },

  { key: 'faqs.view', group: 'سوالات متداول', description: 'مشاهده سوالات متداول' },
  { key: 'faqs.manage', group: 'سوالات متداول', description: 'مدیریت سوالات متداول' },

  { key: 'leads.view', group: 'لیدها', description: 'مشاهده درخواست‌های مشاوره' },
  { key: 'leads.manage', group: 'لیدها', description: 'پیگیری و تغییر وضعیت لیدها' },

  { key: 'settings.view', group: 'تنظیمات', description: 'مشاهده تنظیمات' },
  { key: 'settings.manage', group: 'تنظیمات', description: 'ویرایش تنظیمات اصلی سیستم' },

  { key: 'media.view', group: 'رسانه', description: 'مشاهده کتابخانه فایل‌ها' },
  { key: 'media.upload', group: 'رسانه', description: 'آپلود فایل‌های جدید' },
];

async function main() {
  console.log('🌱 Starting Signalux Database Seed Process...');

  // 1. Seed Roles
  const createdRolesMap = new Map<string, string>();
  for (const roleData of ROLES_DATA) {
    const role = await prisma.role.upsert({
      where: { name: roleData.name },
      update: {
        labelPersian: roleData.labelPersian,
        description: roleData.description,
      },
      create: roleData,
    });
    createdRolesMap.set(role.name, role.id);
    console.log(`✅ Role seeded: ${role.name} (${role.labelPersian})`);
  }

  // 2. Seed Permissions
  const createdPermissionsMap = new Map<string, string>();
  for (const permData of PERMISSIONS_DATA) {
    const perm = await prisma.permission.upsert({
      where: { key: permData.key },
      update: {
        group: permData.group,
        description: permData.description,
      },
      create: permData,
    });
    createdPermissionsMap.set(perm.key, perm.id);
  }
  console.log(`✅ ${PERMISSIONS_DATA.length} Permissions seeded.`);

  // 3. Link Role Permissions
  const superAdminRoleId = createdRolesMap.get('SUPER_ADMIN');
  if (superAdminRoleId) {
    for (const [, permId] of createdPermissionsMap) {
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: superAdminRoleId,
            permissionId: permId,
          },
        },
        update: {},
        create: {
          roleId: superAdminRoleId,
          permissionId: permId,
        },
      });
    }
    console.log('✅ Linked all permissions to SUPER_ADMIN role.');
  }

  // 4. Seed Initial Super Admin User
  const adminEmail = (process.env.INITIAL_ADMIN_EMAIL || 'admin@signalux.ir').trim().toLowerCase();
  const adminPassword = process.env.INITIAL_ADMIN_PASSWORD || 'SignaluxSuperAdmin2026!';
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash,
      status: 'ACTIVE',
    },
    create: {
      firstName: process.env.INITIAL_ADMIN_FIRST_NAME || 'مدیر',
      lastName: process.env.INITIAL_ADMIN_LAST_NAME || 'ارشد',
      email: adminEmail,
      phone: '۰۹۱۲۰۰۰۰۰۰۰',
      passwordHash,
      status: 'ACTIVE',
      isEmailVerified: true,
    },
  });

  if (superAdminRoleId) {
    await prisma.userRole.upsert({
      where: {
        userId_roleId: {
          userId: adminUser.id,
          roleId: superAdminRoleId,
        },
      },
      update: {},
      create: {
        userId: adminUser.id,
        roleId: superAdminRoleId,
      },
    });
  }
  console.log(`👤 Initial Super Admin account seeded: ${adminUser.email}`);

  // 5. Seed Default Site Settings
  const existingSettings = await prisma.siteSettings.findFirst();
  if (!existingSettings) {
    await prisma.siteSettings.create({
      data: {
        siteTitle: 'آژانس دیجیتال سیگنالوکس (Signalux)',
        heroHeadline: 'خلق تجربه‌های دیجیتال بدون مرز',
        heroSubtitle: 'استودیو سیگنالوکس با بهره‌گیری از طراحی مدرن وب و سئو برند شما را ممتاز می‌کند.',
        contactEmail: 'info@signalux.ir',
        contactPhone: '۰۲۱-۸۸۹۹۰۰۱۱',
        contactAddress: 'تهران، خیابان ولیعصر، برج فناوری سیگنال',
        instagramUrl: 'https://instagram.com/signalux',
        linkedinUrl: 'https://linkedin.com/company/signalux',
        telegramUrl: 'https://t.me/signalux_studio',
        githubUrl: 'https://github.com/signalux',
      },
    });
    console.log('⚙️ Default SiteSettings seeded.');
  }

  console.log('🎉 Seed Completed Successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
