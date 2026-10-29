<script setup lang="ts">
  const cvHref = useCvHref()

  // Lo que está en curso hoy; el punto verde significa "activo ahora", igual que la disponibilidad del hero
  const current = ['learning', 'studying'] as const
</script>

<template>
  <section id="about" aria-labelledby="about-title" class="flex flex-col gap-6 rounded-tray bg-tray p-7">
    <!-- Título para lectores de pantalla y navegación por encabezados; visualmente manda el texto grande -->
    <h2 id="about-title" class="sr-only">{{ $t('about.title') }}</h2>

    <!-- La segunda frase usa ink-2: el ink-3 del prototipo no llega al contraste mínimo para texto -->
    <p class="max-w-[30ch] text-[clamp(20px,2.6vw,24px)] leading-[1.35] tracking-tight">
      {{ $t('about.intro') }}
      <span class="text-ink-2">{{ $t('about.introMore') }}</span>
    </p>

    <p class="flex items-center gap-2 text-[14px] text-ink-2">
      <Icon name="lucide:map-pin" class="text-[18px]" />
      Bogotá, Colombia (UTC−5)
    </p>

    <ul class="grid gap-2.5 sm:grid-cols-2">
      <li
        v-for="item in current"
        :key="item"
        class="flex flex-col gap-1 rounded-surface border border-line bg-surface px-[18px] py-4"
      >
        <span class="inline-flex items-center gap-2 text-[13px] font-medium text-ok">
          <span class="size-[7px] rounded-full bg-current" aria-hidden="true" />
          {{ $t(`about.${item}.label`) }}
        </span>
        <strong class="font-medium">{{ $t(`about.${item}.title`) }}</strong>
        <span class="text-[14px] text-ink-2">{{ $t(`about.${item}.text`) }}</span>
      </li>
    </ul>

    <div class="flex flex-wrap items-center justify-between gap-3 rounded-surface border border-line bg-surface py-3.5 pl-[18px] pr-3.5">
      <div class="flex min-w-0 items-center gap-3">
        <Icon name="lucide:file-text" class="text-[28px] text-ink-2" />
        <div>
          <p class="font-medium">{{ $t('about.cv.title') }}</p>
          <p class="text-[14px] text-ink-2">{{ $t('about.cv.format') }}</p>
        </div>
      </div>
      <AppButton :href="cvHref" download>
        <Icon name="lucide:download" class="text-[18px]" />
        {{ $t('about.cv.download') }}
      </AppButton>
    </div>
  </section>
</template>
