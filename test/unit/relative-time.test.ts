import { describe, expect, it } from 'vitest'
import { formatRelativeTime, relativeTimeParts } from '../../app/utils/relativeTime'

const now = new Date('2026-10-28T21:00:00Z')
const ago = (ms: number) => new Date(now.getTime() - ms)
const MINUTE = 60_000
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

describe('relativeTimeParts', () => {
  it.each([
    ['20 segundos', 20_000, { value: 0, unit: 'second' }],
    ['5 minutos', 5 * MINUTE, { value: -5, unit: 'minute' }],
    ['3 horas', 3 * HOUR, { value: -3, unit: 'hour' }],
    ['30 horas', 30 * HOUR, { value: -1, unit: 'day' }],
    ['3 días', 3 * DAY, { value: -3, unit: 'day' }],
    ['60 días', 60 * DAY, { value: -2, unit: 'month' }],
    ['400 días', 400 * DAY, { value: -1, unit: 'year' }],
  ])('hace %s', (_label, ms, expected) => {
    expect(relativeTimeParts(ago(ms), now)).toEqual(expected)
  })
})

describe('formatRelativeTime', () => {
  it.each([
    ['en', 30 * HOUR, 'yesterday'],
    ['es', 30 * HOUR, 'ayer'],
    ['en', 3 * DAY, '3 days ago'],
    ['es', 3 * DAY, 'hace 3 días'],
    ['en', 10_000, 'now'],
    ['es', 10_000, 'ahora'],
  ])('%s, hace %i ms → "%s"', (locale, ms, expected) => {
    expect(formatRelativeTime(ago(ms), locale, now)).toBe(expected)
  })
})
