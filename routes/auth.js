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
  return res.status(503).json({ error: "El registro está temporalmente desactivado. Vuelve pronto." });
});

api.post("/login", (req, res) => {
  return res.status(503).json({ error: "El inicio de sesión está temporalmente desactivado. Vuelve pronto." });
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
  return res.redirect("/login.html?err=temporalmente-desactivado");
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