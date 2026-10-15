import { Component, computed, inject, signal } from '@angular/core';
import { DataService } from '../../../../core/services/data.service';
import { siguienteId } from '../../../../core/utils/utils';
import { CrudTable } from '../../../../shared/components/crud-table/crud-table';
import { TableColumn } from '../../../../shared/components/data-table/data-table';
import { FormField } from '../../../../shared/components/form-modal/form-modal';
import { PageHeader } from '../../../../shared/components/page-header/page-header';
import { Tabs, TabItem } from '../../../../shared/components/tabs/tabs';
import { Row } from '../../../../shared/interfaces/row.interface';

@Component({
  selector: 'app-tiendas-page',
  imports: [PageHeader, CrudTable, Tabs],
  templateUrl: './tiendas-page.html',
})
export class TiendasPage {
  private readonly store = inject(DataService);
  protected readonly activa = signal('bodegas');
  protected readonly pestanas: TabItem[] = [{ id: 'bodegas', label: 'Bodegas', icon: 'storefront' }, { id: 'pabellones', label: 'Pabellones', icon: 'domain' }];

  protected readonly colBodegas: TableColumn[] = [
    { key: 'nombre', label: 'Bodega' }, { key: 'pabellon', label: 'Pabellón' }, { key: 'numeroLocal', label: 'Local' },
    { key: 'vendedor', label: 'Vendedor' }, { key: 'telefono', label: 'Teléfono' }, { key: 'estado', label: 'Estado', type: 'estado' },
  ];
  protected readonly filasBodegas = computed<Row[]>(() => this.store.tiendas().map((t) => ({
    ...t, pabellon: this.store.pabellon(t.idPabellon)?.nombre ?? '—', vendedor: this.store.nombreUsuario(t.idUsuario),
  })));
  protected readonly camposBodegas = computed<FormField[]>(() => [
    { key: 'nombre', label: 'Nombre de la bodega', type: 'text', required: true, full: true },
    { key: 'idPabellon', label: 'Pabellón', type: 'select', required: true, options: this.store.pabellones().filter((p) => p.estado).map((p) => ({ value: p.id, label: p.nombre })) },
    { key: 'numeroLocal', label: 'Número de local', type: 'text', required: true, placeholder: 'Ej. G-21' },
    { key: 'idUsuario', label: 'Vendedor', type: 'select', required: true,
      options: this.store.usuarios().filter((u) => u.estado && this.store.nombreRol(u.idRol) === 'Vendedor').map((u) => ({ value: u.id, label: `${u.nombre} ${u.apellido}` })) },
    { key: 'telefono', label: 'Teléfono', type: 'text', required: true },
  ]);
  protected readonly validarBodega = (v: Row, e: Row | null): string | null => {
    const otras = this.store.tiendas().filter((t) => t.id !== e?.['id']);
    if (otras.some((t) => t.nombre.toLowerCase() === String(v['nombre']).toLowerCase())) return 'Ya existe una bodega con ese nombre';
    if (otras.some((t) => t.idPabellon === Number(v['idPabellon']) && t.numeroLocal.toLowerCase() === String(v['numeroLocal']).toLowerCase())) return 'Ese local ya está ocupado en el pabellón';
    return null;
  };
  protected crearBodega(v: Row) {
    this.store.tiendas.update((l) => [...l, { id: siguienteId(l), idUsuario: Number(v['idUsuario']), idPabellon: Number(v['idPabellon']), nombre: v['nombre'], numeroLocal: v['numeroLocal'], telefono: v['telefono'], estado: true }]);
  }
  protected editarBodega(f: Row, v: Row) {
    this.store.tiendas.update((l) => l.map((t) => (t.id === f['id'] ? { ...t, idUsuario: Number(v['idUsuario']), idPabellon: Number(v['idPabellon']), nombre: v['nombre'], numeroLocal: v['numeroLocal'], telefono: v['telefono'] } : t)));
  }
  protected estadoBodega(f: Row, estado: boolean) { this.store.tiendas.update((l) => l.map((t) => (t.id === f['id'] ? { ...t, estado } : t))); }

  protected readonly colPabellones: TableColumn[] = [
    { key: 'nombre', label: 'Pabellón' }, { key: 'categoria', label: 'Categoría que vende' }, { key: 'descripcion', label: 'Descripción', wrap: true },
    { key: 'bodegas', label: 'Bodegas', type: 'number' }, { key: 'estado', label: 'Estado', type: 'estado' },
  ];
  protected readonly filasPabellones = computed<Row[]>(() => this.store.pabellones().map((p) => ({
    ...p, categoria: this.store.categoria(p.idCategoria)?.nombre ?? '—', bodegas: this.store.tiendas().filter((t) => t.idPabellon === p.id && t.estado).length,
  })));
  protected readonly camposPabellones = computed<FormField[]>(() => [
    { key: 'nombre', label: 'Nombre del pabellón', type: 'text', required: true, full: true },
    { key: 'idCategoria', label: 'Categoría que vende', type: 'select', required: true, full: true, options: this.store.categorias().filter((c) => c.estado).map((c) => ({ value: c.id, label: c.nombre })) },
    { key: 'descripcion', label: 'Descripción', type: 'textarea', required: true },
  ]);
  protected readonly validarPabellon = (v: Row, e: Row | null): string | null =>
    this.store.pabellones().some((p) => p.id !== e?.['id'] && p.nombre.toLowerCase() === String(v['nombre']).toLowerCase()) ? 'Ya existe un pabellón con ese nombre' : null;
  protected crearPabellon(v: Row) { this.store.pabellones.update((l) => [...l, { id: siguienteId(l), idCategoria: Number(v['idCategoria']), nombre: v['nombre'], descripcion: v['descripcion'], estado: true }]); }
  protected editarPabellon(f: Row, v: Row) { this.store.pabellones.update((l) => l.map((p) => (p.id === f['id'] ? { ...p, idCategoria: Number(v['idCategoria']), nombre: v['nombre'], descripcion: v['descripcion'] } : p))); }
  protected estadoPabellon(f: Row, estado: boolean) { this.store.pabellones.update((l) => l.map((p) => (p.id === f['id'] ? { ...p, estado } : p))); }
}
