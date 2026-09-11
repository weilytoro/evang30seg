const express = require('express');
const db = require('../db');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.post('/mentorship', (req, res) => {
  const { name, contact, message } = req.body || {};

  if (!name || !String(name).trim() || !contact || !String(contact).trim()) {
    return res.status(400).json({ error: 'Nome e contato são obrigatórios.' });
  }

  db.prepare('INSERT INTO mentorship_leads (name, contact, message) VALUES (?, ?, ?)').run(
    String(name).trim(),
    String(contact).trim(),
    message && String(message).trim() ? String(message).trim() : null
  );

  res.status(201).json({ ok: true });
});

router.post('/newsletter', (req, res) => {
  const { email } = req.body || {};
  if (!email || !EMAIL_RE.test(String(email))) {
    return res.status(400).json({ error: 'Informe um e-mail válido.' });
  }

  db.prepare('INSERT OR IGNORE INTO newsletter_subscribers (email) VALUES (?)').run(
    String(email).trim().toLowerCase()
  );

  res.status(201).json({ ok: true });
});

router.get('/mentorship', requireAdmin, (req, res) => {
  const leads = db.prepare('SELECT * FROM mentorship_leads ORDER BY created_at DESC').all();
  res.json({ leads });
});

router.get('/newsletter', requireAdmin, (req, res) => {
  const subscribers = db.prepare('SELECT * FROM newsletter_subscribers ORDER BY created_at DESC').all();
  res.json({ subscribers });
});

module.exports = router;
