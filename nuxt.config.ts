import tailwindcss from "@tailwindcss/vite";

// URL pública del sitio: canonical, hreflang, og:url, og:image y el sitemap la necesitan absoluta.
// En Vercel sale del dominio de producción del proyecto (variable de sistema, disponible en el build),
// así los previews también apuntan a producción. NUXT_PUBLIC_I18N_BASE_URL la sobreescribe en runtime.
const productionHost = process.env.VERCEL_PROJECT_PRODUCTION_URL
const siteUrl = productionHost ? `https://${productionHost}` : 'http://localhost:3000'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/fonts', '@nuxt/icon/module', '@nuxt/eslint', '@nuxt/test-utils/module', '@nuxtjs/i18n', '@nuxtjs/color-mode'],
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  app: {
    // Fundido entre páginas; out-in: la nueva entra cuando la anterior ya salió (estilos en main.css)
    pageTransition: { name: 'page', mode: 'out-in' },
  },
  vite: {
    plugins: [tailwindcss()]
  },
  fonts: {
    families: [
      { name: 'Instrument Sans', provider: 'google', weights: [400, 500, 600] },
      { name: 'Geist Mono', provider: 'google', weights: [400, 500] },
    ],
  },
  icon: {
    serverBundle: {
      collections: ['lucide', 'simple-icons'],
    },
  },
  runtimeConfig: {
    githubToken: '',
    githubOwner: 'davecoude',
  },
  nitro: {
    // sanitize-html es CommonJS y hace require() de htmlparser2, que es solo ESM. El runtime de Vercel
    // no permite require() de ESM (ERR_REQUIRE_ESM): se empaqueta en el bundle y el bundler lo resuelve en el build
    externals: { inline: ['sanitize-html'] },
  },
  routeRules: {
    '/api/**': { isr: 3600 },
    '/sitemap.xml': { isr: 3600 },
  },
  colorMode: {
    classSuffix: '',
    preference: 'system',
    fallback: 'light',
    storageKey: 'color-mode',
  },
  i18n: {
    baseUrl: siteUrl,
    strategy: 'prefix_except_default',
    defaultLocale: 'en',
    locales: [
      { code: 'en', language: 'en-US', name: 'English', file: 'en.json' },
      { code: 'es', language: 'es-CO', name: 'Español', file: 'es.json' },
    ],
    detectBrowserLanguage: {
      useCookie: true,
      redirectOn: 'root',
    },
  },
})
