import { describe, expect, it } from 'vitest'
import { renderCaseStudy } from '../../server/markdown/render-case-study'

const base = {
  assets: 'https://raw.githubusercontent.com/davecoude/SeatMe/main/.portfolio/',
  source: 'https://github.com/davecoude/SeatMe/blob/main/.portfolio/',
}
const render = (markdown: string) => renderCaseStudy(markdown, base)

describe('renderCaseStudy', () => {
  it('convierte el Markdown a HTML, incluidos bloques de código', () => {
    const html = render('## Contexto\n\nTexto con **negrita**.\n\n```\nroutes → service\n```')
    expect(html).toContain('<h2>Contexto</h2>')
    expect(html).toContain('<strong>negrita</strong>')
    expect(html).toContain('<pre tabindex="0"><code>routes → service')
  })

  it('resuelve las imágenes relativas a la URL raw del repo', () => {
    const html = render('![Diagrama](../docs/architecture.svg)')
    expect(html).toContain('src="https://raw.githubusercontent.com/davecoude/SeatMe/main/docs/architecture.svg"')
    expect(html).toContain('alt="Diagrama"')
    expect(html).toContain('loading="lazy"')
  })

  it('resuelve los links relativos a la vista del archivo en GitHub y abre los externos en otra pestaña', () => {
    const html = render('[schema](../apps/api/prisma/schema.prisma) · [demo](https://seat-me-three.vercel.app)')
    expect(html).toContain('href="https://github.com/davecoude/SeatMe/blob/main/apps/api/prisma/schema.prisma"')
    expect(html).toContain('href="https://seat-me-three.vercel.app/" target="_blank" rel="noopener noreferrer"')
  })

  it('deja los anclas en la misma página', () => {
    expect(render('[arriba](#contexto)')).toBe('<p><a href="#contexto">arriba</a></p>\n')
  })

  it('elimina scripts, manejadores de eventos, iframes y esquemas peligrosos', () => {
    const html = render([
      '<script>alert(1)</script>',
      '<img src="x.png" onerror="alert(1)">',
      '<iframe src="https://evil.example"></iframe>',
      '[clic](javascript:alert(1))',
      '![x](http://inseguro.example/a.png)',
    ].join('\n\n'))
    expect(html).not.toMatch(/<script|onerror|<iframe|javascript:|http:\/\//)
  })
})
