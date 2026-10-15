import { Component, input, output } from '@angular/core';

/** Ventana emergente reutilizable. El contenido va en el cuerpo y los botones en [modal-footer]. */
@Component({
  selector: 'app-modal',
  host: { '(document:keydown.escape)': 'open() && cerrar()' },
  templateUrl: './modal.html',
  styleUrl: './modal.css',
})
export class Modal {
  readonly open = input(false);
  readonly title = input('');
  readonly size = input<'md' | 'lg'>('md');
  readonly closed = output<void>();

  protected cerrar() { this.closed.emit(); }
  protected clicFondo(e: MouseEvent) { if (e.target === e.currentTarget) this.cerrar(); }
}
