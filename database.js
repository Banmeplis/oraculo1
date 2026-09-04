const { DatabaseSync } = require("node:sqlite");
const fs = require("fs");
const path = require("path");

const DB_DIR = process.env.DATA_DIR || path.join(__dirname, "data");
fs.mkdirSync(DB_DIR, { recursive: true });

const db = new DatabaseSync(path.join(DB_DIR, "oraculo.db"));

db.exec(`
  PRAGMA journal_mode = WAL;

  CREATE TABLE IF NOT EXISTS users (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre        TEXT NOT NULL,
    email         TEXT NOT NULL UNIQUE,
    password_hash TEXT,
    proveedor     TEXT NOT NULL DEFAULT 'local',
    rol           TEXT NOT NULL DEFAULT 'autor',
    avatar        TEXT,
    bio           TEXT,
    creado_en     TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS posts (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    autor_id    INTEGER NOT NULL REFERENCES users(id),
    titulo      TEXT NOT NULL,
    resumen     TEXT DEFAULT '',
    cuerpo      TEXT DEFAULT '',
    portada     TEXT,
    video       TEXT,
    publicado   INTEGER NOT NULL DEFAULT 1,
    creado_en   TEXT NOT NULL DEFAULT (datetime('now')),
    actualizado TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS lecturas (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id   INTEGER REFERENCES users(id),
    nombre    TEXT NOT NULL DEFAULT '',
    tirada    TEXT,
    cartas    TEXT,
    resultado TEXT,
    favorita  INTEGER NOT NULL DEFAULT 0,
    creado_en TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS comentarios (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id   INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_id   INTEGER REFERENCES users(id),
    autor     TEXT NOT NULL DEFAULT '',
    cuerpo    TEXT NOT NULL,
    creado_en TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

/* migraciones para DBs existentes */
try { db.exec("ALTER TABLE lecturas ADD COLUMN favorita INTEGER NOT NULL DEFAULT 0"); } catch {}
try { db.exec("ALTER TABLE users ADD COLUMN avatar TEXT"); } catch {}
try { db.exec("ALTER TABLE users ADD COLUMN bio TEXT"); } catch {}
try {
  db.exec(`
    CREATE TABLE IF NOT EXISTS comentarios (
      id        INTEGER PRIMARY KEY AUTOINCREMENT,
      post_id   INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
      user_id   INTEGER REFERENCES users(id),
      autor     TEXT NOT NULL DEFAULT '',
      cuerpo    TEXT NOT NULL,
      creado_en TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);
} catch {}

module.exports = db;