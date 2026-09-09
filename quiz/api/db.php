<?php
declare(strict_types=1);

function quiz_config(): array
{
    static $config = null;
    if ($config === null) {
        $path = __DIR__ . '/config.php';
        if (!is_file($path)) {
            throw new RuntimeException('config.php não encontrado. Copie config.sample.php para config.php e preencha os dados.');
        }
        $config = require $path;
    }
    return $config;
}

function quiz_db(): PDO
{
    static $pdo = null;
    if ($pdo === null) {
        $config = quiz_config();
        $dsn = sprintf('mysql:host=%s;dbname=%s;charset=utf8mb4', $config['db_host'], $config['db_name']);
        $pdo = new PDO($dsn, $config['db_user'], $config['db_pass'], [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]);
    }
    return $pdo;
}
