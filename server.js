const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const https = require("https");
const zlib = require("zlib");

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

/* Correo del usuario "master": siempre tiene rol admin y control total. */
const MASTER_EMAIL = String(process.env.MASTER_EMAIL || "juanshinku@gmail.com").toLowerCase();

/* Rol efectivo: el correo master jamás pierde el rol admin. */
function rolEfectivo(email, rol) {
  if (email && String(email).toLowerCase() === MASTER_EMAIL) return "admin";
  return rol || "autor";
}

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

/* ---- compresión anticipada (brotli/gzip) con caché en memoria ---- */
const TEXTO_MIME = {
  ".js": "application/javascript; charset=utf-8",
  ".mjs": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".svg": "image/svg+xml; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".webmanifest": "application/manifest+json"
};
const COMP_CACHE = new Map();
function comprimirAlVuelo(req, res, next) {
  if (req.method !== "GET" && req.method !== "HEAD") return next();
  const tipo = TEXTO_MIME[path.extname(req.path).toLowerCase()];
  if (!tipo) return next();
  const acepta = String(req.headers["accept-encoding"] || "");
  const br = acepta.includes("br");
  if (!br && !acepta.includes("gzip")) return next();

  let base;
  try {
    if (req.path.startsWith("/vendor/")) base = path.join(__dirname, "node_modules", req.path.slice(8));
    else if (req.path.startsWith("/uploads/")) return next();
    else base = path.join(__dirname, "public", req.path);
  } catch { return next(); }
  if (base.includes("..")) return next();
  let stat;
  try { stat = fs.statSync(base); } catch { return next(); }
  if (!stat.isFile()) return next();

  const clave = (br ? "br:" : "gz:") + req.path;
  let buf = COMP_CACHE.get(clave);
  if (!buf) {
    try {
      buf = br
        ? zlib.brotliCompressSync(fs.readFileSync(base), { params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 5 } })
        : zlib.gzipSync(fs.readFileSync(base), { level: 6 });
    } catch { return next(); }
    if (COMP_CACHE.size > 400) COMP_CACHE.clear();
    COMP_CACHE.set(clave, buf);
  }
  res.setHeader("Content-Type", tipo);
  res.setHeader("Content-Encoding", br ? "br" : "gzip");
  res.setHeader("Vary", "Accept-Encoding");
  res.setHeader("Content-Length", String(buf.length));
  res.setHeader("Cache-Control", extCache(req.path, tipo));
  res.end(buf);
}
function extCache(p, tipo) {
  if (tipo.includes("text/html")) return "no-cache";
  if (p.startsWith("/vendor/")) return "public, max-age=3600";
  return "public, max-age=2592000, immutable";
}
app.use(comprimirAlVuelo);
app.use("/vendor", express.static(path.join(__dirname, "node_modules")));
app.use(ESTATICO);
app.use("/uploads", express.static(UPLOADS));

/* ------------------------------ utilitarios ----------------------------- */
function usuarioActual(req) {
  if (!req.session.user) return null;
  const u = db.prepare("SELECT id, nombre, email, rol, avatar, baneado FROM users WHERE id = ?").get(req.session.user.id);
  if (!u || u.baneado) {
    req.session.user = null; /* usuario bloqueado o eliminado: se cierra su sesión */
    return null;
  }
  return {
    id: u.id,
    nombre: u.nombre,
    email: u.email,
    rol: rolEfectivo(u.email, u.rol),
    picture: req.session.user.picture || undefined,
    baneado: u.baneado
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

  const existe = db.prepare("SELECT id, baneado FROM users WHERE email = ?").get(correo);
  if (existe) return res.status(409).json({ error: "Ese correo ya está registrado" });

  const hash = bcrypt.hashSync(String(password), 10);
  const rol = db.prepare("SELECT COUNT(*) AS n FROM users").get().n === 0
    ? "admin"
    : rolEfectivo(correo, "autor");
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
  if (u.baneado)
    return res.status(403).json({ error: "Tu cuenta ha sido suspendida. Escribe a @juanshinku si crees que es un error." });

  req.session.user = { id: u.id, nombre: u.nombre, email: u.email, rol: rolEfectivo(u.email, u.rol) };
  res.json({ ok: true, user: req.session.user });
});

app.post("/api/logout", (req, res) => {
  req.session.destroy(() => res.json({ ok: true }));
});

app.get("/api/sesion", (req, res) => {
  res.json({ user: usuarioActual(req) });
});

app.get("/api/auth/check", (req, res) => {
  const u = usuarioActual(req);
  if (u) {
    res.json({ authenticated: true, user: { id: u.id, nombre: u.nombre, email: u.email, rol: u.rol, picture: u.picture || undefined } });
  } else {
    res.json({ authenticated: false });
  }
});

app.post("/api/ia/reflexion", async (req, res) => {
  try {
    const { cartas, tirada, area, usuario } = req.body || {};
    if (!cartas || !cartas.length) return res.status(400).json({ error: "No hay cartas" });

    // Preparamos el prompt con la información de la lectura
    const cartasDesc = cartas.map(c => `${c.nombre} ${c.invertido ? "(invertida)" : ""}`.trim()).join(", ");
    
    // Contexto del área
    const areaContext = {
      salud: "salud y cuerpo",
      amor: "relaciones y corazón", 
      trabajo: "carrera y finanzas",
      economia: "abundancia y recursos",
      mensajes: "señales y guía",
      bloqueo: "obstáculos y miedos",
      situacion: "circunstancias generales"
    }[area] || "tu situación";

    const prompt = `Soy un/a ${usuario ? usuario.nombre : "consultante"} y he sacado una tirada de ${tirada || "tarot"}. Las cartas son: ${cartasDesc}. 
    
    Estoy buscando orientación sobre ${areaContext}. 
    
    Por favor dame una reflexión profunda de máximo 3 líneas que una el significado de estas cartas con mi pregunta sobre ${areaContext}. Sé conciso, espiritual pero práctico. No uses estructura de lista, escribe un párrafo continuo.`;

    // Llamada a Hugging Face Inference API (nivel gratuito)
    const HF_TOKEN = process.env.HF_TOKEN || "hf_tu_token_aqui";
    const model = "facebook/bart-large-cnn"; // Modelo gratuito y efectivo para resúmenes
    
    const response = await fetch(`https://api.huggingface.co/models/${model}`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${HF_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ inputs: prompt, parameters: { max_new_tokens: 100, temperature: 0.7 } })
    });

    if (!response.ok) {
      // Si falla la API, usar fallback deterministic
      throw new Error("API error");
    }

    const result = await response.json();
    const reflexion = typeof result === "string" ? result : result.generated_text || result[0]?.summary_text || "";
    
    // Limpiar y formatear
    const limpia = reflexion.replace(/<[^>]+>/g, "").trim().slice(0, 300);
    
    res.json({ reflexion: limpia || fallbackReflexion(area, cartas.length) });

  } catch (e) {
    // Fallback: mensaje determinístico basado en las cartas
    res.json({ reflexion: fallbackReflexion(req.body?.area, req.body?.cartas?.length) });
  }
});

/* IA para la tirada "Pregunta al Oráculo": genera una respuesta escrita que
   contesta a la pregunta EXACTA del consultante, citándola y apoyándose en
   las cartas que salieron. Si no hay token o la API falla, devuelve ok:false
   y el cliente conserva su respuesta determinística. */
app.post("/api/ia/pregunta", async (req, res) => {
  try {
    const { pregunta, tema, cartas } = req.body || {};
    if (!pregunta) return res.status(400).json({ error: "Sin pregunta" });

    const HF_TOKEN = process.env.HF_TOKEN || "";
    if (!HF_TOKEN || HF_TOKEN === "hf_tu_token_aqui" || HF_TOKEN.includes("tu_token")) {
      return res.json({ ok: false, error: "sin token" });
    }

    const cartasDesc = (cartas || []).map((c, i) =>
      `${i + 1}. ${c.nombre}${c.invertido ? " (invertida)" : ""} — ${c.posicion || "posición"}: ${String(c.significado || "").slice(0, 220)}`
    ).join("\n") || "ninguna (no se enviaron cartas)";

    const prompt = `Eres el Oráculo de Zigurath y Anaia, un consejero espiritual que interpreta el tarot angelical para una persona que busca orientación. Hablas en español cálido, directo y práctico.

El consultante pregunta EXACTAMENTE esto: "${pregunta}"

El tema que pregunta es: ${tema || "su vida"}.

Las cartas que salieron (Arcanos Mayores), con su posición, son:
${cartasDesc}

Responde a ESA pregunta concreta y solo a ella, no a otra ni en general. Habla del tema exacto que pregunta. Si es una pregunta de sí o no, comienza tu respuesta con "sí" o "no" y explica por qué las cartas responden así. Si pregunta por un nombre o una persona, di qué muestran las cartas sobre esa persona. Cita la pregunta y justifica con las cartas.

Máximo 4 frases, en un solo párrafo, sin listas y sin encabezados.`;

    const modelos = (process.env.HF_MODELOS || "mistralai/Mistral-7B-Instruct-v0.2,google/flan-t5-large,bigscience/bloom-560m").split(",").map(m => m.trim()).filter(Boolean);
    let respuesta = "";
    for (const modelo of modelos) {
      try {
        const response = await fetch(`https://api.huggingface.co/models/${modelo}`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${HF_TOKEN}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ inputs: prompt, parameters: { max_new_tokens: 220, temperature: 0.7, return_full_text: false } })
        });
        if (!response.ok) continue;
        const result = await response.json();
        const texto = (typeof result === "string" ? result : result[0]?.generated_text || result.generated_text || "").trim();
        if (texto.length > 20) { respuesta = texto; break; }
      } catch { /* probar el siguiente modelo */ }
    }

    const limpia = respuesta.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim().slice(0, 520);
    if (!limpia) return res.json({ ok: false, error: "respuesta vacía" });
    res.json({ ok: true, respuesta: limpia });
  } catch (e) {
    res.json({ ok: false, error: "error" });
  }
});

/* Mensaje de fallback determinístico cuando la IA falla */
function fallbackReflexion(area, numCartas) {
  const bases = {
    salud: `Con ${numCartas} cartas, tu sanación está en proceso. Es momento de escuchar a tu cuerpo y liberar viejos patrones.`,
    amor: `Con ${numCartas} cartas, el amor busca fluir hacia ti. Mantén el corazón abierto y no temas recibir.`,
    trabajo: `Con ${numCartas} cartas, nuevas oportunidades están surgiendo. Mantén la mirada en tus metas.`,
    economia: `Con ${numCartas} cartas, el flujo abundante está alineándose. Administra con sabiduría.`,
    mensajes: `Con ${numCartas} cartas, las señales del universo están claras. Presta atención a las sincronías.`,
    bloqueo: `Con ${numCartas} cartas, los obstáculos tienen propósito. Son maestros que te ayudan a crecer.`,
    situacion: `Con ${numCartas} cartas, tu situación se revela con honestidad. Confía en el proceso.`
  };
  return (bases[area] || "Las cartas siempre hablan: escucha con el corazón.") + " Este es un mensaje de apoyo mientras se desarrolla tu lectura completa.";
}

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
    if (u && u.baneado)
      return res.redirect("/login.html?err=cuenta-suspendida");
    if (!u) {
      const n = db.prepare("SELECT COUNT(*) AS n FROM users").get().n;
      rol = n === 0 ? "admin" : rolEfectivo(correo, "autor");
      u = {
        id: Number(db.prepare(
          "INSERT INTO users (nombre, email, proveedor, rol) VALUES (?, ?, 'google', ?)"
        ).run(info.name || info.email.split("@")[0], correo, rol).lastInsertRowid)
      };
    }
    req.session.user = { id: u.id, nombre: u.nombre || info.name || "Oráculo", email: correo, rol: rolEfectivo(u.email, u.rol || rol), picture: info.picture };
    res.redirect("/tarot.html?bienvenid@s=google");
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
    WHERE p.publicado = 1 AND u.baneado = 0
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

app.delete("/api/posts/:id", requiereAuth, (req, res) => {
  const p = db.prepare("SELECT * FROM posts WHERE id = ?").get(Number(req.params.id));
  if (!p) return res.status(404).json({ error: "No existe" });
  if (p.autor_id !== req.usuario.id && req.usuario.rol !== "admin")
    return res.status(403).json({ error: "No puedes eliminar esta publicación" });
  db.prepare("DELETE FROM posts WHERE id = ?").run(p.id);
  res.json({ ok: true });
});

/* ------------------------------ admin: todos ---------------------------- */
app.get("/api/mis-posts", requiereAuth, (req, res) => {
  const sql = req.usuario.rol === "admin"
    ? `SELECT p.id, p.titulo, p.publicado, p.creado_en, p.autor_id, u.nombre AS autor
       FROM posts p JOIN users u ON u.id = p.autor_id ORDER BY p.creado_en DESC`
    : `SELECT id, titulo, publicado, creado_en, autor_id FROM posts WHERE autor_id = ? ORDER BY creado_en DESC`;
  const rows = req.usuario.rol === "admin" ? db.prepare(sql).all() : db.prepare(sql).all(req.usuario.id);
  res.json(rows);
});

/* ------------------------------ admin: usuarios ------------------------- */
app.get("/api/admin/usuarios", requiereAdmin, (req, res) => {
  const rows = db.prepare(`
    SELECT u.id, u.nombre, u.email, u.rol, u.avatar, u.bio, u.baneado, u.proveedor, u.creado_en,
           (SELECT COUNT(*) FROM posts p WHERE p.autor_id = u.id) AS posts
    FROM users u ORDER BY u.baneado DESC, u.id ASC
  `).all();
  res.json(rows.map(u => ({ ...u, master: u.email.toLowerCase() === MASTER_EMAIL })));
});

app.put("/api/admin/usuarios/:id/ban", requiereAdmin, (req, res) => {
  const objetivo = db.prepare("SELECT * FROM users WHERE id = ?").get(Number(req.params.id));
  if (!objetivo) return res.status(404).json({ error: "Usuario no encontrado" });
  if (objetivo.id === req.usuario.id)
    return res.status(400).json({ error: "No puedes banearte a ti mismo" });
  if (String(objetivo.email).toLowerCase() === MASTER_EMAIL)
    return res.status(400).json({ error: "El usuario master no puede ser baneado" });
  const { baneado } = req.body || {};
  db.prepare("UPDATE users SET baneado = ? WHERE id = ?").run(baneado ? 1 : 0, objetivo.id);
  res.json({ ok: true, baneado: baneado ? 1 : 0, nombre: objetivo.nombre });
});

app.put("/api/admin/usuarios/:id/rol", requiereAdmin, (req, res) => {
  const objetivo = db.prepare("SELECT * FROM users WHERE id = ?").get(Number(req.params.id));
  if (!objetivo) return res.status(404).json({ error: "Usuario no encontrado" });
  if (objetivo.id === req.usuario.id)
    return res.status(400).json({ error: "No puedes cambiarte el rol a ti mismo" });
  if (String(objetivo.email).toLowerCase() === MASTER_EMAIL)
    return res.status(400).json({ error: "El rol del usuario master es intocable" });
  const { rol } = req.body || {};
  if (!["autor", "admin"].includes(rol)) return res.status(400).json({ error: "Rol no válido" });
  db.prepare("UPDATE users SET rol = ? WHERE id = ?").run(rol, objetivo.id);
  res.json({ ok: true, rol, nombre: objetivo.nombre });
});

/* ------------------------------ amistades ------------------------------- */
/* Amistad aceptada entre dos usuarios (en cualquier dirección) */
function amigosEntre(a, b) {
  return db.prepare(
    "SELECT * FROM amistades WHERE estado='aceptada' AND ((solicitante_id=? AND receptor_id=?) OR (solicitante_id=? AND receptor_id=?)) LIMIT 1"
  ).get(a, b, b, a) || null;
}

function perfilCorto(u) {
  if (!u) return null;
  return { id: u.id, nombre: u.nombre, email: u.email, avatar: u.avatar || undefined, rol: u.rol, master: String(u.email).toLowerCase() === MASTER_EMAIL };
}

app.get("/api/usuarios/buscar", requiereAuth, (req, res) => {
  const q = String(req.query.q || "").trim().slice(0, 60);
  if (!q) return res.json({ resultados: [] });
  const filtro = `%${q.replace(/[%_]/g, " ")}%`;
  const rows = db.prepare(
    "SELECT id, nombre, email, avatar, rol FROM users WHERE id != ? AND baneado = 0 AND (nombre LIKE ? OR email LIKE ?) ORDER BY nombre LIMIT 20"
  ).all(req.usuario.id, filtro, filtro);
  res.json({
    resultados: rows.map(u => {
      const aceptada = amigosEntre(req.usuario.id, u.id);
      let relacion = "nada";
      if (aceptada) relacion = "amigos";
      else {
        const pendiente = db.prepare("SELECT * FROM amistades WHERE estado='pendiente' AND ((solicitante_id=? AND receptor_id=?) OR (solicitante_id=? AND receptor_id=?)) LIMIT 1").get(req.usuario.id, u.id, u.id, req.usuario.id);
        if (pendiente) relacion = pendiente.solicitante_id === req.usuario.id ? "enviada" : "recibida";
      }
      return { ...perfilCorto(u), relacion };
    })
  });
});

app.get("/api/amistades", requiereAuth, (req, res) => {
  const pendientes = db.prepare(`
    SELECT a.id, a.creado_en, u.id AS usuario_id, u.nombre, u.email, u.avatar, u.rol
    FROM amistades a JOIN users u ON u.id = a.solicitante_id
    WHERE a.receptor_id = ? AND a.estado = 'pendiente'
    ORDER BY a.creado_en DESC
  `).all(req.usuario.id);
  const enviadas = db.prepare(`
    SELECT a.id, a.creado_en, u.id AS usuario_id, u.nombre, u.email, u.avatar, u.rol
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
    const u = db.prepare("SELECT id, nombre, email, avatar, rol, baneado FROM users WHERE id = ?").get(otro);
    if (!u) return null;
    const ultimo = db.prepare(
      "SELECT id, remitente_id, contenido, creado_en FROM mensajes_chat WHERE (remitente_id=? AND destinatario_id=?) OR (remitente_id=? AND destinatario_id=?) ORDER BY id DESC LIMIT 1"
    ).get(req.usuario.id, otro, otro, req.usuario.id);
    const noLeidos = db.prepare(
      "SELECT COUNT(*) AS n FROM mensajes_chat WHERE remitente_id=? AND destinatario_id=? AND leido=0"
    ).get(otro, req.usuario.id).n;
    return {
      amistadId: a.id,
      amigo: perfilCorto(u),
      baneado: u.baneado,
      ultimoMensaje: ultimo
        ? { ...ultimo, esMio: ultimo.remitente_id === req.usuario.id }
        : null,
      noLeidos
    };
  }).filter(Boolean).sort((x, y) => ((y.ultimoMensaje?.id || 0) - (x.ultimoMensaje?.id || 0)));
  res.json({
    pendientes: pendientes.map(p => ({ id: p.id, creado_en: p.creado_en, usuario: perfilCorto(p) })),
    enviadas: enviadas.map(e => ({ id: e.id, creado_en: e.creado_en, usuario: perfilCorto(e) })),
    contactos
  });
});

app.post("/api/amistades", requiereAuth, (req, res) => {
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
      /* ellos nos pidieron: al pedirles nosotros se acepta automáticamente */
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

app.post("/api/amistades/:id/responder", requiereAuth, (req, res) => {
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

app.delete("/api/amistades/:id", requiereAuth, (req, res) => {
  const a = db.prepare("SELECT * FROM amistades WHERE id = ?").get(Number(req.params.id));
  if (!a || (a.solicitante_id !== req.usuario.id && a.receptor_id !== req.usuario.id))
    return res.status(404).json({ error: "Amistad no encontrada" });
  db.prepare("DELETE FROM amistades WHERE id = ?").run(a.id);
  db.prepare("DELETE FROM amistades WHERE solicitante_id = ? AND receptor_id = ?").run(a.receptor_id, a.solicitante_id);
  res.json({ ok: true });
});

/* --------------------------------- chat --------------------------------- */
app.post("/api/chat/mensajes", requiereAuth, (req, res) => {
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

app.get("/api/chat/:otroId/mensajes", requiereAuth, (req, res) => {
  const otro = Number(req.params.otroId);
  const u = db.prepare("SELECT id, nombre, email, avatar, rol, baneado FROM users WHERE id = ?").get(otro);
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

app.get("/api/notificaciones", requiereAuth, (req, res) => {
  const solicitudes = db.prepare("SELECT COUNT(*) AS n FROM amistades WHERE receptor_id=? AND estado='pendiente'").get(req.usuario.id).n;
  const noLeidos = db.prepare("SELECT COUNT(*) AS n FROM mensajes_chat WHERE destinatario_id=? AND leido=0").get(req.usuario.id).n;
  res.json({ solicitudes, noLeidos });
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
  if (c.user_id !== req.usuario.id && req.usuario.rol !== "admin")
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

/* --------------------------- contador de visitas ------------------------ */
app.get("/api/visita", (req, res) => {
  try {
    const row = db.prepare("SELECT total FROM visitas WHERE id = 1").get();
    res.json({ total: (row && row.total) || 0 });
  } catch (e) {
    res.json({ total: 0 });
  }
});

app.post("/api/visita", (req, res) => {
  try {
    db.prepare("UPDATE visitas SET total = total + 1, actualizado = datetime('now') WHERE id = 1").run();
    const row = db.prepare("SELECT total FROM visitas WHERE id = 1").get();
    res.json({ total: row.total });
  } catch (e) {
    res.status(500).json({ error: "No se pudo registrar la visita" });
  }
});

/* --------------------------------- webapp ------------------------------- */
app.listen(PUERTO, () => {
  console.log("✦ Oráculo corriendo en  http://localhost:" + PUERTO);
});