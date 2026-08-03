type MonitorEvent = Record<string, any>

interface TransportConfig {
  /** 上报地址 */
  serverUrl: string
  /** 批量大小 */
  batchSize?: number
  /** 定时上报间隔（ms） */
  flushInterval?: number
  /** 最大重试次数 */
  maxRetry?: number
  /** 采样率 0~1 */
  sampleRate?: number
  /** 是否使用 sendBeacon */
  useBeacon?: boolean
}

interface Transport {
  push(event: MonitorEvent): void
  flush(): Promise<void>
  destroy(): void
}

export class TransportImpl implements Transport {
  private queue: MonitorEvent[] = []
  private timer: ReturnType<typeof setInterval> | null = null
  private retryCount = 0

  private readonly config: Required<TransportConfig>

  constructor(config: TransportConfig) {
    this.config = {
      batchSize: 5,
      flushInterval: 5000,
      maxRetry: 3,
      sampleRate: 1,
      useBeacon: true,
      ...config,
    }

    this.startTimer()
    console.log('t', this.timer)
  }

  push(event: MonitorEvent): void {
    if (Math.random() > this.config.sampleRate) return

    this.queue.push(this.normalize(event))

    if (this.queue.length >= this.config.batchSize) {
      this.flush().catch(() => {})
    }
  }
  async flush(): Promise<void> {
    if (this.queue.length === 0) return

    const events = this.queue.splice(0, this.queue.length)
    this.retryCount = 0

    try {
      await this.send(events)
    } catch (error) {
      this.queue.unshift(...events)

      if (this.retryCount < this.config.maxRetry) {
        this.retryCount++
        setTimeout(() => {
          this.flush()
        }, 1000 * this.retryCount)
      }
    }
  }
  destroy(): void {
    throw new Error('Method not implemented.')
  }

  private async send(events: MonitorEvent[]): Promise<void> {
    const body = JSON.stringify(events)

    if (this.config.useBeacon && navigator.sendBeacon) {
      const success = navigator.sendBeacon(this.config.serverUrl, body)
      if (success) return
    }

    await fetch(this.config.serverUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
      keepalive: true,
    })
  }

  private startTimer(): void {
    this.timer = setInterval(() => {
      this.flush().catch(() => {})
    }, this.config.flushInterval)
  }

  private normalize(event: MonitorEvent): MonitorEvent {
    return {
      ...event,
      timestamp: event?.timestamp ?? Date.now(),
      pageUrl: event?.pageUrl ?? window.location.href,
      userAgent: event?.userAgent ?? navigator.userAgent,
      sdkVersion: '0.1.0',
    }
  }
}
