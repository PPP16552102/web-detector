import { _global } from '@web-see/shared'
import { initPerformanceCapture } from '@web-see/integration'
import { Transport } from '@web-see/transport'

export interface IInitOptions {
  dsn: string // 上报地址
  apikey: string // 项目id
  disabled?: boolean // 是否禁用SDK
}

export function init(options: IInitOptions) {
  if (!options.dsn || !options.apikey) {
    return console.error(`缺少配置项: ${!options.dsn ? 'dsn' : 'apikey'}`)
  }

  if (!('fetch' in _global) || options.disabled) return

  const transport = new Transport({
    serverUrl: 'http://localhost:8081',
    batchSize: 5,
    flushInterval: 5000,
    useBeacon: true,
  })

  initPerformanceCapture(transport.push.bind(transport))
}

export function test() {
  console.log('hello')
}
