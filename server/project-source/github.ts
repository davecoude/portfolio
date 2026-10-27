import type { Activity, Project, ProjectSource } from './project'

const API_URL = 'https://api.github.com'
const PORTFOLIO_TOPIC = 'portfolio'
const FEATURED_TOPIC = 'featured'
const JSON_MEDIA_TYPE = 'application/vnd.github+json'

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
}

export function createGitHubProjectSource(options: GitHubProjectSourceOptions): ProjectSource {
  const { owner, token, fetch = globalThis.fetch } = options

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

  async function listPortfolioRepos(): Promise<GitHubRepo[]> {
    const path = `/users/${owner}/repos?type=owner&sort=pushed&per_page=100`
    const response = await request(path)
    if (!response) throw new GitHubApiError(404, `${API_URL}${path}`)
    const repos = (await response.json()) as GitHubRepo[]
    return repos.filter(repo => repo.topics?.includes(PORTFOLIO_TOPIC))
  }

  /** Por ahora todo proyecto usa los datos del repo; el manifiesto llega en el paso 4 */
  function toProject(repo: GitHubRepo): Project {
    return {
      slug: repo.name.toLowerCase(),
      title: repo.name,
      summary: repo.description ?? '',
      role: null,
      stack: [],
      highlights: [],
      productLanguage: null,
      featured: repo.topics?.includes(FEATURED_TOPIC) ?? false,
      links: { demo: repo.homepage || null, code: repo.html_url },
      cover: null,
      hasCaseStudy: false,
      pushedAt: repo.pushed_at,
    }
  }

  return {
    async listProjects() {
      const repos = await listPortfolioRepos()
      // Destacados primero; luego el push más reciente
      return repos
        .map(toProject)
        .sort((a, b) => Number(b.featured) - Number(a.featured) || b.pushedAt.localeCompare(a.pushedAt))
    },

    async getProject() {
      throw new Error('getProject se implementa en el paso 4')
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
