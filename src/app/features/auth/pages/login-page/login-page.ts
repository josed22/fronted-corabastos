import { Component, computed, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { DataService } from '../../../../core/services/data.service';
import { NombreRol } from '../../../../core/models/corabastos.model';

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
})
export class LoginPage {
  private readonly auth = inject(AuthService);
  private readonly store = inject(DataService);
  private readonly router = inject(Router);

  protected readonly roles = this.store.roles;
  protected readonly rolElegido = signal<NombreRol>('Administrador');
  protected readonly verClave = signal(false);
  protected readonly cargando = signal(false);
  protected readonly modulosDelRol = computed(() => {
    const rol = this.store.roles().find((r) => r.nombre === this.rolElegido());
    return rol ? this.store.permisos().filter((p) => p.idRol === rol.id).map((p) => this.store.modulos().find((m) => m.id === p.idModulo)!.nombre) : [];
  });

  protected readonly form = new FormGroup({
    correo: new FormControl(this.auth.correoDemo('Administrador'), [Validators.required, Validators.email]),
    password: new FormControl('Clave2025*', [Validators.required, Validators.minLength(6)]),
  });

  protected elegirRol(rol: NombreRol) {
    this.rolElegido.set(rol);
    this.form.controls.correo.setValue(this.auth.correoDemo(rol));
  }

  protected ingresar() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.cargando.set(true);
    // Sin API: se simula una breve espera y se entra con un usuario del rol elegido.
    setTimeout(() => {
      this.auth.login(this.rolElegido(), this.form.controls.correo.value ?? '');
      this.router.navigateByUrl(this.auth.rutaInicial());
      this.cargando.set(false);
    }, 450);
  }
}
