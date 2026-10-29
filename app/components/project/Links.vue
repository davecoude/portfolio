<script setup lang="ts">
  const props = defineProps<{
    demo: string | null
    code: string
    /** Idioma de la interfaz del producto (no del portafolio) */
    productLanguage: 'en' | 'es' | null
  }>()

  const { locale } = useI18n()

  // Solo avisa cuando la demo está en otro idioma que el que lee el visitante
  const otherLanguage = computed(() =>
    props.productLanguage && props.productLanguage !== locale.value ? props.productLanguage : null,
  )
</script>

<template>
  <div class="flex flex-wrap items-center gap-2.5">
    <AppButton v-if="demo" :href="demo" external>
      {{ $t('project.demo') }}
      <Icon name="lucide:external-link" class="text-[18px]" />
    </AppButton>
    <AppButton :href="code" variant="secondary" external>
      <Icon name="lucide:code" class="text-[18px]" />
      {{ $t('project.code') }}
    </AppButton>
    <span
      v-if="demo && otherLanguage"
      class="inline-flex items-center rounded-full border border-line bg-surface px-2.5 py-1 text-[13px] text-ink-2"
    >
      {{ $t('project.demoIn', { language: $t(`languages.${otherLanguage}`) }) }}
    </span>
  </div>
</template>
