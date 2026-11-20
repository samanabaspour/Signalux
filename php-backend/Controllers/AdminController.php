<?php
/**
 * Admin API Controller for Signalux Dashboard
 */

namespace Signalux\Controllers;

use Signalux\Core\Database;
use Signalux\Core\Response;
use Signalux\Core\Auth;
use PDO;

class AdminController {

    public static function getStats(): void {
        Auth::requirePermission('dashboard.view');
        $db = Database::getConnection();

        if ($db) {
            $servicesCount = (int)$db->query("SELECT COUNT(*) FROM services WHERE isPublished = 1")->fetchColumn();
            $projectsCount = (int)$db->query("SELECT COUNT(*) FROM projects WHERE isPublished = 1")->fetchColumn();
            $leadsCount = (int)$db->query("SELECT COUNT(*) FROM lead_submissions")->fetchColumn();
            $newLeadsCount = (int)$db->query("SELECT COUNT(*) FROM lead_submissions WHERE status = 'new'")->fetchColumn();

            Response::json([
                'servicesCount' => $servicesCount,
                'projectsCount' => $projectsCount,
                'leadsCount'    => $leadsCount,
                'newLeadsCount' => $newLeadsCount
            ]);
        }

        Response::json([
            'servicesCount' => 4,
            'projectsCount' => 3,
            'leadsCount'    => 1,
            'newLeadsCount' => 1
        ]);
    }

    // --- LEADS ---
    public static function getLeads(): void {
        Auth::requirePermission('leads.view');
        $db = Database::getConnection();
        if ($db) {
            $stmt = $db->query("SELECT * FROM lead_submissions ORDER BY createdAt DESC");
            $rows = $stmt->fetchAll();
            $data = array_map(function($r) {
                return [
                    'id'        => $r['id'],
                    'type'      => $r['type'],
                    'name'      => $r['name'],
                    'email'     => $r['email'],
                    'phone'     => $r['phone'],
                    'service'   => $r['service'],
                    'budget'    => $r['budget'],
                    'message'   => $r['message'],
                    'status'    => $r['status'],
                    'createdAt' => $r['createdAt']
                ];
            }, $rows);
            Response::json($data);
        }
        Response::json([]);
    }

    public static function updateLeadStatus(string $id): void {
        Auth::requirePermission('leads.manage');
        $input = Response::getJsonInput();
        $status = $input['status'] ?? '';

        if (!in_array($status, ['new', 'contacted', 'closed'])) {
            Response::error('وضعیت وارد شده معتبر نیست.', 400, 'INVALID_STATUS');
        }

        $db = Database::getConnection();
        if ($db) {
            $stmt = $db->prepare("UPDATE lead_submissions SET status = ? WHERE id = ?");
            $stmt->execute([$status, $id]);
            Response::json(['id' => $id, 'status' => $status]);
        }
        Response::json(['id' => $id, 'status' => $status]);
    }

    public static function deleteLead(string $id): void {
        Auth::requirePermission('leads.manage');
        $db = Database::getConnection();
        if ($db) {
            $db->prepare("DELETE FROM lead_submissions WHERE id = ?")->execute([$id]);
        }
        Response::json(['message' => 'لید با موفقیت حذف شد.']);
    }

    // --- SETTINGS ---
    public static function updateSettings(): void {
        Auth::requirePermission('settings.manage');
        $input = Response::getJsonInput();
        $db = Auth::database();
        $current = $db->query("SELECT gtmContainerId, gtmEnabled FROM site_settings
            ORDER BY (id = 'default-settings') DESC, id ASC LIMIT 1")->fetch();
        if (!$current) {
            Response::error('تنظیمات اولیهٔ سایت وجود ندارد.', 503, 'SETTINGS_UNAVAILABLE');
        }
        $gtmId = array_key_exists('gtmContainerId', $input) ? $input['gtmContainerId'] : $current['gtmContainerId'];
        $gtmEnabled = array_key_exists('gtmEnabled', $input) ? $input['gtmEnabled'] : (bool)$current['gtmEnabled'];
        $gtmId = is_string($gtmId) ? trim($gtmId) : null;
        if ($gtmId === null || !preg_match('/^(?:GTM-[A-Z0-9]{1,20})?$/D', $gtmId)
            || !is_bool($gtmEnabled) || ($gtmEnabled && $gtmId === '')) {
            Response::error('شناسهٔ معتبر GTM برای فعال‌سازی لازم است.', 400, 'INVALID_GTM_SETTINGS');
        }

        if ($db) {
            $stmt = $db->prepare("
                UPDATE site_settings SET
                    siteTitle = ?, heroHeadline = ?, heroSubtitle = ?,
                    contactEmail = ?, contactPhone = ?, contactAddress = ?,
                    instagramUrl = ?, linkedinUrl = ?, telegramUrl = ?, githubUrl = ?,
                    fontFamily = ?, fontSizeBase = ?, fontHeadingScale = ?, fontWeightBase = ?, lineHeightScale = ?,
                    gtmContainerId = ?, gtmEnabled = ?,
                    googleClientId = ?, googleLoginEnabled = ?,
                    melipayamakUsername = ?, melipayamakSenderNumber = ?, melipayamakOtpBodyId = ?, melipayamakEnabled = ?
                ORDER BY (id = 'default-settings') DESC, id ASC LIMIT 1
            ");
            $stmt->execute([
                $input['siteTitle'] ?? 'آژانس دیجیتال سیگنالوکس (Signalux)',
                $input['heroHeadline'] ?? '',
                $input['heroSubtitle'] ?? '',
                $input['contactEmail'] ?? 'info@signalux.ir',
                $input['contactPhone'] ?? '',
                $input['contactAddress'] ?? '',
                $input['instagramUrl'] ?? '',
                $input['linkedinUrl'] ?? '',
                $input['telegramUrl'] ?? '',
                $input['githubUrl'] ?? '',
                $input['fontFamily'] ?? 'Shabnam',
                $input['fontSizeBase'] ?? '16px',
                $input['fontHeadingScale'] ?? '1.25',
                $input['fontWeightBase'] ?? '400',
                $input['lineHeightScale'] ?? '1.65',
                $gtmId,
                (int)$gtmEnabled,
                $input['googleClientId'] ?? '',
                isset($input['googleLoginEnabled']) ? ((int)$input['googleLoginEnabled']) : 1,
                $input['melipayamakUsername'] ?? '',
                $input['melipayamakSenderNumber'] ?? '',
                (int)($input['melipayamakOtpBodyId'] ?? 123456),
                isset($input['melipayamakEnabled']) ? ((int)$input['melipayamakEnabled']) : 1
            ]);
        }

        PublicController::getSettings(true);
    }

    // --- SERVICES CRUD ---
    public static function createService(): void {
        Auth::requirePermission('services.manage');
        $input = Response::getJsonInput();
        $id = $input['id'] ?? ('srv-' . time());

        $db = Database::getConnection();
        if ($db) {
            $stmt = $db->prepare("
                INSERT INTO services (id, slug, title, subtitle, iconName, description, features, metrics, deliverables, sortOrder, isPublished)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
            ");
            $stmt->execute([
                $id,
                $input['slug'] ?? $id,
                $input['title'] ?? '',
                $input['subtitle'] ?? '',
                $input['iconName'] ?? 'Code2',
                $input['description'] ?? '',
                json_encode($input['features'] ?? []),
                $input['metrics'] ?? '',
                json_encode($input['deliverables'] ?? []),
                (int)($input['sortOrder'] ?? 0)
            ]);
        }

        Response::json($input, 201);
    }

    public static function updateService(string $id): void {
        Auth::requirePermission('services.manage');
        $input = Response::getJsonInput();
        $db = Database::getConnection();

        if ($db) {
            $stmt = $db->prepare("
                UPDATE services SET
                    title = ?, subtitle = ?, iconName = ?, description = ?,
                    features = ?, metrics = ?, deliverables = ?, sortOrder = ?
                WHERE id = ?
            ");
            $stmt->execute([
                $input['title'] ?? '',
                $input['subtitle'] ?? '',
                $input['iconName'] ?? 'Code2',
                $input['description'] ?? '',
                json_encode($input['features'] ?? []),
                $input['metrics'] ?? '',
                json_encode($input['deliverables'] ?? []),
                (int)($input['sortOrder'] ?? 0),
                $id
            ]);
        }

        Response::json($input);
    }

    public static function deleteService(string $id): void {
        Auth::requirePermission('services.manage');
        $db = Database::getConnection();
        if ($db) {
            $db->prepare("DELETE FROM services WHERE id = ?")->execute([$id]);
        }
        Response::json(['message' => 'سرویس با موفقیت حذف شد.']);
    }

    // --- PROJECTS CRUD ---
    public static function createProject(): void {
        Auth::requirePermission('projects.manage');
        $input = Response::getJsonInput();
        $id = $input['id'] ?? ('proj-' . time());

        $db = Database::getConnection();
        if ($db) {
            $stmt = $db->prepare("
                INSERT INTO projects (id, slug, title, client, category, categoryLabel, thumbnail, year, summary, fullDescription, tags, impactMetrics, isPublished, isFeatured, sortOrder)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)
            ");
            $stmt->execute([
                $id,
                $input['slug'] ?? $id,
                $input['title'] ?? '',
                $input['client'] ?? '',
                $input['category'] ?? 'web',
                $input['categoryLabel'] ?? '',
                $input['thumbnail'] ?? '',
                $input['year'] ?? '۱۴۰۳',
                $input['summary'] ?? '',
                $input['fullDescription'] ?? '',
                json_encode($input['tags'] ?? []),
                json_encode($input['impactMetrics'] ?? []),
                !empty($input['isFeatured']) ? 1 : 0,
                (int)($input['sortOrder'] ?? 0)
            ]);
        }

        Response::json($input, 201);
    }

    public static function updateProject(string $id): void {
        Auth::requirePermission('projects.manage');
        $input = Response::getJsonInput();
        $db = Database::getConnection();

        if ($db) {
            $stmt = $db->prepare("
                UPDATE projects SET
                    title = ?, client = ?, category = ?, categoryLabel = ?, thumbnail = ?,
                    year = ?, summary = ?, fullDescription = ?, tags = ?, impactMetrics = ?,
                    isFeatured = ?, sortOrder = ?
                WHERE id = ?
            ");
            $stmt->execute([
                $input['title'] ?? '',
                $input['client'] ?? '',
                $input['category'] ?? 'web',
                $input['categoryLabel'] ?? '',
                $input['thumbnail'] ?? '',
                $input['year'] ?? '۱۴۰۳',
                $input['summary'] ?? '',
                $input['fullDescription'] ?? '',
                json_encode($input['tags'] ?? []),
                json_encode($input['impactMetrics'] ?? []),
                !empty($input['isFeatured']) ? 1 : 0,
                (int)($input['sortOrder'] ?? 0),
                $id
            ]);
        }

        Response::json($input);
    }

    public static function deleteProject(string $id): void {
        Auth::requirePermission('projects.manage');
        $db = Database::getConnection();
        if ($db) {
            $db->prepare("DELETE FROM projects WHERE id = ?")->execute([$id]);
        }
        Response::json(['message' => 'پروژه با موفقیت حذف شد.']);
    }

    // --- TESTIMONIALS CRUD ---
    public static function createTestimonial(): void {
        Auth::requirePermission('testimonials.manage');
        $input = Response::getJsonInput();
        $id = $input['id'] ?? ('testi-' . time());

        $db = Database::getConnection();
        if ($db) {
            $stmt = $db->prepare("
                INSERT INTO testimonials (id, name, role, company, avatar, quote, rating, resultsAchieved, isPublished, sortOrder)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, 0)
            ");
            $stmt->execute([
                $id,
                $input['name'] ?? '',
                $input['role'] ?? '',
                $input['company'] ?? '',
                $input['avatar'] ?? '',
                $input['quote'] ?? '',
                (int)($input['rating'] ?? 5),
                $input['resultsAchieved'] ?? ''
            ]);
        }

        Response::json($input, 201);
    }

    public static function updateTestimonial(string $id): void {
        Auth::requirePermission('testimonials.manage');
        $input = Response::getJsonInput();
        $db = Database::getConnection();

        if ($db) {
            $stmt = $db->prepare("
                UPDATE testimonials SET
                    name = ?, role = ?, company = ?, avatar = ?, quote = ?, rating = ?, resultsAchieved = ?
                WHERE id = ?
            ");
            $stmt->execute([
                $input['name'] ?? '',
                $input['role'] ?? '',
                $input['company'] ?? '',
                $input['avatar'] ?? '',
                $input['quote'] ?? '',
                (int)($input['rating'] ?? 5),
                $input['resultsAchieved'] ?? '',
                $id
            ]);
        }

        Response::json($input);
    }

    public static function deleteTestimonial(string $id): void {
        Auth::requirePermission('testimonials.manage');
        $db = Database::getConnection();
        if ($db) {
            $db->prepare("DELETE FROM testimonials WHERE id = ?")->execute([$id]);
        }
        Response::json(['message' => 'نظر با موفقیت حذف شد.']);
    }

    // --- CERTIFICATES CRUD ---
    public static function createCertificate(): void {
        Auth::requirePermission('settings.manage');
        $input = Response::getJsonInput();
        $id = $input['id'] ?? ('cert-' . time());

        $db = Database::getConnection();
        if ($db) {
            $stmt = $db->prepare("
                INSERT INTO certificates (id, title, issuer, issueDate, image, badgeType, description, skills, isPublished, sortOrder)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, 0)
            ");
            $stmt->execute([
                $id,
                $input['title'] ?? '',
                $input['issuer'] ?? '',
                $input['issueDate'] ?? '',
                $input['image'] ?? '',
                $input['badgeType'] ?? 'gold',
                $input['description'] ?? '',
                json_encode($input['skills'] ?? [])
            ]);
        }

        Response::json($input, 201);
    }

    public static function updateCertificate(string $id): void {
        Auth::requirePermission('settings.manage');
        $input = Response::getJsonInput();
        $db = Database::getConnection();

        if ($db) {
            $stmt = $db->prepare("
                UPDATE certificates SET
                    title = ?, issuer = ?, issueDate = ?, image = ?, badgeType = ?, description = ?, skills = ?
                WHERE id = ?
            ");
            $stmt->execute([
                $input['title'] ?? '',
                $input['issuer'] ?? '',
                $input['issueDate'] ?? '',
                $input['image'] ?? '',
                $input['badgeType'] ?? 'gold',
                $input['description'] ?? '',
                json_encode($input['skills'] ?? []),
                $id
            ]);
        }

        Response::json($input);
    }

    public static function deleteCertificate(string $id): void {
        Auth::requirePermission('settings.manage');
        $db = Database::getConnection();
        if ($db) {
            $db->prepare("DELETE FROM certificates WHERE id = ?")->execute([$id]);
        }
        Response::json(['message' => 'گواهینامه با موفقیت حذف شد.']);
    }

    // --- FAQS CRUD ---
    public static function createFaq(): void {
        Auth::requirePermission('faqs.manage');
        $input = Response::getJsonInput();
        $id = $input['id'] ?? ('faq-' . time());

        $db = Database::getConnection();
        if ($db) {
            $stmt = $db->prepare("
                INSERT INTO faqs (id, category, question, answer, isPublished, sortOrder)
                VALUES (?, ?, ?, ?, 1, 0)
            ");
            $stmt->execute([
                $id,
                $input['category'] ?? 'عمومی',
                $input['question'] ?? '',
                $input['answer'] ?? ''
            ]);
        }

        Response::json($input, 201);
    }

    public static function updateFaq(string $id): void {
        Auth::requirePermission('faqs.manage');
        $input = Response::getJsonInput();
        $db = Database::getConnection();

        if ($db) {
            $stmt = $db->prepare("
                UPDATE faqs SET category = ?, question = ?, answer = ? WHERE id = ?
            ");
            $stmt->execute([
                $input['category'] ?? 'عمومی',
                $input['question'] ?? '',
                $input['answer'] ?? '',
                $id
            ]);
        }

        Response::json($input);
    }

    public static function deleteFaq(string $id): void {
        Auth::requirePermission('faqs.manage');
        $db = Database::getConnection();
        if ($db) {
            $db->prepare("DELETE FROM faqs WHERE id = ?")->execute([$id]);
        }
        Response::json(['message' => 'سوال متداول با موفقیت حذف شد.']);
    }
}
