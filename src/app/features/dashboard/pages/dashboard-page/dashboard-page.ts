import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { DataService } from '../../../../core/services/data.service';
import { BarChart, BarItem } from '../../../../shared/components/bar-chart/bar-chart';
import { DataTable, TableColumn } from '../../../../shared/components/data-table/data-table';
import { PageHeader } from '../../../../shared/components/page-header/page-header';
import { TONOS_RESERVA } from '../../../../shared/components/reserva-detalle/reserva-detalle';
import { StatCard } from '../../../../shared/components/stat-card/stat-card';

@Component({
  selector: 'app-dashboard-page',
  imports: [PageHeader, StatCard, DataTable, BarChart, RouterLink],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.css',
})
export class DashboardPage {
  protected readonly auth = inject(AuthService);
  protected readonly store = inject(DataService);

  protected readonly subtitulo = computed(() => ({
    Administrador: 'Resumen general de la plaza y de los precios de hoy',
    Vendedor: 'Estado de tu bodega, tus reservas y tu inventario',
    Comprador: 'Tus favoritos, tus reservas y los cambios de precio de hoy',
  } as Record<string, string>)[this.auth.rol() ?? ''] ?? '');

  protected activos(lista: readonly { estado: boolean }[]) { return lista.filter((x) => x.estado).length; }

  // ----- administrador -----
  protected readonly abiertas = computed(() => this.store.reservas().filter((r) => r.estadoReserva === 'Pendiente' || r.estadoReserva === 'Confirmada').length);
  protected readonly mayoresVariaciones = computed(() => [...this.store.variaciones()].sort((a, b) => Math.abs(b.variacionPct) - Math.abs(a.variacionPct)).slice(0, 6));
  protected readonly reservasPorEstado = computed<BarItem[]>(() => {
    const colores: Record<string, string> = { Pendiente: '#f57c00', Confirmada: '#1565c0', Retirada: '#2e7d32', Cancelada: '#c62828' };
    return Object.keys(colores).map((estado) => ({ label: estado, value: this.store.reservas().filter((r) => r.estadoReserva === estado).length, color: colores[estado] }));
  });
  protected readonly colVariaciones: TableColumn[] = [
    { key: 'producto', label: 'Producto' }, { key: 'precioHoy', label: 'Hoy', type: 'currency' }, { key: 'variacionPct', label: 'Variación', type: 'trend' },
  ];

  // ----- vendedor -----
  protected readonly tienda = computed(() => { const u = this.auth.usuario(); return u ? this.store.tiendaDeVendedor(u.id) : undefined; });
  protected readonly misInventario = computed(() => this.store.inventario().filter((i) => i.idTienda === this.tienda()?.id && i.estado));
  protected readonly unidades = computed(() => this.misInventario().reduce((s, i) => s + i.cantidad, 0));
  protected readonly pendientes = computed(() => this.store.reservas().filter((r) => r.idTienda === this.tienda()?.id && r.estadoReserva === 'Pendiente').length);
  protected readonly stockBajo = computed(() => this.misInventario().filter((i) => i.cantidad < 100).map((i) => ({
    producto: this.store.producto(i.idProducto)?.nombre, unidad: this.store.producto(i.idProducto)?.unidad, cantidad: i.cantidad,
  })));
  protected readonly porAtender = computed(() => this.store.reservasDetalladas()
    .filter((r) => r.idTienda === this.tienda()?.id && (r.estadoReserva === 'Pendiente' || r.estadoReserva === 'Confirmada')).slice(0, 6));
  protected readonly colReservas: TableColumn[] = [
    { key: 'codigo', label: 'Código' }, { key: 'comprador', label: 'Comprador' }, { key: 'fechaRetiro', label: 'Retiro', type: 'date' },
    { key: 'estadoReserva', label: 'Estado', type: 'badge', badges: TONOS_RESERVA },
  ];
  protected readonly colStock: TableColumn[] = [
    { key: 'producto', label: 'Producto' }, { key: 'cantidad', label: 'Disponible', type: 'number' }, { key: 'unidad', label: 'Unidad' },
  ];

  // ----- comprador -----
  protected readonly misReservasActivas = computed(() => this.store.reservas()
    .filter((r) => r.idUsuario === this.auth.usuario()?.id && (r.estadoReserva === 'Pendiente' || r.estadoReserva === 'Confirmada')).length);
  protected readonly misFavoritos = computed(() => this.store.favoritos().filter((f) => f.idUsuario === this.auth.usuario()?.id)
    .map((f) => this.store.variacionDe(f.idProducto)).filter((v) => !!v).map((v) => ({
      producto: v!.producto, categoria: v!.categoria, precioHoy: v!.precioHoy, variacionPct: v!.variacionPct,
    })));
  protected readonly favoritosQueBajaron = computed(() => this.misFavoritos().filter((f) => f.variacionPct < 0).length);
  protected readonly avisos = computed(() => this.store.avisosPara(this.auth.usuario()));
  protected readonly colFavoritos: TableColumn[] = [
    { key: 'producto', label: 'Producto' }, { key: 'precioHoy', label: 'Precio hoy', type: 'currency' }, { key: 'variacionPct', label: 'Variación', type: 'trend' },
  ];
}
