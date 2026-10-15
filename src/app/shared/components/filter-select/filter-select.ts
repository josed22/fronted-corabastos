import { Component, input, model } from '@angular/core';

@Component({
  selector: 'app-filter-select',
  templateUrl: './filter-select.html',
  styleUrl: './filter-select.css',
})
export class FilterSelect {
  private static contador = 0;
  protected readonly id = `filtro-${FilterSelect.contador++}`;
  readonly label = input.required<string>();
  readonly options = input.required<string[]>();
  readonly todos = input('Todos');
  readonly value = model('');
}
