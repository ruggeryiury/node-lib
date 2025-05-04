/**
 * Converts a hexadecimal string (e.g., "FF", "0xFF") to a number.
 * - - - -
 * @param {string} hex The hex string to convert. It may optionally start with "0x".
 * @returns {number} The numeric value of the hex string.
 * @example
 * hexStringToNumber("FF");     // 255
 * hexStringToNumber("0xff");   // 255
 * hexStringToNumber("0010");   // 16
 */
export const hexStringToNumber = (hex: string): number => {
  if (typeof hex !== 'string') {
    throw new TypeError('Expected a string')
  }

  const normalized = hex.trim().toLowerCase().replace(/^0x/, '')
  if (!/^[\da-f]+$/i.test(normalized)) {
    throw new Error(`Invalid hex string: "${hex}"`)
  }

  return parseInt(normalized, 16)
}
