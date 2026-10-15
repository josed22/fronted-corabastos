import { Component, computed, input } from '@angular/core';

/** Gráfico de línea sencillo (SVG) para mostrar el historial de precios. */
@Component({
  selector: 'app-sparkline',
  templateUrl: './sparkline.html',
  styleUrl: './sparkline.css',
})
export class Sparkline {
  protected readonly ancho = 400;
  protected readonly alto = 120;
  readonly values = input.required<number[]>();
  readonly color = input('#2e7d32');
  readonly etiqueta = input('Historial de precios');

  protected readonly puntos = computed(() => {
    const v = this.values();
    if (!v.length) return [];
    const min = Math.min(...v), max = Math.max(...v), rango = max - min || 1, m = 12;
    return v.map((x, i) => ({
      x: v.length === 1 ? this.ancho / 2 : m + (i * (this.ancho - 2 * m)) / (v.length - 1),
      y: this.alto - m - ((x - min) / rango) * (this.alto - 2 * m),
    }));
  });
  protected readonly linea = computed(() => this.puntos().map((p) => `${p.x},${p.y}`).join(' '));
  protected readonly area = computed(() => {
    const p = this.puntos();
    return p.length ? `${p[0].x},${this.alto} ${this.linea()} ${p[p.length - 1].x},${this.alto}` : '';
  });
}
