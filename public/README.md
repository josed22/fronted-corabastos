# Corabastos Conecta · Aplicación Angular

Aplicación web para consultar los **precios del día** de Corabastos, ver **qué bodega tiene cada producto** y **reservarlo**
(no hay venta ni pago). Versión de demostración: **no se conecta a la API**, todos los datos son estáticos y viven en memoria.

## Cómo ejecutarla

```bash
npm install      # solo la primera vez
npm start        # abre http://localhost:4200
npm run build    # genera dist/corabastos-web/browser para subir al hosting
```

## Roles y módulos

| Rol | Módulos |
|---|---|
| Administrador | Dashboard, Usuarios, Roles y Módulos, Categorías y Tipos, Productos, Precios del Día, Tiendas y Pabellones, Reportes |
| Vendedor | Dashboard, Catálogo, Precios del Día, Inventario, Reservas |
| Comprador | Catálogo, Precios del Día, Mis Reservas |

En el login se elige el rol; cada rol entra a su primer módulo y el menú solo muestra los módulos con permiso
(`moduloGuard` bloquea el resto). Cualquier contraseña de 6 o más caracteres sirve.

## Estructura (según la guía del profesor)

```
src/app/
├── core/                      Lo transversal, se usa una sola vez
│   ├── services/              auth.service, data.service (estado con Signals), toast.service
│   ├── guards/                auth.guard, modulo.guard
│   ├── models/                Interfaces TypeScript compartidas
│   ├── data/                  Datos estáticos de demostración
│   └── utils/                 Funciones auxiliares (fechas, ids)
├── shared/                    Piezas reutilizables en varias features
│   ├── components/            data-table, crud-table, form-modal, modal, confirm-dialog, stat-card, page-header,
│   │                          trend-badge, status-badge, tabs, filter-select, sparkline, bar-chart, empty-state,
│   │                          toast-container, reserva-detalle
│   ├── pipes/                 moneda.pipe (pesos colombianos)
│   └── interfaces/            row.interface
├── features/                  Una carpeta por funcionalidad, con carga perezosa (lazy loading)
│   ├── auth/pages/            login-page, sin-acceso-page
│   ├── dashboard/ usuarios/ roles-modulos/ categorias/ productos/ precios-dia/ tiendas/
│   ├── inventario/ reservas/ mis-reservas/ reportes/ catalogo/        (cada una con pages/)
│   └── precios-dia/components/precio-historial   (componente presentacional de la feature)
├── layout/                    navbar, sidebar, footer y main-layout (el marco de las páginas)
├── app.routes.ts              Mapa de navegación con loadComponent
└── app.config.ts              Proveedores: Router, idioma es-CO, paginador en español
```

Las tablas usan **Angular Material** (`MatTable`, `MatSort`, `MatPaginator`): búsqueda, orden y paginación.
