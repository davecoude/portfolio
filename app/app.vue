<template>
  <main class="mx-auto flex max-w-[760px] flex-col gap-3 p-4">
    <section class="flex flex-col gap-4 rounded-tray bg-tray p-7">
      <h1 class="text-[40px] leading-tight tracking-tight">Línea gráfica</h1>
      <p class="text-ink-2">Texto secundario sobre bandeja.</p>

      <div class="flex items-center gap-3 rounded-surface border border-line bg-surface p-4">
        <Icon name="lucide:github" class="size-[18px]" />
        <code class="font-mono text-[13px]">davecoude/SeatMe</code>
      </div>

      <div class="flex flex-wrap items-center gap-2.5">
        <button class="h-11 rounded-ctl bg-btn px-[18px] font-medium text-on-btn shadow-cta">Primary</button>
        <button class="h-11 rounded-ctl border border-line bg-surface px-[18px] font-medium shadow-soft">Secondary</button>
        <span class="inline-flex items-center gap-2 rounded-full bg-ok-bg px-3 py-1.5 text-[13px] font-medium text-ok">
          <span class="size-[7px] rounded-full bg-current" />
          Open to full-time roles
        </span>
      </div>
    </section>
  </main>
</template>