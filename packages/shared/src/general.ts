export const objectToString: typeof Object.prototype.toString =
  Object.prototype.toString

export const toTypeString = (value: unknown): string =>
  objectToString.call(value)

export const isNumber = (val: unknown): val is number => typeof val === 'number'

export const isString = (val: unknown): val is string => typeof val === 'string'

export const isBoolean = (val: unknown): val is boolean =>
  typeof val === 'boolean'

export const isNull = (val: unknown): val is null =>
  toTypeString(val) === '[object Null]'

export const isUndefined = (val: unknown): val is undefined =>
  typeof val === 'undefined'

export const isSymbol = (val: unknown): val is symbol => typeof val === 'symbol'

export const isFunction = (val: unknown): val is Function =>
  typeof val === 'function'

export const isObject = (val: unknown): val is Record<any, any> =>
  val !== null && typeof val === 'object'

export const isArray: typeof Array.isArray = Array.isArray

export const isProcess = (val: unknown): val is null =>
  toTypeString(val) === '[object process]'

export const isWindow = (val: unknown): val is null =>
  toTypeString(val) === '[object Window]'

export const isError = (val: unknown): val is Error => {
  switch (toTypeString(val)) {
    case '[object Error]':
      return true
    case '[object Exception]':
      return true
    case '[object DOMException]':
      return true
    default:
      return false
  }
}

export const isEmptyObject = (val: unknown) =>
  isObject(val) && Object.keys(val).length === 0

export const isEmpty = (val: unknown) =>
  (isString(val) && val.trim() === '') || isUndefined(val) || isNull(val)

const hasOwnProperty = Object.prototype.hasOwnProperty

export const hasOwn = (
  val: object,
  key: string | symbol,
): key is keyof typeof val => hasOwnProperty.call(val, key)
