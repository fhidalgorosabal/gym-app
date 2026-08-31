import { Component, output } from '@angular/core';
import { LanguageSelectorComponent } from '../language-selector/language-selector.component';

@Component({
  selector: 'app-header',
  imports: [LanguageSelectorComponent],
  template: `
    <header class="sticky top-0 z-40 flex items-center gap-2 bg-red-600 px-4 pb-3 pt-8 text-white shadow-md">
      <button
        (click)="menuToggle.emit()"
        aria-label="Abrir menú"
        class="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-white"
      >
        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <h1 class="flex-1 truncate text-center text-lg font-bold tracking-wide">GymApp</h1>
      <app-language-selector />
    </header>
  `
})
export class HeaderComponent {
  menuToggle = output<void>();
}
