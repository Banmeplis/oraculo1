const bcrypt = require("bcryptjs");
const db = require("./database.js");

const autor = {
  nombre: "Luna Arcania",
  email: "luna.arcania@oraculo.local",
  password: "Luna2026!"
};

const articulos = [
  ["La calma que llega después de la tormenta", "Una reflexión para volver al centro cuando todo parece moverse.", "Hay momentos en los que avanzar significa respirar y dejar que la tormenta termine su recorrido. La calma no siempre llega como una respuesta; a veces aparece como la certeza de que ya no necesitas luchar contra todo.\n\nHoy regresa a tu cuerpo, escucha tu intuición y elige un paso pequeño que te acerque a la paz."],
  ["Ritual de luna nueva para sembrar intenciones", "Un ritual sencillo para comenzar un ciclo con claridad y propósito.", "La luna nueva invita a hacer espacio. Escribe tres intenciones concretas y léelas en voz baja mientras enciendes una vela blanca.\n\nNo necesitas controlar el resultado: basta con cuidar la semilla, sostener el deseo y actuar con coherencia durante los próximos días."],
  ["El mensaje del Arcángel Miguel", "Protección, límites sanos y valentía para elegirte.", "Miguel nos recuerda que proteger nuestra energía también es una forma de amor. Su espada simboliza la capacidad de cortar hábitos, conversaciones y vínculos que nos alejan de nuestra verdad.\n\nPon un límite claro hoy y observa cómo vuelve tu fuerza."],
  ["Cuando el tarot habla de comienzos", "Cómo reconocer la energía de una nueva etapa en una lectura.", "El Loco, el As de Bastos y el Mundo pueden señalar puertas que se abren, pero ninguna carta camina por nosotros. El tarot muestra una posibilidad; tu presencia convierte esa posibilidad en camino.\n\nPregunta qué acción sencilla puede honrar este comienzo."],
  ["La sabiduría de esperar", "No todo silencio es una señal para abandonar.", "Esperar no significa quedarse inmóvil. Hay una espera fértil que permite reunir información, cuidar la energía y escuchar lo que nace debajo del ruido.\n\nSi hoy no tienes claridad, date permiso para observar un poco más antes de decidir."],
  ["Un altar pequeño para tu práctica espiritual", "Ideas simples para crear un rincón de intención en casa.", "Un altar no necesita ser grande ni perfecto. Elige una superficie limpia, una vela, un símbolo que te inspire y un cuaderno. Ese espacio será una pausa visible dentro del día.\n\nVisítalo con respeto, aunque solo sea para agradecer una cosa."],
  ["Arcángel Rafael y el arte de sanar despacio", "Una invitación a tratarte con más ternura.", "La sanación rara vez ocurre de golpe. Rafael representa la paciencia de atender una herida sin exigirle que desaparezca inmediatamente.\n\nDescansa, pide ayuda cuando la necesites y celebra cada señal de bienestar, incluso las más pequeñas."],
  ["Tres preguntas para una tirada de amor", "Preguntas más útiles que buscar una respuesta cerrada.", "En lugar de preguntar únicamente si alguien volverá, prueba con: ¿qué necesito comprender de este vínculo?, ¿qué patrón estoy repitiendo? y ¿qué puedo hacer para amar sin perderme?\n\nUna buena pregunta abre espacio para elegir."],
  ["El poder espiritual de escribir", "Cómo convertir una emoción confusa en una conversación interior.", "Escribe durante cinco minutos sin corregir ni juzgar. Deja que la emoción tenga una voz completa. Después subraya una frase que contenga una necesidad real.\n\nA veces la claridad no aparece al pensar más, sino al escucharte por escrito."],
  ["Equinoccio: volver al equilibrio", "Un ejercicio de balance para revisar lo que das y recibes.", "Haz dos listas: una con lo que está creciendo y otra con lo que pide descanso. El equilibrio no es repartirlo todo por igual, sino reconocer qué necesita tu atención ahora.\n\nElige una acción para nutrir cada lado."],
  ["Cómo limpiar energéticamente una habitación", "Un método práctico con ventilación, sonido e intención.", "Abre una ventana, ordena un rincón y recorre el espacio con una campana, palmas o música suave. Mientras lo haces, formula una frase breve: aquí solo conservo lo que me da paz.\n\nLa intención se vuelve poderosa cuando también cambia algo concreto."],
  ["El Arcángel Gabriel y la voz interior", "Señales para comunicarte desde un lugar más honesto.", "Gabriel acompaña los mensajes que necesitan ser dichos con claridad y cuidado. Antes de hablar, pregunta si tus palabras buscan construir, liberar o simplemente descargar.\n\nLa verdad puede ser firme sin dejar de ser compasiva."],
  ["Qué hacer cuando una lectura te inquieta", "El tarot no es una sentencia: es una invitación a mirar.", "Si una carta te asusta, vuelve a la imagen y pregunta qué recurso ofrece. Ningún símbolo elimina tu capacidad de decidir. Respira, toma distancia y busca una interpretación que te devuelva agencia.\n\nLa mejor lectura es la que te ayuda a vivir con más conciencia."],
  ["Luna llena: agradecer y soltar", "Un cierre ritual para reconocer lo aprendido.", "Bajo la luna llena, escribe cinco cosas que sí florecieron y una carga que ya no deseas llevar. Agradecer no borra las dificultades, pero cambia la manera en que las sostienes.\n\nRompe o guarda la hoja según lo que necesites simbolizar."],
  ["El lenguaje de los sueños", "Una guía para escuchar tus símbolos sin interpretarlos literalmente.", "Anota al despertar colores, personas, lugares y sensaciones. La emoción suele ser más reveladora que la trama. Pregúntate dónde aparece hoy esa misma sensación en tu vida.\n\nTu propio diccionario interior se construye con paciencia."],
  ["Abundancia con los pies en la tierra", "Espiritualidad y responsabilidad pueden caminar juntas.", "Manifestar también significa revisar tus hábitos, ordenar tus recursos y pedir una oportunidad concreta. La gratitud abre la mirada; la acción convierte esa mirada en movimiento.\n\nElige una decisión económica pequeña que te acerque a la estabilidad."],
  ["Un mensaje para los días de cansancio", "Descansar también forma parte del camino.", "No tienes que demostrar tu valor produciendo sin pausa. El descanso permite que el cuerpo procese, que la mente ordene y que la intuición vuelva a escucharse.\n\nHoy reduce una exigencia innecesaria y deja que eso también sea una elección espiritual."],
  ["La carta que no querías ver", "Cuando el tarot toca una verdad que estabas evitando.", "Las cartas difíciles pueden señalar una conversación pendiente, un apego o una forma de vivir que ya quedó pequeña. Míralas con curiosidad, no con castigo.\n\nPregúntate qué libertad aparece cuando dejas de resistirte al mensaje."],
  ["Oración breve para comenzar el día", "Un texto para abrir la mañana con presencia.", "Que mi mirada sea clara, mis palabras honestas y mis pasos conscientes. Que pueda reconocer la ayuda, aceptar lo que no controlo y cuidar la luz que sí puedo ofrecer.\n\nRepite la oración lentamente y adapta sus palabras a tu propia voz."],
  ["Cerrar un ciclo con gratitud", "Una práctica para despedir una etapa sin negar lo vivido.", "Nombra lo que termina, agradece lo que te enseñó y decide qué no llevarás contigo. Cerrar no significa declarar que todo fue bueno; significa dejar de entregar energía a lo que ya cumplió su propósito.\n\nHaz espacio para que lo nuevo pueda reconocerte." ]
];

const existente = db.prepare("SELECT id FROM users WHERE email = ?").get(autor.email);
const hash = bcrypt.hashSync(autor.password, 10);
const autorId = existente
  ? existente.id
  : Number(db.prepare(
      "INSERT INTO users (nombre, email, password_hash, proveedor, rol, bio) VALUES (?, ?, ?, 'local', 'autor', ?)"
    ).run(autor.nombre, autor.email, hash, "Autora invitada del Oráculo").lastInsertRowid);

const insertar = db.prepare(`
  INSERT INTO posts (autor_id, titulo, resumen, cuerpo, publicado, creado_en, actualizado)
  VALUES (?, ?, ?, ?, 1, datetime('now', ?), datetime('now', ?))
`);

let creados = 0;
for (let i = 0; i < articulos.length; i++) {
  const [titulo, resumen, cuerpo] = articulos[i];
  const yaExiste = db.prepare("SELECT id FROM posts WHERE autor_id = ? AND titulo = ?").get(autorId, titulo);
  if (!yaExiste) {
    const desplazamiento = `-${i} days`;
    insertar.run(autorId, titulo, resumen, cuerpo, desplazamiento, desplazamiento);
    creados++;
  }
}

console.log(`Autora: ${autor.nombre} <${autor.email}>`);
console.log(`Contraseña demo: ${autor.password}`);
console.log(`Artículos nuevos: ${creados}`);
console.log(`Artículos publicados de esta autora: ${db.prepare("SELECT COUNT(*) AS total FROM posts WHERE autor_id = ? AND publicado = 1").get(autorId).total}`);