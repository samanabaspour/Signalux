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
            $organizationPhone = $input['organizationPhone'] ?? '۰۲۱-۸۸۹۹۰۰۱۱';
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

    /**
     * Generate & Serve Dynamic Sitemap.xml
     */
    public static function generateSitemapXml(): void {
        $db = Database::getConnection();
        $baseUrl = 'https://signalux.ir';

        if ($db) {
            $stmt = $db->query("SELECT canonicalBaseUrl FROM seo_settings LIMIT 1");
            $url = $stmt->fetchColumn();
            if (!empty($url)) {
                $baseUrl = rtrim($url, '/');
            }
        }

        $xml = '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
        $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";

        // Static core routes
        $staticRoutes = [
            ['loc' => '/', 'priority' => '1.0', 'changefreq' => 'daily'],
            ['loc' => '/services', 'priority' => '0.9', 'changefreq' => 'weekly'],
            ['loc' => '/portfolio', 'priority' => '0.9', 'changefreq' => 'weekly'],
            ['loc' => '/blog', 'priority' => '0.9', 'changefreq' => 'daily'],
            ['loc' => '/about-us', 'priority' => '0.7', 'changefreq' => 'monthly'],
            ['loc' => '/contact-us', 'priority' => '0.8', 'changefreq' => 'monthly'],
            ['loc' => '/web-design', 'priority' => '0.85', 'changefreq' => 'weekly'],
            ['loc' => '/seo-services', 'priority' => '0.85', 'changefreq' => 'weekly']
        ];

        $today = date('Y-m-d');

        foreach ($staticRoutes as $r) {
            $xml .= "  <url>\n";
            $xml .= "    <loc>{$baseUrl}{$r['loc']}</loc>\n";
            $xml .= "    <lastmod>{$today}</lastmod>\n";
            $xml .= "    <changefreq>{$r['changefreq']}</changefreq>\n";
            $xml .= "    <priority>{$r['priority']}</priority>\n";
            $xml .= "  </url>\n";
        }

        // Dynamic blog articles
        if ($db) {
            $stmt = $db->query("SELECT slug, publishedAt, updatedAt FROM blog_posts WHERE status = 'published' ORDER BY publishedAt DESC");
            $posts = $stmt->fetchAll(PDO::FETCH_ASSOC);

            foreach ($posts as $post) {
                $postDate = !empty($post['updatedAt']) ? date('Y-m-d', strtotime($post['updatedAt'])) : date('Y-m-d', strtotime($post['publishedAt']));
                $xml .= "  <url>\n";
                $xml .= "    <loc>{$baseUrl}/blog/{$post['slug']}</loc>\n";
                $xml .= "    <lastmod>{$postDate}</lastmod>\n";
                $xml .= "    <changefreq>weekly</changefreq>\n";
                $xml .= "    <priority>0.8</priority>\n";
                $xml .= "  </url>\n";
            }

            // Dynamic Projects
            $stmt = $db->query("SELECT slug, updatedAt FROM projects WHERE is_published = 1");
            $projects = $stmt->fetchAll(PDO::FETCH_ASSOC);

            foreach ($projects as $proj) {
                $pDate = !empty($proj['updatedAt']) ? date('Y-m-d', strtotime($proj['updatedAt'])) : $today;
                $xml .= "  <url>\n";
                $xml .= "    <loc>{$baseUrl}/portfolio/{$proj['slug']}</loc>\n";
                $xml .= "    <lastmod>{$pDate}</lastmod>\n";
                $xml .= "    <changefreq>monthly</changefreq>\n";
                $xml .= "    <priority>0.75</priority>\n";
                $xml .= "  </url>\n";
            }
        }

        $xml .= '</urlset>';

        // Return XML header if requested via GET /sitemap.xml
        if (isset($_GET['raw']) && $_GET['raw'] === 'true') {
            header('Content-Type: application/xml; charset=utf-8');
            echo $xml;
            exit;
        }

        Response::json([
            'sitemapXml' => $xml,
            'urlCount'   => substr_count($xml, '<url>'),
            'baseUrl'    => $baseUrl,
            'generatedAt' => date('Y-m-d H:i:s')
        ]);
    }

    /**
     * Get or Serve Robots.txt
     */
    public static function getRobotsTxt(): void {
        $db = Database::getConnection();
        $robots = "User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/v1/admin/\n\nSitemap: https://signalux.ir/sitemap.xml";

        if ($db) {
            $stmt = $db->query("SELECT robotsTxt FROM seo_settings LIMIT 1");
            $txt = $stmt->fetchColumn();
            if (!empty($txt)) {
                $robots = $txt;
            }
        }

        if (isset($_GET['raw']) && $_GET['raw'] === 'true') {
            header('Content-Type: text/plain; charset=utf-8');
            echo $robots;
            exit;
        }

        Response::json(['robotsTxt' => $robots]);
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
            'organizationPhone'       => $row['organizationPhone'] ?? '۰۲۱-۸۸۹۹۰۰۱۱',
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
            'organizationPhone'      => '۰۲۱-۸۸۹۹۰۰۱۱',
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
