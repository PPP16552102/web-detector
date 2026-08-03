export function initFetchCapture() {
  const originalFetch = window.fetch

  window.fetch = async function (input, init) {
    const start = Date.now()
    const url =
      typeof input === 'string'
        ? input
        : input instanceof URL
          ? input.href
          : input.url
    const method = init?.method || 'GET'

    let reqBody: string | undefined
    if (init?.body) {
      reqBody =
        typeof init.body === 'string' ? init.body.slice(0, 2000) : '[binary]'
    }

    try {
      const response = await originalFetch(input, init)
      const duration = Date.now() - start

      if (!response.ok) {
        let resBody: string | undefined
        try {
          resBody = await response.clone().text()
        } catch {}

        const data = {
          type: 'fetch',
          method,
          url,
          status: response.status,
          duration,
          reqBody,
          resBody: resBody?.slice(0, 2000),
          timestamp: Date.now(),
        }

        console.log('data -> ', data)
      }

      return response
    } catch (err: any) {
      const data = {
        type: 'fetch',
        method,
        url,
        status: 0,
        duration: Date.now() - start,
        reqBody,
        errorMessage: err?.message,
        timestamp: Date.now(),
      }

      console.log('data -> ', data)
      throw err
    }
  }
}
