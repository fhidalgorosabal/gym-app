import { Pipe, PipeTransform } from '@angular/core';

/**
 * Capitaliza la primera letra de la cadena, dejando el resto intacto.
 *
 * Útil para los nombres de ejercicios: el inglés (`name_i18n.en`) viene en
 * minúsculas (p. ej. "barbell curl") y queremos mostrarlo como "Barbell curl"
 * sin alterar mayúsculas internas ya intencionadas ("V-up", "L-sit", "Press JM").
 *
 * Uso: {{ nombre | capitalize }}
 */
@Pipe({ name: 'capitalize' })
export class CapitalizePipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) {
      return '';
    }
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
}
