import { Marked } from 'marked'
import sanitizeHtml from 'sanitize-html'

/** URLs de la carpeta donde vive el Markdown, terminadas en "/": contra ellas se resuelven las rutas relativas */
export interface CaseStudyBase {
  /** Para imágenes: el archivo tal cual (raw.githubusercontent.com) */
  assets: string
  /** Para links: la vista del archivo en GitHub */
  source: string
}

const marked = new Marked({ gfm: true })

/** Relativa → absoluta contra la carpeta del Markdown; los anclas (#...) se quedan en la página */
function resolveUrl(url: string | undefined, base: string): string | undefined {
  if (!url || url.startsWith('#')) return url
  try {
    return new URL(url, base).href
  }
  catch {
    return undefined
  }
}

/**
 * Markdown del repo → HTML seguro para v-html.
 * El contenido viene de un repo externo: se sanitiza en el servidor (lista blanca de etiquetas,
 * atributos y esquemas), así ningún script, iframe o javascript: llega al navegador.
 */
export function renderCaseStudy(markdown: string, base: CaseStudyBase): string {
  const html = marked.parse(markdown, { async: false })

  return sanitizeHtml(html, {
    allowedTags: [...sanitizeHtml.defaults.allowedTags, 'img'],
    allowedAttributes: {
      a: ['href', 'title', 'target', 'rel'],
      img: ['src', 'alt', 'title', 'loading', 'decoding'],
      code: ['class'],
      pre: ['tabindex'],
    },
    allowedSchemes: ['https', 'mailto'],
    allowedSchemesByTag: { img: ['https'] },
    // Se aplica antes del filtrado: una URL resuelta a javascript: igual se descarta por esquema
    transformTags: {
      a: (tagName, attribs) => {
        const href = resolveUrl(attribs.href, base.source)
        const external = Boolean(href && !href.startsWith('#'))
        return {
          tagName,
          attribs: {
            ...attribs,
            ...(href ? { href } : {}),
            ...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {}),
          },
        }
      },
      pre: (tagName, attribs) => ({
        tagName,
        attribs: {
          ...attribs, tabindex: '0'
        }
      }),
      img: (tagName, attribs) => {
        const src = resolveUrl(attribs.src, base.assets)
        return {
          tagName,
          attribs: { ...attribs, ...(src ? { src } : {}), loading: 'lazy', decoding: 'async' },
        }
      },
    },
  })
}
