import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RoutineService } from '../../services/routine.service';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-setup',
  imports: [RouterLink],
  template: `
    <div class="p-4">
      <h2 class="text-xl font-bold text-gray-800">{{ lang.t('setup.title') }}</h2>
      <p class="mt-1 text-sm text-gray-500">{{ lang.t('setup.subtitle') }}</p>

      <ul class="mt-4 space-y-2">
        @for (day of routineService.allDays(); track day.id) {
          <li class="flex items-center justify-between rounded-xl border bg-white px-4 py-3 shadow-sm">
            <!-- Toggle + nombre -->
            <div class="flex items-center gap-3">
              <button
                (click)="routineService.toggleDay(day.id)"
                [attr.aria-label]="(day.is_active ? lang.t('setup.deactivate') : lang.t('setup.activate')) + ' ' + lang.dayName(day.id)"
                class="relative h-6 w-11 rounded-full transition-colors duration-200"
                [class.bg-red-600]="day.is_active"
                [class.bg-gray-300]="!day.is_active"
              >
                <span
                  class="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200"
                  [class.translate-x-5]="day.is_active"
                  [class.translate-x-0]="!day.is_active"
                ></span>
              </button>
              <span
                class="text-sm font-medium"
                [class.text-gray-800]="day.is_active"
                [class.text-gray-400]="!day.is_active"
              >
                {{ lang.dayName(day.id) }}
              </span>
            </div>

            <!-- Botón configurar ejercicios -->
            @if (day.is_active) {
              <a
                [routerLink]="['/setup', day.id]"
                class="flex items-center gap-1 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-100"
              >
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {{ lang.t('setup.exercisesLink') }}
              </a>
            }
          </li>
        }
      </ul>
    </div>
  `
})
export default class SetupPage {
  readonly lang = inject(LanguageService);
  constructor(readonly routineService: RoutineService) {}
}
