/* ============================================================================
   oraculo-nlp.js — motor de análisis de preguntas para "Pregunta al Oráculo".
   NLP auto-contenido en español, sin dependencias ni APIs externas.

   Etapas del pipeline (tal como pide el diseño de la tirada):
     1) Normalizar y tokenizar la pregunta.
     2) Detectar temas con puntajes ponderados a partir de un diccionario.
     3) Determinar el tipo de pregunta (sí/no, persona, consejo, salud,
        energías, espíritus, fallecido, combinada o situación).
     4) Extraer la persona citada (nombre o parentesco).
     5) Evaluar el tono/sentimiento de la consulta (temor, urgencia, duda,
        esperanza, neutro).
     6) Extraer palabras clave para guiar la interpretación.

   El resultado alimenta tanto las plantillas determinísticas como el prompt
   que recibe el modelo generativo en /api/ia/pregunta.
   ========================================================================== */

/* --------------------------------- utilidades ------------------------------ */

/* Normaliza: minúsculas, sin acentos, espacios colapsados. */
function normalizar(texto) {
  return String(texto || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[¿?¡!.,;:()"“”«»]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/* Palabras vacías: no se consideran como tema ni como keyword. */
const STOPWORDS = new Set(
  ("a al algo algunas algunos ante antes con contra cual cuando cuanto cula como " +
   "de del desde donde durante e el els ellos en entre era erais eran eras eres es esa esas ese esos esta estaba estais " +
   "estan estamos estaba estais estaba estaban estaba estas este esto estos fuiste fuisteis fui fueron fue fueis " +
   "habia habian habias habian habia habiamos habiados habria habrian habrias habis hay he hemos ha hem hemos han " +
   "hubieron hubiera hubierais hubieran hubieran hubieses hubieseis hubiesen hubieses la las le les lo los mas me mi mis " +
   "mucho muchos muy ni nos nosotros nuestra nuestras nuestro nuestros o os otra otras otro otros para pero poco por porque " +
   "puede pueden pueden podria podriamo podriais podrian puedo puedes podemos podeis puede pueden que quien quieres quienes " +
   "se sea seas somos sois sois son soy su sus ta teneis tener tenemos tengo tengas tienes tengan tiene tienen tu tus un una uno " +
   "unas unos vosotros vosotras ya yo el la un si no ejemplo por cada tengo tienes tiene tenemos teneis cuando como donde " +
"porque entonces pero tambien asi como que quien cuales cual me te lo la le")
    .split(/\s+/)
    .filter(Boolean)
);

/* ------------------------------ temas (áreas) ------------------------------ */

/* Cada tema define su arcángel regente, su alias de presentación y las
   palabras/expresiones que disparan el área. Se puntúa cada coincidencia. */
const TEMAS = {
  amor: {
    clave: "amor",
    titulo: "Amor y relaciones",
    icono: "❤️",
    arcangel: "chamuel",
    palabras: [
      "amor", "amar", "pareja", "novio", "novia", "ex", "expareja", "relacion", "relaciones",
      "casar", "casarme", "casamiento", "boda", "matrimonio", "me quiere", "me ama", "me amas",
      "le gusto", "le gustas", "le gusta", "regreso", "regresa", "vuelta", "vuelve", "volvera",
      "corazon", "celos", "celosa", "celoso", "ruptura", "terminamos", "enamor", "compromiso",
      "afecto", "afectos", "separar", "separacion", "infidelidad", "fiel", "quiere volver",
      "me deja", "me dejara", "dejare", "vuelve conmigo", "familia", "hijo", "hija", "hijos",
      "esposo", "esposa", "marido", "enamoradas", "enamorados", "pareja ideal"
    ]
  },
  dinero: {
    clave: "dinero",
    titulo: "Economía y abundancia",
    icono: "💰",
    arcangel: "uriel",
    palabras: [
      "dinero", "plata", "economia", "economico", "negocio", "negocios", "salario", "sueldo",
      "venta", "ventas", "clientes", "gasto", "gastos", "deuda", "deudas", "prestamo",
      "prestamos", "ahorro", "inversion", "invertir", "inversionista", "comprar", "riqueza",
      "riqu", "abundancia", "renta", "ingresos", "ingreso", "factura", "facturas", "pagar",
      "pagare", "ganancia", "ganancias", "ganare", "suerte economica", "estabilidad economica",
      "crecer mi negocio", "hacer crecer"
    ]
  },
  trabajo: {
    clave: "trabajo",
    titulo: "Trabajo y carrera",
    icono: "💼",
    arcangel: "uriel",
    palabras: [
      "trabajo", "trabajar", "mi trabajo", "el trabajo", "en el trabajo", "del trabajo",
      "al trabajo", "cambio de trabajo", "cambiar de trabajo", "buscar trabajo",
      "encontrar trabajo", "empleo", "contrato", "empresa", "oficina", "jefe", "jefa",
      "ascenso", "ascender", "ascendieron", "carrera", "curriculum", "entrevista",
      "despido", "cesantia", "paro", "reuniones", "trabajo ideal", "quedarme sin trabajo"
    ]
  },
  salud: {
    clave: "salud",
    titulo: "Salud y energía",
    icono: "💚",
    arcangel: "rafael",
    palabras: [
      "salud", "enfermedad", "enfermo", "enferma", "dolor", "duele", "cansancio", "cuerpo",
      "operacion", "medico", "medicos", "medicina", "remedio", "sano", "sana", "sanar",
      "curacion", "animo", "depresion", "ansiedad", "insomnio", "descanso", "gripe",
      "fiebre", "peso", "ejercicio", "curar", "embarazo", "embarazada", "cancer", "corazon",
      "mareo", "alimentacion", "respirar", "me recupero", "me siento mal", "enfermedades",
      "tratamiento", "diagnostico"
    ]
  },
  familia: {
    clave: "familia",
    titulo: "Familia y hogar",
    icono: "🏡",
    arcangel: "chamuel",
    palabras: [
      "familia", "papas", "padres", "mama", "papa", "hermano", "hermana", "hermanos", "abuela",
      "abuelo", "abuelos", "tio", "tia", "primo", "prima", "hogar", "mi casa", "mi familia",
      "convivencia", "casa familiar", "navidad", "reunion familiar", "madre", "padre"
    ]
  },
  espiritual: {
    clave: "espiritual",
    titulo: "Espiritualidad y propósito",
    icono: "🕊️",
    arcangel: "gabriel",
    palabras: [
      "espiritual", "espiritualidad", "proposito", "mision", "llamado", "fe", "dios", "angel",
      "angeles", "arcangel", "arcangeles", "bendicion", "oracion", "rezo", "camino espiritual",
      "alma", "guia espiritual", "creo", "creencia", "fe en dios", "despertar", "karma", "dharma"
    ]
  },
  energias: {
    clave: "energias",
    titulo: "Energías y vibraciones",
    icono: "✨",
    arcangel: "miguel",
    palabras: [
      "energia", "energias", "energetico", "aura", "auras", "vibracion", "vibraciones", "vibras",
      "campo energetico", "limpia energetica", "limpieza de energia", "limpieza de energias",
      "mala energia", "buena energia", "ambiente cargado", "proteccion energetica", "vibra"
    ]
  },
  espiritus: {
    clave: "espiritus",
    titulo: "Espíritus y almas",
    icono: "🕯️",
    arcangel: "miguel",
    palabras: [
      "espiritus", "espiritu", "entidad", "entidades", "fantasma", "fantasmas", "ser de luz",
      "seres de luz", "tabla ouija", "medium", "presencias", "espiritualidad muertos", "planos",
      "mas alla", "otro lado", "fallecidos", "almas"
    ]
  },
  fallecido: {
    clave: "fallecido",
    titulo: "Seres que ya partieron",
    icono: "🕊️",
    arcangel: "miguel",
    palabras: [
      "murio", "murieron", "fallecio", "fallecio", "fallecida", "fallecido", "difunto", "difunta",
      "descansa en paz", "descanse en paz", "que se murio", "que fallecio", "abuelo que murio",
      "abuela que murio", "mi papa que", "mi mama que"
    ]
  },
  proteccion: {
    clave: "proteccion",
    titulo: "Protección y fuerza",
    icono: "🛡️",
    arcangel: "miguel",
    palabras: [
      "peligro", "enemigo", "enemigos", "miedo", "proteger", "proteccion", "defensa", "seguridad",
      "amenaza", "lucha", "pelea", "conflicto", "problema", "rival", "perder", "envidia",
      "envidias", "envidioso", "envidiosa", "alguien me tiene envidia",
      "ganar", "defender", "cuidarme", "resguardo", "dano", "danar", "danarme", "persiguen",
      "alguien me ataca", "energias negativas"
    ]
  },
  liberacion: {
    clave: "liberacion",
    titulo: "Bloqueos y liberación",
    icono: "🔓",
    arcangel: "zadkiel",
    palabras: [
      "culpa", "perdon", "perdonar", "rencor", "bloqueo", "bloqueos", "trauma", "traumas", "pasado",
      "soltar", "atadura", "dependencia", "obsesion", "apego", "fracaso", "fracasar", "error",
      "peso", "libertad", "liberacion", "ciclo", "cerrar", "dejar ir", "maldad", "maldicion",
      "sombra", "soltarme", "dejar el pasado"
    ]
  },
  futuro: {
    clave: "futuro",
    titulo: "Futuro e inspiración",
    icono: "🌟",
    arcangel: "jofiel",
    palabras: [
      "futuro", "destino", "sueno", "metas", "meta", "exito", "exito laboral", "triunfo",
      "creatividad", "inspiracion", "idea", "ideas", "avanzar", "progreso", "cambio", "cambios",
      "comenzar", "empezar", "nuevo", "nueva", "oportunidad", "oportunidades", "plan", "planes",
      "camino", "crecer", "brillar", "me va a ir", "como me ira", "que me depara"
    ]
  },
  decision: {
    clave: "decision",
    titulo: "Decisiones y caminos",
    icono: "⚖️",
    arcangel: "jofiel",
    palabras: [
      "decidir", "decision", "decisiones", "elegir", "eleccion", "elijo", "elija", "elige",
      "que camino", "que hago", "que hare", "debo hacer", "que me conviene", "irme o quedarme",
      "cambiar o quedarme", "aceptar o rechazar", "elegir entre", "opciones", "que opcion",
      "empezar de nuevo o seguir", "seguir o cambiar", "mudarme", "mudanza", "mudarse",
      "irme", "quedarme", "cambiar de ciudad", "mudarme a otra ciudad"
    ]
  },
  mensaje: {
    clave: "mensaje",
    titulo: "Mensajes y señales",
    icono: "📯",
    arcangel: "gabriel",
    palabras: [
      "mensaje", "respuesta", "senal", "senal", "signo", "signos", "noticia", "noticias", "aviso",
      "comunicacion", "habla", "me quiere decir", "el universo", "algo me dice", "suerte", "destino",
      "estudio", "estudios", "estudiar", "examen", "examenes", "universidad", "universidades",
      "carrera", "proposito", "mision", "llamado", "viaje", "viajes", "emigrar", "viajar"
    ]
  }
};

/* ------------------------- tipos de pregunta ------------------------------ */

const CTR_PERSONA =
  /\b(nombre|se llama|mi pareja|mi ex|mis ex|novio|novia|esposo|esposa|marido|mi esposo|mi marido|amigo|amiga|hermano|hermana|papa|mama|familia|esa persona|ese hombre|esa mujer|ese muchacho|esa muchacha|alguien|me engaña|me es fiel|es sincero|es sincera|me miente|le gusto|piensa en mi|le caigo bien|jefe|jefa|companero|companera|colega|vecino|vecina|socio|socia|suegra|suegro|cuñado|cuñada|que esconde|que oculta|que me oculta|que me esconde|que no me dice|que no me cuenta|que me guarda|que esta pensando|en quien piensa|esconde algo|tiene algo escondido|guarda un secreto|que intenciones tiene)\b/;

/* Variantes donde el nombre se intercala: «¿Qué piensa María de mí?» */
const CTR_PERSONA_LAXO =
  /\b(piensas?|opinas?|sientes?)[^a-z]{0,30}de mi\b|\b(piensas?|opinas?)[^a-z]{0,30}en mi\b|\bsientes?[^a-z]{0,40}(por mi|realmente)\b|\bque (siente|piensa|opina)[^a-z]{0,30}por mi\b/;

const CTR_ENERGIA =
  /\b(energi[íi]a(s)?|aura(s)?|vibraci(ones|on)|campo energetico|limpia energetica|limpieza de energ[ií]as|mala energ[ií]a|buena energ[ií]a|ambiente cargado|protecci[oó]n energetica)\b/;

const CTR_ESPIRITUS =
  /\b(espiritus|espiritu|entidad(es)?|fantasma(s)?|ser(es)? de luz|tabla ouija|medium|presencias)\b/;

const CTR_SI_NO =
  /\b(volvera|regresara|regrese|vuelve|vuelva|me ama|me amas|me quiere|me quieres|querra|pensara|debo|deberia|debiera|puedo|podria|conviene|convenga|es bueno|es malo|es cierto|es verdad|sera|seria|me ira bien|me iria bien|ira bien|saldra bien|funcionara|resultara|lograre|conseguire|aceptara|me perdonara|quiere estar conmigo|va a funcionar|voy a|terminamos|sigamos|debemos|habra|me es fiel|me engaña|es sincero|me miente|le gusto|le caigo bien|esta enamorado|esta enamorada|se siente atraido|se siente atraida)\b/;

const CTR_SALUD =
  /\b(salud|enfermedad|enfermo\w*|operaci[oó]n|m[ié]dico|doctor|dolor(es)?|curar|sanar|c[aá]ncer|coraz[oó]n|mareo|insomnio|cansancio|alimentaci[oó]n|respirar|sano|sana|me recupero|siento bien|embarazad\w*|me siento mal)\b/;

const CTR_CONSEJO =
  /\b(qu[eé] (hago|hacer|me aconsejas|me recomiendas|debo hacer|deber[ií]a hacer|camino tom[oó]|camino sigo|me conviene hacer)|orient[aá]me|ay[uú]dame a decidir|d[ií]me qu[eé] hacer|qu[eé] sugieres|qu[eé] consejo)\b/;

function esSiNo(limpia) {
  const directa = /(^|[^a-z])si o no([^a-z]|$)/.test(limpia) ||
    /^si([ .?!¿]|$)/.test(limpia) || /^no([ .?!¿]|$)/.test(limpia);
  return directa || CTR_SI_NO.test(limpia);
}

/* ----------------------------- tono / sentimiento -------------------------- */

const TONOS = {
  temor: [
    "miedo", "temo", "preocupad", "asustad", "angusti", "sufro", "sufrimiento", "dolor",
    "triste", "lloro", "llorar", "angustia", "nervios", "temores", "mi miedo", "me da miedo",
    "horrible", "doloroso", "pena"
  ],
  urgencia: [
    "urgente", "me urge", "cuanto antes", "rapido", "ya mismo", "necesito saber ya",
    "es de urgencia", "se decide hoy", "hay que decidir"
  ],
  duda: [
    "no se si", "dudo", "dudas", "duda", "quizas", "quizá", "acaso", "sera verdad",
    "que hago", "tengo dudas", "no estoy seguro", "no estoy segura", "no estoy convencido",
    "no estoy convencida", "indecis", "en duda", "no lo tengo claro"
  ],
  esperanza: [
    "espero", "esperanza", "deseo", "quiero que", "anhelo", "sueno con", "me gustaria",
    "bendicion", "que sea asi", "que asi sea", "prendo una vela", "tengo fe"
  ]
};

const PRIORIDAD_TONO = ["temor", "urgencia", "duda", "esperanza"];

function detectarTono(pregunta) {
  const l = normalizar(pregunta);
  const encontrados = [];
  for (const clave of PRIORIDAD_TONO) {
    const pals = TONOS[clave];
    let n = 0;
    for (const p of pals) {
      const termino = normalizar(p);
      if (l.includes(termino)) n++;
    }
    if (n > 0) encontrados.push({ tono: clave, intensidad: n });
  }
  encontrados.sort((a, b) => b.intensidad - a.intensidad);
  return encontrados.length ? encontrados[0].tono : "neutro";
}

/* ------------------------------ persona citada ------------------------------ */

const PARENTESCOS = [
  "abuelo", "abuela", "papa", "mama", "mamita", "madre", "padre", "tio", "tia", "hermano",
  "hermana", "hijo", "hija", "esposo", "esposa", "marido", "novio", "novia", "amigo", "amiga",
  "jefe", "jefa", "socio", "socia", "suegra", "suegro", "cuñado", "cuñada", "ex", "pareja",
  "companero", "companera", "colega", "vecino", "vecina"
];

/* Nombres propios: palabra capitalizada que no sea el comienzo de la pregunta,
   no pariente, no tema, no palabra vacía. */
const PROHIBIDAS_PERSONA = new Set([
  "el", "la", "los", "las", "un", "una", "si", "no", "que", "cuanto", "donde", "como", "cuando",
  "sera", "seria", "es", "son", "soy", "sea", "fue", "puede", "puedo", "puedes", "podria", "estoy",
  "esta", "estas", "voy", "quiere", "quiero", "necesito", "tengo", "debo", "deberia", "mi", "me",
  "te", "se", "por", "para", "con", "sin", "lo", "le", "su", "al", "del", "oraculo", "oracle",
  "tarot", "zigurath", "anaia", "amor", "dinero", "trabajo", "salud", "suerte", "futuro", "familia",
  "persona", "pregunta", "respuesta", "vuelve", "vuelva", "vuelvo", "volvera", "volvere",
  "regresa", "regresara", "regresare", "regrese", "pasa", "pasara", "hara", "hare", "haran",
  "habra", "habria", "serian", "seran", "podra", "podria", "podre", "podran", "querra", "querria",
  "querre", "pensara", "pensaria", "sentira", "estara", "estaria", "tendra", "tendria", "tendre",
  "acabara", "terminara", "empezara", "terminare", "empezare", "comenzare", "llegare", "seguire",
  "sigue", "funciona", "funcionara", "termino", "terminamos", "lograre", "conseguire", "aceptara",
  "aceptare", "dejare", "puedo", "debia", "debamos", "empezar", "comenzar", "significa",
  "significado", "nombre", "opinion", "otra", "mejor", "nuevo", "nueva", "papa", "mama",
  "piensa", "piensas", "pienso", "piensan", "siente", "sientes", "siento", "sienten", "opina",
  "opinas", "opino", "opinan", "dice", "dicen", "dije", "diga", "espero", "esperare",
  ...PARENTESCOS, "relacion", "relaciones", "vida", "energia", "espiritu",
  "casa", "alma", "economia", "asunto", "tema", "situacion", "empresa", "negocio", "proyecto",
  "verdad", "secreto", "intencion", "intenciones", "dios", "universo", "cielo", "cual",
  "cuales", "que", "quien", "quienes", "cuanto", "cuanta", "cuantos", "cuantas", "como",
  "donde", "cuando", "por que", "para que", "hacia donde"
]);

function capitalizarNombre(w) {
  return w.charAt(0).toUpperCase() + w.slice(1);
}

function detectarPersona(pregunta) {
  const t = String(pregunta || "");
  const capitalizadas = t.match(/[A-ZÁÉÍÓÚÑ][a-záéíóúñ]*/g) || [];
  const nombres = capitalizadas
    .map(w => ({ w, n: normalizar(w) }))
    .filter(x => x.n.length >= 3 && !PROHIBIDAS_PERSONA.has(x.n))
    .map(x => x.w);
  if (nombres.length) return nombres[0];

  const limpia = normalizar(t);
  const m = limpia.match(/\bsobre\s+([a-z]{3,})\b/);
  if (m && !PROHIBIDAS_PERSONA.has(m[1])) return capitalizarNombre(m[1]);
  return null;
}

function detectarParentesco(pregunta) {
  const l = normalizar(pregunta);
  const m = l.match(/\b(abuelo|abuela|papa|mama|mamita|madre|padre|tio|tia|hermano|hermana|hijo|hija|esposo|esposa|marido|novio|novia|amigo|amiga|ex|pareja)\b/);
  return m ? m[0] : null;
}

/* ------------------------------ keywords ---------------------------------- */

function extraerKeywords(pregunta, temas) {
  const l = normalizar(pregunta);
  const tokens = l.split(" ").filter(p => p.length > 3 && !STOPWORDS.has(p));
  const vistas = new Set();
  const kw = [];
  for (const p of tokens) {
    if (vistas.has(p)) continue;
    vistas.add(p);
    kw.push(p);
    if (kw.length >= 10) break;
  }
  /* si el diccionario detectó temas que no aparecen como token simple (frases),
     se listan igualmente como keywords guía */
  for (const t of (temas || [])) {
    if (kw.length >= 12) break;
    if (!kw.includes(t.clave)) kw.push(t.clave);
  }
  return kw;
}

/* --------------------------- detección de temas ----------------------------- */

function coincidenciasTemas(limpia) {
  const res = [];
  for (const clave of Object.keys(TEMAS)) {
    const def = TEMAS[clave];
    let puntaje = 0;
    for (const palabra of def.palabras) {
      const termino = normalizar(palabra);
      if (!termino) continue;
      if (termino.includes(" ")) {
        if (limpia.includes(termino)) puntaje++;
      } else {
        const re = new RegExp("(^|[^a-z])" + termino.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "([^a-z]|$)");
        if (re.test(limpia)) puntaje++;
      }
    }
    if (puntaje > 0) res.push({ clave, titulo: def.titulo, icono: def.icono, arcangel: def.arcangel, puntaje });
  }
  res.sort((a, b) => b.puntaje - a.puntaje || (TEMAS[a.clave].titulo < TEMAS[b.clave].titulo ? -1 : 1));
  return res;
}

/* ------------------------ determinación del tipo ----------------------------- */

function detectarTipo(pregunta, analisis) {
  const l = normalizar(pregunta);
  const temas = analisis.temas || [];

  const esFallecido = /(^|[^a-z])(murio|murieron|fallecio|fallecida|fallecido|difunto|difunta)([^a-z]|$)/.test(l) ||
    /(^|[^a-z])(abuelo|abuela|papa|mama|tio|tia|hermano|hermana|esposo|esposa|novio|novia|amigo|amiga) (que )?(murio|fallecio)/.test(l) ||
    /descansa en paz|descanse en paz/.test(l);

  const esEspiritus = CTR_ESPIRITUS.test(l);
  const esEnergias = CTR_ENERGIA.test(l);
  const pidePersona = CTR_PERSONA.test(l) || CTR_PERSONA_LAXO.test(l);
  const persona = analisis.persona;
  const siNo = esSiNo(l);
  const esSalud = CTR_SALUD.test(l);
  const esConsejo = CTR_CONSEJO.test(l);

  /* preguntas combinadas: dos o más áreas concretas (excluye el genérico
     futuro y el metacatagórico "decisión", que suele ser una consulta de
     consejo sobre una sola área) */
  const areasConcretas = temas.filter(t => t.clave !== "futuro" && t.clave !== "decision" && t.puntaje >= 1);
  if (esFallecido) return "fallecido";
  if (esEspiritus) return "espiritus";
  if (esEnergias) return "energias";
  if (areasConcretas.length >= 2) return "combinado";
  if (esSalud) return "salud";
  if (esConsejo) return "consejo";
  if (siNo && !pidePersona && !persona) return "si-no";
  if (pidePersona || persona) return "persona";
  return "situacion";
}

/* --------------------------- análisis principal ------------------------------ */

/* El tipo se resuelve con el análisis completo (necesita persona): */
function analizarPregunta(pregunta) {
  const l = normalizar(pregunta);
  const temas = coincidenciasTemas(l);
  const persona = detectarPersona(pregunta);
  const parentesco = detectarParentesco(pregunta);
  const temaPrincipal = temas[0] || { clave: "mensaje", titulo: TEMAS.mensaje.titulo, icono: TEMAS.mensaje.icono, arcangel: TEMAS.mensaje.arcangel, puntaje: 0 };
  return {
    pregunta: String(pregunta || "").trim(),
    normalizada: l,
    keywords: extraerKeywords(pregunta, temas),
    temaPrincipal,
    temas,
    persona,
    parentesco,
    tono: detectarTono(pregunta),
    areas: temas.map(t => t.clave),
    tipo: detectarTipo(pregunta, { temas, persona })
  };
}

module.exports = { analizarPregunta, normalizar, TEMAS };