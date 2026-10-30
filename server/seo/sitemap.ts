import type { Locale } from '../project-source/project'

/** Una página del sitio y su ruta en cada idioma en el que existe */
export interface SitemapPage {
  /** Ruta por idioma, sin dominio: { en: '/projects/seatme', es: '/es/projects/seatme' } */
  paths: Partial<Record<Locale, string>>
  /** ISO 8601; para los proyectos, el último push */
  lastmod?: string
}

/** hreflang de cada idioma: el mismo que usa i18n en las etiquetas <link rel="alternate"> */
const HREFLANG: Record<Locale, string> = { en: 'en-US', es: 'es-CO' }
const DEFAULT_LOCALE: Locale = 'en'

function escapeXml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

/**
 * sitemap.xml con alternates hreflang (formato que recomienda Google para sitios multiidioma):
 * cada URL declara sus versiones en los otros idiomas y una x-default (la del idioma por defecto).
 */
export function buildSitemap(siteUrl: string, pages: SitemapPage[]): string {
  const base = siteUrl.replace(/\/$/, '')
  // La home va sin barra final, igual que su canonical (https://dominio y no https://dominio/)
  const url = (path: string) => escapeXml(path === '/' ? base : `${base}${path}`)

  const entries = pages.flatMap((page) => {
    const versions = Object.entries(page.paths) as [Locale, string][]
    const alternates = versions.length > 1
      ? [
          ...versions.map(([locale, path]) => `    <xhtml:link rel="alternate" hreflang="${HREFLANG[locale]}" href="${url(path)}"/>`),
          ...(page.paths[DEFAULT_LOCALE] ? [`    <xhtml:link rel="alternate" hreflang="x-default" href="${url(page.paths[DEFAULT_LOCALE])}"/>`] : []),
        ]
      : []

    return versions.map(([, path]) => [
      '  <url>',
      `    <loc>${url(path)}</loc>`,
      ...(page.lastmod ? [`    <lastmod>${escapeXml(page.lastmod)}</lastmod>`] : []),
      ...alternates,
      '  </url>',
    ].join('\n'))
  })

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...entries,
    '</urlset>',
    '',
  ].join('\n')
}
