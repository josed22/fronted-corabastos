import { Component, computed, input } from '@angular/core';

export interface BarItem { label: string; value: number; texto?: string; color?: string; }

/** Barras horizontales con CSS, sin librerías externas. */
@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.html',
  styleUrl: './bar-chart.css',
})
export class BarChart {
  readonly items = input.required<BarItem[]>();
  private readonly max = computed(() => Math.max(1, ...this.items().map((i) => i.value)));
  protected ancho(v: number) { return (v / this.max()) * 100; }
}
