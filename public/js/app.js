/* ============================================================
   ORÁCULO · utilidades y navegación
   ============================================================ */

async function fetchJSON(url, opciones) {
  const r = await fetch(url, opciones);
  const d = await r.json().catch(() => ({ error: "Error de conexión" }));
  if (!r.ok) throw new Error(d.error || "Algo salió mal");
  return d;
}

function fechaLegible(valor) {
  if (!valor) return "";
  const fecha = new Date(String(valor).replace(" ", "T") + "Z");
  if (Number.isNaN(fecha.getTime())) return String(valor);
  return fecha.toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" });
}

function escapHtml(valor) {
  return String(valor ?? "").replace(/[&<>"']/g, caracter => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[caracter]));
}

function marcarComoHTML(texto) {
  const lineas = escapHtml(texto).replace(/\r/g, "").split("\n");
  const salida = [];
  let listaAbierta = false;

  const cerrarLista = () => {
    if (listaAbierta) { salida.push("</ul>"); listaAbierta = false; }
  };

  lineas.forEach(linea => {
    if (!linea.trim()) { cerrarLista(); return; }
    if (/^- /.test(linea)) {
      if (!listaAbierta) { salida.push("<ul>"); listaAbierta = true; }
      salida.push("<li>" + linea.slice(2) + "</li>");
      return;
    }
    cerrarLista();
    if (/^### /.test(linea)) salida.push("<h3>" + linea.slice(4) + "</h3>");
    else if (/^## /.test(linea)) salida.push("<h2>" + linea.slice(3) + "</h2>");
    else if (/^# /.test(linea)) salida.push("<h2>" + linea.slice(2) + "</h2>");
    else if (/^&gt; /.test(linea)) salida.push("<blockquote>" + linea.slice(5) + "</blockquote>");
    else {
      const imagen = linea.match(/^!\[([^\]]*)\]\((https?:\/\/[^\s)]+|\/[^\s)]+)\)$/);
      if (imagen) salida.push(`<img src="${imagen[2]}" alt="${imagen[1]}" loading="lazy">`);
      else salida.push("<p>" + linea
        .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
        .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>') + "</p>");
    }
  });
  cerrarLista();
  return salida.join("");
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

  async verificarAuth() {
    try {
      const data = await fetchJSON("/api/auth/check");
      if (data.authenticated) {
        const zona = document.getElementById("zona-usuario");
        if (zona) {
          zona.innerHTML = `
            <div class="user-menu">
              <img src="${data.user.picture || '/img/default-avatar.png'}" 
                   alt="${data.user.name}" 
                   class="user-avatar" 
                   onerror="this.style.display='none'"
                   style="width:32px;height:32px;border-radius:50%;margin-right:8px;">
              <span class="user-name">${data.user.name}</span>
              <a href="/logout" class="btn-logout" title="Cerrar sesión">Cerrar sesión</a>
            </div>
          `;
        }
      } else {
        const zona = document.getElementById("zona-usuario");
        if (zona) {
          zona.innerHTML = `
            <a href="/login.html" class="btn-nav">Iniciar sesión</a>
            <a href="/registro.html" class="btn-destacado">Crear cuenta</a>
          `;
        }
      }
    } catch (e) {
      console.error("Error verificando auth:", e);
      const zona = document.getElementById("zona-usuario");
      if (zona) zona.innerHTML = `<a href="/login.html">Iniciar sesión</a>`;
    }
  },

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
document.addEventListener("DOMContentLoaded", () => {
  crearCielo(70);
  SESION.cargar();
  SESION.verificarAuth();
  if (typeof precargarCartas === "function") precargarCartas();
});