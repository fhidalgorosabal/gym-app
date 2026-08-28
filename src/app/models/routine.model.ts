export interface Day {
  id: number; // 1=Lunes, 2=Martes, ..., 7=Domingo
  name: string;
  is_active: boolean;
}

export interface RoutineExercise {
  id: string; // UUID generado al agregar
  exercise_id: string; // ID del ejercicio del catálogo
  name: string; // Nombre del ejercicio (copiado para acceso rápido)
  image: string; // Path al thumbnail
  reps: number;
  sets: number;
  unit: 'Repeticiones' | 'Minutos';
  rest_time: number; // descanso entre sets (segundos)
  rest_time_set: number; // descanso después del ejercicio (segundos)
  order: number; // posición en la lista
}

export interface DayRoutine {
  day_id: number;
  exercises: RoutineExercise[];
}

export type Unit = 'Repeticiones' | 'Minutos';

/** Días de la semana con su configuración por defecto */
export const DEFAULT_DAYS: Day[] = [
  { id: 1, name: 'Lunes', is_active: false },
  { id: 2, name: 'Martes', is_active: false },
  { id: 3, name: 'Miércoles', is_active: false },
  { id: 4, name: 'Jueves', is_active: false },
  { id: 5, name: 'Viernes', is_active: false },
  { id: 6, name: 'Sábado', is_active: false },
  { id: 7, name: 'Domingo', is_active: false }
];

/** Valores por defecto al agregar un ejercicio */
export const DEFAULT_EXERCISE_CONFIG: Pick<RoutineExercise, 'reps' | 'sets' | 'unit' | 'rest_time' | 'rest_time_set'> = {
  reps: 12,
  sets: 3,
  unit: 'Repeticiones',
  rest_time: 60,
  rest_time_set: 120
};
