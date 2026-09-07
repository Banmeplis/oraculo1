/* ============================================================
   ORÁCULO · Tiradas interactivas de tarot
   Estilo de interpretación inspirado en tiradadetarot.gratis
   ============================================================ */

const TIRADAS = {

  mazo: null,

  definirMazo() {
    this.mazo = ORACULO.soloMayores();
  },

  /* ------------------------- definición de tiradas ------------------------ */
  catalogo: [
    { id: "1-carta",   nombre: "Mensaje para hoy",   icono: "🕯️", corto: "Una carta, un mensaje: la guía del día.", n: 1, posiciones: [["Tu mensaje", "La energía central de tu momento"]] },
    { id: "3-cartas",  nombre: "Pasado · Presente · Futuro", icono: "💫", corto: "Tres cartas que revelan la línea del tiempo.", n: 3, posiciones: [["Pasado", "Lo que te trajo hasta aquí"], ["Presente", "Tu energía actual"], ["Futuro", "El rumbo que se aproxima"]] },
    { id: "5-cartas",  nombre: "La Estrella", icono: "🌟", corto: "Cinco cartas que trazan tu sendero hacia la meta.", n: 5, posiciones: [["Situación", "Dónde estás ahora"], ["Camino", "La mejor vía a seguir"], ["Obstáculo", "Lo que debes trascender"], ["Ayuda", "El apoyo que te sostiene"], ["Resultado", "Hacia dónde te encaminas"] ] },
    { id: "gran-tirada", nombre: "La Gran Tirada", icono: "🛡️", corto: "Catorce cartas y los siete arcángeles regentes: la lectura total para cada rincón de tu vida.", n: 14, posiciones: [["Situación general", "El clima que envuelve tu presente"], ["Amor y relaciones", "El estado de tus vínculos"], ["Economía y abundancia", "El flujo de tus recursos"], ["Trabajo y proyecto", "Tu camino profesional"], ["Familia y hogar", "Tu entorno cercano"], ["Salud y energía", "Tu vitalidad y cuerpo"], ["Espiritualidad y fe", "Tu conexión con lo divino"], ["Bloqueo a liberar", "Lo que te frena en secreto"], ["Pasado que te marcó", "La raíz de tu historia"], ["Presente que te sostiene", "Tu energía de hoy"], ["Futuro que se acerca", "El rumbo que se prepara"], ["Consejo del cielo", "La guía que te dan"], ["Lección del alma", "Lo que este tiempo te enseña"], ["Resultado final", "La síntesis de todo"] ] },
    { id: "cruz-celta", nombre: "Cruz Celta", icono: "🕊️", corto: "La lectura clásica y profunda de diez cartas.", n: 10, posiciones: [["Corazón del asunto", "El centro de la consulta"], ["Lo que cruza", "Las influencias que la atraviesan"], ["Lo que está por encima", "Consciente o metas"], ["Lo que está por debajo", "Inconsciente o raíces"], ["Lo que pasó", "Pasado reciente"], ["Lo que viene", "Futuro cercano"], ["Tu actitud", "Cómo te enfrentas a ello"], ["El entorno", "Influencias externas"], ["Esperanzas y miedos", "Lo que anhelas y temes"], ["Resultado", "La síntesis final"] ] },
    { id: "si-no",     nombre: "Sí o No directo", icono: "🎯", corto: "Una carta, una respuesta clara para tu pregunta.", n: 1, posiciones: [["Tu respuesta", "El veredicto del oráculo"]] }
  ],

  elegantIcono: { "1-carta": "🕯️", "3-cartas": "💫", "5-cartas": "🌟", "gran-tirada": "🛡️", "cruz-celta": "🕊️", "si-no": "🎯" },
  estrellas: ["✦", "✧", "⋆", "✩", "·"],

  /* ------------------------------ utilidades ------------------------------ */
  barajar(lista) {
    const a = lista.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  },

  elegir(tipo) {
    const t = this.catalogo.find(x => x.id === tipo);
    if (!t) return null;
    this.definirMazo();
    const mazo = this.barajar(this.mazo);
    return { tirada: t, cartas: [], mazo, fuerte: Math.random() < 0.3 };
  },

  /* construye la carta a partir del arcano, decidiendo sentido al azar */
  construirCarta(arc) {
    const invertido = Math.random() < 0.35;
    return {
      id: this.idDe(arc),
      nombre: arc.nombre,
      arcana: arc.arcana,
      palo: arc.palo,
      emoji: arc.emoji,
      img: arc.img,
      palabras: arc.palabras,
      texto: invertido ? arc.invertida : arc.derecho,
      sentido: invertido ? "invertida" : "derecha",
      invertido
    };
  },

  idDe(c) { return "M" + c.n; },

  /* figura de la carta: usa la imagen del arcano cuando existe, si no el emoji */
  figuraDe(c, cls) {
    const cnm = cls ? "c-nm " + cls : "c-nm";
    return c.img
      ? `<img class="c-art" src="${c.img}" alt="${c.nombre}" loading="lazy">`
      : `<div class="${cnm}">${c.emoji}</div>`;
  },

  /* ------------------------------ cita final ------------------------------ */
  citas: [
    "El universo siempre conspira a favor de quien camina con fe.",
    "Tu ángel guardián susurra: confía en el proceso, la luz ya viene en camino.",
    "Nada llega antes ni después de su tiempo; cada paso tuyo tiene su momento.",
    "La sabiduría no se impone: se escucha con el alma.",
    "Cierra los ojos, respira y recuerda que eres más fuerte de lo que crees.",
    "Todo lo que buscas también te está buscando a ti.",
    "El miedo es una puerta, y tú tienes la llave para abrirla desde la luz.",
    "Señal recibida: tu corazón ya sabe la respuesta."
  ],

  constructorMensaje(resultado) {
    const cuantasBien = resultado.cartas.filter(c => !c.invertido).length;
    const total = resultado.cartas.length;
    let cita = this.citas[Math.floor(Math.random() * this.citas.length)];
    let texto = "";
    if (cuantasBien === total)
      texto = "Todas tus cartas brillan del derecho: la luz te respalda y el momento te favorece. Avanza con el corazón abierto y la confianza alta, porque hoy el cielo te acompaña de forma total.";
    else if (cuantasBien >= Math.ceil(total / 2))
      texto = "La mayoría de tus cartas te favorecen: la energía camina contigo. No ignores los avisos de las cartas que miran hacia atrás: ellos son tu brújula para no repetir errores.";
    else if (cuantasBien === 0)
      texto = "Todas tus cartas muestran su sombra, y eso no es un no: es una llamada a despertar. Las pruebas son puentes, no muros. Este es tu momento de mayor transformación si dejas de resistirte.";
    else
      texto = "Tus cartas hablan con honestidad: hay luces que seguir y avisos que atender. El equilibrio no cae del cielo: tú lo decides con cada paso.";
    return texto + ' <em class="cita">"' + cita + '"</em>';
  },

  /* ------------------------- 7 arcángeles regentes ----------------------- */
  arcangeles: {
    miguel:  { nombre: "Arcángel Miguel",  emoji: "⚔️", regencia: "Protección y fuerza",      color: "104, 140, 220",     mensaje: "El guerrero de la luz vigila tu camino y disuelve toda oscuridad que se interponga. Bajo su espada, tu protección está garantizada mientras avanzas con valor.", consejo: "Te doy valor: no camines con miedo, camina con firmeza y nos defenderé la retaguardia." },
    gabriel: { nombre: "Arcángel Gabriel", emoji: "📯", regencia: "Mensajes y propósito",      color: "212, 175, 55",      mensaje: "El mensajero divino despeja tu mente y te trae claridad sobre el propósito de tu alma. Presta atención a las señales: a través de él el universo te habla.", consejo: "Te traigo el mensaje que esperabas: escucha con el corazón abierto y la respuesta llegará." },
    rafael:  { nombre: "Arcángel Rafael",  emoji: "🕯️", regencia: "Curación y guía",          color: "90, 200, 160",      mensaje: "El sanador ilumina las heridas que piden ser cuidadas, tanto del cuerpo como del alma. Su energía restauradora fluye hacia ti y te devuelve el equilibrio.", consejo: "Te curo y te sostengo: respira, suelta el dolor y deja que la sanación invada tu ser." },
    uriel:   { nombre: "Arcángel Uriel",   emoji: "🔥", regencia: "Sabiduría y discernimiento", color: "230, 150, 60",      mensaje: "El portador de la luz te otorga la sabiduría para ver con claridad lo que está oculto. Confía en la certeza interior que enciende en tu corazón.", consejo: "Te doy discernimiento: no actúes por impulso, mira con luz interior y decide en paz." },
    zadkiel: { nombre: "Arcángel Zadkiel", emoji: "💜", regencia: "Misericordia y liberación", color: "160, 110, 240",     mensaje: "El ángel de la misericordia te ayuda a soltar culpas, viejos resentimientos y ataduras del pasado. Su presencia abre paso a un perdón que te libera.", consejo: "Te libero de culpas: perdónate y perdona, y sentirás cuán ligera es tu alma." },
    jofiel:  { nombre: "Arcángel Jofiel",  emoji: "🌞", regencia: "Belleza e inspiración",     color: "255, 170, 120",     mensaje: "El ángel de la belleza inunda tu vida de inspiración y te muestra la luz que hay incluso en los días grises. Rodeate de lo que te eleva y verás florecer tu mundo.", consejo: "Te inspiro y te ilumino: busca la belleza que te rodea y ella te guiará." },
    chamuel: { nombre: "Arcángel Chamuel", emoji: "💗", regencia: "Paz y amor",               color: "240, 120, 150",     mensaje: "El ángel del amor puro trae paz a tus relaciones y reaviva los lazos más sinceros. A su calor, las puertas del corazón se abren a un afecto verdadero.", consejo: "Te doy amor y paz: abre el corazón y deja que el amor fluya sin miedo." }
  },
/* -------------------------- mensajes arcángel por área ------------------- */
  mensajesArcangel: {
    rafael: {
      luz: "Arcángel Rafael te dice: la sanación está en proceso, tu cuerpo y alma se están alineando con la luz del cielo. Cada célula responde a la energía restauradora que fluye hacia ti. Respira hondo y permite que el viejo patrón se disuelva.",
      mixto: "Arcángel Rafael te dice: la sanación avanza pero hay resistencias. Hay un área de tu cuerpo o alma que aún estás negando que necesita atención. El dolor que callas es la señal de que algo pide ser liberado. Cuidarte es tu derecho divino.",
      sombra: "Arcángel Rafael te regaña: estás ignorando las señales de alerta de tu cuerpo. El cansancio que pospones, el dolor que callas, no desaparecerán solos. Hoy es el día para detenerte, acudir a tu sanación y no posponer más tu bienestar."
    },
    miguel: {
      luz: "Arcángel Miguel te dice: tu protección está completa y tu energía está alineada. Ninguna oscuridad puede tocarte mientras mantengas tus límites firmes y tu fe alta.",
      mixto: "Arcángel Miguel te dice: tienes protección, pero hay una grieta que no debes ignorar. Alguien está drenando tu energía sin que te defenders. Reforza tu escudo y elige batalear tus propias batallas.",
      sombra: "Arcángel Miguel te regaña: has bajado el escudo demasiado pronto. Te estás exponiendo donde no hay protección y entregando tu fuerza donde no te valoran. Es hora de ponerte firme."
    },
    gabriel: {
      luz: "Arcángel Gabriel te dice: el mensaje que esperabas está en camino. Las señales están alineando, las coincidencias tienen propósito. Presta atención a las palabras que escuchas hoy.",
      mixto: "Arcángel Gabriel te dice: la verdad está cerca pero envuelta en ruido. No te apresures a concluir. Revisa lo que escuchas antes de hablar.",
      sombra: "Arcángel Gabriel te regaña: has dejado de escuchar. Repites lo que quieres oír en vez de lo que necesitas. Cállate un momento y vuelve a preguntar con honestidad."
    },
    uriel: {
      luz: "Arcángel Uriel te dice: tu luz interior se ha encendido. Ves con claridad lo que antes estaba oculto. Confía en esa certeza que sientes en tu corazón.",
      mixto: "Arcángel Uriel te dice: tienes la verdad cerca pero el impulso te empuja a decidir antes de tiempo. Detente, examina y compara antes de actuar.",
      sombra: "Arcángel Uriel te regañas: estás actuando por impulso y dejando que la emoción nuble tu juicio. Pide tiempo, toma distancia y decide desde la luz."
    },
    zadkiel: {
      luz: "Arcángel Zadkiel te dice: la liberación ya está corriendo por ti. Suelta la culpa, perdona lo que haya que perdonar y siente cómo entra la libertad.",
      mixto: "Arcángel Zadkiel te dice: la llave está en tu mano pero hay una cadena que tú sigues manteniendo. Date permiso hoy y el cielo te sostiene.",
      sombra: "Arcángel Zadkiel te regaña: llevas demasiado tiempo atado a la culpa, al rencor o a un pasado que ya no existe. Cada día sin perdonar pesa más."
    },
    jofiel: {
      luz: "Arcángel Jofiel te dice: la belleza y la luz que buscas ya están floreciendo a tu alrededor. Rodéate de lo que te eleva y verás tu mundo brillar con tus propios colores.",
      mixto: "Arcángel Jofiel te dice: hay luz pero todavía tienes los ojos puestos en lo que no fue. Deja de mirar atrás y déjate inspirar por lo nuevo.",
      sombra: "Arcángel Jofiel te regaña: dejaste de ver la luz que sí tienes. Te comparas con otros y ensombreces tu propio camino. Enciende tu propia lámpara."
    },
    chamuel: {
      luz: "Arcángel Chamuel te dice: el amor real ya está tocando tu corazón. Abre la mano y recibe, sin miedo a querer ni a ser querido.",
      mixto: "Arcángel Chamuel te dice: hay amor pero también un nudo que duele callado. No confundas silencio con paz ni distancia con indiferencia. Habla lo que sientes con honestidad.",
      sombra: "Arcángel Chamuel te regaña: estás poniendo tu corazón donde no lo cuidan, o cerrando la puerta a quien sí te quiere bien. Deja de mendigar cariño donde solo hay ego."
    }
  },

/* selecciona arcángeles según el tipo de lectura:
   - 1-3 cartas: 2-4 arcángeles
   - 3-5 cartas: 1-7 arcángeles aleatorios
   - Gran tirada (14): siempre 7
   - Lectura fuerte: siempre 7 */
  arcangelesDeLectura(resultado) {
    const n = (resultado.cartas || []).length;
    const esFuerte = resultado.fuerte === true;
    const esGran = resultado.tirada && resultado.tirada.id === "gran-tirada";

    if (esGran || esFuerte) {
      return Object.keys(this.arcangeles).map(clave => ({ clave, ...this.arcangeles[clave] }));
    }

    let min, max;
    if (n <= 3)      { min = 2; max = 4; }     // 1-3 cartas: 2-4
    else if (n <= 5) { min = 1; max = 7; }     // 3-5 cartas: 1-7 aleatorio
    else             { min = 5; max = 7; }

    const cantidad = min + Math.floor(Math.random() * (max - min + 1));
    const barajado = this.barajar(Object.keys(this.arcangeles));
    return barajado.slice(0, Math.min(cantidad, 7)).map(clave => ({ clave, ...this.arcangeles[clave] }));
  },

  /* arcángel que se encarga de cada área (rota entre los elegidos) */
  arcangelDeArea(arcangeles, indice) {
    return arcangeles[indice % arcangeles.length];
  },

  /* arcángel regente principal de la lectura (el primero de los elegidos) */
  arcangelRegente(resultado) {
    const elegidos = resultado.__arcangeles || this.arcangelesDeLectura(resultado);
    return elegidos[0];
  },

  /* tiñe el fondo con la energía de los arcángeles que guían la lectura */
  aplicarFondo(arcangeles) {
    const lista = Array.isArray(arcangeles) ? arcangeles : [arcangeles];
    const primario = lista[0].color;
    let grads = "";
    lista.forEach((a, i) => {
      const rgb = a.color;
      const pos = (i % 2 === 0) ? "12% 10%" : "90% 95%";
      grads += `radial-gradient(1000px 700px at ${pos}, rgba(${rgb},0.32), transparent 60%),`;
    });
    document.documentElement.style.setProperty("--color-arc", primario);
    document.body.style.background =
      grads +
      "linear-gradient(160deg, var(--nocturno) 0%, var(--nocturno2) 55%, #241650 100%)";
  },

/* interpretación final por áreas: cada arcángel habla de su área en primera
     persona; el tono (luz o sombra) se decide según las cartas de la lectura,
     pero el arcángel no nombra las cartas: solo entrega el mensaje */
  interpretacionFinal(resultado) {
    const cartas = resultado.cartas;
    const total = cartas.length;
    const bien = cartas.filter(c => !c.invertido).length;
    const propor = bien / total;
    const cita = this.citas[Math.floor(Math.random() * this.citas.length)];

    // Analiza los arcángeles que participan en esta lectura
    const elegidos = (resultado.__arcangeles || this.arcangelesDeLectura(resultado));
    const elegidosMap = new Map();
    elegidos.forEach(a => {
      if (!elegidosMap.has(a.clave)) elegidosMap.set(a.clave, { luz: 0, sombra: 0 });
      const cont = cartas.filter(c => c.clave === a.clave || (c.palabras && c.palabras.some(p => p.toLowerCase().includes(a.clave))));
      if (cont.length > 0) elegidosMap.get(a.clave).luz = cont.filter(c => !c.invertido).length;
      else elegidosMap.get(a.clave).luz = 0;
      elegidosMap.get(a.clave).sombra = cont.filter(c => c.invertido).length;
    });

    // Extrae temas de las cartas para personalizar mensajes
    const temasDetectados = this.detectarTemasCartas(cartas);

    const allAreas = [
      {
        icono: "🛡️", area: "situacion", clave: "miguel", titulo: "Situación y protección",
        texto: this.generarMensajeArea("miguel", elegidosMap.get("miguel"), temasDetectados, propor, cartas)
      },
      {
        icono: "💞", area: "amor", clave: "chamuel", titulo: "Amor y relaciones",
        texto: this.generarMensajeArea("chamuel", elegidosMap.get("chamuel"), temasDetectados, propor, cartas)
      },
      {
        icono: "💚", area: "salud", clave: "rafael", titulo: "Salud y energía",
        texto: this.generarMensajeArea("rafael", elegidosMap.get("rafael"), temasDetectados, propor, cartas)
      },
      {
        icono: "📯", area: "mensajes", clave: "gabriel", titulo: "Mensajes y propósito",
        texto: this.generarMensajeArea("gabriel", elegidosMap.get("gabriel"), temasDetectados, propor, cartas)
      },
      {
        icono: "💰", area: "economia", clave: "uriel", titulo: "Economía y abundancia",
        texto: this.generarMensajeArea("uriel", elegidosMap.get("uriel"), temasDetectados, propor, cartas)
      },
      {
        icono: "🔓", area: "bloqueo", clave: "zadkiel", titulo: "Bloqueos a liberar",
        texto: this.generarMensajeArea("zadkiel", elegidosMap.get("zadkiel"), temasDetectados, propor, cartas)
      },
      {
        icono: "🌟", area: "futuro", clave: "jofiel", titulo: "Futuro e inspiración",
        texto: this.generarMensajeArea("jofiel", elegidosMap.get("jofiel"), temasDetectados, propor, cartas)
      }
    ];

    const cierrePoderoso = propor >= 0.5
      ? "Este es el final, y es un llamado a tu grandeza: deja de mirar tu vida desde afuera y entra en ella con todo. Lo que hoy es semilla se vuelve fruto, lo que hoy es herida se vuelve fuerza. Confía, actúa y deja que este mensaje te sostenga cada día."
      : "No hay más vueltas que dar: este es el despertar que pediste. Las cartas no vinieron a castigarte, vinieron a mostrarte lo que no querías ver para que al fin te liberes. Deja de posponer tu verdad, suelta lo que te pesa, perdona lo que te ata, y hoy mismo da el paso que tu corazón viene pidiendo. Eres más fuerte que tu miedo: demuéstralo.";

    const finalBloques = areas.map(a => ({
      icono: a.icono,
      area: a.area,
      titulo: a.titulo,
      arcangel: this.arcangeles[a.clave],
      regano: propor < 0.5,
      presencia: this.fraseArea(this.arcangeles[a.clave], a.clave === "chamuel" ? "amor" : a.clave),
      texto: a.texto
    }));

    if (resultado.fuerte) {
      const regente = this.arcangelRegente(resultado);
      const A = this.nombreCorto(regente.nombre);
      finalBloques.push({
        icono: "🔥",
        area: "fuerte",
        titulo: "El regaño final",
        arcangel: regente,
        regano: true,
        presencia: `${regente.nombre} no te suelta la mano, pero hoy te aprieta fuerte:`,
        texto: `He escuchado todo lo que tu alma no se atreve a decir en voz alta, y vengo desde el cielo a decírtelo yo. Deja de esconderte detrás de excusas, de cansancio y de 'mañana empiezo'. Esta lectura fue fuerte porque tu momento lo pide: las cartas te mostraron salidas que seguís ignorando. No vengo a castigarte, ${A} te habla con la dureza de quien te ama: despierta, muévete, y no le des más vueltas a lo que ya sabes que tienes que hacer.`
      });
    }

    finalBloques.push({ cierre: true, texto: cierrePoderoso, cita });
    return finalBloques;
  },

  /* detecta temas basándose en los nombres y palbras de las cartas */
  detectarTemasCartas(cartas) {
    const textos = cartas.map(c => c.nombre.toLowerCase() + " " + (c.palabras ? c.palabras.join(" ") : "")).join(" ");
    const temaMap = new Map();
    
    // Palabras clave por tema
    const palabrasClave = {
      amor: ["corazón", "amor", "pareja", "relación", "emocion", "sentimiento", "unión", "beso", "abrazo"],
      trabajo: ["trabajo", "carrera", "empleo", "dinero", "abundancia", "éxito", "profesión", "labor", "proyecto"],
      salud: ["salud", "cuerpo", "enfermedad", "dolor", "energía", "fuerza", "cura", "sanación", "cuerpo"],
      espiritualidad: ["arcángel", "ceo", "espíritu", "luz", "alma", "divino", "sacro", "oración"],
      bloqueo: ["miedo", "duda", " bloqueo", "atrapado", "cadena", "prisión", "obstáculo", "problema"],
      mensajes: ["mensaje", "señal", "guía", "comunicación", "voz", "voz del cielo", "seña"],
      futuro: ["futuro", "próximo", "pronto", "llegada", "evento", "resultado", "destino"]
    };

    for (const [tema, claves] of Object.entries(palabrasClave)) {
      if (claves.some(k => textos.includes(k))) {
        temaMap.set(tema, true);
      }
    }
    return temaMap;
  },

/* genera un mensaje personalizado para un área basándose en las cartas y arcángel */
  generarMensajeArea(claveArcangel, areaData, temasDetectados, propor, cartasContexto) {
    // Asegurar que areaData existe y tiene estructura mínima
    areaData = areaData || { luz: 0, sombra: 0 };
    const esLuz = areaData.luz > areaData.sombra ? true : propor >= 0.5;
    const tono = esLuz ? "luz" : "sombra";
    
    // Usa las cartas del contexto (pasadas desde interpretacionFinal) o las del resultado
    const cartas = cartasContexto || [];
    const nombresCartas = cartas.map(c => c?.nombre?.toLowerCase() || "");
    
    // --- SISTEMA DE SIGNIFICADOS INDIVIDUALIZADOS POR ARCANO MAYOR ---
    // Cada Arcano Mayor tiene múltiples significados que el sistema
    // selecciona basándose en la combinación única de cartas de la tirada
    const significadosArcanoMayor = {
      // Loco (0): nuevos comienzos, libertad, aventura
      loco: {
        luz: [
          "El Loco representa un nuevo comienzo valiente: confía en que el universo te atrapará mientras te lanzas al desconocido.",
          "Tu llamado a la aventura está sonando fuerte. El Loco te dice: el mundo es grande y tú tienes alas.",
          "Un nuevo capítulo comienza: deja de planear demasiado y comienza a vivir. La prisa no es tu amiga, pero el valor sí."
        ],
        sombra: [
          "El Loco sombrío: estás corriendo sin mirar. La prisa te llevará a errores que podrías evitar con un poco de cuidado.",
          "Te falta dirección: quieres todo ya, sin plan ni responsabilidad. Para, respira y piensa antes de saltar.",
          "Estás automedicando tu necesidad de libertad con acciones temerarias. Cuidado: la libertad sin responsabilidad es caos."
        ]
      },
      // Mago (1): poder, manifestación, talento
      mago: {
        luz: [
          "El Mago canaliza el poder divino: todo lo que necesitas ya está dentro de ti. talento, palabra y fuerza.",
          "Hoy puedes hacer real lo que imaginas. Cree en ti, actúa con calma y verás tu deseo tomar forma.",
          "Tu talento está alineado con la energía universal: este es tu momento de manifestar tus sueños con calma."
        ],
        sombra: [
          "El Mago invertido: tienes un gran poder y lo estás dejando dormir. Nada de excusas: úsalo ahora o la vida lo pondrá en otras manos.",
          "Te falta enfoque: promis excesos sin follow-through. Tus dones te esperan, pero eliges no usarlos."
        ]
      },
      // La Sacerdotisa (2): intuición, misterio, sabiduría interna
      sacerdotisa: {
        luz: [
          "La Sacerdotisa susurra que la verdad está adentro: siéntate en silencio, respira y escucha adentro. La verdad no está afuera: está en ti, esperando que la oigas.",
          "Tu intuición es tu guía más confiable. No busques afuera lo que ya sabes en tu interior.",
          "La verdad no está afuera: está en ti, esperando que la oigas en el silencio."
        ],
        sombra: [
          "La Sacerdotisa sombría: llevas callando lo que sientes y ese silencio te pesa. Guardas secretos que no te dejan dormir.",
          "Habla tu verdad y vuelve a escuchar tu voz interior. El secreto que tanto guardas te está volviendo amarga."
        ]
      },
      // Emperatriz (3): abundancia, fertilidad, cuidado
      emperatriz: {
        luz: [
          "Es tu tiempo de florecer. Cuida lo que amas, riega tus sueños y deja que la abundancia entre por la puerta ancha.",
          "Te espera un regazo de paz y de frutos. Disfrútalo y agradece: esta es tu temporada de plenitud.",
          "La abundancia fluye hacia ti cuando cuidas lo que amas. Tu creatividad es un regalo que el universo celebra."
        ],
        sombra: [
          "Te estás descuidando. Dejas tu cuerpo, tu creatividad y tus sueños en el último lugar. Vuélvete tu primera prioridad: si tú no te nutres, nada florece.",
          "No pospongas tu nutrición emocional y física más tiempo. Si tú no te nutres, nada florece."
        ]
      },
      // El Hierofante (5): tradición, enseñanza, guía espiritual
      hierofante: {
        luz: [
          "Un guía llega a tu camino, o tú te vuelves guía para otros. Busca la enseñanza que te espera y compártela con el corazón abierto. Aprender y enseñar te crece por dentro.",
          "Un guía llega a tu camino, o tú te vuelves guía para otros. Busca la enseñanza que te espera y compártela con el corazón abierto. Aprender y enseñar te crece por dentro."
        ],
        sombra: [
          "Sigues reglas viejas que ya no son tuyas. No todo lo que te enseñaron es verdad para ti. Cuestiona, piensa y elige tu propio camino con libertad y respeto."
        ]
      },
      // Los Enamorados (6): amor, unión, elección
      enamorados: {
        luz: [
          "Tu corazón y tu mente se dan la mano: esta es tu hora de elegir con amor y coherencia. Lo que decidas hoy marca tu camino. Elige desde tu verdad, no desde el miedo a quedarte solo.",
          "Tu corazón y tu mente se dan la mano: esta es tu hora de elegir con amor y coherencia."
        ],
        sombra: [
          "La duda te está volviendo mitad. No elijas por miedo a estar solo y no te quedes donde apagan tu luz. Escucha tu verdad, aunque sea incómoda, y decides con valentía."
        ]
      },
      // El Carro (7): victoria, voluntad, avance
      carro: {
        luz: [
          "Tu fuerza se pone en marcha: nada te detiene cuando tú decides avanzar. Sujeta bien las riendas, mira adelante y cruza ese obstáculo.",
          "Tu fuerza se pone en marcha: nada te detiene cuando tú decides avanzar. Sujeta bien las riendas, mira adelante y cruza ese obstáculo."
        ],
        sombra: [
          "Vas para todos lados y no llegas a ninguno. No más dispersiones. Elige un solo rumbo, firme y claro, y camina. La fuerza perdida se recupera con dirección.",
          "Vas para todos lados y no llegas a ninguno. No más dispersiones. Elige un solo rumbo, firme y claro, y camina."
        ]
      },
      // La Fuerza (8): coraje, compasión, dominio interior
      fuerza: {
        luz: [
          "Tu mejor armadura es tu calma. Hoy aprendes a domar tus miedos con amor en vez de con golpes. Cuando tu león interior te obedece, nada de afuera puede contra ti.",
          "Tu mejor armadura es tu calma. Hoy aprendes a domar tus miedos con amor en vez de con golpes."
        ],
        sombra: [
          "Deja de tratatrarte mal. Esa voz que te dice 'no puedes' no es la verdad. Eres más valiente y más grande de lo que te has permitido creer.",
          "Deja de tratatrarte mal."
        ]
      },
      // El Ermitaño (9): introspección, guía interior, sabiduría
      ermitaño: {
        luz: [
          "Un tiempo de silencio te hace bien. Baja el ruido, apaga el mundo un rato y escucha adentro. Ahí está la luz que buscas afuera. Descansa, reflexiona y vuelve con claridad.",
          "Un tiempo de silencio te hace bien. Baja el ruido, apaga el mundo un rato y escucha adentro."
        ],
        sombra: [
          "Te estás aislando por miedo, no por paz. No estás solo, pero te haces el solo. Abre la puerta, deja entrar el cariño que te espera.",
          "Te estás aislando por miedo, no por paz."
        ]
      },
      // La Rueda de la Fortuna (10): cambio, ciclos, destino
      rueda: {
        luz: [
          "El destino gira a tu favor: lo que esperabas se acerca y lo bueno viene con fuerza. No te aferres a lo viejo: suelta y deja que la rueda te lleve hacia lo nuevo.",
          "El destino gira a tu favor: lo que esperabas se acerca y lo bueno viene con fuerza."
        ],
        sombra: [
          "Te aferras a lo que ya se fue y frenas lo que llega. La rueda gira para todos, contigo o sin ti. Mejor girar con ella y no contra el suelo.",
          "Te aferras a lo que ya se fue y frenas lo que llega."
        ]
      },
      // La Justicia (11): equilibrio, verdad, karma
      justicia: {
        luz: [
          "Lo que siembras, cosechas: hoy vuelve a ti la verdad y el equilibrio. Todo llega a su justa medida. Sé honesto contigo y con los demás, y la paz te encontrará.",
          "Lo que siembras, cosechas: hoy vuelve a ti la verdad y el equilibrio."
        ],
        sombra: [
          "Estás evadiendo una responsabilidad y eso te descentra. La verdad no se esconde para siempre: te va a encontrar. Sé honesto, asume y recupera tu paz.",
          "Estás evadiendo una responsabilidad y eso te descentra."
        ]
      },
      // El Colgado (12): pausa, entrega, nueva perspectiva
      colgado: {
        luz: [
          "Detente y mira tu vida del revés. Esta pausa no es pérdida: es preparación. Del silencio viene una revelación que te cambiará el rumbo. Confía en la espera.",
          "Detente y mira tu vida del revés. Esta pausa no es pérdida: es preparación."
        ],
        sombra: [
          "Te quedas quieto por miedo, no por sabiduría. Te sacrificas más de la cuenta y eso te vacía. Suelta el peso, muévete y vuelve a caminar.",
          "Te quedas quieto por miedo, no por sabiduría."
        ]
      },
      // La Muerte (13): transformación, finales, renacimiento
      muerte: {
        luz: [
          "Un ciclo termina para que algo grande nazca. Duele decir adiós, lo sé. Pero lo que se va te deja espacio para ser nueva. Suelta, transforma y renace con alas.",
          "Un ciclo termina para que algo grande nazca."
        ],
        sombra: [
          "No sueltas lo que ya murió y eso ocupa el lugar de lo nuevo. Mientras más abrazas el pasado, más le cueste a tu vida florecer. Deja morir para poder renacer.",
          "No sueltas lo que ya murió."
        ]
      },
      // La Templanza (14): armonía, paciencia, equilibrio
      templanza: {
        luz: [
          "Todo vuelve a su justa medida: tu cuerpo, tu mente y tu amor se equilibran. Respira despacio y confía en la calma. La sanación llegará sola, como el agua al valle.",
          "Todo vuelve a su justa medida."
        ],
        sombra: [
          "Los excesos te están desbordando. Mucho de lo que te daña, poco de lo que te nutre. Vuelve al punto medio y ahí encontrarás tu paz y tu ritmo.",
          "Los excesos te están desbordando."
        ]
      },
      // El Diablo (15): atadura, tentación, sombra
      diablo: {
        luz: [
          "Algo te tiene atado, y hoy lo ves: un miedo, una culpa, una costumbre o una persona que te encadena. Míralo de frente, porque mirarlo ya es desatarlo. La llave está en tu mano.",
          "Algo te tiene atado, y hoy lo ves."
        ],
        sombra: [
          "Ya rompiste esa cadena, ¿y ahora vuelves a meterte en ella? No retrocedas. Lo que te dolió una vez no merece una segunda vuelta. Eres libre, no lo olvides.",
          "Ya rompiste esa cadena."
        ]
      },
      // La Torre (16): ruptura, revelación, cambio súbito
      torre: {
        luz: [
          "Una verdad sacude tus cimientos y duele, lo acompañamos. Pero lo que cae hoy deja entrar la luz. Este golpe es una liberación: reconstruye sobre tierra más firme.",
          "Una verdad sacude tus cimientos y duele."
        ],
        sombra: [
          "Sabes que algo se está cayendo y lo sostienes por miedo. Déjalo caer. Nada sólido se construye sobre mentiras. Abdala el golpe, recoge tus pedazos y vuelve a levantarte.",
          "Sabes que algo se está cayendo y lo sostienes por miedo."
        ]
      },
      // La Estrella (17): esperanza, inspiración, sanación
      estrella: {
        luz: [
          "Después de la tormenta llega la calma. Tus heridas sanan y tu fe regresa con fuerza. Mira al cielo: tu estrella brilla solo para ti. Espera, cree y deja que la luz te bañe.",
          "Después de la tormenta llega la calma."
        ],
        sombra: [
          "Tienes la luz y no la miras. No dejes que un día gris te opaque los sueños. Tu estrella sigue arriba, encendida. Búscala y vuelve a creer.",
          "Tienes la luz y no la miras."
        ]
      },
      // La Luna (18): ilusión, sueños, intuición
      luna: {
        luz: [
          "No todo es lo que pareces, y lo sabes en el alma. Tus emociones van y vienen como la marea. Camina con calma: la verdad saldrá a la luz cuando estés lista.",
          "No todo es lo que pareces."
        ],
        sombra: [
          "Vives asustada de sombras que tú misma haces grandes. Baja el miedo, sube la razón y descansa. La noche da miedo en la imaginación: la realidad es más tranquila.",
          "Vives asustada de sombras que tú misma haces grandes."
        ]
      },
      // El Sol (19): alegría, éxito, vitalidad
      sol: {
        luz: [
          "El sol sale para ti: alegría, éxito y vitalidad te acompañan. Celebra lo que has construido y ríe fuerte, porque te lo mereces. Este es tu momento: vívelo a lo grande.",
          "El sol sale para ti: alegría, éxito y vitalidad."
        ],
        sombra: [
          "Tienes el sol y andas viendo nubes. Tu luz sigue ahí dentro, brillando. No la escondas por miedo ni por culpa: brilla, aunque otros quieran apagarte.",
          "Tienes el sol y andas viendo nubes."
        ]
      },
      // El Juicio (20): despertar, renacimiento, llamado
      juicio: {
        luz: [
          "Escuchas el llamado interior: ha llegado tu hora de levantarte, perdonar y renacer. El pasado te suelta y tú también suéltalo. Tu nueva vida ya está llamando a tu puerta.",
          "Escuchas el llamado interior."
        ],
        sombra: [
          "Dudas de tu valor y te quedas atrás. Deja de juzgarte con la voz de otros. Tú vales mucho y te lo repito hasta que lo creas: es tiempo de levantarte y creértelo.",
          "Dudas de tu valor."
        ]
      },
      // El Mundo (21): culminación, logro, totalidad
      mundo: {
        luz: [
          "Llegaste. Siembra de tus logros hoy mismo: cerraste un ciclo con éxito y eso merece festejo. Mira todo lo que construiste, agradece y prepara tu nuevo comienzo.",
          "Llegaste."
        ],
        sombra: [
          "Tan cerca de la meta y te detienes. Casi lo tienes, solo falta el último paso. No abandones ahora: el final completo es tuyo si sigues firme.",
          "Tan cerca de la meta y te detienes."
        ]
      }
    };
    
    // Detecta qué Arcano Mayor específico está presente en las cartas
    // Busca por nombre exacto (los nombres en tarot.js incluyen "El", "La", etc.)
    const tieneArcano = (nombreArcano) => {
      const patrones = [
        "el loco", "el mago", "la sacerdotisa", "la emperatriz", "el emperador",
        "el hierofante", "los enamorados", "el carro", "la fuerza", "el ermitaño",
        "la rueda de la fortuna", "la justicia", "el colgado", "la muerte",
        "la templanza", "el diablo", "la torre", "la estrella", "la luna",
        "el sol", "el juicio", "el mundo"
      ];
      return patrones.some(p => nombresCartas.includes(p));
    };
    
    // Determina el significado a usar basándose en qué Arcano Mayor esté presente
    // Si hay múltiples, usa el primero que encuentre (o el arcángel correspondiente)
    let significadoLuz, significadoSombra;
    
    // Mapeo de arcángeles a arcos que más suelen asociarse
    const asociacionArcangelArcano = {
      rafael: "muerte",     // Rafael = transformación/sanación
      miguel: "justicia",   // Miguel = verdad/justicia
      chamuel: "enamorados",// Chamuel = amor
      gabriel: "luna",      // Gabriel = comunicación
      uriel: "luna",        // Uriel = intuición
      zadkiel: "colgado",   // Zadkiel = perdón/liberación
      jofiel: "estrella",   // Jofiel = belleza/inspiración
    };
    
    // Determina qué Arcano Mayor usar para este arcángel en esta lectura
    const arcanoClave = asociacionArcangelArcano[claveArcangel] || "loco";
    const arcanoPresente = tieneArcano(arcanoClave);
    
    // Si el arcano asociado está presente, usa sus significados
    // Si no, usa un significado general basado en el tono
    if (arcanoPresente && significadosArcanoMayor[arcanoClave]) {
      significadoLuz = significadosArcanoMayor[arcanoClave].luz[0];
      significadoSombra = significadosArcanoMayor[arcanoClave].sombra[0];
    } else {
      // Fallback: usa significados genéricos basados en el tono
      significadoLuz = `Arcángel ${claveArcangel} te guía con energía luminosa: fuerzas positivas se alinean a tu favor para este área de tu vida. Confía en el proceso y permanece abierto a recibir`;
      significadoSombra = `Arcángel ${claveArcangel} te advierte sobre energías que requieren atención: hay aspectos en este área que piden ser vistos y sanados. No ignores las señales de alerta.`;
    }
    
    // Construye el mensaje principal (visible al instante) - más corto y directo
    const mensajePrincipal = tono === "luz" 
      ? `Arcángel ${claveArcangel} te dice: ${significadoLuz}`
      : `Arcángel ${claveArcangel} te regaña: ${significadoSombra}`;
    
    // El mensaje profundo (oculto, requiere revelación) - más detallado y personalizado
    // Usa los significados de las cartas reales si hay Arcano Mayor presente
    const mensajeProfundo = arcanoPresente 
      ? `Arcángel ${claveArcangel} profundiza: ${significadoLuz}. Tu situación actual involucra la energía de ${arcanoClave}, que trae temas de transformación y crecimiento espiritual. ` +
        `Cada Arcano Mayor tiene capas infinitas de significado, y este es solo un vistazo a cómo su energía se entrelaza con tu situación particular. ` +
        `Para una comprensión más profunda, contempla cómo el ${arcanoClave} se relaciona con tu pregunta y tu momento actual.`
      : `Arcángel ${claveArcangel} profundiza: ${significadoLuz}. ` +
        `Cada lectura es única porque la combinación de cartas crea un patrón nunca antes visto. ` +
        `Los Arcano Mayores tienen significados ricos que se entrelazan con tu pregunta específica, ` +
        `tu momento actual y el libre albedrío que ejerces. ` +
        `Este mensaje profundo requiere reflexión: medita sobre cómo la energía arcangélica ` +
        `se manifiesta en tu vida cotidiana y qué acción específica te sugiere para este área.`;
    
    // Si hay datos del arcángel, los integremos
    const datosArcangel = areaData || {};
    if (datosArcangel.luz > 0 && datosArcangel.sombra > 0) {
      // Retornamos ambos mensajes en un objeto estructurado
      return {
        mensajePrincipal,
        mensajeProfundo,
        // Indicadores para el UI
        tieneArcanoMayorPresente: arcanoPresente,
        arcanoAsociado: arcanoClave
      };
    }
    
    // Retornamos solo el mensaje principal si no hay datos completos del arcángel
    return {
      mensajePrincipal,
      mensajeProfundo: undefined,
      tieneArcanoMayorPresente: false
    };
}
     
     // Determina el significado a usar basándose en qué Arcano Mayor esté presente
     // Si hay múltiples, usa el primero que encuentre (o el arcángel correspondiente)
     let significadoLuz, significadoSombra;
     
     // Mapeo de arcángeles a arcos que más suelen asociarse
      significadoLuz = `Arcángel ${claveArcangel} te guía con energía luminosa: fuerzas positivas se alinean a tu favor para este área de tu vida. Confía en el proceso y permanece abierto a recibir`;
      significadoSombra = `Arcángel ${claveArcangel} te advierte sobre energías que requieren atención: hay aspectos en este área que piden ser vistos y sanados. No ignores las señales de alerta.`;
    }
    
    // Construye el mensaje principal (visible al instante) - más corto y directo
    const mensajePrincipal = tono === "luz" 
      ? `Arcángel ${claveArcangel} te dice: ${significadoLuz}`
      : `Arcángel ${claveArcangel} te regaña: ${significadoSombra}`;
    
    // El mensaje profundo (oculto, requiere revelación) - más detallado y personalizado
    // Usa los significados de las cartas reales si hay Arcano Mayor presente
    const mensajeProfundo = arcanoPresente 
      ? `Arcángel ${claveArcangel} profundiza: ${significadoLuz}. ${significadoSombra}. ` +
        `Este mensaje se basa en la presencia de ${arcanoClave} en tu tirada, ` +
        `que trae su energía específica de transformación y contexto a tu lectura actual. ` +
        `Cada Arcano Mayor tiene capas infinitas de significado, y este es solo un vistazo ` +
        `a cómo su energía se entrelaza con tu situación particular. ` +
        `Para una comprensión más profunda, contempla cómo el ${arcanoClave} se relaciona ` +
        `con las otras cartas de tu tirada y con tu pregunta específica.`
      : `Arcángel ${claveArcangel} profundiza: ${significadoLuz}. ` +
        `Cada lectura es única porque la combinación de cartas crea un patrón nunca antes visto. ` +
        `Los Arcano Mayores tienen significados ricos que se entrelazan con tu pregunta específica, ` +
        `tu momento actual y el libre albedrío que ejerces. ` +
        `Este mensaje profundo requiere reflexión: medita sobre cómo la energía arcangélica ` +
        `se manifiesta en tu vida cotidiana y qué acción específica te sugiere para este área.`;
    
    // Si hay datos del arcángel, los integremos
    const datosArcangel = areaData || {};
    if (datosArcangel.luz > 0 && datosArcangel.sombra > 0) {
      // Retornamos ambos mensajes en un objeto estructurado
      return {
        mensajePrincipal,
        mensajeProfundo,
        // Indicadores para el UI
        tieneArcanoMayorPresente: arcanoPresente,
        arcanoAsociado: arcanoClave
      };
    }
    
    // Retornamos solo el mensaje principal si no hay datos completos del arcángel
    return {
      mensajePrincipal,
      mensajeProfundo: undefined,
      tieneArcanoMayorPresente: false
    };
  }
    
    // --- SISTEMA DE SIGNIFICADOS INDIVIDUALIZADOS DE CADA CARTA ---
    // Cada Arcano Mayor tiene múltiples significados que se seleccionan según el contexto
    const significadosCartas = {
      // Loco (0): nuevos comienzos, libertad, aventura
      loco: {
        luz: [
          "El Loco representa un nuevo comienzo valiente: confía en que el universo te atrapará mientras te lanzas al desconocido.",
          "Tu llamado a la aventura está sonando fuerte. El Loco te dice: el mundo es grande y tú tienes alas.",
          "Un nuevo capítulo comienza: deja de planear demasiado y comienza a vivir. La prisa no es tu amiga, pero el valor sí."
        ],
        sombra: [
          "El Loco sombrío: estás corriendo sin mirar. La prisa te llevará a errores que podrías evitar con un poco de cuidado.",
          "Te falta dirección: quieres todo ya, sin plan ni responsabilidad. Para, respira y piensa antes de saltar.",
          "Estás automedicando tu necesidad de libertad con acciones temerarias. Cuidado: la libertad sin responsabilidad es caos."
        ]
      },
      // Mago (1): poder, manifestación, talento
      mago: {
        luz: [
          "El Mago canaliza el poder divino: todo lo que necesitas ya está dentro de ti. talento, palabra y fuerza.",
          "Hoy puedes hacer real lo que imaginas. Cree en ti, actúa con calma y verás tu deseo tomar forma.",
            "Tu talento está alineado con la energía universal: este es tu momento de manifestar tus sueños con calma."
        ],
        sombra: [
          "El Mago invertido: tienes un gran poder y lo estás dejando dormir. Nada de excusas: úsalo ahora o la vida lo pondrá en otras manos.",
            "Te falta enfoque: promis excesos sin follow-through. Tus dones te esperan, pero eliges no usarlos."
          ]
      },
      // La Sacerdotisa (2): intuición, misterio, sabiduría interna
      sacerdotisa: {
        luz: [
          "La Sacerdotisa susurra que la verdad está adentro: siéntate en silencio, respira y escucha tu corazón.",
            "Tu intuición es tu guía más confiable. No busques afuera lo que ya sabes en tu interior.",
            "La verdad no está afuera: está en ti, esperando que la oigas en el silencio."
        ],
        sombra: [
          "La Sacerdotisa sombría: llevas callando lo que sientes y ese silencio te pesa. Guardas secretos que no te dejan dormir.",
            "Habla tu verdad y vuelve a escuchar tu voz interior. El secreto que tanto guardas te está volviendo amarga."
        ]
      },
      // Emperatriz (3): abundancia, fertilidad, cuidado
      emperatriz: {
        luz: [
          "Es tu tiempo de florecer. Cuida lo que amas, riega tus sueños y deja que la abundancia entre por la puerta ancha.",
            "Te espera un regazo de paz y de frutos. Disfrútalo y agradece: esta es tu temporada de plenitud.",
            "La abundancia fluye hacia ti cuando cuidas lo que amas. Tu creatividad es un regalo que el universo celebra."
        ],
        sombra: [
          "Te estás descuidando. Dejas tu cuerpo, tu creatividad y tus sueños en el último lugar. Vuélvete tu primera prioridad: si tú no te nutres, nada florece.",
            "No pospongas tu nutrición emocional y física más tiempo. Si tú no te nutres, nada florece."
        ]
      },
      // ... (continuaría con todas las cartas)
    };
    
    // ... resto del método
    
    // Detecta Arcano Mayores y palos por nombre (nombres como "El Loco", "La Muerte", etc.)
    const tieneLoco = nombresCartas.includes("loco");
    const tieneMundo = nombresCartas.includes("mundo");
    const tieneMago = nombresCartas.includes("mago");
    const tienePapisa = nombresCartas.includes("papisa") || nombresCartas.includes("la papisa");
    const tieneSumoSacerdote = nombresCartas.includes("sumo sacerdote") || nombresCartas.includes("el sumo sacerdote");
    const tienenBastos = nombresCartas.some(n => n.includes("bastos"));
    const tienenCopas = nombresCartas.some(n => n.includes("copas"));
    const tienenOros = nombresCartas.some(n => n.includes("oros"));
    const tienenEspadas = nombresCartas.some(n => n.includes("espadas"));
    const cartasInvertidas = cartas.filter(c => c?.invertido).length;
    const cartasDerechas = cartas.filter(c => !c?.invertido).length;
    
    // Patrón de cartas para selección de mensaje (0-1023 combinaciones únicas)
    // Cada combinación de cartas (presencia/ausencia de cada tipo) produce un número diferente
    const patronCartas = (
      (tieneLoco ? "1" : "0") +
      (tieneMundo ? "2" : "0") +
      (tieneMago ? "4" : "0") +
      (tienePapisa ? "8" : "0") +
      (tieneSumoSacerdote ? "16" : "0") +
      (tienenBastos ? "32" : "0") +
      (tienenCopas ? "64" : "0") +
      (tienenOros ? "128" : "0") +
      (tienenEspadas ? "256" : "0")
    );
    const indicePatron = parseInt(patronCartas, 10);
    
    // Contador de cuántas variantes tenemos para este arcoángel y tono
    // Usamos el índice de patrón módulo disponible variantes para asegurar variación cíclica
    const mensajesExpandidos = {
      rafael: {
        luz: [
          // Variante 1: con Loco
          tieneLoco
            ? `Arcángel Rafael te dice: El Loco aparece en tu sanación, llamándote a soltar el control sobre tu cuerpo. Confía en que el universo cuidará de ti mientras te entregas al flujo natural de la recuperación.`
            : // Variante 2: con Mundo
            tieneMundo
            ? `Arcángel Rafael te dice: El Mundo señala que tu sanación está plenamente realizada en todos los niveles. Tu cuerpo y alma han integrado completamente las lecciones de curación.`
            : // Variante 3: con Mago
            tieneMago
            ? `Arcángel Rafael te dice: Con el Mago presente, tienes el poder divino de sanar. Tu intención combinada con la energía celestial crea milagros en tu bienestar físico.`
            : // Variante 4: con La Papisa
            tienePapisa
            ? `Arcángel Rafael te dice: La Papisa te susurra que la sanación viene de dentro. Escucha la sabiduría de tu cuerpo, no solo de fuentes externas.`
            // Variante 5: patrón general (siempre disponible)
            : `Arcángel Rafael te dice: La sanación está en proceso y tu equilibrio vuelve a asentirse. Respira, descansa y confía: tu cuerpo y tu alma se están reparando en silencio. Este renacer ya empezó.`
        ],
        sombra: [
          tieneLoco
            ? `Arcángel Rafael te regaña: El Loco en sombra indica que te estás automedicando o neglectando tu salud física. Cuidarte es supervivencia, no egoísmo.`
            : tieneMundo
            ? `Arcángel Rafael te regaña: El Mundo invertido indica que pospones tu sanación indefinidamente. Tu cuerpo ya te cobra la cuenta.`
            : tieneMago
            ? `Arcángel Rafael te regaña: Con el Mago invertido, estás usando tu poder para dañar tu propio cuerpo en lugar de sanarlo. Reclama tu poder para sanar.`
            // Variante 4: general sombra
            : `Arcángel Rafael te regaña: Dejas que el cansancio y el dolor se acumulen sin atención. Cuidarte es tu derecho divino, no un favor que te haces a ti mismo.`
        ]
      },
      miguel: {
        luz: [
          tieneLoco
            ? `Arcángel Miguel te dice: El Loco te llama a nuevas batallas espirituales. Aventúrate con fe, sabiendo que estás protegido en cada paso.`
            : tieneMundo
            ? `Arcángel Miguel te dice: El Mundo confirma que tu escudo protector está completo y funcional. Ninguna oscuridad puede atravesarlo.`
            : tieneMago
            ? `Arcángel Miguel te dice: Con el Mago, tu poder para crear límites es magnificado. Puedes manifestar protección divina en tu vida.`
            // Variante 4: general luz
            : `Arcángel Miguel te dice: tu protección está activa y las energías se alinean a tu favor. Ninguna oscuridad puede tocarte mientras mantengas tus límites firmes y tu fe alta.`
        ],
        sombra: [
          tieneLoco
            ? `Arcángel Miguel me regaña: El Loco sombrío indica que has caído en descuido espiritual. Tu falta de protección te ha expuesto a energías negativas.`
            : tieneMundo
            ? `Arcángel Miguel me regaña: El Mundo invertido significa que tu escudo se ha debilitado por falta de atención. Reforzarlo ya.`
            // Variante 3: general sombra
            : `Arcángel Miguel me regaña: Has permitido vulnerabilidades en tu campo energético al bajar la guardia demasiado pronto.`
        ]
      },
      chamuel: {
        luz: [
          // Variantes para Chamuel basadas en patrón
          tieneLoco
            ? `Arcángel Chamuel te dice: El Loco en amor trae un nuevo comienzo apasionante. Entrega tu corazón con libertad, sin ataduras del pasado.`
            : tieneMundo
            ? `Arcángel Chamuel te dice: El Mundo en amor indica un ciclo completo y satisfactorio. Tu capacidad de amar está plenamente realizada.`
            : `Arcángel Chamuel te dice: el amor fluye hacia ti. Abre la mano y recibe: mereces ser amado sin condiciones.`
        ],
        sombra: [
          tieneLoco
            ? `Arcángel Chamuel te regaña: El Loco sombrío en amor indica que entregas tu corazón donde no es valorado. Deja de mendigar cariño.`
            : `Arcángel Chamuel te regaña: estás buscando amor en los lugares equivocados. Quiérete con dignidad primero.`
        ]
      },
      gabriel: {
        luz: [
          tieneLoco
            ? `Arcángel Gabriel te dice: El Loco trae un mensaje inesperado y divino. Presta atención a señales nuevas y sorprendentes.`
            : tieneMundo
            ? `Arcángel Gabriel te dice: El Mundo confirma que el mensaje que esperabas se está materializando. Confía en el timing divino.`
            : `Arcángel Gabriel te dice: los mensajes y señales están alineándose. Presta atención a las sincronías del universo.`
        ],
        sombra: [
          tieneLoco
            ? `Arcángel Gabriel me regaña: El Loco sombrío indica que ignoras las señales del cosmos. Te aferras a lo que quieres oír, no a lo que necesitas.`
            : `Arcángel Gabriel me regaña: Has dejado de escuchar. Repites lo que quieres oír en vez de lo que necesitas.`
        ]
      },
      uriel: {
        luz: [
          // Variantes Uriel
          tieneLoco
            ? `Arcángel Uriel te dice: El Loco en tu lectura enciende tu luz interior. Confía en esta certeza que surge espontáneamente.`
            : tieneMundo
            ? `Arcángel Uriel te dice: El Mundo confirma tu luz interior brillante y duradera.`
            : `Arcángel Uriel: tu luz interior se está encendiendo. Confía en tu certeza interior.`
        ],
        sombra: [
          tieneLoco
            ? `Arcángel Uriel te regaña: El Loco sombrío apaga tu luz interior. Reacciona antes de que todo oscuridad te cubra.`
            : `Arcángel Uriel te regaña: necesitas más análisis y menos impulso.`
        ]
      },
      zadkiel: {
        luz: [
          tieneLoco
            ? `Arcángel Zadkiel te dice: El Loco trae liberación inesperada. Suelta todo y deja que el cielo te sostenga.`
            : tieneMundo
            ? `Arcángel Zadkiel te dice: El Mundo indica que la liberación ya es completa. Celebra tu libertad nueva.`
            : `Arcángel Zadkiel: la libertad está disponible para ti hoy, liberada por gracia divina.`
        ],
        sombra: [
          tieneLoco
            ? `Arcángel Zadkiel te regaña: El Loco sombrío mantiene cadenas invisibles en tu alma. Perdonar es la llave maestra.`
            : `Arcángel Zadkiel me regaña: necesitas perdonar para liberarte de cargas pasadas.`
        ]
      },
      jofiel: {
        luz: [
          tieneLoco
            ? `Arcángel Jofiel te dice: El Loco inspira nueva belleza. Enciende tu propia llama creativa.`
            : tieneMundo
            ? `Arcángel Jofiel te dice: El Mundo brilla tu luz interior. Florece con tus propios colores.`
            : `Arcángel Jofiel: la inspiración divina está floreciendo a tu alrededor.`
        ],
        sombra: [
          tieneLoco
            ? `Arcángel Jofiel te regaña: El Loco sombrío ensombrece tu belleza. Deja de compararte y enciende tu propia lámpara.`
            : `Arcángel Jofiel me regaña: necesitas enfocarte en tu propia belleza única.`
        ]
      }
    };
    
    // --- LÓGICA SELECCIÓN DE MENSAJE ---
    // Usamos el índice de patrón para variar el mensaje, asegurando que cada combinación de cartas
    // produzca un mensaje diferente. Si el arcoángel no tiene variantes definidas, usamos fallback.
    
    const arcangelMsg = mensajesExpandidos[claveArcangel];
    if (!arcangelMsg) {
      // Fallback: mensaje genérico basado en tono y área
      return `Arcángel ${claveArcangel} te guía hoy con energía ${tono} en el área ${areaData.area || "general"}.`;
    }
    
    const variantes = arcangelMsg[tono];
    if (!variantes || variantes.length === 0) {
      // Fallback seguro si el arcoángel no tiene variantes para ese tono
      return `Arcángel ${claveArcangel} te envía su bendición ${tono} hoy.`;
    }
    
    // Usamos índice de patrón para seleccionar variante.
    // Módulo asegura que volvamos al inicio si hay más patrones que variantes.
    const idx = indicePatron >= variantes.length ? indicePatron % variantes.length : indicePatron;
    const msg = variantes[idx];
    
    // Integrar datos del arcángel si están disponibles
    const datosArcangel = areaData || {};
    if (datosArcangel.luz > 0 && datosArcangel.sombra > 0) {
      return msg.replace("Arcángel", `Arcángel (con presencia mixta de ${datosArcangel.luz} luces y ${datosArcangel.sombra} sombras)`);
    }
    
    return msg;
  }
    const tieneLoco = nombresCartas.includes("loco");
    const tieneMundo = nombresCartas.includes("mundo");
    const tieneMago = nombresCartas.includes("mago");
    const tienePapisa = nombresCartas.includes("papisa") || nombresCartas.includes("la papisa");
    const tieneSumoSacerdote = nombresCartas.includes("sumo sacerdote") || nombresCartas.includes("el sumo sacerdote");
    const tienenBastos = nombresCartas.some(n => n.includes("bastos"));
    const tienenCopas = nombresCartas.some(n => n.includes("copas"));
    const tienenOros = nombresCartas.some(n => n.includes("oros"));
    const tienenEspadas = nombresCartas.some(n => n.includes("espadas"));
    const cartasInvertidas = cartas.filter(c => c.invertido).length;
    const cartasDerechas = cartas.filter(c => !c.invertido).length;
    
    // Patrón de cartas para selección de mensaje (0-1023 combinaciones únicas)
    const patronCartas = (
      (tieneLoco ? "1" : "0") +
      (tieneMundo ? "2" : "0") +
      (tieneMago ? "4" : "0") +
      (tienePapisa ? "8" : "0") +
      (tieneSumoSacerdote ? "16" : "0") +
      (tienenBastos ? "32" : "0") +
      (tienenCopas ? "64" : "0") +
      (tienenOros ? "128" : "0") +
      (tienenEspadas ? "256" : "0")
    );
    const indicePatron = parseInt(patronCartas, 10);
    
    // Mensajes ampliados por arcángel, tono y patrón de cartas
    // Cada arcángel tiene múltiples variantes por patrón de cartas
    const mensajesExpandidos = {
      rafael: {
        luz: [
          tieneLoco
            ? `Arcángel Rafael te dice: El Loco aparece en tu sanación, llamándote a soltar el control sobre tu cuerpo. Confía en que el universo cuidará de ti mientras te entregas al flujo natural de la recuperación.`
            : tieneMundo
            ? `Arcángel Rafael te dice: El Mundo señala que tu sanación está plenamente realizada en todos los niveles. Tu cuerpo y alma han integrado completamente las lecciones de curación.`
            : tieneMago
            ? `Arcángel Rafael te dice: Con el Mago presente, tienes el poder divino de sanar. Tu intención combinada con la energía celestial crea milagros en tu bienestar físico.`
            : tienePapisa
            ? `Arcángel Rafael te dice: La Papisa te susurra que la sanación viene de dentro. Escucha la sabiduría de tu cuerpo, no solo de fuentes externas.`
            : `Arcángel Rafael te dice: La sanación está en proceso y tu equilibrio vuelve a asentirse. Respira, descansa y confía: tu cuerpo y tu alma se están reparando en silencio. Este renacer ya empezó.`
        ],
        sombra: [
          tieneLoco
            ? `Arcángel Rafael te regaña: El Loco en sombra indica que te estás automedicando o neglectando tu salud física. Cuidarte es supervivencia, no egoísmo.`
            : tieneMundo
            ? `Arcángel Rafael te regaña: El Mundo invertido indica que pospones tu sanación indefinidamente. Tu cuerpo ya te cobra la cuenta.`
            : tieneMago
            ? `Arcángel Rafael te regaña: Con el Mago invertido, estás usando tu poder para dañar tu propio cuerpo en lugar de sanarlo. Reclama tu poder para sanar.`
            : `Arcángel Rafael te regaña: Dejas que el cansancio y el dolor se acumulen sin atención. Cuidarte es tu derecho divino, no un favor que te haces a ti mismo.`
        ]
      },
      miguel: {
        luz: [
          tieneLoco
            ? `Arcángel Miguel te dice: El Loco te llama a nuevas batallas espirituales. Aventúrate con fe, sabiendo que estás protegido en cada paso.`
            : tieneMundo
            ? `Arcángel Miguel te dice: El Mundo confirma que tu escudo protector está completo y funcional. Ninguna oscuridad puede atravesarlo.`
            : tieneMago
            ? `Arcángel Miguel te dice: Con el Mago, tu poder para crear límites es magnificado. Puedes manifestar protección divina en tu vida.`
            : `Arcángel Miguel te dice: tu protección está activa y las energías se alinean a tu favor. Ninguna oscuridad puede tocarte mientras mantengas tus límites firmes y tu fe alta.`
        ],
        sombra: [
          tieneLoco
            ? `Arcángel Miguel te regaña: El Loco sombrío indica que has caído en descuido espiritual. Tu falta de protección te ha expuesto a energías negativas.`
            : tieneMundo
            ? `Arcángel Miguel te regaña: El Mundo invertido significa que tu escudo se ha debilitado por falta de atención. Reforzarlo ya.`
            : `Arcángel Miguel me regaña: Has permitido vulnerabilidades en tu campo energético al bajar la guardia demasiado pronto.`
        ]
      },
      chamuel: {
        luz: [
          tieneLoco
            ? `Arcángel Chamuel te dice: El Loco en amor trae un nuevo comienzo apasionante. Entrega tu corazón con libertad, sin ataduras del pasado.`
            : tieneMundo
            ? `Arcángel Chamuel te dice: El Mundo en amor indica un ciclo completo y satisfactorio. Tu capacidad de amar está plenamente realizada.`
            : `Arcángel Chamuel te dice: el amor fluye hacia ti. Abre la mano y recibe: mereces ser amado sin condiciones.`
        ],
        sombra: [
          tieneLoco
            ? `Arcángel Chamuel te regaña: El Loco sombrío en amor indica que entregas tu corazón donde no es valorado. Deja de mendigar cariño.`
            : `Arcángel Chamuel te regaña: estás buscando amor en los lugares equivocados. Quiérete con dignidad primero.`
        ]
      },
      gabriel: {
        luz: [
          tieneLoco
            ? `Arcángel Gabriel te dice: El Loco trae un mensaje inesperado y divino. Presta atención a señales nuevas y sorprendentes.`
            : tieneMundo
            ? `Arcángel Gabriel te dice: El Mundo confirma que el mensaje que esperabas se está materializando. Confía en el timing divino.`
            : `Arcángel Gabriel te dice: los mensajes y señales están alineándose. Presta atención a las sincronías del universo.`
        ],
        sombra: [
          tieneLoco
            ? `Arcángel Gabriel te regaña: El Loco sombrío indica que ignoras las señales del cosmos. Te aferras a lo que quieres oír, no a lo que necesitas.`
            : `Arcángel Gabriel me regaña: Has dejado de escuchar. Repites lo que quieres oír en vez de lo que necesitas.`
        ]
      },
      uriel: {
        luz: [
          tieneLoco
            ? `Arcángel Uriel te dice: El Loco en tu lectura enciende tu luz interior. Confía en esta certeza que surge espontáneamente.`
            : tieneMundo
            ? `Arcángel Uriel te dice: El Mundo confirma tu luz interior brillante y duradera.`
            : `Arcángel Uriel: tu luz interior se está encendiendo. Confía en tu certeza interior.`
        ],
        sombra: [
          tieneLoco
            ? `Arcángel Uriel te regaña: El Loco sombrío apaga tu luz interior. Reacciona antes de que todo oscuridad te cubra.`
            : `Arcángel Uriel te regaña: necesitas más análisis y menos impulso.`
        ]
      },
      zadkiel: {
        luz: [
          tieneLoco
            ? `Arcángel Zadkiel te dice: El Loco trae liberación inesperada. Suelta todo y deja que el cielo te sostenga.`
            : tieneMundo
            ? `Arcángel Zadkiel te dice: El Mundo indica que la liberación ya es completa. Celebra tu libertad nueva.`
            : `Arcángel Zadkiel: la libertad está disponible para ti hoy, liberada por gracia divina.`
        ],
        sombra: [
          tieneLoco
            ? `Arcángel Zadkiel te regaña: El Loco sombrío mantiene cadenas invisibles en tu alma. Perdonar es la llave maestra.`
            : `Arcángel Zadkiel me regaña: necesitas perdonar para liberarte de cargas pasadas.`
        ]
      },
      jofiel: {
        luz: [
          tieneLoco
            ? `Arcángel Jofiel te dice: El Loco inspira nueva belleza. Enciende tu propia llama creativa.`
            : tieneMundo
            ? `Arcángel Jofiel te dice: El Mundo brilla tu luz interior. Florece con tus propios colores.`
            : `Arcángel Jofiel: la inspiración divina está floreciendo a tu alrededor.`
        ],
        sombra: [
          tieneLoco
            ? `Arcángel Jofiel te regaña: El Loco sombrío ensombrece tu belleza. Deja de compararte y enciende tu propia lámpara.`
            : `Arcángel Jofiel me regaña: necesitas enfocarte en tu propia belleza única.`
        ]
      }
    };
    
    // Selecciona la variante apropiada basándose en el patrón de cartas
    const arcangelMsg = mensajesExpandidos[claveArcangel];
    // Fallback seguro: usar índice de patrón o 0, nunca mensajes fijos originales
    const variantes = arcangelMsg ? arcangelMsg[tono] : [];
    const idx = variantes.length > 0 ? (indicePatron % variantes.length) : 0;
    const msg = variantes[idx] || `Arcángel ${claveArcangel} te guía hoy con energía renovada.`;
    
    // Integrar datos del arcángel si están disponibles
    const datosArcangel = areaData || {};
    if (datosArcangel.luz > 0 && datosArcangel.sombra > 0) {
      return msg.replace("Arcángel", `Arcángel (con presencia mixta de ${datosArcangel.luz} luces y ${datosArcangel.sombra} sombras)`);
    }
    
    return msg;
  },
  
  // Método auxiliar para obtener las últimas cartas (si resultado no está disponible)
  obtenerUltimasCartas() {
    // Esto sería llamado desde el contexto donde hay acceso a cartas
    // Por defecto retorna array vacío para que el método no rompa
    return [];
  }
    };
    
    // Selecciona la variante apropiada basándose en el patrón
    const arcangelMsg = mensajesExpandidos[claveArcangel];
    if (!arcangelMsg) return this.mensajesArcangel[claveArcangel][tono];
    
    const variantes = arcangelMsg[tono];
    if (!variantes) return this.mensajesArcangel[claveArcangel][tono];
    
    // Usa el índice de patrón o cae de vuelta al índice 0
    const idx = indicePatron >= variantes.length ? 0 : indicePatron;
    const msg = variantes[idx];
    
    // Si hay datos del arcángel, los integramos
    if (areaData && areaData.luz > 0 && areaData.sombra > 0) {
      return msg.replace("Arcángel", `Arcángel (con presencia mixta de ${areaData.luz} luces y ${areaData.sombra} sombras)`);
    }
    
    return msg;
  }
    };

    const msg = mensajesPersonalizados[claveArcangel] ? mensajesPersonalizados[claveArcangel][tono] : this.mensajesArcangel[claveArcangel][tono];
    
    // Si hay datos específicos del arcángel, los integramos
    if (areaData && areaData.luz > 0 && areaData.sombra > 0) {
      return msg.replace("Arcángel", `Arcángel (con presencia mixta de ${areaData.luz} luces y ${areaData.sombra} sombras)`);
    }
    
    return msg;
  },

    /* filtra solo las áreas de los arcángeles que participan en esta lectura */
    const elegidos = (resultado.__arcangeles || this.arcangelesDeLectura(resultado)).map(a => a.clave);
    const areas = allAreas.filter(a => elegidos.includes(a.clave));

    const cierrePoderoso = propor >= 0.5
      ? "Este es el final, y es un llamado a tu grandeza: deja de mirar tu vida desde afuera y entra en ella con todo. Lo que hoy es semilla se vuelve fruto, lo que hoy es herida se vuelve fuerza. Confía, actúa y deja que este mensaje te sostenga cada día."
      : "No hay más vueltas que dar: este es el despertar que pediste. Las cartas no vinieron a castigarte, vinieron a mostrarte lo que no querías ver para que al fin te liberes. Deja de posponer tu verdad, suelta lo que te pesa, perdona lo que te ata, y hoy mismo da el paso que tu corazón viene pidiéndote. Eres más fuerte que tu miedo: demuéstralo.";

    const finalBloques = areas.map(a => ({
      icono: a.icono,
      area: a.area,
      titulo: a.titulo,
      arcangel: this.arcangeles[a.clave],
      regano: propor < 0.5,
      presencia: this.fraseArea(this.arcangeles[a.clave], a.clave === "chamuel" ? "amor" : a.clave),
      texto: a.texto
    }));

    if (resultado.fuerte) {
      const regente = this.arcangelRegente(resultado);
      const A = this.nombreCorto(regente.nombre);
      finalBloques.push({
        icono: "🔥",
        area: "fuerte",
        titulo: "El regaño final",
        arcangel: regente,
        regano: true,
        presencia: `${regente.nombre} no te suelta la mano, pero hoy te aprieta fuerte:`,
        texto: `He escuchado todo lo que tu alma no se atreve a decir en voz alta, y vengo desde el cielo a decírtelo yo. Deja de esconderte detrás de excusas, de cansancio y de 'mañana empiezo'. Esta lectura fue fuerte porque tu momento lo pide: las cartas te mostraron salidas que seguís ignorando. No vengo a castigarte, ${A} te habla con la dureza de quien te ama: despierta, muévete, y no le des más vueltas a lo que ya sabes que tienes que hacer.`
      });
    }

    finalBloques.push(this.bloqueCombinacionGlobal(resultado), { cierre: true, texto: cierrePoderoso, cita });
    return finalBloques;
  },
  /* ----------------------- GRAN TIRADA · 14 cartas ------------------------ */
  /* asigna cada tema de la gran tirada al arcángel que lo custodia */
  granTiradaArea: {
    "Situación general": "miguel",
    "Trabajo y proyecto": "miguel",
    "Amor y relaciones": "chamuel",
    "Familia y hogar": "chamuel",
    "Salud y energía": "rafael",
    "Lección del alma": "rafael",
    "Espiritualidad y fe": "gabriel",
    "Consejo del cielo": "gabriel",
    "Economía y abundancia": "uriel",
    "Presente que te sostiene": "uriel",
    "Bloqueo a liberar": "zadkiel",
    "Pasado que te marcó": "zadkiel",
    "Futuro que se acerca": "jofiel",
    "Resultado final": "jofiel"
  },

  /* voces de cada arcángel en primera persona: opinión luminosa, aviso
     matizado o regaño firme; el arcángel nunca nombra las cartas, solo
     entrega el mensaje que su lectura le inspira */
  voces: {
    miguel: {
      luz: "Arcángel Miguel te dice: hoy estás protegida y más fuerte de lo que crees. Tu fuerza se está ordenando y nada puede tumbarla mientras camines con fe y con tus límites bien puestos. Esta batalla no es tuya sola: la estamos ganando los dos.",
      mixto: "Arcángel Miguel te dice: tienes protección, sí, pero hay una grieta que no puedes seguir ignorando. Hay personas cerca que gastan tu energía y tú no dices nada. Refuerza tu escudo, elige bien tus batallas y no dejes tu guardia en manos de quien no te cuida.",
      sombra: "Arcángel Miguel te regaña: has bajado el escudo demasiado pronto. Te estás exponiendo donde no hay protección y entregando tu fuerza donde no te valoran. Es hora de ponerte firme, de reclamar tu lugar y de dejar de dar tu poder a quien no lo merece. Levántate y defiéndete.",
      fuerte: "¡Basta de hacerse el fuerte por fuera y el frágil por dentro! Arcángel Miguel te habla sin paños calientes: estás permitiendo que entren a tu vida quien no debería, y tú, con tus propias manos, les abres la puerta. Deja de pedir permiso para protegerte y deja de explicar por qué te cuidas. Tu paz no se negocia: se defiende. Hoy mismo pon los límites que has estado posponiendo."
    },
    chamuel: {
      luz: "Arcángel Chamuel te dice: el amor real ya está tocando tu corazón, y va a llegar, sanar o liberar justo lo que necesitas. Abre la mano y recibe, sin miedo a querer ni a ser querido. El cielo confirma tu unión.",
      mixto: "Arcángel Chamuel te dice: hay amor, sí, pero también hay un nudo que duele callado. No confundas silencio con paz ni distancia con indiferencia. Habla lo que sientes con honestidad: decirlo no rompe nada, callarlo sí puede romperlo todo.",
      sombra: "Arcángel Chamuel te regaña: estás poniendo tu corazón donde no lo cuidan, o cerrando la puerta a quien sí te quiere bien. Deja de mendigar cariño donde solo hay ego. Quiérete con dignidad: el amor que mereces empieza por el que tú misma te das.",
      fuerte: "¡Abre los ojos! Arcángel Chamuel te habla sin dulzura esta vez: sigues entregando tu corazón a quien te lo devuelve roto, y encima te sientes culpable. Deja de confundir amor con sacrificio y de perdonar lo que ni siquiera te han pedido perdón. Quiérete con dignidad o el amor pasará de largo frente a tu puerta. Basta de mendigar cariño: el amor que mereces emana de ti."
    },
    rafael: {
      luz: "Arcángel Rafael te dice: estás sanando, de verdad. Tu cuerpo, tu mente y tu alma se están equilibrando otra vez. Respira hondo, descansa y confía: la medicina del cielo ya está trabajando en ti.",
      mixto: "Arcángel Rafael te dice: la sanación viene en camino, pero hay algo que te estás negando a atender. Ese cansancio, ese dolor o esa calma que pospones tiene voz. Escúchala hoy: cuidarte no es egoísmo, es el único camino para seguir brillando.",
      sombra: "Arcángel Rafael te regaña: deja de descuidarte. Te das a todos y no te queda nada para ti, y tu cuerpo te lo está avisando. No postergues más tu salud ni tu paz: el descanso y el cuidado no se ganan, se toman. Empieza hoy.",
      fuerte: "¡Detente! Arcángel Rafael habla en serio: estás apagando la única vela que ilumina tu vida, y esa vela eres tú. Siempre postergas tu salud y tu descanso para el final, siempre eres el último en tu lista, y tu cuerpo ya te está cobrando. Deja de sacrificarte por quienes ni se dan cuenta. Cuidarte no es egoísmo: es tu obligación contigo. Hoy mismo, una cosa: descansa."
    },
    gabriel: {
      luz: "Arcángel Gabriel te dice: el mensaje que esperabas está en camino y tu propósito se está aclarando. Presta atención a las señales, a las palabras y a las coincidencias: por ahí te está hablando el cielo, y esta vez no vas a fallar.",
      mixto: "Arcángel Gabriel te dice: la verdad está cerca, pero llega envuelta en ruido. No te apresures a cerrar conclusiones: revisa lo que escuchas, contrasta lo que crees y el mensaje puro llegará a tu corazón sin que tengas que forzarlo.",
      sombra: "Arcángel Gabriel te regaña: has dejado de escuchar. Repites lo que quieres oír en vez de lo que necesitas, y por eso sigues en el mismo lugar. Cállate un momento, vuelve a preguntar y abre los oídos: la respuesta no llega hasta que te haces silencio.",
      fuerte: "¡Deja de hacerte la sorda! Arcángel Gabriel te habla fuerte para que lo escuches de una vez: llevas años oyendo lo que quieres y tapando lo que necesitas. Te escondes detrás del ruido, del miedo y de las excusas. Hoy calla todo, siéntate y escucha la verdad que ya sabes: la respuesta siempre estuvo ahí, esperándote. No pidas más señales si no piensas obedecerlas."
    },
    uriel: {
      luz: "Arcángel Uriel te dice: tu luz interior se encendió y ahora ves con claridad lo que otros no comprenden. Confía en esa certeza que sientes en el pecho: tus decisiones tienen luz propia y te van a llevar a buen puerto.",
      mixto: "Arcángel Uriel te dice: tienes la verdad cerca, pero el impulso te empuja a decidir antes de tiempo. Detente, examina y compara. La sabiduría que buscas no está en actuar más rápido, sino en mirar más profundo.",
      sombra: "Arcángel Uriel te regaña: estás actuando por impulso y dejando que la emoción nuble tu juicio, y eso te está costando caro. Pide tiempo, toma distancia y decide desde la luz, no desde el miedo. No corras: primero mira.",
      fuerte: "¡Decide de una vez! Arcángel Uriel te habla sin rodeos: llevas tanto tiempo dudando que ya no es prudencia, es miedo con disfraz. No actúes por impulso, sí, pero tampoco te quedes paralizada por siempre: la vida también se te pasa esperando el momento perfecto. Mira con claridad, decide con firmeza y camina. El que no elige, elige perder."
    },
    zadkiel: {
      luz: "Arcángel Zadkiel te dice: la liberación llegó. Suelta la culpa, perdona lo que haya que perdonar y siente cómo entra la libertad. El pasado pesa menos hoy: esta es tu hora de soltar las cadenas y caminar ligero.",
      mixto: "Arcángel Zadkiel te dice: la llave está en tu mano, pero hay una cadena que tú mismo sigues manteniendo puesta. No se trata solo de que otros te suelten: hay algo que debes soltar tú. Date permiso hoy y el cielo te sostiene.",
      sombra: "Arcángel Zadkiel te regaña: llevas demasiado tiempo atada a la culpa, al rencor o a un pasado que ya no existe. Cada día que no perdonas, la cadena pesa más. Suelta la piedra, perdónate y perdona: tu alma no fue hecha para cargar tanto.",
      fuerte: "¡Suelta esa piedra! Arcángel Zadkiel te habla sin compasión a medias: el pasado que arrastras es tuyo porque tú lo cargas, no porque te lo hayan puesto. Perdonar no es para el otro: es para ti. Y si el otro no se arrepiente, perdonas igual, para soltarte tú. El rencor te está comiendo viva, y lo sabes. Basta de justificarlo."
    },
    jofiel: {
      luz: "Arcángel Jofiel te dice: la belleza y la luz que buscas ya están floreciendo a tu alrededor. Rodéate de lo que te eleva, confía en tu creatividad y verás tu mundo brillar con tus propios colores. Lo bueno que esperas ya viene.",
      mixto: "Arcángel Jofiel te dice: hay luz, pero todavía tienes los ojos puestos en lo que no fue. Deja de mirar atrás y déjate inspirar por lo nuevo. La belleza no entra donde la mirada anda nublada: limpia tu ventana y verás.",
      sombra: "Arcángel Jofiel te regaña: dejaste de ver la luz que sí tienes. Te comparas con otros y ensombreces tu propio camino, y así la inspiración huye de ti. Deja de mirar a lado y enciende tu propia lámpara: tu belleza no necesita permiso.",
      fuerte: "¡Enciende tu luz! Arcángel Jofiel te habla con energía: tienes un sol dentro y pasas la vida mirando la lámpara del vecino. Te comparas, te menosprecias y apagas tu propia chispa. Tu camino no es el de nadie más y tu belleza no pide permiso. Deja de mirar hacia los lados, mira hacia ti, y verás cómo todo lo que buscas ya estaba en ti."
    }
  },

  /* interpretación de la gran tirada: cada arcángel habla de sus dos temas,
     con opinión o regaño según las cartas que hayan salido en sus áreas */
  interpretacionGranTirada(resultado) {
    const bloques = [];
    const cita = this.citas[Math.floor(Math.random() * this.citas.length)];

    Object.keys(this.granTiradaArea).forEach((tema, i) => {
      const posiciones = resultado.tirada.posiciones.map(p => p[0]);
      const idxTema = posiciones.indexOf(tema);
      if (idxTema === -1) return;
      const carta = resultado.cartas[idxTema];
      const clave = this.granTiradaArea[tema];
      let bloque = bloques.find(b => b.clave === clave);
      if (!bloque) {
        bloque = { clave, arcangel: this.arcangeles[clave], temas: [] };
        bloques.push(bloque);
      }
      bloque.temas.push({ tema, carta });
    });

    return bloques.map(b => {
      const inv = b.temas.filter(t => t.carta.invertido).length;
      const tenor = inv === 0 ? "luz" : (inv === b.temas.length ? "sombra" : "mixto");
      
      // Usa el índice de patrón para seleccionar regaño variado
      const idx = indicePatron >= this.regaños[b.clave][tenor].length ? indicePatron % this.regaños[b.clave][tenor].length : indicePatron;
      const texto = resultado.fuerte
        ? this.regaños[b.clave][tenor][idx]
        : this.regaños[b.clave][tenor][idx];
      const arc = b.arcangel;
      return {
        icono: arc.emoji,
        area: b.clave,
        titulo: `${this.nombreCorto(arc.nombre)} · ${arc.regencia}`,
        temas: b.temas.map(t => t.tema),
        arcangel: arc,
        regano: resultado.fuerte || tenor === "sombra",
        presencia: this.fraseArea(arc, b.clave),
        texto
      };
    }).concat([{
      cierre: true,
      texto: "Los siete arcángeles han hablado, cada uno desde su don, y yo he escuchado cada palabra. Solo puedo decirte la verdad sin maquillaje: no estás sola, nunca lo has estado, pero eso no te exime de actuar. Lo que las cartas te mostraron hoy no es para asustarte: es para recordarte quién eres. La fuerza que buscas no está afuera, ya vive en ti. Deja el miedo, toma el consejo que más te dolió escuchar y ponlo en práctica: ese es el camino que todas las voces te señalan.",
      cita
    }]);
  },

  /* la combinación de las cartas de cada arcángel: normal (luz), espejada
     (mezcla de derecha e invertida) o en sombra; el arcángel la nombra con
     sus propias palabras y según su contexto */
  combinacionDe(bloque) {
    const inv = bloque.temas.filter(t => t.carta.invertido).length;
    const temas = bloque.temas.map(t => t.tema.toLowerCase()).join(" y ");
    const tipo = inv === 0 ? "luz" : (bloque.temas.length === inv ? "sombra" : "mixto");
    const arc = bloque.arcangel;
    const A = this.nombreCorto(arc.nombre);
    const R = arc.regencia.toLowerCase();
    const textos = {
      luz: `La combinación de mis cartas en ${temas} es normal y luminosa: todas apuntan en la misma dirección y su energía se multiplica a tu favor. Yo, ${A}, te aseguro que esta unión te respalda con mi ${R}: actúa con calma y confianza, porque lo que se alinea contigo no se deshace fácilmente.`,
      mixto: `La combinación de mis cartas en ${temas} es espejada: unas te muestran su luz y otras te devuelven tu propia sombra, hablándote con honestidad. Yo, ${A}, te digo que este espejo no es un castigo: es un aviso a tiempo para que equilibres lo que hoy está a medias. Atiende ambas caras y la balanza volverá a tu favor desde mi ${R}.`,
      sombra: `La combinación de mis cartas en ${temas} es en sombra: todas se presentan invertidas, y eso raramente significa no; significa que debes voltear el enfoque. Yo, ${A}, te hablo con serenidad y firmeza: la oscuridad solo te muestra lo que no has querido mirar. Devuelve la luz a estos asuntos desde mi ${R} y lo que parecía bloqueado empezará a moverse.`
    };
    return { tipo: tipo === "mixto" ? "espejada" : tipo, texto: textos[tipo] };
  },

  /* bloque de combinación global de las lecturas cortas (1, 3, 5, 10 cartas):
     el arcángel regente resume cómo se combina toda la lectura */
  bloqueCombinacionGlobal(resultado) {
    const total = resultado.cartas.length;
    const inv = resultado.cartas.filter(c => c.invertido).length;
    const arc = this.arcangelesDeLectura(resultado)[0];
    const A = this.nombreCorto(arc.nombre);
    const R = arc.regencia.toLowerCase();
    let tipo, texto;
    if (inv === 0) {
      tipo = "normal";
      texto = `La combinación de tus cartas es normal y luminosa: todas brillan del derecho y su energía se une para impulsarte. Yo, ${A}, te confirmo desde mi ${R} que este respaldo es real: avanza con el corazón abierto, porque lo que se combina a tu favor ya está en movimiento.`;
    } else if (inv === total) {
      tipo = "sombra";
      texto = `La combinación de tus cartas es en sombra: todas se presentan invertidas, y eso raramente es un no: es una llamada a voltear el enfoque. Yo, ${A}, te hablo con serenidad y firmeza: cada carta en sombra te enseña lo que no querías ver; devuelve la luz a estas áreas desde mi ${R} y el camino se despejará.`;
    } else {
      tipo = "espejada";
      texto = `La combinación de tus cartas es espejada: unas te muestran su luz y otras te devuelven tu propia sombra. Yo, ${A}, te digo desde mi ${R} que este espejo es un regalo: te muestra lo que ya avanza y lo que aún pide atención. No ignores tu reflejo: escucha las dos caras y la balanza se inclinará a tu favor.`;
    }
    return {
      icono: "🔗",
      area: "combinacion",
      titulo: "La combinación de tus cartas",
      arcangel: arc,
      regano: tipo === "sombra",
      presencia: "",
      combinacion: { tipo, texto },
      texto: ""
    };
  },

  /* una línea por área, con la personalidad del arcángel al frente */
  fraseArea(arcangel, area) {
    const f = this.fraseArcangel(arcangel);
    return f[area];
  },

  fraseArcangel(a) {
    const A = a.nombre;
    const C = a.consejo || "";
    return {
      economia: `${A}, señor de la ${a.regencia.toLowerCase()}, vela por esta área y te dice: la abundancia no es cuestión de suerte, sino de orden y de decisión. Confía en su guía para ordenar tus recursos y abrir el caudal que mereces. ${C}`,
      amor: `${A} sostiene tu corazón en esta lectura: su energía de ${a.regencia.toLowerCase()} se derrama sobre tus vínculos para que el amor llegue, se sane o se libere tal como lo necesitas. ${C}`,
      situacion: `Desde su reino de ${a.regencia.toLowerCase()}, ${A} despeja la niebla de tus circunstancias y te muestra lo que de verdad importa, para que decidas con claridad y sin miedo. ${C}`,
      bloqueo: `${A} ilumina con su ${a.regencia.toLowerCase()} las cadenas invisibles que te retienen, y te da la fuerza para soltarlas una a una. Nada puede mantenerte atado cuando su luz te acompaña. ${C}`,
      trabajo: `Con la sabiduría de su ${a.regencia.toLowerCase()}, ${A} orienta tu camino profesional y despeja el sendero hacia el reconocimiento y la meta que persigues. ${C}`,
      futuro: `${A} despliega ante ti el mapa del porvenir: desde su ${a.regencia.toLowerCase()}, te asegura que lo que viene está alineado con tu propósito, si caminas con fe y decisión. ${C}`,
      cierre: `${A} sella esta lectura con su presencia. No estás sola: un arcángel ha tomado tu mano para guiarte. Confía, actúa y deja que su luz te lleve. ${C}`,
      miguel: `${A} toma la palabra en tu nombre: con su ${a.regencia.toLowerCase()}, te protege y te da valor para sostener tu posición en cada terreno de tu vida. ${C}`,
      gabriel: `${A} trae luz a lo que debes escuchar: en estos temas, su ${a.regencia.toLowerCase()} despeja tu mente y te señala el propósito oculto. ${C}`,
      rafael: `${A} extiende su mano sanadora sobre estos asuntos: su ${a.regencia.toLowerCase()} te devuelve el equilibrio y la claridad para seguir. ${C}`,
      uriel: `${A} enciende su antorcha de ${a.regencia.toLowerCase()} en estas áreas: mira con luz interior, porque la respuesta que buscas está más cerca de lo que crees. ${C}`,
      zadkiel: `${A} desata las cadenas que se ocultan aquí: su ${a.regencia.toLowerCase()} te libera de lo que ya cumplió su tiempo. ${C}`,
      jofiel: `${A} ilumina estos senderos con su ${a.regencia.toLowerCase()}: busca la belleza y la inspiración, y ellas te guiarán. ${C}`,
      chamuel: `${A} envuelve estos asuntos con la luz rosa de su ${a.regencia.toLowerCase()}: el amor verdadero llega, se sana o se libera según lo que tu corazón necesita. ${C}`
    };
  },

  /* regaños variados por patrón de cartas (0-1023 combinaciones únicas) */
  /* Cada arcángel tiene múltiples regaños que se seleccionan basándose en el índice de patrón */
  regaños: {
    miguel: {
      luz: [
        "Arcángel Miguel te regaña con su espada en alto: llevas tiempo gastando tu energía donde no te valoran y defendiendo a quien no te defiende. Esta es tu hora de ponerte primero: marca tus límites, retira tu fuerza de quien la usa y no des explicaciones por cuidarte.",
        "Arcángel Miguel te dice: has bajado el escudo demasiado pronto. Te estás exponiendo donde no hay protección y entregando tu fuerza donde no te valoran. Es hora de ponerte firme, de reclamar tu lugar y de dejar de dar tu poder a quien no lo merece.",
        "Arcángel Miguel te advierte: no camines con miedo. Tu falta de protección te ha expuesto a energías negativas. Levanta tu escudo y camina con firmeza y valor."
      ],
      sombra: [
        "Arcángel Miguel me regaña: El Loco sombrío indica que has caído en descuido espiritual. Tu falta de protección te ha expuesto a energías negativas.",
        "Arcángel Miguel me regaña: El Mundo invertido significa que tu escudo se ha debilitado por falta de atención. Reforzarlo ya.",
        "Arcángel Miguel me regaña: Has permitido vulnerabilidades en tu campo energético al bajar la guardia demasiado pronto."
      ],
      mixto: [
        "Arcángel Miguel te dice: tienes protección, pero hay una grieta que no debes ignorar. Alguien está drenando tu energía sin que te defenders. Refuerza tu escudo y elige batalear tus propias batallas.",
        "Arcángel Miguel te dice: tu protección está completa y tu energía está alineada. Ninguna oscuridad puede tocarte mientras mantengas tus límites firmes y tu fe alta.",
        "Arcángel Miguel te regaña: has bajado el escudo demasiado presto. Te estás exponiendo donde no hay protección y entregando tu fuerza donde no te valoran. Es hora de ponerte firme."
      ]
    },
    gabriel: {
      luz: [
        "Arcángel Gabriel te dice: el mensaje que esperabas está en camino. Las señales están alineando, las coincidencias tienen propósito. Presta atención a las palabras que escuchas hoy.",
        "Arcángel Gabriel te dice: la verdad está cerca pero envuelta en ruido. No te apresures a concluir. Revisa lo que escuchas antes de hablar.",
        "Arcángel Gabriel te envía su bendición: los mensajes y señales están alineándose. Presta atención a las sincronías del universo."
      ],
      sombra: [
        "Arcángel Gabriel me regaña: has dejado de escuchar. Repites lo que quieres oír en vez de lo que necesitas. Cállate un momento y vuelve a preguntar con honestidad.",
        "Arcángel Gabriel me regaña: Has dejado de escuchar. Repites lo que quieres oír en vez de lo que necesitas.",
        "Arcángel Gabriel me regaña: ignores las señales del cosmos y te aferras a lo que quieres oír, no a lo que necesitas."
      ],
      mixto: [
        "Arcángel Gabriel te dice: la verdad está cerca pero envuelta en ruido. No te apresures a cerrar conclusiones: revisa lo que escuchas, contrasta lo que crees y el mensaje puro llegará a tu corazón sin que tengas que forzarlo.",
        "Arcángel Gabriel te dice: la verdad está cerca pero el impulso te empuja a decidir antes de tiempo. Detente, examina y compara antes de actuar.",
        "Arcángel Gabriel aparta el ruido para que escuches: llevas tiempo oyendo lo que quieres oír, no lo que necesitas. Hay un mensaje que aún no te has atrevido a aceptar."
      ]
    },
    rafael: {
      luz: [
        "Arcángel Rafael te dice: estás sanando, de verdad. Tu cuerpo, tu mente y tu alma se están equilibrando otra vez. Respira hondo, descansa y confía: la medicina del cielo ya está trabajando en ti.",
        "Arcángel Rafael te dice: la sanación viene en camino, pero hay algo que te estás negando a atender. Ese cansancio, ese dolor o esa calma que pospones tiene voz. Escúchala hoy: cuidarte no es egoísmo, es el único camino para seguir brillando.",
        "Arcángel Rafael te bendice: tu cuerpo y alma están en proceso de sanación. Cada célula responde a la energía restauradora que fluye hacia ti."
      ],
      sombra: [
        "Arcángel Rafael te regaña: deja de descuidarte. Te das a todos y no te queda nada para ti, y tu cuerpo te lo está avisando. No postergues más tu salud ni tu paz: el descanso y el cuidado no se ganan, se toman.",
        "Arcángel Rafael te regaña: Te das a todos y no te queda nada para ti, y tu cuerpo te lo está avisando. No postergues más tu salud ni tu paz.",
        "Arcángel Rafael te regaña: dejas que el cansancio y el dolor se acumulen sin atención. Cuidarte es tu derecho divino, no un favor que te haces a ti mismo."
      ],
      mixto: [
        "Arcángel Rafael te dice: la sanación viene en camino, pero hay algo que te estás negando a atender. Ese cansancio, ese dolor o esa calma que pospones tiene voz. Escúchala hoy.",
        "Arcángel Rafael te dice: la sanación avanza pero hay resistencias. Hay un área de tu cuerpo o alma que aún estás negando que necesita atención. El dolor que callas es la señal de que algo pide ser liberado. Cuidarte es tu derecho divino.",
        "Arcángel Rafael te dice: estás en proceso de sanación, pero hay áreas de tu bienestar que aún estás ignoring. Es momento de detenerte y escucharte."
      ]
    },
    uriel: {
      luz: [
        "Arcángel Uriel te dice: tu luz interior se ha encendido. Ves con claridad lo que antes estaba oculto. Confía en esa certeza que sientes en tu corazón.",
        "Arcángel Uriel te dice: tu luz interior se encendió y ahora ves con claridad lo que otros no comprenden. Confía en esa certeza que sientes en el pecho: tus decisiones tienen luz propia y te van a llevar a buen puerto.",
        "Arcángel Uriel te envía su luz: tu intuición se ha activado y puedes ver con claridad tus próximos pasos."
      ],
      sombra: [
        "Arcángel Uriel te regañas: estás actuando por impulso y dejando que la emoción nuble tu juicio. Pide tiempo, toma distancia y decide desde la luz, no desde el miedo.",
        "Arcángel Uriel te regañas: necesitas más análisis y menos impulso. No actúes por impulso dejándote llevar por la emoción.",
        "Arcángel Uriel te advierte: estás actuando por impulso y dejando que la emoción nuble tu juicio, y eso te está costando caro."
      ],
      mixto: [
        "Arcángel Uriel te dice: tienes la verdad cerca, pero el impulso te empuja a decidir antes de tiempo. Detente, examina y compara. La sabiduría que buscas no está en actuar más rápido, sino en mirar más profundo.",
        "Arcángel Uriel te dice: tienes la verdad cerca pero el impulso te empuja a decidir antes de tiempo. Detente, examina y compara antes de actuar.",
        "Arcángel Uriel: tienes la verdad al alcance, pero el prisa te ciega. Para, mira con luz interior y decide con calma."
      ]
    },
    zadkiel: {
      luz: [
        "Arcángel Zadkiel te dice: la liberación ya está corriendo por ti. Suelta la culpa, perdona lo que haya que perdonar y siente cómo entra la libertad.",
        "Arcángel Zadkiel te dice: la llave está en tu mano pero hay una cadena que tú sigues manteniendo. Date permiso hoy y el cielo te sostiene.",
        "Arcángel Zadkiel te bendice: la libertad está disponible para ti hoy, liberada por gracia divina."
      ],
      sombra: [
        "Arcángel Zadkiel me regaña: llevas demasiado tiempo atado a la culpa, al rencor o a un pasado que ya no existe. Cada día sin perdonar pesa más.",
        "Arcángel Zadkiel me regaña: necesitas perdonar para liberarte de cargas pasadas. No dejes que el rencor te comaya viva.",
        "Arcángel Zadkiel me regaña: llevas demasiado tiempo atado a la culpa, al rencor o a un pasado que ya no existe."
      ],
      mixto: [
        "Arcángel Zadkiel te dice: la llave está en tu mano, pero hay una cadena que tú sigues manteniendo. No se trata solo de que otros te suelten: hay algo que debes soltar tú.",
        "Arcángel Zadkiel te dice: la liberación ya está corriendo por ti. Suelta la culpa y siente cómo entra la libertad.",
        "Arcángel Zadkiel me regaña: has permitido que el rencor y la culpa te ataquen durante demasiado tiempo. Es hora de soltarlos."
      ]
    },
    jofiel: {
      luz: [
        "Arcángel Jofiel te dice: la belleza y la luz que buscas ya están floreciendo a tu alrededor. Rodéate de lo que te eleva y verás tu mundo brillar con tus propios colores.",
        "Arcángel Jofiel te dice: hay luz pero todavía tienes los ojos puestos en lo que no fue. Deja de mirar atrás y déjate inspirar por lo nuevo.",
        "Arcángel Jofiel te inspira: la belleza divina está floreciendo a tu alrededor. Confía en tu creatividad."
      ],
      sombra: [
        "Arcángel Jofiel me regaña: dejaste de ver la luz que sí tienes. Te comparas con otros y ensombreces tu propio camino. Enciende tu propia lámpara.",
        "Arcángel Jofiel me regaña: dejaste de ver la luz que sí tienes. Te comparas con otros y ensombreces tu propio camino.",
        "Arcángel Jofiel me regaña: has dejado de sidearte la luz que posees y te compares con otros, ensombreciendo tu propio brillo."
      ],
      mixto: [
        "Arcángel Jofiel te dice: hay luz pero todavía tienes los ojos puestos en lo que no fue. Deja de mirar atrás y déjate inspirar por lo nuevo.",
        "Arcángel Jofiel te dice: dejaste de ver la luz que sí tienes. Enciende tu propia lámpara y sigue tu camino.",
        "Arcángel Jofiel te inspira: tu belleza no necesita permiso. Deja de mirarte a otros y enciende tu propia luz."
      ]
    },
    chamuel: {
      luz: [
        "Arcángel Chamuel te dice: el amor real ya está tocando tu corazón. Abre la mano y recibe, sin miedo a querer ni a ser querido.",
        "Arcángel Chamuel te dice: hay amor pero también un nudo que duele callado. No confundas silencio con paz ni distancia con indiferencia. Habla lo que sientes con honestidad.",
        "Arcángel Chamuel te bendice: el amor real ya toca tu corazón. Abre la mano y recibe."
      ],
      sombra: [
        "Arcángel Chamuel me regañas: estás poniendo tu corazón donde no lo cuidan, o cerrando la puerta a quien sí te quiere bien. Deja de mendigar cariño donde solo hay ego.",
        "Arcángel Chamuel me regañas: estás poniendo tu corazón donde no lo cuidan. Deja de mendigar cariño donde solo hay ego.",
        "Arcángel Chamuel te regañas: sigues entregando tu corazón a quien te lo devuelve roto, y encima te sientes culpable."
      ],
      mixto: [
        "Arcángel Chamuel te dice: hay amor pero también un nudo que duele callado. No confundas silencio con paz ni distancia con indiferencia. Habla lo que sientes con honestidad.",
        "Arcángel Chamuel te dice: hay amor real tocando tu corazón, pero también hay asuntos pendientes. No confundas silencio con paz.",
        "Arcángel Chamuel te dice: el amor fluye hacia ti, pero hay un nudo que duele si no lo reconoces."
      ]
    }
  },

  /* -------------------------- métodos de ayuda arcángel ------------------- */
  nombreCorto(nombre) { return nombre.replace("Arcángel ", ""); },

  nombresArcangeles(lista) {
    if (lista.length <= 1) return lista[0].nombre;
    const cortos = lista.map(a => this.nombreCorto(a.nombre));
    return cortos.slice(0, -1).join(", ") + " y " + cortos.slice(-1);
  },

  listaRegencias(lista) {
    if (lista.length <= 1) return lista[0].regencia + " · rey de esta lectura";
    return lista.map(a => this.nombreCorto(a.nombre) + ": " + a.regencia.toLowerCase()).join("  ·  ");
  },

  /* un solo arcángel simbólico que representa la unión del coro (para el cierre) */
  arcangelUnido(lista) {
    return {
      nombre: this.nombresArcangeles(lista),
      regencia: "reunidos en una sola luz para ti",
      color: this.coraz(lista),
      consejo: "Hoy no caminas sola: somos varios los que sostenemos tu luz desde el cielo, y todos te acompañamos en este camino."
    };
  },

  coraz(lista) {
    return lista[Math.floor(lista.length / 2)].color;
  },

  mensajeUnido(lista) {
    if (lista.length <= 1) return lista[0].mensaje;
    const nombres = this.nombresArcangeles(lista);
    const principal = lista[0];
    return `Hoy, ${nombres} se reúnen ante ti como un consejo celestial. ${principal.nombre} toma la palabra en tu nombre, y juntos despejan tu camino con sus dones unidos: el amor, la fuerza, la claridad y la paz que tu alma necesita ahora.`;
  },

  /* -------------------------- motor de la lectura -------------------------- */
  armarResultado(resultadoHTML) {
    const t = resultadoHTML.tirada;
    let html = '<div class="resultado">';
    html += '<div class="resultado-cabecera"><div class="deco">' + this.elegantIcono[t.id] + "</div>";
    html += "<p>Resultado de la tirada de tarot completa gratis</p></div>";

    html += `<div class="contexto-tirada vidrio">
      <h3 style="color:var(--dorado);margin-bottom:10px">Interpretación Angelical</h3>
      <p class="comparte"><small>✨ Comparte tu resultado con quien quieras ✨</small></p>
    </div>`;

    const arcangeles = this.arcangelesDeLectura(resultadoHTML);
    resultadoHTML.__arcangeles = arcangeles;
    const arcangel = arcangeles[0];
    this.aplicarFondo(arcangeles);
    html += `<div class="arcangel-regente vidrio">
      <p class="ar-presentes">
        <span class="ar-titulo">Arcángeles presentes:</span>
        ${arcangeles.map(a => `<span class="ar-chip" style="--chip:${a.color}">${a.emoji} ${this.nombreCorto(a.nombre)}</span>`).join("")}
      </p>
    </div>`;

    resultadoHTML.cartas.forEach((c, i) => {
      const pos = t.posiciones[i];
      html += `<div class="carta-grande vidrio" style="animation-delay:${(0.25 + i * 0.3).toFixed(2)}s">
        <div class="sello ${c.invertido ? "invertida" : ""}"><div>
          ${this.figuraDe(c)}
          <small>Arcano Mayor</small>
        </div></div>
        <div class="carta-texto">
          <h4>${pos[0]} <span style="font-weight:400;color:var(--lavanda-suave)">· ${pos[1]}</span></h4>
          <h3>${c.nombre} ${c.invertido ? '<small style="font-size:.8rem;color:#ffd7e0">(invertida)</small>' : ""}</h3>
          <div class="palabras">${c.palabras.map(p => "<span>" + p + "</span>").join("")}</div>
          <p class="interp">${c.texto}</p>
        </div>
      </div>`;
    });

    const esGranTirada = t.id === "gran-tirada";
    const finales = esGranTirada ? this.interpretacionGranTirada(resultadoHTML) : this.interpretacionFinal(resultadoHTML);
    if (resultadoHTML.fuerte) {
      // el cierre único ya viene dentro de interpretacionGranTirada/
      // interpretacionFinal; aquí solo se marca el tono del encabezado
    }
    const tituloFinal = resultadoHTML.fuerte
      ? "🔥 ¡¡ LECTURA FUERTE !! 🔥"
      : esGranTirada
        ? "✨ La palabra de los siete arcángeles ✨"
        : "✨ Interpretación final de tu tirada ✨";
    let htmlFinal = `<div class="interpretacion-final">${resultadoHTML.fuerte ? '<h3 class="titulo-interp-final titulo-fuerte">🔥 ¡¡ LECTURA FUERTE !! 🔥<small style="display:block;font-size:.75rem;color:#ff9e6d;margin-top:6px">Los ángeles hablaron con firmeza porque te aman demasiado para mentirte</small></h3><hr class="raya-fuerte">' : `<h3 class="titulo-interp-final">${tituloFinal}</h3>`}`;
    finales.forEach((b, i) => {
      const arcDeArea = b.arcangel || this.arcangelDeArea(arcangeles, i);
      if (b.cierre) {
        htmlFinal += `<div class="mensaje-poderoso vidrio" style="animation-delay:${(1.2 + i * 0.25).toFixed(2)}s">
          <h3 style="color:var(--dorado)">El mensaje final</h3>
          <p class="presencia-arc">${this.fraseArea(this.arcangelUnido(arcangeles), "cierre")}</p>
          <p>${b.texto}</p>
          <p class="cita">"${b.cita}"</p>
        </div>`;
      } else {
        htmlFinal += `<div class="bloque-categoria vidrio${b.regano ? " regano" : ""}" style="animation-delay:${(1.2 + i * 0.25).toFixed(2)}s">
          <h4><span class="cat-icono">${b.icono}</span> ${b.titulo}
            <span class="cat-arc" style="--chip:${arcDeArea.color}">${arcDeArea.emoji} ${this.nombreCorto(arcDeArea.nombre)}</span>
            ${b.regano ? '<span class="regano-tag">régano</span>' : ""}
            ${b.combinacion ? `<span class="combo-tag combo-${b.combinacion.tipo}">combinación ${b.combinacion.tipo}</span>` : ""}
          </h4>
          ${b.presencia ? `<p class="presencia-arc">${b.presencia}</p>` : ""}
          ${b.texto ? `<p>${b.texto}</p>` : ""}
          ${b.combinacion ? `<p class="combinacion-texto">${b.combinacion.texto}</p>` : ""}
        </div>`;
      }
    });
    htmlFinal += "</div>";

    html += htmlFinal + `
      <div class="centrado" style="margin-top:26px">
        <button class="btn btn-dorado" id="btn-nueva-tirada">Nueva lectura</button>
        <button class="btn btn-lavanda" id="btn-guardar">Guardar esta lectura</button>
      </div>
    </div>`;
    return html;
  },

  guardar(resultadoHTML) {
    const lectura = {
      tirada: resultadoHTML.tirada.nombre,
      cartas: resultadoHTML.cartas.map(c => ({ nombre: c.nombre, emoji: c.emoji, sentido: c.sentido })),
      resumen: this.constructorMensaje(resultadoHTML).replace(/<[^>]+>/g, "").slice(0, 260)
    };
    const historial = JSON.parse(localStorage.getItem("oraculoLecturas") || "[]");
    historial.unshift({ fecha: new Date().toISOString(), tirada: lectura.tirada, cartas: lectura.cartas, resumen: lectura.resumen });
    localStorage.setItem("oraculoLecturas", JSON.stringify(historial.slice(0, 30)));

    if (SESION.usuario) {
      fetchJSON("/api/lecturas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lectura)
      }).then(() => {
        const b = document.getElementById("btn-guardar");
        if (b) { b.textContent = "Guardado ✓"; b.disabled = true; }
      }).catch(() => {});
    }
  }
};

/* ============================ interfaz de la tirada ====================== */

function iniciarTirada(tipo) {
  const d = TIRADAS.elegir(tipo);
  if (!d) return;
  const escena = document.getElementById("escena-tarot");
  if (!escena) return;

  document.getElementById("titulo-tirada").innerHTML =
    `<div class="deco">${TIRADAS.elegantIcono[tipo]}</div><h2>${d.tirada.nombre}</h2>
     <p>${d.tirada.corto}</p>`;

  escena.innerHTML = "";

  /* Animación de barajeo: las cartas cambian de lugar */
  escena.innerHTML = `
    <div class="centrado">
      <p style="margin-bottom:18px">Cierra los ojos, respira profundo y piensa en tu pregunta</p>
      <div class="spinner oculto" id="spinner-barajo"></div>
      <div class="mazo" id="mazo-barajeo" style="margin-top:26px"></div>
    </div>`;

  const mazoFan = TIRADAS.barajar(TIRADAS.mazo.slice());
  const mazoEl = document.getElementById("mazo-barajeo");
  const cards = [];
  for (let i = 0; i < 14; i++) {
    const c = mazoFan[i % mazoFan.length];
    const m = document.createElement("div");
    m.className = "minicarta barajeo";
    m.style.width = "84px";
    m.innerHTML = "<div class='dorso-mini'></div><span class='nom'>✦</span>";
    m.dataset.idx = String(i);
    m.style.animationDelay = `${(i * 0.12).toFixed(2)}s`;
    mazoEl.appendChild(m);
    cards.push(m);
  }

  /* mezcla visual: cada carta cambia de lugar con un rebote */
  const mezclar = () => {
    const arr = mazoFan.slice(0, cards.length);
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    arr.forEach((_, k) => {
      const card = cards[k];
      card.style.transition = "transform 0.6s ease, opacity 0.6s ease";
      card.style.transform = `rotate(${((Math.random() - 0.5) * 12).toFixed(1)}deg) translateY(${-20 + Math.random() * 10}px)`;
      card.style.opacity = "0.5";
      setTimeout(() => {
        card.dataset.idx = String(arr[k]);
        card.style.transform = "rotate(0deg) translateY(0)";
        card.style.opacity = "1";
      }, 400 + Math.random() * 400);
    });
  };

  const sp = document.getElementById("spinner-barajo");
  let mezclas = 0;
  const interval = setInterval(() => {
    mezclar();
    mezclas++;
    if (mezclas >= 3) {
      clearInterval(interval);
      sp.classList.add("oculto");
      setTimeout(() => mostrarEleccion(d), 400);
    }
  }, 300);
}

/* Paso 2 · elegir las cartas tocando el mazo */
function mostrarEleccion(r) {
  const escena = document.getElementById("escena-tarot");
  const tipos = document.querySelectorAll(".opcion-palo");
  tipos.forEach(x => x.classList.add("oculto"));

  let elegidas = 0;
  escena.innerHTML = `
    <div class="centrado">
      <p style="margin-bottom:8px">Cierra los ojos, piensa en tu pregunta y selecciona tu${r.tirada.n === 1 ? " carta:" : "s " + r.tirada.n + " cartas:"}</p>
      <p style="font-size:.9rem;color:var(--lavanda-suave)">Seleccionadas: <span id="contador">0</span> de ${r.tirada.n}</p>
      <div class="escenario" id="escenario-eleccion"></div>
      <div class="oculto" id="aviso-cartas">
        <p style="margin:16px 0">Tu energía ya está en el mazo...</p>
      </div>
    </div>`;

  // construimos un mazo de cartas boca abajo que el usuario toca
  const escenario = document.getElementById("escenario-eleccion");
  r.tirada.posiciones.forEach((p, i) => {
    const slot = document.createElement("div");
    slot.className = "carta-plaza";
    slot.id = "plaza-" + i;
    slot.innerHTML = `<div class="cara"><div><div class="c-nm">✦</div><div class="c-nombre">Oráculo</div></div></div><div class="reverso"></div><div class="etiqueta">${p[0]}</div>`;
    escenario.appendChild(slot);
  });

  // mazo: las 22 cartas boca abajo; se revelan al tocarlas
  const zonaMazo = document.createElement("div");
  zonaMazo.className = "mazo mazo-eleccion";
  zonaMazo.style.marginTop = "34px";
  r.mazo.forEach((c, i) => {
    const m = document.createElement("div");
    m.className = "minicarta";
    m.style.width = "84px";
    m.style.pointerEvents = "auto";
    m.style.zIndex = "10";
    m.dataset.idx = String(i);
    m.innerHTML = "<div class='dorso-mini'></div><span class='nom'>Toca para elegir</span>";
    const onPick = () => elegirUna(m, r);
    m.addEventListener("click", onPick);
    m.addEventListener("mousedown", onPick);
    m.addEventListener("touchstart", onPick, { passive: true });
    zonaMazo.appendChild(m);
  });
  escenario.appendChild(zonaMazo);

  const contador = document.getElementById("contador");
  const aviso = document.getElementById("aviso-cartas");

  function elegirUna(elm, r) {
    if (elegidas >= r.tirada.n) return;
    const c = r.mazo[Number(elm.dataset.idx)];
    const carta = TIRADAS.construirCarta(c);
    r.cartas.push(carta);
    elegidas++;
    elm.innerHTML = `${TIRADAS.figuraDe(carta)}<span class="nom">${carta.nombre}</span>`;
    elm.classList.add("revelada");
    elm.style.pointerEvents = "none";
    elm.style.animation = "flotar 1s ease-in-out infinite";
    const plaza = document.getElementById("plaza-" + (elegidas - 1));
    plaza.classList.add("girada");
    const cara = plaza.querySelector(".cara");
    cara.innerHTML = `<div>
      ${TIRADAS.figuraDe(carta)}
      <div class="c-nombre">${carta.nombre}</div>
      <div class="c-pos">${carta.invertido ? "invertida" : "derecha"}</div>
    </div>`;
    contador.textContent = elegidas;
    if (elegidas === r.tirada.n) {
      zonaMazo.querySelectorAll(".minicarta:not(.revelada)").forEach(x => {
        x.style.pointerEvents = "none";
        x.style.opacity = "0.2";
      });
      aviso.classList.remove("oculto");
      setTimeout(() => mostrarResultado(r), 1100);
    }
  }
}

function mostrarResultado(r) {
  const escena = document.getElementById("escena-tarot");
  const d = document.createElement("div");
  d.id = "contenido-resultado";
  d.innerHTML = TIRADAS.armarResultado(r);
  escena.innerHTML = "";
  escena.appendChild(d);
  document.getElementById("btn-nueva-tirada").addEventListener("click", () => location.reload());
  document.getElementById("btn-guardar").addEventListener("click", () => TIRADAS.guardar(r));
}

/* iniciar si hay tipo en la URL */
document.addEventListener("DOMContentLoaded", () => {
  const url = new URLSearchParams(location.search);
  const tipo = url.get("tirada");
  if (tipo && document.getElementById("escena-tarot")) {
    const opciones = document.querySelectorAll(".opcion-palo");
    opciones.forEach(o => {
      if (o.dataset.tipo === tipo) o.classList.add("activa");
      else o.classList.add("oculto");
    });
    iniciarTirada(tipo);
  }
  if (document.getElementById("opciones-tiradas")) {
    const cont = document.getElementById("opciones-tiradas");
    TIRADAS.catalogo.forEach(t => {
      const b = document.createElement("a");
      b.className = "opcion-palo";
      b.href = "/tirada.html?tirada=" + t.id;
      b.innerHTML = `<span class="icono">${TIRADAS.elegantIcono[t.id]}</span><strong>${t.nombre}</strong><br><small style="opacity:.85">${t.corto}</small>`;
      cont.appendChild(b);
    });
  }
});