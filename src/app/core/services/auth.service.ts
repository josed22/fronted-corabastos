import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from './data.service';
import { NombreRol } from '../models/corabastos.model';

const CLAVE = 'corabastos.sesion';

/** Sesión simulada: no consulta ninguna API, solo elige un usuario del rol indicado. */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly store = inject(DataService);
  private readonly router = inject(Router);

  private readonly idUsuario = signal<number | null>(this.leer());

  readonly usuario = computed(() => {
    const id = this.idUsuario();
    return id === null ? null : this.store.usuario(id) ?? null;
  });
  readonly rol = computed<NombreRol | null>(() => {
    const u = this.usuario();
    return u ? (this.store.nombreRol(u.idRol) as NombreRol) : null;
  });
  readonly logueado = computed(() => this.usuario() !== null);

  /** Módulos que el rol puede ver, en el orden del menú. */
  readonly modulos = computed(() => {
    const u = this.usuario();
    if (!u) return [];
    const ids = this.store.permisos().filter((p) => p.idRol === u.idRol).map((p) => p.idModulo);
    return ids.map((id) => this.store.modulos().find((m) => m.id === id)!).filter(Boolean);
  });

  correoDemo(rol: NombreRol): string {
    const idRol = this.store.roles().find((r) => r.nombre === rol)!.id;
    return this.store.usuarios().find((u) => u.idRol === idRol && u.estado)?.correo ?? '';
  }

  login(rol: NombreRol, correo: string): boolean {
    const idRol = this.store.roles().find((r) => r.nombre === rol)?.id;
    const candidatos = this.store.usuarios().filter((u) => u.idRol === idRol && u.estado);
    const usuario = candidatos.find((u) => u.correo.toLowerCase() === correo.trim().toLowerCase()) ?? candidatos[0];
    if (!usuario) return false;
    this.idUsuario.set(usuario.id);
    this.guardar(usuario.id);
    return true;
  }

  logout() {
    this.idUsuario.set(null);
    this.guardar(null);
    this.router.navigateByUrl('/login');
  }

  puedeAcceder(ruta: string): boolean {
    return this.modulos().some((m) => m.ruta === ruta);
  }

  rutaInicial(): string {
    return this.modulos()[0]?.ruta ?? '/login';
  }

  private leer(): number | null {
    try { const v = localStorage.getItem(CLAVE); return v ? Number(v) : null; } catch { return null; }
  }
  private guardar(id: number | null) {
    try { id === null ? localStorage.removeItem(CLAVE) : localStorage.setItem(CLAVE, String(id)); } catch { /* sin almacenamiento */ }
  }
}
