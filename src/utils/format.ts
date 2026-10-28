const numberFormat = new Intl.NumberFormat('es-DO')

/**
 * Formatea un número con el separador de miles de República Dominicana (1,234).
 * Evita que toLocaleString() sin locale cambie el formato según el navegador del visitante.
 */
export function formatNumber(value: number | null | undefined): string {
  return numberFormat.format(value ?? 0)
}
