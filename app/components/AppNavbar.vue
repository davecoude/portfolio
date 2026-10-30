<script setup lang="ts">

import { profileLinks } from '../data/profile'

const links = [
  { key: 'nav.about', id: 'about' },
  { key: 'nav.work', id: 'work' },
  { key: 'nav.experience', id: 'experience' },
  { key: 'nav.contact', id: 'contact' },
] as const

// Llevan a las secciones de la home sin dejar el #hash en la URL (también desde el caso de estudio)
const { sectionHref, goToSection } = useSectionNav()

const { locale } = useI18n()
const switchLocalePath = useSwitchLocalePath()
const targetLocale = computed(() => (locale.value === 'en' ? 'es' : 'en'))
// Sin el #hash: el servidor nunca lo recibe, y con él el link no coincidiría al hidratar
const switchLocaleHref = computed(() => switchLocalePath(targetLocale.value).split('#')[0])
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
        :key="link.id"
        :href="sectionHref(link.id)"
        class="whitespace-nowrap rounded-ctl py-2 transition-colors hover:text-ink-2 nav:px-1.5"
        @click.prevent="goToSection(link.id)"
      >
        {{ $t(link.key) }}
      </a>
    </nav>

    <div class="flex justify-self-end gap-2 [grid-area:icons]">
      <!-- El nombre accesible empieza con el texto visible ("ES · Ver en español"): quien navega por voz dice lo que ve (WCAG 2.5.3) -->
      <IconButton
        :to="switchLocaleHref"
        :label="`${targetLocale.toUpperCase()} · ${$t('nav.switchLocale')}`"
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
        <span class="flex dark:hidden"><Icon name="lucide:moon" class="text-[18px]" /></span>
        <span class="hidden dark:flex"><Icon name="lucide:sun" class="text-[18px]" /></span>
      </IconButton>
      <IconButton label="GitHub" :href="profileLinks.github">
        <Icon name="lucide:github" class="text-[18px]" />
      </IconButton>
      <IconButton label="LinkedIn" :href="profileLinks.linkedin">
        <Icon name="lucide:linkedin" class="text-[18px]" />
      </IconButton>
    </div>
  </header>
</template>
