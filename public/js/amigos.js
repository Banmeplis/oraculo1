/* ============================================================
   AMIGOS · EL CENDERO DE LOS AR🌙ANGELES
   Gestión de amistades; el chat vive en el widget flotante
   (chat-widget.js), abierto con CHAT.abrirCon(...)
   ============================================================ */

const AMIGOS = {
  yo: null,

  async iniciar() {
    try {
      const d = await fetchJSON("/api/sesion");
      if (!d.user) { location.href = "/login.html?redir=amigos"; return; }
      this.yo = d.user;
      document.getElementById("bienvenida-amigos").textContent =
        "Hola " + this.yo.nombre.split(" ")[0] + ", tu círculo te espera.";
    } catch { location.href = "/login.html?redir=amigos"; return; }
    this.eventos();
    await this.cargarAmistades();
    window.setInterval(() => this.cargarAmistades(true), 20000);
  },

  eventos() {
    document.querySelectorAll(".amigos-tab").forEach(b => b.addEventListener("click", () => {
      document.querySelectorAll(".amigos-tab").forEach(x => x.classList.remove("activo"));
      b.classList.add("activo");
      const t = b.dataset.tab;
      const esContactos = t === "contactos";
      document.getElementById("lista-contactos").classList.toggle("oculto", !esContactos);
      document.getElementById("vista-solicitudes").classList.toggle("oculto", t !== "solicitudes");
      document.getElementById("vista-buscar").classList.toggle("oculto", t !== "buscar");
      if (t === "buscar") document.getElementById("busqueda").focus();
    }));

    const busqueda = document.getElementById("busqueda");
    let temporizador = null;
    busqueda.addEventListener("input", () => {
      clearTimeout(temporizador);
      temporizador = setTimeout(() => this.buscar(), 350);
    });
    busqueda.addEventListener("keydown", (e) => { if (e.key === "Enter") this.buscar(); });
  },

  /* ------------------------------ amistades ----------------------------- */
  async cargarAmistades(silencioso) {
    try {
      const d = await fetchJSON("/api/amistades");
      this.renderContactos(d.contactos);
      this.renderSolicitudes(d.pendientes, d.enviadas);
      const nSolicitudes = d.pendientes.length;
      const badge = document.getElementById("cont-solicitudes");
      if (nSolicitudes > 0) { badge.textContent = nSolicitudes; badge.classList.remove("oculto"); }
      else badge.classList.add("oculto");
      if (typeof actualizarNotificaciones === "function") actualizarNotificaciones();
    } catch (e) {
      if (!silencioso) this.aviso(e.message, "error");
    }
  },

  renderContactos(contactos) {
    const caja = document.getElementById("lista-contactos");
    if (!contactos.length) {
      caja.innerHTML = '<p class="centrado" style="color:var(--lavanda-suave);font-size:.92rem">Aún no tienes amistades.<br>Busca personas con la pestaña 🔍.</p>';
      return;
    }
    caja.innerHTML = contactos.map(c => {
      const u = c.amigo;
      const meta = c.baneado
        ? '<span class="contacto-meta" style="color:#ff8095">cuenta suspendida</span>'
        : `<span class="contacto-meta">${c.ultimoMensaje ? (c.ultimoMensaje.esMio ? "Tú: " : "") + escapHtml(c.ultimoMensaje.contenido).split("\n")[0] : "Envía un mensaje"}</span>`;
      const badge = c.noLeidos > 0 ? `<span class="contacto-noleidos">${c.noLeidos}</span>` : "";
      return `
        <div class="contacto-item" data-chat="${u.id}">
          ${this.avatar(u)}
          <div class="contacto-datos">
            <div class="contacto-nombre">${escapHtml(u.nombre)} ${badge}</div>
            ${meta}
          </div>
        </div>`;
    }).join("");
    caja.querySelectorAll("[data-chat]").forEach(el => el.addEventListener("click", () => {
      const u = contactos.find(c => c.amigo.id === Number(el.dataset.chat));
      if (u) this.abrirChat(u.amigo);
    }));
  },

  renderSolicitudes(pendientes, enviadas) {
    const caja = document.getElementById("vista-solicitudes");
    let html = "";
    html += `<h3 style="margin-bottom:10px;font-size:1.05rem">Solicitudes recibidas</h3>`;
    if (pendientes.length) {
      html += pendientes.map(p => `
        <div class="resultado-busqueda">
          ${this.avatar(p.usuario)}
          <div class="contacto-datos">
            <div class="contacto-nombre">${escapHtml(p.usuario.nombre)}</div>
            <div class="contacto-meta">${escapHtml(p.usuario.email)}</div>
          </div>
          <div class="contacto-acciones">
            <button class="btn btn-dorado" data-aceptar="${p.id}">✓ Aceptar</button>
            <button class="btn btn-suave" data-rechazar="${p.id}">✕</button>
          </div>
        </div>`).join("");
    } else {
      html += '<p class="centrado" style="color:var(--lavanda-suave);font-size:.9rem">Sin solicitudes pendientes.</p>';
    }
    html += `<h3 style="margin:18px 0 10px;font-size:1.05rem">Solicitudes enviadas</h3>`;
    if (enviadas.length) {
      html += enviadas.map(e => `
        <div class="resultado-busqueda">
          ${this.avatar(e.usuario)}
          <div class="contacto-datos">
            <div class="contacto-nombre">${escapHtml(e.usuario.nombre)}</div>
            <div class="contacto-meta">${escapHtml(e.usuario.email)}</div>
          </div>
          <span class="solicitud-estado">Esperando ⏳</span>
          <button class="btn btn-suave" data-cancelar="${e.id}">Anular</button>
        </div>`).join("");
    } else {
      html += '<p class="centrado" style="color:var(--lavanda-suave);font-size:.9rem">No has enviado solicitudes.</p>';
    }
    caja.innerHTML = html;

    caja.querySelectorAll("[data-aceptar]").forEach(b => b.addEventListener("click", async () => {
      try {
        await fetchJSON("/api/amistades/" + b.dataset.aceptar + "/responder", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ aceptar: true }) });
        this.cargarAmistades();
      } catch (e) { this.aviso(e.message, "error"); }
    }));
    caja.querySelectorAll("[data-rechazar]").forEach(b => b.addEventListener("click", async () => {
      try {
        await fetchJSON("/api/amistades/" + b.dataset.rechazar + "/responder", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ aceptar: false }) });
        this.cargarAmistades();
      } catch (e) { this.aviso(e.message, "error"); }
    }));
    caja.querySelectorAll("[data-cancelar]").forEach(b => b.addEventListener("click", async () => {
      try {
        await fetchJSON("/api/amistades/" + b.dataset.cancelar, { method: "DELETE" });
        this.cargarAmistades();
      } catch (e) { this.aviso(e.message, "error"); }
    }));
  },

  /* ------------------------------- buscar -------------------------------- */
  async buscar() {
    const q = document.getElementById("busqueda").value.trim();
    const caja = document.getElementById("resultados-busqueda");
    if (!q) { caja.innerHTML = ""; return; }
    try {
      const d = await fetchJSON("/api/usuarios/buscar?q=" + encodeURIComponent(q));
      if (!d.resultados.length) {
        caja.innerHTML = '<p class="centrado" style="color:var(--lavanda-suave)">Nadie con ese nombre por ahora.</p>';
        return;
      }
      caja.innerHTML = d.resultados.map(u => {
        let accion = "";
        if (u.relacion === "nada")
          accion = '<button class="btn btn-dorado" data-agregar="' + u.id + '">➕ Agregar</button>';
        else if (u.relacion === "enviada")
          accion = '<span class="solicitud-estado">Solicitud enviada ⏳</span>';
        else if (u.relacion === "recibida")
          accion = '<button class="btn btn-dorado" data-amistad-aceptar="' + u.id + '">✓ Aceptar</button>';
        else
          accion = '<button class="btn btn-suave" data-conversar="' + u.id + '">💬 Conversar</button>';
        return `
          <div class="resultado-busqueda">
            ${this.avatar(u)}
            <div class="contacto-datos">
              <div class="contacto-nombre">${escapHtml(u.nombre)} ${u.master ? '<span style="color:var(--dorado)">★</span>' : ""}</div>
              <div class="contacto-meta">${escapHtml(u.email)}</div>
            </div>
            ${accion}
          </div>`;
      }).join("");

      caja.querySelectorAll("[data-agregar]").forEach(b => b.addEventListener("click", async () => {
        try {
          await fetchJSON("/api/amistades", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ usuario_id: Number(b.dataset.agregar) }) });
          this.buscar(); this.cargarAmistades();
        } catch (e) { this.aviso(e.message, "error"); }
      }));
      caja.querySelectorAll("[data-amistad-aceptar]").forEach(b => {
        b.addEventListener("click", async () => {
          try {
            const Us = d.resultados.find(x => x.id === Number(b.dataset.amistadAceptar));
            if (!Us) return;
            await fetchJSON("/api/amistades", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ usuario_id: Us.id }) });
            this.buscar(); this.cargarAmistades();
            this.abrirChat(Us);
          } catch (e) { this.aviso(e.message, "error"); }
        });
      });
      caja.querySelectorAll("[data-conversar]").forEach(b => b.addEventListener("click", () => {
        const Us = d.resultados.find(x => x.id === Number(b.dataset.conversar));
        if (Us) this.abrirChat(Us);
      }));
    } catch (e) { caja.innerHTML = '<div class="aviso error">' + e.message + '</div>'; }
  },

  /* --------------------------- abrir chat (burbuja) ----------------------- */
  abrirChat(u) {
    if (window.CHAT && typeof window.CHAT.abrirCon === "function") {
      window.CHAT.abrirCon(u);
    } else {
      this.aviso("El chat aún está cargando. Intenta de nuevo en un momento.", "error");
    }
  },

  avatar(u) {
    const inicial = escapHtml(String(u.nombre || "?").trim()[0] || "?");
    if (u.avatar) {
      return `<div class="contacto-avatar" style="overflow:hidden"><img src="${escapHtml(u.avatar)}" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:50%"></div>`;
    }
    return `<div class="contacto-avatar">${inicial}</div>`;
  },

  aviso(texto, tipo) {
    const a = document.getElementById("aviso-chat");
    if (!a) return;
    a.innerHTML = '<div class="aviso ' + (tipo || "ok") + '">' + texto + '</div>';
    clearTimeout(this._avisoTimer);
    this._avisoTimer = setTimeout(() => { a.innerHTML = ""; }, 5000);
  }
};

document.addEventListener("DOMContentLoaded", () => AMIGOS.iniciar());