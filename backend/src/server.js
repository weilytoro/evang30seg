require('dotenv').config();

const path = require('path');
const express = require('express');
const cors = require('cors');

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
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';

app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/site', siteRoutes);
app.use('/api/leads', leadsRoutes);

const frontendDir = path.join(__dirname, '..', '..', 'frontend');
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
