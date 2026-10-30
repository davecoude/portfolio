/**
 * Una navegación a la vez.
 * Si llega otra mientras la página anterior todavía espera sus datos, la transición out-in y Suspense
 * se pisan y <main> queda vacío (pasaba con varios clics rápidos en el botón de idioma).
 * La navegación nueva espera a que esa página termine; si mientras tanto llegó otra más nueva, esta se
 * aborta aquí, antes de que el middleware de i18n cambie el idioma: gana el último clic, sin carreras.
 * Es un middleware de archivo para correr antes que el de i18n (los agregados por módulos van después).
 */
let latest = 0

export default defineNuxtRouteMiddleware(async () => {
  if (import.meta.server) return

  const id = ++latest
  await useNuxtApp().$pageLoaded()
  if (id !== latest) return abortNavigation()
})
