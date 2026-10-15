import { Component, computed, inject } from '@angular/core';
import { DataService } from '../../../../core/services/data.service';
import { ToastService } from '../../../../core/services/toast.service';
import { DataTable, TableColumn, TableToggleEvent } from '../../../../shared/components/data-table/data-table';
import { PageHeader } from '../../../../shared/components/page-header/page-header';
import { Row } from '../../../../shared/interfaces/row.interface';

@Component({
  selector: 'app-roles-modulos-page',
  imports: [PageHeader, DataTable],
  templateUrl: './roles-modulos-page.html',
  styleUrl: './roles-modulos-page.css',
})
export class RolesModulosPage {
  private readonly store = inject(DataService);
  private readonly toast = inject(ToastService);

  protected readonly roles = this.store.roles;
  protected readonly columnas = computed<TableColumn[]>(() => [
    { key: 'nombre', label: 'Módulo' },
    { key: 'descripcion', label: 'Descripción', wrap: true },
    ...this.store.roles().map((r) => ({ key: `rol${r.id}`, label: r.nombre, type: 'check' as const, align: 'center' as const, sortable: false })),
  ]);
  protected readonly filas = computed<Row[]>(() => this.store.modulos().map((m) => {
    const fila: Row = { ...m };
    for (const r of this.store.roles()) fila[`rol${r.id}`] = this.store.permisos().some((p) => p.idRol === r.id && p.idModulo === m.id);
    return fila;
  }));

  protected cantidad(idRol: number) { return this.store.permisos().filter((p) => p.idRol === idRol).length; }

  protected alternar(e: TableToggleEvent) {
    const idRol = Number(e.key.replace('rol', ''));
    const idModulo = e.row['id'];
    const rol = this.store.nombreRol(idRol);
    if (rol === 'Administrador' && e.row['ruta'] === '/roles-modulos' && !e.value) {
      this.toast.error('El administrador no puede quitarse el acceso a este módulo');
      this.store.permisos.update((l) => [...l]);   // refresca el interruptor
      return;
    }
    this.store.permisos.update((l) => e.value ? [...l, { idRol, idModulo }] : l.filter((p) => !(p.idRol === idRol && p.idModulo === idModulo)));
    this.toast.exito(`${e.value ? 'Se dio' : 'Se quitó'} el acceso a "${e.row['nombre']}" para ${rol}`);
  }
}
