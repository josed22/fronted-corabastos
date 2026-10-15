import { Component, computed, inject, input, output } from '@angular/core';
import { DataService } from '../../../core/services/data.service';
import { DataTable, TableColumn } from '../data-table/data-table';
import { MonedaPipe } from '../../pipes/moneda.pipe';
import { Modal } from '../modal/modal';
import { StatusBadge } from '../status-badge/status-badge';
import { Row } from '../../interfaces/row.interface';

export const TONOS_RESERVA = { Pendiente: 'warning', Confirmada: 'info', Retirada: 'success', Cancelada: 'danger' } as const;

/** Ventana con los productos y el total de una reserva. */
@Component({
  selector: 'app-reserva-detalle',
  imports: [Modal, DataTable, StatusBadge, MonedaPipe],
  templateUrl: './reserva-detalle.html',
  styleUrl: './reserva-detalle.css',
})
export class ReservaDetalle {
  private readonly store = inject(DataService);
  readonly reserva = input<Row | null>(null);
  readonly closed = output<void>();

  protected readonly columnas: TableColumn[] = [
    { key: 'producto', label: 'Producto' },
    { key: 'cantidad', label: 'Cantidad', type: 'number' },
    { key: 'unidad', label: 'Unidad' },
    { key: 'precioUnitario', label: 'Precio por unidad', type: 'currency' },
    { key: 'subtotal', label: 'Subtotal', type: 'currency' },
  ];
  protected readonly filas = computed(() => { const r = this.reserva(); return r ? this.store.detalleDe(r['id']) : []; });
  protected readonly total = computed(() => this.filas().reduce((s, f) => s + f.subtotal, 0));
  protected tono(estado: keyof typeof TONOS_RESERVA) { return TONOS_RESERVA[estado] ?? 'neutral'; }
}
