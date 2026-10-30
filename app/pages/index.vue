<script setup lang="ts">
  const { t } = useI18n()

  useSeoMeta({
    title: () => t('seo.home.title'),
    description: () => t('seo.home.description'),
    ogTitle: () => t('seo.home.title'),
    ogDescription: () => t('seo.home.description'),
  })
</script>

<template>
  <div class="flex flex-col gap-3">
    <!-- Caja real, no display: contents: la transición de página anima su opacidad -->
    <HomeHero />
    <HomeAbout />
    <HomeWork />
    <HomeExperience />
    <HomeContact />
  </div>
</template>
