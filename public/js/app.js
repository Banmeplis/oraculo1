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

/* Portadas de Unsplash: entrega srcset webp a 400/800/1200 px para que el
   móvil baje la versión justa (mucho menos tráfico y render más rápido). */
function portadaVaria(url, ancho) {
  return String(url)
    .replace(/(w=)\d+/, "$1" + ancho)
    .replace(/(q=)\d+/, "$1" + (ancho >= 1000 ? 60 : 75))
    .replace(/(auto=format)(?!&fm=)/, "$1&fm=webp");
}
function portadaImg(post, clases) {
  const u = post && post.portada;
  if (!u) return '<div class="portada" style="display:grid;place-items:center;font-size:2.4rem">✧</div>';
  const srcset = [400, 800, 1200].map(w => escapHtml(portadaVaria(u, w)) + " " + w + "w").join(", ");
  const sizes = "(max-width:640px) 94vw, (max-width:920px) 46vw, 32rem";
  const alt = escapHtml("Portada del artículo: " + (post.titulo || ""));
  return `<img class="portada ${clases || ""}" src="${escapHtml(u)}" srcset="${srcset}" sizes="${sizes}" alt="${alt}" loading="lazy" decoding="async">`;
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
    if (this._usuario) actualizarNotificaciones();
  },

  get usuario() { return this._usuario; },

  async verificarAuth() {
    try {
      const data = await fetchJSON("/api/auth/check");
      if (data.authenticated) {
        const u = data.user || {};
        const nombre = u.nombre || u.name || "Usuario";
        const inicial = escapHtml(String(nombre).trim()[0].toUpperCase() || "O");
        const avatar = u.picture ? `<img src="${escapHtml(String(u.picture))}" alt="" class="user-avatar" onerror="this.remove()" style="width:32px;height:32px;border-radius:50%;margin-right:8px;object-fit:cover;">` : `<span class="user-avatar-inicial">${inicial}</span>`;
        const zona = document.getElementById("zona-usuario");
        if (zona) {
          zona.innerHTML = `
            <div class="user-menu">
              ${avatar}
              <span class="user-name">${escapHtml(nombre)}</span>
              <a href="/amigos.html" class="btn-amigos" title="Amigos y chat" aria-label="Amigos y chat">💬<span class="amigo-badge oculto" id="amigo-badge">0</span></a>
              <a href="https://wa.me/593978874821" target="_blank" rel="noopener" class="btn-whatsapp" title="Escríbenos por WhatsApp" aria-label="WhatsApp">
                <svg class="wa-ico" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16.004 3.2c-7.06 0-12.8 5.741-12.8 12.8 0 2.258.59 4.468 1.697 6.42L3.2 28.8l6.438-1.683c1.872 1.029 4.109 1.683 6.366 1.683 7.06 0 12.8-5.74 12.8-12.8 0-7.06 5.74-12.8 12.8-12.8zm6.374 17.544c-.262.736-1.464 1.36-2.04 1.408-.543.048-1.2.066-1.936-.12-.423-.107-.966-.247-1.66-.485-2.91-1.003-4.806-3.354-4.95-3.508-.144-.154-1.182-1.571-1.182-2.998 0-1.426.748-2.127 1.014-2.418.266-.291.58-.364.773-.364.194 0 .388 0 .557.01.178.01.417-.067.653.5.242.582.82 2.003.894 2.148.073.145.122.315.024.509-.097.194-.145.315-.29.484-.145.17-.305.378-.436.507-.146.145-.297.302-.127.592.169.29.754 1.243 1.62 2.013 1.113.99 2.051 1.297 2.342 1.443.291.145.46.121.63-.073.17-.194.728-.85.921-1.142.194-.29.388-.242.654-.145.266.097 1.69.797 1.98.942.29.145.484.218.555.339.07.121.07.699-.192 1.435z"/></svg>
                <span>WhatsApp</span>
              </a>
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
            <a href="https://wa.me/593978874821" target="_blank" rel="noopener" class="btn-whatsapp" title="Escríbenos por WhatsApp" aria-label="WhatsApp">
              <svg class="wa-ico" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16.004 3.2c-7.06 0-12.8 5.741-12.8 12.8 0 2.258.59 4.468 1.697 6.42L3.2 28.8l6.438-1.683c1.872 1.029 4.109 1.683 6.366 1.683 7.06 0 12.8-5.74 12.8-12.8 0-7.06 5.74-12.8 12.8-12.8zm6.374 17.544c-.262.736-1.464 1.36-2.04 1.408-.543.048-1.2.066-1.936-.12-.423-.107-.966-.247-1.66-.485-2.91-1.003-4.806-3.354-4.95-3.508-.144-.154-1.182-1.571-1.182-2.998 0-1.426.748-2.127 1.014-2.418.266-.291.58-.364.773-.364.194 0 .388 0 .557.01.178.01.417-.067.653.5.242.582.82 2.003.894 2.148.073.145.122.315.024.509-.097.194-.145.315-.29.484-.145.17-.305.378-.436.507-.146.145-.297.302-.127.592.169.29.754 1.243 1.62 2.013 1.113.99 2.051 1.297 2.342 1.443.291.145.46.121.63-.073.17-.194.728-.85.921-1.142.194-.29.388-.242.654-.145.266.097 1.69.797 1.98.942.29.145.484.218.555.339.07.121.07.699-.192 1.435z"/></svg>
              <span>WhatsApp</span>
            </a>
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
          <a href="/amigos.html">Amigos<span class="amigo-badge oculto" id="amigo-badge">0</span></a>
          <a href="#" id="btn-salir">Salir</a>
          <a href="https://wa.me/593978874821" target="_blank" rel="noopener" class="btn-whatsapp" title="Escríbenos por WhatsApp" aria-label="WhatsApp">
            <svg class="wa-ico" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16.004 3.2c-7.06 0-12.8 5.741-12.8 12.8 0 2.258.59 4.468 1.697 6.42L3.2 28.8l6.438-1.683c1.872 1.029 4.109 1.683 6.366 1.683 7.06 0 12.8-5.74 12.8-12.8 0-7.06 5.74-12.8 12.8-12.8zm6.374 17.544c-.262.736-1.464 1.36-2.04 1.408-.543.048-1.2.066-1.936-.12-.423-.107-.966-.247-1.66-.485-2.91-1.003-4.806-3.354-4.95-3.508-.144-.154-1.182-1.571-1.182-2.998 0-1.426.748-2.127 1.014-2.418.266-.291.58-.364.773-.364.194 0 .388 0 .557.01.178.01.417-.067.653.5.242.582.82 2.003.894 2.148.073.145.122.315.024.509-.097.194-.145.315-.29.484-.145.17-.305.378-.436.507-.146.145-.297.302-.127.592.169.29.754 1.243 1.62 2.013 1.113.99 2.051 1.297 2.342 1.443.291.145.46.121.63-.073.17-.194.728-.85.921-1.142.194-.29.388-.242.654-.145.266.097 1.69.797 1.98.942.29.145.484.218.555.339.07.121.07.699-.192 1.435z"/></svg>
            <span>WhatsApp</span>
          </a>
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
          <a href="https://wa.me/593978874821" target="_blank" rel="noopener" class="btn-whatsapp" title="Escríbenos por WhatsApp" aria-label="WhatsApp">
            <svg class="wa-ico" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16.004 3.2c-7.06 0-12.8 5.741-12.8 12.8 0 2.258.59 4.468 1.697 6.42L3.2 28.8l6.438-1.683c1.872 1.029 4.109 1.683 6.366 1.683 7.06 0 12.8-5.74 12.8-12.8 0-7.06 5.74-12.8 12.8-12.8zm6.374 17.544c-.262.736-1.464 1.36-2.04 1.408-.543.048-1.2.066-1.936-.12-.423-.107-.966-.247-1.66-.485-2.91-1.003-4.806-3.354-4.95-3.508-.144-.154-1.182-1.571-1.182-2.998 0-1.426.748-2.127 1.014-2.418.266-.291.58-.364.773-.364.194 0 .388 0 .557.01.178.01.417-.067.653.5.242.582.82 2.003.894 2.148.073.145.122.315.024.509-.097.194-.145.315-.29.484-.145.17-.305.378-.436.507-.146.145-.297.302-.127.592.169.29.754 1.243 1.62 2.013 1.113.99 2.051 1.297 2.342 1.443.291.145.46.121.63-.073.17-.194.728-.85.921-1.142.194-.29.388-.242.654-.145.266.097 1.69.797 1.98.942.29.145.484.218.555.339.07.121.07.699-.192 1.435z"/></svg>
            <span>WhatsApp</span>
          </a>
        </nav>`;
    }
  }
};
/* ----------------------------- notificaciones --------------------------- */
async function actualizarNotificaciones() {
  const badges = document.querySelectorAll(".amigo-badge");
  badges.forEach(b => b.classList.add("oculto"));
  if (!SESION.usuario) return;
  try {
    const d = await fetchJSON("/api/notificaciones");
    const total = (d.solicitudes || 0) + (d.noLeidos || 0);
    badges.forEach(b => {
      if (total > 0) { b.textContent = total; b.classList.remove("oculto"); }
    });
  } catch {}
}

/* -------------------------------- fecha --------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  crearCielo(70);
  SESION.cargar();
  SESION.verificarAuth();
  setInterval(actualizarNotificaciones, 20000);
  if (typeof precargarCartas === "function") precargarCartas();
});