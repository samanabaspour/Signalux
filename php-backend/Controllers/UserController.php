<?php
/**
 * User & Role Management Controller (RBAC for Admin Team & App Users)
 */

namespace Signalux\Controllers;

use Signalux\Core\Database;
use Signalux\Core\Response;
use Signalux\Core\Auth;
use PDO;

class UserController {

    /**
     * Get Admin Team Users with Role & Permissions
     */
    public static function getAdminUsers(): void {
        Auth::requirePermission('roles.manage');
        $db = Database::getConnection();

        if ($db) {
            $stmt = $db->query("
                SELECT id, username, fullName, email, phone, role, permissions, avatar, isActive, lastLogin, createdAt
                FROM admin_users
                ORDER BY createdAt ASC
            ");
            $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $data = array_map([self::class, 'formatAdminUser'], $users);
            Response::json($data);
            return;
        }

        Response::json(self::getDefaultAdminUsers());
    }

    /**
     * Create Admin Team User
     */
    public static function createAdminUser(): void {
        Auth::requirePermission('roles.manage');
        $input = Response::getJsonInput();

        $username = trim($input['username'] ?? '');
        $password = $input['password'] ?? '12345678';
        $fullName = trim($input['fullName'] ?? '');
        $email = strtolower(trim($input['email'] ?? ''));
        $phone = trim($input['phone'] ?? '');
        $role = in_array($input['role'] ?? '', ['admin', 'seo', 'support', 'writer']) ? $input['role'] : 'support';
        $permissions = is_array($input['permissions'] ?? null) ? json_encode($input['permissions'], JSON_UNESCAPED_UNICODE) : '[]';
        $avatar = $input['avatar'] ?? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80';
        $isActive = !isset($input['isActive']) || $input['isActive'] ? 1 : 0;

        if (empty($username) || empty($fullName) || empty($email)) {
            Response::error('نام کاربری، نام کامل و ایمیل الزامی هستند.', 400, 'VALIDATION_ERROR');
            return;
        }

        $db = Database::getConnection();
        if ($db) {
            // Check username or email exists
            $check = $db->prepare("SELECT id FROM admin_users WHERE username = ? OR email = ?");
            $check->execute([$username, $email]);
            if ($check->fetch()) {
                Response::error('نام کاربری یا ایمیل وارد شده از قبل وجود دارد.', 400, 'USER_EXISTS');
                return;
            }

            $id = 'adm-' . uniqid();
            $hash = password_hash($password, PASSWORD_BCRYPT);

            $stmt = $db->prepare("
                INSERT INTO admin_users (id, username, passwordHash, fullName, email, phone, role, permissions, avatar, isActive, createdAt)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
            ");
            $stmt->execute([$id, $username, $hash, $fullName, $email, $phone, $role, $permissions, $avatar, $isActive]);

            $newUser = self::getAdminUserByIdInternal($id);
            Response::json($newUser, 201);
            return;
        }

        Response::error('خطا در ارتباط با دیتابیس.', 500);
    }

    /**
     * Update Admin Team User
     */
    public static function updateAdminUser(string $id): void {
        Auth::requirePermission('roles.manage');
        $input = Response::getJsonInput();
        $db = Database::getConnection();

        if ($db) {
            $fields = [];
            $params = [];

            if (isset($input['fullName'])) {
                $fields[] = "`fullName` = ?";
                $params[] = trim($input['fullName']);
            }
            if (isset($input['email'])) {
                $fields[] = "`email` = ?";
                $params[] = strtolower(trim($input['email']));
            }
            if (isset($input['phone'])) {
                $fields[] = "`phone` = ?";
                $params[] = trim($input['phone']);
            }
            if (isset($input['role']) && in_array($input['role'], ['admin', 'seo', 'support', 'writer'])) {
                $fields[] = "`role` = ?";
                $params[] = $input['role'];
            }
            if (isset($input['permissions']) && is_array($input['permissions'])) {
                $fields[] = "`permissions` = ?";
                $params[] = json_encode($input['permissions'], JSON_UNESCAPED_UNICODE);
            }
            if (isset($input['avatar'])) {
                $fields[] = "`avatar` = ?";
                $params[] = $input['avatar'];
            }
            if (isset($input['isActive'])) {
                $fields[] = "`isActive` = ?";
                $params[] = $input['isActive'] ? 1 : 0;
            }
            if (!empty($input['password'])) {
                $fields[] = "`passwordHash` = ?";
                $params[] = password_hash($input['password'], PASSWORD_BCRYPT);
            }

            if (empty($fields)) {
                Response::error('هیچ فیلدی برای ویرایش ارسال نشده است.', 400);
                return;
            }

            $fields[] = "`updatedAt` = NOW()";
            $sql = "UPDATE admin_users SET " . implode(', ', $fields) . " WHERE id = ?";
            $params[] = $id;

            $stmt = $db->prepare($sql);
            $stmt->execute($params);

            $user = self::getAdminUserByIdInternal($id);
            Response::json($user);
            return;
        }

        Response::error('خطا در پایگاه داده.', 500);
    }

    /**
     * Delete Admin User
     */
    public static function deleteAdminUser(string $id): void {
        Auth::requirePermission('roles.manage');
        $db = Database::getConnection();
        if ($db) {
            // Prevent deleting master admin
            if ($id === 'adm-1' || $id === 'u-admin-1') {
                Response::error('امکان حذف مدیر اصلی سیستم وجود ندارد.', 403, 'CANNOT_DELETE_SUPER_ADMIN');
                return;
            }

            $stmt = $db->prepare("DELETE FROM admin_users WHERE id = ?");
            $stmt->execute([$id]);
            Response::json(['success' => true, 'id' => $id]);
            return;
        }

        Response::error('خطا در حذف کاربر.', 500);
    }

    private static function getAdminUserByIdInternal(string $id): ?array {
        $db = Database::getConnection();
        if ($db) {
            $stmt = $db->prepare("SELECT id, username, fullName, email, phone, role, permissions, avatar, isActive, lastLogin, createdAt FROM admin_users WHERE id = ? LIMIT 1");
            $stmt->execute([$id]);
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            return $row ? self::formatAdminUser($row) : null;
        }
        return null;
    }

    private static function formatAdminUser(array $u): array {
        $perms = [];
        if (!empty($u['permissions'])) {
            $decoded = json_decode($u['permissions'], true);
            $perms = is_array($decoded) ? $decoded : [];
        }

        return [
            'id'          => $u['id'],
            'username'    => $u['username'],
            'fullName'    => $u['fullName'] ?? $u['username'],
            'email'       => $u['email'],
            'phone'       => $u['phone'] ?? '',
            'role'        => $u['role'] ?? 'admin',
            'permissions' => $perms,
            'avatar'      => $u['avatar'] ?? '',
            'isActive'    => (bool)($u['isActive'] ?? 1),
            'createdAt'   => $u['createdAt'] ?? date('Y-m-d H:i:s'),
            'lastLogin'   => $u['lastLogin'] ?? null
        ];
    }

    private static function getDefaultAdminUsers(): array {
        return [
            [
                'id'          => 'adm-1',
                'username'    => 'admin',
                'fullName'    => 'مهندس سهیل سلیمانی',
                'email'       => 'admin@signalux.ir',
                'phone'       => '۰۹۱۲۰۰۰۰۰۰۱',
                'role'        => 'admin',
                'permissions' => ['all'],
                'avatar'      => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
                'isActive'    => true,
                'createdAt'   => '2026-01-01 10:00:00',
                'lastLogin'   => '2026-03-12 11:30:00'
            ],
            [
                'id'          => 'adm-2',
                'username'    => 'seo_expert',
                'fullName'    => 'کیانوش رضوانی (متخصص سئو)',
                'email'       => 'seo@signalux.ir',
                'phone'       => '۰۹۱۲۰۰۰۰۰۰۲',
                'role'        => 'seo',
                'permissions' => ['seo', 'sitemap', 'robots', 'blog', 'google'],
                'avatar'      => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
                'isActive'    => true,
                'createdAt'   => '2026-01-10 14:00:00',
                'lastLogin'   => '2026-03-11 09:20:00'
            ],
            [
                'id'          => 'adm-3',
                'username'    => 'support_agent',
                'fullName'    => 'مونا احمدی (کارشناس پشتیبانی)',
                'email'       => 'support@signalux.ir',
                'phone'       => '۰۹۱۲۰۰۰۰۰۰۳',
                'role'        => 'support',
                'permissions' => ['tickets', 'leads', 'faqs'],
                'avatar'      => 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
                'isActive'    => true,
                'createdAt'   => '2026-01-15 08:30:00',
                'lastLogin'   => '2026-03-12 10:05:00'
            ],
            [
                'id'          => 'adm-4',
                'username'    => 'content_writer',
                'fullName'    => 'آرش درخشان (نویسنده ارشد وبلاگ)',
                'email'       => 'content@signalux.ir',
                'phone'       => '۰۹۱۲۰۰۰۰۰۰۴',
                'role'        => 'writer',
                'permissions' => ['blog', 'media'],
                'avatar'      => 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
                'isActive'    => true,
                'createdAt'   => '2026-02-01 16:45:00',
                'lastLogin'   => '2026-03-10 17:15:00'
            ]
        ];
    }
}
