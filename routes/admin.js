const express = require("express");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const db = require("../database.js");
const cfg = require("../config/index.js");
const { requiereAdmin } = require("../middleware/auth.js");
const { ROLES_VALIDOS, tienePermiso, requiereModerador, estaEnLinea } = require("../middleware/auth.js");

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
    SELECT u.id, u.nombre, u.email, u.rol, u.avatar, u.bio, u.baneado, u.silenciado, u.proveedor, u.password_hash, u.creado_en,
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
  if (!ROLES_VALIDOS.includes(rol)) return res.status(400).json({ error: "Rol no válido. Usa: " + ROLES_VALIDOS.join(", ") });
  db.prepare("UPDATE users SET rol = ? WHERE id = ?").run(rol, objetivo.id);
  res.json({ ok: true, rol, nombre: objetivo.nombre });
});

/* --- Usuarios conectados (admin) --- */
router.get("/usuarios/conectados", requiereAdmin, (req, res) => {
  const ventanaMs = 3 * 60 * 1000;
  const desde = new Date(Date.now() - ventanaMs).toISOString().slice(0, 19).replace("T", " ");
  const rows = db.prepare(`
    SELECT id, nombre, email, avatar, rol, fecha_nacimiento, ultima_actividad
    FROM users WHERE baneado = 0 AND ultima_actividad >= ? ORDER BY ultima_actividad DESC
  `).all(desde);
  res.json(rows.map(u => ({
    ...u,
    online: estaEnLinea(u.ultima_actividad)
  })));
});

/* --- Silenciar usuario (moderador+) --- */
router.put("/usuarios/:id/silenciar", requiereModerador, (req, res) => {
  const objetivo = db.prepare("SELECT * FROM users WHERE id = ?").get(Number(req.params.id));
  if (!objetivo) return res.status(404).json({ error: "Usuario no encontrado" });
  if (String(objetivo.email).toLowerCase() === cfg.MASTER_EMAIL)
    return res.status(400).json({ error: "El usuario master no puede ser silenciado" });
  if (tienePermiso(objetivo.rol, 4))
    return res.status(400).json({ error: "No puedes silenciar a un administrador" });
  const { silenciado } = req.body || {};
  db.prepare("UPDATE users SET silenciado = ? WHERE id = ?").run(silenciado ? 1 : 0, objetivo.id);
  res.json({ ok: true, silenciado: silenciado ? 1 : 0, nombre: objetivo.nombre });
});

/* --- Amistad directa (admin agrega sin solicitud) --- */
router.post("/amistad-directa", requiereAdmin, (req, res) => {
  const { usuario_id } = req.body || {};
  const otro = Number(usuario_id);
  if (!otro) return res.status(400).json({ error: "Destino inválido" });
  const objetivo = db.prepare("SELECT id, baneado FROM users WHERE id = ?").get(otro);
  if (!objetivo || objetivo.baneado) return res.status(404).json({ error: "Usuario no encontrado" });
  const existente = db.prepare(
    "SELECT * FROM amistades WHERE (solicitante_id=? AND receptor_id=?) OR (solicitante_id=? AND receptor_id=?) LIMIT 1"
  ).get(req.usuario.id, otro, otro, req.usuario.id);
  if (existente && existente.estado === "aceptada")
    return res.json({ ok: true, estado: "ya_eran_amigos", amistadId: existente.id });
  if (existente) {
    db.prepare("UPDATE amistades SET estado='aceptada', actualizado_en=datetime('now') WHERE id=?").run(existente.id);
    return res.json({ ok: true, estado: "aceptada", amistadId: existente.id });
  }
  const id1 = db.prepare("INSERT INTO amistades (solicitante_id, receptor_id, estado) VALUES (?,?,'aceptada')").run(req.usuario.id, otro).lastInsertRowid;
  db.prepare("INSERT OR IGNORE INTO amistades (solicitante_id, receptor_id, estado) VALUES (?,?,'aceptada')").run(otro, req.usuario.id);
  res.json({ ok: true, estado: "aceptada", amistadId: id1 });
});

/* --- Reportes: listar todos (admin) --- */
router.get("/reportes", requiereAdmin, (req, res) => {
  const rows = db.prepare(`
    SELECT r.*, u.nombre AS autor_nombre, u.email AS autor_email,
           u2.nombre AS resuelto_por_nombre
    FROM reportes r
    JOIN users u ON u.id = r.autor_id
    LEFT JOIN users u2 ON u2.id = r.resuelto_por_id
    ORDER BY r.estado = 'pendiente' DESC, r.creado_en DESC
  `).all();
  res.json(rows);
});

/* --- Reportes: marcar resuelto --- */
router.put("/reportes/:id/resolver", requiereAdmin, (req, res) => {
  const r = db.prepare("SELECT * FROM reportes WHERE id = ?").get(Number(req.params.id));
  if (!r) return res.status(404).json({ error: "Reporte no encontrado" });
  db.prepare("UPDATE reportes SET estado = 'resuelto', resuelto_por_id = ?, resuelto_en = datetime('now') WHERE id = ?")
    .run(req.usuario.id, r.id);
  res.json({ ok: true });
});

/* --- Reportes: reabrir --- */
router.put("/reportes/:id/reabrir", requiereAdmin, (req, res) => {
  const r = db.prepare("SELECT * FROM reportes WHERE id = ?").get(Number(req.params.id));
  if (!r) return res.status(404).json({ error: "Reporte no encontrado" });
  db.prepare("UPDATE reportes SET estado = 'pendiente', resuelto_por_id = NULL, resuelto_en = NULL WHERE id = ?").run(r.id);
  res.json({ ok: true });
});

/* --- Sanciones: lista de baneados y silenciados (admin) --- */
router.get("/sanciones", requiereAdmin, (req, res) => {
  const rows = db.prepare(`
    SELECT id, nombre, email, rol, baneado, silenciado, proveedor, creado_en
    FROM users WHERE baneado = 1 OR silenciado = 1
    ORDER BY baneado DESC, silenciado DESC, id ASC
  `).all();
  res.json(rows);
});

module.exports = router;
