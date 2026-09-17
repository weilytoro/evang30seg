# Especificação — Dinheiro chama dinheiro?

Este documento descreve o comportamento real do sistema, extraído do código-fonte em `backend/` e `frontend/`. É uma spec **retroativa**: registra o que existe hoje, não o que se planeja construir.

A partir de agora, qualquer mudança de comportamento (nova rota, novo campo, nova regra de validação, nova tela) deve **atualizar este documento no mesmo commit/PR** que altera o código. Se o código e a spec discordarem, o código manda até a spec ser corrigida — mas a divergência é um bug de processo, não algo a se conviver.

## 1. Visão geral

Site institucional/educacional de finanças pessoais ("Dinheiro chama dinheiro?"), com:

- Blog de publicações (posts com resumo + conteúdo completo).
- Loja vitrine (produtos exibidos, sem checkout/pagamento).
- Galeria de vídeos/podcasts (links externos).
- Agenda de eventos.
- Página "Sobre nós" e cartão de contato, editáveis pelo admin.
- Captação de leads: formulário de mentoria e newsletter.
- Autenticação de usuários, com um único papel administrativo concedido por e-mail.

Todo conteúdo dinâmico é público para leitura (`GET`); toda escrita de conteúdo (`POST`/`PUT`) exige o papel `admin`, verificado no servidor — nunca apenas escondendo botões no frontend.

## 2. Arquitetura e stack

- **Backend**: Node.js + Express, servido junto com os arquivos estáticos do frontend (mesma origem, mesma porta).
- **Banco**: SQLite via `better-sqlite3`, arquivo único em `backend/data/app.db`, modo WAL.
- **Autenticação**: JWT (`jsonwebtoken`), assinado com `JWT_SECRET`, validade de 7 dias, guardado no `localStorage` do navegador (chave `dcd_token`) — não em cookie.
- **Senhas**: hash com `bcryptjs` (custo 10).
- **E-mail**: `nodemailer`, opcional — sem SMTP configurado, os links de verificação/redefinição são apenas registrados no log do servidor.
- **Segurança de borda**: `helmet` (cabeçalhos, CSP padrão), `express-rate-limit` por IP, `cors` (desabilitado por padrão para origens externas).
- **Frontend**: HTML + CSS + JavaScript vanilla, sem framework nem build step. Todo JS vive em `frontend/app.js` (extraído do HTML porque o CSP do helmet bloqueia script inline).

Estrutura de pastas:

```
backend/
  src/
    db.js                 # schema + migrações leves (ensureColumn)
    server.js              # bootstrap do Express, montagem das rotas
    mailer.js               # envio de e-mail transacional (opcional)
    middleware/
      auth.js                # JWT: signToken, requireAuth, requireAdmin
      rateLimit.js            # limitadores por IP
    routes/
      auth.js, posts.js, products.js, media.js, events.js, site.js, leads.js
frontend/
  index.html               # página única (SPA-like, sem router)
  app.js                    # toda a lógica de cliente
  termos.html, privacidade.html   # páginas legais estáticas, sem JS de app
  favicon*, icon-*.png, site.webmanifest
```

## 3. Modelo de dados

SQLite, schema criado em `backend/src/db.js` via `CREATE TABLE IF NOT EXISTS`, com colunas adicionadas depois via `ensureColumn()` (uma migração idempotente e sem downtime: verifica `PRAGMA table_info` e só roda `ALTER TABLE ADD COLUMN` se a coluna não existir). Não há sistema de migrações versionado — toda evolução de schema passa por `ensureColumn` no topo de `db.js`.

### `users`

| Coluna | Tipo | Notas |
|---|---|---|
| `id` | INTEGER PK AUTOINCREMENT | |
| `name` | TEXT NOT NULL | |
| `email` | TEXT NOT NULL UNIQUE | normalizado para lowercase antes de gravar |
| `password_hash` | TEXT NOT NULL | bcrypt |
| `role` | TEXT NOT NULL DEFAULT `'user'` | CHECK IN (`user`, `admin`) |
| `failed_login_attempts` | INTEGER NOT NULL DEFAULT 0 | zera a cada login bem-sucedido ou reset de senha |
| `locked_until` | TEXT (ISO datetime) | NULL = não bloqueado |
| `reset_token_hash` | TEXT | SHA-256 do token de "esqueci minha senha"; nunca o token puro |
| `reset_token_expires` | TEXT (ISO datetime) | |
| `email_verified` | INTEGER NOT NULL DEFAULT 0 | 0/1 |
| `verify_token_hash` | TEXT | SHA-256 do token de verificação de e-mail |
| `verify_token_expires` | TEXT (ISO datetime) | |
| `created_at` | TEXT NOT NULL DEFAULT `datetime('now')` | |

### `posts`

| Coluna | Tipo | Notas |
|---|---|---|
| `id` | INTEGER PK AUTOINCREMENT | |
| `title` | TEXT NOT NULL | |
| `category` | TEXT NOT NULL | valor livre; frontend oferece um `<select>` fixo (ver §8), backend não valida contra lista |
| `excerpt` | TEXT NOT NULL | resumo curto, exibido na listagem |
| `content` | TEXT | texto completo; exibido no modal de leitura. **Nullable** — posts criados antes desta coluna existir (migração `ensureColumn`) não têm conteúdo; o frontend cai para `excerpt` nesse caso |
| `author_id` | INTEGER REFERENCES `users(id)` | |
| `created_at` | TEXT NOT NULL DEFAULT `datetime('now')` | |

### `products`

| Coluna | Tipo | Notas |
|---|---|---|
| `id` | INTEGER PK AUTOINCREMENT | |
| `name` | TEXT NOT NULL | |
| `price` | TEXT NOT NULL | **texto livre**, não numérico (ex.: "R$ 49,90", "Grátis") — não há checkout, é só exibição |
| `description` | TEXT NOT NULL | |
| `created_by` | INTEGER REFERENCES `users(id)` | |
| `created_at` | TEXT NOT NULL DEFAULT `datetime('now')` | |

### `media_items`

| Coluna | Tipo | Notas |
|---|---|---|
| `id` | INTEGER PK AUTOINCREMENT | |
| `title` | TEXT NOT NULL | |
| `type` | TEXT NOT NULL | CHECK IN (`Vídeo`, `Podcast`) |
| `link` | TEXT NOT NULL | URL externa, normalizada via `new URL()` no backend |
| `description` | TEXT NOT NULL | |
| `created_by` | INTEGER REFERENCES `users(id)` | |
| `created_at` | TEXT NOT NULL DEFAULT `datetime('now')` | |

### `events`

| Coluna | Tipo | Notas |
|---|---|---|
| `id` | INTEGER PK AUTOINCREMENT | |
| `title` | TEXT NOT NULL | |
| `event_date` | TEXT NOT NULL | **texto livre**, não é um tipo DATE — o formulário admin envia string como o usuário digitou, sem parsing/validação de formato |
| `location` | TEXT NOT NULL | |
| `description` | TEXT NOT NULL | |
| `created_by` | INTEGER REFERENCES `users(id)` | |
| `created_at` | TEXT NOT NULL DEFAULT `datetime('now')` | |

### `site_settings`

Tabela singleton: sempre exatamente uma linha, `id = 1` (CHECK constraint garante isso). Criada com todos os campos de conteúdo em NULL; populada progressivamente pelo admin via o painel.

| Coluna | Tipo | Notas |
|---|---|---|
| `id` | INTEGER PK CHECK (`id = 1`) | |
| `about_text` | TEXT | NULL até o admin preencher; frontend mostra "Nossa história em breve." como placeholder |
| `contact_instagram` | TEXT | sem o `@`; frontend monta o link |
| `contact_email` | TEXT | |
| `contact_phone` | TEXT | qualquer formato digitado; frontend extrai só os dígitos para montar `tel:` |
| `logo_image` | TEXT | data URL base64 (`data:image/...;base64,...`) |
| `about_image` | TEXT | idem |
| `hero_eyebrow` | TEXT | NULL cai no default hardcoded no backend (ver §5.6) |
| `hero_title_prefix` | TEXT | idem |
| `hero_title_highlight` | TEXT | idem |
| `hero_subtitle` | TEXT | idem |
| `footer_tagline` | TEXT | idem |

### `mentorship_leads`

| Coluna | Tipo | Notas |
|---|---|---|
| `id` | INTEGER PK AUTOINCREMENT | |
| `name` | TEXT NOT NULL | |
| `contact` | TEXT NOT NULL | e-mail OU telefone, texto livre — sem validação de formato |
| `message` | TEXT | opcional |
| `created_at` | TEXT NOT NULL DEFAULT `datetime('now')` | |

### `newsletter_subscribers`

| Coluna | Tipo | Notas |
|---|---|---|
| `id` | INTEGER PK AUTOINCREMENT | |
| `email` | TEXT NOT NULL UNIQUE | inscrição duplicada é silenciosamente ignorada (`INSERT OR IGNORE`) |
| `created_at` | TEXT NOT NULL DEFAULT `datetime('now')` | |

## 4. Autenticação e controle de acesso

### 4.1 Papéis

Só existem dois papéis: `user` e `admin`. Não há papéis intermediários (editor, moderador etc.).

### 4.2 Como alguém se torna admin

- `ADMIN_EMAILS` (env var, lista separada por vírgula; padrão `weily@unemat.br`) define quais e-mails **podem** ser admin.
- Ter um e-mail da lista **não** basta: o papel só é promovido a `admin` depois que o e-mail é confirmado (`email_verified = 1`).
- A promoção acontece em três pontos do código (não é um evento único):
  - No login (`POST /auth/login`), se o e-mail já está verificado.
  - No `GET /auth/me` (restauração de sessão), como rede de segurança caso o login tenha acontecido antes da verificação.
  - No `POST /auth/verify-email`, no momento em que a verificação é concluída.
- Isso existe deliberadamente para impedir que alguém vire admin só digitando o e-mail de outra pessoa no cadastro, sem provar acesso à caixa de entrada.
- Não há downgrade automático: se um e-mail for removido de `ADMIN_EMAILS` depois que o usuário já é `admin` no banco, ele continua admin (a promoção é um "upgrade" one-way no código atual).

### 4.3 Verificação de e-mail

- Token: 32 bytes aleatórios (`crypto.randomBytes`), enviado por e-mail; o banco guarda só o hash SHA-256 (`verify_token_hash`) e a expiração (24h).
- Sem SMTP configurado, o link aparece apenas no log do servidor (`sendVerificationEmail` faz early-return depois do `console.warn`).
- Link consumido via `POST /auth/verify-email`, chamado automaticamente pelo frontend quando a URL carrega com `?verify=<token>` (ver §8.2).
- `POST /auth/resend-verification` (autenticado) reenvia o e-mail; se a conta já estiver verificada, responde `{ ok: true, alreadyVerified: true }` sem reenviar nada.

### 4.4 Bloqueio de conta por tentativas de login

- 10 tentativas de senha incorreta (`LOCKOUT_THRESHOLD`) bloqueiam a conta por 24h (`LOCKOUT_DURATION_MS`), **por e-mail** — contagem fica na própria linha do usuário (`failed_login_attempts`, `locked_until`), não em cache separado.
- Contador zera em qualquer login bem-sucedido ou redefinição de senha concluída.
- Isso é independente do rate limiting por IP (§6.2) — os dois se somam.

### 4.5 Redefinição de senha ("esqueci minha senha")

- `POST /auth/forgot-password`: sempre responde `200 { ok: true, message: "..." }`, exista ou não a conta — não revela quais e-mails estão cadastrados.
- Se a conta existir, gera token (32 bytes, hash SHA-256 guardado, expiração 1h) e dispara e-mail.
- `POST /auth/reset-password`: valida token + expiração, exige senha ≥ 6 caracteres, zera `failed_login_attempts`/`locked_until` como efeito colateral.
- Fluxo no frontend: link do e-mail é `<PUBLIC_URL>/?reset=<token>`; ao carregar, a página abre o modal de login direto no modo "definir nova senha" (ver §8.2).

### 4.6 JWT

- Payload: `{ sub: user.id, role: user.role }`, sem mais claims.
- Validade fixa: 7 dias. Não há refresh token nem revogação server-side — um token emitido continua válido até expirar, mesmo que a senha mude ou o papel do usuário mude depois (o cliente busca o papel atualizado via `GET /auth/me`, mas o JWT em si carrega o papel do momento em que foi emitido).
- Sem `JWT_SECRET` no ambiente, o servidor usa um segredo de desenvolvimento hardcoded e emite um aviso no console — **não adequado para produção**.

## 5. Contrato da API

Base path: `/api`. Toda resposta é JSON. Erros seguem o formato `{ "error": "mensagem em português" }`, com o HTTP status apropriado (400 validação, 401 não autenticado, 403 autenticado mas sem permissão ou conta bloqueada, 404, 409 conflito, 500 erro interno).

Convenção de autorização nas tabelas abaixo:
- **público** = sem header `Authorization`.
- **autenticado** = qualquer usuário logado (`Authorization: Bearer <token>` válido).
- **admin** = autenticado **e** `role === 'admin'`.

### 5.1 `/api/auth`

| Método | Rota | Auth | Rate limit | Corpo | Resposta de sucesso |
|---|---|---|---|---|---|
| POST | `/register` | público | `registerLimiter` (10/h por IP) | `{ name, email, password }` (senha ≥ 6) | `201 { token, user }` |
| POST | `/login` | público | `loginLimiter` (20/15min por IP) | `{ email, password }` | `200 { token, user }` |
| GET | `/me` | autenticado | — | — | `200 { user }` (reavalia promoção a admin) |
| POST | `/verify-email` | público | `verifyEmailLimiter` (20/15min por IP) | `{ token }` | `200 { ok: true, role }` |
| POST | `/resend-verification` | autenticado | `resendVerificationLimiter` (20/15min por IP) | — | `200 { ok: true }` ou `{ ok: true, alreadyVerified: true }` |
| POST | `/forgot-password` | público | `forgotPasswordLimiter` (5/15min por IP) | `{ email }` | `200 { ok: true, message }` (sempre, exista ou não a conta) |
| POST | `/reset-password` | público | `resetPasswordLimiter` (20/15min por IP) | `{ token, password }` (senha ≥ 6) | `200 { ok: true }` |

Cada rota de token tem seu próprio limiter (contadores por IP independentes) — antes as três compartilhavam uma única instância, então esgotar o limite verificando e-mail também bloqueava reset de senha.

Objeto `user` retornado (`publicUser`): `{ id, name, email, role, emailVerified }` — nunca inclui hash de senha ou tokens.

### 5.2 `/api/posts`

| Método | Rota | Auth | Corpo | Resposta |
|---|---|---|---|---|
| GET | `/` | público | — | `{ posts: [...] }`, ordenado por `created_at DESC, id DESC`; cada post inclui `author_name` (via `LEFT JOIN users`) |
| GET | `/:id` | público | — | `{ post }` com `content` completo, ou `404` |
| POST | `/` | admin | `{ title, category, excerpt, content }` — todos obrigatórios e não-vazios | `201 { post }` |

`category` sem valor é gravado como `'Mentalidade'` (default no backend, não no schema).

### 5.3 `/api/products`

| Método | Rota | Auth | Corpo | Resposta |
|---|---|---|---|---|
| GET | `/` | público | — | `{ products: [...] }`, `ORDER BY created_at DESC, id DESC` |
| POST | `/` | admin | `{ name, price, description }` — todos obrigatórios | `201 { product }` |

Não existe rota de edição/exclusão de produto — só criação. `price` não é validado como número.

### 5.4 `/api/media`

| Método | Rota | Auth | Corpo | Resposta |
|---|---|---|---|---|
| GET | `/` | público | — | `{ media: [...] }`, `ORDER BY created_at DESC, id DESC` |
| POST | `/` | admin | `{ title, type, link, description }` | `201 { media: item }` |

`type` fora de `['Vídeo', 'Podcast']` silenciosamente cai para `'Vídeo'`. `link` é validado com `new URL()`; só `http:`/`https:` são aceitos.

### 5.5 `/api/events`

| Método | Rota | Auth | Corpo | Resposta |
|---|---|---|---|---|
| GET | `/` | público | — | `{ events: [...] }`, `ORDER BY created_at ASC, id ASC` (ordem de criação, não de `event_date`) |
| POST | `/` | admin | `{ title, date, location, description }` — nota: chave é `date` no request, mapeada para a coluna `event_date` | `201 { event }` |

### 5.6 `/api/site`

| Método | Rota | Auth | Corpo | Resposta |
|---|---|---|---|---|
| GET | `/` | público | — | ver shape abaixo |
| PUT | `/about` | admin | `{ text }` (não-vazio) | `{ about: text }` |
| PUT | `/contact` | admin | `{ instagram?, email?, phone? }` — cada campo, se vazio/omitido, **mantém o valor atual** (não limpa) | `{ contact: {...} }` |
| PUT | `/logo` | admin | `{ image }` data URL | `{ logoImage: image }` |
| PUT | `/about-image` | admin | `{ image }` data URL | `{ aboutImage: image }` |
| PUT | `/hero` | admin | `{ eyebrow, titlePrefix, titleHighlight, subtitle }` — todos obrigatórios | `{ hero: {...} }` |
| PUT | `/footer` | admin | `{ tagline }` (não-vazio) | `{ footerTagline: tagline }` |

Shape de `GET /api/site`:
```json
{
  "about": "string | null",
  "contact": { "instagram": "string | null", "email": "string | null", "phone": "string | null" },
  "logoImage": "string | null",
  "aboutImage": "string | null",
  "hero": { "eyebrow": "...", "titlePrefix": "...", "titleHighlight": "...", "subtitle": "..." },
  "footerTagline": "..."
}
```
`hero.*` e `footerTagline` nunca são `null` na resposta — caem para os defaults hardcoded em `DEFAULTS` (site.js) quando a coluna está NULL. `about`, `contact.*`, `logoImage`, `aboutImage` **podem** ser `null`; é o frontend que decide o que mostrar nesse caso.

Validação de imagem (`/logo`, `/about-image`): precisa casar `^data:image\/(png|jpeg|jpg|webp|gif);base64,...$` e ter até 5MB de string (≈3,6MB de imagem original). O redimensionamento (400px para logo, 1200px para foto de "Sobre nós", JPEG qualidade 0.85) acontece **no navegador**, via `<canvas>`, antes do upload — o backend só valida o resultado.

### 5.7 `/api/leads`

| Método | Rota | Auth | Corpo | Resposta |
|---|---|---|---|---|
| POST | `/mentorship` | público | `{ name, contact, message? }` | `201 { ok: true }` |
| POST | `/newsletter` | público | `{ email }` | `201 { ok: true }` (mesmo em duplicata) |
| GET | `/mentorship` | admin | — | `{ leads: [...] }` |
| GET | `/newsletter` | admin | — | `{ subscribers: [...] }` |

Não há rota pública para o frontend consumir `GET /leads/*` hoje — essas duas rotas existem na API mas **nenhuma tela as consome** (não há painel de leads no frontend atual).

`POST /mentorship` e `POST /newsletter` passam por `leadsLimiter` (ver §6.2) — sem isso, qualquer visitante podia inundar as tabelas com envios automatizados.

## 6. Segurança e infraestrutura

### 6.1 Cabeçalhos e transporte

- `helmet()` com config default (CSP padrão do helmet — por isso todo JS de página precisa estar em arquivo externo, não inline).
- `trust proxy: 1` — necessário para `req.secure`/`x-forwarded-proto` funcionarem corretamente atrás de um proxy TLS-terminating.
- `FORCE_HTTPS=true` ativa um redirecionamento 301 para https quando a requisição não chega como segura.
- CORS: desabilitado por padrão (`origin: false`); só liberado se `CORS_ORIGIN` for definida.

### 6.2 Rate limiting (por IP, em memória — não persiste, não é distribuído)

| Limiter | Janela | Máximo | Aplicado em |
|---|---|---|---|
| `registerLimiter` | 60 min | 10 | `POST /auth/register` |
| `loginLimiter` | 15 min | 20 | `POST /auth/login` |
| `forgotPasswordLimiter` | 15 min | 5 | `POST /auth/forgot-password` |
| `verifyEmailLimiter` | 15 min | 20 | `POST /auth/verify-email` |
| `resendVerificationLimiter` | 15 min | 20 | `POST /auth/resend-verification` |
| `resetPasswordLimiter` | 15 min | 20 | `POST /auth/reset-password` |
| `leadsLimiter` | 60 min | 10 | `POST /leads/mentorship`, `POST /leads/newsletter` |

As três rotas de token (`verify-email`, `resend-verification`, `reset-password`) usavam uma única instância de limiter compartilhada — esgotar o limite verificando um e-mail também bloqueava reset de senha e reenvio de verificação. Agora cada uma tem seu próprio contador por IP.

Por ser em memória (`express-rate-limit` default), reinicia a cada deploy/restart do processo e não é compartilhado entre múltiplas instâncias — relevante se o site algum dia escalar horizontalmente.

### 6.3 Upload de imagens

Tudo em base64 dentro do corpo JSON (não é `multipart/form-data`, não há storage de objeto/S3). Teto de 6MB no corpo da requisição (`express.json({ limit: '6mb' })`) para acomodar isso. Imagens vivem como texto na coluna `site_settings.logo_image`/`about_image` — não há CDN nem cache-busting; troca de imagem é instantânea na próxima leitura.

## 7. E-mail transacional

Dois templates, ambos texto puro (sem HTML): verificação de conta e redefinição de senha. Sem SMTP configurado, o comportamento é **silenciosamente degradado**: o link certo é logado no console do servidor e a função retorna sem lançar erro — o fluxo de cadastro/reset continua funcionando de ponta a ponta, só sem o e-mail real chegar.

## 8. Frontend

Página única (`index.html`), sem router — seções são âncoras (`#inicio`, `#posts`, `#sobre`, `#shop`, `#midia`, `#eventos`, `#contato`, `#novidades`, `#publicar`). Duas páginas legais separadas e estáticas: `termos.html`, `privacidade.html` (sem `app.js`, sem chamadas à API).

### 8.1 Padrão de UI admin vs. público

Para cada área editável (Sobre nós, contato, hero, rodapé, logo, foto) e cada seção com conteúdo administrável (loja, mídia, eventos, publicações), o HTML já contém tanto a visualização pública quanto o formulário de edição, ambos presentes no DOM; `updateAccessUI()` alterna classe `.hide` conforme `isAdmin()`. Não há rota/página separada de administração — o mesmo HTML serve os dois públicos.

Onde o visitante não-admin não pode agir, aparece um texto neutro ("Apenas administradores podem..."), sem link nem convite a login.

### 8.2 Sessão e deep-links de e-mail

- Token JWT em `localStorage['dcd_token']`. Ao carregar a página, `restoreSession()` valida o token via `GET /auth/me`; se inválido/expirado, limpa silenciosamente.
- `?verify=<token>` na URL dispara `POST /auth/verify-email` automaticamente no load, depois remove o parâmetro da URL (`history.replaceState`) para não reprocessar em refresh.
- `?reset=<token>` na URL abre o modal de login já no modo "definir nova senha".

### 8.3 Componentes reutilizáveis

- **Modal de autenticação** (`#login-overlay`): um único formulário que troca de "cara" (`setAuthMode`) entre 4 modos — `login`, `register`, `forgot`, `reset` — mostrando/escondendo campos e trocando textos de botão, em vez de 4 modais separados.
- **Modal de leitura de post** (`#post-overlay`): abre com o conteúdo completo do post clicado (fallback para `excerpt` se `content` for `null` — posts antigos). Fecha por botão ou clique fora.
- **Toast** (`#toast`): notificação flutuante para sucesso/erro, substitui `alert()` nativo. `showToast(message, isError)`, auto-esconde em 4s.

### 8.4 Busca de publicações

Client-side, sem chamada à API: filtra os `.post-row` já renderizados no DOM por substring (case-insensitive) no título ou resumo, escondendo via `display: none` os que não combinam.

### 8.5 Upload de foto (logo / imagem de "Sobre nós")

Fluxo inteiramente no navegador antes de qualquer rede: `<input type="file">` → `FileReader` → `<img>` temporária → `<canvas>` redimensiona (mantendo proporção, limitando à maior dimensão) → `canvas.toDataURL('image/jpeg', 0.85)` → só então `PUT` para a API. Arquivo de origem aceito até 15MB; validação de tipo (`image/*`) também no cliente.

## 9. Convenções para novas specs

Ao adicionar uma feature nova, escrever a spec **antes** do código, cobrindo pelo menos:

1. **Dado**: que coluna(s)/tabela(s) mudam, tipo, nullable, default, e se afeta linhas existentes (migração `ensureColumn`).
2. **API**: método, rota, nível de autorização, corpo (campos obrigatórios vs. opcionais e o que acontece se um opcional vier vazio), shape da resposta, casos de erro.
3. **Frontend**: onde aparece na página, comportamento para público vs. admin, o que mostra em estado vazio.
4. **O que fica fora do escopo** — para uma feature pequena, é tão importante dizer o que *não* muda quanto o que muda.

Depois de implementar, atualizar as seções correspondentes deste documento (§3–§8) no mesmo PR — não depois, não "quando der tempo".
