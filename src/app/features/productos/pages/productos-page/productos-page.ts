import { Component, computed, inject } from '@angular/core';
import { DataService } from '../../../../core/services/data.service';
import { siguienteId } from '../../../../core/utils/utils';
import { CrudTable } from '../../../../shared/components/crud-table/crud-table';
import { TableColumn } from '../../../../shared/components/data-table/data-table';
import { FormField } from '../../../../shared/components/form-modal/form-modal';
import { PageHeader } from '../../../../shared/components/page-header/page-header';
import { Row } from '../../../../shared/interfaces/row.interface';

const UNIDADES = ['kg', 'libra', 'litro', 'unidad', 'cubeta', 'bulto'];

@Component({
  selector: 'app-productos-page',
  imports: [PageHeader, CrudTable],
  templateUrl: './productos-page.html',
})
export class ProductosPage {
  private readonly store = inject(DataService);

  protected readonly filas = computed<Row[]>(() => this.store.productos().map((p) => {
    const tipo = this.store.tipo(p.idTipo);
    return { ...p, tipo: tipo?.nombre ?? '—', categoria: this.store.categoria(tipo?.idCategoria ?? 0)?.nombre ?? '—' };
  }));

  protected readonly columnas: TableColumn[] = [
    { key: 'codigo', label: 'Código' }, { key: 'nombre', label: 'Producto' }, { key: 'categoria', label: 'Categoría' },
    { key: 'tipo', label: 'Tipo' }, { key: 'unidad', label: 'Unidad' }, { key: 'estado', label: 'Estado', type: 'estado' },
  ];

  protected readonly campos = computed<FormField[]>(() => [
    { key: 'codigo', label: 'Código', type: 'text', required: true, placeholder: 'Ej. GRA-012' },
    { key: 'nombre', label: 'Nombre del producto', type: 'text', required: true },
    { key: 'idTipo', label: 'Categoría · Tipo', type: 'select', required: true,
      options: this.store.tipos().filter((t) => t.estado).map((t) => ({ value: t.id, label: `${this.store.categoria(t.idCategoria)?.nombre} · ${t.nombre}` })) },
    { key: 'unidad', label: 'Unidad de venta', type: 'select', required: true, default: 'kg', options: UNIDADES.map((u) => ({ value: u, label: u })) },
    { key: 'precioInicial', label: 'Precio de hoy (COP por unidad)', type: 'number', required: true, min: 50, step: 50, hideOnEdit: true,
      hint: 'El administrador puede cambiarlo después en Precios del día', full: true },
  ]);

  protected readonly validar = (v: Row, e: Row | null): string | null =>
    this.store.productos().some((p) => p.id !== e?.['id'] && p.codigo.toLowerCase() === String(v['codigo']).toLowerCase()) ? 'Ya existe un producto con ese código' : null;

  protected crear(v: Row) {
    const id = siguienteId(this.store.productos());
    this.store.productos.update((l) => [...l, { id, idTipo: Number(v['idTipo']), codigo: v['codigo'], nombre: v['nombre'], unidad: v['unidad'], estado: true }]);
    const precio = Number(v['precioInicial']);
    this.store.precios.update((l) => [...l, { idProducto: id, fecha: this.store.hoy, precio }, { idProducto: id, fecha: this.store.ayer, precio }]);
  }
  protected actualizar(f: Row, v: Row) {
    this.store.productos.update((l) => l.map((p) => (p.id === f['id'] ? { ...p, idTipo: Number(v['idTipo']), codigo: v['codigo'], nombre: v['nombre'], unidad: v['unidad'] } : p)));
  }
  protected cambiarEstado(f: Row, estado: boolean) { this.store.productos.update((l) => l.map((p) => (p.id === f['id'] ? { ...p, estado } : p))); }
}
