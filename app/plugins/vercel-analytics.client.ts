/**
 * Vercel Web Analytics: solo page views (el plan Hobby no incluye eventos personalizados).
 * Hace lo mismo que la integración oficial @vercel/analytics/nuxt (carga el script de Vercel y envía un
 * pageview al cargar y en cada navegación, con la ruta agrupada), sin el paquete: su versión estable
 * exige vue-router 4 y Nuxt 4 usa la 5.
 * Solo en deployments de Vercel: en local el script no existe (/_vercel/insights/script.js daría 404).
 */
type VercelAnalyticsQueue = (...args: unknown[]) => void

declare global {
  interface Window {
    va?: VercelAnalyticsQueue
    vaq?: unknown[][]
  }
}

export default defineNuxtPlugin(() => {
  if (!useRuntimeConfig().public.vercelAnalytics) return

  // Cola: los pageviews que ocurren antes de que cargue el script se envían cuando llega
  window.va ??= (...args) => { (window.vaq ??= []).push(args) }

  const router = useRouter()
  const pageview = ({ path, params }: { path: string, params: Record<string, string | string[]> }) => {
    window.va?.('pageview', { route: groupRoute(path, params), path })
  }

  onNuxtReady(() => {
    const script = document.createElement('script')
    script.src = '/_vercel/insights/script.js'
    script.defer = true
    // El tracking automático se desactiva: los pageviews los envía este plugin, con la ruta agrupada
    script.dataset.disableAutoTrack = '1'
    document.head.appendChild(script)
    pageview(router.currentRoute.value)
    // failure: navegación cancelada o abortada (p. ej. por middleware/serialize-navigation): no hubo visita
    router.afterEach((to, from, failure) => {
      if (!failure && to.path !== from.path) pageview(to)
    })
  })
})
