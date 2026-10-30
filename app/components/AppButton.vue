<script setup lang="ts">
  withDefaults(defineProps<{
    /** Link a otro sitio o archivo; sin href ni to se renderiza un <button> */
    href?: string
    /** Ruta interna: navega con NuxtLink, sin recargar la página */
    to?: string
    variant?: 'primary' | 'secondary' | 'success'
    /** Descarga el archivo en lugar de abrirlo */
    download?: boolean
    /** Link a otro sitio: se abre en otra pestaña */
    external?: boolean
  }>(), { href: undefined, to: undefined, variant: 'primary', download: false, external: false })

  const base = 'inline-flex h-11 items-center justify-center gap-2 whitespace-nowrap rounded-ctl px-[18px] font-medium transition motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink'

  const variants = {
    primary: 'bg-btn text-on-btn shadow-cta hover:opacity-90',
    secondary: 'border border-line bg-surface text-ink shadow-soft hover:border-ink-3',
    success: 'bg-ok text-on-ok shadow-cta',
  }
</script>

<template>
  <!-- download="" descarga el archivo; true se renderizaría como download="true" y ese sería el nombre -->
  <a
    v-if="href"
    :href="href"
    :download="download ? '' : undefined"
    :target="external ? '_blank' : undefined"
    :rel="external ? 'noopener noreferrer' : undefined"
    :class="[base, variants[variant]]"
  >
    <slot />
  </a>
  <NuxtLink v-else-if="to" :to="to" :class="[base, variants[variant]]">
    <slot />
  </NuxtLink>
  <button v-else type="button" :class="[base, variants[variant]]">
    <slot />
  </button>
</template>
