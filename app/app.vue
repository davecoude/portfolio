<script setup lang="ts">
const { locale, t } = useI18n()
const siteUrl = String(useRuntimeConfig().public.i18n.baseUrl).replace(/\/$/, '')

// lang del <html> y SEO por idioma: canonical, hreflang (en, es y x-default), og:url y og:locale.
// Las URLs salen absolutas gracias a i18n.baseUrl (nuxt.config.ts)
const localeHead = useLocaleHead()

useHead(() => ({
  htmlAttrs: { lang: localeHead.value.htmlAttrs.lang },
  link: [
    ...(localeHead.value.link ?? []),
    { rel: 'icon', href: '/favicon.ico', sizes: '48x48' },
    { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
  ],
  meta: [...(localeHead.value.meta ?? [])],
}))

// Valores por defecto para compartir (LinkedIn, Slack, WhatsApp); cada página pone su título y descripción.
// La imagen va por idioma y con URL absoluta: los scrapers no resuelven rutas relativas
useSeoMeta({
  ogSiteName: 'Diego Vanegas',
  ogType: 'website',
  ogImage: () => `${siteUrl}/og/og-${locale.value}.jpg`,
  ogImageType: 'image/jpeg',
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogImageAlt: () => t('seo.ogImageAlt'),
  twitterCard: 'summary_large_image',
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
