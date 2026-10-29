<script setup lang="ts">
    const cvHref = useCvHref()
</script>

<template>
  <section class="flex flex-col gap-6 rounded-surface border border-line bg-surface p-7">
    <!-- flex-wrap: si no caben en una fila, la disponibilidad baja debajo de la identidad en vez de taparla -->
    <div class="flex flex-wrap items-start justify-between gap-3">
      <div class="flex items-center gap-4">
        <img
          src="/images/profile-picture.webp"
          :alt="$t('hero.photoAlt')"
          width="72"
          height="72"
          class="size-[72px] shrink-0 rounded-full border border-line object-cover"
        >
        <div>
          <p class="text-[17px] font-medium">Diego Vanegas</p>
          <p class="text-ink-2">{{ $t('hero.role') }}</p>
        </div>
      </div>
      <p class="inline-flex items-center gap-2 rounded-full bg-ok-bg px-3 py-1.5 text-[13px] font-medium text-ok">
        <span class="size-[7px] rounded-full bg-current" aria-hidden="true" />
        {{ $t('hero.status') }}
      </p>
    </div>

    <h1 class="max-w-[22ch] text-[clamp(28px,4.2vw,40px)] leading-[1.15] tracking-tight text-balance">
      {{ $t('hero.headline') }}
    </h1>
    <p class="max-w-[56ch] text-[17px] text-ink-2">
      {{ $t('hero.lede') }}
    </p>

    <div class="flex flex-wrap gap-2.5">
      <AppButton href="#work">
        {{ $t('hero.ctaProject') }}
      </AppButton>
      <AppButton :href="cvHref" variant="secondary" download>
        <Icon name="lucide:download" class="text-[18px]" />
        {{ $t('hero.ctaCv') }}
      </AppButton>
    </div>
    <HomeActivity />
  </section>
</template>
