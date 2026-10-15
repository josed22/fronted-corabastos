import { Component, computed, inject, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { DataService } from '../../core/services/data.service';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  protected readonly auth = inject(AuthService);
  private readonly store = inject(DataService);
  readonly open = input(false);
  readonly close = output<void>();
  protected readonly iconoRol = computed(() => this.store.roles().find((r) => r.nombre === this.auth.rol())?.icono ?? 'person');
}
