import { Component, computed, input, output, signal, OnInit } from '@angular/core';
import { Exercise, BodyPart, BODY_PARTS, BODY_PART_LABELS } from '../../models/exercise.model';
import { ExerciseService } from '../../services/exercise.service';
import { ExercisePreviewComponent } from '../exercise-preview/exercise-preview.component';

@Component({
  selector: 'app-exercise-selector',
  imports: [ExercisePreviewComponent],
  template: `
    @if (open()) {
      <!-- Backdrop -->
      <div class="fixed inset-0 z-50 bg-black/50" (click)="close()"></div>

      <!-- Panel slide-up -->
      <div class="fixed inset-x-0 bottom-0 z-50 flex max-h-[90vh] flex-col rounded-t-2xl bg-white shadow-xl">
        <!-- Header -->
        <div class="flex items-center justify-between border-b px-4 py-3">
          <h2 class="text-lg font-bold text-gray-800">
            @if (selectedBodyPart()) {
              {{ getBodyPartLabel(selectedBodyPart()!) }}
            } @else {
              Seleccionar ejercicio
            }
          </h2>
          <button
            (click)="close()"
            aria-label="Cerrar selector"
            class="rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-800"
          >
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Contenido -->
        <div class="flex-1 overflow-y-auto">
          @if (!selectedBodyPart()) {
            <!-- Paso 1: Elegir body_part -->
            <div class="grid grid-cols-2 gap-3 p-4">
              @for (part of bodyParts; track part) {
                <button
                  (click)="selectBodyPart(part)"
                  class="flex flex-col items-center justify-center rounded-xl border-2 border-gray-200 p-4 transition-all hover:border-indigo-500 hover:bg-indigo-50 active:scale-95"
                >
                  <span class="text-2xl">{{ getBodyPartIcon(part) }}</span>
                  <span class="mt-1 text-sm font-medium text-gray-700">{{ getBodyPartLabel(part) }}</span>
                  <span class="text-xs text-gray-400">{{ getExerciseCount(part) }} ejercicios</span>
                </button>
              }
            </div>
          } @else {
            <!-- Paso 2: Listado de ejercicios de esa categoría -->
            <div class="sticky top-0 z-10 bg-white px-4 py-2 shadow-sm">
              <!-- Botón volver + búsqueda -->
              <div class="flex items-center gap-2">
                <button
                  (click)="goBack()"
                  class="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                  aria-label="Volver a categorías"
                >
                  <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <input
                  type="text"
                  placeholder="Buscar ejercicio..."
                  [value]="searchTerm()"
                  (input)="onSearch($event)"
                  class="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <p class="mt-1 text-xs text-gray-400">{{ filteredExercises().length }} ejercicios</p>
            </div>

            <!-- Lista de ejercicios -->
            <ul class="divide-y divide-gray-100 px-4">
              @for (exercise of filteredExercises(); track exercise.id) {
                <li>
                  <button
                    (click)="selectExercise(exercise)"
                    class="flex w-full items-center gap-3 py-3 text-left transition-colors hover:bg-gray-50 active:bg-indigo-50"
                  >
                    <img
                      [src]="exercise.image"
                      [alt]="exercise.name"
                      loading="lazy"
                      class="h-12 w-12 rounded-lg bg-gray-100 object-cover"
                    />
                    <div class="min-w-0 flex-1">
                      <p class="truncate text-sm font-medium text-gray-800">{{ exercise.name }}</p>
                      <p class="text-xs text-gray-500">{{ exercise.equipment }} · {{ exercise.target }}</p>
                    </div>
                    <svg class="h-5 w-5 flex-shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </li>
              } @empty {
                <li class="py-8 text-center text-gray-400">
                  No se encontraron ejercicios
                </li>
              }
            </ul>
          }
        </div>
      </div>

      <!-- Preview modal -->
      <app-exercise-preview
        [exercise]="previewExercise()"
        (confirmed)="confirmExercise($event)"
        (closed)="closePreview()"
      />
    }
  `
})
export class ExerciseSelectorComponent implements OnInit {
  open = input.required<boolean>();
  exerciseSelected = output<Exercise>();
  closed = output<void>();

  readonly bodyParts = BODY_PARTS;

  selectedBodyPart = signal<BodyPart | null>(null);
  searchTerm = signal('');
  previewExercise = signal<Exercise | null>(null);

  filteredExercises = computed(() => {
    const part = this.selectedBodyPart();
    if (!part) return [];
    return this.exerciseService.search(this.searchTerm(), part);
  });

  constructor(private exerciseService: ExerciseService) {}

  ngOnInit() {
    if (!this.exerciseService.isLoaded()) {
      this.exerciseService.load();
    }
  }

  getBodyPartLabel(part: BodyPart): string {
    return BODY_PART_LABELS[part];
  }

  getBodyPartIcon(part: BodyPart): string {
    const icons: Record<BodyPart, string> = {
      back: '🔙',
      cardio: '❤️',
      chest: '💪',
      'lower arms': '🤜',
      'lower legs': '🦵',
      neck: '🧣',
      shoulders: '🏋️',
      'upper arms': '💪',
      'upper legs': '🦿',
      waist: '🎯'
    };
    return icons[part];
  }

  getExerciseCount(part: BodyPart): number {
    return this.exerciseService.getByBodyPart(part).length;
  }

  selectBodyPart(part: BodyPart) {
    this.selectedBodyPart.set(part);
    this.searchTerm.set('');
  }

  goBack() {
    this.selectedBodyPart.set(null);
    this.searchTerm.set('');
  }

  onSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm.set(value);
  }

  selectExercise(exercise: Exercise) {
    this.previewExercise.set(exercise);
  }

  confirmExercise(exercise: Exercise) {
    this.previewExercise.set(null);
    this.exerciseSelected.emit(exercise);
  }

  closePreview() {
    this.previewExercise.set(null);
  }

  close() {
    this.selectedBodyPart.set(null);
    this.searchTerm.set('');
    this.previewExercise.set(null);
    this.closed.emit();
  }
}
