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
            $servicesCount = (int)$db->query("SELECT COUNT(*) FROM services WHERE is_active = 1")->fetchColumn();
            $projectsCount = (int)$db->query("SELECT COUNT(*) FROM projects WHERE is_published = 1")->fetchColumn();
            $leadsCount = (int)$db->query("SELECT COUNT(*) FROM leads")->fetchColumn();
            $newLeadsCount = (int)$db->query("SELECT COUNT(*) FROM leads WHERE status = 'new'")->fetchColumn();

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
            $stmt = $db->query("SELECT * FROM leads ORDER BY created_at DESC");
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
                    'createdAt' => $r['created_at']
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
            $stmt = $db->prepare("UPDATE leads SET status = ? WHERE id = ?");
            $stmt->execute([$status, $id]);
            Response::json(['id' => $id, 'status' => $status]);
        }
        Response::json(['id' => $id, 'status' => $status]);
    }

    public static function deleteLead(string $id): void {
        Auth::requirePermission('leads.manage');
        $db = Database::getConnection();
        if ($db) {
            $db->prepare("DELETE FROM leads WHERE id = ?")->execute([$id]);
        }
        Response::json(['message' => 'لید با موفقیت حذف شد.']);
    }

    // --- SETTINGS ---
    public static function updateSettings(): void {
        Auth::requirePermission('settings.manage');
        $input = Response::getJsonInput();
        $db = Database::getConnection();

        if ($db) {
            $stmt = $db->prepare("
                UPDATE site_settings SET
                    site_title = ?, hero_headline = ?, hero_subtitle = ?,
                    contact_email = ?, contact_phone = ?, contact_address = ?,
                    instagram_url = ?, linkedin_url = ?, telegram_url = ?, github_url = ?,
                    font_family = ?, font_size_base = ?, font_heading_scale = ?, font_weight_base = ?, line_height_scale = ?,
                    gtm_container_id = ?, gtm_enabled = ?, gsc_verification_code = ?,
                    google_client_id = ?, google_login_enabled = ?,
                    melipayamak_username = ?, melipayamak_sender_number = ?, melipayamak_otp_body_id = ?, melipayamak_enabled = ?
                WHERE id = 'default-settings' OR id IS NOT NULL LIMIT 1
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
                $input['gtmContainerId'] ?? '',
                isset($input['gtmEnabled']) ? ((int)$input['gtmEnabled']) : 0,
                $input['gscVerificationCode'] ?? '',
                $input['googleClientId'] ?? '',
                isset($input['googleLoginEnabled']) ? ((int)$input['googleLoginEnabled']) : 1,
                $input['melipayamakUsername'] ?? '',
                $input['melipayamakSenderNumber'] ?? '',
                (int)($input['melipayamakOtpBodyId'] ?? 123456),
                isset($input['melipayamakEnabled']) ? ((int)$input['melipayamakEnabled']) : 1
            ]);
        }

        Response::json($input);
    }

    // --- SERVICES CRUD ---
    public static function createService(): void {
        Auth::requirePermission('services.manage');
        $input = Response::getJsonInput();
        $id = $input['id'] ?? ('srv-' . time());

        $db = Database::getConnection();
        if ($db) {
            $stmt = $db->prepare("
                INSERT INTO services (id, slug, title, subtitle, icon_name, description, features, metrics, deliverables, sort_order, is_active)
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
                    title = ?, subtitle = ?, icon_name = ?, description = ?,
                    features = ?, metrics = ?, deliverables = ?, sort_order = ?
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
                INSERT INTO projects (id, slug, title, client, category, category_label, thumbnail, year, summary, full_description, tags, metrics, is_published, is_featured, sort_order)
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
                json_encode($input['metrics'] ?? []),
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
                    title = ?, client = ?, category = ?, category_label = ?, thumbnail = ?,
                    year = ?, summary = ?, full_description = ?, tags = ?, metrics = ?,
                    is_featured = ?, sort_order = ?
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
                json_encode($input['metrics'] ?? []),
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
                INSERT INTO testimonials (id, name, role, company, avatar, quote, rating, results_achieved, is_published, sort_order)
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
                    name = ?, role = ?, company = ?, avatar = ?, quote = ?, rating = ?, results_achieved = ?
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
                INSERT INTO certificates (id, title, issuer, issue_date, image, badge_type, description, skills, is_published, sort_order)
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
                    title = ?, issuer = ?, issue_date = ?, image = ?, badge_type = ?, description = ?, skills = ?
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
                INSERT INTO faqs (id, category, question, answer, is_published, sort_order)
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
