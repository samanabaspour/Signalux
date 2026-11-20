<?php

namespace Signalux\Controllers;

use PDO;
use Signalux\Core\Auth;
use Signalux\Core\JWT;
use Signalux\Core\Response;

class AuthController {
    private static function issueTokens(PDO $db, string $userId, array $jwt): array {
        $sessionId = bin2hex(random_bytes(16));
        $claims = ['sub' => $userId, 'sessionId' => $sessionId];
        $access = JWT::encode($claims + ['type' => 'access'], $jwt['access_secret'], $jwt['access_expiry']);
        $refresh = JWT::encode($claims + ['type' => 'refresh'], $jwt['refresh_secret'], $jwt['refresh_expiry']);
        $query = $db->prepare('INSERT INTO refresh_tokens (id, userId, tokenHash, expiresAt, ipAddress, userAgent)
            VALUES (?, ?, ?, DATE_ADD(NOW(), INTERVAL ? SECOND), ?, ?)');
        $query->execute([
            $sessionId, $userId, hash('sha256', $refresh), $jwt['refresh_expiry'],
            $_SERVER['REMOTE_ADDR'] ?? null, $_SERVER['HTTP_USER_AGENT'] ?? null,
        ]);
        return ['accessToken' => $access, 'refreshToken' => $refresh];
    }

    public static function login(): void {
        $input = Response::getJsonInput();
        $email = is_string($input['email'] ?? null) ? strtolower(trim($input['email'])) : '';
        $password = $input['password'] ?? null;
        if (!filter_var($email, FILTER_VALIDATE_EMAIL) || !is_string($password) || $password === '' || strlen($password) > 256) {
            Response::error('ایمیل و رمز عبور معتبر الزامی است.', 400, 'VALIDATION_ERROR');
        }

        Auth::tokenConfig();
        $db = Auth::database();
        $query = $db->prepare('SELECT id, firstName, lastName, email, phone, avatar, passwordHash, status FROM users WHERE email = ?');
        $query->execute([$email]);
        $user = $query->fetch();
        if (!$user || $user['status'] !== 'ACTIVE' || !password_verify($password, $user['passwordHash'])) {
            Response::error('ایمیل یا رمز عبور وارد شده صحیح نیست.', 401, 'INVALID_CREDENTIALS');
        }
        self::createSession($db, $user);
    }

    public static function createSession(PDO $db, array $user): void {
        if ($user['status'] !== 'ACTIVE') {
            Response::error('حساب یا نشست معتبر نیست.', 401, 'UNAUTHORIZED');
        }
        $jwt = Auth::tokenConfig();
        $profile = Auth::profile($db, $user);
        $db->beginTransaction();
        try {
            $tokens = self::issueTokens($db, $user['id'], $jwt);
            $db->prepare('UPDATE users SET lastLoginAt = NOW() WHERE id = ?')->execute([$user['id']]);
            $db->commit();
        } catch (\Throwable $error) {
            if ($db->inTransaction()) $db->rollBack();
            throw $error;
        }
        Response::json($tokens + ['user' => $profile]);
    }

    public static function refresh(): void {
        $token = Response::getJsonInput()['refreshToken'] ?? null;
        if (!is_string($token) || $token === '' || strlen($token) > 4096) {
            Response::error('توکن بازیابی الزامی است.', 400, 'VALIDATION_ERROR');
        }
        $jwt = Auth::tokenConfig();
        $claims = JWT::decode($token, $jwt['refresh_secret']);
        if (($claims['type'] ?? null) !== 'refresh' || !is_string($claims['sub'] ?? null)
            || !is_string($claims['sessionId'] ?? null) || !is_int($claims['exp'] ?? null)) {
            Response::error('توکن بازیابی نامعتبر است.', 401, 'INVALID_REFRESH_TOKEN');
        }

        $db = Auth::database();
        $db->beginTransaction();
        try {
            $query = $db->prepare("UPDATE refresh_tokens s JOIN users u ON u.id = s.userId
                SET s.revokedAt = NOW()
                WHERE s.id = ? AND s.userId = ? AND s.tokenHash = ? AND s.revokedAt IS NULL
                    AND s.expiresAt > NOW() AND u.status = 'ACTIVE'");
            $query->execute([$claims['sessionId'], $claims['sub'], hash('sha256', $token)]);
            if ($query->rowCount() !== 1) {
                $db->rollBack();
                Response::error('نشست معتبر نیست.', 401, 'INVALID_REFRESH_TOKEN');
            }
            $tokens = self::issueTokens($db, $claims['sub'], $jwt);
            $db->commit();
        } catch (\Throwable $error) {
            if ($db->inTransaction()) $db->rollBack();
            throw $error;
        }
        Response::json($tokens);
    }

    public static function me(): void {
        Response::json(Auth::requireAuth());
    }

    public static function logout(): void {
        $user = Auth::requireAuth();
        $session = Auth::accessClaims()['sessionId'];
        Auth::database()->prepare('UPDATE refresh_tokens SET revokedAt = NOW() WHERE id = ? AND userId = ?')
            ->execute([$session, $user['id']]);
        Response::json(['message' => 'با موفقیت خارج شدید.']);
    }

    public static function logoutAll(): void {
        $user = Auth::requireAuth();
        Auth::database()->prepare('UPDATE refresh_tokens SET revokedAt = NOW() WHERE userId = ? AND revokedAt IS NULL')
            ->execute([$user['id']]);
        Response::json(['message' => 'تمامی نشست‌های فعال شما باطل شدند.']);
    }
}
