export function initResourceCapture() {
  window.addEventListener(
    'error',
    e => {
      const target = e.target as HTMLElement
      if (!target || !target.tagName) return

      const tag = target.tagName.toLowerCase()
      const src =
        (target as HTMLImageElement).src ||
        (target as HTMLScriptElement).src ||
        (target as HTMLLinkElement).href

      if (!src) return

      const data = {
        type: 'resource_error',
        tagName: tag,
        src,
        timestamp: Date.now(),
      }

      console.log('data -> ', data)
    },
    true,
  )
}
