const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("../database.js");
const { requiereAuth, requerido, signoPublico, signoDeFecha, estaEnLinea, validarFechaNacimiento } = require("../middleware/auth.js");
const { subir } = require("../middleware/upload.js");

const router = express.Router();

router.get("/perfil", requiereAuth, (req, res) => {
  const u = db.prepare("SELECT id, nombre, email, rol, avatar, bio, fecha_nacimiento, creado_en FROM users WHERE id = ?").get(req.session.user.id);
  if (!u) return res.status(404).json({ error: "Usuario no encontrado" });
  res.json({ ...u, signo: signoPublico(signoDeFecha(u.fecha_nacimiento)), online: estaEnLinea(u.ultima_actividad) });
});

router.put("/perfil", requiereAuth, (req, res) => {
  const { nombre, bio, avatar, fecha_nacimiento } = req.body || {};
  const u = db.prepare("SELECT * FROM users WHERE id = ?").get(req.session.user.id);
  if (!u) return res.status(404).json({ error: "No encontrado" });
  if (fecha_nacimiento !== null && fecha_nacimiento !== undefined) {
    const errFecha = validarFechaNacimiento(fecha_nacimiento);
    if (errFecha) return res.status(400).json({ error: errFecha });
  }
  db.prepare(
    "UPDATE users SET nombre=?, bio=?, avatar=?, fecha_nacimiento=? WHERE id=?"
  ).run(
    String(nombre ?? u.nombre).trim(),
    String(bio !== undefined ? bio : (u.bio || "")),
    avatar !== undefined ? (avatar || null) : u.avatar,
    fecha_nacimiento !== null && fecha_nacimiento !== undefined ? String(fecha_nacimiento).slice(0, 10) : (u.fecha_nacimiento || null),
    u.id
  );
  req.session.user.nombre = String(nombre ?? u.nombre).trim();
  const actualizado = db.prepare("SELECT fecha_nacimiento FROM users WHERE id = ?").get(u.id);
  res.json({ ok: true, signo: signoPublico(signoDeFecha(actualizado.fecha_nacimiento)) });
});

router.put("/perfil/password", requiereAuth, (req, res) => {
  const { actual, nueva } = req.body || {};
  if (!requerido(actual) || !requerido(nueva))
    return res.status(400).json({ error: "Completa ambos campos" });
  if (String(nueva).length < 6)
    return res.status(400).json({ error: "La nueva contraseña debe tener al menos 6 caracteres" });
  const u = db.prepare("SELECT * FROM users WHERE id = ?").get(req.session.user.id);
  if (!u || !u.password_hash || !bcrypt.compareSync(String(actual), u.password_hash))
    return res.status(401).json({ error: "La contraseña actual es incorrecta" });
  const hash = bcrypt.hashSync(String(nueva), 10);
  db.prepare("UPDATE users SET password_hash = ? WHERE id = ?").run(hash, u.id);
  res.json({ ok: true });
});

router.post("/subir", requiereAuth, subir.single("archivo"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No se recibió el archivo" });
  res.json({ url: "/uploads/" + req.file.filename, tipo: req.file.tipoMedia });
}, (err, req, res, next) => {
  res.status(400).json({ error: err.message || "Error al subir el archivo" });
});

router.get("/lecturas", requiereAuth, (req, res) => {
  const rows = db.prepare(
    "SELECT * FROM lecturas WHERE user_id = ? ORDER BY favorita DESC, creado_en DESC LIMIT 50"
  ).all(req.session.user.id);
  res.json(rows);
});

router.post("/lecturas", requiereAuth, (req, res) => {
  const { nombre, tirada, cartas, resultado } = req.body || {};
  const info = db.prepare(
    "INSERT INTO lecturas (user_id, nombre, tirada, cartas, resultado) VALUES (?,?,?,?,?)"
  ).run(req.session.user.id, String(nombre || "Lectura"), tirada || null,
        typeof cartas === "string" ? cartas : JSON.stringify(cartas || []),
        typeof resultado === "string" ? resultado : JSON.stringify(resultado || ""));
  res.json({ ok: true, id: Number(info.lastInsertRowid) });
});

router.delete("/lecturas/:id", requiereAuth, (req, res) => {
  db.prepare("DELETE FROM lecturas WHERE id = ? AND user_id = ?").run(Number(req.params.id), req.session.user.id);
  res.json({ ok: true });
});

router.put("/lecturas/:id/favorita", requiereAuth, (req, res) => {
  const row = db.prepare("SELECT * FROM lecturas WHERE id = ? AND user_id = ?").get(Number(req.params.id), req.session.user.id);
  if (!row) return res.status(404).json({ error: "No encontrada" });
  const nueva = row.favorita ? 0 : 1;
  db.prepare("UPDATE lecturas SET favorita = ? WHERE id = ?").run(nueva, row.id);
  res.json({ ok: true, favorita: nueva });
});

router.get("/visita", (req, res) => {
  try {
    const row = db.prepare("SELECT total FROM visitas WHERE id = 1").get();
    res.json({ total: (row && row.total) || 0 });
  } catch (e) {
    res.json({ total: 0 });
  }
});

router.post("/visita", (req, res) => {
  try {
    db.prepare("UPDATE visitas SET total = total + 1, actualizado = datetime('now') WHERE id = 1").run();
    const row = db.prepare("SELECT total FROM visitas WHERE id = 1").get();
    res.json({ total: row.total });
  } catch (e) {
    res.status(500).json({ error: "No se pudo registrar la visita" });
  }
});

module.exports = router;
