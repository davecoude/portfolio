<script setup lang="ts">
  const time = useLocalClock('America/Bogota')
</script>

<template>
  <p class="flex items-baseline gap-2 whitespace-nowrap font-medium tabular-nums">
    <span class="inline-block min-w-[10.5ch]">{{ time ?? '--:--:--' }}</span>
    <span class="hidden font-normal text-ink-2 min-[27rem]:inline">Bogotá</span>
  </p>
</template>
