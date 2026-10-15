import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/** Solo deja pasar a usuarios con sesión iniciada. */
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  return auth.logueado() ? true : inject(Router).createUrlTree(['/login']);
};

/** Si ya hay sesión, el login redirige al primer módulo permitido del rol. */
export const loginGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  return auth.logueado() ? inject(Router).parseUrl(auth.rutaInicial()) : true;
};

/** Ruta vacía: envía al primer módulo al que tiene permiso el rol. */
export const inicioGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  return inject(Router).parseUrl(auth.rutaInicial());
};
