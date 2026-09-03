# 📖 Wiki — GymApp (estado del proyecto)

> Documento de traspaso. Resume qué es la app, qué se ha construido, qué se corrigió,
> las decisiones de diseño y cómo retomar el trabajo en una nueva sesión.
> Última actualización: 2026-09-03.

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
overrides, utilidades) se eliminó tras completar la revisión. La guía de estilo se conserva
en la sección 9 de esta wiki. Para reeditar un nombre puntual hoy: editar directamente
`name_i18n` del ejercicio en el JSON.

---

## 5. Sistema de idiomas (implementado)

Sistema de idiomas completo (UI + datos). Los planes `plan-idiomas.md` y
`plan-traduccion-datos.md` (completos) se retiraron; su contenido vivo está en esta wiki.

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
   sin uso. Guía de estilo conservada en la sección 9 de esta wiki.
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
11. **Búsqueda por nombre traducido (2026-09-02)** — el buscador del selector antes solo
    comparaba contra `e.name` (nombre base en inglés), así que buscar "sentadilla" con la app en
    español no devolvía nada. Ahora `ExerciseService.search()` acepta un tercer parámetro `lang`
    y, además del nombre en inglés, busca en el nombre traducido del idioma activo
    (`name_i18n[lang]`). El selector le pasa `this.lang.lang()` en `filteredExercises()`, por lo
    que la búsqueda es reactiva al idioma. Archivos: `services/exercise.service.ts` (firma de
    `search` + import de `Lang`) y `exercise-selector.component.ts` (llamada con el idioma).
12. **Safe-area inferior en overlays (2026-09-03)** — la barra de navegación/gestos del sistema
    (Android) solapaba el contenido de elementos `fixed`/`sticky` pegados al borde inferior,
    porque esos elementos se posicionan contra el viewport y no contra el `padding-bottom` de
    safe-area del `body`. Se añadieron utilidades globales en `src/styles.css` que consumen
    `--safe-area-bottom`: `.pb-safe` (solo el inset), `.pb-safe-3` (`0.75rem + inset`, para
    padding propio) y `.mb-safe` (margen aditivo, no pisa el padding existente). Aplicadas en:
    - `exercise-selector.component.ts`: `mb-safe` en el grid de categorías (paso 1) y en la
      lista de ejercicios (paso 2), para que los últimos ítems no queden bajo la barra.
    - `exercise-preview.component.ts`: `pb-safe-3` en la barra sticky del botón "Seleccionar
      este ejercicio".
    - `menu.component.ts`: el `nav` pasó a `flex flex-col`; el `<ul>` a
      `flex-1 overflow-y-auto pb-safe-3`, para que la lista scrollee dentro del menú y el último
      ítem respete la barra del sistema.
    Build OK y `npx cap sync android` OK.

Commits recientes: `Traducciones de ejercicios`, `Sistema de idiomas es/en/pt-BR`,
`Mejora de iconos de tipos`, `Ajuste de iconos, splash y safe areas en rojo`.

> **Commiteado y subido (2026-09-02):** revisión manual de nombres + limpieza de `scripts/` +
> pipe `capitalize` + agente `gymapp` + preview embebida como paso 3 del selector (punto 9) +
> icono de calendario para los días en el menú (punto 10). En `origin/develop` (últimos commits
> `fix: Mejoras en el componente de seleccionar ejercicios` y
> `feat: Icono calendario para los dias en el menu`).
>
> **Commiteado y subido (2026-09-03):** búsqueda por nombre traducido en el selector (punto 11),
> ya en `origin/develop` como `fix: Ajuste en buscador`. Ya no queda nada de sesiones previas
> pendiente de commit.
>
> **Pendiente de commit (2026-09-03):** safe-area inferior en overlays (selector, preview y menú;
> ver punto 12). Archivos: `src/styles.css`, `exercise-selector.component.ts`,
> `exercise-preview.component.ts`, `menu.component.ts`.
> Mensaje sugerido:
> `fix: respetar safe-area inferior en el selector de ejercicios y el menú lateral`

---

## 7. Decisiones de diseño importantes

- **Color de marca: rojo `#dc2626`** (antes indigo). Aplicado en toda la UI y en la barra nativa.
- **StatusBar no-overlay:** Android reserva su espacio; el CSS NO aplica `padding-top` de
  safe-area en el body (lo maneja la barra nativa). Sí se respetan insets lateral/inferior.
- **Selector de idioma = dropdown propio** (no `<select>`), por problemas de posicionamiento en móvil.
- **Nombre guardado en la rutina = idioma del momento.** Al agregar un ejercicio se guarda el
  `name` en el idioma que el usuario tenga seleccionado; la rutina guardada NO cambia de idioma
  después. `exerciseName()` solo se usa en selector/preview (catálogo reactivo).
- **Nombres de ejercicios revisados a mano (1324/1324)** e incrustados en `name_i18n` del JSON.
  El andamiaje de generación en `scripts/` se eliminó; para reeditar un nombre, editar
  directamente el JSON.
- **Bandera de inglés = 🇬🇧** (Reino Unido) por compatibilidad de emoji en Android.

---

## 8. Cómo retomar en una nueva sesión

1. Lee este archivo (es la fuente de verdad) y, si necesitas el plan de trabajo futuro,
   `.kiro/fases.md`. El sistema de idiomas/traducción está completo y documentado aquí (su
   guía de estilo de nombres está en la sección 9).
2. Verifica que compila: `npm run build`.
3. Para probar en móvil: `npx cap sync android` y `npx cap run android`.
4. Rama de trabajo: `develop`.
5. (Opcional) Activa el agente con `/agent gymapp` para no reconfirmar comandos del flujo.

> **Estado al 2026-09-03:** fases 1–5 + sistema de idiomas completos. Nombres 1324/1324
> revisados a mano; `scripts/` eliminado; pipe `capitalize`; preview embebida como paso 3 del
> selector; icono de calendario en el menú; búsqueda por nombre traducido — todo commiteado y
> subido a `origin/develop`. En esta sesión se arregló el solapamiento de la barra de
> navegación/gestos del sistema con los overlays (selector, preview y menú) vía utilidades de
> safe-area inferior (punto 12), **pendiente de commit**. Próximo paso: commitear ese arreglo,
> luego Fase 6 (pulido/UX).

### Próximos pasos sugeridos (pendientes)
- **Commit pendiente:** safe-area inferior en overlays (punto 12). Ya verificado con
  `npm run build` y `npx cap sync android`.
- **Arreglo menor de test:** `src/app/app.spec.ts` (autogenerado) falla con
  `No provider found for ActivatedRoute` — añadir `provideRouter([])` al TestBed. Preexistente,
  ajeno al pipe (cuyos tests pasan).
- **Fase 6 — Pulido y UX:** animaciones/transiciones, skeleton loaders, toasts/estados vacíos,
  dark mode, accesibilidad, **PWA** (ya hay `icons/*.webp` y `manifest.webmanifest` traídos de
  PlanixFit; el manifest de referencia tenía un bug: declara `image/png` pero los archivos son
  `.webp` — corregir al integrarlo).
- **Idiomas — pulido opcional:** `LOCALE_ID` dinámico para fechas/números (única tarea que
  quedaba de la etapa 3 del antiguo `plan-idiomas.md`).
- **Fase 7 — Features avanzados:** historial de entrenamientos, estadísticas, sync con backend, etc.

### Cosas que NO hay que rehacer
- No volver a `<select>` nativo para el idioma.
- No re-aplicar `padding-top` de safe-area en el body (rompe con StatusBar no-overlay). El
  inset **inferior** sí se aplica, pero directamente en los elementos `fixed`/`sticky` que se
  pegan al borde inferior (ver punto 12), no en el body.
- No resolver el nombre del ejercicio por `exercise_id` al mostrar en rutinas (decisión tomada:
  se guarda en el idioma del momento).

---

## 9. Guía de estilo — nombres de ejercicios (`name_i18n`)

> Rescatada de `plan-nombres-ejercicios.md` (ya eliminado). Referencia para reeditar nombres a
> mano en el JSON. La revisión está completa (1324/1324); esto es solo por si se ajusta alguno.

- **Orden:** sustantivo (ejercicio) primero, luego modificadores.
  `Jalón lateral alternado`, no "Alterno lateral jalón".
- **Preposiciones:** usar "de", "con", "en" donde el español lo pide.
  `Círculos de tobillo`, `Curl con mancuerna`, `Fondo en paralelas`.
- **Equipamiento:** `con mancuerna(s)`, `con barra`, `en polea`, `en máquina`, `con pesa rusa`.
- **Concordancia:** género y número correctos (`elevación lateral`, `elevaciones laterales`).
- **Términos que se mantienen:** `curl`, `press`, `crunch`, `burpee`, `plank`→plancha,
  `deadlift`→peso muerto, `row`→remo, marcas/nombres propios (Arnold, Zottman, Bulgarian…).
- **Nombres fitness reconocidos se mantienen tal cual:** `v-up`, `sit-up`→abdominal,
  `russian twist`→giro ruso, etc. (no forzar traducción descriptiva cuando el término fitness es
  de uso común).
- **Términos de calistenia se mantienen tal cual:** `planche`, `front lever`, `back lever`,
  `maltese`, `human flag`→bandera humana, `dead bug`, `curl-up`, `l-sit`, `landmine`, `v-sit`.
- **Fracciones/ángulos:** `3/4 sit-up` → *"Abdominal a 3/4"*; `45° side bend` → *"Flexión lateral a 45°"*.
- **Género del sujeto:** el sufijo "(male)/(female)" del dataset **se omite por defecto**; pero
  si existe la pareja male+female del mismo ejercicio (dos entradas), se mantiene el marcador
  traducido "(hombre)/(mujer)" en es y "(homem)/(mulher)" en pt-BR para que no queden idénticos.
- **pt-BR:** mismas reglas con vocabulario propio (`agachamento`, `supino`, `rosca`, `remada`,
  `flexão`, `prancha`, `levantamento terra`…).
- **Glosario por grupo (es / pt-BR):**
  - Pecho: `bench press`→*press de banca* / *supino*; `chest dip`→*fondo de pecho* / *mergulho de peito*.
  - Espalda: `pulldown`→*jalón* / *puxada*; `pull-up`→*dominada* / *barra*; `row`→*remo* / *remada*;
    `shrug`→*encogimiento* / *encolhimento*; `deadlift`→*peso muerto* / *levantamento terra*.
  - Hombros: `shoulder/overhead press`→*press de hombros* / *desenvolvimento*; `raise`→*elevación* / *elevação*.
  - Brazos: `curl`→*curl* / *rosca*; `triceps extension`→*extensión de tríceps* / *extensão de tríceps*;
    `skull crusher`→*press francés* / *tríceps testa*.
  - Piernas: `squat`→*sentadilla* / *agachamento*; `lunge`→*zancada* / *afundo*;
    `leg curl`→*curl femoral* / *flexora*; `leg extension`→*extensión de piernas* / *cadeira extensora*.
  - Pantorrillas: `calf raise`→*elevación de talones* / *elevação de panturrilha*.

---

## 10. Índice de documentación (`.kiro/`)

| Archivo | Contenido |
|---------|-----------|
| `wiki.md` | **Este documento** — estado global y traspaso |
| `fases.md` | Plan de fases 1–7 (con estado); Fases 6–7 pendientes |
| `README.md` | Visión general y assets del proyecto |
| `assets.md` | Inventario de recursos |
| `referencia-planixfit.md` | Análisis de PlanixFit |
| `setup-capacitor.md` | Guía de compilación a Android |

> **Docs eliminados (absorbidos en esta wiki):** `plan-idiomas.md` (etapas 1–2 hechas, 3
> opcional), `plan-traduccion-datos.md` (etapas A–D completas) y `plan-nombres-ejercicios.md`
> (revisión 1324/1324 completa; su guía de estilo quedó en la sección 9 de arriba).
> **Descartado:** `sqlite-strategy.md` — no se implementó; la persistencia es localStorage
> (signals + `localStorage`) y se mantiene así (ver sección 2 y decisiones de diseño).
