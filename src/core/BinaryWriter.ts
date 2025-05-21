import { formatNumberWithDots, isHexString, padHexToLength, pathLikeToFilePath } from '../lib.exports'
import type { BufferEncodingOrNull, FilePath, FilePathLikeTypes } from './FilePath'

export type BinaryWriteEncodings = 'ascii' | 'latin1' | 'latin-1' | 'utf-8' | 'utf8' | 'hex'

/**
 * A class to programatically create binary files.
 */
export class BinaryWriter {
  /**
   * An array with `Buffer` objects that will be the content of the new binary file.
   */
  contents: Buffer[]
  constructor() {
    this.contents = []
  }

  // #region String/Buffer

  /**
   * Writes raw `Buffer` or 'string' values on the binary file.
   * - - - -
   * @param {Buffer} value The `Buffer` object to be added to the binary file.
   * @param {BinaryWriteEncodings} encoding `OPTIONAL` Used on string values. Default is `'utf8'`.
   * @returns {void}
   */
  write(value: Buffer | string, encoding: BinaryWriteEncodings = 'utf8'): void {
    if (Buffer.isBuffer(value)) {
      this.contents.push(value)
      return
    }
    switch (encoding) {
      case 'ascii':
        this.writeASCII(value)
        break
      case 'hex':
        this.writeHex(value)
        break
      case 'latin1':
      case 'latin-1':
        this.writeLatin1(value)
        break
      case 'utf-8':
      case 'utf8':
      default:
        this.writeUTF8(value)
        break
    }
  }

  /**
   * Writes any kind of text on the binary file encoded as ASCII.
   * - - - -
   * @param {string} value The string to be added to the binary file.
   * @param {number | undefined} [allocSize] `OPTIONAL` The allocation size of the string. If not specified,
   * the `Buffer` will have the same size of the string on its encoding method.
   * @returns {void}
   */
  writeASCII(value: string, allocSize?: number): void {
    if (allocSize) {
      const buf = Buffer.alloc(allocSize)
      buf.write(value, 'ascii')
      this.contents.push(buf)
      return
    }
    this.contents.push(Buffer.from(value, 'ascii'))
    return
  }

  /**
   * Writes any kind of text on the binary file encoded as Latin1.
   * - - - -
   * @param {string} value The string to be added to the binary file.
   * @param {number | undefined} [allocSize] `OPTIONAL` The allocation size of the string. If not specified,
   * the `Buffer` will have the same size of the string on its encoding method.
   * @returns {void}
   */
  writeLatin1(value: string, allocSize?: number): void {
    if (allocSize) {
      const buf = Buffer.alloc(allocSize)
      buf.write(value, 'latin1')
      this.contents.push(buf)
      return
    }
    this.contents.push(Buffer.from(value, 'latin1'))
    return
  }

  /**
   * Writes any kind of text on the binary file encoded as UTF-8.
   * - - - -
   * @param {string} value The string to be added to the binary file.
   * @param {number | undefined} [allocSize] `OPTIONAL` The allocation size of the string. If not specified,
   * the `Buffer` will have the same size of the string on its encoding method.
   * @returns {void}
   */
  writeUTF8(value: string, allocSize?: number): void {
    if (allocSize) {
      const buf = Buffer.alloc(allocSize)
      buf.write(value, 'utf8')
      this.contents.push(buf)
      return
    }
    this.contents.push(Buffer.from(value, 'utf8'))
    return
  }

  /**
   * Writes any kind of HEX string text on the binary file as bytes.
   * - - - -
   * @param {string} value The HEX string to be added to the binary file.
   * @param {number | undefined} [allocSize] `OPTIONAL` The allocation size of the string. If not specified,
   * the `Buffer` will have the same size of the string on its encoding method.
   * @returns {void}
   */
  writeHex(value: string, allocSize?: number): void {
    if (!isHexString(value)) throw new TypeError(`Value must be a valid hexadecimal value.`)
    if (allocSize) {
      const buf = Buffer.alloc(allocSize)
      buf.write(padHexToLength(value, 1, false), 'hex')
      this.contents.push(buf)
      return
    }
    this.contents.push(Buffer.from(padHexToLength(value, 1, false), 'hex'))
    return
  }

  /**
   * Writes a padding-like `Buffer` filled with specific value.
   * - - - -
   * @param {number} paddingSize The size of the padding.
   * @param {number} fill `OPTIONAL` The value you want to fill the padding. Default is `0`.
   */
  writePadding(paddingSize: number, fill = 0): void {
    const buf = Buffer.alloc(paddingSize).fill(fill)
    this.contents.push(buf)
  }

  // #region Integer

  /**
   * Writes an unsigned 8-bit value on the binary file.
   * - - - -
   * @param {number} value The number to be added to the binary file.
   * @returns {void}
   */
  writeUInt8(value: number): void {
    if (value < 0 || value > 0xff) throw new TypeError(`Value must be between 0 and ${formatNumberWithDots(0xff)}, provided ${formatNumberWithDots(value)}.`)
    const buf = Buffer.alloc(1)
    buf.writeUIntLE(value, 0, 1)
    this.contents.push(buf)
  }

  /**
   * Writes an unsigned 16-bit value on the binary file (little endian mode).
   * - - - -
   * @param {number} value The number to be added to the binary file.
   * @returns {void}
   */
  writeUInt16LE(value: number): void {
    if (value < 0 || value > 0xffff) throw new TypeError(`Value must be between 0 and ${formatNumberWithDots(0xffff)}, provided ${formatNumberWithDots(value)}.`)
    const buf = Buffer.alloc(2)
    buf.writeUIntLE(value, 0, 2)
    this.contents.push(buf)
  }

  /**
   * Writes an unsigned 16-bit value on the binary file (big endian mode).
   * - - - -
   * @param {number} value The number to be added to the binary file.
   * @returns {void}
   */
  writeUInt16BE(value: number): void {
    if (value < 0 || value > 65535) throw new TypeError(`Value must be between 0 and ${formatNumberWithDots(0xffff)}, provided ${formatNumberWithDots(value)}.`)
    const buf = Buffer.alloc(2)
    buf.writeUIntBE(value, 0, 2)
    this.contents.push(buf)
  }

  /**
   * Writes an unsigned 24-bit value on the binary file (little endian mode).
   * - - - -
   * @param {number} value The number to be added to the binary file.
   * @returns {void}
   */
  writeUInt24LE(value: number): void {
    if (value < 0 || value > 0xffffff) throw new TypeError(`Value must be between 0 and ${formatNumberWithDots(0xffffff)}, provided ${formatNumberWithDots(value)}.`)
    const buf = Buffer.alloc(3)
    buf.writeUIntLE(value, 0, 3)
    this.contents.push(buf)
  }

  /**
   * Writes an unsigned 24-bit value on the binary file (big endian mode).
   * - - - -
   * @param {number} value The number to be added to the binary file.
   * @returns {void}
   */
  writeUInt24BE(value: number): void {
    if (value < 0 || value > 0xffffff) throw new TypeError(`Value must be between 0 and ${formatNumberWithDots(0xffffff)}, provided ${formatNumberWithDots(value)}.`)
    const buf = Buffer.alloc(3)
    buf.writeUIntBE(value, 0, 3)
    this.contents.push(buf)
  }

  /**
   * Writes an unsigned 32-bit value on the binary file (little endian mode).
   * - - - -
   * @param {number} value The number to be added to the binary file.
   * @returns {void}
   */
  writeUInt32LE(value: number): void {
    if (value < 0 || value > 0xffffffff) throw new TypeError(`Value must be between 0 and ${formatNumberWithDots(0xffffffff)}, provided ${formatNumberWithDots(value)}.`)
    const buf = Buffer.alloc(4)
    buf.writeUIntLE(value, 0, 4)
    this.contents.push(buf)
  }

  /**
   * Writes an unsigned 32-bit value on the binary file (big endian mode).
   * - - - -
   * @param {number} value The number to be added to the binary file.
   * @returns {void}
   */
  writeUInt32BE(value: number): void {
    if (value < 0 || value > 0xffffffff) throw new TypeError(`Value must be between 0 and ${formatNumberWithDots(0xffffffff)}, provided ${formatNumberWithDots(value)}.`)
    const buf = Buffer.alloc(4)
    buf.writeUIntBE(value, 0, 4)
    this.contents.push(buf)
  }

  /**
   * Writes a signed 8-bit value on the binary file.
   * - - - -
   * @param {number} value The number to be added to the binary file.
   * @returns {void}
   */
  writeInt8(value: number): void {
    if (value < -128 || value > 127) throw new TypeError(`Value must be between -128 and 127, provided ${formatNumberWithDots(value)}.`)
    const buf = Buffer.alloc(1)
    buf.writeIntLE(value, 0, 1)
    this.contents.push(buf)
  }

  /**
   * Writes a signed 16-bit value on the binary file (little endian mode).
   * - - - -
   * @param {number} value The number to be added to the binary file.
   * @returns {void}
   */
  writeInt16LE(value: number): void {
    if (value < -32768 || value > 32767) throw new TypeError(`Value must be between -32.768 and 32.767, provided ${formatNumberWithDots(value)}.`)
    const buf = Buffer.alloc(2)
    buf.writeIntLE(value, 0, 2)
    this.contents.push(buf)
  }

  /**
   * Writes a signed 16-bit value on the binary file (big endian mode).
   * - - - -
   * @param {number} value The number to be added to the binary file.
   * @returns {void}
   */
  writeInt16BE(value: number): void {
    if (value < -32768 || value > 32767) throw new TypeError(`Value must be between -32.768 and 32.767, provided ${formatNumberWithDots(value)}.`)
    const buf = Buffer.alloc(2)
    buf.writeIntBE(value, 0, 2)
    this.contents.push(buf)
  }

  /**
   * Writes a signed 24-bit value on the binary file (little endian mode).
   * - - - -
   * @param {number} value The number to be added to the binary file.
   * @returns {void}
   */
  writeInt24LE(value: number): void {
    if (value < -8388608 || value > 8388607) throw new TypeError(`Value must be between -8,388,608 and 8,388,607, provided ${formatNumberWithDots(value)}.`)
    const buf = Buffer.alloc(3)
    buf.writeIntLE(value, 0, 3)
    this.contents.push(buf)
  }

  /**
   * Writes a signed 24-bit value on the binary file (big endian mode).
   * - - - -
   * @param {number} value The number to be added to the binary file.
   * @returns {void}
   */
  writeInt24BE(value: number): void {
    if (value < -8388608 || value > 8388607) throw new TypeError(`Value must be between -8,388,608 and 8,388,607, provided ${formatNumberWithDots(value)}.`)
    const buf = Buffer.alloc(3)
    buf.writeIntBE(value, 0, 3)
    this.contents.push(buf)
  }

  /**
   * Writes a signed 32-bit value on the binary file (little endian mode).
   * - - - -
   * @param {number} value The number to be added to the binary file.
   * @returns {void}
   */
  writeInt32LE(value: number): void {
    if (value < -2147483648 || value > 2147483647) throw new TypeError(`Value must be between -2.147.483.648 and 2.147.483.647, provided ${formatNumberWithDots(value)}.`)
    const buf = Buffer.alloc(4)
    buf.writeIntLE(value, 0, 4)
    this.contents.push(buf)
  }

  /**
   * Writes a signed 32-bit value on the binary file (big endian mode).
   * - - - -
   * @param {number} value The number to be added to the binary file.
   * @returns {void}
   */
  writeInt32BE(value: number): void {
    if (value < -2147483648 || value > 2147483647) throw new TypeError(`Value must be between -2.147.483.648 and 2.147.483.647, provided ${formatNumberWithDots(value)}.`)
    const buf = Buffer.alloc(4)
    buf.writeIntBE(value, 0, 4)
    this.contents.push(buf)
  }

  // #region Float/Double

  /**
   * Writer a float number value (32-bit) in little-endian byte order.
   * - - - -
   * @param {number} value The number to be added to the binary file.
   * @returns {void}
   */
  writeFloatLE(value: number): void {
    const buf = Buffer.alloc(4)
    buf.writeFloatLE(value, 0)
    this.contents.push(buf)
  }

  /**
   * Writer a float number value (32-bit) in big-endian byte order.
   * - - - -
   * @param {number} value The number to be added to the binary file.
   * @returns {void}
   */
  writeFloatBE(value: number): void {
    const buf = Buffer.alloc(4)
    buf.writeFloatBE(value, 0)
    this.contents.push(buf)
  }

  /**
   * Writer a double float number value (64-bit) in little-endian byte order.
   * - - - -
   * @param {number} value The number to be added to the binary file.
   * @returns {void}
   */
  writeDoubleLE(value: number): void {
    const buf = Buffer.alloc(8)
    buf.writeDoubleLE(value, 0)
    this.contents.push(buf)
  }

  /**
   * Writer a double float number value (64-bit) in big-endian byte order.
   * - - - -
   * @param {number} value The number to be added to the binary file.
   * @returns {void}
   */
  writeDoubleBE(value: number): void {
    const buf = Buffer.alloc(8)
    buf.writeDoubleBE(value, 0)
    this.contents.push(buf)
  }

  // #region BigInt

  /**
   * Writes an unsigned 64-bit value on the binary file (little endian mode).
   * - - - -
   * @param {bigint} value The number to be added to the binary file.
   * @returns {void}
   */
  writeUInt64LE(value: bigint): void {
    const buf = Buffer.alloc(8)
    buf.writeBigUInt64LE(value, 0)
    this.contents.push(buf)
  }

  /**
   * Writes an unsigned 64-bit value on the binary file (big endian mode).
   * - - - -
   * @param {bigint} value The number to be added to the binary file.
   * @returns {void}
   */
  writeUInt64BE(value: bigint): void {
    const buf = Buffer.alloc(8)
    buf.writeBigUInt64BE(value, 0)
    this.contents.push(buf)
  }

  /**
   * Writes a signed 64-bit value on the binary file (little endian mode).
   * - - - -
   * @param {bigint} value The number to be added to the binary file.
   * @returns {void}
   */
  writeInt64LE(value: bigint): void {
    const buf = Buffer.alloc(8)
    buf.writeBigInt64LE(value, 0)
    this.contents.push(buf)
  }

  /**
   * Writes a signed 64-bit value on the binary file (big endian mode).
   * - - - -
   * @param {bigint} value The number to be added to the binary file.
   * @returns {void}
   */
  writeInt64BE(value: bigint): void {
    const buf = Buffer.alloc(8)
    buf.writeBigInt64BE(value, 0)
    this.contents.push(buf)
  }

  // #region Typos

  /**
   * _Alias to `write` with pre-defined utf-8 encoding value._
   *
   * Writes any string on the binary file, encoded as UTF-8 and returns its allocation size in memory.
   * - - - -
   * @param {string} value The string value to evaluate.
   * @param {BinaryWriteEncodings} encoding `OPTIONAL` The encoding used on the string to buffer convertion. Default is `'utf8'`.
   * @returns {number}
   */
  writeString(value: string, encoding: BinaryWriteEncodings = 'utf8'): number {
    switch (encoding) {
      case 'utf8':
      case 'utf-8':
      default:
        this.writeUTF8(value)
        break
      case 'ascii':
        this.writeASCII(value)
        break
      case 'hex':
        this.writeHex(value)
        break
      case 'latin-1':
      case 'latin1':
        this.writeLatin1(value)
        break
    }
    return Buffer.from(value, encoding === 'latin-1' ? 'latin1' : encoding).length
  }

  /**
   * _Alias to `writeUInt8`._
   *
   * Write boolean values as an 8-bit unsigned integer, from 0 (meaning false) to 1 (meaning true).
   * - - - -
   * @param {boolean} value The boolean value to evaluate.
   */
  writeBoolean(value: boolean): void {
    this.writeUInt8(value ? 1 : 0)
  }

  /**
   * Creates a new `Buffer` object with all contents written on this instance.
   * - - - -
   * @returns {Buffer}
   */
  toBuffer(): Buffer {
    return Buffer.concat(this.contents)
  }

  /**
   * Asynchronously writes all contents written on this instance to a file, optionally replacing it if it already exists.
   *
   * Throws an error if the file exists and replace is set to false.
   * - - - -
   * @param {FilePathLikeTypes} path The path where the contents will be written.
   * @param {BufferEncodingOrNull} [encoding] `OPTIONAL` If `null`, writes as a `Buffer`.
   * @param {boolean} [replace] `OPTIONAL` Whether to overwrite the file if it already exists. Default is `true`.
   * @returns {Promise<FilePath>} A `Promise` that resolves to a `FilePath` instance of the file path where the contents will be written.
   */
  async toFile(path: FilePathLikeTypes, encoding?: BufferEncodingOrNull, replace = true): Promise<FilePath> {
    const p = pathLikeToFilePath(path)
    return await p.write(this.toBuffer(), encoding, replace)
  }

  /**
   * Synchronously writes all contents written on this instance to a file, optionally replacing it if it already exists.
   *
   * Throws an error if the file exists and replace is set to false.
   * - - - -
   * @param {FilePathLikeTypes} path The path where the contents will be written.
   * @param {BufferEncodingOrNull} [encoding] `OPTIONAL` If `null`, writes as a `Buffer`.
   * @param {boolean} [replace] `OPTIONAL` Whether to overwrite the file if it already exists. Default is `true`.
   * @returns {Promise<FilePath>} A `FilePath` instance of the file path where the contents will be written.
   */
  toFileSync(path: FilePathLikeTypes, encoding?: BufferEncodingOrNull, replace = true): FilePath {
    const p = pathLikeToFilePath(path)
    return p.writeSync(this.toBuffer(), encoding, replace)
  }

  /**
   * Returns the length of the new binary file so far.
   * - - - -
   * @returns {number}
   */
  get length(): number {
    const bufferLength = this.contents.reduce((prev, curr) => {
      return prev + curr.length
    }, 0)
    return bufferLength
  }
}
