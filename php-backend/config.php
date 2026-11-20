<?php
/**
 * Signalux Production Backend - DirectAdmin Configuration
 * Database: soheils4_signalux
 */

// Environment settings
define('APP_ENV', 'production');
define('APP_DEBUG', false);

// Database Connection Settings (DirectAdmin MySQL)
define('DB_HOST', 'localhost');
define('DB_PORT', '3306');
define('DB_NAME', 'soheils4_signalux');
define('DB_USER', 'soheils4_signalux');
define('DB_PASS', 'bCe26jbu9qXAtmDGZ4dN');
define('DB_CHARSET', 'utf8mb4');

// JWT Security Secrets
define('JWT_ACCESS_SECRET', 'signalux_jwt_access_secret_production_2026_super_key');
define('JWT_REFRESH_SECRET', 'signalux_jwt_refresh_secret_production_2026_super_key');
define('JWT_ACCESS_EXPIRY', 900); // 15 Minutes in seconds
define('JWT_REFRESH_EXPIRY', 604800); // 7 Days in seconds

// Initial Admin fallback credentials
define('INITIAL_ADMIN_EMAIL', 'admin@signalux.ir');
define('INITIAL_ADMIN_PASSWORD', 'SignaluxSuperAdmin2026!');

// CORS & Allowed Origins
define('ALLOWED_ORIGINS', '*'); // Or set to 'https://yourdomain.com'

// Error Reporting
if (APP_DEBUG) {
    error_reporting(E_ALL);
    ini_set('display_errors', '1');
} else {
    error_reporting(0);
    ini_set('display_errors', '0');
}

// Timezone
date_default_timezone_set('Asia/Tehran');
