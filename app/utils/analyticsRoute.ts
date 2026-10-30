/**
 * Ruta agrupada para Vercel Analytics: los parámetros se reemplazan por su nombre,
 * así /es/projects/seatme cuenta como /es/projects/[slug] (igual que la integración oficial de Nuxt).
 */
export function groupRoute(path: string, params: Record<string, string | string[]>): string {
  let route = path
  for (const [key, value] of Object.entries(params)) {
    const segment = Array.isArray(value) ? value.join('/') : value
    if (!segment) continue
    const escaped = segment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    route = route.replace(new RegExp(`/${escaped}(?=[/?#]|$)`), Array.isArray(value) ? `/[...${key}]` : `/[${key}]`)
  }
  return route
}
