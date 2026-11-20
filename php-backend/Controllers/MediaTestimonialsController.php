<?php
/**
 * Media Testimonials Controller (Podcasts & Video Testimonials CRUD)
 * Signalux Digital Agency Backend
 */

namespace Signalux\Controllers;

use Signalux\Core\Database;
use Signalux\Core\Response;
use Signalux\Core\Auth;
use PDO;

class MediaTestimonialsController {

    // =========================================================================
    // PODCASTS / VOICE TESTIMONIALS
    // =========================================================================

    public static function getPublicPodcasts(): void {
        $db = Database::getConnection();
        if ($db) {
            try {
                $stmt = $db->query("SELECT * FROM podcast_testimonials WHERE isPublished = 1 ORDER BY sortOrder ASC, createdAt DESC");
                $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
                if (!empty($rows)) {
                    $formatted = array_map(function($r) {
                        return [
                            'id'          => $r['id'],
                            'clientName'  => $r['clientName'],
                            'clientRole'  => $r['clientRole'],
                            'company'     => $r['company'],
                            'avatar'      => $r['avatar'],
                            'title'       => $r['title'],
                            'audioUrl'    => $r['audioUrl'],
                            'duration'    => $r['duration'],
                            'quote'       => $r['quote'],
                            'tags'        => json_decode($r['tags'] ?? '[]', true) ?: [],
                            'rating'      => (int)($r['rating'] ?? 5),
                            'isPublished' => (bool)$r['isPublished'],
                            'sortOrder'   => (int)($r['sortOrder'] ?? 0),
                            'createdAt'   => $r['createdAt']
                        ];
                    }, $rows);
                    Response::json($formatted);
                    return;
                }
            } catch (\Exception $e) {
                // Table might not exist yet or empty
            }
        }
        Response::json([]);
    }

    public static function getAdminPodcasts(): void {
        Auth::requirePermission('testimonials.manage');
        $db = Database::getConnection();
        if ($db) {
            try {
                $stmt = $db->query("SELECT * FROM podcast_testimonials ORDER BY sortOrder ASC, createdAt DESC");
                $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
                $formatted = array_map(function($r) {
                    return [
                        'id'          => $r['id'],
                        'clientName'  => $r['clientName'],
                        'clientRole'  => $r['clientRole'],
                        'company'     => $r['company'],
                        'avatar'      => $r['avatar'],
                        'title'       => $r['title'],
                        'audioUrl'    => $r['audioUrl'],
                        'duration'    => $r['duration'],
                        'quote'       => $r['quote'],
                        'tags'        => json_decode($r['tags'] ?? '[]', true) ?: [],
                        'rating'      => (int)($r['rating'] ?? 5),
                        'isPublished' => (bool)$r['isPublished'],
                        'sortOrder'   => (int)($r['sortOrder'] ?? 0),
                        'createdAt'   => $r['createdAt']
                    ];
                }, $rows);
                Response::json($formatted);
                return;
            } catch (\Exception $e) {}
        }
        Response::json([]);
    }

    public static function saveBatchPodcasts(): void {
        Auth::requirePermission('testimonials.manage');
        $input = Response::getJsonInput();
        if (!is_array($input)) {
            Response::error('فرمت اطلاعات نامعتبر است.', 400);
            return;
        }

        $db = Database::getConnection();
        if ($db) {
            try {
                $db->exec("
                    CREATE TABLE IF NOT EXISTS `podcast_testimonials` (
                        `id` VARCHAR(100) NOT NULL PRIMARY KEY,
                        `clientName` VARCHAR(150) NOT NULL,
                        `clientRole` VARCHAR(150) NOT NULL,
                        `company` VARCHAR(150) DEFAULT NULL,
                        `avatar` TEXT DEFAULT NULL,
                        `title` VARCHAR(255) NOT NULL,
                        `audioUrl` TEXT NOT NULL,
                        `duration` VARCHAR(50) NOT NULL DEFAULT '03:00',
                        `quote` TEXT NOT NULL,
                        `tags` TEXT DEFAULT NULL,
                        `rating` INT NOT NULL DEFAULT 5,
                        `isPublished` TINYINT(1) NOT NULL DEFAULT 1,
                        `sortOrder` INT NOT NULL DEFAULT 0,
                        `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                        `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
                ");

                $db->beginTransaction();
                $db->exec("DELETE FROM podcast_testimonials");

                $stmt = $db->prepare("
                    INSERT INTO podcast_testimonials 
                    (id, clientName, clientRole, company, avatar, title, audioUrl, duration, quote, tags, rating, isPublished, sortOrder)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ");

                foreach ($input as $index => $item) {
                    $id = !empty($item['id']) ? $item['id'] : 'pod_' . uniqid();
                    $stmt->execute([
                        $id,
                        $item['clientName'] ?? '',
                        $item['clientRole'] ?? '',
                        $item['company'] ?? '',
                        $item['avatar'] ?? '',
                        $item['title'] ?? '',
                        $item['audioUrl'] ?? '',
                        $item['duration'] ?? '03:00',
                        $item['quote'] ?? '',
                        json_encode($item['tags'] ?? []),
                        (int)($item['rating'] ?? 5),
                        isset($item['isPublished']) && !$item['isPublished'] ? 0 : 1,
                        (int)($item['sortOrder'] ?? $index)
                    ]);
                }

                $db->commit();
                Response::json(['message' => 'پادکست‌ها با موفقیت ذخیره شدند.', 'count' => count($input)]);
                return;
            } catch (\Exception $e) {
                if ($db->inTransaction()) {
                    $db->rollBack();
                }
                Response::error('خطا در ذخیره‌سازی پادکست‌ها: ' . $e->getMessage(), 500);
                return;
            }
        }

        Response::json(['message' => 'پادکست‌ها با موفقیت ذخیره شدند.']);
    }

    // =========================================================================
    // VIDEO TESTIMONIALS & CASE STUDIES
    // =========================================================================

    public static function getPublicVideoTestimonials(): void {
        $db = Database::getConnection();
        if ($db) {
            try {
                $stmt = $db->query("SELECT * FROM video_testimonials WHERE isPublished = 1 ORDER BY sortOrder ASC, createdAt DESC");
                $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
                if (!empty($rows)) {
                    $formatted = array_map(function($r) {
                        return [
                            'id'              => $r['id'],
                            'clientName'      => $r['clientName'],
                            'clientRole'      => $r['clientRole'],
                            'company'         => $r['company'],
                            'thumbnail'       => $r['thumbnail'],
                            'videoUrl'        => $r['videoUrl'],
                            'title'           => $r['title'],
                            'duration'        => $r['duration'],
                            'quote'           => $r['quote'],
                            'projectCategory' => $r['projectCategory'],
                            'rating'          => (int)($r['rating'] ?? 5),
                            'isPublished'     => (bool)$r['isPublished'],
                            'sortOrder'       => (int)($r['sortOrder'] ?? 0),
                            'createdAt'       => $r['createdAt']
                        ];
                    }, $rows);
                    Response::json($formatted);
                    return;
                }
            } catch (\Exception $e) {
                // Table not created or empty
            }
        }
        Response::json([]);
    }

    public static function getAdminVideoTestimonials(): void {
        Auth::requirePermission('testimonials.manage');
        $db = Database::getConnection();
        if ($db) {
            try {
                $stmt = $db->query("SELECT * FROM video_testimonials ORDER BY sortOrder ASC, createdAt DESC");
                $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
                $formatted = array_map(function($r) {
                    return [
                        'id'              => $r['id'],
                        'clientName'      => $r['clientName'],
                        'clientRole'      => $r['clientRole'],
                        'company'         => $r['company'],
                        'thumbnail'       => $r['thumbnail'],
                        'videoUrl'        => $r['videoUrl'],
                        'title'           => $r['title'],
                        'duration'        => $r['duration'],
                        'quote'           => $r['quote'],
                        'projectCategory' => $r['projectCategory'],
                        'rating'          => (int)($r['rating'] ?? 5),
                        'isPublished'     => (bool)$r['isPublished'],
                        'sortOrder'       => (int)($r['sortOrder'] ?? 0),
                        'createdAt'       => $r['createdAt']
                    ];
                }, $rows);
                Response::json($formatted);
                return;
            } catch (\Exception $e) {}
        }
        Response::json([]);
    }

    public static function saveBatchVideoTestimonials(): void {
        Auth::requirePermission('testimonials.manage');
        $input = Response::getJsonInput();
        if (!is_array($input)) {
            Response::error('فرمت اطلاعات نامعتبر است.', 400);
            return;
        }

        $db = Database::getConnection();
        if ($db) {
            try {
                $db->exec("
                    CREATE TABLE IF NOT EXISTS `video_testimonials` (
                        `id` VARCHAR(100) NOT NULL PRIMARY KEY,
                        `clientName` VARCHAR(150) NOT NULL,
                        `clientRole` VARCHAR(150) NOT NULL,
                        `company` VARCHAR(150) DEFAULT NULL,
                        `thumbnail` TEXT NOT NULL,
                        `videoUrl` TEXT NOT NULL,
                        `title` VARCHAR(255) NOT NULL,
                        `duration` VARCHAR(50) NOT NULL DEFAULT '02:30',
                        `quote` TEXT NOT NULL,
                        `projectCategory` VARCHAR(150) DEFAULT NULL,
                        `rating` INT NOT NULL DEFAULT 5,
                        `isPublished` TINYINT(1) NOT NULL DEFAULT 1,
                        `sortOrder` INT NOT NULL DEFAULT 0,
                        `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                        `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
                ");

                $db->beginTransaction();
                $db->exec("DELETE FROM video_testimonials");

                $stmt = $db->prepare("
                    INSERT INTO video_testimonials 
                    (id, clientName, clientRole, company, thumbnail, videoUrl, title, duration, quote, projectCategory, rating, isPublished, sortOrder)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ");

                foreach ($input as $index => $item) {
                    $id = !empty($item['id']) ? $item['id'] : 'vid_' . uniqid();
                    $stmt->execute([
                        $id,
                        $item['clientName'] ?? '',
                        $item['clientRole'] ?? '',
                        $item['company'] ?? '',
                        $item['thumbnail'] ?? '',
                        $item['videoUrl'] ?? '',
                        $item['title'] ?? '',
                        $item['duration'] ?? '02:30',
                        $item['quote'] ?? '',
                        $item['projectCategory'] ?? 'طراحی و توسعه وب',
                        (int)($item['rating'] ?? 5),
                        isset($item['isPublished']) && !$item['isPublished'] ? 0 : 1,
                        (int)($item['sortOrder'] ?? $index)
                    ]);
                }

                $db->commit();
                Response::json(['message' => 'ویدیوهای رضایت با موفقیت ذخیره شدند.', 'count' => count($input)]);
                return;
            } catch (\Exception $e) {
                if ($db->inTransaction()) {
                    $db->rollBack();
                }
                Response::error('خطا در ذخیره‌سازی ویدیوها: ' . $e->getMessage(), 500);
                return;
            }
        }

        Response::json(['message' => 'ویدیوهای رضایت با موفقیت ذخیره شدند.']);
    }
}
