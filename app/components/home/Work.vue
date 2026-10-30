<script setup lang="ts">
  const { locale } = useI18n()
  const localePath = useLocalePath()
  // Fijo por instancia: cambiar de idioma es otra ruta (/ → /es) y Nuxt monta otra home.
  // Reactivo, la home que sale cambiaría de idioma a mitad del fundido
  const lang = locale.value

  // En el servidor: el proyecto es el contenido principal y debe estar en el HTML (SEO, sin parpadeo)
  const { data: projects } = await useFetch(`/api/${lang}/projects`, {
    key: projectsKey(lang),
    getCachedData: reuseLoadedData,
    default: () => [],
  })
  const project = computed(() => projects.value.find(item => item.featured) ?? null)

  // Precarga el caso de estudio en segundo plano: al abrirlo, la página cambia sin esperar a la red.
  // Se guarda en el payload con la misma clave que usa su página (ver utils/projectData.ts)
  const nuxtApp = useNuxtApp()
  async function prefetchCaseStudy() {
    const current = project.value
    if (!current?.hasCaseStudy) return
    const key = projectKey(lang, current.slug)
    if (nuxtApp.payload.data[key]) return
    try {
      nuxtApp.payload.data[key] = await $fetch(`/api/${lang}/projects/${current.slug}`)
    }
    catch {
      // Sin precarga no pasa nada: la página del caso de estudio lo pide al abrirse
    }
  }
  onMounted(prefetchCaseStudy)

  // El mismo "ahora" en servidor y cliente: el texto relativo no cambia al hidratar
  const now = useState('render-now', () => Date.now())
  const pushedAgo = computed(() =>
    project.value ? formatRelativeTime(new Date(project.value.pushedAt), lang, new Date(now.value)) : '',
  )
</script>

<template>
  <!-- Si GitHub falla y no hay versión en caché, la sección no se muestra y el resto de la página sigue -->
  <section
    v-if="project"
    id="work"
    aria-labelledby="work-title"
    class="flex flex-col gap-6 rounded-tray bg-tray p-7"
  >
    <div class="flex flex-col gap-3">
      <p class="flex flex-wrap gap-x-4 gap-y-1 text-[14px] text-ink-2">
        <span>{{ $t('work.label') }}</span>
        <span>{{ $t('work.lastPush', { ago: pushedAgo }) }}</span>
      </p>
      <h2 id="work-title" class="text-[clamp(30px,4vw,44px)] leading-[1.1] tracking-tight">
        {{ project.title }}
      </h2>
      <p class="max-w-[60ch] text-[17px] text-ink-2">{{ project.summary }}</p>
    </div>

    <ProjectLinks
      :demo="project.links.demo"
      :code="project.links.code"
      :product-language="project.productLanguage"
    />

    <ProjectCover v-if="project.cover" :src="project.cover" :title="project.title" />

    <div class="grid gap-2.5 sm:grid-cols-2">
      <div v-if="project.highlights.length" class="flex flex-col gap-2 rounded-surface border border-line bg-surface p-5">
        <h3 class="text-[14px] font-medium text-ink-2">{{ $t('work.built') }}</h3>
        <ul class="flex list-disc flex-col gap-1.5 pl-5 text-[15px] marker:text-ink-3">
          <li v-for="item in project.highlights" :key="item">{{ item }}</li>
        </ul>
      </div>
      <div v-if="project.stack.length" class="flex flex-col gap-3 rounded-surface border border-line bg-surface p-5">
        <h3 class="text-[14px] font-medium text-ink-2">{{ $t('work.stack') }}</h3>
        <ul class="flex flex-wrap gap-1.5">
          <li
            v-for="tech in project.stack"
            :key="tech"
            class="rounded-full border border-line bg-page px-2.5 py-1 text-[13px] text-ink-2"
          >
            {{ tech }}
          </li>
        </ul>
      </div>
    </div>

    <!-- hasCaseStudy es por idioma: si no hay caso de estudio en este idioma, no se ofrece el link -->
    <AppButton
      v-if="project.hasCaseStudy"
      :to="localePath(`/projects/${project.slug}`)"
      variant="secondary"
      class="self-start"
    >
      {{ $t('work.caseStudy') }}
      <Icon name="lucide:arrow-right" class="text-[18px]" />
    </AppButton>
  </section>
</template>
