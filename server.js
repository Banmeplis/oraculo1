const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const https = require("https");

const express = require("express");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const multer = require("multer");

const db = require("./database.js");

const app = express();
const PUERTO = process.env.PORT || 3000;

const UPLOADS = process.env.UPLOAD_DIR || path.join(__dirname, "uploads");
fs.mkdirSync(UPLOADS, { recursive: true });

/* ----------------------------- config Google ---------------------------- */
const CONFIG = (() => {
  try {
    return JSON.parse(fs.readFileSync(path.join(__dirname, "config.json"), "utf-8"));
  } catch {
    return {};
  }
})();
const GOOGLE = {
  client_id: process.env.GOOGLE_CLIENT_ID || (CONFIG.google && CONFIG.google.client_id) || "",
  client_secret: process.env.GOOGLE_CLIENT_SECRET || (CONFIG.google && CONFIG.google.client_secret) || ""
};
const SECRETO = process.env.SECRETO_SESION || CONFIG.secret || "oraculo-secreto-local-cambiar";

/* --------------------------------- server ------------------------------- */
app.set("trust proxy", 1); /* Render/Heroku sirven tras proxy HTTPS */

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: SECRETO,
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, maxAge: 7 * 24 * 3600 * 1000 }
}));

const ESTATICO = express.static(path.join(__dirname, "public"), {
  maxAge: "30d",
  immutable: true,
  setHeaders: (res, filePath) => {
    if (filePath.endsWith(".html")) {
      res.setHeader("Cache-Control", "no-cache");
    } else if (filePath.endsWith(".js") || filePath.endsWith(".css")) {
      res.setHeader("Cache-Control", "public, max-age=3600");
    }
  }
});
app.use(ESTATICO);
app.use("/uploads", express.static(UPLOADS));

/* ------------------------------ utilitarios ----------------------------- */
function usuarioActual(req) {
  return req.session.user || null;
}

function requiereAuth(req, res, next) {
  if (!req.session.user) return res.status(401).json({ error: "No has iniciado sesión" });
  next();
}

function requerido(v) {
  return v !== null && v !== undefined && String(v).trim() !== "";
}

/* ------------------------------ subida media ---------------------------- */
const almacen = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || "").toLowerCase() || ".img";
    cb(null, Date.now() + "-" + crypto.randomBytes(6).toString("hex") + ext);
  }
});
function filtroMedia(req, file, cb) {
  const imgs = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  const vids = ["video/mp4", "video/webm", "video/quicktime", "video/x-matroska"];
  if (imgs.includes(file.mimetype) || vids.includes(file.mimetype)) {
    file.tipoMedia = imgs.includes(file.mimetype) ? "imagen" : "video";
    return cb(null, true);
  }
  cb(new Error("Tipo de archivo no permitido"));
}
const subir = multer({
  storage: almacen,
  fileFilter: filtroMedia,
  limits: { fileSize: 80 * 1024 * 1024 }
});

/* --------------------------------- auth --------------------------------- */
app.post("/api/registro", (req, res) => {
  const { nombre, email, password } = req.body || {};
  if (!requerido(nombre) || !requerido(email) || !requerido(password))
    return res.status(400).json({ error: "Completa nombre, correo y contraseña" });
  if (String(password).length < 6)
    return res.status(400).json({ error: "La contraseña debe tener al menos 6 caracteres" });
  const correo = String(email).trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo))
    return res.status(400).json({ error: "Correo no válido" });

  const existe = db.prepare("SELECT id FROM users WHERE email = ?").get(correo);
  if (existe) return res.status(409).json({ error: "Ese correo ya está registrado" });

  const hash = bcrypt.hashSync(String(password), 10);
  const rol = db.prepare("SELECT COUNT(*) AS n FROM users").get().n === 0 ? "admin" : "autor";
  const info = db.prepare(
    "INSERT INTO users (nombre, email, password_hash, proveedor, rol) VALUES (?, ?, ?, 'local', ?)"
  ).run(String(nombre).trim(), correo, hash, rol);

  req.session.user = { id: Number(info.lastInsertRowid), nombre: String(nombre).trim(), email: correo, rol };
  res.json({ ok: true, user: req.session.user });
});

app.post("/api/login", (req, res) => {
  const { email, password } = req.body || {};
  if (!requerido(email) || !requerido(password))
    return res.status(400).json({ error: "Ingresa correo y contraseña" });
  const correo = String(email).trim().toLowerCase();
  const u = db.prepare("SELECT * FROM users WHERE email = ?").get(correo);
  if (!u || !u.password_hash || !bcrypt.compareSync(String(password), u.password_hash))
    return res.status(401).json({ error: "Correo o contraseña incorrectos" });

  req.session.user = { id: u.id, nombre: u.nombre, email: u.email, rol: u.rol };
  res.json({ ok: true, user: req.session.user });
});

app.post("/api/logout", (req, res) => {
  req.session.destroy(() => res.json({ ok: true }));
});

app.get("/api/sesion", (req, res) => {
  res.json({ user: usuarioActual(req) });
});

/* --------------------------------- Google -------------------------------- */
function getJSON(url) {
  return new Promise((res, rej) => {
    https.get(url, (r) => {
      let d = "";
      r.on("data", (c) => (d += c));
      r.on("end", () => {
        try { res(JSON.parse(d)); } catch { rej(new Error("respuesta inválida")); }
      });
    }).on("error", rej);
  });
}

function origen(req) {
  return process.env.ORIGEN_PUBLICO || (req.protocol + "://" + req.get("host"));
}

app.get("/auth/google", (req, res) => {
  if (!GOOGLE.client_id)
    return res.redirect("/login.html?err=google-no-config");
  const url = "https://accounts.google.com/o/oauth2/v2/auth?" + new URLSearchParams({
    client_id: GOOGLE.client_id,
    redirect_uri: origen(req) + "/auth/google/callback",
    response_type: "code",
    scope: "openid email profile",
    prompt: "select_account",
    state: crypto.randomBytes(16).toString("hex")
  });
  res.redirect(url);
});

app.get("/auth/google/callback", async (req, res) => {
  try {
    if (!GOOGLE.client_id || !GOOGLE.client_secret)
      return res.redirect("/login.html?err=google-no-config");
    if (!req.query.code) throw new Error("sin código");

    const tokens = await new Promise((res, rej) => {
      const data = new URLSearchParams({
        code: req.query.code,
        client_id: GOOGLE.client_id,
        client_secret: GOOGLE.client_secret,
        redirect_uri: origen(req) + "/auth/google/callback",
        grant_type: "authorization_code"
      }).toString();
      const rq = https.request("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded", "Content-Length": Buffer.byteLength(data) }
      }, (r) => {
        let d = "";
        r.on("data", (c) => (d += c));
        r.on("end", () => {
          try { const j = JSON.parse(d); j.access_token ? res(j) : rej(new Error(j.error || "token")); }
          catch { rej(new Error("token inválido")); }
        });
      });
      rq.write(data);
      rq.end();
    });

    const info = await getJSON("https://www.googleapis.com/oauth2/v2/userinfo?access_token=" + tokens.access_token);
    if (!info.email) throw new Error("sin correo de Google");

    const correo = String(info.email).toLowerCase();
    let u = db.prepare("SELECT * FROM users WHERE email = ?").get(correo);
    let rol = "autor";
    if (!u) {
      rol = db.prepare("SELECT COUNT(*) AS n FROM users").get().n === 0 ? "admin" : "autor";
      u = {
        id: Number(db.prepare(
          "INSERT INTO users (nombre, email, proveedor, rol) VALUES (?, ?, 'google', ?)"
        ).run(info.name || info.email.split("@")[0], correo, rol).lastInsertRowid)
      };
    }
    req.session.user = { id: u.id, nombre: u.nombre || info.name || "Oráculo", email: correo, rol: u.rol || rol };
    res.redirect("/tarot.html?bienvenido=google");
  } catch (e) {
    res.redirect("/login.html?err=google-error");
  }
});

/* --------------------------------- posts -------------------------------- */
app.get("/api/posts", (req, res) => {
  const rows = db.prepare(`
    SELECT p.id, p.titulo, p.resumen, p.portada, p.video, p.creado_en,
           u.nombre AS autor, u.id AS autor_id
    FROM posts p JOIN users u ON u.id = p.autor_id
    WHERE p.publicado = 1
    ORDER BY p.creado_en DESC
  `).all();
  res.json(rows);
});

app.get("/api/posts/:id", (req, res) => {
  const p = db.prepare(`
    SELECT p.*, u.nombre AS autor FROM posts p JOIN users u ON u.id = p.autor_id WHERE p.id = ?
  `).get(Number(req.params.id));
  if (!p) return res.status(404).json({ error: "Artículo no encontrado" });
  res.json(p);
});

app.post("/api/posts", requiereAuth, (req, res) => {
  const { titulo, resumen, cuerpo, portada, video, publicado } = req.body || {};
  if (!requerido(titulo)) return res.status(400).json({ error: "El título es obligatorio" });
  const info = db.prepare(
    "INSERT INTO posts (autor_id, titulo, resumen, cuerpo, portada, video, publicado) VALUES (?,?,?,?,?,?,?)"
  ).run(req.session.user.id, String(titulo).trim(), String(resumen || ""), String(cuerpo || ""),
        portada || null, video || null, publicado === false ? 0 : 1);
  res.json({ ok: true, id: Number(info.lastInsertRowid) });
});

app.put("/api/posts/:id", requiereAuth, (req, res) => {
  const p = db.prepare("SELECT * FROM posts WHERE id = ?").get(Number(req.params.id));
  if (!p) return res.status(404).json({ error: "No existe" });
  if (p.autor_id !== req.session.user.id && req.session.user.rol !== "admin")
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

app.delete("/api/posts/:id", requiereAuth, (req, res) => {
  const p = db.prepare("SELECT * FROM posts WHERE id = ?").get(Number(req.params.id));
  if (!p) return res.status(404).json({ error: "No existe" });
  if (p.autor_id !== req.session.user.id && req.session.user.rol !== "admin")
    return res.status(403).json({ error: "No puedes eliminar esta publicación" });
  db.prepare("DELETE FROM posts WHERE id = ?").run(p.id);
  res.json({ ok: true });
});

/* ------------------------------ admin: todos ---------------------------- */
app.get("/api/mis-posts", requiereAuth, (req, res) => {
  const sql = req.session.user.rol === "admin"
    ? `SELECT id, titulo, publicado, creado_en, autor_id FROM posts ORDER BY creado_en DESC`
    : `SELECT id, titulo, publicado, creado_en, autor_id FROM posts WHERE autor_id = ? ORDER BY creado_en DESC`;
  const rows = req.session.user.rol === "admin" ? db.prepare(sql).all() : db.prepare(sql).all(req.session.user.id);
  res.json(rows);
});

/* -------------------------------- subir -------------------------------- */
app.post("/api/subir", requiereAuth, subir.single("archivo"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No se recibió el archivo" });
  res.json({ url: "/uploads/" + req.file.filename, tipo: req.file.tipoMedia });
}, (err, req, res, next) => {
  res.status(400).json({ error: err.message || "Error al subir el archivo" });
});

/* ------------------------------- lecturas ------------------------------ */
app.get("/api/lecturas", requiereAuth, (req, res) => {
  const rows = db.prepare(
    "SELECT * FROM lecturas WHERE user_id = ? ORDER BY favorita DESC, creado_en DESC LIMIT 50"
  ).all(req.session.user.id);
  res.json(rows);
});

app.post("/api/lecturas", requiereAuth, (req, res) => {
  const { nombre, tirada, cartas, resultado } = req.body || {};
  const info = db.prepare(
    "INSERT INTO lecturas (user_id, nombre, tirada, cartas, resultado) VALUES (?,?,?,?,?)"
  ).run(req.session.user.id, String(nombre || "Lectura"), tirada || null,
        typeof cartas === "string" ? cartas : JSON.stringify(cartas || []),
        typeof resultado === "string" ? resultado : JSON.stringify(resultado || ""));
  res.json({ ok: true, id: Number(info.lastInsertRowid) });
});

app.delete("/api/lecturas/:id", requiereAuth, (req, res) => {
  db.prepare("DELETE FROM lecturas WHERE id = ? AND user_id = ?").run(Number(req.params.id), req.session.user.id);
  res.json({ ok: true });
});

app.put("/api/lecturas/:id/favorita", requiereAuth, (req, res) => {
  const row = db.prepare("SELECT * FROM lecturas WHERE id = ? AND user_id = ?").get(Number(req.params.id), req.session.user.id);
  if (!row) return res.status(404).json({ error: "No encontrada" });
  const nueva = row.favorita ? 0 : 1;
  db.prepare("UPDATE lecturas SET favorita = ? WHERE id = ?").run(nueva, row.id);
  res.json({ ok: true, favorita: nueva });
});

/* ----------------------------- comentarios ----------------------------- */
app.get("/api/posts/:id/comentarios", (req, res) => {
  const rows = db.prepare(`
    SELECT c.id, c.user_id, c.autor, c.cuerpo, c.creado_en
    FROM comentarios c WHERE c.post_id = ?
    ORDER BY c.creado_en ASC
  `).all(Number(req.params.id));
  res.json(rows);
});

app.post("/api/posts/:id/comentarios", (req, res) => {
  const { cuerpo } = req.body || {};
  if (!requerido(cuerpo)) return res.status(400).json({ error: "Escribe un comentario" });
  const post = db.prepare("SELECT id FROM posts WHERE id = ?").get(Number(req.params.id));
  if (!post) return res.status(404).json({ error: "Artículo no encontrado" });
  const u = usuarioActual(req);
  const autor = u ? u.nombre : "Anónimo";
  const user_id = u ? u.id : null;
  const info = db.prepare(
    "INSERT INTO comentarios (post_id, user_id, autor, cuerpo) VALUES (?,?,?,?)"
  ).run(post.id, user_id, autor, String(cuerpo).trim());
  res.json({ ok: true, id: Number(info.lastInsertRowid), autor });
});

app.delete("/api/comentarios/:id", requiereAuth, (req, res) => {
  const c = db.prepare("SELECT * FROM comentarios WHERE id = ?").get(Number(req.params.id));
  if (!c) return res.status(404).json({ error: "No encontrado" });
  if (c.user_id !== req.session.user.id && req.session.user.rol !== "admin")
    return res.status(403).json({ error: "No tienes permiso" });
  db.prepare("DELETE FROM comentarios WHERE id = ?").run(c.id);
  res.json({ ok: true });
});

/* -------------------------------- perfil ------------------------------- */
app.get("/api/perfil", requiereAuth, (req, res) => {
  const u = db.prepare("SELECT id, nombre, email, rol, avatar, bio, creado_en FROM users WHERE id = ?").get(req.session.user.id);
  if (!u) return res.status(404).json({ error: "Usuario no encontrado" });
  res.json(u);
});

app.put("/api/perfil", requiereAuth, (req, res) => {
  const { nombre, bio, avatar } = req.body || {};
  const u = db.prepare("SELECT * FROM users WHERE id = ?").get(req.session.user.id);
  if (!u) return res.status(404).json({ error: "No encontrado" });
  db.prepare("UPDATE users SET nombre=?, bio=?, avatar=? WHERE id=?").run(
    String(nombre ?? u.nombre).trim(),
    String(bio !== undefined ? bio : (u.bio || "")),
    avatar !== undefined ? (avatar || null) : u.avatar,
    u.id
  );
  req.session.user.nombre = String(nombre ?? u.nombre).trim();
  res.json({ ok: true });
});

app.put("/api/perfil/password", requiereAuth, (req, res) => {
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

/* --------------------------------- webapp ------------------------------- */
app.listen(PUERTO, () => {
  console.log("✦ Oráculo corriendo en  http://localhost:" + PUERTO);
});