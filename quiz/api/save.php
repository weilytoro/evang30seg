<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
require __DIR__ . '/db.php';

function respond(int $status, array $body): void
{
    http_response_code($status);
    echo json_encode($body, JSON_UNESCAPED_UNICODE);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(405, ['ok' => false, 'erro' => 'Método não permitido']);
}

$input = json_decode(file_get_contents('php://input') ?: '', true);
if (!is_array($input)) {
    respond(400, ['ok' => false, 'erro' => 'JSON inválido']);
}

$nome = trim((string)($input['nome'] ?? ''));
$data = trim((string)($input['data'] ?? ''));
$perfilChave = trim((string)($input['perfilChave'] ?? ''));
$perfilTitulo = trim((string)($input['perfilTitulo'] ?? ''));
$respostas = $input['respostas'] ?? null;

if ($nome === '' || mb_strlen($nome) > 150) {
    respond(422, ['ok' => false, 'erro' => 'Nome inválido']);
}
if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $data)) {
    respond(422, ['ok' => false, 'erro' => 'Data inválida']);
}
if ($perfilChave === '' || mb_strlen($perfilChave) > 50 || $perfilTitulo === '' || mb_strlen($perfilTitulo) > 150) {
    respond(422, ['ok' => false, 'erro' => 'Perfil inválido']);
}
if (!is_array($respostas) || count($respostas) === 0) {
    respond(422, ['ok' => false, 'erro' => 'Respostas inválidas']);
}

try {
    $pdo = quiz_db();
    $stmt = $pdo->prepare(
        'INSERT INTO quiz_respostas (nome, data_referencia, perfil_chave, perfil_titulo, respostas_json)
         VALUES (:nome, :data, :perfil_chave, :perfil_titulo, :respostas_json)'
    );
    $stmt->execute([
        'nome' => $nome,
        'data' => $data,
        'perfil_chave' => $perfilChave,
        'perfil_titulo' => $perfilTitulo,
        'respostas_json' => json_encode($respostas, JSON_UNESCAPED_UNICODE),
    ]);
    respond(200, ['ok' => true]);
} catch (Throwable $e) {
    respond(500, ['ok' => false, 'erro' => 'Erro ao salvar no servidor']);
}
