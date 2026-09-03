---
inclusion: always
---

# GymApp — Contexto del proyecto

**Antes de trabajar, lee `.kiro/wiki.md`** — es la fuente de estado del proyecto (qué está
hecho, decisiones, próximos pasos, cómo compilar). No la reproduzcas aquí; consúltala.

## Reglas rápidas
- App: Angular 22 (standalone + signals) + Tailwind v4 + Capacitor 8 → Android. Offline-first.
- Color de marca: **rojo `#dc2626`** (red-600). No usar indigo.
- Responder en **español**.
- Tras cambios de código: `npm run build` y, si aplica a móvil, `npx cap sync android`.
- **Git: NO commitear ni hacer push.** El usuario siempre hace los commits él mismo. Dejar los
  cambios listos en el working tree y avisar; no ejecutar `git commit`/`git push`. **Sí sugerir
  el texto del commit** (estilo Conventional Commits, en español), p. ej.:
  `fix: Cambios de cualquier cosa` · `feat: Nuevo componente de tal cosa`.
- Idiomas soportados: es / en / pt-BR (ver `LanguageService`, `i18n/`).

## No rehacer (decisiones tomadas)
- Selector de idioma: dropdown propio, NO `<select>` nativo.
- StatusBar no-overlay: NO reañadir `padding-top` de safe-area en el body.
- Nombre de ejercicio en rutinas: se guarda en el idioma del momento (no resolver por id al mostrar).
- Nombres de ejercicios: revisados a mano (1324/1324) e incrustados en `name_i18n` del JSON.
  El andamiaje de generación en `scripts/` ya se eliminó; para reeditar, editar el JSON directamente.

## Planes y estado (detalle en `.kiro/`)
- `wiki.md` — estado global y traspaso (fuente de verdad). Incluye la guía de estilo de nombres.
- `fases.md` — fases 1–5 completas; 6 (pulido/UX) y 7 (avanzado) pendientes.
- Idiomas y traducción de datos: **completos**, documentados en `wiki.md` (los planes
  `plan-idiomas.md` / `plan-traduccion-datos.md` / `plan-nombres-ejercicios.md` se retiraron
  al quedar absorbidos por la wiki).
