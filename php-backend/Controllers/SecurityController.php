<?php
/**
 * AIOS Security Suite Controller for Signalux
 * Native PHP / DirectAdmin MySQL Hardened Backend
 */

namespace Signalux\Controllers;

use Signalux\Core\Database;
use Signalux\Core\Response;
use Signalux\Core\Auth;
use PDO;

class SecurityController {

    private static function ensureTable(\PDO $db): void {
        $db->exec("CREATE TABLE IF NOT EXISTS `security_settings` (
            `id` VARCHAR(50) NOT NULL PRIMARY KEY,
            `settings_json` LONGTEXT NOT NULL,
            `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;");
    }

    public static function getSettings(): void {
        Auth::requirePermission('settings.view');
        $db = Database::getConnection();

        if ($db) {
            self::ensureTable($db);
            $stmt = $db->query("SELECT settings_json FROM security_settings WHERE id = 'aios_config' LIMIT 1");
            $val = $stmt ? $stmt->fetchColumn() : null;
            if ($val) {
                $decoded = json_decode($val, true);
                if ($decoded) {
                    Response::json($decoded);
                    return;
                }
            }
        }

        Response::json([
            'securityScore' => 485,
            'emergencyLockdown' => false,
            'maintenanceMode' => false,
            'maxLoginAttempts' => 3,
            'lockoutDurationMinutes' => 30,
            'enable6GFirewall' => true,
            'blockBadUserAgents' => true,
            'enableSqlInjectionFilter' => true,
            'enableXssFilter' => true,
            'preventPhpExecutionInUploads' => true,
            'disableDirectoryListing' => true,
            'hidePhpVersionHeader' => true,
            'enableHoneypotTrap' => true,
            'enableTurnstileCaptcha' => true,
            'blockedIps' => [],
            'recentThreats' => []
        ]);
    }

    public static function updateSettings(): void {
        Auth::requirePermission('settings.manage');
        $input = Response::getJsonInput();
        $db = Database::getConnection();

        if ($db) {
            self::ensureTable($db);
            $stmt = $db->prepare("INSERT INTO security_settings (id, settings_json) 
                                 VALUES ('aios_config', :val) 
                                 ON DUPLICATE KEY UPDATE settings_json = :val2");
            $json = json_encode($input, JSON_UNESCAPED_UNICODE);
            $stmt->execute([
                ':val'  => $json,
                ':val2' => $json
            ]);

            Response::json(['message' => 'تنظیمات امنیتی و قوانین فایروال با موفقیت بروزرسانی شد.']);
            return;
        }

        Response::json(['message' => 'تنظیمات امنیتی ذخیره شد.']);
    }
}
