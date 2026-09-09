<?php
declare(strict_types=1);

session_start();
require __DIR__ . '/../api/db.php';

if (!empty($_SESSION['quiz_admin'])) {
    header('Location: index.php');
    exit;
}

$erro = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $senha = (string)($_POST['senha'] ?? '');
    $config = quiz_config();
    $hash = $config['admin_password_hash'] ?? '';
    if ($hash !== '' && password_verify($senha, $hash)) {
        session_regenerate_id(true);
        $_SESSION['quiz_admin'] = true;
        header('Location: index.php');
        exit;
    }
    $erro = 'Senha incorreta.';
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
:root { --bg:#0c0b08; --s1:#141310; --s2:#1c1a16; --bd:rgba(212,180,120,0.1); --gold:#d4b478; --gold3:#a07840; --cream:#f5efe0; --muted:#7a7060; --err:#e06060; }
* { box-sizing: border-box; margin:0; padding:0; }
body { background: var(--bg); color: var(--cream); font-family:'Inter',sans-serif; min-height:100vh; display:flex; align-items:center; justify-content:center; }
.box { width:100%; max-width:340px; padding:24px; }
h1 { font-family:'Playfair Display',serif; font-size:22px; margin-bottom:20px; text-align:center; }
label { display:block; font-size:10px; font-weight:600; letter-spacing:0.08em; text-transform:uppercase; color:var(--muted); margin-bottom:6px; }
input { width:100%; background:var(--s2); border:1px solid var(--bd); border-radius:8px; color:var(--cream); font-size:14px; padding:11px 12px; outline:none; margin-bottom:14px; }
button { width:100%; padding:12px; border:none; border-radius:999px; background:linear-gradient(135deg,var(--gold3),var(--gold)); color:#0c0b08; font-family:'Playfair Display',serif; font-weight:700; font-size:14px; cursor:pointer; }
.err { font-size:12px; color:var(--err); margin-bottom:12px; }
</style>
</head>
<body>
<div class="box">
  <h1>Painel do Quiz</h1>
  <?php if ($erro): ?><div class="err"><?= htmlspecialchars($erro, ENT_QUOTES, 'UTF-8') ?></div><?php endif; ?>
  <form method="post">
    <label>Senha</label>
    <input type="password" name="senha" autofocus required>
    <button type="submit">Entrar</button>
  </form>
</div>
</body>
</html>
