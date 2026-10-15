import { Injectable, signal } from '@angular/core';

export interface Toast { id: number; mensaje: string; tipo: 'exito' | 'error' | 'info'; }

@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly toasts = signal<Toast[]>([]);
  private contador = 0;

  exito(mensaje: string) { this.mostrar(mensaje, 'exito'); }
  error(mensaje: string) { this.mostrar(mensaje, 'error'); }
  info(mensaje: string) { this.mostrar(mensaje, 'info'); }

  cerrar(id: number) { this.toasts.update((l) => l.filter((t) => t.id !== id)); }

  private mostrar(mensaje: string, tipo: Toast['tipo']) {
    const id = ++this.contador;
    this.toasts.update((l) => [...l, { id, mensaje, tipo }]);
    setTimeout(() => this.cerrar(id), 4000);
  }
}
