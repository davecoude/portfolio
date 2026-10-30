import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/fonts', '@nuxt/icon/module', '@nuxt/eslint', '@nuxt/test-utils/module', '@nuxtjs/i18n', '@nuxtjs/color-mode'],
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  app: {
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
  routeRules: {
    '/api/**': { isr: 3600 },
  },
  colorMode: {
    classSuffix: '',
    preference: 'system',
    fallback: 'light',
    storageKey: 'color-mode',
  },
  i18n: {
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
