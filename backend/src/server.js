require('dotenv').config();

const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

require('./db'); // garante que o schema exista antes de servir requisições

const authRoutes = require('./routes/auth');
const postsRoutes = require('./routes/posts');
const productsRoutes = require('./routes/products');
const mediaRoutes = require('./routes/media');
const eventsRoutes = require('./routes/events');
const siteRoutes = require('./routes/site');
const leadsRoutes = require('./routes/leads');

const app = express();
const PORT = process.env.PORT || 3000;
const CORS_ORIGIN = process.env.CORS_ORIGIN;
const FORCE_HTTPS = process.env.FORCE_HTTPS === 'true';

// Necessário para que req.secure / x-forwarded-proto sejam confiáveis atrás de
// um proxy/load balancer que termina o TLS (Railway, Render, Nginx, etc.).
app.set('trust proxy', 1);

app.use(helmet());

if (FORCE_HTTPS) {
  app.use((req, res, next) => {
    if (req.secure || req.headers['x-forwarded-proto'] === 'https') return next();
    return res.redirect(301, `https://${req.headers.host}${req.originalUrl}`);
  });
}

// Frontend e backend são servidos pela mesma origem, então CORS cross-origin
// só é necessário se CORS_ORIGIN for definido explicitamente (ex.: um front
// hospedado em outro domínio). Sem essa variável, requisições cross-origin
// são bloqueadas por padrão.
app.use(cors(CORS_ORIGIN ? { origin: CORS_ORIGIN.split(',').map((o) => o.trim()) } : { origin: false }));

// Limite elevado para acomodar as fotos (logo/Sobre nós) enviadas como data URL base64.
app.use(express.json({ limit: '6mb' }));

app.use('/api/auth', authRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/site', siteRoutes);
app.use('/api/leads', leadsRoutes);

// Assume irmã de backend/ por padrão; algumas plataformas de deploy usam uma
// estrutura de pastas diferente, então FRONTEND_DIR permite apontar para o
// caminho real caso a detecção automática não funcione.
const frontendDir = process.env.FRONTEND_DIR
  ? path.resolve(process.env.FRONTEND_DIR)
  : path.join(__dirname, '..', '..', 'frontend');
app.use(express.static(frontendDir));
app.get('/', (req, res) => {
  res.sendFile(path.join(frontendDir, 'index.html'));
});

app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Rota não encontrada.' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Erro interno do servidor.' });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
