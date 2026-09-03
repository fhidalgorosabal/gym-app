import { Component, computed, inject, input, signal, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { RoutineService } from '../../services/routine.service';
import { SoundService } from '../../services/sound.service';
import { LanguageService } from '../../services/language.service';
import { ExerciseService } from '../../services/exercise.service';
import { RoutineExercise } from '../../models/routine.model';
import { Exercise } from '../../models/exercise.model';
import { CapitalizePipe } from '../../pipes/capitalize.pipe';
import { ExercisePreviewComponent } from '../../components/exercise-preview/exercise-preview.component';

type RoutineState = 'ready' | 'exercising' | 'resting-set' | 'resting-exercise' | 'completed';

interface ExerciseProgress {
  exerciseId: string;
  currentSet: number;
  totalSets: number;
  completed: boolean;
}

@Component({
  selector: 'app-routine',
  imports: [CapitalizePipe, ExercisePreviewComponent],
  template: `
    <div class="p-4">
      @switch (routineState()) {
        @case ('completed') {
          <!-- RESUMEN FINAL -->
          <div class="flex min-h-[70vh] flex-col items-center justify-center text-center">
            <div class="text-6xl">🎉</div>
            <h2 class="mt-4 text-2xl font-bold text-gray-800">{{ lang.t('routine.completedTitle') }}</h2>
            <p class="mt-2 text-gray-500">{{ dayName() }}</p>

            <div class="mt-6 grid w-full max-w-xs grid-cols-2 gap-4">
              <div class="rounded-xl bg-red-50 p-4 text-center">
                <p class="text-2xl font-bold text-red-600">{{ exercises().length }}</p>
                <p class="text-xs text-gray-500">{{ lang.t('routine.exercisesLabel') }}</p>
              </div>
              <div class="rounded-xl bg-green-50 p-4 text-center">
                <p class="text-2xl font-bold text-green-600">{{ totalSetsCompleted() }}</p>
                <p class="text-xs text-gray-500">{{ lang.t('routine.totalSets') }}</p>
              </div>
              <div class="col-span-2 rounded-xl bg-amber-50 p-4 text-center">
                <p class="text-2xl font-bold text-amber-600">{{ formatTime(elapsedTime()) }}</p>
                <p class="text-xs text-gray-500">{{ lang.t('routine.totalTime') }}</p>
              </div>
            </div>

            <button
              (click)="goHome()"
              class="mt-8 rounded-xl bg-red-600 px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-red-700"
            >
              {{ lang.t('routine.backHome') }}
            </button>
          </div>
        }

        @default {
          @if (exercises().length === 0) {
            <!-- ESTADO VACÍO: día sin ejercicios -->
            <div class="flex min-h-[70vh] flex-col items-center justify-center text-center">
              <div class="flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
                <svg class="h-8 w-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 class="mt-4 text-lg font-bold text-gray-800">{{ dayName() }}</h2>
              <p class="mt-1 text-sm text-gray-500">{{ lang.t('routine.emptyTitle') }}</p>
              <button
                (click)="goToConfigure()"
                class="mt-6 rounded-xl bg-red-600 px-8 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-red-700 active:bg-red-800"
              >
                {{ lang.t('routine.configureDay') }}
              </button>
            </div>
          } @else {
          <!-- HEADER DE RUTINA -->
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-xl font-bold text-gray-800">{{ dayName() }}</h2>
              <p class="text-sm text-gray-500">
                {{ completedExercises() }}/{{ exercises().length }} {{ lang.t('exercises') }}
              </p>
            </div>
            <span class="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
              {{ formatTime(elapsedTime()) }}
            </span>
          </div>

          <!-- Barra de progreso general -->
          <div class="mt-3 h-2 overflow-hidden rounded-full bg-gray-200">
            <div
              class="h-full rounded-full bg-red-600 transition-all duration-300"
              [style.width.%]="overallProgress()"
            ></div>
          </div>

          <!-- TIMER DE DESCANSO (cuando está activo) -->
          @if (routineState() === 'resting-set' || routineState() === 'resting-exercise') {
            <div class="mt-4 rounded-2xl bg-red-600 p-6 text-center text-white shadow-lg">
              <p class="text-sm font-medium opacity-80">
                {{ routineState() === 'resting-set' ? lang.t('routine.restBetweenSets') : lang.t('routine.restBetweenExercises') }}
              </p>
              <p class="mt-2 text-5xl font-bold tabular-nums">{{ formatTime(restTimeRemaining()) }}</p>
              <div class="mt-3 h-1.5 overflow-hidden rounded-full bg-white/20">
                <div
                  class="h-full rounded-full bg-white transition-all duration-1000"
                  [style.width.%]="restProgress()"
                ></div>
              </div>
              <button
                (click)="skipRest()"
                class="mt-4 rounded-lg bg-white/20 px-4 py-2 text-sm font-medium hover:bg-white/30"
              >
                {{ lang.t('routine.skipRest') }}
              </button>
            </div>
          }

          <!-- ACORDEÓN DE EJERCICIOS -->
          <ul class="mt-4 space-y-2">
            @for (exercise of exercises(); track exercise.id; let i = $index) {
              <li class="overflow-hidden rounded-xl border bg-white shadow-sm">
                <!-- Cabecera (siempre visible) -->
                <div class="flex items-center" [class.bg-red-50]="expandedIndex() === i">
                  <button
                    (click)="expandExercise(i)"
                    class="flex min-w-0 flex-1 items-center gap-3 px-4 py-3 text-left transition-colors"
                    [disabled]="routineState() === 'resting-set' || routineState() === 'resting-exercise'"
                  >
                    <!-- Estado -->
                    <div class="flex h-8 w-8 items-center justify-center rounded-full"
                      [class.bg-green-100]="getProgress(exercise.id).completed"
                      [class.bg-red-100]="expandedIndex() === i && !getProgress(exercise.id).completed"
                      [class.bg-gray-100]="expandedIndex() !== i && !getProgress(exercise.id).completed"
                    >
                      @if (getProgress(exercise.id).completed) {
                        <svg class="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      } @else {
                        <span class="text-xs font-bold"
                          [class.text-red-600]="expandedIndex() === i"
                          [class.text-gray-400]="expandedIndex() !== i"
                        >{{ i + 1 }}</span>
                      }
                    </div>

                    <!-- Info -->
                    <img
                      [src]="exercise.image"
                      [alt]="exercise.name"
                      class="h-10 w-10 rounded-lg bg-gray-100 object-cover"
                    />
                    <div class="min-w-0 flex-1">
                      <p class="truncate text-sm font-medium text-gray-800">{{ exercise.name | capitalize }}</p>
                      <p class="text-xs text-gray-500">
                        {{ getProgress(exercise.id).currentSet }}/{{ exercise.sets }} {{ lang.t('routine.series') }} · {{ exercise.reps }} {{ exercise.unit === 'Repeticiones' ? lang.t('unit.repetitionsShort') : lang.t('unit.minutesShort') }}
                      </p>
                    </div>
                  </button>

                  <!-- Ver detalles del ejercicio (GIF + instrucciones) -->
                  <button
                    (click)="openDetail(exercise)"
                    [attr.aria-label]="lang.t('routine.viewDetails')"
                    class="mr-2 flex-shrink-0 rounded-full p-2 text-red-600 hover:bg-red-50 hover:text-red-700"
                  >
                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                </div>

                <!-- Contenido expandido -->
                @if (expandedIndex() === i && !getProgress(exercise.id).completed) {
                  <div class="border-t bg-gray-50 px-4 py-4">
                    <!-- Indicador de serie actual -->
                    <div class="text-center">
                      <p class="text-sm text-gray-500">{{ lang.t('routine.currentSet') }}</p>
                      <p class="text-3xl font-bold text-red-600">
                        {{ getProgress(exercise.id).currentSet + 1 }}
                        <span class="text-lg text-gray-400">/ {{ exercise.sets }}</span>
                      </p>
                      <p class="mt-1 text-sm text-gray-600">
                        {{ exercise.reps }} {{ exercise.unit === 'Repeticiones' ? lang.t('routine.repetitions') : lang.t('routine.minutes') }}
                      </p>
                    </div>

                    <!-- Indicadores de series (dots) -->
                    <div class="mt-3 flex justify-center gap-2">
                      @for (s of getSetsArray(exercise.sets); track $index) {
                        <div
                          class="h-3 w-3 rounded-full"
                          [class.bg-green-500]="$index < getProgress(exercise.id).currentSet"
                          [class.bg-red-500]="$index === getProgress(exercise.id).currentSet"
                          [class.bg-gray-300]="$index > getProgress(exercise.id).currentSet"
                        ></div>
                      }
                    </div>

                    <!-- Botón completar serie -->
                    <button
                      (click)="completeSet(exercise)"
                      [disabled]="routineState() === 'resting-set' || routineState() === 'resting-exercise'"
                      class="mt-4 w-full rounded-xl bg-red-600 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-red-700 active:bg-red-800 disabled:opacity-50"
                    >
                      @if (getProgress(exercise.id).currentSet + 1 >= exercise.sets) {
                        {{ lang.t('routine.finishLastSet') }}
                      } @else {
                        {{ lang.t('routine.finishSet') }}
                      }
                    </button>
                  </div>
                }

                <!-- Ejercicio completado -->
                @if (getProgress(exercise.id).completed) {
                  <div class="border-t bg-green-50 px-4 py-2 text-center">
                    <p class="text-sm font-medium text-green-700">{{ lang.t('routine.exerciseCompleted') }}</p>
                  </div>
                }
              </li>
            }
          </ul>
          }
        }
      }

      <!-- PANEL DE DETALLE DEL EJERCICIO (GIF + instrucciones, solo consulta) -->
      @if (detailExercise(); as ex) {
        <div class="fixed inset-0 z-50 bg-black/50" (click)="closeDetail()"></div>
        <div class="fixed inset-x-0 bottom-0 z-50 flex max-h-[90vh] flex-col rounded-t-2xl bg-white shadow-xl">
          <div class="flex items-center gap-2 border-b px-4 py-3">
            <h2 class="min-w-0 flex-1 truncate text-lg font-bold text-gray-800">{{ lang.exerciseName(ex) | capitalize }}</h2>
            <button
              (click)="closeDetail()"
              [attr.aria-label]="lang.t('close')"
              class="rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-800"
            >
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="flex-1 overflow-y-auto pb-safe-4">
            <app-exercise-preview [exercise]="ex" [showConfirm]="false" />
          </div>
        </div>
      }
    </div>
  `
})
export default class RoutinePage implements OnInit, OnDestroy {
  day = input.required<string>();

  readonly lang = inject(LanguageService);
  routineState = signal<RoutineState>('ready');
  expandedIndex = signal<number>(0);
  progress = signal<ExerciseProgress[]>([]);
  restTimeRemaining = signal(0);
  restTimeTotal = signal(0);
  elapsedTime = signal(0);

  /** Ejercicio del catálogo cuyo detalle (GIF + instrucciones) se está mostrando. */
  detailExercise = signal<Exercise | null>(null);

  private timerInterval: ReturnType<typeof setInterval> | null = null;
  private elapsedInterval: ReturnType<typeof setInterval> | null = null;

  dayId = computed(() => Number(this.day()));
  dayName = computed(() => this.lang.dayName(this.dayId()));
  exercises = computed(() => this.routineService.getRoutine(this.dayId()));

  completedExercises = computed(() =>
    this.progress().filter(p => p.completed).length
  );

  totalSetsCompleted = computed(() =>
    this.progress().reduce((sum, p) => sum + p.currentSet, 0)
  );

  overallProgress = computed(() => {
    const exs = this.exercises();
    if (exs.length === 0) return 0;
    const totalSets = exs.reduce((sum, e) => sum + e.sets, 0);
    const doneSets = this.totalSetsCompleted();
    return (doneSets / totalSets) * 100;
  });

  restProgress = computed(() => {
    const total = this.restTimeTotal();
    if (total === 0) return 0;
    return ((total - this.restTimeRemaining()) / total) * 100;
  });

  constructor(
    private routineService: RoutineService,
    private soundService: SoundService,
    private exerciseService: ExerciseService,
    private router: Router
  ) {}

  ngOnInit() {
    // Asegurar que el catálogo esté cargado (para resolver el detalle del ejercicio)
    if (!this.exerciseService.isLoaded()) {
      this.exerciseService.load();
    }

    // Inicializar progreso para cada ejercicio
    const exs = this.exercises();
    this.progress.set(
      exs.map(e => ({
        exerciseId: e.id,
        currentSet: 0,
        totalSets: e.sets,
        completed: false
      }))
    );

    // Timer de tiempo total
    this.elapsedInterval = setInterval(() => {
      this.elapsedTime.update(t => t + 1);
    }, 1000);
  }

  ngOnDestroy() {
    this.clearTimers();
  }

  getProgress(exerciseId: string): ExerciseProgress {
    return this.progress().find(p => p.exerciseId === exerciseId) ??
      { exerciseId, currentSet: 0, totalSets: 0, completed: false };
  }

  /** Abre el detalle (GIF + instrucciones) resolviendo el ejercicio del catálogo por su id. */
  openDetail(exercise: RoutineExercise) {
    const full = this.exerciseService.getById(exercise.exercise_id);
    if (full) {
      this.detailExercise.set(full);
    }
  }

  closeDetail() {
    this.detailExercise.set(null);
  }

  getSetsArray(sets: number): number[] {
    return Array.from({ length: sets }, (_, i) => i);
  }

  expandExercise(index: number) {
    if (this.routineState() === 'resting-set' || this.routineState() === 'resting-exercise') return;
    const exercise = this.exercises()[index];
    if (this.getProgress(exercise.id).completed) return;
    this.expandedIndex.set(index);
  }

  completeSet(exercise: RoutineExercise) {
    const prog = this.getProgress(exercise.id);
    const newSet = prog.currentSet + 1;
    const isLastSet = newSet >= exercise.sets;

    // Actualizar progreso
    this.progress.update(list =>
      list.map(p =>
        p.exerciseId === exercise.id
          ? { ...p, currentSet: newSet, completed: isLastSet }
          : p
      )
    );

    if (isLastSet) {
      // Ejercicio completado — verificar si es el último
      const allDone = this.progress().every(p =>
        p.exerciseId === exercise.id ? true : p.completed
      );

      if (allDone) {
        this.routineState.set('completed');
        this.clearTimers();
        this.soundService.playBeep();
      } else {
        // Descanso entre ejercicios
        this.startRest(exercise.rest_time_set, 'resting-exercise');
      }
    } else {
      // Descanso entre sets
      this.startRest(exercise.rest_time, 'resting-set');
    }
  }

  skipRest() {
    this.endRest();
  }

  private startRest(seconds: number, state: 'resting-set' | 'resting-exercise') {
    this.routineState.set(state);
    this.restTimeRemaining.set(seconds);
    this.restTimeTotal.set(seconds);

    this.clearRestTimer();
    this.timerInterval = setInterval(() => {
      const remaining = this.restTimeRemaining() - 1;
      if (remaining <= 0) {
        this.endRest();
      } else {
        this.restTimeRemaining.set(remaining);
      }
    }, 1000);
  }

  private endRest() {
    this.clearRestTimer();
    this.soundService.playBeep();
    this.restTimeRemaining.set(0);

    const state = this.routineState();
    this.routineState.set('exercising');

    // Si era descanso entre ejercicios, avanzar al siguiente no completado
    if (state === 'resting-exercise') {
      this.advanceToNextExercise();
    }
  }

  private advanceToNextExercise() {
    const exs = this.exercises();
    const currentProgress = this.progress();
    const nextIndex = exs.findIndex(e => {
      const p = currentProgress.find(pr => pr.exerciseId === e.id);
      return p && !p.completed;
    });
    if (nextIndex >= 0) {
      this.expandedIndex.set(nextIndex);
    }
  }

  private clearRestTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  private clearTimers() {
    this.clearRestTimer();
    if (this.elapsedInterval) {
      clearInterval(this.elapsedInterval);
      this.elapsedInterval = null;
    }
  }

  formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  goHome() {
    this.router.navigate(['/home']);
  }

  goToConfigure() {
    this.router.navigate(['/setup', this.dayId()]);
  }
}
