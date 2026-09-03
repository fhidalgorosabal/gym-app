import { Component, computed, inject, input, signal, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RoutineService } from '../../services/routine.service';
import { ExerciseService } from '../../services/exercise.service';
import { LanguageService } from '../../services/language.service';
import { ExerciseSelectorComponent } from '../../components/exercise-selector/exercise-selector.component';
import { RoutineExercise, Unit } from '../../models/routine.model';
import { Exercise } from '../../models/exercise.model';
import { CapitalizePipe } from '../../pipes/capitalize.pipe';

@Component({
  selector: 'app-setup-day',
  imports: [FormsModule, ExerciseSelectorComponent, CapitalizePipe],
  template: `
    <div class="p-4">
      <!-- Header -->
      <div class="flex items-center gap-3">
        <button
          (click)="goBack()"
          class="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
          [attr.aria-label]="lang.t('back')"
        >
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h2 class="text-xl font-bold text-gray-800">{{ dayName() }}</h2>
          <p class="text-sm text-gray-500">{{ exercises().length }} {{ lang.t('exercises') }}</p>
        </div>
      </div>

      <!-- Lista de ejercicios -->
      @if (exercises().length > 0) {
        <ul class="mt-4 space-y-3">
          @for (exercise of exercises(); track exercise.id; let i = $index) {
            <li class="rounded-xl border bg-white shadow-sm">
              <!-- Cabecera del ejercicio -->
              <div class="flex items-center gap-3 px-4 py-3">
                <!-- Flechas reordenar -->
                <div class="flex flex-col gap-0.5">
                  <button
                    (click)="moveUp(i)"
                    [disabled]="i === 0"
                    class="rounded p-0.5 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                    [attr.aria-label]="lang.t('setupDay.moveUp')"
                  >
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7" />
                    </svg>
                  </button>
                  <button
                    (click)="moveDown(i)"
                    [disabled]="i === exercises().length - 1"
                    class="rounded p-0.5 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                    [attr.aria-label]="lang.t('setupDay.moveDown')"
                  >
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>

                <!-- Thumbnail + info -->
                <img
                  [src]="exercise.image"
                  [alt]="exercise.name"
                  class="h-10 w-10 rounded-lg bg-gray-100 object-cover"
                />
                <div class="min-w-0 flex-1">
                  <p class="truncate text-sm font-medium text-gray-800">{{ exercise.name | capitalize }}</p>
                  <p class="text-xs text-gray-500">
                    {{ exercise.sets }}x{{ exercise.reps }} {{ exercise.unit === 'Repeticiones' ? lang.t('unit.repetitionsShort') : lang.t('unit.minutesShort') }}
                  </p>
                </div>

                <!-- Acciones -->
                <button
                  (click)="toggleEdit(exercise.id)"
                  class="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-red-600"
                  [attr.aria-label]="lang.t('setupDay.editExercise')"
                >
                  <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
                <button
                  (click)="removeExercise(exercise.id)"
                  class="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600"
                  [attr.aria-label]="lang.t('setupDay.deleteExercise')"
                >
                  <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>

              <!-- Formulario edición (colapsable) -->
              @if (editingId() === exercise.id) {
                <div class="border-t bg-gray-50 px-4 py-3">
                  <div class="grid grid-cols-2 gap-3">
                    <!-- Sets -->
                    <div>
                      <label class="text-xs font-medium text-gray-600">{{ lang.t('setupDay.sets') }}</label>
                      <input
                        type="number"
                        [ngModel]="exercise.sets"
                        (ngModelChange)="updateField(exercise.id, 'sets', $event)"
                        min="1"
                        max="20"
                        class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                      />
                    </div>
                    <!-- Reps / Minutos (según unidad) -->
                    <div>
                      <label class="text-xs font-medium text-gray-600">{{ exercise.unit === 'Minutos' ? lang.t('unit.minutes') : lang.t('setupDay.reps') }}</label>
                      <input
                        type="number"
                        [ngModel]="exercise.reps"
                        (ngModelChange)="updateField(exercise.id, 'reps', $event)"
                        min="1"
                        max="100"
                        class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                      />
                    </div>
                    <!-- Unidad -->
                    <div class="unit-dropdown relative">
                      <label class="text-xs font-medium text-gray-600">{{ lang.t('setupDay.unit') }}</label>
                      <!-- Dropdown propio (no <select> nativo, para coherencia visual con la app) -->
                      <button
                        type="button"
                        (click)="toggleUnitDropdown(exercise.id)"
                        [attr.aria-expanded]="unitDropdownId() === exercise.id"
                        class="mt-1 flex w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-3 py-2 text-left text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                      >
                        <span class="text-gray-800">{{ exercise.unit === 'Minutos' ? lang.t('unit.minutes') : lang.t('unit.repetitions') }}</span>
                        <svg class="h-4 w-4 flex-shrink-0 text-gray-400 transition-transform" [class.rotate-180]="unitDropdownId() === exercise.id" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      @if (unitDropdownId() === exercise.id) {
                        <div class="absolute left-0 top-full z-20 mt-1 w-full overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black/10">
                          @for (opt of unitOptions; track opt.value) {
                            <button
                              type="button"
                              (click)="selectUnit(exercise.id, opt.value)"
                              class="flex w-full items-center px-3 py-2.5 text-left text-sm transition-colors hover:bg-gray-100"
                              [class.bg-red-50]="exercise.unit === opt.value"
                              [class.font-semibold]="exercise.unit === opt.value"
                            >
                              <span class="text-gray-700">{{ lang.t(opt.labelKey) }}</span>
                            </button>
                          }
                        </div>
                      }
                    </div>
                    <!-- Descanso entre sets -->
                    <div>
                      <label class="text-xs font-medium text-gray-600">{{ lang.t('setupDay.restSets') }}</label>
                      <input
                        type="number"
                        [ngModel]="exercise.rest_time"
                        (ngModelChange)="updateField(exercise.id, 'rest_time', $event)"
                        min="0"
                        max="600"
                        step="10"
                        class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                      />
                    </div>
                    <!-- Descanso entre ejercicios -->
                    <div class="col-span-2">
                      <label class="text-xs font-medium text-gray-600">{{ lang.t('setupDay.restExercises') }}</label>
                      <input
                        type="number"
                        [ngModel]="exercise.rest_time_set"
                        (ngModelChange)="updateField(exercise.id, 'rest_time_set', $event)"
                        min="0"
                        max="600"
                        step="10"
                        class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                      />
                    </div>
                  </div>
                  <button
                    (click)="editingId.set(null)"
                    class="mt-3 w-full rounded-lg bg-red-600 py-2 text-sm font-medium text-white hover:bg-red-700"
                  >
                    {{ lang.t('done') }}
                  </button>
                </div>
              }
            </li>
          }
        </ul>
      } @else {
        <!-- Estado vacío -->
        <div class="mt-12 text-center">
          <svg class="mx-auto h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <p class="mt-2 text-sm text-gray-500">{{ lang.t('setupDay.noExercises') }}</p>
          <p class="text-xs text-gray-400">{{ lang.t('setupDay.addForThisDay') }}</p>
        </div>
      }

      <!-- Botón agregar -->
      <button
        (click)="openSelector()"
        class="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-red-700 active:bg-red-800"
      >
        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        {{ lang.t('setupDay.addExercise') }}
      </button>

      <!-- Botón copiar desde otro día -->
      <button
        (click)="openCopy()"
        class="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-red-600 py-3 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 active:bg-red-100"
      >
        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
        </svg>
        {{ lang.t('setupDay.copyFrom') }}
      </button>

      <!-- PANEL: copiar desde otro día -->
      @if (copyOpen()) {
        <div class="fixed inset-0 z-50 bg-black/50" (click)="closeCopy()"></div>
        <div class="fixed inset-x-0 bottom-0 z-50 flex max-h-[85vh] flex-col rounded-t-2xl bg-white shadow-xl">
          <div class="flex items-center gap-2 border-b px-4 py-3">
            <h2 class="min-w-0 flex-1 truncate text-lg font-bold text-gray-800">{{ lang.t('setupDay.copyTitle') }}</h2>
            <button
              (click)="closeCopy()"
              [attr.aria-label]="lang.t('close')"
              class="rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-800"
            >
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="flex-1 overflow-y-auto p-4 pb-safe-4">
            @if (copyableDays().length === 0) {
              <p class="py-8 text-center text-sm text-gray-500">{{ lang.t('setupDay.copyNoDays') }}</p>
            } @else if (copySourceDayId() === null) {
              <!-- Paso 1: elegir día origen -->
              <ul class="space-y-2">
                @for (d of copyableDays(); track d.id) {
                  <li>
                    <button
                      (click)="pickSource(d.id)"
                      class="flex w-full items-center justify-between rounded-xl border border-gray-200 px-4 py-3 text-left transition-colors hover:border-red-500 hover:bg-red-50 active:scale-[0.99]"
                    >
                      <span class="text-sm font-medium text-gray-800">{{ lang.dayName(d.id) }}</span>
                      <span class="text-xs text-gray-400">{{ d.count }} {{ lang.t('exercises') }}</span>
                    </button>
                  </li>
                }
              </ul>
            } @else {
              <!-- Paso 2: destino con ejercicios → reemplazar o añadir -->
              <p class="text-sm text-gray-600">{{ lang.t('setupDay.copyExistsQuestion') }}</p>
              <div class="mt-4 grid grid-cols-1 gap-2">
                <button
                  (click)="doCopy('replace')"
                  class="w-full rounded-xl bg-red-600 py-3 text-sm font-semibold text-white shadow-sm hover:bg-red-700 active:bg-red-800"
                >
                  {{ lang.t('setupDay.copyReplace') }}
                </button>
                <button
                  (click)="doCopy('append')"
                  class="w-full rounded-xl border border-red-600 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 active:bg-red-100"
                >
                  {{ lang.t('setupDay.copyAppend') }}
                </button>
              </div>
            }
          </div>
        </div>
      }
    </div>

    <!-- Selector de ejercicios -->
    <app-exercise-selector
      [open]="selectorOpen()"
      (exerciseSelected)="onExerciseSelected($event)"
      (closed)="selectorOpen.set(false)"
    />
  `
})
export default class SetupDayPage implements OnInit {
  day = input.required<string>();

  readonly lang = inject(LanguageService);
  selectorOpen = signal(false);
  editingId = signal<string | null>(null);

  /** Id del ejercicio cuyo dropdown de unidad está abierto (null = ninguno). */
  unitDropdownId = signal<string | null>(null);

  /** Opciones de unidad para el dropdown propio. */
  readonly unitOptions: { value: Unit; labelKey: 'unit.repetitions' | 'unit.minutes' }[] = [
    { value: 'Repeticiones', labelKey: 'unit.repetitions' },
    { value: 'Minutos', labelKey: 'unit.minutes' }
  ];

  /** Panel "copiar desde otro día". */
  copyOpen = signal(false);
  /** Día origen elegido (null = aún no elegido). */
  copySourceDayId = signal<number | null>(null);

  /** Días (distintos del actual) que tienen ejercicios, con su conteo. */
  copyableDays = computed(() =>
    this.routineService.allDays()
      .filter(d => d.id !== this.dayId() && this.routineService.getRoutine(d.id).length > 0)
      .map(d => ({ id: d.id, count: this.routineService.getRoutine(d.id).length }))
  );

  dayId = computed(() => Number(this.day()));
  dayName = computed(() => this.lang.dayName(this.dayId()));
  exercises = computed(() => this.routineService.getRoutine(this.dayId()));

  constructor(
    private routineService: RoutineService,
    private exerciseService: ExerciseService,
    private router: Router
  ) {}

  ngOnInit() {
    // Asegurar que el catálogo esté cargado
    if (!this.exerciseService.isLoaded()) {
      this.exerciseService.load();
    }
  }

  openSelector() {
    this.selectorOpen.set(true);
  }

  /** Abre el panel de copia (reinicia el día origen). */
  openCopy() {
    this.copySourceDayId.set(null);
    this.copyOpen.set(true);
  }

  closeCopy() {
    this.copyOpen.set(false);
    this.copySourceDayId.set(null);
  }

  /** Elige el día origen. Si el destino está vacío, copia directo; si no, pide reemplazar/añadir. */
  pickSource(fromDayId: number) {
    if (this.exercises().length === 0) {
      this.applyCopy(fromDayId, 'replace');
    } else {
      this.copySourceDayId.set(fromDayId);
    }
  }

  /** Ejecuta la copia con el modo elegido en el paso 2. */
  doCopy(mode: 'replace' | 'append') {
    const from = this.copySourceDayId();
    if (from !== null) this.applyCopy(from, mode);
  }

  private applyCopy(fromDayId: number, mode: 'replace' | 'append') {
    this.routineService.copyRoutine(fromDayId, this.dayId(), mode);
    this.closeCopy();
  }

  onExerciseSelected(exercise: Exercise) {
    // Guarda el nombre en el idioma que el usuario tiene seleccionado ahora.
    this.routineService.addExercise(this.dayId(), exercise, this.lang.exerciseName(exercise));
    this.selectorOpen.set(false);
  }

  toggleEdit(exerciseId: string) {
    this.editingId.update(id => id === exerciseId ? null : exerciseId);
  }

  updateField(exerciseId: string, field: keyof RoutineExercise, value: number | string) {
    this.routineService.updateExercise(this.dayId(), exerciseId, { [field]: value });
  }

  /** Abre/cierra el dropdown de unidad de un ejercicio. */
  toggleUnitDropdown(exerciseId: string) {
    this.unitDropdownId.update(id => id === exerciseId ? null : exerciseId);
  }

  /** Selecciona la unidad y cierra el dropdown. */
  selectUnit(exerciseId: string, unit: Unit) {
    this.updateField(exerciseId, 'unit', unit);
    this.unitDropdownId.set(null);
  }

  /** Cierra el dropdown de unidad al tocar fuera de él. */
  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (this.unitDropdownId()) {
      const target = event.target as HTMLElement;
      if (!target.closest('.unit-dropdown')) {
        this.unitDropdownId.set(null);
      }
    }
  }

  removeExercise(exerciseId: string) {
    if (confirm(this.lang.t('setupDay.confirmDelete'))) {
      this.routineService.removeExercise(this.dayId(), exerciseId);
    }
  }

  moveUp(index: number) {
    this.routineService.moveExercise(this.dayId(), index, index - 1);
  }

  moveDown(index: number) {
    this.routineService.moveExercise(this.dayId(), index, index + 1);
  }

  goBack() {
    this.router.navigate(['/setup']);
  }
}
