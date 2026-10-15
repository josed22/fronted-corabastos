import { Component, computed, inject } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

/** Parte superior de la pantalla: nombre de la aplicación, usuario y cierre de sesión. */
@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  protected readonly auth = inject(AuthService);
  protected readonly nombre = computed(() => {
    const u = this.auth.usuario();
    return u ? `${u.nombre} ${u.apellido}` : '';
  });
}
