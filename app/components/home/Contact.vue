<script setup lang="ts">
  import { profileLinks } from '../../data/profile'

  const [ emailUser, emailDomain ] = profileLinks.email.split('@')
  const { copied, copy } = useCopyToClipboard()
  const emailText = useTemplateRef<HTMLElement>('email')

  async function copyEmail() {
    const ok = await copy(profileLinks.email)
    // Si el navegador bloquea el portapapeles, dejamos el email seleccionado para copiarlo a mano
    if (!ok && emailText.value) {
      const range = document.createRange()
      range.selectNodeContents(emailText.value)
      const selection = getSelection()
      selection?.removeAllRanges()
      selection?.addRange(range)
    }
  }
</script>

<template>
  <section id="contact" aria-labelledby="contact-title" class="flex flex-col gap-6 rounded-tray bg-tray p-7">
    <div class="flex flex-col gap-1">
      <h2 id="contact-title" class="text-[20px] tracking-tight">{{ $t('contact.title') }}</h2>
      <p class="text-[14px] text-ink-2">{{ $t('contact.subtitle') }}</p>
    </div>

    <div class="flex flex-wrap items-center justify-between gap-3 rounded-surface border border-line bg-surface py-3.5 pl-[18px] pr-3.5">
      <span ref="email" class="min-w-0 select-all text-[clamp(18px,2.4vw,22px)] tracking-tight [overflow-wrap:anywhere]">
        {{ emailUser }}<wbr>@{{ emailDomain }}
      </span>
      <AppButton :variant="copied ? 'success' : 'primary'" @click="copyEmail">
        <Icon :name="copied ? 'lucide:check' : 'lucide:copy'" class="text-[18px]" />
        <!-- aria-live: el lector de pantalla anuncia "Copiado" sin mover el foco -->
        <span aria-live="polite">{{ copied ? $t('contact.copied') : $t('contact.copy') }}</span>
      </AppButton>
    </div>

    <div class="flex flex-wrap gap-2.5">
      <AppButton :href="profileLinks.linkedin" variant="secondary" external>
        <Icon name="lucide:linkedin" class="text-[18px]" />
        LinkedIn
      </AppButton>
      <AppButton :href="profileLinks.github" variant="secondary" external>
        <Icon name="lucide:github" class="text-[18px]" />
        GitHub
      </AppButton>
    </div>
  </section>
</template>
