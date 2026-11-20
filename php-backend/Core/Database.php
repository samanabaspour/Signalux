<?php
/**
 * Signalux Database Connection (PDO Singleton)
 */

namespace Signalux\Core;

use PDO;
use PDOException;

class Database {
    private static ?PDO $instance = null;

    public static function getConnection(): ?PDO {
        if (self::$instance === null) {
            $config = require __DIR__ . '/../config.php';
            $db = $config['db'];
            if ($db['database'] === '' || $db['username'] === '') {
                return null;
            }

            $dsn = sprintf(
                "mysql:host=%s;port=%s;dbname=%s;charset=%s",
                $db['host'],
                $db['port'],
                $db['database'],
                $db['charset']
            );

            $options = [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ];

            try {
                self::$instance = new PDO($dsn, $db['username'], $db['password'], $options);
            } catch (PDOException $e) {
                error_log('Signalux database unavailable: ' . $e->getCode());
                return null;
            }
        }

        return self::$instance;
    }

    public static function isConnected(): bool {
        return self::getConnection() !== null;
    }
}
