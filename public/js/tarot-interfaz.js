/* Fallback visual para la interfaz de tarot si la capa avanzada no carga. */
(function () {
  "use strict";

  if (typeof TIRADAS !== "undefined") return;

  const catalogo = [
    { id: "1-carta", nombre: "Mensaje para hoy", icono: "🕯️", corto: "Una carta, un mensaje para tu día.", n: 1 },
    { id: "3-cartas", nombre: "Pasado · Presente · Futuro", icono: "💫", corto: "Tres cartas para ver tu línea del tiempo.", n: 3 },
    { id: "5-cartas", nombre: "La Estrella", icono: "🌟", corto: "Cinco cartas para iluminar tu camino.", n: 5 },
    { id: "cruz-celta", nombre: "Cruz Celta", icono: "🕊️", corto: "La lectura profunda de diez cartas.", n: 10 },
    { id: "si-no", nombre: "Sí o No directo", icono: "🎯", corto: "Una carta para una pregunta concreta.", n: 1 }
  ];

  function barajar(cartas) {
    const copia = cartas.slice();
    for (let i = copia.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copia[i], copia[j]] = [copia[j], copia[i]];
    }
    return copia;
  }

  function cartaVisual(carta) {
    return carta.img
      ? `<img class="c-art" src="${carta.img}" alt="${carta.nombre}" loading="lazy">`
      : `<span class="nm">${carta.emoji || "✦"}</span>`;
  }

  function pintarOpciones() {
    const contenedor = document.getElementById("opciones-tiradas");
    if (!contenedor || contenedor.children.length) return;
    catalogo.forEach(lectura => {
      const enlace = document.createElement("a");
      enlace.className = "opcion-palo";
      enlace.href = "/tirada.html?tirada=" + lectura.id;
      enlace.innerHTML = `<span class="icono">${lectura.icono}</span><strong>${lectura.nombre}</strong><br><small>${lectura.corto}</small>`;
      contenedor.appendChild(enlace);
    });
  }

  function iniciarLectura(tipo) {
    const lectura = catalogo.find(item => item.id === tipo) || catalogo[0];
    const escena = document.getElementById("escena-tarot");
    if (!escena || typeof ORACULO === "undefined") return;
    const mazo = barajar(ORACULO.soloMayores());
    let elegidas = 0;
    const seleccionadas = [];

    document.getElementById("titulo-tirada").innerHTML = `<div class="deco">${lectura.icono}</div><h2>${lectura.nombre}</h2><p>${lectura.corto}</p>`;
    escena.innerHTML = `<div class="centrado"><p class="mensaje-barajo">Respira y concentra tu pregunta. El mazo se está barajando...</p><div class="mazo mazo-barajando" id="mazo-barajando"></div></div>`;
    const zona = document.getElementById("mazo-barajando");
    for (let i = 0; i < 14; i++) {
      const carta = document.createElement("div");
      carta.className = "minicarta carta-barajando";
      carta.innerHTML = `<div class="dorso-mini"></div><span class="nom">✦</span>`;
      carta.style.animationDelay = `${i * 45}ms`;
      zona.appendChild(carta);
    }

    setTimeout(() => mostrarMazo(lectura, mazo, escena, seleccionadas, () => {
      elegidas++;
      if (elegidas === lectura.n) mostrarResultado(lectura, seleccionadas, escena);
    }), 1500);
  }

  function mostrarMazo(lectura, mazo, escena, seleccionadas, alElegir) {
    escena.innerHTML = `<div class="centrado"><p>Elige ${lectura.n === 1 ? "una carta" : lectura.n + " cartas"} tocando el mazo.</p><p class="contador-fallback">Seleccionadas: <span>0</span> de ${lectura.n}</p><div class="escenario"><div class="mazo mazo-eleccion" id="mazo-eleccion-fallback"></div></div></div>`;
    const zona = document.getElementById("mazo-eleccion-fallback");
    mazo.forEach((carta, indice) => {
      const elemento = document.createElement("div");
      elemento.className = "minicarta";
      elemento.innerHTML = `<div class="dorso-mini"></div><span class="nom">Toca para elegir</span>`;
      elemento.addEventListener("click", () => {
        if (elemento.classList.contains("revelada") || seleccionadas.length >= lectura.n) return;
        elemento.classList.add("revelada");
        elemento.innerHTML = `${cartaVisual(carta)}<span class="nom">${carta.nombre}</span>`;
        seleccionadas.push({
          ...carta,
          invertido: Math.random() < 0.35,
          posicion: lectura.n === 3
            ? [["Pasado", "Lo que te trajo hasta aquí"], ["Presente", "Tu energía actual"], ["Futuro", "El rumbo que se aproxima"]][seleccionadas.length]
            : ["Tu mensaje", "La energia que acompana esta posicion"]
        });
        zona.parentElement.parentElement.querySelector(".contador-fallback span").textContent = seleccionadas.length;
        alElegir();
      });
      zona.appendChild(elemento);
    });
  }

  function mostrarResultado(lectura, cartas, escena) {
    if (typeof window.renderizarInterpretacion === "function") {
      window.renderizarInterpretacion({ lectura, cartas, escena });
      return;
    }
    const arcangeles = [
      ["💗", "Chamuel", "Paz y amor", "El afecto sincero está fluyendo hacia ti y desde ti. Abre la mano y recibe: mereces vínculos donde exista respeto y reciprocidad.", "240, 120, 150"],
      ["⚔️", "Miguel", "Protección y fuerza", "Tu protección se fortalece cuando sostienes tus límites. Camina con firmeza y defiende con calma aquello que sabes que merece cuidado.", "104, 140, 220"],
      ["🌞", "Jofiel", "Belleza e inspiración", "Lo que viene puede abrir una etapa de inspiración. Suelta lo que cumplió su ciclo y vuelve a mirar las posibilidades que sí te hacen crecer.", "255, 170, 120"],
      ["🕯️", "Rafael", "Sanación y guía", "La sanación pide paciencia y cuidado. Respira, descansa y busca ayuda profesional cuando la necesites: cuidarte también es avanzar.", "90, 200, 160"],
      ["📯", "Gabriel", "Mensajes y propósito", "Pon en palabras tu verdad y presta atención a la información que te ayuda a decidir con mayor claridad.", "212, 175, 55"],
      ["🔥", "Uriel", "Sabiduría y discernimiento", "Separa los hechos de los temores y deja que una decisión consciente ilumine tu siguiente paso.", "230, 150, 60"],
      ["💜", "Zadkiel", "Liberación y perdón", "Suelta una carga del pasado y recupera la libertad de comenzar de nuevo sin castigarte.", "160, 110, 240"]
    ];
    const elegidos = arcangeles.slice(0, Math.min(lectura.n <= 3 ? 4 : 5, arcangeles.length));
    const invertidas = cartas.filter(carta => carta.invertido).length;
    const combinacion = invertidas === 0
      ? "Todas tus cartas miran hacia la luz: hay impulso, claridad y una energía favorable para avanzar."
      : invertidas === cartas.length
        ? "Todas tus cartas aparecen invertidas: la lectura te pide detenerte, revisar lo que pesa y transformar la resistencia en conciencia."
        : "La combinación es espejada: unas cartas muestran lo que avanza y otras devuelven aquello que todavía pide atención. Escucha las dos caras del mensaje.";
    escena.innerHTML = `<section class="tarjeta resultado-fallback"><div class="deco">✦ ☾ ✦</div><p class="resultado-tirada-subtitulo">${lectura.corto}</p><h2>Resultado de la tirada de tarot completa gratis</h2><h3 class="titulo-angelical">✨ Interpretación Angelical</h3><p>✨ Comparte tu resultado con quien quieras ✨</p><p class="arcangeles-presentes"><strong>Arcángeles presentes:</strong> ${elegidos.map(a => `${a[0]} ${a[1]}`).join(" · ")}</p><div class="interpretaciones-cartas"></div><section class="guia-arcangeles"><h2>✨ Interpretación final de tu tirada ✨</h2><div class="arcangeles-fallback"></div><article class="combinacion-fallback"><h3>🔗 La combinación de tus cartas ⚔️ ${elegidos[1][1]}</h3><p>${combinacion}</p></article><article class="mensaje-final-fallback"><h3>El mensaje final</h3><p>${elegidos.map(a => a[1]).join(", ")} sellan esta lectura con su presencia. No estás sola: una guía espiritual puede ayudarte a reconocer tus recursos, actuar con calma y sostener tu propia luz.</p><p>Este es un llamado a tu grandeza: lo que hoy es semilla puede volverse fruto cuando lo acompañas con una decisión concreta. Confía, actúa y deja que este mensaje te sostenga cada día.</p><em>"Nada llega antes ni después de su tiempo; cada paso tuyo tiene su momento."</em></article></section><a class="btn btn-dorado" href="/tarot.html">Nueva lectura</a></section>`;
    cartas.forEach((carta, indice) => {
      const elemento = document.createElement("section");
      elemento.className = "interpretacion-carta";
      const sentido = carta.invertido ? "invertida" : "derecha";
      const mensaje = carta.invertido ? carta.invertida : carta.derecho;
      const posicion = carta.posicion || ["Carta", "La energía de tu lectura"];
      const guiaCarta = elegidos[indice % elegidos.length];
      elemento.innerHTML = `<div class="bloque-carta"><div class="sello-interpretacion">${cartaVisual(carta)}<small>Arcano Mayor</small></div><div class="texto-carta"><span class="etiqueta-seccion">Interpretación de la carta</span><h4>${posicion[0]} · ${posicion[1]}</h4><h3>${carta.nombre}${carta.invertido ? " (invertida)" : ""}</h3><div class="palabras-carta">${(carta.palabras || []).join(" · ")}</div><p>${mensaje || "Esta carta te invita a observar tu situación con calma y confianza."}</p></div></div><aside class="arcangel-carta" style="--arc-color:${guiaCarta[4]}"><span class="etiqueta-seccion">Mensaje del arcángel</span><div class="arcangel-orbe">${guiaCarta[0]}</div><strong>Arcángel ${guiaCarta[1]}</strong><span>${guiaCarta[2]}</span><p>${guiaCarta[3]}</p></aside>`;
      escena.querySelector(".interpretaciones-cartas").appendChild(elemento);
    });
    const zonaArcangeles = escena.querySelector(".arcangeles-fallback");
    elegidos.forEach(([icono, nombre, regencia, consejo], indice) => {
      const bloque = document.createElement("article");
      bloque.className = "arcangel-fallback";
      const area = cartas[indice % cartas.length]?.posicion?.[0] || "Situación y protección";
      bloque.innerHTML = `<span class="etiqueta-seccion">Mensaje del arcángel</span><h3>${icono} ${area} · ${icono} ${nombre}</h3><span>Arcángel ${nombre} · ${regencia}</span><p>Arcángel ${nombre} toma la palabra en esta área: ${consejo}</p><p>Su presencia conecta con las cartas que has elegido y te invita a convertir la intuición en una acción concreta, respetuosa y posible.</p>`;
      zonaArcangeles.appendChild(bloque);
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    pintarOpciones();
    const tipo = new URLSearchParams(location.search).get("tirada");
    if (tipo && document.getElementById("escena-tarot")) iniciarLectura(tipo);
  });
})();
