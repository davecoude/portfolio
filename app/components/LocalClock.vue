<script setup lang="ts">
  const time = useLocalClock('America/Bogota')
</script>

<template>
  <p class="flex items-baseline gap-2 whitespace-nowrap font-medium tabular-nums">
    <span class="inline-block min-w-[10.5ch]">{{ time ?? '--:--:--' }}</span>
    <span class="font-normal text-ink-2">Bogotá</span>
  </p>
</template>