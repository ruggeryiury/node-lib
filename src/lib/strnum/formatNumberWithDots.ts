/**
 * Formats a number by adding dots as thousands separators.
 * - - - -
 * @param {number} value The number to be formatted (can be positive or negative).
 * @returns {string} The formatted number as a string.
 */
export const formatNumberWithDots = (value: number): string => {
  if (!Number.isFinite(value)) throw new TypeError('Input must be a finite number')

  const isNegative = value < 0
  const absoluteValue = Math.abs(value)

  const formatted = absoluteValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  return isNegative ? `-${formatted}` : formatted
}
