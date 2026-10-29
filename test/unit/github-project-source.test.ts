import { describe, expect, it, vi } from 'vitest'
import { createGitHubProjectSource, GitHubApiError } from '../../server/project-source/github'
import seatmeRepo from '../fixtures/github/seatme.repo.json'

/*
 * Seam único: probamos el puerto ProjectSource con un GitHub falso.
 * El fake responde por ruta de la API; lo que no está registrado devuelve 404.
 * Solo verificamos comportamiento observable, nunca qué endpoints se llaman.
 */

type FakeBody = object | string | Response

function fakeGitHub(routes: Record<string, FakeBody>) {
  return vi.fn(async (input: string | URL | Request) => {
    const { pathname } = new URL(input instanceof Request ? input.url : input)
    const body = routes[pathname]
    if (body === undefined) return new Response('Not Found', { status: 404 })
    if (body instanceof Response) return body.clone()
    return typeof body === 'string'
      ? new Response(body, { status: 200 })
      : Response.json(body)
  })
}

function repo(overrides: Partial<typeof seatmeRepo> = {}) {
  return { ...seatmeRepo, ...overrides }
}

const validManifest = {
  title: 'SeatMe',
  summary: { es: 'Reserva de escritorios.', en: 'Desk booking.' },
  role: { es: 'Full-stack', en: 'Full-stack' },
  stack: ['Vue 3', 'Express 5', 'PostgreSQL'],
  productLanguage: 'es',
  cover: 'docs/cover.png',
  highlights: { es: ['Roles con JWT'], en: ['JWT roles'] },
}

const SEATME = '/repos/davecoude/SeatMe/contents/.portfolio'

function source(routes: Record<string, FakeBody>, logger = { warn: vi.fn() }) {
  return createGitHubProjectSource({ owner: 'davecoude', fetch: fakeGitHub(routes), logger })
}

describe('listProjects', () => {
  it('incluye solo los repos con el topic portfolio', async () => {
    const projects = await source({
      '/users/davecoude/repos': [
        repo(),
        repo({ name: 'apuntes', full_name: 'davecoude/apuntes', topics: ['notes'] }),
      ],
    }).listProjects('en')

    expect(projects.map(p => p.slug)).toEqual(['seatme'])
  })

  it('ordena los destacados primero y luego por push más reciente', async () => {
    const projects = await source({
      '/users/davecoude/repos': [
        repo({ name: 'old', full_name: 'davecoude/old', topics: ['portfolio'], pushed_at: '2026-01-01T00:00:00Z' }),
        repo({ name: 'new', full_name: 'davecoude/new', topics: ['portfolio'], pushed_at: '2026-10-26T00:00:00Z' }),
        repo({ pushed_at: '2025-06-01T00:00:00Z' }), // SeatMe: destacado pero más antiguo
      ],
    }).listProjects('en')

    expect(projects.map(p => p.slug)).toEqual(['seatme', 'new', 'old'])
  })

  it('sin manifiesto usa la descripción y el homepage del repo', async () => {
    const [project] = await source({
      '/users/davecoude/repos': [repo({ homepage: '' })],
    }).listProjects('en')

    expect(project).toMatchObject({
      title: 'SeatMe',
      summary: 'Reserva de escritorios en un espacio de trabajo compartido',
      role: null,
      stack: [],
      cover: null,
      productLanguage: null,
      links: { demo: null, code: 'https://github.com/davecoude/SeatMe' },
    })
  })

  it('usa el manifiesto en el idioma pedido y resuelve el cover a una URL absoluta', async () => {
    const routes = {
      '/users/davecoude/repos': [repo()],
      [SEATME]: [{ name: 'meta.json', type: 'file' }],
      [`${SEATME}/meta.json`]: JSON.stringify(validManifest),
    }

    const [en] = await source(routes).listProjects('en')
    const [es] = await source(routes).listProjects('es')

    expect(en).toMatchObject({
      title: 'SeatMe',
      summary: 'Desk booking.',
      highlights: ['JWT roles'],
      productLanguage: 'es',
      featured: true,
      cover: 'https://raw.githubusercontent.com/davecoude/SeatMe/main/docs/cover.png',
    })
    expect(es?.summary).toBe('Reserva de escritorios.')
  })

  it.each([
    ['no cumple el schema', JSON.stringify({ ...validManifest, productLanguage: 'fr' })],
    ['no es JSON válido', '{ "title": '],
    ])('si el manifiesto %s, usa el fallback y lo reporta', async (_case, raw) => {
    const logger = { warn: vi.fn() }
    const [project] = await source({
      '/users/davecoude/repos': [repo()],
      [SEATME]: [{ name: 'meta.json', type: 'file' }],
      [`${SEATME}/meta.json`]: raw,
    }, logger).listProjects('en')

    expect(project?.summary).toBe('Reserva de escritorios en un espacio de trabajo compartido')
    expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining('davecoude/SeatMe'))
  })

  it('marca el caso de estudio solo en los idiomas que lo tienen', async () => {
    const routes = {
      '/users/davecoude/repos': [repo()],
      [SEATME]: [{ name: 'case-study.es.md', type: 'file' }],
    }

    const [en] = await source(routes).listProjects('en')
    const [es] = await source(routes).listProjects('es')

    expect(en?.hasCaseStudy).toBe(false)
    expect(es?.hasCaseStudy).toBe(true)
  })

  it('lanza GitHubApiError (502) si GitHub falla, para que ISR conserve la versión anterior', async () => {
    const failing = source({ '/users/davecoude/repos': new Response('boom', { status: 500 }) })

    await expect(failing.listProjects('en')).rejects.toBeInstanceOf(GitHubApiError)
    await expect(failing.listProjects('en')).rejects.toMatchObject({ statusCode: 502, upstreamStatus: 500 })
  })
})

describe('getProject', () => {
  const routes = {
    '/users/davecoude/repos': [repo()],
    [SEATME]: [
      { name: 'meta.json', type: 'file' },
      { name: 'case-study.es.md', type: 'file' },
    ],
    [`${SEATME}/meta.json`]: JSON.stringify(validManifest),
    [`${SEATME}/case-study.es.md`]: '## Contexto\nReservas de escritorios.',
  }

  it('devuelve el proyecto con el Markdown del caso de estudio, sin importar mayúsculas en el slug', async () => {
    const project = await source(routes).getProject('SeatMe', 'es')

    expect(project?.title).toBe('SeatMe')
    expect(project?.caseStudy).toContain('## Contexto')
  })

  it('devuelve null si no hay caso de estudio en ese idioma', async () => {
    expect(await source(routes).getProject('seatme', 'en')).toBeNull()
  })

  it('devuelve null si el slug no existe', async () => {
    expect(await source(routes).getProject('no-existe', 'es')).toBeNull()
  })

  it('incluye las URLs de la carpeta .portfolio/ para resolver imágenes y links relativos', async () => {
    const project = await source(routes).getProject('seatme', 'es')

    expect(project?.caseStudyBase).toEqual({
      assets: 'https://raw.githubusercontent.com/davecoude/SeatMe/main/.portfolio/',
      source: 'https://github.com/davecoude/SeatMe/blob/main/.portfolio/',
    })
  })
})

describe('getLatestActivity', () => {
  it('devuelve el repo del portafolio con el push más reciente', async () => {
    const activity = await source({
      '/users/davecoude/repos': [
        repo({ pushed_at: '2026-10-20T00:00:00Z' }),
        repo({ name: 'new', full_name: 'davecoude/new', html_url: 'https://github.com/davecoude/new', topics: ['portfolio'], pushed_at: '2026-10-26T12:00:00Z' }),
        repo({ name: 'private-notes', full_name: 'davecoude/private-notes', topics: [], pushed_at: '2026-10-27T00:00:00Z' }),
      ],
    }).getLatestActivity()

    expect(activity).toEqual({
      repo: 'davecoude/new',
      url: 'https://github.com/davecoude/new',
      pushedAt: '2026-10-26T12:00:00Z',
    })
  })

  it('devuelve null si ningún repo tiene el topic portfolio', async () => {
    const activity = await source({ '/users/davecoude/repos': [repo({ topics: [] })] }).getLatestActivity()

    expect(activity).toBeNull()
  })
})

describe('autenticación', () => {
  it('envía el token como Bearer cuando está configurado', async () => {
    const fetch = fakeGitHub({ '/users/davecoude/repos': [] })
    await createGitHubProjectSource({ owner: 'davecoude', token: 'secret', fetch }).listProjects('en')

    const init = fetch.mock.calls[0]?.[1] as RequestInit | undefined
    expect(init?.headers).toMatchObject({ Authorization: 'Bearer secret' })
  })
})
