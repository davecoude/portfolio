/** URL del CV en PDF del idioma activo; los archivos viven en public/cv/ */
export function useCvHref() {
  const { locale } = useI18n()
  return computed(() => `/cv/diego-vanegas-cv-${locale.value}.pdf`)
}
