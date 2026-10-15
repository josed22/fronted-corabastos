import { Pipe, PipeTransform } from '@angular/core';

/** Da formato de pesos colombianos: 3950 → "$ 3.950". */
@Pipe({ name: 'moneda' })
export class MonedaPipe implements PipeTransform {
  private readonly formato = new Intl.NumberFormat('es-CO', {
    style: 'currency', currency: 'COP', minimumFractionDigits: 0, maximumFractionDigits: 0,
  });

  transform(valor: number | null | undefined): string {
    return valor === null || valor === undefined || Number.isNaN(valor) ? '' : this.formato.format(valor);
  }
}
