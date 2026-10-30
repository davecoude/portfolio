import { buildSitemap, type SitemapPage } from '../seo/sitemap'

// GET /sitemap.xml → la home y los casos de estudio en cada idioma en el que existen
export default defineEventHandler(async (event) => {
  const { baseUrl } = useRuntimeConfig(event).public.i18n
  const source = useProjectSource()
  const [en, es] = await Promise.all([source.listProjects('en'), source.listProjects('es')])

  const caseStudies: SitemapPage[] = en.map((project) => {
    const inSpanish = es.find(candidate => candidate.slug === project.slug)
    return {
      paths: {
        ...(project.hasCaseStudy ? { en: `/projects/${project.slug}` } : {}),
        ...(inSpanish?.hasCaseStudy ? { es: `/es/projects/${project.slug}` } : {}),
      },
      lastmod: project.pushedAt,
    }
  })

  setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
  return buildSitemap(String(baseUrl), [{ paths: { en: '/', es: '/es' } }, ...caseStudies])
})
