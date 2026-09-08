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

  /* regaño moldeado por las cartas reales: usa los nombres, la posición y el
     propio mensaje de cada carta en sombra, agrupados por contexto, en la voz
     del arcángel que regenta la lectura */
  regañoDeCartas(resultado, arc) {
    const cartas = resultado.cartas || [];
    const posiciones = (resultado.tirada.posiciones || []).map(p => p[0]);
    const sombras = cartas.filter(c => c.invertido);
    const luces = cartas.filter(c => !c.invertido);
    const A = this.nombreCorto(arc.nombre);
    const R = arc.regencia.toLowerCase();

    /* apertura según el peso de la sombra */
    const apertura = this.elegirDe([
      `Te he puesto tu lectura sobre la mesa y hoy no vengo a consolarte: vengo a abrirte los ojos. Yo, ${A}, te hablo desde mi ${R}.`,
      `He escuchado en silencio lo que tus cartas te cuentan, y soy yo, ${A}, quien te lo dice sin rebajas, desde mi ${R}.`,
      `No me gusta hablarte así, pero tu lectura lo pide. Soy ${A} y te agarro fuerte la mano antes de decirte la verdad.`,
      `He bajado del cielo a propósito para esto: tus cartas llevan tiempo intentando hablarte y no las escuchas. ${A} te lo señala, desde mi ${R}.`,
      `Tu lectura no tiene filtro esta vez, y yo, ${A}, vengo a decírtelo cara a cara, con mi ${R} como respaldo.`
    ]);

    if (!sombras.length) {
      const frag = luces.slice(0, 3).map(c => {
        const e = this.esencia[c.nombre];
        return `${c.emoji} ${c.nombre}: ${e ? e.sombra : "el filo de su mensaje"}`;
      }).join(" ");
      return this.elegirDe([
        `${apertura} Estás caminando por la cornisa y casi no lo ves: ${frag}. No esperes a que una carta se ponga de espaldas: hoy que todo parece "bien", es el mejor día para corregir. Desde mi ${R}, detente, revisa y ajusta antes de que el golpe llegue gratis.`,
        `${apertura} Tus cartas no se han volteado, y sin embargo yo levanto la voz: ${frag}. La vida no siempre avisa con cartas invertidas. Desde mi ${R} te pido que atiendas esto hoy, no cuando se vuelva urgente.`,
        `${apertura} Tus cartas salieron derechas, pero yo sé leer entre líneas: ${frag}. El peligro no está en lo que cayó, sino en lo que llevas tiempo ignorando. Desde mi ${R}, corrígelo antes de que la vida te obligue.`
      ]);
    }

    const grupos = this.agruparContexto(sombras).filter(g => g.cartas.length);

    const piezas = grupos.map(g => {
      if (g.cartas.length === 1) {
        const c = g.cartas[0];
        const e = this.esencia[c.nombre];
        const pos = posiciones[cartas.indexOf(c)] ? ` en ${posiciones[cartas.indexOf(c)].toLowerCase()}` : "";
        return `${c.emoji} ${c.nombre}${c.invertido ? " invertida" : ""}${pos} toca tu punto más delicado: ${e ? e.sombra : "lo que no quieres ver"}. Y te dice: «${c.texto}»`;
      }
      const cs = g.cartas;
      const eSombra = cs.map(c => (this.esencia[c.nombre] ? this.esencia[c.nombre].sombra : "")).filter(Boolean);
      const repetidas = cs.length === 2
        ? `${cs.map(c => c.nombre).join(" y ")} repiten la misma lección en sombra`
        : `${cs.map(c => c.nombre).join(", ")} repiten el mismo patrón en sombra`;
      return `${cs.map(c => c.emoji).join("")} ${repetidas}: ${eSombra.join(" y ")}. Juntas te dicen: «${cs[0].texto}»${cs.length > 1 ? " y «" + cs[1].texto + "»" : ""}`;
    });

    const cuerpo = piezas.slice(0, 4).join(" ");
    const resto = sombras.length > 4 ? ` Y no te engañes: hay más cartas en sombra detrás de estas, todas apuntando al mismo centro. ` : "";
    const puente = (sombras.length === 1 ? [
      `No lo mires como un castigo: te está señalando exactamente lo que estás listo para soltar.`,
      `Pon atención a esa carta: no vino por casualidad, repite un tema que ya te está llamando.`,
      `No te pido que la adivines: te pido que la obedezcas como la única señal que hoy hace falta.`
    ] : [
      `No lo mires como un castigo: estas cartas te señalan exactamente lo que estás listo para soltar.`,
      `Pon atención al hilo que las une: no hay casualidad en que se repita el mismo tema.`,
      `Cada una te habla de algo distinto, pero juntas cuentan una sola historia.`,
      `No son varias lecturas: es una sola lección dicha de cuatro maneras.`,
      `Fíjate cómo se señalan entre ellas: la sombra de una confirma la de la otra.`
    ]);
    const cierre = (sombras.length === 1 ? [
      `Yo, ${A}, desde mi ${R}, te pido una sola cosa hoy: convierte lo que te dolió leer en acción. No necesitas más señales, necesitas obediencia.`,
      `Mira de nuevo la carta que te señalé: no pidas otra señal, ya tienes la tuya. ${A} te lo dice con amor duro: actúa hoy y demuestra que esta lectura no cayó al vacío.`,
      `Esta carta te deja una sola tarea: elige hoy una decisión pequeña y real, y hazla. Yo, ${A}, desde mi ${R}, empujo contigo mientras la cumples.`
    ] : [
      `Yo, ${A}, desde mi ${R}, te pido una sola cosa hoy: elige la que más te dolió leer y conviértela en acción. Cambia una cosa y las demás girarán solas.`,
      `Mira de nuevo las cartas que te señalé: no necesitas más señales, necesitas obediencia. ${A} te lo dice con amor duro: levántate hoy y demuestra que esta lectura no cayó al vacío.`,
      `No te pido que cambies de golpe: te pido una decisión pequeña y real antes de que termine el día. Yo, ${A}, desde mi ${R}, estaré ahí para sostenerte mientras obedeces.`,
      `Cuando quieras comprobar que estas cartas no vinieron al azar, mira que todas señalan lo mismo: tu corazón ya sabe por dónde empezar. ${A} te acompaña desde mi ${R}.`
    ]);

    return `${apertura} ${cuerpo}${resto} ${this.elegirDe(puente)} ${this.elegirDe(cierre)}`;
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

/* interpretación final por áreas: cada arcángel habla de su área en primera
     persona; el tono (luz o sombra) se decide según las cartas de la lectura,
     pero el arcángel no nombra las cartas: solo entrega el mensaje */
  interpretacionFinal(resultado) {
    const cartas = resultado.cartas;
    const total = cartas.length;
    const bien = cartas.filter(c => !c.invertido).length;
    const propor = bien / total;
    const cita = this.citas[Math.floor(Math.random() * this.citas.length)];

    const allAreas = [
      {
        icono: "🛡️", area: "situacion", clave: "miguel", titulo: "Situación y protección",
        luz: [
          "Arcángel Miguel te dice: hoy estás bien protegida. Lo que empiezas hoy va por buen camino. Camina con la cabeza en alto: tu luz es fuerte y nadie la puede apagar.",
          "Arcángel Miguel te dice: los problemas que te preocupaban ya están perdiendo fuerza. Tu camino se arregla poco a poco. Sigue adelante sin mirar atrás.",
          "Arcángel Miguel te dice: tu escudo está firme, pero hoy no es día de pelear: es día de construir. Lo que empiezas ahora está a salvo. No dudes de tu fuerza, el cielo te acompaña."
        ],
        sombra: [
          "Miguel te regaña con cariño pero en serio: llevas tiempo dando tu energía a gente que no te valora. Deja de cuidar tanto a los demás y empieza a cuidarte tú. Hoy di \"no\" a lo que te hace daño.",
          "Miguel te mira serio: peleas las peleas de otros y abandonas las tuyas. Defiendes a quien no te defiende. Elige hoy: tu energía es tuya, y solo tú decides quién la recibe.",
          "Miguel pone su mano en tu hombro y te habla claro: dejaste una puerta abierta y por ahí entran personas que te cansan. Ciérrala sin culpa. Cuidarte no ofende a nadie: es tu deber."
        ]
      },
      {
        icono: "💞", area: "amor", clave: "chamuel", titulo: "Amor y relaciones",
        luz: [
          "Arcángel Chamuel te dice: el amor bueno está llegando a tu vida. Abre tu corazón y deja que entre. Tú mereces que te quieran sin condiciones.",
          "Arcángel Chamuel te dice: el amor que sembraste con paciencia está dando fruto. Alguien te quiere más de lo que crees. Recibir amor no te hace débil: te hace fuerte.",
          "Arcángel Chamuel abraza tus vínculos con su luz rosa: vienen encuentros que sanan viejas heridas. El amor verdadero está cerca: dale espacio y abre la puerta."
        ],
        sombra: [
          "Chamuel te habla con dulzura pero sin dar la vuelta: sigues dando tu amor a quien no lo cuida, o callando lo que sientes por miedo a perder. No ruegues cariño. Di lo que sientes y quiérete tú primero: el amor justo volverá a ti.",
          "Chamuel te mira con tristeza: hay un cariño que da todo y un cariño que solo recibe. Tú ya sabes cuál das. El amor no se gana sufriendo. Quiérete tú primero: todo lo demás se acomoda.",
          "Chamuel te habla firme: estás esperando que alguien te dé el amor que tú no te das. Nadie puede llenar tu vacío desde afuera. Date hoy lo que les pides a otros, y el amor justo encontrará su lugar."
        ]
      },
      {
        icono: "💚", area: "salud", clave: "rafael", titulo: "Salud y energía",
        luz: [
          "Arcángel Rafael te dice: estás sanando, de verdad. Tu cuerpo y tu mente vuelven a estar en paz. Respira, descansa y confía: el cielo ya trabaja en tu salud.",
          "Arcángel Rafael extiende su mano verde: tu energía está volviendo, día a día. No apures las cosas: sanar lleva su tiempo. Descansa algo que has estado negando y celebra cada mejora.",
          "Arcángel Rafael te dice: el cansancio que te pesaba empieza a irse. Escucha a tu cuerpo: es tu mejor amigo. Cuando descansas, comes bien y te mueves, tu fuerza regresa."
        ],
        sombra: [
          "Rafael te toma la mano y te habla claro: hay una parte tuya que estás descuidando. Ese cansancio, ese dolor que callas... Cuidarte no es egoísmo: es lo que necesitas para brillar. Empieza hoy.",
          "Rafael te habla serio: llevas tiempo agotando tu cuerpo como si no se cansara. Quitas tu salud para dársela a otros. Pon tu descanso y tus citas primero: nadie va a cuidarte si tú no empiezas.",
          "Rafael enciende la luz y te muestra lo que niegas: hay un dolor que ya se volvió normal para ti y no debería serlo. Sanar también es dejar de hacerte daño. Detente antes de caer, no después."
        ]
      },
      {
        icono: "📯", area: "mensajes", clave: "gabriel", titulo: "Mensajes y propósito",
        luz: [
          "Arcángel Gabriel te dice: la respuesta que esperas viene en camino. Presta atención a las señales, a las palabras y a las coincidencias: por ahí te está hablando el cielo.",
          "Arcángel Gabriel te trae la palabra que esperabas, antes de que la pidas: la respuesta va a llegar en un mensaje o una conversación. Escucha con atención: el cielo te habla hoy.",
          "Arcángel Gabriel limpia tu mente: tu camino se aclara y vuelves a saber por qué haces lo que haces. No busques el gran anuncio: mira las señales pequeñas y repetidas. Ahí está tu mensaje."
        ],
        sombra: [
          "Gabriel te pide silencio para que escuches: llevas tiempo oyendo solo lo que quieres oír, no lo que necesitas. Cállate un momento, vuelve a preguntar y la respuesta llegará.",
          "Gabriel te mira con franqueza: escuchas solo lo que te consuela y por eso la verdad te sorprende. Hay un mensaje que evitas porque te obligaría a cambiar. Cállate y escúchalo: te habla.",
          "Gabriel alza la voz: dejas palabras sin decir y mensajes sin enviar, y eso te tiene dando vueltas. No es que el cielo calle: eres tú quien se tapa los oídos. Di lo que sientes y la señal aparecerá."
        ]
      },
      {
        icono: "💰", area: "economia", clave: "uriel", titulo: "Economía y abundancia",
        luz: [
          "Arcángel Uriel enciende su antorcha sobre tu dinero: el flujo que pediste se está ordenando y se abren puertas para ti. Administra con calma, decide con claridad y mira los detalles: ahí está tu oportunidad.",
          "Uriel enciende su antorcha sobre tu dinero: el caos que temías se está calmando y tu dinero vuelve a fluir. Mira con ojos claros las oportunidades que otros no ven: están cerca. Actúa con orden y la abundancia responde.",
          "Arcángel Uriel te da claridad para tu bolsillo: lo que hoy administras bien se vuelve lo que mañana te sostiene. No mires cuánto hay, mira hacia dónde va. Abre una puerta hoy, con calma."
        ],
        sombra: [
          "Uriel te mira de frente: tu dinero pide orden. Hay gastos que se repiten y promesas que suenan fuerte pero no llegan. No es castigo, es aviso: cierra las fugas, pon límites a tu generosidad y deja espacio para lo bueno.",
          "Uriel te habla sin vueltas: tu dinero refleja tus decisiones repetidas, no tu suerte. Hay gastos que tapan vacíos y deudas que sostienen apariencias. Ordena tu casa: el dinero también necesita límites.",
          "Uriel levanta la antorcha y ve lo que escondes: te da miedo mirar los números, pedir lo que vales o soltar lo que ya no te conviene. Lo bueno no llega donde hay engaño. Mira tus cuentas hoy y deja espacio para lo nuevo."
        ]
      },
      {
        icono: "🔓", area: "bloqueo", clave: "zadkiel", titulo: "Bloqueos a liberar",
        luz: [
          "Arcángel Zadkiel te dice: la liberación ya empezó. Suelta la culpa, perdona lo que haya que perdonar y siente cuánta paz entra cuando dejas de cargar el pasado. Solo tú sostienes esa cadena: hoy puedes soltarla.",
          "Arcángel Zadkiel desata tus cadenas: lo que te ataba está perdiendo fuerza porque dejaste de alimentarlo. Perdonar hoy, a otros y a ti, abre todo lo demás. Caminarás más ligera de lo que recuerdas.",
          "Arcángel Zadkiel disuelve el rencor guardado: soltar no es olvidar, es dejar de cargar lo que ya cumplió. Recoge tu energía del pasado y ponla en el presente. La paz no depende de que el otro cambie: depende de que sueltes."
        ],
        sombra: [
          "Zadkiel te señala la cadena que arrastras de hace tiempo: un rencor, un miedo ya vencido o una culpa que no es tuya. Cada día sin perdonar pesa más. Suelta la piedra, perdónate y perdona: tu corazón no fue hecho para cargar tanto.",
          "Zadkiel te señala el peso que cargas: un agravio que repasaste mil veces o un perdón que te niegas. Cada vez que lo recuerdas, lo vuelves a cargar. El otro quizá ni lo sabe; tú sí: es hora de dejarlo.",
          "Zadkiel toma tus manos y te pide soltar la piedra: te aferras a tu dolor como si fuera tu nombre. \"Soy quien fue herido\" se volvió tu escudo y tu jaula. Suelta esa historia: frente a ti hay más vida que recuerdo, y es tuya."
        ]
      },
      {
        icono: "🌟", area: "futuro", clave: "jofiel", titulo: "Futuro e inspiración",
        luz: [
          "Arcángel Jofiel te dice: lo que viene está bien alineado contigo y tu luz ya florece. Confía en el proceso, suelta lo que cumplió su tiempo y camina hacia lo nuevo: el cielo está acomodando todo a tu favor.",
          "Arcángel Jofiel te muestra el camino iluminado: lo que viene está hecho con lo mejor de ti. Suelta el proyecto viejo, confía en el ciclo nuevo y camina tranquila: la inspiración se cultiva y ya está floreciendo.",
          "Arcángel Jofiel enciende tu cielo: el futuro se ordena a tu favor, con más belleza de la que imaginas. No necesitas verlo todo: necesitas dar el primer paso con fe. Tu luz ya ilumina el camino."
        ],
        sombra: [
          "Jofiel apaga su lámpara un momento para que lo veas: lo que sueñas no llegará mientras sigas mirando atrás o comparándote con los demás. Tu futuro no se recibe: se construye, y empieza en la decisión de hoy. Enciende tu luz y camina.",
          "Jofiel apaga la lámpara y te muestra la verdad: estás pintando tu futuro con los colores del miedo y del pasado. El porvenir llega a quien lo camina, no a quien lo teme. Deja de esperar pérdidas y empieza a construir.",
          "Jofiel te habla con cariño firme: comparas tu camino con los atajos de otros y por eso crees que vas tarde. No vas tarde: solo falta corregir un desvío. La inspiración vuelve cuando dejas de medirte con los demás y te mides con tu propia luz."
        ]
      }
    ];

    /* filtra solo las áreas de los arcángeles que participan en esta lectura */
    const elegidos = (resultado.__arcangeles || this.arcangelesDeLectura(resultado)).map(a => a.clave);
    let areas = allAreas.filter(a => elegidos.includes(a.clave));

    /* en la Lectura Fuerte corta, no siempre se repiten las mismas 7 áreas:
       se muestra una mezcla de 5 para variar de lectura en lectura */
    if (resultado.fuerte && areas.length > 5) {
      const sobrantes = this.barajar([...areas]).slice(0, areas.length - 5);
      areas = areas.filter(a => !sobrantes.includes(a));
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

    const finalBloques = areas.map(a => {
      const tono = resultado.fuerte ? "fuerte" : (propor >= 0.5 ? "luz" : "sombra");
      const texto = tono === "fuerte"
        ? this.elegirDe(this.voces[a.clave].fuerte)
        : this.elegirDe(a[tono] || (propor >= 0.5 ? a.luz : a.sombra));
      return {
        icono: a.icono,
        area: a.area,
        titulo: a.titulo,
        arcangel: this.arcangeles[a.clave],
        regano: resultado.fuerte || propor < 0.5,
        texto
      };
    });

    // regaño moldeado por las cartas reales, dicho por el arcángel que
    // corresponde al contexto de las cartas (no siempre el mismo).
    const clavesAreas = areas.map(a => a.clave);
    const regente = this.arcangelDeMensaje(resultado, clavesAreas);
    const presenciaRegano = this.elegirDe([
      `${regente.nombre} no te suelta la mano, pero hoy te aprieta fuerte:`,
      `${regente.nombre} se planta frente a ti con su ${regente.regencia.toLowerCase()} en la mano:`,
      `${regente.nombre} te mira fijo y no te deja apartar la vista:`,
      `${regente.nombre} levanta la voz para que la escuches, y lo dice con amor de fuego:`
    ]);
    /* el regaño moldeado por las cartas solo tiene sentido con 3+ cartas:
       con una sola carta no hay sombras que contrastar ni combinación que formar */
    if (resultado.cartas.length >= 3) {
      if (resultado.fuerte) {
        finalBloques.push({
          icono: "🔥",
          area: "fuerte",
          titulo: "El regaño final",
          arcangel: regente,
          regano: true,
          presencia: presenciaRegano,
          texto: this.regañoDeCartas(resultado, regente)
        });
      } else if (propor < 0.5) {
        finalBloques.push({
          icono: "🔥",
          area: "regano",
          titulo: "Lo que tus cartas te regañan",
          arcangel: regente,
          regano: true,
          presencia: presenciaRegano,
          texto: this.regañoDeCartas(resultado, regente),
          cartasHtml: this.reganoCartaHtml(resultado.cartas.filter(c => c.invertido))
        });
      }
    }

    /* la combinación de cartas solo aparece a partir de 3 cartas: con una sola
       no hay nada que combinar */
    if (resultado.cartas.length >= 3) finalBloques.push(this.bloqueCombinacionGlobal(resultado));
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

  /* voces de cada arcángel en primera persona: opinión luminosa, aviso
     matizado o regaño firme; el arcángel nunca nombra las cartas, solo
     entrega el mensaje que su lectura le inspira */
  voces: {
    miguel: {
      luz: "Arcángel Miguel te dice: hoy estás protegida y más fuerte de lo que crees. Nada puede tumbarte mientras camines con fe y pongas tus límites. Esta pelea no es tuya sola: la ganamos los dos.",
      mixto: "Arcángel Miguel te dice: tienes protección, sí, pero hay una grieta que no puedes seguir ignorando. Hay gente cerca que gasta tu energía y tú no dices nada. Refuerza tu escudo, elige bien tus peleas y no dejes tu cuidado en manos de quien no te cuida.",
      sombra: "Arcángel Miguel te regaña: bajaste tu escudo demasiado pronto. Estás expuesta donde no hay protección y entregas tu fuerza donde no te valoran. Es hora de ponerte firme, reclamar tu lugar y dejar de dar tu poder a quien no lo merece. Levántate y defiéndete.",
      fuerte: [
        "¡Basta de hacerte la fuerte afuera y la frágil adentro! Arcángel Miguel te habla claro: estás dejando entrar a tu vida a quien no debería, y tú misma les abres la puerta. Deja de pedir permiso para cuidarte y deja de explicar por qué te cuidas. Tu paz no se negocia: se defiende. Hoy mismo pon los límites que has estado posponiendo.",
        "¡Levántate y defiéndete! Arcángel Miguel no te suelta la mano, pero hoy no vino a consolarte: vino a armarte. Llevas tanto tiempo cediendo tu lugar, agachando la cabeza y dejando que otros decidan por ti, que confundiste humildad con rendirte. Vuelve a tu lugar: reclama lo tuyo, corta en seco lo que te desgasta y camina con la dignidad de quien sabe que la luz que lo protege también lo obliga. Ya es hora.",
        "¡Tu tiempo no se regala! Arcángel Miguel pone su espada entre tú y esa gente que solo aparece cuando necesita algo. Sí, te he visto: dices que no puedes decir que no, que te da pena, que 'mejor no hacer ruido'. Y mientras tanto ellos se llenan de tu energía y tú llenas sus vacíos. Deja de ser el que siempre da y nunca recibe: hoy di un alto.",
        "¡Deja de defenderlos! Arcángel Miguel te mira serio: pones tu escudo delante de quien jamás lo pondría por ti. Pregúntate por qué eres tan cuidadosa con tu paciencia y tan dura contigo. Defiende a quien también te defienda, espera a quien también te espere. Tu protección no es un regalo: es un derecho que repartiste mal y hoy recuperas."
      ]
    },
    chamuel: {
      luz: "Arcángel Chamuel te dice: el amor real ya está tocando tu corazón. El amor va a llegar, a sanar o a liberarte justo lo que necesitas. Abre las manos y recibe, sin miedo a querer ni a que te quieran. El cielo confirma tu unión.",
      mixto: "Arcángel Chamuel te dice: hay amor, sí, pero también hay un nudo que duele en silencio. No confundas silencio con paz ni distancia con indiferencia. Habla lo que sientes con honestidad: decirlo no rompe nada, callarlo sí puede romperlo todo.",
      sombra: "Arcángel Chamuel te regaña: estás poniendo tu corazón donde no lo cuidan, o cerrando la puerta a quien sí te quiere bien. Deja de rogar cariño donde solo hay ego. Quiérete con dignidad: el amor que mereces empieza por el que tú misma te das.",
      fuerte: [
        "¡Abre los ojos! Arcángel Chamuel te habla sin dulzura esta vez: sigues entregando tu corazón a quien te lo devuelve roto, y encima te sientes culpable. Deja de confundir amor con sacrificio y de perdonar lo que ni siquiera te han pedido perdón. Quiérete con dignidad o el amor pasará de largo. Basta de rogar cariño: el amor que mereces nace de ti.",
        "¡No ames desde la falta! Arcángel Chamuel pone su rosa al revés para que la veas: buscas en otros lo que te niegas a darte, y por eso cada vínculo termina doliendo igual. El patrón no son ellos: eres tú eligiendo quedarte donde no te valoran. Hoy corta el círculo: pon tu nombre primero en tu propia lista, y el amor que pide entrar encontrará una casa que ya sabe cuánto vale.",
        "¡No es el mismo amor con otras caras! Arcángel Chamuel te muestra el guion que se repite: empiezas ilusionada, luego cedes de todo, y terminas vacía diciéndote 'es que esta vez es distinto'. No lo es, y lo sabes. La única carta que cambia el juego eres tú. Cambia tu parte y el libreto entero se rompe.",
        "¡Deja de pedir permiso para quererte! Arcángel Chamuel te lo grita con su luz rosa firme: no hace falta que otro te escoja para que tú te quieras. El amor que esperas por la puerta de enfrente ya está en tu casa: es el que no te has dado. Quiérete primero, sin condiciones, y mira cómo cambia la fila en tu puerta."
      ]
    },
    rafael: {
      luz: "Arcángel Rafael te dice: estás sanando, de verdad. Tu cuerpo, tu mente y tu alma se están equilibrando otra vez. Respira hondo, descansa y confía: la medicina del cielo ya trabaja en ti.",
      mixto: "Arcángel Rafael te dice: la sanación viene en camino, pero hay algo que te niegas a atender. Ese cansancio, ese dolor o esa calma que pospones tiene voz. Escúchala hoy: cuidarte no es egoísmo, es el único camino para seguir brillando.",
      sombra: "Arcángel Rafael te regaña: deja de descuidarte. Te das a todos y no te queda nada para ti, y tu cuerpo te lo está avisando. No dejes para mañana tu salud ni tu paz: el descanso y el cuidado no se ganan, se toman. Empieza hoy.",
      fuerte: [
        "¡Detente! Arcángel Rafael habla en serio: estás apagando la única vela que ilumina tu vida, y esa vela eres tú. Siempre dejas tu salud y tu descanso para el final, siempre eres el último en tu lista, y tu cuerpo ya te está cobrando. Deja de sacrificarte por quienes ni se dan cuenta. Cuidarte no es egoísmo: es tu obligación contigo. Hoy mismo, una cosa: descansa.",
        "¡No desaparezcas dando! Arcángel Rafael alza la voz: cuidas a todos menos a ti. Sostienes, escuchas, cargas, y cuando te miras al espejo no reconoces tu cara. Tu energía no es infinita. Di no hoy a lo que te vacía, di sí al descanso que evitas, y deja que la sanación empiece por la única persona que puede hacerlo por ti.",
        "¡El vaso ya rebosa! Arcángel Rafael te toma la mano y te enseña la cuenta que tu cuerpo lleva: cansancio que niegas, dolores que haces normales, ansiedad que escondes. No necesito más cartas para saber qué te pasa: lo estás contando con tus hombros, tu respiración y tu sueño. Hoy no te pido gran cosa, te pido algo pequeño: elige una cosa que te cuide y hazla como si fuera sagrada.",
        "¡Tu cuerpo te está hablando y no lo escuchas! Arcángel Rafael te lo dice como médico y amigo: cada señal que ignoras hoy se convierte en un problema mañana. Deja de tratar tu salud como un trámite que harás 'cuando puedas'. Tu energía es el suelo donde crece todo lo demás: si no te cuidas, nada de lo que quieres puede florecer."
      ]
    },
    gabriel: {
      luz: "Arcángel Gabriel te dice: la respuesta que esperas viene en camino y tu propósito se aclara. Presta atención a las señales, a las palabras y a las coincidencias: por ahí te está hablando el cielo, y esta vez no fallarás.",
      mixto: "Arcángel Gabriel te dice: la verdad está cerca, pero llega envuelta en ruido. No te apresures: revisa lo que escuchas, compara lo que crees, y el mensaje puro llegará a tu corazón sin que tengas que forzarlo.",
      sombra: "Arcángel Gabriel te regaña: dejaste de escuchar. Repites lo que quieres oír en vez de lo que necesitas, y por eso sigues en el mismo lugar. Cállate un momento, vuelve a preguntar y abre los oídos: la respuesta no llega hasta que haces silencio.",
      fuerte: [
        "¡Deja de hacerte el sordo! Arcángel Gabriel te habla fuerte para que lo escuches: llevas años oyendo lo que quieres y tapando lo que necesitas. Te escondes detrás del ruido, del miedo y de las excusas. Hoy calla todo, siéntate y escucha la verdad que ya sabes: la respuesta siempre estuvo ahí. No pidas más señales si no piensas obedecerlas.",
        "¡La respuesta ya llegó, no pidas otra! Arcángel Gabriel te mira a los ojos: andas juntando señales como si el cielo no te hubiera hablado mil veces. La respuesta no cambia porque no te gusta. Lo que falta no es una señal nueva: falta que obedezcas la que ya tienes. Deja de negociar con el cielo y haz lo que ya sabes que debes hacer.",
        "¡Deja de hacerte el despistado! Arcángel Gabriel aparta el ruido: no necesitas más información, necesitas silencio para entender la que ya tienes. Te dices 'no sé qué hacer', pero sí lo sabes; solo te asusta hacerlo. Cállate las excusas un día y escucha tu propia voz: esa también soy yo hablándote por dentro.",
        "¡La señal te llegó más de una vez! Arcángel Gabriel te cuenta las veces que pasó frente a tus ojos: esa conversación, esa coincidencia, ese aviso repetido. Llevas tiempo diciendo 'qué casualidad' cuando era una llamada de frente. Deja de preguntarle al tarot lo mismo y empieza a obedecer lo que ya te respondió."
      ]
    },
    uriel: {
      luz: "Arcángel Uriel te dice: tu luz interior se encendió y ahora ves con claridad lo que otros no ven. Confía en esa certeza que sientes en el pecho: tus decisiones tienen luz propia y te llevarán a buen puerto.",
      mixto: "Arcángel Uriel te dice: tienes la verdad cerca, pero el impulso te empuja a decidir antes de tiempo. Detente, mira y compara. La sabiduría no está en actuar más rápido, sino en mirar más profundo.",
      sombra: "Arcángel Uriel te regaña: estás actuando por impulso y dejando que la emoción nuble tu juicio, y eso te está costando caro. Pide tiempo, toma distancia y decide con la luz, no con el miedo. No corras: primero mira.",
      fuerte: [
        "¡Decide de una vez! Arcángel Uriel te habla sin vueltas: llevas tanto tiempo dudando que ya no es prudencia, es miedo con disfraz. No actúes por impulso, sí, pero tampoco te quedes parada esperando el momento perfecto: la vida se te pasa esperando. Mira con claridad, decide con firmeza y camina. El que no elige, elige perder.",
        "¡Enciende la luz o elige la oscuridad! Arcángel Uriel no te da más tiempo: pusiste tu vida en pausa esperando garantías que nunca llegarán, y mientras tanto el tiempo pasa y las oportunidades se alejan. No necesitas ver todo el camino: necesitas prender la antorcha y caminar. Decidir es vivir. Estás a una sola decisión firme de cambiar tu rumbo: tómala hoy.",
        "¡Tu parálisis tiene nombre: miedo! Arcángel Uriel te lo traduce sin pena: esa 'prudencia' que usas es excusa para no equivocarte, y no equivocarte se volvió tu forma de no vivir. Mira bien, sí, pero con plazo. La sabiduría no es esperar a tener certeza: es decidir con la luz que ya tienes y ajustar en el camino. Prende la antorcha y anda.",
        "¡Una decisión a tiempo vale más que diez perfectas tarde! Arcángel Uriel alza la luz sobre el tiempo que pierdes revisando lo mismo: el análisis ya cumplió. Lo que estudias un millón de veces no gana verdad, gana retraso. Elige hoy una dirección con lo que sabes y comprométete: el camino se ilumina mientras caminas, no mientras ensayas."
      ]
    },
    zadkiel: {
      luz: "Arcángel Zadkiel te dice: la liberación llegó. Suelta la culpa, perdona lo que haya que perdonar y siente cuánta libertad entra cuando dejas de cargar el pasado. El pasado pesa menos hoy: esta es tu hora de soltar las cadenas y caminar ligero.",
      mixto: "Arcángel Zadkiel te dice: la llave está en tu mano, pero hay una cadena que tú mismo sigues poniendo. No se trata solo de que otros te suelten: hay algo que debes soltar tú. Date permiso hoy y el cielo te sostiene.",
      sombra: "Arcángel Zadkiel te regaña: llevas demasiado tiempo atada a la culpa, al rencor o a un pasado que ya no existe. Cada día que no perdonas, la cadena pesa más. Suelta la piedra, perdónate y perdona: tu alma no fue hecha para cargar tanto.",
      fuerte: [
        "¡Suelta esa piedra! Arcángel Zadkiel te habla sin medias palabras: el pasado que arrastras es tuyo porque tú lo cargas, no porque te lo hayan puesto. Perdonar no es para el otro: es para ti. Y si el otro no se arrepiente, perdonas igual, para soltarte tú. El rencor te está comiendo viva, y lo sabes. Basta de justificarlo.",
        "¡No eres tu cicatriz! Arcángel Zadkiel rompe la cadena de un golpe: llevas años presentándote como alguien que fue herido, como si ese recuerdo fuera tu nombre. Lo que te pasó ya no te define, salvo que tú lo mantengas en el trono. Mira adelante: hay vida esperándote lejos de ese capítulo. Suelta la historia que te cuentas sobre tu pasado y deja que hoy sea otro principio.",
        "¡El pasado no tiene llaves de tu casa! Arcángel Zadkiel te lo grita con su luz violeta: ese agravio, esa culpa y esa persona se fueron, pero tú sigues pagando su alquiler con paz, sueño y presente. Cada vez que vuelves a contarlo, la cadena vuelve a cerrarse. Hoy corta el ciclo: perdona no porque lo merezcan, sino porque tú necesitas soltar el peso.",
        "¡Deja de llevar cuentas de quién te falló! Arcángel Zadkiel te mira con franqueza: mientras mides y repasas cada traición, el otro vive su vida y tú vives la de él, en círculo. Perdonar no borra lo que pasó: deja de cobrárselo a tu presente. Suelta la factura, agradece la lección y vuelve a tu propia vida, que te está esperando."
      ]
    },
    jofiel: {
      luz: "Arcángel Jofiel te dice: la belleza y la luz que buscas ya están floreciendo a tu alrededor. Rodéate de lo que te hace bien, confía en tu creatividad y verás tu mundo brillar con tus propios colores. Lo bueno que esperas ya viene.",
      mixto: "Arcángel Jofiel te dice: hay luz, pero todavía tienes los ojos puestos en lo que no fue. Deja de mirar atrás y déjate inspirar por lo nuevo. La belleza no entra donde la mirada anda nublada: limpia tu ventana y verás.",
      sombra: "Arcángel Jofiel te regaña: dejaste de ver la luz que sí tienes. Te comparas con otros y apagas tu propio camino, y así la inspiración huye de ti. Deja de mirar a un lado y enciende tu propia lámpara: tu belleza no necesita permiso.",
      fuerte: [
        "¡Enciende tu luz! Arcángel Jofiel te habla con energía: tienes un sol dentro y pasas la vida mirando la lámpara del vecino. Te comparas, te quitas valor y apagas tu chispa. Tu camino no es el de nadie más y tu belleza no pide permiso. Deja de mirar a los lados, mira hacia ti, y verás que todo lo que buscas ya estaba en ti.",
        "¡Deja de apagarte para que otros brillen! Arcángel Jofiel te levanta la barbilla: cedes tu luz, tu tiempo y tu creatividad, y te quedas con lo que sobra. Tu inspiración no es un favor que prestas: es un derecho que usas. Vuelve a ti, retoma lo que amas y acéptalo en voz alta. Cuando tu luz se prende por fin, nada ni nadie podrá apagarla.",
        "¡Comparar apaga tu propia estrella! Arcángel Jofiel te toma la cara y te mira: cuando miras el camino de otros, dejas de ver el tuyo, que es el único que te toca. Detrás de esa vida que envidias hay un precio que no pagaste. Vuelve a tus propios sueños, retómalos desde donde los dejaste, y verás que tu luz siempre estuvo encendida.",
        "¡Tu alegría también tiene fecha! Arcángel Jofiel te señala el calendario: llevas tanto tiempo dejando lo que te ilumina 'para cuando todo esté bien' que olvidaste lo que se siente. La alegría no espera a que la merezcas: se cultiva en el ahora. Retoma hoy una sola cosa que amas, solo una, y deja que tu sonrisa recuerde el camino."
      ]
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
      const arc = b.arcangel;
      const nombreTemas = b.temas.map(t => t.tema.toLowerCase()).join(" y ");
      let texto;
      if (resultado.fuerte) {
        texto = this.elegirDe(this.voces[b.clave].fuerte);
      } else if (tenor === "sombra") {
        const cs = b.temas.map(t => t.carta);
        texto = this.elegirDe([
          `${arc.nombre} revisa ${nombreTemas} y encuentra tus cartas dadas vuelta: ${cs.map(c => `${c.nombre} invertida ${this.esencia[c.nombre] ? "muestra " + this.esencia[c.nombre].sombra : "no quiere ser mirada"}`).join("; ")}. Atiende ese lugar hoy: la sombra se va cuando la miras de frente.`,
          `${arc.nombre} te habla firme en ${nombreTemas}: todas las cartas de este rincón te muestran su revés, y cada una señala la misma puerta. ${cs.length === 1 ? "Mira la carta que te avisa: no es un no, es un desvío que corregir." : "No es un no: es el patrón que repites en este terreno."} Devuélveles la luz desde su ${arc.regencia.toLowerCase()}.`
        ]);
      } else {
        texto = this.elegirDe(this.voces[b.clave][tenor]);
      }
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
  aperturaPregunta(analisis, resultado) {
    const arc = this.arcangeles[analisis.clave];
    const A = this.nombreCorto(arc.nombre);
    const R = arc.regencia.toLowerCase();
    const q = `«${this.escapar(String(resultado.pregunta || "").trim())}»`;
    return this.elegirDe([
      `Yo, ${A}, respondo desde mi ${R} directamente a tu pregunta ${q}:`,
      `He leído en el silencio del cielo tu pregunta ${q} y, ${A}, te respondo desde mi ${R}:`,
      `${A}, el arcángel que cuida la ${R}, ha escuchado tu pregunta ${q}. Escucha su respuesta:`
    ]);
  },

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
    const apertura = this.aperturaPregunta(an, resultado);
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
      return `${apertura} ${nucleo}`;
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
      return `${apertura} ${nucleo}`;
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
      return `${apertura} ${nucleo}`;
    }

    if (tipo === "salud") {
      const esSiNoS = this.esPreguntaSiNo(resultado.pregunta);
      let nucleo;
      if (esSiNoS) {
        const veredicto = sombras === 0 ? "SÍ, con la energía a tu favor" : (derechas > sombras ? "sí, pero el proceso pide tiempo y cuidado" : "todavía no está de cara");
        nucleo = this.elegirDe([
          `sobre tu salud, la lectura responde ${veredicto}: ${lista}. ${A} ve tu cuerpo y tu ánimo hablando el mismo idioma: atiende hoy lo que ya sabes que te pide (descanso, chequeo, alimento) y la señal mejora con tu acción, no con tu miedo.`,
          `${lista} responden a tu consulta de salud con la luz de ${A}: ${veredicto}. No es una sentencia, es un mapa: el cuerpo se acompaña, no se asusta. Da un paso concreto y humano hoy.`
        ]);
      } else if (sombras === 0) {
        nucleo = this.elegirDe([
          `tu energía vital está en buen pulso: ${lista}. ${A} te dice que tu cuerpo responde y que tu mayor aliado es tu calma. Descansa lo que pida, hidrátate, muévete y escucha las señales sin dramatizarlas: vas bien.`,
          `la lectura de tu salud está limpia: ${lista}. ${A} ve vitalidad y recuperación en marcha. No se trata de esperar milagros: se trata de sostener cada día con cuidado y gratitud.`
        ]);
      } else if (sombras < derechas) {
        nucleo = this.elegirDe([
          `hay una mejora real, pero hay algo que sigues descuidando: ${lista}. ${A} te lo señala con suavidad: el cansancio que normalizas, la revisión que pospones, el sueño que recortas. Tu cuerpo te habla: dale la cita que merece.`,
          `tus cartas mezclan luz y avisos en tu salud: ${lista}. ${A} ve avance con un nudo pendiente. Atiende primero lo que más se repite en tu mente: ese es el tema que tu cuerpo te pide mirar.`
        ]);
      } else {
        nucleo = this.elegirDe([
          `tu lectura en salud pide frenar y mirar: ${lista}. ${A} no te augura, te acompaña: cuando las sombras tocan el cuerpo, la respuesta es humildad y cuidado. Consulta, descansa y deja de cargar a solas lo que tiene apoyo.`,
          `las cartas te muestran la parte de tu salud que evitas: ${lista}. ${A} te dice que el cuerpo no se persigue con miedo, se sostiene con constancia. Empieza por una cita o un descanso real: ese es el primer paso de la sanación.`
        ]);
      }
      return `${apertura} ${nucleo}`;
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
      return `${apertura} ${nucleo}`;
    }

    if (tipo === "si-no") {
      const nucleo = sombras === 0
        ? `la lectura te responde que SÍ, y con fuerza: ${lista} brillan del derecho y no hay carta en sombra que lo frene. ${A} ve tu asunto destrabado: si la decisión es tuya, esta es la señal para dar el paso.`
        : (derechas > sombras
          ? `la lectura es un SÍ, pero con una condición que no puedes saltarte: ${lista}. Las cartas en sombra te marcan lo que llevas sin mirar. ${A} dice que lo que pides llega cuando ajustas eso primero.`
          : (derechas === 0
            ? `la lectura te responde NO por ahora, y no es castigo: es un “aún no” del cielo. ${lista} te muestran el revés de este tiempo. ${A} te pide frenar, soltar y cambiar el rumbo: cuando lo hagas, la puerta se abre.`
            : `la lectura es un NO por ahora: ${lista}. ${A} ve que insistes donde la energía todavía no te acompaña. No es rechazo, es orden de pasos: atiende la señal y vuelve a preguntar con el corazón liviano.`));
      return `${apertura} ${nucleo}`;
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
            `sobre ${ref}, tus cartas mezclan luz y señales de silencio: ${lista}. ${A} percibe que sí hay algo que no cuenta, pero no es lo que temes: es algo que está decidiendo en voz baja. No fuerces: dale una puerta abierta y escucha cuando llegue.`
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
        return `${apertura} ${nucleo}`;
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
      return `${apertura} ${nucleo}`;
    }

    const nucleo = this.elegirDe([
      `tu lectura dice así: ${lista}. ${principal.nombre} ${principal.invertido ? "está de cabeza" : "brilla del derecho"} y anuncia ${faceta}. ${A} te guía en ${anTema}: mira las señales repetidas, porque tu respuesta no llega por una sola puerta.`,
      `las cartas responden al corazón de tu consulta: ${lista}. ${principal.nombre} ${principal.invertido ? "te pide voltear la mirada" : "se pone de tu lado"} con su mensaje: ${faceta}. ${A} lo confirma en ${anTema}: lo que preguntas ya está en movimiento, solo fíjate hacia dónde.`
    ]);
    return `${apertura} ${nucleo}`;
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
        `${sobre}${A} une estas cartas para responderte: ${encadenar(derechas)}.`,
        `${sobre}la combinación te responde: ${encadenar(derechas)}.`
      ]);
    } else if (tipo === "sombra") {
      texto = this.elegirDe([
        `${sobre}las cartas se pliegan juntas y dicen una sola cosa: ${encadenar(invertidas)}.`,
        `${sobre}la consulta se responde con todas las cartas en sombra: ${encadenar(invertidas)}.`
      ]);
    } else {
      texto = this.elegirDe([
        `${sobre}${A} combina dos voces: ${encadenar(derechas)}; y en paralelo, ${encadenar(invertidas)}.`,
        `${sobre}la combinación mezcla señal y aviso: ${encadenar(derechas)}; mientras tanto, ${encadenar(invertidas)}.`
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
          `Da el paso que ya sientes correcto y no pidas más señales. Tu consulta ya está respondida: ahora falta el acto.`,
          `Actúa hoy una cosa pequeña y real: la luz de esta combinación se confirma en el movimiento, no en la espera.`
        ])
      : (tipo === "sombra"
          ? this.elegirDe([
              `Frena antes de insistir: suelta la forma que venías usando, descansa y vuelve a preguntar con el corazón liviano.`,
              `No dejes que el miedo decida por ti: la sombra te pide un cambio concreto, no una retirada. Corrige el rumbo y vuelve a intentar con calma.`
            ])
          : this.elegirDe([
              `Quédate con lo que ya funciona y corrige UNA sola cosa de las que la sombra señala. Un paso, hoy.`,
              `Confirma lo que avanza y suelta lo que pesa. El orden de los pasos también es parte de la señal.`
            ]));

    let regano = tipo === "normal"
      ? this.elegirDe([
          `No conviertas la respuesta clara que acabo de darte en otra excusa para esperar. Hoy, con calma, actúala.`,
          `Deja de pedir otra vez lo que la combinación ya te respondió. Escucha, decide y no repitas la consulta.`
        ])
      : (tipo === "sombra"
          ? this.elegirDe([
              `Llevas la respuesta delante y no la quieres ver. Estas cartas te señalan tu tarea; hazla antes de volver a preguntar.`,
              `La pregunta que repites no se cansa: la sombra sigue ahí esperando tu cambio, no tu miedo.`
            ])
          : this.elegirDe([
              `No te quedes solo con la mitad que te gusta de la respuesta. La sombra también contesta tu pregunta, y esa parte también es tuya.`,
              `No busques una combinación «perfecta» para seguir preguntando. Esta mezcla ES la respuesta: afírmala y corrige.`
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