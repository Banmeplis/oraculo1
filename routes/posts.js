const express = require("express");
const db = require("../database.js");
const { requiereAuth, requerido, usuarioActual } = require("../middleware/auth.js");

const router = express.Router();

router.get("/mis-posts", requiereAuth, (req, res) => {
  const sql = req.usuario.rol === "admin"
    ? `SELECT p.id, p.titulo, p.publicado, p.creado_en, p.autor_id, u.nombre AS autor
       FROM posts p JOIN users u ON u.id = p.autor_id ORDER BY p.creado_en DESC`
    : `SELECT id, titulo, publicado, creado_en, autor_id FROM posts WHERE autor_id = ? ORDER BY creado_en DESC`;
  const rows = req.usuario.rol === "admin" ? db.prepare(sql).all() : db.prepare(sql).all(req.usuario.id);
  res.json(rows);
});

router.get("/posts", (req, res) => {
  const rows = db.prepare(`
    SELECT p.id, p.titulo, p.resumen, p.portada, p.video, p.creado_en,
           u.nombre AS autor, u.id AS autor_id
    FROM posts p JOIN users u ON u.id = p.autor_id
    WHERE p.publicado = 1 AND u.baneado = 0
    ORDER BY p.creado_en DESC
  `).all();
  res.json(rows);
});

router.get("/posts/:id", (req, res) => {
  const p = db.prepare(`
    SELECT p.*, u.nombre AS autor FROM posts p JOIN users u ON u.id = p.autor_id WHERE p.id = ?
  `).get(Number(req.params.id));
  if (!p) return res.status(404).json({ error: "Artículo no encontrado" });
  res.json(p);
});

router.post("/posts", requiereAuth, (req, res) => {
  const { titulo, resumen, cuerpo, portada, video, publicado } = req.body || {};
  if (!requerido(titulo)) return res.status(400).json({ error: "El título es obligatorio" });
  const info = db.prepare(
    "INSERT INTO posts (autor_id, titulo, resumen, cuerpo, portada, video, publicado) VALUES (?,?,?,?,?,?,?)"
  ).run(req.session.user.id, String(titulo).trim(), String(resumen || ""), String(cuerpo || ""),
        portada || null, video || null, publicado === false ? 0 : 1);
  res.json({ ok: true, id: Number(info.lastInsertRowid) });
});

router.put("/posts/:id", requiereAuth, (req, res) => {
  const p = db.prepare("SELECT * FROM posts WHERE id = ?").get(Number(req.params.id));
  if (!p) return res.status(404).json({ error: "No existe" });
  if (p.autor_id !== req.usuario.id && req.usuario.rol !== "admin")
    return res.status(403).json({ error: "No puedes editar esta publicación" });
  const { titulo, resumen, cuerpo, portada, video, publicado } = req.body || {};
  db.prepare(
    "UPDATE posts SET titulo=?, resumen=?, cuerpo=?, portada=?, video=?, publicado=?, actualizado=datetime('now') WHERE id=?"
  ).run(String(titulo ?? p.titulo), String(resumen ?? p.resumen), String(cuerpo ?? p.cuerpo),
        portada !== undefined ? portada : p.portada,
        video !== undefined ? video : p.video,
        publicado !== undefined ? (publicado ? 1 : 0) : p.publicado,
        p.id);
  res.json({ ok: true });
});

router.delete("/posts/:id", requiereAuth, (req, res) => {
  const p = db.prepare("SELECT * FROM posts WHERE id = ?").get(Number(req.params.id));
  if (!p) return res.status(404).json({ error: "No existe" });
  if (p.autor_id !== req.usuario.id && req.usuario.rol !== "admin")
    return res.status(403).json({ error: "No puedes eliminar esta publicación" });
  db.prepare("DELETE FROM posts WHERE id = ?").run(p.id);
  res.json({ ok: true });
});

router.get("/posts/:id/comentarios", (req, res) => {
  const rows = db.prepare(`
    SELECT c.id, c.user_id, c.autor, c.cuerpo, c.creado_en
    FROM comentarios c WHERE c.post_id = ?
    ORDER BY c.creado_en ASC
  `).all(Number(req.params.id));
  res.json(rows);
});

router.post("/posts/:id/comentarios", (req, res) => {
  const { cuerpo } = req.body || {};
  if (!requerido(cuerpo)) return res.status(400).json({ error: "Escribe un comentario" });
  const post = db.prepare("SELECT id, titulo, autor_id FROM posts WHERE id = ?").get(Number(req.params.id));
  if (!post) return res.status(404).json({ error: "Artículo no encontrado" });
  const u = usuarioActual(req);
  const autor = u ? u.nombre : "Anónimo";
  const user_id = u ? u.id : null;
  const info = db.prepare(
    "INSERT INTO comentarios (post_id, user_id, autor, cuerpo) VALUES (?,?,?,?)"
  ).run(post.id, user_id, autor, String(cuerpo).trim());
  if (post.autor_id && post.autor_id !== user_id) {
    db.prepare(
      "INSERT INTO notificaciones (user_id, tipo, texto, enlace) VALUES (?, 'comentario', ?, ?)"
    ).run(post.autor_id, `${autor} comentó en «${post.titulo}»`, `/articulo.html?id=${post.id}`);
  }
  res.json({ ok: true, id: Number(info.lastInsertRowid), autor });
});

router.delete("/comentarios/:id", requiereAuth, (req, res) => {
  const c = db.prepare("SELECT * FROM comentarios WHERE id = ?").get(Number(req.params.id));
  if (!c) return res.status(404).json({ error: "No encontrado" });
  if (c.user_id !== req.usuario.id && req.usuario.rol !== "admin")
    return res.status(403).json({ error: "No tienes permiso" });
  db.prepare("DELETE FROM comentarios WHERE id = ?").run(c.id);
  res.json({ ok: true });
});

module.exports = router;