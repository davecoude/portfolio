<script setup lang="ts">
  defineProps<{
    label: string
    href?: string
  }>()

  const base = 'inline-flex size-[38px] items-center justify-center rounded-[10px] border border-line bg-surface text-[13px] font-semibold text-ink shadow-soft transition-colors hover:border-ink-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink'
</script>

<template>
  <a
    v-if="href"
    :href="href"
    :aria-label="label"
    :class="base"
    target="_blank"
    rel="noopener noreferrer"
  >
    <slot />
  </a>
  <button v-else type="button" :aria-label="label" :class="base">
    <slot />
  </button>
</template>