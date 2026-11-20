<?php
/**
 * Signalux Production Backend - Pure PHP JWT Implementation
 * Standard RFC 7519 HMAC-SHA256 Token Engine
 */

require_once __DIR__ . '/config.php';

class JWT {
    private static function base64UrlEncode(string $data): string {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }

    private static function base64UrlDecode(string $data): string {
        return base64_decode(strtr($data, '-_', '+/'));
    }

    /**
     * Generate JWT Token
     */
    public static function sign(array $payload, string $secret, int $expirySeconds): string {
        $header = [
            'typ' => 'JWT',
            'alg' => 'HS256'
        ];

        $now = time();
        $payload['iat'] = $now;
        $payload['exp'] = $now + $expirySeconds;

        $encodedHeader = self::base64UrlEncode(json_encode($header, JSON_UNESCAPED_UNICODE));
        $encodedPayload = self::base64UrlEncode(json_encode($payload, JSON_UNESCAPED_UNICODE));

        $signature = hash_hmac('sha256', "$encodedHeader.$encodedPayload", $secret, true);
        $encodedSignature = self::base64UrlEncode($signature);

        return "$encodedHeader.$encodedPayload.$encodedSignature";
    }

    /**
     * Verify and Decode JWT Token
     */
    public static function verify(string $token, string $secret): ?array {
        $parts = explode('.', $token);
        if (count($parts) !== 3) {
            return null;
        }

        [$encodedHeader, $encodedPayload, $encodedSignature] = $parts;

        $expectedSignature = hash_hmac('sha256', "$encodedHeader.$encodedPayload", $secret, true);
        $expectedEncodedSignature = self::base64UrlEncode($expectedSignature);

        if (!hash_equals($expectedEncodedSignature, $encodedSignature)) {
            return null; // Invalid signature
        }

        $payload = json_decode(self::base64UrlDecode($encodedPayload), true);
        if (!$payload || !isset($payload['exp'])) {
            return null;
        }

        if ($payload['exp'] < time()) {
            return null; // Token expired
        }

        return $payload;
    }
}
