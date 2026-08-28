# Referencia: PlanixFit

App de referencia que queremos replicar y mejorar en GymApp. Este documento describe cómo funciona para tenerlo siempre como guía.

## Stack de PlanixFit

| Capa | Tecnología |
|------|-----------|
| Framework | Angular 20 (standalone, zoneless) |
| Estilos | Tailwind CSS v4 |
| Backend | Supabase REST API (HTTP directo, sin SDK) |
| Mobile | Capacitor 7.4 (Android) |
| State | Angular Signals + localStorage cache |
| Selects | @ng-select/ng-select |
| Testing | Karma + Jasmine (sin tests reales) |

## Arquitectura

```
planix-fit/src/app/
├── api/
│   ├── environment.ts         # URL + key de Supabase
│   ├── day/
│   │   ├── day-api.ts         # Service: CRUD días
│   │   └── day-model.ts       # Interface: Day
│   └── sound/
│       └── sound-api.ts       # Service: reproducir audio
├── pages/
│   ├── home/                  # Página inicio
│   ├── routine-details/       # Ejecución de rutina (pantalla principal)
│   │   ├── routine-details.ts
│   │   ├── routine-details.html
│   │   ├── routine-details-api.ts   # Service co-localizado
│   │   └── routine-details-model.ts # Interfaces
│   ├── routine-setup/         # Config días activos
│   └── routine-details-setup/ # CRUD ejercicios por día
├── components/
│   ├── header/                # Header con hamburger
│   ├── menu/                  # Menú lateral slide-over
│   ├── icons/                 # SVG icons (Heroicons inline)
│   ├── exercise-item/         # Ejercicio durante entrenamiento
│   └── exercise-form/         # Formulario add/edit ejercicio
├── app.ts                     # Root component
├── app.html                   # <app-header> + <router-outlet>
├── app.config.ts              # Zoneless + HttpClient + Router + Locale ES
└── app.routes.ts              # 4 rutas + wildcard
```

## Rutas

```typescript
/home                         → Home (landing)
/routine-details/:day         → RoutineDetails (ejecución de rutina)
/routine-setup                → RoutineSetup (toggle días activos)
/routine-details-setup/:day   → RoutineDetailsSetup (CRUD ejercicios)
/**                           → redirect to 'home'
```

Todas usan **lazy loading** con `loadComponent`.

## Pantallas y Funcionalidad

### 1. Home (`/home`)
- Imagen decorativa + botón "Hacer rutina de hoy [Día]"
- Detecta el día de la semana actual con `new Date().getDay()`
- Navega a `/routine-details/:dayNumber`

### 2. Ejecución de Rutina (`/routine-details/:day`)
- Lista ejercicios del día en formato acordeón (uno expandido a la vez)
- Cada ejercicio muestra: nombre, reps, sets, unidad
- **Flujo de ejecución:**
  1. Se expande un ejercicio → muestra "Comienza la serie X de Y"
  2. Usuario toca "Terminé la serie" → inicia timer de descanso entre sets (`rest_time`, default 60s)
  3. Suena audio al terminar el descanso → pasa a siguiente serie
  4. Al completar todas las series → muestra "¡Ejercicio completado!"
  5. Inicia timer global de descanso entre ejercicios (`rest_time_set`, default 120s)
  6. Al terminar → se puede expandir el siguiente ejercicio

### 3. Configurar Rutina (`/routine-setup`)
- Lista los 7 días de la semana con checkbox para activar/desactivar
- Cada día tiene icono de engranaje que lleva al CRUD de ejercicios
- Persiste cambios en Supabase inmediatamente

### 4. CRUD Ejercicios (`/routine-details-setup/:day`)
- Lista los ejercicios asignados al día
- **Agregar:** Formulario con dropdown buscable (ng-select) del catálogo base, reps, sets, unidad (Repeticiones/Minutos), rest_time, rest_time_set
- **Editar:** Formulario inline con los mismos campos
- **Eliminar:** Confirmación con `confirm()`
- Botón de volver a routine-setup

### 5. Menú lateral
- Se abre con hamburger en el header
- Muestra: Inicio, días activos (como links a routine-details), Configurar rutina
- Full-screen overlay en mobile

## Modelo de Datos

### Tablas Supabase

```
┌─────────────────────────┐
│ days                    │
├─────────────────────────┤
│ id: number (1-7)        │
│ name: string            │
│ is_active: boolean      │
└─────────────────────────┘

┌─────────────────────────┐
│ exercises               │
├─────────────────────────┤
│ id: string              │
│ name: string            │
└─────────────────────────┘

┌─────────────────────────────┐
│ routine_exercises           │
├─────────────────────────────┤
│ id: number (PK)             │
│ routine_id: number (FK day) │
│ exercise_id: number (FK)    │
│ reps: number                │
│ sets: number                │
│ unit: string                │
│ rest_time: number (seg)     │
│ rest_time_set: number (seg) │
└─────────────────────────────┘
```

### Interfaces TypeScript

```typescript
interface Day {
  id: number;         // 1=Lunes ... 7=Domingo
  name: string;
  is_active: boolean;
}

interface ExerciseBase {
  id: string;
  name: string;
}

interface Exercise extends ExerciseBase {
  reps: number;
  sets: number;
  unit?: string;            // "Repeticiones" | "Minutos"
  rest_time: number;        // descanso entre sets (seg)
  rest_time_set: number;    // descanso después del ejercicio (seg)
}

interface DayRoutine {
  day: string;
  list: Exercise[];
}
```

## Patrones Técnicos

### State Management
- Services como singletons (`providedIn: 'root'`) con signals
- Patrón: cargar de Supabase → guardar en signal + localStorage
- En siguiente carga: leer de localStorage primero, Supabase como fallback
- `refreshSignal()` para invalidar cache manualmente

### Comunicación API
- HTTP directo con `HttpClient` (no Supabase SDK)
- Headers: `apikey` + `Authorization: Bearer <anon_key>`
- Prefer: `return=representation` para PATCH

### Componentes
- Input/Output para comunicación padre-hijo
- Un solo ejercicio expandido a la vez (acordeón controlado por padre)
- ExerciseForm reutilizable para add y edit (`[isEdit]` flag)

### Timer
- `setInterval` con cleanup en `ngOnDestroy`
- Timer local (dentro del ejercicio) para descanso entre sets
- Timer global (en el padre) para descanso entre ejercicios
- Audio notification via HTML5 `Audio` al terminar descanso

## Capacitor Config

```typescript
const config: CapacitorConfig = {
  appId: 'com.fernandev.planixfit',
  appName: 'PlanixFit',
  webDir: 'dist/planix-fit/browser',
};
```

## Qué mejorar en GymApp vs PlanixFit

| Aspecto | PlanixFit | GymApp (objetivo) |
|---------|-----------|-------------------|
| Catálogo | ~50 ejercicios en Supabase | 1324 ejercicios locales con imágenes y GIFs |
| Idiomas | Solo español (hardcoded) | 3 idiomas (en, es, pt-BR) con i18n |
| Backend | Supabase obligatorio | Offline-first (localStorage/IndexedDB) |
| Media | Sin imágenes ni demos | Thumbnails + GIFs animados |
| Instrucciones | No muestra | Paso a paso traducido |
| Error handling | Solo console.log | UI feedback para el usuario |
| Testing | Sin tests | Vitest desde el inicio |
| Angular version | 20 | 22 |
