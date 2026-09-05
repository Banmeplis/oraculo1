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

  /* selecciona de 2 a 7 arcángeles, en proporción a la cantidad de cartas;
     en la gran tirada (14 cartas) siempre participan los 7 en pleno */
  arcangelesDeLectura(resultado) {
    const n = (resultado.cartas || []).length;
    if (resultado.tirada && resultado.tirada.id === "gran-tirada") {
      return Object.keys(this.arcangeles).map(clave => ({ clave, ...this.arcangeles[clave] }));
    }
    let min, max;
    if (n <= 1)      { min = 2; max = 3; }
    else if (n <= 3) { min = 3; max = 4; }
    else if (n <= 5) { min = 4; max = 5; }
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

    const areas = [
      {
        icono: "🛡️", area: "situacion", clave: "miguel", titulo: "Situación y protección",
        texto: propor >= 0.5
          ? "Arcángel Miguel te dice: tu burbuja de protección está intacta y tu paso se afirma. Lo que hoy construyes, cuidas o decides avanza bajo mi escudo. Camina con la cabeza en alto: nadie puede con tu luz cuando tú mismo la defiendes."
          : "Miguel te regaña con su espada en alto: llevas tiempo gastando tu energía donde no te valoran y defendiendo a quien no te defiende. Esta es tu hora de ponerte primero: marca tus límites, retira tu fuerza de quien la usa y no des explicaciones por cuidarte."
      },
      {
        icono: "💞", area: "amor", clave: "chamuel", titulo: "Amor y relaciones",
        texto: propor >= 0.5
          ? "Arcángel Chamuel te dice: el afecto sincero está fluyendo hacia ti y desde ti. Hoy tu corazón se abre a un encuentro, una reunión o una entrega que ya se sentía esperada. Abre la mano y recibe: mereces ser amado sin condiciones."
          : "Chamuel te habla con dulzura pero sin rodeos: estás repitiendo el patrón de entregar tu luz donde no es cuidada, o callando lo que sientes por miedo a perder. No mendigues afecto ni confundas silencio con paz. Nombra tu verdad, ama desde tu dignidad y deja que el amor justo vuelva a ti."
      },
      {
        icono: "💚", area: "salud", clave: "rafael", titulo: "Salud y energía",
        texto: propor >= 0.5
          ? "Arcángel Rafael te dice: la sanación que pediste está en marcha y tu equilibrio vuelve a asentarse. Respira, descansa y confía: tu cuerpo y tu alma se están reparando en silencio. Este renacer ya empezó."
          : "Rafael te observa con mirada de médico y no te suelta la mano: hay una parte de ti que estás descuidando, un cansancio que callas o un dolor que pospones. Cuidarte no es egoísmo: es el único camino para volver a brillar. Tu sanación empieza hoy, por detenerte."
      },
      {
        icono: "📯", area: "mensajes", clave: "gabriel", titulo: "Mensajes y propósito",
        texto: propor >= 0.5
          ? "Arcángel Gabriel te dice: el mensaje que esperabas está en camino y tu propósito se aclara. Presta atención a las señales, las palabras y las coincidencias: por ahí te estoy hablando, y esta vez no vas a fallar."
          : "Gabriel aparta el ruido para que escuches: llevas tiempo oyendo lo que quieres oír, no lo que necesitas. Hay un mensaje que aún no te has atrevido a aceptar. Silencia la ansiedad, vuelve a preguntar con honestidad y la respuesta llegará cuando te calles."
      },
      {
        icono: "💰", area: "economia", clave: "uriel", titulo: "Economía y abundancia",
        texto: propor >= 0.5
          ? "Arcángel Uriel enciende su antorcha sobre tu economía: el flujo que pediste se está ordenando y abre puertas para ti. Administra con calma, actúa con decisión y mira los detalles que otros pasan por alto: ahí está tu oportunidad."
          : "Uriel te mira de frente y te dice la verdad: la energía de tu dinero pide orden y revisión. Hay fugas, gastos que se repiten y promesas que llegan con más ruido que sustancia. No es un castigo, es un aviso a tiempo: cierra las rendijas, pon límites a tu generosidad y deja espacio para la abundancia real."
      },
      {
        icono: "🔓", area: "bloqueo", clave: "zadkiel", titulo: "Bloqueos a liberar",
        texto: propor >= 0.5
          ? "Arcángel Zadkiel te dice: la liberación ya está corriendo por ti. Suelta la culpa, perdona lo que haya que perdonar y siente cuánta libertad entra cuando dejas de cargar el pasado. Esas cadenas solo tú las mantienes puestas: esta es tu hora de soltarlas."
          : "Zadkiel te señala la cadena que arrastras hace demasiado tiempo: un rencor, un miedo ya vencido o una culpa que no te corresponde. Cada día sin perdonar pesa más. Suelta la piedra, perdónate y perdona: tu corazón no fue hecho para cargar tanto, y este mensaje te da la llave."
      },
      {
        icono: "🌟", area: "futuro", clave: "jofiel", titulo: "Futuro e inspiración",
        texto: propor >= 0.5
          ? "Arcángel Jofiel te dice: lo que viene está alineado con tu propósito y tu luz ya florece. Confía en el proceso, suelta lo que cumplió su ciclo y camina hacia lo nuevo con la certeza de que el cielo está cuadrando las piezas a tu favor."
          : "Jofiel apaga su lámpara un instante para que lo mires: lo que anhelas no llegará mientras sigas mirando atrás o comparándote con el camino de otros. Tu futuro no se recibe, se construye, y empieza en la decisión de hoy. Enciende tu propia luz y camina: el porvenir te espera."
      }
    ];

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
      const texto = resultado.fuerte
        ? this.voces[b.clave].fuerte
        : this.voces[b.clave][tenor];
      const arc = b.arcangel;
      return {
        icono: arc.emoji,
        area: b.clave,
        titulo: `${this.nombreCorto(arc.nombre)} · ${arc.regencia}`,
        temas: b.temas.map(t => t.tema),
        arcangel: arc,
        regano: resultado.fuerte || tenor === "sombra",
        presencia: this.fraseArea(arc, b.clave),
        texto,
        combinacion: this.combinacionDe(b)
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

  /* Paso 1 · elegir las cartas (el mazo ya viene barajado) */
  mostrarEleccion(d);
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
    m.dataset.idx = String(i);
    m.innerHTML = "<div class='dorso-mini'></div><span class='nom'>Toca para elegir</span>";
    m.addEventListener("click", () => elegirUna(m, r));
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