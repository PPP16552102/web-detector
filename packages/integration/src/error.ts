export function initErrorCapture() {
  // 同步 JS 错误
  window.addEventListener(
    'error',
    e => {
      // 资源错误交给 resource 采集
      if (e.target && (e.target as HTMLElement).tagName) return

      const reportData = {
        type: 'js_error',
        message: e.message,
        stack: e.error?.stack,
        filename: e.filename,
        lineno: e.lineno,
        colno: e.colno,
        timestamp: Date.now(),
      }

      console.log('data -> ', reportData)
    },
    true,
  )

  // Promise 未捕获
  window.addEventListener('unhandledrejection', e => {
    const data = {
      type: 'promise_rejection',
      message: String(e.reason),
      stack: e.reason?.stack,
      timestamp: Date.now(),
    }
    console.log('data -> ', data)
  })
}
