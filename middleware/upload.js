const path = require("path");
const crypto = require("crypto");
const multer = require("multer");
const cfg = require("../config/index.js");

const almacen = multer.diskStorage({
  destination: (req, file, cb) => cb(null, cfg.UPLOADS),
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

module.exports = { subir };
