const express = require('express');
const db = require('../db');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();
const ALLOWED_TYPES = ['Vídeo', 'Podcast'];

router.get('/', (req, res) => {
  const media = db.prepare('SELECT * FROM media_items ORDER BY created_at ASC, id ASC').all();
  res.json({ media });
});

router.post('/', requireAdmin, (req, res) => {
  const { title, type, link, description } = req.body || {};

  if (!title || !String(title).trim() || !link || !String(link).trim() || !description || !String(description).trim()) {
    return res.status(400).json({ error: 'Título, link e descrição são obrigatórios.' });
  }

  const mediaType = ALLOWED_TYPES.includes(type) ? type : 'Vídeo';

  let url;
  try {
    url = new URL(String(link).trim());
    if (!['http:', 'https:'].includes(url.protocol)) throw new Error('protocolo inválido');
  } catch (err) {
    return res.status(400).json({ error: 'Informe um link válido (http/https).' });
  }

  const info = db
    .prepare('INSERT INTO media_items (title, type, link, description, created_by) VALUES (?, ?, ?, ?, ?)')
    .run(String(title).trim(), mediaType, url.toString(), String(description).trim(), req.user.id);

  const item = db.prepare('SELECT * FROM media_items WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json({ media: item });
});

module.exports = router;
