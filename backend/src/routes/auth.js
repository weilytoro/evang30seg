const crypto = require('crypto');
const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db');
const { signToken, requireAuth } = require('../middleware/auth');
const { sendPasswordResetEmail } = require('../mailer');

const router = express.Router();
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ADMIN_EMAILS = new Set(
  (process.env.ADMIN_EMAILS || 'weily@unemat.br')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
);

const LOCKOUT_THRESHOLD = 10;
const LOCKOUT_DURATION_MS = 24 * 60 * 60 * 1000;
const RESET_TOKEN_TTL_MS = 60 * 60 * 1000;

function isAdminEmail(email) {
  return ADMIN_EMAILS.has(String(email).trim().toLowerCase());
}

function publicUser(u) {
  return { id: u.id, name: u.name, email: u.email, role: u.role };
}

router.post('/register', (req, res) => {
  const { name, email, password } = req.body || {};

  if (!name || typeof name !== 'string' || !name.trim()) {
    return res.status(400).json({ error: 'Informe seu nome.' });
  }
  if (!email || typeof email !== 'string' || !EMAIL_RE.test(email)) {
    return res.status(400).json({ error: 'Informe um e-mail válido.' });
  }
  if (!password || typeof password !== 'string' || password.length < 6) {
    return res.status(400).json({ error: 'A senha deve ter pelo menos 6 caracteres.' });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(normalizedEmail);
  if (existing) {
    return res.status(409).json({ error: 'Já existe uma conta com este e-mail.' });
  }

  const role = isAdminEmail(normalizedEmail) ? 'admin' : 'user';
  const passwordHash = bcrypt.hashSync(password, 10);
  const info = db
    .prepare('INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)')
    .run(name.trim(), normalizedEmail, passwordHash, role);

  const user = db.prepare('SELECT id, name, email, role FROM users WHERE id = ?').get(info.lastInsertRowid);
  const token = signToken(user);
  res.status(201).json({ token, user: publicUser(user) });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: 'Informe e-mail e senha.' });
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(normalizedEmail);

  if (user && user.locked_until && new Date(user.locked_until).getTime() > Date.now()) {
    const hoursLeft = Math.max(1, Math.ceil((new Date(user.locked_until).getTime() - Date.now()) / (60 * 60 * 1000)));
    return res.status(403).json({
      error: `Conta bloqueada temporariamente por excesso de tentativas de login. Tente novamente em cerca de ${hoursLeft}h.`,
    });
  }

  const passwordOk = user && bcrypt.compareSync(password, user.password_hash);

  if (!passwordOk) {
    if (user) {
      const attempts = user.failed_login_attempts + 1;
      if (attempts >= LOCKOUT_THRESHOLD) {
        const lockedUntil = new Date(Date.now() + LOCKOUT_DURATION_MS).toISOString();
        db.prepare('UPDATE users SET failed_login_attempts = 0, locked_until = ? WHERE id = ?').run(lockedUntil, user.id);
      } else {
        db.prepare('UPDATE users SET failed_login_attempts = ? WHERE id = ?').run(attempts, user.id);
      }
    }
    return res.status(401).json({ error: 'E-mail ou senha incorretos.' });
  }

  let role = user.role;
  if (isAdminEmail(user.email) && role !== 'admin') {
    role = 'admin';
  }

  db.prepare(
    'UPDATE users SET role = ?, failed_login_attempts = 0, locked_until = NULL WHERE id = ?'
  ).run(role, user.id);

  const updatedUser = { ...user, role };
  const token = signToken(updatedUser);
  res.json({ token, user: publicUser(updatedUser) });
});

router.get('/me', requireAuth, (req, res) => {
  let user = req.user;
  if (isAdminEmail(user.email) && user.role !== 'admin') {
    db.prepare('UPDATE users SET role = ? WHERE id = ?').run('admin', user.id);
    user = { ...user, role: 'admin' };
  }
  res.json({ user });
});

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body || {};
  if (!email || !EMAIL_RE.test(String(email))) {
    return res.status(400).json({ error: 'Informe um e-mail válido.' });
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(normalizedEmail);

  if (user) {
    const token = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const expiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MS).toISOString();
    db.prepare('UPDATE users SET reset_token_hash = ?, reset_token_expires = ? WHERE id = ?').run(
      tokenHash,
      expiresAt,
      user.id
    );
    try {
      await sendPasswordResetEmail(user.email, token);
    } catch (err) {
      console.error('Falha ao enviar e-mail de redefinição de senha:', err);
    }
  }

  // Mesma resposta exista ou não a conta, para não revelar quais e-mails estão cadastrados.
  res.json({ ok: true, message: 'Se este e-mail estiver cadastrado, enviamos instruções de redefinição.' });
});

router.post('/reset-password', (req, res) => {
  const { token, password } = req.body || {};
  if (!token || typeof token !== 'string') {
    return res.status(400).json({ error: 'Link de redefinição inválido ou expirado.' });
  }
  if (!password || typeof password !== 'string' || password.length < 6) {
    return res.status(400).json({ error: 'A senha deve ter pelo menos 6 caracteres.' });
  }

  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  const user = db.prepare('SELECT * FROM users WHERE reset_token_hash = ?').get(tokenHash);

  if (!user || !user.reset_token_expires || new Date(user.reset_token_expires).getTime() < Date.now()) {
    return res.status(400).json({ error: 'Link de redefinição inválido ou expirado.' });
  }

  const passwordHash = bcrypt.hashSync(password, 10);
  db.prepare(
    `UPDATE users
     SET password_hash = ?, reset_token_hash = NULL, reset_token_expires = NULL,
         failed_login_attempts = 0, locked_until = NULL
     WHERE id = ?`
  ).run(passwordHash, user.id);

  res.json({ ok: true });
});

module.exports = router;
