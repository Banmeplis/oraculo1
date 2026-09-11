const path = require("path");
const fs = require("fs");

/* Carga automática de .env en local (Node ≥20.12). */
try { process.loadEnvFile(path.join(__dirname, "..", ".env")); } catch {}

const CONFIG = (() => {
  try {
    return JSON.parse(fs.readFileSync(path.join(__dirname, "..", "config.json"), "utf-8"));
  } catch {
    return {};
  }
})();

module.exports = {
  PUERTO: process.env.PORT || 3000,
  UPLOADS: process.env.UPLOAD_DIR || path.join(__dirname, "..", "uploads"),
  DATA_DIR: process.env.DATA_DIR || path.join(__dirname, "..", "data"),
  SECRETO: process.env.SECRETO_SESION || CONFIG.secret || "oraculo-secreto-local-cambiar",
  MASTER_EMAIL: String(process.env.MASTER_EMAIL || "juanshinku@gmail.com").toLowerCase(),
  ORIGEN_PUBLICO: process.env.ORIGEN_PUBLICO || "",
  /* sincronización de usuarios de producción → BD local (pre-push hook) */
  SYNC_TOKEN: process.env.SYNC_TOKEN || (CONFIG.sync && CONFIG.sync_token) || "",
  SYNC_ORIGEN: process.env.SYNC_ORIGEN || "https://oraculo1-hhwc.onrender.com",
  GOOGLE: {
    client_id: process.env.GOOGLE_CLIENT_ID || (CONFIG.google && CONFIG.google.client_id) || "",
    client_secret: process.env.GOOGLE_CLIENT_SECRET || (CONFIG.google && CONFIG.google.client_secret) || ""
  },
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || "",
  OPENAI_MODEL: process.env.OPENAI_MODEL || "gpt-4o-mini",
  OPENAI_BASE_URL: (process.env.OPENAI_BASE_URL || "https://api.openai.com/v1").replace(/\/+$/, ""),
  HF_TOKEN: process.env.HF_TOKEN || "",
  HF_MODELOS: (process.env.HF_MODELOS || "mistralai/Mistral-7B-Instruct-v0.2,google/flan-t5-large,bigscience/bloom-560m")
    .split(",").map(m => m.trim()).filter(Boolean)
};
