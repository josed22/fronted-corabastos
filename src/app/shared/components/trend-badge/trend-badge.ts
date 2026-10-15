import { DecimalPipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';

/** Muestra el porcentaje en que subió o bajó un precio. Subir es naranja/rojo, bajar es verde. */
@Component({
  selector: 'app-trend-badge',
  imports: [DecimalPipe],
  templateUrl: './trend-badge.html',
  styleUrl: './trend-badge.css',
})
export class TrendBadge {
  readonly value = input.required<number | null>();
  protected readonly valor = computed(() => this.value() ?? 0);
  protected readonly absoluto = computed(() => Math.abs(this.valor()));
  protected readonly signo = computed(() => (this.valor() > 0 ? '+' : this.valor() < 0 ? '−' : ''));
  protected readonly icono = computed(() => (this.valor() > 0 ? 'arrow_upward' : this.valor() < 0 ? 'arrow_downward' : 'remove'));
  protected readonly titulo = computed(() => (this.valor() > 0 ? 'Subió frente al día anterior' : this.valor() < 0 ? 'Bajó frente al día anterior' : 'Sin cambio'));
}
