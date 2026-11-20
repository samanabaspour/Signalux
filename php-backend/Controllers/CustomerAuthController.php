<?php

namespace Signalux\Controllers;

use PDO;
use PDOException;
use Signalux\Core\Auth;
use Signalux\Core\Database;
use Signalux\Core\Response;

class CustomerAuthController {
    private const GOOGLE_CERTS = 'https://www.googleapis.com/oauth2/v1/certs';
    private const SMS_ENDPOINT = 'https://rest.payamak-panel.com/api/SendSMS/BaseServiceNumber';

    private static function googleClientId(): string {
        $id = trim(getenv('GOOGLE_CLIENT_ID') ?: '');
        return preg_match('/^[a-z0-9-]+\.apps\.googleusercontent\.com$/D', $id) ? $id : '';
    }

    private static function smsConfigured(): bool {
        return getenv('MELIPAYAMAK_USERNAME') && getenv('MELIPAYAMAK_PASSWORD')
            && preg_match('/^[1-9]\d*$/D', getenv('MELIPAYAMAK_PATTERN_ID') ?: '');
    }

    public static function options(): void {
        $jwt = (require __DIR__ . '/../config.php')['jwt'];
        $ready = strlen($jwt['access_secret']) >= 64 && strlen($jwt['refresh_secret']) >= 64
            && $jwt['access_secret'] !== $jwt['refresh_secret'] && Database::isConnected();
        $https = extension_loaded('openssl') && ini_get('allow_url_fopen');
        Response::json([
            'password' => $ready,
            'google' => $ready && $https && self::googleClientId() !== '',
            'sms' => $ready && $https && self::smsConfigured(),
        ]);
    }

    private static function database(string $method): PDO {
        if (!extension_loaded('openssl') || !ini_get('allow_url_fopen')
            || ($method === 'google' ? self::googleClientId() === '' : !self::smsConfigured())) {
            Response::error('این روش ورود در این محیط پیکربندی نشده است.', 503, 'AUTH_METHOD_UNAVAILABLE');
        }
        Auth::tokenConfig();
        return Auth::database();
    }

    private static function proof(string $value): string {
        return hash_hmac('sha256', $value, Auth::tokenConfig()['refresh_secret']);
    }

    private static function ipKey(): string {
        return self::proof('ip:' . ($_SERVER['REMOTE_ADDR'] ?? ''));
    }

    private static function input(): array {
        if (!preg_match('#^application/json(?:\s*;|$)#i', $_SERVER['CONTENT_TYPE'] ?? '')) {
            Response::error('درخواست JSON لازم است.', 415, 'JSON_REQUIRED');
        }
        return Response::getJsonInput();
    }

    private static function digits(mixed $value): string {
        if (!is_string($value)) return '';
        return str_replace(
            preg_split('//u', '۰۱۲۳۴۵۶۷۸۹٠١٢٣٤٥٦٧٨٩', -1, PREG_SPLIT_NO_EMPTY),
            str_split('01234567890123456789'), trim($value)
        );
    }

    private static function name(mixed $value): string {
        if (!is_string($value)) return '';
        $name = trim($value);
        if (!preg_match('/^.{0,80}$/usD', $name)) return '';
        return $name;
    }

    private static function externalJson(string $url, ?array $body = null): array {
        $options = ['method' => $body === null ? 'GET' : 'POST', 'timeout' => 8, 'follow_location' => 0];
        if ($body !== null) {
            $options['header'] = 'Content-Type: application/x-www-form-urlencoded';
            $options['content'] = http_build_query($body);
        }
        $raw = @file_get_contents($url, false, stream_context_create(['http' => $options]));
        $data = is_string($raw) ? json_decode($raw, true) : null;
        if (!is_array($data)) {
            Response::error('ارتباط با سرویس ورود برقرار نشد.', 502, 'AUTH_PROVIDER_UNAVAILABLE');
        }
        return $data;
    }

    public static function googleChallenge(): void {
        self::input();
        $db = self::database('google');
        $ip = self::ipKey();
        $count = $db->prepare("SELECT COUNT(*) FROM customer_auth_challenges
            WHERE kind = 'google' AND ipKey = ? AND createdAt > DATE_SUB(NOW(), INTERVAL 1 MINUTE)");
        $count->execute([$ip]);
        if ((int)$count->fetchColumn() >= 12) self::limited();
        $nonce = bin2hex(random_bytes(24));
        $db->prepare("INSERT INTO customer_auth_challenges
            (id, rateKey, kind, subject, proofHash, ipKey, expiresAt)
            VALUES (?, ?, 'google', ?, ?, ?, DATE_ADD(NOW(), INTERVAL 10 MINUTE))")->execute([
                $nonce, 'google:' . $nonce, $nonce, self::proof('google:' . $nonce), $ip,
            ]);
        Response::json(['clientId' => self::googleClientId(), 'nonce' => $nonce]);
    }

    private static function invalidGoogle(): never {
        Response::error('پاسخ ورود گوگل معتبر نیست. دوباره تلاش کنید.', 401, 'INVALID_GOOGLE_CREDENTIAL');
        exit;
    }

    private static function decodePart(string $part): string|false {
        return base64_decode(strtr($part, '-_', '+/'), true);
    }

    public static function google(): void {
        $credential = self::input()['credential'] ?? null;
        $db = self::database('google');
        if (!is_string($credential) || strlen($credential) > 8192 || substr_count($credential, '.') !== 2) self::invalidGoogle();
        [$rawHeader, $rawClaims, $rawSignature] = explode('.', $credential);
        $header = json_decode(self::decodePart($rawHeader) ?: '', true);
        $identity = json_decode(self::decodePart($rawClaims) ?: '', true);
        $signature = self::decodePart($rawSignature);
        if (!is_array($header) || !is_array($identity) || !$signature
            || ($header['alg'] ?? null) !== 'RS256' || !is_string($header['kid'] ?? null)) self::invalidGoogle();
        $nonce = $identity['nonce'] ?? null;
        $subject = $identity['sub'] ?? null;
        $email = $identity['email'] ?? null;
        $now = time();
        if (!is_string($nonce) || !preg_match('/^[a-f0-9]{48}$/D', $nonce)
            || !is_string($subject) || !preg_match('/^[A-Za-z0-9_-]{1,191}$/D', $subject)
            || !is_string($email) || strlen($email) > 191 || !filter_var($email, FILTER_VALIDATE_EMAIL)
            || str_ends_with(strtolower($email), '@signin.invalid')
            || ($identity['email_verified'] ?? null) !== true || ($identity['aud'] ?? null) !== self::googleClientId()
            || !in_array($identity['iss'] ?? null, ['accounts.google.com', 'https://accounts.google.com'], true)
            || !is_int($identity['exp'] ?? null) || $identity['exp'] <= $now
            || !is_int($identity['iat'] ?? null) || $identity['iat'] < $now - 600 || $identity['iat'] > $now + 30) self::invalidGoogle();

        // Check for a live, locally issued nonce before fetching Google's keys.
        $exists = $db->prepare("UPDATE customer_auth_challenges SET attempts = attempts + 1
            WHERE id = ? AND kind = 'google' AND consumedAt IS NULL AND expiresAt > NOW() AND attempts < 5");
        $exists->execute([$nonce]);
        if ($exists->rowCount() !== 1) self::invalidGoogle();
        $keys = self::externalJson(self::GOOGLE_CERTS);
        $key = $keys[$header['kid']] ?? null;
        if (!is_string($key) || openssl_verify($rawHeader . '.' . $rawClaims, $signature, $key, OPENSSL_ALGO_SHA256) !== 1) self::invalidGoogle();

        $consume = $db->prepare("UPDATE customer_auth_challenges SET consumedAt = NOW()
            WHERE id = ? AND kind = 'google' AND consumedAt IS NULL AND expiresAt > NOW()");
        $consume->execute([$nonce]);
        if ($consume->rowCount() !== 1) self::invalidGoogle();
        self::signIn($db, 'googleSubject', $subject, strtolower($email),
            self::name($identity['given_name'] ?? null), self::name($identity['family_name'] ?? null));
    }

    private static function limited(): never {
        Response::error('درخواست‌ها بیش از حد است. کمی بعد دوباره تلاش کنید.', 429, 'AUTH_RATE_LIMIT');
        exit;
    }

    private static function invalidOtp(): never {
        Response::error('کد نادرست یا منقضی شده است. در صورت نیاز کد جدید بگیرید.', 401, 'INVALID_OTP');
        exit;
    }

    public static function sendOtp(): void {
        $phone = preg_replace('/[\s-]/', '', self::digits(self::input()['phone'] ?? null));
        $phone = preg_replace('/^(?:\+98|0098)/', '0', $phone);
        $db = self::database('sms');
        if (!preg_match('/^09\d{9}$/D', $phone)) Response::error('شمارهٔ موبایل معتبر وارد کنید.', 400, 'INVALID_PHONE');
        $ip = self::ipKey();
        $limits = $db->prepare("SELECT COUNT(CASE WHEN subject = ? THEN 1 END) AS phoneCount,
            COUNT(CASE WHEN ipKey = ? THEN 1 END) AS ipCount,
            COUNT(CASE WHEN subject = ? AND createdAt > DATE_SUB(NOW(), INTERVAL 1 MINUTE) THEN 1 END) AS recent
            FROM customer_auth_challenges WHERE kind = 'sms' AND createdAt > DATE_SUB(NOW(), INTERVAL 1 HOUR)
            AND (subject = ? OR ipKey = ?)");
        $limits->execute([$phone, $ip, $phone, $phone, $ip]);
        $row = $limits->fetch();
        if ($row['recent'] > 0 || $row['phoneCount'] >= 5 || $row['ipCount'] >= 20) self::limited();
        $id = bin2hex(random_bytes(24));
        $code = str_pad((string)random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        try {
            $db->prepare("INSERT INTO customer_auth_challenges
                (id, rateKey, kind, subject, proofHash, ipKey, expiresAt, consumedAt)
                VALUES (?, ?, 'sms', ?, ?, ?, DATE_ADD(NOW(), INTERVAL 5 MINUTE), NOW())")->execute([
                    $id, 'sms:' . $phone . ':' . intdiv(time(), 60), $phone, self::proof('sms:' . $id . ':' . $code), $ip,
                ]);
        } catch (PDOException $error) {
            if (($error->errorInfo[1] ?? null) === 1062) self::limited();
            throw $error;
        }
        $result = self::externalJson(self::SMS_ENDPOINT, [
            'username' => getenv('MELIPAYAMAK_USERNAME'), 'password' => getenv('MELIPAYAMAK_PASSWORD'),
            'bodyId' => getenv('MELIPAYAMAK_PATTERN_ID'), 'to' => $phone, 'text' => $code,
        ]);
        if ((string)($result['RetStatus'] ?? '') !== '1' || !preg_match('/^[1-9]\d{6,}$/D', (string)($result['Value'] ?? ''))) {
            Response::error('سرویس پیامک درخواست را نپذیرفت.', 502, 'SMS_NOT_ACCEPTED');
        }
        $db->prepare('UPDATE customer_auth_challenges SET consumedAt = NULL WHERE id = ?')->execute([$id]);
        Response::json(['challengeId' => $id, 'expiresIn' => 300, 'retryAfter' => 60]);
    }

    public static function verifyOtp(): void {
        $input = self::input();
        $db = self::database('sms');
        $id = $input['challengeId'] ?? null;
        $code = self::digits($input['code'] ?? null);
        if (!is_string($id) || !preg_match('/^[a-f0-9]{48}$/D', $id) || !preg_match('/^\d{6}$/D', $code)) self::invalidOtp();
        $attempt = $db->prepare("UPDATE customer_auth_challenges SET attempts = attempts + 1
            WHERE id = ? AND kind = 'sms' AND consumedAt IS NULL AND expiresAt > NOW() AND attempts < 5");
        $attempt->execute([$id]);
        if ($attempt->rowCount() !== 1) self::invalidOtp();
        $get = $db->prepare('SELECT subject, proofHash FROM customer_auth_challenges WHERE id = ?');
        $get->execute([$id]);
        $challenge = $get->fetch();
        if (!$challenge || !hash_equals($challenge['proofHash'], self::proof('sms:' . $id . ':' . $code))) self::invalidOtp();
        $consume = $db->prepare("UPDATE customer_auth_challenges SET consumedAt = NOW()
            WHERE id = ? AND kind = 'sms' AND consumedAt IS NULL AND expiresAt > NOW()");
        $consume->execute([$id]);
        if ($consume->rowCount() !== 1) self::invalidOtp();
        $phone = $challenge['subject'];
        self::signIn($db, 'verifiedPhone', $phone, $phone . '@signin.invalid',
            self::name($input['firstName'] ?? null), self::name($input['lastName'] ?? null));
    }

    private static function signIn(PDO $db, string $column, string $identity, string $email, string $firstName, string $lastName): void {
        // The column is fixed by the server to googleSubject or verifiedPhone.
        $get = $db->prepare("SELECT id, firstName, lastName, email, phone, avatar, status FROM users WHERE {$column} = ?");
        $get->execute([$identity]);
        $user = $get->fetch();
        if (!$user) {
            $isGoogle = $column === 'googleSubject';
            try {
                $db->prepare("INSERT INTO users
                    (id, firstName, lastName, email, phone, passwordHash, isEmailVerified, {$column})
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)")->execute([
                        bin2hex(random_bytes(16)), $firstName ?: 'کاربر', $lastName, $email,
                        $isGoogle ? null : $identity, password_hash(bin2hex(random_bytes(32)), PASSWORD_BCRYPT),
                        (int)$isGoogle, $identity,
                    ]);
            } catch (PDOException $error) {
                if (($error->errorInfo[1] ?? null) !== 1062) throw $error;
            }
            $get->execute([$identity]);
            $user = $get->fetch();
            if (!$user) Response::error('این ایمیل از قبل حساب دارد. با روش قبلی وارد شوید.', 409, 'EMAIL_ALREADY_REGISTERED');
        }
        AuthController::createSession($db, $user);
    }
}
