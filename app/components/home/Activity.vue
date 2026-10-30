<script setup lang="ts">
  const { locale } = useI18n()

  // Solo en el cliente: la página no espera a GitHub y la respuesta sale de la caché ISR de /api/activity.
  // Al volver a la home se reutiliza la respuesta ya cargada: la tira aparece sin el placeholder
  const { data: activity, status } = useFetch('/api/activity', {
    key: 'activity',
    server: false,
    getCachedData: reuseLoadedData,
  })

  const pushedAgo = computed(() =>
    activity.value ? formatRelativeTime(new Date(activity.value.pushedAt), locale.value) : '',
  )
</script>

<template>
  <!-- Mientras carga reserva el mismo alto (h-11) para que el hero no salte; si falla o no hay datos, desaparece -->
  <div v-if="status === 'idle' || status === 'pending'" class="h-11 rounded-[14px] bg-tray" aria-hidden="true" />
  <!--
    Siempre una línea, del mismo alto que el placeholder: en móvil la etiqueta queda solo para lectores
    de pantalla y el nombre del repo se recorta con "…" si no cabe (el title muestra el nombre completo)
  -->
  <p v-else-if="activity" class="flex h-11 items-center gap-3 rounded-[14px] bg-tray px-4 text-[14px]">
    <span class="activity-dot size-2 shrink-0 rounded-full bg-ok" aria-hidden="true" />
    <span class="sr-only text-ink-2 sm:not-sr-only sm:shrink-0 sm:whitespace-nowrap">{{ $t('activity.label') }}</span>
    <a
      :href="activity.url"
      :title="activity.repo"
      target="_blank"
      rel="noopener noreferrer"
      class="min-w-0 truncate rounded-sm font-mono text-[13px] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
    >
      {{ activity.repo }}
    </a>
    <span class="shrink-0 whitespace-nowrap text-ink-2">{{ pushedAgo }}</span>
  </p>
</template>

<style scoped>
/* Anillo fijo; el pulso solo si el visitante no pidió reducir el movimiento */
.activity-dot {
  box-shadow: 0 0 0 4px var(--ok-bg);
}

@media (prefers-reduced-motion: no-preference) {
  .activity-dot {
    animation: pulse 2.4s ease-in-out infinite;
  }
}

@keyframes pulse {
  50% {
    box-shadow: 0 0 0 7px transparent;
  }
}
</style>
