import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { RoutineService } from '../../services/routine.service';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-home',
  template: `
    <div class="flex min-h-[80vh] flex-col items-center justify-center p-6 text-center">
      <div class="text-6xl">🏋️</div>
      <h2 class="mt-4 text-2xl font-bold text-gray-800">GymApp</h2>
      <p class="mt-2 text-gray-500">{{ lang.t('home.subtitle') }}</p>

      @if (todayIsActive()) {
        <button
          (click)="startTodayRoutine()"
          class="mt-8 rounded-xl bg-red-600 px-8 py-4 text-base font-semibold text-white shadow-lg transition-all hover:bg-red-700 hover:shadow-xl active:scale-95"
        >
          {{ lang.t('home.doTodayRoutine') }}
          <span class="ml-1 font-normal opacity-80">{{ todayName() }}</span>
        </button>

        <p class="mt-3 text-sm text-gray-400">
          {{ todayExerciseCount() }} {{ lang.t('home.exercisesConfigured') }}
        </p>
      } @else {
        <div class="mt-8 rounded-xl bg-gray-100 px-6 py-4">
          <p class="text-sm text-gray-600">
            {{ lang.t('home.noRoutineToday') }}
            <span class="font-medium">({{ todayName() }})</span>
          </p>
          <button
            (click)="goToSetup()"
            class="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            {{ lang.t('home.configureRoutine') }}
          </button>
        </div>
      }
    </div>
  `
})
export default class HomePage {
  readonly lang = inject(LanguageService);
  private todayDayId = this.getTodayDayId();

  todayName = computed(() => this.lang.dayName(this.todayDayId));

  todayIsActive = computed(() => {
    const days = this.routineService.allDays();
    const today = days.find(d => d.id === this.todayDayId);
    return today?.is_active ?? false;
  });

  todayExerciseCount = computed(() =>
    this.routineService.getRoutine(this.todayDayId).length
  );

  constructor(
    private routineService: RoutineService,
    private router: Router
  ) {}

  startTodayRoutine() {
    this.router.navigate(['/routine', this.todayDayId]);
  }

  goToSetup() {
    this.router.navigate(['/setup']);
  }

  /** Convierte Day de JS (0=Dom, 1=Lun...) a nuestro modelo (1=Lun, 7=Dom) */
  private getTodayDayId(): number {
    const jsDay = new Date().getDay(); // 0=Domingo, 1=Lunes...
    return jsDay === 0 ? 7 : jsDay;
  }
}
