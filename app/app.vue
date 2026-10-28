<script setup lang="ts">
const localeHead = useLocaleHead()

useHead(() => ({
  htmlAttrs: { lang: localeHead.value.htmlAttrs.lang }
}))
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
