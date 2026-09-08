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
    { id: "pregunta",  nombre: "Pregunta al Oráculo", icono: "🃏", corto: "Escribe tu pregunta y el arcángel idóneo responderá solo ese tema con tres cartas.", n: 3, pregunta: true, posiciones: [["Tu pregunta", "Lo que consultas al cielo"], ["La lección", "Lo que debes mirar"], ["La respuesta", "La señal del oráculo"]] }
  ],

  elegantIcono: { "1-carta": "🕯️", "3-cartas": "💫", "5-cartas": "🌟", "gran-tirada": "🛡️", "lectura-fuerte": "🔥", "cruz-celta": "🕊️", "si-no": "🎯", "pregunta": "🃏" },
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
    return { tirada: t, cartas: [], mazo, fuerte: tipo === "lectura-fuerte" ? true : (t.pregunta ? false : Math.random() < 0.3) };
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
    "El Mundo":       { grupo: "trabajo",     luz: "el ciclo completo y la meta alcanzada",        sombra: "detenerte a un paso de la meta" }
  },

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
        `Mi consejo para hoy: avanza con lo que ${nombresD || "estas cartas"} te dicen. No dudes de ti: fíjate una meta pequeña para hoy y da ese paso. ${A}, desde su ${R}, te acompaña en cada uno.`,
        `Haz esto con calma: deja que ${nombresD || "tu lectura"} te guíe y no corras a decidir cosas grandes todavía. Mantén lo que está bien, agrega un poquito de fe y sigue. ${A} está contigo.`,
        `Elige una sola cosa de todo lo que sientes hoy y actúala: así la luz de ${nombresD || "tus cartas"} no se queda en palabras. ${A} te sostiene desde su ${R} mientras lo haces.`
      ]);
    }
    if (invertidas.length === grupo.length) {
      return this.elegirDe([
        `Mi consejo para hoy: no pelees contra ${nombresI || "estas cartas"}. Solo escucha qué te están avisando y suelta lo que ya no te sirve. ${A} te dice, desde su ${R}: soltar también es avanzar.`,
        `Haz una pausa, sí, pero no te quedes en ella: lo que ${nombresI || "la sombra"} te muestra es la clave para cambiar de rumbo a tiempo. Un paso pequeño y honesto de hoy vale más que diez mañana.`,
        `No lo tomes como castigo: es una señal para frenar y mirar. Deja de dar vueltas a lo mismo, elige una salida posible hoy y empieza por ahí. ${A} sujeta tu mano, desde su ${R}.`
      ]);
    }
    return this.elegirDe([
      `Mi consejo para hoy: quédate con lo bueno de ${nombresD || "tu lectura"} (avanza con eso) y atiende el aviso de ${nombresI || "las invertidas"} (suelta eso). Nada de todo o nada: un pasito hoy, otro mañana. ${A} te acompaña desde su ${R}.`,
      `Haz esto: confirma tu camino con ${nombresD || "la luz"} y corrige una sola cosa que te muestre ${nombresI || "la sombra"}. Lo que pesa hoy se suelta con una decisión pequeña. ${A} camina a tu lado.`,
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
        `Y te regaño, porque venías con la respuesta delante y no querías verla: ${invertidas.map(c => c.nombre).join(" y ")} te lo dijeron tres veces y tú seguías igual. Hoy sí: obedece la señal.`,
        `Un regaño de ${A}, sin rodeos: no es falta de suerte, es que no hiciste la tarea a tiempo. Mira lo que estas cartas te señalan y cambia antes de que la vida tenga que gritártelo.`
      ]);
    }
    return this.elegirDe([
      `Y ${A} te regaña una sola cosa: no conviertas la señal de ${invertidas[0] ? invertidas[0].nombre : "la sombra"} en otra excusa para frenar. Se corrige rápido, se avanza igual de rápido. Hoy.`,
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

  /* relato de una carta en su posición real: sustituye {Pos} por la frase */
  relatoDe(c, posLabel, tono) {
    const def = this.relatos[c.nombre];
    const frags = def ? def[tono] : null;
    const base = frags && frags.length
      ? this.elegirDe(frags)
      : ((this.esencia[c.nombre] || {})[tono] || "una carta que pide ser leída");
    return base.split("{Pos}").join(this.fraseDePos(posLabel) || "tu historia");
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
        texto: `${sombraRelato} ${this.elegirDe(this.empujes)}`,
        cartasHtml: this.reganoCartaHtml(sombras.slice(0, 5))
      });
    }

    const cierrePoderoso = propor >= 0.5
      ? this.elegirDe([
          "Este es el final, y es un llamado a tu grandeza: deja de mirar tu vida desde afuera y entra en ella con todo. Lo que hoy es semilla se vuelve fruto, lo que hoy es herida se vuelve fuerza. Confía, actúa y deja que este mensaje te sostenga cada día.",
          "Este es el final, y es un sí del cielo: lo que has cuidado en silencio pronto será visible para todos. Los ángeles ya no solo te protegen: te acompañan. Sigue caminando con la confianza de quien no está solo y verás tu cosecha.",
          "Llévate esto de la lectura: tu momento está maduro y el cielo lo sabe. No esperes permiso para brillar ni para pedir. Actúa, agradece y avanza: cada paso iluminado que des hoy te acerca a lo que has pedido con el corazón."
        ])
      : this.elegirDe([
          "No hay más vueltas que dar: este es el despertar que pediste. Las cartas no vinieron a castigarte, vinieron a mostrarte lo que no querías ver para que al fin te liberes. Deja de posponer tu verdad, suelta lo que te pesa, perdona lo que te ata, y hoy mismo da el paso que tu corazón viene pidiéndote. Eres más fuerte que tu miedo: demuéstralo.",
          "El mensaje de hoy no te entristece: te despierta. Lo que apareció en sombra es la lista de lo que estás listo para soltar. Nada de esto fue castigo: fue puntada de amor para que dejes de sangrar. Perdona, suelta y vuelve a caminar: el cielo ya puso tu siguiente puerta.",
          "No ignores esta lectura como las anteriores: por algo llega fuerte. El cambio que evitas es pequeño frente al peso que cargas. Decide hoy una cosa, solo una, y hazla: ese primer paso desata lo demás. Estás más cerca de la salida de lo que crees."
        ]);

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
        texto,
        cartasHtml: (tenor === "sombra" || tenor === "mixto")
          ? this.reganoCartaHtml(b.temas.filter(t => t.carta.invertido).map(t => t.carta))
          : "",
        combinacion: this.combinacionDe(b)
      };
    }).concat([{
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
    const refNombre = tipo === "persona" ? (() => { const n = this.personaDePregunta(resultado.pregunta) || "esa persona"; return n === "esa persona" ? n : n.charAt(0).toUpperCase() + n.slice(1); })() : null;

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
    const tipo = this.tipoDePregunta(resultado.pregunta);
    const derechas = cartas.filter(c => !c.invertido).length;
    const sombras = cartas.length - derechas;
    const principal = cartas[0];
    const e = this.esencia[principal.nombre];
    const faceta = principal.invertido ? (e ? e.sombra : "una lección que te pide mirar hacia dentro") : (e ? e.luz : "un mensaje de luz y confianza");
    const lista = cartas.map(c => `${c.nombre}${c.invertido ? " invertida" : ""}`).join(", ");
    const anTema = an.titulo.toLowerCase();

    if (tipo === "fallecido") {
      const nombre = this.personaDePregunta(resultado.pregunta);
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
      return this.capitalizarPrimera(nucleo);
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
      return this.capitalizarPrimera(nucleo);
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
      return this.capitalizarPrimera(nucleo);
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
      return this.capitalizarPrimera(nucleo);
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
      return this.capitalizarPrimera(nucleo);
    }

    if (tipo === "si-no") {
      const nucleo = sombras === 0
        ? `la lectura te responde que SÍ, y con fuerza: ${lista} brillan del derecho y no hay carta en sombra que lo frene. ${A} ve tu asunto destrabado: si la decisión es tuya, esta es la señal para dar el paso.`
        : (derechas > sombras
          ? `la lectura es un SÍ, pero con una condición que no puedes saltarte: ${lista}. Las cartas en sombra te marcan lo que llevas sin mirar. ${A} dice que lo que pides llega cuando ajustas eso primero.`
          : (derechas === 0
            ? `la lectura te responde NO por ahora, y no es castigo: es un “aún no” del cielo. ${lista} te muestran el revés de este tiempo. ${A} te pide frenar, soltar y cambiar el rumbo: cuando lo hagas, la puerta se abre.`
            : `la lectura es un NO por ahora: ${lista}. ${A} ve que insistes donde la energía todavía no te acompaña. No es rechazo, es orden de pasos: atiende la señal y vuelve a preguntar con el corazón liviano.`));
      return this.capitalizarPrimera(nucleo);
    }

    if (tipo === "persona") {
      const nombre = this.personaDePregunta(resultado.pregunta);
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
        return this.capitalizarPrimera(nucleo);
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
      return this.capitalizarPrimera(nucleo);
    }

    const nucleo = this.elegirDe([
      `${principal.nombre} ${principal.invertido ? "está de cabeza y te pide frenar" : "brilla del derecho"} y anuncia ${faceta}. En el contexto de ${anTema}, ${lista} dibujan tu momento. ${A} te guía: mira las señales repetidas, porque tu respuesta no llega por una sola puerta.`,
      `${principal.nombre} ${principal.invertido ? "te pide voltear la mirada" : "se pone de tu lado"} con su mensaje: ${faceta}. ${A} lo confirma en ${anTema}: lo que preguntas ya está en movimiento y ${lista} te marcan hacia dónde fijarte.`
    ]);
    return this.capitalizarPrimera(nucleo);
  },

  /* pide a la IA del servidor la respuesta afinada a la pregunta (si la hay).
     Devuelve null cuando no hay IA disponible y se conserva la determinista. */
  async pedirReflexionIA(resultado) {
    const an = resultado.__analisis;
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
        body: JSON.stringify({ pregunta: resultado.pregunta, tema: an.titulo, cartas })
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
    const texto = this.significadoConjunto(grupo, arc);
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
      const nombre = this.personaDePregunta(resultado.pregunta);
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
            texto: this.significadoConjunto(grupo, arc),
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
      const temas = this.temasEnPregunta(resultadoHTML.pregunta);
      const tipo = this.tipoDePregunta(resultadoHTML.pregunta);
      const analisis = temas[0] || this.analizarPregunta(resultadoHTML.pregunta);
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
          <p class="presencia-arc">${this.fraseArea(aUnido, "cierre")}</p>
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
          ${b.combinacion ? (b.combinacion.cartas && b.combinacion.cartas.length ? `<div class="combo-visual">
            ${b.combinacion.cartas.map(c => this.comboCartaHtml(c)).join('<span class="combo-mas">+</span>')}
            ${b.combinacion.cartas.length > 1 ? '<span class="combo-mas combo-igual">=</span>' : ""}
            <span class="combo-significado">${b.combinacion.enfocada ? "" : `<b>Se unen en ${this.contextoDeCombinacion(b.combinacion.cartas)}:</b> `}${b.combinacion.texto}</span>
            ${b.combinacion.consejo ? `<span class="combo-consejo"><b>Mi consejo:</b> ${b.combinacion.consejo}</span>` : ""}
            ${b.combinacion.regano ? `<span class="combo-regano"><b>Mi regaño:</b> ${b.combinacion.regano}</span>` : ""}
          </div>` : "") : ""}
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

function mostrarResultado(r) {
  const escena = document.getElementById("escena-tarot");
  const d = document.createElement("div");
  d.id = "contenido-resultado";
  d.innerHTML = TIRADAS.armarResultado(r);
  escena.innerHTML = "";
  escena.appendChild(d);
  document.getElementById("btn-nueva-tirada").addEventListener("click", () => location.reload());
  document.getElementById("btn-guardar").addEventListener("click", () => TIRADAS.guardar(r));

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
      "si-no": "240, 120, 150", "pregunta": "212, 175, 55"
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