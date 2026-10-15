import { Component, computed, inject } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';
import { DataService } from '../../../../core/services/data.service';
import { siguienteId } from '../../../../core/utils/utils';
import { CrudTable } from '../../../../shared/components/crud-table/crud-table';
import { TableColumn } from '../../../../shared/components/data-table/data-table';
import { EmptyState } from '../../../../shared/components/empty-state/empty-state';
import { FormField } from '../../../../shared/components/form-modal/form-modal';
import { PageHeader } from '../../../../shared/components/page-header/page-header';
import { StatCard } from '../../../../shared/components/stat-card/stat-card';
import { Row } from '../../../../shared/interfaces/row.interface';

@Component({
  selector: 'app-inventario-page',
  imports: [PageHeader, StatCard, CrudTable, EmptyState],
  templateUrl: './inventario-page.html',
})
export class InventarioPage {
  private readonly store = inject(DataService);
  private readonly auth = inject(AuthService);

  protected readonly tienda = computed(() => { const u = this.auth.usuario(); return u ? this.store.tiendaDeVendedor(u.id) : undefined; });
  protected readonly ubicacion = computed(() => { const t = this.tienda(); return t ? this.store.ubicacion(t) : ''; });
  private readonly idCategoria = computed(() => this.store.pabellon(this.tienda()?.idPabellon ?? 0)?.idCategoria ?? 0);
  protected readonly categoria = computed(() => this.store.categoria(this.idCategoria())?.nombre ?? '');

  protected readonly mios = computed<Row[]>(() => this.store.inventario().filter((i) => i.idTienda === this.tienda()?.id).map((i) => {
    const p = this.store.producto(i.idProducto);
    const v = this.store.variacionDe(i.idProducto);
    return {
      ...i, nombre: p?.nombre, codigo: p?.codigo, producto: p?.nombre, unidad: p?.unidad,
      tipo: this.store.tipo(p?.idTipo ?? 0)?.nombre ?? '', precioHoy: v?.precioHoy ?? 0, variacionPct: v?.variacionPct ?? 0,
      valor: i.cantidad * (v?.precioHoy ?? 0),
    };
  }));
  protected readonly unidades = computed(() => this.mios().filter((m) => m['estado']).reduce((s, m) => s + m['cantidad'], 0));
  protected readonly bajos = computed(() => this.mios().filter((m) => m['estado'] && m['cantidad'] < 100).length);

  protected readonly columnas: TableColumn[] = [
    { key: 'codigo', label: 'Código' },
    { key: 'producto', label: 'Producto' },
    { key: 'tipo', label: 'Tipo' },
    { key: 'unidad', label: 'Unidad' },
    { key: 'cantidad', label: 'Disponible', type: 'number' },
    { key: 'precioHoy', label: 'Precio hoy', type: 'currency' },
    { key: 'variacionPct', label: 'Variación', type: 'trend' },
    { key: 'valor', label: 'Valor en bodega', type: 'currency' },
    { key: 'estado', label: 'Estado', type: 'estado' },
  ];

  protected readonly campos = computed<FormField[]>(() => [
    {
      key: 'idProducto', label: 'Producto', type: 'select', required: true, disabledOnEdit: true,
      options: this.store.productos().filter((p) => p.estado && this.store.tipo(p.idTipo)?.idCategoria === this.idCategoria())
        .map((p) => ({ value: p.id, label: `${p.codigo} · ${p.nombre} (${p.unidad})` })),
    },
    { key: 'cantidad', label: 'Cantidad disponible', type: 'number', required: true, min: 0, step: 1, default: 100 },
  ]);

  protected readonly validar = (v: Row, editando: Row | null): string | null => {
    if (editando) return null;
    const ya = this.mios().some((m) => m['idProducto'] === Number(v['idProducto']));
    return ya ? 'Ese producto ya está en tu inventario. Edita su cantidad o restáuralo.' : null;
  };

  protected crear(v: Row) {
    const t = this.tienda();
    if (!t) return;
    this.store.inventario.update((l) => [...l, { id: siguienteId(l), idTienda: t.id, idProducto: Number(v['idProducto']), cantidad: Number(v['cantidad']), estado: true }]);
  }
  protected actualizar(fila: Row, v: Row) {
    this.store.inventario.update((l) => l.map((i) => (i.id === fila['id'] ? { ...i, cantidad: Number(v['cantidad']) } : i)));
  }
  protected cambiarEstado(fila: Row, estado: boolean) {
    this.store.inventario.update((l) => l.map((i) => (i.id === fila['id'] ? { ...i, estado } : i)));
  }
}
