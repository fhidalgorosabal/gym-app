import { Component, inject, input, output } from '@angular/core';
import { Exercise } from '../../models/exercise.model';
import { LanguageService } from '../../services/language.service';
import { CapitalizePipe } from '../../pipes/capitalize.pipe';

@Component({
  selector: 'app-exercise-preview',
  imports: [CapitalizePipe],
  template: `
    @if (exercise(); as ex) {
      <!-- Backdrop -->
      <div class="fixed inset-0 z-60 bg-black/60" (click)="closed.emit()"></div>

      <!-- Modal centrado -->
      <div class="fixed inset-x-4 top-[5%] z-60 mx-auto max-h-[90vh] max-w-md overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <!-- Header -->
        <div class="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-4 py-3">
          <h3 class="text-base font-bold text-gray-800">{{ langSvc.exerciseName(ex) | capitalize }}</h3>
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
          <div class="relative h-44 w-44">
            <img
              [src]="ex.gif_url"
              [alt]="ex.name"
              (load)="gifLoaded = true"
              [class.opacity-0]="!gifLoaded"
              class="h-44 w-44 rounded-xl bg-white object-cover shadow-sm transition-opacity duration-300"
            />
            @if (!gifLoaded) {
              <div class="absolute inset-0 flex items-center justify-center rounded-xl bg-gray-100">
                <svg class="h-8 w-8 animate-spin text-red-400" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            }
          </div>
        </div>

        <!-- Metadata -->
        <div class="flex flex-wrap gap-2 px-4 pt-3">
          <span class="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-700">
            {{ langSvc.term(ex.target) }}
          </span>
          <span class="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
            {{ langSvc.term(ex.equipment) }}
          </span>
          @for (muscle of ex.secondary_muscles; track muscle) {
            <span class="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-500">
              {{ langSvc.term(muscle) }}
            </span>
          }
        </div>

        <!-- Instrucciones paso a paso -->
        <div class="px-4 py-4">
          <h4 class="mb-2 text-sm font-semibold text-gray-700">{{ langSvc.t('selector.instructions') }}</h4>
          <ol class="list-inside list-decimal space-y-2">
            @for (step of ex.instruction_steps[lang()]; track $index) {
              <li class="text-sm leading-relaxed text-gray-600">{{ step }}</li>
            }
          </ol>
        </div>

        <!-- Botón confirmar -->
        <div class="sticky bottom-0 border-t bg-white px-4 py-3">
          <button
            (click)="confirmed.emit(ex)"
            class="w-full rounded-xl bg-red-600 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-red-700 active:bg-red-800"
          >
            {{ langSvc.t('selector.selectThis') }}
          </button>
        </div>
      </div>
    }
  `
})
export class ExercisePreviewComponent {
  private languageService = inject(LanguageService);
  /** Servicio de idioma, para traducir textos de UI con t(). */
  readonly langSvc = this.languageService;
  /** Idioma actual, para seleccionar los pasos de instrucciones traducidos. */
  readonly lang = this.languageService.lang;

  exercise = input.required<Exercise | null>();
  confirmed = output<Exercise>();
  closed = output<void>();

  gifLoaded = false;
}
