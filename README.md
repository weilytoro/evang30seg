# Dinheiro chama dinheiro?

Site institucional com blog, loja, vídeos/podcasts, eventos e captação de leads (mentoria e newsletter), com um backend real por trás do protótipo estático.

## Estrutura

```
frontend/   HTML/CSS/JS estático (a interface do site)
backend/    API REST em Node.js + Express + SQLite
```

O backend serve o conteúdo de `frontend/` diretamente, então em desenvolvimento normal basta rodar o backend.

## Como rodar

```bash
cd backend
npm install
cp .env.example .env   # ajuste JWT_SECRET, ADMIN_EMAILS e (opcional) SMTP
npm start
```

Acesse `http://localhost:3000`.

## Autenticação

- Qualquer visitante pode criar conta (nome, e-mail, senha) pelo modal de login (link "Criar conta").
- **Administrador é definido por e-mail**, não por código: quem se cadastrar (ou logar) com um e-mail listado em `ADMIN_EMAILS` vira administrador automaticamente. Por padrão isso inclui `weily@unemat.br`; para adicionar outros administradores, liste os e-mails separados por vírgula nessa variável.
- Apenas administradores podem: publicar posts, adicionar produtos na loja, adicionar vídeos/podcasts, adicionar eventos, e editar os textos de "Sobre nós" e "Contato".
- Qualquer visitante pode enviar contato de mentoria e se cadastrar na newsletter, sem login.
- Sessão é feita via JWT (7 dias), guardado no `localStorage` do navegador; a verificação de permissão é sempre refeita no servidor (o frontend só esconde botões, não é a fonte de verdade).
- **Bloqueio de conta**: após 10 tentativas de login com senha incorreta para o mesmo e-mail, a conta fica bloqueada por 24 horas (mesmo com a senha certa). Um pedido de redefinição de senha bem-sucedido também limpa esse bloqueio.
- **Redefinição de senha**: o link "Esqueci minha senha" gera um token de uso único válido por 1 hora. Se `SMTP_HOST`/`SMTP_USER`/`SMTP_PASS` estiverem configurados, o link é enviado por e-mail; caso contrário, ele só é registrado no log do servidor (`console.warn`) — útil para desenvolvimento, mas configure o SMTP antes de abrir isso para usuários reais.

## API

Todas as rotas ficam sob `/api`. Corpo e respostas em JSON.

| Método | Rota | Acesso | Descrição |
|---|---|---|---|
| POST | `/api/auth/register` | público | Cria conta (`name`, `email`, `password`) — vira admin automaticamente se o e-mail estiver em `ADMIN_EMAILS` |
| POST | `/api/auth/login` | público | Login (`email`, `password`) — bloqueia a conta por 24h após 10 tentativas erradas |
| GET | `/api/auth/me` | autenticado | Dados do usuário logado |
| POST | `/api/auth/forgot-password` | público | Envia (ou loga) o link de redefinição de senha (`email`) |
| POST | `/api/auth/reset-password` | público | Define nova senha a partir do token do link (`token`, `password`) |
| GET | `/api/posts` | público | Lista publicações |
| POST | `/api/posts` | admin | Cria publicação |
| GET | `/api/products` | público | Lista produtos da loja |
| POST | `/api/products` | admin | Cria produto |
| GET | `/api/media` | público | Lista vídeos/podcasts |
| POST | `/api/media` | admin | Cria item de mídia |
| GET | `/api/events` | público | Lista eventos |
| POST | `/api/events` | admin | Cria evento |
| GET | `/api/site` | público | Texto "Sobre nós" + contato |
| PUT | `/api/site/about` | admin | Atualiza texto "Sobre nós" |
| PUT | `/api/site/contact` | admin | Atualiza Instagram/e-mail/telefone |
| POST | `/api/leads/mentorship` | público | Envia contato de mentoria |
| POST | `/api/leads/newsletter` | público | Cadastra e-mail na newsletter |
| GET | `/api/leads/mentorship` | admin | Lista contatos de mentoria recebidos |
| GET | `/api/leads/newsletter` | admin | Lista inscritos na newsletter |

Rotas protegidas exigem o header `Authorization: Bearer <token>`.

## Dados

SQLite via `better-sqlite3`, arquivo criado automaticamente em `backend/data/app.db` (ignorado pelo git). Sem serviço externo de banco de dados a configurar.

## Variáveis de ambiente (`backend/.env`)

- `PORT` — porta do servidor (padrão `3000`)
- `JWT_SECRET` — segredo para assinar os tokens (defina um valor forte em produção)
- `ADMIN_EMAILS` — e-mails que viram administrador automaticamente, separados por vírgula (padrão: `weily@unemat.br`)
- `CORS_ORIGIN` — origem(ns) permitida(s) por CORS, separadas por vírgula. Deixe em branco (padrão) se o frontend for servido pelo próprio backend — nesse caso, CORS cross-origin fica **desabilitado** por padrão, que é o modo mais seguro para este projeto.
- `FORCE_HTTPS` — `true` para redirecionar automaticamente requisições HTTP para HTTPS (útil atrás de um proxy/load balancer que termina o TLS). O app já envia `trust proxy` e cabeçalhos de segurança (via `helmet`, incluindo HSTS) independente dessa opção.
- `PUBLIC_URL` — URL pública do site, usada para montar o link enviado no e-mail de redefinição de senha (ex.: `https://seusite.com`)
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` — credenciais de SMTP para envio real do e-mail de redefinição de senha. Sem elas, o link só é registrado no log do servidor.

## Segurança

- Senhas com hash (`bcrypt`), tokens JWT assinados, e toda autorização checada no servidor (nunca só no frontend).
- Cabeçalhos de segurança via `helmet` (incluindo HSTS) e CORS desabilitado por padrão para origens externas.
- Bloqueio de conta por 10 tentativas de login incorretas (24h).
- **Pendências conhecidas, fora do escopo atual**: não há rate limiting por IP (só por conta), nem verificação de e-mail no cadastro. Avalie adicionar antes de abrir o site para tráfego não controlado.
