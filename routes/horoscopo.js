const express = require("express");
const { signoPublico, usuarioActual } = require("../middleware/auth.js");
const { completarIA, isOpenAIConfigured, isNIMConfigured, isHFConfigured } = require("./ia.js");
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
      "La chispa de Aries se alinea hoy con la valentía de empezar. Inicia esa conversación o ese proyecto que llevas posponiendo, porque la primera palabra ya está de tu lado. El arcángel Miguel te cubre con su espada de luz, recordando que tu valor no necesita permiso de nadie. No dudes: tu instinto es tu brújula más confiable hoy.",
      "Día de fuego para Aries: tu energía contagia a los demás y tu entusiasmo abre puertas que la duda mantuvo cerradas. Dirige ese ímpetu hacia una meta concreta y verás resultados antes de que anochezca. En el amor, tu pasión enciende pero también puede quemar: dosifica tu intensidad con ternura. Marte te respalda, así que avanza con seguridad.",
      "Hoy Aries clarifica lo que genuinamente quiere y suelta todo lo que te roba energía. Ocúpate únicamente de lo que te enciende la llama interior: tu elemento Fuego te pide acción, no reflexión infinita. El arcángel Miguel camina contigo, confía en que estás protegido mientras avanzas. Lo que decidas hoy sembrará resultados duraderos."
    ],
    semana: [
      "Esta semana Marte respira contigo: es momento de arrancar lo que viene aplazándose desde hace meses. Tu palabra es decisión, no prisa. En el trabajo, un proyecto estancado encontrará movimiento positivo. En el amor, la honestidad directa fortalece los vínculos que realmente importan.",
      "Semana de liderazgo para Aries: te toca guiar, decir la verdad y defender tu espacio con firmeza y ternura. Tu signo de Fuego ilumina el camino de quienes caminan contigo. No temas ser diferente: tu autenticidad es tu mayor don para el mundo. Hazlo con el corazón abierto y verás cómo todo se alinea."
    ]
  },
  Tauro: {
    dia: [
      "Tauro: hoy la constancia da su fruto. Termina aquella tarea pendiente y después regálate un placer sencillo: lo ganado con calma se disfruta doble. Tu elemento Tierra te conecta con lo tangible: un buen café, una conversación lenta, un abrazo largo. Chamuel te recuerda que la abundancia comienza por agradecer lo que ya tienes.",
      "La estabilidad de Tauro se nota hoy: protege tu paz y tu dinero con la misma dedicación. Una decisión que posponías se puede tomar sin prisa, escuchando tu cuerpo. No todo es productividad: también lo es saber descansar sin culpa. Tu signo necesita raíces firmes para florecer, y hoy las estás fortaleciendo.",
      "Hoy Tauro se permite ablandar la rutina sin temor a perder el control. Sostener lo construido no significa quedarte quieto: introduce un pequeño cambio luminoso. En el amor, un gesto simple vale más que mil palabras grandiosas. La paciencia es tu superpoder: lo que construyes hoy dura para siempre."
    ],
    semana: [
      "Semana de cosecha para Tauro: la paciencia con la que plantas está por dar frutosEstimated. Evita movimientos bruscos y confía en lo que ya camina. Venus, tu planeta regente, favorece los encuentros significativos. Un asunto financiero o material se resolverá mejor de lo que esperabas.",
      "Tauro: esta semana la seguridad llega desde tu propia constancia. Cuida tu cuerpo, tu mesa y tus finanzas, y el cielo responde a tu calma. No necesitas competir: tu ritmo es único y perfecto para tu camino. Chamuel abraza tu corazón con paz y gratitud."
    ]
  },
  Géminis: {
    dia: [
      "Géminis: hoy tu palabra tiene poder. Usa tu don para unir personas y compartir una idea que ayude; lo que hoy comunicas abre mañana una puerta importante. Gabriel sopla en tus palabras dándoles alas de esperanza. Tu mente ágil conecta lo que otros no ven: anota esa idea, es más valiosa de lo que crees.",
      "Día de ideas para Géminis: tu mente brilla y conecta lo que otros no ven con facilidad. Escribe esa ocurrencia, porque es más valiosa de lo que imaginas. En el trabajo, una propuesta tuya será recibida con entusiasmo por quien corresponde. En el amor, la risa compartida es el mejor lenguaje que pueden hablar.",
      "Hoy Géminis aprende mejor escuchando que hablando. Detente a oír lo que el otro dice de verdad; esa información te hará libre de malentendidos. Tu elemento Aire te pide equilibrio entre expresar y recibir. Gabriel te guía hacia conversaciones que transforman tu perspectiva."
    ],
    semana: [
      "Semana de buenas noticias para Géminis: llegan mensajes, respuestas y encuentros que reacomodan tu mapa personal. Acepta las invitaciones que te iluminen el camino. Mercurio, tu planeta, activa tu creatividad verbal: es buen momento para escribir, enseñar o presentar ideas. En el amor, la sinceridad construye puentes duraderos.",
      "Géminis: esta semana tu versatilidad es un superpoder, pero elige un solo foco para brillar. Profundizar en una sola cosa te dará más que dispersarte en muchas. Tu energía de Aire puede volar alto, pero necesitas aterrizar en algo concreto. Confía en tu capacidad de adaptación: eres un camaleón luminoso."
    ]
  },
  Cáncer: {
    dia: [
      "Cáncer: hoy tu hogar interior pide cuidado. Dedica un momento a lo que te abriga: familia, casa, tu rincón favorito. Notarás cómo todo se serena cuando atiendes tu centro. Rafael, el arcángel sanador, baña tu mundo emocional con agua de paz. No es debilidad cuidar de ti: es la base de todo lo demás.",
      "La intuición de Cáncer está fina hoy: si algo te huele a mentira o a verdad, aciertas sin dudar. Confía en ese pulso antes que en los argumentos ajenos. Tu elemento Agua refleja lo que otros sienten: protégete de emociones ajenas que no te pertenecen. En el amor, tu ternura es un refugio seguro para quien lo necesite.",
      "Hoy Cáncer regala ternura, pero también se la regala a sí mismo sin sentir culpa. Poner límites a quien te agota también es una forma poderosa de amor propio. No necesitas ser fuerte todo el tiempo: también puedes descansar en tu concha sin explicaciones. Rafael te sostiene mientras descansas y te recarga de luz."
    ],
    semana: [
      "Semana emocionalmente fértil para Cáncer: los vínculos piden conversación sincera y valiente. Tu sensibilidad convierte lo cotidiano en algo sagrado cuando la diriges con intención. La Luna, tu regente, ilumina tus relaciones: habla desde el corazón sin miedo a ser vulnerable. Un familiar cercano puede necesitar tu apoyo este fin de semana.",
      "Cáncer: esta semana cuida tu energía como cuidas la ajena, porque el agua delata tu estado interior. Llena tu propia copa primero antes de regar el jardín de todos. No eres responsable de las emociones del mundo, solo de las tuyas. Tu hogar es tu templo: decóralo con paz, música y aromas que te abriguen."
    ]
  },
  Leo: {
    dia: [
      "Leo: hoy brillas sin pedir permiso ni disculpas. Comparte tu talento con generosidad y alguien se sentirá inspirado por tu sola presencia. Jofiel, el arcángel de la belleza, corona tu día con luz dorada. Tu elemento Fuego no pide apagarse: comparte tu calor con quien lo necesite hoy.",
      "Día de sol para Leo: tu creatividad está encendida y tu imaginación no tiene límites. No la guardes para la aprobación de nadie: haz lo que te dé orgullo sin esperar aplausos. En el trabajo, tu liderazgo natural abre puertas que la ambición sola no abriría. En el amor, la generosidad sin esperar nada a cambio es la forma más alta de amar.",
      "Hoy Leo se recuerda que su luz no necesita aplausos para existir. Brilla, sí, y también deja brillar a los demás sin celos. El reconocimiento verdadero llega solo cuando actúas desde el servicio. Tu corona no es vanidad: es responsabilidad de guiar con ejemplo y corazón."
    ],
    semana: [
      "Semana de protagonismo para Leo: te piden hablar, liderar y dar el paso con decisión. Tu calidez abre puertas que la ambición sola no podría abrir jamás. El Sol, tu regente, potencia tu carisma: úsalo para inspirar, no para dominar. En el amor, la vulnerabilidad fortalece el vínculo más que cualquier gesto espectacular.",
      "Leo: esta semana el regalo está en compartir tu sabiduría con generosidad. Guiar a alguien más joven que tú también es una forma elegante de coronarte. No todo gira alrededor tuyo, pero tu presencia mejora el mundo que te rodea. Deja huella donde pases con cada palabra y cada gesto de amor."
    ]
  },
  Virgo: {
    dia: [
      "Virgo: hoy el orden te libera de la ansiedad que cargas. Organiza tu espacio o tu agenda y verás cómo el caos interior se acomoda solo. Pequeños arreglos, grandes alivios para tu mente inquieta. Uriel, el arcángel de la sabiduría, ilumina cada detalle que tocas con precisión.",
      "Día de servicio para Virgo: ayudas con precisión y humildad a quien lo necesita. Que tu perfeccionismo no te robe la alegría del camino: hecho con amor vale más que perfecto. En el trabajo, tu atención al detalle marca la diferencia entre lo bueno y lo extraordinario. En el amor, los gestos pequeños construyen la grandeza que dura.",
      "Hoy Virgo suelta un estándar imposible que cargas sobre tus hombros. Tu valor no depende de cuánto logras cada día: descansa sobre quién eres, no sobre qué haces. Tu elemento Tierra te ancla en lo real: no necesitas ser perfecta, solo sincera. Uriel te bendice con paz mental y serenidad."
    ],
    semana: [
      "Semana práctica para Virgo: planifica con calma y el orden te traerá la paz que buscas. Un detalle bien cuidado hoy, mañana será tu mejor inversión en cualquier área. Mercurio, tu planeta aliado, facilita la comunicación clara: expresa lo que necesitas sin rodeos ni miedos. En el amor, la constancia supera a la pasión efímera.",
      "Virgo: esta semana el cuerpo te pide escucha y respeto. Duerme, come y muévete con cariño; la mente clara es hija de un cuerpo cuidado. No sobreexplotes tu energía: también necesitas recargar para poder seguir dando. Tu servicio al mundo comienza por servirte a ti misma con la misma dedicación."
    ]
  },
  Libra: {
    dia: [
      "Libra: hoy el equilibrio se conquista decidiendo con valentía. No puedes complacer a todos: elige con calma lo que se alinea con tu corazón, y la paz te sigue sin esfuerzo. Chamuel, tu arcángel, te guía hacia la armonía verdadera. Tu encanto abre diálogos: úsalo para sanar, no para esquivar los conflictos.",
      "Día de armonía para Libra: tu encanto abre diálogos que parecían imposibles. Úsalo para acercar posturas y sanar un malentendido pendiente que te pesa. Venus, tu planeta, embellece tus relaciones: un gesto de amor vale más que mil discursos elaborados. En el trabajo, tu diplomacia es un arte que todos admiran.",
      "Hoy Libra embellece su entorno y su ánimo con la misma dedicación. Coquetea con lo bello, pero también contigo mismo: la armonía se fabrica hacia dentro. No necesitas a nadie para sentirte completa: tu equilibrio viene de adentro. Chamuel te abraza con paz y te recuerda tu valor."
    ],
    semana: [
      "Semana de encuentros significativos para Libra: las relaciones piden conversación, acuerdos y aire limpio. Tu diplomacia es tu mejor varita mágica para resolver tensiones. Venus ilumina tus conexiones sociales: acepta invitaciones que nutran tu espíritu. En el amor, la honestidad delicada es la clave que abre todo.",
      "Libra: esta semana elige la paz, pero no la falsa ni la cómoda. Decir tu verdad con ternura también es equilibrio puro. No sacrifiques tu esencia para mantener la armonía exterior: la verdadera paz incluye tu voz y tu opinión. Tu justicia innata guiará tus pasos hacia lo correcto."
    ]
  },
  Escorpio: {
    dia: [
      "Escorpio: hoy tu profundidad transforma todo lo que toca. No temas mirar la verdad de frente: lo que desentierras con conciencia deja de tener poder sobre ti. Zadkiel, el arcángel de la transformación, purifica tu corazón con luz violeta. Tu intensidad es un regalo: úsala para crear, no para destruir.",
      "Día de intensidad para Escorpio: sientes todo a flor de piel con una claridad extraordinaria. Canaliza esa fuerza en algo creativo o físico y la emoción se vuelve tu mejor aliada. En el amor, la vulnerabilidad es poder: permite que te vean sin máscaras ni armaduras. Tu elemento Agua lava lo viejo para dar paso a lo nuevo.",
      "Hoy Escorpio suelta el control sobre lo que se está moviendo a su alrededor. Tu poder crece justo cuando confías en el proceso sin necesidad de manipular. No necesitas saber todo para avanzar: confía en tu intuición sagrada. Zadkiel te transforma mientras descansas y te prepara para el renacer."
    ],
    semana: [
      "Semana de metamorfosis para Escorpio: se cierra un ciclo viejo y nace uno nuevo con fuerza. La palabra es soltar; el premio, renacer como el ave fénix. Plutón, tu regente, activa tu capacidad de regeneración: lo que parece muerto está germinando en silencio. En el amor, la confianza se construye gota a gota, sin prisa.",
      "Escorpio: esta semana tus percepciones aciertan como un radar infalible. Úsalas con compasión: no todo lo que ves necesita ser dicho en voz alta. Tu intuición es poderosa: protégela de la paranoia y la desconfianza excesiva. El renacer llega cuando dejas ir lo que ya cumplió su ciclo con gratitud."
    ]
  },
  Sagitario: {
    dia: [
      "Sagitario: hoy el horizonte llama con fuerza irresistible. Permítete soñar en grande, pero también da un paso concreto hacia ese sueño: la flecha necesita arco para volar. Jofiel, el arcángel de la alegría, ilumina tu camino con luz dorada. Tu optimismo es medicina: compártelo con quien lo necesite hoy.",
      "Día de fe para Sagitario: tu optimismo levanta a quien tienes cerca y les da alas. Compártelo sin reservas, porque tu risa es la mejor medicina que existe. En el trabajo, una oportunidad de viaje o estudio puede presentarse: di que sí sin miedo. En el amor, la aventura compartida fortalece cualquier vínculo.",
      "Hoy Sagitario aprende en movimiento y en la acción constante. Una conversación inesperada, un lugar nuevo o un libro pueden cambiar tu perspectiva. La sincronía te busca donde estás creciendo y evolucionando. Tu elemento Fuego te impulsa hacia adelante: no mires atrás con arrepentimiento, solo con gratitud."
    ],
    semana: [
      "Semana expansiva para Sagitario: se abren oportunidades de viaje, estudio o proyectos lejanos que te emocionan. Di que sí a lo que te ensanche el alma sin miedo a lo desconocido. Júpiter, tu regente, amplifica tus posibilidades: apunta alto y trabaja con alegría. En el amor, la libertad compartida es la base de todo.",
      "Sagitario: esta semana aterriza un sueño que parecía lejano. Concretar lo que imaginas te dará más seguridad que todos los planes futuros juntos. No necesitas tener todo resuelto para empezar: el camino se hace al andar. Tu fe inquebrantable es tu brújula más confiable."
    ]
  },
  Capricornio: {
    dia: [
      "Capricornio: hoy la constancia te distingue ante todos. Mantén el rumbo de esa meta a largo plazo que tanto te importa: cada paso pequeño de hoy construye tu cima de mañana. Miguel, el arcángel de la protección, custodia tu esfuerzo con paciencia. Tu disciplina no es dureza: es amor hecho hábito.",
      "Día de estructura para Capricornio: tu sentido de la responsabilidad inspira a quienes te rodean. Recuerda que el logro es tu cosecha, no tu valor como persona. No necesitas demostrar nada a nadie: tu trabajo habla por ti. En el amor, la solidez construye lo que la pasión efímera no puede sostener.",
      "Hoy Capricornio se permite disfrutar el camino sin culpa. El trabajo bien hecho ya es un regalo: celebra lo conseguido sin esperar más ni menos. Tu elemento Tierra te conecta con la realidad tangible: disfruta los sentidos. Tu montaña es alta, pero hoy disfrutas la vista desde donde estás."
    ],
    semana: [
      "Semana de consolidación para Capricornio: te apoyan bases viejas mientras se trazan nuevos caminos. La paciencia es tu mayor aliada estratégica en todo momento. Saturno, tu regente, te enseña que la madurez es poder, no carga. En el amor, la constancia supera a la pasión que arde y se apaga.",
      "Capricornio: esta semana equilibra ambición y descanso con sabiduría. Tu montaña estará ahí mañana; tu cuerpo agradece la pausa hoy. No eres una máquina: eres un ser humano que necesita descansar para rendir. La cima llega cuando confías en tu ritmo sin compararte con nadie."
    ]
  },
  Acuario: {
    dia: [
      "Acuario: hoy tu originalidad rompe esquemas y abre caminos nuevos. Propón esa idea distinta, aunque incomode: el futuro te necesita justo a ti como eres. Uriel, el arcángel de la innovación, ilumina tu mente con creatividad pura. Tu visión es singular: no la diluyas para encajar con los demás.",
      "Día de comunidad para Acuario: tu visión humanista conecta a personas que piensan como tú. Colabora, porque tu mejor avance es siempre colectivo. En el trabajo, una propuesta revolucionaria será recibida con interés genuino. En el amor, la amistad profunda es la base de toda relación duradera.",
      "Hoy Acuario se permite la cercanía sin perder su esencia libertaria. La libertad no se pierde por querer de verdad a alguien: ganas libertad cuando vinculas con honestidad absoluta. Tu elemento Aire te pide conexiones auténticas, no superficiales. Abre tu corazón sin miedo a ser diferente."
    ],
    semana: [
      "Semana de renovación para Acuario: romper con lo que ya fue es sagrado y necesario. Rediseña tu rutina con un toque de futuro y creatividad personal. Urano, tu regente, trae sorpresas agradables si mantienes la mente abierta. En el amor, la amistad o un grupo te trae una señal importante.",
      "Acuario: esta semana una amistad o un grupo te trae una señal que no puedes ignorar. Mantén los oídos abiertos y el corazón fresco para recibirla. Tu red de contactos es tu mayor tesoro: cuida las relaciones que nutren tu espíritu. El cambio comienza contigo y se expande hacia el mundo."
    ]
  },
  Piscis: {
    dia: [
      "Piscis: hoy tu sensibilidad capta lo que nadie ve a simple vista. Confía en tu intuición artística o espiritual; ella te guiará sin mapa ni brújula. Rafael, el arcángel de la sanación, baña tu espíritu con agua de luz. Tu don de sentir es sagrado: protégelo de las energías pesadas del mundo.",
      "Día de compasión para Piscis: tu ternura calma a otros que la necesitan desesperadamente. No te olvides de poner límites sanos: tu don vale para ti también. En el amor, la entrega sincera es tu mayor fortaleza, pero también tu mayor vulnerabilidad. Equilibra dar y recibir con la misma generosidad.",
      "Hoy Piscis sueña con los ojos abiertos y la mente despierta. Escribe o dibuja esa visión que te persigue, porque lo que imaginas tiene la costumbre de hacerse real. Tu elemento Agua fluye hacia donde debe llegar sin esfuerzo. Deja que la corriente te lleve: confía en el universo y su plan perfecto."
    ],
    semana: [
      "Semana espiritual para Piscis: los sueños y las señales hablan fuerte si sabes escuchar. Anota lo que sientas cada día: tu inconsciente te está mandando un mapa detallado. Neptuno, tu regente, amplifica tu intuición: confía en ella por encima de todo. En el amor, la conexión espiritual supera a lo material.",
      "Piscis: esta semana cuida tus emociones como un jardín que florece. Riega las tuyas antes de regar las de todos: tu bienestar es la prioridad. No eres responsible de salvar a nadie, solo de acompañar con amor. Tu sensibilidad es un don, no una carga: abrázala con orgullo y gratitud."
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

    if (isOpenAIConfigured() || isNIMConfigured() || isHFConfigured()) {
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
