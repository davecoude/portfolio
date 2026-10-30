<script setup lang="ts">
  import type { NuxtError } from '#app'

  const props = defineProps<{ error: NuxtError }>()

  const localePath = useLocalePath()
  const notFound = computed(() => props.error.statusCode === 404)

  // Limpia el error y vuelve al inicio en el idioma actual
  function goHome() {
    clearError({ redirect: localePath('/') })
  }
</script>

<template>
  <NuxtLayout>
    <section class="flex flex-col items-start gap-4 rounded-tray bg-tray p-7">
      <p class="font-mono text-[14px] text-ink-2">{{ error.statusCode }}</p>
      <h1 class="text-[clamp(28px,4.2vw,40px)] leading-[1.15] tracking-tight">
        {{ $t(notFound ? 'error.notFoundTitle' : 'error.title') }}
      </h1>
      <p class="max-w-[50ch] text-[17px] text-ink-2">
        {{ $t(notFound ? 'error.notFoundText' : 'error.text') }}
      </p>
      <AppButton @click="goHome">
        <Icon name="lucide:arrow-left" class="text-[18px]" />
        {{ $t('error.home') }}
      </AppButton>
    </section>
  </NuxtLayout>
</template>
