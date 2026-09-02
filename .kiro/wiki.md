# 📖 Wiki — GymApp (estado del proyecto)

> Documento de traspaso. Resume qué es la app, qué se ha construido, qué se corrigió,
> las decisiones de diseño y cómo retomar el trabajo en una nueva sesión.
> Última actualización: 2026-09-02.

---

## 1. Qué es GymApp

App móvil de fitness (Angular 22 + Tailwind v4 + Capacitor → Android) para crear, gestionar
y ejecutar rutinas de ejercicios personalizadas. Offline-first, sin backend (persistencia en
localStorage). Basada en la app de referencia **PlanixFit**.

- **1324 ejercicios** con datos, imágenes (thumbnails) y GIFs animados.
- Instrucciones ya traducidas en el dataset (en / es / pt-BR).
- Multiidioma completo (UI + datos) con cambio en caliente.

---

## 2. Stack técnico

| Capa | Tecnología |
|------|-----------|
| Framework | Angular 22.1 (standalone components, signals) |
| Estilos | Tailwind CSS v4 + PostCSS |
| Testing | Vitest (`ng test`) |
| Mobile | Capacitor 8 (`@capacitor/android`) |
| Plugins nativos | `@capacitor/status-bar`, `@capacitor/assets` (dev) |
| Persistencia | localStorage (rutinas y días; idioma) |
| Color de marca | **Rojo** `#dc2626` (red-600) |

**Comandos clave:**
```bash
npm run build                                  # compilar Angular
npx cap sync android                           # copiar build + plugins a Android
npx cap open android                           # abrir Android Studio
npx cap run android                            # compilar y correr en dispositivo
```

---

## 3. Estructura del código (`src/app/`)

```
app.ts                 → root; inicializa StatusBar (nativo), toggle del menú
app.config.ts          → provideRouter, provideHttpClient, LOCALE_ID 'es'
app.routes.ts          → rutas lazy: /home, /routine/:day, /setup, /setup/:day
components/
  header/              → barra superior roja + botón menú + selector de idioma
  menu/                → menú lateral (días activos + navegación)
  language-selector/   → dropdown propio con banderas 🇪🇸🇬🇧🇧🇷
  exercise-selector/   → selector de ejercicio en 3 pasos dentro de un mismo panel slide-up:
                         categorías (imágenes) → lista + búsqueda → detalle embebido.
                         Header con flecha ‹ que retrocede un nivel (detalle→lista→categorías).
  exercise-preview/    → componente de contenido (GIF, metadata, instrucciones, botón
                         "Seleccionar"); SIN modal/backdrop propio, se embebe en el paso 3
                         del selector.
pages/
  home/                → pantalla inicial (rutina de hoy)
  setup/               → activar/desactivar días
  setup-day/           → CRUD de ejercicios de un día
  routine/             → ejecución de rutina (timers, acordeón, resumen)
services/
  exercise.service.ts  → carga exercises.json (signal, una vez)
  routine.service.ts   → días + rutinas en localStorage
  sound.service.ts     → beep al terminar descanso
  language.service.ts  → idioma actual (signal) + t() + dayName() + bodyPartLabel() + term() + exerciseName()
models/
  exercise.model.ts    → Exercise (incl. name_i18n?), BodyPart, labels
  routine.model.ts     → Day, RoutineExercise, DEFAULT_DAYS, DEFAULT_EXERCISE_CONFIG
i18n/
  ui.ts                → diccionario de textos de UI + DAY_NAMES + BODY_PART_LABELS_I18N
  exercise-terms.ts    → traducción de target/equipment/músculos (78 términos)
pipes/
  capitalize.pipe.ts   → pipe `capitalize`: primera letra en mayúscula, respeta el resto
                         (nombres de ejercicios). Usado en selector, preview, setup-day y routine.
```

Otros: `public/data/exercises.json` (dataset con `name_i18n` ya incrustado, incluidos los
nombres revisados a mano), `public/images/tipos/` (íconos de categorías),
`assets/` e `icons/` (fuentes para íconos/splash, tomadas de PlanixFit).

---

## 4. Estado de las fases (ver `.kiro/fases.md`)

| Fase | Estado |
|------|--------|
| 1 — Fundación y navegación | ✅ completa |
| 2 — Servicio de ejercicios y selector | ✅ completa |
| 3 — Gestión de rutinas (CRUD) | ✅ completa |
| 4 — Ejecución de rutina | ✅ completa |
| 5 — Mobile (Capacitor) | ✅ completa (íconos, splash, safe areas, APK probado) |
| 6 — Pulido y UX | ⬜ pendiente |
| 7 — Features avanzados | ⬜ pendiente (futuro) |

**Extra ya hecho (fuera del plan original):** sistema de idiomas completo (UI + datos).
**Nombres de ejercicios revisados a mano: 1324/1324** (es/pt-BR), ya incrustados en
`public/data/exercises.json` (`name_i18n`). El andamiaje de generación (`scripts/`: generador,
overrides, utilidades) se eliminó tras completar la revisión — ver
`.kiro/plan-nombres-ejercicios.md` para el histórico y la guía de estilo. Para reeditar un
nombre puntual hoy: editar directamente `name_i18n` del ejercicio en el JSON.

---

## 5. Sistema de idiomas (implementado)

Ver planes: `.kiro/plan-idiomas.md` y `.kiro/plan-traduccion-datos.md`.

- **Idiomas:** Español (es), Inglés (en), Portugués BR (pt-BR).
- **Cambio en caliente** vía `LanguageService` (signal), persistido en localStorage
  (`gymapp.lang`), idioma inicial detectado del dispositivo.
- **Selector** con banderas en el header (dropdown propio, no `<select>` nativo).
- **UI traducida** por completo (`i18n/ui.ts` + helper `t()`).
- **Datos traducidos:**
  - `instructions` / `instruction_steps` → ya venían en el JSON.
  - `target`, `equipment`, `secondary_muscles` → diccionario `exercise-terms.ts` (`term()`).
  - `name` de ejercicios → campo `name_i18n` (es/en/pt-BR) **revisado a mano (1324/1324)** e
    incrustado en el JSON. Helper `exerciseName()`. (El andamiaje de generación en `scripts/`
    se eliminó tras la revisión.)

**Cobertura:** UI 100%, términos 100% (78/78), **nombres 100% (1324/1324) revisados a mano**.

---

## 6. Historial de cambios y correcciones

Cronología de esta línea de trabajo (rama `develop`):

1. **Fase 5 en rojo** — íconos/splash (mancuerna roja de PlanixFit) con `@capacitor/assets`;
   tema de la app cambiado de indigo a **rojo** (todos los componentes + `theme-color` + Capacitor).
2. **Safe areas / StatusBar** — instalado `@capacitor/status-bar`, barra no-overlay con fondo
   rojo e íconos claros; corregido el contenido que se dibujaba tras la barra de estado al hacer
   scroll. Padding del header `pt-8`, cabecera del menú `pt-10`.
3. **Selector de idioma** — primero `<select>` nativo (se salía de pantalla en móvil) →
   reemplazado por **dropdown propio** anclado al botón.
4. **Íconos de categorías** — se reemplazaron los emojis (mal elegidos) por las imágenes de
   `public/images/tipos/` (9 imágenes; cardio usa emoji ❤️ de respaldo). Orden corporal
   (cuello → ... → cardio al final).
5. **Idiomas UI + datos** — servicio, diccionarios, migración de todos los textos, términos y nombres.
6. **Revisión manual de nombres (2026-09-01)** — los 1324 nombres de ejercicios revisados a
   mano en es/pt-BR e incrustados en `name_i18n`. Se creó un andamiaje temporal en `scripts/`
   (generador + overrides + utilidades) que **se eliminó al terminar** para no dejar archivos
   sin uso. Registro y guía de estilo en `.kiro/plan-nombres-ejercicios.md`.
7. **Pipe `capitalize` (2026-09-01)** — `src/app/pipes/capitalize.pipe.ts`. Pone en mayúscula
   la primera letra del nombre al mostrarlo (el inglés viene en minúsculas), respetando
   mayúsculas internas ("V-up", "Press JM"). Aplicado en selector, preview, setup-day y routine.
   Con test (`capitalize.pipe.spec.ts`, 5 casos, pasan).
8. **Agente local `gymapp` (2026-09-01)** — `.kiro/agents/gymapp.json`: auto-aprueba las
   herramientas del flujo (edición del proyecto y comandos `npm`/`npx cap`/`python3`/`ng`/git de
   lectura) para no pedir permiso repetido. Activar con `/agent gymapp`.
9. **Preview embebida en el selector (2026-09-02)** — antes el detalle del ejercicio salía como
   un **segundo modal** flotante encima del panel slide-up (se veía mal en móvil). Ahora la
   preview es un componente de solo contenido (sin backdrop/modal propio) que se muestra como
   **tercer paso dentro del mismo panel** (categorías → lista → detalle). El header del panel
   muestra el nombre del ejercicio en el detalle y una flecha ‹ retrocede un nivel
   (detalle→lista→categorías). Build OK, sin warnings.
10. **Icono de días en el menú (2026-09-02)** — el icono de los días activos en el menú lateral
    pasó de un rayo a un **calendario** (Heroicons outline, SVG inline en `menu.component.ts`).
    Sigue heredando el color del texto (rojo cuando el día está activo).

Commits recientes: `Traducciones de ejercicios`, `Sistema de idiomas es/en/pt-BR`,
`Mejora de iconos de tipos`, `Ajuste de iconos, splash y safe areas en rojo`.

> **Commiteado y subido (2026-09-02):** revisión manual de nombres + limpieza de `scripts/` +
> pipe `capitalize` + agente `gymapp`. En `origin/develop` (commits `fix: Mejora en nombres de
> ejercicios y traducciones` y `feat: Actualizacion de la wiki`). Working tree limpio.
>
> **Pendiente de commit (2026-09-02):** preview embebida como paso 3 del selector (ver punto 9)
> + icono de calendario para los días en el menú (ver punto 10). Archivos:
> `exercise-selector.component.ts`, `exercise-preview.component.ts`, `menu.component.ts`.
> Mensajes sugeridos:
> `feat: preview de ejercicio embebida como paso 3 del selector (sin doble modal)` ·
> `feat: icono de calendario para los días en el menú`

---

## 7. Decisiones de diseño importantes

- **Color de marca: rojo `#dc2626`** (antes indigo). Aplicado en toda la UI y en la barra nativa.
- **StatusBar no-overlay:** Android reserva su espacio; el CSS NO aplica `padding-top` de
  safe-area en el body (lo maneja la barra nativa). Sí se respetan insets lateral/inferior.
- **Selector de idioma = dropdown propio** (no `<select>`), por problemas de posicionamiento en móvil.
- **Nombre guardado en la rutina = idioma del momento.** Al agregar un ejercicio se guarda el
  `name` en el idioma que el usuario tenga seleccionado; la rutina guardada NO cambia de idioma
  después. `exerciseName()` solo se usa en selector/preview (catálogo reactivo).
- **Nombres de ejercicios traducidos por glosario (Vía 2)**, no por API ni a mano. Editable
  re-corriendo el script.
- **Bandera de inglés = 🇬🇧** (Reino Unido) por compatibilidad de emoji en Android.

---

## 8. Cómo retomar en una nueva sesión

1. Lee este archivo y luego `.kiro/fases.md`, `.kiro/plan-idiomas.md`,
   `.kiro/plan-traduccion-datos.md` y `.kiro/plan-nombres-ejercicios.md` (registro de la
   revisión manual de nombres, ya completa).
2. Verifica que compila: `npm run build`.
3. Para probar en móvil: `npx cap sync android` y `npx cap run android`.
4. Rama de trabajo: `develop`.
5. (Opcional) Activa el agente con `/agent gymapp` para no reconfirmar comandos del flujo.

> **Estado al 2026-09-02:** nombres 1324/1324 revisados a mano; `scripts/` eliminado;
> pipe `capitalize` aplicado; preview del ejercicio ahora embebida como paso 3 del selector
> (sin doble modal); build OK. Trabajo previo commiteado y subido; **el cambio de la preview
> queda sin commitear.** Próximo paso: commitear la preview, luego Fase 6 (pulido/UX).

### Próximos pasos sugeridos (pendientes)
- ~~Commit pendiente de la sesión de hoy~~ ✅ hecho y subido a `origin/develop` (2026-09-02).
- **Arreglo menor de test:** `src/app/app.spec.ts` (autogenerado) falla con
  `No provider found for ActivatedRoute` — añadir `provideRouter([])` al TestBed. Preexistente,
  ajeno al pipe (cuyos tests pasan).
- **Fase 6 — Pulido y UX:** animaciones/transiciones, skeleton loaders, toasts/estados vacíos,
  dark mode, accesibilidad, **PWA** (ya hay `icons/*.webp` y `manifest.webmanifest` traídos de
  PlanixFit; el manifest de referencia tenía un bug: declara `image/png` pero los archivos son
  `.webp` — corregir al integrarlo).
- **Idiomas — pulido opcional (Etapa 3 de `plan-idiomas.md`):** `LOCALE_ID` dinámico para
  fechas/números.
- **Fase 7 — Features avanzados:** historial de entrenamientos, estadísticas, sync con backend, etc.

### Cosas que NO hay que rehacer
- No volver a `<select>` nativo para el idioma.
- No re-aplicar `padding-top` de safe-area en el body (rompe con StatusBar no-overlay).
- No resolver el nombre del ejercicio por `exercise_id` al mostrar en rutinas (decisión tomada:
  se guarda en el idioma del momento).

---

## 9. Índice de documentación (`.kiro/`)

| Archivo | Contenido |
|---------|-----------|
| `wiki.md` | **Este documento** — estado global y traspaso |
| `fases.md` | Plan de fases 1–7 (con estado) |
| `plan-idiomas.md` | Sistema de idiomas (UI) por etapas |
| `plan-traduccion-datos.md` | Traducción de los datos del catálogo por etapas |
| `README.md` | Visión general y assets del proyecto |
| `assets.md` | Inventario de recursos |
| `referencia-planixfit.md` | Análisis de PlanixFit |
| `setup-capacitor.md` | Guía de compilación a Android |
| `sqlite-strategy.md` | Estrategia de persistencia (referencia; hoy se usa localStorage) |
