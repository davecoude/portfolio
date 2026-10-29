/**
 * Copia texto al portapapeles y deja `copied` en true durante `resetAfter` ms.
 * Cada copia reinicia el temporizador. Devuelve false si el navegador no permitió copiar.
 */
export function useCopyToClipboard(resetAfter = 2000) {
  const copied = ref(false)
  let timer: ReturnType<typeof setTimeout> | undefined

  async function copy(text: string): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(text)
    }
    catch {
      // Sin permiso o sin API (por ejemplo, http fuera de localhost)
      return false
    }
    copied.value = true
    clearTimeout(timer)
    timer = setTimeout(() => {
      copied.value = false
    }, resetAfter)
    return true
  }

  onBeforeUnmount(() => clearTimeout(timer))

  return { copied: readonly(copied), copy }
}
