# 🚀 راهنمای جامع راه‌اندازی بک‌اند PHP و دیتابیس سیگنالوکس روی هاست دایرکت ادمین (DirectAdmin)

این پروژه اکنون به دو بخش استاندارد و کاملاً هماهنگ تقسیم شده است:
1. **بک‌اند PHP خالص (بدون وابستگی):** سازگار با تمام نسخه‌های PHP 7.4 / 8.0 / 8.1 / 8.2 / 8.3 در دایرکت ادمین و وب‌سرورهای Apache / LiteSpeed / Nginx.
2. **فرانت‌اند مدرن React + Tailwind:** با همان ظاهر و امکانات قبلی، بدون هیچ تغییر در ساختار و با اتصال مستقیم به اندپوئینت‌های PHP API.

---

## 📁 ساختار فایل‌های بک‌اند PHP (پوشه `php-backend`)

```text
/php-backend/
├── .htaccess            # تنظیمات ریدایرکت، امنیت و هدرهای مجوز در آپاچی/دایرکت‌ادمین
├── config.php           # تنظیمات اتصال به دیتابیس با مشخصات هاست شما
├── database.sql         # اسکریپت ساخت تمامی جدول‌ها و اطلاعات اولیه دیتابیس MySQL
├── db.php               # کلاس اتصال امن PDO به MySQL با پشتیبانی از UTF-8
├── jwt.php              # موتور توکن امنیتی استاندارد RFC 7519 HMAC-SHA256
├── response.php         # مدیریت خروجی JSON، پیام‌های فارسی و هدرهای CORS
├── auth.php             # احراز هویت، اعتبارسنجی با bcrypt، توکن بازیابی و لاگ نظارتی
└── index.php            # روتینگ متمرکز تمام مسیرهای API
```

---

## 🛠️ مراحل گام‌به‌گام نصب روی دایرکت ادمین (DirectAdmin)

### گام اول: ایمپورت دیتابیس در phpMyAdmin
1. وارد کنترل پنل **DirectAdmin** شوید.
2. از بخش **Account Manager** روی **phpMyAdmin** کلیک کنید.
3. دیتابیس **`soheils4_signalux`** را از منوی سمت چپ انتخاب کنید.
4. روی تب **Import** (در بالای صفحه) کلیک کنید.
5. روی **Choose File** کلیک کرده و فایل `database.sql` (موجود در پوشه `php-backend`) را انتخاب کنید.
6. روی دکمه **Import** یا **Go** در پایین صفحه کلیک کنید تا تمام جدول‌ها و اطلاعات اولیه به صورت خودکار ایجاد شوند.

---

### گام دوم: آپلود فایل‌های بک‌اند PHP
1. در DirectAdmin به بخش **File Manager** بروید.
2. وارد پوشه `public_html` شوید.
3. یک پوشه به نام `api` ایجاد کنید.
4. محتویات داخل پوشه `php-backend` (شامل فایل‌های `.htaccess`, `config.php`, `db.php`, `jwt.php`, `response.php`, `auth.php`, `index.php`) را داخل این پوشه `public_html/api` آپلود کنید.

> 💡 **نکته:** فایل `config.php` به صورت پیش‌فرض با اطلاعات دیتابیس دایرکت‌ادمین شما تنظیم شده است:
> ```php
> define('DB_HOST', 'localhost');
> define('DB_NAME', 'soheils4_signalux');
> define('DB_USER', 'soheils4_signalux');
> define('DB_PASS', 'bCe26jbu9qXAtmDGZ4dN');
> ```

---

### گام سوم: آپلود فرانت‌اند (React Frontend)
1. در محیط لوکال یا خروجی پروژه، دستور ساخت فرانت‌اند را اجرا کنید:
   ```bash
   npm run build
   ```
2. محتویات داخل پوشه `dist` (شامل `index.html`, `assets/`, و سایر فایل‌های استاتیک) را مستقیماً درون روت `public_html` هاست آپلود کنید.
3. در فایل `.htaccess` روت `public_html` مطمئن شوید که ریدایرکت برای SPA فعال است تا صفحات مختلف React کار کنند:
   ```apache
   <IfModule mod_rewrite.c>
     RewriteEngine On
     RewriteBase /
     RewriteRule ^api/ - [L]
     RewriteCond %{REQUEST_FILENAME} !-f
     RewriteCond %{REQUEST_FILENAME} !-d
     RewriteRule . /index.html [L]
   </IfModule>
   ```

---

## 🔑 مشخصات حساب مدیریت ارشد (Admin Login)

- **آدرس پنل مدیریت:** کلیک روی دکمه ورود مدیریت یا آدرس فرانت‌اند
- **ایمیل مدیر ارشد:** `admin@signalux.ir`
- **رمز عبور پیش‌فرض:** `SignaluxSuperAdmin2026!` (یا `admin123` / `signalux2026`)

---

## 📡 تست سلامت API در مرورگر
پس از آپلود فایل‌ها، می‌توانید با مراجعه به آدرس زیر، وضعیت سلامت سرور و اتصال دیتابیس را بررسی کنید:
```
https://yourdomain.com/api/v1/health
```
پاسخ دریافتی:
```json
{
  "success": true,
  "data": {
    "status": "ok",
    "service": "signalux-php-api",
    "database": {
      "status": "CONNECTED",
      "engine": "MySQL / MariaDB",
      "name": "soheils4_signalux"
    },
    "version": "1.0.0"
  },
  "message": "سامانه بک‌اند PHP با موفقیت در حال اجرا است."
}
```
