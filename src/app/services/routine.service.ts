import { Injectable, signal, computed } from '@angular/core';
import { Day, DayRoutine, RoutineExercise, DEFAULT_DAYS, DEFAULT_EXERCISE_CONFIG } from '../models/routine.model';
import { Exercise } from '../models/exercise.model';

const STORAGE_KEYS = {
  DAYS: 'gymapp_days',
  ROUTINES: 'gymapp_routines'
} as const;

@Injectable({ providedIn: 'root' })
export class RoutineService {
  private days = signal<Day[]>(this.loadDays());
  private routines = signal<DayRoutine[]>(this.loadRoutines());

  /** Días de la semana con su estado activo/inactivo */
  readonly allDays = this.days.asReadonly();

  /** Solo los días activos */
  readonly activeDays = computed(() => this.days().filter(d => d.is_active));

  // --- Días ---

  toggleDay(dayId: number) {
    this.days.update(days =>
      days.map(d => d.id === dayId ? { ...d, is_active: !d.is_active } : d)
    );
    this.saveDays();
  }

  getDayName(dayId: number): string {
    return this.days().find(d => d.id === dayId)?.name ?? '';
  }

  // --- Rutinas ---

  getRoutine(dayId: number): RoutineExercise[] {
    const routine = this.routines().find(r => r.day_id === dayId);
    return routine?.exercises ?? [];
  }

  addExercise(dayId: number, exercise: Exercise): RoutineExercise {
    const newExercise: RoutineExercise = {
      id: crypto.randomUUID(),
      exercise_id: exercise.id,
      name: exercise.name,
      image: exercise.image,
      reps: DEFAULT_EXERCISE_CONFIG.reps,
      sets: DEFAULT_EXERCISE_CONFIG.sets,
      unit: DEFAULT_EXERCISE_CONFIG.unit,
      rest_time: DEFAULT_EXERCISE_CONFIG.rest_time,
      rest_time_set: DEFAULT_EXERCISE_CONFIG.rest_time_set,
      order: this.getRoutine(dayId).length
    };

    this.routines.update(routines => {
      const existing = routines.find(r => r.day_id === dayId);
      if (existing) {
        return routines.map(r =>
          r.day_id === dayId
            ? { ...r, exercises: [...r.exercises, newExercise] }
            : r
        );
      }
      return [...routines, { day_id: dayId, exercises: [newExercise] }];
    });
    this.saveRoutines();
    return newExercise;
  }

  updateExercise(dayId: number, exerciseId: string, changes: Partial<RoutineExercise>) {
    this.routines.update(routines =>
      routines.map(r =>
        r.day_id === dayId
          ? {
              ...r,
              exercises: r.exercises.map(e =>
                e.id === exerciseId ? { ...e, ...changes } : e
              )
            }
          : r
      )
    );
    this.saveRoutines();
  }

  removeExercise(dayId: number, exerciseId: string) {
    this.routines.update(routines =>
      routines.map(r =>
        r.day_id === dayId
          ? {
              ...r,
              exercises: r.exercises
                .filter(e => e.id !== exerciseId)
                .map((e, i) => ({ ...e, order: i }))
            }
          : r
      )
    );
    this.saveRoutines();
  }

  moveExercise(dayId: number, fromIndex: number, toIndex: number) {
    if (fromIndex === toIndex) return;

    this.routines.update(routines =>
      routines.map(r => {
        if (r.day_id !== dayId) return r;

        const exercises = [...r.exercises];
        const [moved] = exercises.splice(fromIndex, 1);
        exercises.splice(toIndex, 0, moved);

        return {
          ...r,
          exercises: exercises.map((e, i) => ({ ...e, order: i }))
        };
      })
    );
    this.saveRoutines();
  }

  // --- Persistencia ---

  private loadDays(): Day[] {
    const stored = localStorage.getItem(STORAGE_KEYS.DAYS);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return [...DEFAULT_DAYS];
      }
    }
    return [...DEFAULT_DAYS];
  }

  private loadRoutines(): DayRoutine[] {
    const stored = localStorage.getItem(STORAGE_KEYS.ROUTINES);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return [];
      }
    }
    return [];
  }

  private saveDays() {
    localStorage.setItem(STORAGE_KEYS.DAYS, JSON.stringify(this.days()));
  }

  private saveRoutines() {
    localStorage.setItem(STORAGE_KEYS.ROUTINES, JSON.stringify(this.routines()));
  }
}
