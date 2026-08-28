# Fases de Implementación

Desarrollo progresivo de GymApp, empezando con lo mínimo funcional y puliendo en cada fase.

---

## Fase 1 — Fundación y Navegación

**Objetivo:** Estructura base de la app con navegación funcionando.

- [ ] Configurar app.config.ts (provideRouter, provideHttpClient, locale ES)
- [ ] Crear layout base: Header + router-outlet
- [ ] Crear componente Header con título y hamburger
- [ ] Crear componente Menu lateral (slide-over)
- [ ] Definir rutas principales con lazy loading:
  - `/home` → Home
  - `/routine/:day` → Ejecución de rutina
  - `/setup` → Configurar días
  - `/setup/:day` → CRUD ejercicios del día
- [ ] Crear páginas placeholder para cada ruta
- [ ] Verificar navegación funciona en browser

**Resultado:** App navegable con estructura de pantallas vacías.

---

## Fase 2 — Servicio de Ejercicios y Selector

**Objetivo:** Tener el servicio de datos listo y el componente selector que se usará en la Fase 3 para armar rutinas. El catálogo no es una página independiente, sino un selector contextual dentro del flujo de creación de rutinas.

### 2.1 — Servicio de datos
- [ ] Crear interfaces TypeScript (Exercise, BodyPart, Equipment)
- [ ] Crear ExerciseService (providedIn: 'root')
- [ ] Cargar exercises.json vía HttpClient (una vez, cachear en signal)
- [ ] Métodos: getByBodyPart(part), search(term, bodyPart?), getById(id)
- [ ] Extraer lista de body_parts y equipments únicos para los filtros

### 2.2 — Componente Selector de Ejercicios
- [ ] Crear componente reutilizable ExerciseSelector (modal o slide-up)
- [ ] Paso 1: elegir body_part (grid de categorías con iconos/nombres)
- [ ] Paso 2: listado filtrado de ejercicios de esa categoría
- [ ] Búsqueda por nombre dentro de la categoría seleccionada
- [ ] Cada item muestra: thumbnail + nombre + equipment
- [ ] Virtual scroll si la categoría tiene muchos items
- [ ] Al seleccionar → emite el ejercicio elegido al padre
- [ ] Lazy load de thumbnails (solo los visibles)

### 2.3 — Vista previa del ejercicio
- [ ] Al tocar un ejercicio en el selector, mostrar detalle rápido
- [ ] GIF animado (carga solo cuando se abre la preview)
- [ ] Instrucciones paso a paso (español)
- [ ] Botón "Seleccionar este ejercicio" para confirmar

### 2.4 — Performance
- [ ] Verificar scroll fluido en las categorías más grandes
- [ ] Confirmar que el JSON se carga una sola vez y se reutiliza

**Resultado:** Servicio de datos funcionando + componente selector listo para ser integrado en el CRUD de rutinas (Fase 3).

---

## Fase 3 — Gestión de Rutinas (CRUD)

**Objetivo:** Configurar qué ejercicios hacer cada día.

- [ ] Definir modelo de datos para rutinas (localStorage/IndexedDB)
- [ ] Crear pantalla de configuración de días (toggle activo/inactivo)
- [ ] Crear pantalla de CRUD ejercicios por día:
  - Abrir ExerciseSelector (Fase 2) para elegir ejercicio
  - Configurar: reps, sets, unidad, rest_time, rest_time_set
  - Editar ejercicio existente
  - Eliminar con confirmación
  - Reordenar (drag & drop o flechas)
- [ ] Persistir en localStorage (offline-first)
- [ ] Menú lateral muestra solo días activos

**Resultado:** El usuario puede crear su rutina personalizada sin backend.

---

## Fase 4 — Ejecución de Rutina

**Objetivo:** Entrenar con la rutina del día, guiado por la app.

- [ ] Crear pantalla de ejecución de rutina
- [ ] Implementar acordeón de ejercicios (uno expandido a la vez)
- [ ] Mostrar serie actual y progreso
- [ ] Timer de descanso entre sets (configurable por ejercicio)
- [ ] Timer de descanso entre ejercicios
- [ ] Notificación sonora al terminar descanso
- [ ] Marcar ejercicio como completado
- [ ] Vista de resumen al terminar toda la rutina

**Resultado:** Experiencia de entrenamiento guiado, similar a PlanixFit.

---

## Fase 5 — Mobile (Capacitor)

**Objetivo:** Compilar a Android y optimizar para dispositivo.

- [ ] Instalar y configurar Capacitor (ver setup-capacitor.md)
- [ ] Generar íconos y splash screen
- [ ] Ajustar UI para pantallas móviles (safe areas, status bar)
- [ ] Probar en emulador y dispositivo real
- [ ] Optimizar GIFs (lazy load, solo el visible)
- [ ] Verificar que audio funciona en Android
- [ ] Generar APK de test

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
- [ ] Exportar/importar rutinas
- [ ] Modo offline completo con service worker

---

## Principios

1. **Offline-first** — La app debe funcionar sin internet. Los datos de ejercicios son locales.
2. **Progresivo** — Cada fase produce algo usable. No esperar a tener todo para probar.
3. **Mobile-first** — Diseñar primero para pantalla pequeña, escalar a desktop después.
4. **Sin over-engineering** — Usar localStorage hasta que se necesite algo más. No agregar backend si no es necesario.
5. **Testing desde el inicio** — Vitest para lógica de negocio (servicios, modelos). E2E para flujos críticos más adelante.
