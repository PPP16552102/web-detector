function getXPath(el: HTMLElement): string {
  if (el.id) return `//*[@id="${el.id}"]`
  if (el === document.body) return '/html/body'

  let ix = 0
  const siblings = el.parentNode?.childNodes
  if (!siblings) return ''

  for (let i = 0; i < siblings.length; i++) {
    const sibling = siblings[i] as HTMLElement
    if (sibling === el) {
      return `${getXPath(el.parentElement!)}/${el.tagName.toLowerCase()}[${ix + 1}]`
    }

    if (sibling.nodeType === 1 && sibling.tagName === el.tagName) {
      ix++
    }
  }

  return ''
}

export function initBehaviorCapture() {
  window.addEventListener('click', e => {
    const target = e.target as HTMLElement
    if (!target) return

    const data = {
      type: 'click',
      tagName: target.tagName,
      text: target.innerText?.slice(0, 50),
      xpath: getXPath(target),
      timestamp: Date.now(),
    }

    console.log('data -> ', data)
  })

  let lastUrl = location.href

  const emitRoute = () => {
    if (location.href !== lastUrl) {
      const data = {
        type: 'route_change',
        from: lastUrl,
        to: location.href,
        timestamp: Date.now(),
      }
      console.log('data -> ', data)

      lastUrl = location.href
    }
  }

  window.addEventListener('popstate', emitRoute)

  const originalPush = history.pushState
  history.pushState = function (...args) {
    originalPush.apply(this, args)
    emitRoute()
  }
}
