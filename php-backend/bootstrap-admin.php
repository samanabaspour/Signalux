<?php

if (PHP_SAPI !== 'cli') {
    http_response_code(404);
    exit;
}

require_once __DIR__ . '/Core/Database.php';

$email = strtolower(trim(getenv('INITIAL_ADMIN_EMAIL') ?: ''));
$password = getenv('INITIAL_ADMIN_PASSWORD') ?: '';
if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($password) < 16 || strlen($password) > 72) {
    fwrite(STDERR, "Set INITIAL_ADMIN_EMAIL and a new password of 16 to 72 bytes.\n");
    exit(1);
}

$db = \Signalux\Core\Database::getConnection();
if (!$db) {
    fwrite(STDERR, "Database is unavailable.\n");
    exit(1);
}

try {
    $db->beginTransaction();
    $role = $db->query("SELECT id FROM roles WHERE name = 'SUPER_ADMIN' FOR UPDATE")->fetchColumn();
    if (!$role) throw new RuntimeException('Import the database schema and roles first.');
    $exists = $db->prepare('SELECT id FROM users WHERE email = ?');
    $exists->execute([$email]);
    if ($exists->fetchColumn()) throw new RuntimeException('The account already exists. Use the authorized password reset process.');
    $id = bin2hex(random_bytes(16));
    $db->prepare("INSERT INTO users (id, firstName, lastName, email, passwordHash, status, isEmailVerified)
        VALUES (?, ?, ?, ?, ?, 'ACTIVE', 1)")->execute([
        $id, 'مدیر', 'ارشد', $email, password_hash($password, PASSWORD_BCRYPT),
    ]);
    $db->prepare('INSERT INTO user_roles (userId, roleId) VALUES (?, ?)')->execute([$id, $role]);
    $db->commit();
    echo "Administrator created.\n";
} catch (Throwable $error) {
    if ($db->inTransaction()) $db->rollBack();
    fwrite(STDERR, $error instanceof PDOException ? "Database write failed.\n" : $error->getMessage() . "\n");
    exit(1);
}
