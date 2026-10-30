<script setup lang="ts">
  const route = useRoute('projects-slug')
  const { locale } = useI18n()
  const { sectionHref, goToSection } = useSectionNav()

  // Valores fijos de esta instancia: cada idioma y cada slug es otra ruta, y Nuxt monta otra página.
  // Si fueran reactivos, al salir la ruta cambia, se pediría otro proyecto y la página se vaciaría a mitad del fundido
  const lang = locale.value
  const slug = String(route.params.slug)

  // Si la home ya lo precargó, se usa sin esperar a la red
  const { data: project, error } = await useFetch(`/api/${lang}/projects/${slug}`, {
    key: projectKey(lang, slug),
    getCachedData: reuseLoadedData,
  })

  // 404 si el slug no existe o no hay caso de estudio en este idioma; cualquier otro fallo, error del servidor.
  // fatal: se muestra la página de error también al navegar en el cliente, no solo en SSR
  if (!project.value) {
    const notFound = !error.value || error.value.statusCode === 404
    throw createError({
      statusCode: notFound ? 404 : 502,
      statusMessage: notFound ? 'Project not found' : 'Projects unavailable',
      fatal: true,
    })
  }

  useHead({ title: () => (project.value ? `${project.value.title} · Diego Vanegas` : 'Diego Vanegas') })
</script>

<template>
  <div v-if="project" class="flex flex-col gap-3">
    <section aria-labelledby="case-title" class="flex flex-col gap-6 rounded-tray bg-tray p-7">
      <a
        :href="sectionHref('work')"
        class="inline-flex items-center gap-1.5 self-start rounded-sm text-[14px] text-ink-2 transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
        @click.prevent="goToSection('work')"
      >
        <Icon name="lucide:arrow-left" class="text-[16px]" />
        {{ $t('caseStudy.back') }}
      </a>

      <div class="flex flex-col gap-3">
        <p class="flex flex-wrap gap-x-4 gap-y-1 text-[14px] text-ink-2">
          <span>{{ $t('caseStudy.label') }}</span>
          <span v-if="project.role">{{ project.role }}</span>
        </p>
        <h1 id="case-title" class="text-[clamp(30px,4vw,44px)] leading-[1.1] tracking-tight">
          {{ project.title }}
        </h1>
        <p class="max-w-[60ch] text-[17px] text-ink-2">{{ project.summary }}</p>
      </div>

      <ProjectLinks
        :demo="project.links.demo"
        :code="project.links.code"
        :product-language="project.productLanguage"
      />

      <ProjectCover v-if="project.cover" :src="project.cover" :title="project.title" eager />
    </section>

    <!-- Misma bandeja y padding (p-7) que el resto de secciones, para que los márgenes coincidan -->
    <!-- HTML ya sanitizado en el servidor (server/markdown/render-case-study.ts): seguro para v-html -->
    <!-- eslint-disable-next-line vue/no-v-html -->
    <article class="case-study rounded-tray bg-tray p-7" v-html="project.caseStudyHtml" />
  </div>
</template>

<style scoped>
/* Tipografía del Markdown: el HTML llega por v-html, así que los estilos van con :deep() */
.case-study {
  font-size: 16px;
  line-height: 1.7;
  overflow-wrap: break-word;
}
.case-study :deep(> * + *) { margin-top: 1rem; }
.case-study :deep(h2) {
  margin-top: 2.5rem;
  font-size: 22px;
  line-height: 1.25;
  letter-spacing: -0.01em;
}
.case-study :deep(h2:first-child) { margin-top: 0; }
.case-study :deep(h3) {
  margin-top: 1.75rem;
  font-size: 17px;
  font-weight: 500;
}
.case-study :deep(:is(h2, h3) + *) { margin-top: 0.75rem; }
.case-study :deep(p),
.case-study :deep(li) { color: var(--ink-2); }
.case-study :deep(strong) { font-weight: 500; color: var(--ink); }
.case-study :deep(a) {
  color: var(--ink);
  text-decoration: underline;
  text-underline-offset: 3px;
  text-decoration-color: var(--ink-3);
}
.case-study :deep(a:hover) { text-decoration-color: currentColor; }
.case-study :deep(ul) { list-style: disc; padding-left: 1.25rem; }
.case-study :deep(ol) { list-style: decimal; padding-left: 1.25rem; }
.case-study :deep(li + li) { margin-top: 0.375rem; }
.case-study :deep(li::marker) { color: var(--ink-3); }
.case-study :deep(blockquote) {
  border-left: 2px solid var(--line);
  padding-left: 1rem;
  color: var(--ink-2);
}
.case-study :deep(code) {
  font-family: var(--font-mono);
  font-size: 0.875em;
  border-radius: 6px;
  border: 1px solid var(--line);
  background: var(--surface);
  padding: 0.0625rem 0.3125rem;
  /* Si un fragmento de código parte la línea, cada trozo conserva su fondo y padding */
  box-decoration-break: clone;
  -webkit-box-decoration-break: clone;
}
/* Los diagramas en texto (routes → service) necesitan desplazarse en móvil en vez de partirse */
.case-study :deep(pre) {
  overflow-x: auto;
  border-radius: var(--radius-ctl);
  border: 1px solid var(--line);
  background: var(--surface);
  padding: 1rem;
  font-size: 13px;
  line-height: 1.6;
}
.case-study :deep(pre code) { padding: 0; border: 0; background: none; font-size: inherit; }
.case-study :deep(img) {
  width: 100%;
  height: auto;
  border-radius: var(--radius-ctl);
  border: 1px solid var(--line);
}
</style>
