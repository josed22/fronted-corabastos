import { Component, computed, effect, input, output, signal, untracked } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { Modal } from '../modal/modal';
import { Row } from '../../interfaces/row.interface';

export interface FormField {
  key: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'date' | 'select' | 'textarea' | 'checkbox';
  required?: boolean;
  options?: { value: string | number; label: string }[];
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  hint?: string;
  default?: unknown;
  /** Se muestra pero no se puede modificar al editar. */
  disabledOnEdit?: boolean;
  /** No aparece al editar (por ejemplo, la contraseña). */
  hideOnEdit?: boolean;
  full?: boolean;
}

let contador = 0;

/** Formulario en ventana emergente, generado a partir de la definición de sus campos. */
@Component({
  selector: 'app-form-modal',
  imports: [ReactiveFormsModule, Modal],
  templateUrl: './form-modal.html',
  styleUrl: './form-modal.css',
})
export class FormModal {
  readonly open = input(false);
  readonly title = input('');
  readonly fields = input.required<FormField[]>();
  readonly initial = input<Row | null>(null);
  readonly submitLabel = input('Guardar');
  readonly size = input<'md' | 'lg'>('md');

  readonly saved = output<Row>();
  readonly closed = output<void>();

  protected readonly formId = `form-modal-${contador++}`;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected readonly form = signal(new FormGroup<Record<string, FormControl<any>>>({}));
  protected readonly visibles = computed(() => this.fields().filter((f) => !(f.hideOnEdit && this.initial() !== null)));

  constructor() {
    // El formulario se reconstruye al cambiar los campos, el registro a editar o al abrir la ventana,
    // y existe siempre para que los campos puedan enlazarse desde el primer renderizado.
    effect(() => {
      this.open();
      const campos = this.visibles();
      const inicial = this.initial();
      untracked(() => this.form.set(this.construir(campos, inicial)));
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private construir(campos: FormField[], inicial: Row | null): FormGroup<Record<string, FormControl<any>>> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const grupo = new FormGroup<Record<string, FormControl<any>>>({});
    for (const f of campos) {
      const valor = inicial ? inicial[f.key] : f.default;
      const validadores: ValidatorFn[] = [];
      if (f.required) validadores.push(f.type === 'checkbox' ? Validators.requiredTrue : Validators.required);
      if (f.type === 'email') validadores.push(Validators.email);
      if (f.min !== undefined) validadores.push(Validators.min(f.min));
      if (f.max !== undefined) validadores.push(Validators.max(f.max));
      grupo.addControl(f.key, new FormControl(
        { value: valor ?? (f.type === 'checkbox' ? false : ''), disabled: !!(f.disabledOnEdit && inicial) },
        validadores,
      ));
    }
    return grupo;
  }

  protected invalido(f: FormField): boolean {
    const c = this.form().get(f.key);
    return !!c && c.invalid && (c.touched || c.dirty);
  }

  protected mensaje(f: FormField): string {
    const e = this.form().get(f.key)?.errors;
    if (!e) return '';
    if (e['required'] || e['requiredTrue']) return 'Este campo es obligatorio';
    if (e['email']) return 'Escribe un correo válido';
    if (e['min']) return `Debe ser al menos ${e['min'].min}`;
    if (e['max']) return `No puede superar ${e['max'].max}`;
    return 'Valor no válido';
  }

  protected guardar() {
    const g = this.form();
    if (g.invalid) { g.markAllAsTouched(); return; }
    this.saved.emit(g.getRawValue());
  }
}
