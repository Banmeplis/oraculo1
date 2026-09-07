const db = require("./database.js");

const autor = db.prepare("SELECT id FROM users WHERE email = ?").get("luna.arcania@oraculo.local");
if (!autor) throw new Error("No se encontró la autora demo");

const imagenes = [
  "1603006905003-be475563bc59", "1513506003901-1e6a229e2d15", "1602523961358-f9f03dd557db",
  "1519681393784-d120267933ba", "1444703686981-a3abbc4d4fe3", "1462331940025-496dfbfc7564",
  "1446776811953-b23d57bd21aa", "1470252649378-9c29740c9fa8", "1499346030926-9a72daac6c63",
  "1500534623283-312aade485b7", "1501854140801-50d01698950b", "1518709268805-4e9042af9f23",
  "1470770841072-f978cf4d019e", "1518837695005-2083093ee35b", "1500530855697-b586d89ba3ee",
  "1507525428034-b723cf961d3e", "1497250681960-ef046c08a56e", "1523712999610-f77fbcfc3843",
  "1500534314209-a25ddb2bd429", "1511497584788-876760111969"
].map(id => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1200&q=80`);

const posts = db.prepare("SELECT id, titulo FROM posts WHERE autor_id = ? ORDER BY creado_en DESC LIMIT 20").all(autor.id);
if (posts.length < 20) throw new Error(`Se esperaban 20 artículos y se encontraron ${posts.length}`);

const actualizar = db.prepare("UPDATE posts SET portada = ?, actualizado = datetime('now') WHERE id = ?");
posts.forEach((post, indice) => {
  actualizar.run(imagenes[indice], post.id);
});

console.log(`Imágenes asignadas: ${posts.length}`);