<?php

namespace Signalux\Core;

use PDO;

class Auth {
    private static ?array $currentUser = null;

    public static function tokenConfig(): array {
        $jwt = (require __DIR__ . '/../config.php')['jwt'];
        if (strlen($jwt['access_secret']) < 64 || strlen($jwt['refresh_secret']) < 64
            || $jwt['access_secret'] === $jwt['refresh_secret']) {
            Response::error('سرویس ورود موقتاً در دسترس نیست.', 503, 'AUTH_UNAVAILABLE');
        }
        return $jwt;
    }

    public static function database(): PDO {
        $db = Database::getConnection();
        if (!$db) {
            Response::error('سرویس ورود موقتاً در دسترس نیست.', 503, 'AUTH_UNAVAILABLE');
        }
        return $db;
    }

    public static function accessClaims(): ?array {
        $header = $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '';
        if (!preg_match('/^Bearer\s+(\S+)$/i', $header, $matches)) return null;
        $payload = JWT::decode($matches[1], self::tokenConfig()['access_secret']);
        if (($payload['type'] ?? null) !== 'access' || !is_string($payload['sub'] ?? null)
            || !is_string($payload['sessionId'] ?? null) || !is_int($payload['exp'] ?? null)) {
            return null;
        }
        return $payload;
    }

    public static function profile(PDO $db, array $user): array {
        $rolesQuery = $db->prepare('SELECT r.name FROM roles r JOIN user_roles ur ON ur.roleId = r.id WHERE ur.userId = ?');
        $rolesQuery->execute([$user['id']]);
        $roles = $rolesQuery->fetchAll(PDO::FETCH_COLUMN);

        $permissions = ['*'];
        if (!in_array('SUPER_ADMIN', $roles, true)) {
            $query = $db->prepare('SELECT DISTINCT p.`key` FROM permissions p
                JOIN role_permissions rp ON rp.permissionId = p.id
                JOIN user_roles ur ON ur.roleId = rp.roleId WHERE ur.userId = ?');
            $query->execute([$user['id']]);
            $permissions = $query->fetchAll(PDO::FETCH_COLUMN);
        }

        return [
            'id' => $user['id'],
            'firstName' => $user['firstName'],
            'lastName' => $user['lastName'],
            'email' => str_ends_with($user['email'], '@signin.invalid') ? '' : $user['email'],
            'phone' => $user['phone'],
            'avatar' => $user['avatar'],
            'roles' => $roles,
            'permissions' => $permissions,
        ];
    }

    public static function getCurrentUser(): ?array {
        if (self::$currentUser !== null) return self::$currentUser;
        $claims = self::accessClaims();
        if (!$claims) return null;
        $db = self::database();
        $query = $db->prepare("SELECT u.id, u.firstName, u.lastName, u.email, u.phone, u.avatar
            FROM users u JOIN refresh_tokens s ON s.userId = u.id
            WHERE u.id = ? AND u.status = 'ACTIVE' AND s.id = ? AND s.revokedAt IS NULL AND s.expiresAt > NOW()");
        $query->execute([$claims['sub'], $claims['sessionId']]);
        $user = $query->fetch();
        return $user ? self::$currentUser = self::profile($db, $user) : null;
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
        if (!in_array('SUPER_ADMIN', $user['roles'], true) && !in_array($permissionKey, $user['permissions'], true)) {
            Response::error('دسترسی لازم وجود ندارد.', 403, 'PERMISSION_DENIED');
        }
        return $user;
    }
}
