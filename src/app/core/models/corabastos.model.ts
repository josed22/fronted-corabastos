export type NombreRol = 'Administrador' | 'Vendedor' | 'Comprador';
export type EstadoReserva = 'Pendiente' | 'Confirmada' | 'Retirada' | 'Cancelada';

export interface Rol { id: number; nombre: NombreRol; descripcion: string; icono: string; estado: boolean; }
export interface Modulo { id: number; nombre: string; descripcion: string; ruta: string; icono: string; }
export interface Permiso { idRol: number; idModulo: number; }
export interface Municipio { id: number; nombre: string; }

export interface Usuario {
  id: number; idRol: number; idMunicipio: number;
  nombre: string; apellido: string; correo: string; direccion: string;
  tipoIdentificacion: string; numeroIdentificacion: string;
  estado: boolean; creado: string;
}

export interface Categoria { id: number; nombre: string; descripcion: string; estado: boolean; }
export interface Tipo { id: number; idCategoria: number; nombre: string; descripcion: string; estado: boolean; }
export interface Producto { id: number; idTipo: number; codigo: string; nombre: string; unidad: string; estado: boolean; }
export interface Pabellon { id: number; idCategoria: number; nombre: string; descripcion: string; estado: boolean; }
export interface Tienda {
  id: number; idUsuario: number; idPabellon: number;
  nombre: string; numeroLocal: string; telefono: string; estado: boolean;
}
export interface Inventario { id: number; idTienda: number; idProducto: number; cantidad: number; estado: boolean; }
export interface PrecioDia { idProducto: number; fecha: string; precio: number; }

export interface Reserva {
  id: number; idUsuario: number; idTienda: number; codigo: string;
  fechaRetiro: string; estadoReserva: EstadoReserva; observacion: string;
  estado: boolean; creado: string;
}
export interface DetalleReserva { id: number; idReserva: number; idProducto: number; cantidad: number; precioUnitario: number; }

/** Datos de la base auxiliar (MySQL): favoritos y alertas de precio del comprador. */
export interface Favorito { idUsuario: number; idProducto: number; }
export interface AlertaPrecio { id: number; idUsuario: number; idProducto: number; tipo: 'sube' | 'baja'; umbral: number; }

export interface VariacionPrecio {
  idProducto: number; codigo: string; producto: string; categoria: string; unidad: string;
  precioAyer: number; precioHoy: number; variacionPct: number; tendencia: 'Sube' | 'Baja' | 'Igual';
}

export interface ItemCatalogo {
  id: number; idProducto: number; idTienda: number;
  producto: string; categoria: string; unidad: string;
  tienda: string; pabellon: string; numeroLocal: string; ubicacion: string;
  cantidad: number; precioHoy: number; variacionPct: number;
}

