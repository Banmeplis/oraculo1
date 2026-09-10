const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("../database.js");
const cfg = require("../config/index.js");
const { requiereAdmin } = require("../middleware/auth.js");

const router = express.Router();

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
