import { Injectable, signal } from '@angular/core';
import { UI_DICT, DAY_NAMES, BODY_PART_LABELS_I18N, UIKey } from '../i18n/ui';
import { translateTerm } from '../i18n/exercise-terms';
import { Exercise } from '../models/exercise.model';

export type Lang = 'es' | 'en' | 'pt-BR';

/** Idiomas soportados por la app. */
export const SUPPORTED_LANGS: Lang[] = ['es', 'en', 'pt-BR'];

const STORAGE_KEY = 'gymapp.lang';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private _lang = signal<Lang>(this.resolveInitialLang());

  /** Idioma actual (readonly, reactivo). */
  readonly lang = this._lang.asReadonly();

  /** Traduce una clave de UI al idioma actual. */
  t(key: UIKey): string {
    return UI_DICT[this._lang()][key] ?? key;
  }

  /** Nombre del día de la semana (1=Lunes ... 7=Domingo) en el idioma actual. */
  dayName(dayId: number): string {
    return DAY_NAMES[this._lang()][dayId] ?? '';
  }

  /** Etiqueta de una categoría (body_part) en el idioma actual. */
  bodyPartLabel(part: string): string {
    return BODY_PART_LABELS_I18N[this._lang()][part] ?? part;
  }

  /** Traduce un término del catálogo (target, equipment, músculo) al idioma actual. */
  term(value: string): string {
    return translateTerm(value, this._lang());
  }

  /**
   * Nombre del ejercicio en el idioma actual.
   * Usa `name_i18n[lang]` si existe; si no, cae al `name` en inglés.
   */
  exerciseName(exercise: Pick<Exercise, 'name' | 'name_i18n'>): string {
    return exercise.name_i18n?.[this._lang()] || exercise.name;
  }

  /** Cambia el idioma y lo persiste. */
  setLang(lang: Lang): void {
    if (!SUPPORTED_LANGS.includes(lang)) {
      return;
    }
    this._lang.set(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // localStorage puede no estar disponible; ignorar.
    }
    // Reflejar el idioma en el <html lang="">.
    document.documentElement.lang = lang;
  }

  /**
   * Resuelve el idioma inicial:
   * 1. El guardado en localStorage.
   * 2. El del dispositivo (navigator.language), si es soportado.
   * 3. 'es' por defecto.
   */
  private resolveInitialLang(): Lang {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Lang | null;
      if (saved && SUPPORTED_LANGS.includes(saved)) {
        return saved;
      }
    } catch {
      // ignorar
    }

    const device = (navigator?.language ?? '').toLowerCase();
    if (device.startsWith('pt')) {
      return 'pt-BR';
    }
    if (device.startsWith('en')) {
      return 'en';
    }
    if (device.startsWith('es')) {
      return 'es';
    }
    return 'es';
  }
}
