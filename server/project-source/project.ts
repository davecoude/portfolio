/**
 * Modelo de dominio y puerto de la fuente de proyectos.
 * El resto de la app solo conoce estos tipos; no sabe que los datos vienen de GitHub.
 */

export const LOCALES = ['en', 'es'] as const
export type Locale = (typeof LOCALES)[number]

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (LOCALES as readonly string[]).includes(value)
}

export interface Project {
  slug: string
  title: string
  summary: string
  role: string | null
  stack: string[]
  highlights: string[]
  productLanguage: Locale | null
  featured: boolean
  links: {
    demo: string | null
    code: string
  }
  cover: string | null
  hasCaseStudy: boolean
  pushedAt: string
}

export interface ProjectDetail extends Project {
  caseStudy: string
}

export interface Activity {
  repo: string
  url: string
  pushedAt: string
}

export interface ProjectSource {
  listProjects(locale: Locale): Promise<Project[]>
  getProject(slug: string, locale: Locale): Promise<ProjectDetail | null>
  getLatestActivity(): Promise<Activity | null>
}