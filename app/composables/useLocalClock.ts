export function useLocalClock(timeZone: string, locale = 'en-US') {
  const time = ref<string | null>(null)
  const formatter = new Intl.DateTimeFormat(locale, {
    timeZone,
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
  })

  let timer: ReturnType<typeof setInterval> | undefined

  onMounted(() => {
    const tick = () => {
      time.value = formatter.format(new Date())
    }

    tick()
    timer = setInterval(tick, 1000)
  })

  onBeforeUnmount(() => clearInterval(timer))

  return readonly(time)
}