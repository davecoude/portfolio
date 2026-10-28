<script setup lang="ts">
const links = [
  { key: 'nav.about', href: '#about' },
  { key: 'nav.work', href: '#work' },
  { key: 'nav.experience', href: '#experience' },
  { key: 'nav.contact', href: '#contact' },
] as const

const { locale } = useI18n()
const switchLocalePath = useSwitchLocalePath()
const targetLocale = computed(() => (locale.value === 'en' ? 'es' : 'en'))
const colorMode = useColorMode()

function toggleTheme() {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

</script>

<template>
  <header
    class="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-2.5 nav:gap-x-3 rounded-[20px] bg-tray p-2.5 [grid-template-areas:'clock_icons'_'nav_nav'] nav:grid-cols-[1fr_auto_1fr] nav:pl-5 nav:[grid-template-areas:'clock_nav_icons']"
  >
    <LocalClock class="[grid-area:clock]" />

    <nav :aria-label="$t('nav.label')" class="flex justify-between gap-1 text-[15px] font-medium [grid-area:nav] nav:justify-center">
      <a
        v-for="link in links"
        :key="link.href"
        :href="link.href"
        class="whitespace-nowrap rounded-ctl py-2 transition-colors hover:text-ink-2 nav:px-1.5"
      >
        {{ $t(link.key) }}
      </a>
    </nav>

    <div class="flex justify-self-end gap-2 [grid-area:icons]">
      <IconButton
        :to="switchLocalePath(targetLocale)"
        :label="$t('nav.switchLocale')"
        :lang="targetLocale"
        :hreflang="targetLocale"
      >
        {{ targetLocale.toUpperCase() }}
      </IconButton>
      <IconButton :label="$t('nav.switchTheme')" @click="toggleTheme">
        <!--
          El servidor no conoce el tema: los íconos se alternan por CSS para evitar un desajuste de hidratación.
          Van envueltos en <span> porque @nuxt/icon fija display en .iconify fuera de @layer y le gana a hidden.
        -->
        <span class="flex dark:hidden"><Icon name="lucide:moon" class="size-[18px]" /></span>
        <span class="hidden dark:flex"><Icon name="lucide:sun" class="size-[18px]" /></span>
      </IconButton>
      <IconButton label="GitHub" href="https://github.com/davecoude">
        <Icon name="lucide:github" class="size-[18px]" />
      </IconButton>
      <IconButton label="LinkedIn" href="https://www.linkedin.com/in/davanegas/">
        <Icon name="lucide:linkedin" class="size-[18px]" />
      </IconButton>
    </div>
  </header>
</template>
