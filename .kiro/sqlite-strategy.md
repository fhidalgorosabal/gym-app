# Estrategia de Datos: SQLite

## Decisión

Usar **SQLite** como base de datos local para persistir los datos del usuario (rutinas, configuración, historial de entrenamientos). Los datos se guardan en el dispositivo y nunca se pierden a menos que el usuario desinstale la app.

## Cómo funciona

| Plataforma | Motor | Almacenamiento |
|------------|-------|---------------|
| Android (Capacitor) | SQLite nativo | Archivo `.db` en el filesystem del dispositivo |
| Browser (desarrollo) | sql.js via `jeep-sqlite` | IndexedDB (emula SQLite en memoria + persiste en IndexedDB) |

**Mismo código, misma API** — el plugin `@capacitor-community/sqlite` abstrae la diferencia.

## Paquetes necesarios

```bash
npm install @capacitor-community/sqlite
npm install jeep-sqlite         # Solo para desarrollo web
```

## Setup para Angular (standalone, sin Ionic)

### 1. Copiar sql-wasm.wasm

Copiar `node_modules/sql.js/dist/sql-wasm.wasm` a `public/assets/`:

En `package.json`:
```json
"scripts": {
  "copy:sqlwasm": "copyfiles -u 3 node_modules/sql.js/dist/sql-wasm.wasm public/assets",
  "start": "npm run copy:sqlwasm && ng serve",
  "build": "npm run copy:sqlwasm && ng build"
}
```

```bash
npm install -D copyfiles
```

### 2. Registrar jeep-sqlite en main.ts

```typescript
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { defineCustomElements as jeepSqlite } from 'jeep-sqlite/loader';

// Registrar web component para browser
jeepSqlite(window);

bootstrapApplication(App, appConfig);
```

### 3. Agregar jeep-sqlite al DOM (solo en browser)

En `app.html`:
```html
@if (isWeb) {
  <jeep-sqlite></jeep-sqlite>
}
<router-outlet />
```

En `app.ts`:
```typescript
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class App {
  isWeb = Capacitor.getPlatform() === 'web';
}
```

### 4. Crear DatabaseService

```typescript
import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import {
  CapacitorSQLite,
  SQLiteConnection,
  SQLiteDBConnection,
} from '@capacitor-community/sqlite';

@Injectable({ providedIn: 'root' })
export class DatabaseService {
  private sqlite = new SQLiteConnection(CapacitorSQLite);
  private db!: SQLiteDBConnection;
  private initialized = false;

  async initialize(): Promise<void> {
    if (this.initialized) return;

    const platform = Capacitor.getPlatform();

    if (platform === 'web') {
      await customElements.whenDefined('jeep-sqlite');
      await this.sqlite.initWebStore();
    }

    this.db = await this.sqlite.createConnection(
      'gymapp',      // nombre de la DB
      false,         // no encryption
      'no-encryption',
      1              // versión
    );

    await this.db.open();
    await this.createTables();
    this.initialized = true;
  }

  private async createTables(): Promise<void> {
    const schema = `
      CREATE TABLE IF NOT EXISTS days (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        is_active INTEGER DEFAULT 1
      );

      CREATE TABLE IF NOT EXISTS routine_exercises (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        day_id INTEGER NOT NULL,
        exercise_id TEXT NOT NULL,
        reps INTEGER DEFAULT 10,
        sets INTEGER DEFAULT 3,
        unit TEXT DEFAULT 'Repeticiones',
        rest_time INTEGER DEFAULT 60,
        rest_time_set INTEGER DEFAULT 120,
        sort_order INTEGER DEFAULT 0,
        FOREIGN KEY (day_id) REFERENCES days(id)
      );

      CREATE TABLE IF NOT EXISTS workout_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        day_id INTEGER NOT NULL,
        started_at TEXT NOT NULL,
        finished_at TEXT,
        FOREIGN KEY (day_id) REFERENCES days(id)
      );

      CREATE TABLE IF NOT EXISTS workout_sets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        workout_id INTEGER NOT NULL,
        exercise_id TEXT NOT NULL,
        set_number INTEGER NOT NULL,
        completed_at TEXT NOT NULL,
        FOREIGN KEY (workout_id) REFERENCES workout_history(id)
      );
    `;

    await this.db.execute(schema);
  }

  async run(sql: string, values?: any[]): Promise<any> {
    return this.db.run(sql, values);
  }

  async query(sql: string, values?: any[]): Promise<any[]> {
    const result = await this.db.query(sql, values);
    return result.values ?? [];
  }

  async close(): Promise<void> {
    await this.db.close();
    if (Capacitor.getPlatform() === 'web') {
      await this.sqlite.saveToStore('gymapp');
    }
  }
}
```

## Esquema de Base de Datos

```sql
-- Días de la semana (se insertan una vez)
CREATE TABLE days (
  id INTEGER PRIMARY KEY,        -- 1=Lunes ... 7=Domingo
  name TEXT NOT NULL,
  is_active INTEGER DEFAULT 1    -- 0=inactivo, 1=activo
);

-- Ejercicios asignados a cada día (rutina del usuario)
CREATE TABLE routine_exercises (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  day_id INTEGER NOT NULL,
  exercise_id TEXT NOT NULL,      -- referencia al ID del exercises.json
  reps INTEGER DEFAULT 10,
  sets INTEGER DEFAULT 3,
  unit TEXT DEFAULT 'Repeticiones',  -- "Repeticiones" | "Minutos"
  rest_time INTEGER DEFAULT 60,      -- descanso entre sets (seg)
  rest_time_set INTEGER DEFAULT 120, -- descanso entre ejercicios (seg)
  sort_order INTEGER DEFAULT 0,
  FOREIGN KEY (day_id) REFERENCES days(id)
);

-- Historial de entrenamientos
CREATE TABLE workout_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  day_id INTEGER NOT NULL,
  started_at TEXT NOT NULL,       -- ISO 8601
  finished_at TEXT,               -- NULL si no terminó
  FOREIGN KEY (day_id) REFERENCES days(id)
);

-- Sets completados en un entrenamiento
CREATE TABLE workout_sets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  workout_id INTEGER NOT NULL,
  exercise_id TEXT NOT NULL,
  set_number INTEGER NOT NULL,
  completed_at TEXT NOT NULL,
  FOREIGN KEY (workout_id) REFERENCES workout_history(id)
);
```

## Datos iniciales (seed)

Insertar los 7 días al inicializar la DB por primera vez:

```sql
INSERT OR IGNORE INTO days (id, name) VALUES
  (1, 'Lunes'),
  (2, 'Martes'),
  (3, 'Miércoles'),
  (4, 'Jueves'),
  (5, 'Viernes'),
  (6, 'Sábado'),
  (7, 'Domingo');
```

## Nota sobre el catálogo de ejercicios

El catálogo de 1324 ejercicios **NO** va en SQLite. Se mantiene en `exercises.json` y se carga en memoria como lectura. Solo los IDs de ejercicios seleccionados por el usuario se guardan en `routine_exercises.exercise_id`.

Razón: el JSON es estático, grande (4.86 MB), y no necesita queries complejos. Cargarlo en SQLite sería lento y duplicaría datos.

## Migraciones futuras

Para versiones futuras de la DB, incrementar el número de versión y agregar un sistema de migración:

```typescript
// Versión 1: schema inicial
// Versión 2: agregar campo "weight" a workout_sets
// etc.
```

## Resumen de flujo

```
[Catálogo exercises.json] → solo lectura, en memoria
                              ↓ (usuario selecciona ejercicios)
[SQLite: routine_exercises] → rutina personalizada del usuario
[SQLite: days]              → config de días activos
[SQLite: workout_history]   → historial de entrenamientos
[SQLite: workout_sets]      → detalle de cada set completado
```
