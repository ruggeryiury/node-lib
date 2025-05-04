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
 * getReadableSize(Buffer.alloc(500 * 1024)); // "500.00 KB"
 * getReadableSize(5 * 1024 * 1024); // "5.00 MB"
 * getReadableSize(new ArrayBuffer(1200 * 1024 * 1024)); // "1.17 GB"
 */
export const getReadableBytesSize = (input: Buffer | ArrayBuffer | number): string => {
  const bytes = typeof input === 'number' ? input : input instanceof Buffer ? input.length : input.byteLength

  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + 'KB'
  else if (bytes < 1000 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(2) + 'MB'
  else if (bytes < 1000 * 1024 * 1024 * 1024) return (bytes / (1024 * 1024 * 1024)).toFixed(2) + 'GB'
  else return (bytes / (1024 * 1024 * 1024 * 1024)).toFixed(2) + 'TB'
}
