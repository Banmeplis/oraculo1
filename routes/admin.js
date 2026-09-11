const express = require("express");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const db = require("../database.js");
const cfg = require("../config/index.js");
const { requiereAdmin } = require("../middleware/auth.js");

const router = express.Router();

const RUTA_ADS = path.join(__dirname, "..", "public", "ads.txt");

function leerAds() {
  try { return fs.readFileSync(RUTA_ADS, "utf8"); } catch { return ""; }
}

router.get("/ads", requiereAdmin, (req, res) => {
  res.json({ contenido: leerAds() });
});

router.put("/ads", requiereAdmin, (req, res) => {
  const contenido = String((req.body || {}).contenido || "");
  if (contenido.length > 20000)
    return res.status(400).json({ error: "¡No se trata de escribir aquí toda la enciclopedia!" });
  const lineas = contenido.split(/\r?\n/).map(l => l.trim());
  const invalidas = lineas.filter(l => l !== "" && !/^[A-Za-z0-9.\-]+\s*,\s*[^\s,]+\s*,\s*(DIRECT|RESELLER|ADX|ADSENSE)\s*(,\s*\S+\s*)?(,\s*[A-Za-z0-9\-\/]+\s*)?$/i.test(l));
  if (invalidas.length)
    return res.status(400).json({ error: "Línea no válida: «" + invalidas[0] + "». Formato: dominio, identificador, DIRECT/RESELLER, token" });
  fs.writeFileSync(RUTA_ADS, contenido.replace(/\r\n/g, "\n"));
  res.json({ ok: true, contenido });
});

router.get("/sync/usuarios", (req, res) => {
  if (!cfg.SYNC_TOKEN)
    return res.status(503).json({ error: "SYNC_TOKEN no está configurado en este despliegue" });
  const dado = Buffer.from(String(req.get("x-sync-token") || ""));
  const esperado = Buffer.from(String(cfg.SYNC_TOKEN));
  if (dado.length !== esperado.length || !crypto.timingSafeEqual(dado, esperado))
    return res.status(401).json({ error: "Token de sincronización inválido" });
  const usuarios = db.prepare(`
    SELECT id, nombre, email, rol, avatar, bio, baneado, proveedor, password_hash,
           creado_en, fecha_nacimiento, ultima_actividad
    FROM users ORDER BY id ASC
  `).all();
  res.json({ ok: true, usuarios });
});

/* Exporta los artículos (y sus comentarios) para que la BD local pueda bajar
   los nuevos publicados desde el sitio web. Solo LECTURA: nunca modifica nada. */
router.get("/sync/posts", (req, res) => {
  if (!cfg.SYNC_TOKEN)
    return res.status(503).json({ error: "SYNC_TOKEN no está configurado en este despliegue" });
  const dado = Buffer.from(String(req.get("x-sync-token") || ""));
  const esperado = Buffer.from(String(cfg.SYNC_TOKEN));
  if (dado.length !== esperado.length || !crypto.timingSafeEqual(dado, esperado))
    return res.status(401).json({ error: "Token de sincronización inválido" });
  const posts = db.prepare(`
    SELECT p.id, p.autor_id, p.titulo, p.resumen, p.cuerpo, p.portada, p.video,
           p.publicado, p.creado_en, p.actualizado,
           u.nombre AS autor, u.email AS autor_email
    FROM posts p JOIN users u ON u.id = p.autor_id
    ORDER BY p.id ASC
  `).all();
  const comentarios = db.prepare(`
    SELECT c.id, c.post_id, c.user_id, c.autor, c.cuerpo, c.creado_en,
           u.email AS user_email
    FROM comentarios c LEFT JOIN users u ON u.id = c.user_id
    ORDER BY c.id ASC
  `).all();
  res.json({ ok: true, posts, comentarios });
});

router.get("/usuarios", requiereAdmin, (req, res) => {
  const esMaster = String(req.usuario.email).toLowerCase() === cfg.MASTER_EMAIL;
  const rows = db.prepare(`
    SELECT u.id, u.nombre, u.email, u.rol, u.avatar, u.bio, u.baneado, u.proveedor, u.password_hash, u.creado_en,
           (SELECT COUNT(*) FROM posts p WHERE p.autor_id = u.id) AS posts
    FROM users u ORDER BY u.baneado DESC, u.id ASC
  `).all();
  res.json(rows.map(u => ({
    ...u,
    master: String(u.email).toLowerCase() === cfg.MASTER_EMAIL,
    password_hash: esMaster ? u.password_hash : undefined,
    tienePassword: Boolean(u.password_hash)
  })));
});

router.post("/usuarios/:id/password", requiereAdmin, (req, res) => {
  const objetivo = db.prepare("SELECT * FROM users WHERE id = ?").get(Number(req.params.id));
  if (!objetivo) return res.status(404).json({ error: "Usuario no encontrado" });
  if (objetivo.id === req.usuario.id)
    return res.status(400).json({ error: "Usa Ajustes de tu perfil para cambiarte tu contraseña" });
  if (String(objetivo.email).toLowerCase() === cfg.MASTER_EMAIL)
    return res.status(400).json({ error: "El usuario master es intocable" });
  const nueva = String((req.body || {}).nueva || "").trim();
  if (nueva.length < 6)
    return res.status(400).json({ error: "La nueva contraseña debe tener al menos 6 caracteres" });
  db.prepare("UPDATE users SET password_hash = ? WHERE id = ?").run(bcrypt.hashSync(nueva, 10), objetivo.id);
  res.json({ ok: true, nombre: objetivo.nombre, email: objetivo.email, nueva });
});

router.put("/usuarios/:id/ban", requiereAdmin, (req, res) => {
  const objetivo = db.prepare("SELECT * FROM users WHERE id = ?").get(Number(req.params.id));
  if (!objetivo) return res.status(404).json({ error: "Usuario no encontrado" });
  if (objetivo.id === req.usuario.id)
    return res.status(400).json({ error: "No puedes banearte a ti mismo" });
  if (String(objetivo.email).toLowerCase() === cfg.MASTER_EMAIL)
    return res.status(400).json({ error: "El usuario master no puede ser baneado" });
  const { baneado } = req.body || {};
  db.prepare("UPDATE users SET baneado = ? WHERE id = ?").run(baneado ? 1 : 0, objetivo.id);
  res.json({ ok: true, baneado: baneado ? 1 : 0, nombre: objetivo.nombre });
});

router.put("/usuarios/:id/rol", requiereAdmin, (req, res) => {
  const objetivo = db.prepare("SELECT * FROM users WHERE id = ?").get(Number(req.params.id));
  if (!objetivo) return res.status(404).json({ error: "Usuario no encontrado" });
  if (objetivo.id === req.usuario.id)
    return res.status(400).json({ error: "No puedes cambiarte el rol a ti mismo" });
  if (String(objetivo.email).toLowerCase() === cfg.MASTER_EMAIL)
    return res.status(400).json({ error: "El rol del usuario master es intocable" });
  const { rol } = req.body || {};
  if (!["autor", "admin"].includes(rol)) return res.status(400).json({ error: "Rol no válido" });
  db.prepare("UPDATE users SET rol = ? WHERE id = ?").run(rol, objetivo.id);
  res.json({ ok: true, rol, nombre: objetivo.nombre });
});

module.exports = router;
