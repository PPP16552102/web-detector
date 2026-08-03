import { _global } from '@web-see/shared'
import { initPerformanceCapture } from '@web-see/integration'

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

  console.log(initPerformanceCapture)

  initPerformanceCapture()
}

export function test() {
  console.log('hello')
}
