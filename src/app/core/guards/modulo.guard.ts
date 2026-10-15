import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/** Bloquea los módulos a los que el rol no tiene permiso. */
export const moduloGuard = (ruta: string): CanActivateFn => () => {
  const auth = inject(AuthService);
  return auth.puedeAcceder(ruta) ? true : inject(Router).createUrlTree(['/sin-acceso']);
};
