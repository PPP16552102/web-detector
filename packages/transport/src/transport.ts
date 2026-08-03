type MonitorEvent = Record<string, any>

interface Transport {
  push(): void
  flush(): Promise<void>
  destroy(): void
}

export class TransportImpl implements Transport {
  private queue: MonitorEvent[] = []

  constructor() {
    console.log('q', this.queue)
  }

  push(): void {
    throw new Error('Method not implemented.')
  }
  flush(): Promise<void> {
    throw new Error('Method not implemented.')
  }
  destroy(): void {
    throw new Error('Method not implemented.')
  }
}
