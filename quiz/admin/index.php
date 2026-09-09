<?php
declare(strict_types=1);

session_start();
require __DIR__ . '/../api/db.php';

if (empty($_SESSION['quiz_admin'])) {
    header('Location: login.php');
    exit;
}

$pdo = quiz_db();
$rows = $pdo->query('SELECT * FROM quiz_respostas ORDER BY criado_em DESC')->fetchAll();

function e(string $v): string
{
    return htmlspecialchars($v, ENT_QUOTES, 'UTF-8');
}
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Admin · Quiz</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Inter:wght@400;500;600&display=swap');
:root { --bg:#0c0b08; --s1:#141310; --s2:#1c1a16; --bd:rgba(212,180,120,0.12); --gold:#d4b478; --gold3:#a07840; --cream:#f5efe0; --muted:#7a7060; }
* { box-sizing: border-box; margin:0; padding:0; }
body { background: var(--bg); color: var(--cream); font-family:'Inter',sans-serif; padding: 32px 20px 60px; }
.wrap { max-width: 1000px; margin: 0 auto; }
.top { display:flex; align-items:center; justify-content:space-between; margin-bottom:24px; flex-wrap:wrap; gap:10px; }
h1 { font-family:'Playfair Display',serif; font-size:26px; }
.count { font-size:12px; color:var(--muted); }
a.logout { color:var(--muted); font-size:12px; text-decoration:none; border:1px solid var(--bd); padding:8px 14px; border-radius:999px; }
a.logout:hover { color:var(--cream); }
table { width:100%; border-collapse: collapse; background: var(--s1); border:1px solid var(--bd); border-radius:12px; overflow:hidden; }
th, td { text-align:left; padding:10px 14px; font-size:13px; border-bottom:1px solid var(--bd); vertical-align: top; }
th { background: var(--s2); font-size:10px; text-transform:uppercase; letter-spacing:0.06em; color:var(--muted); font-weight:600; }
tr:last-child td { border-bottom:none; }
.perfil { color: var(--gold); font-weight:600; }
details summary { cursor:pointer; color:var(--muted); font-size:12px; }
.resp-list { margin-top:8px; font-size:12px; color: var(--cream); opacity:0.85; line-height:1.6; }
.empty { color: var(--muted); padding: 30px; text-align:center; }
.scroll { overflow-x:auto; }
</style>
</head>
<body>
<div class="wrap">
  <div class="top">
    <div>
      <h1>Respostas do Quiz</h1>
      <div class="count"><?= count($rows) ?> respostas</div>
    </div>
    <a class="logout" href="logout.php">Sair</a>
  </div>

  <?php if (!$rows): ?>
    <div class="empty">Nenhuma resposta registrada ainda.</div>
  <?php else: ?>
  <div class="scroll">
  <table>
    <thead>
      <tr>
        <th>Nome</th>
        <th>Data</th>
        <th>Perfil</th>
        <th>Respostas</th>
        <th>Enviado em</th>
      </tr>
    </thead>
    <tbody>
      <?php foreach ($rows as $r): ?>
      <tr>
        <td><?= e($r['nome']) ?></td>
        <td><?= e($r['data_referencia']) ?></td>
        <td class="perfil"><?= e($r['perfil_titulo']) ?></td>
        <td>
          <details>
            <summary>ver respostas</summary>
            <div class="resp-list">
              <?php
              $respostas = json_decode($r['respostas_json'], true);
              if (is_array($respostas)) {
                  foreach ($respostas as $item) {
                      $pergunta = e((string)($item['pergunta'] ?? ''));
                      $resposta = e((string)($item['resposta'] ?? ''));
                      echo "<div><b>{$pergunta}</b><br>{$resposta}</div><br>";
                  }
              }
              ?>
            </div>
          </details>
        </td>
        <td><?= e($r['criado_em']) ?></td>
      </tr>
      <?php endforeach; ?>
    </tbody>
  </table>
  </div>
  <?php endif; ?>
</div>
</body>
</html>
