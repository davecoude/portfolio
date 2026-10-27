import { parseManifest, type Manifest } from './manifest'
import type { Activity, Locale, Project, ProjectDetail, ProjectSource } from './project'

const API_URL = 'https://api.github.com'
const RAW_URL = 'https://raw.githubusercontent.com'
const PORTFOLIO_TOPIC = 'portfolio'
const FEATURED_TOPIC = 'featured'
const MANIFEST_FILE = 'meta.json'
const JSON_MEDIA_TYPE = 'application/vnd.github+json'
const RAW_MEDIA_TYPE = 'application/vnd.github.raw+json'

/** Solo los campos de la API de GitHub que usamos */
interface GitHubRepo {
  name: string
  full_name: string
  description: string | null
  homepage: string | null
  html_url: string
  topics?: string[]
  pushed_at: string
  default_branch: string
}

interface GitHubContentEntry {
  name: string
  type: string
}

export class GitHubApiError extends Error {
  /** h3 usa statusCode para la respuesta HTTP: 502 = falló un servicio del que dependemos, no el visitante */
  readonly statusCode = 502

  constructor(readonly upstreamStatus: number, readonly url: string) {
    super(`GitHub API respondió ${upstreamStatus} para ${url}`)
    this.name = 'GitHubApiError'
  }
}

export interface GitHubProjectSourceOptions {
  owner: string
  /** Fine-grained token de solo lectura; sin token, GitHub limita a 60 req/h */
  token?: string
  /** Inyectable para los tests */
  fetch?: typeof globalThis.fetch
  logger?: Pick<Console, 'warn'>
}

export function createGitHubProjectSource(options: GitHubProjectSourceOptions): ProjectSource {
  const { owner, token, fetch = globalThis.fetch, logger = console } = options

  /** 404 → null (el recurso no existe). Cualquier otro error lanza, para que ISR siga sirviendo la versión anterior */
  async function request(path: string, accept = JSON_MEDIA_TYPE): Promise<Response | null> {
    const url = `${API_URL}${path}`
    const response = await fetch(url, {
      headers: {
        'Accept': accept,
        'X-GitHub-Api-Version': '2022-11-28',
        'User-Agent': `${owner}-portfolio`,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    })
    if (response.status === 404) return null
    if (!response.ok) throw new GitHubApiError(response.status, url)
    return response
  }

  function portfolioPath(repo: GitHubRepo, file?: string): string {
    return `/repos/${repo.full_name}/contents/.portfolio${file ? `/${file}` : ''}`
  }

  async function listPortfolioRepos(): Promise<GitHubRepo[]> {
    const path = `/users/${owner}/repos?type=owner&sort=pushed&per_page=100`
    const response = await request(path)
    if (!response) throw new GitHubApiError(404, `${API_URL}${path}`)
    const repos = (await response.json()) as GitHubRepo[]
    return repos.filter(repo => repo.topics?.includes(PORTFOLIO_TOPIC))
  }

  /** Nombres de archivo dentro de .portfolio/ (vacío si la carpeta no existe) */
  async function listPortfolioFiles(repo: GitHubRepo): Promise<Set<string>> {
    const response = await request(portfolioPath(repo))
    if (!response) return new Set()
    const entries = (await response.json()) as GitHubContentEntry[]
    return new Set(entries.filter(entry => entry.type === 'file').map(entry => entry.name))
  }

  async function readFile(repo: GitHubRepo, file: string): Promise<string | null> {
    const response = await request(portfolioPath(repo, file), RAW_MEDIA_TYPE)
    return response ? response.text() : null
  }

  async function readManifest(repo: GitHubRepo, files: Set<string>): Promise<Manifest | null> {
    if (!files.has(MANIFEST_FILE)) return null
    const raw = await readFile(repo, MANIFEST_FILE)
    if (raw === null) return null

    const result = parseManifest(raw)
    if (!result.success) {
      logger.warn(`[project-source] Manifiesto inválido en ${repo.full_name}; se usa el fallback.\n${result.error}`)
      return null
    }
    return result.manifest
  }

  function rawFileUrl(repo: GitHubRepo, path: string): string {
    const relativePath = path.replace(/^\.?\//, '')
    return `${RAW_URL}/${repo.full_name}/${repo.default_branch}/${relativePath}`
  }

  async function loadProject(repo: GitHubRepo, locale: Locale): Promise<Project> {
    const files = await listPortfolioFiles(repo)
    const manifest = await readManifest(repo, files)

    const base = {
      slug: repo.name.toLowerCase(),
      featured: repo.topics?.includes(FEATURED_TOPIC) ?? false,
      links: { demo: repo.homepage || null, code: repo.html_url },
      hasCaseStudy: files.has(caseStudyFile(locale)),
      pushedAt: repo.pushed_at,
    }

    if (!manifest) {
      return {
        ...base,
        title: repo.name,
        summary: repo.description ?? '',
        role: null,
        stack: [],
        highlights: [],
        productLanguage: null,
        cover: null,
      }
    }

    return {
      ...base,
      title: manifest.title,
      summary: manifest.summary[locale],
      role: manifest.role[locale],
      stack: manifest.stack,
      highlights: manifest.highlights?.[locale] ?? [],
      productLanguage: manifest.productLanguage,
      cover: rawFileUrl(repo, manifest.cover),
    }
  }

  return {
    async listProjects(locale) {
      const repos = await listPortfolioRepos()
      const projects = await Promise.all(repos.map(repo => loadProject(repo, locale)))
      // Destacados primero; luego el push más reciente
      return projects.sort((a, b) =>
        Number(b.featured) - Number(a.featured) || b.pushedAt.localeCompare(a.pushedAt),
      )
    },

    async getProject(slug, locale): Promise<ProjectDetail | null> {
      const repos = await listPortfolioRepos()
      const repo = repos.find(candidate => candidate.name.toLowerCase() === slug.toLowerCase())
      if (!repo) return null

      const project = await loadProject(repo, locale)
      if (!project.hasCaseStudy) return null

      const caseStudy = await readFile(repo, caseStudyFile(locale))
      return caseStudy === null ? null : { ...project, caseStudy }
    },

    async getLatestActivity(): Promise<Activity | null> {
      const repos = await listPortfolioRepos()
      const latest = repos.reduce<GitHubRepo | null>(
        (newest, repo) => (!newest || repo.pushed_at > newest.pushed_at ? repo : newest),
        null,
      )
      return latest
        ? { repo: latest.full_name, url: latest.html_url, pushedAt: latest.pushed_at }
        : null
    },
  }
}

function caseStudyFile(locale: Locale): string {
  return `case-study.${locale}.md`
}
