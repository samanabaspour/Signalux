<?php
/**
 * Authentication & RBAC Guard Helper for PHP
 */

namespace Signalux\Core;

use PDO;

class Auth {
    private static ?array $currentUser = null;

    public static function getCurrentUser(): ?array {
        if (self::$currentUser !== null) {
            return self::$currentUser;
        }

        $headers = getallheaders();
        $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';

        if (!preg_match('/Bearer\s(\S+)/i', $authHeader, $matches)) {
            return null;
        }

        $token = $matches[1];
        $config = require __DIR__ . '/../config.php';
        $payload = JWT::decode($token, $config['jwt']['access_secret']);

        if (!$payload || !isset($payload['sub'])) {
            return null;
        }

        $userId = $payload['sub'];
        $db = Database::getConnection();

        if ($db) {
            $stmt = $db->prepare("SELECT id, first_name, last_name, email, phone, avatar, status FROM users WHERE id = ?");
            $stmt->execute([$userId]);
            $user = $stmt->fetch();

            if (!$user || $user['status'] !== 'ACTIVE') {
                return null;
            }

            // Fetch roles & permissions
            $roleStmt = $db->prepare("
                SELECT r.name 
                FROM roles r
                JOIN user_roles ur ON ur.role_id = r.id
                WHERE ur.user_id = ?
            ");
            $roleStmt->execute([$userId]);
            $roles = $roleStmt->fetchAll(PDO::FETCH_COLUMN);

            $permStmt = $db->prepare("
                SELECT DISTINCT p.permission_key
                FROM permissions p
                JOIN role_permissions rp ON rp.permission_id = p.id
                JOIN user_roles ur ON ur.role_id = rp.role_id
                WHERE ur.user_id = ?
            ");
            $permStmt->execute([$userId]);
            $permissions = $permStmt->fetchAll(PDO::FETCH_COLUMN);

            self::$currentUser = [
                'id'          => $user['id'],
                'firstName'   => $user['first_name'],
                'lastName'    => $user['last_name'],
                'email'       => $user['email'],
                'phone'       => $user['phone'],
                'avatar'      => $user['avatar'],
                'roles'       => $roles,
                'permissions' => in_array('SUPER_ADMIN', $roles) ? ['*'] : $permissions,
            ];
        } else {
            // Fallback for memory simulation
            self::$currentUser = [
                'id'          => 'usr-super-admin-01',
                'firstName'   => 'مدیر',
                'lastName'    => 'ارشد',
                'email'       => 'admin@signalux.ir',
                'phone'       => '۰۹۱۲۰۰۰۰۰۰۰',
                'avatar'      => null,
                'roles'       => ['SUPER_ADMIN'],
                'permissions' => ['*'],
            ];
        }

        return self::$currentUser;
    }

    public static function requireAuth(): array {
        $user = self::getCurrentUser();
        if (!$user) {
            Response::error('احراز هویت انجام نشده است. لطفاً ابتدا وارد شوید.', 401, 'UNAUTHORIZED');
        }
        return $user;
    }

    public static function requirePermission(string $permissionKey): array {
        $user = self::requireAuth();
        if (in_array('SUPER_ADMIN', $user['roles']) || in_array('*', $user['permissions'])) {
            return $user;
        }

        if (!in_array($permissionKey, $user['permissions'])) {
            Response::error('شما دسترسی لازم برای انجام این عملیات را ندارید.', 403, 'PERMISSION_DENIED', [
                'required' => $permissionKey
            ]);
        }

        return $user;
    }
}
