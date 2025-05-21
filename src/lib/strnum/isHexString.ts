/**
 * Checks if a string contains only valid hexadecimal characters (0-9, A-F).
 * - - - -
 * @param {string} str The string to check.
 * @returns {boolean} Returns `true` if the string is a valid hex string, `false` otherwise.
 */
export const isHexString = (str: string): boolean => {
  return typeof str === 'string' && /^(0x)?[0-9a-fA-F]+$/.test(str)
}
