import { Component, input } from '@angular/core';

export type Tono = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

@Component({
  selector: 'app-status-badge',
  templateUrl: './status-badge.html',
  styleUrl: './status-badge.css',
})
export class StatusBadge {
  readonly label = input.required<string>();
  readonly tone = input<Tono>('neutral');
}
