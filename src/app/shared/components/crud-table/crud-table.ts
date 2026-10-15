import { Component, inject, input, output, signal } from '@angular/core';
import { ToastService } from '../../../core/services/toast.service';
import { ConfirmDialog } from '../confirm-dialog/confirm-dialog';
import { DataTable, TableAction, TableActionEvent, TableColumn } from '../data-table/data-table';
import { FormField, FormModal } from '../form-modal/form-modal';
import { Row } from '../../interfaces/row.interface';

/** Tabla con crear, editar y eliminar (eliminado lógico: cambia el estado, no borra el registro). */
@Component({
  selector: 'app-crud-table',
  imports: [DataTable, FormModal, ConfirmDialog],
  templateUrl: './crud-table.html',
})
export class CrudTable {
  private readonly toast = inject(ToastService);

  readonly columns = input.required<TableColumn[]>();
  readonly rows = input.required<readonly Row[]>();
  readonly fields = input.required<FormField[]>();
  /** Nombre en singular, por ejemplo "usuario". */
  readonly entity = input.required<string>();
  readonly plural = input('registros');
  /** Devuelve un mensaje de error para impedir el guardado (por ejemplo, un valor repetido). */
  readonly validator = input<(valores: Row, editando: Row | null) => string | null>();

  readonly created = output<Row>();
  readonly updated = output<{ row: Row; values: Row }>();
  readonly removed = output<Row>();
  readonly restored = output<Row>();

  protected readonly formAbierto = signal(false);
  protected readonly editando = signal<Row | null>(null);
  protected readonly porEliminar = signal<Row | null>(null);

  protected readonly acciones: TableAction[] = [
    { id: 'editar', icon: 'edit', label: 'Editar', color: 'primary' },
    { id: 'eliminar', icon: 'delete', label: 'Eliminar', color: 'danger', visible: (f) => f['estado'] !== false },
    { id: 'restaurar', icon: 'restore_from_trash', label: 'Restaurar', color: 'primary', visible: (f) => f['estado'] === false },
  ];

  protected abrirCrear() { this.editando.set(null); this.formAbierto.set(true); }

  protected alAccion(e: TableActionEvent) {
    if (e.action === 'editar') { this.editando.set(e.row); this.formAbierto.set(true); }
    else if (e.action === 'eliminar') this.porEliminar.set(e.row);
    else if (e.action === 'restaurar') { this.restored.emit(e.row); this.toast.exito(`${this.mayuscula(this.entity())} restaurado`); }
  }

  protected guardar(valores: Row) {
    const actual = this.editando();
    const error = this.validator()?.(valores, actual);
    if (error) { this.toast.error(error); return; }
    if (actual) { this.updated.emit({ row: actual, values: valores }); this.toast.exito(`${this.mayuscula(this.entity())} actualizado correctamente`); }
    else { this.created.emit(valores); this.toast.exito(`${this.mayuscula(this.entity())} creado correctamente`); }
    this.formAbierto.set(false);
  }

  protected confirmarEliminar() {
    const fila = this.porEliminar();
    if (fila) { this.removed.emit(fila); this.toast.exito(`${this.mayuscula(this.entity())} eliminado (queda inactivo)`); }
    this.porEliminar.set(null);
  }

  private mayuscula(t: string) { return t.charAt(0).toUpperCase() + t.slice(1); }
}
