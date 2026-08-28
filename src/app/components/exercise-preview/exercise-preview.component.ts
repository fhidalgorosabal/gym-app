import { Component, input, output } from '@angular/core';
import { Exercise } from '../../models/exercise.model';

@Component({
  selector: 'app-exercise-preview',
  template: `
    @if (exercise(); as ex) {
      <!-- Backdrop -->
      <div class="fixed inset-0 z-60 bg-black/60" (click)="closed.emit()"></div>

      <!-- Modal centrado -->
      <div class="fixed inset-x-4 top-[5%] z-60 mx-auto max-h-[90vh] max-w-md overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <!-- Header -->
        <div class="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-4 py-3">
          <h3 class="text-base font-bold text-gray-800">{{ ex.name }}</h3>
          <button
            (click)="closed.emit()"
            aria-label="Cerrar preview"
            class="rounded-full p-1 text-gray-500 hover:bg-gray-100"
          >
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- GIF animado -->
        <div class="flex justify-center bg-gray-50 p-4">
          <img
            [src]="ex.gif_url"
            [alt]="ex.name"
            class="h-44 w-44 rounded-xl bg-white object-cover shadow-sm"
          />
        </div>

        <!-- Metadata -->
        <div class="flex flex-wrap gap-2 px-4 pt-3">
          <span class="rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-700">
            {{ ex.target }}
          </span>
          <span class="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
            {{ ex.equipment }}
          </span>
          @for (muscle of ex.secondary_muscles; track muscle) {
            <span class="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-500">
              {{ muscle }}
            </span>
          }
        </div>

        <!-- Instrucciones paso a paso -->
        <div class="px-4 py-4">
          <h4 class="mb-2 text-sm font-semibold text-gray-700">Instrucciones</h4>
          <ol class="list-inside list-decimal space-y-2">
            @for (step of ex.instruction_steps['es']; track $index) {
              <li class="text-sm leading-relaxed text-gray-600">{{ step }}</li>
            }
          </ol>
        </div>

        <!-- Botón confirmar -->
        <div class="sticky bottom-0 border-t bg-white px-4 py-3">
          <button
            (click)="confirmed.emit(ex)"
            class="w-full rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 active:bg-indigo-800"
          >
            Seleccionar este ejercicio
          </button>
        </div>
      </div>
    }
  `
})
export class ExercisePreviewComponent {
  exercise = input.required<Exercise | null>();
  confirmed = output<Exercise>();
  closed = output<void>();
}
