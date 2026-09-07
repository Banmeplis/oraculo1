/* Interpretacion completa del tarot, separada por secciones independientes. */
(function () {
  "use strict";

  const ARCANGELES = [
    { icono: "💗", nombre: "Chamuel", regencia: "Paz y amor", color: "240, 120, 150", mensaje: "El afecto sincero está fluyendo hacia ti y desde ti. Abre la mano y recibe: mereces vínculos donde existan respeto y reciprocidad." },
    { icono: "⚔️", nombre: "Miguel", regencia: "Protección y fuerza", color: "104, 140, 220", mensaje: "Tu protección se fortalece cuando sostienes tus límites. Camina con firmeza y defiende con calma aquello que merece cuidado." },
    { icono: "🌞", nombre: "Jofiel", regencia: "Belleza e inspiración", color: "255, 170, 120", mensaje: "Lo que viene puede abrir una etapa de inspiración. Suelta lo que cumplió su ciclo y vuelve a mirar las posibilidades que te hacen crecer." },
    { icono: "🕯️", nombre: "Rafael", regencia: "Sanación y guía", color: "90, 200, 160", mensaje: "La sanación pide paciencia y cuidado. Respira, descansa y busca ayuda profesional cuando la necesites: cuidarte también es avanzar." },
    { icono: "📯", nombre: "Gabriel", regencia: "Mensajes y propósito", color: "212, 175, 55", mensaje: "Pon en palabras tu verdad y presta atención a la información que te ayuda a decidir con claridad." },
    { icono: "🔥", nombre: "Uriel", regencia: "Sabiduría y discernimiento", color: "230, 150, 60", mensaje: "Separa los hechos de los temores y deja que una decisión consciente ilumine tu siguiente paso." },
    { icono: "💜", nombre: "Zadkiel", regencia: "Liberación y perdón", color: "160, 110, 240", mensaje: "Suelta una carga del pasado y recupera la libertad de comenzar de nuevo sin castigarte." }
  ];

  function escapar(valor) {
    return String(valor || "").replace(/[&<>"']/g, caracter => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[caracter]));
  }

  function imagenCarta(carta) {
    return carta.img
      ? `<img class="c-art" src="${escapar(carta.img)}" alt="${escapar(carta.nombre)}" loading="lazy">`
      : `<span class="c-nm">${escapar(carta.emoji || "✦")}</span>`;
  }

  function consejoFinal(cartas) {
    const nombres = cartas.map(carta => carta.nombre).join(", ");
    const claves = cartas.flatMap(carta => carta.palabras || []).slice(0, 5).join(", ");
    const invertidas = cartas.filter(carta => carta.invertido).length;
    const tono = invertidas > cartas.length / 2
      ? "Revisa tus impulsos, descansa antes de decidir y convierte cada advertencia en una oportunidad de aprender."
      : "Da un paso concreto, protege tu energia y permite que lo que ya esta creciendo encuentre espacio para avanzar.";
    return `Tus cartas (${nombres}) ponen el foco en ${claves || "tu proceso personal"}. ${tono} La lectura no decide por ti: te ofrece una perspectiva para actuar con mas conciencia y cuidar aquello que de verdad importa.`;
  }

  function crearSeccion(clase, contenido) {
    const seccion = document.createElement("section");
    seccion.className = clase;
    seccion.innerHTML = contenido;
    return seccion;
  }

  function animarInterpretacion(raiz) {
    if (!window.gsap || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.from(raiz.querySelectorAll(".interpretacion-cabecera-nueva, .interpretacion-angelical-nueva, .carta-interpretacion-nueva, .arcangel-bloque-nueva, .combinacion-seccion-nueva, .mensaje-final-seccion-nueva"), {
      opacity: 0,
      y: 24,
      duration: 0.72,
      stagger: 0.1,
      ease: "power3.out"
    });
    gsap.from(raiz.querySelectorAll(".sello, .arcangel-sello-nuevo"), {
      opacity: 0,
      scale: 0.78,
      rotate: -5,
      duration: 0.85,
      stagger: 0.12,
      delay: 0.25,
      ease: "back.out(1.7)"
    });
    gsap.from(raiz.querySelectorAll(".titulo-bloque-animado h2, .interpretacion-cabecera-nueva h2, .titulo-arcangel-nombre"), {
      opacity: 0,
      y: 12,
      duration: 0.7,
      stagger: 0.08,
      delay: 0.35,
      ease: "power2.out"
    });
  }

  window.renderizarInterpretacion = function ({ lectura, cartas, escena }) {
    const raiz = document.createElement("div");
    raiz.className = "interpretacion-completa-nueva resultado";

    raiz.appendChild(crearSeccion("interpretacion-cabecera-nueva", `
      <div class="deco titulo-brillante">✦ ☾ ✦</div>
      <p>${escapar(lectura.corto)}</p>
      <h2>Resultado de la tirada de tarot completa gratis</h2>
    `));

    const cantidadArcangeles = lectura.n <= 3 ? 4 : 5;
    const inicioArcangel = Math.floor(Math.random() * ARCANGELES.length);
    const presentes = Array.from({ length: cantidadArcangeles }, (_, indice) => ARCANGELES[(inicioArcangel + indice) % ARCANGELES.length]);
    raiz.appendChild(crearSeccion("interpretacion-angelical-nueva", `
      <div class="titulo-bloque-animado"><span>✨</span><h2>Interpretacion Angelical</h2></div>
      <p>✨ Comparte tu resultado con quien quieras ✨</p>
      <p><strong>Arcangeles presentes:</strong> ${presentes.map(arcangel => `${arcangel.icono} ${arcangel.nombre}`).join(" · ")}</p>
    `));

    cartas.forEach((carta, indice) => {
      const arcangel = presentes[indice % presentes.length];
      const posicion = carta.posicion || null;
      const sentido = carta.invertido ? " (invertida)" : "";
      const mensaje = carta.invertido ? carta.invertida : carta.derecho;
      const encabezadoPosicion = posicion
        ? `<h4>${escapar(posicion[0])} <span style="font-weight:400;color:var(--lavanda-suave)">· ${escapar(posicion[1])}</span></h4>`
        : "";
        raiz.appendChild(crearSeccion("carta-grande vidrio carta-interpretacion-nueva", `
        <div class="sello sello-interpretacion">${imagenCarta(carta)}<small>Arcano Mayor</small></div>
        <div class="carta-texto">
          <span class="etiqueta-seccion">Carta elegida</span>
          ${encabezadoPosicion}
          <h3>${escapar(carta.nombre)}${sentido}</h3>
          <div class="palabras">${(carta.palabras || []).map(palabra => `<span>${escapar(palabra)}</span>`).join("")}</div>
          <p class="interp">${escapar(mensaje || "Esta carta te invita a observar tu situacion con calma y confianza.")}</p>
        </div>
        `));
    });

    presentes.forEach((arcangel, indice) => {
      const cartaArcangel = cartas[indice % cartas.length];
      const area = cartaArcangel?.posicion?.[0] || "Guia espiritual";
      const bloqueArcangel = crearSeccion("carta-grande vidrio arcangel-bloque-nueva", `
        <div class="particulas-arcangel" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i></div>
        <div class="sello arcangel-sello-nuevo" style="--arc-color:${arcangel.color}"><span>${arcangel.icono}</span><small>Guia angelical</small></div>
        <div class="carta-texto">
          <span class="etiqueta-seccion titulo-arcangel">Mensaje del arcangel</span>
          <h4>${escapar(area)} <span style="font-weight:400;color:var(--lavanda-suave)">· Presencia espiritual</span></h4>
          <h3 class="titulo-arcangel-nombre">Arcangel ${escapar(arcangel.nombre)}</h3>
          <div class="palabras"><span>${escapar(arcangel.regencia)}</span></div>
          <p class="interp">${escapar(arcangel.mensaje)}</p>
        </div>
      `);
      bloqueArcangel.style.setProperty("--arc-color", arcangel.color);
      raiz.appendChild(bloqueArcangel);
    });

    raiz.appendChild(crearSeccion("carta-grande vidrio mensaje-final-seccion-nueva", `
      <div class="deco">✦ ☾ ✦</div>
      <h2>El mensaje final</h2>
      <p>${presentes.map(arcangel => arcangel.nombre).join(", ")} sellan esta lectura con su presencia. No estas sola: sus simbolos te ayudan a reconocer tus recursos, actuar con calma y sostener tu propia luz.</p>
      <p>${escapar(consejoFinal(cartas))}</p>
      <em>"Nada llega antes ni despues de su tiempo; cada paso tuyo tiene su momento."</em>
    `));

    raiz.appendChild(crearSeccion("acciones-interpretacion-nueva", `<a class="btn btn-dorado" href="/tarot.html">Nueva lectura</a>`));
    escena.replaceChildren(raiz);
    animarInterpretacion(raiz);
  };
})();
