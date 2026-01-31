import type { WriteStream } from 'node:fs'
import { HexStr, type BinaryWriteEncodings, type BitsArray, type BitsBooleanArray, type FilePath, type FilePathLikeTypes, type HexStringLikeValues } from '../core.exports'
import { formatNumberWithDots, pathLikeToFilePath } from '../lib.exports'

/**
 * A class with methods to write binary files programmatically using `WriteStream` operators.
 */
export class StreamWriter {
  /**
   * The file path where the contents will be written into.
   */
  readonly filePath: FilePath
  /**
   * The stream operator object of the file.
   */
  private _operator: WriteStream

  /**
   * Returns the length of the new binary file so far.
   */
  private _length: number

  /**
   * A class with methods to write binary files programmatically using `WriteStream` operators.
   * - - - -
   * @param {FilePathLikeTypes} filePath The file path you want to stream write into.
   */
  private constructor(filePath: FilePathLikeTypes) {
    this.filePath = pathLikeToFilePath(filePath)
    this._operator = this.filePath.createWriteStreamSync()
    this._length = 0
  }

  /**
   * Returns the length of the new binary file so far.
   */
  get length(): number {
    return this._length
  }

  /**
   * Returns a value that flags if the writing operation of this class instance was closed or not.
   */
  get isClosed(): boolean {
    return this._operator.closed
  }

  private _checkStreamStatus() {
    if (this.isClosed) throw new Error('Tried to use a writing method to a StreamWriter class which stream instance is already closed')
  }

  /**
   * Closes the writing stream instantiated by this class.
   * - - - -
   * @returns {Promise<void>}
   */
  close(): Promise<void> {
    if (this.isClosed) return new Promise<void>((resolve) => resolve())
    else
      return new Promise<void>((resolve, reject) => {
        this._operator.close((err) => {
          if (err) reject(err)
          resolve()
        })
      })
  }

  // #region Static Methods
  /**
   *
   * @param {FilePathLikeTypes} filePath The file path you want to stream write into.
   * @param {boolean} [replace] `OPTIONAL` If `false`, the function will throw an Error. Default is `true`.
   * @throws {Error} When replace is set to `false` and the file already exists.
   */
  static async toFile(filePath: FilePathLikeTypes, replace: boolean = true): Promise<StreamWriter> {
    const file = pathLikeToFilePath(filePath)
    if (file.exists) {
      if (!replace) throw new Error(`Provided file path value for StreamWriter "${file.path}" already exists`)
      await file.delete()
    }

    return new StreamWriter(file)
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
    this._checkStreamStatus()
    if (Buffer.isBuffer(value)) {
      this._operator.write(value)
      this._length += value.length
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
    this._checkStreamStatus()
    if (allocSize) {
      const buf = Buffer.alloc(allocSize)
      buf.write(value, 'ascii')
      this._operator.write(buf)
      this._length += buf.length
      return
    }
    const buf = Buffer.from(value, 'ascii')
    this._operator.write(buf)
    this._length += buf.length
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
    this._checkStreamStatus()
    if (allocSize) {
      const buf = Buffer.alloc(allocSize)
      buf.write(value, 'latin1')
      this._operator.write(buf)
      this._length = buf.length
      return
    }
    const buf = Buffer.from(value, 'latin1')
    this._operator.write(buf)
    this._length += buf.length
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
    this._checkStreamStatus()
    if (allocSize) {
      const buf = Buffer.alloc(allocSize)
      buf.write(value, 'utf8')
      this._operator.write(buf)
      this._length += buf.length
      return
    }
    const buf = Buffer.from(value, 'utf8')
    this._operator.write(buf)
    this._length += buf.length
  }

  /**
   * Writes any kind of HEX string text on the binary file as bytes.
   * - - - -
   * @param {string} value The HEX string to be added to the binary file.
   * @param {number | undefined} [allocSize] `OPTIONAL` The allocation size of the string. If not specified,
   * the `Buffer` will have the same size of the string on its encoding method.
   * @returns {void}
   */
  writeHex(value: HexStringLikeValues, allocSize?: number): void {
    this._checkStreamStatus()
    if (typeof value === 'string' && !HexStr.isHexString(value)) throw new TypeError(`Value must be a valid hexadecimal value.`)
    if (allocSize) {
      const buf = Buffer.alloc(allocSize)
      buf.write(HexStr.processHex(value, { prefix: false }), 'hex')
      this._operator.write(buf)
      this._length += buf.length
      return
    }
    const buf = Buffer.from(HexStr.processHex(value, { prefix: false }), 'hex')
    this._operator.write(buf)
    this._length += buf.length
  }

  /**
   * Writes a padding-like `Buffer` filled with specific value.
   * - - - -
   * @param {number} paddingSize The size of the padding.
   * @param {number} fill `OPTIONAL` The value you want to fill the padding. Default is `0`.
   */
  writePadding(paddingSize: number, fill = 0): void {
    this._checkStreamStatus()
    const buf = Buffer.alloc(paddingSize).fill(fill)
    this._operator.write(buf)
    this._length += buf.length
  }

  // #region Integer

  /**
   * Writes an unsigned 8-bit value on the binary file.
   * - - - -
   * @param {number} value The number to be added to the binary file.
   * @returns {void}
   */
  writeUInt8(value: number): void {
    this._checkStreamStatus()
    if (value < 0 || value > 0xff) throw new TypeError(`Value must be between 0 and ${formatNumberWithDots(0xff)}, provided ${formatNumberWithDots(value)}.`)
    const buf = Buffer.alloc(1)
    buf.writeUIntLE(value, 0, 1)
    this._operator.write(buf)
    this._length += buf.length
  }

  /**
   * Writes an unsigned 16-bit value on the binary file (little endian mode).
   * - - - -
   * @param {number} value The number to be added to the binary file.
   * @returns {void}
   */
  writeUInt16LE(value: number): void {
    this._checkStreamStatus()
    if (value < 0 || value > 0xffff) throw new TypeError(`Value must be between 0 and ${formatNumberWithDots(0xffff)}, provided ${formatNumberWithDots(value)}.`)
    const buf = Buffer.alloc(2)
    buf.writeUIntLE(value, 0, 2)
    this._operator.write(buf)
    this._length += buf.length
  }

  /**
   * Writes an unsigned 16-bit value on the binary file (big endian mode).
   * - - - -
   * @param {number} value The number to be added to the binary file.
   * @returns {void}
   */
  writeUInt16BE(value: number): void {
    this._checkStreamStatus()
    if (value < 0 || value > 65535) throw new TypeError(`Value must be between 0 and ${formatNumberWithDots(0xffff)}, provided ${formatNumberWithDots(value)}.`)
    const buf = Buffer.alloc(2)
    buf.writeUIntBE(value, 0, 2)
    this._operator.write(buf)
    this._length += buf.length
  }

  /**
   * Writes an unsigned 24-bit value on the binary file (little endian mode).
   * - - - -
   * @param {number} value The number to be added to the binary file.
   * @returns {void}
   */
  writeUInt24LE(value: number): void {
    this._checkStreamStatus()
    if (value < 0 || value > 0xffffff) throw new TypeError(`Value must be between 0 and ${formatNumberWithDots(0xffffff)}, provided ${formatNumberWithDots(value)}.`)
    const buf = Buffer.alloc(3)
    buf.writeUIntLE(value, 0, 3)
    this._operator.write(buf)
    this._length += buf.length
  }

  /**
   * Writes an unsigned 24-bit value on the binary file (big endian mode).
   * - - - -
   * @param {number} value The number to be added to the binary file.
   * @returns {void}
   */
  writeUInt24BE(value: number): void {
    this._checkStreamStatus()
    if (value < 0 || value > 0xffffff) throw new TypeError(`Value must be between 0 and ${formatNumberWithDots(0xffffff)}, provided ${formatNumberWithDots(value)}.`)
    const buf = Buffer.alloc(3)
    buf.writeUIntBE(value, 0, 3)
    this._operator.write(buf)
    this._length += buf.length
  }

  /**
   * Writes an unsigned 32-bit value on the binary file (little endian mode).
   * - - - -
   * @param {number} value The number to be added to the binary file.
   * @returns {void}
   */
  writeUInt32LE(value: number): void {
    this._checkStreamStatus()
    if (value < 0 || value > 0xffffffff) throw new TypeError(`Value must be between 0 and ${formatNumberWithDots(0xffffffff)}, provided ${formatNumberWithDots(value)}.`)
    const buf = Buffer.alloc(4)
    buf.writeUIntLE(value, 0, 4)
    this._operator.write(buf)
    this._length += buf.length
  }

  /**
   * Writes an unsigned 32-bit value on the binary file (big endian mode).
   * - - - -
   * @param {number} value The number to be added to the binary file.
   * @returns {void}
   */
  writeUInt32BE(value: number): void {
    this._checkStreamStatus()
    if (value < 0 || value > 0xffffffff) throw new TypeError(`Value must be between 0 and ${formatNumberWithDots(0xffffffff)}, provided ${formatNumberWithDots(value)}.`)
    const buf = Buffer.alloc(4)
    buf.writeUIntBE(value, 0, 4)
    this._operator.write(buf)
    this._length += buf.length
  }

  /**
   * Writes a signed 8-bit value on the binary file.
   * - - - -
   * @param {number} value The number to be added to the binary file.
   * @returns {void}
   */
  writeInt8(value: number): void {
    this._checkStreamStatus()
    if (value < -128 || value > 127) throw new TypeError(`Value must be between -128 and 127, provided ${formatNumberWithDots(value)}.`)
    const buf = Buffer.alloc(1)
    buf.writeIntLE(value, 0, 1)
    this._operator.write(buf)
    this._length += buf.length
  }

  /**
   * Writes a signed 16-bit value on the binary file (little endian mode).
   * - - - -
   * @param {number} value The number to be added to the binary file.
   * @returns {void}
   */
  writeInt16LE(value: number): void {
    this._checkStreamStatus()
    if (value < -32768 || value > 32767) throw new TypeError(`Value must be between -32.768 and 32.767, provided ${formatNumberWithDots(value)}.`)
    const buf = Buffer.alloc(2)
    buf.writeIntLE(value, 0, 2)
    this._operator.write(buf)
    this._length += buf.length
  }

  /**
   * Writes a signed 16-bit value on the binary file (big endian mode).
   * - - - -
   * @param {number} value The number to be added to the binary file.
   * @returns {void}
   */
  writeInt16BE(value: number): void {
    this._checkStreamStatus()
    if (value < -32768 || value > 32767) throw new TypeError(`Value must be between -32.768 and 32.767, provided ${formatNumberWithDots(value)}.`)
    const buf = Buffer.alloc(2)
    buf.writeIntBE(value, 0, 2)
    this._operator.write(buf)
    this._length += buf.length
  }

  /**
   * Writes a signed 24-bit value on the binary file (little endian mode).
   * - - - -
   * @param {number} value The number to be added to the binary file.
   * @returns {void}
   */
  writeInt24LE(value: number): void {
    this._checkStreamStatus()
    if (value < -8388608 || value > 8388607) throw new TypeError(`Value must be between -8,388,608 and 8,388,607, provided ${formatNumberWithDots(value)}.`)
    const buf = Buffer.alloc(3)
    buf.writeIntLE(value, 0, 3)
    this._operator.write(buf)
    this._length += buf.length
  }

  /**
   * Writes a signed 24-bit value on the binary file (big endian mode).
   * - - - -
   * @param {number} value The number to be added to the binary file.
   * @returns {void}
   */
  writeInt24BE(value: number): void {
    this._checkStreamStatus()
    if (value < -8388608 || value > 8388607) throw new TypeError(`Value must be between -8,388,608 and 8,388,607, provided ${formatNumberWithDots(value)}.`)
    const buf = Buffer.alloc(3)
    buf.writeIntBE(value, 0, 3)
    this._operator.write(buf)
    this._length += buf.length
  }

  /**
   * Writes a signed 32-bit value on the binary file (little endian mode).
   * - - - -
   * @param {number} value The number to be added to the binary file.
   * @returns {void}
   */
  writeInt32LE(value: number): void {
    this._checkStreamStatus()
    if (value < -2147483648 || value > 2147483647) throw new TypeError(`Value must be between -2.147.483.648 and 2.147.483.647, provided ${formatNumberWithDots(value)}.`)
    const buf = Buffer.alloc(4)
    buf.writeIntLE(value, 0, 4)
    this._operator.write(buf)
    this._length += buf.length
  }

  /**
   * Writes a signed 32-bit value on the binary file (big endian mode).
   * - - - -
   * @param {number} value The number to be added to the binary file.
   * @returns {void}
   */
  writeInt32BE(value: number): void {
    this._checkStreamStatus()
    if (value < -2147483648 || value > 2147483647) throw new TypeError(`Value must be between -2.147.483.648 and 2.147.483.647, provided ${formatNumberWithDots(value)}.`)
    const buf = Buffer.alloc(4)
    buf.writeIntBE(value, 0, 4)
    this._operator.write(buf)
    this._length += buf.length
  }

  // #region Float/Double

  /**
   * Writer a float number value (32-bit) in little-endian byte order.
   * - - - -
   * @param {number} value The number to be added to the binary file.
   * @returns {void}
   */
  writeFloatLE(value: number): void {
    this._checkStreamStatus()
    const buf = Buffer.alloc(4)
    buf.writeFloatLE(value, 0)
    this._operator.write(buf)
    this._length += buf.length
  }

  /**
   * Writer a float number value (32-bit) in big-endian byte order.
   * - - - -
   * @param {number} value The number to be added to the binary file.
   * @returns {void}
   */
  writeFloatBE(value: number): void {
    this._checkStreamStatus()
    const buf = Buffer.alloc(4)
    buf.writeFloatBE(value, 0)
    this._operator.write(buf)
    this._length += buf.length
  }

  /**
   * Writer a double float number value (64-bit) in little-endian byte order.
   * - - - -
   * @param {number} value The number to be added to the binary file.
   * @returns {void}
   */
  writeDoubleLE(value: number): void {
    this._checkStreamStatus()
    const buf = Buffer.alloc(8)
    buf.writeDoubleLE(value, 0)
    this._operator.write(buf)
    this._length += buf.length
  }

  /**
   * Writer a double float number value (64-bit) in big-endian byte order.
   * - - - -
   * @param {number} value The number to be added to the binary file.
   * @returns {void}
   */
  writeDoubleBE(value: number): void {
    this._checkStreamStatus()
    const buf = Buffer.alloc(8)
    buf.writeDoubleBE(value, 0)
    this._operator.write(buf)
    this._length += buf.length
  }

  // #region BigInt

  /**
   * Writes an unsigned 64-bit value on the binary file (little endian mode).
   * - - - -
   * @param {bigint} value The number to be added to the binary file.
   * @returns {void}
   */
  writeUInt64LE(value: bigint): void {
    this._checkStreamStatus()
    const buf = Buffer.alloc(8)
    buf.writeBigUInt64LE(value, 0)
    this._operator.write(buf)
    this._length += buf.length
  }

  /**
   * Writes an unsigned 64-bit value on the binary file (big endian mode).
   * - - - -
   * @param {bigint} value The number to be added to the binary file.
   * @returns {void}
   */
  writeUInt64BE(value: bigint): void {
    this._checkStreamStatus()
    const buf = Buffer.alloc(8)
    buf.writeBigUInt64BE(value, 0)
    this._operator.write(buf)
    this._length += buf.length
  }

  /**
   * Writes a signed 64-bit value on the binary file (little endian mode).
   * - - - -
   * @param {bigint} value The number to be added to the binary file.
   * @returns {void}
   */
  writeInt64LE(value: bigint): void {
    this._checkStreamStatus()
    const buf = Buffer.alloc(8)
    buf.writeBigInt64LE(value, 0)
    this._operator.write(buf)
    this._length += buf.length
  }

  /**
   * Writes a signed 64-bit value on the binary file (big endian mode).
   * - - - -
   * @param {bigint} value The number to be added to the binary file.
   * @returns {void}
   */
  writeInt64BE(value: bigint): void {
    this._checkStreamStatus()
    const buf = Buffer.alloc(8)
    buf.writeBigInt64BE(value, 0)
    this._operator.write(buf)
    this._length += buf.length
  }

  // #region Bits

  /**
   * Writes an 8-bit unsigned integer from an array of 8 bit values (0 or 1).
   * - - - -
   * @param {BitsArray} bitsArray Array of exactly 8 numbers (each 0 or 1), ordered from MSB to LSB.
   */
  writeUInt8FromBitsArray(bitsArray: BitsArray): void {
    let value = 0
    for (let i = 0; i < 8; i++) {
      value = (value << 1) | bitsArray[i]
    }
    this.writeUInt8(value)
    this._length += 1
  }

  /**
   * Writes an 8-bit unsigned integer from an array of 8 boolean values.
   * - - - -
   * @param {BitsBooleanArray} booleanArray Array of exactly 8 boolean values, ordered from MSB to LSB.
   */
  writeUInt8FromBitsBooleanArray(booleanArray: BitsBooleanArray): void {
    const numArray = booleanArray.map((val) => (val ? 1 : 0)) as BitsArray
    this.writeUInt8FromBitsArray(numArray)
  }

  /**
   * Writes an 8-bit unsigned integer from a bit string.
   * - - - -
   * @param {string} bitString A string of exactly 8 characters, each either `'0'` or `'1'`.
   */
  writeUInt8FromBitString(bitString: string): void {
    if (!/^[01]{8}$/.test(bitString)) throw new RangeError("bitString must be exactly 8 characters of '0' or '1'")
    this.writeUInt8(parseInt(bitString, 2))
  }

  // #region Others

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

  // #region Internal
  async [Symbol.asyncDispose](): Promise<void> {
    await this.close()
  }
}
