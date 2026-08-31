import { Component, inject, signal, HostListener } from '@angular/core';
import { LanguageService, Lang } from '../../services/language.service';

interface LangOption {
  code: Lang;
  flag: string;
  label: string;
}

@Component({
  selector: 'app-language-selector',
  template: `
    <!-- Botón: muestra la bandera actual -->
    <div class="relative">
      <button
        (click)="toggle()"
        aria-label="Seleccionar idioma"
        class="flex h-9 w-9 items-center justify-center rounded-md text-lg hover:bg-red-700/50 focus:outline-none focus:ring-2 focus:ring-white"
      >
        {{ currentOption().flag }}
      </button>

      <!-- Dropdown -->
      @if (open()) {
        <div class="absolute right-0 top-full z-50 mt-1 w-40 overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black/10">
          @for (opt of options; track opt.code) {
            <button
              (click)="select(opt.code)"
              class="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm transition-colors hover:bg-gray-100"
              [class.bg-red-50]="opt.code === languageService.lang()"
              [class.font-semibold]="opt.code === languageService.lang()"
            >
              <span class="text-lg">{{ opt.flag }}</span>
              <span class="text-gray-700">{{ opt.label }}</span>
            </button>
          }
        </div>
      }
    </div>
  `
})
export class LanguageSelectorComponent {
  readonly languageService = inject(LanguageService);
  readonly open = signal(false);

  readonly options: LangOption[] = [
    { code: 'es', flag: '🇪🇸', label: 'Español' },
    { code: 'en', flag: '🇬🇧', label: 'English' },
    { code: 'pt-BR', flag: '🇧🇷', label: 'Português' }
  ];

  currentOption(): LangOption {
    return this.options.find(o => o.code === this.languageService.lang()) ?? this.options[0];
  }

  toggle(): void {
    this.open.update(v => !v);
  }

  select(lang: Lang): void {
    this.languageService.setLang(lang);
    this.open.set(false);
  }

  /** Cerrar al tocar fuera del dropdown. */
  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event): void {
    if (this.open()) {
      const target = event.target as HTMLElement;
      if (!target.closest('app-language-selector')) {
        this.open.set(false);
      }
    }
  }
}
