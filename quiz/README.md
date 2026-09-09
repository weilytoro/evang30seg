# Quiz — Mentalidade Financeira

Quiz (nome + data + 8 perguntas de múltipla escolha) que diagnostica o nível
de mentalidade financeira de quem responde e grava a resposta num banco
MySQL. As perguntas e os 5 resultados (Bloqueada, Estagnada, Em Transição,
Em Construção, Evoluída) são baseados no capítulo 1 do livro *Dinheiro Chama
Dinheiro? Só se você mudar sua mentalidade* (Weily Toro Machado).

## Estrutura

```
quiz/
  index.html          → o quiz (frontend, sem build step)
  api/
    schema.sql         → cria a tabela quiz_respostas
    config.sample.php  → copie para config.php e preencha
    db.php             → conexão PDO
    save.php           → endpoint POST que grava a resposta
  admin/
    login.php          → tela de login do painel
    index.php          → lista as respostas (protegido por sessão)
    logout.php
```

## Editar perguntas ou resultados

O array `QUESTIONS` e o objeto `PERFIS` estão no topo do `<script>` de
`quiz/index.html`. Cada opção de resposta tem um `trait` (`nivel1` a
`nivel5`); ao final, o nível com mais ocorrências entre as respostas é o
exibido. Se o texto do capítulo 1 do livro definir os níveis de forma
diferente da skill `metodo-gerar-mentalidade` usada como base, ajuste as
perguntas e as descrições em `PERFIS` para bater com o texto original.

## Deploy na hospedagem PHP + MySQL

1. Suba a pasta `quiz/` inteira para o servidor (mesmo domínio do restante
   do site, ex: `testes.professorweily.com.br/quiz/`).
2. Crie um banco MySQL (ou reaproveite um existente) e rode `api/schema.sql`
   nele (via phpMyAdmin ou linha de comando).
3. Copie `api/config.sample.php` para `api/config.php` e preencha:
   - `db_host`, `db_name`, `db_user`, `db_pass` com os dados do banco.
   - `admin_password_hash` com o hash da senha do painel, gerado rodando
     localmente: `php -r "echo password_hash('sua_senha_aqui', PASSWORD_DEFAULT), PHP_EOL;"`
4. **Não** commite `api/config.php` no git — ele já está no `.gitignore` e
   contém credenciais reais.
5. Acesse `quiz/index.html` para testar o quiz e `quiz/admin/login.php`
   para acessar o painel de respostas.

## Segurança

- `save.php` usa PDO com prepared statements (sem risco de SQL injection) e
  valida nome, data e formato das respostas antes de gravar.
- O painel admin fica atrás de sessão PHP; a senha é comparada via
  `password_verify` contra um hash, nunca em texto puro.
- Toda saída do painel (nome, respostas, perfil) passa por
  `htmlspecialchars` antes de ser exibida, para evitar XSS armazenado.
