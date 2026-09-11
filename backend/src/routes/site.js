const express = require('express');
const db = require('../db');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Aceita apenas data URLs de imagem, com um teto de tamanho para não estourar
// o corpo da requisição nem inchar o banco com uploads gigantes.
const IMAGE_DATA_URL_RE = /^data:image\/(png|jpeg|jpg|webp|gif);base64,[A-Za-z0-9+/=]+$/;
const MAX_IMAGE_DATA_URL_LENGTH = 5 * 1024 * 1024; // ~3.6MB de imagem original

// Textos originais do protótipo — usados quando o admin ainda não editou o
// campo pelo painel (coluna NULL no banco), para o site continuar igual até
// alguém decidir trocar.
const DEFAULTS = {
  heroEyebrow: 'Faça o dinheiro trabalhar por você',
  heroTitlePrefix: 'Desperte a sua',
  heroTitleHighlight: 'mentalidade financeira',
  heroSubtitle: 'Ideias claras sobre dinheiro, investimentos e hábitos que fazem sua renda trabalhar por você.',
  footerTagline: 'Educação que transforma',
};

function getSettings() {
  return db.prepare('SELECT * FROM site_settings WHERE id = 1').get();
}

function validateImageDataUrl(image) {
  if (!image || typeof image !== 'string') return 'Envie uma imagem.';
  if (image.length > MAX_IMAGE_DATA_URL_LENGTH) return 'Imagem muito grande. Escolha um arquivo menor.';
  if (!IMAGE_DATA_URL_RE.test(image)) return 'Formato de imagem inválido. Use PNG, JPEG, WEBP ou GIF.';
  return null;
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
    logoImage: s.logo_image,
    aboutImage: s.about_image,
    hero: {
      eyebrow: s.hero_eyebrow || DEFAULTS.heroEyebrow,
      titlePrefix: s.hero_title_prefix || DEFAULTS.heroTitlePrefix,
      titleHighlight: s.hero_title_highlight || DEFAULTS.heroTitleHighlight,
      subtitle: s.hero_subtitle || DEFAULTS.heroSubtitle,
    },
    footerTagline: s.footer_tagline || DEFAULTS.footerTagline,
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

router.put('/logo', requireAdmin, (req, res) => {
  const { image } = req.body || {};
  const error = validateImageDataUrl(image);
  if (error) return res.status(400).json({ error });

  db.prepare('UPDATE site_settings SET logo_image = ? WHERE id = 1').run(image);
  res.json({ logoImage: image });
});

router.put('/about-image', requireAdmin, (req, res) => {
  const { image } = req.body || {};
  const error = validateImageDataUrl(image);
  if (error) return res.status(400).json({ error });

  db.prepare('UPDATE site_settings SET about_image = ? WHERE id = 1').run(image);
  res.json({ aboutImage: image });
});

router.put('/hero', requireAdmin, (req, res) => {
  const { eyebrow, titlePrefix, titleHighlight, subtitle } = req.body || {};

  if (![eyebrow, titlePrefix, titleHighlight, subtitle].every((v) => v && String(v).trim())) {
    return res.status(400).json({ error: 'Preencha todos os campos do destaque principal.' });
  }

  const next = {
    eyebrow: String(eyebrow).trim(),
    titlePrefix: String(titlePrefix).trim(),
    titleHighlight: String(titleHighlight).trim(),
    subtitle: String(subtitle).trim(),
  };

  db.prepare(
    'UPDATE site_settings SET hero_eyebrow = ?, hero_title_prefix = ?, hero_title_highlight = ?, hero_subtitle = ? WHERE id = 1'
  ).run(next.eyebrow, next.titlePrefix, next.titleHighlight, next.subtitle);

  res.json({ hero: next });
});

router.put('/footer', requireAdmin, (req, res) => {
  const { tagline } = req.body || {};
  if (!tagline || !String(tagline).trim()) {
    return res.status(400).json({ error: 'O texto não pode ficar vazio.' });
  }

  const value = String(tagline).trim();
  db.prepare('UPDATE site_settings SET footer_tagline = ? WHERE id = 1').run(value);
  res.json({ footerTagline: value });
});

module.exports = router;
