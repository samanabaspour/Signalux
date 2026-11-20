# 🚀 راهنمای جامع و گام‌به‌گام راه‌اندازی پروژه سیگنالوکس روی هاست دایرکت‌ادمین (DirectAdmin)

این راهنما به شما کمک می‌کند تا فرانت‌اند **React** و بک‌اند **PHP / MySQL** سیگنالوکس را بدون نیاز به سرور Node.js و دقیقاً روی هاست اشتراکی لینوکس دایرکت‌ادمین با وب‌سرور آپاچی یا لایت‌اسپید (LiteSpeed) مستقر کنید.

---

## 🗂️ ساختار فایل‌ها در دایرکت‌ادمین (`public_html`)

پس از انتقال فایل‌ها، ساختار پوشه `public_html` هاست شما به شکل زیر خواهد بود:

```text
public_html/
├── .htaccess                 <-- فایل تنظیم روتینگ فرانت‌اند React و هدایت /api/ به PHP
├── index.html                <-- فایل اصلی فرانت‌اند React (از پوشه dist)
├── assets/                   <-- فایل‌های استایل و جاوااسکریپت کامپایل‌شده فرانت‌اند
├── favicon.ico
├── api/                      <-- پوشه بک‌اند PHP (محتویات پوشه php-backend)
│   ├── .htaccess
│   ├── .env
│   ├── config.php
│   ├── index.php             <-- ورودی اصلی API
│   ├── database.sql          <-- اسکریپت ساخت دیتابیس
│   ├── Core/
│   │   ├── Database.php
│   │   ├── Response.php
│   │   ├── JWT.php
│   │   └── Auth.php
│   └── Controllers/
│       ├── PublicController.php
│       ├── AuthController.php
│       ├── AdminController.php
│       └── UserController.php
```

---

## 🛠️ مراحل ۴ گانه راه‌اندازی در دایرکت‌ادمین

### گام اول: ساخت و ایمپورت دیتابیس در DirectAdmin
1. وارد کنترل‌پنل **DirectAdmin** خود شوید.
2. به بخش **MySQL Management** (مدیریت پایگاه‌داده) بروید.
3. در صورتی که دیتابیس `soheils4_signalux` ساخته نشده است، آن را ایجاد کنید.
4. روی دکمه **phpMyAdmin** کلیک کنید و وارد شوید.
5. دیتابیس `soheils4_signalux` را از ستون سمت چپ انتخاب کنید.
6. از منوی بالا روی تب **Import** (وارد کردن) کلیک کنید.
7. فایل `php-backend/database.sql` را انتخاب کرده و دکمه **Go** یا **Import** را بزنید.
   *(تمام ۱۴ جدول به همراه نقش‌ها، دسترسی‌ها و اطلاعات اولیه به صورت خودکار ایجاد می‌شوند).*

---

### گام دوم: ساخت نسخه نهایی فرانت‌اند (Build)
در محیط پروژه، دستور زیر اجرا می‌شود تا خروجی نهایی فرانت‌اند در پوشه `dist` تولید شود:
```bash
npm run build
```
*(محتویات پوشه `dist` شامل `index.html` و پوشه `assets` را در ریشه `public_html` هاست آپلود کنید).*

---

### گام سوم: آپلود بک‌اند PHP
1. در `public_html` هاست خود، یک پوشه با نام `api` بسازید.
2. تمامی فایل‌ها و پوشه‌های داخل `php-backend/` (به جز `database.sql`) را داخل این پوشه `api` آپلود کنید.
3. فایل `.env.example` را به `.env` تغییر نام دهید و مطمئن شوید اطلاعات دیتابیس شما به شکل زیر است:
```env
APP_ENV=production
APP_URL=https://yourdomain.com

DB_HOST=localhost
DB_PORT=3306
DB_NAME=soheils4_signalux
DB_USER=soheils4_signalux
DB_PASS=bCe26jbu9qXAtmDGZ4dN

JWT_ACCESS_SECRET=signalux_jwt_access_secret_production_2026_super_key
JWT_REFRESH_SECRET=signalux_jwt_refresh_secret_production_2026_super_key
```

---

### گام چهارم: قرار دادن فایل `.htaccess` در ریشه `public_html`
فایل `.htaccess` موجود در `php-backend/.htaccess` را در ریشه `public_html` قرار دهید تا:
- درخواست‌های روت‌های React (مانند `/about`, `/services`, `/admin` و ...) به `index.html` هدایت شوند.
- درخواست‌های API (مانند `/api/v1/...`) مستقیماً توسط `api/index.php` پردازش شوند.

---

## 🔐 مشخصات ورود به پنل مدیریت (Admin Dashboard)

- **آدرس پنل مدیریت:** `https://yourdomain.com/admin` (یا دکمه ورود مدیریت در سایت)
- **ایمیل مدیر ارشد:** `admin@signalux.ir`
- **رمز عبور:** `SignaluxSuperAdmin2026!`

---

## 🧪 تست سلامت API بعد از راه‌اندازی

برای اطمینان از اتصال صحیح به دیتابیس در هاست، آدرس زیر را در مرورگر باز کنید:
```text
https://yourdomain.com/api/v1/health
```
پاسخ دریافتی باید به صورت زیر باشد:
```json
{
  "success": true,
  "data": {
    "status": "OK",
    "runtime": "PHP 8.x",
    "database": {
      "status": "CONNECTED",
      "provider": "mysql",
      "database": "soheils4_signalux"
    },
    "version": "1.0.0"
  }
}
```
