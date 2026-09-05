/* ===============================
   Oráculo · Inicio
   Arcángel regente del día + ciclo lunar
   =============================== */

window.INICIO = (function () {
  "use strict";

  /* Los 7 arcángeles regentes según el día de la semana (tradición) */
  var ARCANGELES = {
    miguel:  { nombre: "Arcángel Miguel", dia: 0, regencia: "Protección, fuerza y valor",  emoji: "⚔️", color: [59, 130, 246] },
    jofiel:  { nombre: "Arcángel Jofiel", dia: 1, regencia: "Sabiduría, iluminación y lucidez", emoji: "🌸", color: [250, 204, 21] },
    chamuel: { nombre: "Arcángel Chamuel", dia: 2, regencia: "Amor, unión familiar y perdón", emoji: "💖", color: [244, 114, 182] },
    gabriel: { nombre: "Arcángel Gabriel", dia: 3, regencia: "Pureza, comunicación y guía", emoji: "🕊️", color: [226, 232, 240] },
    rafael:  { nombre: "Arcángel Rafael", dia: 4, regencia: "Salud, sanación y bienestar",  emoji: "💚", color: [74, 222, 128] },
    uriel:   { nombre: "Arcángel Uriel", dia: 5, regencia: "Abundancia, paz y prosperidad", emoji: "🔥", color: [249, 115, 22] },
    zadkiel: { nombre: "Arcángel Zadkiel", dia: 6, regencia: "Perdón, libertad y transformación", emoji: "💜", color: [147, 51, 234] }
  };

  var SEMANA = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

  /* Mensajes poderosos del día, en primera persona, como si nos hablara
     (cada uno también varía según el día) */
  var MENSAJES = {
    miguel: [
      "Hoy soy tu escudo. No temas, porque camino delante de ti y disuelvo todo lo que pretende frenarte. Vuelve a mí cada vez que el miedo llame a tu puerta.",
      "Te protejo, hija de la luz. Suelta el peso que cargas y deja que mi espada corte todo vínculo que ya no te sirve. Eres más fuerte de lo que imaginas.",
      "Mantén la cabeza alta: hoy la victoria es tuya. He apartado de tu camino lo que no nació para ti. Camina sin mirar atrás."
    ],
    gabriel: [
      "Te traigo un mensaje del cielo: lo que estás esperando ya viene en camino. Abre tu corazón y escucha, porque te hablaré al oído a lo largo del día.",
      "Yo soy el mensajero. Hoy las señales estarán por todas partes: no las dejes pasar. Una palabra, un recuerdo, un nombre… son pistas de lo que está por llegar.",
      "Comunica con claridad. Estoy contigo en cada palabra que digas hoy, para que tu voz llegue justo donde debe llegar."
    ],
    rafael: [
      "Con mi esmeralda de la curación toco tus heridas: del cuerpo, de la mente y del alma. Hoy empieza tu sanación. Déjame sostenerte.",
      "Te he traído un bálsamo para el corazón cansado. Respira conmigo y siente cómo la paz reemplaza al dolor. La salud y el bienestar regresan a ti.",
      "Todo aquello que te dolía sana hoy. Confía en este proceso: yo cuido de ti y de los tuyos en cada paso."
    ],
    uriel: [
      "Te traigo la abundancia que mereces: hoy abro las puertas de la prosperidad en tu economía y en tu hogar. Confía y actúa con fe.",
      "Hoy tu trabajo y tus decisiones rinden frutos. He encendido la luz de la prosperidad en tu camino; acércate y recógela.",
      "Yo soy el arcángel de la provisión. Deja de temer por el mañana: hoy los recursos llegan, la paz se instala y la abundancia fluye hacia ti.",
      "Trabaja con alegría y gratitud: hoy recojo lo sembrado y te devuelvo prosperidad, paz y estabilidad económica."
    ],
    zadkiel: [
      "Te ofrezco la misericordia: perdónate por lo que aún te reprochas. Hoy libero tu corazón de todo lo que no mereces cargar.",
      "Suéltalo y deja que el violeta del perdón lo disuelva. Suelta el resentimiento y sentirás nacer algo nuevo y luminoso.",
      "Hoy el cielo pone en ti compasión y dulzura. Perdona y serás perdonada; suelta y serás libre.",
      "Con la llama violeta de la transmutación transformo tu pasado en luz y te devuelvo la libertad de empezar de nuevo."
    ],
    jofiel: [
      "Enciendo en ti la antorcha de la sabiduría y la lucidez mental. Hoy verás con claridad lo que antes te confundía.",
      "Yo ilumino tu mente: las respuestas, los estudios y las decisiones se aclaran hoy bajo mi luz amarilla. Confía en tu intuición.",
      "Te abro los ojos del entendimiento. Este día es para aprender, discernir y brillar con la luz del conocimiento.",
      "Limpio la niebla de tu pensamiento para que la sabiduría y la iluminación lleguen a cada pregunta de tu corazón."
    ],
    chamuel: [
      "Yo soy el arcángel del amor. Hoy lleno tu corazón y tu hogar de paz, unión y perdón. Ábrete a recibir amor y verás cómo se multiplica.",
      "Donde hay tensión, hoy pongo paz; donde hay distancia, hoy pongo encuentro; donde hay rencor, hoy pongo perdón. El amor fluye a tu alrededor.",
      "Te guardo en mi rosa de luz: hoy restauro la armonía entre quienes amas. Busca el amor en cada rincón de tu día.",
      "Suelta el peso y abre tu corazón: el amor incondicional llega hoy para sanar tu familia, tus vínculos y tu ser."
    ]
  };

  function pad(n) { return n < 10 ? "0" + n : "" + n; }
  function claveHoy(fecha) {
    var f = fecha || new Date();
    return f.getFullYear() + "-" + pad(f.getMonth() + 1) + "-" + pad(f.getDate());
  }

  /* arcángel del día según el día de la semana (0=Domingo ... 6=Sábado) */
  function arcangelDelDia(fecha) {
    var f = fecha || new Date();
    var dia = f.getDay();
    var claves = Object.keys(ARCANGELES);
    var c = null;
    for (var i = 0; i < claves.length; i++) {
      if (ARCANGELES[claves[i]].dia === dia) { c = ARCANGELES[claves[i]]; c.clave = claves[i]; break; }
    }
    return c || (ARCANGELES.miguel.clave = "miguel") && ARCANGELES.miguel;
  }

  /* mensaje del día según arcángel + día (rota entre sus frases) */
  function mensajeDelDia(arc, fecha) {
    var arr = MENSAJES[arc.clave];
    var s = claveHoy(fecha);
    var h = 0, i;
    for (i = 0; i < s.length; i++) { h += s.charCodeAt(i) * (i + 3); }
    return arr[h % arr.length];
  }

  /* ------------------------- ciclo lunar ------------------------- */
  var FASES = [
    { nombre: "Luna Nueva",    ico: "🌑" },
    { nombre: "Cuarto Creciente", ico: "🌒" },
    { nombre: "Creciente Gibosa", ico: "🌓" },
    { nombre: "Luna Llena",    ico: "🌕" },
    { nombre: "Gibosa Menguante", ico: "🌖" },
    { nombre: "Cuarto Menguante", ico: "🌗" },
    { nombre: "Menguante",     ico: "🌘" },
    { nombre: "Luna Nueva",    ico: "🌑" }
  ];

  function faseLunar(fecha) {
    /* sincronización: luna nueva de referencia (6 ene 2000 18:14 UTC) */
    var ref = Date.UTC(2000, 0, 6, 18, 14, 0);
    var d = (fecha ? fecha.getTime() : Date.now()) - ref;
    var dias = d / 86400000;
    var ciclos = dias / 29.53058867;
    var fraccion = ciclos - Math.floor(ciclos); /* 0..1 */
    return fraccion;
  }

  /* ------------------------ portal energético del día --------------------- */
  var PORTAL_NIVELES = {
    ninguno:    { etiqueta: "Sin portal energético" },
    leve:       { etiqueta: "Portal energético leve" },
    normal:     { etiqueta: "Portal energético" },
    importante: { etiqueta: "Portal energético importante" }
  };

  function reduccionNumerologica(n) {
    var r = n;
    while (r > 33 || (r > 9 && r !== 11 && r !== 22)) {
      var s = 0;
      while (r > 0) { s += r % 10; r = Math.floor(r / 10); }
      r = s;
    }
    return r;
  }

  function portalDelDia(fecha) {
    var f = fecha || new Date();
    var dia = f.getDate();
    var mes = f.getMonth() + 1;
    var anio = f.getFullYear();
    var fraccion = faseLunar(f);
    var puntos = 0;

    /* números maestros del día (11, 22) */
    if (dia === 11 || dia === 22) puntos += 2;

    /* día espejo (día == mes): 1/1, 2/2 ... 12/12, resonancia numérica */
    if (dia === mes) puntos += 1;

    /* la fecha completa reducida cae en número maestro (11, 22 o 33) */
    if (reduccionNumerologica(dia + mes + anio) === 11 ||
        reduccionNumerologica(dia + mes + anio) === 22 ||
        reduccionNumerologica(dia + mes + anio) === 33) puntos += 1;

    /* luna nueva o luna llena: ventanas de gran energía */
    var distNueva = Math.min(fraccion, 1 - fraccion);
    if (distNueva < 0.02 || Math.abs(fraccion - 0.5) < 0.02) puntos += 1;

    if (puntos >= 3) return "importante";
    if (puntos === 2) return "normal";
    if (puntos === 1) return "leve";
    return "ninguno";
  }

  function renderCicloLunar() {
    var el = document.getElementById("barra-lunar");
    if (!el) return;
    var hoy = new Date();
    var f = faseLunar(hoy);
    var diaLunar = Math.floor(f * 29.53058867) + 1; /* 1..30 */
    var idx8 = Math.floor(f * 8) % 8;
    var fase = FASES[idx8];
    var fTexto = hoy.toLocaleDateString("es-ES", { weekday: "short", day: "numeric", month: "short" });
    var det = "· " + fTexto + " · día " + diaLunar + " del ciclo lunar";

    document.getElementById("lunar-icono").textContent = fase.ico;
    document.getElementById("lunar-fase").textContent = fase.nombre;
    document.getElementById("lunar-detalle").textContent = det;

    /* puntos de las 8 fases, resaltando la actual */
    var pts = document.getElementById("lunar-puntos");
    pts.innerHTML = "";
    FASES.forEach(function (p, i) {
      var s = document.createElement("span");
      s.className = "lunar-pt" + (i === idx8 ? " activo" : "");
      s.textContent = p.ico;
      s.title = p.nombre;
      pts.appendChild(s);
    });

    /* portal energético del día, con color según su fuerza */
    var portal = document.getElementById("lunar-portal");
    if (portal) {
      var nivel = portalDelDia(hoy);
      portal.className = "lunar-portal portal-" + nivel;
      portal.textContent = PORTAL_NIVELES[nivel].etiqueta;
    }
  }

  /* --------------------- arcángel regente del día --------------------- */
  function renderRegenteDia() {
    var caja = document.getElementById("regente-dia");
    if (!caja) return;
    var arc = arcangelDelDia();
    var msg = mensajeDelDia(arc);

    var fecha = new Date();
    var fHoy = claveHoy(fecha).split("-").reverse().join("/");

    document.getElementById("rd-fecha").textContent = fHoy;
    var seal = document.getElementById("rd-seal");
    seal.textContent = arc.emoji;
    seal.style.background =
      "radial-gradient(circle at 35% 30%, rgba(255,255,255,0.45), transparent 60%), linear-gradient(160deg, rgba(" + arc.color.join(",") + ",0.95), rgba(140,110,220,0.8))";
    seal.style.boxShadow = "0 10px 30px rgba(" + arc.color.join(",") + ",0.6)";
    document.getElementById("rd-nombre").textContent = arc.nombre;
    document.getElementById("rd-regencia").textContent = arc.regencia;
    document.getElementById("rd-mensaje").textContent = "\u201C" + msg + "\u201D";
    document.getElementById("rd-firma").textContent = "— " + arc.nombre.replace("Arcángel ", "") + ", tu guardián de hoy";

    caja.style.setProperty("--arc-dia", arc.color.join(","));
  }

  function init() {
    renderCicloLunar();
    renderRegenteDia();
  }

  document.addEventListener("DOMContentLoaded", init);

  return {
    ARCANGELES: ARCANGELES,
    arcangelDelDia: arcangelDelDia,
    mensajeDelDia: mensajeDelDia,
    faseLunar: faseLunar,
    portalDelDia: portalDelDia,
    reduccionNumerologica: reduccionNumerologica
  };
})();
