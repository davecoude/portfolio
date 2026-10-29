import { describe, expect, it } from 'vitest'
import { currentYearMonth, monthsInclusive, parseYearMonth, sortByStartDesc, splitMonths } from '../../app/utils/experience'

describe('monthsInclusive', () => {
  it('cuenta ambos extremos', () => {
    expect(monthsInclusive('2025-03', '2025-06')).toBe(4) // PromoValle
    expect(monthsInclusive('2022-08', '2024-08')).toBe(25) // Colombian TI Software
  })

  it('un mismo mes cuenta como 1', () => {
    expect(monthsInclusive('2024-01', '2024-01')).toBe(1)
  })

  it('cruza el cambio de año', () => {
    expect(monthsInclusive('2023-11', '2024-02')).toBe(4)
  })

  it('rechaza un fin anterior al inicio', () => {
    expect(() => monthsInclusive('2024-05', '2024-04')).toThrow()
  })
})

describe('parseYearMonth', () => {
  it.each(['2024-1', '2024-13', '24-01', 'marzo 2024'])('rechaza "%s"', (value) => {
    expect(() => parseYearMonth(value)).toThrow()
  })
})

describe('splitMonths', () => {
  it.each([
    [4, { years: 0, months: 4 }],
    [12, { years: 1, months: 0 }],
    [25, { years: 2, months: 1 }],
  ])('%i meses → %o', (total, expected) => {
    expect(splitMonths(total)).toEqual(expected)
  })
})

describe('sortByStartDesc', () => {
  it('ordena por inicio, del más reciente al más antiguo, sin mutar el original', () => {
    const items = [{ start: '2022-08' }, { start: '2025-03' }, { start: '2023-01' }]
    expect(sortByStartDesc(items).map(i => i.start)).toEqual(['2025-03', '2023-01', '2022-08'])
    expect(items[0]?.start).toBe('2022-08')
  })
})

describe('currentYearMonth', () => {
  it('rellena el mes con cero', () => {
    expect(currentYearMonth(new Date(2026, 9, 28))).toBe('2026-10')
    expect(currentYearMonth(new Date(2026, 0, 5))).toBe('2026-01')
  })
})
