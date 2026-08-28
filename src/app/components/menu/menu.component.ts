import { Component, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { RoutineService } from '../../services/routine.service';

@Component({
  selector: 'app-menu',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <!-- Backdrop -->
    @if (open()) {
      <div
        class="fixed inset-0 z-40 bg-black/50 transition-opacity"
        (click)="closed.emit()"
      ></div>
    }

    <!-- Panel -->
    <nav
      class="fixed inset-y-0 left-0 z-50 w-64 transform bg-white shadow-xl transition-transform duration-300 ease-in-out"
      [class.translate-x-0]="open()"
      [class.-translate-x-full]="!open()"
    >
      <div class="flex items-center justify-between border-b px-4 py-3">
        <span class="text-lg font-bold text-indigo-600">GymApp</span>
        <button
          (click)="closed.emit()"
          aria-label="Cerrar menú"
          class="rounded-md p-1 text-gray-500 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <ul class="mt-2 space-y-1 px-2">
        <!-- Inicio -->
        <li>
          <a
            routerLink="/home"
            routerLinkActive="bg-indigo-50 text-indigo-700"
            (click)="closed.emit()"
            class="flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            <svg class="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Inicio
          </a>
        </li>

        <!-- Días activos -->
        @if (routineService.activeDays().length > 0) {
          <li class="px-3 pb-1 pt-4">
            <span class="text-xs font-semibold uppercase tracking-wide text-gray-400">Rutinas</span>
          </li>
          @for (day of routineService.activeDays(); track day.id) {
            <li>
              <a
                [routerLink]="['/routine', day.id]"
                routerLinkActive="bg-indigo-50 text-indigo-700"
                (click)="closed.emit()"
                class="flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                <svg class="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                {{ day.name }}
              </a>
            </li>
          }
        }

        <!-- Separador -->
        <li class="px-3 pb-1 pt-4">
          <span class="text-xs font-semibold uppercase tracking-wide text-gray-400">Configuración</span>
        </li>

        <!-- Configurar Rutina -->
        <li>
          <a
            routerLink="/setup"
            routerLinkActive="bg-indigo-50 text-indigo-700"
            (click)="closed.emit()"
            class="flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            <svg class="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Configurar Rutina
          </a>
        </li>
      </ul>
    </nav>
  `
})
export class MenuComponent {
  open = input.required<boolean>();
  closed = output<void>();

  constructor(readonly routineService: RoutineService) {}
}
