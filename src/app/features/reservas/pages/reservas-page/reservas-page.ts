import { Component, computed, inject, signal } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';
import { DataService } from '../../../../core/services/data.service';
import { EstadoReserva } from '../../../../core/models/corabastos.model';
import { ToastService } from '../../../../core/services/toast.service';
import { DataTable, TableAction, TableActionEvent, TableColumn } from '../../../../shared/components/data-table/data-table';
import { EmptyState } from '../../../../shared/components/empty-state/empty-state';
import { PageHeader } from '../../../../shared/components/page-header/page-header';
import { ReservaDetalle, TONOS_RESERVA } from '../../../../shared/components/reserva-detalle/reserva-detalle';
import { StatCard } from '../../../../shared/components/stat-card/stat-card';
import { Row } from '../../../../shared/interfaces/row.interface';

@Component({
  selector: 'app-reservas-page',
  imports: [PageHeader, StatCard, DataTable, ReservaDetalle, EmptyState],
  templateUrl: './reservas-page.html',
})
export class ReservasPage {
  private readonly store = inject(DataService);
  private readonly auth = inject(AuthService);
  private readonly toast = inject(ToastService);

  protected readonly detalle = signal<Row | null>(null);
  protected readonly tienda = computed(() => { const u = this.auth.usuario(); return u ? this.store.tiendaDeVendedor(u.id) : undefined; });
  protected readonly ubicacion = computed(() => { const t = this.tienda(); return t ? this.store.ubicacion(t) : ''; });
  protected readonly filas = computed(() => this.store.reservasDetalladas().filter((r) => r.idTienda === this.tienda()?.id).sort((a, b) => b.id - a.id));
  protected contar(estado: string) { return this.filas().filter((r) => r.estadoReserva === estado).length; }

  protected readonly columnas: TableColumn[] = [
    { key: 'codigo', label: 'Código' },
    { key: 'comprador', label: 'Comprador' },
    { key: 'municipio', label: 'Municipio' },
    { key: 'fechaRetiro', label: 'Retiro', type: 'date' },
    { key: 'items', label: 'Productos', type: 'number' },
    { key: 'total', label: 'Total estimado', type: 'currency' },
    { key: 'estadoReserva', label: 'Estado', type: 'badge', badges: TONOS_RESERVA },
  ];
  protected readonly acciones: TableAction[] = [
    { id: 'detalle', icon: 'visibility', label: 'Ver detalle' },
    { id: 'confirmar', icon: 'check_circle', label: 'Confirmar reserva', color: 'primary', visible: (f) => f['estadoReserva'] === 'Pendiente' },
    { id: 'retirada', icon: 'inventory', label: 'Marcar como retirada', color: 'primary', visible: (f) => f['estadoReserva'] === 'Confirmada' },
    { id: 'cancelar', icon: 'event_busy', label: 'Cancelar reserva', color: 'danger', visible: (f) => f['estadoReserva'] === 'Pendiente' || f['estadoReserva'] === 'Confirmada' },
  ];

  protected alAccion(e: TableActionEvent) {
    if (e.action === 'detalle') { this.detalle.set(e.row); return; }
    const nuevo: Record<string, EstadoReserva> = { confirmar: 'Confirmada', retirada: 'Retirada', cancelar: 'Cancelada' };
    const estado = nuevo[e.action];
    if (!estado) return;
    this.store.cambiarEstadoReserva(e.row['id'], estado);
    this.toast.exito(`Reserva ${e.row['codigo']}: ${estado.toLowerCase()}`);
  }
}
