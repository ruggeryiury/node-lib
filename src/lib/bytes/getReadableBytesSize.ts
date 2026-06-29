export interface ReadableBytesSizeGetterOptions {
  /**
   * Default is `2`.
   */
  fractionDigits?: number
}

/**
 * Converts the size in bytes (from Buffer, ArrayBuffer, or number) into a human-readable string,
 * using KB, MB, or GB based on the size. Always returns a value with two decimal places.
 *
 * - < 1 MB → KB
 * - 1 MB to < 1000 MB → MB
 * - 1 GB to < 1000 GB → GB
 * - ≥ 1000 GB → TB
 * - - - -
 * @param {Buffer | ArrayBuffer | number} input A Buffer, ArrayBuffer, or number of bytes.
 * @returns {string} The size formatted as a string with two decimals and appropriate unit.
 * @example
 * getReadableSize(Buffer.alloc(500 * 1024)); // "500.00KB"
 * getReadableSize(5 * 1024 * 1024); // "5.00MB"
 * getReadableSize(new ArrayBuffer(1200 * 1024 * 1024)); // "1.17GB"
 */
export const getReadableBytesSize = (input: Buffer | ArrayBuffer | number, options?: ReadableBytesSizeGetterOptions): string => {
  const { fractionDigits } = { fractionDigits: 2, ...options }
  const bytes = typeof input === 'number' ? input : input instanceof Buffer ? input.length : input.byteLength

  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(fractionDigits) + 'KB'
  else if (bytes < 1000 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(fractionDigits) + 'MB'
  else if (bytes < 1000 * 1024 * 1024 * 1024) return (bytes / (1024 * 1024 * 1024)).toFixed(fractionDigits) + 'GB'
  else return (bytes / (1024 * 1024 * 1024 * 1024)).toFixed(fractionDigits) + 'TB'
}
