import { Injectable, computed, signal } from '@angular/core';
import {
  AlertaPrecio, Categoria, DetalleReserva, EstadoReserva, Favorito, Inventario, ItemCatalogo, Modulo,
  Municipio, Pabellon, Permiso, PrecioDia, Producto, Reserva, Rol, Tienda, Tipo, Usuario, VariacionPrecio,
} from '../models/corabastos.model';
import {
  ALERTAS, CATEGORIAS, DETALLES, FAVORITOS, HOY, INVENTARIO, MODULOS, MUNICIPIOS, PABELLONES, PERMISOS, PRECIOS,
  PRODUCTOS, RESERVAS, ROLES, TIENDAS, TIPOS, USUARIOS,
} from '../data/seed';
import { fechaIso, redondear, siguienteId } from '../utils/utils';

/** Almacén en memoria: reemplaza a la API mientras el proyecto no se conecta al backend. */
@Injectable({ providedIn: 'root' })
export class DataService {
  readonly hoy = HOY;
  readonly ayer = fechaIso(-1);

  readonly roles = signal<Rol[]>([...ROLES]);
  readonly modulos = signal<Modulo[]>([...MODULOS]);
  readonly permisos = signal<Permiso[]>([...PERMISOS]);
  readonly municipios = signal<Municipio[]>([...MUNICIPIOS]);
  readonly usuarios = signal<Usuario[]>([...USUARIOS]);
  readonly categorias = signal<Categoria[]>([...CATEGORIAS]);
  readonly tipos = signal<Tipo[]>([...TIPOS]);
  readonly productos = signal<Producto[]>([...PRODUCTOS]);
  readonly pabellones = signal<Pabellon[]>([...PABELLONES]);
  readonly tiendas = signal<Tienda[]>([...TIENDAS]);
  readonly inventario = signal<Inventario[]>([...INVENTARIO]);
  readonly precios = signal<PrecioDia[]>([...PRECIOS]);
  readonly reservas = signal<Reserva[]>([...RESERVAS]);
  readonly detalles = signal<DetalleReserva[]>([...DETALLES]);
  readonly favoritos = signal<Favorito[]>([...FAVORITOS]);
  readonly alertas = signal<AlertaPrecio[]>([...ALERTAS]);

  // ---------- búsquedas ----------
  nombreRol(id: number) { return this.roles().find((r) => r.id === id)?.nombre ?? '—'; }
  nombreMunicipio(id: number) { return this.municipios().find((m) => m.id === id)?.nombre ?? '—'; }
  usuario(id: number) { return this.usuarios().find((u) => u.id === id); }
  nombreUsuario(id: number) { const u = this.usuario(id); return u ? `${u.nombre} ${u.apellido}` : '—'; }
  producto(id: number) { return this.productos().find((p) => p.id === id); }
  tipo(id: number) { return this.tipos().find((t) => t.id === id); }
  categoria(id: number) { return this.categorias().find((c) => c.id === id); }
  pabellon(id: number) { return this.pabellones().find((p) => p.id === id); }
  tienda(id: number) { return this.tiendas().find((t) => t.id === id); }
  tiendaDeVendedor(idUsuario: number) { return this.tiendas().find((t) => t.idUsuario === idUsuario && t.estado); }
  categoriaDeProducto(idProducto: number): Categoria | undefined {
    const tipo = this.tipo(this.producto(idProducto)?.idTipo ?? 0);
    return tipo ? this.categoria(tipo.idCategoria) : undefined;
  }
  ubicacion(t: Tienda) { return `${this.pabellon(t.idPabellon)?.nombre ?? ''} · Local ${t.numeroLocal}`; }

  // ---------- precios y variación ----------
  private readonly precioPorDia = computed(() => {
    const mapa = new Map<string, number>();
    for (const p of this.precios()) mapa.set(`${p.idProducto}|${p.fecha}`, p.precio);
    return mapa;
  });

  readonly variaciones = computed<VariacionPrecio[]>(() => {
    const mapa = this.precioPorDia();
    const filas: VariacionPrecio[] = [];
    for (const p of this.productos()) {
      if (!p.estado) continue;
      const hoy = mapa.get(`${p.id}|${this.hoy}`);
      const ayer = mapa.get(`${p.id}|${this.ayer}`);
      if (hoy === undefined || ayer === undefined) continue;
      const pct = redondear(((hoy - ayer) / ayer) * 100);
      filas.push({
        idProducto: p.id, codigo: p.codigo, producto: p.nombre, unidad: p.unidad,
        categoria: this.categoriaDeProducto(p.id)?.nombre ?? '—',
        precioAyer: ayer, precioHoy: hoy, variacionPct: pct,
        tendencia: pct > 0 ? 'Sube' : pct < 0 ? 'Baja' : 'Igual',
      });
    }
    return filas;
  });

  variacionDe(idProducto: number) { return this.variaciones().find((v) => v.idProducto === idProducto); }

  historial(idProducto: number) {
    const filas = this.precios().filter((p) => p.idProducto === idProducto).sort((a, b) => a.fecha.localeCompare(b.fecha));
    return filas.map((f, i) => ({
      fecha: f.fecha, precio: f.precio,
      variacionPct: i === 0 ? null : redondear(((f.precio - filas[i - 1].precio) / filas[i - 1].precio) * 100),
    }));
  }

  fijarPrecio(idProducto: number, precio: number) {
    this.precios.update((lista) => {
      const sin = lista.filter((p) => !(p.idProducto === idProducto && p.fecha === this.hoy));
      return [...sin, { idProducto, fecha: this.hoy, precio }];
    });
  }

  // ---------- catálogo (qué bodega tiene cada producto hoy) ----------
  readonly catalogo = computed<ItemCatalogo[]>(() => {
    const vars = new Map(this.variaciones().map((v) => [v.idProducto, v]));
    const items: ItemCatalogo[] = [];
    for (const inv of this.inventario()) {
      const t = this.tienda(inv.idTienda);
      const v = vars.get(inv.idProducto);
      if (!inv.estado || !t || !t.estado || !v) continue;
      items.push({
        id: inv.id, idProducto: inv.idProducto, idTienda: t.id,
        producto: v.producto, categoria: v.categoria, unidad: v.unidad,
        tienda: t.nombre, pabellon: this.pabellon(t.idPabellon)?.nombre ?? '', numeroLocal: t.numeroLocal,
        ubicacion: this.ubicacion(t), cantidad: inv.cantidad, precioHoy: v.precioHoy, variacionPct: v.variacionPct,
      });
    }
    return items;
  });

  // ---------- reservas ----------
  detalleDe(idReserva: number) {
    return this.detalles().filter((d) => d.idReserva === idReserva).map((d) => ({
      ...d, producto: this.producto(d.idProducto)?.nombre ?? '—', unidad: this.producto(d.idProducto)?.unidad ?? '',
      subtotal: d.cantidad * d.precioUnitario,
    }));
  }

  totalReserva(idReserva: number) { return this.detalleDe(idReserva).reduce((s, d) => s + d.subtotal, 0); }

  readonly reservasDetalladas = computed(() => {
    this.detalles();
    return this.reservas().map((r) => {
      const t = this.tienda(r.idTienda);
      return {
        ...r,
        comprador: this.nombreUsuario(r.idUsuario),
        municipio: this.nombreMunicipio(this.usuario(r.idUsuario)?.idMunicipio ?? 0),
        tienda: t?.nombre ?? '—',
        ubicacion: t ? this.ubicacion(t) : '—',
        pabellon: t ? this.pabellon(t.idPabellon)?.nombre ?? '' : '',
        items: this.detalleDe(r.id).length,
        total: this.totalReserva(r.id),
      };
    });
  });

  crearReserva(idUsuario: number, idTienda: number, idProducto: number, cantidad: number, fechaRetiro: string, observacion: string) {
    const id = siguienteId(this.reservas());
    const precio = this.variacionDe(idProducto)?.precioHoy ?? 0;
    this.reservas.update((l) => [...l, {
      id, idUsuario, idTienda, codigo: `RES-${String(id).padStart(4, '0')}`, fechaRetiro,
      estadoReserva: 'Pendiente', observacion, estado: true, creado: this.hoy,
    }]);
    this.detalles.update((l) => [...l, { id: siguienteId(l), idReserva: id, idProducto, cantidad, precioUnitario: precio }]);
    return `RES-${String(id).padStart(4, '0')}`;
  }

  cambiarEstadoReserva(id: number, estadoReserva: EstadoReserva) {
    this.reservas.update((l) => l.map((r) => (r.id === id ? { ...r, estadoReserva } : r)));
  }

  // ---------- favoritos (base auxiliar) ----------
  esFavorito(idUsuario: number, idProducto: number) {
    return this.favoritos().some((f) => f.idUsuario === idUsuario && f.idProducto === idProducto);
  }
  alternarFavorito(idUsuario: number, idProducto: number): boolean {
    if (this.esFavorito(idUsuario, idProducto)) {
      this.favoritos.update((l) => l.filter((f) => !(f.idUsuario === idUsuario && f.idProducto === idProducto)));
      return false;
    }
    this.favoritos.update((l) => [...l, { idUsuario, idProducto }]);
    return true;
  }
}
