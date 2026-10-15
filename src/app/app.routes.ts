import { Routes } from '@angular/router';
import { authGuard, inicioGuard, loginGuard } from './core/guards/auth.guard';
import { moduloGuard } from './core/guards/modulo.guard';
import { MainLayout } from './layout/main-layout/main-layout';

/**
 * Mapa de navegación. Cada feature se carga con lazy loading (loadComponent) y
 * cada módulo solo se abre si el rol tiene permiso (moduloGuard).
 */
export const routes: Routes = [
  {
    path: 'login',
    canActivate: [loginGuard],
    loadComponent: () => import('./features/auth/pages/login-page/login-page').then((m) => m.LoginPage),
    title: 'Iniciar sesión · Corabastos Conecta',
  },
  {
    path: '',
    component: MainLayout,
    canActivate: [authGuard],
    children: [
      // Ruta vacía: redirige al primer módulo permitido del rol
      { path: '', pathMatch: 'full', canActivate: [inicioGuard], children: [] },
      {
        path: 'dashboard',
        canActivate: [moduloGuard('/dashboard')],
        loadComponent: () => import('./features/dashboard/pages/dashboard-page/dashboard-page').then((m) => m.DashboardPage),
        title: 'Dashboard · Corabastos Conecta',
      },
      {
        path: 'usuarios',
        canActivate: [moduloGuard('/usuarios')],
        loadComponent: () => import('./features/usuarios/pages/usuarios-page/usuarios-page').then((m) => m.UsuariosPage),
        title: 'Usuarios · Corabastos Conecta',
      },
      {
        path: 'roles-modulos',
        canActivate: [moduloGuard('/roles-modulos')],
        loadComponent: () => import('./features/roles-modulos/pages/roles-modulos-page/roles-modulos-page').then((m) => m.RolesModulosPage),
        title: 'Roles y módulos · Corabastos Conecta',
      },
      {
        path: 'categorias',
        canActivate: [moduloGuard('/categorias')],
        loadComponent: () => import('./features/categorias/pages/categorias-page/categorias-page').then((m) => m.CategoriasPage),
        title: 'Categorías y tipos · Corabastos Conecta',
      },
      {
        path: 'productos',
        canActivate: [moduloGuard('/productos')],
        loadComponent: () => import('./features/productos/pages/productos-page/productos-page').then((m) => m.ProductosPage),
        title: 'Productos · Corabastos Conecta',
      },
      {
        path: 'precios-dia',
        canActivate: [moduloGuard('/precios-dia')],
        loadComponent: () => import('./features/precios-dia/pages/precios-dia-page/precios-dia-page').then((m) => m.PreciosDiaPage),
        title: 'Precios del día · Corabastos Conecta',
      },
      {
        path: 'tiendas',
        canActivate: [moduloGuard('/tiendas')],
        loadComponent: () => import('./features/tiendas/pages/tiendas-page/tiendas-page').then((m) => m.TiendasPage),
        title: 'Tiendas y pabellones · Corabastos Conecta',
      },
      {
        path: 'inventario',
        canActivate: [moduloGuard('/inventario')],
        loadComponent: () => import('./features/inventario/pages/inventario-page/inventario-page').then((m) => m.InventarioPage),
        title: 'Inventario · Corabastos Conecta',
      },
      {
        path: 'reservas',
        canActivate: [moduloGuard('/reservas')],
        loadComponent: () => import('./features/reservas/pages/reservas-page/reservas-page').then((m) => m.ReservasPage),
        title: 'Reservas · Corabastos Conecta',
      },
      {
        path: 'reportes',
        canActivate: [moduloGuard('/reportes')],
        loadComponent: () => import('./features/reportes/pages/reportes-page/reportes-page').then((m) => m.ReportesPage),
        title: 'Reportes · Corabastos Conecta',
      },
      {
        path: 'catalogo',
        canActivate: [moduloGuard('/catalogo')],
        loadComponent: () => import('./features/catalogo/pages/catalogo-page/catalogo-page').then((m) => m.CatalogoPage),
        title: 'Catálogo · Corabastos Conecta',
      },
      {
        path: 'mis-reservas',
        canActivate: [moduloGuard('/mis-reservas')],
        loadComponent: () => import('./features/mis-reservas/pages/mis-reservas-page/mis-reservas-page').then((m) => m.MisReservasPage),
        title: 'Mis reservas · Corabastos Conecta',
      },
      {
        path: 'sin-acceso',
        loadComponent: () => import('./features/auth/pages/sin-acceso-page/sin-acceso-page').then((m) => m.SinAccesoPage),
        title: 'Sin acceso · Corabastos Conecta',
      },
    ],
  },
  // Ruta comodín: cualquier URL no reconocida vuelve al inicio
  { path: '**', redirectTo: '' },
];
