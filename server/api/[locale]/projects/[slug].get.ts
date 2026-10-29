import { renderCaseStudy } from '../../../markdown/render-case-study'
import { isLocale } from '../../../project-source/project'

// GET /api/en/projects/seatme → proyecto + caso de estudio ya convertido a HTML seguro
export default defineEventHandler(async (event) => {
  const locale = getRouterParam(event, 'locale')
  const slug = getRouterParam(event, 'slug')
  if (!isLocale(locale) || !slug) {
    throw createError({ statusCode: 404, statusMessage: 'Not found' })
  }

  const project = await useProjectSource().getProject(slug, locale)
  if (!project) {
    throw createError({ statusCode: 404, statusMessage: 'Project not found' })
  }

  // El Markdown se renderiza aquí, una vez por ciclo de ISR, y el cliente solo recibe HTML
  const { caseStudy, caseStudyBase, ...rest } = project
  return { ...rest, caseStudyHtml: renderCaseStudy(caseStudy, caseStudyBase) }
})
