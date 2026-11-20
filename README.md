# زیرساخت بک‌اند و هسته اصلی پایگاه‌داده سیگنالوکس (Signalux Backend Core)

پروژه **سیگنالوکس (Signalux)** شامل یک معماری کامل و آماده برای محیط تولید (Production-Ready Backend Core) بر پایه **TypeScript**, **Express / NestJS architecture**, **PostgreSQL** و **Prisma ORM** همراه با سیستم جامع **احراز هویت JWT (با Token Rotation)** و **کنترل دسترسی مبتنی بر نقش و مجوز (RBAC)** است.

---

## 🚀 ویژگی‌های کلیدی زیرساخت بک‌اند (Part 2 Features)

1. **پایگاه داده PostgreSQL با Prisma ORM:**
   - شناسه UUID برای تمامی موجودیت‌های اصلی.
   - مدل‌سازی داده‌ای جامع برای کاربران (`User`), نقش‌ها (`Role`), مجوزها (`Permission`), جلسات کاربری (`RefreshToken`), لاگ‌های نظارتی غیرقابل‌تغییر (`AuditLog`), خدمات (`Service`), پروژه‌ها (`Project`), نظرات مشتریان (`Testimonial`), سوالات متداول (`FAQ`), لیدها (`LeadSubmission`) و تنظیمات سایت (`SiteSettings`).

2. **احراز هویت پیشرفته (JWT & Refresh Token Rotation):**
   - الگوریتم هش رمز عبور با استفاده از **bcrypt**.
   - توکن کوتاه‌مدت Access Token (۱۵ دقیقه) و توکن بلدمدت Refresh Token (۷ روزه).
   - توکن‌سازی امن Refresh Tokenها با هش SHA-256 در دیتابیس.
   - چرخش خودکار توکن (Token Rotation) و امکان ابطال تمام نشست‌های فعال (`POST /auth/logout-all`).

3. **سیستم کنترل دسترسی granular (RBAC System):**
   - **۵ نقش پیش‌فرض:**
     - `SUPER_ADMIN` (مدیر کل با دسترسی کامل)
     - `CONTENT_MANAGER` (مدیر محتوا)
     - `AUTHOR` (نویسنده)
     - `OPERATOR` (اپراتور لید)
     - `ANALYST` (تحلیلگر)
   - **مجوزهای ریزدانه‌ای (Granular Permissions):** مانند `dashboard.view`, `users.view`, `users.create`, `services.manage`, `projects.manage`, `leads.manage`, `settings.manage`.

4. **مدیریت خطاهای یکپارچه و پیام‌های فارسی (Persian Error Handling):**
   - ساختار خروجی استاندارد API (`{ success: true, data: ... }` / `{ success: false, error: ... }`).
   - کدهای خطای برنامه‌نویسی انگلیسی ثبات بالا (مانند `INVALID_CREDENTIALS`, `PERMISSION_DENIED`) همراه با پیام‌های قابل استفاده به زبان فارسی.

5. **امنیت و نظارت (Security & Audit Trail):**
   - هدرهای امنیتی HTTP (`X-Content-Type-Options`, `X-Frame-Options`, `X-XSS-Protection`).
   - شناسه یکتای پیگیری درخواست‌ها (`X-Request-Id`).
   - محدودکننده نرخ درخواست (Rate Limiting) روی اندپوئینت‌های احراز هویت.
   - ثبت دقیق و غیرقابل دستکاری تمام تغییرات در جدول `AuditLog`.

6. **مستندات خودکار OpenAPI / Swagger:**
   - مشاهده مستندات تعاملی API در آدرس `/api/v1/docs`
   - ساختار JSON مستندات در آدرس `/api/v1/docs.json`

---

## 🛠️ ساختار پوشه‌ها (Project Structure)

```text
/
├── prisma/
│   ├── schema.prisma       # ساختار پایگاه‌داده PostgreSQL
│   └── seed.ts             # اسکریپت سیدینگ اولیه نقش‌ها، مجوزها و مدیر ارشد
├── server/
│   ├── backend/
│   │   ├── common/         # گاردها، میدلورها، انواع داده و توابع امنیتی
│   │   ├── config/         # تنظیمات متمرکز و تایپ‌شده محیطی
│   │   ├── controllers/    # کنترلرهای API (Auth, Users, Roles, Health, Swagger)
│   │   ├── dto/            # کلاس‌های اعتباردهی ورودی DTO
│   │   └── services/       # سرویس‌های Prisma, Auth, RBAC و AuditLog
├── test/
│   └── auth.test.ts        # مجموعه تست‌های واحد هسته احراز هویت و RBAC
├── .env.example            # نمونه متغیرهای محیطی
├── package.json
└── README.md
```

---

## 🔑 متغیرهای محیطی (Environment Variables)

کپی کردن فایل `.env.example` به `.env` و تنظیم متغیرهای زیر:

```env
NODE_ENV="development"
PORT=3000

# PostgreSQL Connection
DATABASE_URL="postgresql://signalux:signalux_pass_2026@localhost:5432/signalux_db?schema=public"

# JWT Secrets
JWT_ACCESS_SECRET="signalux_jwt_access_secret_production_2026_super_key"
JWT_REFRESH_SECRET="signalux_jwt_refresh_secret_production_2026_super_key"

# Initial Super Admin Seed Credentials
INITIAL_ADMIN_EMAIL="admin@signalux.ir"
INITIAL_ADMIN_PASSWORD="SignaluxSuperAdmin2026!"
INITIAL_ADMIN_FIRST_NAME="مدیر"
INITIAL_ADMIN_LAST_NAME="ارشد"
```

---

## 🚦 نحوه اجرا و تست (Commands)

### تولید کلاینت Prisma:
```bash
npx prisma generate
```

### سیدینگ اولیه پایگاه‌داده:
```bash
npm run prisma:seed
```

### اجرای تست‌های بک‌اند:
```bash
npm test
```

---

## 📡 مسیرهای اصلی API (Core Endpoints)

| مسیر | متد | توضیحات |
| :--- | :--- | :--- |
| `/api/v1/health` | GET | بررسی سلامت سرور و دیتابیس |
| `/api/v1/auth/login` | POST | ورود کاربر و دریافت توکن‌ها |
| `/api/v1/auth/refresh` | POST | چرخش توکن بازیابی و دریافت توکن جدید |
| `/api/v1/auth/me` | GET | دریافت مشخصات و دسترسی‌های کاربر جاری |
| `/api/v1/auth/logout` | POST | خروج و ابطال توکن جاری |
| `/api/v1/auth/logout-all` | POST | ابطال تمامی نشست‌های فعال کاربر |
| `/api/v1/users` | GET / POST | لیست و ایجاد کاربران (نیازمند مجوز) |
| `/api/v1/roles` | GET | لیست نقش‌ها و مجوزهای سیستم |
| `/api/v1/docs` | GET | مستندات تعاملی Swagger API |
