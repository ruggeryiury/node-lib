export type HexStringLikeValues = string | number

export interface HexStrProcessorOptions {
  /**
   * Whether to include the "0x" prefix. Default is `true`.
   */
  prefix?: boolean
  /**
   * Whether to return the hex in uppercase. Default is `false`.
   */
  uppercase?: boolean
  /**
   * Reverses the hex string. Default is `false`.
   */
  reversed?: boolean
}

export class HexStr {
  /**
   * Checks if a string contains only valid hexadecimal characters (0-9, A-F).
   * - - - -
   * @param {string} str The string to check.
   * @returns {boolean} Returns `true` if the string is a valid hex string, `false` otherwise.
   */
  static isHexString(str: string): boolean {
    return typeof str === 'string' && /^(0x)?[0-9a-fA-F]+$/.test(str)
  }
  /**
   * Reverses a hexadecimal string.
   *
   * The input hex string should be an even-length string representing bytes
   * (e.g., "1234" → ["12", "34"]). This function reverses the byte order (e.g., "1234" → "3412").
   * - - - -
   * @param {string} hex The hexadecimal string to convert. It must be an even-length string containing only valid hexadecimal characters, without the `0x` prefix.
   * @returns {string} The reversed representation of the input hex string.
   */
  static reverseHexStrs = (hex: string): string => {
    if (hex.toLowerCase().startsWith('0x')) hex = hex.slice(2)
    const match = hex.match(/.{1,2}/g)
    if (match) return match.reverse().join('')
    else throw new Error('')
  }

  /**
   * Converts a number or hex string into a standardized hexadecimal string representation.
   *
   * This method handles two types of inputs:
   * - Numbers: Must be non-negative integers. They are converted to hex, zero-padded if needed.
   * - Strings: Must be valid hexadecimal strings (with or without `0x` prefix), case-insensitive.
   *
   * The result can be formatted with optional prefix (`0x`) and uppercase letters, depending on options.
   * Hex values are normalized to even length (i.e., byte-aligned), by padding with a leading zero if needed.
   * - - - -
   * @param {HexStringLikeValues} HexStr A non-negative integer or a valid hex string to be processed.
   * @param {HexStrProcessorOptions} [options] `OPTIONAL` An object that changes the behavior of the convertion process.
   * @returns {string} A formatted hexadecimal string, normalized and optionally prefixed.
   * @throws {TypeError} If the input is neither a non-negative integer nor a valid hex string.
   * @throws {Error} If the string is not a valid hexadecimal format.
   */
  static processHex(HexStr: HexStringLikeValues, options?: HexStrProcessorOptions): string {
    switch (typeof HexStr) {
      case 'number': {
        if (!Number.isInteger(HexStr) || HexStr < 0) throw new TypeError('Input must be a non-negative integer')
        let hex = HexStr.toString(16)
        if (hex.length % 2 !== 0) hex = `0${hex}`
        if (options?.reversed) hex = this.reverseHexStrs(hex)
        const formatted = options?.uppercase ? hex.toUpperCase() : hex
        return (options?.prefix ?? true) ? `0x${formatted}` : formatted
      }
      case 'string': {
        if (!this.isHexString(HexStr)) throw new Error(`Provided hex string to process "${HexStr}" is not a valid hex string.`)
        let hex = HexStr.trim().toLowerCase().replace(/^0x/, '')
        if (hex.length % 2 !== 0) hex = `0${hex}`
        if (options?.reversed) hex = this.reverseHexStrs(hex)
        const formatted = options?.uppercase ? hex.toUpperCase() : hex
        return (options?.prefix ?? true) ? `0x${formatted}` : formatted
      }
      default:
        throw new TypeError(`Invalid HexStr argument type. Only strings and number variables are accepted. Given type of ${typeof HexStr}.`)
    }
  }

  /**
   * Converts a hexadecimal value (number or hex string) into a JavaScript number.
   *
   * This method accepts either:
   * - A number (which is returned directly).
   * - A string representing a valid hexadecimal value, with or without the `0x` prefix.
   *
   * The string is normalized and parsed as a base-16 integer.
   * - - - -
   * @param {HexStringLikeValues} HexStr - The value to convert. Must be a non-negative integer or a valid hex string.
   * @returns {number} The numeric representation of the given hex value.
   * @throws {TypeError} If the input is not a number or string.
   * @throws {Error} If the string is not a valid hexadecimal string.
   */
  static toNumber(HexStr: HexStringLikeValues): number {
    switch (typeof HexStr) {
      case 'number':
        return HexStr
      case 'string': {
        if (!this.isHexString(HexStr)) throw new Error(`Provided hex string to process "${HexStr}" is not a valid hex string.`)
        const hex = HexStr.trim().toLowerCase().replace(/^0x/, '')
        return parseInt(`0x${hex}`, 16)
      }
      default:
        throw new TypeError(`Invalid HexStr argument type. Only strings and number variables are accepted. Given type of ${typeof HexStr}.`)
    }
  }
}
