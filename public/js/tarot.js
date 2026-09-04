/* ============================================================
   ORÁCULO · Mazo completo de 78 cartas (Español)
   ============================================================ */

const ORACULO = {

/* ------------------------- ARCANOS MAYORES ------------------------- */
mayores: [
  { n: 0,  nombre: "El Loco",        palo: "",  emoji: "🪽", palabras: ["Libertad", "Nuevo comienzo", "Aventura"],
    derecho: "Un camino nuevo se abre ante ti: abraza lo inesperado y lánzate con fe, aunque el destino aún no tenga mapa.",
    invertida: "Cuidado con la imprudencia: busca el equilibrio entre la euforia y la responsabilidad para no dar pasos en falso." },
  { n: 1,  nombre: "El Mago",        palo: "",  emoji: "🔮", palabras: ["Poder", "Manifestación", "Talento"],
    derecho: "Todo está en tus manos: tu creatividad y tu palabra tienen el poder de materializar lo que deseas. Actúa con confianza.",
    invertida: "Talento sin dirección o manipulación: reconecta con tu propósito para que tus dones no se desperdicien." },
  { n: 2,  nombre: "La Sacerdotisa",  palo: "",  emoji: "🌙", palabras: ["Intuición", "Misterio", "Sabiduría interna"],
    derecho: "Escucha tu voz interior: la respuesta que buscas ya vive en tu silencio y en tus sueños. Confía en lo no dicho.",
    invertida: "Si cierras tu intuición o guardas secretos que pesan, vuelve a tu centro y permítete escuchar a tu corazón." },
  { n: 3,  nombre: "La Emperatriz",   palo: "",  emoji: "🌸", palabras: ["Abundancia", "Fertilidad", "Cuidado"],
    derecho: "Un tiempo de florecimiento: cultiva lo que amas, nutre tus proyectos y déjate abrazar por la abundancia.",
    invertida: "Descuido con tu creatividad o con tu cuerpo: vuelve a sembrar y atiende aquello que necesitas." },
  { n: 4,  nombre: "El Emperador",    palo: "",  emoji: "👑", palabras: ["Estructura", "Autoridad", "Estabilidad"],
    derecho: "Ordena tu mundo: con firmeza y claridad consolida tu poder y construyes bases sólidas para el futuro.",
    invertida: "Control excesivo o rigidez: la verdadera autoridad comienza por gobernarte a ti mismo con flexibilidad." },
  { n: 5,  nombre: "El Hierofante",   palo: "",  emoji: "📜", palabras: ["Tradición", "Enseñanza", "Guía espiritual"],
    derecho: "Un maestro llega a tu camino, o tú te vuelves guía: busca sentido en la sabiduría que se comparte y transmite.",
    invertida: "Cuestiona los dogmas que ya no te sirven: honra la tradición sin renunciar a tu propia voz." },
  { n: 6,  nombre: "Los Enamorados",  palo: "",  emoji: "💞", palabras: ["Amor", "Unión", "Elección"],
    derecho: "El corazón y la mente se encuentran: decide con amor y coherencia, porque esta elección marca tu destino.",
    invertida: "Desarmonía o duda: confía en tu verdad y no elijas por miedo a quedarte a solas." },
  { n: 7,  nombre: "El Carro",        palo: "",  emoji: "🐎", palabras: ["Victoria", "Voluntad", "Avance"],
    derecho: "Mueves tu vida con determinación: superas obstáculos y alcanzas la victoria si mantienes las riendas firmes.",
    invertida: "Falta de dirección o dispersión: retoma el control y deja que tu voluntad guíe el camino." },
  { n: 8,  nombre: "La Fuerza",       palo: "",  emoji: "🦁", palabras: ["Coraje", "Compasión", "Dominio interior"],
    derecho: "Tu fuerza más valiosa es tu dulzura: doma con amor tus miedos y nada logrará vencerte.",
    invertida: "Dudas y autocrítica: reconoce tu valentía para volver a brillar." },
  { n: 9,  nombre: "El Ermitaño",     palo: "",  emoji: "🕯️", palabras: ["Introspección", "Guía interior", "Sabiduría"],
    derecho: "Un tiempo de silencio te espera: al retirarte a tu interior encontrarás la luz que ilumina tu camino.",
    invertida: "Soledad por miedo o aislamiento: abre la puerta y deja entrar la compañía que te nutre." },
  { n: 10, nombre: "La Rueda de la Fortuna", palo: "", emoji: "🎡", palabras: ["Cambio", "Ciclos", "Destino"],
    derecho: "El destino gira a tu favor: los ciclos cambian y lo que esperabas se aproxima. Fluye con la rueda.",
    invertida: "Resistirte al cambio: cuando la rueda gira, mejor girar con ella para no sentir vértigo." },
  { n: 11, nombre: "La Justicia",     palo: "",  emoji: "⚖️", palabras: ["Equilibrio", "Verdad", "Karma"],
    derecho: "Alcanzas el equilibrio: la verdad se hace visible y cada acción recibe su recompensa justa.",
    invertida: "Situación desequilibrada o evasión de responsabilidades: la honestidad contigo mismo restaura la paz." },
  { n: 12, nombre: "El Colgado",      palo: "",  emoji: "🪢", palabras: ["Pausa", "Entrega", "Nueva perspectiva"],
    derecho: "Detente y mira la vida desde otra mirada: este tiempo de espera guarda una revelación para ti.",
    invertida: "Inercia o sacrificio innecesario: suelta lo que te pesa y vuelve a moverte." },
  { n: 13, nombre: "La Muerte",       palo: "",  emoji: "🦋", palabras: ["Transformación", "Finales", "Renacimiento"],
    derecho: "Un ciclo termina para que renazcas: aunque cueste despedirse, la transformación que viene te hará más libre.",
    invertida: "Resistencia a soltar el pasado: lo que no muere a tiempo ocupa el lugar de lo nuevo." },
  { n: 14, nombre: "La Templanza",    palo: "",  emoji: "🏺", palabras: ["Armonía", "Paciencia", "Equilibrio"],
    derecho: "Todo vuelve a su justa medida: combina tus polos y deja que la paciencia destile paz y salud.",
    invertida: "Excesos o desarmonía: recupera el ritmo y modera aquello que te desborda." },
  { n: 15, nombre: "El Diablo",       palo: "",  emoji: "🌀", palabras: ["Atadura", "Tentación", "Sombra"],
    derecho: "Algo te mantiene atado: reconoce tu poder para soltar el miedo, la culpa o la dependencia que te encadena.",
    invertida: "Ruptura de cadenas: recuperas tu libertad cuando reconoces que la llave siempre estuvo en ti." },
  { n: 16, nombre: "La Torre",        palo: "",  emoji: "⚡", palabras: ["Ruptura", "Revelación", "Cambio súbito"],
    derecho: "Una verdad sacude tus cimientos: aunque duela, lo que cae deja pasar la luz y termina liberándote.",
    invertida: "Cambios que se resisten o miedo a la caída: construye una base más honesta y firme." },
  { n: 17, nombre: "La Estrella",     palo: "",  emoji: "✨", palabras: ["Esperanza", "Inspiración", "Sanación"],
    derecho: "La esperanza ilumina tu noche: después de la tormenta, tus heridas sanan y tu fe regresa con fuerza.",
    invertida: "Desaliento pasajero: vuelve a conectar con tus sueños y la luz regresará a ti." },
  { n: 18, nombre: "La Luna",         palo: "",  emoji: "🌙", palabras: ["Ilusión", "Sueños", "Intuición"],
    derecho: "No todo es lo que parece: navega tus emociones y sueños con calma, pues la verdad se revela con claridad.",
    invertida: "La confusión se disipa y aflora lo que estaba oculto: confía en tu instinto." },
  { n: 19, nombre: "El Sol",          palo: "",  emoji: "☀️", palabras: ["Alegría", "Éxito", "Vitalidad"],
    derecho: "El sol sale para ti: plenitud, energía y claridad te acompañan. Celebra todo lo que has construido.",
    invertida: "Alegría aún nublada: tu luz sigue ahí dentro, solo deja que atraviese las nubes." },
  { n: 20, nombre: "El Juicio",       palo: "",  emoji: "🎺", palabras: ["Despertar", "Renacimiento", "Llamado"],
    derecho: "Escuchas tu llamado interior: te levantas, te reconcilias y das un paso de renacimiento hacia tu destino.",
    invertida: "Dudas sobre tu valor: perdónate y vuelve a escuchar lo que tu corazón te pide." },
  { n: 21, nombre: "El Mundo",        palo: "",  emoji: "🌍", palabras: ["Culminación", "Logro", "Totalidad"],
    derecho: "Un ciclo se completa con éxito: has llegado. Celebra tu plenitud y prepara el siguiente comienzo.",
    invertida: "Sensación de quedarse a mitad de camino: casi lo tienes, no te detengas ahora." }
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
mazoCompleto: function () {
  const mayores = this.mayores.map(c => ({ n: c.n, nombre: c.nombre, palo: c.palo, emoji: c.emoji,
    palabras: c.palabras, derecho: c.derecho, invertida: c.invertida, arcana: "mayor" }));
  return mayores.concat(this.menores());
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
  return { mayores: this.mayores.map(c => ({ id: "M" + c.n, n: c.n, nombre: c.nombre, palo: c.palo, arcana: "mayor", emoji: c.emoji })), menores: this.menores().map(c => ({ id: [c.paloClave, c.n].join("-"), n: c.n, nombre: c.nombre, palo: c.palo, paloClave: c.paloClave, arcana: "menor", emoji: c.emoji })) };
}
};