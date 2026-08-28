import { Component, input } from '@angular/core';

@Component({
  selector: 'app-setup-day',
  template: `
    <div class="p-4">
      <h2 class="text-2xl font-bold">Configurar Día</h2>
      <p class="text-gray-600 mt-2">CRUD de ejercicios para el día: <strong>{{ day() }}</strong></p>
    </div>
  `
})
export default class SetupDayPage {
  day = input.required<string>();
}
