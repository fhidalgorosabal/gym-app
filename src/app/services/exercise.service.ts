import { Injectable, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Exercise, BodyPart } from '../models/exercise.model';
import { Lang } from './language.service';

@Injectable({ providedIn: 'root' })
export class ExerciseService {
  private exercises = signal<Exercise[]>([]);
  private loaded = signal(false);

  /** Todas las opciones de equipment extraídas del JSON */
  readonly equipments = computed(() => {
    const set = new Set(this.exercises().map(e => e.equipment));
    return [...set].sort();
  });

  constructor(private http: HttpClient) {}

  /** Carga el JSON una sola vez. Si ya está cargado, no hace nada. */
  load(): Promise<void> {
    if (this.loaded()) return Promise.resolve();

    return new Promise((resolve, reject) => {
      this.http.get<Exercise[]>('data/exercises.json').subscribe({
        next: data => {
          this.exercises.set(data);
          this.loaded.set(true);
          resolve();
        },
        error: err => reject(err)
      });
    });
  }

  /** Verifica si los datos ya están cargados */
  isLoaded(): boolean {
    return this.loaded();
  }

  /** Obtiene todos los ejercicios */
  getAll(): Exercise[] {
    return this.exercises();
  }

  /** Obtiene un ejercicio por ID */
  getById(id: string): Exercise | undefined {
    return this.exercises().find(e => e.id === id);
  }

  /** Filtra ejercicios por body_part */
  getByBodyPart(bodyPart: BodyPart): Exercise[] {
    return this.exercises().filter(e => e.body_part === bodyPart);
  }

  /**
   * Busca por nombre (case-insensitive), opcionalmente dentro de un body_part.
   * Si se pasa `lang`, también busca en el nombre traducido (`name_i18n[lang]`),
   * además del nombre base en inglés (`name`).
   */
  search(term: string, bodyPart?: BodyPart, lang?: Lang): Exercise[] {
    const normalized = term.toLowerCase().trim();
    if (!normalized) {
      return bodyPart ? this.getByBodyPart(bodyPart) : this.exercises();
    }

    let source = bodyPart ? this.getByBodyPart(bodyPart) : this.exercises();
    return source.filter(e => {
      if (e.name.toLowerCase().includes(normalized)) return true;
      const translated = lang ? e.name_i18n?.[lang] : undefined;
      return !!translated && translated.toLowerCase().includes(normalized);
    });
  }

  /** Filtra por body_part y opcionalmente por equipment */
  filter(bodyPart: BodyPart, equipment?: string): Exercise[] {
    let results = this.getByBodyPart(bodyPart);
    if (equipment) {
      results = results.filter(e => e.equipment === equipment);
    }
    return results;
  }
}
