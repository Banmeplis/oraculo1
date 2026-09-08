const db = require("./database.js");

const autor = db.prepare("SELECT id FROM users WHERE email = ?").get("luna.arcania@oraculo.local");
if (!autor) throw new Error("No se encontró la autora demo");

const articulos = {};

articulos["Ritual con vela blanca para limpiar tu energía"] = `Hay un motivo por el que encender una vela se siente como un cambio de ambiente: estás presenciando una reacción química real. La cera derretida sube por la mecha por capilaridad y, al vaporizarse, combustiona y se convierte en dióxido de carbono y vapor de agua.

### 🔍 Pequeña investigación: qué arde dentro de una vela
La National Candle Association explica que todas las ceras son, en esencia, hidrocarburos (moléculas de carbono e hidrógeno). Cuando enciendes una vela, el calor de la llama derrite la cera junto a la mecha y esa cera líquida asciende por la mecha; al llegar a la llama se vaporiza y reacciona con el oxígeno del aire, generando luz, calor, CO2 y vapor de agua. En otras palabras: una vela que arde con calma "respira" hacia su entorno lo mismo que tus pulmones al exhalar.

- 🫧 La llama estable indica una combustión completa y limpia.
- 🌬️ Ventilar la habitación antes y después apoya la limpieza simbólica y también la real.

**Fuente:** [National Candle Association: Candle Science](https://candles.org/candle-science/)

### ✨ Cómo vivirlo como ritual de limpieza
- 🏡 Ventila el espacio y ordena la superficie donde trabajarás.
- 🕯️ Enciende la vela blanca con una intención breve, como "suelto el cansancio".
- ✍️ Observa la llama un par de minutos y escribe una sola palabra que quieras sentir al final del día.
- 🚫 Nunca dejes la vela encendida sin vigilancia ni la acerques a cortinas o papeles.

Puedes cerrar agradeciendo, apagar con un apagavelas y repetirlo cada semana: el gesto es pequeño, pero la pausa que crea es real.`;

articulos["Vela dorada para activar prosperidad"] = `El dorado se ha asociado con el sol, el éxito y la confianza en muchas tradiciones. Pero la parte más concreta de la prosperidad no está en el color de la cera: está en lo que ocurre después de apagar la vela.

### 🔍 Pequeña investigación: las metas que se escriben
La psicóloga Gail Matthews (Dominican University of California) estudió a 267 personas y comparó a quienes solo pensaban en sus metas con quienes las escribían, las comprometían con otra persona y enviaban reportes semanales. Quienes escribieron sus metas y rindieron cuentas a un amigo lograron, en promedio, un 76% de sus objetivos; quienes solo las pensaron, un 43%. Escribir no es magia: es una forma de fijar la atención y volver visible lo que quieres.

**Fuente:** [Metas escritas y logro de objetivos (Gail Matthews, Dominican University)](https://www.dominican.edu/sites/default/files/2020-02/gailmatthews-harvard-goals-researchsummary.pdf)

### ✨ El ritual de la vela dorada, con los pies en el suelo
- ✍️ Escribe **una** meta medible en una hoja (por ejemplo, "ahorrar X al mes").
- 🕯️ Enciende la vela dorada sobre un plato estable y lee la meta en voz baja.
- 📣 Decide a quién se la harás pública: esa persona será tu red de rendición de cuentas.
- 📅 Agenda un repaso semanal mientras la vela arde.

La vela pone la intención; el calendario, la constancia. **Fuente de seguridad:** [NFPA: Candle Safety](https://www.nfpa.org/education-and-research/home-fire-safety/candles)`;

articulos["Vela rosa para sanar el corazón"] = `El color rosa suele acompañar los rituales de amor propio. La buena noticia es que sanar tu relación contigo no depende de la vela: la psicología ha estudiado el mecanismo exacto que este tipo de ritual intenta activar.

### 🔍 Pequeña investigación: la autocompasión no es mimos, es ciencia
Kristin Neff, investigadora de la Universidad de Texas, definió la autocompasión con tres componentes que se pueden entrenar: la amabilidad hacia ti (tratarte con ternura en vez de juzgarte), la humanidad común (recordar que fallar le pasa a todos) y la atención plena (sostener el malestar sin exagerarlo ni negarlo). Sus estudios relacionan estos tres pilares con menos ansiedad, menos depresión y mayor satisfacción con la vida.

**Fuente:** [Teoría de la autocompasión (Kristin Neff)](https://self-compassion.org/wp-content/uploads/publications/SCtheoryarticle.pdf)

### ✨ Cómo encender la vela rosa esta semana
- ✍️ Escribe **tres** formas concretas de tratarte con más respeto (una cita médica, un límite, un descanso).
- 🕯️ Con la vela encendida, repite: "soy amable conmigo hoy".
- 💗 Recuerda que la intención se orienta a tu bienestar, no a controlar a otra persona.
- 🚫 Apaga siempre la vela antes de dormir y mantenla lejos de objetos inflamables.

La seguridad es parte del autocuidado real.`;

articulos["Cómo interpretar la llama de una vela"] = `Si alguna vez te has quedado mirando una llama, ya sabes que cambia de forma y de intensidad. La física explica casi todo lo que ves: el resto lo pones tú, con tu estado de ánimo y tu intención.

### 🔍 Pequeña investigación: anatomía de una llama
La National Candle Association describe varias zonas en la llama: la base azul (donde el oxígeno abunda), el cono amarillo (donde las partículas de carbono brillan al incandescer, alrededor de 1.200 °C) y el borde azul exterior, la zona más caliente, que puede alcanzar unos 1.400 °C. El humo que a veces ves no es culpa de la vela: es hollín que escapa cuando la combustión se interrumpe, por ejemplo por una corriente de aire o una mecha demasiado larga.

**Fuente:** [National Candle Association: Candle Science](https://candles.org/candle-science/) · [NCA: FAQs sobre hollín y mecha](https://candles.org/faqs/)

### ✨ Qué registrar (y qué no)
- 📏 Recorta la mecha a unos 6 mm antes de cada uso: la clave del hollín está en la mecha.
- 🌬️ Si la llama humea o parpadea mucho, es señal de corriente de aire, no de mensaje.
- 📓 Anota qué sentías y qué intención tenías: eso es lo interpretable.
- 🧯 Una llama estable y limpia es, sobre todo, una práctica segura.`;

articulos["Ritual de cierre con vela y sal"] = `Cerrar una etapa no es olvidarla: es dejar de gastar energía en lo que ya cumplió su propósito. Un pequeño ritual con vela y sal puede ayudarte a simbolizar ese límite.

### 🔍 Pequeña investigación: qué hace que un ritual funcione
Los psicólogos Michael Norton (Harvard) y Francesca Gino demostraron que realizar una secuencia de gestos simbólicos tras una pérdida reduce el malestar, no por el gesto en sí, sino porque devuelve una sensación de control. La sal, por su parte, es un símbolo clásico de límite y conservación: los romanos la usaban como signo de protección y pureza, y sigue siendo un recurso doméstico eficaz para limpiar superficies y absorber humedad.

**Fuente:** [Rituals Alleviate Grieving (Norton & Gino, Harvard Business School)](https://www.hbs.edu/ris/Publication%20Files/norton%20gino%202014_e44eb177-f8f4-4f0d-a458-625c1268b391.pdf)

### ✨ El cierre, paso a paso
- 🧂 Rodea el plato con un aro de sal (nunca la sal sobre la llama directa: puede chispear).
- ✍️ Escribe lo que dejas atrás y lee la frase una vez, en voz alta.
- 🕯️ Rompe el papel, apágalo con cuidado y apaga la vela de forma segura.
- 🚫 Desecha toda vela cuando queden unos 5 cm de cera o menos.

**Fuente de seguridad:** [NFPA: Candle Safety](https://www.nfpa.org/education-and-research/home-fire-safety/candles)`;

articulos["Arcángel Miguel: protección y límites"] = `Miguel aparece en la Biblia y en el Corán como el capitán de los ejércitos celestiales, el que sostiene la espada contra el dragón. Esa imagen de guerrero se traduce, hoy, en algo muy concreto: la capacidad de decir no.

### 🔍 Pequeña investigación
- 📖 La Enciclopedia Británica describe a Miguel como el "gran capitán" y protector que ayuda a su pueblo, una figura presente en el judaísmo, el cristianismo y el islam.
- 🚧 Un estudio de la Universidad A&M de Texas encontró que las personas que separan con claridad su vida personal de la profesional reportan mejor autocuidado y mayor bienestar, mientras que la interferencia constante entre ambos ámbitos se asocia con más desgaste.

**Fuente:** [Britannica: Arcángel Miguel](https://www.britannica.com/topic/Michael-archangel) · [Límites, autocuidado y bienestar](https://hdl.handle.net/1969.1/197728)

### ✨ La práctica de los límites
- 🔵 Medita con una luz azul en el pecho mientras nombras un límite pendiente.
- 🗣️ Ensaya la frase antes de decirla: "hoy cuento con mi espacio hasta tal hora".
- 🛑 Cortar hábitos, conversaciones y vínculos que te alejan de tu verdad también es protección.
- ✅ Al final del día, anota un único "no" que hayas sostenido o quieras sostener mañana.`;

articulos["Arcángel Rafael y la energía de la sanación"] = `Rafael significa "Dios sana" y aparece como el arcángel sanador en los textos deuterocanónicos. La tradición lo imagina con una lámpara o un báculo; la práctica, hoy, empieza por algo más terrenal: el descanso.

### 🔍 Pequeña investigación
- 📖 La Enciclopedia Británica sitúa a Rafael entre los cuatro arcángeles mencionados en los Apócrifos, junto a Uriel, mientras que solo Miguel y Gabriel aparecen en el Antiguo Testamento.
- 😴 La Sleep Foundation resume por qué dormir es curativo: durante el sueño el cuerpo consolida la memoria, repara tejidos, regula hormonas y alimenta el sistema inmune. Una sola noche sin dormir ya afecta el ánimo, la concentración y las decisiones.

**Fuente:** [Britannica: jerarquía de los ángeles](https://www.britannica.com/summary/angel-religion) · [Sleep Foundation: por qué dormimos](https://www.sleepfoundation.org/how-sleep-works/why-do-we-need-sleep)

### ✨ El ritual de Rafael
- 💚 Respira e imagina una luz verde alrededor del pecho mientras te preguntas qué necesita atención: descanso, compañía, comida o una consulta.
- 🛏️ Agenda una noche real de descanso, no una más.
- 🙏 Celebra las señales pequeñas de mejoría.
- ⚠️ La espiritualidad acompaña, pero no reemplaza, la atención médica: pedir ayuda también es sanar.`;

articulos["Arcángel Gabriel: mensajes y comunicación"] = `Gabriel es el mensajero: el que anuncia, el que traduce, el que pone palabras a lo que estaba en el aire. La tradición lo asocia con la comunicación; la investigación, con algo que todos podemos entrenar.

### 🔍 Pequeña investigación
- 📖 La Enciclopedia Británica indica que, junto a Miguel, Gabriel es uno de los dos arcángeles que se mencionan en el Antiguo Testamento (en el islam es el ángel del mensaje, Yibril).
- 👂 La escucha activa tiene base empírica: la literatura clínica (StatPearls/NCBI) define la comunicación eficaz como un intercambio con retroalimentación, paráfrasis y preguntas de clarificación. No se trata de nacer comunicando: se entrena.

**Fuente:** [Britannica: ángeles y arcángeles](https://www.britannica.com/summary/angel-religion) · [Escucha activa (StatPearls, NCBI)](https://www.ncbi.nlm.nih.gov/books/NBK442015/)

### ✨ Escuchar y decir
- 🕯️ Antes de la conversación importante, enciende una vela blanca y escribe: qué quiero decir, qué necesito escuchar y qué límite sostendré.
- 🔁 En la conversación, devuelve con tus palabras lo que entendiste: "si te entiendo bien...".
- ❓ Pregunta antes de concluir; no asumas el tono ni la intención.
- 💬 La verdad puede ser firme y compasiva a la vez.`;

articulos["Arcángel Uriel y la claridad para decidir"] = `Uriel significa "fuego de Dios" y es, de los cuatro arcángeles clásicos, el que se asocia con la luz de la comprensión. A diferencia de los otros tres, no aparece en el canon del Antiguo Testamento: se le encuentra en los Apócrifos, y por eso su culto es más popular en ciertas tradiciones cristianas ortodoxas.

### 🔍 Pequeña investigación
La Enciclopedia Británica explica que la lista bíblica se limita a dos arcángeles en el Antiguo Testamento (Miguel y Gabriel) y que Rafael y Uriel aparecen en los textos apócrifos. Saber de dónde viene la figura no le quita valor simbólico: te permite decidir con qué tradición te quieres quedar.

**Fuente:** [Britannica: jerarquía de los ángeles](https://www.britannica.com/summary/angel-religion)

### ✨ El ejercicio de Uriel para decidir
- 🟠 Coloca una luz cálida cerca de tu cuaderno.
- ✍️ Dibuja tres columnas y llena cada una: **hechos** (lo que sabes con certeza), **miedos** (lo que imaginas) y **próximos pasos** (lo que está en tu mano).
- 🔍 Cuando separas lo que sabes de lo que temes, la decisión deja de ser un bloque y se vuelve una lista.
- ✅ Elige una sola acción pequeña y hazla en las próximas 48 horas.`;

articulos["Arcángel Chamuel: paz en los vínculos"] = `Chamuel se ha popularizado como el arcángel del amor y la paz en las relaciones, pero conviene saber que no aparece en los textos canónicos: la Enciclopedia Británica solo nombra cuatro arcángeles bíblicos (Miguel, Gabriel, Rafael y Uriel). Eso no lo invalida como símbolo; simplemente nos recuerda que trabajamos con una tradición espiritual viva.

### 🔍 Pequeña investigación: escuchar de verdad al otro
Un estudio registrado de Weinstein e Itzchakov (2024) encontró que cuando alguien es escuchado con empatía de verdad, sus necesidades psicológicas de autonomía y conexión quedan satisfechas, y aumenta su sensación de autoconexión. Escuchar bien es una de las formas más reales de contribuir a la paz de un vínculo.

**Fuente:** [Britannica: ángeles y arcángeles](https://www.britannica.com/summary/angel-religion) · [Escucha empática y bienestar (Weinstein & Itzchakov, 2024)](https://doi.org/10.1016/j.jesp.2024.104716)

### ✨ La práctica de Chamuel
- ✍️ Escribe qué parte de la situación sí puedes cuidar tú (tu tono, tus tiempos, tu presencia).
- 👂 Antes de pedir que el otro cambie, escucha sin preparar tu respuesta.
- ⚖️ Una relación sana necesita reciprocidad: la paz no es controlar, es co-crear.
- 💗 Usa la meditación para volver a ti, no para dirigir la vida ajena.`;

articulos["Qué son los portales energéticos"] = `"Portal energético" es una expresión espiritual, no una categoría de la física. Una fecha a la que se le atribuye un significado especial funciona como un recordatorio simbólico: puede ser útil, siempre que no se confunda con un mecanismo probado.

### 🔍 Pequeña investigación: qué hay detrás de las fechas
- 🔭 La NASA explica que los equinoccios y solsticios tienen una causa astronómica clara: la inclinación del eje terrestre y la posición aparente del Sol. Son cambios reales en la luz, y por eso muchas culturas los marcaron como momentos sagrados.
- 🔍 No hay evidencia científica de que una fecha por sí sola altere tu destino. Su valor es el que tú le pones: pausa, revisión y propósito.

**Fuente:** [NASA: Estaciones del año](https://science.nasa.gov/earth/earth-observatory/what-are-the-seasons/)

### ✨ Cómo aprovecharlo con los pies en el suelo
- 📅 Elige la fecha como un recordatorio en tu calendario, no como un mandato externo.
- ✍️ Escribe una intención breve y una acción concreta que la acompañe.
- 🛒 No necesitas comprar nada ni temer a ninguna fecha.
- ✅ La mejor "activación de portal" es una decisión pequeña hecha ese día.`;

articulos["Portal 11:11 y el poder de la intención"] = `Que el reloj marque 11:11 y sientas que "algo está pasando" es más común de lo que crees... y la psicología estudia exactamente ese fenómeno.

### 🔍 Pequeña investigación: cuando vemos significado en lo aleatorio
Nuestro cerebro es una máquina de detectar patrones: interpreta el ruido visual y temporal buscando regularidad. El investigador Peter Brugger (Universidad de Zúrich) ha estudiado esa tendencia a percibir conexiones significativas entre eventos aleatorios, un sesgo que en psicología se conoce como apofenia. Ver 11:11 no es señal de que el universo te hable: es una invitación natural a detenerte un segundo.

**Fuente:** [Peter Brugger: cognición, patrón y creencia paranormal](https://www.ugent.be/pp/experimentele-psychologie/en/research/contacts/2013/brugger.htm)

### ✨ Usar el 11:11 con sentido
- ⏰ Cuando veas 11:11, respira una vez y revisa cómo estás.
- ✍️ Escribe una intención de máximo cinco palabras.
- 📞 Convierte la intención en conducta: una llamada pendiente, una hoja ordenada o diez minutos de silencio.
- 💡 La intención no funciona porque el número sea especial; funciona porque le diste un significado y un acto.`;

articulos["Portales de cambio de estación"] = `Cada cambio de estación es un "portal" real de la naturaleza: la luz cambia, los días crecen o menguan y el paisaje se transforma. Lo demás lo ponemos nosotros.

### 🔍 Pequeña investigación: qué es un equinoccio o un solsticio
- 🌍 La NASA explica que las estaciones existen porque el eje de la Tierra está inclinado unos 23,4° respecto a su órbita alrededor del Sol.
- ⚖️ En los **equinoccios**, la duración del día y de la noche es casi igual en todo el planeta; en los **solsticios**, el día (o la noche) alcanza su duración máxima del año.
- 📄 Es un fenómeno astronómico predecible, no una energía invisible; pero usarlo como calendario personal es una tradición antigua y válida.

**Fuente:** [NASA: Estaciones y equinoccios](https://science.nasa.gov/earth/earth-observatory/what-are-the-seasons/)

### ✨ El ritual de cambio de estación
- 📦 Ordena un espacio físico de tu casa.
- ✍️ Haz dos listas: lo que quieres conservar y lo que quieres soltar.
- 🕯️ Enciende una vela corta y lee ambas listas en voz alta.
- ✅ Elige una sola acción que abra la nueva estación (una caminata, una siembra, una cena con amigos).`;

articulos["Portal energético y protección emocional"] = `Cuando sientes que "todo está muy cargado", lo que tu cuerpo te pide son gestos de orden: comida, descanso, una conversación segura. La protección emocional empieza ahí, y la ciencia de los rituales lo confirma.

### 🔍 Pequeña investigación: por qué los rituales nos protegen
Norton y Gino (Harvard Business School) demostraron en tres experimentos que realizar secuencias simbólicas de gestos tras una pérdida reduce el malestar porque restaura la sensación de control. Ritos simples, como ordenar la mesa, encender y apagar una vela, o escribir y romper una hoja, actúan como anclas cuando el entorno se siente impredecible.

**Fuente:** [Rituals Alleviate Grieving (Norton & Gino)](https://www.hbs.edu/ris/Publication%20Files/norton%20gino%202014_e44eb177-f8f4-4f0d-a458-625c1268b391.pdf)

### ✨ Tu kit de protección real
- 🥤 Un vaso de agua, una comida completa y un paseo: las bases antes de cualquier práctica.
- 📵 Limita el exceso de información el día "intenso".
- 🕯️ Si haces un ritual, que sea corto y concreto: encender, respirar, agradecer, apagar.
- ⚠️ Si una práctica te genera miedo o ansiedad, detente: la espiritualidad debe darte autonomía, no quitártela.`;

articulos["Luna nueva: sembrar una intención"] = `La luna nueva inicia el ciclo lunar: en el cielo apenas se ve, y sin embargo es el momento que muchas tradiciones usan para comenzar. La ciencia coincide en que el inicio es donde se gana, o se pierde, la partida.

### 🔍 Pequeña investigación
- 🌙 La NASA describe ocho fases lunares y señala que el ciclo de luna nueva a luna nueva dura unos 29,5 días. La fase depende de la geometría entre Sol, Tierra y Luna, no de una energía invisible.
- 🎯 La investigación de Peter Gollwitzer sobre "intenciones de implementación" muestra que las metas funcionan mejor cuando se formulan como un plan del tipo: "cuando ocurra X, haré Y". Esa fórmula concreta casi duplica la probabilidad de llevarla a cabo.

**Fuente:** [NASA: Fases de la Luna](https://science.nasa.gov/moon/moon-phases/) · [Implementation Intentions (Gollwitzer)](https://bpb-us-e1.wpmucdn.com/wp.nyu.edu/dist/c/6235/files/2019/02/gollwitzer-1999-implementation-intentions.pdf)

### ✨ Sembrar de forma concreta
- ✍️ Escribe una intención en presente y en una sola frase.
- 📅 Añade el "cuando... haré...": "cuando termine de desayunar, enviaré el correo".
- 🌒 Revísala cada semana durante el ciclo.
- 🌱 Sembrar no es exigir resultados inmediatos: es cuidar la dirección.`;

articulos["Luna llena: agradecer y liberar"] = `La luna llena es el momento de máxima visibilidad: los rituales de agradecimiento y de soltar aprovechan esa claridad simbólica. La investigación suma un dato importante: agradecer tiene efectos medibles.

### 🔍 Pequeña investigación
- 🌙 La NASA señala que en la luna llena toda la cara visible está iluminada por el Sol; es una fecha precisa dentro del ciclo de 29,5 días, ideal para una revisión mensual.
- 💛 Los experimentos de Robert Emmons (UC Davis) y Michael McCullough mostraron que quienes apuntaban cada semana lo bueno que les pasaba reportaban más optimismo y mejor ánimo, y quienes lo hacían a diario sumaban incluso mejor calidad de sueño y conductas más prosociales.

**Fuente:** [NASA: Fases de la Luna](https://science.nasa.gov/moon/moon-phases/) · [Contar bendiciones mejora el bienestar (Emmons & McCullough)](https://pubmed.ncbi.nlm.nih.gov/12585811/)

### ✨ El ritual de la luna llena
- ✍️ Escribe cinco cosas que sí florecieron este ciclo y una carga que quieres soltar.
- 🗣️ Lee la lista en voz alta.
- 🧻 Rompe solo la parte que representa la carga.
- ✅ Después, un gesto tangible: ordenar, devolver, descansar o cerrar una conversación.`;

articulos["Cuarto creciente: sostener el impulso"] = `En el cuarto creciente la luna va creciendo a medias: es la fase de construir, de sostener lo que sembraste en luna nueva. Aquí no se pide claridad nueva, se pide constancia.

### 🔍 Pequeña investigación
- 🌙 La NASA recuerda que el cuarto creciente es una fase exacta dentro del ciclo de 29,5 días: en ella crece el área iluminada, pero aún falta para la luna llena.
- 📈 La investigadora Phillippa Lally (University College London) midió cuánto tarda un comportamiento en volverse automático: como promedio, 66 días, aunque varía entre 18 y 254. Lo relevante: saltarse un día no rompe el hábito; lo que cuenta es la repetición en un mismo contexto.

**Fuente:** [UCL: cuánto tarda formar un hábito](https://www.ucl.ac.uk/news/2009/aug/how-long-does-it-take-form-habit)

### ✨ Sostener el impulso
- ⏱️ Divide el siguiente paso en una tarea de quince minutos al día.
- 📍 Ancla la tarea a un momento fijo (después del café, antes de acostarse).
- 🔁 Repite sin exigir perfección: un día fallido no borra el camino.
- 📅 No midas solo resultados visibles: contar la disciplina de volver también cuenta.`;

articulos["El sol como símbolo de vitalidad"] = `El sol estructura nuestro día desde antes de que existiera cualquier dios o símbolo: la luz de la mañana es una instrucción que el cuerpo entiende.

### 🔍 Pequeña investigación
- 😴 La Sleep Foundation explica que la luz del día es la principal señal del reloj biológico: por la mañana suprime la melatonina y aumenta el estado de alerta, mientras que el anochecer inicia la liberación de esa hormona. Por eso la exposición a luz natural temprano es una de las recomendaciones para regular el sueño y el ánimo.
- 🌞 La NASA recuerda que mirar directamente al Sol puede dañar seriamente los ojos.

**Fuente:** [Sleep Foundation: por qué es importante dormir](https://www.sleepfoundation.org/how-sleep-works/why-do-we-need-sleep) · [NASA: nuestro Sol](https://science.nasa.gov/sun/facts/)

### ✨ La práctica de la mañana
- 🌅 Sal a la luz natural, o abre la ventana, en la primera hora del día.
- 🧘 Respira y pregúntate: ¿qué merece hoy mi energía?
- ✍️ Formula una sola intención para la jornada.
- ⌚ Mantén el hábito, aunque sea de diez minutos: la vitalidad también se construye durmiendo, comiendo y poniendo límites.`;

articulos["Solsticio: honrar la luz y la sombra"] = `El solsticio es el punto de máximo contraste del año: en unas fechas, el día (o la noche) más largo; en otras, el más breve. La naturaleza te da un espejo para examinar tus propios extremos.

### 🔍 Pequeña investigación
La NASA explica que en el solsticio de junio el hemisferio norte recibe la luz solar con su inclinación máxima hacia el Sol, produciendo el día más largo del año; en el de diciembre ocurre lo contrario. No hay ningún "portal" sobrenatural, pero sí un ritmo astronómico real que las culturas han honrado desde la Antigüedad: Stonehenge, por ejemplo, está alineado con la salida del sol del solsticio de verano.

**Fuente:** [NASA: Estaciones y equinoccios](https://science.nasa.gov/earth/earth-observatory/what-are-the-seasons/)

### ✨ El ritual de la luz y la sombra
- 🕯️ Enciende una vela y escribe dos listas: lo que brilla en tu vida y lo que pide atención.
- ⚖️ Dales el mismo respeto: la plenitud no exige negar ninguna parte.
- 🌄 Pasa un momento al aire libre cerca del amanecer o del atardecer.
- ✅ Elige una acción amable para cada lista.`;

articulos["Ritual solar de confianza personal"] = `La confianza no es esperar a sentirte invencible: es actuar a pesar de la duda. La psicología lleva décadas estudiando cómo se construye.

### 🔍 Pequeña investigación: la autoeficacia según Bandura
Albert Bandura definió la autoeficacia como la creencia en tu capacidad de organizar y ejecutar lo necesario para lograr un objetivo. Según la American Psychological Association, esas creencias se alimentan de cuatro fuentes: las experiencias de logro (haber hecho algo alguna vez), la observación de otras personas parecidas a ti, el ánimo de personas creíbles, y tu estado emocional. Quienes tienen más autoeficacia se ponen metas más grandes y se recuperan mejor de los reveses.

**Fuente:** [APA: la teoría de la autoeficacia](https://www.apa.org/research-practice/conduct-research/self-efficacy-human-agency)

### ✨ El ritual de la confianza
- ✍️ Escribe **cinco** habilidades que ya has demostrado en tu vida: el registro de logros propios es una de las fuentes más potentes de Bandura.
- 💬 Añade una frase de ánimo dicha por alguien en quien confíes.
- 🌅 Lee tu lista junto a una ventana iluminada antes de tu tarea.
- ✅ Actúa aunque no te sientas del todo seguro: la competencia y la confianza se construyen juntas.`;

const actualizar = db.prepare("UPDATE posts SET cuerpo = ?, actualizado = datetime('now') WHERE id = ?");
const total = Object.keys(articulos).length;
let coinciden = 0;
let fallan = [];

for (const [titulo, cuerpo] of Object.entries(articulos)) {
  const post = db.prepare("SELECT id FROM posts WHERE autor_id = ? AND titulo = ?").get(autor.id, titulo);
  if (!post) { fallan.push(titulo); continue; }
  actualizar.run(cuerpo, post.id);
  coinciden++;
}

console.log(`Artículos reestructurados: ${coinciden}/${total}`);
if (fallan.length) {
  console.log("No encontrados:");
  fallan.forEach(t => console.log("  - " + t));
  process.exit(1);
}