/**
 * Navegación a las secciones de la home sin dejar el #hash en la URL.
 * Con el hash, recargar la página volvía a saltar a la última sección clicada
 */
export function useSectionNav() {
  const route = useRoute()
  const localePath = useLocalePath()
  const nuxtApp = useNuxtApp()

  /** href real: funciona sin JS y al abrir en otra pestaña */
  function sectionHref(id: string) {
    return `${localePath('/')}#${id}`
  }

  function scrollToSection(id: string, smooth: boolean) {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    document.getElementById(id)?.scrollIntoView({ behavior: smooth && !reduceMotion ? 'smooth' : 'auto' })
  }

  async function goToSection(id: string) {
    const home = localePath('/')
    if (route.path === home) {
      scrollToSection(id, true)
      return
    }

    // Desde otra página: Nuxt lleva la home arriba cuando termina de renderizar (page:finish + un frame).
    // Se espera un frame más para hacer el scroll después de ese reset y no antes.
    nuxtApp.hooks.hookOnce('page:finish', () => {
      requestAnimationFrame(() => requestAnimationFrame(() => scrollToSection(id, false)))
    })
    await navigateTo(home)
  }

  return { sectionHref, goToSection }
}
