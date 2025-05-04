/**
 * Parses a human-readable byte size string (e.g., "5.00MB", "1.17 GB", "500.00KB")
 * and converts it back into the number of bytes.
 *
 * Supports units: KB, MB, GB (case-insensitive, optional space).
 * - - - -
 * @param {string} input A string representing size with unit (e.g., "1.23 MB").
 * @returns {number} The size in bytes.
 * @example
 * parseReadableBytesSize("500.00 KB"); // 512000
 * parseReadableBytesSize("5.00MB");    // 5242880
 * parseReadableBytesSize("1.17 GB");   // 12582912
 */
export const parseReadableBytesSize = (input: string): number => {
  const trimmed = input.trim().toUpperCase().replace(/\s+/g, '')
  const match = /^([\d.]+)(KB|MB|GB|TB)$/.exec(trimmed)

  if (!match) throw new Error(`Invalid readable size format: "${input}"`)

  const value = parseFloat(match[1])
  const unit = match[2]

  switch (unit) {
    case 'KB':
      return Math.round(value * 1024)
    case 'MB':
      return Math.round(value * 1024 * 1024)
    case 'GB':
      return Math.round(value * 1024 * 1024 * 1024)
    case 'TB':
      return Math.round(value * 1024 * 1024 * 1024 * 1024)
    default:
      throw new Error(`Unsupported unit: "${unit}"`)
  }
}
