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
- **Administrador é definido por e-mail**, não por código: quem se cadastrar (ou logar) com um e-mail listado em `ADMIN_EMAILS` vira administrador — **somente depois de confirmar o e-mail** (ver abaixo). Por padrão isso inclui `weily@unemat.br`; para adicionar outros administradores, liste os e-mails separados por vírgula nessa variável.
- **Verificação de e-mail**: toda conta nova recebe um link de confirmação (token de uso único, válido por 24h). Enquanto não confirmar, a conta funciona como usuário comum — mesmo que o e-mail esteja em `ADMIN_EMAILS` — para impedir que alguém vire administrador só digitando o e-mail de outra pessoa no cadastro, sem provar que tem acesso àquela caixa de entrada. Um link para reenviar a confirmação aparece no site enquanto a conta não for verificada.
- Apenas administradores podem: publicar posts, adicionar produtos na loja, adicionar vídeos/podcasts, adicionar eventos, e editar os textos de "Sobre nós" e "Contato".
- Qualquer visitante pode enviar contato de mentoria e se cadastrar na newsletter, sem login.
- Sessão é feita via JWT (7 dias), guardado no `localStorage` do navegador; a verificação de permissão é sempre refeita no servidor (o frontend só esconde botões, não é a fonte de verdade).
- **Bloqueio de conta**: após 10 tentativas de login com senha incorreta para o mesmo e-mail, a conta fica bloqueada por 24 horas (mesmo com a senha certa). Um pedido de redefinição de senha bem-sucedido também limpa esse bloqueio.
- **Redefinição de senha**: o link "Esqueci minha senha" gera um token de uso único válido por 1 hora. Se `SMTP_HOST`/`SMTP_USER`/`SMTP_PASS` estiverem configurados, o link é enviado por e-mail; caso contrário, ele só é registrado no log do servidor (`console.warn`) — útil para desenvolvimento, mas configure o SMTP antes de abrir isso para usuários reais.

## API

Todas as rotas ficam sob `/api`. Corpo e respostas em JSON.

| Método | Rota | Acesso | Descrição |
|---|---|---|---|
| POST | `/api/auth/register` | público | Cria conta (`name`, `email`, `password`) e envia e-mail de verificação |
| POST | `/api/auth/login` | público | Login (`email`, `password`) — bloqueia a conta por 24h após 10 tentativas erradas; só promove a admin se o e-mail já foi verificado |
| GET | `/api/auth/me` | autenticado | Dados do usuário logado |
| POST | `/api/auth/verify-email` | público | Confirma o e-mail a partir do token do link (`token`) — só então o papel de admin é concedido |
| POST | `/api/auth/resend-verification` | autenticado | Reenvia o e-mail de verificação, se a conta ainda não foi confirmada |
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
| GET | `/api/site` | público | Texto "Sobre nós", contato, fotos (logo/ilustração), destaque principal e frase do rodapé |
| PUT | `/api/site/about` | admin | Atualiza texto "Sobre nós" |
| PUT | `/api/site/contact` | admin | Atualiza Instagram/e-mail/telefone |
| PUT | `/api/site/logo` | admin | Troca a foto da logo no cabeçalho (`image`: data URL base64) |
| PUT | `/api/site/about-image` | admin | Troca a ilustração de "Sobre nós" (`image`: data URL base64) |
| PUT | `/api/site/hero` | admin | Atualiza o destaque principal (`eyebrow`, `titlePrefix`, `titleHighlight`, `subtitle`) |
| PUT | `/api/site/footer` | admin | Atualiza a frase do rodapé (`tagline`) |
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
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` — credenciais de SMTP para envio real dos e-mails de redefinição de senha e verificação de conta. Sem elas, os links só são registrados no log do servidor — funciona para você mesmo testar/operar, mas configure o SMTP antes de abrir o cadastro para usuários reais (sem isso, ninguém além de quem tem acesso ao log do servidor consegue confirmar a própria conta).
- `FRONTEND_DIR` — caminho absoluto para a pasta `frontend/`, só necessário se a plataforma de deploy usar uma estrutura de pastas diferente da deste repositório (`backend/` e `frontend/` como irmãs). Deixe em branco na maioria dos casos.

## Deploy na Hostinger (hospedagem compartilhada/Business com Node.js)

1. No hPanel, abra **Node.js** (em Avançado) e crie uma aplicação, ou conecte o repositório GitHub `weilytoro/evang30seg` (deploy automático a cada push) — ou envie um `.zip` do projeto (sem `node_modules` e sem `.git`).
2. Nas configurações da aplicação: **Application Root** deve ser a pasta `backend/` (onde está o `package.json`); **Application Startup File** = `src/server.js`; escolha uma versão LTS do Node (18, 20, 22 ou 24 — todas suportadas).
3. Defina as variáveis de ambiente na própria interface do hPanel (ou importe um `.env`): `JWT_SECRET`, `ADMIN_EMAILS`, `PUBLIC_URL` (o domínio real, com `https://`), e as credenciais de `SMTP_*` se já tiver configurado a Brevo.
4. A Hostinger normalmente clona o repositório inteiro mesmo apontando a Application Root para `backend/`, então `frontend/` deve continuar acessível como pasta irmã e o site deve funcionar sem mais configuração. **Se a página vier em branco** (API funcionando mas sem CSS/JS), defina `FRONTEND_DIR` com o caminho absoluto real da pasta `frontend/` nesse ambiente.
5. **Verifique a persistência do banco antes de confiar nele**: publique um post de teste pela tela de admin, dispare um redeploy (ou reinicie a aplicação pelo painel) e confirme se o post continua lá. A documentação da Hostinger é vaga sobre isso — se o arquivo `backend/data/app.db` for apagado a cada deploy, avise para migrarmos para o MySQL gerenciado deles em vez do SQLite.
6. SSL: os planos com Node.js da Hostinger incluem certificado gerenciado gratuito — não deveria ser necessário configurar `FORCE_HTTPS` manualmente, mas se notar acesso HTTP sem redirecionar para HTTPS, defina essa variável como `true`.

## Segurança

- Senhas com hash (`bcrypt`), tokens JWT assinados, e toda autorização checada no servidor (nunca só no frontend).
- Cabeçalhos de segurança via `helmet` (incluindo HSTS) e CORS desabilitado por padrão para origens externas.
- Bloqueio de conta por 10 tentativas de login incorretas (24h), por e-mail.
- Rate limiting por IP nas rotas de autenticação: 20 logins/15min, 10 cadastros/hora, 5 pedidos de redefinição/15min.
- E-mail verificado é pré-requisito para virar administrador — fecha a brecha de alguém digitar o e-mail de outra pessoa no cadastro e ganhar acesso de admin sem provar que controla aquela caixa de entrada.
