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
    { id: "si-no",     nombre: "Sí o No directo", icono: "🎯", corto: "Una carta, una respuesta clara para tu pregunta.", n: 1, posiciones: [["Tu respuesta", "El veredicto del oráculo"]] }
  ],

  elegantIcono: { "1-carta": "🕯️", "3-cartas": "💫", "5-cartas": "🌟", "gran-tirada": "🛡️", "lectura-fuerte": "🔥", "cruz-celta": "🕊️", "si-no": "🎯" },
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
    return { tirada: t, cartas: [], mazo, fuerte: tipo === "lectura-fuerte" ? true : Math.random() < 0.3 };
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
    "La Rueda":       { grupo: "animo",       luz: "el destino que gira a tu favor",               sombra: "aferrarte a lo que la rueda ya dejó atrás" },
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
        `Una sola carta al frente de tu lectura es un mensaje en mayúsculas: ${faceta}. ${A} lo custodia desde su ${R} y las claves, ${claves}, te marcan la dirección: no hay que sumar más, hay que mirar esta.`
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
        `${encadenar(derechas)}. Su significado en conjunto es claro: todo se alinea contigo. ${A} lo certifica con su ${R}: esta coincidencia no es azar, es señal de que el cielo te está sumando a favor.`
      ]);
    }
    if (invertidas.length === grupo.length) {
      return this.elegirDe([
        `${encadenar(invertidas)}. Cuando toda la sombra se junta no es castigo: es una sola puerta pidiendo ser abierta. ${A} te habla desde su ${R} para que la abras hoy, no mañana.`,
        `${encadenar(invertidas)}. Su conjunto te grita lo mismo: hay un patrón que se repite. ${A} lo nombra desde su ${R}: no escaparás de él hasta que lo mires de frente.`
      ]);
    }
    return this.elegirDe([
      `${encadenar(derechas)}; y en paralelo, ${encadenar(invertidas)} es el aviso que la luz necesita para asentarse. ${A} sostiene esa balanza desde su ${R}: aprovecha lo que ya avanza y desactiva hoy lo que pesa.`,
      `${encadenar(derechas)}; mientras tanto, ${encadenar(invertidas)}. Juntas dibujan tu tarea: afirmar lo que brilla y voltear lo que pesa. ${A} te acompaña desde su ${R} en ese equilibrio.`
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
    const puente = this.elegirDe([
      `No lo mires como un castigo: estas cartas te señalan exactamente lo que estás listo para soltar.`,
      `Pon atención al hilo que las une: no hay casualidad en que se repita el mismo tema.`,
      `Cada una te habla de algo distinto, pero juntas cuentan una sola historia.`,
      `No son varias lecturas: es una sola lección dicha de cuatro maneras.`,
      `Fíjate cómo se señalan entre ellas: la sombra de una confirma la de la otra.`
    ]);
    const cierre = this.elegirDe([
      `Yo, ${A}, desde mi ${R}, te pido una sola cosa hoy: elige la que más te dolió leer y conviértela en acción. Cambia una cosa y las demás girarán solas.`,
      `Mira de nuevo las cartas que te señalé: no necesitas más señales, necesitas obediencia. ${A} te lo dice con amor duro: levántate hoy y demuestra que esta lectura no cayó al vacío.`,
      `No te pido que cambies de golpe: te pido una decisión pequeña y real antes de que termine el día. Yo, ${A}, desde mi ${R}, estaré ahí para sostenerte mientras obedeces.`,
      `Cuando quieras comprobar que estas cartas no vinieron al azar, mira que todas señalan lo mismo: tu corazón ya sabe por dónde empezar. ${A} te acompaña desde mi ${R}.`
    ]);

    return `${apertura} ${cuerpo}${resto} ${puente} ${cierre}`;
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
          "Arcángel Miguel te dice: tu burbuja de protección está intacta y tu paso se afirma. Lo que hoy construyes, cuidas o decides avanza bajo mi escudo. Camina con la cabeza en alto: nadie puede con tu luz cuando tú mismo la defiendes.",
          "Arcángel Miguel te dice: las amenazas que tanto te pesaron están perdiendo fuerza frente a tu firmeza. Tu terreno se afianza, tus decisiones encuentran respaldo y la protección que pediste respira a tu lado. Sigue avanzando sin mirar atrás.",
          "Arcángel Miguel te dice: tu escudo está firme y tu espada lista, pero hoy no es día de batalla: es día de construir. Lo que empiezas ahora queda bajo mi guarda. No dudes de tu fuerza: el cielo ya la respalda."
        ],
        sombra: [
          "Miguel te regaña con su espada en alto: llevas tiempo gastando tu energía donde no te valoran y defendiendo a quien no te defiende. Esta es tu hora de ponerte primero: marca tus límites, retira tu fuerza de quien la usa y no des explicaciones por cuidarte.",
          "Miguel te mira con dureza de guerrero: sigues luchando batallas ajenas mientras abandonas las tuyas. Defiendes a quien no te defiende y callas cuando deberías alzar la espada. Hoy elige: tu energía es sagrada y solo tú decides quién merece recibirla.",
          "Miguel pone su mano en tu hombro y te habla claro: hay una puerta que dejaste abierta y por ella entran los que te desgastan. Ciérrala sin culpa. Protegerte no es ofender a nadie: es honrar la misión que se te ha confiado."
        ]
      },
      {
        icono: "💞", area: "amor", clave: "chamuel", titulo: "Amor y relaciones",
        luz: [
          "Arcángel Chamuel te dice: el afecto sincero está fluyendo hacia ti y desde ti. Hoy tu corazón se abre a un encuentro, una reunión o una entrega que ya se sentía esperada. Abre la mano y recibe: mereces ser amado sin condiciones.",
          "Arcángel Chamuel te dice: el amor que sembraste con paciencia está dando fruto. Alguien te ama más de lo que te atreves a creer, y hoy el cielo te pide que lo creas y lo devuelvas sin miedo. Recibir no te hace débil: te hace entero.",
          "Arcángel Chamuel envuelve tus vínculos en luz rosa: vienen encuentros que sanan lo que la espera dolorosa. El amor verdadero se acerca: dale espacio, suelta la lista de condiciones y abre la puerta que llevas tiempo mirando."
        ],
        sombra: [
          "Chamuel te habla con dulzura pero sin rodeos: estás repitiendo el patrón de entregar tu luz donde no es cuidada, o callando lo que sientes por miedo a perder. No mendigues afecto ni confundas silencio con paz. Nombra tu verdad, ama desde tu dignidad y deja que el amor justo vuelva a ti.",
          "Chamuel te observa con tristeza: hay un cariño que entrega todo y un cariño que solo recibe. Reconoces cuál es el tuyo. El amor no es una deuda que pagas con silencio ni un premio que ganas sufriendo. Ámate a ti primero: desde ahí, todo vínculo se ordena.",
          "Chamuel aparta la dulzura por un instante: sigues esperando que alguien te dé el amor que no te das. Nadie puede llenar tu vacío desde afuera. Reconoce el patrón, suelta la dependencia y date hoy lo que le pides a otros: entonces el amor justo encontrará su lugar."
        ]
      },
      {
        icono: "💚", area: "salud", clave: "rafael", titulo: "Salud y energía",
        luz: [
          "Arcángel Rafael te dice: la sanación que pediste está en marcha y tu equilibrio vuelve a asentarse. Respira, descansa y confía: tu cuerpo y tu alma se están reparando en silencio. Este renacer ya empezó.",
          "Arcángel Rafael extiende su mano verde esmeralda: tu vitalidad está recuperando su ritmo, célula a célula, día a día. No exijas de golpe: la sanación verdadera respeta tus tiempos. Descansa algo que has estado negando y agradece cada señal de mejora.",
          "Arcángel Rafael te dice: tu energía vuelve a circular libre y el cansancio que te pesaba comienza a disolverse. Escucha a tu cuerpo: es tu oráculo más honesto. Lo que siembras con descanso, alimento y movimiento, lo cosechas en fuerza."
        ],
        sombra: [
          "Rafael te observa con mirada de médico y no te suelta la mano: hay una parte de ti que estás descuidando, un cansancio que callas o un dolor que pospones. Cuidarte no es egoísmo: es el único camino para volver a brillar. Tu sanación empieza hoy, por detenerte.",
          "Rafael te habla con seriedad: llevas tiempo agotando tu cuerpo como si fuera inagotable. Trabajas, sostienes, cargas, y tu salud paga la cuenta en silencio. Pon en la lista de urgencias lo que siempre pospones: cita, descanso, límite. Nadie va a cuidarte si tú no empiezas.",
          "Rafael enciende la luz para que veas lo que niegas: hay una herida repetida, un dolor que has normalizado o un cansancio que ya es crónico. Sanar no es solo el remedio externo: es dejar de hacerte daño con las apariencias. Detente antes de caer, no después."
        ]
      },
      {
        icono: "📯", area: "mensajes", clave: "gabriel", titulo: "Mensajes y propósito",
        luz: [
          "Arcángel Gabriel te dice: el mensaje que esperabas está en camino y tu propósito se aclara. Presta atención a las señales, las palabras y las coincidencias: por ahí te estoy hablando, y esta vez no vas a fallar.",
          "Arcángel Gabriel te trae la palabra que esperabas, aun antes de formularla: la respuesta está cristalizando y llegará en un gesto, un mensaje o una conversación inesperada. Afina tu escucha: el cielo se comunica en susurros y hoy te habla a ti.",
          "Arcángel Gabriel despeja el ruido mental: tu propósito se reordena y vuelves a conectar con por qué viniste. No busques el gran anuncio: mira las señales pequeñas, las sincronías repetidas, las palabras que vuelven. Ahí está tu mensaje."
        ],
        sombra: [
          "Gabriel aparta el ruido para que escuches: llevas tiempo oyendo lo que quieres oír, no lo que necesitas. Hay un mensaje que aún no te has atrevido a aceptar. Silencia la ansiedad, vuelve a preguntar con honestidad y la respuesta llegará cuando te calles.",
          "Gabriel te mira con franqueza: insistes en escuchar solo lo que te consuela y por eso la verdad te toma por sorpresa. Hay un mensaje que evitas porque te obligaría a cambiar. Cuanto más lo pospones, más ruido necesitas para taparlo. Cállate y escúchalo: te habla.",
          "Gabriel alza la voz entre tus pensamientos: dejas mensajes sin entregar y palabras sin decir, y eso te mantiene en círculos. No es el universo el que calla: eres tú quien se tapa los oídos. Nombra lo que sientes, responde lo que te preguntan y la señal que buscas aparecerá."
        ]
      },
      {
        icono: "💰", area: "economia", clave: "uriel", titulo: "Economía y abundancia",
        luz: [
          "Arcángel Uriel enciende su antorcha sobre tu economía: el flujo que pediste se está ordenando y abre puertas para ti. Administra con calma, actúa con decisión y mira los detalles que otros pasan por alto: ahí está tu oportunidad.",
          "Uriel enciende su antorcha sobre tu economía: el caos que temías está cediendo y tu flujo de dinero se ordena. Mira con ojos claros las oportunidades que otros descartan: están cerca, concretas, a tu alcance. Actúa con método y la abundancia responde.",
          "Arcángel Uriel te da discernimiento para tu bolsillo: lo que hoy administras bien se convierte en lo que mañana te sostiene. No mires el monto, mira la dirección. Toda puerta que se abre hoy tiene tu nombre si decides atravesarla con calma y decisión."
        ],
        sombra: [
          "Uriel te mira de frente y te dice la verdad: la energía de tu dinero pide orden y revisión. Hay fugas, gastos que se repiten y promesas que llegan con más ruido que sustancia. No es un castigo, es un aviso a tiempo: cierra las rendijas, pon límites a tu generosidad y deja espacio para la abundancia real.",
          "Uriel te habla sin filtros: tu economía es un reflejo de tus decisiones repetidas, no de tu suerte. Hay gastos que disfrazan vacíos, deudas que sostienen fachadas y generosidades que no puedes sostener. Ordena la casa: el dinero también pide límites claros.",
          "Uriel levanta la antorcha sobre tus finanzas y ve lo que escondes: hay miedo a mirar los números, a pedir lo que vales o a soltar un sustento que ya no te suma. La abundancia no llega donde hay engaño. Enfrenta la cifra hoy y deja espacio para el flujo nuevo."
        ]
      },
      {
        icono: "🔓", area: "bloqueo", clave: "zadkiel", titulo: "Bloqueos a liberar",
        luz: [
          "Arcángel Zadkiel te dice: la liberación ya está corriendo por ti. Suelta la culpa, perdona lo que haya que perdonar y siente cuánta libertad entra cuando dejas de cargar el pasado. Esas cadenas solo tú las mantienes puestas: esta es tu hora de soltarlas.",
          "Arcángel Zadkiel desata tus cadenas: lo que te ataba perdió fuerza porque dejaste de alimentarlo. La culpa encuentra casa solo si se la mantiene. Perdonar hoy —a otros y a ti— es la llave que abre todo lo demás. Caminarás más ligero de lo que recuerdas.",
          "Arcángel Zadkiel disuelve el rencor acumulado: soltar no es olvidar, es dejar de cargar lo que ya cumplió. Recoge tu energía dispersa en el pasado y vuélvela hacia el presente. La paz que buscas no está en que el otro cambie: está en tu decisión de soltar."
        ],
        sombra: [
          "Zadkiel te señala la cadena que arrastras hace demasiado tiempo: un rencor, un miedo ya vencido o una culpa que no te corresponde. Cada día sin perdonar pesa más. Suelta la piedra, perdónate y perdona: tu corazón no fue hecho para cargar tanto, y este mensaje te da la llave.",
          "Zadkiel te señala el peso exacto que arrastras: un agravio que repasaste mil veces, una culpa que no te corresponde o un perdón que te niegas. Cada vez que lo recuerdas, lo vuelves a cargar. El otro quizá ni lo sabe; tú ya lo sabes: es hora de dejarlo.",
          "Zadkiel sostiene tus manos y te pide soltar la piedra: te aferras a tu dolor como si te diera identidad. \"Yo soy quien fue herido\" se volvió tu escudo y tu jaula. Suelta la historia que te repites: frente a ti hay más vida que recuerdo, y es tuya."
        ]
      },
      {
        icono: "🌟", area: "futuro", clave: "jofiel", titulo: "Futuro e inspiración",
        luz: [
          "Arcángel Jofiel te dice: lo que viene está alineado con tu propósito y tu luz ya florece. Confía en el proceso, suelta lo que cumplió su ciclo y camina hacia lo nuevo con la certeza de que el cielo está cuadrando las piezas a tu favor.",
          "Arcángel Jofiel te muestra el camino iluminado: lo que viene está tejido con lo mejor de lo que ya eres. Suelta el proyecto caduco, confía en el nuevo ciclo y camina sin prisa: la inspiración no se persigue, se cultiva, y ya está germinando en ti.",
          "Arcángel Jofiel enciende tu cielo: el futuro se ordena a tu favor, con más belleza de la que te atreves a imaginar. No necesitas verlo todo: necesitas dar el primer paso con fe. Tu luz ya alumbra el camino aunque aún no lo recorras."
        ],
        sombra: [
          "Jofiel apaga su lámpara un instante para que lo mires: lo que anhelas no llegará mientras sigas mirando atrás o comparándote con el camino de otros. Tu futuro no se recibe, se construye, y empieza en la decisión de hoy. Enciende tu propia luz y camina: el porvenir te espera.",
          "Jofiel apaga la lámpara para que veas la verdad: estás ensayando el futuro desde el miedo, pintándolo con los colores del pasado. El porvenir no llega a quien lo teme con argumentos: llega a quien lo camina. Deja de anticipar pérdidas y empieza a construir.",
          "Jofiel te habla con cariño firme: comparas tu sendero con los atajos ajenos y por eso crees ir tarde. No hay retraso: hay un desvío esperando ser corregido. La inspiración volverá cuando dejes de medirte con otros y vuelvas a medirte con tu propia luz."
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
        presencia: this.fraseArea(this.arcangeles[a.clave], a.clave === "chamuel" ? "amor" : a.clave),
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
    if (resultado.fuerte) {
      finalBloques.push({
        icono: "🔥",
        area: "fuerte",
        titulo: "El regaño final",
        arcangel: regente,
        regano: true,
        presencia: presenciaRegano,
        texto: this.regañoDeCartas(resultado, regente),
        cartasHtml: this.reganoCartaHtml(resultado.cartas)
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
      luz: "Arcángel Miguel te dice: hoy estás protegida y más fuerte de lo que crees. Tu fuerza se está ordenando y nada puede tumbarla mientras camines con fe y con tus límites bien puestos. Esta batalla no es tuya sola: la estamos ganando los dos.",
      mixto: "Arcángel Miguel te dice: tienes protección, sí, pero hay una grieta que no puedes seguir ignorando. Hay personas cerca que gastan tu energía y tú no dices nada. Refuerza tu escudo, elige bien tus batallas y no dejes tu guardia en manos de quien no te cuida.",
      sombra: "Arcángel Miguel te regaña: has bajado el escudo demasiado pronto. Te estás exponiendo donde no hay protección y entregando tu fuerza donde no te valoran. Es hora de ponerte firme, de reclamar tu lugar y de dejar de dar tu poder a quien no lo merece. Levántate y defiéndete.",
      fuerte: [
        "¡Basta de hacerse el fuerte por fuera y el frágil por dentro! Arcángel Miguel te habla sin paños calientes: estás permitiendo que entren a tu vida quien no debería, y tú, con tus propias manos, les abres la puerta. Deja de pedir permiso para protegerte y deja de explicar por qué te cuidas. Tu paz no se negocia: se defiende. Hoy mismo pon los límites que has estado posponiendo.",
        "¡Levántate y defiéndete! Arcángel Miguel no te suelta la mano, pero hoy no vino a consolarte: vino a armarte. Llevas tanto tiempo cediendo tu lugar, agachando la cabeza y dejando que otros decidan por ti, que ya confundiste humildad con rendición. Vuelve a tu trono: reafirma lo tuyo, corta en seco lo que te desgasta y camina con la dignidad de quien sabe que la luz que lo protege también lo obliga. Ya es hora.",
        "¡Tu tiempo no se regala! Arcángel Miguel coloca su espada entre tú y esa gente que solo aparece cuando necesita algo. Sí, te he visto: dices que no puedes negarte, que te da vergüenza, que 'mejor no hacer ruido'. Y mientras tanto ellos se llenan de tu energía y tú llenas sus vacíos. Deja de ser el banco emocional que nunca cobra: desde mi protección te pido un alto hoy mismo.",
        "¡Deja de defenderlos! Arcángel Miguel te mira con dureza: pones tu escudo delante de quien jamás lo pondría por ti. Explícate a ti misma por qué eres tan generosa con tu paciencia y tan tacaña con tu respeto. Defiende a quien también te defienda, aguanta a quien también te espere. Tu protección no es un regalo: es un derecho que repartiste mal y hoy recuperas."
      ]
    },
    chamuel: {
      luz: "Arcángel Chamuel te dice: el amor real ya está tocando tu corazón, y va a llegar, sanar o liberar justo lo que necesitas. Abre la mano y recibe, sin miedo a querer ni a ser querido. El cielo confirma tu unión.",
      mixto: "Arcángel Chamuel te dice: hay amor, sí, pero también hay un nudo que duele callado. No confundas silencio con paz ni distancia con indiferencia. Habla lo que sientes con honestidad: decirlo no rompe nada, callarlo sí puede romperlo todo.",
      sombra: "Arcángel Chamuel te regaña: estás poniendo tu corazón donde no lo cuidan, o cerrando la puerta a quien sí te quiere bien. Deja de mendigar cariño donde solo hay ego. Quiérete con dignidad: el amor que mereces empieza por el que tú misma te das.",
      fuerte: [
        "¡Abre los ojos! Arcángel Chamuel te habla sin dulzura esta vez: sigues entregando tu corazón a quien te lo devuelve roto, y encima te sientes culpable. Deja de confundir amor con sacrificio y de perdonar lo que ni siquiera te han pedido perdón. Quiérete con dignidad o el amor pasará de largo frente a tu puerta. Basta de mendigar cariño: el amor que mereces emana de ti.",
        "¡No ames desde la falta! Arcángel Chamuel trae su rosa al revés para que la veas: buscas en otros lo que te niegas a darte, y por eso cada vínculo termina doliendo igual. El patrón no son ellos: eres tú eligiendo quedarte donde no te valoran. Hoy corta el círculo: pon tu nombre primero en tu propia lista, y el amor que pide entrar encontrará una casa que ya sabe cuánto vale.",
        "¡No es el mismo amor con otras caras! Arcángel Chamuel te muestra el guion que se repite: empiezas ilusionada, luego haces todas las concesiones, y terminas sintiéndote vacía mientras te dices 'es que esta vez es distinto'. No lo es, y lo sabes en el alma. La única carta que cambia el juego eres tú. Cambia tu parte y el libreto entero se rompe.",
        "¡Deja de pedir permiso para amarte! Arcángel Chamuel te lo grita con su luz rosa dura: no hace falta que otro te escoja para que tú te quieras. Ese amor que esperas entrar por la puerta de enfrente ya está en tu casa: es el que no te has dado. Quiérete primero, sin condiciones, y observa cómo cambia la fila en tu puerta."
      ]
    },
    rafael: {
      luz: "Arcángel Rafael te dice: estás sanando, de verdad. Tu cuerpo, tu mente y tu alma se están equilibrando otra vez. Respira hondo, descansa y confía: la medicina del cielo ya está trabajando en ti.",
      mixto: "Arcángel Rafael te dice: la sanación viene en camino, pero hay algo que te estás negando a atender. Ese cansancio, ese dolor o esa calma que pospones tiene voz. Escúchala hoy: cuidarte no es egoísmo, es el único camino para seguir brillando.",
      sombra: "Arcángel Rafael te regaña: deja de descuidarte. Te das a todos y no te queda nada para ti, y tu cuerpo te lo está avisando. No postergues más tu salud ni tu paz: el descanso y el cuidado no se ganan, se toman. Empieza hoy.",
      fuerte: [
        "¡Detente! Arcángel Rafael habla en serio: estás apagando la única vela que ilumina tu vida, y esa vela eres tú. Siempre postergas tu salud y tu descanso para el final, siempre eres el último en tu lista, y tu cuerpo ya te está cobrando. Deja de sacrificarte por quienes ni se dan cuenta. Cuidarte no es egoísmo: es tu obligación contigo. Hoy mismo, una cosa: descansa.",
        "¡No te desaparezcas dando! Arcángel Rafael levanta la voz: cuidas a todos menos a ti, sostienes, escuchas, cargas, y cuando miras tu propio reflejo no reconoces el rostro. Tu energía no es ilimitada y tu alma no es un banco sin fondo. Pon un alto hoy: di no a lo que te vacía, di sí al descanso que evitas, y deja que la sanación empiece por la única persona que puede hacerlo por ti.",
        "¡El vaso ya rebosa! Arcángel Rafael sostiene tu mano y te enseña la cuenta que tu cuerpo lleva: cansancio que niegas, dolores que normalizas, ansiedad que escondes. No necesito más cartas para saber qué te pasa: lo estás contando con los hombros, la respiración y el sueño. Hoy no te pido grandeza, te pido un favor pequeño: elige una cosa que te cuide y hazla como si fuera sagrada.",
        "¡Tu cuerpo te está hablando y no lo escuchas! Arcángel Rafael te lo dice como médico y como amigo: cada señal que ignoras hoy se convierte en diagnóstico mañana. Deja de tratar tu salud como un trámite que haces 'cuando puedas'. Tu energía es el suelo donde crece todo lo demás: si no te cuidas, nada de lo que quieres puede florecer."
      ]
    },
    gabriel: {
      luz: "Arcángel Gabriel te dice: el mensaje que esperabas está en camino y tu propósito se está aclarando. Presta atención a las señales, a las palabras y a las coincidencias: por ahí te está hablando el cielo, y esta vez no vas a fallar.",
      mixto: "Arcángel Gabriel te dice: la verdad está cerca, pero llega envuelta en ruido. No te apresures a cerrar conclusiones: revisa lo que escuchas, contrasta lo que crees y el mensaje puro llegará a tu corazón sin que tengas que forzarlo.",
      sombra: "Arcángel Gabriel te regaña: has dejado de escuchar. Repites lo que quieres oír en vez de lo que necesitas, y por eso sigues en el mismo lugar. Cállate un momento, vuelve a preguntar y abre los oídos: la respuesta no llega hasta que te haces silencio.",
      fuerte: [
        "¡Deja de hacerte la sorda! Arcángel Gabriel te habla fuerte para que lo escuches de una vez: llevas años oyendo lo que quieres y tapando lo que necesitas. Te escondes detrás del ruido, del miedo y de las excusas. Hoy calla todo, siéntate y escucha la verdad que ya sabes: la respuesta siempre estuvo ahí, esperándote. No pidas más señales si no piensas obedecerlas.",
        "¡El mensaje ya llegó, no pidas otro! Arcángel Gabriel te mira a los ojos: andas coleccionando señales como si el universo no te hubiera hablado ya mil veces. La respuesta no cambia porque no te gusta. Lo que falta no es una señal nueva: falta tu obediencia a la que ya tienes. Deja de negociar con el cielo y haz lo que ya sabes que debes hacer.",
        "¡Deja de hacerte el despistado! Arcángel Gabriel aparta el ruido de golpe: no necesitas más información, necesitas silencio para digerir la que ya tienes. Te dices 'no sé qué hacer', pero sí lo sabes; solo te asusta hacerlo. Cállate un día las excusas y escucha tu propia voz: esa también es mía llegándote por dentro.",
        "¡La señal no es más visible, es más avisada de lo que crees! Arcángel Gabriel te cuenta las veces que pasó frente a tus ojos: esa conversación, esa coincidencia, ese aviso repetido. Llevas tiempo respondiendo 'qué casualidad' cuando era una llamada palpitándote en la cara. Deja de preguntarle al tarot lo mismo y empieza a obedecer lo que ya te respondió."
      ]
    },
    uriel: {
      luz: "Arcángel Uriel te dice: tu luz interior se encendió y ahora ves con claridad lo que otros no comprenden. Confía en esa certeza que sientes en el pecho: tus decisiones tienen luz propia y te van a llevar a buen puerto.",
      mixto: "Arcángel Uriel te dice: tienes la verdad cerca, pero el impulso te empuja a decidir antes de tiempo. Detente, examina y compara. La sabiduría que buscas no está en actuar más rápido, sino en mirar más profundo.",
      sombra: "Arcángel Uriel te regaña: estás actuando por impulso y dejando que la emoción nuble tu juicio, y eso te está costando caro. Pide tiempo, toma distancia y decide desde la luz, no desde el miedo. No corras: primero mira.",
      fuerte: [
        "¡Decide de una vez! Arcángel Uriel te habla sin rodeos: llevas tanto tiempo dudando que ya no es prudencia, es miedo con disfraz. No actúes por impulso, sí, pero tampoco te quedes paralizada por siempre: la vida también se te pasa esperando el momento perfecto. Mira con claridad, decide con firmeza y camina. El que no elige, elige perder.",
        "¡Enciende la luz o elige la oscuridad! Arcángel Uriel no te da más tiempo: has colocado tu vida en pausa esperando garantías que nunca llegarán, y mientras tanto el tiempo pasa y las oportunidades se alejan. No necesitas ver todo el camino: necesitas prender la antorcha y caminar. Decidir es vivir. Estás a una sola decisión firme de cambiar tu rumbo: tómala hoy.",
        "¡Tu parálisis tiene nombre: miedo! Arcángel Uriel te lo traduce sin piedad: esa 'prudencia' que invocas es excusa para no equivocarte, y no equivocarte se ha vuelto tu forma de no vivir. Examina, sí, pero con plazo. La sabiduría no es esperar a tener certeza: es decidir con la luz que ya tienes y ajustar en el camino. Prende la antorcha y anda.",
        "¡Una decisión tomada a tiempo vale más que diez perfectas tarde! Arcángel Uriel levanta la luz sobre el tiempo que pierdes revisando lo mismo: el análisis ya cumplió. Lo que estudias un millón de veces no gana verdad, gana retraso. Elige hoy una dirección con tus mejores datos y comprométete: el camino se ilumina mientras caminas, no mientras ensayas."
      ]
    },
    zadkiel: {
      luz: "Arcángel Zadkiel te dice: la liberación llegó. Suelta la culpa, perdona lo que haya que perdonar y siente cómo entra la libertad. El pasado pesa menos hoy: esta es tu hora de soltar las cadenas y caminar ligero.",
      mixto: "Arcángel Zadkiel te dice: la llave está en tu mano, pero hay una cadena que tú mismo sigues manteniendo puesta. No se trata solo de que otros te suelten: hay algo que debes soltar tú. Date permiso hoy y el cielo te sostiene.",
      sombra: "Arcángel Zadkiel te regaña: llevas demasiado tiempo atada a la culpa, al rencor o a un pasado que ya no existe. Cada día que no perdonas, la cadena pesa más. Suelta la piedra, perdónate y perdona: tu alma no fue hecha para cargar tanto.",
      fuerte: [
        "¡Suelta esa piedra! Arcángel Zadkiel te habla sin compasión a medias: el pasado que arrastras es tuyo porque tú lo cargas, no porque te lo hayan puesto. Perdonar no es para el otro: es para ti. Y si el otro no se arrepiente, perdonas igual, para soltarte tú. El rencor te está comiendo viva, y lo sabes. Basta de justificarlo.",
        "¡No eres tu cicatriz! Arcángel Zadkiel rompe la cadena con un golpe: llevas años presentándote como alguien que fue herido, como si ese recuerdo fuera tu identidad. Lo que te pasó ya no te define, salvo que tú lo mantengas en el trono. Mirada afuera: hay vida esperándote lejos de ese capítulo. Suelta la historia que te cuentas sobre tu pasado y deja que hoy sea otro principio.",
        "¡El pasado no tiene llaves de tu casa! Arcángel Zadkiel te lo grita con su luz violeta: ese agravio, esa culpa y esa persona ya se fueron, pero tú sigues pagando su alquiler con paz, sueño y presente. Cada vez que vuelves a contarlo, la cadena vuelve a cerrarse. Hoy corta el ciclo: perdona no porque lo merezcan, sino porque tú necesitas soltar el peso.",
        "¡Deja de llevar cuentas de quién te falló! Arcángel Zadkiel te mira con franqueza: mientras mides cada traición y la repasas, el otro está viviendo su vida y tú vives la de él, en bucle. Perdonar no borra lo que pasó: deja de cobrárselo a tu presente. Suelta la factura, agradece la lección y vuelve a tu propia vida, que te está esperando."
      ]
    },
    jofiel: {
      luz: "Arcángel Jofiel te dice: la belleza y la luz que buscas ya están floreciendo a tu alrededor. Rodéate de lo que te eleva, confía en tu creatividad y verás tu mundo brillar con tus propios colores. Lo bueno que esperas ya viene.",
      mixto: "Arcángel Jofiel te dice: hay luz, pero todavía tienes los ojos puestos en lo que no fue. Deja de mirar atrás y déjate inspirar por lo nuevo. La belleza no entra donde la mirada anda nublada: limpia tu ventana y verás.",
      sombra: "Arcángel Jofiel te regaña: dejaste de ver la luz que sí tienes. Te comparas con otros y ensombreces tu propio camino, y así la inspiración huye de ti. Deja de mirar a lado y enciende tu propia lámpara: tu belleza no necesita permiso.",
      fuerte: [
        "¡Enciende tu luz! Arcángel Jofiel te habla con energía: tienes un sol dentro y pasas la vida mirando la lámpara del vecino. Te comparas, te menosprecias y apagas tu propia chispa. Tu camino no es el de nadie más y tu belleza no pide permiso. Deja de mirar hacia los lados, mira hacia ti, y verás cómo todo lo que buscas ya estaba en ti.",
        "¡Deja de apagarte para que otros brillen! Arcángel Jofiel levanta tu barbilla: cedes tu luz, tu tiempo y tu creatividad, y te quedas con lo que sobra. Tu inspiración no es un favor que prestas: es un derecho que ejerces. Vuelve a ti, retoma lo que amas y acéptalo en voz alta. Cuando tu luz se prende por fin, nada ni nadie podrá ensombrecerla.",
        "¡Comparar es apagar tu propia estrella! Arcángel Jofiel te toma de la cara y te mira: cuando miras el camino de otros, dejas de ver el tuyo, que es el único que te corresponde. Detrás de esa vida que envidias hay un precio que no pagaste. Vuelve a tus propios sueños, retómalos desde donde los dejaste, y verás que tu luz siempre estuvo encendida.",
        "¡Tu alegría también está atrasada! Arcángel Jofiel te señala la fecha: llevas tanto tiempo posponiendo lo que te ilumina 'para cuando todo esté bien' que se te olvidó cómo se siente. La inspiración no espera a que merezcas; se cultiva en el ahora. Retoma hoy una sola cosa que amas, solo una, y deja que tu sonrisa recuerde el camino."
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
          `${arc.nombre} revisa ${nombreTemas} y encuentra tus cartas contra la pared: ${cs.map(c => `${c.nombre} invertida ${this.esencia[c.nombre] ? "moldea el mensaje de " + this.esencia[c.nombre].sombra : "no quiere ser mirada"}`).join("; ")}. Atiende ese lugar hoy: la sombra se disipa cuando la nombras.`,
          `${arc.nombre} te habla firme en ${nombreTemas}: todas las cartas de este rincón te muestran su envés, y cada una señala la misma puerta. ${cs.length === 1 ? "Mira la carta que se opone: no es un no, es un desvío que corregir." : "No es un no: es el patrón que repites en este terreno."} Devuélveles la luz desde su ${arc.regencia.toLowerCase()}.`
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
        presencia: this.fraseArea(arc, b.clave),
        texto,
        cartasHtml: (tenor === "sombra" || tenor === "mixto")
          ? this.reganoCartaHtml(b.temas.filter(t => t.carta.invertido).map(t => t.carta))
          : "",
        combinacion: this.combinacionDe(b)
      };
    }).concat([{
      cierre: true,
      texto: this.elegirDe([
        "Los siete arcángeles han hablado, cada uno desde su don, y yo he escuchado cada palabra. Solo puedo decirte la verdad sin maquillaje: no estás sola, nunca lo has estado, pero eso no te exime de actuar. Lo que las cartas te mostraron hoy no es para asustarte: es para recordarte quién eres. La fuerza que buscas no está afuera, ya vive en ti. Deja el miedo, toma el consejo que más te dolió escuchar y ponlo en práctica: ese es el camino que todas las voces te señalan.",
        "Siete voces han hablado y todas dicen lo mismo de maneras distintas: tu momento es ahora y tu respuesta está en tus manos. No vinieron a adivinarte el futuro, vinieron a devolverte el mando de tu presente. Agradece lo que floreció, suelta lo que terminó su ciclo y camina con la certeza de que ya no necesitas que el cielo te repita nada: llevas la guía dentro.",
        "Cada arcángel colocó una piedra sobre tu camino, y juntas forman el puente que estabas esperando. La protección de Miguel, el amor de Chamuel, la sanación de Rafael, la voz de Gabriel, la claridad de Uriel, la liberación de Zadkiel y la luz de Jofiel ahora son tuyas. No desprecies el puente por miedo a cruzar: ya está firme. Da el paso."
      ]),
      cita
    }]);
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
    return { tipo: tipo === "mixto" ? "espejada" : tipo, texto, cartas };
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
      combinacion: { tipo, texto: this.significadoConjunto(grupo, arc), cartas },
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
        `${A}, señor de la ${a.regencia.toLowerCase()}, vela por esta área y te dice: la abundancia no es cuestión de suerte, sino de orden y de decisión. Confía en su guía para ordenar tus recursos y abrir el caudal que mereces. ${C}`,
        `${A} enciende su antorcha en tu economía y te indica el camino del flujo: lo que hoy ordenas, mañana multiplicas. Escucha su voz de ${a.regencia.toLowerCase()} y abre espacio para lo que abunda. ${C}`
      ],
      amor: [
        `${A} sostiene tu corazón en esta lectura: su energía de ${a.regencia.toLowerCase()} se derrama sobre tus vínculos para que el amor llegue, se sane o se libere tal como lo necesitas. ${C}`,
        `${A} envuelve tu vida afectiva con su luz: desde su ${a.regencia.toLowerCase()}, te enseña que el amor verdadero no mendiga, elige. Abre el corazón con dignidad y deja que lo justo te encuentre. ${C}`
      ],
      situacion: [
        `Desde su reino de ${a.regencia.toLowerCase()}, ${A} despeja la niebla de tus circunstancias y te muestra lo que de verdad importa, para que decidas con claridad y sin miedo. ${C}`,
        `${A} toma posición a tu lado y examina tu terreno con mirada de ${a.regencia.toLowerCase()}: lo que ves desde lo alto no es amenaza, es mapa. Camina con él y no temas. ${C}`
      ],
      bloqueo: [
        `${A} ilumina con su ${a.regencia.toLowerCase()} las cadenas invisibles que te retienen, y te da la fuerza para soltarlas una a una. Nada puede mantenerte atado cuando su luz te acompaña. ${C}`,
        `${A} desata contigo los nudos que otros dejaron: su ${a.regencia.toLowerCase()} no juzga, libera. Suelta hoy, una sola carga, y observa cuánto aire te queda para caminar. ${C}`
      ],
      trabajo: [
        `Con la sabiduría de su ${a.regencia.toLowerCase()}, ${A} orienta tu camino profesional y despeja el sendero hacia el reconocimiento y la meta que persigues. ${C}`,
        `${A} alinea tu vocación con tus dones: desde su ${a.regencia.toLowerCase()}, te asegura que el trabajo que abre tus caminos viene de la constancia que empiezas hoy. ${C}`
      ],
      futuro: [
        `${A} despliega ante ti el mapa del porvenir: desde su ${a.regencia.toLowerCase()}, te asegura que lo que viene está alineado con tu propósito, si caminas con fe y decisión. ${C}`,
        `${A} levanta el telón de lo que se acerca: su ${a.regencia.toLowerCase()} te muestra que el futuro que sueñas ya te está esperando en el paso que decides dar hoy. ${C}`
      ],
      cierre: [
        `${A} sella esta lectura con su presencia. No estás sola: un arcángel ha tomado tu mano para guiarte. Confía, actúa y deja que su luz te lleve. ${C}`,
        `${A} cierra este encuentro celestial contigo y te recuerda que la lectura no termina aquí: continúa en cada decisión que tomes desde hoy. Su luz ya va contigo. ${C}`
      ],
      miguel: [
        `${A} toma la palabra en tu nombre: con su ${a.regencia.toLowerCase()}, te protege y te da valor para sostener tu posición en cada terreno de tu vida. ${C}`,
        `${A} se planta a tu lado con el escudo en alto: su ${a.regencia.toLowerCase()} te respalda para que defiendas tu lugar sin temblar. Van juntos en esta batalla. ${C}`
      ],
      gabriel: [
        `${A} trae luz a lo que debes escuchar: en estos temas, su ${a.regencia.toLowerCase()} despeja tu mente y te señala el propósito oculto. ${C}`,
        `${A} baja hasta tu oído el mensaje que necesitas: su ${a.regencia.toLowerCase()} ordena tus pensamientos y vuelve audible lo que el cielo te dirá. Presta atención. ${C}`
      ],
      rafael: [
        `${A} extiende su mano sanadora sobre estos asuntos: su ${a.regencia.toLowerCase()} te devuelve el equilibrio y la claridad para seguir. ${C}`,
        `${A} acaricia con su luz este terreno de tu vida: donde hay herida, su ${a.regencia.toLowerCase()} pone bálsamo; donde hay duda, pone rumbo. Déjate acompañar. ${C}`
      ],
      uriel: [
        `${A} enciende su antorcha de ${a.regencia.toLowerCase()} en estas áreas: mira con luz interior, porque la respuesta que buscas está más cerca de lo que crees. ${C}`,
        `${A} ilumina el rincón que dejaste en penumbra: su ${a.regencia.toLowerCase()} te da el discernimiento que necesitas para decidir sin arrepentirte. ${C}`
      ],
      zadkiel: [
        `${A} desata las cadenas que se ocultan aquí: su ${a.regencia.toLowerCase()} te libera de lo que ya cumplió su tiempo. ${C}`,
        `${A} toma las esposas invisibles de tu camino: su ${a.regencia.toLowerCase()} convierte tu carga en carta de libertad. Suelta y respira. ${C}`
      ],
      jofiel: [
        `${A} ilumina estos senderos con su ${a.regencia.toLowerCase()}: busca la belleza y la inspiración, y ellas te guiarán. ${C}`,
        `${A} tiñe tu horizonte con colores nuevos: su ${a.regencia.toLowerCase()} vuelve a encender la chispa que se había apagado. Déjate inspirar. ${C}`
      ],
      chamuel: [
        `${A} envuelve estos asuntos con la luz rosa de su ${a.regencia.toLowerCase()}: el amor verdadero llega, se sana o se libera según lo que tu corazón necesita. ${C}`,
        `${A} siembra paz sobre tus lazos: su ${a.regencia.toLowerCase()} reconcilia lo que está roto y enseña a recibir sin miedo el afecto que se ofrece. ${C}`
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
        ${arcangeles.map(a => `<span class="ar-chip" style="--chip:${a.color}"><span class="arc-avatar"><img src="${a.img}" alt="${this.nombreCorto(a.nombre)}" loading="lazy"><i></i><i></i><i></i><i></i></span>${this.nombreCorto(a.nombre)}</span>`).join("")}
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
        const aUnido = this.arcangelUnido(arcangeles);
        htmlFinal += `<div class="mensaje-poderoso vidrio" style="--arc-color:${aUnido.color};animation-delay:${(1.2 + i * 0.25).toFixed(2)}s">
          <span class="arc-part" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
          <h3 style="color:var(--dorado)">El mensaje final</h3>
          <p class="presencia-arc">${this.fraseArea(aUnido, "cierre")}</p>
          <p>${b.texto}</p>
          <p class="cita">"${b.cita}"</p>
        </div>`;
      } else {
        htmlFinal += `<div class="bloque-categoria vidrio${b.regano ? " regano" : ""}" style="--arc-color:${arcDeArea.color};animation-delay:${(1.2 + i * 0.25).toFixed(2)}s">
          <span class="arc-part" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
          <h4><span class="cat-icono">${b.icono}</span> ${b.titulo}
            <span class="cat-arc" style="--chip:${arcDeArea.color}"><span class="arc-avatar"><img src="${arcDeArea.img}" alt="${this.nombreCorto(arcDeArea.nombre)}" loading="lazy"><i></i><i></i><i></i><i></i></span>${this.nombreCorto(arcDeArea.nombre)}</span>
            ${b.regano ? '<span class="regano-tag">regaño</span>' : ""}
            ${b.combinacion ? `<span class="combo-tag combo-${b.combinacion.tipo}">combinación ${b.combinacion.tipo}</span>` : ""}
          </h4>
          ${b.presencia ? `<p class="presencia-arc">${b.presencia}</p>` : ""}
          ${b.texto ? `<p>${b.texto}</p>` : ""}
          ${b.cartasHtml ? `<div class="regano-cartas">${b.cartasHtml}</div>` : ""}
          ${b.combinacion ? (b.combinacion.cartas && b.combinacion.cartas.length ? `<div class="combo-visual">
            ${b.combinacion.cartas.map(c => this.comboCartaHtml(c)).join('<span class="combo-mas">+</span>')}
            ${b.combinacion.cartas.length > 1 ? '<span class="combo-mas combo-igual">=</span>' : ""}
            <span class="combo-significado"><b>Se unen en ${this.contextoDeCombinacion(b.combinacion.cartas)}:</b> ${b.combinacion.texto}</span>
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