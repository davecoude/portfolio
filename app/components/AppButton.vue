<script setup lang="ts">
  withDefaults(defineProps<{
    href: string
    variant?: 'primary' | 'secondary'
    /** Descarga el archivo en lugar de abrirlo */
    download?: boolean
  }>(), { variant: 'primary', download: false })

  const variants = {
    primary: 'bg-btn text-on-btn shadow-cta hover:opacity-90',
    secondary: 'border border-line bg-surface text-ink shadow-soft hover:border-ink-3',
  }
</script>

<template>
  <!-- download="" descarga el archivo; true se renderizaría como download="true" y ese sería el nombre -->
  <a
    :href="href"
    :download="download ? '' : undefined"
    :class="[
      'inline-flex h-11 items-center justify-center gap-2 whitespace-nowrap rounded-ctl px-[18px] font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink',
      variants[variant],
    ]"
  >
    <slot />
  </a>
</template>
