const express = require('express');
const db = require('../db');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/', (req, res) => {
  const products = db.prepare('SELECT * FROM products ORDER BY created_at DESC, id DESC').all();
  res.json({ products });
});

router.post('/', requireAdmin, (req, res) => {
  const { name, price, description } = req.body || {};

  if (!name || !String(name).trim() || !price || !String(price).trim() || !description || !String(description).trim()) {
    return res.status(400).json({ error: 'Nome, preço e descrição são obrigatórios.' });
  }

  const info = db
    .prepare('INSERT INTO products (name, price, description, created_by) VALUES (?, ?, ?, ?)')
    .run(String(name).trim(), String(price).trim(), String(description).trim(), req.user.id);

  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json({ product });
});

module.exports = router;
