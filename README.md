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
cp .env.example .env   # ajuste JWT_SECRET e ADMIN_SIGNUP_CODE
npm start
```

Acesse `http://localhost:3000`.

## Autenticação

- Qualquer visitante pode criar conta (nome, e-mail, senha) pelo modal de login (link "Criar conta").
- Para virar administrador no cadastro, marque "Cadastrar como administrador" e informe o código definido em `ADMIN_SIGNUP_CODE` (padrão: `admin2026`).
- Apenas administradores podem: publicar posts, adicionar produtos na loja, adicionar vídeos/podcasts, adicionar eventos, e editar os textos de "Sobre nós" e "Contato".
- Qualquer visitante pode enviar contato de mentoria e se cadastrar na newsletter, sem login.
- Sessão é feita via JWT (7 dias), guardado no `localStorage` do navegador; a verificação de permissão é sempre refeita no servidor (o frontend só esconde botões, não é a fonte de verdade).

## API

Todas as rotas ficam sob `/api`. Corpo e respostas em JSON.

| Método | Rota | Acesso | Descrição |
|---|---|---|---|
| POST | `/api/auth/register` | público | Cria conta (`name`, `email`, `password`, `adminCode?`) |
| POST | `/api/auth/login` | público | Login (`email`, `password`) |
| GET | `/api/auth/me` | autenticado | Dados do usuário logado |
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
- `ADMIN_SIGNUP_CODE` — código exigido para se cadastrar como administrador (padrão `admin2026`)
- `CORS_ORIGIN` — origem permitida por CORS (padrão `*`, restrinja em produção)
