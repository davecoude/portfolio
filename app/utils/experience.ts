/** Funciones puras de la línea de tiempo; sin dependencias de Vue para poder probarlas con Vitest */
export interface YearMonth {
  year: number
  month: number
}

/** "2025-03" → { year: 2025, month: 3 } */
export function parseYearMonth(value: string): YearMonth {
  const match = /^(\d{4})-(\d{2})$/.exec(value)
  if (!match) throw new Error(`Formato de mes inválido: "${value}" (se espera YYYY-MM)`)
  const year = Number(match[1])
  const month = Number(match[2])
  if (month < 1 || month > 12) throw new Error(`Mes fuera de rango: "${value}"`)
  return { year, month }
}

/** Meses trabajados contando ambos extremos: de marzo a junio son 4 meses */
export function monthsInclusive(start: string, end: string): number {
  const from = parseYearMonth(start)
  const to = parseYearMonth(end)
  const months = (to.year - from.year) * 12 + (to.month - from.month) + 1
  if (months < 1) throw new Error(`El fin (${end}) es anterior al inicio (${start})`)
  return months
}

/** 25 → { years: 2, months: 1 } */
export function splitMonths(total: number): { years: number, months: number } {
  return { years: Math.floor(total / 12), months: total % 12 }
}

/** Más reciente primero, por fecha de inicio; YYYY-MM se ordena bien como texto */
export function sortByStartDesc<T extends { start: string }>(items: readonly T[]): T[] {
  return [...items].sort((a, b) => b.start.localeCompare(a.start))
}

/** Mes actual en YYYY-MM, para los trabajos sin fecha de fin */
export function currentYearMonth(now = new Date()): string {
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}
