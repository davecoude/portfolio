import { isLocale } from '../../../project-source/project'

// GET /api/en/projects · GET /api/es/projects
export default defineEventHandler((event) => {
  const locale = getRouterParam(event, 'locale')
  if (!isLocale(locale)) {
    throw createError({ statusCode: 404, statusMessage: 'Unknown locale' })
  }
  return useProjectSource().listProjects(locale)
})
