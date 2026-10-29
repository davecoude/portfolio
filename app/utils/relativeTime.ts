/** Tiempo relativo para la tira de actividad ("yesterday", "hace 3 días"); sin dependencias de Vue */

export type RelativeUnit = 'second' | 'minute' | 'hour' | 'day' | 'month' | 'year'

const MINUTE = 60_000
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

/** Elige la unidad más grande que tenga sentido; negativo = en el pasado */
export function relativeTimeParts(from: Date, now: Date = new Date()): { value: number, unit: RelativeUnit } {
  const diff = from.getTime() - now.getTime()
  const abs = Math.abs(diff)
  if (abs < MINUTE) return { value: 0, unit: 'second' }
  if (abs < HOUR) return { value: Math.round(diff / MINUTE), unit: 'minute' }
  if (abs < DAY) return { value: Math.round(diff / HOUR), unit: 'hour' }
  if (abs < 30 * DAY) return { value: Math.round(diff / DAY), unit: 'day' }
  if (abs < 365 * DAY) return { value: Math.round(diff / (30 * DAY)), unit: 'month' }
  return { value: Math.round(diff / (365 * DAY)), unit: 'year' }
}

/** numeric: 'auto' convierte -1 día en "yesterday"/"ayer" y 0 segundos en "now"/"ahora" */
export function formatRelativeTime(from: Date, locale: string, now: Date = new Date()): string {
  const { value, unit } = relativeTimeParts(from, now)
  return new Intl.RelativeTimeFormat(locale, { numeric: 'auto' }).format(value, unit)
}
