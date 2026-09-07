const db = require("./database.js");

const autor = db.prepare("SELECT id FROM users WHERE email = ?").get("luna.arcania@oraculo.local");
if (!autor) throw new Error("No se encontró la autora demo");

const ampliaciones = {
  vela: `\n\n### Qué dice la información de seguridad\nUna vela es una llama abierta. La National Fire Protection Association (NFPA) informa que, entre 2020 y 2024, las velas estuvieron relacionadas con un promedio estimado de 5.894 incendios estructurales en viviendas al año en Estados Unidos. La recomendación práctica es mantenerlas al menos a 30 cm de materiales combustibles, apagarlas antes de salir de una habitación y nunca dejarlas encendidas mientras duermes.\n\nEn un ritual, la parte simbólica puede convivir con estas reglas: utiliza un plato estable, despeja la zona, mantén la mecha recortada y considera una vela sin llama si hay niños, mascotas o materiales inflamables cerca.\n\n**Fuente:** [NFPA: Candle Safety](https://www.nfpa.org/education-and-research/home-fire-safety/candles)`,
  arcangel: `\n\n### Tradición y práctica responsable\nLa palabra arcángel pertenece a una tradición religiosa y cultural con distintas interpretaciones según cada texto y comunidad. Miguel, Rafael, Gabriel, Uriel y Chamuel no deben presentarse como hechos científicos ni como sustitutos de atención médica, psicológica o legal. En este artículo los usamos como símbolos de reflexión: protección, cuidado, comunicación, claridad y paz.\n\nUna práctica útil consiste en traducir el símbolo a una acción observable. Si trabajas con Miguel, define un límite; con Rafael, agenda descanso o consulta profesional; con Gabriel, prepara una conversación; con Uriel, separa hechos de miedos; con Chamuel, revisa si existe reciprocidad.\n\n**Fuente de contexto:** [Encyclopaedia Britannica: Archangel](https://www.britannica.com/topic/archangel-religion)`,
  portal: `\n\n### Diferenciar símbolo de evidencia\n“Portal energético” es una expresión espiritual o cultural, no una categoría establecida por la física. Una fecha repetida o un cambio de estación puede servir como recordatorio para detenerte, revisar tus hábitos y tomar una decisión, pero no hay evidencia científica de que una fecha por sí sola altere el destino o produzca poderes especiales.\n\nLos equinoccios y solsticios sí tienen una explicación astronómica: están relacionados con la inclinación del eje terrestre y la posición aparente del Sol en el cielo. Convertir ese conocimiento en un ritual personal puede ser significativo siempre que no se confunda una metáfora con un mecanismo probado.\n\n**Referencia astronómica:** [NASA: Seasons and Eclipses](https://science.nasa.gov/earth/earth-observatory/what-are-the-seasons/)`,
  luna: `\n\n### Lo que ocurre realmente con las fases lunares\nLa Luna no produce luz propia: vemos la parte iluminada por el Sol mientras la Luna recorre su órbita. NASA describe ocho fases principales y señala que el ciclo de luna nueva a luna nueva dura aproximadamente 29,5 días. La fase observada depende de la geometría entre el Sol, la Tierra y la Luna, no de una energía invisible comprobada.\n\nPuedes usar cada fase como un calendario simbólico: comenzar en luna nueva, revisar avances en cuarto creciente, observar resultados en luna llena y cerrar aprendizajes durante la fase menguante. Es una herramienta de organización personal, no una predicción.\n\n**Fuente científica:** [NASA: Moon Phases](https://science.nasa.gov/moon/moon-phases/)`,
  sol: `\n\n### Datos del Sol y cuidado de la vista\nEl Sol es una estrella de aproximadamente 4,5 mil millones de años, situada a unos 150 millones de kilómetros de la Tierra. NASA explica que su energía sostiene la vida, pero también que su radiación puede causar daños graves en los ojos y la piel. Por eso nunca debes mirar directamente al Sol ni usar un ritual solar para sustituir protección, descanso o consejo médico.\n\nLa práctica segura es observar la luz ambiental en la mañana, respirar y escribir una intención. No hace falta mirar el disco solar ni exponerte durante mucho tiempo: el significado espiritual puede encontrarse en la presencia y en el hábito, no en asumir riesgos.\n\n**Fuente científica:** [NASA: Our Sun - Facts](https://science.nasa.gov/sun/facts/)`
};

const posts = db.prepare("SELECT id, titulo, cuerpo FROM posts WHERE autor_id = ? ORDER BY creado_en DESC LIMIT 20").all(autor.id);
if (posts.length < 20) throw new Error(`Se esperaban 20 artículos y se encontraron ${posts.length}`);

function categoria(titulo) {
  if (/vela/i.test(titulo)) return "vela";
  if (/arcángel/i.test(titulo)) return "arcangel";
  if (/portal/i.test(titulo)) return "portal";
  if (/luna|cuarto creciente/i.test(titulo)) return "luna";
  return "sol";
}

const actualizar = db.prepare("UPDATE posts SET cuerpo = ?, actualizado = datetime('now') WHERE id = ?");
for (const post of posts) {
  const fuente = ampliaciones[categoria(post.titulo)];
  const cuerpoBase = String(post.cuerpo || "").replace(/\n\n### Qué dice la información de seguridad[\s\S]*$/, "").replace(/\n\n### Tradición y práctica responsable[\s\S]*$/, "").replace(/\n\n### Diferenciar símbolo de evidencia[\s\S]*$/, "").replace(/\n\n### Lo que ocurre realmente con las fases lunares[\s\S]*$/, "").replace(/\n\n### Datos del Sol y cuidado de la vista[\s\S]*$/, "");
  actualizar.run(cuerpoBase + fuente, post.id);
}

console.log(`Artículos ampliados con fuentes: ${posts.length}`);
