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
    { id: "lectura-fuerte", nombre: "Lectura Fuerte", icono: "🔥", corto: "Los siete arcángeles hablan sin rodeos y con amor severo: verdad firme para tu momento.", n: 3, posiciones: [["Tu verdad", "Lo que necesitas escuchar"], ["Lo que evitas", "El bloqueo que escondes"], ["Tu fuerza", "El paso firme que sigue"] ] },
    { id: "cruz-celta", nombre: "Cruz Celta", icono: "🕊️", corto: "La lectura clásica y profunda de diez cartas.", n: 10, posiciones: [["Corazón del asunto", "El centro de la consulta"], ["Lo que cruza", "Las influencias que la atraviesan"], ["Lo que está por encima", "Consciente o metas"], ["Lo que está por debajo", "Inconsciente o raíces"], ["Lo que pasó", "Pasado reciente"], ["Lo que viene", "Futuro cercano"], ["Tu actitud", "Cómo te enfrentas a ello"], ["El entorno", "Influencias externas"], ["Esperanzas y miedos", "Lo que anhelas y temes"], ["Resultado", "La síntesis final"] ] },
    { id: "si-no",     nombre: "Sí o No directo", icono: "🎯", corto: "Una carta, una respuesta clara para tu pregunta.", n: 1, posiciones: [["Tu respuesta", "El veredicto del oráculo"]] },
    { id: "pregunta",  nombre: "Pregunta al Oráculo", icono: "🃏", corto: "Escribe tu pregunta y el arcángel idóneo responderá solo ese tema con tres cartas.", n: 3, pregunta: true, posiciones: [["Tu pregunta", "Lo que consultas al cielo"], ["La lección", "Lo que debes mirar"], ["La respuesta", "La señal del oráculo"]] },
    { id: "carta-astral", nombre: "Carta Astral", icono: "🪐", corto: "Rueda astral completa: los 10 planetas, tu signo solar y lunar, ascendente, casas, retrógrados, gustos y tu arcángel regente.", n: 0, astral: true, posiciones: [] }
  ],

  elegantIcono: { "1-carta": "🕯️", "3-cartas": "💫", "5-cartas": "🌟", "gran-tirada": "🛡️", "lectura-fuerte": "🔥", "cruz-celta": "🕊️", "si-no": "🎯", "pregunta": "🃏", "carta-astral": "🪐" },
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
    /* solo la tirada "Lectura Fuerte" activa el modo fuerte (elegido a propósito);
       el resto siempre sale en su tono natural: las cartas deciden la sombra o la luz */
    return { tirada: t, cartas: [], mazo, fuerte: tipo === "lectura-fuerte" };
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
    miguel:  { nombre: "Arcángel Miguel",  emoji: "⚔️", img: "/arcangeles/miguel.jpeg",  regencia: "Protección y fuerza",      color: "104, 140, 220",     mensaje: "El guerrero de la luz vigila tu camino y disuelve toda oscuridad que se interponga. Bajo su espada, tu protección está garantizada mientras avanzas con valor.", consejo: "Te doy valor: no camines con miedo, camina con firmeza y nos defenderé la retaguardia." },
    gabriel: { nombre: "Arcángel Gabriel", emoji: "📯", img: "/arcangeles/gabriel.jpeg", regencia: "Mensajes y propósito",      color: "212, 175, 55",      mensaje: "El mensajero divino despeja tu mente y te trae claridad sobre el propósito de tu alma. Presta atención a las señales: a través de él el universo te habla.", consejo: "Te traigo el mensaje que esperabas: escucha con el corazón abierto y la respuesta llegará." },
    rafael:  { nombre: "Arcángel Rafael",  emoji: "🕯️", img: "/arcangeles/rafael.jpeg",  regencia: "Curación y guía",          color: "90, 200, 160",      mensaje: "El sanador ilumina las heridas que piden ser cuidadas, tanto del cuerpo como del alma. Su energía restauradora fluye hacia ti y te devuelve el equilibrio.", consejo: "Te curo y te sostengo: respira, suelta el dolor y deja que la sanación invada tu ser." },
    uriel:   { nombre: "Arcángel Uriel",   emoji: "🔥", img: "/arcangeles/uriel.jpeg",   regencia: "Sabiduría y discernimiento", color: "230, 150, 60",      mensaje: "El portador de la luz te otorga la sabiduría para ver con claridad lo que está oculto. Confía en la certeza interior que enciende en tu corazón.", consejo: "Te doy discernimiento: no actúes por impulso, mira con luz interior y decide en paz." },
    zadkiel: { nombre: "Arcángel Zadkiel", emoji: "💜", img: "/arcangeles/zadkiel.jpeg", regencia: "Misericordia y liberación", color: "160, 110, 240",     mensaje: "El ángel de la misericordia te ayuda a soltar culpas, viejos resentimientos y ataduras del pasado. Su presencia abre paso a un perdón que te libera.", consejo: "Te libero de culpas: perdónate y perdona, y sentirás cuán ligera es tu alma." },
    jofiel:  { nombre: "Arcángel Jofiel",  emoji: "🌞", img: "/arcangeles/jofiel.jpeg",  regencia: "Belleza e inspiración",     color: "255, 170, 120",     mensaje: "El ángel de la belleza inunda tu vida de inspiración y te muestra la luz que hay incluso en los días grises. Rodeate de lo que te eleva y verás florecer tu mundo.", consejo: "Te inspiro y te ilumino: busca la belleza que te rodea y ella te guiará." },
    chamuel: { nombre: "Arcángel Chamuel", emoji: "💗", img: "/arcangeles/chamuel.jpeg", regencia: "Paz y amor",               color: "240, 120, 150",     mensaje: "El ángel del amor puro trae paz a tus relaciones y reaviva los lazos más sinceros. A su calor, las puertas del corazón se abren a un afecto verdadero.", consejo: "Te doy amor y paz: abre el corazón y deja que el amor fluya sin miedo." }
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

  /* contexto temático -> arcángel que lo regenta (para que el regaño lo diga
     el arcángel que corresponde a las cartas que salieron) */
  grupoARegente: {
    afectos: "chamuel", persona: "miguel", decision: "uriel",
    espiritual: "gabriel", trabajo: "miguel", animo: "jofiel", otro: "rafael"
  },

  /* elige el arcángel del regaño según el contexto de las cartas, dando más
     peso a las invertidas; restringido a los presentes (o a la lista 'solo') */
  arcangelDeMensaje(resultado, solo) {
    let presentes;
    if (solo && solo.length) presentes = solo;
    else if (resultado.__arcangeles) presentes = resultado.__arcangeles.map(a => a.clave);
    else presentes = this.arcangelesDeLectura(resultado).map(a => a.clave);
    const peso = {};
    (resultado.cartas || []).forEach(c => {
      const e = this.esencia[c.nombre];
      if (!e) return;
      const reg = this.grupoARegente[e.grupo] || "miguel";
      if (presentes.includes(reg)) peso[reg] = (peso[reg] || 0) + (c.invertido ? 2 : 1);
    });
    const clave = Object.keys(peso).sort((a, b) => peso[b] - peso[a])[0];
    return this.arcangeles[clave || presentes[0] || "miguel"];
  },

  /* elige una variante de texto al azar (acepta string o array) */
  elegirDe(variantes) {
    const arr = Array.isArray(variantes) ? variantes : [variantes];
    return arr[Math.floor(Math.random() * arr.length)];
  },

  /* escapa HTML para texto del usuario */
  escapar(t) {
    return String(t == null ? "" : t)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  },

  /* quita acentos y pasa a minúsculas, para comparar la pregunta con las palabras clave */
  normalizarTexto(t) {
    return String(t || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  },

  /* busca una palabra clave dentro de un texto ya normalizado. Las claves muy
     cortas (2-3 letras, ej: «fe», «ex») deben ser palabra completa para no
     sonar falsas dentro de otras palabras (ej: «jefe» contiene «fe») */
  contienePalabra(texto, palabra) {
    const k = this.normalizarTexto(palabra);
    if (k.length <= 3) return new RegExp("\\b" + k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\b").test(texto);
    return texto.includes(k);
  },

  /* ------------------- lectura por pregunta -----------------------------
     analiza el contexto de la pregunta y elige el arcángel más idóneo para
     ese tema: solo él responde y solo se habla de ese terreno de la vida */
  temasPregunta: {
    amor: {
      clave: "chamuel", titulo: "Amor y relaciones", icono: "💗",
      palabras: ["amor", "pareja", "novio", "novia", "ex", "relacion", "casar", "casarme", "boda", "matrimonio", "me quiere", "me ama", "me amas", "le gusto", "le gustas", "regreso", "vuelta", "corazon", "celos", "ruptura", "terminamos", "enamor", "compromiso", "afecto", "separar", "separacion", "infidelidad", "quiere volver", "me deja", "quiere volver conmigo", "vuelve", "volvera", "familia", "hijo", "hija"]
    },
    dinero: {
      clave: "uriel", titulo: "Economía y abundancia", icono: "💰",
      palabras: ["dinero", "plata", "economia", "trabajo", "empleo", "negocio", "salario", "sueldo", "venta", "clientes", "gasto", "deuda", "prestamo", "ahorro", "inversion", "invertir", "comprar", "riqu", "abundancia", "ascenso", "paro", "despid", "socios", "proyecto", "renta"]
    },
    salud: {
      clave: "rafael", titulo: "Salud y energía", icono: "💚",
      palabras: ["salud", "enfermedad", "enfermo", "dolor", "cansancio", "energia", "cuerpo", "operacion", "medico", "medicina", "remedio", "sano", "sanar", "animo", "depresion", "ansiedad", "sueño", "descanso", "gripe", "fiebre", "peso", "ejercicio", "sano", "curar"]
    },
    mensaje: {
      clave: "gabriel", titulo: "Mensajes y señales", icono: "📯",
      palabras: ["mensaje", "respuesta", "senal", "señal", "signo", "estudio", "examen", "universidad", "carrera", "proposito", "mision", "llamado", "viaje", "comunicacion", "habla", "noticia", "aviso", "espiritu", "fe", "dios", "creo", "voz"]
    },
    proteccion: {
      clave: "miguel", titulo: "Protección y fuerza", icono: "🛡️",
      palabras: ["peligro", "enemigo", "miedo", "proteger", "proteccion", "defensa", "seguridad", "amenaza", "lucha", "pelea", "conflicto", "problema", "jefe", "poder", "rival", "perder", "ganar", "defender", "cuidarme", "resguardo", "dano", "danar", "danarme", "persiguen"]
    },
    liberacion: {
      clave: "zadkiel", titulo: "Bloqueos y liberación", icono: "🔓",
      palabras: ["culpa", "perdon", "perdonar", "rencor", "bloqueo", "trauma", "pasado", "soltar", "atadura", "dependencia", "obsesion", "apego", "fracaso", "error", "peso", "libertad", "liberacion", "ciclo", "cerrar", "dejar ir", "maldad", "maldicion", "sombra"]
    },
    futuro: {
      clave: "jofiel", titulo: "Futuro e inspiración", icono: "🌟",
      palabras: ["futuro", "destino", "sueño", "sueno", "meta", "exito", "triunfo", "proyecto", "creatividad", "inspiracion", "idea", "avanzar", "progreso", "cambio", "comenzar", "empezar", "nuevo", "oportunidad", "plan", "camino", "crecer", "brillar"]
    }
  },

  /* analiza la pregunta: devuelve el tema y el arcángel que mejor lo cuida */
  analizarPregunta(pregunta) {
    const limpia = this.normalizarTexto(pregunta);
    let mejor = null;
    let mejorPuntaje = 0;
    for (const tema of Object.keys(this.temasPregunta)) {
      const def = this.temasPregunta[tema];
      let puntaje = 0;
      for (const palabra of def.palabras) {
        if (this.contienePalabra(limpia, palabra)) puntaje++;
      }
      if (puntaje > mejorPuntaje) {
        mejorPuntaje = puntaje;
        mejor = { tema, ...def };
      }
    }
    return mejor || { tema: "mensaje", ...this.temasPregunta.mensaje };
  },

  /* detecta todos los temas que toca una pregunta (para consultas combinadas:
     «¿Cómo me irá en el amor y el trabajo?» responde por cada área) */
  temasEnPregunta(pregunta) {
    const limpia = this.normalizarTexto(pregunta);
    const coincidencias = [];
    for (const tema of Object.keys(this.temasPregunta)) {
      const def = this.temasPregunta[tema];
      let puntaje = 0;
      for (const palabra of def.palabras) {
        if (this.contienePalabra(limpia, palabra)) puntaje++;
      }
      if (puntaje > 0) coincidencias.push({ puntaje, tema, ...def });
    }
    coincidencias.sort((a, b) => b.puntaje - a.puntaje);
    return coincidencias;
  },

  /* ------------------------- análisis desde el servidor ---------------------
     El motor oraculo-nlp.js (backend) analiza la pregunta con más temas y
     matices que el análisis local. Aquí se pide ese análisis y se transforma
     a las claves que la tirada ya conoce (arcángel, título, tipo). */
  NLP_ARC: {
    amor: "chamuel", dinero: "uriel", trabajo: "uriel", salud: "rafael", familia: "chamuel",
    espiritual: "gabriel", energias: "miguel", espiritus: "miguel", fallecido: "miguel",
    proteccion: "miguel", liberacion: "zadkiel", futuro: "jofiel", decision: "jofiel", mensaje: "gabriel"
  },

  async analisisPreguntaServidor(pregunta) {
    try {
      const data = await fetchJSON("/api/ia/analizar-pregunta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pregunta })
      });
      return (data && data.ok && data.analisis) ? data.analisis : null;
    } catch (e) { return null; }
  },

  /* fusiona el análisis del servidor en el resultado para que la lectura
     use el tema/tipo/persona/keywords más exactos */
  inyectarAnalisis(resultado, nl) {
    if (!nl || !nl.temaPrincipal) return;
    const mapear = t => ({ tema: t.clave, clave: this.NLP_ARC[t.clave] || "gabriel", titulo: t.titulo, icono: t.icono || "✨", puntaje: t.puntaje || 0 });
    const temas = (nl.temas || []).map(mapear);
    const principal = mapear(nl.temaPrincipal);
    resultado.__analisis = principal;
    resultado.__tipoPregunta = nl.tipo;
    resultado.__temasPregunta = temas;
    resultado.__temaClaveNLP = nl.temaPrincipal.clave;
    resultado.__persona = nl.persona || null;
    resultado.__parentesco = nl.parentesco || null;
    resultado.__keywords = (nl.keywords || []).filter(k => k.length > 2).slice(0, 8);
    resultado.__tono = nl.tono || "neutro";
  },

  /* --------------------------- esencia de cada carta ------------------------
     grupo: contexto temático de la carta (para combinar cartas del mismo
            contexto: alegría, tristeza, personas del entorno, decisiones...)
     luz / sombra: la esencia de su mensaje según el sentido */
  esencia: {
    "El Loco":        { grupo: "animo",       luz: "libertad y un comienzo nuevo",                sombra: "imprudencia, huir de la propia responsabilidad" },
    "El Mago":        { grupo: "decision",    luz: "tu poder y tus dones creando lo que imaginas", sombra: "talentos dormidos, promesas que no se cumplen" },
    "La Sacerdotisa": { grupo: "espiritual",  luz: "tu intuición que sabe en silencio",            sombra: "verdades que callas y te pesan" },
    "La Emperatriz":  { grupo: "afectos",     luz: "el florecer de lo que cuidas y siembras",      sombra: "el descuido de ti, tu tierra sin nutrir" },
    "El Emperador":   { grupo: "persona",     luz: "una figura firme y bases sólidas",             sombra: "el control rígido que asfixia" },
    "El Hierofante":  { grupo: "persona",     luz: "una guía o un aprendizaje que llega",          sombra: "reglas viejas que ya no son tuyas" },
    "Los Enamorados": { grupo: "afectos",     luz: "una unión y una elección desde el corazón",    sombra: "la duda que divide y traiciona tu verdad" },
    "El Carro":       { grupo: "decision",    luz: "la voluntad enfocada que llega a la victoria", sombra: "la dispersión que no llega a ninguna parte" },
    "La Fuerza":      { grupo: "animo",       luz: "el coraje sereno que doma tus miedos",         sombra: "la voz interior que te dice que no puedes" },
    "El Ermitaño":    { grupo: "espiritual",  luz: "el silencio sabio y tu guía interior",         sombra: "el aislamiento por miedo, no por paz" },
    "La Rueda de la Fortuna": { grupo: "animo", luz: "el destino que gira a tu favor",               sombra: "aferrarte a lo que la rueda ya dejó atrás" },
    "La Justicia":    { grupo: "decision",    luz: "la verdad y el equilibrio que regresan",       sombra: "la responsabilidad que esquivas" },
    "El Colgado":     { grupo: "animo",       luz: "una pausa que te enseña con otra mirada",      sombra: "la quietud por miedo, el sacrificio que vacía" },
    "La Muerte":      { grupo: "animo",       luz: "el final que abre paso a un renacer",          sombra: "el pasado que no sueltas y ocupa tu presente" },
    "La Templanza":   { grupo: "espiritual",  luz: "la armonía que vuelve al punto medio",         sombra: "los excesos que te desbordan" },
    "El Diablo":      { grupo: "persona",     luz: "ver la cadena y tener ya la llave",            sombra: "ataduras que tú misma eliges volver a ponerte" },
    "La Torre":       { grupo: "animo",       luz: "una verdad que sacude y a la vez libera",      sombra: "sostener con miedo lo que ya pide caer" },
    "La Estrella":    { grupo: "espiritual",  luz: "la esperanza y la fe que sanan",               sombra: "apagar tu propia luz en días grises" },
    "La Luna":        { grupo: "animo",       luz: "la marea emocional que navegas con calma",     sombra: "temor a sombras que tu imaginación agranda" },
    "El Sol":         { grupo: "animo",       luz: "la alegría plena, el éxito y la vitalidad",    sombra: "tener el sol y andar mirando nubes" },
    "El Juicio":      { grupo: "espiritual",  luz: "el llamado a despertar y renovarte",           sombra: "dudar de tu valor y quedarte atrás" },
    "El Mundo":       { grupo: "trabajo",     luz: "el ciclo completo y la meta alcanzada",        sombra: "detenerte a un paso de la meta" },

    /* ---------------- arcanos menores ---------------- */
    "As de Copas":    { grupo: "afectos",     luz: "el nido, el bienestar en casa y la familia que crece", sombra: "cerrarte al cariño y al hogar que te sostiene" },
    "Dos de Copas":   { grupo: "afectos",     luz: "la unión que se concreta y la vida que nace de ti",      sombra: "idealizar un vínculo sin que pise tierra firme" },
    "Tres de Copas":  { grupo: "otro",        luz: "una noticia nueva e inesperada que llega a tu puerta",   sombra: "quedarte esperando mensajes ajenos para sentirte vivo" },
    "Cinco de Copas": { grupo: "animo",       luz: "una temporada de celebraciones, alegría y reconocimiento", sombra: "enfrascarte en preparar la fiesta y perderte la fiesta" },
    "Seis de Copas":  { grupo: "afectos",     luz: "la nostalgia que ablanda y la gente querida que vuelve",   sombra: "quedarte a vivir en el pasado y no ver el presente" },
    "Siete de Copas": { grupo: "animo",       luz: "la plenitud: recoges los frutos de tu esfuerzo",          sombra: "no creerte la abundancia y guardarla sin disfrutar" },
    "Ocho de Copas":  { grupo: "afectos",     luz: "las buenas influencias que te abren puertas",             sombra: "depender del favor ajeno más que de tu propio paso" },
    "Nueve de Copas": { grupo: "espiritual",  luz: "la entrega y el desapego que devuelven lo sembrado",      sombra: "dar tanto que se te olvida pedir y recibir" },
    "Sota de Copas":  { grupo: "persona",     luz: "una mujer sensible y soñadora que ama de verdad",         sombra: "enamorarte del cuento de alguien y no de su realidad" },
    "Caballero de Copas": { grupo: "persona", luz: "el caballero andante que se entrega a su ideal",          sombra: "perseguir quimeras sin echar raíces en lo real" },
    "Rey de Copas":   { grupo: "persona",     luz: "la sensibilidad madura que acompaña sin empujar",         sombra: "vivir en el país de los sueños y no aterrizar nunca" },

    "Cuatro de Espadas":  { grupo: "animo",   luz: "la pausa reparadora que evita que el bache te tumbe",     sombra: "un tramo de dolores y aislamiento que conviene atender pronto" },
    "Cinco de Espadas":   { grupo: "animo",   luz: "venirte de la trinchera con la cabeza alta",              sombra: "una disputa fuerte que amenaza con dejar heridas" },
    "Seis de Espadas":    { grupo: "animo",   luz: "cruzar con paciencia el tramo de conflictos",             sombra: "un viaje con contratiempos y planes que se encallan" },
    "Siete de Espadas":   { grupo: "animo",   luz: "un atisbo de esperanza que te devuelve la confianza",     sombra: "un subidón de esperanza que desordena tus razones" },
    "Nueve de Espadas":   { grupo: "animo",   luz: "una angustia que, atravesada, te deja más fuerte",        sombra: "el sufrimiento y los miedos por lo que más amas" },
    "Sota de Espadas":    { grupo: "persona", luz: "una mujer resuelta y perspicaz que ve lo oculto",         sombra: "una enemiga capaz de urdir las intrigas más absurdas" },
    "Caballero de Espadas": { grupo: "persona", luz: "el caballero de la fortaleza que defiende causas justas", sombra: "una disputa o un mensaje duro que exige decisión" },
    "Rey de Espadas":     { grupo: "persona", luz: "la mente clara y la autoridad serena que corta el ruido",  sombra: "enredos, engaños y acuerdos que no terminan de cumplirse" },

    "As de Oros":         { grupo: "trabajo", luz: "el triunfo: éxito y prosperidad en lo que tocas",          sombra: "no creerte que la suerte también te toca a ti" },
    "Dos de Oros":        { grupo: "animo",   luz: "una noticia o un ingreso que suaviza la tensión",          sombra: "una rivalidad que compite por tu tiempo y tu paz" },
    "Tres de Oros":       { grupo: "espiritual", luz: "la fecundidad: una idea o un amor que nace y crece",    sombra: "improvisar sin madurar las decisiones" },
    "Cuatro de Oros":     { grupo: "trabajo", luz: "la prosperidad y el obsequio que te da seguridad",         sombra: "el amor al dinero que te vuelve tacaño de corazón" },
    "Cinco de Oros":      { grupo: "animo",   luz: "los vínculos afectivos que marcan un antes y un después",  sombra: "desavenencias y celos que enfrían lo que estaba por venir" },
    "Seis de Oros":       { grupo: "trabajo", luz: "las dificultades que se resuelven solas y engordan la cosecha", sombra: "la codicia y las envidias que enturbian lo que viene" },
    "Nueve de Oros":      { grupo: "otro",    luz: "los cambios que te invitan a cerrar asuntos viejos",       sombra: "engaños, promesas que no se cumplen y amistades perdidas" },

    "Dos de Bastos":      { grupo: "otro",    luz: "la cercanía: viajes cortos y alegrías sencillas",         sombra: "buscar la felicidad lejos cuando la tienes al lado" },
    "Tres de Bastos":     { grupo: "espiritual", luz: "el amor universal y la visión de que todos somos hermanos", sombra: "perder la espiritualidad por las prisas de lo diario" },
    "Cuatro de Bastos":   { grupo: "animo",   luz: "los cimientos que se afianzan y la alegría compartida",   sombra: "la melancolía que no te deja celebrar lo logrado" },
    "Seis de Bastos":     { grupo: "animo",   luz: "poner nombre al bajón y empezar a remontar",              sombra: "la depresión y el ánimo por los suelos que paralizan" },
    "Siete de Bastos":    { grupo: "trabajo", luz: "el buen hacer y el reconocimiento por el trabajo bien hecho", sombra: "defender tu puesto en vez de caminar por él" },
    "Ocho de Bastos":     { grupo: "animo",   luz: "cortar una atadura y recuperar tu libertad",              sombra: "dependencias que te controlan por costumbre" },
    "Sota de Bastos":     { grupo: "persona", luz: "una mujer enérgica y apasionada que enciende proyectos",   sombra: "el carácter que se vuelve impulso y celos" },
    "Rey de Bastos":      { grupo: "persona", luz: "la experiencia que manda con carisma y templanza",         sombra: "las ambiciones que pesan y el fuego que agota" }
  },

  /* ------------------------- capa semántica -------------------------
     Cada mayor aporta: clave (la "nueva lectura" en forma de sustantivo),
     accion (lo que invita a hacer), resL/resS (desenlace en luz/sombra),
     sombra (su lado difícil) y puede (lo que puede anunciar). Se agrupan en
     cinco funciones de lectura: inicio, decision, desafio, proceso, desenlace.
     El motor combina estas piezas con plantillas para generar interpretaciones
     y mensajes finales sin párrafos fijos por lectura */
  ordenMayores: ["El Loco","El Mago","La Sacerdotisa","La Emperatriz","El Emperador","El Hierofante",
                 "Los Enamorados","El Carro","La Justicia","El Ermitaño","La Rueda de la Fortuna",
                 "El Colgado","La Muerte","La Templanza","El Diablo","La Torre","La Estrella",
                 "La Luna","El Sol","El Juicio","El Mundo"],

  funciones: {
    inicio:       { etiqueta: "el comienzo",  conector: "se abre con",                       verbo: "da el primer paso",   cartas: ["El Loco","El Mago","La Emperatriz","El Carro"] },
    decision:     { etiqueta: "la decisión",  conector: "exige",                             verbo: "elige y resuelve",    cartas: ["La Sacerdotisa","El Hierofante","Los Enamorados","La Justicia","El Ermitaño"] },
    desafio:      { etiqueta: "el desafío",   conector: "choca contra",                      verbo: "se enfrenta",         cartas: ["El Emperador","La Fuerza","El Diablo","La Torre"] },
    proceso:      { etiqueta: "el proceso",   conector: "atraviesa",                         verbo: "se transforma",       cartas: ["La Rueda de la Fortuna","El Colgado","La Muerte","La Templanza"] },
    desenlace:    { etiqueta: "el desenlace", conector: "termina en",                        verbo: "revela",              cartas: ["La Estrella","La Luna","El Sol","El Juicio","El Mundo"] }
  },

  semantica: {
    "El Loco": {
      f: "inicio",
      clave: "un comienzo que invita a saltar hacia lo desconocido",
      accion: "te anima a dar el primer paso sin tener el mapa completo",
      resL: "ese salto, dado con los ojos abiertos, se convierte en camino",
      resS: "saltar sin mirar las consecuencias termina costándote caro",
      sombra: "impulsividad e imprudencia, no medir las consecuencias",
      puede: "un viaje inesperado, una mudanza, comenzar algo nuevo, abandonar una situación, una oportunidad que aparece de repente"
    },
    "El Mago": {
      f: "inicio",
      clave: "una idea nacida de tu talento",
      accion: "pone a tu servicio todos tus recursos para volverla real",
      resL: "tu capacidad transforma la intención en obra",
      resS: "esa habilidad se usa en una dirección que no te conviene",
      sombra: "manipulación, engaño, usar la inteligencia en beneficio propio",
      puede: "un proyecto, un contrato, un documento, una creación que pide nacer"
    },
    "La Emperatriz": {
      f: "inicio",
      clave: "una energía fértil que ayuda a que algo crezca",
      accion: "siembra, nutre y da de comer lo que merece florecer",
      resL: "lo que cuidas se vuelve un fruto visible",
      resS: "el descuido deja tu tierra sin nutrir",
      sombra: "presencia que asfixia lo que intenta crecer",
      puede: "una mujer creativa, una ayuda femenina, un proyecto que comienza a desarrollarse, prosperidad, atractivo personal"
    },
    "El Carro": {
      f: "inicio",
      clave: "algo que finalmente comienza a moverse",
      accion: "toma las riendas y apunta en una sola dirección",
      resL: "el avance se vuelve conquista",
      resS: "avanzar deprisa y sin rumbo termina en un choque",
      sombra: "dispersión, energía que se reparte hasta diluirse",
      puede: "un viaje, un traslado, un avance profesional, una victoria, una decisión ejecutada"
    },
    "La Sacerdotisa": {
      f: "decision",
      clave: "una información que todavía no ha sido revelada",
      accion: "te pide callar, observar y escuchar lo que aún no se dice",
      resL: "la verdad aparece a su tiempo y en su lugar",
      resS: "el silencio se vuelve confusión y el secreto pesa",
      sombra: "silencio excesivo, ocultar información, misterio que confunde",
      puede: "un secreto, información incompleta, una percepción intuitiva, una verdad que aparece más adelante"
    },
    "El Hierofante": {
      f: "decision",
      clave: "una enseñanza que viene de más alto",
      accion: "te conecta con lo que ya tiene tradición y estructura",
      resL: "la decisión se eleva y cobra un respaldo real",
      resS: "las reglas de otros se vuelven una cárcel",
      sombra: "dogma, institución que manda sin escuchar",
      puede: "una institución, una tradición, un maestro, un aprendizaje, un compromiso formal o un matrimonio"
    },
    "Los Enamorados": {
      f: "decision",
      clave: "una elección que obliga a decidir entre dos caminos",
      accion: "te enfrenta al cruce donde el deseo y la responsabilidad se miran",
      resL: "la elección de corazón te devuelve la paz",
      resS: "la duda se queda con las dos opciones y con tu paz",
      sombra: "dualidad, indecisión, conflicto entre lo que se desea y lo que se debe",
      puede: "un dilema, una pareja, una atracción, dos posibilidades"
    },
    "La Justicia": {
      f: "decision",
      clave: "la necesidad de demostrar con hechos lo que estaba oculto",
      accion: "ordena, documenta y devuelve cada cosa a su lugar",
      resL: "la verdad recibe el reconocimiento que merece",
      resS: "lo que no se demuestra a tiempo se pierde",
      sombra: "sentenciarte a ti mismo sin oír tus propios motivos",
      puede: "un contrato, un documento, derechos, consecuencias, reconocimiento"
    },
    "El Ermitaño": {
      f: "decision",
      clave: "una respuesta que aparece cuando dejas de correr",
      accion: "se retira, baja el ruido y mira hacia adentro",
      resL: "la pausa deliberada devuelve la claridad",
      resS: "el refugio se vuelve aislamiento",
      sombra: "aislamiento por miedo y no por paz",
      puede: "una persona mayor, un consejero, una investigación, el silencio, una espera necesaria"
    },
    "El Emperador": {
      f: "desafio",
      clave: "una autoridad que se conquista con estructura",
      accion: "ordena, decide y sostiene los límites con firmeza",
      resL: "el poder se consolida sobre bases sólidas",
      resS: "el control rígido termina asfixiando",
      sombra: "autoridad sin escucha, rigidez que no cede",
      puede: "un ascenso, un liderazgo, una posición de mando, una base por ordenar"
    },
    "La Fuerza": {
      f: "desafio",
      clave: "una fortaleza serena que se gana sin agredir",
      accion: "domina el impulso y responde desde la calma",
      resL: "tu autocontrol desarma lo que te provoca",
      resS: "la presión que no se gestiona estalla tarde o temprano",
      sombra: "reprimirlo en vez de gobernarlo",
      puede: "defenderte sin gritar, controlar una tentación, resistir firme en la crisis"
    },
    "El Diablo": {
      f: "desafio",
      clave: "una tentación que promete justo lo que puede atraparte",
      accion: "te enseña a nombrar la cadena para desactivarla",
      resL: "la verdad dicha corta la atadura",
      resS: "el deseo se vuelve dependencia",
      sombra: "deseo, dependencia, manipulación, exceso de poder material",
      puede: "manipulación, fraude, obsesión, dinero, dependencia, seducción, abuso de confianza"
    },
    "La Torre": {
      f: "desafio",
      clave: "una verdad que rompe una ilusión",
      accion: "deja caer lo que ya venía avisando su caída",
      resL: "la crisis limpia y deja hueco para reconstruir",
      resS: "el golpe llega sin avisar y sacude los cimientos",
      sombra: "fracaso, traición, ruptura brusca",
      puede: "un fracaso inesperado, una traición, una pérdida, una ruptura, una revelación dolorosa"
    },
    "La Rueda de la Fortuna": {
      f: "proceso",
      clave: "un giro que nadie puede controlar del todo",
      accion: "giras con el cambio y sueltas lo que la rueda deja atrás",
      resL: "el ciclo se cierra y deja paso al siguiente",
      resS: "aferrarte a lo que ya pasó te deja a contramano",
      sombra: "resistencia al cambio inevitable",
      puede: "un cambio de trabajo, una mudanza, una oportunidad, un reencuentro, el cierre de un ciclo"
    },
    "El Colgado": {
      f: "proceso",
      clave: "una pausa que dice: todavía no debes actuar",
      accion: "suspende la prisa, cambia el punto de vista y espera",
      resL: "lo que se detiene a tiempo se resuelve mejor",
      resS: "la espera se convierte en sacrificio vacío",
      sombra: "quedarse colgado del miedo y de la duda",
      puede: "una espera, un retraso, una situación bloqueada, no intervenir todavía"
    },
    "La Muerte": {
      f: "proceso",
      clave: "un final que limpia el terreno para algo nuevo",
      accion: "suelta lo que ya cumplió su ciclo",
      resL: "lo que termina libera el espacio de lo que nace",
      resS: "aferrarte al pasado ocupa el lugar de lo nuevo",
      sombra: "miedo a soltar, resistencia a terminar",
      puede: "una separación, un cambio de trabajo, una mudanza, el fin de una costumbre, una transformación profunda"
    },
    "La Templanza": {
      f: "proceso",
      clave: "la mezcla justa que vuelve al centro",
      accion: "combina con calma los opuestos y regula el ritmo",
      resL: "las cosas se resuelven gradualmente y se sostienen",
      resS: "los extremos te desbordan por un lado y por otro",
      sombra: "excesos, prisa que rompe el equilibrio",
      puede: "una reconciliación, una recuperación, moderación, esperar el momento correcto"
    },
    "La Estrella": {
      f: "desenlace",
      clave: "una esperanza con nombre y dirección",
      accion: "siembra un deseo concreto y le pone fecha",
      resL: "lo que soñaste empieza a tomar forma",
      resS: "la fe se apaga porque no se le da de comer",
      sombra: "desesperanza, olvido de los propios sueños",
      puede: "un sueño, una persona que inspira, un futuro favorable, protección, recuperación"
    },
    "La Luna": {
      f: "desenlace",
      clave: "un miedo que todavía no tiene forma clara",
      accion: "te invita a bajar el miedo y convertir el presentimiento en pregunta",
      resL: "la claridad llega cuando baja la marea",
      resS: "la inquietud nocturna termina decidiendo por ti",
      sombra: "confusión, fobia, inseguridad, información incompleta",
      puede: "un miedo, una sospecha, una intuición, una confusión emocional, un secreto"
    },
    "El Sol": {
      f: "desenlace",
      clave: "lo que estaba oculto se vuelve evidente y favorable",
      accion: "brilla, celebra y muestra lo que lograste",
      resL: "el éxito se vuelve visible y te corona",
      resS: "tener el sol delante y andar mirando nubes",
      sombra: "exceso de confianza, no disfrutar lo conquistado",
      puede: "éxito, una buena noticia, reconocimiento, claridad, triunfo"
    },
    "El Juicio": {
      f: "desenlace",
      clave: "una llamada que despierta algo de tu pasado",
      accion: "responde, elige y preséntate de nuevo",
      resL: "lo viejo se comprende de otra manera y te renueva",
      resS: "el regreso que no se atiende vuelve a llamar a la puerta",
      sombra: "dudar de tu valor, no responder a la llamada",
      puede: "un reencuentro, un mensaje, una persona del pasado, una segunda oportunidad, una noticia importante"
    },
    "El Mundo": {
      f: "desenlace",
      clave: "una experiencia que completa lo que estaba incompleto",
      accion: "cierra el ciclo y recibe el reconocimiento",
      resL: "lo logrado se expande y abre puertas nuevas",
      resS: "quedarte a un paso de la meta",
      sombra: "vértigo de terminar y no saber qué sigue",
      puede: "un logro, un viaje, una mudanza, expansión, el cierre de un ciclo"
    }
  },

  /* combinaciones de pares curadas: se detectan cuando dos cartas de la lectura
     coinciden, y aportan una lectura específica a la interpretación conjunta */
  parCombinaciones: [
    ["El Loco", "El Carro", "viaje o desplazamiento, una aventura que exige acción"],
    ["El Loco", "La Rueda de la Fortuna", "un cambio inesperado"],
    ["El Loco", "La Muerte", "cerrar una etapa y comenzar otra completamente diferente"],
    ["El Loco", "La Justicia", "revisar bien las consecuencias antes de dar el salto"],
    ["El Loco", "El Diablo", "una aventura que puede convertirse en mala decisión"],
    ["El Mago", "La Torre", "una creación o proyecto que fracasa inesperadamente"],
    ["El Mago", "La Justicia", "derechos intelectuales, contratos, documentos, la propiedad de una creación"],
    ["El Mago", "El Diablo", "una persona inteligente que usa sus capacidades para manipular"],
    ["El Mago", "La Emperatriz", "crear algo juntos"],
    ["El Mago", "El Sol", "éxito obtenido mediante talento propio"],
    ["El Mago", "El Mundo", "una capacidad que puede alcanzar un reconocimiento amplio"],
    ["La Sacerdotisa", "La Luna", "intuición mezclada con incertidumbre"],
    ["La Sacerdotisa", "La Justicia", "información escondida relacionada con documentos o asuntos legales"],
    ["La Sacerdotisa", "El Juicio", "un secreto que finalmente sale a la luz"],
    ["La Sacerdotisa", "El Ermitaño", "buscar una respuesta dentro de uno mismo"],
    ["La Emperatriz", "El Mago", "crear algo juntos"],
    ["La Emperatriz", "La Estrella", "una mujer que inspira o ayuda a cumplir un deseo"],
    ["La Emperatriz", "El Diablo", "magnetismo, seducción o atracción intensa"],
    ["La Emperatriz", "El Emperador", "una pareja o alianza entre fuerzas complementarias"],
    ["La Emperatriz", "El Mundo", "creatividad que alcanza reconocimiento"],
    ["El Emperador", "El Carro", "un ascenso mediante esfuerzo"],
    ["El Emperador", "La Justicia", "autoridad legítima"],
    ["El Emperador", "El Mago", "capacidad profesional reconocida"],
    ["El Emperador", "La Torre", "una pérdida o cambio brusco de autoridad"],
    ["El Emperador", "El Mundo", "una posición de liderazgo consolidada"],
    ["El Hierofante", "Los Enamorados", "elegir un compromiso"],
    ["El Hierofante", "La Justicia", "un compromiso formal o legal"],
    ["El Hierofante", "El Juicio", "una renovación espiritual"],
    ["El Hierofante", "La Estrella", "una fe renovada"],
    ["Los Enamorados", "El Diablo", "una atracción muy intensa que puede complicar la situación"],
    ["Los Enamorados", "La Justicia", "elegir correctamente"],
    ["Los Enamorados", "La Luna", "no tener claro qué se siente"],
    ["Los Enamorados", "La Muerte", "una relación que cambia de forma"],
    ["Los Enamorados", "La Estrella", "una esperanza amorosa"],
    ["El Carro", "El Mundo", "un viaje lejano o internacional"],
    ["El Carro", "La Torre", "un viaje o proyecto alterado inesperadamente"],
    ["La Justicia", "El Diablo", "fraude o manipulación contractual"],
    ["La Justicia", "El Sol", "victoria y reconocimiento"],
    ["La Justicia", "La Torre", "una injusticia que provoca una ruptura"],
    ["El Ermitaño", "La Justicia", "consultar a un experto"],
    ["El Ermitaño", "La Templanza", "recuperación mediante calma"],
    ["El Ermitaño", "Los Enamorados", "pensar antes de elegir"],
    ["La Rueda de la Fortuna", "El Carro", "un cambio que produce movimiento"],
    ["La Rueda de la Fortuna", "La Muerte", "un cambio definitivo"],
    ["La Rueda de la Fortuna", "El Sol", "un giro favorable"],
    ["La Rueda de la Fortuna", "La Torre", "un cambio inesperado y difícil"],
    ["La Rueda de la Fortuna", "El Mundo", "un cambio que abre una etapa completamente nueva"],
    ["La Fuerza", "La Justicia", "defenderse correctamente"],
    ["La Fuerza", "El Diablo", "controlar una tentación"],
    ["La Fuerza", "La Torre", "mantenerse firme durante una crisis"],
    ["La Muerte", "La Estrella", "un final que conduce a la esperanza"],
    ["La Muerte", "El Mundo", "el cierre completo de un ciclo"],
    ["La Templanza", "Los Enamorados", "una relación que se desarrolla lentamente"],
    ["La Templanza", "La Muerte", "adaptación a un cambio"],
    ["La Templanza", "El Mundo", "integración y estabilidad"],
    ["El Diablo", "La Luna", "un miedo que domina"],
    ["La Torre", "El Diablo", "un engaño que termina causando daño"],
    ["La Torre", "La Luna", "miedo provocado por una situación incierta"],
    ["La Torre", "La Estrella", "después de la crisis aparece una nueva esperanza"],
    ["La Estrella", "El Carro", "un viaje hacia una oportunidad"],
    ["La Estrella", "El Mundo", "un sueño que alcanza su realización"],
    ["La Estrella", "El Juicio", "un llamado espiritual"],
    ["El Sol", "El Mundo", "un reconocimiento amplio"],
    ["El Sol", "El Carro", "éxito después del esfuerzo"],
    ["El Sol", "El Juicio", "una noticia importante y favorable"]
  ],

  /* situaciones especiales curadas: cuando una lectura coincide con el conjunto
     exacto de cartas, aparece una interpretación específica y muy concreta */
  especiales: [
    { cartas: ["El Mago", "La Torre", "La Justicia", "El Colgado"], titulo: "Traición a una persona creativa", mensaje: "Una persona talentosa ve interrumpido un proyecto porque alguien abusa de su confianza o de sus derechos. La situación genera impotencia, pero requiere reclamar lo que legítimamente le corresponde." },
    { cartas: ["La Luna", "El Diablo", "La Fuerza", "El Carro"], titulo: "Superar un miedo", mensaje: "Un miedo limita el movimiento, pero puede ser enfrentado mediante disciplina y voluntad hasta recuperar la libertad. El miedo domina, la fuerza interior domina, y el carro devuelve el movimiento." },
    { cartas: ["La Luna", "La Estrella", "El Sol", "El Mundo"], titulo: "Invitación y síndrome del impostor", mensaje: "La inseguridad hace creer que uno no pertenece, pero una oportunidad social demuestra que tu presencia es valorada y abre nuevas conexiones." },
    { cartas: ["El Hierofante", "Los Enamorados", "La Justicia", "La Sacerdotisa"], titulo: "Decisión espiritual o tradicional", mensaje: "Una decisión vinculada con una tradición o un compromiso profundo debe tomarse escuchando tu propia conciencia y no las opiniones externas." },
    { cartas: ["La Emperatriz", "El Mago", "La Estrella", "El Carro"], titulo: "Mujer que ayuda a cumplir un deseo", mensaje: "Una persona creativa y generosa entra en el proceso y proporciona el impulso necesario para convertir un deseo en realidad." },
    { cartas: ["Los Enamorados", "El Colgado", "La Estrella"], titulo: "Espera paciente", mensaje: "Existe un vínculo afectivo que no puede desarrollarse todavía, pero la esperanza permanece mientras las circunstancias cambian." },
    { cartas: ["La Emperatriz", "El Diablo", "Los Enamorados", "La Torre"], titulo: "Magnetismo que provoca problemas de pareja", mensaje: "El magnetismo y la búsqueda de atención generan una tentación que termina debilitando una relación cuyos valores ya estaban en conflicto." },
    { cartas: ["La Sacerdotisa", "El Ermitaño", "La Justicia"], titulo: "Información que falta para resolver un problema", mensaje: "La solución existe, pero falta revelar información importante y consultar a una persona con experiencia." },
    { cartas: ["La Estrella", "La Muerte", "La Templanza", "Los Enamorados"], titulo: "Fin y vínculo nuevo", mensaje: "Después del final de una relación dañina aparece una conexión nueva que se desarrolla lentamente hasta convertirse en un vínculo profundo." },
    { cartas: ["El Hierofante", "La Estrella", "El Juicio", "La Justicia"], titulo: "Recompensa espiritual", mensaje: "Un compromiso espiritual sostenido durante mucho tiempo comienza a producir reconocimiento y exige ahora una renovación consciente." },
    { cartas: ["La Sacerdotisa", "La Luna", "El Juicio", "La Estrella"], titulo: "Percepción espiritual", mensaje: "Sensibilidad hacia aquello que normalmente permanece oculto, acompañada de la necesidad de desarrollar discernimiento antes de interpretar lo percibido." },
    { cartas: ["Los Enamorados", "La Luna", "El Diablo", "La Justicia"], titulo: "Dilema sentimental", mensaje: "Una atracción intensa provoca dudas y tentaciones, pero la decisión final debe considerar las consecuencias reales y los límites existentes." },
    { cartas: ["El Emperador", "El Carro", "El Mago", "El Sol"], titulo: "Ascenso profesional", mensaje: "La competencia demostrada convierte gradualmente a una persona subordinada en alguien con autoridad, visibilidad y capacidad de decisión." },
    { cartas: ["El Ermitaño", "El Colgado", "La Templanza"], titulo: "Agotamiento y necesidad de parar", mensaje: "La acción inmediata no resuelve el problema. Es necesario detenerse, recuperar el equilibrio y permitir que la mente vuelva a organizarse." },
    { cartas: ["La Rueda de la Fortuna", "La Muerte", "La Estrella", "El Mundo"], titulo: "Cambio que mejora la vida", mensaje: "Un cambio inicialmente incómodo elimina una estructura antigua y abre una etapa más favorable y completa." },
    { cartas: ["El Diablo", "El Mago", "La Luna", "La Justicia"], titulo: "Posible engaño", mensaje: "Una persona utiliza inteligencia y persuasión para presentar una propuesta atractiva mientras oculta consecuencias perjudiciales. La protección está en revisar hechos y documentos." },
    { cartas: ["La Emperatriz", "La Fuerza", "La Estrella", "La Templanza"], titulo: "Acompañar el dolor", mensaje: "La ayuda no consiste en solucionar el problema, sino en ofrecer presencia, estabilidad y esperanza mientras la persona recupera su equilibrio." },
    { cartas: ["El Mundo", "La Emperatriz", "El Mago", "Los Enamorados"], titulo: "Mujer de otro entorno", mensaje: "Una persona procedente de otro entorno entra en tu vida y combina atractivo, talento y capacidad material, creando una posibilidad de alianza que puede evolucionar hacia algo más personal." },
    { cartas: ["La Torre", "La Rueda de la Fortuna", "El Carro", "La Templanza"], titulo: "Proyecto detenido por dinero", mensaje: "Un obstáculo económico obliga a modificar un plan, pero no destruye el proyecto. La clave está en adaptar el camino." },
    { cartas: ["La Luna", "La Torre", "El Diablo", "El Juicio", "La Justicia"], titulo: "Herida antigua", mensaje: "Una experiencia antigua dejó una marca profunda. La recuperación comienza cuando aquello que permaneció oculto puede ser reconocido y colocado en su verdadero contexto, sin atribuir culpa a quien sufrió el daño." },
    { cartas: ["El Diablo", "Los Enamorados", "La Justicia", "La Torre"], titulo: "Palabras que no demuestran", mensaje: "Existe un vínculo donde las palabras prometen más de lo que las acciones entregan. La realidad termina obligando a evaluar la relación por hechos." },
    { cartas: ["El Carro", "El Mundo", "La Muerte", "La Estrella"], titulo: "Amiga que se muda", mensaje: "Una persona cercana abandona su entorno habitual para comenzar una etapa nueva. La distancia modifica la relación, pero no necesariamente la destruye." },
    { cartas: ["La Justicia", "La Rueda de la Fortuna", "El Sol", "El Juicio"], titulo: "La buena acción que regresa", mensaje: "Una acción positiva del pasado vuelve al presente en forma de reconocimiento, ayuda o gratitud." },
    { cartas: ["La Fuerza", "La Estrella", "La Luna", "La Templanza"], titulo: "Compañía silenciosa", mensaje: "Una presencia silenciosa proporciona estabilidad emocional y ayuda a recuperar el equilibrio durante momentos de incertidumbre." },
    { cartas: ["El Carro", "El Loco", "El Mundo", "La Rueda de la Fortuna", "Los Enamorados"], titulo: "Viaje que cambia la vida", mensaje: "Un viaje inesperado abre una nueva etapa y puede producir un encuentro o una decisión que modifica el rumbo personal." },
    { cartas: ["El Sol", "La Justicia", "El Emperador", "El Mundo"], titulo: "Éxito profesional", mensaje: "El esfuerzo obtiene un reconocimiento concreto y coloca a la persona en una posición más fuerte." },
    { cartas: ["El Diablo", "Los Enamorados", "La Luna"], titulo: "Atracción física intensa", mensaje: "Una atracción poderosa altera temporalmente la claridad emocional y puede llevar a actuar por impulso." },
    { cartas: ["Los Enamorados", "El Diablo", "La Justicia", "El Colgado"], titulo: "Deseo complicado", mensaje: "Existe deseo, pero las circunstancias actuales impiden convertirlo en una relación sana. La espera o el límite son necesarios." },
    { cartas: ["El Carro", "El Loco", "El Mundo", "La Estrella"], titulo: "Amigo que se marcha", mensaje: "Una persona abandona su entorno para seguir un camino propio. La separación física no implica necesariamente pérdida del vínculo." },
    { cartas: ["Los Enamorados", "La Templanza", "La Emperatriz", "El Sol"], titulo: "Amistad que se vuelve amor", mensaje: "Un vínculo que creció lentamente entre dos personas alcanza una expresión afectiva más clara." },
    { cartas: ["El Juicio", "La Luna", "La Justicia"], titulo: "Mensaje inesperado", mensaje: "Llega una comunicación que contiene información emocional o importante y obliga a reconsiderar una situación." },
    { cartas: ["El Emperador", "El Sol", "El Mundo", "El Mago"], titulo: "Crecimiento y liderazgo", mensaje: "Las capacidades personales, combinadas con experiencia y buenas alianzas, llevan finalmente a una posición de influencia." },
    { cartas: ["El Diablo", "El Mago", "La Justicia", "La Luna", "La Torre"], titulo: "Operación inmobiliaria sospechosa", mensaje: "Una propuesta aparentemente lógica oculta una estructura desfavorable. La presión y la persuasión intentan impedir que examines las consecuencias." },
    { cartas: ["Los Enamorados", "El Diablo", "La Luna", "La Justicia"], titulo: "Confesión sentimental complicada", mensaje: "Una declaración revela una atracción real, pero existe un contexto que impide que el deseo se convierta fácilmente en una relación estable." },
    { cartas: ["El Mago", "La Justicia", "El Emperador", "El Mundo"], titulo: "Proteger un proyecto", mensaje: "El talento puede producir éxito, pero necesita estructura legal, límites claros y protección de los derechos propios." },
    { cartas: ["La Estrella", "El Mundo", "La Emperatriz", "La Rueda de la Fortuna"], titulo: "Un lugar que se convierte en hogar", mensaje: "Un lugar asociado con paz y pertenencia comienza a convertirse en una posibilidad material real." },
    { cartas: ["La Sacerdotisa", "El Colgado", "La Templanza"], titulo: "Revelación que debe esperar", mensaje: "La verdad puede decirse, pero todavía no. El momento correcto es parte de la solución." },
    { cartas: ["La Rueda de la Fortuna", "El Emperador", "El Mago", "El Carro"], titulo: "Cambio en el equipo", mensaje: "Una reorganización modifica las funciones del equipo y te coloca en una posición de conocimiento y responsabilidad." },
    { cartas: ["El Juicio", "La Rueda de la Fortuna", "El Mundo", "Los Enamorados"], titulo: "Reencuentro", mensaje: "Una persona que salió de tu vida vuelve cuando las circunstancias han cambiado, permitiendo recuperar o transformar el vínculo." },
    { cartas: ["La Fuerza", "La Justicia", "Los Enamorados", "La Torre"], titulo: "Intervenir con prudencia", mensaje: "La solidaridad puede llevarte a intervenir, pero debes controlar la reacción emocional para no convertirte en parte del conflicto." },
    { cartas: ["La Torre", "Los Enamorados", "La Luna", "La Templanza"], titulo: "Mujer herida por una infidelidad", mensaje: "Una ruptura de confianza provoca un fuerte desequilibrio emocional y requiere tiempo, escucha y recuperación antes de buscar soluciones." },
    { cartas: ["El Emperador", "La Fuerza", "La Torre"], titulo: "La arrogancia no intimida", mensaje: "Una estructura de poder aparente pierde fuerza cuando encuentra a alguien que no responde con miedo. No entres en su juego." },
    { cartas: ["El Carro", "El Mundo", "La Luna", "Los Enamorados", "La Templanza"], titulo: "Viaje marítimo con componente sentimental", mensaje: "Un desplazamiento asociado al agua produce una experiencia emocional profunda y puede transformar un vínculo existente." },
    { cartas: ["El Ermitaño", "El Juicio", "La Rueda de la Fortuna"], titulo: "Regreso anunciado", mensaje: "Una persona con conocimiento del pasado proporciona información que te prepara para un regreso o un acontecimiento pendiente." }
  ],

  /* agrupa cartas por su contexto (alegría, tristeza, personas, decisiones...) */
  agruparContexto(cartas) {
    const grupos = {};
    cartas.forEach(c => {
      const k = (this.esencia[c.nombre] && this.esencia[c.nombre].grupo) || "otro";
      (grupos[k] = grupos[k] || []).push(c);
    });
    return Object.keys(grupos).map(k => ({ grupo: k, cartas: grupos[k] }));
  },

  /* elige las cartas que protagonizan la combinación: prefiere juntar 2 o más
     cartas del mismo contexto, y si no, toma hasta 3 cartas de la lectura */
  elegirGrupoCombinacion(cartas, max = 3) {
    const grupos = this.agruparContexto(cartas);
    const multi = grupos.filter(g => g.cartas.length >= 2)
      .sort((a, b) => b.cartas.length - a.cartas.length);
    const grupo = multi.length ? multi[0].cartas : cartas;
    return grupo.slice(0, max);
  },

  /* miniatura de carta para la combinación y los regaños (imagen + nombre) */
  miniCarta(c) {
    const rot = c.invertido ? ' style="transform:rotate(180deg)"' : "";
    return `<div class="combo-mini${c.invertido ? " inv" : ""}">
      <div class="combo-mini-art">${c.img ? `<img src="${c.img}" alt="${c.nombre}" loading="lazy"${rot}>` : `<div class="c-nm">${c.emoji}</div>`}</div>
      <span>${c.nombre}${c.invertido ? " <i>invertida</i>" : ""}</span>
    </div>`;
  },

  /* carta solo con su imagen, para la combinación visual: carta imagen + carta imagen = contexto */
  comboCartaHtml(c) {
    const rot = c.invertido ? ' style="transform:rotate(180deg)"' : "";
    return `<span class="combo-carta${c.invertido ? " inv" : ""}">${c.img ? `<img src="${c.img}" alt="${c.nombre}" loading="lazy"${rot}>` : `<span class="c-nm">${c.emoji}</span>`}</span>`;
  },

  /* nombre del terreno en que se unen las cartas protagonistas de la combinación */
  contextoDeCombinacion(cartas) {
    const nombres = {
      afectos: "el amor y los afectos", persona: "las personas y el poder", decision: "las decisiones",
      espiritual: "lo espiritual", trabajo: "el trabajo y la meta", animo: "el ánimo", otro: "tu momento"
    };
    const contados = {};
    cartas.forEach(c => {
      const g = (this.esencia[c.nombre] && this.esencia[c.nombre].grupo) || "otro";
      contados[g] = (contados[g] || 0) + 1;
    });
    const orden = Object.entries(contados).sort((a, b) => b[1] - a[1]);
    const [g, n] = orden[0] || ["otro", 0];
    return (n >= 2 || orden.length === 1) ? (nombres[g] || "tu momento") : "tu momento";
  },

  /* carta + carta = significado en conjunto. Compone el mensaje unificado de un
     grupo de cartas (mismo contexto o mezcla), en la voz del arcángel que
     custodia ese rincón de la lectura */
  significadoConjunto(grupo, arc) {
    const A = this.nombreCorto(arc.nombre);
    const R = arc.regencia.toLowerCase();

    if (grupo.length === 1) {
      const c = grupo[0];
      const sen = this.esencia[c.nombre];
      const faceta = c.invertido
        ? (sen ? sen.sombra : "la sombra de su mensaje")
        : (sen ? sen.luz : "la luz de su mensaje");
      const claves = (c.palabras || []).slice(0, 2).join(" y ");
      return this.elegirDe([
        `Su mensaje domina esta lectura: ${faceta}. Entiende sus claves, ${claves}, y deja que ${A} te lo confirme desde su ${R}: esta carta no te pide más, te pide obedecer su señal.`,
        `Una sola carta al frente de tu lectura es un mensaje en mayúsculas: ${faceta}. ${A} lo cuida desde su ${R} y las claves, ${claves}, te marcan el camino: no hay que sumar más, hay que mirar esta.`
      ]);
    }

    const derechas = grupo.filter(c => !c.invertido);
    const invertidas = grupo.filter(c => c.invertido);
    const facetaDe = c => {
      const e = this.esencia[c.nombre];
      return c.invertido ? (e ? e.sombra : "un aviso en sombra") : (e ? e.luz : "un mensaje de luz");
    };
    const encadenar = arr => arr
      .map((c, i) => (i === 0 ? facetaDe(c).charAt(0).toUpperCase() + facetaDe(c).slice(1) : facetaDe(c)))
      .join(", se enlaza con ");

    if (!invertidas.length) {
      return this.elegirDe([
        `${encadenar(derechas)}. Cuando dos luces se tocan, tu momento se acelera: ${A} lo respalda desde su ${R} y te pide que camines con fe, porque lo que viene ya viene armado.`,
        `${encadenar(derechas)}. Su significado en conjunto es claro: todo se alinea contigo. ${A} lo confirma con su ${R}: esta coincidencia no es azar, es señal de que el cielo te está sumando a favor.`
      ]);
    }
    if (invertidas.length === grupo.length) {
      return this.elegirDe([
        `${encadenar(invertidas)}. Cuando toda la sombra se junta no es castigo: es una sola puerta pidiendo ser abierta. ${A} te habla desde su ${R} para que la abras hoy, no mañana.`,
        `${encadenar(invertidas)}. Su conjunto te grita lo mismo: hay un patrón que se repite. ${A} lo nombra desde su ${R}: no escaparás de él hasta que lo mires de frente.`
      ]);
    }
    return this.elegirDe([
      `${encadenar(derechas)}; y en paralelo, ${encadenar(invertidas)} es el aviso que la luz necesita para asentarse. ${A} sostiene esa balanza desde su ${R}: aprovecha lo que ya avanza y suelta hoy lo que pesa.`,
      `${encadenar(derechas)}; mientras tanto, ${encadenar(invertidas)}. Juntas dibujan tu tarea: afirmar lo que brilla y voltear lo que pesa. ${A} te acompaña desde su ${R} en ese equilibrio.`
    ]);
  },

  /* consejo directo para la combinación de cartas, en palabras simples y en la
     voz del arcángel regente, basado en la posición de cada carta */
  consejoDeCombinacion(grupo, arc) {
    const A = this.nombreCorto(arc.nombre);
    const R = arc.regencia.toLowerCase();
    const derechas = grupo.filter(c => !c.invertido);
    const invertidas = grupo.filter(c => c.invertido);
    const nombresD = (derechas.slice(0, 3).map(c => c.nombre) || []).join(" y ");
    const nombresI = (invertidas.slice(0, 3).map(c => c.nombre) || []).join(" y ");

    if (!invertidas.length) {
      return this.elegirDe([
        `Avanza con lo que ${nombresD || "estas cartas"} te dicen. No dudes de ti: fíjate una meta pequeña para hoy y da ese paso. ${A}, desde su ${R}, te acompaña en cada uno.`,
        `Haz esto con calma: camina al ritmo de ${nombresD || "tu lectura"} y no corras a decidir cosas grandes todavía. Mantén lo que está bien, agrega un poquito de fe y sigue. ${A} está contigo.`,
        `Elige una sola cosa de todo lo que sientes hoy y actúala: así la luz de ${nombresD || "tus cartas"} no se queda en palabras. ${A} te sostiene desde su ${R} mientras lo haces.`
      ]);
    }
    if (invertidas.length === grupo.length) {
      return this.elegirDe([
        `No pelees contra ${nombresI || "estas cartas"}. Solo escucha qué te están avisando y suelta lo que ya no te sirve. ${A} te dice, desde su ${R}: soltar también es avanzar.`,
        `Haz una pausa, sí, pero no te quedes en ella: escucha de cerca a ${nombresI || "la sombra"} porque ahí está la clave para cambiar de rumbo a tiempo. Un paso pequeño y honesto de hoy vale más que diez mañana.`,
        `No lo tomes como castigo: es una señal para frenar y mirar. Deja de dar vueltas a lo mismo, elige una salida posible hoy y empieza por ahí. ${A} sujeta tu mano, desde su ${R}.`
      ]);
    }
    return this.elegirDe([
      `Quédate con lo bueno de ${nombresD || "tu lectura"} (avanza con eso) y atiende el aviso de ${nombresI || "las invertidas"} (suelta eso). Nada de todo o nada: un pasito hoy, otro mañana. ${A} te acompaña desde su ${R}.`,
      `Haz esto: confirma tu camino con ${nombresD || "la luz"} y corrige una sola cosa de lo que te señala ${nombresI || "la sombra"}. Lo que pesa hoy se suelta con una decisión pequeña. ${A} camina a tu lado.`,
      `Mezcla de luz y sombra es mezcla de oportunidad y aviso: agarra lo bueno, mira lo que te estás perdiendo y corrige a tiempo. ${A}, desde su ${R}, te guía para que no se te escape ninguna de las dos.`
    ]);
  },

  /* pequeño regaño directo que acompaña a la combinación, breve y simple */
  reganoDeCombinacion(grupo, arc) {
    const A = this.nombreCorto(arc.nombre);
    const R = arc.regencia.toLowerCase();
    const invertidas = grupo.filter(c => c.invertido);
    const derechas = grupo.filter(c => !c.invertido);

    if (!invertidas.length) {
      return this.elegirDe([
        `Pero ${A} ya sabe lo que pasa cuando todo brilla: hay algo que llevas tiempo esquivando y estas cartas derechas no te lo van a decir dos veces. Atiéndelo hoy con calma, no cuando ya sea urgente.`,
        `No te duermas con la buena racha: ${A} te advierte, desde su ${R}, que la carta derecha no es permiso para seguir igual. Aprovecha la luz para arreglar lo que dejas siempre para después.`
      ]);
    }
    if (invertidas.length === grupo.length) {
      return this.elegirDe([
        `Venías con la respuesta delante y no querías verla: ${invertidas.map(c => c.nombre).join(" y ")} te lo ${invertidas.length > 1 ? "dijeron" : "dijo"} tres veces y tú seguías igual. Hoy sí: obedece la señal.`,
        `Un regaño de ${A}, sin rodeos: no es falta de suerte, es que no hiciste la tarea a tiempo. Mira lo que estas cartas te señalan y cambia antes de que la vida tenga que gritártelo.`
      ]);
    }
    return this.elegirDe([
      `Una sola cosa, ${A}: no conviertas la señal de ${invertidas[0] ? invertidas[0].nombre : "la sombra"} en otra excusa para frenar. Se corrige rápido, se avanza igual de rápido. Hoy.`,
      `Lo único que ${A} te reclama: sigues dejando para mañana lo que estas cartas ya te dijeron hoy. Un esfuerzo pequeño y real, ahora, y el aviso se vuelve tu mayor ventaja.`
    ]);
  },

  /* tarjetas de carta con su propio mensaje, para el regaño por bloque */
  reganoCartaHtml(cartas) {
    return (cartas || []).map(c => `
      <div class="reg-carta">
        ${this.miniCarta(c)}
        <p>"${c.texto}"</p>
      </div>`).join("");
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

/* ===================== MOTOR NARRATIVO ANCLADO A LAS CARTAS ==============
     cada lectura corta y la gran tirada se cuentan como una historia propia:
     cada capítulo usa la carta real que cayó y su posición real (via {Pos}).
     La luz y la sombra del relato se eligen según el sentido de cada carta. */

  /* frase natural para cada posición de la baraja, sustituye a {Pos} */
  posFrase: {
    "Tu mensaje": "tu mensaje de hoy",
    "La energía central de tu momento": "la energía central de tu momento",
    "Pasado": "tu pasado",
    "Presente": "tu presente",
    "Futuro": "tu futuro",
    "Situación": "tu situación",
    "Camino": "el camino que eliges",
    "Obstáculo": "tu obstáculo",
    "Ayuda": "la ayuda que te sostiene",
    "Resultado": "el resultado de esta etapa",
    "Tu respuesta": "tu respuesta",
    "Tu verdad": "la verdad que necesitas escuchar",
    "Lo que evitas": "lo que evitas",
    "Tu fuerza": "la fuerza de tu siguiente paso",
    "Corazón del asunto": "el corazón de tu asunto",
    "Lo que cruza": "lo que cruza tu camino",
    "Lo que está por encima": "lo que tu mente persigue",
    "Lo que está por debajo": "lo que habita tu interior",
    "Lo que pasó": "tu pasado reciente",
    "Lo que viene": "tu futuro cercano",
    "Tu actitud": "tu actitud",
    "El entorno": "tu entorno",
    "Esperanzas y miedos": "tus esperanzas y tus miedos",
    "Tu pregunta": "tu pregunta",
    "La lección": "la lección de tu consulta",
    "La respuesta": "la respuesta",
    "Situación general": "tu situación general",
    "Amor y relaciones": "tus amores y relaciones",
    "Economía y abundancia": "tu economía y tu abundancia",
    "Trabajo y proyecto": "tu trabajo y tus proyectos",
    "Familia y hogar": "tu familia y tu hogar",
    "Salud y energía": "tu salud y tu energía",
    "Espiritualidad y fe": "tu espiritualidad y tu fe",
    "Bloqueo a liberar": "el bloqueo que tienes que liberar",
    "Pasado que te marcó": "tu pasado, el que te marcó",
    "Presente que te sostiene": "tu presente, el que te sostiene",
    "Futuro que se acerca": "el futuro que se acerca",
    "Consejo del cielo": "el consejo que el cielo te da",
    "Lección del alma": "la lección que tu alma aprende",
    "Resultado final": "el resultado final de todo esto"
  },

  fraseDePos(pos) {
    return (this.posFrase && this.posFrase[pos]) || String(pos || "tu historia").toLowerCase();
  },

  /* puentes breves que unen dos capítulos de la lectura narrada */
  puentes: [
    "Y no es casualidad lo que sigue en tu historia:",
    "El hilo continúa, y se confirma:",
    "Y justo ahí la vida añade otra pieza:"
  ],

  /* cierres del regaño, siempre en acción concreta */
  empujes: [
    "Esto no se corrige con buenas intenciones: elige una sola acción hoy y hazla de verdad, sin explicarla.",
    "No necesitas otra señal: necesitas obedecer esta. Cambia una sola cosa hoy y las demás girarán solas.",
    "Esta carta no vino a hacerte sentir mal: vino a darte la lista de lo que estás lista para soltar. Empieza por una."
  ],

  /* relatos: para cada arcano, dos versiones de luz y dos de sombra que se
     integran a la lectura en la posición real de la carta */
  relatos: {
    "El Loco": {
      luz: [
        "En {Pos} algo nuevo llama a tu puerta con un impulso que no puedes explicar: un proyecto, un lugar, una persona distinta que abre un terreno que nunca habías pisado. Da el paso aunque no tengas el mapa completo, porque el rumbo se aclara caminando. Lo que hoy parece una apuesta es tu libertad llamándote a casa.",
        "En {Pos} se abre un camino que no estaba en tus planes, y esa es justamente su mejor señal: soltar el recetario y atreverte a lo nuevo. No lo sobrepienses: la vida premia a quien salta con el corazón, y tus alas están más listas de lo que crees. Empieza ligero, y lo demás se acomoda."
      ],
      sombra: [
        "En {Pos} hay una prisa que no te deja ver: corres hacia adelante sin mirar lo que dejas, y confundes vértigo con libertad. Te estás lanzando a una decisión importante sin el mínimo plan, y el suelo firme no está donde crees. Esta carta no te pide quedarte quieta: te pide mirar bien antes de saltar.",
        "En {Pos} sigues apostando a la escapatoria, a empezar de nuevo en otro lado para no terminar lo que toca terminar. Esa libertad que persigues es en realidad un adiós repetido: a los compromisos, a las personas, a ti misma. El salto sin red esta vez no es aventura: es huida con los ojos cerrados."
      ]
    },
    "El Mago": {
      luz: [
        "En {Pos} tienes en la mano exactamente lo que necesitas para crear lo que imaginas: talento, palabra y un momento que se abre. Todo lo que aprendiste en silencio empieza a pedir salir, y alguien está dispuesto a apoyar tu idea si la presentas bien. Cree en tu capacidad y empieza con una acción pequeña: lo demás se encadena solo.",
        "En {Pos} se enciende tu capacidad de hacer real lo que hasta ahora era deseo, y las puertas no se abren solas: se abren cuando muestras lo que sabes hacer. Llega el minuto de dejar de ensayar en tu mente y mostrar al mundo tu talento. Nadie va a hacerlo por ti, y hoy lo sabes con claridad."
      ],
      sombra: [
        "En {Pos} nadie te engaña excepto tú: promesas que dices y no cumples, talentos que guardas sin usar, ideas que fabricas y no pones en marcha. Tu poder no se perdió, se quedó dormido en la primera puerta que cerraste por miedo. Esta carta no te pide más discursos: te pide el primer hecho.",
        "En {Pos} hay una palabra dada que quedó pendiente, y esa pendiente te pesa más de lo que admites. Acomodas tu agenda para no enfrentar lo que prometiste, y la energía que podría construir se te va en evadir. Solo recuperas tu poder devolviendo lo que quedó a medias: hoy toca cumplir."
      ]
    },
    "La Sacerdotisa": {
      luz: [
        "En {Pos} la respuesta ya existe y vive en ti, aunque tu cabeza todavía la descarte: hay una certeza en el pecho que la lógica no puede explicar, y hacerle caso hoy te ahorra un error grande. Busca un momento de silencio, baja el ruido y pregúntate una sola vez. La señal te va a salir al paso.",
        "En {Pos} lo importante casi no se ve: una intuición, una corazonada, un no que ya sabes antes de que lleguen las razones. Algo se te está revelando en cuentagotas y pide que confíes en tu propio radar. No necesitas más datos: necesitas hacer caso de la data que llevas dentro."
      ],
      sombra: [
        "En {Pos} guardas una verdad que no te atreves a mirar ni a decir, y ese silencio ya se volvió costumbre: sabes lo que está pasando y esperas que alguien lo confirme para no creértelo tú. La intuición no te está fallando, la estás tapando con ocupaciones. Escucha tu propia voz o ella se cansará de hablar.",
        "En {Pos} te escondes detrás de la ambigüedad: no preguntas, no confirmas, no miras, porque temes lo que vas a encontrar. Ese misterio que cultivas no es prudencia, es miedo con velo. La verdad ya está en tu interior, nítida: deja de esperar el permiso de otros para aceptarla."
      ]
    },
    "La Emperatriz": {
      luz: [
        "En {Pos} algo que cuidaste en silencio empieza a florecer: una relación, un proyecto, tu propio cuerpo, tu casa. La abundancia no llega por golpe de suerte, llega porque regaste, protegiste y esperaste con paciencia. Disfruta lo que brota y compártelo sin miedo: lo que se da también se multiplica.",
        "En {Pos} la vida te devuelve con generosidad lo que sembraste: hay terreno fértil para que nazca lo que pides, y una persona cercana, protectora y cariñosa juega a tu favor sin buscar publicidad. Crea, embellece y nutre: lo que tocas hoy da frutos y te sonríe."
      ],
      sombra: [
        "En {Pos} llevas tiempo viviendo en el borrador de tu vida: pospones tu cuidado, tu creatividad y tus deseos para cuando haya tiempo, y tu tierra se está quedando sin riego. Se nota en el cansancio y en el abandono de lo que amabas. Vuelve a ser la persona que siembra y cuida: nadie puede nutrirte mejor que tú.",
        "En {Pos} hay un descuido que ya tiene nombre: dejaste de darte lo que siempre les das a otros, tu generosidad se volvió la única moneda y tu propia cuenta quedó en ceros. Esta carta no te pide más sacrificio: te pide ponerte primera en tu propia lista y volver a florecer."
      ]
    },
    "El Emperador": {
      luz: [
        "En {Pos} se consolidan las bases: tu palabra, tu casa, tu trabajo y tus límites ganan peso. Hay una figura de autoridad, un jefe, un padre, alguien mayor, que puede abrirte una puerta si te presentas con orden. Este es el momento de mandar en tu vida con firmeza tranquila: estructura hoy lo que quieres sostener mañana.",
        "En {Pos} la firmeza que muestras empieza a dar frutos: lo que estaba disperso se ordena bajo tu mando y el entorno te reconoce más autoridad de la que tú misma te das. Ejerce tu lugar sin demostrar de más: el poder bien usado construye, protege y se respeta solo."
      ],
      sombra: [
        "En {Pos} el control se te está yendo de las manos por querer abarcarlo todo: rigidez, orden impuesto, una autoridad que ahoga hasta a la que manda. Entre más aprietas, más se escapa; entre más decides por todos, más solo te quedas. Suelta un poco el mando, delega y respeta los tiempos del mundo: mandar bien también es saber ceder.",
        "En {Pos} alguien con poder, un jefe, un familiar, una figura mayor, está ejerciendo una autoridad que te asfixia; o tú estás ejerciendo igual de dura contigo. La estructura en la que confiaste tambalea y lo sabes. No se trata de derribarlo todo: se trata de negociar desde tu dignidad, no desde el miedo."
      ]
    },
    "El Hierofante": {
      luz: [
        "En {Pos} se acerca una guía que no tiene la forma que imaginas: no viene a darte la respuesta, viene a ponerte delante de situaciones para que descubras que puedes. Así es una persona mayor, sabia y exigente: te quiere demasiado para regalarte el camino. Acepta el reto, porque detrás del esfuerzo está la capacidad que no sabías que tenías.",
        "En {Pos} alguien con experiencia, un maestro, un familiar grande, un mentor, está dispuesto a ayudarte aunque a su manera y en sus tiempos. Las enseñanzas que te da hoy no siempre suenan dulces, pero son las que de verdad fortalecen. Escucha, aplica y crece: esta guía es un regalo disfrazado de exigencia."
      ],
      sombra: [
        "En {Pos} estás obedeciendo reglas que no son tuyas: un siempre se hizo así que te mantiene donde no quieres estar. Alguien, una enseñanza, una tradición, una figura de autoridad, te tiene plantada en un carril que no elegiste. Esta carta te da permiso de revisar qué te sirve y qué ya cumplió: escuchar tu propia verdad no es desobediencia.",
        "En {Pos} hay un consejo repetido que seguiste sin pensar y hoy se volvió jaula: la opinión de otros, el deber heredado, la costumbre que ya no te hace bien. Pregúntate de quién es el guion que estás escribiendo. Liberarte de lo aprendido no te deja vacía: te devuelve a ti misma."
      ]
    },
    "Los Enamorados": {
      luz: [
        "En {Pos} llega una elección importante y esta vez tu corazón y tu mente se ponen de acuerdo: un sentimiento que iba en silencio pide ser dicho, una unión, una reconciliación, un sí que temías pronunciar. Elige desde la verdad y no desde el miedo a perder: quien te quiere de verdad también te elige, y lo que es para ti no se marcha.",
        "En {Pos} el amor se decide a tomar forma, en un vínculo que se confirma o en un cariño que se renueva. Hay una química que ya no se puede seguir negando y alguien espera tu señal para dar el siguiente paso. Abre la boca con honestidad: decir lo que sientes no rompe nada, cierra brechas."
      ],
      sombra: [
        "En {Pos} la duda te tiene partida en dos: quieres y no te atreves, recibes y no decides, te acercas y huyes. Esa indecisión no protege tu corazón, lo deja en vilo y deja en vilo a quien te quiere. Esta carta no va a elegir por ti: te pide soltar el miedo a quedarte sola y decidir de una vez.",
        "En {Pos} hay una relación que se sostiene por costumbre y no por amor: quedarse por miedo, ceder por culpa, callar por paz. Esta carta no te pregunta si amas: te pregunta cuánto te estás traicionando para no tener que decidir. La verdad duele menos que la espera, y hoy lo sabes."
      ]
    },
    "El Carro": {
      luz: [
        "En {Pos} tu voluntad se pone en marcha y nada va a poder frenarte si eliges un solo rumbo: la meta que parecía lejana se acerca con cada paso firme, y hay una victoria que ya está en camino. Sujeta las riendas, mira adelante y cruza: la disciplina de hoy es tu triunfo de mañana.",
        "En {Pos} sales ganando no por suerte sino por enfoque: entre tantas direcciones elegiste una y le pusiste cuerpo. Una meta concreta está a tu alcance y el impulso corre a favor. Mantén el paso constante, celebra cada avance pequeño y no desvíes la vista: la línea de llegada está más cerca de lo que crees."
      ],
      sombra: [
        "En {Pos} vas para todos lados y no llegas a ninguno: cambias de rumbo con cada opinión, empiezas proyectos y los abandonas, llena de velocidad y vacía de dirección. Esa energía dispersa agota y no construye. Esta carta te detiene el paso para decirte: elige una sola cosa hoy y cambia el destino de tu semana.",
        "En {Pos} corres para no pensar, empujas situaciones solo por avanzar y confundes movimiento con progreso. Vas deprisa hacia nadie y el cansancio te alcanza. Te pido frenar en seco: la victoria no está en la prisa, está en la dirección, y recuperarla es tu tarea."
      ]
    },
    "La Fuerza": {
      luz: [
        "En {Pos} tu calma vale más que cualquier grito: tienes frente a ti un miedo, una presión o una persona difícil, y la salida no es pelear sino dominar desde la serenidad. Tu mejor armadura es tu paciencia: cuando el león de tu interior te obedece, nada de afuera puede contigo. Confía en esa fortaleza que no hace ruido.",
        "En {Pos} la valentía que necesitas no es ruidosa: es la de quedarte firme, respirar y no rendirte ante la primera contrariedad. Hay una capacidad de resistir que desconocías y se está probando justo ahora. Amate en el proceso, cuida tu energía y sigue: el coraje sereno siempre llega más lejos que el impulso."
      ],
      sombra: [
        "En {Pos} hay una voz interna que te repetía que no puedes y la creíste de tanto repetirla: te tratas con más dureza que cualquier enemigo, te exiges, te castigas y eso te deja al pie de cada batalla. Esta carta no te pide ser más dura: te pide dejar de serlo contigo. Trátate como tratarías a quien más amas.",
        "En {Pos} la presión te está volviendo contra ti misma: aguantas, callas, te esfuerzas de más y un día explotas donde menos conviene. Esa fuerza que gastas dominando todo termina derrumbándote. Baja la exigencia, pide ayuda y deja que alguien cargue contigo: la valentía también es saber cuándo ya."
      ]
    },
    "El Ermitaño": {
      luz: [
        "En {Pos} necesitas un retiro breve y voluntario: bajar el ruido, alejarte un rato y escuchar a tu guía interior. La respuesta que buscas afuera está adentro, esperando que vayas a buscarla en silencio. Apaga el exceso, camina despacio y descansa: la claridad vuelve sola, y vuelve más fuerte.",
        "En {Pos} una luz se enciende desde adentro: algo que sabías y habías olvidado regresa a ti en la soledad elegida. Un tiempo de recogimiento te está preparando un regalo de entendimiento. No lo pierdas por distraerte en lo urgente: lo importante de esta etapa se ve mejor con los ojos cerrados."
      ],
      sombra: [
        "En {Pos} te estás aislando por miedo, no por paz: dejas de contestar, de salir, de pedir, y se te nota en la mirada. Ese silencio que eliges no te está sanando: te está desertando de tu propia vida. El cariño te espera ahí afuera, y abrir la puerta también es cuidado propio.",
        "En {Pos} te encerraste en tu propio faro y ya no alumbras a nadie, empezando por ti: la soledad dejó de ser elección y se volvió costumbre. Te acostumbraste a no contar tus penas y a no recibir. Vuelve al mundo con pasos chicos, deja que te ayuden y suelta un poco el mando: no estás tan solo como te lo creíste."
      ]
    },
    "La Rueda de la Fortuna": {
      luz: [
        "En {Pos} el destino gira a tu favor: lo que esperabas, pedías o necesitabas llega por una vía que no viste venir, y algo cambia de rumbo y te levanta: una oportunidad, una respuesta, un encuentro. No te aferres a lo viejo: suelta lo que la rueda deja atrás y deja entrar lo nuevo.",
        "En {Pos} la marea cambia de signo y te lleva hacia aguas que te favorecen: lo que estaba frenado empieza a moverse y lo que se daba por perdido regresa, quizá transformado. Es momento de subirte al golpe en vez de esperar a pie: tu suerte se actúa, y la actúas hoy moviéndote."
      ],
      sombra: [
        "En {Pos} te aferras a un pasado que la rueda ya giró: esperas que vuelva lo que se fue, que se repita lo que terminó, y así frenas lo que viene. El mundo no va a regresar por ti: va hacia adelante, contigo o sin ti. Suelta el andén, mira el giro que se acerca y camina al paso de tu propia historia.",
        "En {Pos} sientes que la suerte te esquiva y que los golpes se repiten en la misma esquina de tu vida. Pero mira bien: los patrones que le echas al destino los fabrica la repetición que tú eliges. La rueda no está parada contra ti: está esperando que cambies de punto de partida."
      ]
    },
    "La Justicia": {
      luz: [
        "En {Pos} la verdad regresa a su lugar: una cuenta que se cuadra, una decisión que se define justa, una palabra que era tuya y vuelve. Lo que sembraste se está cosechando con balanza equilibrada, y el resultado te favorece si tus manos están limpias. Asume con honradez y la justicia sonríe contigo.",
        "En {Pos} llega el momento de ajustar cuentas contigo y con otros: firmas, acuerdos, compromisos, tu palabra dada. La claridad que pide esta carta te protege: escribe, anota, confirma y no dejes cabos sueltos. La justicia hecha con calma hoy te ahorra el juicio mañana."
      ],
      sombra: [
        "En {Pos} hay una evasión que te cobra factura: dejaste algo a medias, una promesa, una verdad, una responsabilidad, y el peso se nota en tu espalda aunque no lo dejes ver. Esta carta solo pide una cosa: asume y repara la parte tuya. La paz regresa por la puerta de la honestidad.",
        "En {Pos} sientes la vara caer encima de una injusticia que quizá tú misma ayudaste a sostener: medias verdades, acuerdos que firmas sin leer, culpas mal repartidas. Esta carta no te condena, te equilibra: reparte de nuevo las responsabilidades, corrige a tiempo y vuelve a tu centro."
      ]
    },
    "El Colgado": {
      luz: [
        "En {Pos} una pausa que parece pérdida se está volviendo tu mayor escuela: lo que hoy sientes que pierdes, en realidad está preparando algo que todavía no alcanzas a ver completo. Esta demora, esta espera, este punto muerto está acomodando tu camino. Cambia el ángulo de la mirada, confía en la quietud y verás la revelación.",
        "En {Pos} la solución no es empujar más: es soltar el control un momento y mirar tu vida desde otra posición. Lo que has hecho hasta aquí no alcanza, no porque esté mal, sino porque esta etapa pide entrega. Deja que el tiempo trabaje a favor y encuentra la salida que aparece cuando dejas de forzar."
      ],
      sombra: [
        "En {Pos} te quedas colgado por miedo y le pones nombre de paciencia: una espera que ya es costumbre y un sacrificio que nadie te pidió. Te quedas quieta para no equivocarte y la vida pasa delante de ti. Esta carta te baja del gancho: muévete, decide y devuelve tu energía a tu propio camino.",
        "En {Pos} el peso que soportas por otros se volvió tu identidad: te sacrificas, cedes y aguantas, convencida de que sufrir te hace buena, y nadie te lo agradece como imaginabas. Esta carta te devuelve el permiso de soltar lo que no es tuyo: dejar de cargar no es traicionar a nadie, es volver a ti."
      ]
    },
    "La Muerte": {
      luz: [
        "En {Pos} algo termina para que algo mayor nazca: un ciclo, un vínculo, una etapa o una versión tuya que ya cumplió. Duele el adiós y lo sé, pero cada final que abrazas te despeja el terreno. No busques revivir lo que murió: agradece lo que te dio y camina hacia lo que empieza, más aliviada y más libre.",
        "En {Pos} la vida te pide cerrar para abrir: hay un cambio profundo en marcha que no tiene vuelta atrás, y esa es la mejor noticia. Lo que se está transformando era demasiado pequeño para lo que viene. Suelta sin culpa, mira todo lo que dejas de cargar y deja que la nueva etapa te llame: naces de nuevo."
      ],
      sombra: [
        "En {Pos} te niegas a dejar morir lo que ya murió: lo repasas, lo revives, le alargas la agonía y, mientras tanto, lo nuevo no encuentra sitio. El pasado que no sueltas te ocupa el presente entero. Esta carta es clara: soltar no es dejar de amar, es dejar de sangrar. Entierra de verdad para poder renacer.",
        "En {Pos} hay un final que llevas años posponiendo por miedo: una relación, un trabajo, una costumbre, una casa que ya cumplieron su tiempo. Cada mes que lo sostienes artificial te cobra algo de vida. Esta carta no te anuncia desgracia: te anuncia la deuda que pagas por no soltar. Juégatela y cierra."
      ]
    },
    "La Templanza": {
      luz: [
        "En {Pos} las piezas vuelven a encontrar su punto medio: cuerpo y mente, dar y recibir, trabajo y descanso se equilibran otra vez. La sanación que esperas llega con calma, como el agua al valle, sin necesidad de forzarla. Respira hondo y confía: la armonía que se restaura hoy sostiene todo lo que viene.",
        "En {Pos} un equilibrio se está reconstruyendo después de un exceso o de un vacío: una mezcla justa de esfuerzo y descanso, de compañía y soledad. Este es el tiempo de la combinación serena, de pasos pequeños hacia el centro, sin grandes sacrificios. Ve despacio y verás cómo lo que estaba roto se va soldando solo."
      ],
      sombra: [
        "En {Pos} los excesos te pasaron factura: mucho trabajo sin descanso, mucho dar sin recibir, mucho apuro sin pausa, y tu cuerpo y tu ánimo están pidiendo basta. Creíste que el desequilibrio era entrega y es cansancio. Vuelve al punto medio, a los horarios, a la moderación: ahí están tu paz y tu fuerza de regreso.",
        "En {Pos} andas mezclando emociones a destiempo: lo que sientes y lo que haces caminan desincronizados, y esa turbulencia se nota en cada relación y en cada decisión. Un lado de ti se apresura y el otro se retira. Esta carta te pide bajar la intensidad y buscar la mezcla justa: nada de extremos hoy, solo centro."
      ]
    },
    "El Diablo": {
      luz: [
        "En {Pos} por fin ves la cadena que te tenía atado: un miedo, una culpa, una costumbre o una persona que te encadenaba en silencio, y mirarla de frente ya es desatarla, porque la cadena existe mientras no la nombres. La llave nunca la tuvo otro: la tienes tú, y el momento de usarla es hoy.",
        "En {Pos} te das cuenta de lo que te estaban vendiendo, la ilusión, el vínculo o el rol que te tenía enfocada en lo que no era tuyo. Verlo no te hace débil, te hace dueña de tu salida. Este es el instante de soltar la tentación que te costaba cara y recuperar tu propio aire."
      ],
      sombra: [
        "En {Pos} hay una atadura que eliges porque la conoces más que a tu libertad: una persona que te desgasta, un vicio, una culpa, un miedo que se volvió tu sombra fiel. Y lo peor es que lo sabes y aún lo alimentas. Esta carta no te juzga: te muestra la puerta y la llave. Deja de pagar con tu paz el derecho a dejar una cadena.",
        "En {Pos} algo o alguien te tiene atrapada por la promesa de lo que fue: te quedas por culpa, por miedo, por migajas. Esta relación, costumbre o compromiso se alimenta de tu energía y te devuelve casi nada. Corta el cable, agradece la lección y sal: la cadena solo tiene el poder que tú le dejas."
      ]
    },
    "La Torre": {
      luz: [
        "En {Pos} una verdad sacude tus cimientos y duele, te acompaño en eso, pero lo que se cae hoy es preciso que caiga. Hay algo que construiste sobre arena, una confianza, un plan, una ilusión, y la vida te está devolviendo a tierra firme. Deja caer lo que se cae y reconstruye sobre lo que sí es verdad: esta luz que entra es liberación.",
        "En {Pos} se rompe algo que parecía eterno y en la sacudida ganas una claridad que no tenías: por fin ves las grietas que todos veían menos tú. El golpe no viene a destruirte, viene a enseñarte dónde estaba lo falso. Suelta los restos, recoge lo bueno que hay en ti y vuelve a construir con los pies en la tierra."
      ],
      sombra: [
        "En {Pos} sostienes con miedo una estructura que ya está cayendo: un trabajo que se acabó y no admites, una relación que hace ruido y sigues remendando, una falsa seguridad que te cuesta una fortuna emocional. Cada día que la sostienes artificial te resta fuerza para el después. Déjala caer ya: tu nueva construcción espera el terreno limpio.",
        "En {Pos} el golpe que temes ya viene anunciado y las señales se fueron acumulando: quizá no es la casa que se cae, sino la versión de ti que se quedó pequeña. Nada sólido se construye sobre la mentira que eliges sostener. Esta carta te pide el valor de derribar tu propia fachada antes de que la derribe el golpe."
      ]
    },
    "La Estrella": {
      luz: [
        "En {Pos} la tormenta amainó y tu fe regresa con más fuerza que antes: una herida antigua está cicatrizando y un deseo que creías perdido vuelve a pronunciarse. Tu estrella sigue arriba, encendida, y por fin la miras. Espera, cree y deja que la luz te bañe: lo sanado hoy es la base de lo que sueñas mañana.",
        "En {Pos} se enciende una señal de esperanza que no se explica con lógica: un encuentro, un mensaje, una quietud que te devuelve la calma. Tu fe viene a rescatar lo que la rutina había apagado. Siembra ahora lo que quieres cosechar, agradece temprano y camina hacia la luz: el cielo te la está tendiendo."
      ],
      sombra: [
        "En {Pos} tienes la luz encendida y la pasas mirando el gris: un mal día, una crítica, un miedo te están tapando lo que sí está bien. Tu estrella no se apagó, se te nubló la vista a fuerza de mirar los bordes. Vuelve la mirada a lo que existe, agradece lo que tienes y deja que la fe regrese.",
        "En {Pos} perdiste la costumbre de creer: después de tanta promesa rota, dejas de pedir y de soñar para no sufrir. Pero tu historia no termina ahí: hay un regalo esperando tu mirada y solo te pide un resquicio. Deja entrar una esperanza pequeña: de ahí crece todo."
      ]
    },
    "La Luna": {
      luz: [
        "En {Pos} hay algo que se mueve bajo la superficie y todavía no tiene nombre: una intuición, un cambio emocional, una marea que sube despacio. No todo es lo que parece y tu alma lo sabe. Camina con calma, escucha lo que sientas por las noches y no decidas aún: la verdad saldrá a la luz en su momento.",
        "En {Pos} las emociones vienen y van como la luna sobre el agua: días claros, días inquietos, dudas que crecen en la oscuridad. Este tiempo pide más escucha que respuesta: observa, anota, descansa y espera. Hay secretos que se revelan solos y un presentimiento que tu ser te está guardando para acertar."
      ],
      sombra: [
        "En {Pos} tu imaginación está agrandando sombras: un miedo que repites, un qué pasará que te quita el sueño, una sospecha sin pruebas que ya vive en tu cabeza. La noche le pone volumen a lo que en el día no tiene forma. Baja el miedo, sube la razón, pide información y descansa: la realidad es más amable que tu peor boceto.",
        "En {Pos} hay una incertidumbre que no quieres mirar y te escondes de ella en distracciones: esperas señales, revisas conversaciones, relees mensajes. Y la luna está llena de pistas que tú misma niegas. Lo que desconoces duele menos que lo que adivinas a oscuras: enciende la pregunta, ponla en el centro y respóndela con datos, no con fantasmas."
      ]
    },
    "El Sol": {
      luz: [
        "En {Pos} el sol sale para ti a pleno: alegría, éxito y vitalidad se alinean en tu camino. Lo que sembraste se ve, se celebra y se descansa: un logro llega, un cariño se confirma, una buena noticia te pinta el día. Vive este momento a lo grande, agradece en voz alta y comparte la luz: se multiplica cuando se da.",
        "En {Pos} una claridad te baña: lo que era confuso se vuelve simple y lo que dudabas se confirma. Hay una energía de victoria cerca, un reconocimiento, una reconciliación, una buena nueva, y tú eres parte de ella. Sonríe, congela este momento y guárdalo para los días grises: este es tu presente prometido."
      ],
      sombra: [
        "En {Pos} tienes el sol brillando y andas mirando nubes: te acostumbraste a lo bueno y solo reparas en lo que falta. La alegría no se está escapando, la estás subestimando. Esta carta te recuerda que tu luz sigue intacta dentro de ti: deja de esconderla por culpa o por miedo y permite que vean lo que eres.",
        "En {Pos} pospones la celebración para cuando todo esté perfecto y ese día no llega nunca: el logro está, la risa falta. Te vuelves severo con tu propia felicidad, como si no la hubieras merecido. Esta carta no te pide más méritos: te pide permitirte estar bien. Alégrate hoy, aunque sea de una pausa: la felicidad también se entrena."
      ]
    },
    "El Juicio": {
      luz: [
        "En {Pos} escuchas un llamado que no puedes ignorar: una parte tuya que quedó dormida vuelve a despertar y te llama a una segunda oportunidad. Es el instante de renacer, de responder, de levantarte de los arrepentimientos. El cielo te está convocando por tu nombre: levántate, que tu momento llegó.",
        "En {Pos} se abre un juicio a tu favor: algo que estuvo pendiente, cuestionado o retrasado se resuelve y te absuelve. Una decisión madura que ya no esquivas te devuelve el control y la paz. Habla, actúa y presenta tu verdad con la conciencia tranquila: esta llamada te encuentra lista."
      ],
      sombra: [
        "En {Pos} estás ignorando una llamada que dejó de sonar de tanto repetirte: una voz interior, un aviso, una opción que te pide decidir y nunca te defines. Dudas de tu valor y eso te deja atrás de tu propia vida. Esta carta te pide un sí: deja de escuchar a los demás sobre lo que puedes y escucha lo que tu corazón sabe.",
        "En {Pos} te quedaste anclada en una versión vieja de ti por miedo al qué dirán: no subes, no cambias, no te permites renacer porque alguien te conoció de otra manera. Pero tu historia recién está en su mejor capítulo. Esta carta te absuelve de la culpa vieja: levántate y demuestra el tamaño nuevo de tu vida."
      ]
    },
    "El Mundo": {
      luz: [
        "En {Pos} un ciclo llega a su cierre y el resultado te corona: lo que empezaste con dudas termina con honores, una etapa se completa y el horizonte se abre. Ya no falta nada importante: solo festeja, agradece y descansa antes del próximo giro. Cerraste bien, y ese cierre te abre la puerta grande.",
        "En {Pos} reconoces la medida de tu propio camino: has avanzado más de lo que admites y el mundo se acomoda a tu alrededor para confirmarlo. Un logro grande redondea un período de esfuerzo y te devuelve la certeza. Da el último paso con los brazos abiertos: lo que sigue ya te está esperando."
      ],
      sombra: [
        "En {Pos} quedaste a un paso de la meta y te detuviste: lo complicado ya pasó, pero el final te da vértigo y te quedas mirando. Culminar te asusta porque después qué. Esta carta te empuja con dulzura: cierra la etapa, recibe el premio que ya es tuyo y respira para el siguiente baile.",
        "En {Pos} vives con la meta tan encima que ya no la ves: cerca del final te distraes, pospones el último esfuerzo y el ciclo queda inconcluso por un detalle que no ordenas. No es cansancio, es miedo a terminar y redefinirte. Culmina hoy esa última tarea, recoge los frutos y deja que tu nueva vida tenga pista."
      ]
    },
    /* ------------------------- arcanos menores ------------------------- */
    /* --- bastos --- */
    "Dos de Bastos": {
      luz: [
        "En {Pos} las alegrías se visten de cercanía: viajes cortos, escapadas de fin de semana y charlas con amigos, vecinos o hermanos que te devuelven la sonrisa. La carta te invita a buscar la felicidad en lo inmediato y no en lo lejano, porque está tan cerca que a veces no la ves. Lo pequeño, bien atendido, es pan de cada día.",
        "En {Pos} se enciende un flirteo o la necesidad de renovar tu relación: un gesto, una salida, una complicidad que reaviva la llama. Y si andas algo decaído, esta carta te trae un mensaje de esperanza: no todo está tan triste como lo pintas. Date un regalo cercano, un paseo, una llamada, una casa con luz."
      ],
      sombra: [
        "En {Pos} corres tras horizontes lejanos y desprecias el jardín de al lado: el viaje perfecto, la vida soñada lejos, mientras lo bueno te espera en la misma esquina. La carta no te pide dejar de soñar, te pide mirar aquí: la felicidad no está lejos, está ocupada esperando tu atención.",
        "En {Pos} la cercanía justa te incomoda: te sientes invadido por las charlas, las visitas y los planes pequeños y cierras la puerta. Pero el aislamiento también es un viaje que cansa. Prueba un plan cercano, de los que no comprometen y sí acarician: la cercanía que cultivas hoy te abriga mañana."
      ]
    },
    "Tres de Bastos": {
      luz: [
        "En {Pos} el amor pierde fronteras: esta carta preciosa habla del cariño universal y de la visión espiritual que reconoce que todos somos hermanos. Quien se reconoce en ella ama profundamente a todos los seres y camina ligero porque no envidia. Deja que hoy se asome lo mejor de ti: el amor sin etiquetas también se practica.",
        "En {Pos} si la tirada es de amor, la conexión es hondísima: una relación donde incluso el cuerpo puede no tener importancia porque el vínculo va más profundo. Es de esas uniones que alimentan el alma antes que la conversación. Si estás en pareja, eleva el nivel del trato: a este se habla con la mirada."
      ],
      sombra: [
        "En {Pos} amas en teoría y te cuesta en práctica: tu discurso habla de fraternidad, pero el trato diario se queda corto con los tuyos. La carta no premia las palabras, premia la constancia de un cariño que se sostiene aunque nadie aplauda. Practica hoy el amor universal en miniatura con la primera persona que cruce tu puerta.",
        "En {Pos} el amor hondo te asusta y lo conviertes en distancia: cuando el vínculo se pone profundo, te retiras a la orilla. Tres de bastos te recuerda que la entrega no te pierde, te expande. Deja que te quieran hasta el fondo sin preparar la salida."
      ]
    },
    "Cuatro de Bastos": {
      luz: [
        "En {Pos} la alegría se instala en tu casa y en tu gente: momentos de celebración, estabilidad que se afianza y una comunidad que se reúne en torno a lo que construiste. Es el convite después de la obra: los cimientos que pusiste con esfuerzo ahora se disfrutan. Celebra a quienes te ayudaron a levantarlos.",
        "En {Pos} el refugio se convierte en festín: una reunión, un aniversario, un logro que se brinda en familia. La carta también anuncia unión y alegría compartida en el lugar que cada día te espera. Si la lectura habla de casa o de proyectos de hogar, respira: el viento sopla a favor y la puerta se abre de par en par."
      ],
      sombra: [
        "En {Pos} la fiesta ajena te encuentra trabajando en la sombra: celebras los triunfos de todos y el tuyo sigue en agenda. Pero la carta no pide más sacrificio, pide una mesa para ti. Suelta el traje de organizador y siéntate entre invitados: tu lugar está puesto desde hace rato.",
        "En {Pos} tu casa o tu círculo se siente vacío aunque haya gente: conversaciones de pendientes y mesas que no se comparten de verdad. El hogar se construye con presencia emocional, no con muebles. Enciende algo digno de festejo: ordena un rato de convivencia sincera con los tuyos."
      ]
    },
    "Seis de Bastos": {
      luz: [
        "En {Pos} la carta más pesada del mazo también es la más resolutiva: al saber que el ánimo está por los suelos, sabes exactamente sobre qué trabajar. Depresión y tristeza con nombre propio: esa claridad ya es la mitad del camino. Como quien dibuja el pozo, esta carta te da el mapa para salir de él con ayuda, compañía y movimiento.",
        "En {Pos} reconocer el bajón y nombrar su origen es el primer acto de valentía: el dinero, la pareja, la familia o la salud señalan el porqué y eso es oro. Las terapias que conectan alma y mente, la meditación y el tacto de un buen profesional son tu sendero. Remontar empieza hoy, con un paso pequeño."
      ],
      sombra: [
        "En {Pos} el ánimo se desploma y todo parece cuesta arriba: tristeza, falta de ganas y pensamientos oscuros que paralizan y vuelven cualquier futuro un promontorio. No lo atravieses sola. Esta carta no es un juicio, es una alarma que suena a tiempo: busca ayuda, cambia la colmena y planta cara a lo que pesa.",
        "En {Pos} el bajón tiene fecha marcada por las cartas que lo rodean: con oros, el dinero aprieta; con copas, la pareja o la familia duelen; con bastos, lo profesional frustra; con espadas, la salud avisa. Ninguno de esos frentes es eterno. Atiéndelo como se atiende una herida: limpiar, vendar y dar tiempo."
      ]
    },
    "Siete de Bastos": {
      luz: [
        "En {Pos} tu vida profesional se sienta a la mesa y te enseña su balance: posibilidades de ascenso, gusto por lo que haces y la entrega con que lo sostienes. Si te representa, eres persona de palabra cumplida, de las que cumplen sin aspavientos. El reconocimiento llega por ese lado, aunque tarde en pronunciarse: no aflojes el buen nombre.",
        "En {Pos} la vocación se enciende: haces lo que sabes y lo sabes hacer, y las cartas que te rodean afinan el resto, satisfacción, ganancias y la posición que mereces. Este siete premia al que trabaja con el corazón puesto. Hoy es buen día para hablar claro de tu futuro laboral o dar el siguiente paso hacia él."
      ],
      sombra: [
        "En {Pos} el trabajo se vuelve una defensa constante en vez de un camino: sientes que debes justificarte, escalar a empujones o sostener un puesto que ya no te reconoce. La carta te pide replantear: ¿sigues en esta batalla por convicción o por inercia? Define tu siguiente movimiento con la misma entrega de siempre.",
        "En {Pos} el deber te gana al placer: cumples de sobra con tus obligaciones y te das de menos en la alegría. Siete de bastos te recuerda que el trabajo también es territorio de deseo. Pide lo que vales, en tiempo, contrato o reconocimiento: tu responsabilidad no necesita castigarte."
      ]
    },
    "Ocho de Bastos": {
      luz: [
        "En {Pos} la carta de las cadenas llega para soltarte: al ponerle nombre a la dependencia, sea la pareja, la familia, un empleo sin ascenso o un mal hábito, la cadena empieza a oxidarse. Esta semana es ideal para buscar ayuda: una terapia, un pacto, un límite claro. La libertad no es un grito, es una puerta que se abre con actos pequeños.",
        "En {Pos} reconoces en ti la persona que otros controlan o las circunstancias que te mecen, y decides despertar la autoestima. El autocontrol y la confianza en ti no se piden, se entrenan. Hoy, un pequeño gesto de libertad: uno solo, pero real."
      ],
      sombra: [
        "En {Pos} la dependencia silenciosa va de ronda: ataduras enfermizas a una persona, un empleo sin salida o una relación donde uno sostiene al otro. Y si las espadas asoman cerca, cuidado con el alcohol, las drogas o las malas compañías: esa es la ruta marcada. Esta carta no juzga: llama a una mano amiga que ayude a cortar.",
        "En {Pos} le das a lo material un poder que no tiene: la aprobación, el comprar y el estatus se vuelven tu tabla. La carta pone el dedo en la llaga para que la toques: tu valor no se mide en lo que posees ni en lo que aguantas."
      ]
    },
    "Sota de Bastos": {
      luz: [
        "En {Pos} una mujer de fuego se suma a la partida: enérgica, apasionada, carismática y muy segura de sí, de temperamento que no pasa desapercibido. Puede representarte a ti mismo. Su presencia trae energía de sobra para prosperar y coraje para tus proyectos. Deja que el temperamento se convierta en carácter: es tu motor.",
        "En {Pos} se despierta en ti la emprendedora: seguridad para gastar con criterio y sabiduría para conseguir lo que quieres. En el trabajo, tu carisma abre puertas; en el amor, el fuego invita a relaciones vivas. La salud acompaña: solo vigila el exceso de temperamento, porque el fuego que te mueve también marca tu paso."
      ],
      sombra: [
        "En {Pos} la pasión se vuelve exceso: gastas de forma impulsiva y los celos de esta dama encienden el ambiente, en el amor o en el trabajo. Tu temperamento dice mucho de ti y algo te cobra caro. Baja un grado la llama: el carácter no necesita incendiar para ser escuchado.",
        "En {Pos} la seguridad ajena te eclipsa: sientes que la pasión, el carisma y la viveza están del lado del rival y tú te quedas en segunda fila. Pero la carta te representa a ti también: la misma chispa vive en ti, solo espera permiso para encenderse. No copies el brillo ajeno: enciende el tuyo."
      ]
    },
    "Rey de Bastos": {
      luz: [
        "En {Pos} se sienta a la mesa alguien de fuego y experiencia: emprendedor, enérgico, carismático, con dotes de mando y la seguridad de quien ya alcanzó metas. Puede ser de signo de fuego o una persona mayor que sabe por dónde va el camino. Acércate, aprende y recibe su palabra: la experiencia ajena es oro que se hereda en minutos.",
        "En {Pos} tu estado interior asume el trono: eres tú con tu experiencia acumulada, gobernando con energía y carisma lo que empieza. El fuego que se domina es liderazgo; el que arde solo, viento. Esta carta te invita a mandar sobre tu propio reino con la testa fría de quien ya pasó por el fuego."
      ],
      sombra: [
        "En {Pos} el fuego del mandato te quema por dentro: ambiciones no cumplidas que pesan como corona sin reino, y una salud que avisa con dolores propios de la edad si no moderas el paso. La carta no te quita tu potencia: te pide dosificar. Aprende a dejar el control en manos confiables y a descansar el imperio.",
        "En {Pos} la experiencia de otros te humilla en vez de guiarte: comparas tu avance con el de quien lleva más camino y el fuego se vuelve envidia. Pero tu trayecto es tuyo y no lleva prisa por rendir cuentas. Pregunta, absorbe y aplica sin despreciar tu propio paso: también tú inspiras."
      ]
    },
    /* --- copas --- */
    "As de Copas": {
      luz: [
        "En {Pos} el cariño encuentra su casa: la familia, el hogar o el proyecto que formas con los tuyos se llena de bienestar y aire fresco. Lo que siembras en tu nido crece con seguridad, y lo profesional acompaña con alianzas que funcionan. Déjate abrazar por lo tuyo: está todo listo para disfrutarlo.",
        "En {Pos} una promesa de hogar toma cuerpo: buenas noticias de familia, paz en la casa o la decisión que convierte tu espacio en refugio. El amor que cultivas aquí se multiplica si lo compartes. Abre la puerta, pon la mesa y deja entrar a quien te quiere ver triunfar."
      ],
      sombra: [
        "En {Pos} el calor de tu nido te queda lejano: cerca de los tuyos andas distraído o guardando el cariño para cuando creas que mereces. Pero tu hogar no exige méritos, solo presencia: vuelve a la mesa, llama a esa persona y deja que el bienestar que ya existe te sostenga.",
        "En {Pos} tiendes a olvidar que lo más sólido que tienes no se compra: tu gente y tu casa te sostienen en silencio mientras persigues lo de afuera. Devuelve la atención a lo cercano, ordena un rincón de tu vida y sentirás que el refugio siempre estuvo abierto."
      ]
    },
    "Dos de Copas": {
      luz: [
        "En {Pos} algo tuyo está a punto de nacer y lleva tu misma esencia: un hijo, una idea, una obra que sale de ti. La fecundidad de esta carta se riega con amor y se extiende a tu creatividad. Rodeada de las personas indicadas, te dice: lo que hoy concibes, crecerá hermoso.",
        "En {Pos} dos voluntades se juntan y la vida se duplica: sea una relación, un proyecto o la llegada de una criatura, hay algo que pide nacer de tu interior. Cuida el germen, protégelo un tiempo y verás cómo echa raíces. El amor que inviertes hoy es la cosecha de mañana."
      ],
      sombra: [
        "En {Pos} quieres que algo nazca pero la tierra se siente seca: quizá esperas el amor o el proyecto y lo único pendiente eres tú. No fuerces la cosecha: siembra una vez más con paciencia y deja espacio a que lo tuyo llegue. La fecundidad no se exige, se riega.",
        "En {Pos} idealizas aquello que sueñas criar: pones toda tu ilusión en una imagen de amor, de hijo o de éxito que nubla el presente. Baja del cuento y acércate a lo real: decide por el vínculo concreto, no por la película que te montaste."
      ]
    },
    "Tres de Copas": {
      luz: [
        "En {Pos} el aire se mueve: un mensaje, una llamada o una noticia nueva cruza tu camino con la fuerza de lo inesperado. No llegará de forma dramática, sino como quien abre una ventana: de repente todo se aclara un poco. Recibe con calma: las próximas horas traen novedades que cambian el tono del día.",
        "En {Pos} el futuro llama a tu puerta en forma de palabra: pronto sabrás lo que estabas esperando y, según lo que haya cerca, tocará dinero, familia o trabajo. Las palabras que llegan son más que ruido, son señales de dirección. Escúchalas dos veces antes de responder una."
      ],
      sombra: [
        "En {Pos} dejas tu ánimo en la bandeja de entrada: el día avanza torcido porque aún no llega el mensaje que te calme. Respira: la noticia viene, y lo que no llegue hoy no significa nada. Mientras esperas, no te inventes versiones: tu paz no debería depender de un timbre.",
        "En {Pos} las novedades te llegan a medias y la duda arma su casa: sobran indicios, faltan concreciones y tu cabeza junta las piezas a su manera. Antes de concluir, pregunta. Y mientras el asunto se aclara, ocúpate de lo que sí está en tus manos."
      ]
    },
    "Cinco de Copas": {
      luz: [
        "En {Pos} la vida se viste de fiesta: llegan celebraciones, reencuentros y el reconocimiento de los tuyos. Si preguntaste por un problema, respira: el desenlace te sonríe. Y si esta carta te señala a ti en la lectura, prepárate: serás el centro de la alegría y el cariño te va a nombrar.",
        "En {Pos} hay buenas razones para levantar la copa: en familia o en el trabajo, los motivos se juntan. Boda, nacimiento, logro o alegría por una compra bien cerrada: no hay premio pequeño si se comparte. La próxima temporada te invita a festejar cada paso."
      ],
      sombra: [
        "En {Pos} el festejo se te pasa al lado: la vida te ofrece una alegría y tú llegas tarde, encargada del cuidado de todos menos del tuyo. Permítete el premio: celebra lo conseguido aunque falte pulir la mesa. La fiesta también se prepara para ti.",
        "En {Pos} te saboteas la celebración mirando el lado serio de las cosas: hay motivos para el brillo y tú sigues en la sombra del vecino. Hoy no es día de recuentos, es día de aceptar que lo bueno también te pertenece. Sonríe por lo logrado: eso también es trabajo."
      ]
    },
    "Seis de Copas": {
      luz: [
        "En {Pos} el pasado viene de visita y te regala un mimo: una persona querida del ayer, un recuerdo que ablanda o la noticia de alguien que no olvidas. Vuelve a tu infancia lo que sembró ternura en ti y úsala como brújula. Lo que viviste de bueno no pasó: solo esperaba un momento como este.",
        "En {Pos} una pequeña nostalgia se vuelve regalo: guardada con cariño, se convierte en claridad y te recuerda quién fuiste antes de que el mundo te apurara. Si hay una reconciliación pendiente del pasado, esta carta la trae de vuelta. Abraza tu historia: es tu mayor tesoro."
      ],
      sombra: [
        "En {Pos} el pasado te tiene del lado de acá de la ventana: paseas por lo que ya fue y dejas lo que es esperando. La nostalgia que sana mira atrás con cariño y vuelve; la que atrapa, no suelta. Toma lo bueno de ayer y deja el resto: él no va contigo.",
        "En {Pos} idealizas los viejos tiempos y al mismo tiempo te pesan: hay heridas de entonces que regresan por la puerta de un recuerdo. No las revivas en silencio: conversa, perdona o suelta conscientemente. Vivir anclado al ayer es vivir de prestado."
      ]
    },
    "Siete de Copas": {
      luz: [
        "En {Pos} la balanza se inclina: lo que trabajaste empieza a devolverte el esfuerzo y tus deseos más hondos encuentran respuesta. Puede ser la pareja que llega, el empleo que aparece o la vitalidad que se instala. No es pura casualidad: es el resultado de lo que sembraste sin rendirte.",
        "En {Pos} tu tiempo de recoger se abre: la satisfacción que perseguías toca a tu puerta con las manos llenas. Si la lectura habla de amor, la persona adecuada se acerca; si habla de trabajo, llega el reconocimiento. Estás en un rincón del camino donde lo bueno da la cara."
      ],
      sombra: [
        "En {Pos} la plenitud te resulta sospechosa: habitúas a vivir en falta y cuando lo bueno llega, lo apartas dudando. Pero esta carta no te pide fe, te pide permiso: permítete disfrutar lo que ya es tuyo. La abundancia se asienta donde se agradece.",
        "En {Pos} confundes tener con gozar: guardas lo logrado como avaro de felicidad y la plenitud se seca en la bodega. Comparte una parte, celebra una parte y deja que el resto descanse. Lo que se disfruta se multiplica; lo que se esconde, se extingue."
      ]
    },
    "Ocho de Copas": {
      luz: [
        "En {Pos} el apoyo llega en forma de personas: un contacto, un amigo o un jefe abre una puerta justo cuando la necesitas. Como caído del cielo, das con la persona adecuada en el momento correcto. Agradece, pide y devuelve: los puentes que cruzas hoy son los caminos de mañana.",
        "En {Pos} tu entorno juega a tu favor: el consejo bueno está cerca, el médico indicado aparece y, en el amor, la pareja comparte tu vida social. Lo que buscabas no es una fórmula, es gente que suma. Rodearte mejor es la mejor estrategia de prosperidad."
      ],
      sombra: [
        "En {Pos} esperas de otros lo que dudas en dar de ti: el favor, la recomendación y la puerta abierta son el plan, y mientras tanto tu impulso se adormece. Pide ayuda sin culpa, pero sostén también tu propio paso. La buena influencia premia a quien se acerca.",
        "En {Pos} la confianza dependiente te apaga: das por sentado que solo con el apoyo de otros se avanza y te olvidas del motor propio. Cultiva tus contactos, sí, pero también tu criterio. Que nadie decida lo que tú puedes discernir."
      ]
    },
    "Nueve de Copas": {
      luz: [
        "En {Pos} se te recuerda la ley de la cosecha: todo lo que siembras, antes o después, vuelve a ti. Ayudar sin medir, querer sin condición y elegir una causa que no reparte dividendos: esa generosidad no se pierde, se multiplica. Si buscas el amor, primero darlo; si necesitas apoyo, primero sostener.",
        "En {Pos} tu altruismo se vuelve fuerza: en el trabajo, en la familia o en el amor, das sin motivación económica y eso te deja ligero. No es sacrificio: es la forma más honda de estar vivo. Sigue entregándote; la vida lleva la cuenta y paga con creces."
      ],
      sombra: [
        "En {Pos} eso de dar te sale de más y el recibir te cuesta: entregas todo y a la hora de pedir te deshaces en disculpas. La generosidad sin autocrítica se vuelve vacío. Aprende a recibir sin sentir deuda: también es amor permitir que te cuiden.",
        "En {Pos} te vuelves sombra de ti en el dar: sí a todos, sí siempre, y contigo ni una miga. Escucha pronto: quien no se llena, no sostiene. Agrega tu nombre a la lista de gente que quieres: también tú mereces el trato que regalas."
      ]
    },
    "Sota de Copas": {
      luz: [
        "En {Pos} conoces a alguien que lleva el corazón en la manga: sensible, soñadora y creativa, incapaz de imaginarse sin amor. Si la tirada no trata de personas, puede estar hablándote de ti o de una parte tuya que vuelve a ilusionarse. El arte, la medicina alternativa y las cosas hechas con cariño se asocian con ella.",
        "En {Pos} una sensibilidad despierta y pide su lugar: la creatividad que guardabas o el romance que no te permitías salen a flote. Esta carta disfruta dando y se llena de los gestos tiernos de los demás. Vuelve a imaginar en grande: tu niña soñadora tiene derechos."
      ],
      sombra: [
        "En {Pos} una persona romántica de verdad te confunde con su cuento: vives pendiente de quien te ilusiona y dejas de escuchar lo que de verdad sientes. No abandones tu corazón, pero bájale el volumen a la fantasía. Ama con ojos abiertos.",
        "En {Pos} te enamoras de la idea de amar más que de lo concreto: das por hecho gestos que no llegan y construyes romance donde hay silencio. Pide, observa y deja que el otro también se muestre. El amor correspondido no se adivina: se comprueba."
      ]
    },
    "Caballero de Copas": {
      luz: [
        "En {Pos} alguien milita por ti con devoción de leyenda: el que defiende tu causa, el que pelea por los débiles y no negocia su ideal. Si la lectura habla de amor, hay una entrega profunda donde ambos se dan al máximo. En lo laboral busca lo justo y trabaja con el corazón: un aliado noble que vale su peso en oro.",
        "En {Pos} tu propia parte soñadora se pone en marcha: la lealtad, la ternura y la lucha por lo que crees salen a cabalgar. Quien lleva esta energía no negocia valores por conveniencia. Cabalga hoy por tu bandera con la misma nobleza que él te muestra a ti."
      ],
      sombra: [
        "En {Pos} un idealismo encantador se te vuelve trampolín al vacío: persigues un amor de cuento o una causa perfecta mientras la vida real espera a la puerta. La nobleza que te gusta no pide renunciar a la tierra: pide aterrizar con elegancia.",
        "En {Pos} el que admiras cabalga tan alto que nadie le alcanza: su vida emocional es un retablo hermoso e inaccesible. Decide si quieres vida o foto: lo glosable no sustituye lo vivido. Exige que los ideales incluyan a las personas de carne y hueso."
      ]
    },
    "Rey de Copas": {
      luz: [
        "En {Pos} la sensibilidad se vuelve madurez: encuentras a alguien, o a una parte de ti, que siente profundo y sabe acompañar sin empujar. En el amor, devoción capaz de gestos locos por conservar a su gente; en el trabajo, ganas de prosperar con corazón. Tu estado mental es buena tierra para sembrar futuro.",
        "En {Pos} el ánimo marca el ritmo y hoy sopla a favor: lo que imaginas, este rey lo riega con ternura, y tu salud responde mejor cuando andas en calma. Es el momento de gobernar con cariño lo que te importa: tu reino se construye con sensibilidad firme."
      ],
      sombra: [
        "En {Pos} vives en el país de los sueños y las utopías no aterrizan: imaginas mil escenarios, pero los proyectos no cuajan porque no pisan tierra. No es falta de visión, es sobra de castillo. Elige un sueño, ponle fecha y empieza a construir: la fantasía que se decide se vuelve plan.",
        "En {Pos} el ánimo gobierna tu día: cuando estás entusiasmado todo fluye y cuando la ilusión baja, todo se detiene. Ese vaivén te desgasta y se nota en la salud y en la constancia. Da a tu sensibilidad horarios, estructura y metas chicas: la pasión sin rutina se evapora."
      ]
    },
    /* --- espadas --- */
    "Cuatro de Espadas": {
      luz: [
        "En {Pos} los golpes no caen en vacío y esta carta los frena: un bache de salud o de ánimo se acerca y tu instinto te pide bajar un cambio antes de caer. Retiro voluntario, reposo y silencio: la pausa que eliges hoy te ahorra la pausa que te impondría la fiebre. Descansar a tiempo es avanzar.",
        "En {Pos} encuentras la calma que se da en la crisis: cuida tu cuerpo como tu principal proyecto y aparta los escenarios que esperan lo peor de tu día. Salir del ruido es sanar: tu fortaleza se mide en el descanso que sabes pedir."
      ],
      sombra: [
        "En {Pos} un bache se dibuja en el horizonte de tu salud o de tu tranquilidad: dolores, intrigas, fatiga y la tentación de aislarte en silencio. No es el fin del mundo, es la señal de amarrar bien el barco. Atiéndete antes que la marea: pedir ayuda a tiempo es tu mejor estrategia.",
        "En {Pos} te gastas en resistir en vez de en cuidarte: sigues en la trinchera con el cuerpo pidiendo tregua y la mente llena de ruido ajeno. La soledad que anuncias se evita con una conversación honesta. Da al reposo el rango que merece y el bache se vuelve escala."
      ]
    },
    "Cinco de Espadas": {
      luz: [
        "En {Pos} la pelea se anuncia y tú decides el terreno: hay un disgusto grande o un enfrentamiento fuerte en camino, y puedes elegir no alimentarlo. Tu lección es salir de la trinchera con la cabeza alta y el honor intacto. Ni infamias ni ruido: quien se retira con dignidad nunca pierde la guerra.",
        "En {Pos} conviertes la amenaza en advertencia: lo que parecía favorable da señales de giro y, en vez de asustarte, reorganizas tu posición. Los malos pensamientos avisan de que, si no los corriges, te estancas. Ajusta la rosa de los vientos antes de que el viento decida por ti."
      ],
      sombra: [
        "En {Pos} la disputa viene de frente y amenaza con llevarse más de lo pactado: alguien está dispuesto a dar batalla y el riesgo de caer entre infamias y deshonor es real. No respondas desde el golpe, responde desde la estrategia. Y si hay pelea pendiente, que sea la última y la definitiva.",
        "En {Pos} tú mismo te conviertes en tu adversario: remordimientos, culpas y preocupaciones rondan tu mente y te preparan trampas. Antes de culpar afuera, salda tu parte: paga la deuda emocional que te queda y el cuerpo te deja avanzar."
      ]
    },
    "Seis de Espadas": {
      luz: [
        "En {Pos} sabes que el torbellino pasa y preparas tu salida: los conflictos vienen con fecha de caducidad si no los alimentas. Este tramo te pide menos batalla y más paciencia: cuidado con los autoengaños y con las culpas que proyectas en los tuyos. El éxito se hará esperar, pero llega: no abandones a medio río.",
        "En {Pos} tu fuerza interior navega la tormenta ajena: el camino está lleno de contratiempos y de planes que se encallan, pero tú no vas a hundirte con ellos. Dependes de terceros, sí: usa bien a las personas clave que el destino puso en tu ruta. Un poco más de agua, y se hace la bahía."
      ],
      sombra: [
        "En {Pos} la debilidad se apodera del timón: te hieren con palabras mientras hierves en silencio y culpas a los de cerca de lo que pesa en ti. Las relaciones sentimentales sufren este estado y los viajes se tuercen. Reconoce tu parte, dialoga y verás cuánto se aligera el agua.",
        "En {Pos} el autoengaño te hace navegar en círculos: repites rutinas que no sanan y esperas que otros escriban tu rumbo. La carta te llama a ordenar tu centro: menos proyección, más verdad. Cuando dejes de echarte culpas y repartirlas, el barco retoma el norte."
      ]
    },
    "Siete de Espadas": {
      luz: [
        "En {Pos} la esquina se dobla: un acontecimiento o una persona te devuelve un atisbo de confianza y te deja entrever un futuro mejor. Es un subidón que te da empuje, y esta carta te enseña a usarlo sin dejar que desordene tus decisiones. La esperanza también necesita timón: úsala para remar, no para soñar el rumbo en alta mar.",
        "En {Pos} además de la esperanza, llega algo de dinero: un ingreso inesperado, un favor que se concreta o un pequeño respiro que acomoda la mesa. Con otras cartas buenas cerca, es señal de que los tiempos mejores asoman. Esta semana alegra el paso: el ánimo sube y el bolsillo lo acompaña."
      ],
      sombra: [
        "En {Pos} la esperanza llega a ráfagas y te hunde justo después: el miedo, el egoísmo y los celos hostigan y vuelven tus relaciones conflictivas. El subidón se desinfla cuando la razón no gobierna. Esta carta no te pide que dejes de esperar: te pide esperar con los ojos abiertos.",
        "En {Pos} confundes la buena nueva con la carta de victoria: crees en el giro del destino y te olvidas de vigilar los celos ajenos y los planes propios. No abandones tu puesto por el resplandor del horizonte. Los tiempos mejores vienen para quien sigue trabajando mientras espera."
      ]
    },
    "Nueve de Espadas": {
      luz: [
        "En {Pos} la carta más cargada también es la más honesta: al reconocer tu angustia y tus miedos como reales, les quitas la oscuridad del sótano. Es la carta de la transformación: lo que hoy te desvela, bien atravesado, te entrega la energía que necesitas para el tramo que viene. Nombra el miedo, y se encoge.",
        "En {Pos} encuentras la salida que empieza en la confesión: la ansiedad que sentías por la persona amada deja de gobernarte cuando la toman en serio. Es momento de cuidar cuerpo y mente como se cuida a un herido: con tiempo, luz y ayuda. La tormenta tiene nombre y fecha: no es eterna, es atravesable."
      ],
      sombra: [
        "En {Pos} el peor escenario te visita de noche y se queda: sufrimiento real, ansiedad por lo que amas, temores con fundamento y la sensación de caminar solo. La carta no te anuncia tragedia: te anuncia que este tramo exige cuidados serios. No lo sostengas en soledad: pedir ayuda aquí es inteligencia pura.",
        "En {Pos} te enredas en peligros que asoman y en miedos que alimentas: la inseguridad, la vergüenza y la vigilia te dejan sin fuerzas para lo esencial. Cuidado con los excesos: el ocio y la intoxicación son compañías peligrosas. Tu mayor victoria hoy es dormir, pedir y soltar el control."
      ]
    },
    "Sota de Espadas": {
      luz: [
        "En {Pos} una mujer de pensamiento claro se suma a tu esquina: joven, de postura firme y mirada que ve lo que otros esconden. Es una compañera valiosísima por el apoyo que da y la claridad de sus consejos. Si en la tirada te representa a ti, te toca defender tus ideas con la misma elegancia combativa.",
        "En {Pos} la inteligencia se vuelve a tu favor: una mente resuelta que no descansa hasta ver sus proyectos encarrilados y capaz de descubrir lo oculto. En tiempos de duda, es la asesora que firmarías. Acércate a ella, o invócala en ti: la claridad decide."
      ],
      sombra: [
        "En {Pos} una figura de mirada afilada puede estar tejiendo en sombra: la misma dama que ayuda también puede urdir intrigas absurdas. No es paranoia, es brújula: observa quién se beneficia de tu desconcierto. La prudencia no es desconfianza: es una carta que se juega bien a tiempo.",
        "En {Pos} te dejas convencer por la palabra elegante y pierdes el norte: hay discursos bonitos que no resisten un buen interrogatorio. No discutas de frente con quien juega mejor: responde tarde, por escrito y con datos. Tu mejor defensa es no dar carnada."
      ]
    },
    "Caballero de Espadas": {
      luz: [
        "En {Pos} el caballero de la fortaleza monta a tu favor: valor, resistencia y defensa de causas justas, dispuesto a arriesgarse si huele injusticia. Es el aliado que encuentra salida en los momentos difíciles y el impulso que te pide afrontar la disputa con decisión, no con ruido. Con él en tu esquina, los muros tiemblan.",
        "En {Pos} se despierta tu lado firme: la misma leyenda que defiende lo justo vive en ti y hoy pide que salgas a la arena por lo tuyo. No necesitas ganar la batalla, necesitas elegir el frente. Decide hoy el conflicto que vale la pena librar y acude con la cabeza fría."
      ],
      sombra: [
        "En {Pos} el conflicto llega por escrito o de la mano de una mujer y amenaza con tumbar lo que construiste en calma. No respondas a caballo desbocado: el caballero que te visita es castigo si actúas con la misma furia. Convierte el golpe en información y la disputa en estrategia.",
        "En {Pos} revisa bien el pelotón nuevo que te rodea: alguna amistad reciente puede resultar traicionera y usar tu confianza contra ti. El caballero de la fortaleza también se hace fuerte en las trincheras ocultas. Elige con cuidado a quién le cuentas tu plan."
      ]
    },
    "Rey de Espadas": {
      luz: [
        "En {Pos} una autoridad serena se sienta a la mesa: el análisis limpio, el trato honesto y la palabra que corta las dudas de todos. Este rey te pide decidir con la cabeza y no con el ruido: ordena la información, ponla por escrito y actúa con frialdad justa. Tu criterio tiene más fuerza de la que crees.",
        "En {Pos} tu mente gobierna el día: lo complejo se vuelve manejable cuando lo partes en decisiones chicas y firmes. Esta carta premia la diplomacia y la palabra cumplida: habla claro, honra lo pactado y guarda la calma bajo presión. Esa mesura es la corona que otros notan."
      ],
      sombra: [
        "En {Pos} la relación con la justicia se te atora: te pesan acuerdos no cumplidos, promesas de papel y la sensación de que el trato fue desigual. No es el momento de cerrar los ojos: documenta, aclara y firma lo que haga falta. El orden que recuperas hoy es tu escudo.",
        "En {Pos} tu mente se vuelve tribunal duro contigo: exiges exactitud donde solo hay seres humanos y castigas tu propio error en silencio. Este rey también es humano. Aplica la ley con ti mismo: reconoce, corrige y sigue, sin más sentencia que la que te ayuda a mejorar."
      ]
    },
    /* --- oros --- */
    "As de Oros": {
      luz: [
        "En {Pos} la mejor carta del mazo te corona: éxito y felicidad en lo que tengas entre manos, y una etapa de prosperidad que abre la puerta a todo proyecto que arranques ahora. Aunque la lectura sea floja, tú acabas levantando la cabeza: tu semilla es de oro. Siembra ya: la tierra pide tu mano.",
        "En {Pos} el oro nombra tu asunto: si habla de dinero, llega la abundancia; si las copas la rodean, es amor; si hay bastos, el trabajo se enciende. La carta te dice que el resultado final es bueno, pase lo que pase en medio. Respira: la balanza ya se decidió a tu favor."
      ],
      sombra: [
        "En {Pos} te cuesta creer que lo bueno también te toca: la carta del triunfo llega y tú sigues mirando la factura en vez del premio. Esta energía no exige merecimiento, exige recepción. Abre la mano, acepta el regalo de la rueda y no lo devuelvas por costumbre.",
        "En {Pos} el billete de ida a la prosperidad duerme sin usar: sabes lo que hay que hacer, pero sigues con el pie en el freno por miedo al cambio de estatus. El oro premia al que se aproxima: un movimiento real hacia tu proyecto, tu venta o tu trato. Hazlo hoy: la etapa buena espera tu decisión."
      ]
    },
    "Dos de Oros": {
      luz: [
        "En {Pos} la rivalidad se vuelve señal, no sentencia: hay una tercera persona compitiendo por tu lugar, en lo sentimental o en los negocios, y saberlo ya es media partida. No arranques proyectos nuevos a ciegas: consolida lo tuyo antes. Alerta, no paranoia: esta carta te protege si la vigilas.",
        "En {Pos} llega un mensaje que despeja la niebla: una carta, una conversación o una noticia, buena o mala según lo que la rodee. Esperas emociones intensas y algo de agitación, pero también un ingreso que suaviza la orilla. No decidas en caliente: lo que el día deje claro, mañana se confirma."
      ],
      sombra: [
        "En {Pos} los celos encienden su casa y la envidia se sienta a la mesa: comparas, desconfías y dejas que un rival, real o imaginario, te robe el sueño. La carta te advierte, no te condena: habla, verifica y vuelve a tu centro. La agitación que sientes no es la verdad: es el síntoma.",
        "En {Pos} las cuentas se ponen difíciles: cheques, pagarés o deudas que vuelven a la mesa y te complican la vida de forma pasajera. No entres en pánico: es un tramo económico con nombre y fecha. Prepara el plan, negocia plazos y mantén la calma: esta carta no es sentencia, es señal de remo."
      ]
    },
    "Tres de Oros": {
      luz: [
        "En {Pos} la fortuna se apellida fecundidad: una idea, un proyecto o, si la lectura es de mujer, la posibilidad de un embarazo. Tus ideas tienen fuerza y están en el punto exacto para materializarse: habilidad para los negocios, reconocimiento y generosidad empujan tus planes. El momento de sembrar es este, no esperes el permiso de otros.",
        "En {Pos} lo que comenzó empieza a dar la cara: el talento que pusiste empieza a ser visto y el trabajo rinde. La carta de la concreción te invita a pulir, presentar y exprimir tu mejor jugada. La generosidad compartida multiplica el plan: no guardes el mapa solo para ti."
      ],
      sombra: [
        "En {Pos} la falta de madurez cuesta caro: actos poco meditados, frivolidad y decisiones sin pensar que complican la economía de casa. La carta no es un no, es un paren antes de firmar. Piensa dos veces, consulta a alguien con cabeza fría y reserva algo para el imprevisto.",
        "En {Pos} el éxito que esperabas llega en miniatura y te decepciona: esperabas el gol y la carta es en realidad el entrenamiento. No descartes la jugada: afina, ajusta y vuelve. La fecundidad que anuncia esta carta también necesita práctica perseverante."
      ]
    },
    "Cuatro de Oros": {
      luz: [
        "En {Pos} llega la prosperidad y el éxito profesional o de negocios: inversiones que dan resultados y beneficios excelentes. También se asoma un obsequio, un regalo o un préstamo que te da seguridad para afrontar cualquier complicación. El bienestar llama a tu puerta con las manos llenas: recibe sin culpa y agradece en voz alta.",
        "En {Pos} el tesoro de lo construido se vuelve respaldo: lo que sembraste en trabajo y dinero se convierte en la red que te sostiene. La carta premia la prudencia y la previsión, y te devuelve el control. Disfruta la seguridad sin olvidar de dónde vino tu suerte: la generosidad también se cultiva."
      ],
      sombra: [
        "En {Pos} el amor al dinero se vuelve tacañería: cuentas el cariño como se cuenta el cambio y el corazón se aprieta con los tuyos. No es avaricia por maldad, es miedo. La carta te invita a soltar un poco la mano: regalar desactiva la mezquindad que te enfría.",
        "En {Pos} se avecinan desórdenes que no quieres ver: soluciones que no llegan, líos con la ley o un trato con las autoridades que puede complicarse. Cuatro de oros invertido te pide prevenir: revisa papeles, acuerdos y cuentas antes de que hablen otros por ti."
      ]
    },
    "Cinco de Oros": {
      luz: [
        "En {Pos} un compromiso afectivo se concreta y marca un antes y un después: un vínculo de los que no se olvidan, un encuentro favorable, un lugar donde ocurre lo bueno. El karma te paga con amor: descubres en gente cercana el cariño que citabas lejos. Este cinco es una promesa con fecha de cumplimiento.",
        "En {Pos} los vínculos se celebran como se celebra una cosecha: alegría, reconocimiento y la certeza de que el amor que mueve tu vida está en buenas manos. Sea amistad, pareja o duelo superado, la carta te invita a honrar lo que te sostiene. Nombra a quien te hace bien y verás cuánto crece."
      ],
      sombra: [
        "En {Pos} el amor fuerte se tuerce como los destinos que se enredan: desavenencias, discusiones y alguna pérdida económica enturbian lo que venía bien. No es el fin de la historia, es su capítulo más serio. Si el vínculo te importa de verdad, baja las armas y conversa antes de que el daño haga raíces.",
        "En {Pos} la frivolidad y la dependencia del otro te juegan en contra: estás atado a decisiones de otra persona o a tus propios caprichos, y la balanza se desnivela. Nombra tu parte con honestidad y suelta la rienda del otro: la resolución empieza en tu propio centro."
      ]
    },
    "Seis de Oros": {
      luz: [
        "En {Pos} las dificultades se encumbran un rato y luego se disuelven solas: los obstáculos del camino financiero resultan fáciles de salvar y hasta aumentan las ganancias esperadas. Pronto se acercan acontecimientos positivos que te ablandan y te vuelven más generoso y desprendido. Este seis es un suspiro: el aprieto pasó antes de apretar.",
        "En {Pos} la generosidad que das y recibes equilibra el plato: un favor, un apoyo inesperado o una ayuda que llega justo cuando la necesitabas. La carta del reparto justo te recuerda que también es tu turno de aceptar. Te toca recibir: abre la mano y no lo conviertas en deuda."
      ],
      sombra: [
        "En {Pos} la codicia empaña la bonanza: una racha que podía ser feliz se enreda en envidias, celos y comparaciones que enturbian lo que viene. Este seis invertido te pide vigilar a tu propio envidioso antes que a los ajenos. Suelta la comparación y verás cómo la suerte vuelve a circular.",
        "En {Pos} lo poco te fastidia más que la escasez real: miras el plato del otro y sientes que el reparto fue injusto contigo. La carta te recuerda que tu pan está subiendo. Vuelve a tu proyecto, agradece lo que sí tienes y guarda el resentimiento: no se lo eches a los que vienen a apoyarte."
      ]
    },
    "Nueve de Oros": {
      luz: [
        "En {Pos} se asoman cambios en lo laboral, lo comercial y lo sentimental, y esta carta te dice por qué: problemas viejos que quedaron sin resolver vuelven para que los cierres de una vez. Es una carta positiva que augura éxitos y conquistas, aunque se tiñe de lo que la rodea. Aprovecha la energía buena para saldar lo pendiente.",
        "En {Pos} tomas la decisión que otros posponen: cero dramas viejos, cero promesas a medias. Este nueve premia al que cierra círculos y se presenta con las cuentas claras ante la vida. Los cambios que asoman son tu oportunidad: transiciona con la cabeza alta y el corazón agradecido."
      ],
      sombra: [
        "En {Pos} la incertidumbre se vuelve moneda cotidiana y los cambios que asoman te dan miedo: miedo a decidir, a cerrar, a perder lo conocido aunque ya no te sostenga. La carta no te pide certidumbres, te pide pasos. Ordena lo que depende de ti y suelta con estilo lo que ya cumplió.",
        "En {Pos} engaños, promesas que no se cumplen y una amistad querida que se pierde enturbian el panorama: el mantel se tiende con menos gente de la esperada. No es el final del banquete, es el ajuste de mesa. Guarda las promesas cumplidas, llora un momento y sigue invitando a la vida con la puerta abierta."
      ]
    }
  },

  /* consejos: para cada arcano, el mensaje accionable que deja la lectura */
  consejos: {
    "El Loco": [
      "Ábrete al comienzo que te tiembla: elige una dirección, comprométete con ella un tiempo y corrige sobre la marcha. La libertad no está en no decidir, está en atreverte a tu propia decisión. Da el primer paso hoy, sin esperar el mapa completo.",
      "Empieza en pequeño la aventura que te asusta: un día concreto, un primer gesto, una puerta que llamas. Lo nuevo no pide que saltes de un golpe, pide que camines hacia él. Tu coraje crece en el camino, no en la orilla."
    ],
    "El Mago": [
      "Muéstrate en acción: presenta la idea, di la palabra guardada, muestra lo que sabes hacer. El apoyo que necesitas llega cuando el otro puede verte en movimiento, no cuando imaginas el momento perfecto. Tu talento necesita pantalla y tú decides dársela.",
      "Usa hoy una de tus herramientas en serio: el que sabe y actúa se vuelve indispensable. Deja de guardar tus dones para una ocasión que no llega: la ocasión eres tú cada mañana."
    ],
    "La Sacerdotisa": [
      "Baja el volumen del mundo y hazle caso a esa certeza que llevas en el pecho: anota la primera impresión antes de racionalizarla. Tu radar ya leyó lo que las palabras todavía no confiesan. Una pausa de silencio hoy te regala la señal que andabas pidiendo.",
      "Confía en lo que sientes aunque no tengas pruebas: si una situación te incomoda sin explicación, es dato. Escríbelo, respétalo y actúa despacio. La intuición no sustituye la razón, la precede."
    ],
    "La Emperatriz": [
      "Vuelve a darte lo que siempre le das a otros: agenda tu cuidado, retoma la afición abandonada, nutre tu cuerpo y tu casa. Lo que cuides hoy es lo que florece mañana. Siembra una cosa con cariño y deja el resto en manos del tiempo.",
      "Da a luz esa idea o ese proyecto que llevas gestando: no necesita ser perfecto, necesita nacer. Nutre tu creatividad como quien riega un jardín y verás que lo que deseas empieza a crecer a tu medida."
    ],
    "El Emperador": [
      "Ordena un solo rincón desordenado: tus cuentas, tu agenda, tu palabra. El orden se recupera con estructura chica, no con ímpetu: define límites claros y sostenlos sin gritar. Tu autoridad se nota más en la constancia que en la fuerza.",
      "Toma el mando de tu vida con calma firme: decide tus reglas, arma tu plan y defiéndelos ante quien quiera moverlos. El verdadero poder sobre tu camino no se pide, se ejerce, en silencio y cada día."
    ],
    "El Hierofante": [
      "Busca la guía de quien ya caminó ese camino y acéptala aunque exija práctica: el maestro que te reta te ofrece un atajo de verdad. Pregunta, anota y aplica antes de discutir. Aprender de la experiencia de otro te ahorra años de prueba.",
      "Vuelve a los fundamentos de lo que llevas tiempo haciendo: la base cierta, la rutina que construye, el compromiso sin brillo. A veces el avance no está en lo nuevo, está en honrar lo aprendido."
    ],
    "Los Enamorados": [
      "Decide desde tu verdad y no desde el miedo a perder: imagina cada opción sin la presión de nadie y escucha cuál te deja más en paz. Luego habla claro: nombrar lo que sientes desata el resto. El amor se adelanta a quien se atreve.",
      "Elige con el corazón entero y sin medias tintas: esta decisión define el rumbo de tus vínculos. Cuando dudes, pregúntate cuál de las dos opciones honra más a la persona que quieres ser. Esa es tu respuesta."
    ],
    "El Carro": [
      "Elige una sola meta para la próxima temporada y quítale distracciones: define la única cosa que, lograda, cambia tu semestre. Actúa un paso cada día sin abandonar la dirección. La victoria no es del más rápido: es de quien no suelta el rumbo.",
      "Frena la dispersión y dale un solo camino a tu energía: menos planes abiertos y uno en marcha. La fuerza que pierdes repartiéndote es la misma que te llevaría lejos si la concentras en una sola cosa."
    ],
    "La Fuerza": [
      "Trátate hoy como tratarías a tu mejor amiga: suaviza el juicio, baja la exigencia y felicítate por algo concreto. La fortaleza que necesitas crece cuando dejas de guerrear contigo y empiezas a apoyarte. Respira ante la presión: ya has sobrevivido a mucho.",
      "Mantén la calma ante lo que provoca: la respuesta serena es tu mayor poder y la gente lo nota. Controla lo que sientes en vez de reprimirlo: acógelo, respíralo y decide desde ahí, sin dejarte arrastrar."
    ],
    "El Ermitaño": [
      "Regálate una pausa real antes de decidir: una caminata sola, un rato sin pantallas, un cuaderno abierto. La respuesta no está en más datos, está en el silencio que sigue al ruido. Vuelve a la conversación contigo que dejaste pendiente.",
      "Aparta la semana para ti, sin rendir cuentas: ordena tu interior antes de volver a lo exterior. Lo que descubras en ese retiro corto vale más que meses de consejos ajenos."
    ],
    "La Rueda de la Fortuna": [
      "Sube al golpe del cambio que sopla a tu favor: muévete con él en vez de esperar la señal perfecta, y suelta lo que la rueda deja atrás aunque haya sido bueno. Atrévete a girar: lo que viene está más a tu medida.",
      "Prepara el terreno para la buena racha que llega: ordena, decide y comprométete hoy, porque el destino ayuda a quien lo espera en movimiento. Cuando el viento cambie, tú ya estarás con las velas listas."
    ],
    "La Justicia": [
      "Ordena la parte que te toca de esta historia: una conversación, un acuerdo, una promesa que dejaste a medias. Escribe lo que de verdad piensas y actúa sin esconder cartas. La paz se edifica con hechos honestos y pequeños: da el primero hoy.",
      "Reparte las cargas con justicia: lo que es tuyo, asúmelo; lo que no es tuyo, devuélvelo. Una decisión ecuánime hoy te ahorra una cadena de malentendidos mañana. La balanza se inclina a tu favor cuando actúas derecho."
    ],
    "El Colgado": [
      "Detente antes de empujar: esta situación pide una pausa activa, no un golpe más de fuerza. Cambia tu punto de vista, hazte otra lectura del problema y deja que el tiempo decante. La salida que no aparece forzando, aparece mirando desde otro lado.",
      "Suelta el control sobre lo que no depende de ti y gana perspectiva: lo que hoy parece callejón sin salida es un ángulo falso. Descansa la batalla, cambia el plan y vuelve cuando el panorama se haya aclarado."
    ],
    "La Muerte": [
      "Deja partir lo que ya cumplió su tiempo: una despedida, un cierre, una etapa que solo sostienes por costumbre. Haz el duelo con ritos pequeños, agradece lo recibido y no lo revivas. La energía que recuperas del pasado es el combustible de lo nuevo.",
      "Cierra ese capítulo con gratitud y decisión: lo que termina libera el espacio de lo que nace. No necesitas entender todo para soltar: necesitas soltar para poder avanzar. Hoy es un buen día para decir adiós a tiempo."
    ],
    "La Templanza": [
      "Vuelve al punto medio en la zona que esté desbocada: horarios, esfuerzo, comida, compañía y silencio en equilibrio. La sanación no pide héroes, pide rutinas: pasos pequeños y constantes hacia el centro. Lo que hoy se equilibra sostiene lo que viene.",
      "Mezcla con calma los opuestos de tu vida: trabajo y descanso, darlo y recibirlo, aventura y raíces. Tu mejor versión no vive en los extremos: vive en la mezcla serena que decides cuidar cada día."
    ],
    "El Diablo": [
      "Nombra la cadena para desactivarla: la persona, el hábito, la culpa o el miedo que te tiene con llave. Escribe cuánto te cuesta cada mes y cuánto te devuelve. Luego corta una conexión real con un gesto concreto y celebra: la libertad se hace de cortes limpios.",
      "Suelta una atadura concreta hoy: quita el permiso, borra el contacto, cambia el plan. Lo que te ata no se rompe con debates internos, se corta con un acto físico. Hazlo y respira: la cadena era más ruidosa que pesada."
    ],
    "La Torre": [
      "Deja caer lo que ya avisa su caída: no remiendes la pared agrietada ni aplaques la verdad que pide ser dicha. El cambio dolerá menos hoy que mañana. Recoge de los escombros lo tuyo, tu valor y tu historia, y reconstruye sobre esa base firme.",
      "Confiesa la verdad incómoda y haz espacio a la tormenta: lo que se limpia con transparencia no se pudre. Derriba hoy lo que está falso en tu vida y observa cuánta luz entra cuando los muros caen."
    ],
    "La Estrella": [
      "Siembra una esperanza pequeña y concreta: un plan a seis meses, un deseo escrito, el primer paso hacia el sueño olvidado. La fe no se fabrica de golpe, se alimenta de gestos. Agradece algo real cada noche y verás crecer la luz.",
      "Recupera el hábito de pedir y de desear sin miedo: anota tu sueño, decóralo y dale fecha. La esperanza no es pasiva, es práctica: cada paso hacia lo que quieres le da la razón a la estrella."
    ],
    "La Luna": [
      "No decidas todavía por la inquietud nocturna: deja pasar un día antes de contestar, firmar o concluir. Escribe lo que te ronda, contrasta con datos y habla con alguien de confianza. La claridad llega cuando baja la marea, y la marea siempre baja.",
      "Convierte el presentimiento en pregunta concreta: en lugar de adivinar, averigua. Busca la información que te falta, pide la conversación que evade y deja que el día aclare lo que la noche engrandece."
    ],
    "El Sol": [
      "Permítete una dosis real de alegría hoy y no la conviertas en pendiente: celebra tu avance, regálate el plan o la compra que pospones, ríe con quien te suma. Tu luz no molesta, pide permiso. Guarda la prueba de lo bueno para los días grises.",
      "Brilla sin esperar a que todos te aplaudan: haz visible lo que aprendiste, estrena tu talento y celebra tu esfuerzo. El mundo recibe con gusto tu energía cuando tú la dejas salir."
    ],
    "El Juicio": [
      "Responde a la llamada que llevas aplazando: elige, confirma, preséntate, cambia. La segunda oportunidad no espera una confianza que ya tengas: se construye con el primer acto. Levántate y da el paso que la versión nueva de ti ya conoce.",
      "Suelta el juicio sobre tu pasado y responde al presente: hoy es tu día de presentarte como quien eres ahora. Deja que te conozcan de nuevo y verás cuántas puertas se abren al otro lado de la antigua versión."
    ],
    "El Mundo": [
      "Cierra el ciclo con los honores que le tocan: la última tarea, el agradecimiento, la celebración. No te quedes a medio paso de la meta por vértigo del después. Termina hoy y deja preparado el rincón donde entrará tu siguiente historia.",
      "Recoge los frutos y festéjate: lo que lograste merece reconocimiento y descanso. Concluye lo pendiente con pulcritud, agradece a quien te ayudó y date permiso de habitar tu victoria antes de arrancar la siguiente."
    ],
    /* ------------------------- arcanos menores ------------------------- */
    "Dos de Bastos": [
      "Programa un plan cercano esta semana: un paseo, una mesa con gente querida, una escapada corta. Lo bueno está más cerca de lo que tu vista busca.",
      "Regálate o regala un gesto pequeño hoy: una llamada, un favor, una invitación. La felicidad de lo inmediato se construye con estos ladrillos chicos."
    ],
    "Tres de Bastos": [
      "Practica hoy un acto de hermandad con alguien que no lo espera: sin mérito, sin recompensa, solo amor que se da. Esa es la espiritualidad que esta carta venera.",
      "Permite que una relación profundice sin huir: si el vínculo te remueve, es exactamente el punto donde crece el amor universal. Deja la orilla y nada un tramo."
    ],
    "Cuatro de Bastos": [
      "Organiza una celebración pequeña y concreta con tu gente: una mesa, un brindis, un motivo. Poner la fiesta también se aprende a propósito.",
      "Haz que tu casa respire a hogar: un rato sin pantallas, una comida compartida, una conversación que acompañe. La estabilidad se disfruta cuando se invita a entrar."
    ],
    "Seis de Bastos": [
      "Trata hoy tu ánimo como herida que se cura, no como defecto que se castiga: un paseo, una terapia, una conversación de verdad. La ayuda profesional no es para débiles: es para los que quieren volver.",
      "Pide o concreta apoyo concreto esta semana: un profesional, un grupo, un amigo que sostenga. Y nombra el porqué de tu bajón: el motivo nombrado pierde la mitad de su fuerza."
    ],
    "Siete de Bastos": [
      "Presenta tu cadena de valor esta semana: un logro, un proyecto, una conversación clara sobre tu posición. El trabajo premia a quien se muestra en movimiento.",
      "Recuerda por qué empezaste: revisa si tu labor hoy te sigue mirando igual. Si no, diseña el cambio de rumbo: la responsabilidad también se elige."
    ],
    "Ocho de Bastos": [
      "Identifica una sola atadura real y trabájala con ayuda esta semana: una conversación, un profesional, un límite concreto. La libertad se hace de cortes limpios y pequeños.",
      "Fortalece el autocontrol y la confianza: una rutina clara, un hábito que sostienes, una palabra que cumples contigo. Lo que dependía de otros vuelve a tu mano cuando te la das."
    ],
    "Sota de Bastos": [
      "Haz una inversión de fuego en ti hoy: empieza el proyecto, expón tu idea, estrena tu carisma. Tu seguridad se demuestra en actos visibles.",
      "Vigila que el temperamento no gobierne tus finanzas ni tus celos: compra con cabeza, ama con entrega y elige tus batallas. La pasión es fuerza cuando la diriges tú."
    ],
    "Rey de Bastos": [
      "Busca hoy el consejo de alguien que ya hizo ese camino y aplícalo con tu propio carácter. La experiencia ajena es el atajo que te da esta carta.",
      "Gobierna con templanza tu energía: fija metas, descansa a tiempo y deja vías de escape al control. El verdadero poder se mantiene por años, no por ratos."
    ],
    "As de Copas": [
      "Vuelve hoy a lo tuyo: llama a tu familia, pon en orden tu casa o da el primer paso del hogar o proyecto que sueñas. El bienestar se construye con presencia, no con promesas.",
      "Haz de tu casa un refugio de verdad: un gesto de cariño, un espacio arreglado, una noche sin pantallas en compañía. Tu energía empieza a ir bien cuando tu nido está cuidado."
    ],
    "Dos de Copas": [
      "Da de comer a una sola semilla: elige entre el amor, el hijo o el proyecto que sueñas y dedícale un gesto hoy. La fecundidad responde al cuidado constante, no a la emoción de un día.",
      "Mira qué lleva tiempo gestando dentro de ti y nómbralo: crear es lo mismo que amar. Si quieres hijos o una obra, riega primero tu capacidad de darte sin medida."
    ],
    "Tres de Copas": [
      "Prepárate para la noticia en vez de perseguirla: deja claro el canal por donde debe llegar y el resto fluye. Y cuando llegue, decide con calma, no golpe.",
      "Convierte la espera en señal de autonomía: lo que está por venir no define tu valor. Mientras llega, responde tan solo a lo que ya es seguro."
    ],
    "Cinco de Copas": [
      "Ponle fecha a tu reconocimiento: celebra algo concreto esta semana, en grande o en pequeño. Lo que festejas crece; lo que agradeces vuelve.",
      "Deja la preparación perfecta y llega a la mesa: brinda con quien te quiere, acepta el elogio sin rebajarlo y nota lo que el éxito sabe mejor cuando se comparte."
    ],
    "Seis de Copas": [
      "Usa un recuerdo bueno como mapa para hoy: haz algo esta semana que huela a tu alegría de siempre. El pasado es brújula, no cárcel.",
      "Suelta el recuerdo que pesa: una conversación, una carta o una despedida consciente de lo que ya fue. Honrar tu historia es agradecerla y soltar el resto a tiempo."
    ],
    "Siete de Copas": [
      "Recoge un fruto concreto de tu esfuerzo hoy: reconócete un logro, compártelo y no lo demores. La plenitud se cimenta en gratitud pequeña y diaria.",
      "Deja de vivir a medio gas: date permiso de querer y de recibir. Lo que deseas merece ser aceptado con los brazos abiertos, sin culpa."
    ],
    "Ocho de Copas": [
      "Activa tu red con generosidad: llama, ofrece ayuda, pide consejo. La buena suerte rara vez es solitaria: casi siempre viene con nombre propio.",
      "Rodéate mejor: identifica a alguien que sume y acercaos un paso esta semana. Y no olvides que las puertas se abren más fácil cuando tú también sabes abrirlas."
    ],
    "Nueve de Copas": [
      "Da de verdad hoy: un gesto, un tiempo, una escucha completa sin esperar nada. Y deja que llegado el día también te toque recibir sin dar explicaciones.",
      "Reparte tu entrega con justicia: primero tu vaso lleno, luego el de los otros. La ayuda que nace de la plenitud se sostiene; la que nace del vacío, se apaga."
    ],
    "Sota de Copas": [
      "Permite que esta semana algo dentro de ti se ilusione: un deseo, un plan tierno, una meta creativa. Y verifica con hechos que lo que te mueve también te corresponde.",
      "Cuida tu sensibilidad sin esconderla: tu capacidad de soñar es tu fuerza, no tu ingenuidad. Úsala para crear, no para herirte con la realidad de otros."
    ],
    "Caballero de Copas": [
      "Defiende hoy una causa pequeña con toda tu pasión: la lealtad se practica en las cosas mínimas antes de usarse en las grandes.",
      "No dejes que tu idealismo se convierta en excusa para huir: comprométete con una persona real y un plan concreto. Tu capacidad de amar es grande: que encuentre también donde aterrizar."
    ],
    "Rey de Copas": [
      "Convierte un sueño en plan concreto esta semana: papel, fecha y primer paso. Tus utopías necesitan tierra donde echar raíces.",
      "Regula tu ánimo con rutinas que te anclen: descanso, movimiento y una meta clara. Tu sensibilidad es tu radar, pero el timón lo llevas tú."
    ],
    "Cuatro de Espadas": [
      "Programa un alto real esta semana: horas de sueño, un chequeo, un día de silencio. Tu cuerpo no pide capricho: pide tregua, y dártela es sabiduría.",
      "No camines solo por el tramo quebrado: pide ayuda antes de derrumbarte. Atender la salud física y emocional a tiempo convierte el bache en simple ruta."
    ],
    "Cinco de Espadas": [
      "Elige con cabeza la única pelea de esta temporada y prepara bien el terreno: ni golpes por impulso ni rendiciones por miedo. Quien pelea por elección, pelea a favor.",
      "Sanciona tu mente contradictoria: cuando el pensamiento te sabotea, escríbelo y contrasta con datos. Cuida lo que te dices: también eso es campo de batalla."
    ],
    "Seis de Espadas": [
      "Ordena tu verdad interna antes de remar: anota qué es tuyo y qué no, y habla claro con quien te importa. La claridad endereza la navegación.",
      "No confundas debilidad con destino: el tramo es difícil, no eterno. Sostén el plan, rodéate de aliados y celebra cada milla: el puerto sigue ahí."
    ],
    "Siete de Espadas": [
      "Usa la esperanza que llega como combustible de un plan: fija una meta a corto plazo y dale un paso hoy. Esperar con acción es creer en serio.",
      "Vigila el ruido interior que sabotea: los celos y el miedo no son del destino, son tuyos. Acógelos, nómbralos y decide desde la razón que esta carta te devuelve."
    ],
    "Nueve de Espadas": [
      "Trata tu angustia como herida seria, no como defecto: duerme, habla con alguien de confianza y reduce el alcohol y las vigilias. El descanso es el mejor remedio inicial.",
      "Quita el poder al peor escenario poniéndolo por escrito y contrastándolo: casi nunca resiste el día. Traza un plan chico para el tramo duro: el susto baja cuando entra la luz."
    ],
    "Sota de Espadas": [
      "Rodéate de una mente valiosa esta semana y escúchala de verdad: la claridad ajena es atajo. Y devuelve el favor siendo honesto con sus puntos débiles.",
      "Ejercita tu mirada: observa, pregunta, contrasta. Tu mejor defensa en este momento es pensar antes de sentir y documentar antes de afirmar."
    ],
    "Caballero de Espadas": [
      "Pon toda tu determinación en una sola causa justa y defiéndela con datos, no con furia. El valor que se expone en orden vence a la fuerza que llega gritando.",
      "Ante la disputa que viene, actúa con decisión y sin venganza: prepara tu posición, guarda los fierros y deja que el tiempo dé la razón a quien peleó derecho."
    ],
    "Rey de Espadas": [
      "Resuelve hoy un asunto pendiente con un papel y una fecha clara: la claridad administrativa también es coraje. Tu palabra y tu estructura son tu mejor armadura.",
      "No dejes que la razón se vuelva rigidez: decide con criterio, pero con ternura. El equilibrio entre mente y corazón es la verdadera forma de gobernar tu vida."
    ],
    "As de Oros": [
      "Emprende el proyecto que llevas nombrando: esta semana dale fecha, papel y primer paso. El oro bendice al que siembra en movimiento.",
      "Comparte una parte de tu buena racha y agradécele a tu suerte: la abundancia que circula se renueva. Tu prosperidad se consolida cuando la haces circular."
    ],
    "Dos de Oros": [
      "Si algo te despierta celos o rivalidad, conviértelo en conversación honesta en vez de monólogo interno: el dato real desactiva casi todo el drama.",
      "Ordena el tema económico pendiente con un calendario y plazos claros: quitarle el misterio a la deuda es el primer paso para que deje de agobiarte."
    ],
    "Tres de Oros": [
      "Presenta tu proyecto o tu idea en su versión lista: hoy es buen día para mostrar lo que sabes. La fortuna favorece al que se expone en el momento justo.",
      "Medita bien una sola decisión antes de ejecutarla: que la madurez te cuide donde la impulsividad quiso cobrarse. Reserva un colchón para lo imprevisto y firma con calma."
    ],
    "Cuatro de Oros": [
      "Da hoy un gesto de generosidad con dinero o tiempo y observa cómo se afloja la mano: la cuenta no es tu identidad. Tu bienestar se expande cuando circula.",
      "Prevé el lío antes de que llegue: revisa un papel, un acuerdo o una cuenta con fecha larga. La seguridad se construye con prevención y no con temor."
    ],
    "Cinco de Oros": [
      "Concreta hoy un gesto de afecto con quien de verdad te sostiene: un llamado, una visita, una palabra clara. Los lazos se nutren con presencia, no con promesas.",
      "Si hay desavenencias, despliega la conversación grande: qué falta, qué sobra y qué se puede ceder. Arreglar a tiempo es la mitad del milagro."
    ],
    "Seis de Oros": [
      "Da y pide en equilibrio esta semana: ofrece ayuda desinteresada y también un sincero puedo recibir. La marea sube para quien fluye con ella.",
      "Suelta la comparación: la codicia y los celos solo nublan tu propio camino. Cuenta lo tuyo, agradece lo mínimo y deja que tu generosidad te devuelva la alegría."
    ],
    "Nueve de Oros": [
      "Cierra hoy un asunto pendiente, por pequeño que sea: una deuda de palabra, una conversación debida, un trámite olvidado. Los cambios bendicen a quien va ligero de equipaje.",
      "Toma una decisión que llevas posponiendo en lo laboral o sentimental: la inestabilidad se sana con elección, no esperando a que el escenario se aclare solo."
    ]
  },

  /* convierte la lectura en capítulos: con hasta 5 cartas, cada una es un
     episodio; con más, se agrupan de a dos para que el relato no se alargue */
  narrarGrupos(cartas, posiciones, fuerte) {
    const pares = [];
    if (cartas.length <= 5) {
      cartas.forEach((c, i) => pares.push([{ c, pos: posiciones[i] || "" }]));
    } else {
      for (let i = 0; i < cartas.length; i += 2) {
        pares.push(cartas.slice(i, i + 2).map((c, j) => ({ c, pos: posiciones[i + j] || "" })));
      }
    }
    return pares.map(g => {
      const partes = g.map(x => this.relatoDe(x.c, x.pos, fuerte || x.c.invertido ? "sombra" : "luz"));
      return {
        icono: g.map(x => x.c.emoji).join(""),
        area: g.length === 1 ? "historia" : "colaboracion",
        titulo: g.length === 1 ? `${g[0].c.nombre} · ${g[0].pos}` : this.nombrarCapitulo(g),
        cartas: g,
        regano: g.some(x => x.c.invertido),
        texto: partes.length > 1 ? partes.join(" " + this.elegirDe(this.puentes) + " ") : partes[0]
      };
    });
  },

  nombrarCapitulo(g) {
    const nombres = g.map(x => x.c.nombre).join(" y ");
    const frases = g.map(x => this.fraseDePos(x.pos));
    const unica = new Set(frases).size === 1;
    return unica ? `${nombres} · ${frases[0]}` : `${nombres} · ${frases.join(" + ")}`;
  },

  /* elige la carta protagonista del consejo: prefiere las posiciones de guía o,
     si no, la primera carta derecha de la lectura */
  cartaDeConsejo(resultado) {
    const cartas = resultado.cartas;
    const posiciones = (resultado.tirada.posiciones || []).map(p => p[0]);
    const prefer = ["Ayuda", "Resultado", "Consejo", "Tu fuerza", "Consejo del cielo", "Resultado final", "La lección", "Presente", "Presente que te sostiene"];
    const conPos = cartas.map((c, i) => ({ c, pos: posiciones[i] || "" }));
    const deGuia = conPos.filter(x => prefer.includes(x.pos));
    const derecha = conPos.find(x => !x.c.invertido);
    return (deGuia.find(x => !x.c.invertido) || deGuia[0] || derecha || conPos[0] || { c: cartas[0], pos: "" });
  },

  /* elige la carta protagonista del regaño: la primera que sale en sombra; si
     no hay sombras, la lectura fuerte usa la primera carta */
  cartaDeRegano(resultado) {
    const cartas = resultado.cartas;
    const posiciones = (resultado.tirada.posiciones || []).map(p => p[0]);
    const sombra = cartas.findIndex(c => c.invertido);
    const idx = sombra === -1 ? 0 : sombra;
    return { c: cartas[idx], pos: posiciones[idx] || "" };
  },

  /* relato de una carta en su posición real: los arcanos mayores narran desde
     la capa semántica (para cada una se compone el texto según su fase de
     lectura y el tono luz/sombra) y los menores siguen usando su corpus propio;
     sustituye {Pos} por la frase real de la posición */
  relatoDe(c, posLabel, tono) {
    if (this.semantica[c.nombre]) return this.relatoSemantico(c, posLabel, tono);
    const def = this.relatos[c.nombre];
    const frags = def ? def[tono] : null;
    const base = frags && frags.length
      ? this.elegirDe(frags)
      : ((this.esencia[c.nombre] || {})[tono] || "una carta que pide ser leída");
    return base.split("{Pos}").join(this.fraseDePos(posLabel) || "tu historia");
  },

  /* primera frase de un texto largo: se usa en la gran tirada para que cada
     arcángel suelte solo su voz central y se recorte el resto del párrafo */
  primeraFrase(texto) {
    const t = String(texto || "").trim();
    if (!t) return "";
    const m = t.match(/^.*?[.!?…]+(?=\s|$)/);
    return m ? m[0].trim() : t;
  },

  /* ----------------------- motor semántico ----------------------- */

  /* ¿esta lectura trae algún arcano mayor? */
  haySemantica(cartas) {
    return cartas.some(c => this.semantica[c.nombre]);
  },

  /* fase (función de lectura) de una carta mayor */
  faseDe(c) {
    const s = this.semantica[c.nombre];
    return s ? s.f : null;
  },

  /* fases presentes en la lectura, en orden canónico de la historia:
     inicio → decision → desafio → proceso → desenlace */
  fasesDe(cartas) {
    const orden = ["inicio", "decision", "desafio", "proceso", "desenlace"];
    const mapa = {};
    cartas.forEach(c => {
      const f = this.faseDe(c);
      if (f && !mapa[f]) mapa[f] = c;
    });
    return orden.filter(f => mapa[f]).map(f => ({ f, c: mapa[f] }));
  },

  /* clave canónica de un conjunto de cartas según el orden de los mayores */
  claveCanonica(nombres) {
    const idx = nombres.map(n => {
      const i = this.ordenMayores.indexOf(n);
      return i === -1 ? 999 : i;
    });
    return nombres.map((n, j) => ({ nombre: n, i: idx[j] }))
      .sort((a, b) => a.i - b.i)
      .map(x => x.nombre)
      .join(" + ");
  },

  /* detecta una pareja curada o una situación especial de conjunto exacto */
  buscarCombinacion(cartas) {
    const nombres = cartas.map(c => c.nombre);
    const canon = this.claveCanonica(nombres);
    const especial = this.especiales.find(e => this.claveCanonica(e.cartas) === canon) || null;
    const pares = [];
    for (let i = 0; i < nombres.length; i++) {
      for (let j = i + 1; j < nombres.length; j++) {
        const par = this.parCombinaciones.find(p =>
          (p[0] === nombres[i] && p[1] === nombres[j]) ||
          (p[0] === nombres[j] && p[1] === nombres[i]));
        if (par) pares.push(par[2]);
      }
    }
    return {
      especial: especial ? { titulo: especial.titulo, mensaje: especial.mensaje } : null,
      pares
    };
  },

  /* matiz curado que se añade a una combinación cuando hay coincidencia */
  matizCurado(cartas) {
    const c = this.buscarCombinacion(cartas);
    if (!c.especial && !c.pares.length) return "";
    const partes = [];
    if (c.especial) partes.push(`${c.especial.titulo}: ${c.especial.mensaje}`);
    if (c.pares.length) {
      const ps = c.pares.slice(0, 2).map(p => `Tus cartas también señalan ${p}`);
      partes.push(ps.length > 1
        ? ps[0] + ". Además, " + ps[1].charAt(0).toLowerCase() + ps[1].slice(1)
        : ps[0]);
    }
    return partes.join(" ");
  },

  /* combinación con matiz curado: significado en conjunto + el detalle exacto
     cuando el grupo coincide con una pareja o una situación especial */
  textoCombinacion(grupo, arc) {
    const matiz = this.matizCurado(grupo);
    const base = this.significadoConjunto(grupo, arc);
    return matiz ? `${base} ${matiz}` : base;
  },

  /* capitaliza la primera letra de una frase */
  cap(s) {
    s = String(s || "");
    return s.charAt(0).toUpperCase() + s.slice(1);
  },

  /* relato semántico de un arcano mayor en su posición: plantillas por fase,
     con desenlace según el tono (luz/sombra) de la carta */
  relatoSemantico(c, posLabel, tono) {
    const s = this.semantica[c.nombre];
    const pos = this.fraseDePos(posLabel) || "tu historia";
    const sombra = tono === "sombra" || c.invertido;
    const res = sombra ? s.resS : s.resL;
    const cl = sombra ? s.sombra : s.clave;
    const Res = this.cap(res);
    const frases = {
      inicio: sombra
        ? [`En ${pos} algo nuevo empieza torcido: ${cl}. ${Res}.`,
           `En ${pos} el impulso se descontrola: ${cl}. ${Res}.`]
        : [`En ${pos} ${s.accion}: ${cl}. ${Res}.`,
           `En ${pos} comienza ${cl}, y aquí ${s.accion}. ${Res}.`],
      decision: sombra
        ? [`En ${pos} la decisión se enreda: ${cl}. ${Res}.`,
           `En ${pos} elegir pesa: ${cl}. ${Res}.`]
        : [`En ${pos} te toca decidir con ${cl}: ${s.accion}. ${Res}.`,
           `En ${pos} la lectura se detiene en ${cl}: ${s.accion}. ${Res}.`],
      desafio: sombra
        ? [`En ${pos} la prueba se convierte en ${cl}: ${res}.`,
           `En ${pos} el desafío aprieta: ${cl}. ${Res}.`]
        : [`En ${pos} se levanta ${cl}: ${s.accion}. ${Res}.`,
           `En ${pos} hay ${cl}, y aquí ${s.accion}. ${Res}.`],
      proceso: sombra
        ? [`En ${pos} el cambio se atraganta: ${cl}. ${Res}.`,
           `En ${pos} todo se estanca: ${cl}. ${Res}.`]
        : [`En ${pos} corre ${cl}: ${s.accion}. ${Res}.`,
           `En ${pos} todo se transforma: ${cl}; ${s.accion}. ${Res}.`],
      desenlace: sombra
        ? [`En ${pos} el final se tuerce: ${cl}. ${Res}.`,
           `En ${pos} ${cl} no termina de cerrarse: ${res}.`]
        : [`En ${pos} se anuncia ${cl}: ${s.accion}. ${Res}.`,
           `En ${pos} el desenlace es ${cl}, y ${res}.`]
    };
    return this.elegirDe(frases[s.f]);
  },

  /* historia que arma el mensaje final encadenando las fases de la lectura */
  armarHistoria(fases, tenor) {
    const resDe = sem => (tenor === "sombra" ? sem.resS : sem.resL);
    if (!fases.length) return "";
    if (fases.length === 1) {
      const c = fases[0].c, sem = this.semantica[c.nombre];
      return this.elegirDe([
        `${c.nombre} preside esta lectura: ${sem.clave}. ${this.cap(sem.accion)}. ${this.cap(resDe(sem))}.`,
        `${this.cap(sem.clave)} es el corazón de lo que te traen hoy: ${sem.accion}. De tu mano, ${resDe(sem)}.`
      ]);
    }
    const slot = {
      inicio: sem => `Se abre con ${sem.clave}: ${sem.accion}.`,
      decision: sem => `${this.cap(sem.clave)} exige que pares y decidas: ${sem.accion}.`,
      desafio: sem => `${this.cap(sem.clave)} se interpone como prueba: ${sem.accion}.`,
      proceso: sem => `${this.cap(sem.clave)} mueve el terreno bajo tus pies: ${sem.accion}.`,
      desenlace: sem => `${this.cap(sem.clave)} comienza a asomar su fruto: ${sem.accion}.`
    };
    const frases = fases.map((f, i) => {
      const sem = this.semantica[f.c.nombre];
      if (i === fases.length - 1) {
        return this.elegirDe([
          `Al cierre, ${sem.clave} se impone: ${resDe(sem)}.`,
          `Y el final lo dibuja ${sem.clave}: ${resDe(sem)}.`
        ]);
      }
      return slot[f.f](sem);
    });
    return frases.join(" ");
  },

  /* mensaje final de la capa semántica, compartido por las lecturas cortas, la
     gran tirada y la pregunta: historia por fases + matiz curado + cierre que
     acompaña el tenor de la mesa */
  mensajeFinalSemantico(resultado) {
    const cartas = resultado.cartas;
    const fuerte = !!resultado.fuerte;
    const combo = this.buscarCombinacion(cartas);
    const fases = this.fasesDe(cartas);
    const sombras = cartas.filter(c => c.invertido).length;
    const tenor = (fuerte || sombras * 2 >= cartas.length) ? "sombra" : (sombras ? "mixto" : "luz");

    if (combo.especial) return `${combo.especial.titulo}: ${combo.especial.mensaje}`;

    const cuerpo = this.armarHistoria(fases, tenor)
      + (combo.pares.length
        ? " " + this.elegirDe([
            `Tus cartas, además, marcan un matiz: ${combo.pares[0]}.`,
            `Y hay un detalle que este oráculo subraya: ${combo.pares[0]}.`
          ])
        : "");

    const cierre = tenor === "luz"
      ? this.elegirDe([
          "El camino está claro y el cielo lo sostiene: entra en él sin pedir permiso.",
          "Este es un sí de tu lectura: elige el paso, dálo hoy y deja que la luz te confirme el resto."
        ])
      : (tenor === "sombra"
        ? this.elegirDe([
            "No es castigo, es un mapa: pon nombre a lo que duele y empieza a soltarlo hoy.",
            "La sombra no viene a asustarte, viene a nombrar lo que ya estás listo para cambiar."
          ])
        : this.elegirDe([
            "Tienes luz y sombra en la misma mesa: afianza lo que brilla y corrige una sola cosa de lo que pesa.",
            "Ni todo gana ni todo pierde: elige hoy el paso que haga subir el lado luminoso de tu balanza."
          ]));

    return `${this.cap(cuerpo)} ${cierre}`;
  },

/* interpretación final: la lectura se cuenta como una historia propia, un
     capítulo por cada carta (o pareja) en su posición real; el tono nace del
     sentido de cada carta y la lectura cierra con un consejo accionable y,
     cuando hay sombra real en la mesa, con un regaño dicho por quien regenta */
  interpretacionFinal(resultado) {
    const cartas = resultado.cartas;
    const total = cartas.length;
    const bien = cartas.filter(c => !c.invertido).length;
    const propor = bien / total;
    const cita = this.citas[Math.floor(Math.random() * this.citas.length)];
    const posiciones = (resultado.tirada.posiciones || []).map(p => p[0]);
    const fuerte = !!resultado.fuerte;

    /* capítulos de la historia: cada carta (o pareja) narrada en su posición */
    const finalBloques = this.narrarGrupos(cartas, posiciones, fuerte);

    /* el consejo lo deja la carta guía de la lectura */
    const consejo = this.cartaDeConsejo(resultado);
    const cc = consejo.c;
    finalBloques.push({
      icono: cc.emoji,
      area: "consejo",
      titulo: `El consejo de ${cc.nombre}${consejo.pos ? ` · ${consejo.pos}` : ""}`,
      arcangel: this.arcangelDeMensaje(resultado),
      regano: false,
      texto: this.elegirDe(this.consejos[cc.nombre] || [
        "Elige una acción concreta y hazla hoy: esa es la mejor respuesta que puede darte tu lectura."
      ])
    });

    /* el regaño aparece cuando hay sombra real en la mesa (3+ cartas) o la
       lectura viene fuerte: lo dice la primera carta en sombra, en su lugar */
    const sombras = cartas.filter(c => c.invertido);
    if (total >= 3 && (fuerte || sombras.length)) {
      const reg = this.cartaDeRegano(resultado);
      const rc = reg.c;
      const regente = this.arcangelDeMensaje(resultado);
      const sombraRelato = this.relatos[rc.nombre] ? this.relatoDe(rc, reg.pos, "sombra") : "";
      finalBloques.push({
        icono: "🔥",
        area: "regano",
        titulo: `El regaño de ${rc.nombre}${reg.pos ? ` · ${reg.pos}` : ""}`,
        arcangel: regente,
        regano: true,
        presencia: this.elegirDe([
          `${regente.nombre} no te suelta la mano, pero hoy te aprieta fuerte:`,
          `${regente.nombre} se planta frente a ti con su ${regente.regencia.toLowerCase()} en la mano:`,
          `${regente.nombre} te mira fijo y no te deja apartar la vista:`,
          `${regente.nombre} levanta la voz para que la escuches, y lo dice con amor de fuego:`
        ]),
        texto: `${sombraRelato} ${this.elegirDe(this.empujes)}`
      });
    }

    const cierrePoderoso = this.haySemantica(cartas)
      ? this.mensajeFinalSemantico(resultado)
      : (propor >= 0.5
        ? this.elegirDe([
            "Este es el final, y es un llamado a tu grandeza: deja de mirar tu vida desde afuera y entra en ella con todo. Lo que hoy es semilla se vuelve fruto, lo que hoy es herida se vuelve fuerza. Confía, actúa y deja que este mensaje te sostenga cada día.",
            "Este es el final, y es un sí del cielo: lo que has cuidado en silencio pronto será visible para todos. Los ángeles ya no solo te protegen: te acompañan. Sigue caminando con la confianza de quien no está solo y verás tu cosecha.",
            "Llévate esto de la lectura: tu momento está maduro y el cielo lo sabe. No esperes permiso para brillar ni para pedir. Actúa, agradece y avanza: cada paso iluminado que des hoy te acerca a lo que has pedido con el corazón."
          ])
        : this.elegirDe([
            "No hay más vueltas que dar: este es el despertar que pediste. Las cartas no vinieron a castigarte, vinieron a mostrarte lo que no querías ver para que al fin te liberes. Deja de posponer tu verdad, suelta lo que te pesa, perdona lo que te ata, y hoy mismo da el paso que tu corazón viene pidiéndote. Eres más fuerte que tu miedo: demuéstralo.",
            "El mensaje de hoy no te entristece: te despierta. Lo que apareció en sombra es la lista de lo que estás listo para soltar. Nada de esto fue castigo: fue puntada de amor para que dejes de sangrar. Perdona, suelta y vuelve a caminar: el cielo ya puso tu siguiente puerta.",
            "No ignores esta lectura como las anteriores: por algo llega fuerte. El cambio que evitas es pequeño frente al peso que cargas. Decide hoy una cosa, solo una, y hazla: ese primer paso desata lo demás. Estás más cerca de la salida de lo que crees."
          ]));

    finalBloques.push({ cierre: true, texto: cierrePoderoso, cita });
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
      const arc = b.arcangel;
      const texto = b.temas.map(t =>
        this.relatoDe(t.carta, t.tema, (resultado.fuerte || t.carta.invertido) ? "sombra" : "luz")
      ).join(" " + this.elegirDe(this.puentes) + " ");
      return {
        icono: arc.emoji,
        area: b.clave,
        titulo: `${this.nombreCorto(arc.nombre)} · ${arc.regencia}`,
        temas: b.temas.map(t => t.tema),
        arcangel: arc,
        regano: resultado.fuerte || tenor === "sombra",
        texto: this.primeraFrase(texto),
        cartasHtml: ""
      };
    }).concat(this.haySemantica(resultado.cartas)
      ? [{
          cierre: true,
          texto: this.mensajeFinalSemantico(resultado),
          cita
        }]
      : [{
          cierre: true,
          texto: this.elegirDe([
            "Los siete arcángeles han hablado, cada uno desde su don, y yo he escuchado cada palabra. Te voy a decir la verdad sin vueltas: no estás sola, nunca lo has estado, pero eso no quita que tengas que actuar. Lo que las cartas te mostraron hoy no es para asustarte: es para recordarte quién eres. La fuerza que buscas no está afuera, ya vive en ti. Deja el miedo, toma el consejo que más te dolió escuchar y ponlo en práctica: ese es el camino que todas las voces te señalan.",
            "Siete voces han hablado y todas dicen lo mismo de maneras distintas: tu momento es ahora y la respuesta está en tus manos. No vinieron a adivinar tu futuro, vinieron a devolverte el mando de tu presente. Agradece lo que floreció, suelta lo que terminó y camina con la certeza de que llevas la guía dentro.",
            "Cada arcángel colocó una piedra sobre tu camino, y juntas forman el puente que estabas esperando. La protección de Miguel, el amor de Chamuel, la sanación de Rafael, la voz de Gabriel, la claridad de Uriel, la liberación de Zadkiel y la luz de Jofiel ahora son tuyas. No desprecies el puente por miedo a cruzar: ya está firme. Da el paso."
          ]),
          cita
        }]);
  },

  /* ------------------- interpretación de la pregunta ---------------------
     el arcángel elegido por analizarPregunta responde solo el tema de la
     pregunta: su mensaje directo, la combinación de las tres cartas como
     respuesta y un cierre breve con su señal */
  cierrePregunta(resultado) {
    const an = resultado.__analisis;
    const arc = this.arcangeles[an.clave];
    const A = this.nombreCorto(arc.nombre);
    if (this.haySemantica(resultado.cartas)) {
      const msg = this.mensajeFinalSemantico(resultado);
      return this.elegirDe([
        `${msg} Así responde ${A}: elige una sola acción de este mensaje y ponla en práctica hoy.`,
        `${A} ha respondido con tu propia lectura: ${msg} No busques más señales: la respuesta que ya tienes es suficiente para tu siguiente paso.`
      ]);
    }
    return this.elegirDe([
      `Así responde ${A}. Las cartas son la señal que pediste: elige una sola acción de este consejo y ponla en práctica hoy.`,
      `${A} ha respondido. No busques más señales: la respuesta que ya tienes es suficiente para dar tu siguiente paso.`,
      `Llévate la voz de ${A}: deja de preguntar y empieza a caminar, la señal del oráculo ya va contigo.`
    ]);
  },

  /* consulta combinada: la pregunta toca 2+ terrenos a la vez. Cada arcángel
     responde por su área, todos comparten las cartas de la lectura */
  interpretacionCombinada(resultado) {
    const bloques = [];
    const temas = resultado.__temasPregunta || this.temasEnPregunta(resultado.pregunta);
    const cartas = resultado.cartas;
    const q = this.escapar(String(resultado.pregunta || "").trim());
    const lista = cartas.map(c => `${c.nombre}${c.invertido ? " invertida" : ""}`).join(", ");
    const titulos = temas.map(t => t.titulo.toLowerCase());

    if (!temas.length) return this.interpretacionPregunta(resultado);

    bloques.push({
      icono: "✦",
      area: "pregunta",
      titulo: "La respuesta de los arcángeles",
      arcangel: this.arcangeles[temas[0].clave],
      regano: false,
      texto: this.elegirDe([
        `Tu consulta «${q}» toca ${temas.length} terrenos de tu vida a la vez: ${titulos.join(", ")}. Por eso, no uno sino ${temas.length} arcángeles han venido a responderte, cada uno desde su área. ${lista} son las cartas que sostienen toda la consulta. Escúchalos uno por uno:`,
        `Has preguntado por ${titulos.join(", ")} en una sola pregunta, y el cielo responde igual de claro: un arcángel para cada terreno. Las cartas «${lista}» dibujan el momento completo que vives:`
      ])
    });

    temas.forEach((tema, i) => {
      const arc = this.arcangeles[tema.clave];
      const A = this.nombreCorto(arc.nombre);
      const R = arc.regencia.toLowerCase();
      const carta = cartas[i % cartas.length];
      const e = this.esencia[carta.nombre];
      const faceta = carta.invertido ? (e ? e.sombra : "una señal que pide atención") : (e ? e.luz : "una luz que te acompaña");
      const pal = (carta.palabras || []).slice(0, 2).join(" y ");
      bloques.push({
        icono: arc.emoji,
        area: tema.clave,
        titulo: `${A} · ${R} · ${tema.titulo}`,
        arcangel: arc,
        regano: carta.invertido,
        texto: this.elegirDe([
          `${A} responde por el terreno de ${tema.titulo.toLowerCase()}: ${carta.nombre}${carta.invertido ? " invertida" : ""} te muestra ${faceta}. ${carta.invertido ? "En esta área hay algo que pide tu atención antes de avanzar: revisa, corrige y no fuerces." : "La energía de esta área te respalda: cuídala con una decisión concreta y avanza sin miedo."} Las claves de esta carta, ${pal}, son tu brújula en este terreno.`,
          `En ${tema.titulo.toLowerCase()}, ${A} te dice: ${faceta} es lo que trae ${carta.nombre}${carta.invertido ? " invertida" : ""}. ${carta.invertido ? "Aquí no es momento de forzar: ordena lo pendiente y los resultados llegan solos." : "Este terreno está a tu favor: actúa con calma y constancia y verás frutos."}`
        ])
      });
    });

    if (cartas.length >= 3) bloques.push(this.bloqueCombinacionGlobal(resultado));

    const an = resultado.__analisis;
    const arc = this.arcangeles[an.clave];
    const A = this.nombreCorto(arc.nombre);
    bloques.push({
      cierre: true,
      texto: this.elegirDe([
        `${A} y los demás arcángeles han respondido juntos por ${temas.length} terrenos. No tienes que resolverlo todo el mismo día: elige UNA de las áreas que preguntaste, da tu primer paso hoy y deja que las demás florezcan en su tiempo. Las cartas ya están contigo.`,
        `Cada arcángel habló de su terreno, pero la lectura es una sola: ${lista}. Lo que se repite entre las áreas te marca la prioridad: empieza por ahí y el resto se acomoda paso a paso.`
      ]),
      cita: this.citas[Math.floor(Math.random() * this.citas.length)]
    });

    return bloques;
  },

  interpretacionPregunta(resultado) {
    const bloques = [];
    const an = resultado.__analisis;
    if (resultado.__tipoPregunta === "combinado") return this.interpretacionCombinada(resultado);
    const arc = this.arcangeles[an.clave];
    const cartas = resultado.cartas;
    const A = this.nombreCorto(arc.nombre);
    const regania = this.reganoDePregunta(resultado);
    const tipo = resultado.__tipoPregunta;
    const refNombre = tipo === "persona" ? (() => { const n = resultado.__persona || this.personaDePregunta(resultado.pregunta) || "esa persona"; return n === "esa persona" ? n : n.charAt(0).toUpperCase() + n.slice(1); })() : null;

    bloques.push({
      icono: arc.emoji,
      area: an.clave,
      titulo: refNombre ? `${A} · ${arc.regencia} · sobre ${refNombre}` : `${A} · ${arc.regencia} · ${an.titulo}`,
      arcangel: arc,
      regano: regania,
      respuestaIA: true,
      texto: this.respuestaDirecta(resultado)
    });

    if (cartas.length >= 3) bloques.push(this.bloqueCombinacionGlobal(resultado));

    bloques.push({ cierre: true, texto: this.cierrePregunta(resultado), cita: this.citas[Math.floor(Math.random() * this.citas.length)] });
    return bloques;
  },

  /* ------------------- respuesta directa a la pregunta ---------------------
     detecta si la pregunta es de sí/no, sobre una persona (por su nombre) o
     sobre una situación general, y redacta la respuesta citando la pregunta
     tal cual. Luego la IA puede pulirla y mejorarla. */
  esPreguntaSiNo(pregunta) {
    const l = this.normalizarTexto(pregunta);
    const directa = /(^|[^a-z])si o no([^a-z]|$)/.test(l) || /^si([ .?!¿]|$)/.test(l) || /^no([ .?!¿]|$)/.test(l);
    const claves = /\b(volvera|regresara|regrese|vuelve|vuelva|me ama|me amas|me quiere|me quieres|querra|pensara|debo|deberia|debiera|puedo|podria|conviene|convenga|es bueno|es malo|es cierto|es verdad|sera|seria|me ira bien|me iria bien|ira bien|saldra bien|funcionara|resultara|lograre|conseguire|aceptara|me perdonara|quiere estar conmigo|va a funcionar|voy a|terminamos|sigamos|debemos|habra|me es fiel|me engaña|es sincero|me miente|le gusto|le caigo bien|esta enamorado|esta enamorada|se siente atraido|se siente atraida)\b/.test(l);
    return directa || claves;
  },

  tipoDePregunta(pregunta) {
    const l = this.normalizarTexto(pregunta);
    const pidePersona = /\b(nombre|se llama|mi pareja|mi ex|mis ex|novio|novia|esposo|esposa|marido|mi esposo|mi marido|amigo|amiga|hermano|hermana|papa|mama|familia|esa persona|ese hombre|esa mujer|ese muchacho|esa muchacha|alguien|me engaña|me es fiel|es sincero|es sincera|me miente|le gusto|piensa en mi|le caigo bien|jefe|jefa|companero|companera|colega|vecino|vecina|socio|socia|suegra|suegro|cuñado|cuñada|que esconde|que oculta|que me oculta|que me esconde|que no me dice|que no me cuenta|que me guarda|que siente (por mi|realmente)|que piensa de mi|que opina de mi|que esta pensando|en quien piensa|esconde algo|tiene algo escondido|guarda un secreto|que intenciones tiene)\b/.test(l);

    /* temas con prioridad sobre sí/no y sobre persona */
    const esFallecido =
      /(^|[^a-z])(murio|fallecio|fallecida|fallecido|difunto)([^a-z]|$)/.test(l) ||
      /(^|[^a-z])(abuelo|abuela|papa|mama|tio|tia|hermano|hermana|esposo|esposa|novio|novia|amigo|amiga) (que )?(murio|fallecio)/.test(l) ||
      /descansa en paz/.test(l);
    const esEspiritus = /\b(espiritus|espiritu|entidad(es)?|fantasma(s)?|ser(es)? de luz|tabla ouija|medium|presencias)\b/.test(l);
    const esEnergias = /\b(energ[ií]a(s)?|aura(s)?|vibraci(ones|ón)|campo energ[ií]tico|limpia energ[ií]tica|limpieza de energ[ií]as|mala energ[ií]a|buena energ[ií]a|ambiente cargado|protecci[oó]n energ[ií]tica)\b/.test(l);
    const esSalud = /\b(salud|enfermedad|enfermo\w*|operaci[oó]n|m[ié]dico|doctor|dolor(es)?|curar|sanar|c[aá]ncer|coraz[oó]n|mareo|insomnio|cansancio|alimentaci[oó]n|respirar|sano|sana|me recupero|siento bien)\b/.test(l) || /\bembarazad\w*\b/.test(l) || /\bme siento mal\b/.test(l);
    const esConsejo = /\b(qu[eé] (hago|hacer|me aconsejas|me recomiendas|debo hacer|deber[ií]a hacer|camino tom[oó]|camino sigo|me conviene hacer)|orient[aá]me|ay[uú]dame a decidir|d[ií]me qu[eé] hacer|qu[eé] sugieres|qu[eé] consejo)\b/.test(l);

    const siNo = this.esPreguntaSiNo(pregunta);
    const persona = pidePersona || !!this.personaDePregunta(pregunta);

    if (esFallecido) return "fallecido";
    if (esEspiritus) return "espiritus";
    if (esEnergias) return "energias";
    if (this.temasEnPregunta(pregunta).filter(t => t.tema !== "futuro").length >= 2) return "combinado";
    if (esSalud) return "salud";
    if (esConsejo) return "consejo";
    if (siNo && !persona) return "si-no";
    if (persona) return "persona";
    return "situacion";
  },

  personaDePregunta(pregunta) {
    const prohibidas = new Set(["el","la","los","las","un","una","si","no","que","cuanto","donde","como","cuando","sera","seria","es","son","soy","sea","fue","puede","puedo","puedes","podria","estoy","esta","estas","voy","quiere","quiero","necesito","tengo","debo","deberia","mi","me","te","se","por","para","con","sin","lo","le","su","al","del","oraculo","tarot","amor","dinero","trabajo","salud","suerte","futuro","familia","persona","pregunta","respuesta","vuelve","vuelva","vuelvo","volvera","volveria","volvia","regresa","regresara","regresaria","regrese","pasa","pasara","hara","hare","haran","habra","habria","serian","seran","podra","podria","podre","podran","querra","querria","pensara","pensaria","sentira","estara","estaria","tendra","tendria","acabara","terminara","empezara","comenzara","llegara","seguiran","sigue","funciona","funcionara","termino","terminamos","lograre","conseguire","aceptara","pensara","dejare","puedo","debia","debamos","empezar","comenzar","significa","significado","nombre","opinion","otra","mejor","nuevo","papa","mama","mama","mama","mamita","madre","padre","abuela","abuelo","tia","tio","hija","hijo","esposa","esposo","marido","novia","novio","amiga","amigo","hermana","hermano","relacion","relaciones","vida","energia","espiritu","espiritu","casa","alma","economia","asunto","tema","situacion","empresa","negocio","proyecto","verdad","secreto","intencion","intenciones"]);
    const t = String(pregunta || "");
    const capitalizadas = t.match(/[A-ZÁÉÍÓÚÑ][a-záéíóúñ]*/g) || [];
    const nombres = capitalizadas
      .map(w => ({ w, n: this.normalizarTexto(w) }))
      .filter(x => x.n.length >= 3 && !prohibidas.has(x.n))
      .map(x => x.w);
    if (nombres.length) return nombres[0];
    const m = this.normalizarTexto(t).match(/\bsobre\s+([a-z]{3,})\b/);
    if (m && !prohibidas.has(m[1])) return m[1];
    return null;
  },

  parentescoDePregunta(pregunta) {
    const l = this.normalizarTexto(pregunta);
    const m = l.match(/\b(abuelo|abuela|papa|mama|mamita|tio|tia|hermano|hermana|hijo|hija|esposo|esposa|novio|novia|amigo|amiga)\b/);
    return m ? m[0] : null;
  },

  respuestaDirecta(resultado) {
    const an = resultado.__analisis;
    const arc = this.arcangeles[an.clave];
    const A = this.nombreCorto(arc.nombre);
    const cartas = resultado.cartas;
    const tipo = resultado.__tipoPregunta || this.tipoDePregunta(resultado.pregunta);
    const derechas = cartas.filter(c => !c.invertido).length;
    const sombras = cartas.length - derechas;
    const principal = cartas[0];
    const e = this.esencia[principal.nombre];
    const faceta = principal.invertido ? (e ? e.sombra : "una lección que te pide mirar hacia dentro") : (e ? e.luz : "un mensaje de luz y confianza");
    const lista = cartas.map(c => `${c.nombre}${c.invertido ? " invertida" : ""}`).join(", ");
    const anTema = an.titulo.toLowerCase();
    /* Ancla cada respuesta a la pregunta exacta del consultante */
    const q = String(resultado.pregunta || "").trim();
    const enmarco = q
      ? nucleo => this.capitalizarPrimera("Sobre tu pregunta \u00AB" + q + "\u00BB, " + nucleo.replace(/^\s*sobre\s+/, ""))
      : nucleo => this.capitalizarPrimera(nucleo);

    if (tipo === "fallecido") {
      const nombre = resultado.__persona || this.personaDePregunta(resultado.pregunta);
      const rel = this.parentescoDePregunta(resultado.pregunta);
      const ref = (rel ? "tu " + rel : (nombre || "esa persona"));
      let nucleo;
      if (sombras === 0) {
        nucleo = this.elegirDe([
          `${ref} se muestra en tus cartas en paz y con luz: ${lista}. ${A} te dice que no hay nada que temer por ella: el descanso es suyo, y el recuerdo que te dejó es tu fuerza. Honra lo que vivió con algo pequeño y real cuando lo sientas.`,
          `sobre ${ref}, la lectura está limpia y serena: ${lista}. ${A} confirma que encontró su paz y que la conexión que sientes no es invención: es cariño que atraviesa el velo. Queda agradecer y seguir viviendo por lo que sembró.`
        ]);
      } else if (sombras < derechas) {
        nucleo = this.elegirDe([
          `entre luz y avisos, ${ref} aparece en tu lectura: ${lista}. ${A} ve que hay algo sin cerrar entre ustedes o contigo mismo: una conversación, un perdón, una promesa. Honra ese gesto pendiente y sentirás llegar su paz a la tuya.`,
          `${ref} se dibuja con calma pero con un hilo sin cortar: ${lista}. ${A} te sugiere un ritual sencillo de memoria: una vela, una carta escrita, una visita a su lugar. Eso te devuelve el cierre que buscas.`
        ]);
      } else {
        nucleo = this.elegirDe([
          `las cartas traen a ${ref} entre penumbras, y eso no es mal augurio: ${lista}. ${A} ve que el duelo todavía se te pesa. El dolor no es traición: es amor que cambió de forma. Déjalo llorar y agradece, y la ausencia se vuelve compañía.`,
          `sobre ${ref}, tu lectura muestra el peso que guardas: ${lista}. ${A} te dice que no necesitas soltar a esa persona, solo soltar la culpa y la pena. Ella quiere verte entero: honrarla es vivir bien tu propia vida.`
        ]);
      }
      return enmarco(nucleo);
    }

    if (tipo === "espiritus") {
      let nucleo;
      if (sombras === 0) {
        nucleo = this.elegirDe([
          `la presencia que percibes te llega con luz: ${lista}. ${A} no ve amenaza en tu entorno: ve una voz que quiere comunicar algo bueno. Abre tu escucha, pero pide siempre claridad y respeto: el miedo es tuyo, la paz es de ellos.`,
          `tus cartas confirman que hay compañía espiritual cercana y es benevolente: ${lista}. ${A} te enseña a diferenciar presencias: las de luz piden escucha, no sacrificio. Saluda con respeto y no entregues tu energía a quien no la cuida.`
        ]);
      } else if (sombras < derechas) {
        nucleo = this.elegirDe([
          `hay presencia real, pero mezclada con avisos: ${lista}. ${A} percibe guía y a la vez un llamado de atención. Si sientes algo cerca, ponle nombre y límite: tú decides a quién haces caso en tu casa y en tu energía.`,
          `la lectura muestra un puente con el otro lado que aún necesita orden: ${lista}. ${A} te dice que se comunica quien tiene permiso de tu luz, y nada más. Acompaña el momento con calma y limpieza, sin miedo y sin curiosidad.`
        ]);
      } else {
        nucleo = this.elegirDe([
          `las cartas caen en sombra frente a tu pregunta espiritual: ${lista}. ${A} no te asusta: te ordena. Ese ambiente pide protección, no conversación: cierra la puerta con respeto, limpia tu espacio y tu mente, y no alimentes con miedo lo que no puedes ver.`,
          `tu lectura advierte con cartas en sombra: ${lista}. ${A} te dice que intentemos siempre la luz primero: respira hondo, enciende una vela cuando lo sientas y recupera tu centro. La claridad nunca nace del miedo.`
        ]);
      }
      return enmarco(nucleo);
    }

    if (tipo === "energias") {
      let nucleo;
      if (sombras === 0) {
        nucleo = this.elegirDe([
          `tu campo energético está claro y protegido: ${lista}. ${A} te confirma que lo que sientes alrededor es luz que trabaja a tu favor. Mantén el orden, el descanso y la gente buena cerca: tu energía se cuida sola cuando la rodeas de lo que te hace bien.`,
          `la lectura confirma buenas vibraciones en tu camino: ${lista}. ${A} ve tu copa llena. No la desbordes entregándola toda: quien camina lleno, llega. Agradece hoy lo que fluye.`
        ]);
      } else if (sombras < derechas) {
        nucleo = this.elegirDe([
          `hay energía buena, pero algo te la drena sin que lo notes: ${lista}. ${A} ve un gasto que no es tuyo: personas, lugares o costumbres que te vacían. Recupera lo que te roban de a uno: ordena tus horarios, tus lazos y tu casa, y la corriente vuelve.`,
          `tu lectura mezcla luz y avisos de energía: ${lista}. ${A} te aconseja una limpieza simple y real: abre las ventanas, ordena, pon sal en los rincones que sientas pesados y corta lazos que repiten cansancio.`
        ]);
      } else {
        nucleo = this.elegirDe([
          `tu ambiente aparece cargado en la lectura: ${lista}. ${A} te dice que la energía pesada se instala donde encuentra miedo o desorden. Prende la luz, limpia, ventila y pon límites a lo que te entra por la puerta: la carga se disuelve con tu calma.`,
          `las cartas señalan una energía densa a tu alrededor: ${lista}. ${A} no quiere que lo tomes como miedo, sino como tarea: una limpieza del espacio (orden, sal, luz, incienso) y del ánimo (descanso, música buena, lindas compañías). Vuelves a respirar.`
        ]);
      }
      return enmarco(nucleo);
    }

    if (tipo === "salud") {
      const esSiNoS = this.esPreguntaSiNo(resultado.pregunta);
      let nucleo;
      if (esSiNoS) {
        const veredicto = sombras === 0 ? "SÍ, con la energía a tu favor" : (derechas > sombras ? "sí, pero el proceso pide tiempo y cuidado" : "todavía no está de cara");
        nucleo = this.elegirDe([
          `sobre tu salud, la lectura responde ${veredicto}: ${lista}. ${A} ve tu cuerpo y tu ánimo hablando el mismo idioma: atiende hoy lo que ya sabes que te pide (descanso, chequeo, alimento) y la señal mejora con tu acción, no con tu miedo.`,
          `${lista}. Tu lectura de salud responde ${veredicto}. No es una sentencia, es un mapa: el cuerpo se acompaña, no se asusta. Da un paso concreto y humano hoy.`
        ]);
      } else if (sombras === 0) {
        nucleo = this.elegirDe([
          `tu energía vital está en buen pulso: ${lista}. ${A} te dice que tu cuerpo responde y que tu mayor aliado es tu calma. Descansa lo que pida, hidrátate, muévete y escucha las señales sin dramatizarlas: vas bien.`,
          `la lectura de tu salud está limpia: ${lista}. ${A} ve vitalidad y recuperación en marcha. No se trata de esperar milagros: se trata de sostener cada día con cuidado y gratitud.`
        ]);
      } else if (sombras < derechas) {
        nucleo = this.elegirDe([
          `hay una mejora real, pero hay algo que sigues descuidando: ${lista}. ${A} te lo señala con suavidad: el cansancio que normalizas, la revisión que pospones, el sueño que recortas. Tu cuerpo te habla: dale la cita que merece.`,
          `${lista}: tu salud avanza con luz y una sombra que te avisa. ${A} ve mejora real con algo que sigues sin atender. Ese tema que vuelve una y otra vez a tu mente es el que tu cuerpo te pide mirar primero.`
        ]);
      } else {
        nucleo = this.elegirDe([
          `tu lectura en salud pide frenar y mirar: ${lista}. ${A} no te augura, te acompaña: cuando las sombras tocan el cuerpo, la respuesta es humildad y cuidado. Consulta, descansa y deja de cargar a solas lo que tiene apoyo.`,
          `las cartas te muestran la parte de tu salud que evitas: ${lista}. ${A} te dice que el cuerpo no se persigue con miedo, se sostiene con constancia. Empieza por una cita o un descanso real: ese es el primer paso de la sanación.`
        ]);
      }
      return enmarco(nucleo);
    }

    if (tipo === "consejo") {
      let nucleo;
      if (sombras === 0) {
        nucleo = this.elegirDe([
          `tu lectura te anima a avanzar sin miedo: ${lista}. ${A} te aconseja elegir hoy una meta pequeña y real, fijar rumbo y caminar con fe: el cielo está contigo y no inventa obstáculos donde tú los ves.`,
          `el consejo del oráculo es claro: confía en el paso que ya sientes correcto. ${lista} te respaldan. ${A} te dice: decide con calma, comprométete y camina; la luz se va aclarando mientras avanzas.`
        ]);
      } else if (sombras === cartas.length) {
        nucleo = this.elegirDe([
          `antes de decidir, calla y suelta: ${lista}. ${A} te aconseja frenar el impulso y responder desde la calma, no desde el miedo. El pájaro no decide en pleno vuelo: aterriza, mira y recién entonces elige.`,
          `tu lectura pide humildad antes de dar el paso: ${lista}. ${A} te dice que no tomes decisiones grandes cuando el ánimo está nublado. Suelta lo que pesa, pide ayuda y decide con cabeza fría.`
        ]);
      } else {
        nucleo = this.elegirDe([
          `hay luz para avanzar y avisos para corregir: ${lista}. ${A} te aconseja avanzar con lo que ya funciona y ajustar solo lo que las sombras te señalan: sin cambios radicales hoy, con un paso firme cada día.`,
          `el consejo es equilibrar: sostén lo bueno y suelta lo que pesa. ${lista} te lo muestran. ${A} te acompaña a dar un paso a la vez: las decisiones más sabias no apuran, ordenan.`
        ]);
      }
      return enmarco(nucleo);
    }

    if (tipo === "si-no") {
      const nucleo = sombras === 0
        ? `la lectura te responde que SÍ, y con fuerza: ${lista} brillan del derecho y no hay carta en sombra que lo frene. ${A} ve tu asunto destrabado: si la decisión es tuya, esta es la señal para dar el paso.`
        : (derechas > sombras
          ? `la lectura es un SÍ, pero con una condición que no puedes saltarte: ${lista}. Las cartas en sombra te marcan lo que llevas sin mirar. ${A} dice que lo que pides llega cuando ajustas eso primero.`
          : (derechas === 0
            ? `la lectura te responde NO por ahora, y no es castigo: es un “aún no” del cielo. ${lista} te muestran el revés de este tiempo. ${A} te pide frenar, soltar y cambiar el rumbo: cuando lo hagas, la puerta se abre.`
            : `la lectura es un NO por ahora: ${lista}. ${A} ve que insistes donde la energía todavía no te acompaña. No es rechazo, es orden de pasos: atiende la señal y vuelve a preguntar con el corazón liviano.`));
      return enmarco(nucleo);
    }

    if (tipo === "persona") {
      const nombre = resultado.__persona || this.personaDePregunta(resultado.pregunta);
      const l = this.normalizarTexto(resultado.pregunta);
      const ref = nombre || "esa persona";
      const romantico = /\b(amor|pareja|novio|novia|esposo|esposa|marido|me ama|me amas|me quiere|me quieres|ex|regreso|regresa|vuelve|ruptura|enamor|me engaña|infiel|cortej)\b/.test(l);
      const afecto = /\b(amigo|amiga|hermano|hermana|papa|mama|familia|confi)\b/.test(l);
      const vinculo = romantico ? "con el corazón en juego" : (afecto ? "desde el lazo afectivo" : "con lazos a tu alrededor");
      const intencion = /(esconde|escondiendo|escondia|oculta|ocultando|ocultaba|no me dice|no me cuenta|me guarda|encubre|secreto|guarda algo|que siente|que piensa|que opina|esta pensando|en quien piensa|tiene algo escondido|algo oculto|algo que no sabe|algo que calla)/.test(l);

      let nucleo;
      if (intencion) {
        if (sombras === 0) {
          nucleo = this.elegirDe([
            `sobre ${ref}, las cartas no muestran secretos de peso: ${lista}. ${A} ve a ${ref} transparente contigo en lo esencial: lo que guarda no es contra ti, es simple prudencia. Confía en lo que ya te demuestra y no busques verdad donde no hay mentira.`,
            `${ref} se dibuja a la luz en tu lectura: ${lista}. ${A} ve que la duda que traes (si te oculta algo, si te esconde algo) no tiene raíz en ${ref} sino en tu propia inseguridad. No hay sombra en sus cartas: pregunta con calma y deja que el tiempo lo confirme.`
          ]);
        } else if (sombras < derechas) {
          nucleo = this.elegirDe([
            `hay algo que ${ref} todavía no te dice: ${lista}. ${A} ve una reserva que no nace de mala intención: nace del miedo o de la prudencia. No la acorrales a preguntas, acércate con confianza: lo que guarda saldrá solo cuando se sienta segura.`,
            `${lista}: la lectura sobre ${ref} mezcla luz y señales de silencio. ${A} percibe que sí hay algo que no cuenta, pero no es lo que temes: es algo que está decidiendo en voz baja. No fuerces: dale una puerta abierta y escucha cuando llegue.`
          ]);
        } else if (sombras === derechas) {
          nucleo = this.elegirDe([
            `${ref} se mantiene en equilibrio entre lo que muestra y lo que guarda: ${lista}. ${A} ve que ni te oculta una verdad clara ni está lista para abrirse: ni siquiera ${ref} misma tiene decidido cómo contártelo. Espera su propio paso, no el tuyo.`
          ]);
        } else {
          nucleo = this.elegirDe([
            `${ref} llega en sombras a tu consulta: ${lista}. ${A} te dice que sí hay algo que se calla, y tiene nombre, pero no es la amenaza que imaginas: es algo que ${ref} prefiere no mirar todavía. No es una acusación, es una señal: dale espacio, deja que la verdad respire y no intentes arrebatársela con presión.`
          ]);
        }
        return enmarco(nucleo);
      }

      if (sombras === 0) {
        nucleo = this.elegirDe([
          `${ref} aparece en tus cartas con luz clara: ${lista}. ${A} ve a ${ref} con energía afín a la tuya y confirma que lo que preguntas tiene verdad. La señal favorece el vínculo: acércate sin miedo y deja que se demuestre solo.`,
          `sobre ${ref}, tu lectura es favorable: ${lista} no tiene sombra. ${A} ve que esa persona sí forma parte de tu camino y que la respuesta que buscas se abrirá con tiempo y paciencia: ni la distancia ni la prisa la romperán.`
        ]);
      } else if (sombras < derechas) {
        nucleo = this.elegirDe([
          `${ref} se dibuja ${vinculo} con una mezcla de luz y distancia: ${lista}. ${A} ve que el lazo existe, pero hay algo importante sin decir. Háblale con honestidad: esa conversación que evitas es la que destraba todo.`,
          `tu lectura muestra a ${ref} entre señales claras y avisos: ${lista}. ${A} percibe intención, sí, pero también reservas. No adivines, pregunta; lo que calles pesará más que lo que digas.`
        ]);
      } else if (sombras === derechas) {
        nucleo = this.elegirDe([
          `${ref} llega en equilibrio exacto, mitad luz y mitad aviso: ${lista}. ${A} te dice que aún no está decidido, y que esa indecisión no es tuya: es un tiempo de espera que exige paciencia, no presión.`,
          `${ref} aparece en el centro de tu lectura: ${lista}. ${A} ve un vínculo en transición. No busques una respuesta final hoy: deja que lo que se está moviendo aclare su propia dirección.`
        ]);
      } else {
        nucleo = this.elegirDe([
          `${ref} llega a tu lectura en sombra: ${lista}. ${A} te avisa que hoy pides demasiado de quien todavía tiene lecciones y procesos propios. No lo tomes como rechazo: el tiempo ordena lo que la prisa no alcanza.`,
          `sobre ${ref}, las cartas hablan con sombras: ${lista}. ${A} ve distancia o un bache que no depende de ti. Suelta la presión, recupera tu centro y deja que la verdad se muestre sin forzarla.`
        ]);
      }

      if (this.esPreguntaSiNo(resultado.pregunta)) {
        const veredicto = sombras === 0 ? "SÍ, sin condiciones" : (sombras < derechas ? "SÍ, con una condición" : "NO por ahora");
        nucleo = `La respuesta es ${veredicto}: ${nucleo}`;
      }
      return enmarco(nucleo);
    }

    const nucleo = this.elegirDe([
      `${principal.nombre} ${principal.invertido ? "está de cabeza y te pide frenar" : "brilla del derecho"} y anuncia ${faceta}. En el contexto de ${anTema}, ${lista} dibujan tu momento. ${A} te guía: mira las señales repetidas, porque tu respuesta no llega por una sola puerta.`,
      `${principal.nombre} ${principal.invertido ? "te pide voltear la mirada" : "se pone de tu lado"} con su mensaje: ${faceta}. ${A} lo confirma en ${anTema}: lo que preguntas ya está en movimiento y ${lista} te marcan hacia dónde fijarte.`
    ]);
    return enmarco(nucleo);
  },

  /* pide a la IA del servidor la respuesta afinada a la pregunta (si la hay).
     Envía el análisis local (tema, clave, tipo, persona) para que el servidor
     lo combine con su propio motor NLP y construya una respuesta más precisa.
     Devuelve null cuando no hay IA disponible y se conserva la determinista. */
  async pedirReflexionIA(resultado) {
    const an = resultado.__analisis;
    const tipo = resultado.__tipoPregunta || this.tipoDePregunta(resultado.pregunta);
    const persona = tipo === "persona" ? (resultado.__persona || this.personaDePregunta(resultado.pregunta) || "") : "";
    const cartas = (resultado.cartas || []).map((c, i) => ({
      nombre: c.nombre,
      invertido: !!c.invertido,
      posicion: (resultado.tirada.posiciones[i] || [])[0] || "",
      significado: (c.texto || "").slice(0, 200)
    }));
    try {
      const data = await fetchJSON("/api/ia/pregunta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pregunta: resultado.pregunta,
          tema: an.titulo,
          temaClave: resultado.__temaClaveNLP || an.clave,
          tipo,
          persona,
          cartas
        })
      });
      if (data && data.ok && data.respuesta) return data.respuesta;
    } catch (e) { /* sin IA, se mantiene la determinista */ }
    return null;
  },

  /* si las cartas salen de cabeza, el arcángel acompaña su respuesta con un
     regaño breve y cercano */
  reganoDePregunta(resultado) {
    const inv = resultado.cartas.filter(c => c.invertido).length;
    if (inv === 0) return false;
    const an = resultado.__analisis;
    const arc = this.arcangeles[an.clave];
    const A = this.nombreCorto(arc.nombre);
    return inv === resultado.cartas.length
      ? this.elegirDe([
          `Todas mis cartas están de cabeza, y eso no es un no: es un aviso del cielo. ${A} te dice que estás yendo contra tu propia luz en este tema. Baja la prisa, reconoce el patrón y rectificalo: en ese gesto la suerte da la vuelta.`,
          `${A} te habla fuerte porque te quiere claro: ninguna carta te da la razón en este momento, y eso se llama tiempo de corregir, no de rendirse. Calla el miedo, escucha lo que ya sabes y cambia la jugada.`
        ])
      : this.elegirDe([
          `${A} nota que una de tus cartas va de cabeza: hay algo de este tema que evitas mirar. Acepta esa parte y la respuesta del oráculo se vuelve completa.`,
          `Una carta se te dio vuelta en la mesa. ${A} la ves como un espejo: no está ahí para asustarte, está para que no repitas el mismo tropiezo otra vez.`
        ]);
  },

  /* la combinación de las cartas de cada arcángel: normal (luz), espejada
     (mezcla de derecha e invertida) o en sombra; cada arcángel combina las
     cartas de SUS áreas, muestra sus imágenes y entrega el significado en
     conjunto con sus propias palabras */
  combinacionDe(bloque) {
    const inv = bloque.temas.filter(t => t.carta.invertido).length;
    const tipo = inv === 0 ? "luz" : (bloque.temas.length === inv ? "sombra" : "mixto");
    const arc = bloque.arcangel;
    const grupo = bloque.temas.map(t => t.carta);
    const cartas = grupo.map(c => ({ nombre: c.nombre, img: c.img, emoji: c.emoji, invertido: c.invertido, palabras: c.palabras }));
    const texto = this.textoCombinacion(grupo, arc);
    return {
      tipo: tipo === "mixto" ? "espejada" : tipo,
      texto,
      cartas,
      consejo: this.consejoDeCombinacion(grupo, arc),
      regano: this.reganoDeCombinacion(grupo, arc)
    };
  },

  /* combinación de cartas ENFOCADA en la pregunta exacta (solo "Pregunta al
     Oráculo"): cita la consulta y las cartas se unen para responderle a ella */
  combinacionDePregunta(resultado) {
    const arc = this.arcangelDeMensaje(resultado);
    const A = this.nombreCorto(arc.nombre);
    const q = this.escapar(String(resultado.pregunta || "").trim());
    const grupo = this.elegirGrupoCombinacion(resultado.cartas);
    const cartas = grupo.map(c => ({ nombre: c.nombre, img: c.img, emoji: c.emoji, invertido: c.invertido, palabras: c.palabras }));
    const inv = grupo.filter(c => c.invertido).length;
    const total = grupo.length;
    const tipo = inv === 0 ? "normal" : (inv === total ? "sombra" : "espejada");
    const derechas = grupo.filter(c => !c.invertido);
    const invertidas = grupo.filter(c => c.invertido);
    const facetaDe = c => {
      const e = this.esencia[c.nombre];
      return c.invertido ? (e ? e.sombra : "un aviso en sombra") : (e ? e.luz : "un mensaje de luz");
    };
    const encadenar = arr => arr
      .map((c, i) => (i === 0 ? facetaDe(c).charAt(0).toUpperCase() + facetaDe(c).slice(1) : facetaDe(c)))
      .join(", se enlaza con ");

    const tipoPre = resultado.__tipoPregunta || this.tipoDePregunta(resultado.pregunta);
    const esSiNo = tipoPre === "si-no";
    let ref = null;
    if (tipoPre === "persona") {
      const nombre = resultado.__persona || this.personaDePregunta(resultado.pregunta);
      if (nombre) ref = nombre.charAt(0).toUpperCase() + nombre.slice(1);
      else {
        const n = this.normalizarTexto(resultado.pregunta);
        const rol = n.match(/\b(?:mi )?(ex|pareja|novio[^s]?|novia|esposo|esposa|marido|amigo|amiga|hermano|hermana|papa|mama|socio|socia|suegra|suegro|jefe|jefa|companero|companera|cuñado|cuñada)\b/);
        ref = rol ? "tu " + rol[1] : "esa persona";
      }
    }
    const sobre = ref ? `Preguntas por ${ref}: «${q}». ` : (esSiNo ? "" : `Sobre «${q}», `);

    let texto;
    if (tipo === "normal") {
      texto = this.elegirDe([
        `${sobre}${A} une estas cartas para responderte: ${encadenar(derechas)}. Cuando todas las luces se tocan, tu consulta no se queda en consejo: ya viene en movimiento y a tu favor. ${A} ve el terreno listo y te pide una sola cosa: no frenarlo con la duda de «será que sí». Lo que llega, llega porque algo tuyo ya venía haciendo fuerza.`,
        `${sobre}la combinación te responde: ${encadenar(derechas)}. No es azar que estas luces se dieran cita frente a tu pregunta: el cielo te está afirmando el camino que ya elegiste. ${A} te confirma que la señal no pide más pruebas, pide tu constancia: la suerte le sonríe a quien sigue caminando.`
      ]);
    } else if (tipo === "sombra") {
      texto = this.elegirDe([
        `${sobre}las cartas se pliegan juntas y dicen una sola cosa: ${encadenar(invertidas)}. No es castigo, ${A} te lo aclara: es el mapa que faltaba. Antes de que esto se resuelva, hay algo tuyo que corregir, y estas sombras te lo nombran con exactitud para que no tengas que adivinar. La pregunta se destraba cuando cambias algo adentro, no afuera.`,
        `${sobre}la consulta se responde con todas las cartas en sombra: ${encadenar(invertidas)}. ${A} ve que insistes donde la energía todavía no está lista: no es un no del cielo, es un alto para que cambies de método, no de meta. Frenar a tiempo también es avanzar: esta pausa decide el resto del camino.`
      ]);
    } else {
      texto = this.elegirDe([
        `${sobre}${A} combina dos voces: ${encadenar(derechas)}; y en paralelo, ${encadenar(invertidas)}. Tu respuesta no vive en una sola de esas voces, vive en el silencio entre las dos: una te muestra el rumbo y la otra el nudo que hasta hoy lo frena. ${A} te pide sostener las dos sin taparte los ojos: solo así la señal se vuelve decisión.`,
        `${sobre}la combinación mezcla señal y aviso: ${encadenar(derechas)}; mientras tanto, ${encadenar(invertidas)}. Una lectura así no te regala una respuesta fácil: te entrega el mapa real, con su camino y sus baches. ${A} te dice que el aviso no viene a asustarte, viene a evitar que tropieces dos veces en lo mismo.`
      ]);
    }

    if (sobre.endsWith(". ")) texto = texto.charAt(0).toUpperCase() + texto.slice(1);

    if (esSiNo) {
      const sombrasTot = resultado.cartas.filter(c => c.invertido).length;
      const veredicto = sombrasTot === 0
        ? "un SÍ claro"
        : (resultado.cartas.length - sombrasTot > sombrasTot
          ? "un SÍ con condición"
          : (sombrasTot === resultado.cartas.length ? "un NO por ahora" : "un NO provisional"));
      texto = `La combinación de tus cartas responde a «${q}» con ${veredicto}: ${texto}`;
    }

    const matiz = this.matizCurado(resultado.cartas);
    if (matiz) texto += " " + this.elegirDe([
      `Sobre esto, tus cartas traen un dato adicional: ${matiz}`,
      `Además, ${matiz}`
    ]);

    let consejo = tipo === "normal"
      ? this.elegirDe([
          `Da el paso que ya sientes correcto y no pidas más señales: esta lectura acaba de darte la que buscabas, y volver a preguntar sería desconfiar de lo que ya tienes. Hoy, con calma, actúala: un gesto pequeño y real vale más que mil confirmaciones.`,
          `Actúa hoy una cosa pequeña y concreta en la dirección que estas cartas señalan. La luz no espera a que estés seguro: se confirma mientras caminas. Elige una sola acción, hazla, y deja que el resto se alinee solo detrás de ella.`
        ])
      : (tipo === "sombra"
          ? this.elegirDe([
              `Frena antes de insistir: suelta la forma que venías usando, descansa y vuelve a preguntar con el corazón liviano. La sombra no te pide rendirte, te pide rendir la manera: si repites el mismo intento, la misma conversación, el mismo río, el resultado no puede cambiar. Cambia una sola conducta y todo lo demás empieza a moverse.`,
              `No dejes que el miedo decida por ti: la sombra te pide un cambio concreto, no una retirada. Encuentra la única cosa que repites sin darte cuenta y córtala hoy mismo: con un solo cambio real, todo lo que estaba frenado se destraba solo.`
            ])
          : this.elegirDe([
              `Quédate con lo que ya funciona y corrige UNA sola cosa de las que la sombra señala. No hace falta rehacer el rumbo: las grandes vueltas nacen de un solo paso bien dado. Ese paso es hoy: cada día que le regalas a la duda, la duda gana un partido.`,
              `Confirma lo que avanza y suelta lo que pesa, en ese orden: primero afianza lo que te sostiene y después deja ir lo que te detiene, para que la soltura no te desarme. Hazlo como un acto y no como una idea: una cosa soltada hoy vale más que mil pensadas.`
            ]));

    let regano = tipo === "normal"
      ? this.elegirDe([
          `No conviertas la claridad de estas cartas en una excusa más para esperar. ${A} te conoce: cuando todo brilla, dudas de que sea real y pospones. La respuesta es clara y favorable; lo único que falta es que tú la cumplas hoy, no mañana.`,
          `Deja de pedir otra vez lo que ya te respondieron. Esta lectura está limpia, y repetir la consulta solo disfraza la duda que aún no quieres nombrar. Escucha, decide y camina: el cielo ya cumplió su parte, ahora es la tuya.`
        ])
      : (tipo === "sombra"
          ? this.elegirDe([
              `Llevas la respuesta delante y no la quieres ver, y por eso preguntas otra vez. ${A} te regaña sin crueldad: estas cartas te señalan la tarea con claridad; hazla antes de volver. Preguntar sin actuar no es consultar, es escaparte.`,
              `La pregunta que repites no se cansa: la sombra sigue ahí, esperando tu cambio, no tu miedo. ${A} te avisa que este patrón no se rompe con otra lectura, se rompe con otra conducta. Hoy, una distinta.`
            ])
          : this.elegirDe([
              `No te quedes con la mitad que te gusta de la respuesta: la sombra de estas cartas también te habla, y esa parte también es tuya. Ignorarla no la borra, la agranda. Mírala hoy con honestidad y deja de escaparte de tu propia lectura.`,
              `¿Cuántas veces más vas a preguntar lo mismo esperando que el cielo te responda distinto? ${A} te habla sin rodeos: esta mezcla ya respondió. No te faltan señales, te falta la única decisión que la sombra te viene pidiendo. Hazla y vuelve.`
            ]));

    return { tipo, texto, cartas, consejo, regano, enfocada: true };
  },

  /* bloque de combinación global de las lecturas cortas (1, 3, 5, 10 cartas):
     el arcángel regente resume cómo se combina toda la lectura mostrando las
     cartas protagonistas (2 o más del mismo contexto si las hay) con su
     significado en conjunto */
  bloqueCombinacionGlobal(resultado) {
    const total = resultado.cartas.length;
    const inv = resultado.cartas.filter(c => c.invertido).length;
    const arc = this.arcangelDeMensaje(resultado);

    let tipo;
    if (inv === 0) tipo = "normal";
    else if (inv === total) tipo = "sombra";
    else tipo = "espejada";

    const grupo = this.elegirGrupoCombinacion(resultado.cartas);
    const cartas = grupo.map(c => ({ nombre: c.nombre, img: c.img, emoji: c.emoji, invertido: c.invertido, palabras: c.palabras }));
    return {
      icono: "🔗",
      area: "combinacion",
      titulo: "La combinación de tus cartas",
      arcangel: arc,
      regano: tipo === "sombra",
      presencia: "",
      combinacion: resultado.pregunta
        ? this.combinacionDePregunta(resultado)
        : {
            tipo,
            texto: this.textoCombinacion(grupo, arc),
            cartas,
            consejo: this.consejoDeCombinacion(grupo, arc),
            regano: this.reganoDeCombinacion(grupo, arc)
          },
      texto: ""
    };
  },

  /* una línea por área, con la personalidad del arcángel al frente */
  fraseArea(arcangel, area) {
    const f = this.fraseArcangel(arcangel);
    return this.elegirDe(Array.isArray(f[area]) ? f[area] : [f[area]]);
  },

  fraseArcangel(a) {
    const A = a.nombre;
    const C = a.consejo || "";
    return {
      economia: [
        `${A} cuida tu dinero: la abundancia no viene por suerte, viene por orden y por decisiones. Mira tus cuentas, guarda con calma y deja espacio para lo bueno que viene a ti. ${C}`,
        `${A} enciende su luz en tu economía y te muestra el camino del flujo: lo que hoy ordenas, mañana se multiplica. Abre espacio para lo que abunda, desde su ${a.regencia.toLowerCase()}. ${C}`
      ],
      amor: [
        `${A} sostiene tu corazón: su luz de ${a.regencia.toLowerCase()} cuida tus vínculos para que el amor llegue, sane o se libere, justo como lo necesitas. ${C}`,
        `${A} envuelve tu vida afectiva con su luz: el amor verdadero no ruega, elige. Abre el corazón sin miedo y deja que lo justo te encuentre. ${C}`
      ],
      situacion: [
        `${A} aclara lo que te rodea y te muestra lo que de verdad importa, para que decidas con calma y sin miedo. Desde su ${a.regencia.toLowerCase()}, te dice: no estás sola. ${C}`,
        `${A} toma tu mano y mira tu camino desde lo alto: lo que ves no es una amenaza, es un mapa. Camina con él y no temas. ${C}`
      ],
      bloqueo: [
        `${A} ilumina lo que te ata: esas cadenas invisibles se sueltan una a una con su luz. Nada puede retenerte mientras él te acompaña. ${C}`,
        `${A} desata contigo los nudos que otros dejaron: su ${a.regencia.toLowerCase()} no juzga, libera. Suelta hoy una sola carga y mira cuánto se aligera tu camino. ${C}`
      ],
      trabajo: [
        `${A} orienta tu trabajo y despeja el sendero hacia la meta que persigues. Con su ${a.regencia.toLowerCase()}, te muestra qué paso dar hoy para abrir el camino del mañana. ${C}`,
        `${A} une tu vocación con tus dones: el trabajo que te abre puertas viene de la constancia que empiezas hoy, no de la suerte. ${C}`
      ],
      futuro: [
        `${A} te muestra el mapa de lo que viene: lo que se acerca está alineado con lo tuyo, si caminas con fe y decisión. Desde su ${a.regencia.toLowerCase()}, te lo asegura. ${C}`,
        `${A} levanta el telón de lo que se acerca: el futuro que sueñas ya te está esperando en el paso que decides dar hoy. ${C}`
      ],
      cierre: [
        `${A} sella esta lectura con su presencia. No estás sola: hay un arcángel tomando tu mano para guiarte. Confía, actúa y deja que su luz te lleve. ${C}`,
        `${A} cierra este encuentro contigo y te recuerda: la lectura no termina aquí, sigue en cada decisión que tomes desde hoy. Su luz ya va contigo. ${C}`
      ],
      miguel: [
        `${A} toma la palabra en tu nombre: con su ${a.regencia.toLowerCase()}, te protege y te da valor para sostener tu lugar en cada parte de tu vida. ${C}`,
        `${A} se planta a tu lado con el escudo en alto: su ${a.regencia.toLowerCase()} te respalda para que defiendas tu lugar sin temblar. Van juntos en esta batalla. ${C}`
      ],
      gabriel: [
        `${A} trae luz a lo que debes escuchar: su ${a.regencia.toLowerCase()} limpia tu mente y te señala el mensaje que necesitas. Presta atención a lo que se repite. ${C}`,
        `${A} acerca a tu oído la palabra que esperabas: su ${a.regencia.toLowerCase()} ordena tus pensamientos y hace audible lo que el cielo te quiere decir. ${C}`
      ],
      rafael: [
        `${A} extiende su mano para sanar estos asuntos: su ${a.regencia.toLowerCase()} te devuelve el equilibrio y la calma para seguir. ${C}`,
        `${A} cuida con su luz cada parte de tu vida: donde hay herida, pone bálsamo; donde hay duda, pone rumbo. Déjate acompañar. ${C}`
      ],
      uriel: [
        `${A} enciende su antorcha de ${a.regencia.toLowerCase()} en estas áreas: mira con el corazón, porque la respuesta que buscas está más cerca de lo que crees. ${C}`,
        `${A} ilumina el rincón que dejaste en penumbra: su ${a.regencia.toLowerCase()} te da la claridad para decidir sin arrepentirte después. ${C}`
      ],
      zadkiel: [
        `${A} desata las cadenas que se ocultan aquí: su ${a.regencia.toLowerCase()} te libera de lo que ya cumplió su tiempo. ${C}`,
        `${A} toma las esposas invisibles de tu camino: con su ${a.regencia.toLowerCase()}, tu carga se vuelve libertad. Suelta y respira. ${C}`
      ],
      jofiel: [
        `${A} ilumina estos senderos con su ${a.regencia.toLowerCase()}: busca la belleza y la inspiración, y ellas te guiarán. ${C}`,
        `${A} pinta tu horizonte con colores nuevos: su ${a.regencia.toLowerCase()} vuelve a encender la chispa que se había apagado. Déjate inspirar. ${C}`
      ],
      chamuel: [
        `${A} envuelve estos asuntos con la luz rosa de su ${a.regencia.toLowerCase()}: el amor llega, se sana o se libera, según lo que tu corazón necesita. ${C}`,
        `${A} siembra paz sobre tus lazos: su ${a.regencia.toLowerCase()} arregla lo que está roto y te enseña a recibir sin miedo el cariño que se ofrece. ${C}`
      ]
    };
  },

  /* -------------------------- métodos de ayuda arcángel ------------------- */
  nombreCorto(nombre) { return nombre.replace("Arcángel ", ""); },

  capitalizarPrimera(t) { return t.charAt(0).toUpperCase() + t.slice(1); },

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
    const esPregunta = !!resultadoHTML.pregunta;
    let html = '<div class="resultado">';
    html += '<div class="resultado-cabecera"><div class="deco">' + this.elegantIcono[t.id] + "</div>";
    html += "<p>Resultado de la tirada de tarot completa gratis</p></div>";

    html += `<div class="contexto-tirada vidrio">
      <h3 style="color:var(--dorado);margin-bottom:10px">Interpretación Angelical</h3>
      <p class="comparte"><small>✨ Comparte tu resultado con quien quieras ✨</small></p>
    </div>`;

    let arcangeles;
    if (esPregunta) {
      const yaAnalizado = resultadoHTML.__tipoPregunta && resultadoHTML.__analisis;
      const temas = yaAnalizado
        ? (resultadoHTML.__temasPregunta || [])
        : this.temasEnPregunta(resultadoHTML.pregunta);
      const tipo = yaAnalizado
        ? resultadoHTML.__tipoPregunta
        : this.tipoDePregunta(resultadoHTML.pregunta);
      const analisis = yaAnalizado
        ? resultadoHTML.__analisis
        : (temas[0] || this.analizarPregunta(resultadoHTML.pregunta));
      resultadoHTML.__analisis = analisis;
      resultadoHTML.__tipoPregunta = tipo;
      resultadoHTML.__temasPregunta = temas;
      resultadoHTML.__arcangeles = tipo === "combinado"
        ? temas.map(t => ({ clave: t.clave, ...this.arcangeles[t.clave] }))
        : [{ clave: analisis.clave, ...this.arcangeles[analisis.clave] }];
      arcangeles = resultadoHTML.__arcangeles;
    } else {
      resultadoHTML.__tipoPregunta = null;
      arcangeles = this.arcangelesDeLectura(resultadoHTML);
      resultadoHTML.__arcangeles = arcangeles;
    }
    const arcangel = arcangeles[0];
    this.aplicarFondo(arcangeles);
    html += `<div class="arcangel-regente vidrio">
      <p class="ar-presentes">
        <span class="ar-titulo">${esPregunta ? (resultadoHTML.__tipoPregunta === "combinado" ? "Los arcángeles que te responden:" : "El arcángel que te responde:") : "Arcángeles presentes:"}</span>
        ${arcangeles.map(a => `<span class="ar-chip" style="--chip:${a.color}"><span class="arc-avatar"><img src="${a.img}" alt="${this.nombreCorto(a.nombre)}" loading="lazy"><i></i><i></i><i></i><i></i></span>${this.nombreCorto(a.nombre)}</span>`).join("")}
      </p>
    </div>`;

    if (esPregunta) {
      const an = resultadoHTML.__analisis;
      const aR = arcangeles[0];
      html += `<div class="pregunta-respuesta vidrio" style="--arc-color:${aR.color}">
        <span class="arc-part" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></span>
        <span class="pregunta-etiqueta">Tu pregunta</span>
        <p class="pregunta-texto">“${this.escapar(resultadoHTML.pregunta)}”</p>
        <div class="pregunta-arc">
          <span class="arc-avatar" style="--chip:${aR.color}"><img src="${aR.img}" alt="${this.nombreCorto(aR.nombre)}" loading="lazy"><i></i><i></i><i></i><i></i></span>
          <span class="pregunta-arc-texto"><strong>${this.nombreCorto(aR.nombre)}</strong><small>${resultadoHTML.__tipoPregunta === "combinado" ? `${an.titulo} · responde con ${arcangeles.length} arcángeles` : `${an.titulo} · ${aR.regencia}`}</small></span>
        </div>
      </div>`;
      if (resultadoHTML.__keywords && resultadoHTML.__keywords.length) {
        const senales = resultadoHTML.__keywords.map(k => `<span>${this.escapar(k)}</span>`).join("");
        html += `<div class="pregunta-senales vidrio">
          <span class="pregunta-etiqueta">Lo que el oráculo detectó en tu pregunta</span>
          <div class="palabras">${senales}</div>
        </div>`;
      }
    }

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
    const finales = esPregunta
      ? this.interpretacionPregunta(resultadoHTML)
      : (esGranTirada ? this.interpretacionGranTirada(resultadoHTML) : this.interpretacionFinal(resultadoHTML));
    if (resultadoHTML.fuerte) {
      // el cierre único ya viene dentro de interpretacionGranTirada/
      // interpretacionFinal; aquí solo se marca el tono del encabezado
    }
    const tituloFinal = resultadoHTML.fuerte
      ? "🔥 ¡¡ LECTURA FUERTE !! 🔥"
      : esPregunta
        ? (resultadoHTML.__tipoPregunta === "combinado"
          ? "✨ La respuesta de los arcángeles a tu pregunta ✨"
          : "✨ La respuesta del arcángel a tu pregunta ✨")
        : esGranTirada
          ? "✨ La palabra de los siete arcángeles ✨"
          : "✨ Interpretación final de tu tirada ✨";
    let htmlFinal = `<div class="interpretacion-final">${resultadoHTML.fuerte ? '<h3 class="titulo-interp-final titulo-fuerte">🔥 ¡¡ LECTURA FUERTE !! 🔥<small style="display:block;font-size:.75rem;color:#ff9e6d;margin-top:6px">Los ángeles hablaron con firmeza porque te aman demasiado para mentirte</small></h3><hr class="raya-fuerte">' : `<h3 class="titulo-interp-final">${tituloFinal}</h3>`}`;
    finales.forEach((b, i) => {
      const arcDeArea = b.arcangel || this.arcangelDeArea(arcangeles, i);
      if (b.cierre) {
        const aUnido = this.arcangelUnido(arcangeles);
        htmlFinal += `<div class="mensaje-poderoso vidrio" style="--arc-color:${aUnido.color};animation-delay:${(1.2 + i * 0.25).toFixed(2)}s">
          <span class="arc-part" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></span>
          <h3 style="color:var(--dorado)">El mensaje final</h3>
          <p>${b.texto}</p>
          <p class="cita">"${b.cita}"</p>
        </div>`;
      } else {
        htmlFinal += `<div class="bloque-categoria vidrio${b.regano ? " regano" : ""}" style="--arc-color:${arcDeArea.color};animation-delay:${(1.2 + i * 0.25).toFixed(2)}s">
          <span class="arc-part" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></span>
          <h4><span class="cat-icono">${b.icono}</span> ${b.titulo}
            <span class="cat-arc" style="--chip:${arcDeArea.color}"><span class="arc-avatar"><img src="${arcDeArea.img}" alt="${this.nombreCorto(arcDeArea.nombre)}" loading="lazy"><i></i><i></i><i></i><i></i></span>${this.nombreCorto(arcDeArea.nombre)}</span>
            ${b.regano ? '<span class="regano-tag">regaño</span>' : ""}
            ${b.combinacion ? `<span class="combo-tag combo-${b.combinacion.tipo}">combinación ${b.combinacion.tipo}</span>` : ""}
          </h4>
          ${b.presencia ? `<p class="presencia-arc">${b.presencia}</p>` : ""}
          ${b.respuestaIA ? `<p class="respuesta-ia" id="respuesta-ia">${b.texto}</p>` : (b.texto ? `<p>${b.texto}</p>` : "")}
          ${b.cartasHtml ? `<div class="regano-cartas">${b.cartasHtml}</div>` : ""}
          ${b.combinacion ? `<div class="combo-visual">
            ${b.combinacion.cartas && b.combinacion.cartas.length ? `
              ${b.combinacion.cartas.map(c => this.comboCartaHtml(c)).join('<span class="combo-mas">+</span>')}
              ${b.combinacion.cartas.length > 1 ? '<span class="combo-mas combo-igual">=</span>' : ""}` : ""}
            <span class="combo-significado${b.combinacion.cartas && b.combinacion.cartas.length ? "" : " sin-cartas"}">${b.combinacion.enfocada ? "" : `<b>Se unen en ${this.contextoDeCombinacion(b.combinacion.cartas || [])}:</b> `}${b.combinacion.texto}</span>
          </div>` : ""}
        </div>`;
      }
    });
    htmlFinal += "</div>";

    html += htmlFinal + `
      <div id="horoscopo-lectura"></div>
      <div class="centrado" style="margin-top:26px">
        <button class="btn btn-dorado" id="btn-nueva-tirada">Nueva lectura</button>
        <button class="btn btn-lavanda" id="btn-guardar">Guardar esta lectura</button>
      </div>
    </div>`;
    return html;
  },

  /* Horóscopo Negro anclado a la lectura: si el signo del usuario está en
     su perfil, se muestra aquí la sección al terminar la tirada */
  horoscopoLectura() {
    const zona = document.getElementById("horoscopo-lectura");
    if (!zona) return;
    const signo = (typeof SESION !== "undefined" && SESION.signo) || null;
    if (!signo || typeof window.fetchHoroscopo !== "function" || typeof window.horoscopoHTML !== "function") {
      zona.innerHTML = `<div class="horoscopo-sec" style="--hc:#d4af37">
        <div class="horoscopo-cab">
          <span class="horoscopo-emoji">🌑</span>
          <span class="horoscopo-titulo">Horóscopo Negro</span>
          <span class="horoscopo-premium">PREMIUM ✦</span>
        </div>
        <p style="font-size:.92rem;line-height:1.6">Tu Horóscopo Negro viaja contigo en cada lectura: completa tu <b>fecha de nacimiento</b> en tu perfil para que el arcángel de tu signo te acompañe aquí también.</p>
        <a class="btn btn-dorado" href="/perfil.html" style="margin-top:12px">Completar mi perfil ✦</a>
      </div>`;
      return;
    }
    fetchHoroscopo(signo.signo)
      .then(d => { if (zona) zona.innerHTML = horoscopoHTML(d) || ""; })
      .catch(() => {}); /* silencioso: la lectura ya está completa */
  },

  /* ============================ carta astral ============================== */
  signosAstrales: [
    { signo: "Aries",      emoji: "♈", mesIni: 3,  diaIni: 21, mesFin: 4,  diaFin: 19, elemento: "Fuego", modalidad: "Cardinal", planeta: "Marte",  arcangel: "miguel",
      rasgos: ["Toma la iniciativa sin esperar permiso", "Valor para defender tu espacio", "Entusiasmo que contagia"],
      luz: "una chispa que enciende caminos, valor de sobra y la capacidad de levantarte rápido cuando caes",
      reto: "dosificar tu impulso: no todo lo urgente es importante, y respirar antes de decidir te ahorra batallas que no eran tuyas" },
    { signo: "Tauro",      emoji: "♉", mesIni: 4,  diaIni: 20, mesFin: 5,  diaFin: 20, elemento: "Tierra", modalidad: "Fijo", planeta: "Venus",  arcangel: "chamuel",
      rasgos: ["Constancia que sostiene proyectos", "Disfrute sereno de lo concreto", "Lealtad inquebrantable"],
      luz: "una calma que construye, lealtad profunda y el arte de saborear la vida sin prisa",
      reto: "soltar lo que ya cumplió su tiempo: tu constancia es un regalo cuando no se vuelve rigidez" },
    { signo: "Géminis",    emoji: "♊", mesIni: 5,  diaIni: 21, mesFin: 6,  diaFin: 20, elemento: "Aire", modalidad: "Mutable", planeta: "Mercurio", arcangel: "gabriel",
      rasgos: ["Curiosidad insaciable", "Facilidad para comunicar", "Adaptación rápida"],
      luz: "una mente curiosa que conecta ideas y personas, y la palabra justa para comunicarlo todo",
      reto: "profundizar antes de pasar a lo siguiente: la variedad está bien, la dispersión también se cansa" },
    { signo: "Cáncer",     emoji: "♋", mesIni: 6,  diaIni: 21, mesFin: 7,  diaFin: 22, elemento: "Agua", modalidad: "Cardinal", planeta: "la Luna", arcangel: "rafael",
      rasgos: ["Intuición emocional muy afinada", "Cuidado de los vínculos", "Hogar y protección"],
      luz: "una sensibilidad que cuida, una intuición fina y un corazón que protege a los suyos",
      reto: "cuidarte tanto como cuidas a otros: tus emociones también piden brazos que las abracen" },
    { signo: "Leo",        emoji: "♌", mesIni: 7,  diaIni: 23, mesFin: 8,  diaFin: 22, elemento: "Fuego", modalidad: "Fijo", planeta: "el Sol",   arcangel: "jofiel",
      rasgos: ["Presencia que ilumina", "Generosidad creativa", "Lealtad y calidez"],
      luz: "una luz propia que ilumina donde llega, generosidad auténtica y el don de inspirar",
      reto: "brillar sin que se vuelva necesidad de aplauso: tu luz vale aunque nadie la nombre" },
    { signo: "Virgo",      emoji: "♍", mesIni: 8,  diaIni: 23, mesFin: 9,  diaFin: 22, elemento: "Tierra", modalidad: "Mutable", planeta: "Mercurio", arcangel: "uriel",
      rasgos: ["Análisis fino del detalle", "Sentido práctico y orden", "Servicio desde la humildad"],
      luz: "una mente analítica que ordena, perfecciona y sirve con un detalle que pocos ven",
      reto: "soltar la exigencia de lo perfecto: el orden es tu talento, no tu cárcel" },
    { signo: "Libra",      emoji: "♎", mesIni: 9,  diaIni: 23, mesFin: 10, diaFin: 22, elemento: "Aire", modalidad: "Cardinal", planeta: "Venus",  arcangel: "chamuel",
      rasgos: ["Busca y crea equilibrio", "Diplomacia y encanto", "Sentido estético afinado"],
      luz: "un sentido de la armonía que equilibra, une y embellece todo lo que tocas",
      reto: "decidir sin depender de aprobar a todos: la paz también se elige con firmeza" },
    { signo: "Escorpio",   emoji: "♏", mesIni: 10, diaIni: 23, mesFin: 11, diaFin: 21, elemento: "Agua", modalidad: "Fijo", planeta: "Plutón",  arcangel: "zadkiel",
      rasgos: ["Intensidad transformadora", "Percepción profunda", "Voluntad enorme"],
      luz: "una profundidad que transforma, una verdad que convierte y una pasión que siempre renueva",
      reto: "soltar el control de los procesos: tu poder crece cuando confías en el cambio" },
    { signo: "Sagitario",  emoji: "♐", mesIni: 11, diaIni: 22, mesFin: 12, diaFin: 21, elemento: "Fuego", modalidad: "Mutable", planeta: "Júpiter", arcangel: "jofiel",
      rasgos: ["Optimismo y fe", "Sed de conocimiento y viaje", "Honestidad directa"],
      luz: "una fe expansiva, un horizonte infinito y la alegría de creer en lo posible",
      reto: "concretar lo que sueñas: la flecha también necesita un arco bien anclado" },
    { signo: "Capricornio", emoji: "♑", mesIni: 12, diaIni: 22, mesFin: 1,  diaFin: 19, elemento: "Tierra", modalidad: "Cardinal", planeta: "Saturno", arcangel: "miguel",
      rasgos: ["Disciplina y constancia", "Sentido de la responsabilidad", "Visión a largo plazo"],
      luz: "una estructura que edifica, una responsabilidad que sostiene y la meta alcanzada con tiempo",
      reto: "permitirte disfrutar el proceso: el logro no es tu valor, es solo tu cosecha" },
    { signo: "Acuario",    emoji: "♒", mesIni: 1,  diaIni: 20, mesFin: 2,  diaFin: 18, elemento: "Aire", modalidad: "Fijo", planeta: "Urano",   arcangel: "uriel",
      rasgos: ["Originalidad y visión de futuro", "Deseo de renovar lo establecido", "Humanismo y comunidad"],
      luz: "una mente original que mira el futuro, una libertad que respeta la ajena y un ideal de comunidad",
      reto: "vincular tu cercanía: la libertad no se pierde por querer a alguien de verdad" },
    { signo: "Piscis",     emoji: "♓", mesIni: 2,  diaIni: 19, mesFin: 3,  diaFin: 20, elemento: "Agua", modalidad: "Mutable", planeta: "Neptuno", arcangel: "rafael",
      rasgos: ["Empatía profunda", "Imaginación creativa", "Espiritualidad natural"],
      luz: "una compasión sin fronteras, una imaginación que crea mundos y un corazón que siente el clima de todos",
      reto: "poner límites para no ahogarte en las emociones ajenas: tu sensibilidad es un don, no un sacrificio" }
  ],

  fasesLunares: [
    { nombre: "Luna Nueva",       ico: "🌑", h: 1.84566,  texto: "Naciste en Luna Nueva: traes la semilla de comenzar ciclos y de reiniciar con fe cada vez que hace falta." },
    { nombre: "Cuarto Creciente", ico: "🌒", h: 5.53699,  texto: "Naciste en Cuarto Creciente: tu fuerza crece con la acción constante, paso a paso." },
    { nombre: "Creciente Gibosa", ico: "🌓", h: 9.22831,  texto: "Naciste en Creciente Gibosa: tu impulso madura cerca de la cima; no frenes a mitad del camino." },
    { nombre: "Luna Llena",       ico: "🌕", h: 12.91963, texto: "Naciste en Luna Llena: vienes con luz intensa, emoción profunda y capacidad de cosechar." },
    { nombre: "Gibosa Menguante", ico: "🌖", h: 16.61096, texto: "Naciste en Gibosa Menguante: sabes agradecer y soltar a tiempo, y eso te aligera el alma." },
    { nombre: "Cuarto Menguante", ico: "🌗", h: 20.30229, texto: "Naciste en Cuarto Menguante: tu fuerza vive en depurar, ordenar y dejar ir con conciencia." },
    { nombre: "Menguante",        ico: "🌘", h: 23.99362, texto: "Naciste en Luna Menguante: dominas el arte de cerrar ciclos y de guardar silencio fértil." }
  ],

  signoDe(fecha) {
    const partes = String(fecha || "").split("-");
    const mes = Number(partes[1]);
    const dia = Number(partes[2] || 1);
    if (!mes || !dia) return this.signosAstrales[0];
    return this.signosAstrales.find(s => {
      if (s.mesIni <= s.mesFin) return (mes === s.mesIni && dia >= s.diaIni) || (mes === s.mesFin && dia <= s.diaFin);
      return (mes === s.mesIni && dia >= s.diaIni) || (mes === s.mesFin && dia <= s.diaFin);
    }) || this.signosAstrales[0];
  },

  faseLunarDe(fecha) {
    const partes = String(fecha || "").split("-");
    const y = Number(partes[0]), m = Number(partes[1]), d = Number(partes[2] || 1);
    if (!y || !m || !d) return this.fasesLunares[0];
    const jd = Date.UTC(y, m - 1, d) / 86400000 + 2440587.5;
    let edad = (jd - 2451550.1) % 29.530588853;
    if (edad < 0) edad += 29.530588853;
    for (let i = 0; i < this.fasesLunares.length; i++) if (edad < this.fasesLunares[i].h) return this.fasesLunares[i];
    return this.fasesLunares[0];
  },

  /* ====================== motor de la carta astral real ==================== */
  /* Cálculos astronómicos reales (astronomy-engine) para la rueda astral:
     posiciones geocéntricas aparentes de los 10 cuerpos, retrógrados,
     ascendente (ecuatorial → eclíptica), casas iguales y fase lunar. */

  adjetivoElemento: {
    Fuego: "apasionado y veloz", Tierra: "estable, sensorial y de raíces",
    Aire: "racional, ligero y curioso", Agua: "profundo, cambiante y muy intuitivo"
  },

  glifosPlaneta: {
    sol: "☉", luna: "☽", mercurio: "☿", venus: "♀", marte: "♂",
    jupiter: "♃", saturno: "♄", urano: "♅", neptuno: "♆", pluton: "♇"
  },

  ordenPlanetas: ["sol", "luna", "mercurio", "venus", "marte", "jupiter", "saturno", "urano", "neptuno", "pluton"],

  nombresPlanetas: {
    sol: "Sol", luna: "Luna", mercurio: "Mercurio", venus: "Venus", marte: "Marte",
    jupiter: "Júpiter", saturno: "Saturno", urano: "Urano", neptuno: "Neptuno", pluton: "Plutón"
  },

  lecturaPorPlaneta: {
    sol: s => `Tu Sol marca tu esencia y tu vitalidad: ${s.rasgos[0].toLowerCase()} y tu luz es ${s.luz.toLowerCase()}.`,
    luna: s => `Tu Luna rige tus emociones y tu memoria del alma: tu sentir es de ${s.elemento.toLowerCase()}, ${TIRADAS.adjetivoElemento[s.elemento].toLowerCase()}.`,
    mercurio: s => `Tu Mercurio dibuja tu mente y tu palabra: procesas de forma ${s.modalidad.toLowerCase()} y tu curiosidad se enciende con ${s.elemento.toLowerCase()}.`,
    venus: s => `Tu Venus rige tus gustos, tu belleza y cómo amas: aprecias lo ${TIRADAS.adjetivoElemento[s.elemento].toLowerCase()} y amas cuando hay armonía real, no apariencias.`,
    marte: s => `Tu Marte enciende tu acción y tu deseo: actúas con impulsos ${TIRADAS.adjetivoElemento[s.elemento].toLowerCase()} y te mueves de forma ${s.modalidad.toLowerCase()}.`,
    jupiter: s => `Tu Júpiter rige tu fe y tu abundancia: tu suerte crece cuando ${s.luz.toLowerCase()}.`,
    saturno: s => `Tu Saturno marca tu disciplina y tu responsabilidad: tu madurez se afianza de forma ${s.modalidad.toLowerCase()} y sostiene todo lo que amas.`,
    urano: s => `Tu Urano rige tu originalidad y tu libertad: piensas ${TIRADAS.adjetivoElemento[s.elemento].toLowerCase()} y cambias de rumbo de forma ${s.modalidad.toLowerCase()}.`,
    neptuno: s => `Tu Neptuno rige tus sueños y tu espiritualidad: tu intuición es de ${s.elemento.toLowerCase()}, ${TIRADAS.adjetivoElemento[s.elemento].toLowerCase()}, y percibe más allá de lo visible.`,
    pluton: s => `Tu Plutón marca tu poder de transformación: renaces de forma ${s.modalidad.toLowerCase()} y tu verdad tiene raíz de ${s.elemento.toLowerCase()}.`
  },

  gustosPorSigno: {
    Aries: ["aventura", "retos nuevos", "deporte", "fuego en la cocina", "velocidad"],
    Tauro: ["buena comida", "música suave", "comodidad", "naturaleza", "perfumes"],
    "Géminis": ["conversar", "aprender de todo", "libros", "viajes cortos", "juegos de palabras"],
    Cáncer: ["cocina de casa", "familia", "mar", "recuerdos", "música que llegue al alma"],
    Leo: ["crear", "brillar", "fiestas", "arte", "reconocimiento"],
    Virgo: ["orden", "detalles", "té y rituales", "leer bien las cosas", "cuidar la salud"],
    Libra: ["arte", "armonía", "belleza", "diplomacia", "baile"],
    Escorpio: ["misterio", "música profunda", "secretos", "poder interior", "noches de luna"],
    Sagitario: ["viajar", "aprender", "filosofía", "naturaleza grande", "horizontes nuevos"],
    Capricornio: ["planes", "tradición", "montañas", "solidez", "silencios con propósito"],
    Acuario: ["ideas nuevas", "tecnología", "amistades", "futuro", "causas justas"],
    Piscis: ["arte", "soñar", "agua", "música", "ayudar a otros"]
  },

  normDeg(g) { return ((Number(g) % 360) + 360) % 360; },

  redondear(x, n = 1) { const p = Math.pow(10, n); return Math.round(Number(x) * p) / p; },

  signoDeGrado(grados) {
    const i = (Math.floor(this.normDeg(grados) / 30) % 12 + 12) % 12;
    return this.signosAstrales[i];
  },

  astronomiaDisponible() { return typeof Astronomy !== "undefined" && typeof Astronomy.MakeTime === "function"; },

  planetaCuerpo(clave) {
    const m = { sol: "Sun", luna: "Moon", mercurio: "Mercury", venus: "Venus", marte: "Mars",
      jupiter: "Jupiter", saturno: "Saturn", urano: "Uranus", neptuno: "Neptune", pluton: "Pluto" };
    return m[clave] ? Astronomy.Body[m[clave]] : null;
  },

  lonDeCuerpo(clave, tiempo) {
    if (clave === "sol") return this.normDeg(Astronomy.SunPosition(tiempo).elon);
    if (clave === "luna") return this.normDeg(Astronomy.EclipticGeoMoon(tiempo).lon);
    return this.normDeg(Astronomy.Ecliptic(Astronomy.GeoVector(this.planetaCuerpo(clave), tiempo, true)).elon);
  },

  desfaseTZ(iana, msUTC) {
    try {
      const dtf = new Intl.DateTimeFormat("en-US", {
        timeZone: iana, hour12: false, year: "numeric", month: "2-digit", day: "2-digit",
        hour: "2-digit", minute: "2-digit", second: "2-digit"
      });
      const p = {};
      dtf.formatToParts(new Date(msUTC)).forEach(x => { p[x.type] = x.value; });
      const local = Date.UTC(Number(p.year), Number(p.month) - 1, Number(p.day), Number(p.hour) % 24, Number(p.minute), Number(p.second));
      return Math.round((local - msUTC) / 60000);
    } catch { return 0; }
  },

  nacimientoUTC(fecha, hora, tz) {
    const [y, m, d] = String(fecha || "").split("-").map(Number);
    let hh = 12, mm = 0;
    if (hora) { const p = String(hora).split(":"); hh = Number(p[0]); mm = Number(p[1] || 0); }
    let ms = Date.UTC(y, m - 1, d, hh, mm);
    if (!tz || tz === "UTC") return ms;
    const off1 = this.desfaseTZ(tz, ms);
    let ms2 = Date.UTC(y, m - 1, d, hh, mm) - off1 * 60000;
    const off2 = this.desfaseTZ(tz, ms2);
    if (off2 !== off1) ms2 = Date.UTC(y, m - 1, d, hh, mm) - off2 * 60000;
    return ms2;
  },

  oblicuidadEcliptica(tiempo) {
    const T = tiempo.tt / 36525;
    return (23 + 26 / 60 + 21.448 / 3600) - (46.815 * T + 0.00059 * T * T - 0.001813 * T * T * T) / 3600;
  },

  gradosA(g) { return (Number(g) % 30 + 30) % 30; },

  gradoTexto(g) { const r = this.redondear(this.gradosA(g), 0); return `${r}°`; },

  calculoAstral(fecha, hora, lugar) {
    const cal = { fecha, hora, lugar, offline: !this.astronomiaDisponible() };
    if (cal.offline) return cal;

    const sitio = this.ubicarLugar(lugar);
    if (sitio) { cal.lugarNombre = sitio.nombre; cal.tz = sitio.tz; cal.lat = sitio.lat; cal.lon = sitio.lon; }
    else if (lugar) cal.lugarNoEncontrado = String(lugar).trim();

    const ms = this.nacimientoUTC(fecha, hora, sitio ? sitio.tz : "UTC");
    if (!Number.isFinite(ms)) return cal;
    cal.ms = ms;
    const t0 = Astronomy.MakeTime(new Date(ms));

    cal.sol = { lon: this.lonDeCuerpo("sol", t0) };

    const planetas = this.ordenPlanetas.map(clave => {
      const lon = this.lonDeCuerpo(clave, t0);
      const signo = this.signoDeGrado(lon);
      let retro = false;
      if (clave !== "sol" && clave !== "luna") {
        const dia = 7 * 86400000;
        const lp = this.lonDeCuerpo(clave, Astronomy.MakeTime(new Date(ms + dia)));
        const lm = this.lonDeCuerpo(clave, Astronomy.MakeTime(new Date(ms - dia)));
        retro = ((lp - lm + 180 + 360) % 360) - 180 < 0;
      }
      return { clave, nombre: this.nombresPlanetas[clave], glifo: this.glifosPlaneta[clave], lon, signo, grado: this.gradosA(lon), retro };
    });
    cal.planetas = planetas;
    cal.solPlaneta = planetas[0];
    cal.lunaPlaneta = planetas[1];

    /* fase lunar exacta desde la elongación Sol–Luna */
    const elong = this.normDeg(planetas[1].lon - planetas[0].lon);
    const edadDias = elong / 360 * 29.530588853;
    cal.fase = this.fasesLunares.find(f => edadDias < f.h) || this.fasesLunares[0];

    /* ascendente, medio cielo y casas iguales: piden hora y lugar exactos */
    if (sitio && hora) {
      const ramc = this.normDeg(Astronomy.SiderealTime(t0) * 15 + sitio.lon);
      const eps = this.oblicuidadEcliptica(t0) * Math.PI / 180;
      const R = Math.PI / 180;
      const sinR = Math.sin(ramc * R), cosR = Math.cos(ramc * R), tanF = Math.tan(sitio.lat * R);
      const mc = this.normDeg(Math.atan2(sinR, cosR * Math.cos(eps)) / R);
      const asc = this.normDeg(Math.atan2(cosR, -(sinR * Math.cos(eps) + tanF * Math.sin(eps))) / R);
      cal.asc = asc;
      cal.mc = mc;
      cal.ascSigno = this.signoDeGrado(asc);
      cal.mcSigno = this.signoDeGrado(mc);
      cal.casas = [];
      for (let i = 1; i <= 12; i++) {
        const c = this.normDeg(asc + (i - 1) * 30);
        cal.casas.push({ num: i, lon: c, signo: this.signoDeGrado(c) });
      }
      planetas.forEach(p => {
        p.casa = ((Math.floor(this.normDeg(p.lon - asc) / 30)) % 12 + 12) % 12 + 1;
      });
    }
    return cal;
  },

  /* librería de ciudades → (zona horaria, latitud, longitud) para el ascendente */
  CIUDADES_ASTRALES: {
    "quito, ecuador": "America/Guayaquil|-0.1807|-78.4678",
    "guayaquil, ecuador": "America/Guayaquil|-2.19|-79.8878",
    "cuenca, ecuador": "America/Guayaquil|-2.9006|-79.0045",
    "santiago, chile": "America/Santiago|-33.4489|-70.6693",
    "santiago de chile": "America/Santiago|-33.4489|-70.6693",
    "valparaiso, chile": "America/Santiago|-33.0472|-71.6126",
    "buenos aires": "America/Argentina/Buenos_Aires|-34.6037|-58.3816",
    "cordoba, argentina": "America/Argentina/Cordoba|-31.4201|-64.1888",
    "rosario, argentina": "America/Argentina/Cordoba|-32.9468|-60.6393",
    "mendoza, argentina": "America/Argentina/Mendoza|-32.8895|-68.8458",
    "montevideo": "America/Montevideo|-34.9011|-56.1645",
    "lima, peru": "America/Lima|-12.0464|-77.0428",
    "bogota": "America/Bogota|4.711|-74.0721",
    "medellin": "America/Bogota|6.2442|-75.5812",
    "cali, colombia": "America/Bogota|3.4516|-76.532",
    "barranquilla": "America/Bogota|10.9685|-74.7813",
    "ciudad de mexico": "America/Mexico_City|19.4326|-99.1332",
    "mexico": "America/Mexico_City|19.4326|-99.1332",
    "guadalajara, mexico": "America/Mexico_City|20.6597|-103.3496",
    "monterrey, mexico": "America/Monterrey|25.6866|-100.3161",
    "caracas": "America/Caracas|10.4806|-66.9036",
    "la paz, bolivia": "America/La_Paz|-16.4897|-68.1193",
    "santa cruz de la sierra": "America/La_Paz|-17.7833|-63.1821",
    "asuncion": "America/Asuncion|-25.2637|-57.5759",
    "san josé, costa rica": "America/Costa_Rica|9.9281|-84.0907",
    "ciudad de panama": "America/Panama|8.9824|-79.5199",
    "panama": "America/Panama|8.9824|-79.5199",
    "san salvador": "America/El_Salvador|13.6929|-89.2182",
    "ciudad de guatemala": "America/Guatemala|14.6349|-90.5069",
    "tegucigalpa": "America/Tegucigalpa|14.0723|-87.1921",
    "managua": "America/Managua|12.1149|-86.2362",
    "santo domingo": "America/Santo_Domingo|18.4861|-69.9312",
    "la habana": "America/Havana|23.1136|-82.3666",
    "san juan, puerto rico": "America/Puerto_Rico|18.4655|-66.1057",
    "santiago de cuba": "America/Havana|20.0247|-75.8215",
    "são paulo": "America/Sao_Paulo|-23.5505|-46.6333",
    "sao paulo": "America/Sao_Paulo|-23.5505|-46.6333",
    "rio de janeiro": "America/Sao_Paulo|-22.9068|-43.1729",
    "brasilia": "America/Sao_Paulo|-15.8267|-47.9218",
    "salvador, brasil": "America/Bahia|-12.9777|-38.5016",
    "recife": "America/Recife|-8.0476|-34.877",
    "fortaleza": "America/Fortaleza|-3.7319|-38.5267",
    "belo horizonte": "America/Sao_Paulo|-19.9167|-43.9345",
    "curitiba": "America/Sao_Paulo|-25.4284|-49.2733",
    "manaus": "America/Manaus|-3.1190|-60.0217",
    "nueva york": "America/New_York|40.7128|-74.0060",
    "new york": "America/New_York|40.7128|-74.0060",
    "los angeles": "America/Los_Angeles|34.0522|-118.2437",
    "los angeles, estados unidos": "America/Los_Angeles|34.0522|-118.2437",
    "chicago": "America/Chicago|41.8781|-87.6298",
    "houston": "America/Chicago|29.7604|-95.3698",
    "miami": "America/New_York|25.7617|-80.1918",
    "dallas": "America/Chicago|32.7767|-96.7970",
    "phoenix": "America/Phoenix|33.4484|-112.0740",
    "denver": "America/Denver|39.7392|-104.9903",
    "seattle": "America/Los_Angeles|47.6062|-122.3321",
    "san francisco": "America/Los_Angeles|37.7749|-122.4194",
    "atlanta": "America/New_York|33.7490|-84.3880",
    "boston": "America/New_York|42.3601|-71.0589",
    "washington": "America/New_York|38.9072|-77.0369",
    "detroit": "America/Detroit|42.3314|-83.0458",
    "las vegas": "America/Los_Angeles|36.1699|-115.1398",
    "portland": "America/Los_Angeles|45.5152|-122.6784",
    "vancouver": "America/Vancouver|49.2827|-123.1207",
    "toronto": "America/Toronto|43.6532|-79.3832",
    "montreal": "America/Toronto|45.5017|-73.5673",
    "ottawa": "America/Toronto|45.4215|-75.6972",
    "hawaii": "Pacific/Honolulu|21.3069|-157.8583",
    "honolulu": "Pacific/Honolulu|21.3069|-157.8583",
    "anchorage": "America/Anchorage|61.2181|-149.9003",
    "madrid": "Europe/Madrid|40.4168|-3.7038",
    "barcelona": "Europe/Madrid|41.3874|2.1686",
    "valencia, españa": "Europe/Madrid|39.4699|-0.3763",
    "sevilla": "Europe/Madrid|37.3891|-5.9845",
    "bilbao": "Europe/Madrid|43.2630|-2.9350",
    "zaragoza": "Europe/Madrid|41.6488|-0.8891",
    "malaga": "Europe/Madrid|36.7213|-4.4214",
    "londres": "Europe/London|51.5074|-0.1278",
    "london": "Europe/London|51.5074|-0.1278",
    "paris": "Europe/Paris|48.8566|2.3522",
    "berlin": "Europe/Berlin|52.5200|13.4050",
    "munich": "Europe/Berlin|48.1351|11.5820",
    "roma": "Europe/Rome|41.9028|12.4964",
    "milan": "Europe/Rome|45.4642|9.1900",
    "lisboa": "Europe/Lisbon|38.7223|-9.1393",
    "oporto": "Europe/Lisbon|41.1579|-8.6291",
    "amsterdam": "Europe/Amsterdam|52.3676|4.9041",
    "bruselas": "Europe/Brussels|50.8503|4.3517",
    "viena": "Europe/Vienna|48.2082|16.3738",
    "zurich": "Europe/Zurich|47.3769|8.5417",
    "estocolmo": "Europe/Stockholm|59.3293|18.0686",
    "copenhague": "Europe/Copenhagen|55.6761|12.5683",
    "dublin": "Europe/Dublin|53.3498|-6.2603",
    "praga": "Europe/Prague|50.0755|14.4378",
    "budapest": "Europe/Budapest|47.4979|19.0402",
    "atenas": "Europe/Athens|37.9838|23.7275",
    "helsinki": "Europe/Helsinki|60.1699|24.9384",
    "estambul": "Europe/Istanbul|41.0082|28.9784",
    "moscu": "Europe/Moscow|55.7558|37.6173",
    "el cairo": "Africa/Cairo|30.0444|31.2357",
    "lagos": "Africa/Lagos|6.5244|3.3792",
    "casablanca": "Africa/Casablanca|33.5731|-7.5898",
    "nairobi": "Africa/Nairobi|-1.2921|36.8219",
    "johannesburgo": "Africa/Johannesburg|-26.2041|28.0473",
    "tel aviv": "Asia/Jerusalem|32.0853|34.7818",
    "dubai": "Asia/Dubai|25.2048|55.2708",
    "riyad": "Asia/Riyadh|24.7136|46.6753",
    "mumbai": "Asia/Kolkata|19.0760|72.8777",
    "nueva delhi": "Asia/Kolkata|28.6139|77.2090",
    "karachi": "Asia/Karachi|24.8607|67.0011",
    "bangkok": "Asia/Bangkok|13.7563|100.5018",
    "singapur": "Asia/Singapore|1.3521|103.8198",
    "yakarta": "Asia/Jakarta|-6.2088|106.8456",
    "manila": "Asia/Manila|14.5995|120.9842",
    "hong kong": "Asia/Hong_Kong|22.3193|114.1694",
    "shanghai": "Asia/Shanghai|31.2304|121.4737",
    "pekin": "Asia/Shanghai|39.9042|116.4074",
    "tokyo": "Asia/Tokyo|35.6762|139.6503",
    "seul": "Asia/Seoul|37.5665|126.9780",
    "sydney": "Australia/Sydney|-33.8688|151.2093",
    "melbourne": "Australia/Melbourne|-37.8136|144.9631",
    "auckland": "Pacific/Auckland|-36.8509|174.7645"
  },

  ubicarLugar(lugar) {
    if (!lugar) return null;
    const l = String(lugar).trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    if (!l) return null;
    let mejor = null;
    for (const k of Object.keys(this.CIUDADES_ASTRALES)) {
      if (l.includes(k) && (!mejor || k.length > mejor.k.length)) mejor = { k, v: this.CIUDADES_ASTRALES[k] };
    }
    if (!mejor) return null;
    const [tz, lat, lon] = mejor.v.split("|");
    return { nombre: mejor.k, tz, lat: Number(lat), lon: Number(lon) };
  },

  anguloCard(nombre, glifo, signoObj, lon, texto, clave) {
    return `<div class="angulo-tarjeta${clave ? " angulo-clave" : ""}">
      <span class="angulo-glifo">${glifo}</span>
      <span class="angulo-nombre">${nombre}</span>
      <span class="angulo-signo">${signoObj.emoji} ${signoObj.signo} · ${this.gradoTexto(lon)}</span>
      <p>${texto}</p>
    </div>`;
  },

  /* rueda astral SVG: signos por elemento, casas, ejes Asc-Dsc y MC-IC, planetas */
  ruedaAstralHTML(cal) {
    if (!cal || !cal.planetas) return "";
    const cx = 310, cy = 310, RAD = Math.PI / 180;
    const R1 = 288, R2 = 206, R3 = 156, RP = 183;
    const colores = { Fuego: "#ff8a6b", Tierra: "#8fd48f", Aire: "#8fd0e8", Agua: "#b39dfa" };
    const pt = (r, a) => { const t = a * RAD; return [cx + r * Math.cos(t), cy - r * Math.sin(t)]; };
    const sector = (a0, a1, rA, rB) => {
      const [x1, y1] = pt(rB, a0), [x2, y2] = pt(rB, a1), [x3, y3] = pt(rA, a1), [x4, y4] = pt(rA, a0);
      return `M${x1},${y1} A${rB},${rB} 0 ${(a1 - a0) > 180 ? 1 : 0} 1 ${x2},${y2} L${x3},${y3} A${rA},${rA} 0 ${(a1 - a0) > 180 ? 1 : 0} 0 ${x4},${y4} Z`;
    };
    const usarCasas = cal.asc != null && Array.isArray(cal.casas);

    let s = `<svg viewBox="0 0 620 620" class="rueda-astral" role="img" aria-label="Rueda de la carta astral" style="width:100%;max-width:560px;display:block;margin:0 auto">
      <defs>
        <radialGradient id="ruedaFondo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="rgba(28,24,60,0.9)"/>
          <stop offset="100%" stop-color="rgba(12,10,28,0.95)"/>
        </radialGradient>
        <radialGradient id="ruedaCentroGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="rgba(233,206,143,0.3)"/>
          <stop offset="100%" stop-color="rgba(233,206,143,0)"/>
        </radialGradient>
      </defs>
      <circle cx="${cx}" cy="${cy}" r="${R1 + 14}" fill="url(#ruedaFondo)" stroke="rgba(233,206,143,0.4)"/>
      <circle cx="${cx}" cy="${cy}" r="300" fill="none" class="rueda-giro" stroke="rgba(233,206,143,0.55)" stroke-width="2.2" stroke-dasharray="3 12" stroke-linecap="round"/>
      <circle cx="${cx}" cy="${cy}" r="296" fill="none" class="rueda-giro contra" stroke="rgba(170,140,235,0.42)" stroke-width="1.6" stroke-dasharray="2 10" stroke-linecap="round"/>`;

    /* anillo de signos: solo el color sagrado de su elemento, sin letreros */
    for (let i = 0; i < 12; i++) {
      const sg = this.signosAstrales[i];
      const a0 = i * 30, col = colores[sg.elemento];
      s += `<path d="${sector(a0, a0 + 30, R2, R1)}" fill="${col}" opacity="0.18" stroke="rgba(233,206,143,0.28)" stroke-width="1"/>`;
    }

    /* coronas orbitantes: dos anillos de cuentas sagradas girando en sentidos opuestos */
    const aroBeads = (n, r, col, px) => {
      let g = "";
      for (let i = 0; i < n; i++) {
        const a = i * (360 / n);
        const [bx, by] = pt(r, a);
        g += `<circle cx="${bx}" cy="${by}" r="${px}" fill="${col}" opacity="0.7"/>`;
      }
      return `<g class="rueda-beads ${px === "1.8" ? "sol" : "luna"}">${g}</g>`;
    };
    s += aroBeads(18, 300, "rgba(233,206,143,0.85)", "1.8");
    s += aroBeads(10, 288, "rgba(170,140,235,0.78)", "2.4");

    /* anillo de casas */
    if (usarCasas) {
      for (let i = 0; i < 12; i++) {
        const a0 = this.normDeg(cal.asc + i * 30);
        if (i % 2 === 0) s += `<path d="${sector(a0, a0 + 30, R3, R2)}" fill="rgba(255,255,255,0.07)"/>`;
        const [p1, p2] = [pt(R2, a0), pt(R3, a0)];
        s += `<line x1="${p1[0]}" y1="${p1[1]}" x2="${p2[0]}" y2="${p2[1]}" stroke="rgba(233,206,143,0.45)" stroke-width="1"/>`;
      }
    }

    /* ejes sagrados: horizonte (Asc y Desc) y meridiano (MC e IC) */
    if (usarCasas) {
      const marcador = (a, txt, col, principal) => {
        const [x1, y1] = pt(126, a);
        const [x2, y2] = pt(292, a);
        s += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="rueda-eje" stroke="${col}" stroke-width="5" opacity="0.16" stroke-linecap="round"/>`;
        s += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${col}" stroke-width="2" opacity="0.95" stroke-linecap="round"/>`;
        const [mx, my] = pt(294, a);
        s += `<circle cx="${mx}" cy="${my}" r="3.6" fill="${col}"/>`;
        const [tx, ty] = pt(principal ? 248 : 240, a);
        if (principal) {
          s += `<text x="${tx}" y="${ty}" text-anchor="middle" font-weight="700" font-size="18" fill="${col}" class="rueda-eje-label clave">${txt}</text>`;
        } else {
          s += `<text x="${tx}" y="${ty}" text-anchor="middle" font-size="13.5" fill="${col}" class="rueda-eje-label">${txt}</text>`;
        }
      };
      marcador(cal.asc, "Asc", "#7ee8c8", true);
      marcador(this.normDeg(cal.asc + 180), "Desc", "#ffd9a8", true);
      marcador(cal.mc, "MC", "#ff9e6d", false);
      marcador(this.normDeg(cal.mc + 180), "IC", "#c7b3ff", false);
    }

    /* planetas */
    for (const p of cal.planetas) {
      const a = this.normDeg(p.lon);
      const [px, py] = pt(RP, a);
      s += `<g transform="translate(${px},${py})">
        <circle r="15" fill="rgba(20,17,48,0.92)" stroke="#e9ce8f" stroke-width="1.2"/>
        <text y="5" text-anchor="middle" font-size="18" fill="#f7edd1">${p.glifo}</text>
      </g>`;
      if (p.retro) {
        s += `<text x="${px + 10}" y="${py - 10}" text-anchor="middle" font-size="11" fill="#ff9e6d" font-family="Verdana,sans-serif">℞</text>`;
      }
    }

    /* centro con halo respirante */
    s += `<circle cx="${cx}" cy="${cy}" r="120" fill="rgba(10,9,24,0.68)" stroke="rgba(233,206,143,0.35)"/>
      <circle cx="${cx}" cy="${cy}" r="120" fill="url(#ruedaCentroGlow)"/>
      <circle cx="${cx}" cy="${cy}" r="138" fill="none" stroke="rgba(233,206,143,0.55)" stroke-width="1.4" class="rueda-pulso"/>
      <text x="${cx}" y="${cy - 9}" text-anchor="middle" font-size="18" fill="#f4e9c9" font-family="Georgia,serif" style="letter-spacing:.05em">Tu cielo</text>
      <text x="${cx}" y="${cy + 15}" text-anchor="middle" font-size="18" fill="#f4e9c9" font-family="Georgia,serif" style="letter-spacing:.05em">al nacer</text>`;
    if (cal.lugarNombre) {
      s += `<text x="${cx}" y="${cy + 40}" text-anchor="middle" font-size="13" fill="#c9b6ea" font-family="Verdana,sans-serif">${this.escapar(cal.lugarNombre)}</text>`;
    }

    s += `</svg>`;
    const chispas = Array.from({ length: 9 }, (_, i) =>
      `<span class="luz-astral" style="--lx:${(8 + Math.random() * 84).toFixed(1)}%;--ly:${(10 + Math.random() * 80).toFixed(1)}%;--ld:${(Math.random() * 5).toFixed(1)}s;--ll:${(2.2 + Math.random() * 2.6).toFixed(2)}s"></span>`).join("");
    return `<div class="rueda-escena">${s}${chispas}</div>`;
  },

  armarCartaAstral(datos) {
    const cal = this.calculoAstral(datos.fecha, datos.hora, datos.lugar);
    const s = (cal.solPlaneta && cal.solPlaneta.signo) || this.signoDe(datos.fecha);
    const fase = cal.fase || { ...(this.faseLunarDe(datos.fecha) || {}) };
    const arc = this.arcangeles[s.arcangel];
    const rasgos = s.rasgos.map(r => `<div class="tarjeta" style="padding:16px;text-align:center"><p style="color:var(--lavanda-suave)">${r}</p></div>`).join("");
    const gustos = (this.gustosPorSigno[s.signo] || []).map(g => `<span class="chip-gusto">${g}</span>`).join("");
    const tieneCasas = !!cal.casas;
    const solP = cal.solPlaneta;
    const lunaP = cal.lunaPlaneta;

    let html = '<div class="resultado astral-resultado">';
    html += '<div class="resultado-cabecera"><div class="deco">🪐</div><p>Tu carta astral · mediciones reales de tu cielo</p></div>';
    html += `<div class="contexto-tirada vidrio">
      <h3 style="color:var(--dorado);margin-bottom:10px">Interpretación Angelical · Carta Astral</h3>
      <p class="comparte"><small>✨ La rueda de tu nacimiento, los 10 cuerpos celestes y tu arcángel ✨</small></p>
    </div>`;

    /* sol */
    html += `<div class="carta-grande vidrio" style="--arc-color:${arc.color};animation-delay:.25s">
      <div class="carta-texto" style="flex:1">
        <h4>Tu sol · ${solP ? this.gradoTexto(solP.lon) : ""}</h4>
        <h3>${s.signo} <span style="font-size:1.4rem">${s.emoji}</span></h3>
        <div class="palabras"><span>${s.elemento}</span><span>${s.modalidad}</span><span>Regente: ${s.planeta}</span></div>
        <p class="interp">Tu esencia de ${s.elemento.toLowerCase()} te regala ${s.luz}. Tu reto de alma es ${s.reto}.</p>
      </div>
    </div>`;

    /* rueda */
    if (cal.planetas) {
      html += `<section class="astral-seccion vidrio">
        <span class="etiqueta-seccion">La rueda de tu cielo</span>
        <h2 class="astral-titulo">Tu carta en círculo</h2>
        <p class="astral-instruccion">Posición real de tus planetas al nacer, con el eje Ascendente-Descendente (horizonte) y el Medio Cielo-Fondo del Cielo (meridiano).</p>
        ${this.ruedaAstralHTML(cal)}
      </section>`;
    }

    /* fase lunar + signo lunar */
    html += `<div class="mensaje-final-seccion-nueva" style="margin-top:18px">
      <h2 class="astral-titulo">Tu fase lunar · ${fase.ico} ${fase.nombre}</h2>
      ${lunaP ? `<p style="margin-top:6px"><b>Tu Luna está en ${lunaP.signo.signo} ${lunaP.signo.emoji} (${this.gradoTexto(lunaP.lon)})</b> · ${lunaP.retro ? "retrógrada " : ""}${this.lecturaPorPlaneta.luna(lunaP.signo)}</p>` : ""}
      <p style="margin-top:10px">${fase.texto}</p>
      ${datos.lugar ? `<p style="margin-top:12px">Naciste en ${this.escapar(datos.lugar)}.</p>` : ""}
    </div>`;

    /* mediciones: los 10 planetas */
    if (cal.planetas) {
      const filas = cal.planetas.map(p => {
        const signo = p.signo;
        const casa = p.casa ? ` · casa ${p.casa}` : "";
        return `<div class="medir-planeta">
          <div class="mp-glifo" style="--cp:${p.retro ? "#ff9e6d" : "#e9ce8f"}">${p.glifo}</div>
          <div class="mp-cuerpo">
            <b>${p.nombre} <span class="mp-signo">${signo.emoji} ${signo.signo} ${this.gradoTexto(p.lon)}${p.retro ? ' <i class="mp-retro">retrógrado</i>' : ""}</span>${casa}</b>
            <p class="mp-frase">${this.lecturaPorPlaneta[p.clave](signo)}</p>
          </div>
        </div>`;
      }).join("");
      html += `<section class="astral-seccion vidrio">
        <span class="etiqueta-seccion">Tus mediciones celestes</span>
        <h2 class="astral-titulo">Los 10 planetas de tu nacimiento</h2>
        <div class="medir-lista">${filas}</div>
      </section>`;
    }

    /* cuatro ángulos sagrados: Asc y Desc son los protagonistas */
    if (tieneCasas) {
      const desc = this.normDeg(cal.asc + 180);
      const ic = this.normDeg(cal.mc + 180);
      const descSigno = this.signoDeGrado(desc);
      const angulos =
        this.anguloCard("Ascendente", "🌅", cal.ascSigno, cal.asc,
          "Tu sello ante el mundo: la energía que proyectas al llegar, tu carisma y cómo comienzas cada cosa.", true) +
        this.anguloCard("Descendente", "🌇", descSigno, desc,
          "Tu espejo en los demás: las alianzas, parejas y personas que atraes, y el trato que ofreces a los otros.", true) +
        this.anguloCard("Medio Cielo", "✦", cal.mcSigno, cal.mc,
          "Tu vocación y tu lugar en el mundo: la cima a la que te llama tu oficio, tu reconocimiento y tu legado.", false) +
        this.anguloCard("Fondo del Cielo", "🏡", this.signoDeGrado(ic), ic,
          "Tu raíz privada: el hogar, la familia y el santuario emocional del que vienes y al que siempre vuelves.", false);
      html += `<section class="astral-seccion vidrio astral-angulos">
        <span class="etiqueta-seccion">El marco sagrado de tu vida</span>
        <h2 class="astral-titulo">Tu Ascendente y tu Descendente</h2>
        <p class="astro-resalta">Cómo te ve el mundo · Asc ${cal.ascSigno.signo} ${cal.ascSigno.emoji} · Desc ${descSigno.signo} ${descSigno.emoji}</p>
        <p class="astral-instruccion">Tu ascendente es la máscara con que saludas la vida: tu carisma, tu primera impresión y el rumbo que tomas al levantarte. Enfrente, tu descendente te muestra las personas y alianzas que atraes. El Medio Cielo y su fondo cierran el marco con tu vocación y tu raíz.</p>
        <div class="carta-angulos">${angulos}</div>
      </section>`;
    } else if (!cal.offline && !cal.lugarNoEncontrado) {
      html += `<div class="astral-aviso vidrio" style="margin-top:18px">
        <p><b>Faltan datos para tu ascendente y tus casas.</b> Añade tu <b>hora exacta</b> de nacimiento y un <b>lugar reconocido</b> (ej.: Quito, Ecuador) y la rueda girará con tus casas, tu ascendente y la casa de cada planeta.</p>
      </div>`;
    } else if (cal.lugarNoEncontrado) {
      html += `<div class="astral-aviso vidrio" style="margin-top:18px">
        <p><b>No encontré «${this.escapar(cal.lugarNoEncontrado)}».</b> Escribe una ciudad reconocida (ej.: Quito, Ecuador · Bogotá · Madrid) para calcular tu ascendente y tus casas.</p>
      </div>`;
    }

    /* arcángel */
    html += `<div class="arcangel-seccion-nueva" style="--arc-color:${arc.color};margin-top:18px">
      <span class="etiqueta-seccion">Arcángel regente de ${s.signo}</span>
      <h3>${arc.nombre}</h3>
      <span>${arc.regencia}</span>
      <p>${arc.mensaje}</p>
    </div>`;

    /* rasgos y gustos */
    html += `<div class="rejilla rejilla-3" style="margin-top:18px">${rasgos}</div>`;
    if (gustos) html += `<section class="astral-seccion vidrio">
      <span class="etiqueta-seccion">Tus gustos y afinidades</span>
      <p class="astral-instruccion">Lo que tu ${s.signo} ama casi sin darse cuenta:</p>
      <div class="chips-casas">${gustos}</div>
    </section>`;

    /* cierre */
    html += `<div class="mensaje-final-seccion-nueva" style="margin-top:18px">
      <h2 class="astral-titulo">El mensaje final de tu carta astral</h2>
      <p>${s.signo}, ${this.nombreCorto(arc.nombre)} te deja esta palabra al oído:</p>
      <p style="margin-top:10px"><em>“${arc.consejo}”</em></p>
      <p style="margin-top:12px">Tu luz nace inteligente y tu reto es solo el maestro que la afina. Respira, confía y camina.</p>
    </div>`;
    html += `
      <div class="centrado" style="margin-top:26px">
        <button class="btn btn-dorado" id="btn-nueva-tirada">Nueva lectura</button>
        <button class="btn btn-lavanda" id="btn-guardar">Guardar esta lectura</button>
      </div>
    </div>`;
    return html;
  },

  guardarAstral(datos) {
    const cal = this.calculoAstral(datos.fecha, datos.hora, datos.lugar);
    const s = cal.solPlaneta && cal.solPlaneta.signo ? cal.solPlaneta.signo : this.signoDe(datos.fecha);
    const fase = cal.fase || this.faseLunarDe(datos.fecha) || { nombre: "" };
    const arc = this.arcangeles[s.arcangel];
    const luna = cal.lunaPlaneta ? ` · Luna en ${cal.lunaPlaneta.signo.signo}` : "";
    const asc = cal.ascSigno ? ` · Asc ${cal.ascSigno.signo}` : "";
    const resumen = `Carta Astral · ${s.signo} (${s.elemento})${luna}${asc} · ${fase.nombre} · Regente: ${this.nombreCorto(arc.nombre)}`;
    const lectura = { tirada: "Carta Astral", cartas: [], resumen };
    const historial = JSON.parse(localStorage.getItem("oraculoLecturas") || "[]");
    historial.unshift({ fecha: new Date().toISOString(), tirada: "Carta Astral", cartas: [], resumen });
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

/* Formulario de nacimiento para la Carta Astral */
function mostrarFormularioAstral(d) {
  const escena = document.getElementById("escena-tarot");
  document.querySelectorAll(".opcion-palo").forEach(x => x.classList.add("oculto"));
  const ciudades = Object.keys(TIRADAS.CIUDADES_ASTRALES).map(c => `<option value="${c.replace(/,/g, ", ").replace(/  +/g, " ")}"></option>`).join("");
  escena.innerHTML = `
    <div class="centrado astral-form">
      <p style="margin-bottom:14px">Tu carta astral se arma con tu fecha de nacimiento. Con la <b>hora</b> y el <b>lugar</b> exactos, la rueda suma tu ascendente, tus casas y la casa de cada planeta. Llena lo que sepas:</p>
      <form id="form-astral" class="astral-formulario">
        <label class="astral-campo">Fecha de nacimiento *
          <input type="date" id="astral-fecha" required aria-label="Fecha de nacimiento">
        </label>
        <label class="astral-campo">Hora (opcional)
          <input type="time" id="astral-hora" aria-label="Hora de nacimiento">
        </label>
        <label class="astral-campo">Lugar (opcional)
          <input type="text" id="astral-lugar" maxlength="90" list="lista-ciudades" placeholder="Ej.: Quito, Ecuador" aria-label="Lugar de nacimiento">
          <datalist id="lista-ciudades">${ciudades}</datalist>
        </label>
        <button class="btn btn-dorado" type="submit" style="justify-self:center">Revelar mi carta astral</button>
        <p class="oculto astral-aviso" id="aviso-astral">Elige primero tu fecha de nacimiento.</p>
      </form>
    </div>`;
  const form = document.getElementById("form-astral");
  const aviso = document.getElementById("aviso-astral");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const fecha = document.getElementById("astral-fecha").value;
    if (!fecha) { aviso.classList.remove("oculto"); return; }
    aviso.classList.add("oculto");
    const hora = document.getElementById("astral-hora").value;
    const lugar = document.getElementById("astral-lugar").value.trim();
    mostrarCartaAstral(d, { fecha, hora, lugar });
  });
}

function mostrarCartaAstral(d, datos) {
  const escena = document.getElementById("escena-tarot");
  const caja = document.createElement("div");
  caja.id = "contenido-resultado";
  caja.innerHTML = TIRADAS.armarCartaAstral(datos);
  escena.innerHTML = "";
  escena.appendChild(caja);
  document.getElementById("btn-nueva-tirada").addEventListener("click", () => location.reload());
  document.getElementById("btn-guardar").addEventListener("click", () => TIRADAS.guardarAstral(datos));
  caja.style.animation = "mensajeFinalEntrada .6s ease both";
}

function iniciarTirada(tipo) {
  const d = TIRADAS.elegir(tipo);
  if (!d) return;
  const escena = document.getElementById("escena-tarot");
  if (!escena) return;

  document.getElementById("titulo-tirada").innerHTML =
    `<div class="deco">${TIRADAS.elegantIcono[tipo]}</div><h2>${d.tirada.nombre}</h2>
     <p>${d.tirada.corto}</p>`;

  if (d.tirada.astral) {
    mostrarFormularioAstral(d);
    return;
  }

  if (d.tirada.pregunta) {
    escena.innerHTML = `
      <div class="centrado pregunta-box">
        <p style="margin-bottom:14px">Escribe tu pregunta sobre amor, dinero, trabajo, salud, señales o lo que necesites saber. El arcángel más idóneo para tu tema te responderá única y exclusivamente eso:</p>
        <textarea id="input-pregunta" maxlength="240" rows="3" placeholder="Ej.: ¿Esta persona volverá a mi vida?" aria-label="Tu pregunta"></textarea>
        <button class="btn btn-dorado" id="btn-enviar-pregunta">Hacer mi pregunta</button>
        <p class="oculto" id="aviso-pregunta" style="color:#ff80a0;font-size:.9rem;margin-top:10px">Por favor escribe tu pregunta primero.</p>
      </div>`;
    const btn = document.getElementById("btn-enviar-pregunta");
    const aviso = document.getElementById("aviso-pregunta");
    const input = document.getElementById("input-pregunta");
    const enviar = () => {
      const q = input.value.trim();
      if (q.length < 4) { aviso.classList.remove("oculto"); input.focus(); return; }
      aviso.classList.add("oculto");
      d.pregunta = q;
      barajeoVisual(d);
    };
    btn.addEventListener("click", enviar);
    input.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); enviar(); } });
    input.focus();
    return;
  }

  barajeoVisual(d);
}

/* Animación de barajeo: las cartas cambian de lugar */
function barajeoVisual(d) {
  const escena = document.getElementById("escena-tarot");
  escena.innerHTML = `
    <div class="centrado">
      <p style="margin-bottom:18px">${d.pregunta ? "El oráculo revisa tu pregunta y llama al arcángel que cuida ese tema..." : "Cierra los ojos, respira profundo y piensa en tu pregunta"}</p>
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
  const enEstrella = r.tirada.id === "5-cartas";
  const enCruz = r.tirada.id === "cruz-celta";
  if (enEstrella) escenario.classList.add("estrellas");
  if (enCruz) escenario.classList.add("cruz-celta");

  // geometría para la Cruz Celta: [desplazamiento-x, -y, rotación en grados]
  const posCruz = [
    [0, 0, 0], [0, 0, 90], [0, -145, 0], [0, 145, 0], [-170, 0, 0], [170, 0, 0],
    [330, -160, 0], [330, -55, 0], [330, 50, 0], [330, 155, 0]
  ];

  r.tirada.posiciones.forEach((p, i) => {
    const slot = document.createElement("div");
    slot.className = "carta-plaza";
    slot.id = "plaza-" + i;
    if (enEstrella) slot.style.setProperty("--i", i);
    if (enCruz) {
      const c = posCruz[i];
      slot.style.setProperty("--cx", c[0]);
      slot.style.setProperty("--cy", c[1]);
      slot.style.setProperty("--rot", c[2] + "deg");
    }
    slot.innerHTML = `<div class="cara"><div><div class="c-nm">✦</div><div class="c-nombre">Oráculo</div></div></div><div class="reverso"></div><div class="etiqueta">${p[0]}</div>`;
    escenario.appendChild(slot);
  });

  // mazo: las 22 cartas boca abajo; se revelan al tocarlas
  const zonaMazo = document.createElement("div");
  zonaMazo.className = "mazo mazo-eleccion" + (enEstrella || enCruz ? " mazo-layout" : "");
  zonaMazo.style.marginTop = enEstrella || enCruz ? "" : "34px";
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
  escenario.insertAdjacentElement("afterend", zonaMazo);

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

async function mostrarResultado(r) {
  const escena = document.getElementById("escena-tarot");
  if (r.tirada && r.tirada.pregunta && r.pregunta && !r.__analisis) {
    const espera = document.createElement("div");
    espera.className = "centrado";
    espera.innerHTML = '<p style="margin-bottom:14px">El oráculo está leyendo tu pregunta...</p><div class="spinner" style="display:block"></div>';
    escena.innerHTML = "";
    escena.appendChild(espera);
    const nl = await TIRADAS.analisisPreguntaServidor(r.pregunta);
    if (nl) TIRADAS.inyectarAnalisis(r, nl);
  }
  const d = document.createElement("div");
  d.id = "contenido-resultado";
  d.innerHTML = TIRADAS.armarResultado(r);
  escena.innerHTML = "";
  escena.appendChild(d);
  document.getElementById("btn-nueva-tirada").addEventListener("click", () => location.reload());
  document.getElementById("btn-guardar").addEventListener("click", () => TIRADAS.guardar(r));
  TIRADAS.horoscopoLectura();

  if (r.tirada && r.tirada.pregunta && r.pregunta) {
    const nodo = document.getElementById("respuesta-ia");
    if (nodo) nodo.style.opacity = "0.55";
    TIRADAS.pedirReflexionIA(r).then(resp => {
      if (resp && nodo) {
        nodo.textContent = resp;
        nodo.style.opacity = "1";
      } else if (nodo) {
        nodo.style.opacity = "1";
      }
    });
  }
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
    const colorLectura = {
      "1-carta": "240, 190, 120", "3-cartas": "212, 175, 55", "5-cartas": "104, 140, 220",
      "gran-tirada": "160, 110, 240", "lectura-fuerte": "230, 120, 80", "cruz-celta": "90, 200, 160",
      "si-no": "240, 120, 150", "pregunta": "212, 175, 55", "carta-astral": "180, 160, 220"
    };
    TIRADAS.catalogo.forEach((t, i) => {
      const b = document.createElement("a");
      const c = colorLectura[t.id] || "212, 175, 55";
      b.className = "opcion-palo";
      b.href = "/tirada.html?tirada=" + t.id;
      b.style.setProperty("--c", c);
      b.style.setProperty("--delay", (i * 85) + "ms");
      b.setAttribute("aria-label", t.nombre);
      b.innerHTML = `
        <span class="opcion-orbita" aria-hidden="true"></span>
        <span class="opcion-bola" aria-hidden="true">
          <span class="opcion-luz"><i></i><i></i><i></i></span>
          <span class="icono">${TIRADAS.elegantIcono[t.id]}</span>
        </span>
        <strong class="opcion-nombre">${t.nombre}</strong>
        <small class="opcion-corto">${t.corto}</small>
        <span class="opcion-chispas" aria-hidden="true"><i></i><i></i><i></i><i></i></span>`;
      cont.appendChild(b);
    });

    /* inclinación 3D de cada medallón siguiendo el mouse (solo con ratón fino) */
    if (typeof window.matchMedia === "function" && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      cont.querySelectorAll(".opcion-palo").forEach(b => {
        b.addEventListener("mousemove", (e) => {
          const r = b.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width - 0.5;
          const py = (e.clientY - r.top) / r.height - 0.5;
          b.style.setProperty("--rx", (-py * 16).toFixed(2) + "deg");
          b.style.setProperty("--ry", (px * 16).toFixed(2) + "deg");
        });
        b.addEventListener("mouseleave", () => {
          b.style.removeProperty("--rx");
          b.style.removeProperty("--ry");
        });
      });
    }

    /* luces espirituales flotando dentro del menú */
    const paletaFaros = ["212, 175, 55", "160, 110, 240", "104, 140, 220", "240, 120, 150", "230, 150, 60"];
    for (let k = 0; k < 10; k++) {
      const f = document.createElement("span");
      f.className = "faro";
      f.style.setProperty("--fc", paletaFaros[k % paletaFaros.length]);
      f.style.setProperty("--fs", (4 + Math.random() * 5).toFixed(1) + "px");
      f.style.setProperty("--fd", (7 + Math.random() * 6).toFixed(1) + "s");
      f.style.setProperty("--fdelay", (-Math.random() * 12).toFixed(1) + "s");
      f.style.setProperty("--fx", (Math.random() * 60 - 30).toFixed(1) + "px");
      f.style.left = (4 + Math.random() * 92).toFixed(1) + "%";
      cont.appendChild(f);
    }
  }
});