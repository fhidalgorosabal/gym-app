import { Component, input } from '@angular/core';

@Component({
  selector: 'app-routine',
  template: `
    <div class="p-4">
      <h2 class="text-2xl font-bold">Rutina</h2>
      <p class="text-gray-600 mt-2">Ejecución de rutina del día: <strong>{{ day() }}</strong></p>
    </div>
  `
})
export default class RoutinePage {
  day = input.required<string>();
}
