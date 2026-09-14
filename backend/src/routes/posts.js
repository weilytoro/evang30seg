const express = require('express');
const db = require('../db');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();

const SELECT_POST = `
  SELECT posts.id, title, category, excerpt, posts.created_at, users.name AS author_name
  FROM posts LEFT JOIN users ON users.id = posts.author_id
`;

router.get('/', (req, res) => {
  const posts = db.prepare(`${SELECT_POST} ORDER BY posts.created_at DESC, posts.id DESC`).all();
  res.json({ posts });
});

router.post('/', requireAdmin, (req, res) => {
  const { title, category, excerpt } = req.body || {};

  if (!title || !String(title).trim() || !excerpt || !String(excerpt).trim()) {
    return res.status(400).json({ error: 'Título e resumo são obrigatórios.' });
  }

  const info = db
    .prepare('INSERT INTO posts (title, category, excerpt, author_id) VALUES (?, ?, ?, ?)')
    .run(String(title).trim(), category ? String(category).trim() : 'Mentalidade', String(excerpt).trim(), req.user.id);

  const post = db.prepare(`${SELECT_POST} WHERE posts.id = ?`).get(info.lastInsertRowid);
  res.status(201).json({ post });
});

module.exports = router;
