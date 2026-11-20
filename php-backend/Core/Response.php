<?php
/**
 * Standard JSON API Response & CORS Handling
 */

namespace Signalux\Core;

class Response {
    public static function setHeaders(): void {
        header("Content-Type: application/json; charset=UTF-8");
        $origin = (require __DIR__ . '/../config.php')['cors_origin'];
        if ($origin !== '' && $origin === ($_SERVER['HTTP_ORIGIN'] ?? null)) {
            header('Access-Control-Allow-Origin: ' . $origin);
            header('Vary: Origin');
        }
        header("Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, X-Request-Id");
        header("X-Content-Type-Options: nosniff");
        header("X-Frame-Options: SAMEORIGIN");

        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(200);
            exit();
        }
    }

    public static function json($data, int $statusCode = 200): void {
        self::setHeaders();
        http_response_code($statusCode);
        echo json_encode([
            'success' => true,
            'data'    => $data
        ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit();
    }

    public static function error(string $message, int $statusCode = 400, string $code = 'BAD_REQUEST', $details = null): void {
        self::setHeaders();
        http_response_code($statusCode);
        $response = [
            'success' => false,
            'error'   => [
                'code'    => $code,
                'message' => $message
            ]
        ];

        if ($details !== null) {
            $response['error']['details'] = $details;
        }

        echo json_encode($response, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit();
    }

    public static function getJsonInput(): array {
        $input = file_get_contents('php://input');
        if (empty($input)) {
            return $_POST ?: [];
        }
        $decoded = json_decode($input, true);
        return is_array($decoded) ? $decoded : [];
    }
}
