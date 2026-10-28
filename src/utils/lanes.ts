/**
 * Agrupa las barras de una cronología en filas: dos experiencias comparten fila si no se solapan
 * y queda al menos un mes libre entre ellas (para que sus etiquetas no choquen).
 * Mantiene el orden de los datos, así la experiencia más reciente queda arriba.
 */
export function packLanes<T extends { start: number; end: number }>(items: T[]): T[][] {
  const lanes: T[][] = []
  for (const item of items) {
    const lane = lanes.find(l => l.every(o => item.end < o.start - 1 || item.start > o.end + 1))
    if (lane) lane.push(item)
    else lanes.push([item])
  }
  return lanes
}
