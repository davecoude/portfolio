import { describe, expect, it } from 'vitest'
import { groupRoute } from '../../app/utils/analyticsRoute'

describe('groupRoute', () => {
  it.each([
    ['/', {}, '/'],
    ['/es', {}, '/es'],
    ['/projects/seatme', { slug: 'seatme' }, '/projects/[slug]'],
    ['/es/projects/seatme', { slug: 'seatme' }, '/es/projects/[slug]'],
    ['/docs/a/b', { path: ['a', 'b'] }, '/docs/[...path]'],
  ])('%s → %s', (path, params, expected) => {
    expect(groupRoute(path, params as Record<string, string | string[]>)).toBe(expected)
  })

  it('solo reemplaza segmentos completos', () => {
    expect(groupRoute('/projects/seatme-v2/seatme', { slug: 'seatme' })).toBe('/projects/seatme-v2/[slug]')
  })

  it('escapa caracteres especiales del valor', () => {
    expect(groupRoute('/projects/a.b', { slug: 'a.b' })).toBe('/projects/[slug]')
    expect(groupRoute('/projects/axb', { slug: 'a.b' })).toBe('/projects/axb')
  })
})
