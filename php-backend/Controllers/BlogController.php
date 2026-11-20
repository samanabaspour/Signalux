<?php
/**
 * Blog & Articles Controller for Signalux
 */

namespace Signalux\Controllers;

use Signalux\Core\Database;
use Signalux\Core\Response;
use Signalux\Core\Auth;
use PDO;

class BlogController {

    /**
     * Public - Get Published Blog Posts
     */
    public static function getPublishedPosts(): void {
        $db = Database::getConnection();
        if ($db) {
            $category = $_GET['category'] ?? '';
            $search = $_GET['search'] ?? '';

            $sql = "SELECT * FROM blog_posts WHERE status = 'published'";
            $params = [];

            if (!empty($category) && $category !== 'all' && $category !== 'همه') {
                $sql .= " AND category = ?";
                $params[] = $category;
            }

            if (!empty($search)) {
                $sql .= " AND (title LIKE ? OR excerpt LIKE ? OR content LIKE ? OR tags LIKE ?)";
                $searchTerm = "%{$search}%";
                $params[] = $searchTerm;
                $params[] = $searchTerm;
                $params[] = $searchTerm;
                $params[] = $searchTerm;
            }

            $sql .= " ORDER BY publishedAt DESC";
            $stmt = $db->prepare($sql);
            $stmt->execute($params);
            $posts = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $formatted = array_map([self::class, 'formatPost'], $posts);
            Response::json($formatted);
            return;
        }

        Response::json([]);
    }

    /**
     * Public - Get Single Post by Slug
     */
    public static function getPostBySlug(string $slug): void {
        $db = Database::getConnection();
        if ($db) {
            $stmt = $db->prepare("SELECT * FROM blog_posts WHERE slug = ? AND status = 'published' LIMIT 1");
            $stmt->execute([$slug]);
            $post = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($post) {
                // Increment views
                $db->prepare("UPDATE blog_posts SET viewsCount = viewsCount + 1 WHERE id = ?")->execute([$post['id']]);
                $post['viewsCount']++;
                Response::json(self::formatPost($post));
                return;
            }

            Response::error('مقاله مورد نظر یافت نشد.', 404, 'POST_NOT_FOUND');
            return;
        }

        Response::error('پایگاه داده در دسترس نیست.', 500);
    }

    /**
     * Admin - Get All Blog Posts (including drafts)
     */
    public static function getAllPosts(): void {
        Auth::requirePermission('blog.manage');
        $db = Database::getConnection();
        if ($db) {
            $stmt = $db->query("SELECT * FROM blog_posts ORDER BY publishedAt DESC");
            $posts = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $formatted = array_map([self::class, 'formatPost'], $posts);
            Response::json($formatted);
            return;
        }

        Response::json([]);
    }

    /**
     * Admin - Create Blog Post
     */
    public static function createPost(): void {
        Auth::requirePermission('blog.manage');
        $input = Response::getJsonInput();

        $title = trim($input['title'] ?? '');
        $slug = trim($input['slug'] ?? '');
        $excerpt = trim($input['excerpt'] ?? '');
        $content = trim($input['content'] ?? '');
        $featuredImage = trim($input['featuredImage'] ?? 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1000&q=80');
        $category = trim($input['category'] ?? 'سئو و بهینه‌سازی');
        $tags = is_array($input['tags'] ?? null) ? json_encode($input['tags'], JSON_UNESCAPED_UNICODE) : '[]';
        $author = trim($input['author'] ?? 'استودیو سیگنالوکس');
        $authorRole = trim($input['authorRole'] ?? 'کارشناس ارشد');
        $authorAvatar = trim($input['authorAvatar'] ?? '');
        $readingTime = trim($input['readingTime'] ?? '۵ دقیقه');
        $status = in_array($input['status'] ?? '', ['published', 'draft', 'archived']) ? $input['status'] : 'published';

        // SEO Fields
        $metaTitle = trim($input['metaTitle'] ?? $title);
        $metaDescription = trim($input['metaDescription'] ?? $excerpt);
        $metaKeywords = trim($input['metaKeywords'] ?? '');
        $focusKeyword = trim($input['focusKeyword'] ?? '');
        $canonicalUrl = trim($input['canonicalUrl'] ?? '');
        $ogImage = trim($input['ogImage'] ?? $featuredImage);
        $noIndex = !empty($input['noIndex']) ? 1 : 0;

        if (empty($title)) {
            Response::error('عنوان مقاله الزامی است.', 400, 'TITLE_REQUIRED');
            return;
        }

        if (empty($slug)) {
            $slug = self::slugify($title);
        }

        $id = 'post-' . uniqid();
        $db = Database::getConnection();

        if ($db) {
            $stmt = $db->prepare("
                INSERT INTO blog_posts (
                    id, title, slug, excerpt, content, featuredImage, category, tags,
                    author, authorRole, authorAvatar, readingTime, status, publishedAt,
                    metaTitle, metaDescription, metaKeywords, focusKeyword, canonicalUrl, ogImage, noIndex
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?, ?, ?, ?, ?, ?, ?)
            ");

            $stmt->execute([
                $id, $title, $slug, $excerpt, $content, $featuredImage, $category, $tags,
                $author, $authorRole, $authorAvatar, $readingTime, $status,
                $metaTitle, $metaDescription, $metaKeywords, $focusKeyword, $canonicalUrl, $ogImage, $noIndex
            ]);

            $newPost = self::getPostByIdInternal($id);
            Response::json($newPost, 201);
            return;
        }

        Response::error('خطا در ذخیره‌سازی مقاله.', 500);
    }

    /**
     * Admin - Update Blog Post
     */
    public static function updatePost(string $id): void {
        Auth::requirePermission('blog.manage');
        $input = Response::getJsonInput();
        $db = Database::getConnection();

        if ($db) {
            $fields = [];
            $params = [];

            $allowed = [
                'title', 'slug', 'excerpt', 'content', 'featuredImage', 'category',
                'author', 'authorRole', 'authorAvatar', 'readingTime', 'status',
                'metaTitle', 'metaDescription', 'metaKeywords', 'focusKeyword',
                'canonicalUrl', 'ogImage'
            ];

            foreach ($allowed as $col) {
                if (isset($input[$col])) {
                    $fields[] = "`$col` = ?";
                    $params[] = $input[$col];
                }
            }

            if (isset($input['tags']) && is_array($input['tags'])) {
                $fields[] = "`tags` = ?";
                $params[] = json_encode($input['tags'], JSON_UNESCAPED_UNICODE);
            }

            if (isset($input['noIndex'])) {
                $fields[] = "`noIndex` = ?";
                $params[] = $input['noIndex'] ? 1 : 0;
            }

            if (empty($fields)) {
                Response::error('هیچ داده‌ای برای ویرایش ارسال نشده است.', 400);
                return;
            }

            $fields[] = "`updatedAt` = NOW()";
            $sql = "UPDATE blog_posts SET " . implode(', ', $fields) . " WHERE id = ?";
            $params[] = $id;

            $stmt = $db->prepare($sql);
            $stmt->execute($params);

            $updated = self::getPostByIdInternal($id);
            Response::json($updated);
            return;
        }

        Response::error('خطا در اتصال به پایگاه داده.', 500);
    }

    /**
     * Admin - Delete Blog Post
     */
    public static function deletePost(string $id): void {
        Auth::requirePermission('blog.manage');
        $db = Database::getConnection();
        if ($db) {
            $stmt = $db->prepare("DELETE FROM blog_posts WHERE id = ?");
            $stmt->execute([$id]);
            Response::json(['success' => true, 'id' => $id]);
            return;
        }
        Response::error('خطا در حذف مقاله.', 500);
    }

    private static function getPostByIdInternal(string $id): ?array {
        $db = Database::getConnection();
        if ($db) {
            $stmt = $db->prepare("SELECT * FROM blog_posts WHERE id = ? LIMIT 1");
            $stmt->execute([$id]);
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            return $row ? self::formatPost($row) : null;
        }
        return null;
    }

    private static function formatPost(array $row): array {
        $tags = [];
        if (!empty($row['tags'])) {
            $decoded = json_decode($row['tags'], true);
            $tags = is_array($decoded) ? $decoded : [];
        }

        return [
            'id'              => $row['id'],
            'title'           => $row['title'],
            'slug'            => $row['slug'],
            'excerpt'         => $row['excerpt'] ?? '',
            'content'         => $row['content'] ?? '',
            'featuredImage'   => $row['featuredImage'] ?? '',
            'category'        => $row['category'] ?? 'سئو و بهینه‌سازی',
            'tags'            => $tags,
            'author'          => $row['author'] ?? 'سیگنالوکس',
            'authorRole'      => $row['authorRole'] ?? 'کارشناس ارشد',
            'authorAvatar'    => $row['authorAvatar'] ?? '',
            'readingTime'     => $row['readingTime'] ?? '۵ دقیقه',
            'status'          => $row['status'] ?? 'published',
            'publishedAt'     => $row['publishedAt'] ?? $row['createdAt'] ?? date('Y-m-d H:i:s'),
            'updatedAt'       => $row['updatedAt'] ?? null,
            'viewsCount'      => (int)($row['viewsCount'] ?? 0),
            'likesCount'      => (int)($row['likesCount'] ?? 0),
            'metaTitle'       => $row['metaTitle'] ?? $row['title'],
            'metaDescription' => $row['metaDescription'] ?? $row['excerpt'] ?? '',
            'metaKeywords'    => $row['metaKeywords'] ?? '',
            'focusKeyword'    => $row['focusKeyword'] ?? '',
            'canonicalUrl'    => $row['canonicalUrl'] ?? '',
            'ogImage'         => $row['ogImage'] ?? $row['featuredImage'] ?? '',
            'noIndex'         => (bool)($row['noIndex'] ?? false)
        ];
    }

    private static function slugify(string $text): string {
        $text = preg_replace('~[^\pL\d]+~u', '-', $text);
        $text = trim($text, '-');
        $text = strtolower($text);
        return empty($text) ? 'article-' . time() : $text;
    }
}
