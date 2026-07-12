import { constants, createBrotliCompress, createBrotliDecompress, createDeflate, createDeflateRaw, createGunzip, createGzip, createInflate, createInflateRaw, createUnzip, brotliCompress, brotliDecompress, deflate, deflateRaw, gunzip, gzip, inflate, inflateRaw, unzip, crc32, createZstdCompress, createZstdDecompress, zstdCompress, zstdDecompress } from 'node:zlib'
import { promisify } from 'node:util'

/**
 * Wrapper around the Node.js `zlib` module. All callback-based functions are exposed as Promise-based methods.
 */
export class Compression {
  /**
   * Factory methods for creating compression objects and streams.
   */
  static stream = {
    /**
     * Creates a writable [Brotli](https://en.wikipedia.org/wiki/Brotli) compression stream.
     */
    createBrotliCompress: createBrotliCompress,
    /**
     * Creates a readable [Brotli](https://en.wikipedia.org/wiki/Brotli) decompression stream.
     */
    createBrotliDecompress: createBrotliDecompress,
    /**
     * Creates a [Deflate](https://en.wikipedia.org/wiki/Deflate) compression stream.
     */
    createDeflate: createDeflate,
    /**
     * Creates a raw [Deflate](https://en.wikipedia.org/wiki/Deflate) compression stream without zlib headers or checksums.
     */
    createDeflateRaw: createDeflateRaw,
    /**
     * Creates a [Gzip](https://en.wikipedia.org/wiki/Gzip) decompression stream.
     */
    createGunzip: createGunzip,
    /**
     * Creates a [Gzip](https://en.wikipedia.org/wiki/Gzip) compression stream.
     */
    createGzip: createGzip,
    /**
     * Creates an [Inflate](https://en.wikipedia.org/wiki/Deflate) decompression stream.
     */
    createInflate: createInflate,
    /**
     * Creates a raw [Inflate](https://en.wikipedia.org/wiki/Deflate) decompression stream for Deflate data without zlib headers or checksums.
     */
    createInflateRaw: createInflateRaw,
    /**
     * Creates a stream that automatically detects and decompresses [Gzip](https://en.wikipedia.org/wiki/Gzip) or [Deflate](https://en.wikipedia.org/wiki/Deflate) data.
     */
    createUnzip: createUnzip,
    /**
     * Creates a [Zstandard](https://en.wikipedia.org/wiki/Zstd) compression stream.
     */
    createZstdCompress: createZstdCompress,
    /**
     * Creates a [Zstandard](https://en.wikipedia.org/wiki/Zstd) decompression stream.
     */
    createZstdDecompress: createZstdDecompress,
  } as const
  /**
   * Compresses data using the [Brotli algorithm](https://en.wikipedia.org/wiki/Brotli).
   */
  static brotliCompress = promisify(brotliCompress)
  /**
   * Decompresses [Brotli](https://en.wikipedia.org/wiki/Brotli)-compressed data.
   */
  static brotliDecompress = promisify(brotliDecompress)
  /**
   * Computes the [CRC-32](https://en.wikipedia.org/wiki/Cyclic_redundancy_check) checksum of the provided data.
   */
  static crc32 = crc32
  /**
   * Compresses data using the [Deflate](https://en.wikipedia.org/wiki/Deflate) algorithm.
   */
  static deflate = promisify(deflate)
  /**
   * Compresses data using the raw [Deflate](https://en.wikipedia.org/wiki/Deflate) algorithm without zlib headers or checksums.
   */
  static deflateRaw = promisify(deflateRaw)
  /**
   * Decompresses [Gzip](https://en.wikipedia.org/wiki/Gzip)-compressed data.
   */
  static gunzip = promisify(gunzip)
  /**
   * Compresses data using the [Gzip](https://en.wikipedia.org/wiki/Gzip) algorithm.
   */
  static gzip = promisify(gzip)
  /**
   * Decompresses [Deflate](https://en.wikipedia.org/wiki/Deflate)-compressed data.
   */
  static inflate = promisify(inflate)
  /**
   * Decompresses raw [Deflate](https://en.wikipedia.org/wiki/Deflate) data without zlib headers or checksums.
   */
  static inflateRaw = promisify(inflateRaw)
  /**
   * Automatically detects and decompresses [Gzip](https://en.wikipedia.org/wiki/Gzip) or [Deflate](https://en.wikipedia.org/wiki/Deflate)-compressed data.
   */
  static unzip = promisify(unzip)
  /**
   * Compresses data using the [Zstandard](https://en.wikipedia.org/wiki/Zstd) algorithm.
   */
  static zstdCompress = promisify(zstdCompress)
  /**
   * Decompresses [Zstandard](https://en.wikipedia.org/wiki/Zstd)-compressed data.
   */
  static zstdDecompress = promisify(zstdDecompress)
  /**
   * Exposes the constants provided by the Node.js `zlib` module.
   */
  static constants = constants
}
