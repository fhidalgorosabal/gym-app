# Fases de Implementación

Desarrollo progresivo de GymApp, empezando con lo mínimo funcional y puliendo en cada fase.

---

## Fase 1 — Fundación y Navegación

**Objetivo:** Estructura base de la app con navegación funcionando.

- [x] Configurar app.config.ts (provideRouter, provideHttpClient, locale ES)
- [x] Crear layout base: Header + router-outlet
- [x] Crear componente Header con título y hamburger
- [x] Crear componente Menu lateral (slide-over)
- [x] Definir rutas principales con lazy loading:
  - `/home` → Home
  - `/routine/:day` → Ejecución de rutina
  - `/setup` → Configurar días
  - `/setup/:day` → CRUD ejercicios del día
- [x] Crear páginas placeholder para cada ruta
- [x] Verificar navegación funciona en browser

**Resultado:** App navegable con estructura de pantallas vacías.

---

## Fase 2 — Servicio de Ejercicios y Selector

**Objetivo:** Tener el servicio de datos listo y el componente selector que se usará en la Fase 3 para armar rutinas. El catálogo no es una página independiente, sino un selector contextual dentro del flujo de creación de rutinas.

### 2.1 — Servicio de datos
- [x] Crear interfaces TypeScript (Exercise, BodyPart, Equipment)
- [x] Crear ExerciseService (providedIn: 'root')
- [x] Cargar exercises.json vía HttpClient (una vez, cachear en signal)
- [x] Métodos: getByBodyPart(part), search(term, bodyPart?), getById(id)
- [x] Extraer lista de body_parts y equipments únicos para los filtros

### 2.2 — Componente Selector de Ejercicios
- [x] Crear componente reutilizable ExerciseSelector (modal o slide-up)
- [x] Paso 1: elegir body_part (grid de categorías con iconos/nombres)
- [x] Paso 2: listado filtrado de ejercicios de esa categoría
- [x] Búsqueda por nombre dentro de la categoría seleccionada
- [x] Cada item muestra: thumbnail + nombre + equipment
- [x] Virtual scroll si la categoría tiene muchos items
- [x] Al seleccionar → emite el ejercicio elegido al padre
- [x] Lazy load de thumbnails (solo los visibles)

### 2.3 — Vista previa del ejercicio
- [x] Al tocar un ejercicio en el selector, mostrar detalle rápido
- [x] GIF animado (carga solo cuando se abre la preview)
- [x] Instrucciones paso a paso (español)
- [x] Botón "Seleccionar este ejercicio" para confirmar

### 2.4 — Performance
- [x] Verificar scroll fluido en las categorías más grandes
- [x] Confirmar que el JSON se carga una sola vez y se reutiliza

**Resultado:** Servicio de datos funcionando + componente selector listo para ser integrado en el CRUD de rutinas (Fase 3).

---

## Fase 3 — Gestión de Rutinas (CRUD)

**Objetivo:** Configurar qué ejercicios hacer cada día.

- [x] Definir modelo de datos para rutinas (localStorage/IndexedDB)
- [x] Crear pantalla de configuración de días (toggle activo/inactivo)
- [x] Crear pantalla de CRUD ejercicios por día:
  - Abrir ExerciseSelector (Fase 2) para elegir ejercicio
  - Configurar: reps, sets, unidad, rest_time, rest_time_set
  - Editar ejercicio existente
  - Eliminar con confirmación
  - Reordenar (drag & drop o flechas)
- [x] Persistir en localStorage (offline-first)
- [x] Menú lateral muestra solo días activos

**Resultado:** El usuario puede crear su rutina personalizada sin backend.

---

## Fase 4 — Ejecución de Rutina

**Objetivo:** Entrenar con la rutina del día, guiado por la app.

- [x] Crear pantalla de ejecución de rutina
- [x] Implementar acordeón de ejercicios (uno expandido a la vez)
- [x] Mostrar serie actual y progreso
- [x] Timer de descanso entre sets (configurable por ejercicio)
- [x] Timer de descanso entre ejercicios
- [x] Notificación sonora al terminar descanso
- [x] Marcar ejercicio como completado
- [x] Vista de resumen al terminar toda la rutina

**Resultado:** Experiencia de entrenamiento guiado, similar a PlanixFit.

---

## Fase 5 — Mobile (Capacitor)

**Objetivo:** Compilar a Android y optimizar para dispositivo.

- [x] Instalar y configurar Capacitor (ver setup-capacitor.md)
- [x] Generar íconos y splash screen
- [x] Ajustar UI para pantallas móviles (safe areas, status bar)
- [x] Probar en emulador y dispositivo real
- [x] Optimizar GIFs (lazy load, solo el visible)
- [x] Verificar que audio funciona en Android
- [x] Generar APK de test

**Resultado:** APK funcional que se puede instalar en cualquier Android.

---

## Fase 6 — Pulido y UX

**Objetivo:** Mejorar la experiencia de usuario.

- [ ] Animaciones y transiciones entre páginas
- [ ] Skeleton loaders mientras cargan datos
- [ ] Feedback visual al usuario (toasts, estados vacíos)
- [ ] Tema de colores consistente
- [ ] Dark mode (opcional)
- [ ] Accesibilidad (contraste, tamaños táctiles, labels)
- [ ] PWA: manifest.webmanifest + service worker

**Resultado:** App pulida y profesional.

---

## Fase 7 — Features Avanzados (futuro)

Funcionalidades que se pueden agregar después del MVP:

- [ ] Historial de entrenamientos (qué hiciste cada día)
- [ ] Estadísticas y progreso (gráficos)
- [ ] Internacionalización completa de la UI (i18n Angular)
- [ ] Sync con backend (Supabase) para multi-dispositivo
- [ ] Temporizador con vibración del dispositivo
- [ ] Planes de rutina predefinidos
- [ ] Exportar/importar rutinas (respaldo y migración entre dispositivos) — ver detalle abajo
- [ ] Modo offline completo con service worker

### 7.x — Exportar / importar rutinas (backup local)

Sin backend: permite respaldar y llevar las rutinas a otro dispositivo mediante un archivo JSON.

**Formato del archivo** (`gymapp-backup-AAAA-MM-DD.json`):
```json
{
  "app": "gymapp",
  "version": 1,
  "exportedAt": "2026-09-03T14:00:00.000Z",
  "days": [ /* contenido de gymapp_days */ ],
  "routines": [ /* contenido de gymapp_routines */ ]
}
```
- Incluir `version` para validar/migrar formatos futuros.
- No incluye el catálogo (`exercises.json`, es estático) ni el idioma (preferencia local).

**Exportar:**
- [ ] `RoutineService.exportData()` → devuelve el objeto de backup (días + rutinas).
- [ ] Web/desktop: descarga vía `Blob` + `<a download>`.
- [ ] Android (Capacitor): guardar/compartir el archivo con `@capacitor/filesystem` +
      `@capacitor/share` (plugins nuevos a instalar). Alternativa mínima: copiar el JSON al
      portapapeles con `@capacitor/clipboard`.

**Importar:**
- [ ] Selector de archivo (`<input type="file" accept="application/json">`) o pegar JSON.
- [ ] `RoutineService.importData(payload, mode)` con validación: comprobar `app`/`version` y
      forma de `days`/`routines`; rechazar con mensaje claro si no valida.
- [ ] Modo de importación: **reemplazar** (pisa lo actual) vs **fusionar** (añade días/rutinas).
      Empezar por *reemplazar* con confirmación; *fusionar* es opcional.
- [ ] Tras importar: escribir en localStorage y refrescar los signals (`days`/`routines`).

**UI:** botones "Exportar" / "Importar" en la pantalla de configuración (`/setup`), con
confirmación antes de reemplazar y toast de resultado.

**Tests (Vitest):** round-trip `exportData` → `importData` conserva días y rutinas; import
inválido no muta el estado; import con `version` desconocida se rechaza.

---

## Principios

1. **Offline-first** — La app debe funcionar sin internet. Los datos de ejercicios son locales.
2. **Progresivo** — Cada fase produce algo usable. No esperar a tener todo para probar.
3. **Mobile-first** — Diseñar primero para pantalla pequeña, escalar a desktop después.
4. **Sin over-engineering** — Usar localStorage hasta que se necesite algo más. No agregar backend si no es necesario.
5. **Testing desde el inicio** — Vitest para lógica de negocio (servicios, modelos). E2E para flujos críticos más adelante.
