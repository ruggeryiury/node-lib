import { isHexString } from '../../lib.exports'

/**
 * Pads a hexadecimal string with leading zeros to ensure it matches a specific byte length.
 *
 * Accepts input with or without the "0x" prefix, and always returns a string with the "0x" prefix.
 * - - - -
 * @param {string} hexString The hexadecimal string to pad. Can include or omit the "0x" prefix.
 * @param {number} byteLength `OPTIONAL` The desired total length in bytes (1 byte = 2 hex characters). Default is `1`.
 * @param {boolean} [prefix] `OPTIONAL` Adds a `0x` prefix on the string. Default if `true`.
 * @param {boolean} [uppercased] `OPTIONAL` Uppercase all letters of the hexadecimal string. Default if `false`.
 * @throws {TypeError} When the provided hex string is not a valid hex string.
 * @returns {string} A hexadecimal string with the "0x" prefix, padded with leading zeros if necessary.
 * @example
 * padHexToLength("0x1a2b", 4); // "0x00001a2b"
 * padHexToLength("1a2b", 4);   // "0x00001a2b"
 * padHexToLength("0x0", 2);    // "0x0000"
 */
export const padHexToLength = (hexString: string, byteLength = 1, prefix = true, uppercased = false) => {
  if (!isHexString(hexString)) throw new TypeError('Hex value must be a string.')
  if (typeof byteLength !== 'number' || byteLength < 0 || !Number.isInteger(byteLength)) throw new TypeError('Byte length must be a non-negative integer.')

  const hasPrefix = hexString.startsWith('0x')
  let cleanHex = hasPrefix ? hexString.slice(2) : hexString
  if (cleanHex.length % 2 !== 0) cleanHex = `0${cleanHex}`
  const originalHexStringLength = cleanHex.length
  if (originalHexStringLength > byteLength * 2) byteLength = originalHexStringLength / 2

  const normalizedHex = cleanHex.toLowerCase().replace(/^0+/, '')

  const targetLength = byteLength * 2
  const paddedHex = normalizedHex.padStart(targetLength, '0')
  const returnValue = prefix ? '0x' + paddedHex : paddedHex
  return uppercased ? returnValue.toUpperCase() : returnValue
}
