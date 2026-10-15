import { Component, computed, inject, signal } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';
import { DataService } from '../../../../core/services/data.service';
import { ItemCatalogo } from '../../../../core/models/corabastos.model';
import { ToastService } from '../../../../core/services/toast.service';
import { fechaIso } from '../../../../core/utils/utils';
import { DataTable, TableAction, TableActionEvent, TableColumn } from '../../../../shared/components/data-table/data-table';
import { FilterSelect } from '../../../../shared/components/filter-select/filter-select';
import { FormField, FormModal } from '../../../../shared/components/form-modal/form-modal';
import { PageHeader } from '../../../../shared/components/page-header/page-header';
import { StatCard } from '../../../../shared/components/stat-card/stat-card';
import { Row } from '../../../../shared/interfaces/row.interface';

@Component({
  selector: 'app-catalogo-page',
  imports: [PageHeader, StatCard, DataTable, FilterSelect, FormModal],
  templateUrl: './catalogo-page.html',
})
export class CatalogoPage {
  protected readonly store = inject(DataService);
  private readonly auth = inject(AuthService);
  private readonly toast = inject(ToastService);

  protected readonly categoria = signal('');
  protected readonly pabellon = signal('');
  protected readonly reservando = signal<ItemCatalogo | null>(null);
  protected readonly esComprador = computed(() => this.auth.rol() === 'Comprador');
  protected readonly categorias = computed(() => this.store.categorias().filter((c) => c.estado).map((c) => c.nombre));
  protected readonly pabellones = computed(() => this.store.pabellones().filter((p) => p.estado).map((p) => p.nombre));

  private readonly disponibles = computed(() => this.store.catalogo().filter((i) => i.cantidad > 0));
  protected readonly filas = computed(() => this.disponibles()
    .filter((i) => (!this.categoria() || i.categoria === this.categoria()) && (!this.pabellon() || i.pabellon === this.pabellon()))
    .map((i) => ({ ...i, favorito: this.esFavorito(i.idProducto) })));
  protected readonly bodegas = computed(() => new Set(this.disponibles().map((i) => i.idTienda)).size);
  protected readonly productos = computed(() => new Set(this.disponibles().map((i) => i.idProducto)).size);
  protected readonly misFavoritos = computed(() => {
    const u = this.auth.usuario();
    return u ? this.store.favoritos().filter((f) => f.idUsuario === u.id).length : 0;
  });

  protected readonly columnas: TableColumn[] = [
    { key: 'producto', label: 'Producto' },
    { key: 'categoria', label: 'Categoría' },
    { key: 'tienda', label: 'Bodega' },
    { key: 'ubicacion', label: 'Ubicación' },
    { key: 'cantidad', label: 'Disponible', type: 'number' },
    { key: 'unidad', label: 'Unidad' },
    { key: 'precioHoy', label: 'Precio hoy', type: 'currency' },
    { key: 'variacionPct', label: 'Variación', type: 'trend' },
  ];

  protected readonly acciones = computed<TableAction[]>(() => this.esComprador() ? [
    { id: 'favorito', icon: (f: Row) => (f['favorito'] ? 'heart_broken' : 'favorite'), label: (f: Row) => (f['favorito'] ? 'Quitar de favoritos' : 'Agregar a favoritos'), color: 'danger' },
    { id: 'reservar', icon: 'bookmark_add', label: 'Reservar', color: 'primary' },
  ] : []);

  protected readonly camposReserva = computed<FormField[]>(() => {
    const i = this.reservando();
    return [
      { key: 'cantidad', label: `Cantidad (${i?.unidad ?? ''})`, type: 'number', required: true, min: 1, max: i?.cantidad ?? 1, step: 1,
        default: Math.min(25, i?.cantidad ?? 1), hint: `Disponible en la bodega: ${i?.cantidad ?? 0} ${i?.unidad ?? ''}` },
      { key: 'fechaRetiro', label: 'Fecha de retiro', type: 'date', required: true, default: fechaIso(1) },
      { key: 'observacion', label: 'Observación (opcional)', type: 'textarea', placeholder: 'Hora aproximada de llegada, tipo de vehículo…' },
    ];
  });

  private esFavorito(idProducto: number) {
    const u = this.auth.usuario();
    return !!u && this.store.favoritos().some((f) => f.idUsuario === u.id && f.idProducto === idProducto);
  }

  protected alAccion(e: TableActionEvent) {
    const item = this.store.catalogo().find((i) => i.id === e.row['id']);
    const u = this.auth.usuario();
    if (!item || !u) return;
    if (e.action === 'reservar') this.reservando.set(item);
    else if (e.action === 'favorito') {
      const ahora = this.store.alternarFavorito(u.id, item.idProducto);
      this.toast.exito(ahora ? `${item.producto} agregado a tus favoritos` : `${item.producto} quitado de tus favoritos`);
    }
  }

  protected reservar(v: Row) {
    const item = this.reservando();
    const u = this.auth.usuario();
    if (!item || !u) return;
    const codigo = this.store.crearReserva(u.id, item.idTienda, item.idProducto, Number(v['cantidad']), String(v['fechaRetiro']), String(v['observacion'] ?? ''));
    this.toast.exito(`Reserva ${codigo} creada en ${item.tienda}. Estado: pendiente de confirmación`);
    this.reservando.set(null);
  }
}
