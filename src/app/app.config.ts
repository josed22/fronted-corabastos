import { ApplicationConfig, LOCALE_ID, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withHashLocation, withInMemoryScrolling } from '@angular/router';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { routes } from './app.routes';
import { PaginadorEs } from './shared/components/data-table/paginador-es';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // Rutas con # para que funcione en cualquier hosting estático sin configuración extra
    provideRouter(routes, withHashLocation(), withInMemoryScrolling({ scrollPositionRestoration: 'top' })),
    { provide: LOCALE_ID, useValue: 'es-CO' },
    { provide: MatPaginatorIntl, useClass: PaginadorEs },
  ],
};
