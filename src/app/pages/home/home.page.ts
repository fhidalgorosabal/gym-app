import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { RoutineService } from '../../services/routine.service';
import { LanguageService } from '../../services/language.service';

interface DayCard {
  id: number;
  name: string;
  count: number;
  isActive: boolean;
  isToday: boolean;
}

type Slot = 'prev' | 'current' | 'next';

@Component({
  selector: 'app-home',
  template: `
    <div class="flex flex-col items-center p-6">
      <!-- Logo -->
      <img src="logo.png" alt="GymApp" width="80" height="80" class="h-20 w-20 object-contain" />
      <p class="mt-1 text-center text-sm text-gray-500">{{ lang.t('home.selectDay') }}</p>

      <!-- Carrusel vertical -->
      <div class="mt-4 flex w-full max-w-md flex-col items-center">
        <!-- Botón anterior -->
        <button
          (click)="goPrev()"
          [attr.aria-label]="lang.t('home.today')"
          class="flex h-10 w-10 items-center justify-center rounded-full text-red-600 transition-colors hover:bg-red-50 active:bg-red-100"
        >
          <svg class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7" />
          </svg>
        </button>

        <!-- Tarjetas: prev (arriba), current (centro), next (abajo) -->
        <div class="flex w-full flex-col items-center gap-2 py-1">
          @for (card of visibleCards(); track card.slot) {
            <button
              (click)="onCardClick(card.slot, card.day)"
              [disabled]="card.slot !== 'current'"
              [attr.aria-hidden]="card.slot !== 'current'"
              [attr.tabindex]="card.slot === 'current' ? 0 : -1"
              class="flex w-full items-center gap-4 rounded-2xl border-2 px-5 text-left transition-all duration-300 ease-out"
              [class.scale-100]="card.slot === 'current'"
              [class.opacity-100]="card.slot === 'current'"
              [class.py-4]="card.slot === 'current'"
              [class.shadow-md]="card.slot === 'current'"
              [class.scale-90]="card.slot !== 'current'"
              [class.opacity-40]="card.slot !== 'current'"
              [class.py-2]="card.slot !== 'current'"
              [class.border-red-500]="card.slot === 'current' && card.day.isToday"
              [class.bg-red-50]="card.slot === 'current' && card.day.isToday"
              [class.border-gray-200]="!(card.slot === 'current' && card.day.isToday)"
              [class.bg-white]="!(card.slot === 'current' && card.day.isToday)"
            >
              <!-- Indicador -->
              <div
                class="flex flex-shrink-0 items-center justify-center rounded-full transition-all duration-300"
                [class.h-12]="card.slot === 'current'"
                [class.w-12]="card.slot === 'current'"
                [class.h-9]="card.slot !== 'current'"
                [class.w-9]="card.slot !== 'current'"
                [class.bg-red-600]="card.day.isActive || card.day.isToday"
                [class.text-white]="card.day.isActive || card.day.isToday"
                [class.bg-gray-100]="!card.day.isActive && !card.day.isToday"
                [class.text-gray-400]="!card.day.isActive && !card.day.isToday"
              >
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>

              <!-- Info -->
              <div class="min-w-0 flex-1">
                <div class="flex items-center gap-2">
                  <p class="truncate font-semibold text-gray-800" [class.text-lg]="card.slot === 'current'" [class.text-sm]="card.slot !== 'current'">{{ card.day.name }}</p>
                  @if (card.day.isToday) {
                    <span class="inline-flex items-center rounded-full bg-red-600 px-2 text-[10px] font-bold uppercase tracking-wide text-white" style="line-height: 1.8; padding-top: 2px;">
                      {{ lang.t('home.today') }}
                    </span>
                  }
                </div>
                @if (card.slot === 'current') {
                  @if (card.day.count > 0) {
                    <p class="mt-0.5 text-xs text-gray-500">{{ card.day.count }} {{ lang.t('home.exercisesConfigured') }}</p>
                  } @else {
                    <p class="mt-0.5 text-xs text-gray-400">{{ lang.t('home.emptyDay') }}</p>
                  }
                }
              </div>

              <!-- Flecha (solo central) -->
              @if (card.slot === 'current') {
                <svg class="h-5 w-5 flex-shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              }
            </button>
          }
        </div>

        <!-- Botón siguiente -->
        <button
          (click)="goNext()"
          [attr.aria-label]="lang.t('home.selectDay')"
          class="flex h-10 w-10 items-center justify-center rounded-full text-red-600 transition-colors hover:bg-red-50 active:bg-red-100"
        >
          <svg class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
    </div>
  `
})
export default class HomePage {
  readonly lang = inject(LanguageService);
  private readonly todayDayId = this.getTodayDayId();

  /** Índice (0-6) del día central en el array de días. */
  currentIndex = signal(0);

  private days = computed<DayCard[]>(() =>
    this.routineService.allDays().map(d => ({
      id: d.id,
      name: this.lang.dayName(d.id),
      count: this.routineService.getRoutine(d.id).length,
      isActive: d.is_active,
      isToday: d.id === this.todayDayId
    }))
  );

  /** Las 3 tarjetas visibles: anterior, central y siguiente (circular). */
  visibleCards = computed<{ slot: Slot; day: DayCard }[]>(() => {
    const list = this.days();
    const n = list.length;
    if (n === 0) return [];
    const i = this.currentIndex();
    return [
      { slot: 'prev', day: list[(i - 1 + n) % n] },
      { slot: 'current', day: list[i] },
      { slot: 'next', day: list[(i + 1) % n] }
    ];
  });

  constructor(
    private routineService: RoutineService,
    private router: Router
  ) {
    // Posicionar el carrusel en el día de hoy.
    const idx = this.routineService.allDays().findIndex(d => d.id === this.todayDayId);
    this.currentIndex.set(idx >= 0 ? idx : 0);
  }

  goPrev() {
    const n = this.days().length;
    if (n > 0) this.currentIndex.update(i => (i - 1 + n) % n);
  }

  goNext() {
    const n = this.days().length;
    if (n > 0) this.currentIndex.update(i => (i + 1) % n);
  }

  /** Tap en una tarjeta: la central navega; las laterales se traen al centro. */
  onCardClick(slot: Slot, day: DayCard) {
    if (slot === 'current') {
      this.openDay(day);
    } else if (slot === 'prev') {
      this.goPrev();
    } else {
      this.goNext();
    }
  }

  private openDay(day: DayCard) {
    if (day.count > 0) {
      this.router.navigate(['/routine', day.id]);
    } else {
      this.router.navigate(['/setup', day.id]);
    }
  }

  /** Convierte Day de JS (0=Dom, 1=Lun...) a nuestro modelo (1=Lun, 7=Dom) */
  private getTodayDayId(): number {
    const jsDay = new Date().getDay();
    return jsDay === 0 ? 7 : jsDay;
  }
}
