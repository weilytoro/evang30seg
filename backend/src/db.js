const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');

const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const db = new Database(path.join(dataDir, 'app.db'));
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user','admin')),
    failed_login_attempts INTEGER NOT NULL DEFAULT 0,
    locked_until TEXT,
    reset_token_hash TEXT,
    reset_token_expires TEXT,
    email_verified INTEGER NOT NULL DEFAULT 0,
    verify_token_hash TEXT,
    verify_token_expires TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    author_id INTEGER REFERENCES users(id),
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    price TEXT NOT NULL,
    description TEXT NOT NULL,
    created_by INTEGER REFERENCES users(id),
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS media_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('Vídeo','Podcast')),
    link TEXT NOT NULL,
    description TEXT NOT NULL,
    created_by INTEGER REFERENCES users(id),
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    event_date TEXT NOT NULL,
    location TEXT NOT NULL,
    description TEXT NOT NULL,
    created_by INTEGER REFERENCES users(id),
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS site_settings (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    about_text TEXT,
    contact_instagram TEXT,
    contact_email TEXT,
    contact_phone TEXT,
    logo_image TEXT,
    about_image TEXT,
    hero_eyebrow TEXT,
    hero_title_prefix TEXT,
    hero_title_highlight TEXT,
    hero_subtitle TEXT,
    footer_tagline TEXT
  );

  CREATE TABLE IF NOT EXISTS mentorship_leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    contact TEXT NOT NULL,
    message TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

function ensureColumn(table, column, definition) {
  const columns = db.prepare(`PRAGMA table_info(${table})`).all().map((c) => c.name);
  if (!columns.includes(column)) {
    db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
  }
}

ensureColumn('users', 'failed_login_attempts', "INTEGER NOT NULL DEFAULT 0");
ensureColumn('users', 'locked_until', 'TEXT');
ensureColumn('users', 'reset_token_hash', 'TEXT');
ensureColumn('users', 'reset_token_expires', 'TEXT');
ensureColumn('users', 'email_verified', 'INTEGER NOT NULL DEFAULT 0');
ensureColumn('users', 'verify_token_hash', 'TEXT');
ensureColumn('users', 'verify_token_expires', 'TEXT');
ensureColumn('site_settings', 'logo_image', 'TEXT');
ensureColumn('site_settings', 'about_image', 'TEXT');
ensureColumn('site_settings', 'hero_eyebrow', 'TEXT');
ensureColumn('site_settings', 'hero_title_prefix', 'TEXT');
ensureColumn('site_settings', 'hero_title_highlight', 'TEXT');
ensureColumn('site_settings', 'hero_subtitle', 'TEXT');
ensureColumn('site_settings', 'footer_tagline', 'TEXT');

db.prepare(
  `INSERT OR IGNORE INTO site_settings (id, about_text, contact_instagram, contact_email, contact_phone)
   VALUES (1, NULL, NULL, NULL, NULL)`
).run();

module.exports = db;
