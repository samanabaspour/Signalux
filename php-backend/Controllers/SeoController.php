<?php
/**
 * SEO Suite & Master Controller for Signalux
 */

namespace Signalux\Controllers;

use Signalux\Core\Database;
use Signalux\Core\Response;
use Signalux\Core\Auth;
use PDO;

class SeoController {

    /**
     * Get Master SEO Settings
     */
    public static function getSeoSettings(): void {
        $db = Database::getConnection();
        if ($db) {
            $stmt = $db->query("SELECT * FROM seo_settings LIMIT 1");
            $row = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($row) {
                Response::json(self::formatSeoSettings($row));
                return;
            }
        }

        // Default Fallback
        Response::json(self::getDefaultSeoSettings());
    }

    /**
     * Update Master SEO Settings
     */
    public static function updateSeoSettings(): void {
        Auth::requirePermission('seo.manage');
        $input = Response::getJsonInput();
        $db = Database::getConnection();

        if ($db) {
            $siteTitle = $input['siteTitle'] ?? 'آژانس دیجیتال سیگنالوکس (Signalux)';
            $titleSeparator = $input['titleSeparator'] ?? '|';
            $defaultMetaDescription = $input['defaultMetaDescription'] ?? '';
            $defaultMetaKeywords = $input['defaultMetaKeywords'] ?? '';
            $canonicalBaseUrl = rtrim($input['canonicalBaseUrl'] ?? 'https://signalux.ir', '/');
            $robotsTxt = $input['robotsTxt'] ?? "User-agent: *\nAllow: /\nDisallow: /admin\n\nSitemap: {$canonicalBaseUrl}/sitemap.xml";
            $sitemapEnabled = !empty($input['sitemapEnabled']) ? 1 : 0;
            $sitemapChangefreq = $input['sitemapChangefreq'] ?? 'weekly';
            $sitemapPriority = $input['sitemapPriority'] ?? '0.8';
            $googleVerificationCode = $input['googleVerificationCode'] ?? '';
            $bingVerificationCode = $input['bingVerificationCode'] ?? '';
            $enableJsonLdSchema = !empty($input['enableJsonLdSchema']) ? 1 : 0;
            $organizationName = $input['organizationName'] ?? 'استودیو دیجیتال سیگنالوکس';
            $organizationLogo = $input['organizationLogo'] ?? '';
            $organizationPhone = $input['organizationPhone'] ?? '۰۹۳۵۲۹۹۷۲۷۲';
            $twitterHandle = $input['twitterHandle'] ?? '@signalux_ir';
            $defaultOgImage = $input['defaultOgImage'] ?? '';
            $redirects = is_array($input['redirects'] ?? null) ? json_encode($input['redirects'], JSON_UNESCAPED_UNICODE) : '[]';
            $pageRules = is_array($input['pageRules'] ?? null) ? json_encode($input['pageRules'], JSON_UNESCAPED_UNICODE) : '[]';

            // Check if row exists
            $exists = $db->query("SELECT COUNT(*) FROM seo_settings")->fetchColumn();

            if ($exists > 0) {
                $stmt = $db->prepare("
                    UPDATE seo_settings SET
                        siteTitle = ?, titleSeparator = ?, defaultMetaDescription = ?, defaultMetaKeywords = ?,
                        canonicalBaseUrl = ?, robotsTxt = ?, sitemapEnabled = ?, sitemapChangefreq = ?,
                        sitemapPriority = ?, googleVerificationCode = ?, bingVerificationCode = ?,
                        enableJsonLdSchema = ?, organizationName = ?, organizationLogo = ?,
                        organizationPhone = ?, twitterHandle = ?, defaultOgImage = ?,
                        redirects = ?, pageRules = ?, updatedAt = NOW()
                ");
                $stmt->execute([
                    $siteTitle, $titleSeparator, $defaultMetaDescription, $defaultMetaKeywords,
                    $canonicalBaseUrl, $robotsTxt, $sitemapEnabled, $sitemapChangefreq,
                    $sitemapPriority, $googleVerificationCode, $bingVerificationCode,
                    $enableJsonLdSchema, $organizationName, $organizationLogo,
                    $organizationPhone, $twitterHandle, $defaultOgImage,
                    $redirects, $pageRules
                ]);
            } else {
                $stmt = $db->prepare("
                    INSERT INTO seo_settings (
                        id, siteTitle, titleSeparator, defaultMetaDescription, defaultMetaKeywords,
                        canonicalBaseUrl, robotsTxt, sitemapEnabled, sitemapChangefreq,
                        sitemapPriority, googleVerificationCode, bingVerificationCode,
                        enableJsonLdSchema, organizationName, organizationLogo,
                        organizationPhone, twitterHandle, defaultOgImage,
                        redirects, pageRules
                    ) VALUES (
                        'default-seo', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
                    )
                ");
                $stmt->execute([
                    $siteTitle, $titleSeparator, $defaultMetaDescription, $defaultMetaKeywords,
                    $canonicalBaseUrl, $robotsTxt, $sitemapEnabled, $sitemapChangefreq,
                    $sitemapPriority, $googleVerificationCode, $bingVerificationCode,
                    $enableJsonLdSchema, $organizationName, $organizationLogo,
                    $organizationPhone, $twitterHandle, $defaultOgImage,
                    $redirects, $pageRules
                ]);
            }

            self::getSeoSettings();
            return;
        }

        Response::error('خطا در ذخیره تنظیمات سئو.', 500);
    }

    private static function formatSeoSettings(array $row): array {
        $redirects = [];
        if (!empty($row['redirects'])) {
            $decoded = json_decode($row['redirects'], true);
            $redirects = is_array($decoded) ? $decoded : [];
        }

        $pageRules = [];
        if (!empty($row['pageRules'])) {
            $decoded = json_decode($row['pageRules'], true);
            $pageRules = is_array($decoded) ? $decoded : [];
        }

        return [
            'siteTitle'               => $row['siteTitle'] ?? 'آژانس دیجیتال سیگنالوکس (Signalux)',
            'titleSeparator'          => $row['titleSeparator'] ?? '|',
            'defaultMetaDescription'  => $row['defaultMetaDescription'] ?? '',
            'defaultMetaKeywords'     => $row['defaultMetaKeywords'] ?? '',
            'canonicalBaseUrl'        => $row['canonicalBaseUrl'] ?? 'https://signalux.ir',
            'robotsTxt'               => $row['robotsTxt'] ?? "User-agent: *\nAllow: /\nDisallow: /admin\n\nSitemap: https://signalux.ir/sitemap.xml",
            'sitemapEnabled'          => (bool)($row['sitemapEnabled'] ?? 1),
            'sitemapChangefreq'       => $row['sitemapChangefreq'] ?? 'weekly',
            'sitemapPriority'         => $row['sitemapPriority'] ?? '0.8',
            'googleVerificationCode'  => $row['googleVerificationCode'] ?? '',
            'bingVerificationCode'    => $row['bingVerificationCode'] ?? '',
            'enableJsonLdSchema'      => (bool)($row['enableJsonLdSchema'] ?? 1),
            'organizationName'        => $row['organizationName'] ?? 'استودیو دیجیتال سیگنالوکس',
            'organizationLogo'        => $row['organizationLogo'] ?? '',
            'organizationPhone'       => $row['organizationPhone'] ?? '۰۹۳۵۲۹۹۷۲۷۲',
            'twitterHandle'           => $row['twitterHandle'] ?? '@signalux_ir',
            'defaultOgImage'          => $row['defaultOgImage'] ?? '',
            'redirects'               => $redirects,
            'pageRules'               => $pageRules
        ];
    }

    private static function getDefaultSeoSettings(): array {
        return [
            'siteTitle'              => 'آژانس دیجیتال سیگنالوکس (Signalux)',
            'titleSeparator'         => '|',
            'defaultMetaDescription' => 'سیگنالوکس؛ آژانس پیشرو در طراحی اختصاصی وب‌سایت، سئو تخصصی و دیجیتال مارکتینگ داده‌محور با متدهای ۲۰۲۶',
            'defaultMetaKeywords'    => 'طراحی سایت, سئو سایت, دیجیتال مارکتینگ, آژانس دیجیتال, توسعه وب',
            'canonicalBaseUrl'       => 'https://signalux.ir',
            'robotsTxt'              => "User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/v1/admin/\n\nSitemap: https://signalux.ir/sitemap.xml",
            'sitemapEnabled'         => true,
            'sitemapChangefreq'      => 'weekly',
            'sitemapPriority'        => '0.8',
            'googleVerificationCode' => 'google-site-verification=abcdef1234567890',
            'bingVerificationCode'   => '',
            'enableJsonLdSchema'     => true,
            'organizationName'       => 'استودیو دیجیتال سیگنالوکس',
            'organizationLogo'       => '',
            'organizationPhone'      => '۰۹۳۵۲۹۹۷۲۷۲',
            'twitterHandle'          => '@signalux_ir',
            'defaultOgImage'         => '',
            'redirects'              => [
                [
                    'id'         => 'red-1',
                    'sourcePath' => '/old-services',
                    'targetPath' => '/services',
                    'type'       => 301,
                    'isActive'   => true
                ]
            ],
            'pageRules'              => [
                [
                    'id'              => 'page-1',
                    'pagePath'        => '/',
                    'pageName'        => 'صفحه اصلی',
                    'metaTitle'       => 'آژانس دیجیتال مارکتینگ و طراحی وب سیگنالوکس',
                    'metaDescription' => 'خلق تجربه‌های دیجیتال بدون مرز با استودیو سیگنالوکس، طراحی وب اختصاصی و سئو پایدار',
                    'metaKeywords'    => 'طراحی سایت, سئو, مارکتینگ',
                    'noIndex'         => false
                ],
                [
                    'id'              => 'page-2',
                    'pagePath'        => '/services',
                    'pageName'        => 'خدمات تخصصی',
                    'metaTitle'       => 'خدمات توسعه وب و مارکتینگ دیجیتال | سیگنالوکس',
                    'metaDescription' => 'ارائه خدمات طراحی وب‌سایت‌های واکنش‌گرا، سئو تخصصی و کمپین‌های تبلیغاتی پربازده',
                    'metaKeywords'    => 'خدمات سئو, خدمات طراحی سایت',
                    'noIndex'         => false
                ],
                [
                    'id'              => 'page-3',
                    'pagePath'        => '/blog',
                    'pageName'        => 'وبلاگ و مقالات',
                    'metaTitle'       => 'وبلاگ تخصصی طراحی وب و سئو | سیگنالوکس',
                    'metaDescription' => 'جدیدترین مقالات آموزشی، ترندهای ۲۰۲۶ و استراتژی‌های رشد آنلاین در پایگاه دانش سیگنالوکس',
                    'metaKeywords'    => 'مقالات سئو, وبلاگ طراحی سایت',
                    'noIndex'         => false
                ]
            ]
        ];
    }
}
