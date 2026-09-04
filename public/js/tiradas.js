/* ============================================================
   ORÁCULO · Tiradas interactivas de tarot
   Estilo de interpretación inspirado en tiradadetarot.gratis
   ============================================================ */

const TIRADAS = {

  mazo: null,

  definirMazo() {
    this.mazo = ORACULO.mazoCompleto();
  },

  /* ------------------------- definición de tiradas ------------------------ */
  catalogo: [
    { id: "1-carta",   nombre: "Mensaje para hoy",   icono: "🕯️", corto: "Una carta, un mensaje: la guía del día.", n: 1, posiciones: [["Tu mensaje", "La energía central de tu momento"]] },
    { id: "3-cartas",  nombre: "Pasado · Presente · Futuro", icono: "💫", corto: "Tres cartas que revelan la línea del tiempo.", n: 3, posiciones: [["Pasado", "Lo que te trajo hasta aquí"], ["Presente", "Tu energía actual"], ["Futuro", "El rumbo que se aproxima"]] },
    { id: "5-cartas",  nombre: "La Estrella", icono: "🌟", corto: "Cinco cartas que trazan tu sendero hacia la meta.", n: 5, posiciones: [["Situación", "Dónde estás ahora"], ["Camino", "La mejor vía a seguir"], ["Obstáculo", "Lo que debes trascender"], ["Ayuda", "El apoyo que te sostiene"], ["Resultado", "Hacia dónde te encaminas"] ] },
    { id: "cruz-celta", nombre: "Cruz Celta", icono: "🕊️", corto: "La lectura clásica y profunda de diez cartas.", n: 10, posiciones: [["Corazón del asunto", "El centro de la consulta"], ["Lo que cruza", "Las influencias que la atraviesan"], ["Lo que está por encima", "Consciente o metas"], ["Lo que está por debajo", "Inconsciente o raíces"], ["Lo que pasó", "Pasado reciente"], ["Lo que viene", "Futuro cercano"], ["Tu actitud", "Cómo te enfrentas a ello"], ["El entorno", "Influencias externas"], ["Esperanzas y miedos", "Lo que anhelas y temes"], ["Resultado", "La síntesis final"] ] },
    { id: "si-no",     nombre: "Sí o No directo", icono: "🎯", corto: "Una carta, una respuesta clara para tu pregunta.", n: 1, posiciones: [["Tu respuesta", "El veredicto del oráculo"]] }
  ],

  elegantIcono: { "1-carta": "🕯️", "3-cartas": "💫", "5-cartas": "🌟", "cruz-celta": "🕊️", "si-no": "🎯" },
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
    const barajado = this.barajar(this.mazo);
    const cartas = barajado.slice(0, t.n).map(c => {
      const invertido = Math.random() < 0.35;
      return {
        id: this.idDe(c),
        nombre: c.nombre,
        arcana: c.arcana,
        palo: c.palo,
        emoji: c.emoji,
        palabras: c.palabras,
        texto: invertido ? c.invertida : c.derecho,
        sentido: invertido ? "invertida" : "derecha",
        invertido
      };
    });
    return { tirada: t, cartas };
  },

  idDe(c) { return c.arcana === "mayor" ? "M" + c.n : c.paloClave + "-" + c.n; },

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
    miguel:  { nombre: "Arcángel Miguel",  emoji: "⚔️", regencia: "Protección y fuerza",      color: "104, 140, 220",     mensaje: "El guerrero de la luz vigila tu camino y disuelve toda oscuridad que se interponga. Bajo su espada, tu protección está garantizada mientras avanzas con valor." },
    gabriel: { nombre: "Arcángel Gabriel", emoji: "📯", regencia: "Mensajes y propósito",      color: "212, 175, 55",      mensaje: "El mensajero divino despeja tu mente y te trae claridad sobre el propósito de tu alma. Presta atención a las señales: a través de él el universo te habla." },
    rafael:  { nombre: "Arcángel Rafael",  emoji: "🕯️", regencia: "Curación y guía",          color: "90, 200, 160",      mensaje: "El sanador ilumina las heridas que piden ser cuidadas, tanto del cuerpo como del alma. Su energía restauradora fluye hacia ti y te devuelve el equilibrio." },
    uriel:   { nombre: "Arcángel Uriel",   emoji: "🔥", regencia: "Sabiduría y discernimiento", color: "230, 150, 60",      mensaje: "El portador de la luz te otorga la sabiduría para ver con claridad lo que está oculto. Confía en la certeza interior que enciende en tu corazón." },
    zadkiel: { nombre: "Arcángel Zadkiel", emoji: "💜", regencia: "Misericordia y liberación", color: "160, 110, 240",     mensaje: "El ángel de la misericordia te ayuda a soltar culpas, viejos resentimientos y ataduras del pasado. Su presencia abre paso a un perdón que te libera." },
    jofiel:  { nombre: "Arcángel Jofiel",  emoji: "🌞", regencia: "Belleza e inspiración",     color: "255, 170, 120",     mensaje: "El ángel de la belleza inunda tu vida de inspiración y te muestra la luz que hay incluso en los días grises. Rodeate de lo que te eleva y verás florecer tu mundo." },
    chamuel: { nombre: "Arcángel Chamuel", emoji: "💗", regencia: "Paz y amor",               color: "240, 120, 150",     mensaje: "El ángel del amor puro trae paz a tus relaciones y reaviva los lazos más sinceros. A su calor, las puertas del corazón se abren a un afecto verdadero." }
  },

  arcangelRegente(resultado) {
    const claves = Object.keys(this.arcangeles);
    const s = (resultado.cartas || [])
      .map(c => c.nombre + c.arcana + (c.invertido ? "i" : "d"))
      .join("|") + "||" + resultado.tirada.id;
    let h = 2166136261;
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    h = h >>> 0;
    const clave = claves[h % claves.length];
    return { clave, ...this.arcangeles[clave] };
  },

  /* tiñe el fondo de la página con la energía del arcángel regente */
  aplicarFondo(arcangel) {
    const rgb = arcangel.color;
    document.documentElement.style.setProperty("--color-arc", rgb);
    document.body.style.background =
      "radial-gradient(1100px 700px at 12% 10%, rgba(" + rgb + ",0.42), transparent 58%)," +
      "radial-gradient(1000px 800px at 90% 95%, rgba(" + rgb + ",0.35), transparent 60%)," +
      "radial-gradient(600px 500px at 50% 50%, rgba(" + rgb + ",0.18), transparent 65%)," +
      "linear-gradient(160deg, var(--nocturno) 0%, var(--nocturno2) 55%, #241650 100%)";
  },

  /* interpretación final por categorías */
  interpretacionFinal(resultado) {
    const cartas = resultado.cartas;
    const total = cartas.length;
    const bien = cartas.filter(c => !c.invertido).length;
    const propor = bien / total;
    const cita = this.citas[Math.floor(Math.random() * this.citas.length)];

    const tonoPalabra = (bueno, malo, medio) => propor >= 0.8 ? bueno : (propor >= 0.5 ? medio : malo);

    const economia = {
      catalizador: `El plano económico de tu vida se encuentra hoy en un momento de ${propor >= 0.5 ? "apertura y flujo" : "fragilidad y contención"} que no es casual, sino el reflejo directo del orden interior que el oráculo revela en tu lectura. Los movimientos de dinero que se aproximan no aparecen por azar: responden a decisiones que tomaste antes, a puertas que supiste abrir en silencio y a otras que aún no te atreves a tocar. Si llevas tiempo sintiendo que tu energía no se traduce en abundancia, es porque has estado esperando el "momento perfecto" que en realidad se construye con pequeños pasos firmes. La invitación del oráculo es clara: administra con calma, no des por sentado lo que entra ni entres en pánico por lo que sale, porque la estabilidad que buscas se forja ahora, en la manera tranquila con la que sostienes cada cuenta y cada promesa. Hay una oportunidad concreta cerca de ti que muchos no verán por mirar solo el ruido; tú sí puedes verla si bajas la ansiedad y subes la atención a los detalles que siempre pasan desapercibidos.`,
      bloqueo: `El plano económico aparece teñido de advertencia, y tu lectura no lo oculta: hay fuga de energía, gastos que se repiten sin medida y promesas de prosperidad que hasta ahora han llegado con más ruido que sustancia. No es una condena, sino un aviso a tiempo. El dinero que se escurre suele irse por rendijas emocionales: compras de consuelo, préstamos que no se planean, límites que no se ponen con quienes se han acostumbrado a tu generosidad. Este es el momento de revisar números con honestidad, de distinguir entre lo que necesitas y lo que solo calma un vacío temporal, y de cerrar la puerta a lo que te drena sin aportarte. La carencia que sientes no es falta de abundancia del universo, sino espacio en tu vida para recibirla. Cuando ordenes ese espacio, el flujo volverá, y volverá con más fuerza porque ya no encontrará obstáculos. Confía en que este bache es la base de un cimiento más sólido, y no el techo de tus posibilidades.`
    };
    const economiaTexto = propor >= 0.5 ? economia.catalizador : economia.bloqueo;

    const amor = {
      bueno: `En el amor, tu lectura despliega una energía generosa y luminosa: se abren caminos de encuentro, de entendimiento y de entrega sincera. Si estás en pareja, se avecina un reencuentro en la intimidad, una conversación que lleva demasiado tiempo esperando y que traerá más luz que sombra; el vínculo que parecía distante está a punto de recuperar su calor. Si estás en soledad, una presencia interesante se está acercando a tu órbita, alguien que no llega con grandes discursos sino con una constancia que mereces reconocer. El oráculo te pide que bajes la guardia y abras el corazón al ritmo real de las cosas: no fuerces, no exijas pruebas innecesarias, deja que el afecto fluya con la naturalidad de quien ya sabe que merece ser amado. La paz que buscas en otra persona comienza, una vez más, en la paz que puedes darte a ti.`,
      medio: `El amor te habla hoy con un lenguaje de matices: ni todo es fuego ni todo es silencio, y en ese punto medio está precisamente la clave que tu lectura quiere mostrarte. Puede que estés esperando palabras que llegan tarde, gestos que no terminan de concretarse o una claridad que la otra persona aún no sabe cómo entregar. Pero la lectura sugiere que el desorden no está en el corazón de los demás, sino en la conversación que aún no se ha atrevido a ocurrir: temores no dichos, expectativas no compartidas, silencios cargados de supuestos. Es momento de nombrar lo que sientes con la serenidad de quien no quiere encender una pelea, sino encender una puerta. Si estás en soledad, revisa qué tipo de amor has estado repitiendo y suelta el patrón que ya no te hace bien; lo que buscas no está tan lejos como tu miedo sugiere.`,
      malo: `El amor se presenta envuelto en niebla, y tu lectura te pide que no tengas miedo al silencio ni a la distancia: a veces el oráculo despeja el camino retirando lo que no estaba destinado a quedarse. Si hay alguien que se ha vuelto esquivo, frío o contradictorio, escucha lo que su ausencia grita con más honestidad que sus palabras. No se trata de castigar ni de rendirse, sino de dejar de invertir tu corazón donde no está siendo recibido ni cuidado. Este momento de sombra en lo afectivo tiene un propósito: vaciar el espacio para que el amor que sí te corresponde pueda entrar sin tener que disputar tu atención. Date el permiso de sentir la tristeza sin que te defina, y recuerda que tu valía no depende de ser elegido por quien no sabe mirarte con respeto. La luz volverá, y lo hará en forma de una presencia que no tendrás que mendigar.`
    };
    const amorTexto = propor >= 0.8 ? amor.bueno : (propor >= 0.5 ? amor.medio : amor.malo);

    const situacion = `Las situaciones que hoy envuelven tu camino son más profundas de lo que parecen a simple vista, y tu lectura te lo muestra sin adornos. Hay un movimiento invisible, de esos que se preparan bajo la superficie antes de hacerse visibles, y tú formas parte de él aunque aún no puedas nombrarlo. Todo lo que estás viviendo en estos días, por confuso o cotidiano que parezca, te está llevando a un reordenamiento necesario: personas que se alejan, compromisos que cambian de forma, cuestiones que piden ser revisadas. El oráculo te invita a no resistirte a ese ajuste con miedo, porque lo que se está reorganizando en tu vida lo hace para acomodarte mejor a la persona que estás destinado a ser. Observa tu entorno con calma, distingue lo que te sostiene de lo que te limita, y elige conscientemente dónde poner tu energía. Nada de lo que ocurre ahora es un desvío: todo es parte del mismo sendero que te conduce a un lugar más alineado con tu esencia.`;

    const bloqueo = { alto: `Tu lectura detecta en tu camino un bloqueo que no es externo sino interior, y es importante que lo mires con honestidad para poder disolverlo: se trata de un miedo que ya cumplió su función y ahora te retiene en un lugar conocido pero agotador. Ese temor, que alguna vez te sirvió para protegerte, hoy se disfraza de rutina, de excusa cómoda, de "voy a esperar un poco más" o de "todavía no es el momento". El oráculo te asegura que el momento es ahora, y que lo único que lo separa de ti es esa resistencia silenciosa que has dejado de cuestionar. Las personas o situaciones que te agobian son el espejo de un límite que no has puesto contigo mismo primero. La salida no está en pelear contra el miedo, sino en caminar hacia adelante a pesar de él: cada paso que des con la duda encendida pero el rumbo claro irá desbloqueando, uno a uno, los cerrojos que creíste imposibles de abrir.`, bajo: `Aunque tu lectura brilla con fuerza, también te marca un punto de atención que conviene no ignorar: acostumbrarse a la calma no significa que no existan nudos que desatar en silencio. Hay un tema que llevas arrastrando sin darle el peso que merece, tal vez por comodidad o por no querer romper la paz que tanto te costó construir. Esa pequeña fisura, si no la atiendes con calma, puede crecer sin que la veas llegar. El oráculo no te pide dramatismo, sino prevención: dedica un tiempo honesto a cerrar lo que quedó abierto, a perdonar lo que aún pesa y a soltar lo que ya no te aporta. Los bloqueos de quien está en buena energía no son muros, sino puertas que con cuidado se abren solas. No dejes para mañana el cuidado de tu paz interior: eso es lo único que realmente nunca debes postergar.` };
    const bloqueoTexto = propor >= 0.5 ? bloqueo.bajo : bloqueo.alto;

    const trabajoTexto = `En el terreno del trabajo y la proyección, tu lectura apunta a ${propor >= 0.5 ? "una etapa de crecimiento y reconocimiento que se está gestando" : "una etapa de revisión y reajuste que no debes temer"}, y arroja luz sobre el camino profesional que tienes por delante. Si sientes que avanzas sin rumbo o que tu esfuerzo no es visto, entiende que lo que siembras ahora es la cosecha que recogerás en los meses que siguen: la constancia, la honestidad en el trabajo y la capacidad de aprender de cada tropiezo son tus mayores aliados, más poderosos que cualquier red de contactos o golpe de suerte. Hay oportunidades que están por llegar, y no siempre parecerán oportunidades: a veces llegan en forma de reto incómodo, de responsabilidad inesperada, de tarea que nadie quiere. Aquella que las abrace con seriedad encontrará en ellas un trampolín. Mantén tu mirada alta y tus pies en la tierra, deja de compararte con los tiempos de los demás y recuerda que tu talento, cuando se pone al servicio de algo mayor, no pasa desapercibido ante quienes realmente saben ver.`;

    const futuro = { bueno: `De cara al futuro, el oráculo te dibuja un horizonte que merece ser mirado con esperanza y determinación: los próximos meses traerán la cosecha de lo que hoy estás cuidando con fe, una combinación de oportunidades personales y colectivas que se irán destapando como capas de una historia que siempre supo hacia dónde iba. Lo que tanto has pedido no vendrá de una sola vez, sino en un flujo constante de pequeños avances que, sumados, cambiarán tu panorama de forma irreversible. Habrá encuentros que parecerán casuales y no lo serán, decisiones que tomarás casi sin darte cuenta y que marcarán un antes y un después, y una sensación cada vez más clara de estar en el lugar correcto. Prepárate no con ansiedad sino con apertura: suelta lo que ya cumplió su ciclo, agradece el camino recorrido y camina hacia lo nuevo con la certeza de que el universo ya está alineando las piezas a tu favor. Tu futuro está escribiéndose ahora, y lo que escribas con tus manos y tu corazón será tan poderoso como todo lo que deseas.`, malo: `De cara al futuro, tus cartas no te traen malas noticias, sino una llamada a la acción mucho más urgente de lo que tu comodidad quisiera aceptar: el tiempo de la espera pasiva ha terminado, y todo lo que anhelas necesita que des un paso decidido, aunque no tengas todas las respuestas. Los próximos meses pondrán frente a ti las mismas puertas que ya viste antes, y estarán esperando saber si esta vez eres capaz de atravesarlas con la madurez de quien ya aprendió la lección. No habrá un día perfecto, ni una señal más clara que esta que ahora lees: el futuro no se recibe, se construye, y se construye con decisiones incómodas, con límites que duelen poner y con fe que se ejerce incluso cuando no se siente. Confía en que las dificultades que vislumbras son el precio de una transformación profunda, y que la persona que serás pasado mañana te agradecerá cada paso valiente que des hoy. El horizonte no está cerrado: está esperando que lo camines.` };
    const futuroTexto = propor >= 0.5 ? futuro.bueno : futuro.malo;

    const cierrePoderoso = propor >= 0.5
      ? `Recibe este mensaje como un llamado a tu grandeza: ya no eres quien espera afuera de su propia vida, sino quien abre la puerta y entra. Todo lo que te rodea está listo para cambiar porque tú estás listo para cambiar con ello. Confía, actúa y déjate sostener por la certeza de que el universo ya camina a tu lado.`
      : `Este mensaje no es una advertencia, es un despertar: eres mucho más grande que el miedo que te ha estado frenando, y ha llegado el instante de demostrártelo. Cada obstáculo que hoy ves es en realidad una prueba que has superado en silencio muchas veces. Ahora elige a la persona valiente que ya eres, da el paso que el corazón viene pidiéndote, y deja que el universo te acompañe hacia la vida que mereces. No sigas posponiendo tu propio milagro: él te necesita en movimiento.`;

    return [
      { icono: "💼", area: "economia",  titulo: "Economía y abundancia", texto: economiaTexto },
      { icono: "💞", area: "amor",      titulo: "Amor y relaciones",     texto: amorTexto },
      { icono: "🌓", area: "situacion", titulo: "Situaciones actuales",  texto: situacion },
      { icono: "🔓", area: "bloqueo",   titulo: "Bloqueos a liberar",     texto: bloqueoTexto },
      { icono: "🕯️", area: "trabajo",   titulo: "Trabajo y proyección",   texto: trabajoTexto },
      { icono: "🌟", area: "futuro",    titulo: "Lo que te espera a futuro", texto: futuroTexto }
    ].concat([{ cierre: true, texto: cierrePoderoso, cita }]);
  },

  /* una línea por área, con la personalidad del arcángel regente al frente */
  fraseArea(arcangel, area) {
    const f = this.fraseArcangel(arcangel);
    return f[area];
  },

  fraseArcangel(a) {
    const A = a.nombre;
    return {
      economia: `${A}, señor de la ${a.regencia.toLowerCase()}, vela por esta área y te dice: la abundancia no es cuestión de suerte, sino de orden y de decisión. Confía en su guía para ordenar tus recursos y abrir el caudal que mereces.`,
      amor: `${A} sostiene tu corazón en esta lectura: su energía de ${a.regencia.toLowerCase()} se derrama sobre tus vínculos para que el amor llegue, se sane o se libere tal como lo necesitas.`,
      situacion: `Desde su reino de ${a.regencia.toLowerCase()}, ${A} despeja la niebla de tus circunstancias y te muestra lo que de verdad importa, para que decidas con claridad y sin miedo.`,
      bloqueo: `${A} ilumina con su ${a.regencia.toLowerCase()} las cadenas invisibles que te retienen, y te da la fuerza para soltarlas una a una. Nada puede mantenerte atado cuando su luz te acompaña.`,
      trabajo: `Con la sabiduría de su ${a.regencia.toLowerCase()}, ${A} orienta tu camino profesional y despeja el sendero hacia el reconocimiento y la meta que persigues.`,
      futuro: `${A} despliega ante ti el mapa del porvenir: desde su ${a.regencia.toLowerCase()}, te asegura que lo que viene está alineado con tu propósito, si caminas con fe y decisión.`,
      cierre: `${A} sella esta lectura con su presencia. No estás sola: un arcángel ha tomado tu mano para guiarte. Confía, actúa y deja que su luz te lleve.`
    };
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

    const arcangel = this.arcangelRegente(resultadoHTML);
    this.aplicarFondo(arcangel);
    html += `<div class="arcangel-regente vidrio">
      <div class="ar-seal">${arcangel.emoji}</div>
      <div class="ar-info">
        <small>Tu lectura está regida por</small>
        <h3>${arcangel.nombre}</h3>
        <span class="ar-regencia">${arcangel.regencia} · rey de esta lectura</span>
        <p class="ar-mensaje">${arcangel.mensaje}</p>
      </div>
    </div>`;

    resultadoHTML.cartas.forEach((c, i) => {
      const pos = t.posiciones[i];
      html += `<div class="carta-grande vidrio">
        <div class="sello ${c.invertido ? "invertida" : ""}"><div>
          <div class="c-nm">${c.emoji}</div>
          <small>${c.arcana === "mayor" ? "Arcano Mayor" : c.palo}</small>
        </div></div>
        <div style="flex:1;min-width:240px">
          <h4>${pos[0]} <span style="font-weight:400;color:var(--lavanda-suave)">· ${pos[1]}</span></h4>
          <h3>${c.nombre} ${c.invertido ? '<small style="font-size:.8rem;color:#ffd7e0">(invertida)</small>' : ""}</h3>
          <div class="palabras">${c.palabras.map(p => "<span>" + p + "</span>").join("")}</div>
          <p class="interp">${c.texto}</p>
        </div>
      </div>`;
    });

    const finales = this.interpretacionFinal(resultadoHTML);
    let htmlFinal = `<div class="interpretacion-final"><h3 class="titulo-interp-final">✨ Interpretación final de tu tirada ✨</h3>`;
    finales.forEach(b => {
      if (b.cierre) {
        htmlFinal += `<div class="mensaje-poderoso vidrio">
          <h3 style="color:var(--dorado)">El mensaje final</h3>
          <p class="presencia-arc">${this.fraseArea(arcangel, "cierre")}</p>
          <p>${b.texto}</p>
          <p class="cita">"${b.cita}"</p>
        </div>`;
      } else {
        htmlFinal += `<div class="bloque-categoria vidrio">
          <h4><span class="cat-icono">${b.icono}</span> ${b.titulo}</h4>
          <p class="presencia-arc">${this.fraseArea(arcangel, b.area)}</p>
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
  for (let i = 0; i < 12; i++) {
    const m = document.createElement("div");
    m.className = "minicarta";
    m.style.width = "72px";
    m.style.padding = "12px 6px";
    m.innerHTML = "<span class='nm' style='font-size:1.2rem'>✦</span><span class='nom'>Oráculo</span>";
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
      <p style="margin-bottom:8px">Ahora elige tus cartas.</p>
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

  // mazo para tocar
  const zonaMazo = document.createElement("div");
  zonaMazo.className = "mazo";
  zonaMazo.style.marginTop = "34px";
  for (let i = 0; i < 15; i++) {
    const c = document.createElement("div");
    c.className = "minicarta";
    c.style.width = "84px";
    c.innerHTML = "<span class='nm'>✦</span><span class='nom'>Toca para elegir</span>";
    c.addEventListener("click", () => elegirUna(c, r));
    zonaMazo.appendChild(c);
  }
  escenario.appendChild(zonaMazo);

  const contador = document.getElementById("contador");
  const aviso = document.getElementById("aviso-cartas");

  function elegirUna(elm, r) {
    if (elegidas >= r.tirada.n) return;
    const carta = r.cartas[elegidas];
    elm.style.animation = "flotar 1s ease-in-out infinite";
    elm.innerHTML = `<span class="nm">${carta.emoji}</span><span class="nom">${carta.nombre}</span>`;
    setTimeout(() => {
      const plaza = document.getElementById("plaza-" + elegidas);
      plaza.classList.add("girada");
      const cara = plaza.querySelector(".cara");
      cara.innerHTML = `<div>
        <div class="c-nm">${carta.emoji}</div>
        <div class="c-nombre">${carta.nombre}</div>
        <div class="c-pos">${carta.invertido ? "invertida" : "derecha"}</div>
      </div>`;
      elegidas++;
      contador.textContent = elegidas;
      if (elegidas === r.tirada.n) {
        aviso.classList.remove("oculto");
        setTimeout(() => mostrarResultado(r), 1100);
      }
    }, 550);
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