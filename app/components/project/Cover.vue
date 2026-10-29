<script setup lang="ts">
  defineProps<{
    src: string
    title: string
    /** La cover del caso de estudio está arriba del todo: se carga de inmediato */
    eager?: boolean
  }>()
</script>

<template>
  <!-- width/height reservan el espacio 16:9 antes de que llegue la imagen (sin saltos de layout) -->
  <img
    :src="src"
    :alt="$t('project.coverAlt', { title })"
    width="1600"
    height="900"
    :loading="eager ? 'eager' : 'lazy'"
    decoding="async"
    class="aspect-video h-auto w-full rounded-surface border border-line bg-surface object-cover"
  >
</template>
