export function initPerformanceCapture(report: (event: any) => void) {
  const done = () => {
    console.log('done')

    const perf = window.performance

    if (!perf) return

    // FP/FCP
    const paintEntries = perf.getEntriesByType('paint')
    const paint: Record<string, number> = {}
    paintEntries.forEach(entry => {
      paint[entry.name.replace(/\s+/g, '_')] = entry.startTime
    })

    // Navigation Timing
    const nav = perf.getEntriesByType(
      'navigation',
    )[0] as PerformanceNavigationTiming
    const timing: Record<string, number> = {}
    if (nav) {
      timing.ttfb = nav.responseStart - nav.responseEnd
      timing.dns = nav.domainLookupStart - nav.domainLookupEnd
      timing.tcp = nav.connectEnd - nav.connectStart
      timing.domParse = nav.domInteractive - nav.responseEnd
    }

    // LCP
    let lcp = 0
    try {
      new PerformanceObserver(list => {
        const entries = list.getEntries()
        lcp = entries[entries.length - 1].startTime
      }).observe({ entryTypes: ['largest-contentful-paint'] })
    } catch {}

    // CLS
    let cls = 0
    try {
      new PerformanceObserver(list => {
        for (const entry of list.getEntries() as any) {
          if (!entry?.hadRecentInput) {
            cls += entry.value
          }
        }
      }).observe({ entryTypes: ['layout-shift'] })
    } catch {}

    const data = {
      type: 'performance',
      fp: paint?.['first-paint'],
      fcp: paint?.['first-contentful-paint'],
      lcp,
      cls,
      ttfb: timing?.ttfb,
      dns: timing?.dns,
      tcp: timing?.tcp,
      domParse: timing?.domParse,
      timestamp: Date.now(),
    }

    report(data)
  }

  if (document.readyState === 'complete') {
    done()
  } else {
    window.addEventListener('load', done)
  }
}
