const path = require("path");
const fs = require("fs");
const express = require("express");
const session = require("express-session");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const compression = require("compression");
const morgan = require("morgan");
const cors = require("cors");

const cfg = require("./config/index.js");
const db = require("./database.js");

/* --------------------------------- app ---------------------------------- */
const app = express();

/* ----------------------------- seguridad -------------------------------- */
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://pagead2.googlesyndication.com", "https://www.googletagmanager.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      connectSrc: ["'self'", "https://oraculo1-hhwc.onrender.com"],
      frameSrc: ["'self'", "https://pagead2.googlesyndication.com"],
      mediaSrc: ["'self'", "blob:"],
      objectSrc: ["'none'"]
    }
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(cors({
  origin: cfg.ORIGEN_PUBLICO || true,
  credentials: true
}));

const GENERAL_LIMIT = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Demasiadas peticiones. Espera un momento." }
});

const AUTH_LIMIT = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Demasiados intentos. Espera 15 minutos." }
});

const AI_LIMIT = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Límite de peticiones IA alcanzado." }
});

app.use("/api/", GENERAL_LIMIT);
app.use("/api/registro", AUTH_LIMIT);
app.use("/api/login", AUTH_LIMIT);
app.use("/api/ia/", AI_LIMIT);

/* ----------------------------- compresión ------------------------------ */
app.use(compression({
  level: 6,
  threshold: 1024,
  filter: (req, res) => {
    if (req.headers["x-no-compression"]) return false;
    return compression.filter(req, res);
  }
}));

/* ------------------------------- logging ------------------------------- */
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev", {
  skip: (req, res) => req.url.includes("/uploads/")
}));

/* ---------------------------- body parsing ----------------------------- */
app.set("trust proxy", 1);
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

/* -------------------------------- sesiones ----------------------------- */
app.use(session({
  secret: cfg.SECRETO,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 3600 * 1000
  }
}));

/* ----------------------------- archivos estáticos ---------------------- */
fs.mkdirSync(cfg.UPLOADS, { recursive: true });

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

app.use("/vendor", express.static(path.join(__dirname, "node_modules")));
app.use(ESTATICO);
app.use("/uploads", express.static(cfg.UPLOADS));

/* -------------------------------- rutas -------------------------------- */
const auth = require("./routes/auth.js");
const postsRoutes = require("./routes/posts.js");
const socialRoutes = require("./routes/social.js");
const adminRoutes = require("./routes/admin.js");
const iaRoutes = require("./routes/ia.js");
const horoscopoRoutes = require("./routes/horoscopo.js");
const userRoutes = require("./routes/user.js");

app.use("/api", auth.api);
app.use("/api", postsRoutes);
app.use("/api", socialRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/ia", iaRoutes);
app.use("/api/horoscopo", horoscopoRoutes);
app.use("/api", userRoutes);

app.use("/auth", auth.oauth);

/* ----------------------------- errores --------------------------------- */
app.use((req, res, next) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

app.use((err, req, res, next) => {
  console.error("[ERROR]", err.message);
  if (err.type === "entity.too.large") {
    return res.status(413).json({ error: "Archivo demasiado grande" });
  }
  res.status(500).json({ error: "Error interno del servidor" });
});

/* --------------------------------- start ------------------------------- */
app.listen(cfg.PUERTO, () => {
  console.log(`✦ Oráculo corriendo en  http://localhost:${cfg.PUERTO}`);
  console.log(`✦ Seguridad: Helmet ✓ | Rate-Limit ✓ | CORS ✓ | Compression ✓ | Morgan ✓`);
});