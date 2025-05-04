export interface NumberToHexStringOptions {
  /**
   * Whether to include the "0x" prefix. Default is `true`.
   */
  prefix?: boolean
  /**
   * Whether to return the hex in uppercase. Default is `false`.
   */
  uppercase?: boolean
}

/**
 * Converts a number to a hexadecimal string.
 * - - - -
 * @param {number} value The number to convert.
 * @param {NumberToHexStringOptions | undefined} [options] `OPTIONAL` Changes the behavior of the convertion process.
 * @returns {string} The hexadecimal representation of the number.
 * @example
 * numberToHexString(255); // "0xff"
 * numberToHexString(255, { uppercase: true }); // "0xFF"
 * numberToHexString(255, { prefix: false }); // "ff"
 * numberToHexString(1048576); // "0x100000"
 */
export const numberToHexString = (value: number, options?: NumberToHexStringOptions): string => {
  if (!Number.isInteger(value) || value < 0) {
    throw new TypeError('Input must be a non-negative integer')
  }

  const hex = value.toString(16)
  const formatted = options?.uppercase ? hex.toUpperCase() : hex
  return (options?.prefix ?? true) ? `0x${formatted}` : formatted
}
