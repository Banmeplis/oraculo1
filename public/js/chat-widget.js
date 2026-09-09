/* ============================================================
   CHAT FLOTANTE (burbuja global) · EL CENDERO DE LOS AR🌙ANGELES
   Muestra la burbuja con quien hablaste o tu último mensaje;
   al pulsarla se despliega la conversación. En móvil, panel
   casi a pantalla completa.
   ============================================================ */
(function () {
  "use strict";

  const LS_ULTIMO = "oraculoChatUltimo";
  const LS_ESTILO = "oraculoChatEstilo";
  const TEMAS = [
    { id: "aurora",    nombre: "Aurora",       css: "linear-gradient(135deg,#0e7490,#2b1055)" },
    { id: "dorado",    nombre: "Dorado real",  css: "linear-gradient(135deg,#a88a2b,#231407)" },
    { id: "luna",      nombre: "Luna de plata",css: "linear-gradient(135deg,#3b4a9c,#101429)" },
    { id: "rosa",      nombre: "Rosa mística", css: "linear-gradient(135deg,#b83377,#2b1040)" },
    { id: "esmeralda", nombre: "Esmeralda",    css: "linear-gradient(135deg,#0e8a62,#0c1f2e)" },
    { id: "neon",      nombre: "Neón sagrado", css: "linear-gradient(135deg,#a21caf,#0a1b2e)" }
  ];

  let yo = null;
  let contactos = [];
  let pendientes = 0;
  let chatId = null;
  let chatNombre = "";
  let maxId = 0;
  let marcarNuevos = true;
  let timerPoll = null;
  let timerBadge = null;
  const ui = {};

  const $ = (id) => document.getElementById(id);

  function esc(v) {
    return String(v ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  function hora(v) {
    const f = new Date(String(v || "").replace(" ", "T") + "Z");
    if (Number.isNaN(f.getTime())) return "";
    return f.toLocaleTimeString("es-VE", { hour: "2-digit", minute: "2-digit" }) + " · " +
      f.toLocaleDateString("es-ES", { day: "numeric", month: "short" });
  }

  function avatar(u, s) {
    const inicial = esc(String(u.nombre || "?").trim()[0] || "?");
    const ajuste = (s ? `width:${s}px;height:${s}px;min-width:${s}px;` : "") + (u.avatar ? "overflow:hidden" : "");
    const attr = ajuste ? ` style="${ajuste}"` : "";
    if (u.avatar) {
      return `<div class="contacto-avatar"${attr}><img src="${esc(u.avatar)}" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:50%"></div>`;
    }
    return `<div class="contacto-avatar"${attr}>${inicial}</div>`;
  }

  function leerUltimo() {
    try { return JSON.parse(localStorage.getItem(LS_ULTIMO) || "null"); } catch { return null; }
  }
  function guardarUltimo(u) {
    try { localStorage.setItem(LS_ULTIMO, JSON.stringify({ id: u.id, nombre: u.nombre, avatar: u.avatar })); } catch {}
  }
  function leerEstilo() {
    try { return JSON.parse(localStorage.getItem(LS_ESTILO) || "{}"); } catch { return {}; }
  }
  function guardarEstilo(parcial) {
    try {
      if (!chatId) return;
      const todo = leerEstilo();
      todo[chatId] = { ...(todo[chatId] || { tema: "aurora", fuente: "serifa" }), ...parcial };
      localStorage.setItem(LS_ESTILO, JSON.stringify(todo));
    } catch {}
  }

  /* ------------------------------- montaje ------------------------------- */
  function montarDOM() {
    const div = document.createElement("div");
    div.innerHTML = `
      <div class="chat-widget" id="chat-widget">
        <div class="chat-panel oculto" id="chat-panel">
          <div class="chat-vista-lista" id="chat-vista-lista">
            <div class="chat-panel-titulo">
              <div class="chat-panel-titulo-info">✨ Amigos<small id="chat-lista-unread"></small></div>
              <button class="chat-panel-x" id="chat-cerrar" aria-label="Cerrar">✕</button>
            </div>
            <div class="chat-lista" id="chat-lista"></div>
            <a class="chat-link-amigos" href="/amigos.html">👥 Gestionar amistades →</a>
          </div>
          <div class="chat-vista-chat oculto" id="chat-vista-chat">
            <div class="chat-cabecera">
              <button class="chat-atras" id="chat-atras" aria-label="Ver lista de amigos">←</button>
              <div id="chat-cab-avatar"></div>
              <div style="min-width:0">
                <div class="chat-nombre" id="chat-cab-nombre"></div>
                <div class="chat-estado" id="chat-cab-estado">Miembro del círculo</div>
              </div>
              <div class="chat-herramientas">
                <select class="chat-fuente" id="chat-fuente" aria-label="Tipo de letra del chat">
                  <option value="serifa">Serifa ✒️</option>
                  <option value="manuscrita">Manuscrita 🌿</option>
                  <option value="romantica">Romántica 💝</option>
                  <option value="biografia">Biografía 📜</option>
                  <option value="mono">Consola ⌨️</option>
                </select>
                <div class="chat-temas" id="chat-temas" title="Tema de color"></div>
              </div>
            </div>
            <div class="chat-mensajes f-serifa" id="chat-mensajes"></div>
            <div class="chat-emoji" id="chat-emoji"></div>
            <div class="chat-entrada">
              <textarea id="chat-texto" rows="1" maxlength="2000" placeholder="Escribe un mensaje..." aria-label="Mensaje"></textarea>
              <button class="btn-enviar" id="chat-enviar" aria-label="Enviar mensaje">Enviar ✦</button>
            </div>
          </div>
        </div>
        <button class="chat-fab" id="chat-fab" aria-label="Abrir chat">
          <span class="chat-fab-avatar" id="chat-fab-avatar">💬</span>
          <span class="chat-fab-info">
            <span class="chat-fab-nombre" id="chat-fab-nombre">Amigos</span>
            <span class="chat-fab-preview" id="chat-fab-preview">Toca para abrir 💫</span>
          </span>
          <span class="amigo-badge oculto" id="chat-fab-badge">0</span>
        </button>
      </div>`;
    document.body.appendChild(div.firstElementChild);

    ui.fab = $("chat-fab");
    ui.fabAvatar = $("chat-fab-avatar");
    ui.fabNombre = $("chat-fab-nombre");
    ui.fabPreview = $("chat-fab-preview");
    ui.fabBadge = $("chat-fab-badge");
    ui.panel = $("chat-panel");
    ui.vistaLista = $("chat-vista-lista");
    ui.vistaChat = $("chat-vista-chat");
    ui.lista = $("chat-lista");
    ui.listaUnread = $("chat-lista-unread");
    ui.mensajes = $("chat-mensajes");
    ui.texto = $("chat-texto");

    ui.fab.addEventListener("click", alternarPanel);
    $("chat-cerrar").addEventListener("click", cerrarPanel);
    $("chat-atras").addEventListener("click", () => { irALista(); });
    $("chat-enviar").addEventListener("click", enviarMensaje);
    $("chat-fuente").addEventListener("change", (e) => { aplicarEstilo(null, e.target.value); });
    ui.texto.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); enviarMensaje(); }
    });
    ui.texto.addEventListener("input", () => {
      ui.texto.style.height = "auto";
      ui.texto.style.height = Math.min(ui.texto.scrollHeight, 130) + "px";
    });
    document.querySelectorAll("#chat-emoji span").forEach(sp => sp.addEventListener("click", () => {
      ui.texto.value += sp.textContent;
      ui.texto.focus();
    }));

    ui.panel.querySelector(".chat-cabecera").classList.add("t-" + estiloDe(chatId).tema);
    renderTemas();
    pintarLista();
  }

  function estiloDe(id) {
    const todo = leerEstilo();
    return todo[id] || { tema: "aurora", fuente: "serifa" };
  }

  function renderTemas() {
    const cont = $("chat-temas");
    cont.innerHTML = TEMAS.map(t => `<div class="chat-tema" data-tema="${t.id}" title="${t.nombre}" style="background:${t.css}"></div>`).join("");
    cont.querySelectorAll(".chat-tema").forEach(d => d.addEventListener("click", () => aplicarEstilo(d.dataset.tema)));
  }

  function aplicarEstilo(tema, fuente) {
    const est = estiloDe(chatId);
    if (tema) { est.tema = tema; guardarEstilo({ tema }); }
    if (fuente) { est.fuente = fuente; guardarEstilo({ fuente }); }
    const panel = ui.panel;
    panel.classList.remove("t-aurora", "t-dorado", "t-luna", "t-rosa", "t-esmeralda", "t-neon");
    panel.classList.add("t-" + est.tema);
    ui.mensajes.className = "chat-mensajes f-" + est.fuente;
    const select = $("chat-fuente");
    if (select) select.value = est.fuente;
    document.querySelectorAll("#chat-temas .chat-tema").forEach(d => d.classList.toggle("activo", d.dataset.tema === est.tema));
  }

  /* ------------------------------ contacto de la burbuja ------------------ */
  function contactoDestacado() {
    const conMsg = contactos.filter(c => c.ultimoMensaje);
    const conActivo = contactos.find(c => c.amigo.id === chatId);
    const fuente = conMsg.length ? conMsg[0] : (conActivo || contactos[0] || null);
    return fuente || null;
  }

  function actualizarFab() {
    const c = contactoDestacado();
    const total = pendientes + contactos.reduce((s, x) => s + (x.noLeidos || 0), 0);
    if (c) {
      ui.fabAvatar.innerHTML = avatar(c.amigo, 40);
      ui.fabNombre.textContent = c.amigo.nombre;
      ui.fabPreview.textContent = c.ultimoMensaje
        ? (c.ultimoMensaje.esMio ? "Tú: " : "") + c.ultimoMensaje.contenido.split("\n")[0]
        : "Sin mensajes aún";
    } else {
      ui.fabAvatar.innerHTML = "💬";
      ui.fabNombre.textContent = "Amigos";
      ui.fabPreview.textContent = "Toca para abrir 💫";
    }
    if (total > 0) { ui.fabBadge.textContent = total; ui.fabBadge.classList.remove("oculto"); }
    else ui.fabBadge.classList.add("oculto");
    ui.fab.classList.toggle("tiene-nuevos", total > 0);
  }

  function pintarLista() {
    const noLeidos = contactos.reduce((s, x) => s + (x.noLeidos || 0), 0);
    ui.listaUnread.textContent = noLeidos > 0 ? ` · ${noLeidos} sin leer` : "";
    if (!contactos.length) {
      ui.lista.innerHTML = `<div class="chat-vacio" style="min-height:120px"><p>Agrégale a tu círculo en<br><b>Amigos</b> para conversar.</p></div>`;
      return;
    }
    ui.lista.innerHTML = contactos.map(c => {
      const u = c.amigo;
      const badge = c.noLeidos > 0 ? `<span class="contacto-noleidos">${c.noLeidos}</span>` : "";
      const meta = c.baneado
        ? '<span class="contacto-meta" style="color:#ff8095">suspendida</span>'
        : `<span class="contacto-meta">${c.ultimoMensaje ? (c.ultimoMensaje.esMio ? "Tú: " : "") + esc(c.ultimoMensaje.contenido).split("\n")[0] : "Envía un mensaje"}</span>`;
      return `
        <div class="contacto-item ${u.id === chatId ? "activo" : ""}" data-amigo="${u.id}">
          ${avatar(u, 40)}
          <div class="contacto-datos">
            <div class="contacto-nombre">${esc(u.nombre)} ${badge}</div>
            ${meta}
          </div>
        </div>`;
    }).join("");
    ui.lista.querySelectorAll("[data-amigo]").forEach(el => {
      el.addEventListener("click", () => {
        const c = contactos.find(x => x.amigo.id === Number(el.dataset.amigo));
        if (c) abrirCon(c.amigo, true);
      });
    });
  }

  /* ------------------------------ contacto con alguien -------------------- */
  function abrirCon(amigo, desdeLista) {
    chatId = amigo.id;
    chatNombre = amigo.nombre;
    maxId = 0;
    marcarNuevos = true;
    guardarUltimo(amigo);
    document.getElementById("chat-cab-nombre").textContent = amigo.nombre;
    const cab = document.getElementById("chat-cab-avatar");
    cab.innerHTML = "";
    cab.insertAdjacentHTML("beforeend", avatar(amigo));
    cerrarVistaLista();
    aplicarEstilo();
    abrirPanelCompleto();
    cargarConversacion(desdeLista);
  }

  function cerrarVistaLista() {
    ui.vistaLista.classList.add("oculto");
    ui.vistaChat.classList.remove("oculto");
    ui.texto.disabled = false;
    ui.texto.focus();
  }

  function irALista() {
    detenerPoll();
    ui.vistaChat.classList.add("oculto");
    ui.vistaLista.classList.remove("oculto");
    pintarLista();
  }

  async function cargarConversacion(desdeLista) {
    ui.mensajes.innerHTML = "";
    try {
      const d = await fetchJSON("/api/chat/" + chatId + "/mensajes");
      d.mensajes.forEach(m => renderBurbuja(m));
      maxId = d.maxId || 0;
    } catch (e) {
      ui.mensajes.innerHTML = '<div class="aviso error">' + e.message + '</div>';
    }
    scrollAbajo();
    iniciarPoll();
    if (desdeLista) refrescarContactos();
  }

  function renderBurbuja(m) {
    const esMia = m.remitente_id === yo.id;
    const autor = esMia ? "Tú" : chatNombre;
    ui.mensajes.insertAdjacentHTML("beforeend", `
      <div class="burbuja ${esMia ? "mia" : "suya"}">
        ${esMia ? "" : `<div class="autor">${esc(autor)}</div>`}
        ${esc(m.contenido).replace(/\n/g, "<br>")}
        <span class="hora">${hora(m.creado_en)}</span>
      </div>`);
  }

  function scrollAbajo() { ui.mensajes.scrollTop = ui.mensajes.scrollHeight; }

  /* --------------------------------- panel -------------------------------- */
  function alternarPanel() {
    if (ui.panel.classList.contains("oculto")) {
      const persistente = contactos.find(c => c.amigo.id === chatId);
      if (chatId && persistente) { abrirCon(persistente.amigo, false); return; }
      abrirPanelCompleto();
    } else {
      cerrarPanel();
    }
  }

  function abrirPanelCompleto() {
    ui.panel.classList.remove("oculto");
    if (!ui.vistaChat.classList.contains("oculto")) iniciarPoll();
    else pintarLista();
  }

  function cerrarPanel() {
    ui.panel.classList.add("oculto");
    detenerPoll();
  }

  function iniciarPoll() {
    detenerPoll();
    timerPoll = setInterval(verNuevos, 3500);
  }
  function detenerPoll() {
    if (timerPoll) { clearInterval(timerPoll); timerPoll = null; }
  }

  async function verNuevos() {
    if (!chatId || ui.vistaLista.classList.contains("oculto") === false) return;
    try {
      const d = await fetchJSON("/api/chat/" + chatId + "/mensajes?desde=" + maxId);
      if (d.mensajes.length) {
        if (marcarNuevos) {
          ui.mensajes.insertAdjacentHTML("beforeend", '<div class="sep-nuevos">✨ mensajes nuevos</div>');
          marcarNuevos = false;
        }
        d.mensajes.forEach(m => renderBurbuja(m));
        maxId = d.maxId || maxId;
        scrollAbajo();
        refrescarContactos();
      }
    } catch { /* silencioso */ }
  }

  async function enviarMensaje() {
    const contenido = ui.texto.value.trim();
    if (!contenido || !chatId) return;
    const btn = $("chat-enviar");
    btn.disabled = true;
    try {
      const d = await fetchJSON("/api/chat/mensajes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ destinatario_id: chatId, contenido })
      });
      ui.texto.value = ""; ui.texto.style.height = "auto";
      renderBurbuja(d.mensaje);
      maxId = d.mensaje.id;
      scrollAbajo();
      guardarUltimo({ id: chatId, nombre: chatNombre });
    } catch (e) {
      const a = document.createElement("div");
      a.className = "aviso error";
      a.textContent = e.message;
      ui.panel.insertBefore(a, ui.panel.firstChild);
      setTimeout(() => a.remove(), 4000);
    } finally {
      btn.disabled = false;
      ui.texto.focus();
    }
  }

  /* -------------------------------- datos --------------------------------- */
  async function refrescarContactos() {
    try {
      const d = await fetchJSON("/api/amistades");
      contactos = d.contactos || [];
      pendientes = (d.pendientes || []).length;
      actualizarFab();
      if (!ui.vistaLista.classList.contains("oculto")) pintarLista();
      if (chatId) {
        const c = contactos.find(x => x.amigo.id === chatId);
        document.getElementById("chat-cab-nombre").textContent = c ? c.amigo.nombre : chatNombre;
      }
    } catch { /* silencioso */ }
  }

  /* --------------------------------- inicio ------------------------------- */
  async function iniciar() {
    try {
      const d = await fetchJSON("/api/sesion");
      if (!d.user) return;
      yo = d.user;
    } catch { return; }
    if (document.getElementById("chat-widget")) return;
    montarDOM();
    const ultimo = leerUltimo();
    if (ultimo) {
      /* Si el último amigo sigue siendo amigo, la burbuja apunta a esa charla */
      chatId = ultimo.id;
      chatNombre = ultimo.nombre;
    }
    await refrescarContactos();
    if (chatId) {
      const sigue = contactos.find(c => c.amigo.id === chatId);
      if (!sigue) { chatId = null; chatNombre = ""; actualizarFab(); }
    }
    timerBadge = setInterval(refrescarContactos, 25000);
  }

  document.addEventListener("DOMContentLoaded", iniciar);

  /* API pública para la página de amigos */
  window.CHAT = {
    abrirCon: (amigo) => abrirCon(amigo, true),
    estaListo: () => Boolean(yo && document.getElementById("chat-widget"))
  };
})();