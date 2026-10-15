import { Component, computed, inject } from '@angular/core';
import { DataService } from '../../../../core/services/data.service';
import { fechaIso, siguienteId } from '../../../../core/utils/utils';
import { TIPOS_IDENTIFICACION } from '../../../../core/data/seed';
import { CrudTable } from '../../../../shared/components/crud-table/crud-table';
import { TableColumn } from '../../../../shared/components/data-table/data-table';
import { FormField } from '../../../../shared/components/form-modal/form-modal';
import { PageHeader } from '../../../../shared/components/page-header/page-header';
import { Row } from '../../../../shared/interfaces/row.interface';

@Component({
  selector: 'app-usuarios-page',
  imports: [PageHeader, CrudTable],
  templateUrl: './usuarios-page.html',
})
export class UsuariosPage {
  private readonly store = inject(DataService);

  protected readonly filas = computed<Row[]>(() => this.store.usuarios().map((u) => ({
    ...u, nombreCompleto: `${u.nombre} ${u.apellido}`, rolNombre: this.store.nombreRol(u.idRol), municipioNombre: this.store.nombreMunicipio(u.idMunicipio),
  })));

  protected readonly columnas: TableColumn[] = [
    { key: 'nombreCompleto', label: 'Nombre' },
    { key: 'correo', label: 'Correo' },
    { key: 'rolNombre', label: 'Rol', type: 'badge', badges: { Administrador: 'info', Vendedor: 'warning', Comprador: 'success' } },
    { key: 'municipioNombre', label: 'Municipio' },
    { key: 'numeroIdentificacion', label: 'Identificación' },
    { key: 'creado', label: 'Registro', type: 'date' },
    { key: 'estado', label: 'Estado', type: 'estado' },
  ];

  protected readonly campos = computed<FormField[]>(() => [
    { key: 'nombre', label: 'Nombre', type: 'text', required: true },
    { key: 'apellido', label: 'Apellido', type: 'text', required: true },
    { key: 'correo', label: 'Correo electrónico', type: 'email', required: true },
    { key: 'idRol', label: 'Rol', type: 'select', required: true, options: this.store.roles().map((r) => ({ value: r.id, label: r.nombre })) },
    { key: 'idMunicipio', label: 'Municipio', type: 'select', required: true, options: this.store.municipios().map((m) => ({ value: m.id, label: m.nombre })) },
    { key: 'tipoIdentificacion', label: 'Tipo de identificación', type: 'select', required: true, default: TIPOS_IDENTIFICACION[0], options: TIPOS_IDENTIFICACION.map((t) => ({ value: t, label: t })) },
    { key: 'numeroIdentificacion', label: 'Número de identificación', type: 'text', required: true },
    { key: 'direccion', label: 'Dirección', type: 'text', required: true },
    { key: 'password', label: 'Contraseña', type: 'password', required: true, hideOnEdit: true, hint: 'Mínimo 6 caracteres', full: true },
  ]);

  protected readonly validar = (v: Row, editando: Row | null): string | null => {
    const otros = this.store.usuarios().filter((u) => u.id !== editando?.['id']);
    if (otros.some((u) => u.correo.toLowerCase() === String(v['correo']).toLowerCase())) return 'Ya existe un usuario con ese correo';
    if (otros.some((u) => u.numeroIdentificacion === String(v['numeroIdentificacion']))) return 'Ya existe un usuario con ese número de identificación';
    if (!editando && String(v['password']).length < 6) return 'La contraseña debe tener al menos 6 caracteres';
    return null;
  };

  protected crear(v: Row) {
    this.store.usuarios.update((l) => [...l, {
      id: siguienteId(l), idRol: Number(v['idRol']), idMunicipio: Number(v['idMunicipio']), nombre: v['nombre'], apellido: v['apellido'], correo: v['correo'],
      direccion: v['direccion'], tipoIdentificacion: v['tipoIdentificacion'], numeroIdentificacion: v['numeroIdentificacion'], estado: true, creado: fechaIso(0),
    }]);
  }
  protected actualizar(fila: Row, v: Row) {
    this.store.usuarios.update((l) => l.map((u) => (u.id === fila['id'] ? {
      ...u, idRol: Number(v['idRol']), idMunicipio: Number(v['idMunicipio']), nombre: v['nombre'], apellido: v['apellido'], correo: v['correo'],
      direccion: v['direccion'], tipoIdentificacion: v['tipoIdentificacion'], numeroIdentificacion: v['numeroIdentificacion'],
    } : u)));
  }
  protected cambiarEstado(fila: Row, estado: boolean) {
    this.store.usuarios.update((l) => l.map((u) => (u.id === fila['id'] ? { ...u, estado } : u)));
  }
}
