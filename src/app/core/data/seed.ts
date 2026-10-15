import {
  AlertaPrecio, Categoria, DetalleReserva, EstadoReserva, Favorito, Inventario, Modulo, Municipio,
  Pabellon, Permiso, PrecioDia, Producto, Reserva, Rol, Tienda, Tipo, Usuario,
} from '../models/corabastos.model';
import { fechaIso } from '../utils/utils';

/** Datos estáticos (sin conexión a la API). Reflejan la base de datos de Corabastos. */

export const HOY = fechaIso(0);
export const DIAS_HISTORIAL = 7;

export const ROLES: Rol[] = [
  { id: 1, nombre: 'Administrador', descripcion: 'Fija los precios del día y administra el sistema', icono: 'shield_person', estado: true },
  { id: 2, nombre: 'Vendedor', descripcion: 'Administra el inventario de su bodega y atiende reservas', icono: 'storefront', estado: true },
  { id: 3, nombre: 'Comprador', descripcion: 'Consulta precios y aparta productos en las bodegas', icono: 'shopping_basket', estado: true },
];

export const MODULOS: Modulo[] = [
  { id: 1, nombre: 'Dashboard', descripcion: 'Resumen de precios, inventario y reservas', ruta: '/dashboard', icono: 'dashboard' },
  { id: 2, nombre: 'Usuarios', descripcion: 'Gestión de usuarios del sistema', ruta: '/usuarios', icono: 'group' },
  { id: 3, nombre: 'Roles y Módulos', descripcion: 'Asignación de módulos por rol', ruta: '/roles-modulos', icono: 'admin_panel_settings' },
  { id: 4, nombre: 'Categorías y Tipos', descripcion: 'Clasificación de productos', ruta: '/categorias', icono: 'category' },
  { id: 5, nombre: 'Productos', descripcion: 'Catálogo maestro de productos', ruta: '/productos', icono: 'inventory_2' },
  { id: 6, nombre: 'Precios del Día', descripcion: 'Precios diarios y su variación porcentual', ruta: '/precios-dia', icono: 'trending_up' },
  { id: 7, nombre: 'Tiendas y Pabellones', descripcion: 'Pabellones y bodegas de Corabastos', ruta: '/tiendas', icono: 'storefront' },
  { id: 8, nombre: 'Inventario', descripcion: 'Cantidad disponible en la bodega', ruta: '/inventario', icono: 'warehouse' },
  { id: 9, nombre: 'Reservas', descripcion: 'Reservas recibidas de compradores', ruta: '/reservas', icono: 'event_available' },
  { id: 10, nombre: 'Reportes', descripcion: 'Reportes de precios y reservas', ruta: '/reportes', icono: 'bar_chart' },
  { id: 11, nombre: 'Catálogo', descripcion: 'Búsqueda de productos y bodegas que los tienen', ruta: '/catalogo', icono: 'travel_explore' },
  { id: 12, nombre: 'Mis Reservas', descripcion: 'Productos apartados por el comprador', ruta: '/mis-reservas', icono: 'bookmark' },
];

/** Módulos permitidos por rol (el orden es el del menú de navegación). */
const PERMISOS_POR_ROL: Record<number, number[]> = {
  1: [1, 2, 3, 4, 5, 6, 7, 10],
  2: [1, 11, 6, 8, 9],
  3: [11, 6, 12],
};
export const PERMISOS: Permiso[] = Object.entries(PERMISOS_POR_ROL)
  .flatMap(([idRol, modulos]) => modulos.map((idModulo) => ({ idRol: Number(idRol), idModulo })));

export const MUNICIPIOS: Municipio[] = [
  'Bogotá', 'Cajicá', 'Chía', 'Soacha', 'Zipaquirá', 'Facatativá', 'Fusagasugá', 'Girardot', 'Funza', 'Mosquera', 'Madrid',
].map((nombre, i) => ({ id: i + 1, nombre }));

export const TIPOS_IDENTIFICACION = ['Cédula de ciudadanía', 'Cédula de extranjería', 'Pasaporte', 'NIT', 'Permiso de residencia'];

type U = [number, number, string, string, string, string, string, string, string];
// [idRol, idMunicipio, nombre, apellido, correo, dirección, identificación, tipo, creado]
const USUARIOS_RAW: U[] = [
  [1, 1, 'Laura', 'Gómez Rincón', 'laura.gomez@gmail.com', 'Cra 15 # 93-40', '1020456789', 'Cédula de ciudadanía', '2026-08-03'],
  [2, 3, 'Carlos', 'Rodríguez Pardo', 'carlos.rodriguez@gmail.com', 'Calle 12 # 8-25', '80123456', 'Cédula de ciudadanía', '2026-08-05'],
  [2, 4, 'Ricardo', 'Ospina Mejía', 'ricardo.ospina@gmail.com', 'Cra 7 # 12-40', '79456123', 'Cédula de ciudadanía', '2026-08-05'],
  [2, 5, 'Marcela', 'Torres Ávila', 'marcela.torres@hotmail.com', 'Cra 7 # 4-60', '52987654', 'Cédula de ciudadanía', '2026-08-06'],
  [2, 1, 'Andrea', 'Salazar Londoño', 'andrea.salazar@gmail.com', 'Calle 40 Sur # 78-15', '1032654987', 'Cédula de ciudadanía', '2026-08-06'],
  [2, 9, 'Jorge', 'Beltrán Cruz', 'jorge.beltran@gmail.com', 'Cra 9 # 14-22', '19876543', 'Cédula de ciudadanía', '2026-08-07'],
  [2, 6, 'Luz Marina', 'Quintero Páez', 'luz.quintero@outlook.com', 'Calle 5 # 3-18', '51234890', 'Cédula de ciudadanía', '2026-08-07'],
  [2, 10, 'Hernán', 'Díaz Vargas', 'hernan.diaz@gmail.com', 'Cra 3 # 8-30', '79321654', 'Cédula de ciudadanía', '2026-08-10'],
  [2, 1, 'Gloria', 'Patiño Ruiz', 'gloria.patino@hotmail.com', 'Cra 80 # 38 Sur-12', '41567832', 'Cédula de ciudadanía', '2026-08-10'],
  [3, 2, 'Andrés', 'Martínez Silva', 'andres.martinez@gmail.com', 'Calle 3 # 5-18', '1013567890', 'Cédula de ciudadanía', '2026-09-01'],
  [3, 4, 'Daniela', 'Peña Castro', 'daniela.pena@outlook.com', 'Diag 32 # 10-45', '1032456123', 'Cédula de ciudadanía', '2026-09-02'],
  [3, 7, 'Julián', 'Herrera Mora', 'julian.herrera@gmail.com', 'Cra 68 # 24-30', '1075432198', 'Cédula de ciudadanía', '2026-09-04'],
  [3, 11, 'Valentina', 'Ruiz Cortés', 'valentina.ruiz@gmail.com', 'Cra 5 # 12-30', '1098765432', 'Cédula de ciudadanía', '2026-09-08'],
  [3, 8, 'Camilo', 'Sánchez Ortiz', 'camilo.sanchez@hotmail.com', 'Calle 18 # 9-40', '1110456789', 'Cédula de ciudadanía', '2026-09-12'],
];
export const USUARIOS: Usuario[] = USUARIOS_RAW.map((u, i) => ({
  id: i + 1, idRol: u[0], idMunicipio: u[1], nombre: u[2], apellido: u[3], correo: u[4], direccion: u[5],
  numeroIdentificacion: u[6], tipoIdentificacion: u[7], estado: true, creado: u[8],
}));

export const CATEGORIAS: Categoria[] = [
  ['Granos', 'Arroz, fríjol, lentejas y cereales'],
  ['Frutas', 'Frutas frescas de clima cálido y frío'],
  ['Verduras', 'Hortalizas y verduras frescas'],
  ['Tubérculos', 'Papas y raíces'],
  ['Lácteos y huevos', 'Leche, quesos y huevos'],
  ['Carnes', 'Carne de res, pollo y cerdo'],
].map(([nombre, descripcion], i) => ({ id: i + 1, nombre, descripcion, estado: true }));

const TIPOS_RAW: [number, string, string][] = [
  [1, 'Arroz', 'Arroz blanco e integral'], [1, 'Fríjol', 'Variedades de fríjol seco'],
  [1, 'Lentejas y garbanzo', 'Leguminosas secas'], [1, 'Cereales', 'Maíz, avena y quinua'],
  [2, 'Cítricos', 'Naranja, limón y mandarina'], [2, 'Tropicales', 'Frutas de clima cálido'],
  [2, 'Clima frío', 'Frutas de tierra fría'],
  [3, 'Hortalizas', 'Tomate, zanahoria y similares'], [3, 'De hoja', 'Lechuga, repollo y espinaca'],
  [3, 'Bulbos', 'Cebolla y ajo'],
  [4, 'Papas', 'Variedades de papa'], [4, 'Raíces', 'Yuca, arracacha y ñame'],
  [5, 'Huevos', 'Huevo por cubeta'], [5, 'Lácteos', 'Leche y quesos'],
  [6, 'Res', 'Cortes de res'], [6, 'Pollo', 'Pollo entero y presas'], [6, 'Cerdo', 'Cortes de cerdo'],
];
export const TIPOS: Tipo[] = TIPOS_RAW.map(([idCategoria, nombre, descripcion], i) => ({
  id: i + 1, idCategoria, nombre, descripcion, estado: true,
}));
const idTipo = (nombre: string) => TIPOS.find((t) => t.nombre === nombre)!.id;

/** [código, tipo, nombre, unidad, precio de referencia COP] */
const PRODUCTOS_RAW: [string, string, string, string, number][] = [
  ['GRA-001', 'Arroz', 'Arroz blanco premium', 'kg', 3800], ['GRA-002', 'Arroz', 'Arroz integral', 'kg', 4600],
  ['GRA-003', 'Fríjol', 'Fríjol cargamanto rojo', 'kg', 9800], ['GRA-004', 'Fríjol', 'Fríjol bola roja', 'kg', 8900],
  ['GRA-005', 'Fríjol', 'Fríjol zaragoza', 'kg', 8200], ['GRA-006', 'Lentejas y garbanzo', 'Lenteja', 'kg', 5200],
  ['GRA-007', 'Lentejas y garbanzo', 'Garbanzo', 'kg', 6800], ['GRA-008', 'Lentejas y garbanzo', 'Arveja seca verde', 'kg', 4900],
  ['GRA-009', 'Cereales', 'Maíz amarillo trillado', 'kg', 3400], ['GRA-010', 'Cereales', 'Avena en hojuelas', 'kg', 5600],
  ['GRA-011', 'Cereales', 'Quinua', 'kg', 9500],
  ['FRU-001', 'Cítricos', 'Naranja Valencia', 'kg', 2400], ['FRU-002', 'Cítricos', 'Limón Tahití', 'kg', 3200],
  ['FRU-003', 'Cítricos', 'Mandarina Oneco', 'kg', 3000], ['FRU-004', 'Tropicales', 'Banano criollo', 'kg', 2100],
  ['FRU-005', 'Tropicales', 'Mango Tommy', 'kg', 3800], ['FRU-006', 'Tropicales', 'Piña perolera', 'kg', 2600],
  ['FRU-007', 'Tropicales', 'Papaya Maradol', 'kg', 2900], ['FRU-008', 'Clima frío', 'Fresa', 'kg', 6500],
  ['FRU-009', 'Clima frío', 'Mora de Castilla', 'kg', 7200], ['FRU-010', 'Clima frío', 'Tomate de árbol', 'kg', 3900],
  ['FRU-011', 'Tropicales', 'Aguacate Hass', 'kg', 8500],
  ['VER-001', 'Hortalizas', 'Tomate chonto', 'kg', 2800], ['VER-002', 'Hortalizas', 'Zanahoria', 'kg', 1800],
  ['VER-003', 'Hortalizas', 'Habichuela', 'kg', 3500], ['VER-004', 'Hortalizas', 'Pimentón rojo', 'kg', 4200],
  ['VER-005', 'De hoja', 'Lechuga batavia', 'unidad', 1500], ['VER-006', 'De hoja', 'Repollo blanco', 'kg', 1500],
  ['VER-007', 'De hoja', 'Espinaca', 'kg', 3600], ['VER-008', 'Bulbos', 'Cebolla cabezona blanca', 'kg', 2300],
  ['VER-009', 'Bulbos', 'Cebolla larga junca', 'kg', 2700], ['VER-010', 'Bulbos', 'Ajo', 'kg', 12500],
  ['VER-011', 'Hortalizas', 'Remolacha', 'kg', 2000], ['VER-012', 'Hortalizas', 'Pepino cohombro', 'kg', 2200],
  ['TUB-001', 'Papas', 'Papa pastusa', 'kg', 1700], ['TUB-002', 'Papas', 'Papa criolla', 'kg', 3300],
  ['TUB-003', 'Papas', 'Papa sabanera', 'kg', 1900], ['TUB-004', 'Raíces', 'Yuca', 'kg', 1600],
  ['TUB-005', 'Raíces', 'Arracacha', 'kg', 2800], ['TUB-006', 'Raíces', 'Ñame', 'kg', 3000],
  ['LAC-001', 'Huevos', 'Huevo rojo AA cubeta x30', 'cubeta', 17500], ['LAC-002', 'Huevos', 'Huevo blanco A cubeta x30', 'cubeta', 15500],
  ['LAC-003', 'Lácteos', 'Leche entera cruda', 'litro', 2600], ['LAC-004', 'Lácteos', 'Queso campesino', 'kg', 14500],
  ['LAC-005', 'Lácteos', 'Cuajada', 'kg', 11000],
  ['CAR-001', 'Res', 'Carne molida de res', 'kg', 21000], ['CAR-002', 'Pollo', 'Pollo entero', 'kg', 9800],
  ['CAR-003', 'Pollo', 'Pechuga de pollo', 'kg', 13500], ['CAR-004', 'Cerdo', 'Costilla de cerdo', 'kg', 16500],
  ['CAR-005', 'Cerdo', 'Chuleta de cerdo', 'kg', 15500],
];
export const PRODUCTOS: Producto[] = PRODUCTOS_RAW.map(([codigo, tipo, nombre, unidad], i) => ({
  id: i + 1, idTipo: idTipo(tipo), codigo, nombre, unidad, estado: true,
}));
const idProducto = (codigo: string) => PRODUCTOS.find((p) => p.codigo === codigo)!.id;

export const PABELLONES: Pabellon[] = [
  [1, 'Pabellón de Granos', 'Bodegas de granos y cereales'],
  [2, 'Pabellón de Frutas', 'Bodegas de frutas frescas'],
  [3, 'Pabellón de Verduras', 'Bodegas de hortalizas y verduras'],
  [4, 'Pabellón de Tubérculos', 'Bodegas de papa y raíces'],
  [5, 'Pabellón de Lácteos y Huevos', 'Bodegas de lácteos y huevos'],
  [6, 'Pabellón de Carnes', 'Bodegas de carnes frías y frescas'],
].map(([idCategoria, nombre, descripcion], i) => ({ id: i + 1, idCategoria: idCategoria as number, nombre: nombre as string, descripcion: descripcion as string, estado: true }));

export const TIENDAS: Tienda[] = ([
  [2, 1, 'Granos El Campesino', 'G-20', '3105551201'],
  [3, 1, 'Granos y Cereales Don Pedro', 'G-34', '3115551202'],
  [4, 2, 'Frutas La Cosecha', 'F-12', '3125551203'],
  [5, 2, 'Frutas Tropicales del Tolima', 'F-27', '3135551204'],
  [6, 3, 'Verduras Hortalizas Sabana', 'V-08', '3145551205'],
  [7, 4, 'Tubérculos Papa Criolla Boyacá', 'T-15', '3155551206'],
  [8, 5, 'Lácteos y Huevos Los Andes', 'L-05', '3165551207'],
  [9, 6, 'Carnes Frigorífico Central', 'C-03', '3175551208'],
] as [number, number, string, string, string][]).map(([idUsuario, idPabellon, nombre, numeroLocal, telefono], i) => ({
  id: i + 1, idUsuario, idPabellon, nombre, numeroLocal, telefono, estado: true,
}));

/** Precio de cada producto en los últimos días: fluctúa más en verduras y frutas, menos en granos y lácteos. */
const AMPLITUD: Record<string, number> = {
  Verduras: 0.25, Frutas: 0.18, Tubérculos: 0.15, Carnes: 0.07, Granos: 0.05, 'Lácteos y huevos': 0.04,
};
export const PRECIOS: PrecioDia[] = PRODUCTOS.flatMap((p, i) => {
  const base = PRODUCTOS_RAW[i][4];
  const tipo = TIPOS.find((t) => t.id === p.idTipo)!;
  const amp = AMPLITUD[CATEGORIAS.find((c) => c.id === tipo.idCategoria)!.nombre];
  return Array.from({ length: DIAS_HISTORIAL }, (_, dia) => ({
    idProducto: p.id,
    fecha: fechaIso(-dia),
    precio: Math.max(50, Math.round((base * (1 + amp * Math.sin(p.id * 2.3 + dia * 1.3))) / 50) * 50),
  }));
});

/** Cada bodega solo maneja productos de la categoría de su pabellón. */
export const INVENTARIO: Inventario[] = (() => {
  const filas: Inventario[] = [];
  for (const t of TIENDAS) {
    const categoria = PABELLONES.find((p) => p.id === t.idPabellon)!.idCategoria;
    for (const p of PRODUCTOS) {
      const tipo = TIPOS.find((x) => x.id === p.idTipo)!;
      if (tipo.idCategoria !== categoria || (p.id + t.id) % 3 === 0) continue;
      filas.push({
        id: filas.length + 1, idTienda: t.id, idProducto: p.id, estado: true,
        cantidad: (p.id + t.id) % 7 === 0 ? 0 : 50 + ((p.id * 37 + t.id * 91) % 950),
      });
    }
  }
  return filas;
})();

const precioDe = (idProd: number) => PRECIOS.find((x) => x.idProducto === idProd && x.fecha === HOY)!.precio;

/** [comprador, bodega, estado, días hasta el retiro, observación] */
const RESERVAS_RAW: [number, number, EstadoReserva, number, string][] = [
  [10, 1, 'Pendiente', 1, 'Retiro en la mañana, bodega G-20'],
  [11, 5, 'Confirmada', 1, 'Llego con camión propio'],
  [12, 6, 'Retirada', -1, ''],
  [13, 3, 'Cancelada', 0, 'Cancelada por el comprador'],
  [14, 7, 'Pendiente', 2, ''],
  [10, 2, 'Confirmada', 1, 'Necesito factura electrónica'],
  [11, 8, 'Pendiente', 1, ''],
  [12, 4, 'Retirada', -2, ''],
];
export const RESERVAS: Reserva[] = RESERVAS_RAW.map(([idUsuario, idTienda, estadoReserva, dias, observacion], i) => ({
  id: i + 1, idUsuario, idTienda, estadoReserva, observacion, estado: true,
  codigo: `RES-${String(i + 1).padStart(4, '0')}`, fechaRetiro: fechaIso(dias), creado: fechaIso(Math.min(dias, 0) - 1),
}));
export const DETALLES: DetalleReserva[] = RESERVAS.flatMap((r) =>
  INVENTARIO.filter((i) => i.idTienda === r.idTienda && i.cantidad >= 25)
    .sort((a, b) => a.idProducto - b.idProducto).slice(0, 2)
    .map((i) => ({ idReserva: r.id, idProducto: i.idProducto, cantidad: 25, precioUnitario: precioDe(i.idProducto) })),
).map((d, i) => ({ ...d, id: i + 1 }));

export const FAVORITOS: Favorito[] = ([
  [10, 'GRA-001'], [10, 'GRA-003'], [10, 'TUB-002'], [11, 'VER-001'], [11, 'VER-008'], [11, 'TUB-001'],
  [12, 'LAC-001'], [12, 'LAC-003'], [13, 'FRU-001'], [13, 'FRU-008'], [14, 'GRA-001'], [14, 'CAR-002'],
] as [number, string][]).map(([idUsuario, codigo]) => ({ idUsuario, idProducto: idProducto(codigo) }));

export const ALERTAS: AlertaPrecio[] = ([
  [10, 'TUB-002', 'sube', 10], [11, 'VER-001', 'sube', 15], [11, 'VER-008', 'baja', 10],
  [12, 'LAC-001', 'sube', 5], [13, 'FRU-008', 'baja', 12.5], [14, 'CAR-002', 'sube', 8],
] as [number, string, 'sube' | 'baja', number][]).map(([idUsuario, codigo, tipo, umbral], i) => ({
  id: i + 1, idUsuario, idProducto: idProducto(codigo), tipo, umbral,
}));
