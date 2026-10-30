import type { NuxtApp } from '#app'

/** Claves de useFetch: la home precarga el caso de estudio con la misma clave que usa su página */
export const projectsKey = (locale: string) => `projects-${locale}`
export const projectKey = (locale: string, slug: string) => `project-${locale}-${slug}`

/**
 * Reutiliza lo que ya se cargó en esta visita (SSR o precarga) en vez de volver a pedirlo al navegar:
 * ir y volver entre la home y el caso de estudio no espera a la red.
 * Al ser un getCachedData propio, Nuxt tampoco borra esos datos al desmontar la página.
 */
export function reuseLoadedData(key: string, nuxtApp: NuxtApp) {
  return nuxtApp.payload.data[key] ?? nuxtApp.static.data[key]
}
