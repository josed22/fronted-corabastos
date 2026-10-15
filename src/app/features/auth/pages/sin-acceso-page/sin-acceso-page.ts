import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { EmptyState } from '../../../../shared/components/empty-state/empty-state';

@Component({
  selector: 'app-sin-acceso-page',
  imports: [EmptyState, RouterLink],
  templateUrl: './sin-acceso-page.html',
})
export class SinAccesoPage { protected readonly auth = inject(AuthService); }
