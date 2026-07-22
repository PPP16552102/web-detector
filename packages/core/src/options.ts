import { IInitOptions } from '.'

export class Options {
  dsn = '' // 监控上报接口的地址
  throttleDelayTime = 0 // click事件的节流时长
  overTime = 10 // 接口超时时长
  whiteBoxElements: string[] = ['html', 'body', '#app', '#root'] // // 白屏检测的容器列表
  silentWhiteScreen = false // 是否开启白屏检测
  skeletonProject = false // 项目是否有骨架屏
  filterXhrUrlRegExp: any // 过滤的接口请求正则
  handleHttpStatus: any // 处理接口返回的 response
  repeatCodeError = false // 是否去除重复的代码错误，重复的错误只上报一次

  constructor() {}
}

const options = null

export function handleOptions(paramOptions: IInitOptions): void {}

export { options }
