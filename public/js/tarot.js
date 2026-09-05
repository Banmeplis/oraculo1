/* ============================================================
   ORÁCULO · Los 22 Arcanos Mayores (Español)
   (Mazo en uso: únicamente los 22 arcanos mayores para todas
   las modalidades de lectura)
   ============================================================ */

const ORACULO = {

/* ------------------------- ARCANOS MAYORES ------------------------- */
mayores: [
  { n: 0,  nombre: "El Loco",        palo: "",  emoji: "🪽", img: "/cartas/el-loco.png", palabras: ["Libertad", "Nuevo comienzo", "Aventura"],
    derecho: "Algo nuevo llama a tu puerta y te da un poco de miedo. Eso es humano. Pero tú tienes alas y el mundo es grande. Da el primer paso, suave y seguro, y deja que la vida te sorprenda.",
    invertida: "Te hablo claro: estás corriendo sin mirar y eso te va a costar. Quieres todo ya, sin plan ni cuidado. Para, respira y piensa antes de saltar. La prisa no es tu amiga." },
  { n: 1,  nombre: "El Mago",        palo: "",  emoji: "🔮", img: "/cartas/el-mago.png", palabras: ["Poder", "Manifestación", "Talento"],
    derecho: "Todo lo que necesitas ya está dentro de ti: talento, palabra y fuerza. Hoy puedes hacer real lo que imaginas. Cree en ti, actúa con calma y verás tu deseo tomar forma.",
    invertida: "Te lo digo sin vueltas: tienes un gran poder y lo estás dejando dormir. Nada de excusas ni promesas vacías. Usa tus dones ahora, o la vida los pondrá en otras manos." },
  { n: 2,  nombre: "La Sacerdotisa",  palo: "",  emoji: "🌙", img: "/cartas/la-sacerdotisa.png", palabras: ["Intuición", "Misterio", "Sabiduría interna"],
    derecho: "Tu corazón ya conoce la respuesta, aunque tu cabeza no la escuche. Siéntate en silencio, respira y escucha adentro. La verdad no está afuera: está en ti, esperando que la oigas.",
    invertida: "Te aviso con cariño y firmeza: llevas callando lo que sientes y ese silencio te pesa. Guardas secretos que no te dejan dormir. Habla tu verdad y vuelve a escuchar tu voz interior." },
  { n: 3,  nombre: "La Emperatriz",   palo: "",  emoji: "🌸", img: "/cartas/la-emperatriz.png", palabras: ["Abundancia", "Fertilidad", "Cuidado"],
    derecho: "Este es tu tiempo de florecer. Cuida lo que amas, riega tus sueños y deja que la abundancia entre por la puerta ancha. Te espera un regazo de paz y de frutos. Disfrútalo y agradece.",
    invertida: "Te lo digo de frente: te estás descuidando. Dejas tu cuerpo, tu creatividad y tus sueños en el último lugar. Vuélvete tu primera prioridad: si tú no te nutres, nada florece." },
  { n: 4,  nombre: "El Emperador",    palo: "",  emoji: "👑", img: "/cartas/el-emperador.png", palabras: ["Estructura", "Autoridad", "Estabilidad"],
    derecho: "Ordena tu mundo con calma y firmeza. Hoy pones bases sólidas: tu casa, tu trabajo y tu palabra ganan peso. Tú mandas en tu vida, y lo haces bien.",
    invertida: "Te lo digo sin miedo a ofenderte: el control te está comiendo. Quieres mandar en todo y hasta en ti te vuelves rígido. Aprende a soltar, a delegar y a pedir ayuda. Mandar bien también es descansar." },
  { n: 5,  nombre: "El Hierofante",   palo: "",  emoji: "📜", img: "/cartas/el-hierofante.png", palabras: ["Tradición", "Enseñanza", "Guía espiritual"],
    derecho: "Un guía llega a tu camino, o tú te vuelves guía para otros. Busca la enseñanza que te espera y compártela con el corazón abierto. Aprender y enseñar te crece por dentro.",
    invertida: "Te lo digo claro: sigues reglas viejas que ya no son tuyas. No todo lo que te enseñaron es verdad para ti. Cuestiona, piensa y elige tu propio camino con libertad y respeto." },
  { n: 6,  nombre: "Los Enamorados",  palo: "",  emoji: "💞", img: "/cartas/los-enamorados.png", palabras: ["Amor", "Unión", "Elección"],
    derecho: "Tu corazón y tu mente se dan la mano: esta es tu hora de elegir con amor y coherencia. Lo que decidas hoy marca tu camino. Elige desde tu verdad, no desde el miedo a quedarte solo.",
    invertida: "Te lo digo de frente: la duda te está volviendo mitad. No elijas por miedo a estar solo y no te quedes donde apagan tu luz. Escucha tu verdad, aunque sea incómoda, y decide con valentía." },
  { n: 7,  nombre: "El Carro",        palo: "",  emoji: "🐎", img: "/cartas/el-carro.png", palabras: ["Victoria", "Voluntad", "Avance"],
    derecho: "Tu fuerza se pone en marcha: nada te detiene cuando tú decides avanzar. Sujeta bien las riendas, mira adelante y cruza ese obstáculo. La victoria te espera al final del camino.",
    invertida: "Te lo digo sin rodeos: vas para todos lados y no llegas a ninguno. No más dispersiones. Elige un solo rumbo, firme y claro, y camina. La fuerza perdida se recupera con dirección." },
  { n: 8,  nombre: "La Fuerza",       palo: "",  emoji: "🦁", img: "/cartas/la-fuerza.png", palabras: ["Coraje", "Compasión", "Dominio interior"],
    derecho: "Tu mejor armadura es tu calma. Hoy aprendes a domar tus miedos con amor en vez de con golpes. Cuando tu león interior te obedece, nada de afuera puede contra ti.",
    invertida: "Te lo digo con dulzura y firmeza: deja de tratarte mal. Esa voz que te dice 'no puedes' no es la verdad. Eres más valiente y más grande de lo que te has permitido creer." },
  { n: 9,  nombre: "El Ermitaño",     palo: "",  emoji: "🕯️", img: "/cartas/el-ermitano.png", palabras: ["Introspección", "Guía interior", "Sabiduría"],
    derecho: "Un tiempo de silencio te hace bien. Baja el ruido, apaga el mundo un rato y escucha adentro. Ahí está la luz que buscas afuera. Descansa, reflexiona y vuelve con claridad.",
    invertida: "Te lo digo sin vueltas: te estás aislando por miedo, no por paz. No estás solo, pero te haces el solo. Abre la puerta, deja entrar el cariño que te espera. Compartir también sana." },
  { n: 10, nombre: "La Rueda de la Fortuna", palo: "", emoji: "🎡", img: "/cartas/la-rueda-de-la-fortuna.png", palabras: ["Cambio", "Ciclos", "Destino"],
    derecho: "El destino gira a tu favor: lo que esperabas se acerca y lo bueno viene con fuerza. No te aferres a lo viejo: suelta y deja que la rueda te lleve hacia lo nuevo.",
    invertida: "Te lo digo de frente: te aferras a lo que ya se fue y frenas lo que llega. La rueda gira para todos, contigo o sin ti. Mejor girar con ella y no contra el suelo." },
  { n: 11, nombre: "La Justicia",     palo: "",  emoji: "⚖️", img: "/cartas/la-justicia.png", palabras: ["Equilibrio", "Verdad", "Karma"],
    derecho: "Lo que siembras, cosechas: hoy vuelve a ti la verdad y el equilibrio. Todo llega a su justa medida. Sé honesto contigo y con los demás, y la paz te encontrará.",
    invertida: "Te lo digo claro: estás evadiendo una responsabilidad y eso te descentra. La verdad no se esconde para siempre: te va a encontrar. Sé honesto, asume y recupera tu paz." },
  { n: 12, nombre: "El Colgado",      palo: "",  emoji: "🪢", img: "/cartas/el-colgado.png", palabras: ["Pausa", "Entrega", "Nueva perspectiva"],
    derecho: "Detente y mira tu vida del revés. Esta pausa no es pérdida: es preparación. Del silencio viene una revelación que te cambiará el rumbo. Confía en la espera.",
    invertida: "Te lo digo sin miedo: te quedas quieto por miedo, no por sabiduría. Te sacrificas más de la cuenta y eso te vacía. Suelta el peso, muévete y vuelve a caminar. La espera ya cumplió." },
  { n: 13, nombre: "La Muerte",       palo: "",  emoji: "🦋", img: "/cartas/la-muerte.png", palabras: ["Transformación", "Finales", "Renacimiento"],
    derecho: "Un ciclo termina para que algo grande nazca. Duele decir adiós, lo sé. Pero lo que se va te deja espacio para ser nueva. Suelta, transforma y renace con alas.",
    invertida: "Te lo digo de frente: no sueltas lo que ya murió y eso ocupa el lugar de lo nuevo. Mientras más abrazas el pasado, más le cuesta a tu vida florecer. Deja morir para poder renacer." },
  { n: 14, nombre: "La Templanza",    palo: "",  emoji: "🏺", img: "/cartas/la-templanza.png", palabras: ["Armonía", "Paciencia", "Equilibrio"],
    derecho: "Todo vuelve a su justa medida: tu cuerpo, tu mente y tu amor se equilibran. Respira despacio y confía en la calma. La sanación llegará sola, como el agua al valle.",
    invertida: "Te lo digo sin vueltas: los excesos te están desbordando. Mucho de lo que te daña, poco de lo que te nutre. Vuelve al punto medio y ahí encontrarás tu paz y tu ritmo." },
  { n: 15, nombre: "El Diablo",       palo: "",  emoji: "🌀", img: "/cartas/el-diablo.png", palabras: ["Atadura", "Tentación", "Sombra"],
    derecho: "Algo te tiene atado, y hoy lo ves: un miedo, una culpa, una costumbre o una persona que te encadena. Míralo de frente, porque mirarlo ya es desatarlo. La llave está en tu mano.",
    invertida: "Te lo digo con fuerza: ya rompiste esa cadena, ¿y ahora vuelves a meterte en ella? No retrocedas. Lo que te dolió una vez no merece una segunda vuelta. Eres libre, no lo olvides." },
  { n: 16, nombre: "La Torre",        palo: "",  emoji: "⚡", img: "/cartas/la-torre.png", palabras: ["Ruptura", "Revelación", "Cambio súbito"],
    derecho: "Una verdad sacude tus cimientos y duele, lo acompañamos. Pero lo que cae hoy deja entrar la luz. Este golpe es una liberación: reconstruye sobre tierra más firme.",
    invertida: "Te lo digo de frente: sabes que algo se está cayendo y lo sostienes por miedo. Déjalo caer. Nada sólido se construye sobre mentiras. Abdala el golpe, recoge tus pedazos y vuelve a levantarte." },
  { n: 17, nombre: "La Estrella",     palo: "",  emoji: "✨", img: "/cartas/la-estrella.png", palabras: ["Esperanza", "Inspiración", "Sanación"],
    derecho: "Después de la tormenta llega la calma. Tus heridas sanan y tu fe regresa con fuerza. Mira al cielo: tu estrella brilla solo para ti. Espera, cree y deja que la luz te bañe.",
    invertida: "Te lo digo con dulzura y firmeza: tienes la luz y no la miras. No dejes que un día gris te opaque los sueños. Tu estrella sigue arriba, encendida. Búscala y vuelve a creer." },
  { n: 18, nombre: "La Luna",         palo: "",  emoji: "🌙", img: "/cartas/la-luna.png", palabras: ["Ilusión", "Sueños", "Intuición"],
    derecho: "No todo es lo que parece, y lo sabes en el alma. Tus emociones van y vienen como la marea. Camina con calma: la verdad saldrá a la luz cuando estés lista.",
    invertida: "Te lo digo sin rodeos: vives asustada de sombras que tú misma haces grandes. Baja el miedo, sube la razón y descansa. La noche da miedo en la imaginación: la realidad es más tranquila." },
  { n: 19, nombre: "El Sol",          palo: "",  emoji: "☀️", img: "/cartas/el-sol.png", palabras: ["Alegría", "Éxito", "Vitalidad"],
    derecho: "El sol sale para ti: alegría, éxito y vitalidad te acompañan. Celebra lo que has construido y ríe fuerte, porque te lo mereces. Este es tu momento: vívelo a lo grande.",
    invertida: "Te lo digo de frente: tienes el sol y andas viendo nubes. Tu luz sigue ahí dentro, brillando. No la escondas por miedo ni por culpa: brilla, aunque otros quieran apagarte." },
  { n: 20, nombre: "El Juicio",       palo: "",  emoji: "🎺", img: "/cartas/el-juicio.png", palabras: ["Despertar", "Renacimiento", "Llamado"],
    derecho: "Escuchas el llamado interior: ha llegado tu hora de levantarte, perdonar y renacer. El pasado te suelta y tú también suéltalo. Tu nueva vida ya está llamando a tu puerta.",
    invertida: "Te lo digo claro: dudas de tu valor y te quedas atrás. Deja de juzgarte con la voz de otros. Tú vales mucho y te lo repito hasta que lo creas: es tiempo de levantarte y creértelo." },
  { n: 21, nombre: "El Mundo",        palo: "",  emoji: "🌍", img: "/cartas/el-mundo.png", palabras: ["Culminación", "Logro", "Totalidad"],
    derecho: "Llegaste. Siembra de tus logros hoy mismo: cerraste un ciclo con éxito y eso merece festejo. Mira todo lo que construiste, agradece y prepara tu nuevo comienzo. El mundo es tuyo.",
    invertida: "Te lo digo sin vueltas: tan cerca de la meta y te detienes. Casi lo tienes, solo falta el último paso. No abandones ahora: el final completo es tuyo si sigues firme." }
],

/* ------------------------- ARCANOS MENORES ------------------------- */
/* Suits: bastos(fuego), copas(agua), espadas(aire), oros(tierra) */
menores: function () {
  const palos = {
    bastos: {
      emoji: "🔥", palo: "Bastos", tema: "pasión, acción y energía creativa",
      cartas: [
        [["Chispa", "Inspiración", "Comienzo"], "Nace una idea brillante dentro de ti: ese impulso de fuego está listo para encender algo extraordinario.",
         "Una chispa se aplaza o se apaga por dudas: recupera tu entusiasmo antes de que el calor se congele."],
        [["Plan", "Decisión", "Futuro"], "Defines la dirección de tu energía: las decisiones que tomas hoy preparan el terreno de tu mañana.",
         "Planes inseguros o miedo a decidir: ordena tus ideas y elige el camino que tu corazón respalda."],
        [["Expansión", "Visión", "Crecimiento"], "Tu horizonte crece: lo que iniciaste comienza a dar señales de futuro prometedor. Confía en el proceso.",
         "Exceso de planes o mirada corta: ocúpate del hoy y el mañana se acomodará solo."],
        [["Celebración", "Fundamentos", "Hogar"], "Tiempo de celebrar: los cimientos que pusiste se afianzan y la alegría se comparte en comunidad.",
         "Estabilidad incompleta o melancolía: agradece lo construido y termina lo pendiente."],
        [["Competencia", "Energía", "Reto"], "Se enciende una pequeña batalla de egos: defiende tu posición con calor, pero sin quemar puentes.",
         "Conflictos que se elevan sin necesidad: elige la paz y gana terreno con calma."],
        [["Reconocimiento", "Victoria", "Visibilidad"], "Tu esfuerzo empieza a ser visto: la victoria sonríe y el reconocimiento llega a tu puerta.",
         "Reconocimiento tímido o ego en duda: confía en tu valor y deja que tu luz se muestre."],
        [["Valentía", "Defensa", "Posición"], "Mantienes tu terreno: aunque el mundo presione, tu coraje te mantiene firme en lo que crees.",
         "Te sientes desbordado o a la defensiva: elige tus batallas y protege tu energía."],
        [["Movimiento", "Impulso", "Aceleración"], "Tu energía avanza veloz como el viento del fuego: actúa con decisión y el camino se abrirá.",
         "Progreso disperso o demasiada prisa: baja un cambio y concentra tu fuerza."],
        [["Persistencia", "Resistencia", "Límite"], "Llegas a tu frontera: esta última milla exige tu perseverancia. No bajes las riendas todavía.",
         "Agotamiento o rendición temprana: descansa un instante, pero retoma con fe renovada."],
        [["Culminación", "Carga", "Esfuerzo"], "Tu esfuerzo da fruto: el peso de lo logrado se siente, pero también la satisfacción de haber llegado.",
         "Carga que agobia o tarea que pesa más de la cuenta: comparte el peso y deja espacio para ti."],
        [["Novedad", "Noticias", "Entusiasmo"], "Un mensaje o una idea refrescante llega a tu vida: recíbelo con la alegría de quien empieza algo nuevo.",
         "Noticia confusa o entusiasmo prematuro: espera la confirmación antes de lanzarte."],
        [["Aventura", "Acción rápida", "Pasión"], "Llega una ola de aventura: tu ardor te impulsa a moverte con rapidez hacia aquello que te apasiona.",
         "Impulsos que corren más que la prudencia: modera el paso y mira el camino antes de galopar."],
        [["Carisma", "Confianza", "Calidez"], "Brillas con confianza y calidez: tu energía inspira y las puertas se abren ante tu paso.",
         "Inseguridad que apaga tu fuego: recuérdate de todo lo que ya has logrado arder."],
        [["Liderazgo", "Visión", "Poder creativo"], "Tomas el timón: tu visión y tu fuego convierten ideas en realidades que otros admiran.",
         "Liderazgo rígido o creatividad estancada: flexibiliza tu poder y vuelve a inspirarte."]
      ]
    },
    copas: {
      emoji: "💧", palo: "Copas", tema: "emociones, amor e intuición",
      cartas: [
        [["Amor nuevo", "Apertura", "Emoción"], "El corazón se abre: un sentimiento nuevo o una reconciliación llega para llenar tu copa de ternura.",
         "Emociones reprimidas o bloqueo afectivo: date permiso para sentir sin miedo."],
        [["Unión", "Alianza", "Deseo mutuo"], "Los corazones se entienden: una conexión se fortalece y el cariño que brindas regresa multiplicado.",
         "Expectativas no dichas o distancia emocional: habla con honestidad lo que tu corazón calla."],
        [["Amistad", "Celebración", "Alegría compartida"], "Brindas con quienes amas: la alegría se multiplica cuando se comparte y la amistad florece.",
         "Fiestas incompletas o compañías a medias: elige tu círculo y celebra con quien celebra contigo."],
        [["Apatía", "Revisión", "Aburrimiento"], "Todo se siente repetido: cierra esa puerta emocionalmente vacía y vuelve la mirada a lo que sí te llena.",
         "Descontento que se ignora: date el permiso de querer más y de retirarte de lo que no te nutre."],
        [["Pérdida", "Tristeza", "Sanación"], "Algo duele: reconoce tu tristeza sin quedarte en ella, porque el agua siempre encuentra otra corriente.",
         "Duelo que se prolonga: abraza la memoria, pero deja espacio a las nuevas riberas."],
        [["Nostalgia", "Recuerdos", "Inocencia"], "El pasado toca tu corazón: revisita con ternura tus recuerdos, pero que no te impidan vivir el presente.",
         "Atadura al ayer: la melancolía es visita, no hogar. Vuelve al hoy."],
        [["Ilusiones", "Opciones", "Fantasía"], "Muchas posibilidades cruzan ante ti: sueña en grande, pero manten los pies en la tierra al elegir.",
         "Decisiones confusas o espejismos emocionales: separa la fantasía de lo que realmente puedes construir."],
        [["Dejar atrás", "Camino propio", "Esperanza"], "Caminas más allá de lo conocido: dejar atrás lo que no te corresponde también es un acto de amor propio.",
         "Alejarte por miedo o falta de compromiso: revisa si es huida o madurez antes de partir."],
        [["Deseo cumplido", "Satisfacción", "Abundancia de amor"], "Tu copa rebosa: un deseo del corazón se cumple y disfrutas la dulzura del esfuerzo emocional.",
         "Indulgencia o exceso de ganas: cuida que la abundancia no se convierta en exceso."],
        [["Felicidad", "Armonía", "Familia"], "La paz del amor verdadero te envuelve: disfruta el arcoíris afectivo, porque este es un momento de plenitud.",
         "Armonía incompleta o felicidad con fisuras: atiende los detalles y el círculo se cerrará."],
        [["Mensaje", "Sorpresa", "Inspiración emotiva"], "Un mensaje emocional toca tu puerta: abre tu corazón a la sorpresa que viene de donde menos esperas.",
         "Mensaje tibio o malentendido: aclara y evita imaginar lo que aún no se dice."],
        [["Propuesta", "Idealismo", "Rendición amorosa"], "Un gesto romántico se acerca: permítete ser conquistado por aquello que tu alma realmente desea.",
         "Idealización que desenfoca: ama lo real, no solo tu imagen de lo que debería ser."],
        [["Compasión", "Empatía", "Intuición alta"], "Tu sensibilidad se convierte en don: escuchas, contienes y sanas porque amas con el alma.",
         "Sentir demasiado hasta agotarte: cuida de ti para poder cuidar de otros."],
        [["Madurez", "Calma", "Generosidad"], "Tu corazón gobierna con serenidad: la madurez emocional te permite amar sin exigir y dar sin vaciar.",
         "Emociones contenidas o frialdad: permite que tu ternura respire y vuelva a fluir."]
      ]
    },
    espadas: {
      emoji: "🌬️", palo: "Espadas", tema: "mente, verdad y decisiones",
      cartas: [
        [["Claridad", "Idea nueva", "Verdad"], "Una idea corta la niebla: la claridad llega a tu mente y la verdad te libera para decidir.",
         "Pensamientos nublados o mensajes confusos: espera el momento de claridad antes de actuar."],
        [["Decisión", "Equilibrio", "Elección"], "Te detienes a sopesar: dos caminos se presentan y la honestidad contigo mismo sostiene la balanza.",
         "Indecisión paralizante: baja el ruido mental y escucha lo que tu corazón ya sabe."],
        [["Dolor", "Revelación", "Desamor"], "Una verdad duele y limpia: aunque escuece, este corte deja ver lo que necesitabas soltar.",
         "Dolor que se reabre: acepta la herida como parte del proceso y permite que cicatrice."],
        [["Descanso", "Recuperación", "Tregua"], "La mente pide pausa: retírate del campo de batalla y deja que el silencio restaure tu paz.",
         "Descanso que no llega o ansiedad en reposo: aprende a soltar el control para sanar."],
        [["Conflicto", "Victoria amarga", "Resignación"], "Ganas la disputa, pero dejas algo en el camino: elige tus batallas y recuerda que la paz vale más.",
         "Peleas que persisten o resentimiento: retírate con dignidad y cierra ese ciclo."],
        [["Transición", "Calma", "Superación"], "Atraviesas hacia aguas serenas: dejas atrás la tormenta y te diriges a un lugar más tranquilo.",
         "Superación lenta o miedo a lo nuevo: avanza un paso, que la calma se gana caminando."],
        [["Estrategia", "Cautela", "Reserva"], "Conviene actuar con astucia: no todo está a la vista, así que observa y guarda tus cartas.",
         "Fingimiento o evasión: la confianza se recupera con transparencia, no con máscaras."],
        [["Límite", "Miedos propios", "Restricción"], "Te sientes atrapado por pensamientos que tú mismo hiciste: la venda es de tu mente, puedes ver de nuevo.",
         "Salida de la trampa mental: a medida que sueltas el miedo, el mundo se vuelve a abrir."],
        [["Angustia", "Preocupación", "Insomnio"], "La noche alarga tus dudas: atención a lo que más te inquieta, porque suele exagerarse en la oscuridad.",
         "Preocupación que comienza a ceder: amanece la calma y tus miedos pierden volumen."],
        [["Fin de ciclo", "Liberación", "Punto final"], "Una etapa difícil llega a su fin: lo que termina te devuelve el aire y el cielo vuelve a verse limpio.",
         "Cierre pendiente: dejar ir también es un acto de valentía que tu corazón agradece."],
        [["Curiosidad", "Ideas", "Alerta"], "Tu mente curiosa explora: nuevas ideas y preguntas abren caminos que aún no habías imaginado.",
         "Distracción o noticias sin fondo: filtra la información y quédate con lo esencial."],
        [["Impulso mental", "Análisis rápido", "Decisión veloz"], "Tu mente vuela como el viento: suelta ataduras y corre hacia la meta con la claridad de un plan.",
         "Decisiones atropelladas: equilibra la rapidez con un respiro antes de asestar el próximo movimiento."],
        [["Claridad interior", "Objetividad", "Verdad serena"], "Ves las cosas con precisión y sin dramatismo: tu lucidez te permite juzgar con justicia y corazón.",
         "Juicios duros o mente polarizada: suaviza tu mirada, porque la verdad también tiene matices."],
        [["Autoridad mental", "Discernimiento", "Liderazgo firme"], "Tu palabra ordena y dirige: el discernimiento te convierte en referencia, pero úsalo con sabiduría.",
         "Rigidez o autoridad temida: recuerda que la firmeza sin calidez deja mentes cerradas."]
      ]
    },
    oros: {
      emoji: "🌿", palo: "Oros", tema: "cuerpo, dinero y trabajo",
      cartas: [
        [["Oportunidad", "Prosperidad", "Semilla"], "Una semilla de prosperidad cae en tus manos: siembra con cuidado, porque hoy se abre una oportunidad real.",
         "Oportunidad desperdiciada o miedo a invertir: tu valor crece cuando te atreves a cultivarlo."],
        [["Equilibrio", "Recursos", "Práctica"], "Aprendes a equilibrar tu barca entre ingresos y gastos: los recursos fluyen cuando administras con calma.",
         "Desajuste material o mala organización: revisa tus prioridades y el flujo volverá."],
        [["Trabajo en equipo", "Habilidad", "Crecimiento"], "Tu esfuerzo se multiplica con otros: el trabajo bien hecho construye y fortalece tu reputación.",
         "Colaboración estancada o esfuerzo sin dirección: define tareas claras y el equipo rendirá."],
        [["Estabilidad", "Seguridad", "Retener"], "Consolidas tus cimientos: la seguridad que has construido te permite sentirte en tierra firme.",
         "Avidez o rigidez para soltar: la seguridad también crece compartiendo y abriendo puertas."],
        [["Carencia", "Austeridad", "Reflexión"], "Una pausa en lo material te invita a reflexionar: no es el fin, es el recordatorio de ajustar el rumbo.",
         "Sentimiento de escasez que se disipa: lo que te faltaba empieza a llegar cuando agradeces lo que tienes."],
        [["Generosidad", "Flujo", "Ayuda mutua"], "Dar y recibir se equilibran: la generosidad que practicas regresa en forma de apoyo y bendiciones.",
         "Estar dando demasiado o recibir poco: revisa los acuerdos y protege tu propia abundancia."],
        [["Paciencia", "Espera", "Evaluación"], "Tu semilla aún no germina: confía en los tiempos de la tierra, porque lo importante ya está ocurriendo bajo la superficie.",
         "Impaciencia o rendición temprana: no abandones tu jardín justo antes de la cosecha."],
        [["Esfuerzo", "Maestría", "Dedicación"], "El trabajo minucioso te perfecciona: cada detalle pulido te acerca a la maestría de tu oficio.",
         "Esfuerzo desperdigado o perfeccionismo: concentra tu energía en lo esencial y suelta el resto."],
        [["Abundancia", "Seguridad", "Disfrute"], "Cosechas lo sembrado: la abundancia llega para quedarse y puedes disfrutarla sin culpa.",
         "Abundancia frágil o disfrute pendiente: permite que la gratitud convierta lo logrado en plenitud."],
        [["Prosperidad", "Legado", "Riqueza duradera"], "La estabilidad que construiste trasciende: tu prosperidad sostiene a los tuyos y perdura en el tiempo.",
         "Riqueza que se estanca o responsabilidad pesada: reinvierte en lo que verdaderamente te hace crecer."],
        [["Estudio", "Oportunidad práctica", "Aprendizaje"], "Una oportunidad de aprender llega: abre tu mente y tu esfuerzo se convertirá en talento.",
         "Estudio interrumpido o distracción material: retoma el aprendizaje y tu futuro te lo agradecerá."],
        [["Constancia", "Trabajo responsable", "Compromiso"], "Avanza con paso firme y seguro: tu responsabilidad construye un futuro sólido ladrillo a ladrillo.",
         "Rigidez o esfuerzo sin alegría: disfruta el camino mientras labras tu destino."],
        [["Comodidad", "Protección", "Practicidad"], "Creas un nido cálido y seguro: tu atención a lo práctico produce bienestar y protección para quienes amas.",
         "Exceso de comodidad o apego a lo material: equilibra lo terrenal con tu vida interior."],
        [["Éxito material", "Liderazgo sólido", "Abundancia"], "Tu gestión da frutos y tu palabra vale oro: el éxito que conquistas hoy es el legado que dejas mañana.",
         "Éxito que aísla o enfoque solo en dinero: recuerda alimentar también tu alma y tus vínculos."]
      ]
    }
  };

  const nombres = ["As", "Dos", "Tres", "Cuatro", "Cinco", "Seis", "Siete", "Ocho", "Nueve", "Diez",
                   "Sota", "Caballero", "Reina", "Rey"];

  const mazo = [];
  for (const [clave, info] of Object.entries(palos)) {
    info.cartas.forEach((c, i) => {
      mazo.push({
        n: i + 1,
        arcana: "menor",
        palo: info.palo,
        paloClave: clave,
        emoji: info.emoji,
        nombre: nombres[i] + " de " + info.palo,
        etiqueta: nombres[i] + " de " + info.palo,
        palabras: c[0],
        derecho: c[1],
        invertida: c[2],
        tema: info.tema
      });
    });
  }
  return mazo;
},

/* ------------------------- funciones de acceso ------------------------- */
soloMayores: function () {
  return this.mayores.map(c => ({ n: c.n, nombre: c.nombre, palo: c.palo, emoji: c.emoji, img: c.img,
    palabras: c.palabras, derecho: c.derecho, invertida: c.invertida, arcana: "mayor" }));
},

mazoCompleto: function () {
  return this.soloMayores().concat(this.menores());
},

encontrar: function (id) {
  if (id.startsWith("M")) {
    return this.mayores.find(c => c.n === Number(id.slice(1)));
  }
  const partes = id.split("-");
  const palo = partes[0];
  const idx = Number(partes[1]);
  return this.menores().find(c => c.paloClave === palo && c.n === idx);
},

mazoManifiesto: function () {
  return { mayores: this.mayores.map(c => ({ id: "M" + c.n, n: c.n, nombre: c.nombre, palo: c.palo, arcana: "mayor", emoji: c.emoji, img: c.img })), menores: this.menores().map(c => ({ id: [c.paloClave, c.n].join("-"), n: c.n, nombre: c.nombre, palo: c.palo, paloClave: c.paloClave, arcana: "menor", emoji: c.emoji })) };
}
};