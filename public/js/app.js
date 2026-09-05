/* ============================================================
   ORÁCULO · utilidades y navegación
   ============================================================ */

async function fetchJSON(url, opciones) {
  const r = await fetch(url, opciones);
  const d = await r.json().catch(() => ({ error: "Error de conexión" }));
  if (!r.ok) throw new Error(d.error || "Algo salió mal");
  return d;
}

/* ------------------------------- estrellas ----------------------------- */
function crearCielo(cantidad = 70) {
  if (document.querySelector(".cielo")) return;
  const cielo = document.createElement("div");
  cielo.className = "cielo";
  for (let i = 0; i < cantidad; i++) {
    const e = document.createElement("i");
    const size = Math.random() * 2.4 + 1;
    e.style.cssText = `
      left:${Math.random() * 100}%;
      top:${Math.random() * 100}%;
      width:${size}px; height:${size}px;
      --d:${(Math.random() * 4 + 3).toFixed(1)}s;
      --dd:${(Math.random() * 6).toFixed(1)}s;
    `;
    cielo.appendChild(e);
  }
  const orb = document.createElement("div");
  orb.className = "orbita";
  orb.style.cssText = `width:340px;height:340px;top:12%;left:-140px;background:rgba(147,112,219,.22);`;
  const orb2 = document.createElement("div");
  orb2.className = "orbita";
  orb2.style.cssText = `width:260px;height:260px;right:-90px;bottom:6%;background:rgba(212,175,55,.16);animation-delay:-7s;`;
  cielo.appendChild(orb);
  cielo.appendChild(orb2);
  document.body.prepend(cielo);
}

/* -------------------------------- sesión ------------------------------- */
const SESION = {
  _usuario: null,
  ini: null,

  async cargar() {
    try {
      const d = await fetchJSON("/api/sesion");
      this._usuario = d.user || null;
    } catch { this._usuario = null; }
    this.renderizar();
  },

  get usuario() { return this._usuario; },

  renderizar() {
    const zona = document.getElementById("zona-usuario");
    if (!zona) return;
    if (this._usuario) {
      const inicial = (this._usuario.nombre || "O").trim()[0].toUpperCase();
      zona.innerHTML = `
        <nav class="menu">
          <a href="/panel.html">Hola, ${this._usuario.nombre.split(" ")[0]} ✦</a>
          <a href="/perfil.html">Perfil</a>
          <a href="#" id="btn-salir">Salir</a>
        </nav>`;
      const b = document.getElementById("btn-salir");
      if (b) b.addEventListener("click", async (e) => {
        e.preventDefault();
        await fetchJSON("/api/logout", { method: "POST" });
        location.href = "/";
      });
    } else {
      zona.innerHTML = `
        <nav class="menu">
          <a href="/login.html">Iniciar sesión</a>
          <a href="/registro.html" class="destacado">Crear cuenta</a>
        </nav>`;
    }
  }
};

/* -------------------------------- fecha --------------------------------- */
function fechaLegible(iso) {
  if (!iso) return "";
  const f = new Date(iso.replace(" ", "T") + (iso.includes("Z") ? "" : "Z"));
  return f.toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" });
}

/* ------------------------------- markdown ------------------------------- */
function escapHtml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function marcarComoHTML(texto) {
  const lineas = texto.split(/\r?\n/);
  let html = "";
  let bloque = [];
  const cerrar = (tag) => { if (bloque.length) { html += "<" + tag + "><li>" + bloque.join("</li><li>") + "</li></" + tag + ">"; bloque = []; } };

  for (let l of lineas) {
    l = l.replace(/\s+$/, "");
    if (!l.trim()) { cerrar("ul"); html += "<br>"; continue; }

    if (/^```/.test(l.trim())) { cerrar("ul"); html += "<pre><code>"; continue; }

    const encabezado = l.match(/^(#{1,3})\s+(.*)/);
    if (encabezado) { cerrar("ul"); const nl = encabezado[1].length; html += "<h" + nl + ">" + enLinea(escapHtml(encabezado[2])) + "</h" + nl + ">"; continue; }

    const cita = l.match(/^\s*&gt;\s?/);
    if (l.trim().startsWith(">")) { cerrar("ul"); html += "<blockquote>" + enLinea(escapHtml(l.trim().slice(1))) + "</blockquote>"; continue; }

    const img = l.match(/^!\[(.*?)\]\((.*?)\)$/);
    if (img) { cerrar("ul"); html += `<img src="${escapHtml(img[2])}" alt="${escapHtml(img[1])}" loading="lazy">`; continue; }

    if (/^\s*[-*+]\s+/.test(l)) { bloque.push(enLinea(escapHtml(l.replace(/^\s*[-*+]\s+/, "")))); continue; }
    if (/^\s*\d+\.\s/.test(l)) { cerrar("ul"); bloque.push(enLinea(escapHtml(l.replace(/^\s*\d+\.\s/, "")))); html += "<ol><li>" + bloque[0] + "</li></ol>"; bloque = []; continue; }

    cerrar("ul");
    html += "<p>" + enLinea(escapHtml(l.trim())) + "</p>";
  }
  cerrar("ul");
  return html;
}

function enLinea(s) {
  s = s.replace(/\*\*(.+?)\*\*/g, '<span class="resaltar">$1</span>');
  s = s.replace(/\*(.+?)\*/g, "<em>$1</em>");
  s = s.replace(/(^|[^\w])(https?:\/\/[^\s]+)/g, '$1<a href="$2" target="_blank" rel="noopener">$2</a>');
  return s;
}

/* ------------------- precarga del mazo (arcanos mayores) ----------------- */
function precargarCartas() {
  try {
    if (!window.ORACULO || !ORACULO.mayores) return;
    const urls = ORACULO.mayores.map(c => c.img).filter(Boolean);
    const lanzar = () => {
      urls.forEach(u => {
        const img = new Image();
        img.decoding = "async";
        img.src = u;
      });
    };
    if ("requestIdleCallback" in window) requestIdleCallback(lanzar, { timeout: 2500 });
    else if (document.readyState === "complete") lanzar();
    else window.addEventListener("load", lanzar, { once: true });
  } catch { /* si algo falla, la carga normal sigue */ }
}

/* ------------------------------- inicializa ----------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  crearCielo(70);
  SESION.cargar();
  precargarCartas();
});