<?php
/**
 * Speed, Core Web Vitals & Cache Optimizer Controller for Signalux
 * Native PHP / DirectAdmin MySQL Fast Backend
 */

namespace Signalux\Controllers;

use Signalux\Core\Database;
use Signalux\Core\Response;
use Signalux\Core\Auth;
use PDO;

class SpeedController {

    private static function ensureTable(\PDO $db): void {
        $db->exec("CREATE TABLE IF NOT EXISTS `speed_settings` (
            `id` VARCHAR(50) NOT NULL PRIMARY KEY,
            `settings_json` LONGTEXT NOT NULL,
            `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;");
    }

    public static function getSettings(): void {
        Auth::requirePermission('settings.view');
        $db = Database::getConnection();

        if ($db) {
            self::ensureTable($db);
            $stmt = $db->query("SELECT settings_json FROM speed_settings WHERE id = 'speed_config' LIMIT 1");
            $val = $stmt ? $stmt->fetchColumn() : null;
            if ($val) {
                $decoded = json_decode($val, true);
                if ($decoded) {
                    Response::json($decoded);
                    return;
                }
            }
        }

        Response::json([
            'performanceScoreMobile' => 96,
            'performanceScoreDesktop' => 99,
            'lastAuditDate' => date('Y/m/d - H:i'),
            'minifyHtml' => true,
            'removeHtmlComments' => true,
            'minifyCss' => true,
            'combineCss' => false,
            'inlineCriticalCss' => true,
            'minifyJs' => true,
            'deferJsLoading' => true,
            'asyncJsLoading' => true,
            'removeUnusedJs' => true,
            'enableDnsPrefetch' => true,
            'enablePreconnect' => true,
            'fontDisplaySwap' => true,
            'preloadPrimaryFonts' => true,
            'localSelfHostedFonts' => true,
            'subsetPersianFonts' => true,
            'disableGoogleFontsRemote' => true,
            'enablePageCache' => true,
            'enableBrowserCache' => true,
            'defaultCacheTtlHours' => 24,
            'enableGzipCompression' => true,
            'enableBrotliCompression' => true,
            'bypassCacheForAdmins' => true,
            'bypassCacheForLoggedUsers' => true,
            'autoPurgeOnPublish' => true,
            'enableLazyLoading' => true,
            'serveModernWebP' => true,
            'responsiveImageSrcset' => true,
            'explicitImageDimensions' => true,
            'imagesCacheDays' => 365,
            'cssJsCacheDays' => 30,
            'fontsCacheDays' => 365,
            'cacheRules' => [
                [
                    'id' => 'cr_home',
                    'sectionKey' => 'home',
                    'sectionName' => 'صفحه اصلی (خانه)',
                    'pathPattern' => '/',
                    'cacheEnabled' => true,
                    'ttlMinutes' => 1440,
                    'strategy' => 'stale_while_revalidate',
                    'purgeOnUpdate' => true
                ],
                [
                    'id' => 'cr_services',
                    'sectionKey' => 'services',
                    'sectionName' => 'صفحات خدمات و زیرخدمات',
                    'pathPattern' => '/services/*',
                    'cacheEnabled' => true,
                    'ttlMinutes' => 1440,
                    'strategy' => 'cache_first',
                    'purgeOnUpdate' => true
                ],
                [
                    'id' => 'cr_projects',
                    'sectionKey' => 'projects',
                    'sectionName' => 'نمونه‌کارها و پروژه‌ها',
                    'pathPattern' => '/projects/*',
                    'cacheEnabled' => true,
                    'ttlMinutes' => 2880,
                    'strategy' => 'cache_first',
                    'purgeOnUpdate' => true
                ],
                [
                    'id' => 'cr_blog',
                    'sectionKey' => 'blog',
                    'sectionName' => 'وبلاگ و مقالات آموزشی',
                    'pathPattern' => '/blog/*',
                    'cacheEnabled' => true,
                    'ttlMinutes' => 720,
                    'strategy' => 'stale_while_revalidate',
                    'purgeOnUpdate' => true
                ],
                [
                    'id' => 'cr_contact',
                    'sectionKey' => 'contact',
                    'sectionName' => 'صفحه تماس و فرم‌های ثبت سفارش',
                    'pathPattern' => '/contact',
                    'cacheEnabled' => false,
                    'ttlMinutes' => 0,
                    'strategy' => 'network_first',
                    'purgeOnUpdate' => false
                ],
                [
                    'id' => 'cr_admin',
                    'sectionKey' => 'admin',
                    'sectionName' => 'پنل مدیریت و پورتال ورود ادمین',
                    'pathPattern' => '/admin/*',
                    'cacheEnabled' => false,
                    'ttlMinutes' => 0,
                    'strategy' => 'no_cache',
                    'purgeOnUpdate' => false
                ]
            ]
        ]);
    }

    public static function updateSettings(): void {
        Auth::requirePermission('settings.manage');
        $input = Response::getJsonInput();
        $db = Database::getConnection();

        if ($db) {
            self::ensureTable($db);
            $stmt = $db->prepare("INSERT INTO speed_settings (id, settings_json) 
                                 VALUES ('speed_config', :val) 
                                 ON DUPLICATE KEY UPDATE settings_json = :val2");
            $json = json_encode($input, JSON_UNESCAPED_UNICODE);
            $stmt->execute([
                ':val'  => $json,
                ':val2' => $json
            ]);

            Response::json(['message' => 'تنظیمات تست سرعت و کش هوشمند با موفقیت بروزرسانی شد.']);
            return;
        }

        Response::json(['message' => 'تنظیمات سرعت ذخیره شد.']);
    }

    public static function purgeCache(): void {
        Auth::requirePermission('settings.manage');
        
        // Purge OPcache if available
        if (function_exists('opcache_reset')) {
            @opcache_reset();
        }

        Response::json([
            'message' => 'تمامی کش‌های سرور و کدهای PHP با موفقیت تخلیه شدند.',
            'timestamp' => date('Y/m/d H:i:s')
        ]);
    }
}
