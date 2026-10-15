import { DatePipe } from '@angular/common';
import { Component, ElementRef, computed, inject, output, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { DataService } from '../../core/services/data.service';

@Component({
  selector: 'app-navbar',
  imports: [DatePipe],
  host: { '(document:click)': 'cerrarSiFuera($event)', '(document:keydown.escape)': 'avisosAbiertos.set(false)' },
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  protected readonly auth = inject(AuthService);
  private readonly store = inject(DataService);
  private readonly router = inject(Router);
  private readonly host = inject(ElementRef<HTMLElement>);

  readonly menu = output<void>();
  protected readonly hoy = new Date();
  protected readonly avisosAbiertos = signal(false);

  private readonly url = toSignal(
    this.router.events.pipe(filter((e) => e instanceof NavigationEnd), map(() => this.router.url)),
    { initialValue: this.router.url },
  );

  protected readonly titulo = computed(() => {
    const u = this.url();
    return this.auth.modulos().find((m) => u === m.ruta || u.startsWith(m.ruta + '/') || u.startsWith(m.ruta + '?'))?.nombre ?? 'Corabastos Conecta';
  });
  protected readonly avisos = computed(() => this.store.avisosPara(this.auth.usuario()));
  protected readonly nombre = computed(() => { const u = this.auth.usuario(); return u ? `${u.nombre} ${u.apellido}` : ''; });
  protected readonly iniciales = computed(() => { const u = this.auth.usuario(); return u ? (u.nombre[0] + u.apellido[0]).toUpperCase() : ''; });

  protected alternar(e: Event) { e.stopPropagation(); this.avisosAbiertos.update((v) => !v); }
  protected cerrarSiFuera(e: Event) {
    if (this.avisosAbiertos() && !this.host.nativeElement.contains(e.target as Node)) this.avisosAbiertos.set(false);
  }
}
