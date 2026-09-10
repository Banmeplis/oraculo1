const db = require("../database.js");
const cfg = require("../config/index.js");
const { signoDeFecha, signoPublico } = require("../config/zodiaco.js");

function rolEfectivo(email, rol) {
  if (email && String(email).toLowerCase() === cfg.MASTER_EMAIL) return "admin";
  return rol || "autor";
}

const VENTANA_ONLINE = 3 * 60 * 1000;

function estaEnLinea(ultimaActividad) {
  if (!ultimaActividad) return false;
  const t = Date.parse(String(ultimaActividad).replace(" ", "T") + "Z");
  if (Number.isNaN(t)) return false;
  return (Date.now() - t) < VENTANA_ONLINE;
}

function usuarioActual(req) {
  if (!req.session.user) return null;
  const u = db.prepare("SELECT id, nombre, email, rol, avatar, baneado, fecha_nacimiento, ultima_actividad FROM users WHERE id = ?").get(req.session.user.id);
  if (!u || u.baneado) {
    req.session.user = null;
    return null;
  }
  db.prepare("UPDATE users SET ultima_actividad = datetime('now') WHERE id = ?").run(u.id);
  return {
    id: u.id,
    nombre: u.nombre,
    email: u.email,
    rol: rolEfectivo(u.email, u.rol),
    master: String(u.email).toLowerCase() === cfg.MASTER_EMAIL,
    picture: req.session.user.picture || undefined,
    baneado: u.baneado,
    fecha_nacimiento: u.fecha_nacimiento || undefined,
    signo: signoPublico(signoDeFecha(u.fecha_nacimiento)),
    online: estaEnLinea(u.ultima_actividad),
    ultima_actividad: u.ultima_actividad || undefined
  };
}

function requiereAuth(req, res, next) {
  const u = usuarioActual(req);
  if (!u) return res.status(401).json({ error: "No has iniciado sesión" });
  req.usuario = u;
  next();
}

function requiereAdmin(req, res, next) {
  const u = usuarioActual(req);
  if (!u) return res.status(401).json({ error: "No has iniciado sesión" });
  if (u.rol !== "admin") return res.status(403).json({ error: "Necesitas permisos de administrador" });
  req.usuario = u;
  next();
}

function requerido(v) {
  return v !== null && v !== undefined && String(v).trim() !== "";
}

function validarFechaNacimiento(fecha) {
  const f = String(fecha || "").trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(f)) return "Fecha de nacimiento no válida (usa año-mes-día)";
  const t = Date.parse(f + "T12:00:00Z");
  if (Number.isNaN(t)) return "Fecha de nacimiento no válida";
  if (f > new Date().toISOString().slice(0, 10)) return "La fecha de nacimiento no puede estar en el futuro";
  const edad = (Date.now() - t) / (365.25 * 24 * 3600 * 1000);
  if (edad < 13) return "Debes tener al menos 13 años para crear tu cuenta";
  if (Number(f.slice(0, 4)) < 1900) return "Verifica tu fecha de nacimiento";
  return "";
}

function amigosEntre(a, b) {
  return db.prepare(
    "SELECT * FROM amistades WHERE estado='aceptada' AND ((solicitante_id=? AND receptor_id=?) OR (solicitante_id=? AND receptor_id=?)) LIMIT 1"
  ).get(a, b, b, a) || null;
}

function perfilCorto(u) {
  if (!u) return null;
  return {
    id: u.id,
    nombre: u.nombre,
    email: u.email,
    avatar: u.avatar || undefined,
    rol: u.rol,
    master: String(u.email).toLowerCase() === cfg.MASTER_EMAIL,
    online: estaEnLinea(u.ultima_actividad),
    ultima_actividad: u.ultima_actividad || undefined,
    signo: signoPublico(signoDeFecha(u.fecha_nacimiento))
  };
}

module.exports = {
  rolEfectivo,
  estaEnLinea,
  signoDeFecha,
  signoPublico,
  usuarioActual,
  requiereAuth,
  requiereAdmin,
  requerido,
  validarFechaNacimiento,
  amigosEntre,
  perfilCorto
};
