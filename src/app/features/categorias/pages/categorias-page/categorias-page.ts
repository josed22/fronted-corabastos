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
  selector: 'app-categorias-page',
  imports: [PageHeader, CrudTable, Tabs],
  templateUrl: './categorias-page.html',
})
export class CategoriasPage {
  private readonly store = inject(DataService);
  protected readonly activa = signal('categorias');
  protected readonly pestanas: TabItem[] = [{ id: 'categorias', label: 'Categorías', icon: 'category' }, { id: 'tipos', label: 'Tipos', icon: 'label' }];

  protected readonly colCategorias: TableColumn[] = [
    { key: 'nombre', label: 'Categoría' }, { key: 'descripcion', label: 'Descripción', wrap: true },
    { key: 'tipos', label: 'Tipos', type: 'number' }, { key: 'estado', label: 'Estado', type: 'estado' },
  ];
  protected readonly camposCategorias: FormField[] = [
    { key: 'nombre', label: 'Nombre', type: 'text', required: true },
    { key: 'descripcion', label: 'Descripción', type: 'textarea', required: true },
  ];
  protected readonly filasCategorias = computed<Row[]>(() => this.store.categorias().map((c) => ({ ...c, tipos: this.store.tipos().filter((t) => t.idCategoria === c.id).length })));

  protected readonly colTipos: TableColumn[] = [
    { key: 'categoria', label: 'Categoría' }, { key: 'nombre', label: 'Tipo' }, { key: 'descripcion', label: 'Descripción', wrap: true }, { key: 'estado', label: 'Estado', type: 'estado' },
  ];
  protected readonly camposTipos = computed<FormField[]>(() => [
    { key: 'idCategoria', label: 'Categoría', type: 'select', required: true, options: this.store.categorias().filter((c) => c.estado).map((c) => ({ value: c.id, label: c.nombre })) },
    { key: 'nombre', label: 'Nombre del tipo', type: 'text', required: true },
    { key: 'descripcion', label: 'Descripción', type: 'textarea', required: true },
  ]);
  protected readonly filasTipos = computed<Row[]>(() => this.store.tipos().map((t) => ({ ...t, categoria: this.store.categoria(t.idCategoria)?.nombre ?? '—' })));

  protected readonly validarCategoria = (v: Row, e: Row | null) =>
    this.store.categorias().some((c) => c.id !== e?.['id'] && c.nombre.toLowerCase() === String(v['nombre']).toLowerCase()) ? 'Ya existe una categoría con ese nombre' : null;
  protected readonly validarTipo = (v: Row, e: Row | null) =>
    this.store.tipos().some((t) => t.id !== e?.['id'] && t.nombre.toLowerCase() === String(v['nombre']).toLowerCase()) ? 'Ya existe un tipo con ese nombre' : null;

  protected crearCategoria(v: Row) { this.store.categorias.update((l) => [...l, { id: siguienteId(l), nombre: v['nombre'], descripcion: v['descripcion'], estado: true }]); }
  protected editarCategoria(f: Row, v: Row) { this.store.categorias.update((l) => l.map((c) => (c.id === f['id'] ? { ...c, nombre: v['nombre'], descripcion: v['descripcion'] } : c))); }
  protected estadoCategoria(f: Row, estado: boolean) { this.store.categorias.update((l) => l.map((c) => (c.id === f['id'] ? { ...c, estado } : c))); }

  protected crearTipo(v: Row) { this.store.tipos.update((l) => [...l, { id: siguienteId(l), idCategoria: Number(v['idCategoria']), nombre: v['nombre'], descripcion: v['descripcion'], estado: true }]); }
  protected editarTipo(f: Row, v: Row) { this.store.tipos.update((l) => l.map((t) => (t.id === f['id'] ? { ...t, idCategoria: Number(v['idCategoria']), nombre: v['nombre'], descripcion: v['descripcion'] } : t))); }
  protected estadoTipo(f: Row, estado: boolean) { this.store.tipos.update((l) => l.map((t) => (t.id === f['id'] ? { ...t, estado } : t))); }
}
