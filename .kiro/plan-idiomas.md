# Plan — Sistema de Idiomas (i18n dinámico)

Permitir cambiar el idioma de la app en caliente entre **Español (es)**, **Inglés (en)** y **Portugués brasileño (pt-BR)**, mediante un selector con banderas en el lado derecho del header.

## Decisiones de diseño

- **Sin `@angular/localize`**: ese enfoque compila un build por idioma y obliga a recargar. Queremos cambio en caliente.
- **Sin librería externa** (`@ngx-translate`): la app es pequeña y ya usa signals. Un servicio propio es suficiente y sin dependencias nuevas.
- **Fuente de idioma única**: un `signal` en `LanguageService`. Todo lo reactivo (datos de ejercicios y textos de UI) deriva de ese signal.
- **Persistencia**: se guarda el idioma elegido en `localStorage` (`gymapp.lang`).
- **Idioma inicial**: detectar el del dispositivo (`navigator.language`); si no es uno de los 3 soportados → `es` por defecto.

## Los dos frentes a traducir

1. **Datos de ejercicios** (ya vienen en 3 idiomas en `exercises.json`):
   - `instructions: { en, es, 'pt-BR' }`
   - `instruction_steps: { en, es, 'pt-BR' }`
   - Hoy están fijos a `['es']` en `exercise-preview.component.ts`.
2. **Textos de la interfaz** (hoy hardcodeados en español en cada template):
   - Header, Menú, Home, Setup, Setup-Day, Routine, Exercise-Selector, Exercise-Preview.
   - Nombres de días de la semana (`RoutineService.getDayName()`).

---

## Etapa 1 — Núcleo del idioma + selector (datos de ejercicios)

**Objetivo:** infraestructura funcionando y el selector visible, con los datos del ejercicio ya reactivos.

- [x] Crear tipo `Lang = 'es' | 'en' | 'pt-BR'`
- [x] Crear `LanguageService` (`providedIn: 'root'`):
  - `lang` (signal readonly), `setLang(l)`, init desde localStorage / `navigator.language`
- [x] Crear componente `LanguageSelectorComponent`:
  - `<select>` con 3 opciones y banderas: 🇪🇸 Español, 🇧🇷 Português, 🇬🇧 English
  - Bandera 🇬🇧 (Reino Unido) para inglés — confirmado por compatibilidad en Android
  - Al cambiar → llama a `languageService.setLang()`
- [x] Integrar el selector en el **lado derecho del header** (reemplaza el `<div class="w-10">`)
- [x] Conectar datos de ejercicio: en `exercise-preview`, cambiar `['es']` por `[languageService.lang()]`
- [x] Verificar: al cambiar idioma, las instrucciones del ejercicio cambian al instante

**Resultado:** el selector funciona y las instrucciones de los ejercicios cambian de idioma en caliente. La UI sigue en español (etapa 2).

---

## Etapa 2 — Traducción de los textos de la UI

**Objetivo:** que TODOS los textos de la interfaz respeten el idioma seleccionado.

- [x] Crear diccionario de traducciones `i18n/ui.ts` con claves para los 3 idiomas
- [x] Añadir helper `t(key)` en `LanguageService` (o pipe `translate`)
- [x] Migrar textos hardcodeados a claves del diccionario, componente por componente:
  - [x] Header / Menú (títulos, items de navegación)
  - [x] Home ("Hacer rutina de hoy", "Configurar rutina", "No hay rutina...", etc.)
  - [x] Setup (días, activar/desactivar)
  - [x] Setup-Day (reps, sets, descanso, botones CRUD, confirmaciones)
  - [x] Routine ("Rutina completada", "Series totales", "Tiempo total", estados)
  - [x] Exercise-Selector ("Seleccionar ejercicio", "Buscar ejercicio...", "N ejercicios")
  - [x] Exercise-Preview (botón confirmar, etc.)
- [x] Traducir nombres de días de la semana (`getDayName()` según idioma)
- [x] Traducir labels de categorías (`BODY_PART_LABELS`) a los 3 idiomas
- [x] Verificar cada pantalla en los 3 idiomas

**Resultado:** la app entera cambia de idioma con el selector.

---

## Etapa 3 — Pulido (opcional)

- [ ] Fechas/números: evaluar `LOCALE_ID` dinámico o dejar fijo
- [ ] Persistir y restaurar idioma al reabrir la app (ya cubierto por localStorage)
- [ ] Accesibilidad del selector (aria-label, foco)
- [ ] Guardar preferencia también para el `<html lang="">`

---

## Archivos afectados

| Archivo | Cambio |
|---------|--------|
| `services/language.service.ts` | **nuevo** — signal de idioma + persistencia + `t()` |
| `components/language-selector/` | **nuevo** — `<select>` con banderas |
| `i18n/ui.ts` | **nuevo** — diccionario de textos de UI |
| `components/header/header.component.ts` | integrar selector a la derecha |
| `components/exercise-preview/...` | `['es']` → idioma dinámico |
| `models/exercise.model.ts` | `BODY_PART_LABELS` a 3 idiomas |
| `services/routine.service.ts` | `getDayName()` a 3 idiomas |
| resto de páginas/componentes | migrar textos a claves `t()` |

## Notas

- Las banderas como emoji (🇪🇸 🇧🇷 🇬🇧) no requieren imágenes ni assets. Si se quiere consistencia visual entre plataformas (Android a veces no renderiza todas), se puede pasar a SVG de banderas más adelante.
- El grueso del trabajo está en la Etapa 2 (extraer todos los textos). La Etapa 1 es rápida y ya da valor visible.
