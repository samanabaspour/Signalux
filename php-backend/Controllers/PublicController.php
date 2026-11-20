<?php
/**
 * Public Controller for Signalux Frontend
 */

namespace Signalux\Controllers;

use Signalux\Core\Database;
use Signalux\Core\Response;
use PDO;

class PublicController {

    public static function getSettings(): void {
        $db = Database::getConnection();
        if ($db) {
            $stmt = $db->query("SELECT * FROM site_settings LIMIT 1");
            $row = $stmt->fetch();
            if ($row) {
                Response::json([
                    'siteTitle'           => $row['site_title'] ?? $row['siteTitle'] ?? 'آژانس دیجیتال سیگنالوکس (Signalux)',
                    'heroHeadline'        => $row['hero_headline'] ?? $row['heroHeadline'] ?? '',
                    'heroSubtitle'        => $row['hero_subtitle'] ?? $row['heroSubtitle'] ?? '',
                    'contactEmail'        => $row['contact_email'] ?? $row['contactEmail'] ?? 'info@signalux.ir',
                    'contactPhone'        => $row['contact_phone'] ?? $row['contactPhone'] ?? '۰۲۱-۸۸۹۹۰۰۱۱',
                    'contactAddress'      => $row['contact_address'] ?? $row['contactAddress'] ?? 'تهران، خیابان ولیعصر، برج فناوری سیگنال، طبقه ۸',
                    'instagramUrl'        => $row['instagram_url'] ?? $row['instagramUrl'] ?? 'https://instagram.com/signalux',
                    'linkedinUrl'         => $row['linkedin_url'] ?? $row['linkedinUrl'] ?? 'https://linkedin.com/company/signalux',
                    'telegramUrl'         => $row['telegram_url'] ?? $row['telegramUrl'] ?? 'https://t.me/signalux_studio',
                    'githubUrl'           => $row['github_url'] ?? $row['githubUrl'] ?? 'https://github.com/signalux',
                    'fontFamily'          => $row['font_family'] ?? $row['fontFamily'] ?? 'Shabnam',
                    'fontSizeBase'        => $row['font_size_base'] ?? $row['fontSizeBase'] ?? '16px',
                    'fontHeadingScale'    => $row['font_heading_scale'] ?? $row['fontHeadingScale'] ?? '1.25',
                    'fontWeightBase'      => $row['font_weight_base'] ?? $row['fontWeightBase'] ?? '400',
                    'lineHeightScale'     => $row['line_height_scale'] ?? $row['lineHeightScale'] ?? '1.65',
                    'gtmContainerId'      => $row['gtm_container_id'] ?? $row['gtmContainerId'] ?? 'GTM-T9K8LP',
                    'gtmEnabled'          => (bool)($row['gtm_enabled'] ?? $row['gtmEnabled'] ?? true),
                    'gscVerificationCode' => $row['gsc_verification_code'] ?? $row['gscVerificationCode'] ?? '',
                    'googleClientId'      => $row['google_client_id'] ?? $row['googleClientId'] ?? '',
                    'googleLoginEnabled'  => (bool)($row['google_login_enabled'] ?? $row['googleLoginEnabled'] ?? true),
                    'melipayamakUsername' => $row['melipayamak_username'] ?? $row['melipayamakUsername'] ?? '',
                    'melipayamakSenderNumber' => $row['melipayamak_sender_number'] ?? $row['melipayamakSenderNumber'] ?? '',
                    'melipayamakOtpBodyId'    => $row['melipayamak_otp_body_id'] ?? $row['melipayamakOtpBodyId'] ?? 123456,
                    'melipayamakEnabled'      => (bool)($row['melipayamak_enabled'] ?? $row['melipayamakEnabled'] ?? true)
                ]);
            }
        }

        Response::json([
            'siteTitle'           => 'آژانس دیجیتال سیگنالوکس (Signalux)',
            'heroHeadline'        => 'خلق تجربه‌های دیجیتال بدون مرز و متناسب با رشد کسب‌وکار شما',
            'heroSubtitle'        => 'استودیو سیگنالوکس با بهره‌گیری از طراحی مدرن وب، استراتژی سئوی داده‌محور و دیزاین سیستم‌های منحصر‌به‌فرد، برند شما را در فضای دیجیتال ممتاز می‌کند.',
            'contactEmail'        => 'info@signalux.ir',
            'contactPhone'        => '۰۲۱-۸۸۹۹۰۰۱۱',
            'contactAddress'      => 'تهران، خیابان ولیعصر، برج فناوری سیگنال، طبقه ۸',
            'instagramUrl'        => 'https://instagram.com/signalux',
            'linkedinUrl'         => 'https://linkedin.com/company/signalux',
            'telegramUrl'         => 'https://t.me/signalux_studio',
            'githubUrl'           => 'https://github.com/signalux',
            'fontFamily'          => 'Shabnam',
            'fontSizeBase'        => '16px',
            'fontHeadingScale'    => '1.25',
            'fontWeightBase'      => '400',
            'lineHeightScale'     => '1.65',
            'gtmContainerId'      => 'GTM-T9K8LP',
            'gtmEnabled'          => true,
            'gscVerificationCode' => 'google-site-verification=abcdef1234567890',
            'melipayamakOtpBodyId'=> 123456,
            'melipayamakEnabled'  => true,
            'googleLoginEnabled'  => true
        ]);
    }

    public static function getServices(): void {
        $db = Database::getConnection();
        if ($db) {
            $stmt = $db->query("SELECT * FROM services WHERE is_active = 1 ORDER BY sort_order ASC");
            $rows = $stmt->fetchAll();
            $data = array_map(function($r) {
                return [
                    'id'           => $r['id'],
                    'slug'         => $r['slug'],
                    'title'        => $r['title'],
                    'subtitle'     => $r['subtitle'],
                    'iconName'     => $r['icon_name'],
                    'description'  => $r['description'],
                    'features'     => json_decode($r['features'] ?? '[]', true) ?: [],
                    'metrics'      => $r['metrics'],
                    'deliverables' => json_decode($r['deliverables'] ?? '[]', true) ?: [],
                ];
            }, $rows);
            Response::json($data);
        }

        Response::json([]);
    }

    public static function getProjects(): void {
        $db = Database::getConnection();
        $category = $_GET['category'] ?? null;

        if ($db) {
            $sql = "SELECT * FROM projects WHERE is_published = 1";
            $params = [];
            if (!empty($category) && $category !== 'all') {
                $sql .= " AND category = ?";
                $params[] = $category;
            }
            $sql .= " ORDER BY sort_order ASC, created_at DESC";

            $stmt = $db->prepare($sql);
            $stmt->execute($params);
            $rows = $stmt->fetchAll();

            $data = array_map(function($r) {
                return [
                    'id'              => $r['id'],
                    'slug'            => $r['slug'],
                    'title'           => $r['title'],
                    'client'          => $r['client'],
                    'category'        => $r['category'],
                    'categoryLabel'   => $r['category_label'],
                    'thumbnail'       => $r['thumbnail'],
                    'year'            => $r['year'],
                    'summary'         => $r['summary'],
                    'fullDescription' => $r['full_description'],
                    'tags'            => json_decode($r['tags'] ?? '[]', true) ?: [],
                    'metrics'         => json_decode($r['metrics'] ?? '[]', true) ?: [],
                    'isFeatured'      => (bool)$r['is_featured']
                ];
            }, $rows);

            Response::json($data);
        }

        Response::json([]);
    }

    public static function getProjectById(string $id): void {
        $db = Database::getConnection();
        if ($db) {
            $stmt = $db->prepare("SELECT * FROM projects WHERE (id = ? OR slug = ?) AND is_published = 1 LIMIT 1");
            $stmt->execute([$id, $id]);
            $r = $stmt->fetch();
            if ($r) {
                Response::json([
                    'id'              => $r['id'],
                    'slug'            => $r['slug'],
                    'title'           => $r['title'],
                    'client'          => $r['client'],
                    'category'        => $r['category'],
                    'categoryLabel'   => $r['category_label'],
                    'thumbnail'       => $r['thumbnail'],
                    'year'            => $r['year'],
                    'summary'         => $r['summary'],
                    'fullDescription' => $r['full_description'],
                    'tags'            => json_decode($r['tags'] ?? '[]', true) ?: [],
                    'metrics'         => json_decode($r['metrics'] ?? '[]', true) ?: [],
                    'isFeatured'      => (bool)$r['is_featured']
                ]);
            }
        }

        Response::error('پروژه مورد نظر یافت نشد.', 404, 'NOT_FOUND');
    }

    public static function getTestimonials(): void {
        $db = Database::getConnection();
        if ($db) {
            $stmt = $db->query("SELECT * FROM testimonials WHERE is_published = 1 ORDER BY sort_order ASC");
            $rows = $stmt->fetchAll();
            $data = array_map(function($r) {
                return [
                    'id'              => $r['id'],
                    'name'            => $r['name'],
                    'role'            => $r['role'],
                    'company'         => $r['company'],
                    'avatar'          => $r['avatar'],
                    'quote'           => $r['quote'],
                    'rating'          => (int)$r['rating'],
                    'resultsAchieved' => $r['results_achieved']
                ];
            }, $rows);
            Response::json($data);
        }

        Response::json([]);
    }

    public static function getCertificates(): void {
        $db = Database::getConnection();
        if ($db) {
            $stmt = $db->query("SELECT * FROM certificates WHERE is_published = 1 ORDER BY sort_order ASC");
            $rows = $stmt->fetchAll();
            $data = array_map(function($r) {
                return [
                    'id'          => $r['id'],
                    'title'       => $r['title'],
                    'issuer'      => $r['issuer'],
                    'issueDate'   => $r['issue_date'],
                    'image'       => $r['image'],
                    'badgeType'   => $r['badge_type'],
                    'description' => $r['description'],
                    'skills'      => json_decode($r['skills'] ?? '[]', true) ?: []
                ];
            }, $rows);
            Response::json($data);
        }

        Response::json([]);
    }

    public static function getFaqs(): void {
        $db = Database::getConnection();
        if ($db) {
            $stmt = $db->query("SELECT * FROM faqs WHERE is_published = 1 ORDER BY sort_order ASC");
            $rows = $stmt->fetchAll();
            $data = array_map(function($r) {
                return [
                    'id'       => $r['id'],
                    'category' => $r['category'],
                    'question' => $r['question'],
                    'answer'   => $r['answer']
                ];
            }, $rows);
            Response::json($data);
        }

        Response::json([]);
    }

    public static function postConsultation(): void {
        $input = Response::getJsonInput();
        $name = trim($input['name'] ?? '');
        $email = trim($input['email'] ?? '');
        $phone = trim($input['phone'] ?? '');
        $service = trim($input['service'] ?? '');
        $budget = trim($input['budget'] ?? '');
        $message = trim($input['message'] ?? '');

        if (empty($name) || (empty($email) && empty($phone))) {
            Response::error('نام و حداقل یکی از موارد ایمیل یا شماره تماس الزامی است.', 400, 'VALIDATION_ERROR');
        }

        $id = 'lead-' . time() . '-' . rand(100, 999);
        $ip = $_SERVER['REMOTE_ADDR'] ?? null;
        $ua = $_SERVER['HTTP_USER_AGENT'] ?? null;

        $db = Database::getConnection();
        if ($db) {
            $stmt = $db->prepare("
                INSERT INTO leads (id, type, name, email, phone, service, budget, message, status, ip_address, user_agent)
                VALUES (?, 'consultation', ?, ?, ?, ?, ?, ?, 'new', ?, ?)
            ");
            $stmt->execute([$id, $name, $email, $phone, $service, $budget, $message, $ip, $ua]);
        }

        Response::json([
            'id'        => $id,
            'message'   => 'درخواست مشاوره شما با موفقیت ثبت شد و به زودی با شما تماس خواهیم گرفت.'
        ], 201);
    }

    public static function postContact(): void {
        $input = Response::getJsonInput();
        $name = trim($input['name'] ?? '');
        $email = trim($input['email'] ?? '');
        $phone = trim($input['phone'] ?? '');
        $message = trim($input['message'] ?? '');

        if (empty($name) || (empty($email) && empty($phone))) {
            Response::error('نام و حداقل یکی از راه‌های ارتباطی الزامی است.', 400, 'VALIDATION_ERROR');
        }

        $id = 'lead-' . time() . '-' . rand(100, 999);
        $ip = $_SERVER['REMOTE_ADDR'] ?? null;
        $ua = $_SERVER['HTTP_USER_AGENT'] ?? null;

        $db = Database::getConnection();
        if ($db) {
            $stmt = $db->prepare("
                INSERT INTO leads (id, type, name, email, phone, message, status, ip_address, user_agent)
                VALUES (?, 'contact', ?, ?, ?, ?, 'new', ?, ?)
            ");
            $stmt->execute([$id, $name, $email, $phone, $message, $ip, $ua]);
        }

        Response::json([
            'id'      => $id,
            'message' => 'پیام شما با موفقیت دریافت شد.'
        ], 201);
    }
}
