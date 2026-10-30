// GET /robots.txt → todo indexable, con la URL absoluta del sitemap (por eso no es un archivo estático en public/)
export default defineEventHandler((event) => {
  const { baseUrl } = useRuntimeConfig(event).public.i18n
  setHeader(event, 'Content-Type', 'text/plain; charset=utf-8')
  return ['User-agent: *', 'Allow: /', '', `Sitemap: ${String(baseUrl).replace(/\/$/, '')}/sitemap.xml`, ''].join('\n')
})
