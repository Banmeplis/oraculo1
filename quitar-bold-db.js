const db = require("./database.js");

const posts = db.prepare("SELECT id, cuerpo FROM posts").all();
let actualizados = 0;

const actualizar = db.prepare("UPDATE posts SET cuerpo = ?, actualizado = datetime('now') WHERE id = ?");

for (const post of posts) {
  if (post.cuerpo && post.cuerpo.includes("**")) {
    const limpio = post.cuerpo.replace(/\*\*/g, "");
    actualizar.run(limpio, post.id);
    actualizados++;
  }
}

console.log(`Artículos actualizados: ${actualizados}/${posts.length}`);
