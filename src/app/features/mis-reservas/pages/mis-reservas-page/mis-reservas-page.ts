import { Component, computed, inject, signal } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';
import { DataService } from '../../../../core/services/data.service';
import { ToastService } from '../../../../core/services/toast.service';
import { ConfirmDialog } from '../../../../shared/components/confirm-dialog/confirm-dialog';
import { DataTable, TableAction, TableActionEvent, TableColumn } from '../../../../shared/components/data-table/data-table';
import { PageHeader } from '../../../../shared/components/page-header/page-header';
import { ReservaDetalle, TONOS_RESERVA } from '../../../../shared/components/reserva-detalle/reserva-detalle';
import { StatCard } from '../../../../shared/components/stat-card/stat-card';
import { Row } from '../../../../shared/interfaces/row.interface';

@Component({
  selector: 'app-mis-reservas-page',
  imports: [PageHeader, StatCard, DataTable, ReservaDetalle, ConfirmDialog],
  templateUrl: './mis-reservas-page.html',
})
export class MisReservasPage {
  private readonly store = inject(DataService);
  private readonly auth = inject(AuthService);
  private readonly toast = inject(ToastService);

  protected readonly detalle = signal<Row | null>(null);
  protected readonly cancelando = signal<Row | null>(null);

  protected readonly mias = computed(() => {
    const u = this.auth.usuario();
    return this.store.reservasDetalladas().filter((r) => r.idUsuario === u?.id).sort((a, b) => b.id - a.id);
  });
  protected contar(estado: string) { return this.mias().filter((r) => r.estadoReserva === estado).length; }

  protected readonly columnas: TableColumn[] = [
    { key: 'codigo', label: 'Código' },
    { key: 'tienda', label: 'Bodega' },
    { key: 'ubicacion', label: 'Ubicación' },
    { key: 'fechaRetiro', label: 'Retiro', type: 'date' },
    { key: 'items', label: 'Productos', type: 'number' },
    { key: 'total', label: 'Total estimado', type: 'currency' },
    { key: 'estadoReserva', label: 'Estado', type: 'badge', badges: TONOS_RESERVA },
  ];
  protected readonly acciones: TableAction[] = [
    { id: 'detalle', icon: 'visibility', label: 'Ver detalle' },
    { id: 'cancelar', icon: 'event_busy', label: 'Cancelar reserva', color: 'danger', visible: (f) => f['estadoReserva'] === 'Pendiente' || f['estadoReserva'] === 'Confirmada' },
  ];

  protected alAccion(e: TableActionEvent) {
    if (e.action === 'detalle') this.detalle.set(e.row);
    else if (e.action === 'cancelar') this.cancelando.set(e.row);
  }

  protected confirmarCancelar() {
    const r = this.cancelando();
    if (r) { this.store.cambiarEstadoReserva(r['id'], 'Cancelada'); this.toast.exito(`Reserva ${r['codigo']} cancelada`); }
    this.cancelando.set(null);
  }
}
