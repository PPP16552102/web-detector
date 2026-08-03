export function initXHRCapture() {
  console.log('init xhr')

  const originalOpen = XMLHttpRequest.prototype.open
  const originalSend = XMLHttpRequest.prototype.send
  const originalSetHeader = XMLHttpRequest.prototype.setRequestHeader

  XMLHttpRequest.prototype.open = function (
    method: string,
    url: string | URL,
    async: boolean = true,
    username?: string | null,
    password?: string | null,
  ) {
    ;(this as any)._monitorXHRInfo = {
      method: method.toUpperCase(),
      url: typeof url === 'string' ? url : url.href,
      startTime: Date.now(),
      headers: {} as Record<string, string>,
    }

    console.log('open re -> ', (this as any)._monitorXHRInfo)

    return originalOpen.call(this, method, url, async, username, password)
  }

  XMLHttpRequest.prototype.setRequestHeader = function (
    name: string,
    value: string,
  ) {
    const monitorInfo = (this as any)._monitorXHRInfo

    if (monitorInfo) {
      monitorInfo.headers[name.toUpperCase()] = value
    }

    return originalSetHeader.call(this, name, value)
  }

  XMLHttpRequest.prototype.send = function (
    body?: Document | XMLHttpRequestBodyInit | null,
  ) {
    const monitorInfo = (this as any)._monitorXHRInfo

    if (!monitorInfo) {
      return originalSend.call(this, body)
    }

    console.log('body -> ', body)

    if (body) {
      monitorInfo.reqBody =
        typeof body === 'string' ? body.slice(0, 2000) : '[binary or document]'
    }

    this.addEventListener('loadend', function (this: XMLHttpRequest) {
      const duration = Date.now() - monitorInfo.startTime

      const reportData = {
        type: 'xhr',
        method: monitorInfo?.method,
        url: monitorInfo?.url,
        status: this.status,
        duration,
        reqHeaders: monitorInfo?.headers,
        reqBody: monitorInfo?.reqBody,
        resBody: this.responseText?.slice(0, 2000),
        timestamp: Date.now(),
      }

      console.log('report data -> ', reportData)
    })

    return originalSend.call(this, body)
  }
}
