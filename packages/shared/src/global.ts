import { isWindow } from './general'

export const isBrowserEnv = isWindow(typeof window !== 'undefined' ? window : 0)

export function getGlobal(): Window {
  return window as unknown as Window
}

export function getGlobalSupport() {}

const _global = getGlobal()
const _support = {}

export { _global, _support }
