<script setup lang="ts">
  import { workExperiences } from '../../data/experience'

  const { t } = useI18n()

  // Meses desde i18n y no con Intl: Node y el navegador pueden abreviar distinto y causar un desajuste de hidratación
  const monthYear = (value: string) => {
    const { year, month } = parseYearMonth(value)
    return `${t(`experience.monthNames.${month}`)} ${year}`
  }

  const duration = (start: string, end: string) => {
    const { years, months } = splitMonths(monthsInclusive(start, end))
    return [
      years > 0 ? t('experience.years', years) : '',
      months > 0 ? t('experience.months', months) : '',
    ].filter(Boolean).join(' ')
  }

  const jobs = computed(() => sortByStartDesc(workExperiences).map((job) => {
    const end = job.end ?? currentYearMonth()
    return {
      ...job,
      current: job.end === null,
      startYear: parseYearMonth(job.start).year,
      range: `${monthYear(job.start)} – ${job.end ? monthYear(job.end) : t('experience.present')}`,
      duration: duration(job.start, end),
    }
  }))
</script>

<template>
  <section id="experience" aria-labelledby="experience-title" class="flex flex-col gap-6 rounded-tray bg-tray p-7">
    <div class="flex flex-col gap-1">
      <h2 id="experience-title" class="text-[20px] tracking-tight">{{ $t('experience.title') }}</h2>
      <p class="text-[14px] text-ink-2">{{ $t('experience.subtitle') }}</p>
    </div>

    <ol class="timeline relative flex flex-col gap-2.5">
      <li
        v-for="job in jobs"
        :key="job.id"
        class="relative grid grid-cols-[var(--year)_minmax(0,1fr)] gap-x-(--gap)"
        :class="{ current: job.current }"
      >
        <span class="pt-3 text-right text-[14px] tabular-nums text-ink-2">{{ job.startYear }}</span>
        <div class="flex flex-col gap-0.5 rounded-surface border border-line bg-surface px-4 py-3">
          <strong class="font-medium">{{ $t(`experience.roles.${job.id}`) }}</strong>
          <span class="text-[14px] text-ink-2">{{ job.company }}</span>
          <!-- nowrap en cada parte: si no cabe, se corta en el "·" y nunca entre un número y su unidad -->
          <span class="text-[13px] tabular-nums text-ink-2">
            <span class="whitespace-nowrap">{{ job.range }}</span> · <span class="whitespace-nowrap">{{ job.duration }}</span>
          </span>
        </div>
      </li>
    </ol>
  </section>
</template>

<style scoped>
/* Línea vertical: arranca en tinta (lo más reciente) y se desvanece hacia lo más antiguo */
.timeline {
  --year: 92px;
  --gap: 44px;
}

.timeline::before {
  content: '';
  position: absolute;
  top: 20px;
  bottom: 20px;
  left: calc(var(--year) + var(--gap) / 2 - 1px);
  width: 2px;
  border-radius: 2px;
  background: linear-gradient(var(--ink), var(--line));
}

/* Nodo de cada trabajo; en verde si es el actual */
.timeline li::before {
  content: '';
  position: absolute;
  top: 14px;
  left: calc(var(--year) + var(--gap) / 2 - 7px);
  width: 14px;
  height: 14px;
  box-sizing: border-box;
  border: 2px solid var(--ink-2);
  border-radius: 50%;
  background: var(--surface);
}

.timeline li.current::before {
  border-color: var(--ok);
  background: var(--ok);
  box-shadow: 0 0 0 4px var(--ok-bg);
}

@media (max-width: 520px) {
  .timeline {
    --year: 44px;
    --gap: 28px;
  }
}
</style>
