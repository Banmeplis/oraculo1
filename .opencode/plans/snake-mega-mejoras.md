# Plan: Mejoras únicas para Snake Mega (snake.html)

Objetivo: hacer el juego más interesante y desafiante (dificultad **equilibrada**), añadiendo
características únicas sin perder el estilo visual actual (trail fluido + Web Audio).

Archivo único a modificar: `snake.html`.

## 1. QoL y pulido
- Fix typo `'ENCGER'` → `'ENCOGER'` en `POWER_DEFS`.
- Estadísticas en `die()`: comida, tiempo vivo, dash usados, jefes vencidos, combo máximo (nuevo `runStats`).
- Barra de **estamina** (div HTML con fill) bajo el canvas.
- Barra de **HP del jefe** (div `#bossbar`, oculto salvo jefe activo).
- **Controles táctiles** (D-pad + botones DASH/ACT/P) solo visibles con `@media (pointer: coarse)`.
- **Screenshake** (`shakeT` + translate en `draw()`): al chocar minas, explosión de jefe, dash y muerte.
- `e.preventDefault()` para SPACE (evita scroll de página).
- Sonidos nuevos en `playSound`: `dash`, `bonk`, `event`, `rivalWarn`, `rivalDown`, `robbed`, `bossWarn`, `bossHit`, `bossDown`.

## 2. Sistema DASH (tecla Shift)
- Estado: `dashStamina` (0-100), `dashInvulnT`, `pendingDash`, `dashing`, `dashCooldown`.
- Recarga: `+15/s` y `+15` por comida. Coste: 40. Cooldown 0.3s.
- `startDash()`: si hay estamina y no hay dash activo → `pendingDash = 3`, `dashInvulnT = 0.22`, sound `dash`, screenshake leve.
- En `loop()`: si `pendingDash > 0`, se ejecutan `update()` en ráfaga (hasta 3), con `dashNextSafe()` que interrumpe el dash antes de pared/bloque/tope/cuerpo propio (peek por celda, `bonk`). Fase permite cruzar paredes.
- Invulnerabilidad: mientras `dashInvulnT > 0`, balas/minas/depredador no matan.
- Visual: 2 afterimages fantasma del cuerpo durante el dash.
- HUD: `refreshHUD()` actualiza la barra de estamina (solo si cambió).
- No toca `speed` (getInterval intacto).

## 3. DEPREDADOR (serpiente IA rival)
- Estado: `rival {body, dir, interval, tick}`, `rivalTrail {path, headD}`, `rivalT`, `rivalWarnT`.
- Spawn: timer cada ~45s si no hay evento/jefe/depredador activo. **Avión de advertencia 3s** (anillo) antes de materializarse.
- IA por tick propio (~140ms): pathfinding greedy por Manhattan hacia tu cabeza, evita su propio cuerpo/paredes/bloques/minas/torres/estatuas, con 15% de error (dificultad equilibrada).
- Interacciones:
  - Te muerde (entra en tu cabeza) ⇒ mueres (salvo escudo/dash: entonces muere él).
  - Choca tu cuerpo, bloque, torre, estatua o mina armada ⇒ muere él: recompensa `+100×combo`, suelta un ★ o power-up guardado, sound `rivalDown`.
  - Come tu comida ⇒ la roba, reinicia tu combo, text «COMBO ROBADO», sound `robbed`.
- Renderc: ribbon propia (reutiliza `buildCum`/`pointAtLength`) con color magenta/cian, ojos y aura pequeña.

## 4. EVENTOS DE NIVEL rotativos (cada 25 comida)
- Contador `eventCount`; al llegar a 25 y sin evento/jefe activo → `triggerEvent()` (sin repetir el inmediato anterior).
- Pool (duraciones):
  - **LLUVIA ★ (8s)**: spawn periódico de súper comidas extra (máx 5 en tablero) + partículas de estrellas cayendo.
  - **APAGÓN (8s)**: overlay oscuro; minas invisibles salvo un parpadeo `!` de peligro a <2.5 celdas.
  - **CAZADOR (7s)**: surge un depredador extra más veloz (~100ms) durante el evento.
  - **COMPRESIÓN (9s)**: las paredes se cierran con un frente rojo hasta un inserción máxima (~5 celdas) y se abren de nuevo (curva senoidal). Fuera de la zona segura ⇒ muerte (salvo escudo).
- Banner `showCombo('⚠ OLA: NAME', color)` + sound `event`.
- Durante evento no se inicia otro evento ni jefe.

## 5. JEFE en hitos
- Umbrales `[1000, 2500, 5000, 9000, ...]` (`nextBossLevel`). Se dispara al cruzar el puntaje.
- `boss {x, y, hp:6, fireT, warn[], phase}` + `bossCore {x,y}` (el NÚCLEO a comer).
- Mecánica: crow el NÚCLEO ⇒ `hp--`, `+50`, respawn del núcleo, el jefe acelera su patrón. `hp=0` ⇒ derrota.
- Patrón telegrafiado: líneas de aviso 0.6s + ráfaga radial de 6 balas (~120 px/s).
- La celda del jefe es muro (fase la atraviesa). Rival lo evita.
- Durante jefe: no eventos ni depredadores. Barra de HP en HUD.
- Derrota: explosión grande, `+500`, suelta 3 ★, sound `bossDown`, screenshake fuerte.

## 6. Orden de implementación y verificación
1) QoL/pulido → 2) Dash → 3) Depredador → 4) Eventos → 5) Jefe.
Verificación final:
- Extraer `<script>` y `node --check` (método habitual).
- Smoke test en Node de la lógica pura nueva (pathfinding rival, compresión, umbrales de jefe) con DOM mockeado.
- Abrir en navegador para prueba visual/manual.
- No tocar `public/` (proyecto aparte).