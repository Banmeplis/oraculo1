const express = require("express");
const db = require("../database.js");
const { requiereAuth, estaEnLinea, amigosEntre, perfilCorto } = require("../middleware/auth.js");

const router = express.Router();

router.get("/usuarios/buscar", requiereAuth, (req, res) => {
  const q = String(req.query.q || "").trim().slice(0, 60);
  if (!q) return res.json({ resultados: [] });
  const filtro = `%${q.replace(/[%_]/g, " ")}%`;
  const rows = db.prepare(
    "SELECT id, nombre, email, avatar, rol, fecha_nacimiento, ultima_actividad FROM users WHERE id != ? AND baneado = 0 AND (nombre LIKE ? OR email LIKE ?) ORDER BY nombre LIMIT 20"
  ).all(req.usuario.id, filtro, filtro);
  res.json({
    resultados: rows.map(u => {
      const aceptada = amigosEntre(req.usuario.id, u.id);
      let relacion = "nada";
      let solicitud = null;
      if (aceptada) relacion = "amigos";
      else {
        const pendiente = db.prepare("SELECT * FROM amistades WHERE estado='pendiente' AND ((solicitante_id=? AND receptor_id=?) OR (solicitante_id=? AND receptor_id=?)) LIMIT 1").get(req.usuario.id, u.id, u.id, req.usuario.id);
        if (pendiente) {
          relacion = pendiente.solicitante_id === req.usuario.id ? "enviada" : "recibida";
          solicitud = { tipo: pendiente.tipo || "amistad", nota: pendiente.nota || "" };
        }
      }
      return { ...perfilCorto(u), relacion, solicitud };
    })
  });
});

router.get("/amistades", requiereAuth, (req, res) => {
  const pendientes = db.prepare(`
    SELECT a.id, a.creado_en, a.tipo, a.nota, u.id AS usuario_id, u.nombre, u.email, u.avatar, u.rol, u.fecha_nacimiento, u.ultima_actividad
    FROM amistades a JOIN users u ON u.id = a.solicitante_id
    WHERE a.receptor_id = ? AND a.estado = 'pendiente'
    ORDER BY a.creado_en DESC
  `).all(req.usuario.id);
  const enviadas = db.prepare(`
    SELECT a.id, a.creado_en, a.tipo, a.nota, u.id AS usuario_id, u.nombre, u.email, u.avatar, u.rol, u.fecha_nacimiento, u.ultima_actividad
    FROM amistades a JOIN users u ON u.id = a.receptor_id
    WHERE a.solicitante_id = ? AND a.estado = 'pendiente'
    ORDER BY a.creado_en DESC
  `).all(req.usuario.id);
  const filas = db.prepare(`
    SELECT * FROM amistades WHERE estado = 'aceptada'
    AND (solicitante_id = ? OR receptor_id = ?) ORDER BY actualizado_en DESC
  `).all(req.usuario.id, req.usuario.id);
  const contactos = filas.map(a => {
    const otro = a.solicitante_id === req.usuario.id ? a.receptor_id : a.solicitante_id;
    const u = db.prepare("SELECT id, nombre, email, avatar, rol, baneado, fecha_nacimiento, ultima_actividad FROM users WHERE id = ?").get(otro);
    if (!u) return null;
    const ultimo = db.prepare(
      "SELECT id, remitente_id, contenido, creado_en FROM mensajes_chat WHERE (remitente_id=? AND destinatario_id=?) OR (remitente_id=? AND destinatario_id=?) ORDER BY id DESC LIMIT 1"
    ).get(req.usuario.id, otro, otro, req.usuario.id);
    const noLeidos = db.prepare(
      "SELECT COUNT(*) AS n FROM mensajes_chat WHERE remitente_id=? AND destinatario_id=? AND leido=0"
    ).get(otro, req.usuario.id).n;
    return {
      amistadId: a.id,
      tipo: a.tipo || "amistad",
      amigo: perfilCorto(u),
      baneado: u.baneado,
      ultimoMensaje: ultimo
        ? { ...ultimo, esMio: ultimo.remitente_id === req.usuario.id }
        : null,
      noLeidos
    };
  }).filter(Boolean).sort((x, y) => ((y.ultimoMensaje?.id || 0) - (x.ultimoMensaje?.id || 0)));
  res.json({
    pendientes: pendientes.map(p => ({ id: p.id, creado_en: p.creado_en, tipo: p.tipo || "amistad", nota: p.nota || "", usuario: perfilCorto(p) })),
    enviadas: enviadas.map(e => ({ id: e.id, creado_en: e.creado_en, tipo: e.tipo || "amistad", nota: e.nota || "", usuario: perfilCorto(e) })),
    contactos
  });
});

router.post("/amistades/solicitar-mensaje", requiereAuth, (req, res) => {
  const otro = Number((req.body || {}).receptor_id);
  const nota = String((req.body || {}).nota || "").trim().slice(0, 400);
  if (!otro || otro === req.usuario.id) return res.status(400).json({ error: "Destino inválido" });
  const objetivo = db.prepare("SELECT id, baneado FROM users WHERE id = ?").get(otro);
  if (!objetivo || objetivo.baneado) return res.status(404).json({ error: "Usuario no encontrado" });
  if (amigosEntre(req.usuario.id, otro))
    return res.json({ ok: true, estado: "aceptada", amistadId: amigosEntre(req.usuario.id, otro).id });
  const existente = db.prepare(
    "SELECT * FROM amistades WHERE (solicitante_id=? AND receptor_id=?) OR (solicitante_id=? AND receptor_id=?) LIMIT 1"
  ).get(req.usuario.id, otro, otro, req.usuario.id);
  if (existente) {
    if (existente.estado === "pendiente") {
      if (existente.receptor_id === req.usuario.id) {
        db.prepare("UPDATE amistades SET estado='aceptada', actualizado_en=datetime('now') WHERE id=?").run(existente.id);
        return res.json({ ok: true, estado: "aceptada", amistadId: existente.id });
      }
      return res.json({ ok: true, estado: "pendiente", amistadId: existente.id });
    }
    if (existente.estado === "rechazada") {
      db.prepare("UPDATE amistades SET estado='pendiente', tipo='mensaje', nota=?, actualizado_en=datetime('now') WHERE id=?").run(nota || null, existente.id);
      return res.json({ ok: true, estado: "pendiente", amistadId: existente.id });
    }
    return res.json({ ok: true, estado: "aceptada", amistadId: existente.id });
  }
  const amistadId = Number(db.prepare(
    "INSERT INTO amistades (solicitante_id, receptor_id, estado, tipo, nota) VALUES (?,?, 'pendiente', 'mensaje', ?)"
  ).run(req.usuario.id, otro, nota || null).lastInsertRowid);
  res.json({ ok: true, estado: "pendiente", amistadId, tipo: "mensaje" });
});

router.post("/amistades", requiereAuth, (req, res) => {
  const { usuario_id } = req.body || {};
  const otro = Number(usuario_id);
  if (!otro || otro === req.usuario.id) return res.status(400).json({ error: "Destino inválido" });
  const objetivo = db.prepare("SELECT id, baneado FROM users WHERE id = ?").get(otro);
  if (!objetivo || objetivo.baneado) return res.status(404).json({ error: "Usuario no encontrado" });
  if (amigosEntre(req.usuario.id, otro)) return res.json({ ok: true, estado: "aceptada", amistadId: amigosEntre(req.usuario.id, otro).id });
  const existente = db.prepare(
    "SELECT * FROM amistades WHERE (solicitante_id=? AND receptor_id=?) OR (solicitante_id=? AND receptor_id=?) LIMIT 1"
  ).get(req.usuario.id, otro, otro, req.usuario.id);
  let amistadId;
  if (existente) {
    amistadId = existente.id;
    if (existente.receptor_id === req.usuario.id && existente.estado === "pendiente") {
      db.prepare("UPDATE amistades SET estado='aceptada', actualizado_en=datetime('now') WHERE id=?").run(existente.id);
      return res.json({ ok: true, estado: "aceptada", amistadId });
    }
    if (existente.estado === "rechazada") {
      db.prepare("UPDATE amistades SET estado='pendiente', actualizado_en=datetime('now') WHERE id=?").run(existente.id);
    }
  } else {
    amistadId = Number(db.prepare(
      "INSERT INTO amistades (solicitante_id, receptor_id, estado) VALUES (?,?, 'pendiente')"
    ).run(req.usuario.id, otro).lastInsertRowid);
  }
  res.json({ ok: true, estado: "pendiente", amistadId });
});

router.post("/amistades/:id/responder", requiereAuth, (req, res) => {
  const a = db.prepare("SELECT * FROM amistades WHERE id = ?").get(Number(req.params.id));
  if (!a || a.receptor_id !== req.usuario.id)
    return res.status(404).json({ error: "Solicitud no encontrada" });
  const { aceptar } = req.body || {};
  if (aceptar) {
    db.prepare("UPDATE amistades SET estado='aceptada', actualizado_en=datetime('now') WHERE id=?").run(a.id);
    res.json({ ok: true, estado: "aceptada" });
  } else {
    db.prepare("DELETE FROM amistades WHERE id = ?").run(a.id);
    res.json({ ok: true, estado: "rechazada" });
  }
});

router.delete("/amistades/:id", requiereAuth, (req, res) => {
  const a = db.prepare("SELECT * FROM amistades WHERE id = ?").get(Number(req.params.id));
  if (!a || (a.solicitante_id !== req.usuario.id && a.receptor_id !== req.usuario.id))
    return res.status(404).json({ error: "Amistad no encontrada" });
  db.prepare("DELETE FROM amistades WHERE id = ?").run(a.id);
  db.prepare("DELETE FROM amistades WHERE solicitante_id = ? AND receptor_id = ?").run(a.receptor_id, a.solicitante_id);
  res.json({ ok: true });
});

router.get("/presencia", requiereAuth, (req, res) => {
  const filas = db.prepare(`
    SELECT * FROM amistades WHERE estado = 'aceptada' AND (solicitante_id = ? OR receptor_id = ?)
  `).all(req.usuario.id, req.usuario.id);
  const contacto = filas.map(a => {
    const otro = a.solicitante_id === req.usuario.id ? a.receptor_id : a.solicitante_id;
    const u = db.prepare("SELECT id, nombre, ultima_actividad FROM users WHERE id = ?").get(otro);
    if (!u) return null;
    return { id: u.id, nombre: u.nombre, online: estaEnLinea(u.ultima_actividad), ultima_actividad: u.ultima_actividad || undefined };
  }).filter(Boolean);
  res.json({ contacto });
});

router.post("/chat/mensajes", requiereAuth, (req, res) => {
  const { destinatario_id, contenido } = req.body || {};
  const otro = Number(destinatario_id);
  const texto = String(contenido || "").trim();
  if (!otro || !texto) return res.status(400).json({ error: "Mensaje vacío" });
  if (texto.length > 2000) return res.status(400).json({ error: "Mensaje demasiado largo" });
  const objetivo = db.prepare("SELECT id, baneado FROM users WHERE id = ?").get(otro);
  if (!objetivo || objetivo.baneado) return res.status(404).json({ error: "Usuario no encontrado" });
  if (!amigosEntre(req.usuario.id, otro))
    return res.status(403).json({ error: "Solo puedes escribir a tus amistades" });
  const info = db.prepare(
    "INSERT INTO mensajes_chat (remitente_id, destinatario_id, contenido) VALUES (?,?,?)"
  ).run(req.usuario.id, otro, texto);
  const m = db.prepare("SELECT * FROM mensajes_chat WHERE id = ?").get(info.lastInsertRowid);
  res.json({ ok: true, mensaje: m });
});

router.get("/chat/:otroId/mensajes", requiereAuth, (req, res) => {
  const otro = Number(req.params.otroId);
  const u = db.prepare("SELECT id, nombre, email, avatar, rol, baneado, fecha_nacimiento, ultima_actividad FROM users WHERE id = ?").get(otro);
  if (!u) return res.status(404).json({ error: "Usuario no encontrado" });
  if (!amigosEntre(req.usuario.id, otro))
    return res.status(403).json({ error: "No sois amistades" });
  const desde = Math.max(0, Number(req.query.desde) || 0);
  let filas;
  if (desde > 0) {
    filas = db.prepare(`
      SELECT * FROM mensajes_chat
      WHERE ((remitente_id=? AND destinatario_id=?) OR (remitente_id=? AND destinatario_id=?)) AND id > ?
      ORDER BY id ASC
    `).all(req.usuario.id, otro, otro, req.usuario.id, desde);
  } else {
    const ultimo = db.prepare(`
      SELECT id FROM mensajes_chat
      WHERE (remitente_id=? AND destinatario_id=?) OR (remitente_id=? AND destinatario_id=?)
      ORDER BY id DESC LIMIT 1
    `).get(req.usuario.id, otro, otro, req.usuario.id);
    const base = ultimo ? Math.max(0, ultimo.id - 149) : 0;
    filas = db.prepare(`
      SELECT * FROM mensajes_chat
      WHERE ((remitente_id=? AND destinatario_id=?) OR (remitente_id=? AND destinatario_id=?)) AND id > ?
      ORDER BY id ASC
    `).all(req.usuario.id, otro, otro, req.usuario.id, base);
  }
  db.prepare("UPDATE mensajes_chat SET leido = 1 WHERE remitente_id = ? AND destinatario_id = ? AND leido = 0")
    .run(otro, req.usuario.id);
  res.json({
    otro: perfilCorto(u),
    mensajes: filas,
    maxId: filas.length ? filas[filas.length - 1].id : desde
  });
});

router.get("/notificaciones", requiereAuth, (req, res) => {
  const solicitudes = db.prepare("SELECT COUNT(*) AS n FROM amistades WHERE receptor_id=? AND estado='pendiente'").get(req.usuario.id).n;
  const noLeidos = db.prepare("SELECT COUNT(*) AS n FROM mensajes_chat WHERE destinatario_id=? AND leido=0").get(req.usuario.id).n;
  const otras = db.prepare("SELECT COUNT(*) AS n FROM notificaciones WHERE user_id=? AND leido=0").get(req.usuario.id).n;
  const lista = db.prepare(
    "SELECT id, tipo, texto, enlace, leido, creado_en FROM notificaciones WHERE user_id=? ORDER BY id DESC LIMIT 20"
  ).all(req.usuario.id);
  res.json({ solicitudes, noLeidos, otras, lista });
});

router.post("/notificaciones/leer", requiereAuth, (req, res) => {
  db.prepare("UPDATE notificaciones SET leido = 1 WHERE user_id = ?").run(req.usuario.id);
  res.json({ ok: true });
});

module.exports = router;
