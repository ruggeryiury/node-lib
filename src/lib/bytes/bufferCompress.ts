import { promisify } from 'util'
import { brotliCompress, brotliDecompress } from 'zlib'

/**
 * A promisified version of Node.js `zlib.brotliCompress`.
 * - - - -
 * @see https://nodejs.org/api/zlib.html#zlibbrotlicompressbuffer-options-callback
 */
export const brotliCompressAsync = promisify(brotliCompress)
/**
 * A promisified version of Node.js `zlib.brotliCompress`.
 * - - - -
 * @see https://nodejs.org/api/zlib.html#zlibbrotlidecompressbuffer-options-callback
 */
export const brotliDecompressAsync = promisify(brotliDecompress)

/**
 * Decompress Brotli-compressed data.
 * - - - -
 * @param {Buffer} compressed The compressed Buffer.
 * @returns {Promise<Buffer>} A Promise that resolves to the decompressed Buffer.
 */
export const decompressBrotli = async (compressed: Buffer): Promise<Buffer> => {
  return await brotliDecompressAsync(compressed)
}
/**
 * Compresses a given Buffer or string using Brotli compression.
 * - - - -
 * @param {Buffer | string} data The input data to compress.
 * @returns {Promise<Buffer>} A promise that resolves to the Brotli-compressed buffer.
 * @example
 * const input = Buffer.from('Hello Brotli!');
 * const compressed = await compressWithBrotli(input);
 * console.log(compressed);
 */
export const compressWithBrotli = async (data: Buffer | string): Promise<Buffer> => {
  return await brotliCompressAsync(data)
}
