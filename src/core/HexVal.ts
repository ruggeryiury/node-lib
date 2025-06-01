export type HexLikeValues = string | number

export interface HexValueProcessorOptions {
  /**
   * Whether to include the "0x" prefix. Default is `true`.
   */
  prefix?: boolean
  /**
   * Whether to return the hex in uppercase. Default is `false`.
   */
  uppercase?: boolean
}

export class HexVal {
  /**
   * Checks if a string contains only valid hexadecimal characters (0-9, A-F).
   * - - - -
   * @param {string} str The string to check.
   * @returns {boolean} Returns `true` if the string is a valid hex string, `false` otherwise.
   */
  static isHexString(str: string): boolean {
    return typeof str === 'string' && /^(0x)?[0-9a-fA-F]+$/.test(str)
  }
  static processHex(hexVal: HexLikeValues, options?: HexValueProcessorOptions): string {
    switch (typeof hexVal) {
      case 'number': {
        if (!Number.isInteger(hexVal) || hexVal < 0) throw new TypeError('Input must be a non-negative integer')
        let hex = hexVal.toString(16)
        if (hex.length % 2 !== 0) hex = `0${hex}`
        const formatted = options?.uppercase ? hex.toUpperCase() : hex
        return (options?.prefix ?? true) ? `0x${formatted}` : formatted
      }
      case 'string': {
        if (!this.isHexString(hexVal)) throw new Error(`Provided hex string to process "${hexVal}" is not a valid hex string.`)
        let hex = hexVal.trim().toLowerCase().replace(/^0x/, '')

        if (hex.length % 2 !== 0) hex = `0${hex}`
        const formatted = options?.uppercase ? hex.toUpperCase() : hex
        return (options?.prefix ?? true) ? `0x${formatted}` : formatted
      }
      default:
        throw new TypeError(`Invalid hexVal argument type. Only strings and number variables are accepted. Given type of ${typeof hexVal}.`)
    }
  }

  static toNumber(hexVal: HexLikeValues): number {
    switch (typeof hexVal) {
      case 'number':
        return hexVal
      case 'string': {
        if (!this.isHexString(hexVal)) throw new Error(`Provided hex string to process "${hexVal}" is not a valid hex string.`)
        const hex = hexVal.trim().toLowerCase().replace(/^0x/, '')
        return parseInt(`0x${hex}`, 16)
      }
      default:
        throw new TypeError(`Invalid hexVal argument type. Only strings and number variables are accepted. Given type of ${typeof hexVal}.`)
    }
  }
}
