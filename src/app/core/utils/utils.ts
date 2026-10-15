/** Fecha local en formato AAAA-MM-DD. */
export function isoFecha(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** Fecha ISO de hoy más (o menos) cierta cantidad de días. */
export function fechaIso(dias: number): string {
  const d = new Date();
  d.setDate(d.getDate() + dias);
  return isoFecha(d);
}

export function redondear(n: number, decimales = 2): number {
  const f = 10 ** decimales;
  return Math.round(n * f) / f;
}

export function siguienteId(lista: readonly { id: number }[]): number {
  return lista.reduce((max, x) => Math.max(max, x.id), 0) + 1;
}
