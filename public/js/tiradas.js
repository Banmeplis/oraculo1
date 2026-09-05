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
    return { tirada: t, cartas: [], mazo };
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
      texto = "Todas tus cartas brillan del derecho: el oráculo te envía una oleada de luz y respaldo. Es momento de avanzar con el corazón abierto y la confianza alta.";
    else if (cuantasBien >= Math.ceil(total / 2))
      texto = "La mayoría de tus cartas te favorecen: la energía del universo camina contigo. Presta atención a los avisos de las cartas invertidas y conviértelos en tu fortaleza.";
    else if (cuantasBien === 0)
      texto = "Tus cartas presentan su cara en sombra, pero recuerda: las pruebas son umbrales, no muros. Este es tu momento de mayor transformación.";
    else
      texto = "Tus cartas hablan con honestidad: hay luces que seguir y avisos que atender. El equilibrio está en como elijas caminar entre ambos.";
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
          ? "Yo soy Miguel, el guerrero de la luz, y vengo a decirte que estás protegida y sostenida: lo que hoy construyes, cuidas o decides avanza bajo mi escudo. Avanza con paso firme y sin miedo, porque tu fuerza se consolida y tu posición se fortalece ante cualquier adversidad."
          : "Yo soy Miguel, y te hablo con la voz de quien conoce la batalla: hay una lucha donde estás gastando tu energía sin ser valorada, una grieta que ya no puedes ignorar. Repliega fuerzas, traza tus límites y no des explicaciones por defender tu lugar: esta es tu hora de protegerte."
      },
      {
        icono: "💞", area: "amor", clave: "chamuel", titulo: "Amor y relaciones",
        texto: propor >= 0.5
          ? "Yo soy Chamuel, el ángel del amor puro, y envuelvo tus vínculos con mi luz rosa: el afecto sincero fluye hacia ti y hoy la puerta de tu corazón se abre a un encuentro, una reconciliación o una entrega que ya se sentía esperada. Abre la mano y recibe: mereces ser amada sin condiciones."
          : "Yo soy Chamuel, y sostengo tu corazón con dulzura y verdad: hay un aviso que no debes callar. Repites patrones que te dejan con menos amor del que mereces, o entregas tu luz donde no es cuidada. No mendigues afecto ni confundas silencio con paz: nombra lo que sientes, ama desde tu dignidad y deja que el amor justo vuelva a ti."
      },
      {
        icono: "💚", area: "salud", clave: "rafael", titulo: "Salud y energía",
        texto: propor >= 0.5
          ? "Yo soy Rafael, el sanador, y dejo caer mi luz esmeralda sobre tu cuerpo y tu alma: la sanación que pediste está en marcha y tu equilibrio vuelve a asentarse. Respira, descansa y confía en la medicina divina que ya trabaja en ti."
          : "Yo soy Rafael, y te advierto con serena severidad: hay una parte de ti que estás descuidando, un cansancio que callas o un dolor que pospones. No te demores: priorizarte no es egoísmo, es el único camino para volver a brillar. Tu sanación empieza hoy por detenerte."
      },
      {
        icono: "📯", area: "mensajes", clave: "gabriel", titulo: "Mensajes y propósito",
        texto: propor >= 0.5
          ? "Yo soy Gabriel, el mensajero del cielo, y hago sonar mi cuerno de plata: el mensaje que esperabas está en camino y tu propósito se aclara. Presta atención a las señales que hallarás en las palabras, los nombres y las coincidencias del día: te estoy hablando con total claridad."
          : "Yo soy Gabriel, y aparto el ruido con mi trompeta: llevas tiempo escuchando lo que quieres oír, no lo que necesitas. Hay un mensaje que aún no te has atrevido a aceptar. Silencia la ansiedad, vuelve a preguntar con honestidad y la respuesta llegará cuando te calles."
      },
      {
        icono: "💰", area: "economia", clave: "uriel", titulo: "Economía y abundancia",
        texto: propor >= 0.5
          ? "Yo soy Uriel, y enciendo mi antorcha dorada sobre tus recursos: el plano de tu economía se abre a un flujo que ya está en marcha. La abundancia que pediste está ordenándose para llegar a ti; administra con calma, actúa con decisión y mira los detalles que otros pasan por alto: ahí está tu puerta."
          : "Yo soy Uriel, y no te engaño: la energía de tu dinero pide revisión y orden. Hay fugas, gastos que se repiten y promesas que llegan con más ruido que sustancia. No es una condena, sino un aviso a tiempo: cierra las rendijas, pon límites a tu generosidad y deja espacio para que la abundancia real entre."
      },
      {
        icono: "🔓", area: "bloqueo", clave: "zadkiel", titulo: "Bloqueos a liberar",
        texto: propor >= 0.5
          ? "Yo soy Zadkiel, el ángel de la misericordia, y abro mis alas violetas sobre ti: la liberación ya está desatando lo que te tenía aprisionada. Suelta la culpa, perdona lo que sea necesario y siente cuánta libertad entra cuando dejas de cargar el pasado. Hay cadenas que solo tú mantienes puestas: esta es tu hora de soltarlas."
          : "Yo soy Zadkiel, señor de la liberación, y te señalo la cadena que llevas demasiado tiempo arrastrando: un rencor, un miedo ya vencido o una culpa que no te corresponde. Cada día sin perdonar pesa más. Suelta la piedra, perdónate y perdona: tu corazón no fue hecho para cargar tanto peso, y este mensaje te da la llave."
      },
      {
        icono: "🌟", area: "futuro", clave: "jofiel", titulo: "Futuro e inspiración",
        texto: propor >= 0.5
          ? "Yo soy Jofiel, y ilumino tu horizonte con mi lámpara dorada: lo que viene está alineado con tu propósito y tu luz ya florece. Confía en el proceso, suelta lo que cumplió su ciclo y camina hacia lo nuevo con la certeza de que el universo está cuadrando las piezas a tu favor."
          : "Yo soy Jofiel, y apago mi lámpara un instante para que me mires por completo: lo que anhelas no llegará mientras sigas mirando atrás o comparándote con el camino de otros. Tu futuro no se recibe, se construye, y empieza en la decisión de hoy. Enciende tu propia luz y camina: el porvenir te está esperando."
      }
    ];

    const cierrePoderoso = propor >= 0.5
      ? "Recibe este mensaje como un llamado a tu grandeza: ya no eres quien espera afuera de su propia vida, sino quien abre la puerta y entra. Todo lo que te rodea está listo para cambiar porque tú estás listo para cambiar con ello. Confía, actúa y déjate sostener por la certeza de que el universo ya camina a tu lado."
      : "Este mensaje no es una advertencia, es un despertar: eres mucho más grande que el miedo que te ha estado frenando, y ha llegado el instante de demostrártelo. Cada obstáculo que hoy ves es en realidad una prueba que has superado en silencio muchas veces. Ahora elige a la persona valiente que ya eres, da el paso que el corazón viene pidiéndote y deja que el universo te acompañe hacia la vida que mereces.";

    return areas.map(a => ({
      icono: a.icono,
      area: a.area,
      titulo: a.titulo,
      arcangel: this.arcangeles[a.clave],
      regano: false,
      presencia: this.fraseArea(this.arcangeles[a.clave], a.clave === "chamuel" ? "amor" : a.clave),
      texto: a.texto
    })).concat([{ cierre: true, texto: cierrePoderoso, cita }]);
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
      luz: "Yo soy Miguel, el guerrero de la luz: he venido a decirte que estás siendo sostenido y protegido. Avanza con paso firme, porque tu fuerza se está consolidando y nada podrá derribarte mientras camines con fe y con límites bien puestos.",
      mixto: "Yo soy Miguel, y te hablo con la voz del soldado que conoce la batalla: hay protección, sí, pero también hay una grieta que no puedes ignorar. No te duermas: refuerza tus defensas, elige tus batallas y no dejes tu guardia a merced de quien no te cuida.",
      sombra: "Yo soy Miguel, y te regaño con firmeza: has bajado el escudo demasiado pronto. Estás exponiéndote donde no hay protección, gastando tu fuerza donde no se te valora. Repliega tu energía, pon tus límites y no vuelvas a avanzar sin tu fuego encendido."
    },
    chamuel: {
      luz: "Yo soy Chamuel, el ángel del amor verdadero: envuelvo tus vínculos con mi luz rosa, y te aseguro que el afecto sincero fluye hacia ti y desde ti. Abre el corazón y deja que el amor se asiente donde ya está siendo recibido, porque el cielo confirma la unión.",
      mixto: "Yo soy Chamuel, y sostengo tu corazón con dulzura y verdad: hay amor, pero también hay un nudo que pide ser hablado. No confundas silencio con paz ni distancia con indiferencia: nombra lo que sientes con honestidad y el vínculo encontrará su equilibrio.",
      sombra: "Yo soy Chamuel, y te regaño con amor severo: estás entregando tu corazón donde no es cuidado, o cerrando la puerta a quien sí lo merecería. No mendigues afecto donde solo hay ego: ama desde la dignidad y el amor te devolverá la paz."
    },
    rafael: {
      luz: "Yo soy Rafael, el sanador: dejo mi luz esmeralda sobre tu cuerpo, tu mente y tu alma, porque estás siendo sanado. Esta energía restauradora es real y está trabajando en ti: respira, descansa y confía en que la medicina divina ya está haciendo su obra.",
      mixto: "Yo soy Rafael, y te hablo como el médico que ve la herida y también la cura: hay sanación en camino, pero hay una atención que te estás negando. Atiende lo que tu cuerpo o tu alma te piden calladamente, y la guía te llevará a la plenitud.",
      sombra: "Yo soy Rafael, y te regaño con serena severidad: estás descuidando lo que más necesitas cuidar. No postergues más tu salud y tu paz, no sigas dándote a todos mientras no te queda nada para ti: la sanación empieza por detenerte y priorizarte."
    },
    gabriel: {
      luz: "Yo soy Gabriel, el mensajero del cielo: hago sonar mi cuerno de plata porque el mensaje que esperabas está en camino y tu propósito se aclara. Escucha las señales, porque a través de ellas el cielo te habla con total claridad y tu llamado interior se hace más nítido.",
      mixto: "Yo soy Gabriel, y te susurro que la verdad está cerca, pero llega mezclada con ruido. No te apresures a concluir: contrasta lo que oyes, revisa lo que crees y el mensaje puro terminará llegando a tu corazón sin necesidad de forzar nada.",
      sombra: "Yo soy Gabriel, y te interrumpo con mi trompeta para regañarte: has dejado de escuchar, repites palabras viejas y das por sentado lo que aún no ha sido dicho. Silencia el ruido, vuelve a preguntar y abre los oídos: tu respuesta no llegará hasta que te calles."
    },
    uriel: {
      luz: "Yo soy Uriel, el portador de la antorcha: enciendo mi luz sobre ti porque la sabiduría te ilumina y el discernimiento te acompaña. Confía en la certeza interior que ahora se enciende en ti, porque ves con claridad lo que otros no comprenden y tus decisiones tienen luz propia.",
      mixto: "Yo soy Uriel, y te observo con mirada de fuego tranquilo: tienes la verdad cerca, pero el impulso te empuja a decidir antes de tiempo. Detente, examina y compara: la sabiduría que buscas no está en actuar más rápido, sino en mirar más profundo.",
      sombra: "Yo soy Uriel, y te regaño sin rodeos: estás actuando por impulso, sin mirar el conjunto. Has dejado que la emoción nuble el juicio y eso te está costando caro. Vuelve a la claridad, pide tiempo al mundo y decide desde la luz, no desde el miedo."
    },
    zadkiel: {
      luz: "Yo soy Zadkiel, el ángel de la misericordia: abro mis alas violetas sobre ti porque la misericordia y el perdón están desatando lo que te tenía aprisionado. Suéltalo todo, perdona lo que sea necesario y siente cuánta libertad entra en tu alma cuando dejas de cargar el pasado.",
      mixto: "Yo soy Zadkiel, y te tiendo la llave: la liberación es posible, pero hay una cadena que tú mismo mantienes puesta. No se trata solo de que otros te suelten: hay algo que debes soltar tú. Date permiso para dejar ir y el cielo te sostendrá.",
      sombra: "Yo soy Zadkiel, y te miro con compasión y firmeza para regañarte: llevas demasiado tiempo atado a la culpa, al rencor o a un pasado que ya no existe. Cada día que no perdonas, te encadenas más. Suelta la piedra, perdónate y perdona: tu corazón no fue hecho para cargar tanto peso."
    },
    jofiel: {
      luz: "Yo soy Jofiel, el ángel de la inspiración: acaricio tu camino con un rayo dorado porque la belleza y la luz que tanto buscas ya están floreciendo a tu alrededor. Rodéate de lo que te eleva, confía en tu creatividad y verás cómo tu mundo empieza a brillar con tus propios colores.",
      mixto: "Yo soy Jofiel, y te hablo como quien conoce el arte de los comienzos: hay luz, pero todavía tienes los ojos puestos en lo que no fue. Deja de mirar atrás y permite que la inspiración nueva entre: la belleza no llega donde la mirada anda nublada.",
      sombra: "Yo soy Jofiel, y te regaño con dulzura exigente: has dejado de ver la luz que sí tienes, comparándote y ensombreciendo tu propio camino. Cuida lo que miras: la inspiración huye de quien no cree en su propia belleza. Enciende tu luz otra vez."
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
      const texto = this.voces[b.clave][tenor];
      const arc = b.arcangel;
      return {
        icono: arc.emoji,
        area: b.clave,
        titulo: `${this.nombreCorto(arc.nombre)} · ${arc.regencia}`,
        temas: b.temas.map(t => t.tema),
        arcangel: arc,
        regano: tenor === "sombra",
        presencia: this.fraseArea(arc, b.clave),
        texto
      };
    }).concat([{
      cierre: true,
      texto: "Los siete arcángeles han hablado, cada uno desde su don, y han sellado juntos esta lectura con una sola certeza: no estás sola ni desamparada. Todas las voces señalan el mismo camino, y todas te sostienen para que lo recorras con fe. Suelta el miedo, abraza el consejo que más te dolió escuchar y deja que la luz de este consejo celestial te guíe hacia la vida que mereces.",
      cita
    }]);
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
      <h3 style="color:var(--dorado);margin-bottom:10px">Interpretación general de la Tirada de Tarot</h3>
      <p>Aquí tienes la interpretación de tu tirada de tarot completa gratis.</p>
      <p>Nuestras videntes y tarotistas te pueden dar un servicio totalmente personalizado, confidencial, realizando una tirada de cartas personal de gran calidad. Junto a su don de videncia, podrán ayudarte con tu futuro.</p>
      <div class="fila-tarot">${Array(7).fill("tarot").map(x => "<span>" + x + "</span>").join("")}</div>
      <p class="comparte"><small>✨ Comparte tu resultado con quien quieras ✨</small></p>
    </div>`;

    const arcangeles = this.arcangelesDeLectura(resultadoHTML);
    resultadoHTML.__arcangeles = arcangeles;
    const arcangel = arcangeles[0];
    this.aplicarFondo(arcangeles);
    html += `<div class="arcangel-regente vidrio">
      <div class="ar-seal">${arcangel.emoji}</div>
      <div class="ar-info">
        <small>${arcangeles.length > 1 ? "Tus arcángeles regentes se unen en esta lectura" : "Tu lectura está regida por"}</small>
        <h3>${this.nombresArcangeles(arcangeles)}</h3>
        <span class="ar-regencia">${this.listaRegencias(arcangeles)}</span>
        <div class="ar-fila">${arcangeles.map(a => `<span class="ar-chip" style="--chip:${a.color}">${a.emoji} ${this.nombreCorto(a.nombre)}</span>`).join("")}</div>
        <p class="ar-mensaje">${this.mensajeUnido(arcangeles)}</p>
      </div>
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
    const tituloFinal = esGranTirada
      ? "✨ La palabra de los siete arcángeles ✨"
      : "✨ Interpretación final de tu tirada ✨";
    let htmlFinal = `<div class="interpretacion-final"><h3 class="titulo-interp-final">${tituloFinal}</h3>`;
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
          </h4>
          <p class="presencia-arc">${b.presencia || this.fraseArea(arcDeArea, b.area)}</p>
          <p>${b.texto}</p>
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

  /* Paso 1 · barajado */
  escena.innerHTML = `
    <div class="centrado">
      <p style="margin-bottom:18px">Cierra los ojos, respira profundo y piensa en tu pregunta. Cuando estés lista, baraja tu mazo.</p>
      <div class="mazo" id="fan-barajado"></div>
      <div class="spinner oculto" id="spinner-barajo"></div>
      <div style="margin-top:26px">
        <button class="btn btn-dorado" id="btn-barajar">✦ Barajar mis cartas</button>
      </div>
    </div>`;

  const fan = document.getElementById("fan-barajado");
  const mazoFan = TIRADAS.barajar(TIRADAS.mazo.slice());
  for (let i = 0; i < 12; i++) {
    const c = mazoFan[i % mazoFan.length];
    const m = document.createElement("div");
    m.className = "minicarta";
    m.style.width = "84px";
    m.style.padding = "8px 6px";
    m.innerHTML = `${TIRADAS.figuraDe(c)}<span class="nom">${c.nombre}</span>`;
    fan.appendChild(m);
  }

  document.getElementById("btn-barajar").addEventListener("click", () => {
    const sp = document.getElementById("spinner-barajo");
    sp.classList.remove("oculto");
    fan.classList.add("oculto");
    setTimeout(() => mostrarEleccion(d), 1400);
  });
}

/* Paso 2 · elegir las cartas tocando el mazo */
function mostrarEleccion(r) {
  const escena = document.getElementById("escena-tarot");
  const tipos = document.querySelectorAll(".opcion-palo");
  tipos.forEach(x => x.classList.add("oculto"));

  let elegidas = 0;
  escena.innerHTML = `
    <div class="centrado">
      <p style="margin-bottom:8px">${r.tirada.n === 1 ? "Elige tu carta del mazo:" : `Elige tus ${r.tirada.n} cartas del mazo.`}</p>
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

  // mazo: las 22 cartas boca arriba para que elijas las de tu lectura
  const zonaMazo = document.createElement("div");
  zonaMazo.className = "mazo mazo-eleccion";
  zonaMazo.style.marginTop = "34px";
  r.mazo.forEach((c, i) => {
    const m = document.createElement("div");
    m.className = "minicarta";
    m.style.width = "84px";
    m.dataset.idx = String(i);
    m.innerHTML = `${TIRADAS.figuraDe(c)}<span class="nom">${c.nombre}</span>`;
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
    elm.style.pointerEvents = "none";
    elm.style.opacity = "0.35";
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
      zonaMazo.querySelectorAll(".minicarta").forEach(x => {
        x.style.pointerEvents = "none";
        x.style.opacity = x.style.opacity || "0.2";
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