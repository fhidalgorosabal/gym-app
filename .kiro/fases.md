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

## Fase 2 — Catálogo de Ejercicios (lectura)

**Objetivo:** Poder ver y buscar los 1324 ejercicios disponibles.

- [ ] Crear servicio ExerciseService que carga `exercises.json`
- [ ] Crear página/componente de catálogo de ejercicios
- [ ] Implementar listado con imágenes (thumbnail)
- [ ] Implementar búsqueda por nombre
- [ ] Implementar filtros por body_part y equipment
- [ ] Crear vista de detalle de ejercicio (instrucciones + GIF animado)
- [ ] Considerar virtualización si la lista es lenta (CDK Virtual Scroll)

**Resultado:** Se puede explorar todo el catálogo, buscar y ver detalles con GIF.

---

## Fase 3 — Gestión de Rutinas (CRUD)

**Objetivo:** Configurar qué ejercicios hacer cada día.

- [ ] Definir modelo de datos para rutinas (localStorage/IndexedDB)
- [ ] Crear pantalla de configuración de días (toggle activo/inactivo)
- [ ] Crear pantalla de CRUD ejercicios por día:
  - Agregar ejercicio (selector del catálogo)
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
