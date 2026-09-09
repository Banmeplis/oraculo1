/* ============================================================
   AMIGOS Y CHAT · EL CENDERO DE LOS AR🌙ANGELES
   ============================================================ */

const AMIGOS = {
  yo: null,
  chatId: null,
  maxId: 0,
  intervaloChat: null,
  marcarNuevos: false,

  async iniciar() {
    try {
      const d = await fetchJSON("/api/sesion");
      if (!d.user) { location.href = "/login.html?redir=amigos"; return; }
      this.yo = d.user;
      document.getElementById("bienvenida-amigos").textContent =
        "Hola " + this.yo.nombre.split(" ")[0] + ", tu círculo te espera.";
    } catch { location.href = "/login.html?redir=amigos"; return; }
    this.dibujarTemas();
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

    /* emojis rápidos */
    document.querySelectorAll("#chat-emoji span").forEach(e => e.addEventListener("click", () => {
      const t = document.getElementById("chat-texto");
      t.value += e.textContent;
      t.focus();
    }));

    /* enviar con Enter (mayúsculas al finalizar), Shift+Enter para salto */
    const texto = document.getElementById("chat-texto");
    texto.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); this.enviarMensaje(); }
    });
    texto.addEventListener("input", () => {
      texto.style.height = "auto";
      texto.style.height = Math.min(texto.scrollHeight, 130) + "px";
    });

    document.getElementById("btn-enviar").addEventListener("click", () => this.enviarMensaje());

    /* búsqueda de personas */
    let temporizador = null;
    const busqueda = document.getElementById("busqueda");
    busqueda.addEventListener("input", () => {
      clearTimeout(temporizador);
      temporizador = setTimeout(() => this.buscar(), 350);
    });
    busqueda.addEventListener("keydown", (e) => { if (e.key === "Enter") this.buscar(); });

    /* tipo de letra del chat */
    document.getElementById("chat-fuente").addEventListener("change", (e) => {
      this.aplicarEstilo(null, e.target.value);
    });
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
        : `<span class="contacto-meta">${c.ultimoMensaje ? (c.ultimoMensaje.esMio ? "Tú: " : "") + escapHtml(c.ultimoMensaje.contenido).split("\n")[0] : "Enviad un mensaje"}</span>`;
      const badge = c.noLeidos > 0 ? `<span class="contacto-noleidos">${c.noLeidos}</span>` : "";
      return `
        <div class="contacto-item ${this.chatId === u.id ? "activo" : ""}" data-chat="${u.id}">
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
      caja.querySelectorAll("[data-conversar]").forEach(b => b.addEventListener("click", async () => {
        const Us = d.resultados.find(x => x.id === Number(b.dataset.conversar));
        if (Us) this.abrirChat(Us);
      }));
    } catch (e) { caja.innerHTML = '<div class="aviso error">' + e.message + '</div>'; }
  },

  /* -------------------------------- chat -------------------------------- */
  async abrirChat(u, refrescar) {
    this.chatId = u.id;
    this.chatNombre = u.nombre;
    document.getElementById("chat-nombre").textContent = u.nombre;
    document.getElementById("chat-estado").textContent = u.master ? "✦ Miembro del círculo ★" : "Miembro del círculo";
    const cab = document.getElementById("chat-cabecera");
    cab.querySelector(".contacto-avatar").outerHTML = this.avatar(u);
    ["chat-herramientas", "chat-emoji", "chat-entrada"].forEach(id => document.getElementById(id).classList.remove("oculto"));
    document.getElementById("chat-texto").disabled = false;

    this.aplicarEstilo(u.id);
    this.detenerPolling();
    this.renderContactosRefresco(u.id);

    const msj = document.getElementById("chat-mensajes");
    msj.innerHTML = "";
    this.maxId = 0;
    this.marcarNuevos = true;

    try {
      const d = await fetchJSON("/api/chat/" + u.id + "/mensajes");
      d.mensajes.forEach(m => this.renderBurbuja(m));
      this.maxId = d.maxId || 0;
    } catch (e) {
      msj.innerHTML = '<div class="aviso error">' + e.message + '</div>';
    }
    this.scrollAbajo();
    this.iniciarPolling();
    if (refrescar) this.cargarAmistades(true);
  },

  renderContactosRefresco(idActivo) {
    document.querySelectorAll("#lista-contactos .contacto-item").forEach(el => {
      el.classList.toggle("activo", Number(el.dataset.chat) === idActivo);
    });
  },

  async enviarMensaje() {
    const texto = document.getElementById("chat-texto");
    const contenido = texto.value.trim();
    if (!contenido || !this.chatId) return;
    const btn = document.getElementById("btn-enviar");
    btn.disabled = true;
    try {
      const d = await fetchJSON("/api/chat/mensajes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ destinatario_id: this.chatId, contenido })
      });
      texto.value = ""; texto.style.height = "auto";
      this.renderBurbuja(d.mensaje);
      this.maxId = d.mensaje.id;
      this.scrollAbajo();
    } catch (e) {
      this.aviso(e.message, "error");
    } finally {
      btn.disabled = false;
      texto.focus();
    }
  },

  iniciarPolling() {
    this.detenerPolling();
    this.intervaloChat = setInterval(() => this.verNuevos(), 3500);
  },

  detenerPolling() {
    if (this.intervaloChat) { clearInterval(this.intervaloChat); this.intervaloChat = null; }
  },

  async verNuevos() {
    if (!this.chatId) return;
    try {
      const d = await fetchJSON("/api/chat/" + this.chatId + "/mensajes?desde=" + this.maxId);
      if (d.mensajes.length) {
        const msj = document.getElementById("chat-mensajes");
        if (this.marcarNuevos) {
          msj.insertAdjacentHTML("beforeend", '<div class="sep-nuevos">✨ mensajes nuevos</div>');
          this.marcarNuevos = false;
        }
        d.mensajes.forEach(m => this.renderBurbuja(m));
        this.maxId = d.maxId || this.maxId;
        this.scrollAbajo();
        this.cargarAmistades(true);
      }
    } catch { /* silencioso */ }
  },

  renderBurbuja(m) {
    const esMia = m.remitente_id === this.yo.id;
    const autor = esMia ? "Tú" : (this.chatNombre || "Amigo");
    const burbuja = `
      <div class="burbuja ${esMia ? "mia" : "suya"}">
        ${esMia ? "" : `<div class="autor">${escapHtml(autor)}</div>`}
        ${escapHtml(m.contenido).replace(/\n/g, "<br>")}
        <span class="hora">${this.hora(m.creado_en)}</span>
      </div>`;
    document.getElementById("chat-mensajes").insertAdjacentHTML("beforeend", burbuja);
  },

  scrollAbajo() {
    const c = document.getElementById("chat-mensajes");
    c.scrollTop = c.scrollHeight;
  },

  hora(valor) {
    const f = new Date(String(valor || "").replace(" ", "T") + "Z");
    if (Number.isNaN(f.getTime())) return "";
    return f.toLocaleTimeString("es-VE", { hour: "2-digit", minute: "2-digit" }) + " · " +
      f.toLocaleDateString("es-ES", { day: "numeric", month: "short" });
  },

  avatar(u) {
    const inicial = escapHtml(String(u.nombre || "?").trim()[0] || "?");
    if (u.avatar) {
      return `<div class="contacto-avatar" style="overflow:hidden"><img src="${escapHtml(u.avatar)}" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:50%"></div>`;
    }
    return `<div class="contacto-avatar">${inicial}</div>`;
  },

  /* ------------------------- estilo premium del chat --------------------- */
  TEMAS: [
    { id: "aurora",  nombre: "Aurora",      css: "linear-gradient(135deg,#0e7490,#2b1055)" },
    { id: "dorado",  nombre: "Dorado real", css: "linear-gradient(135deg,#a88a2b,#231407)" },
    { id: "luna",    nombre: "Luna de plata", css: "linear-gradient(135deg,#3b4a9c,#101429)" },
    { id: "rosa",    nombre: "Rosa mística", css: "linear-gradient(135deg,#b83377,#2b1040)" },
    { id: "esmeralda", nombre: "Esmeralda", css: "linear-gradient(135deg,#0e8a62,#0c1f2e)" },
    { id: "neon",    nombre: "Neón sagrado", css: "linear-gradient(135deg,#a21caf,#0a1b2e)" }
  ],

  dibujarTemas() {
    const cont = document.getElementById("chat-temas");
    cont.innerHTML = this.TEMAS.map(t =>
      `<div class="chat-tema" data-tema="${t.id}" title="${t.nombre}" style="background:${t.css}"></div>`
    ).join("");
    cont.querySelectorAll(".chat-tema").forEach(d => d.addEventListener("click", () => {
      this.aplicarEstilo(null, null, d.dataset.tema);
    }));
  },

  leerEstilo(id) {
    try {
      const todo = JSON.parse(localStorage.getItem("oraculoChatEstilo") || "{}");
      return todo[id] || { tema: "aurora", fuente: "serifa" };
    } catch { return { tema: "aurora", fuente: "serifa" }; }
  },

  guardarEstilo(id, parcial) {
    try {
      const todo = JSON.parse(localStorage.getItem("oraculoChatEstilo") || "{}");
      todo[id] = { ...(todo[id] || { tema: "aurora", fuente: "serifa" }), ...parcial };
      localStorage.setItem("oraculoChatEstilo", JSON.stringify(todo));
    } catch {}
  },

  aplicarEstilo(id, fuente, tema) {
    const uso = this.chatId ? this.leerEstilo(this.chatId) : { tema: "aurora", fuente: "serifa" };
    if (tema) { uso.tema = tema; if (this.chatId) this.guardarEstilo(this.chatId, { tema }); }
    if (fuente) { uso.fuente = fuente; if (this.chatId) this.guardarEstilo(this.chatId, { fuente }); }
    const caja = document.getElementById("chat-caja");
    const msj = document.getElementById("chat-mensajes");
    const select = document.getElementById("chat-fuente");
    caja.className = caja.className.replace(/\bt-[a-z-]+/g, "").trim() + " t-" + uso.tema;
    msj.className = msj.className.replace(/\bf-[a-z-]+/g, "").trim() + " f-" + uso.fuente;
    if (select) select.value = uso.fuente;
    document.querySelectorAll("#chat-temas .chat-tema").forEach(d =>
      d.classList.toggle("activo", d.dataset.tema === uso.tema));
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