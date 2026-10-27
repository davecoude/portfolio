import { z } from 'zod'

/**
 * Contrato de .portfolio/meta.json: cada repo se describe a sí mismo.
 * El idioma de los textos (es/en) es el del portafolio; productLanguage es el del producto.
 */
const localizedText = z.object({
  es: z.string().min(1),
  en: z.string().min(1),
})

export const manifestSchema = z.object({
  title: z.string().min(1),
  summary: localizedText,
  role: localizedText,
  stack: z.array(z.string().min(1)),
  productLanguage: z.enum(['es', 'en']),
  cover: z.string().min(1),
  highlights: z
    .object({
      es: z.array(z.string().min(1)),
      en: z.array(z.string().min(1)),
    })
    .optional(),
})

export type Manifest = z.infer<typeof manifestSchema>

export type ManifestResult =
  | { success: true, manifest: Manifest }
  | { success: false, error: string }

/** Nunca lanza: un manifiesto roto se reporta y el proyecto usa el fallback */
export function parseManifest(raw: string): ManifestResult {
  let json: unknown
  try {
    json = JSON.parse(raw)
  }
  catch (error) {
    return { success: false, error: `JSON inválido: ${(error as Error).message}` }
  }

  const result = manifestSchema.safeParse(json)
  return result.success
    ? { success: true, manifest: result.data }
    : { success: false, error: z.prettifyError(result.error) }
}
