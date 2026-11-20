<?php
// Configure these variables in the server environment, outside the document root.
$env = static fn(string $name, string $default = ''): string =>
    getenv($name) === false ? $default : getenv($name);

return [
    'app_url' => $env('APP_URL', 'https://signalux.ir'),
    'gsc_verification' => $env('GSC_VERIFICATION_CODE'),
    'cors_origin' => $env('CORS_ORIGIN'),
    'db' => [
        'host' => $env('DB_HOST', 'localhost'),
        'port' => $env('DB_PORT', '3306'),
        'database' => $env('DB_NAME'),
        'username' => $env('DB_USER'),
        'password' => $env('DB_PASS'),
        'charset' => 'utf8mb4',
    ],
    'jwt' => [
        'access_secret' => $env('JWT_ACCESS_SECRET'),
        'refresh_secret' => $env('JWT_REFRESH_SECRET'),
        'access_expiry' => 900,
        'refresh_expiry' => 604800,
    ],
];
