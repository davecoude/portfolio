import { isLocale } from '../../../project-source/project'

// GET /api/en/projects/seatme → proyecto + Markdown del caso de estudio
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
  return project
})
