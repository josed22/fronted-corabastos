import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, effect, input, output, signal, viewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MonedaPipe } from '../../pipes/moneda.pipe';
import { EmptyState } from '../empty-state/empty-state';
import { StatusBadge, Tono } from '../status-badge/status-badge';
import { TrendBadge } from '../trend-badge/trend-badge';
import { Row } from '../../interfaces/row.interface';

export interface TableColumn {
  key: string;
  label: string;
  /** text (por defecto), number, currency, date, badge, trend, estado o check */
  type?: 'text' | 'number' | 'currency' | 'date' | 'badge' | 'trend' | 'estado' | 'check';
  sortable?: boolean;
  /** Permite que el texto largo (por ejemplo descripciones) ocupe varias líneas. */
  wrap?: boolean;
  align?: 'left' | 'right' | 'center';
  /** Para type 'badge': color según el valor de la celda. */
  badges?: Record<string, Tono>;
}

export interface TableAction {
  id: string;
  icon: string | ((row: Row) => string);
  label: string | ((row: Row) => string);
  color?: 'default' | 'primary' | 'danger';
  visible?: (row: Row) => boolean;
}

export interface TableActionEvent { action: string; row: Row; }
export interface TableToggleEvent { row: Row; key: string; value: boolean; }

/** Tabla reutilizable con búsqueda, ordenamiento y paginación (Angular Material). */
@Component({
  selector: 'app-data-table',
  imports: [MatTableModule, MatSortModule, MatPaginatorModule, MonedaPipe, DatePipe, DecimalPipe, TrendBadge, StatusBadge, EmptyState],
  templateUrl: './data-table.html',
  styleUrl: './data-table.css',
})
export class DataTable {
  readonly columns = input.required<TableColumn[]>();
  readonly rows = input.required<readonly Row[]>();
  readonly actions = input<TableAction[]>([]);
  readonly searchable = input(true);
  readonly paginate = input(true);
  readonly pageSize = input(10);
  readonly placeholder = input('Buscar en la tabla…');
  readonly emptyText = input('No hay registros para mostrar');

  readonly action = output<TableActionEvent>();
  readonly toggle = output<TableToggleEvent>();

  protected readonly dataSource = new MatTableDataSource<Row>([]);
  protected readonly sort = viewChild(MatSort);
  protected readonly paginator = viewChild(MatPaginator);
  protected readonly total = signal(0);
  protected readonly columnasMostradas = signal<string[]>([]);
  private filtro = '';

  constructor() {
    effect(() => {
      const cols = this.columns();
      this.dataSource.filterPredicate = (fila, f) =>
        cols.some((c) => String(fila[c.key] ?? '').toLowerCase().includes(f));
      this.columnasMostradas.set([...cols.map((c) => c.key), ...(this.actions().length ? ['__acciones'] : [])]);
    });
    effect(() => {
      this.dataSource.data = [...this.rows()];
      this.recontar();
    });
    effect(() => { this.dataSource.sort = this.sort() ?? null; });
    effect(() => { this.dataSource.paginator = this.paginator() ?? null; });
  }

  protected buscar(valor: string) {
    this.filtro = valor.trim().toLowerCase();
    this.dataSource.filter = this.filtro;
    this.dataSource.paginator?.firstPage();
    this.recontar();
  }

  private recontar() {
    this.total.set(this.filtro ? this.dataSource.data.filter((f) => this.dataSource.filterPredicate(f, this.filtro)).length : this.dataSource.data.length);
  }

  protected icono(a: TableAction, fila: Row) { return typeof a.icon === 'function' ? a.icon(fila) : a.icon; }
  protected etiqueta(a: TableAction, fila: Row) { return typeof a.label === 'function' ? a.label(fila) : a.label; }
  protected tono(c: TableColumn, valor: string): Tono { return c.badges?.[valor] ?? 'neutral'; }
  protected alternar(fila: Row, key: string, evento: Event) {
    this.toggle.emit({ row: fila, key, value: (evento.target as HTMLInputElement).checked });
  }
}
