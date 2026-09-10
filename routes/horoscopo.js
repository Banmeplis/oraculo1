const express = require("express");
const { signoPublico, usuarioActual } = require("../middleware/auth.js");
const { completarIA, isOpenAIConfigured, isHFConfigured } = require("./ia.js");
const { ZODIACO } = require("../config/zodiaco.js");

const router = express.Router();

const HOROSCOPO_CACHE = new Map();

function semanaActual() {
  const hoy = new Date();
  const dia = hoy.getDay() || 7;
  const inicio = new Date(hoy);
  inicio.setDate(hoy.getDate() - dia + 1);
  const fin = new Date(inicio);
  fin.setDate(fin.getDate() + 6);
  const fmt = (d) => d.toISOString().slice(0, 10);
  const span = (d) => d.toLocaleDateString("es-ES", { day: "numeric", month: "short" });
  return { desde: fmt(inicio), hasta: fmt(fin), desdeL: span(inicio), hastaL: span(fin) };
}

function semilla(texto) {
  let h = 0;
  for (let i = 0; i < String(texto).length; i++) h = (h + (String(texto).charCodeAt(i) * (i + 3))) | 0;
  return h;
}

const HOROSCOPO_FALLBACK = {
  Aries: {
    dia: [
      "La chispa de Aries se alinea hoy con la valentía de empezar: inicia esa conversación o ese proyecto que llevas posponiendo, porque la primera palabra ya está de tu lado.",
      "Día de fuego para Aries: tu energía contagia a los demás. Dirige ese ímpetu hacia una meta concreta y verás resultados antes de que anochezca.",
      "Hoy Aries clarifica lo que genuinamente quiere. Suelta todo lo que te roba energía y ocúpate únicamente de lo que te enciende la llama interior."
    ],
    semana: [
      "Esta semana Marte respira contigo: es momento de arrancar lo que viene aplazándose desde hace meses. Tu palabra es decisión, no prisa.",
      "Semana de liderazgo para Aries: te toca guiar, decir la verdad y defender tu espacio. Hazlo con firmeza y ternura, porque ambas son tuyas."
    ]
  },
  Tauro: {
    dia: [
      "Tauro: hoy la constancia da su fruto. Termina aquella tarea pendiente y después regálate un placer sencillo: lo ganado con calma se disfruta doble.",
      "La estabilidad de Tauro se nota hoy: protege tu paz y tu dinero. Una decisión que posponías se puede tomar sin prisa, escuchando tu cuerpo.",
      "Hoy Tauro se permite ablandar la rutina. Sostener lo construido no significa quedarte quieto: introduce un pequeño cambio luminoso."
    ],
    semana: [
      "Semana de cosecha para Tauro: la paciencia con la que plantas está por dar frutos. Evita movimientos bruscos y confía en lo que ya camina.",
      "Tauro: esta semana la seguridad llega desde tu propia constancia. Cuida tu cuerpo, tu mesa y tus finanzas, y el cielo responde a tu calma."
    ]
  },
  Géminis: {
    dia: [
      "Géminis: hoy tu palabra tiene poder. Usa tu don para unir personas y compartir una idea que ayude; lo que hoy comunicas abre mañana una puerta.",
      "Día de ideas para Géminis: tu mente brilla y conecta lo que otros no ven. Escribe esa ocurrencia, porque es más valiosa de lo que crees.",
      "Hoy Géminis aprende mejor escuchando que hablando. Detente a oír lo que el otro dice de verdad; esa información te hará libre."
    ],
    semana: [
      "Semana de buenas noticias para Géminis: llegan mensajes, respuestas y encuentros que reacomodan tu mapa. Acepta las invitaciones que te iluminen.",
      "Géminis: esta semana tu versatilidad es un superpoder, pero elige un foco. Profundizar en una sola cosa te dará más que dispersarte."
    ]
  },
  Cáncer: {
    dia: [
      "Cáncer: hoy tu hogar interior pide cuidado. Dedica un momento a lo que te abriga (familia, casa, tu rincón) y notarás cómo todo se serena.",
      "La intuición de Cáncer está fina hoy: si algo te huele a mentira o a verdad, aciertas. Confía en ese pulso antes que en los argumentos ajenos.",
      "Hoy Cáncer regala ternura, pero también se la regala. Poner límites a quien te agota también es una forma de amor propio."
    ],
    semana: [
      "Semana emocionalmente fértil para Cáncer: los vínculos piden conversación sincera. Tu sensibilidad convierte lo cotidiano en algo sagrado.",
      "Cáncer: esta semana cuida tu energía como cuidas la ajena. El agua delata tu estado interior: llena tu propia copa primero."
    ]
  },
  Leo: {
    dia: [
      "Leo: hoy brillas sin pedir permiso. Comparte tu talento con generosidad y alguien se sentirá inspirado por tu sola presencia.",
      "Día de sol para Leo: tu creatividad está encendida. No la guardes para la aprobación de nadie: haz lo que te dé orgullo.",
      "Hoy Leo se recuerda que su luz no necesita aplausos. Brilla, sí, y también deja brillar: el reconocimiento verdadero llega solo."
    ],
    semana: [
      "Semana de protagonismo para Leo: te piden hablar, liderar y dar el paso. Tu calidez abre puertas que la ambición sola no abriría.",
      "Leo: esta semana el regalo está en compartir tu sabiduría. Guiar a alguien más joven que tú también es una forma de coronarte."
    ]
  },
  Virgo: {
    dia: [
      "Virgo: hoy el orden te libera. Organiza tu espacio o tu agenda y verás cómo el caos interior se acomoda solo. Pequeños arreglos, grandes alivios.",
      "Día de servicio para Virgo: ayudas con precisión y humildad. Que tu perfección no te robe la alegría: hecho con amor vale más que perfecto.",
      "Hoy Virgo suelta un estándar imposible sobre sus hombros. Tu valor no depende de cuánto logras: descansa sobre quién eres."
    ],
    semana: [
      "Semana práctica para Virgo: planifica y el orden te traerá paz. Un detalle bien cuidado hoy, mañana será tu mejor inversión.",
      "Virgo: esta semana el cuerpo te pide escucha. Duerme, come y muévete con cariño; la mente clara es hija de un cuerpo cuidado."
    ]
  },
  Libra: {
    dia: [
      "Libra: hoy el equilibrio se conquista decidiendo. No puedes complacer a todos: elige con calma lo que se alinea con tu corazón, y la paz te sigue.",
      "Día de armonía para Libra: tu encanto abre diálogos. Úsalo para acercar posturas y sanar un malentendido pendiente.",
      "Hoy Libra embellece su entorno y su ánimo. Coquetea con lo bello contigo mismo: la armonía también se fabrica hacia dentro."
    ],
    semana: [
      "Semana de encuentros para Libra: las relaciones piden conversación, acuerdos y aire limpio. Tu diplomacia es tu mejor varita mágica.",
      "Libra: esta semana elige la paz, pero no la falsa. Decir tu verdad con ternura también es equilibrio."
    ]
  },
  Escorpio: {
    dia: [
      "Escorpio: hoy tu profundidad transforma. No temas mirar la verdad de frente: lo que desentierras con conciencia deja de tener poder sobre ti.",
      "Día de intensidad para Escorpio: sientes todo a flor de piel. Canaliza esa fuerza en algo creativo o físico y la emoción se vuelve aliada.",
      "Hoy Escorpio suelta el control sobre lo que se está moviendo. Tu poder crece justo cuando confías en el proceso."
    ],
    semana: [
      "Semana de metamorfosis para Escorpio: se cierra un ciclo viejo y nace uno nuevo. La palabra es soltar; el premio, renacer.",
      "Escorpio: esta semana tus percepciones aciertan. Úsalas con compasión: no todo lo que ves necesita ser dicho."
    ]
  },
  Sagitario: {
    dia: [
      "Sagitario: hoy el horizonte llama. Permítete soñar en grande, pero también da un paso concreto hacia ese sueño: la flecha necesita arco.",
      "Día de fe para Sagitario: tu optimismo levanta a quien tienes cerca. Compártelo, porque tu risa es medicina.",
      "Hoy Sagitario aprende en movimiento: una conversación, un lugar nuevo o un libro. La sincronía te busca donde estás creciendo."
    ],
    semana: [
      "Semana expansiva para Sagitario: se abren oportunidades de viaje, estudio o proyectos lejanos. Di que sí a lo que te ensanche el alma.",
      "Sagitario: esta semana aterriza un sueño. Concretar lo que imaginas te dará más seguridad que todos los planes futuros juntos."
    ]
  },
  Capricornio: {
    dia: [
      "Capricornio: hoy la constancia te distingue. Mantén el rumbo de esa meta a largo plazo; cada paso pequeño de hoy construye tu cima de mañana.",
      "Día de estructura para Capricornio: tu sentido de la responsabilidad inspira. Recuerda que el logro es tu cosecha, no tu valor.",
      "Hoy Capricornio se permite disfrutar el camino. El trabajo bien hecho ya es un regalo: celebra lo conseguido sin esperar más."
    ],
    semana: [
      "Semana de consolidación para Capricornio: te apoyan bases viejas mientras se trazan nuevas. La paciencia es tu mayor aliada estratégica.",
      "Capricornio: esta semana equilibra ambición y descanso. Tu montaña estará ahí mañana; tu cuerpo agradece la pausa hoy."
    ]
  },
  Acuario: {
    dia: [
      "Acuario: hoy tu originalidad rompe esquemas. Propón esa idea distinta, aunque incomode: el futuro te necesita justo a ti.",
      "Día de comunidad para Acuario: tu visión humanista conecta a las personas. Colabora, porque tu mejor avance es colectivo.",
      "Hoy Acuario se permite la cercanía. La libertad no se pierde por querer de verdad a alguien: ganas libertad cuando vinculas con honestidad."
    ],
    semana: [
      "Semana de renovación para Acuario: romper con lo que ya fue es sagrado. Rediseña tu rutina con un toque de futuro.",
      "Acuario: esta semana una amistad o un grupo te trae una señal importante. Mantén los oídos abiertos y el corazón fresco."
    ]
  },
  Piscis: {
    dia: [
      "Piscis: hoy tu sensibilidad capta lo que nadie ve. Confía en tu intuición artística o espiritual; ella te guiará sin mapa.",
      "Día de compasión para Piscis: tu ternura calma a otros. No te olvides de poner límites: tu don vale para ti también.",
      "Hoy Piscis sueña con los ojos abiertos. Escribe o dibuja esa visión, porque lo que imaginas tiene la costumbre de hacerse real."
    ],
    semana: [
      "Semana espiritual para Piscis: los sueños y las señales hablan fuerte. Anota lo que sientas: tu inconsciente te está mandando un mapa.",
      "Piscis: esta semana cuida tus emociones como un jardín. Riega las tuyas antes de regar las de todos."
    ]
  }
};

router.get("/", async (req, res) => {
  try {
    const u = req.session.user ? usuarioActual(req) : null;
    let signoNombre = String(req.query.signo || "").trim();
    if (!signoNombre) signoNombre = u && u.signo ? u.signo.signo : "";
    const signo = ZODIACO.find(s => s.signo.toLowerCase() === signoNombre.toLowerCase());
    if (!signo) return res.status(400).json({ error: "Signo no válido" });

    const sem = semanaActual();
    const clave = signo.signo + "|" + sem.desde;
    const cache = HOROSCOPO_CACHE.get(clave);
    if (cache) return res.json(cache);

    let delDia = null, semanaText = null, fuente = "fallback";

    if (isOpenAIConfigured() || isHFConfigured()) {
      const fechaHoy = new Date().toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" });
      const prompt = `Eres el Horóscopo Negro de EL CENDERO DE LOS AR🌙ANGELES, un oráculo angelical oscuro pero cariñoso. La persona es de signo ${signo.signo} (${signo.emoji}, elemento ${signo.elemento.toLowerCase()}), regido por el arcángel ${signo.arcangel}.

Responde EXACTAMENTE con dos párrafos separados por la palabra "PUNTO". Primer párrafo: horóscopo para HOY (${fechaHoy}), máximo 3 frases, cálido y directo. Segundo párrafo: horóscopo de la SEMANA (${sem.desdeL} al ${sem.hastaL}), máximo 3 frases. Sin listas, sin encabezados, en español.`;
      const texto = await completarIA(prompt, { maxTokens: 260, temp: 0.65 });
      if (texto.length > 30) {
        const partes = texto.split(/PUNTO|\n{2,}/i).map(p => p.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim()).filter(Boolean);
        if (partes.length >= 1) delDia = partes[0].slice(0, 300);
        if (partes.length >= 2) semanaText = partes[1].slice(0, 340);
        if (partes.length === 1 && partes[0].indexOf(". ") > 40) {
          const corte = partes[0].indexOf(". ");
          delDia = partes[0].slice(0, corte + 1);
          semanaText = partes[0].slice(corte + 2);
        }
        if (delDia) fuente = "ia";
      }
    }

    if (!delDia) {
      const fb = HOROSCOPO_FALLBACK[signo.signo] || HOROSCOPO_FALLBACK.Aries;
      const s = semilla(new Date().toISOString().slice(0, 10));
      delDia = fb.dia[s % fb.dia.length];
      semanaText = fb.semana[(s >> 3) % fb.semana.length];
      fuente = "fallback";
    }

    const numero = ((semilla(sem.desde) + 7) % 9) + 1;
    const data = {
      signo: signoPublico(signo),
      delDia: { texto: delDia, fecha: new Date().toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" }), numero },
      semana: { texto: semanaText, desde: sem.desdeL, hasta: sem.hastaL },
      fuente
    };
    HOROSCOPO_CACHE.set(clave, data);
    if (HOROSCOPO_CACHE.size > 200) HOROSCOPO_CACHE.clear();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: "No se pudo generar el horóscopo" });
  }
});

module.exports = router;
