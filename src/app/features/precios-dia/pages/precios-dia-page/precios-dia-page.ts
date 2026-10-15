import { Component, computed, inject, signal } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';
import { DataService } from '../../../../core/services/data.service';
import { VariacionPrecio } from '../../../../core/models/corabastos.model';
import { ToastService } from '../../../../core/services/toast.service';
import { DataTable, TableAction, TableActionEvent, TableColumn } from '../../../../shared/components/data-table/data-table';
import { FilterSelect } from '../../../../shared/components/filter-select/filter-select';
import { FormField, FormModal } from '../../../../shared/components/form-modal/form-modal';
import { PageHeader } from '../../../../shared/components/page-header/page-header';
import { StatCard } from '../../../../shared/components/stat-card/stat-card';
import { PrecioHistorial } from '../../components/precio-historial/precio-historial';

@Component({
  selector: 'app-precios-dia-page',
  imports: [PageHeader, StatCard, DataTable, FilterSelect, FormModal, PrecioHistorial],
  templateUrl: './precios-dia-page.html',
})
export class PreciosDiaPage {
  protected readonly store = inject(DataService);
  private readonly auth = inject(AuthService);
  private readonly toast = inject(ToastService);

  protected readonly categoria = signal('');
  protected readonly historial = signal<VariacionPrecio | null>(null);
  protected readonly editando = signal<VariacionPrecio | null>(null);
  protected readonly esAdmin = computed(() => this.auth.rol() === 'Administrador');
  protected readonly categorias = computed(() => this.store.categorias().filter((c) => c.estado).map((c) => c.nombre));

  protected readonly filas = computed(() => this.store.variaciones().filter((v) => !this.categoria() || v.categoria === this.categoria()));
  protected readonly suben = computed(() => this.store.variaciones().filter((v) => v.variacionPct > 0).length);
  protected readonly bajan = computed(() => this.store.variaciones().filter((v) => v.variacionPct < 0).length);

  protected readonly columnas: TableColumn[] = [
    { key: 'codigo', label: 'Código' },
    { key: 'producto', label: 'Producto' },
    { key: 'categoria', label: 'Categoría' },
    { key: 'unidad', label: 'Unidad' },
    { key: 'precioAyer', label: 'Precio ayer', type: 'currency' },
    { key: 'precioHoy', label: 'Precio hoy', type: 'currency' },
    { key: 'variacionPct', label: 'Variación', type: 'trend' },
    { key: 'tendencia', label: 'Tendencia', type: 'badge', badges: { Sube: 'danger', Baja: 'success', Igual: 'neutral' } },
  ];

  protected readonly acciones = computed<TableAction[]>(() => [
    { id: 'historial', icon: 'show_chart', label: 'Ver historial de precios' },
    ...(this.esAdmin() ? [{ id: 'editar', icon: 'edit', label: 'Fijar precio de hoy', color: 'primary' as const }] : []),
  ]);

  protected readonly filasHistorial = computed(() => {
    const h = this.historial();
    return h ? this.store.historial(h.idProducto).reverse().map((f) => ({ ...f, variacionPct: f.variacionPct ?? 0 })) : [];
  });

  protected readonly camposPrecio = computed<FormField[]>(() => [
    { key: 'precio', label: 'Precio de hoy (COP por unidad)', type: 'number', required: true, min: 50, step: 50, default: this.editando()?.precioHoy,
      hint: `Ayer: $${(this.editando()?.precioAyer ?? 0).toLocaleString('es-CO')}` },
  ]);

  protected alAccion(e: TableActionEvent) {
    const fila = this.store.variacionDe(e.row['idProducto']);
    if (!fila) return;
    if (e.action === 'historial') this.historial.set(fila);
    else if (e.action === 'editar') this.editando.set(fila);
  }

  protected publicar(valores: Record<string, unknown>) {
    const v = this.editando();
    if (!v) return;
    this.store.fijarPrecio(v.idProducto, Number(valores['precio']));
    this.toast.exito(`Precio de ${v.producto} actualizado`);
    this.editando.set(null);
  }
}
