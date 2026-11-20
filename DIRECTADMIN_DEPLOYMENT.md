# استقرار سیگنالوکس روی DirectAdmin

این راهنما چیدمان PHP/MySQL و فرانت React را برای ریشهٔ یک دامنه پوشش می‌دهد. نسخهٔ وب‌سرور باید rewriteهای سازگار با Apache 2.4 را پشتیبانی کند و PHP باید افزونهٔ `pdo_mysql` داشته باشد.

## خروجی فرانت و فایل‌های PHP

1. با `bun install --frozen-lockfile` وابستگی‌ها را نصب کنید و `npm run build` را اجرا کنید.
2. محتویات **`dist/client/`** شامل `index.html`، `site-pages.json` و `assets/` را در ریشهٔ `public_html` قرار دهید. فایل‌های `dist/server.cjs` و sourcemap متعلق به Node هستند و باید بیرون از document root بمانند.
3. `php-backend/index.php`، `config.php`، `Core/` و `Controllers/` را در `public_html/api/` قرار دهید. فایل `php-backend/.htaccess` را به ریشهٔ `public_html` منتقل کنید. فایل SQL، راهنما، فایل‌های قدیمی PHP و ابزار خط فرمان را بیرون از مسیر عمومی نگه دارید.
4. برای نصب تازه، `php-backend/database.sql` را در دیتابیس انتخاب‌شده وارد کنید. برای دیتابیس موجود ابتدا از داده و schema پشتیبان قابل بازیابی بگیرید و سازگاری را روی staging بررسی کنید.
5. متغیرهای `APP_URL`، `DB_HOST`، `DB_PORT`، `DB_NAME`، `DB_USER`، `DB_PASS`، `JWT_ACCESS_SECRET` و `JWT_REFRESH_SECRET` را در محیط PHP-FPM/LiteSpeed تنظیم کنید. برای هر کلید JWT از یک مقدار تصادفی مستقل حداقل ۶۴ کاراکتری استفاده کنید. `GSC_VERIFICATION_CODE` از نوع اختیاری است و متای تأیید را در HTML خانه قرار می‌دهد. فایل `.env.example` مرجع نام متغیرهاست. تنظیمات حقیقی را خارج از webroot نگه دارید.
6. برای اولین مدیر یک ایمیل واقعی و یک رمز جدید در `INITIAL_ADMIN_EMAIL` و `INITIAL_ADMIN_PASSWORD` قرار دهید و از نسخهٔ CLI پروژه با همان متغیرهای دیتابیس، `php php-backend/bootstrap-admin.php` را اجرا کنید. از حساب و رمز انتشارهای قدیمی استفاده نکنید. برای حساب موجود، رمز و نشست‌ها را با روند بازیابی مجاز همان محیط تعویض یا ابطال کنید.

ورود گوگل و پیامک در PHP به PHP 8.1 یا بالاتر، OpenSSL، دسترسی TLS خروجی و `allow_url_fopen` نیاز دارد. روی دیتابیس موجود، پس از بکاپ، تغییر افزایشی [customer-auth.sql](php-backend/migrations/customer-auth.sql) را ابتدا روی staging اعمال کنید. نام متغیرهای اتصال در [راهنمای ورود](README.md) آمده است.

## تست انتشار

- `/services/seo` را با refresh مستقیم باز کنید. JS و CSS باید از `/assets/` با MIME صحیح دریافت شوند.
- `/api/v1/health` با اتصال فعال باید JSON ۲۰۰ و در قطع DB باید JSON ۵۰۳ بدهد.
- `/sitemap.xml` باید XML و `/robots.txt` باید متن بدهد. مسیرهای پیش‌نمایش پنل SEO زیر `/api/v1/public/` پاسخ JSON دارند.
- `/portfolio` باید با ۳۰۱ به `/projects` برود. نشانی ناموجود و فایل asset ناموجود هر دو باید ۴۰۴ باشند.
- مسیرهای خصوصی را هم بدون نشست و هم با یک حساب کم‌دسترسی روی staging بررسی کنید. پس از آن با حساب مدیریت تازه ورود و خروج را آزمایش کنید.

قبل از انتشار روی سایت موجود، دسترسی‌های DB و کلیدهای قبلی را در خود هاست تعویض کنید. تغییر فایل‌های GitHub نشست‌های صادرشده یا اعتبارنامه‌های هاست را عوض نمی‌کند.
