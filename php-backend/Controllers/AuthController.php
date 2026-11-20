<?php
/**
 * Auth Controller (JWT Login, Token Rotation, Me, Logout)
 */

namespace Signalux\Controllers;

use Signalux\Core\Database;
use Signalux\Core\Response;
use Signalux\Core\JWT;
use Signalux\Core\Auth;
use PDO;

class AuthController {

    public static function login(): void {
        $input = Response::getJsonInput();
        $email = strtolower(trim($input['email'] ?? ''));
        $password = $input['password'] ?? '';

        if (empty($email) || empty($password)) {
            Response::error('ایمیل و رمز عبور الزامی است.', 400, 'VALIDATION_ERROR');
        }

        $config = require __DIR__ . '/../config.php';
        $db = Database::getConnection();

        $user = null;
        $roles = [];
        $permissions = [];

        if ($db) {
            $stmt = $db->prepare("SELECT * FROM users WHERE email = ? LIMIT 1");
            $stmt->execute([$email]);
            $user = $stmt->fetch();

            if ($user) {
                // Verify password
                if (!password_verify($password, $user['password_hash'])) {
                    Response::error('ایمیل یا رمز عبور وارد شده صحیح نیست.', 401, 'INVALID_CREDENTIALS');
                }

                if ($user['status'] !== 'ACTIVE') {
                    Response::error('حساب کاربری شما غیرفعال یا معلق شده است.', 403, 'ACCOUNT_DISABLED');
                }

                // Fetch roles
                $roleStmt = $db->prepare("SELECT r.name FROM roles r JOIN user_roles ur ON ur.role_id = r.id WHERE ur.user_id = ?");
                $roleStmt->execute([$user['id']]);
                $roles = $roleStmt->fetchAll(PDO::FETCH_COLUMN);

                // Fetch permissions
                $permStmt = $db->prepare("
                    SELECT DISTINCT p.permission_key 
                    FROM permissions p 
                    JOIN role_permissions rp ON rp.permission_id = p.id 
                    JOIN user_roles ur ON ur.role_id = rp.role_id 
                    WHERE ur.user_id = ?
                ");
                $permStmt->execute([$user['id']]);
                $permissions = in_array('SUPER_ADMIN', $roles) ? ['*'] : $permStmt->fetchAll(PDO::FETCH_COLUMN);

                // Update last login
                $db->prepare("UPDATE users SET last_login_at = NOW() WHERE id = ?")->execute([$user['id']]);
            }
        }

        // Fallback check for initial admin if DB is fresh
        if (!$user) {
            if ($email === strtolower($config['initial_admin']['email']) && $password === $config['initial_admin']['password']) {
                $user = [
                    'id'         => 'usr-super-admin-01',
                    'first_name' => $config['initial_admin']['first_name'],
                    'last_name'  => $config['initial_admin']['last_name'],
                    'email'      => $config['initial_admin']['email'],
                    'phone'      => '۰۹۱۲۰۰۰۰۰۰۰',
                    'avatar'     => null,
                ];
                $roles = ['SUPER_ADMIN'];
                $permissions = ['*'];
            } else {
                Response::error('ایمیل یا رمز عبور وارد شده صحیح نیست.', 401, 'INVALID_CREDENTIALS');
            }
        }

        // Generate Tokens
        $accessToken = JWT::encode([
            'sub'   => $user['id'],
            'email' => $user['email'],
            'roles' => $roles,
            'type'  => 'access'
        ], $config['jwt']['access_secret'], $config['jwt']['access_expiry']);

        $refreshToken = JWT::encode([
            'sub'  => $user['id'],
            'type' => 'refresh'
        ], $config['jwt']['refresh_secret'], $config['jwt']['refresh_expiry']);

        // Save refresh token hash in database
        if ($db) {
            $tokenHash = hash('sha256', $refreshToken);
            $tokenStmt = $db->prepare("
                INSERT INTO refresh_tokens (id, user_id, token_hash, expires_at, ip_address, user_agent)
                VALUES (?, ?, ?, DATE_ADD(NOW(), INTERVAL 7 DAY), ?, ?)
            ");
            $tokenStmt->execute([
                'rf-' . time() . '-' . rand(100, 999),
                $user['id'],
                $tokenHash,
                $_SERVER['REMOTE_ADDR'] ?? null,
                $_SERVER['HTTP_USER_AGENT'] ?? null
            ]);
        }

        Response::json([
            'accessToken'  => $accessToken,
            'refreshToken' => $refreshToken,
            'user'         => [
                'id'          => $user['id'],
                'firstName'   => $user['first_name'],
                'lastName'    => $user['last_name'],
                'email'       => $user['email'],
                'phone'       => $user['phone'] ?? null,
                'avatar'      => $user['avatar'] ?? null,
                'roles'       => $roles,
                'permissions' => $permissions
            ]
        ]);
    }

    public static function refresh(): void {
        $input = Response::getJsonInput();
        $refreshToken = $input['refreshToken'] ?? '';

        if (empty($refreshToken)) {
            Response::error('توکن بازیابی الزامی است.', 400, 'VALIDATION_ERROR');
        }

        $config = require __DIR__ . '/../config.php';
        $payload = JWT::decode($refreshToken, $config['jwt']['refresh_secret']);

        if (!$payload || ($payload['type'] ?? '') !== 'refresh' || !isset($payload['sub'])) {
            Response::error('توکن بازیابی نامعتبر یا منقضی شده است.', 401, 'INVALID_REFRESH_TOKEN');
        }

        $userId = $payload['sub'];
        $db = Database::getConnection();

        if ($db) {
            $tokenHash = hash('sha256', $refreshToken);
            $stmt = $db->prepare("SELECT * FROM refresh_tokens WHERE token_hash = ? AND revoked_at IS NULL AND expires_at > NOW()");
            $stmt->execute([$tokenHash]);
            $record = $stmt->fetch();

            if (!$record) {
                Response::error('توکن بازیابی باطل یا منقضی شده است.', 401, 'TOKEN_EXPIRED');
            }

            // Revoke old token (Token Rotation)
            $db->prepare("UPDATE refresh_tokens SET revoked_at = NOW() WHERE id = ?")->execute([$record['id']]);
        }

        // Issue new tokens
        $newAccessToken = JWT::encode([
            'sub'  => $userId,
            'type' => 'access'
        ], $config['jwt']['access_secret'], $config['jwt']['access_expiry']);

        $newRefreshToken = JWT::encode([
            'sub'  => $userId,
            'type' => 'refresh'
        ], $config['jwt']['refresh_secret'], $config['jwt']['refresh_expiry']);

        if ($db) {
            $newTokenHash = hash('sha256', $newRefreshToken);
            $db->prepare("
                INSERT INTO refresh_tokens (id, user_id, token_hash, expires_at, ip_address, user_agent)
                VALUES (?, ?, ?, DATE_ADD(NOW(), INTERVAL 7 DAY), ?, ?)
            ")->execute([
                'rf-' . time() . '-' . rand(100, 999),
                $userId,
                $newTokenHash,
                $_SERVER['REMOTE_ADDR'] ?? null,
                $_SERVER['HTTP_USER_AGENT'] ?? null
            ]);
        }

        Response::json([
            'accessToken'  => $newAccessToken,
            'refreshToken' => $newRefreshToken
        ]);
    }

    public static function me(): void {
        $user = Auth::requireAuth();
        Response::json($user);
    }

    public static function logout(): void {
        $user = Auth::requireAuth();
        $db = Database::getConnection();
        if ($db) {
            $input = Response::getJsonInput();
            if (!empty($input['refreshToken'])) {
                $hash = hash('sha256', $input['refreshToken']);
                $db->prepare("UPDATE refresh_tokens SET revoked_at = NOW() WHERE token_hash = ?")->execute([$hash]);
            }
        }
        Response::json(['message' => 'با موفقیت خارج شدید.']);
    }

    public static function logoutAll(): void {
        $user = Auth::requireAuth();
        $db = Database::getConnection();
        if ($db) {
            $db->prepare("UPDATE refresh_tokens SET revoked_at = NOW() WHERE user_id = ? AND revoked_at IS NULL")->execute([$user['id']]);
        }
        Response::json(['message' => 'تمامی نشست‌های فعال شما باطل شدند.']);
    }
}
