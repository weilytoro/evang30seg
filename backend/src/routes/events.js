const express = require('express');
const db = require('../db');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/', (req, res) => {
  const events = db.prepare('SELECT * FROM events ORDER BY created_at ASC, id ASC').all();
  res.json({ events });
});

router.post('/', requireAdmin, (req, res) => {
  const { title, date, location, description } = req.body || {};

  if (
    !title || !String(title).trim() ||
    !date || !String(date).trim() ||
    !location || !String(location).trim() ||
    !description || !String(description).trim()
  ) {
    return res.status(400).json({ error: 'Título, data, local e descrição são obrigatórios.' });
  }

  const info = db
    .prepare('INSERT INTO events (title, event_date, location, description, created_by) VALUES (?, ?, ?, ?, ?)')
    .run(String(title).trim(), String(date).trim(), String(location).trim(), String(description).trim(), req.user.id);

  const event = db.prepare('SELECT * FROM events WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json({ event });
});

module.exports = router;
