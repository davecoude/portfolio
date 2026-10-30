/**
 * Expone cuándo termina de cargar la página en curso (Suspense pendiente → resuelta).
 * Lo usa middleware/serialize-navigation.global.ts para no empezar otra navegación a mitad de esa carga.
 */
const MAX_WAIT_MS = 4000

export default defineNuxtPlugin((nuxtApp) => {
  let loading: Promise<void> | null = null
  let release = () => {}

  nuxtApp.hook('page:start', () => {
    loading ??= new Promise((resolve) => { release = resolve })
  })
  nuxtApp.hook('page:finish', () => {
    release()
    loading = null
  })

  return {
    provide: {
      /** Resuelve cuando la página en curso terminó de cargar; con tope por si nunca termina (red caída) */
      pageLoaded: (): Promise<unknown> =>
        loading ? Promise.race([loading, new Promise(resolve => setTimeout(resolve, MAX_WAIT_MS))]) : Promise.resolve(),
    },
  }
})
