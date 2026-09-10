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
      const tabU = document.getElementById("tab-usuarios");
      if (tabU) tabU.classList.toggle("oculto", this.yo.rol !== "admin");
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
      document.getElementById("vista-usuarios").classList.toggle("oculto", t !== "usuarios");
      if (t === "buscar") document.getElementById("busqueda").focus();
      if (t === "usuarios") this.cargarUsuarios();
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
        : u.online
          ? '<span class="con-linea"><span class="presencia-dot on"></span> Conectada ahora</span>'
          : `<span class="contacto-meta">${c.ultimoMensaje ? (c.ultimoMensaje.esMio ? "Tú: " : "") + escapHtml(c.ultimoMensaje.contenido).split("\n")[0] : "Envía un mensaje"}</span>`;
      const badge = c.noLeidos > 0 ? `<span class="contacto-noleidos">${c.noLeidos}</span>` : "";
      return `
        <div class="contacto-item" data-chat="${u.id}">
          ${this.avatarConPresencia(u, 40)}
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
            <div class="contacto-nombre">${escapHtml(p.usuario.nombre)}
              <span class="solicitud-tipo ${p.tipo === "mensaje" ? "mensaje" : ""}">${p.tipo === "mensaje" ? "📨 Quiere comunicarse" : "⭐ Nueva amistad"}</span>
            </div>
            <div class="contacto-meta">${escapHtml(p.usuario.email)}</div>
            ${p.tipo === "mensaje" && p.nota ? `<div class="solicitud-nota">${escapHtml(p.nota)}</div>` : ""}
          </div>
          <div class="contacto-acciones">
            <button class="btn btn-dorado" data-aceptar="${p.id}">✓ ${p.tipo === "mensaje" ? "Abrir chat" : "Aceptar"}</button>
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
            <div class="contacto-nombre">${escapHtml(e.usuario.nombre)}
              <span class="solicitud-tipo ${e.tipo === "mensaje" ? "mensaje" : ""}">${e.tipo === "mensaje" ? "📨 Solicitud de mensaje" : "⭐ Solicitud de amistad"}</span>
            </div>
            <div class="contacto-meta">${escapHtml(e.usuario.email)}</div>
            ${e.tipo === "mensaje" && e.nota ? `<div class="solicitud-nota">${escapHtml(e.nota)}</div>` : ""}
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
        const p = pendientes.find(x => x.id === Number(b.dataset.aceptar));
        await fetchJSON("/api/amistades/" + b.dataset.aceptar + "/responder", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ aceptar: true }) });
        this.cargarAmistades();
        if (p && p.tipo === "mensaje" && p.usuario) this.abrirChat(p.usuario);
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
        const tipo = (u.solicitud && u.solicitud.tipo) || "amistad";
        let accion = "";
        if (u.relacion === "nada")
          accion = `
            <div style="display:flex;gap:6px;flex-wrap:wrap;justify-content:flex-end">
              <button class="btn btn-dorado" data-agregar="${u.id}">➕ Amistad</button>
              <button class="btn btn-suave" data-mensaje="${u.id}">📨 Mensaje</button>
            </div>`;
        else if (u.relacion === "enviada")
          accion = `<span class="solicitud-estado">${tipo === "mensaje" ? "Quieres escribirle 📨" : "Solicitud enviada ⏳"}</span>`;
        else if (u.relacion === "recibida")
          accion = `<button class="btn btn-dorado" data-amistad-aceptar="${u.id}">${tipo === "mensaje" ? "💬 Contestar" : "✓ Aceptar"}</button>`;
        else
          accion = `<button class="btn btn-suave" data-conversar="${u.id}">💬 Conversar</button>`;
        const nota = (u.relacion !== "nada" && u.solicitud && u.solicitud.nota)
          ? `<div class="solicitud-nota">${escapHtml(u.solicitud.nota)}</div>` : "";
        return `
          <div class="resultado-busqueda">
            ${this.avatar(u)}
            <div class="contacto-datos">
              <div class="contacto-nombre">${escapHtml(u.nombre)} ${u.master ? '<span style="color:var(--dorado)">★</span>' : ""}</div>
              <div class="contacto-meta">${escapHtml(u.email)}</div>
              ${nota}
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
      caja.querySelectorAll("[data-mensaje]").forEach(b => b.addEventListener("click", async () => {
        const u = d.resultados.find(x => x.id === Number(b.dataset.mensaje));
        if (!u) return;
        const nota = window.prompt("Escribe un breve mensaje para " + (u.nombre || "esa persona") + " (aparecerá como su solicitud de chat):", "");
        if (nota === null) return;
        try {
          const r = await fetchJSON("/api/amistades/solicitar-mensaje", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ receptor_id: u.id, nota }) });
          this.aviso(r.estado === "aceptada"
            ? "✨ ¡" + u.nombre + " ya os escribís! Se abrió el chat."
            : "📨 Solicitud de mensaje enviada a " + u.nombre + ".",
            "ok");
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

  /* ----------------------- usuarios registrados (master) ------------------ */
  async cargarUsuarios() {
    const caja = document.getElementById("vista-usuarios");
    if (!caja) return;
    caja.innerHTML = '<p class="centrado" style="color:var(--lavanda-suave)">Cargando…</p>';
    try {
      const lista = await fetchJSON("/api/admin/usuarios");
      const esMaster = this.yo && this.yo.master;
      caja.innerHTML = `
        <p class="usuarios-info">${esMaster
          ? "Ves a todos los registrados con su correo y contraseña (hash). Puedes reasignar contraseña, banear o cambiar rol."
          : "Panel de administración: banear, desbanear o cambiar el rol de cada usuari."}</p>
        <div style="overflow-x:auto">
        <table class="tabla-usuarios">
          <thead><tr>
            <th>Usuario</th><th>Correo</th>
            ${esMaster ? "<th>Contraseña (hash)</th>" : "<th>¿Pass?</th>"}
            <th>Rol</th><th>Posts</th><th>Estado</th><th>Acciones</th>
          </tr></thead>
          <tbody>
            ${lista.map(u => {
              const hash = u.password_hash || "";
              const corto = hash ? "…" + hash.slice(-28) : (u.proveedor === "google" ? "— Google —" : "sin contraseña");
              return `<tr>
                <td>${escapHtml(u.nombre)}${u.master ? ' <span style="color:var(--dorado)" title="Master">★</span>' : ""}</td>
                <td>${escapHtml(u.email)}</td>
                ${esMaster
                  ? `<td><span class="hash-pass" title="${escapHtml(hash)}">${escapHtml(corto || "null")}</span>
                     ${hash ? `<button class="btn-micro" data-copiar-hash="${u.id}">copiar</button>` : ""}</td>`
                  : `<td>${u.tienePassword ? "✔" : "—"}</td>`}
                <td>${escapHtml(u.rol)}</td>
                <td>${u.posts}</td>
                <td>${u.baneado ? '<span class="etiqueta-ban">🚫 baneado</span>' : '<span style="color:#6ee7a8">activo</span>'}</td>
                <td>
                  ${!u.master ? `
                    ${esMaster ? `<button class="btn-micro" data-pass="${u.id}" data-nombre="${escapHtml(u.nombre)}">🔑 Pass</button>` : ""}
                    ${u.rol === "admin" ? `<button class="btn-micro" data-rol="${u.id}" data-nuevo="autor">↘ autor</button>` : `<button class="btn-micro" data-rol="${u.id}" data-nuevo="admin">↗ admin</button>`}
                    <button class="btn-micro" data-ban="${u.id}" data-estado="${u.baneado ? 0 : 1}">${u.baneado ? "↺ desbanear" : "🚫 banear"}</button>
                  ` : '<span style="color:var(--dorado);font-size:.72rem">intocable</span>'}
                </td>
              </tr>`;
            }).join("")}
          </tbody>
        </table>
        </div>`;
      caja.querySelectorAll("[data-pass]").forEach(b => b.addEventListener("click", async () => {
        const nueva = window.prompt("Nueva contraseña para " + b.dataset.nombre + " (mín. 6 caracteres):", "");
        if (!nueva || nueva.length < 6) { this.aviso("Necesita al menos 6 caracteres", "error"); return; }
        try {
          const r = await fetchJSON("/api/admin/usuarios/" + b.dataset.pass + "/password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ nueva }) });
          this.aviso("🔑 Contraseña de " + r.nombre + " cambiada.<br><b>Nueva contraseña (muéstrala una sola vez): " + r.nueva + "</b>", "ok");
          this.cargarUsuarios();
        } catch (e) { this.aviso(e.message, "error"); }
      }));
      caja.querySelectorAll("[data-copiar-hash]").forEach(b => b.addEventListener("click", async () => {
        const u = lista.find(x => x.id === Number(b.dataset.copiarHash));
        if (u && u.password_hash) {
          try { await navigator.clipboard.writeText(u.password_hash); this.aviso("Hash copiado al portapapeles ✔", "ok"); } catch { this.aviso(u.password_hash, "ok"); }
        }
      }));
      caja.querySelectorAll("[data-rol]").forEach(b => b.addEventListener("click", async () => {
        try {
          const r = await fetchJSON("/api/admin/usuarios/" + b.dataset.rol + "/rol", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ rol: b.dataset.nuevo }) });
          this.aviso("Rol de " + r.nombre + " → " + r.rol + " ✔", "ok");
          this.cargarUsuarios();
        } catch (e) { this.aviso(e.message, "error"); }
      }));
      caja.querySelectorAll("[data-ban]").forEach(b => b.addEventListener("click", async () => {
        try {
          const r = await fetchJSON("/api/admin/usuarios/" + b.dataset.ban + "/ban", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ baneado: Number(b.dataset.estado) }) });
          this.aviso(r.baneado ? "🚫 " + r.nombre + " baneado" : "↺ " + r.nombre + " desbaneado", "ok");
          this.cargarUsuarios();
        } catch (e) { this.aviso(e.message, "error"); }
      }));
    } catch (e) { caja.innerHTML = '<p class="centrado" style="color:#ff8095">' + e.message + '</p>'; }
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

  avatarConPresencia(u, s) {
    const ajuste = (s ? `width:${s}px;height:${s}px;min-width:${s}px;` : "") + (u.avatar ? "overflow:hidden" : "");
    const a = this.avatar(u);
    if (!u.online) return a;
    return `<span class="contacto-presencia-av"${s ? ` style="${ajuste}"` : ""}>${a}<span class="presencia-dot on"></span></span>`;
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