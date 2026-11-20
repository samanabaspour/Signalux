<?php
/**
 * Signalux Production Backend - Authentication & User Service
 */

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/jwt.php';
require_once __DIR__ . '/response.php';

class AuthService {
    /**
     * Authenticate user with Email & Password
     */
    public static function login(string $email, string $password): array {
        $email = trim(strtolower($email));
        $pdo = Database::getConnection();

        $stmt = $pdo->prepare("SELECT * FROM `users` WHERE `email` = ? LIMIT 1");
        $stmt->execute([$email]);
        $user = $stmt->fetch();

        if (!$user) {
            // Admin fallback if not seeded
            if ($email === INITIAL_ADMIN_EMAIL && $password === INITIAL_ADMIN_PASSWORD) {
                return self::generateTokensForAdminFallback();
            }
            Response::error('ایمیل یا رمز عبور وارد شده صحیح نیست.', 401, 'INVALID_CREDENTIALS');
        }

        if ($user['status'] !== 'ACTIVE') {
            Response::error('حساب کاربری شما غیرفعال یا معلق شده است.', 403, 'ACCOUNT_DISABLED');
        }

        // Verify bcrypt password
        if (!password_verify($password, $user['passwordHash'])) {
            Response::error('ایمیل یا رمز عبور وارد شده صحیح نیست.', 401, 'INVALID_CREDENTIALS');
        }

        // Fetch User Roles
        $roleStmt = $pdo->prepare("
            SELECT r.name, r.labelPersian 
            FROM user_roles ur 
            JOIN roles r ON ur.roleId = r.id 
            WHERE ur.userId = ?
        ");
        $roleStmt->execute([$user['id']]);
        $roles = $roleStmt->fetchAll(PDO::FETCH_COLUMN, 0);

        // Fetch User Permissions
        $permStmt = $pdo->prepare("
            SELECT DISTINCT p.key 
            FROM user_roles ur 
            JOIN role_permissions rp ON ur.roleId = rp.roleId 
            JOIN permissions p ON rp.permissionId = p.id 
            WHERE ur.userId = ?
        ");
        $permStmt->execute([$user['id']]);
        $permissions = $permStmt->fetchAll(PDO::FETCH_COLUMN, 0);

        if (in_array('SUPER_ADMIN', $roles)) {
            // All permissions for Super Admin
            $allPermStmt = $pdo->query("SELECT `key` FROM `permissions`");
            $permissions = $allPermStmt->fetchAll(PDO::FETCH_COLUMN, 0);
        }

        // Generate Refresh Token
        $refreshTokenPlain = bin2hex(random_bytes(32));
        $refreshTokenHash = hash('sha256', $refreshTokenPlain);
        $expiresAt = date('Y-m-d H:i:s', time() + JWT_REFRESH_EXPIRY);
        $sessionId = 'sess_' . bin2hex(random_bytes(16));

        $tokenStmt = $pdo->prepare("
            INSERT INTO `refresh_tokens` (`id`, `userId`, `tokenHash`, `expiresAt`, `ipAddress`, `userAgent`)
            VALUES (?, ?, ?, ?, ?, ?)
        ");
        $tokenStmt->execute([
            $sessionId,
            $user['id'],
            $refreshTokenHash,
            $expiresAt,
            Response::getClientIp(),
            Response::getUserAgent()
        ]);

        // Update last login
        $pdo->prepare("UPDATE `users` SET `lastLoginAt` = NOW() WHERE `id` = ?")->execute([$user['id']]);

        // Generate Access Token (JWT)
        $accessPayload = [
            'sub' => $user['id'],
            'sessionId' => $sessionId,
            'type' => 'access'
        ];
        $accessToken = JWT::sign($accessPayload, JWT_ACCESS_SECRET, JWT_ACCESS_EXPIRY);

        // Audit Log
        self::logAudit($user['id'], 'USER_LOGIN', 'User', $user['id']);

        return [
            'accessToken' => $accessToken,
            'refreshToken' => $refreshTokenPlain,
            'user' => [
                'id' => $user['id'],
                'firstName' => $user['firstName'],
                'lastName' => $user['lastName'],
                'email' => $user['email'],
                'phone' => $user['phone'],
                'avatar' => $user['avatar'],
                'roles' => $roles,
                'permissions' => $permissions
            ]
        ];
    }

    /**
     * Refresh Token Rotation
     */
    public static function refreshToken(string $refreshTokenPlain): array {
        $pdo = Database::getConnection();
        $tokenHash = hash('sha256', $refreshTokenPlain);

        $stmt = $pdo->prepare("
            SELECT * FROM `refresh_tokens` 
            WHERE `tokenHash` = ? AND `revokedAt` IS NULL AND `expiresAt` > NOW() 
            LIMIT 1
        ");
        $stmt->execute([$tokenHash]);
        $session = $stmt->fetch();

        if (!$session) {
            Response::error('توکن بازیابی منقضی یا باطل شده است.', 401, 'INVALID_REFRESH_TOKEN');
        }

        // Revoke current refresh token
        $pdo->prepare("UPDATE `refresh_tokens` SET `revokedAt` = NOW() WHERE `id` = ?")->execute([$session['id']]);

        // Issue new refresh token
        $newRefreshTokenPlain = bin2hex(random_bytes(32));
        $newTokenHash = hash('sha256', $newRefreshTokenPlain);
        $newSessionId = 'sess_' . bin2hex(random_bytes(16));
        $expiresAt = date('Y-m-d H:i:s', time() + JWT_REFRESH_EXPIRY);

        $insertStmt = $pdo->prepare("
            INSERT INTO `refresh_tokens` (`id`, `userId`, `tokenHash`, `expiresAt`, `ipAddress`, `userAgent`)
            VALUES (?, ?, ?, ?, ?, ?)
        ");
        $insertStmt->execute([
            $newSessionId,
            $session['userId'],
            $newTokenHash,
            $expiresAt,
            Response::getClientIp(),
            Response::getUserAgent()
        ]);

        // Issue new Access Token
        $accessPayload = [
            'sub' => $session['userId'],
            'sessionId' => $newSessionId,
            'type' => 'access'
        ];
        $accessToken = JWT::sign($accessPayload, JWT_ACCESS_SECRET, JWT_ACCESS_EXPIRY);

        return [
            'accessToken' => $accessToken,
            'refreshToken' => $newRefreshTokenPlain
        ];
    }

    /**
     * Get Authenticated User Context
     */
    public static function getAuthenticatedUser(): ?array {
        $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
        if (empty($authHeader) && function_exists('apache_request_headers')) {
            $headers = apache_request_headers();
            $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';
        }

        if (!str_starts_with($authHeader, 'Bearer ')) {
            return null;
        }

        $token = substr($authHeader, 7);
        $payload = JWT::verify($token, JWT_ACCESS_SECRET);
        if (!$payload || ($payload['type'] ?? '') !== 'access') {
            return null;
        }

        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("SELECT * FROM `users` WHERE `id` = ? LIMIT 1");
        $stmt->execute([$payload['sub']]);
        $user = $stmt->fetch();

        if (!$user || $user['status'] !== 'ACTIVE') {
            return null;
        }

        // Roles & Permissions
        $roleStmt = $pdo->prepare("
            SELECT r.name 
            FROM user_roles ur 
            JOIN roles r ON ur.roleId = r.id 
            WHERE ur.userId = ?
        ");
        $roleStmt->execute([$user['id']]);
        $roles = $roleStmt->fetchAll(PDO::FETCH_COLUMN, 0);

        $permStmt = $pdo->prepare("
            SELECT DISTINCT p.key 
            FROM user_roles ur 
            JOIN role_permissions rp ON ur.roleId = rp.roleId 
            JOIN permissions p ON rp.permissionId = p.id 
            WHERE ur.userId = ?
        ");
        $permStmt->execute([$user['id']]);
        $permissions = $permStmt->fetchAll(PDO::FETCH_COLUMN, 0);

        if (in_array('SUPER_ADMIN', $roles)) {
            $allPermStmt = $pdo->query("SELECT `key` FROM `permissions`");
            $permissions = $allPermStmt->fetchAll(PDO::FETCH_COLUMN, 0);
        }

        return [
            'id' => $user['id'],
            'firstName' => $user['firstName'],
            'lastName' => $user['lastName'],
            'email' => $user['email'],
            'phone' => $user['phone'],
            'avatar' => $user['avatar'],
            'roles' => $roles,
            'permissions' => $permissions,
            'sessionId' => $payload['sessionId'] ?? null
        ];
    }

    /**
     * Require Authentication Guard
     */
    public static function requireAuth(): array {
        $user = self::getAuthenticatedUser();
        if (!$user) {
            Response::error('لطفاً ابتدا وارد حساب کاربری خود شوید.', 401, 'UNAUTHORIZED');
        }
        return $user;
    }

    /**
     * Require Permission Guard
     */
    public static function requirePermission(string $permission): array {
        $user = self::requireAuth();
        if (in_array('SUPER_ADMIN', $user['roles'])) {
            return $user;
        }
        if (!in_array($permission, $user['permissions'])) {
            Response::error('شما سطح دسترسی لازم برای انجام این عملیات را ندارید.', 403, 'PERMISSION_DENIED', [
                'requiredPermission' => $permission
            ]);
        }
        return $user;
    }

    /**
     * Write Audit Log
     */
    public static function logAudit(?string $userId, string $action, string $entityType, ?string $entityId = null, ?array $metadata = null): void {
        try {
            $pdo = Database::getConnection();
            $stmt = $pdo->prepare("
                INSERT INTO `audit_logs` (`id`, `userId`, `action`, `entityType`, `entityId`, `metadata`, `ipAddress`, `userAgent`)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ");
            $stmt->execute([
                'audit_' . bin2hex(random_bytes(16)),
                $userId,
                $action,
                $entityType,
                $entityId,
                $metadata ? json_encode($metadata, JSON_UNESCAPED_UNICODE) : null,
                Response::getClientIp(),
                Response::getUserAgent()
            ]);
        } catch (Exception $e) {
            // Ignore audit log error in background
        }
    }

    private static function generateTokensForAdminFallback(): array {
        $sessionId = 'sess_fallback_' . time();
        $accessPayload = [
            'sub' => 'u-admin-1',
            'sessionId' => $sessionId,
            'type' => 'access'
        ];
        $accessToken = JWT::sign($accessPayload, JWT_ACCESS_SECRET, JWT_ACCESS_EXPIRY);
        $refreshToken = bin2hex(random_bytes(32));

        return [
            'accessToken' => $accessToken,
            'refreshToken' => $refreshToken,
            'user' => [
                'id' => 'u-admin-1',
                'firstName' => 'مدیر',
                'lastName' => 'ارشد',
                'email' => INITIAL_ADMIN_EMAIL,
                'phone' => '۰۹۱۲۰۰۰۰۰۰۰',
                'avatar' => null,
                'roles' => ['SUPER_ADMIN'],
                'permissions' => ['*']
            ]
        ];
    }
}
