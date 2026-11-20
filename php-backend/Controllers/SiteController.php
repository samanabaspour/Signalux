<?php

namespace Signalux\Controllers;

use Signalux\Core\Database;
use Signalux\Core\Response;

class SiteController {
    private static function manifest(): array {
        $manifest = dirname(__DIR__, 2) . '/site-pages.json';
        return json_decode(file_get_contents($manifest), true, 512, JSON_THROW_ON_ERROR);
    }

    private static function origin(): string {
        $url = (require __DIR__ . '/../config.php')['app_url'];
        $parts = parse_url($url);
        if (!$parts || !in_array($parts['scheme'] ?? '', ['https', 'http'], true)
            || empty($parts['host']) || isset($parts['user']) || isset($parts['pass'])) {
            return 'https://signalux.ir';
        }
        return $parts['scheme'] . '://' . $parts['host'] . (isset($parts['port']) ? ':' . $parts['port'] : '');
    }

    private static function escape(string $text): string {
        return htmlspecialchars($text, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    }

    private static function publicPages(array $pages): array {
        unset($pages['admin'], $pages['account']);
        return $pages;
    }

    private static function resolve(string $pathname, array $manifest): ?array {
        $path = rtrim($pathname, '/') ?: '/';
        $lowercase = strtolower($path);
        $canonical = $manifest['aliases'][$lowercase] ?? $lowercase;
        foreach ($manifest['pages'] as $view => $page) {
            if ($page['path'] !== $canonical) continue;
            $page['private'] = in_array($view, ['admin', 'account'], true);
            $page['noIndex'] = $page['private'];
            return $page;
        }
        if (!preg_match('#^/(blog|projects|portfolio)/([^/]+)$#i', $path, $match)
            || preg_match('/%(?![0-9a-f]{2})/i', $match[2])) {
            return null;
        }
        $param = rawurldecode($match[2]);
        if (!preg_match('//u', $param) || preg_match('~[/\\\\\x00-\x1F\x7F]~', $param) || in_array($param, ['.', '..'], true)) {
            return null;
        }
        $db = Database::getConnection();
        if (!$db) {
            return [
                'path' => $path, 'unavailable' => true, 'noIndex' => true,
                'heading' => 'محتوا موقتاً در دسترس نیست', 'title' => 'محتوا در دسترس نیست',
                'description' => 'لطفاً دوباره تلاش کنید.',
            ];
        }
        if (strtolower($match[1]) === 'blog') {
            $stmt = $db->prepare("SELECT slug, title, excerpt, metaTitle, metaDescription, ogImage, featuredImage, noIndex
                FROM blog_posts WHERE (slug = ? OR id = ?) AND status = 'published' LIMIT 1");
            $stmt->execute([$param, $param]);
            $post = $stmt->fetch();
            return $post ? [
                'path' => '/blog/' . rawurlencode($post['slug']),
                'heading' => $post['title'], 'title' => $post['metaTitle'] ?: $post['title'],
                'description' => $post['metaDescription'] ?: $post['excerpt'],
                'image' => $post['ogImage'] ?: $post['featuredImage'], 'noIndex' => (bool)$post['noIndex'],
            ] : null;
        }
        $stmt = $db->prepare('SELECT slug, title, summary, thumbnail FROM projects
            WHERE (slug = ? OR id = ?) AND isPublished = 1 LIMIT 1');
        $stmt->execute([$param, $param]);
        $project = $stmt->fetch();
        return $project ? [
            'path' => '/projects/' . rawurlencode($project['slug']),
            'heading' => $project['title'], 'title' => $project['title'],
            'description' => $project['summary'], 'image' => $project['thumbnail'],
        ] : null;
    }

    public static function servePage(string $path): void {
        $manifest = self::manifest();
        $page = self::resolve($path, $manifest);
        if ($page && empty($page['unavailable']) && $page['path'] !== $path) {
            $query = $_SERVER['QUERY_STRING'] ?? '';
            header('Location: ' . $page['path'] . ($query !== '' ? '?' . $query : ''), true, 301);
            exit;
        }
        $status = !$page ? 404 : (!empty($page['unavailable']) ? 503 : 200);
        $template = file_get_contents(dirname(__DIR__, 2) . '/index.html');
        $metadata = $page ?? [
            'title' => 'صفحه پیدا نشد', 'heading' => 'صفحه پیدا نشد',
            'description' => 'نشانی درخواستی وجود ندارد یا تغییر کرده است.', 'noIndex' => true,
        ];
        $title = self::escape($metadata['title'] . ' | Signalux Studio');
        $description = self::escape((string)$metadata['description']);
        $head = "<title>{$title}</title>\n<meta name=\"description\" content=\"{$description}\">";
        if ($status === 200) {
            $canonical = self::escape(self::origin() . $metadata['path']);
            $head .= "\n<link rel=\"canonical\" href=\"{$canonical}\">\n<meta property=\"og:url\" content=\"{$canonical}\">";
        }
        $head .= "\n<meta property=\"og:title\" content=\"{$title}\">\n<meta property=\"og:description\" content=\"{$description}\">";
        if (!empty($metadata['image'])) {
            $head .= "\n" . '<meta property="og:image" content="' . self::escape($metadata['image']) . '">';
        }
        if (!empty($metadata['noIndex'])) {
            $head .= "\n<meta name=\"robots\" content=\"noindex, follow\">";
            header('X-Robots-Tag: noindex, follow');
        }
        if ($path === '/') {
            $code = (require __DIR__ . '/../config.php')['gsc_verification'];
            if (preg_match('/^[A-Za-z0-9_-]{1,200}$/', $code)) {
                $head .= "\n<meta name=\"google-site-verification\" content=\"{$code}\">";
            }
        }
        if (!empty($metadata['private']) || $status === 503) header('Cache-Control: no-store');

        $links = '';
        foreach (self::publicPages($manifest['pages']) as $linked) {
            $links .= '<li><a href="' . self::escape($linked['path']) . '">' . self::escape($linked['heading']) . '</a></li>';
        }
        $root = '<div id="root"><main><h1>' . self::escape($metadata['heading']) . '</h1><p>' . $description . '</p><ul>' . $links . '</ul></main></div>';
        $html = preg_replace_callback('/<title>[\s\S]*?<\/title>\s*<meta name="description"[^>]*>/', static fn() => $head, $template, 1);
        http_response_code($status);
        header('Content-Type: text/html; charset=UTF-8');
        echo str_replace('<div id="root"></div>', $root, $html);
        exit;
    }

    public static function sitemap(bool $raw): void {
        $origin = self::origin();
        $entries = array_values(self::publicPages(self::manifest()['pages']));
        $db = Database::getConnection();
        if ($db) {
            foreach ($db->query('SELECT slug, updatedAt FROM projects WHERE isPublished = 1') as $project) {
                $entries[] = ['path' => '/projects/' . rawurlencode($project['slug']), 'date' => $project['updatedAt']];
            }
            foreach ($db->query("SELECT slug, updatedAt, publishedAt FROM blog_posts WHERE status = 'published' AND noIndex = 0") as $post) {
                $entries[] = ['path' => '/blog/' . rawurlencode($post['slug']), 'date' => $post['updatedAt'] ?: $post['publishedAt']];
            }
        }
        $xml = '<?xml version="1.0" encoding="UTF-8"?>' . "\n" . '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
        foreach ($entries as $entry) {
            $xml .= "\n  <url><loc>" . htmlspecialchars($origin . $entry['path'], ENT_XML1 | ENT_QUOTES, 'UTF-8') . '</loc>';
            if (!empty($entry['date'])) $xml .= '<lastmod>' . self::escape(substr($entry['date'], 0, 10)) . '</lastmod>';
            $xml .= '</url>';
        }
        $xml .= "\n</urlset>";
        if ($raw) {
            header('Content-Type: application/xml; charset=UTF-8');
            echo $xml;
            exit;
        }
        Response::json(['sitemapXml' => $xml, 'urlCount' => count($entries), 'baseUrl' => $origin]);
    }

    public static function robots(bool $raw): void {
        $db = Database::getConnection();
        $configured = $db ? $db->query('SELECT robotsTxt FROM seo_settings LIMIT 1')->fetchColumn() : false;
        $directives = preg_replace('/^\h*sitemap:.*$/im', '', $configured ?: "User-agent: *\nDisallow: /api/");
        $robots = trim($directives) . "\n\nSitemap: " . self::origin() . "/sitemap.xml\n";
        if ($raw) {
            header('Content-Type: text/plain; charset=UTF-8');
            echo $robots;
            exit;
        }
        Response::json(['robotsTxt' => $robots]);
    }
}
