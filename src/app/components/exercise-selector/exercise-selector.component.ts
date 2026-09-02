import { Component, computed, inject, input, output, signal, OnInit } from '@angular/core';
import { Exercise, BodyPart, BODY_PARTS } from '../../models/exercise.model';
import { ExerciseService } from '../../services/exercise.service';
import { LanguageService } from '../../services/language.service';
import { ExercisePreviewComponent } from '../exercise-preview/exercise-preview.component';
import { CapitalizePipe } from '../../pipes/capitalize.pipe';

@Component({
  selector: 'app-exercise-selector',
  imports: [ExercisePreviewComponent, CapitalizePipe],
  template: `
    @if (open()) {
      <!-- Backdrop -->
      <div class="fixed inset-0 z-50 bg-black/50" (click)="close()"></div>

      <!-- Panel slide-up -->
      <div class="fixed inset-x-0 bottom-0 z-50 flex max-h-[90vh] flex-col rounded-t-2xl bg-white shadow-xl">
        <!-- Header -->
        <div class="flex items-center gap-2 border-b px-4 py-3">
          @if (selectedBodyPart() || previewExercise()) {
            <button
              (click)="headerBack()"
              class="-ml-1 rounded-lg p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-800"
              [attr.aria-label]="lang.t('back')"
            >
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          }
          <h2 class="min-w-0 flex-1 truncate text-lg font-bold text-gray-800">
            @if (previewExercise(); as ex) {
              {{ lang.exerciseName(ex) | capitalize }}
            } @else if (selectedBodyPart()) {
              {{ getBodyPartLabel(selectedBodyPart()!) }}
            } @else {
              {{ lang.t('selector.title') }}
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
          @if (previewExercise(); as ex) {
            <!-- Paso 3: Detalle del ejercicio (embebido en el mismo panel) -->
            <app-exercise-preview
              [exercise]="ex"
              (confirmed)="confirmExercise($event)"
              (closed)="closePreview()"
            />
          } @else if (!selectedBodyPart()) {
            <!-- Paso 1: Elegir body_part -->
            <div class="grid grid-cols-2 gap-3 p-4">
              @for (part of bodyParts; track part) {
                <button
                  (click)="selectBodyPart(part)"
                  class="flex flex-col items-center justify-center rounded-xl border-2 border-gray-200 p-4 transition-all hover:border-red-500 hover:bg-red-50 active:scale-95"
                >
                  @if (getBodyPartImage(part); as img) {
                    <img
                      [src]="img"
                      [alt]="getBodyPartLabel(part)"
                      loading="lazy"
                      decoding="async"
                      class="h-12 w-12 object-contain"
                    />
                  } @else {
                    <span class="flex h-12 w-12 items-center justify-center text-3xl">{{ getBodyPartFallbackIcon(part) }}</span>
                  }
                  <span class="mt-1 text-sm font-medium text-gray-700">{{ getBodyPartLabel(part) }}</span>
                  <span class="text-xs text-gray-400">{{ getExerciseCount(part) }} {{ lang.t('exercises') }}</span>
                </button>
              }
            </div>
          } @else {
            <!-- Paso 2: Listado de ejercicios de esa categoría -->
            <div class="sticky top-0 z-10 bg-white px-4 py-2 shadow-sm">
              <!-- Búsqueda -->
              <div class="flex items-center gap-2">
                <input
                  type="text"
                  [placeholder]="lang.t('selector.search')"
                  [value]="searchTerm()"
                  (input)="onSearch($event)"
                  class="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                />
              </div>
              <p class="mt-1 text-xs text-gray-400">{{ filteredExercises().length }} {{ lang.t('exercises') }}</p>
            </div>

            <!-- Lista de ejercicios -->
            <ul class="divide-y divide-gray-100 px-4">
              @for (exercise of filteredExercises(); track exercise.id) {
                <li>
                  <button
                    (click)="selectExercise(exercise)"
                    class="flex w-full items-center gap-3 py-3 text-left transition-colors hover:bg-gray-50 active:bg-red-50"
                  >
                    <img
                      [src]="exercise.image"
                      [alt]="exercise.name"
                      loading="lazy"
                      decoding="async"
                      class="h-12 w-12 rounded-lg bg-gray-100 object-cover"
                    />
                    <div class="min-w-0 flex-1">
                      <p class="truncate text-sm font-medium text-gray-800">{{ lang.exerciseName(exercise) | capitalize }}</p>
                      <p class="text-xs text-gray-500">{{ lang.term(exercise.equipment) }} · {{ lang.term(exercise.target) }}</p>
                    </div>
                    <svg class="h-5 w-5 flex-shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </li>
              } @empty {
                <li class="py-8 text-center text-gray-400">
                  {{ lang.t('selector.noResults') }}
                </li>
              }
            </ul>
          }
        </div>
      </div>
    }
  `
})
export class ExerciseSelectorComponent implements OnInit {
  open = input.required<boolean>();
  exerciseSelected = output<Exercise>();
  closed = output<void>();

  readonly bodyParts = BODY_PARTS;
  readonly lang = inject(LanguageService);

  selectedBodyPart = signal<BodyPart | null>(null);
  searchTerm = signal('');
  previewExercise = signal<Exercise | null>(null);

  filteredExercises = computed(() => {
    const part = this.selectedBodyPart();
    if (!part) return [];
    return this.exerciseService.search(this.searchTerm(), part, this.lang.lang());
  });

  constructor(private exerciseService: ExerciseService) {}

  ngOnInit() {
    if (!this.exerciseService.isLoaded()) {
      this.exerciseService.load();
    }
  }

  getBodyPartLabel(part: BodyPart): string {
    return this.lang.bodyPartLabel(part);
  }

  /** Ruta de la imagen de cada categoría. `null` si no tiene imagen (se usa emoji de respaldo). */
  getBodyPartImage(part: BodyPart): string | null {
    const images: Partial<Record<BodyPart, string>> = {
      back: 'images/tipos/espalda.png',
      chest: 'images/tipos/pecho.png',
      'lower arms': 'images/tipos/antebrazos.png',
      'lower legs': 'images/tipos/pantorrillas.png',
      neck: 'images/tipos/cuello.png',
      shoulders: 'images/tipos/hombros.png',
      'upper arms': 'images/tipos/brazos.png',
      'upper legs': 'images/tipos/piernas.png',
      waist: 'images/tipos/abdomen.png'
    };
    return images[part] ?? null;
  }

  /** Emoji de respaldo para categorías sin imagen (p. ej. cardio). */
  getBodyPartFallbackIcon(part: BodyPart): string {
    const icons: Partial<Record<BodyPart, string>> = {
      cardio: '❤️'
    };
    return icons[part] ?? '🏋️';
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

  /** Retrocede un paso: detalle → lista → categorías. */
  headerBack() {
    if (this.previewExercise()) {
      this.previewExercise.set(null);
      return;
    }
    this.goBack();
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
