import { describe, expect, it } from 'vitest'
import { buildSitemap } from '../../server/seo/sitemap'

const site = 'https://davecoude.vercel.app'

describe('buildSitemap', () => {
  it('lista cada idioma como URL propia con sus alternates hreflang y x-default; la home sin barra final, como su canonical', () => {
    const xml = buildSitemap(site, [{ paths: { en: '/', es: '/es' } }])

    expect(xml).toContain('<loc>https://davecoude.vercel.app</loc>')
    expect(xml).toContain('<loc>https://davecoude.vercel.app/es</loc>')
    expect(xml.match(/<url>/g)).toHaveLength(2)
    expect(xml).toContain('<xhtml:link rel="alternate" hreflang="en-US" href="https://davecoude.vercel.app"/>')
    expect(xml).toContain('<xhtml:link rel="alternate" hreflang="es-CO" href="https://davecoude.vercel.app/es"/>')
    expect(xml).toContain('<xhtml:link rel="alternate" hreflang="x-default" href="https://davecoude.vercel.app"/>')
  })

  it('incluye lastmod y omite alternates cuando la página existe en un solo idioma', () => {
    const xml = buildSitemap(`${site}/`, [{ paths: { es: '/es/projects/seatme' }, lastmod: '2026-10-28T23:32:25Z' }])

    expect(xml).toContain('<loc>https://davecoude.vercel.app/es/projects/seatme</loc>')
    expect(xml).toContain('<lastmod>2026-10-28T23:32:25Z</lastmod>')
    expect(xml).not.toContain('xhtml:link')
  })

  it('omite las páginas sin ningún idioma y escapa caracteres especiales', () => {
    const xml = buildSitemap(site, [{ paths: {} }, { paths: { en: '/projects/a&b' } }])

    expect(xml.match(/<url>/g)).toHaveLength(1)
    expect(xml).toContain('/projects/a&amp;b')
  })

  it('genera XML válido con los namespaces de sitemap y xhtml', () => {
    const xml = buildSitemap(site, [{ paths: { en: '/', es: '/es' } }])

    expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true)
    expect(xml).toContain('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"')
    expect(xml).toContain('xmlns:xhtml="http://www.w3.org/1999/xhtml"')
  })
})
