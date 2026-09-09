const { DatabaseSync } = require("node:sqlite");
const fs = require("fs");
const path = require("path");

const DB_DIR = process.env.DATA_DIR || path.join(__dirname, "data");
const DB_PATH = path.join(DB_DIR, "oraculo.db");
fs.mkdirSync(DB_DIR, { recursive: true });

/* Si se despliega con una BD pre-sembrada en el repo (data/oraculo.db) y el
   volumen persistido de Render aún está vacío, copiarla al volumen para que
   la producción herede el contenido (artículos, usuarios, etc.). */
const SEED_DB = path.join(__dirname, "data", "oraculo.db");
if (DB_DIR !== path.join(__dirname, "data") &&
    fs.existsSync(SEED_DB) &&
    !fs.existsSync(DB_PATH)) {
  try {
    fs.copyFileSync(SEED_DB, DB_PATH);
    console.log("DB sembrada copiada al volumen: " + DB_PATH);
  } catch (e) {
    console.error("No se pudo copiar la DB sembrada:", e.message);
  }
}

const db = new DatabaseSync(DB_PATH);

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

  CREATE TABLE IF NOT EXISTS visitas (
    id          INTEGER PRIMARY KEY CHECK (id = 1),
    total       INTEGER NOT NULL DEFAULT 0,
    actualizado TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS amistades (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    solicitante_id INTEGER NOT NULL REFERENCES users(id),
    receptor_id    INTEGER NOT NULL REFERENCES users(id),
    estado         TEXT NOT NULL DEFAULT 'pendiente',
    creado_en      TEXT NOT NULL DEFAULT (datetime('now')),
    actualizado_en TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE (solicitante_id, receptor_id)
  );
  CREATE INDEX IF NOT EXISTS idx_amistades_receptor ON amistades(receptor_id, estado);
  CREATE INDEX IF NOT EXISTS idx_amistades_solicitante ON amistades(solicitante_id, estado);

  CREATE TABLE IF NOT EXISTS mensajes_chat (
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    remitente_id   INTEGER NOT NULL REFERENCES users(id),
    destinatario_id INTEGER NOT NULL REFERENCES users(id),
    contenido       TEXT NOT NULL,
    leido           INTEGER NOT NULL DEFAULT 0,
    creado_en       TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE INDEX IF NOT EXISTS idx_mensajes_par ON mensajes_chat(remitente_id, destinatario_id, id);

  INSERT OR IGNORE INTO visitas (id, total) VALUES (1, 0);
`);

/* migraciones para DBs existentes */
try { db.exec("ALTER TABLE lecturas ADD COLUMN favorita INTEGER NOT NULL DEFAULT 0"); } catch {}
try { db.exec("ALTER TABLE users ADD COLUMN avatar TEXT"); } catch {}
try { db.exec("ALTER TABLE users ADD COLUMN bio TEXT"); } catch {}
try { db.exec("ALTER TABLE users ADD COLUMN baneado INTEGER NOT NULL DEFAULT 0"); } catch {}
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

/* ------------------- semilla de artículos SEO (idempotente) -------------- */
/* Inserta los 39 artículos del blog solo si su título no existe aún, bajo la
   autora editorial Luna Arcania (o el primer admin si no está). */
try {
  const POSTS_SEO = require("./seed/posts-seo.js");
  const autor =
    db.prepare("SELECT id FROM users WHERE email = ?").get("luna.arcania@oraculo.local") ||
    db.prepare("SELECT id FROM users WHERE rol = 'admin' ORDER BY id LIMIT 1").get();
  if (autor && Array.isArray(POSTS_SEO)) {
    const existe = db.prepare("SELECT 1 FROM posts WHERE titulo = ? LIMIT 1");
    const insertar = db.prepare(
      "INSERT INTO posts (autor_id, titulo, resumen, cuerpo, publicado) VALUES (?,?,?,?,1)"
    );
    for (const p of POSTS_SEO) {
      if (p && p.titulo && !existe.get(p.titulo)) insertar.run(autor.id, p.titulo, p.resumen || "", p.cuerpo || "");
    }
  }
} catch (e) {
  console.error("No se pudieron sembrar los artículos SEO:", e.message);
}

module.exports = db;