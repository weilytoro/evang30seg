const express = require('express');
const db = require('../db');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();

function getSettings() {
  return db.prepare('SELECT * FROM site_settings WHERE id = 1').get();
}

router.get('/', (req, res) => {
  const s = getSettings();
  res.json({
    about: s.about_text,
    contact: {
      instagram: s.contact_instagram,
      email: s.contact_email,
      phone: s.contact_phone,
    },
  });
});

router.put('/about', requireAdmin, (req, res) => {
  const { text } = req.body || {};
  if (!text || !String(text).trim()) {
    return res.status(400).json({ error: 'O texto não pode ficar vazio.' });
  }

  const value = String(text).trim();
  db.prepare('UPDATE site_settings SET about_text = ? WHERE id = 1').run(value);
  res.json({ about: value });
});

router.put('/contact', requireAdmin, (req, res) => {
  const { instagram, email, phone } = req.body || {};
  const s = getSettings();

  const next = {
    instagram: instagram && String(instagram).trim() ? String(instagram).trim() : s.contact_instagram,
    email: email && String(email).trim() ? String(email).trim() : s.contact_email,
    phone: phone && String(phone).trim() ? String(phone).trim() : s.contact_phone,
  };

  db.prepare(
    'UPDATE site_settings SET contact_instagram = ?, contact_email = ?, contact_phone = ? WHERE id = 1'
  ).run(next.instagram, next.email, next.phone);

  res.json({ contact: next });
});

module.exports = router;
