/* ===============================
   Oráculo · Inicio
   Arcángel regente del día + ciclo lunar
   =============================== */

window.INICIO = (function () {
  "use strict";

  /* Los 7 arcángeles regentes (misma energía que las tiradas) */
  var ARCANGELES = {
    miguel:  { nombre: "Arcángel Miguel", regencia: "Protección y fuerza",   emoji: "⚔️", color: [104, 140, 220] },
    gabriel: { nombre: "Arcángel Gabriel", regencia: "Mensajes y revelación", emoji: "🕊️", color: [212, 175, 55] },
    rafael:  { nombre: "Arcángel Rafael", regencia: "Curación y sanación",    emoji: "💚", color: [90, 200, 160] },
    uriel:   { nombre: "Arcángel Uriel", regencia: "Sabiduría y discernimiento", emoji: "🔥", color: [230, 150, 60] },
    zadkiel: { nombre: "Arcángel Zadkiel", regencia: "Misericordia y perdón", emoji: "💜", color: [160, 110, 240] },
    jofiel:  { nombre: "Arcángel Jofiel", regencia: "Belleza y claridad",     emoji: "🌸", color: [255, 170, 120] },
    chamuel:{ nombre: "Arcángel Chamuel", regencia: "Paz y amor",            emoji: "💖", color: [240, 120, 150] }
  };

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
      "Yo ilumino la noche de tu duda. Lo que hoy no entiendes, muy pronto tendrá sentido. Pide claridad y te la daré sin reservas.",
      "Déjame encender la antorcha de la sabiduría en tu sendero. No tomes decisiones en la oscuridad: detente, respira y verás la respuesta.",
      "La respuesta que buscas ya está dentro de ti. Hoy te ayudo a escucharla con honestidad y valentía."
    ],
    zadkiel: [
      "Te ofrezco la misericordia: perdónate por lo que aún te reprochas. Hoy libero tu corazón de todo lo que no mereces cargar.",
      "Suéltalo y deja que el azul violeta del perdón lo disuelva. Suelta el resentimiento y sentirás nacer algo nuevo y luminoso.",
      "Hoy el cielo pone en ti compasión y dulzura. Perdona y serás perdonada; suelta y serás libre."
    ],
    jofiel: [
      "Yo embellezco tu vida y tu mente. Busca la belleza que te rodea hoy y déjala entrar: en la luz, en las personas, en ti.",
      "Limpio la niebla de tu mente para que veas con claridad divina. Lo que hoy se te presenta borroso, pronto será cristalino.",
      "Te abro las puertas del estudio y la inspiración. Deja que la belleza del conocimiento florezca en tu día."
    ],
    chamuel: [
      "Yo soy el arcángel del amor. Hoy lleno tu corazón y tu hogar de paz. Ábrete a recibir amor y verás cómo se multiplica.",
      "Donde hay tensión, hoy pongo paz; donde hay distancia, hoy pongo encuentro. Busca el amor en cada rincón de tu día.",
      "Te guardo en mi rosa de luz. Siente el amor incondicional del cielo sobre ti y deja que fluya hacia quienes amas."
    ]
  };

  function pad(n) { return n < 10 ? "0" + n : "" + n; }
  function claveHoy(fecha) {
    var f = fecha || new Date();
    return f.getFullYear() + "-" + pad(f.getMonth() + 1) + "-" + pad(f.getDate());
  }

  /* selección determinista diaria del arcángel */
  function arcangelDelDia(fecha) {
    var s = claveHoy(fecha);
    var h = 0, i;
    for (i = 0; i < s.length; i++) { h = (h * 31 + s.charCodeAt(i)) % 700000; }
    var claves = Object.keys(ARCANGELES);
    var idx = h % claves.length;
    var c = ARCANGELES[claves[idx]];
    c.clave = claves[idx];
    return c;
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

  function renderCicloLunar() {
    var el = document.getElementById("barra-lunar");
    if (!el) return;
    var f = faseLunar();
    var diaLunar = Math.floor(f * 29.53058867) + 1; /* 1..30 */
    var idx8 = Math.floor(f * 8) % 8;
    var fase = FASES[idx8];
    var det = "· día " + diaLunar + " del ciclo lunar";

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
    faseLunar: faseLunar
  };
})();
