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
- Idiomas soportados: es / en / pt-BR (ver `LanguageService`, `i18n/`).

## No rehacer (decisiones tomadas)
- Selector de idioma: dropdown propio, NO `<select>` nativo.
- StatusBar no-overlay: NO reañadir `padding-top` de safe-area en el body.
- Nombre de ejercicio en rutinas: se guarda en el idioma del momento (no resolver por id al mostrar).
- Nombres de ejercicios: traducidos por glosario en `scripts/generate-name-i18n.py` (Vía 2).

## Planes y estado (detalle en `.kiro/`)
- `wiki.md` — estado global y traspaso.
- `fases.md` — fases 1–5 completas; 6 (pulido/UX) y 7 (avanzado) pendientes.
- `plan-idiomas.md` — etapas 1–2 hechas; etapa 3 (fechas/números) opcional pendiente.
- `plan-traduccion-datos.md` — etapas A–D completas.
