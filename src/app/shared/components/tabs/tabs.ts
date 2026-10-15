import { Component, input, model } from '@angular/core';

export interface TabItem { id: string; label: string; icon?: string; }

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.html',
  styleUrl: './tabs.css',
})
export class Tabs {
  readonly tabs = input.required<TabItem[]>();
  readonly active = model.required<string>();
}
