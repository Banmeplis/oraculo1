#!/usr/bin/env node
/* Sincroniza los usuarios de producción (Render) hacia la BD local.
   Lo ejecuta el gancho git pre-push antes de cada commit + push. */

const cfg = require("../config/index.js");
const db = require("../database.js");

function main() {
  if (!cfg.SYNC_TOKEN) {
    console.error("✗ Falta SYNC_TOKEN. Añádelo a tu .env local y pon el MISMO valor en las variables de entorno de Render (Environment → SYNC_TOKEN).");
    process.exitCode = 1;
    return;
  }

  const url = cfg.SYNC_ORIGEN.replace(/\/+$/, "") + "/api/admin/sync/usuarios";
  console.log(`↻ Sincronizando usuarios de ${cfg.SYNC_ORIGEN} ...`);

  fetch(url, {
    headers: {
      "x-sync-token": cfg.SYNC_TOKEN,
      accept: "application/json"
    }
  }).then(async res => {
    if (res.status === 404)
      throw new Error("el sincronizador aún no está desplegado: haz push de esta versión a GitHub para que Render lo active");
    if (res.status === 401 || res.status === 503) {
      const j = await res.json().catch(() => ({}));
      throw new Error(`${res.status} ${j.error || "token no válido o no configurado"}`);
    }
    if (!res.ok) throw new Error("HTTP " + res.status);
    const j = await res.json();
    if (!Array.isArray(j.usuarios)) throw new Error("Respuesta inesperada del servidor");
    return j.usuarios;
  }).then(usuarios => {
    const master = cfg.MASTER_EMAIL;
    const existe = db.prepare("SELECT id FROM users WHERE lower(email) = lower(?) LIMIT 1");
    const insertar = db.prepare(
      "INSERT INTO users (nombre, email, rol, proveedor, avatar, bio, baneado, password_hash, creado_en, fecha_nacimiento, ultima_actividad) " +
      "VALUES (?,?,?,?,?,?,?,?,?,?,?)"
    );
    const actualizar = db.prepare(
      "UPDATE users SET nombre = ?, rol = ?, proveedor = ?, avatar = ?, bio = ?, baneado = ?, " +
      "password_hash = COALESCE(?, password_hash), fecha_nacimiento = ?, ultima_actividad = ? " +
      "WHERE id = ?"
    );

    let insertados = 0, actualizados = 0, omitidos = 0;
    for (const u of usuarios) {
      if (!u || !u.email) continue;
      if (String(u.email).toLowerCase() === master) { omitidos++; continue; }
      const reg = existe.get(u.email);
      if (!reg) {
        insertar.run(
          u.nombre || u.email, String(u.email).toLowerCase(), u.rol || "autor",
          u.proveedor || "local", u.avatar || null, u.bio || null, u.baneado ? 1 : 0,
          u.password_hash || null, u.creado_en || null, u.fecha_nacimiento || null,
          u.ultima_actividad || null
        );
        insertados++;
      } else {
        actualizar.run(
          u.nombre || u.email, u.rol || "autor", u.proveedor || "local",
          u.avatar || null, u.bio || null, u.baneado ? 1 : 0,
          u.password_hash || null, u.fecha_nacimiento || null, u.ultima_actividad || null,
          reg.id
        );
        actualizados++;
      }
    }
    console.log(`✓ Sincronización completa: ${insertados} nuevos · ${actualizados} actualizados · ${omitidos} omitidos (master)`);
  }).catch(err => {
    console.error("✗ No se pudo sincronizar usuarios:", err.message);
    console.error("  Verifica que el sitio de producción esté activo y que el token coincida.");
    process.exitCode = 1;
  });
}

main();