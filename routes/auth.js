const express = require("express");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const https = require("https");
const db = require("../database.js");
const cfg = require("../config/index.js");
const { rolEfectivo, usuarioActual, requerido, validarFechaNacimiento } = require("../middleware/auth.js");

const api = express.Router();
const oauth = express.Router();

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
  return cfg.ORIGEN_PUBLICO || (req.protocol + "://" + req.get("host"));
}

api.post("/registro", (req, res) => {
  const { nombre, email, password, fecha_nacimiento } = req.body || {};
  if (!requerido(nombre) || !requerido(email) || !requerido(password))
    return res.status(400).json({ error: "Completa nombre, correo y contraseña" });
  if (!requerido(fecha_nacimiento))
    return res.status(400).json({ error: "Pon tu fecha de nacimiento para despertar tu signo en el Horóscopo Negro" });
  const errFecha = validarFechaNacimiento(fecha_nacimiento);
  if (errFecha) return res.status(400).json({ error: errFecha });
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
    "INSERT INTO users (nombre, email, password_hash, proveedor, rol, fecha_nacimiento) VALUES (?, ?, ?, 'local', ?, ?)"
  ).run(String(nombre).trim(), correo, hash, rol, String(fecha_nacimiento).trim());

  req.session.user = { id: Number(info.lastInsertRowid), nombre: String(nombre).trim(), email: correo, rol };
  res.json({ ok: true, user: req.session.user });
});

api.post("/login", (req, res) => {
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

api.post("/logout", (req, res) => {
  req.session.destroy(() => res.json({ ok: true }));
});

api.get("/sesion", (req, res) => {
  res.json({ user: usuarioActual(req) });
});

api.get("/auth/check", (req, res) => {
  const u = usuarioActual(req);
  if (u) {
    res.json({
      authenticated: true,
      user: {
        id: u.id, nombre: u.nombre, email: u.email, rol: u.rol,
        picture: u.picture || undefined,
        signo: u.signo || null,
        fecha_nacimiento: u.fecha_nacimiento || undefined
      }
    });
  } else {
    res.json({ authenticated: false });
  }
});

oauth.get("/google", (req, res) => {
  if (!cfg.GOOGLE.client_id)
    return res.redirect("/login.html?err=google-no-config");
  const url = "https://accounts.google.com/o/oauth2/v2/auth?" + new URLSearchParams({
    client_id: cfg.GOOGLE.client_id,
    redirect_uri: origen(req) + "/auth/google/callback",
    response_type: "code",
    scope: "openid email profile",
    prompt: "select_account",
    state: crypto.randomBytes(16).toString("hex")
  });
  res.redirect(url);
});

oauth.get("/google/callback", async (req, res) => {
  try {
    if (!cfg.GOOGLE.client_id || !cfg.GOOGLE.client_secret)
      return res.redirect("/login.html?err=google-no-config");
    if (!req.query.code) throw new Error("sin código");

    const tokens = await new Promise((res, rej) => {
      const data = new URLSearchParams({
        code: req.query.code,
        client_id: cfg.GOOGLE.client_id,
        client_secret: cfg.GOOGLE.client_secret,
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

module.exports = { api, oauth };