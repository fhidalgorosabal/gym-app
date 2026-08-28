import { Component, output } from '@angular/core';

@Component({
  selector: 'app-header',
  template: `
    <header class="sticky top-0 z-40 flex items-center justify-between bg-indigo-600 px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top))] text-white shadow-md">
      <button
        (click)="menuToggle.emit()"
        aria-label="Abrir menú"
        class="rounded-md p-2 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-white"
      >
        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <h1 class="text-lg font-bold tracking-wide">GymApp</h1>
      <div class="w-10"></div>
    </header>
  `
})
export class HeaderComponent {
  menuToggle = output<void>();
}
