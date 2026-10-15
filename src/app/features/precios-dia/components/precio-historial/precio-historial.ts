import { Component, computed, input, output } from '@angular/core';
import { VariacionPrecio } from '../../../../core/models/corabastos.model';
import { DataTable, TableColumn } from '../../../../shared/components/data-table/data-table';
import { Modal } from '../../../../shared/components/modal/modal';
import { Sparkline } from '../../../../shared/components/sparkline/sparkline';
import { Row } from '../../../../shared/interfaces/row.interface';

/**
 * Componente presentacional: solo muestra el historial de precios que le entrega la página.
 * No consulta servicios ni conoce la ruta.
 */
@Component({
  selector: 'app-precio-historial',
  imports: [Modal, Sparkline, DataTable],
  templateUrl: './precio-historial.html',
})
export class PrecioHistorial {
  readonly producto = input<VariacionPrecio | null>(null);
  readonly filas = input<readonly Row[]>([]);
  readonly closed = output<void>();

  protected readonly columnas: TableColumn[] = [
    { key: 'fecha', label: 'Fecha', type: 'date' },
    { key: 'precio', label: 'Precio', type: 'currency' },
    { key: 'variacionPct', label: 'Variación diaria', type: 'trend' },
  ];
  /** Valores de más antiguo a más reciente, para dibujar la línea. */
  protected readonly valores = computed(() => this.filas().map((f) => f['precio'] as number).reverse());
}
