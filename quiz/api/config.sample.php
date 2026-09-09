<?php
// Copie este arquivo para "config.php" (mesma pasta) e preencha com os dados
// reais da hospedagem. O config.php NÃO deve ser commitado no git.
return [
    'db_host' => 'localhost',
    'db_name' => 'nome_do_banco',
    'db_user' => 'usuario_mysql',
    'db_pass' => 'senha_mysql',

    // Gere o hash da senha do painel admin rodando no terminal:
    //   php -r "echo password_hash('sua_senha_aqui', PASSWORD_DEFAULT), PHP_EOL;"
    // e cole o resultado abaixo.
    'admin_password_hash' => '',
];
