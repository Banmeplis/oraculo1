#!/usr/bin/env node
/* Sincroniza los artículos de producción (Render) hacia la BD local.
   Solo BAJA: inserta los artículos NUEVOS que no existan por título local.
   No modifica los artículos ya existentes (respeto el trabajo local) y la
   BD de producción nunca se toca: la lectura es de solo lectura.

   Modos:
   1. Con token (preferido): /api/admin/sync/posts trae cuerpo y comentarios
      en una sola petición protegida.
   2. Sin token desplegado: cae a las rutas públicas /api/posts y
      /api/posts/:id para revisar igualmente si hay artículos nuevos. */

const cfg = require("../config/index.js");
const db = require("../database.js");

/* --------------------------------- helpers ------------------------------- */

function buscarAutor(autorEmail, autorNombre) {
  if (autorEmail) {
    const u = db.prepare("SELECT id FROM users WHERE lower(email) = lower(?) LIMIT 1").get(autorEmail);
    if (u) return u.id;
  }
  if (autorNombre) {
    const u = db.prepare("SELECT id FROM users WHERE lower(nombre) = lower(?) LIMIT 1").get(autorNombre);
    if (u) return u.id;
  }
  const editorial =
    db.prepare("SELECT id FROM users WHERE lower(email) = lower(?) LIMIT 1").get("luna.arcania@oraculo.local") ||
    db.prepare("SELECT id FROM users WHERE rol = 'admin' ORDER BY id LIMIT 1").get();
  return editorial ? editorial.id : null;
}

function buscarUsuarioComentario(userEmail, autorNombre) {
  if (userEmail) {
    const u = db.prepare("SELECT id FROM users WHERE lower(email) = lower(?) LIMIT 1").get(userEmail);
    if (u) return u.id;
  }
  if (autorNombre) {
    const u = db.prepare("SELECT id FROM users WHERE lower(nombre) = lower(?) LIMIT 1").get(autorNombre);
    if (u) return u.id;
  }
  return null;
}

/* ------------------------- descarga desde producción --------------------- */

async function desdeToken() {
  if (!cfg.SYNC_TOKEN) return null;
  const url = cfg.SYNC_ORIGEN.replace(/\/+$/, "") + "/api/admin/sync/posts";
  const res = await fetch(url, {
    headers: { "x-sync-token": cfg.SYNC_TOKEN, accept: "application/json" }
  });
  if (res.status === 404 || res.status === 503) return null; // endpoint aún no desplegado → modo público
  if (res.status === 401) {
    const j = await res.json().catch(() => ({}));
    throw new Error("401 " + (j.error || "token no válido o divergente con el de Render"));
  }
  if (!res.ok) throw new Error("HTTP " + res.status);
  const j = await res.json();
  if (!Array.isArray(j.posts)) throw new Error("Respuesta inesperada del servidor");
  return { modo: "token", posts: j.posts, comentarios: j.comentarios || [] };
}

async function desdePublico() {
  const base = cfg.SYNC_ORIGEN.replace(/\/+$/, "");
  const lista = await fetch(base + "/api/posts").then(r => r.json());
  if (!Array.isArray(lista)) throw new Error("Respuesta inesperada de /api/posts");
  const posts = [], comentarios = [];
  for (const p of lista) {
    const det = await fetch(base + "/api/posts/" + p.id).then(r => r.json());
    if (det && Number.isInteger(det.id)) posts.push(det);
    const cm = await fetch(base + "/api/posts/" + p.id + "/comentarios")
      .then(r => r.json()).catch(() => []);
    if (Array.isArray(cm)) {
      for (const c of cm) comentarios.push({ ...c, post_id: p.id });
    }
  }
  return { modo: "público", posts, comentarios };
}

/* ------------------------------- aplicación ------------------------------ */

const existePost = db.prepare("SELECT id FROM posts WHERE titulo = ? LIMIT 1");
const insertarPost = db.prepare(
  "INSERT INTO posts (autor_id, titulo, resumen, cuerpo, portada, video, publicado, creado_en, actualizado) " +
  "VALUES (?,?,?,?,?,?,?,?,?)"
);
const existeComentario = db.prepare("SELECT 1 FROM comentarios WHERE post_id = ? AND autor = ? AND cuerpo = ? LIMIT 1");
const insertarComentario = db.prepare(
  "INSERT INTO comentarios (post_id, user_id, autor, cuerpo, creado_en) VALUES (?,?,?,?,?)"
);

function main() {
  (cfg.SYNC_TOKEN ? desdeToken() : Promise.resolve(null))
    .then(datos => datos || desdePublico())
    .then(({ modo, posts, comentarios }) => {
      const relac = new Map(); // id remoto de post → id local
      let nuevos = 0, coinciden = 0, sinAutor = 0;
      for (const p of posts) {
        if (!p || !p.titulo) continue;
        const t = String(p.titulo).trim();
        if (!t) continue;
        const local = existePost.get(t);
        if (local) { coinciden++; relac.set(p.id, local.id); continue; }
        const autor_id = buscarAutor(p.autor_email, p.autor);
        if (!autor_id) { sinAutor++; continue; }
        const info = insertarPost.run(
          autor_id, t, String(p.resumen || ""), String(p.cuerpo || ""),
          p.portada || null, p.video || null, p.publicado ? 1 : 0,
          p.creado_en || null, p.actualizado || null
        );
        relac.set(p.id, Number(info.lastInsertRowid));
        nuevos++;
      }

      let comentariosImportados = 0;
      for (const c of comentarios) {
        const destino = relac.get(c.post_id);
        if (!destino) continue; // solo importamos comentarios de post recién bajados
        if (!c.cuerpo) continue;
        const cuerpo = String(c.cuerpo).trim();
        if (!cuerpo) continue;
        if (existeComentario.get(destino, c.autor || "", cuerpo)) continue;
        insertarComentario.run(destino, buscarUsuarioComentario(c.user_email, c.autor), c.autor || "", cuerpo, c.creado_en || null);
        comentariosImportados++;
      }

      console.log(`✓ Artículos sincronizados (${modo}): ${nuevos} nuevos · ${coinciden} ya existentes · ${sinAutor} sin autor local · ${comentariosImportados} comentarios importados`);
      if (nuevos === 0) console.log("  No hay artículos nuevos en el sitio web.");
    })
    .catch(err => {
      console.error("✗ No se pudieron sincronizar artículos:", err.message);
      console.error("  Verifica que el sitio de producción esté activo.");
      process.exitCode = 1;
    });
}

main();