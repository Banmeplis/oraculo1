const express = require("express");
const nlp = require("../oraculo-nlp.js");
const cfg = require("../config/index.js");

const router = express.Router();

function isOpenAIConfigured() {
  const k = cfg.OPENAI_API_KEY;
  return k.length >= 10 && !k.toLowerCase().includes("placeholder");
}

function isHFConfigured() {
  const t = cfg.HF_TOKEN;
  return t.length >= 10 && !/tu_token/i.test(t);
}

async function completarIA(prompt, { system, maxTokens = 300, temp = 0.7 } = {}) {
  if (isOpenAIConfigured()) {
    try {
      const resp = await fetch(`${cfg.OPENAI_BASE_URL}/chat/completions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${cfg.OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: cfg.OPENAI_MODEL,
          messages: [
            ...(system ? [{ role: "system", content: system }] : []),
            { role: "user", content: prompt }
          ],
          temperature: temp,
          max_tokens: maxTokens
        })
      });
      if (resp.ok) {
        const data = await resp.json();
        const text = (data.choices?.[0]?.message?.content || "").trim();
        if (text.length > 0) return text;
      }
    } catch {}
  }

  if (isHFConfigured()) {
    for (const modelo of cfg.HF_MODELOS) {
      try {
        const resp = await fetch(`https://api.huggingface.co/models/${modelo}`, {
          method: "POST",
          headers: { Authorization: `Bearer ${cfg.HF_TOKEN}`, "Content-Type": "application/json" },
          body: JSON.stringify({ inputs: prompt, parameters: { max_new_tokens: maxTokens, temperature: temp, return_full_text: false } })
        });
        if (!resp.ok) continue;
        const result = await resp.json();
        const texto = (typeof result === "string"
          ? result
          : result[0]?.generated_text || result.generated_text || "").trim();
        if (texto.length > 15) return texto;
      } catch {}
    }
  }

  return "";
}

function fallbackReflexion(area, numCartas) {
  const bases = {
    salud: `Con ${numCartas} cartas, tu sanación está en proceso. Es momento de escuchar a tu cuerpo y liberar viejos patrones.`,
    amor: `Con ${numCartas} cartas, el amor busca fluir hacia ti. Mantén el corazón abierto y no temas recibir.`,
    trabajo: `Con ${numCartas} cartas, nuevas oportunidades están surgiendo. Mantén la mirada en tus metas.`,
    economia: `Con ${numCartas} cartas, el flujo abundante está alineándose. Administra con sabiduría.`,
    mensajes: `Con ${numCartas} cartas, las señales del universo están claras. Presta atención a las sincronías.`,
    bloqueo: `Con ${numCartas} cartas, los obstáculos tienen propósito. Son maestros que te ayudan a crecer.`,
    situacion: `Con ${numCartas} cartas, tu situación se revela con honestidad. Confía en el proceso.`
  };
  return (bases[area] || "Las cartas siempre hablan: escucha con el corazón.") + " Este es un mensaje de apoyo mientras se desarrolla tu lectura completa.";
}

router.post("/reflexion", async (req, res) => {
  try {
    const { cartas, tirada, area, usuario } = req.body || {};
    if (!cartas || !cartas.length) return res.status(400).json({ error: "No hay cartas" });

    const cartasDesc = cartas.map(c => `${c.nombre} ${c.invertido ? "(invertida)" : ""}`.trim()).join(", ");
    const areaContext = {
      salud: "salud y cuerpo",
      amor: "relaciones y corazón",
      trabajo: "carrera y finanzas",
      economia: "abundancia y recursos",
      mensajes: "señales y guía",
      bloqueo: "obstáculos y miedos",
      situacion: "circunstancias generales"
    }[area] || "tu situación";

    const prompt = `Soy un/a ${usuario ? usuario.nombre : "consultante"} y he sacado una tirada de ${tirada || "tarot"}. Las cartas son: ${cartasDesc}. 
    Estoy buscando orientación sobre ${areaContext}. 
    Por favor dame una reflexión profunda de máximo 3 líneas que una el significado de estas cartas con mi pregunta sobre ${areaContext}. Sé conciso, espiritual pero práctico. No uses estructura de lista, escribe un párrafo continuo.`;

    const limpia = await completarIA(prompt, { maxTokens: 150, temp: 0.7 });
    res.json({ reflexion: limpia.slice(0, 300) || fallbackReflexion(area, cartas.length) });
  } catch (e) {
    res.json({ reflexion: fallbackReflexion(req.body?.area, req.body?.cartas?.length) });
  }
});

router.post("/pregunta", async (req, res) => {
  try {
    const { pregunta, tema, temaClave, cartas } = req.body || {};
    if (!pregunta) return res.status(400).json({ error: "Sin pregunta" });

    if (!isOpenAIConfigured() && !isHFConfigured()) {
      return res.status(200).json({ ok: false, error: "sin token" });
    }

    const an = nlp.analizarPregunta(pregunta);

    const clienteConcreto = temaClave && temaClave !== "mensaje" && an.temas.some(t => t.clave === temaClave);
    const temaUsado = clienteConcreto
      ? (nlp.TEMAS[temaClave] ? { clave: temaClave, ...nlp.TEMAS[temaClave] } : null)
      : (an.temaPrincipal.puntaje > 0 ? an.temaPrincipal : null);
    const areaNombre = temaUsado ? temaUsado.titulo : String(tema || "su vida");
    const arcangelServidor = an.temas[0] ? an.temas[0].arcangel : (an.temaPrincipal ? an.temaPrincipal.arcangel : null);

    const NOMBRES_ARC = {
      chamuel: "Chamuel", uriel: "Uriel", rafael: "Rafael", gabriel: "Gabriel",
      miguel: "Miguel", zadkiel: "Zadkiel", jofiel: "Jofiel"
    };
    const arcTV = clienteConcreto && temaClave ? temaClave : arcangelServidor;
    const arcNombre = NOMBRES_ARC[arcTV] || "el arcángel del tema";

    const cartasDesc = (cartas || []).map((c, i) =>
      `${i + 1}. ${c.nombre}${c.invertido ? " (invertida)" : ""} — ${c.posicion || "posición"}: ${String(c.significado || "").slice(0, 220)}`
    ).join("\n") || "ninguna (no se enviaron cartas)";

    const INSTRUCCIONES_TIPO = {
      "si-no":    `Debes comenzar tu respuesta con "sí" o "no" (sin comillas), y luego explicar en 1-2 frases por qué las cartas responden así.`,
      "persona":  `La consulta menciona a una persona concreta. Habla sobre ESA persona y lo que las cartas muestran de ella, con tacto y sin afirmar cosas hirientes sin sustento.`,
      "consejo":  `La persona pide orientación práctica. Da un consejo claro y accionable apoyado en las cartas, como lo haría un buen amigo espiritual.`,
      "salud":    `Trata con delicadeza: este tema es sensible. Las cartas no reemplazan a un médico; ofrece luz y aliento, y sugiere cuidarse y consultar a un profesional si hace falta.`,
      "fallecido":`Se pregunta por alguien fallecido. Sé tierno y respetuoso, transmite que esa persona está en paz, y evita prometer contacto directo.`,
      "energias": `Responde sobre limpiezas energéticas, protecciones y el estado de la energía de la persona.`,
      "espiritus":`Responde con serenidad y sin miedo sobre presencias o entidades, normalizando la experiencia y sugiriendo calma.`,
      "combinado":`La consulta toca VARIAS áreas (${areaNombre}). Respóndela área por área en frases separadas, sin mezclarlas.`,
      "situacion":`Responde a la pregunta concreta que hace, centrándote en su situación y sin desviarte a generalidades.`
    };
    const instruccionTipo = INSTRUCCIONES_TIPO[an.tipo] || "";

    const prompt = `Eres el Oráculo de Zigurath y Anaia, un consejero espiritual que interpreta el tarot angelical para una persona que busca orientación. Hablas en español cálido, directo y práctico.

El consultante pregunta EXACTAMENTE esto: "${pregunta}"

Análisis de la pregunta que debes usar como guía (no lo repitas literalmente):
- Área: ${areaNombre}.${an.temas.length ? " Temas tocados: " + an.temas.map(t => t.titulo).join(", ") : ""}
- Tipo de pregunta: ${an.tipo}.
${an.persona ? `- Se pregunta por una persona: ${an.persona}.` : ""}
${an.parentesco ? `- Vínculo con la persona: ${an.parentesco}.` : ""}
${an.tono !== "neutro" ? `- Tono de la consulta: ${an.tono} (adáptate a él con empatía).` : ""}
${an.keywords.length ? `- Palabras clave: ${an.keywords.join(", ")}.` : ""}

${arcNombre} vela por este terreno.

Las cartas que salieron (Arcanos Mayores), con su posición, son:
${cartasDesc}

Responde a ESA pregunta concreta y solo a ella, no a otra ni en general. Habla del tema exacto que pregunta. Cita la pregunta y justifica con las cartas.
${instruccionTipo}

Máximo 4 frases, en un solo párrafo, sin listas y sin encabezados.`;

    const respuesta = await completarIA(prompt);

    const limpia = respuesta.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim().slice(0, 520);
    if (!limpia) return res.status(200).json({ ok: false, error: "respuesta vacía" });
    res.json({
      ok: true,
      respuesta: limpia,
      analisis: {
        tipo: an.tipo,
        tema: temaUsado ? temaUsado.titulo : areaNombre,
        temaClave: temaUsado ? temaUsado.clave : (an.temaPrincipal ? an.temaPrincipal.clave : "mensaje"),
        areas: an.areas,
        persona: an.persona,
        parentesco: an.parentesco,
        tono: an.tono
      }
    });
  } catch (e) {
    res.json({ ok: false, error: "error" });
  }
});

router.post("/analizar-pregunta", (req, res) => {
  try {
    const pregunta = (req.body || {}).pregunta || "";
    if (!pregunta) return res.status(400).json({ error: "Sin pregunta" });
    const an = nlp.analizarPregunta(pregunta);
    res.json({ ok: true, analisis: an });
  } catch (e) {
    res.json({ ok: false, error: "error" });
  }
});

module.exports = router;
module.exports.completarIA = completarIA;
module.exports.isOpenAIConfigured = isOpenAIConfigured;
module.exports.isHFConfigured = isHFConfigured;
