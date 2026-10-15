import { Component, computed, inject } from '@angular/core';
import { DataService } from '../../../../core/services/data.service';
import { BarChart, BarItem } from '../../../../shared/components/bar-chart/bar-chart';
import { DataTable, TableColumn } from '../../../../shared/components/data-table/data-table';
import { MonedaPipe } from '../../../../shared/pipes/moneda.pipe';
import { PageHeader } from '../../../../shared/components/page-header/page-header';
import { StatCard } from '../../../../shared/components/stat-card/stat-card';

@Component({
  selector: 'app-reportes-page',
  imports: [PageHeader, StatCard, BarChart, DataTable, MonedaPipe],
  templateUrl: './reportes-page.html',
})
export class ReportesPage {
  protected readonly store = inject(DataService);

  protected readonly subidas = computed(() => this.store.variaciones().filter((v) => v.variacionPct > 0).sort((a, b) => b.variacionPct - a.variacionPct));
  protected readonly bajadas = computed(() => this.store.variaciones().filter((v) => v.variacionPct < 0).sort((a, b) => a.variacionPct - b.variacionPct));
  protected readonly valorActivo = computed(() => this.store.reservasDetalladas().filter((r) => r.estadoReserva !== 'Cancelada').reduce((s, r) => s + r.total, 0));

  protected readonly columnas: TableColumn[] = [
    { key: 'producto', label: 'Producto' },
    { key: 'precioAyer', label: 'Ayer', type: 'currency' },
    { key: 'precioHoy', label: 'Hoy', type: 'currency' },
    { key: 'variacionPct', label: 'Variación', type: 'trend' },
  ];

  protected readonly porEstado = computed<BarItem[]>(() => {
    const colores: Record<string, string> = { Pendiente: '#f57c00', Confirmada: '#1565c0', Retirada: '#2e7d32', Cancelada: '#c62828' };
    return Object.keys(colores).map((estado) => ({ label: estado, value: this.store.reservas().filter((r) => r.estadoReserva === estado).length, color: colores[estado] }));
  });

  protected readonly porPabellon = computed<BarItem[]>(() => this.store.pabellones().map((p) => ({
    label: p.nombre.replace('Pabellón de ', ''),
    value: this.store.reservas().filter((r) => this.store.tienda(r.idTienda)?.idPabellon === p.id).length,
  })));

  protected readonly promedios = computed<BarItem[]>(() => this.store.categorias().map((c) => {
    const v = this.store.variaciones().filter((x) => x.categoria === c.nombre);
    const prom = v.length ? v.reduce((s, x) => s + x.precioHoy, 0) / v.length : 0;
    return { label: c.nombre, value: prom, texto: `$${Math.round(prom).toLocaleString('es-CO')}`, color: '#ef6c00' };
  }));

  protected imprimir() { window.print(); }
}
