<template>
  <div class="px-4 py-5">
    <div class="mx-auto flex w-full max-w-[760px] flex-col gap-3">
      <AppNavbar />
      <main class="flex flex-col gap-3">
        <slot />
      </main>
    </div>
  </div>
</template>