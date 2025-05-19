import type { FileHandle } from 'fs/promises'
import { type DirPath, FilePath, type BinaryWriteEncodings, type FilePathLikeTypes } from '../core.exports'
import { pathLikeToString } from '../lib.exports'

/**
 * A class to read binary files.
 */
export class BinaryReader {
  /**
   * The path of the binary file that will be read. This is `undefined` when you initialize this class instance using the static `fromBuffer()` method.
   */
  path: FilePath | null
  /**
   * Populated by either a `FileHandle` or `Buffer`, this is the main operator to read data.
   */
  operator: FileHandle | Buffer
  /**
   * The size of the file/buffer that the class is working upon.
   */
  size: number
  /**
   * The byte offset that all read methods will use.
   */
  private offset: number
  /**
   * Returns the byte offset used on this class.
   * - - - -
   * @returns {number}
   */
  get getOffset(): number {
    return this.offset
  }

  /**
   * Asynchronously opens a `FileHandle` to a specific file path and use it to read bytes throughout this initialized class instance.
   * - - - -
   * @param {FilePathLikeTypes} filePath The path of any binary file.
   * @returns {Promise<BinaryReader>}
   */
  static async fromFile(filePath: FilePathLikeTypes): Promise<BinaryReader> {
    const path = FilePath.of(pathLikeToString(filePath))
    if (!path.exists) throw new Error(`Provided path ${path.path} does not exists.`)
    const handler = await path.open()
    return new BinaryReader(path, handler)
  }

  /**
   * Uses a provided `Buffer` object to read its bytes throughout this initialized class instance.
   * - - - -
   * @param {Buffer} buffer The buffer that the class will use to read bytes.
   * @returns {BinaryReader}
   */
  static fromBuffer(buffer: Buffer): BinaryReader {
    return new BinaryReader(null, buffer)
  }

  /**
   * Checks the existence of the file on the provided path. `BinaryReader` classes that uses `Buffer` objects will always
   * returns `true`.
   * - - - -
   * @returns {boolean}
   */
  private checkExistence(): boolean {
    if (this.path && !Buffer.isBuffer(this.operator)) {
      const fileExists = this.path.exists
      if (!fileExists) throw new Error(`File "${this.path.path}" does not exists`)
      return true
    }
    return true
  }

  /**
   * Creates a `BinaryReader` class instance.
   * - - - -
   * @param {Exclude<FilePathLikeTypes, DirPath> | null} path The path of any binary file to be read. The `null` value can be used to manipulate `Buffer` objects.
   * @param {FileHandle | Buffer} handlerOrBuffer A `FileHandle` or `Buffer` object that will be stored on this class instance.
   * If not provided, it will be simply inherited from file/buffer.
   */
  constructor(path: Exclude<FilePathLikeTypes, DirPath> | null, handlerOrBuffer: FileHandle | Buffer) {
    if (path instanceof FilePath) this.path = path
    else if (path !== null) this.path = FilePath.of(pathLikeToString(path))
    else this.path = path

    if (Buffer.isBuffer(handlerOrBuffer)) {
      this.operator = handlerOrBuffer
      this.size = handlerOrBuffer.length
    } else {
      this.operator = handlerOrBuffer
      if (!this.path) throw new Error('BinaryReader received "FileHandle" object to process, but no file path. This error must not happen!!! Contact if this error ever be thrown at you!!!')
      this.size = this.path.statSync().size
    }
    this.offset = 0
  }

  // #region String/Buffer

  /**
   * Asynchronously reads the binary file and returns its contents as `Buffer`.
   * - - - -
   * @param {number | undefined} [allocSize] `OPTIONAL` The allocation size of the desired bytes. If `undefined`, the reader will
   * return all bytes from the file, starting by the class `offset` value.
   * @returns {Promise<Buffer>}
   */
  async read(allocSize?: number): Promise<Buffer> {
    this.checkExistence()
    if (Buffer.isBuffer(this.operator)) {
      if (allocSize !== undefined) {
        const buf = this.operator.subarray(this.offset, this.offset + allocSize)
        this.offset += allocSize
        return buf
      }
      const buffer = this.operator.subarray(this.offset)
      this.offset = 0
      return buffer
    }
    if (allocSize !== undefined) {
      const buf = Buffer.alloc(allocSize)
      await this.operator.read({ buffer: buf, position: this.offset, length: allocSize })
      this.offset += allocSize
      return buf
    }
    allocSize = this.size - this.offset
    const buf = Buffer.alloc(allocSize)
    await this.operator.read({ buffer: buf, position: this.offset, length: allocSize })
    this.offset = 0
    return buf
  }

  /**
   * Asynchronously reads the binary file and returns ASCII-decoded contents as `string`.
   * - - - -
   * @param {number | undefined} [allocSize] `OPTIONAL` The allocation size of the desired bytes. If `undefined`, the reader will
   * return all bytes from the file, starting by the class `offset` value.
   * @returns {Promise<string>}
   */
  async readASCII(allocSize?: number): Promise<string> {
    this.checkExistence()
    if (Buffer.isBuffer(this.operator)) {
      if (allocSize !== undefined) {
        const buf = this.operator.subarray(this.offset, this.offset + allocSize)
        this.offset += allocSize
        return buf.toString('ascii').replace(new RegExp(`\x00`, 'g'), '')
      }
      const buffer = this.operator.subarray(this.offset)
      this.offset = 0
      return buffer.toString('ascii').replace(new RegExp(`\x00`, 'g'), '')
    }
    if (allocSize !== undefined) {
      const buf = Buffer.alloc(allocSize)
      await this.operator.read({ buffer: buf, position: this.offset, length: allocSize })
      this.offset += allocSize
      return buf.toString('ascii').replace(new RegExp(`\x00`, 'g'), '')
    }
    allocSize = this.size - this.offset
    const buf = Buffer.alloc(allocSize)
    await this.operator.read({ buffer: buf, position: this.offset, length: allocSize })
    this.offset = 0
    return buf.toString('ascii').replace(new RegExp(`\x00`, 'g'), '')
  }

  /**
   * Asynchronously reads the binary file and returns Latin1-decoded contents as `string`.
   * - - - -
   * @param {number | undefined} [allocSize] `OPTIONAL` The allocation size of the desired bytes. If `undefined`, the reader will
   * return all bytes from the file, starting by the class `offset` value.
   * @returns {Promise<string>}
   */
  async readLatin1(allocSize?: number): Promise<string> {
    this.checkExistence()
    if (Buffer.isBuffer(this.operator)) {
      if (allocSize !== undefined) {
        const buf = this.operator.subarray(this.offset, this.offset + allocSize)
        this.offset += allocSize
        return buf.toString('latin1').replace(new RegExp(`\x00`, 'g'), '')
      }
      const buffer = this.operator.subarray(this.offset)
      this.offset = 0
      return buffer.toString('latin1').replace(new RegExp(`\x00`, 'g'), '')
    }
    if (allocSize) {
      const buf = Buffer.alloc(allocSize)
      await this.operator.read({ buffer: buf, position: this.offset, length: allocSize })
      this.offset += allocSize
      return buf.toString('latin1').replace(new RegExp(`\x00`, 'g'), '')
    }
    allocSize = this.size - this.offset
    const buf = Buffer.alloc(allocSize)
    await this.operator.read({ buffer: buf, position: this.offset, length: allocSize })
    this.offset = 0
    return buf.toString('latin1').replace(new RegExp(`\x00`, 'g'), '')
  }

  /**
   * Asynchronously reads the binary file and returns UTF8-decoded contents as `string`.
   * - - - -
   * @param {number | undefined} [allocSize] `OPTIONAL` The allocation size of the desired bytes. If `undefined`, the reader will
   * return all bytes from the file, starting by the class `offset` value.
   * @returns {Promise<string>}
   */
  async readUTF8(allocSize?: number): Promise<string> {
    this.checkExistence()
    if (Buffer.isBuffer(this.operator)) {
      if (allocSize !== undefined) {
        const buf = this.operator.subarray(this.offset, this.offset + allocSize)
        this.offset += allocSize
        return buf.toString('utf8').replace(new RegExp(`\x00`, 'g'), '')
      }
      const buffer = this.operator.subarray(this.offset)
      this.offset = 0
      return buffer.toString('utf8').replace(new RegExp(`\x00`, 'g'), '')
    }
    if (allocSize) {
      const buf = Buffer.alloc(allocSize)
      await this.operator.read({ buffer: buf, position: this.offset, length: allocSize })
      this.offset += allocSize
      return buf.toString('utf8').replace(new RegExp(`\x00`, 'g'), '')
    }
    allocSize = this.size - this.offset
    const buf = Buffer.alloc(allocSize)
    await this.operator.read({ buffer: buf, position: this.offset, length: allocSize })
    this.offset = 0
    return buf.toString('utf8').replace(new RegExp(`\x00`, 'g'), '')
  }

  /**
   * Asynchronously reads the binary file and returns HEX-decoded contents as `string`.
   * - - - -
   * @param {number | undefined} [allocSize] `OPTIONAL` The allocation size of the desired bytes. If `undefined`, the reader will
   * return all bytes from the file, starting by the class `offset` value.
   * @returns {Promise<string>}
   */
  async readHex(allocSize?: number): Promise<string> {
    this.checkExistence()
    if (Buffer.isBuffer(this.operator)) {
      if (allocSize !== undefined) {
        const buf = this.operator.subarray(this.offset, this.offset + allocSize)
        this.offset += allocSize
        return buf.toString('hex').replace(new RegExp(`\x00`, 'g'), '')
      }
      const buffer = this.operator.subarray(this.offset)
      this.offset = 0
      return buffer.toString('hex').replace(new RegExp(`\x00`, 'g'), '')
    }
    if (allocSize) {
      const buf = Buffer.alloc(allocSize)
      await this.operator.read({ buffer: buf, position: this.offset, length: allocSize })
      this.offset += allocSize
      return buf.toString('hex').replace(new RegExp(`\x00`, 'g'), '')
    }
    allocSize = this.size - this.offset
    const buf = Buffer.alloc(allocSize)
    await this.operator.read({ buffer: buf, position: this.offset, length: allocSize })
    this.offset = 0
    return buf.toString('hex').replace(new RegExp(`\x00`, 'g'), '')
  }

  /**
   * Increments the `offset` value of this class by provided `allocSize` bytes.
   * - - - -
   * @param {number} [allocSize] `OPTIONAL` The allocation size to be incremented. Default is `1`.
   * @returns {void}
   */
  padding(allocSize = 1): void {
    this.offset += allocSize
  }

  // #region Integer

  /**
   * Asynchronously reads an unsigned 8-bit integer.
   * - - - -
   * @returns {Promise<number>}
   */
  async readUInt8(): Promise<number> {
    this.checkExistence()
    if (Buffer.isBuffer(this.operator)) {
      const buffer = this.operator.subarray(this.offset, this.offset + 1)
      this.offset++
      return buffer.readUInt8()
    }
    const buf = Buffer.alloc(1)
    await this.operator.read({ buffer: buf, position: this.offset, length: 1 })
    this.offset++
    return buf.readUInt8()
  }

  /**
   * Asynchronously reads an unsigned, little-endian 16-bit integer.
   * - - - -
   * @returns {Promise<number>}
   */
  async readUInt16LE(): Promise<number> {
    this.checkExistence()
    if (Buffer.isBuffer(this.operator)) {
      const buffer = this.operator.subarray(this.offset, this.offset + 2)
      this.offset += 2
      return buffer.readUInt16LE()
    }
    const buf = Buffer.alloc(2)
    await this.operator.read({ buffer: buf, position: this.offset, length: 2 })
    this.offset += 2
    return buf.readUInt16LE()
  }

  /**
   * Asynchronously reads an unsigned, big-endian 16-bit integer.
   * - - - -
   * @returns {Promise<number>}
   */
  async readUInt16BE(): Promise<number> {
    this.checkExistence()
    if (Buffer.isBuffer(this.operator)) {
      const buffer = this.operator.subarray(this.offset, this.offset + 2)
      this.offset += 2
      return buffer.readUInt16BE()
    }
    const buf = Buffer.alloc(2)
    await this.operator.read({ buffer: buf, position: this.offset, length: 2 })
    this.offset += 2
    return buf.readUInt16BE()
  }

  /**
   * Asynchronously reads an unsigned, little-endian 24-bit integer.
   * - - - -
   * @returns {Promise<number>}
   */
  async readUInt24LE(): Promise<number> {
    this.checkExistence()
    if (Buffer.isBuffer(this.operator)) {
      const buffer = this.operator.subarray(this.offset, this.offset + 3)
      this.offset += 3
      return buffer.readUIntLE(0, 3)
    }
    const buf = Buffer.alloc(3)
    await this.operator.read({ buffer: buf, position: this.offset, length: 3 })
    this.offset += 3
    return buf.readUIntLE(0, 3)
  }

  /**
   * Asynchronously reads an unsigned, big-endian 24-bit integer.
   * - - - -
   * @returns {Promise<number>}
   */
  async readUInt24BE(): Promise<number> {
    this.checkExistence()
    if (Buffer.isBuffer(this.operator)) {
      const buffer = this.operator.subarray(this.offset, this.offset + 3)
      this.offset += 3
      return buffer.readUIntBE(0, 3)
    }
    const buf = Buffer.alloc(3)
    await this.operator.read({ buffer: buf, position: this.offset, length: 3 })
    this.offset += 3
    return buf.readUIntBE(0, 3)
  }

  /**
   * Asynchronously reads an unsigned, little-endian 32-bit integer.
   * - - - -
   * @returns {Promise<number>}
   */
  async readUInt32LE(): Promise<number> {
    this.checkExistence()
    if (Buffer.isBuffer(this.operator)) {
      const buffer = this.operator.subarray(this.offset, this.offset + 4)
      this.offset += 4
      return buffer.readUInt32LE()
    }
    const buf = Buffer.alloc(4)
    await this.operator.read({ buffer: buf, position: this.offset, length: 4 })
    this.offset += 4
    return buf.readUInt32LE()
  }

  /**
   * Asynchronously reads an unsigned, big-endian 32-bit integer.
   * - - - -
   * @returns {Promise<number>}
   */
  async readUInt32BE(): Promise<number> {
    this.checkExistence()
    if (Buffer.isBuffer(this.operator)) {
      const buffer = this.operator.subarray(this.offset, this.offset + 4)
      this.offset += 4
      return buffer.readUInt32BE()
    }
    const buf = Buffer.alloc(4)
    await this.operator.read({ buffer: buf, position: this.offset, length: 4 })
    this.offset += 4
    return buf.readUInt32BE()
  }

  /**
   * Asynchronously reads a signed 8-bit integer.
   * - - - -
   * @returns {Promise<number>}
   */
  async readInt8(): Promise<number> {
    this.checkExistence()
    if (Buffer.isBuffer(this.operator)) {
      const buffer = this.operator.subarray(this.offset, this.offset + 1)
      this.offset++
      return buffer.readInt8()
    }
    const buf = Buffer.alloc(1)
    await this.operator.read({ buffer: buf, position: this.offset, length: 1 })
    this.offset++
    return buf.readInt8()
  }

  /**
   * Asynchronously reads a signed, little-endian 16-bit integer.
   * - - - -
   * @returns {Promise<number>}
   */
  async readInt16LE(): Promise<number> {
    this.checkExistence()
    if (Buffer.isBuffer(this.operator)) {
      const buffer = this.operator.subarray(this.offset, this.offset + 2)
      this.offset += 2
      return buffer.readInt16LE()
    }
    const buf = Buffer.alloc(2)
    await this.operator.read({ buffer: buf, position: this.offset, length: 2 })
    this.offset += 2
    return buf.readInt16LE()
  }

  /**
   * Asynchronously reads a signed, big-endian 16-bit integer.
   * - - - -
   * @returns {Promise<number>}
   */
  async readInt16BE(): Promise<number> {
    this.checkExistence()
    if (Buffer.isBuffer(this.operator)) {
      const buffer = this.operator.subarray(this.offset, this.offset + 2)
      this.offset += 2
      return buffer.readUInt16BE()
    }
    const buf = Buffer.alloc(2)
    await this.operator.read({ buffer: buf, position: this.offset, length: 2 })
    this.offset += 2
    return buf.readInt16BE()
  }

  /**
   * Asynchronously reads a signed, little-endian 24-bit integer.
   * - - - -
   * @returns {Promise<number>}
   */
  async readInt24LE(): Promise<number> {
    this.checkExistence()
    if (Buffer.isBuffer(this.operator)) {
      const buffer = this.operator.subarray(this.offset, this.offset + 3)
      this.offset += 3
      return buffer.readIntLE(0, 3)
    }
    const buf = Buffer.alloc(3)
    await this.operator.read({ buffer: buf, position: this.offset, length: 3 })
    this.offset += 3
    return buf.readIntLE(0, 3)
  }

  /**
   * Asynchronously reads a signed, big-endian 24-bit integer.
   * - - - -
   * @returns {Promise<number>}
   */
  async readInt24BE(): Promise<number> {
    this.checkExistence()
    if (Buffer.isBuffer(this.operator)) {
      const buffer = this.operator.subarray(this.offset, this.offset + 3)
      this.offset += 3
      return buffer.readUIntBE(0, 3)
    }
    const buf = Buffer.alloc(3)
    await this.operator.read({ buffer: buf, position: this.offset, length: 3 })
    this.offset += 3
    return buf.readIntBE(0, 3)
  }

  /**
   * Asynchronously reads a signed, little-endian 32-bit integer.
   * - - - -
   * @returns {Promise<number>}
   */
  async readInt32LE(): Promise<number> {
    this.checkExistence()
    if (Buffer.isBuffer(this.operator)) {
      const buffer = this.operator.subarray(this.offset, this.offset + 4)
      this.offset += 4
      return buffer.readUInt32LE()
    }
    const buf = Buffer.alloc(4)
    await this.operator.read({ buffer: buf, position: this.offset, length: 4 })
    this.offset += 4
    return buf.readInt32LE()
  }

  /**
   * Asynchronously reads a signed, big-endian 32-bit integer.
   * - - - -
   * @returns {Promise<number>}
   */
  async readInt32BE(): Promise<number> {
    this.checkExistence()
    if (Buffer.isBuffer(this.operator)) {
      const buffer = this.operator.subarray(this.offset, this.offset + 4)
      this.offset += 4
      return buffer.readUInt32BE()
    }
    const buf = Buffer.alloc(4)
    await this.operator.read({ buffer: buf, position: this.offset, length: 4 })
    this.offset += 4
    return buf.readInt32BE()
  }

  // #region Float/Double

  /**
   * Asynchronously reads a float number value (32-bit) in little-endian byte order.
   * - - - -
   * @returns {Promise<number>}
   */
  async readFloatLE(): Promise<number> {
    this.checkExistence()
    if (Buffer.isBuffer(this.operator)) {
      const buffer = this.operator.subarray(this.offset, this.offset + 4)
      this.offset += 4
      return buffer.readFloatLE()
    }
    const buf = Buffer.alloc(4)
    await this.operator.read({ buffer: buf, position: this.offset, length: 4 })
    this.offset += 4
    return buf.readFloatLE()
  }

  /**
   * Asynchronously reads a float number value (32-bit) in big-endian byte order.
   * - - - -
   * @returns {Promise<number>}
   */
  async readFloatBE(): Promise<number> {
    this.checkExistence()
    if (Buffer.isBuffer(this.operator)) {
      const buffer = this.operator.subarray(this.offset, this.offset + 4)
      this.offset += 4
      return buffer.readFloatBE()
    }
    const buf = Buffer.alloc(4)
    await this.operator.read({ buffer: buf, position: this.offset, length: 4 })
    this.offset += 4
    return buf.readFloatBE()
  }

  /**
   * Asynchronously reads a double float number value (64-bit) in little-endian byte order.
   * - - - -
   * @returns {Promise<number>}
   */
  async readDoubleLE(): Promise<number> {
    this.checkExistence()
    if (Buffer.isBuffer(this.operator)) {
      const buffer = this.operator.subarray(this.offset, this.offset + 8)
      this.offset += 8
      return buffer.readDoubleLE()
    }
    const buf = Buffer.alloc(8)
    await this.operator.read({ buffer: buf, position: this.offset, length: 8 })
    this.offset += 8
    return buf.readDoubleLE()
  }

  /**
   * Asynchronously reads a double float number value (64-bit) in big-endian byte order.
   * - - - -
   * @returns {Promise<number>}
   */
  async readDoubleBE(): Promise<number> {
    this.checkExistence()
    if (Buffer.isBuffer(this.operator)) {
      const buffer = this.operator.subarray(this.offset, this.offset + 8)
      this.offset += 8
      return buffer.readDoubleBE()
    }
    const buf = Buffer.alloc(8)
    await this.operator.read({ buffer: buf, position: this.offset, length: 8 })
    this.offset += 8
    return buf.readDoubleBE()
  }

  /**
   * Asynchronously reads an unsigned, little-endian 64-bit integer.
   * - - - -
   * @returns {Promise<bigint>}
   */
  async readUInt64LE(): Promise<bigint> {
    this.checkExistence()
    if (Buffer.isBuffer(this.operator)) {
      const buffer = this.operator.subarray(this.offset, this.offset + 8)
      this.offset += 8
      return buffer.readBigUInt64LE()
    }
    const buf = Buffer.alloc(8)
    await this.operator.read({ buffer: buf, position: this.offset, length: 8 })
    this.offset += 8
    return buf.readBigUInt64LE()
  }

  /**
   * Asynchronously reads an unsigned, big-endian 64-bit integer.
   * - - - -
   * @returns {Promise<bigint>}
   */
  async readUInt64BE(): Promise<bigint> {
    this.checkExistence()
    if (Buffer.isBuffer(this.operator)) {
      const buffer = this.operator.subarray(this.offset, this.offset + 8)
      this.offset += 8
      return buffer.readBigUInt64BE()
    }
    const buf = Buffer.alloc(8)
    await this.operator.read({ buffer: buf, position: this.offset, length: 8 })
    this.offset += 8
    return buf.readBigUInt64BE()
  }

  /**
   * Asynchronously reads an unsigned, big-endian 64-bit integer.
   * - - - -
   * @returns {Promise<bigint>}
   */
  async readInt64LE(): Promise<bigint> {
    this.checkExistence()
    if (Buffer.isBuffer(this.operator)) {
      const buffer = this.operator.subarray(this.offset, this.offset + 8)
      this.offset += 8
      return buffer.readBigInt64LE()
    }
    const buf = Buffer.alloc(8)
    await this.operator.read({ buffer: buf, position: this.offset, length: 8 })
    this.offset += 8
    return buf.readBigInt64LE()
  }

  /**
   * Asynchronously reads an unsigned, big-endian 64-bit integer.
   * - - - -
   * @returns {Promise<bigint>}
   */
  async readInt64BE(): Promise<bigint> {
    this.checkExistence()
    if (Buffer.isBuffer(this.operator)) {
      const buffer = this.operator.subarray(this.offset, this.offset + 8)
      this.offset += 8
      return buffer.readBigInt64BE()
    }
    const buf = Buffer.alloc(8)
    await this.operator.read({ buffer: buf, position: this.offset, length: 8 })
    this.offset += 8
    return buf.readBigInt64BE()
  }

  // #region Typos

  /**
   * _Alias to `read` with pre-defined utf-8 encoding value._
   *
   * Asynchronously reads the binary file and returns decoded contents as `string` based on the provided encoding.
   * - - - -
   * @param {number | undefined} [allocSize] `OPTIONAL` The allocation size of the desired bytes. If `undefined`, the reader will
   * return all bytes from the file, starting by the class `offset` value.
   * @param {BinaryWriteEncodings} [encoding] `OPTIONAL` The encoding used to decode the buffer. If `undefined`, the reader will decode the buffer as `utf8`.
   * @returns {Promise<string>}
   */
  async readString(allocSize?: number, encoding: BinaryWriteEncodings = 'utf8'): Promise<string> {
    const enc = encoding === 'latin-1' ? 'latin1' : encoding
    this.checkExistence()
    if (Buffer.isBuffer(this.operator)) {
      if (allocSize !== undefined) {
        const buf = this.operator.subarray(this.offset, this.offset + allocSize)
        this.offset += allocSize
        return buf.toString(enc).replace(new RegExp(`\x00`, 'g'), '')
      }
      const buffer = this.operator.subarray(this.offset)
      this.offset = 0
      return buffer.toString(enc).replace(new RegExp(`\x00`, 'g'), '')
    }
    if (allocSize) {
      const buf = Buffer.alloc(allocSize)
      await this.operator.read({ buffer: buf, position: this.offset, length: allocSize })
      this.offset += allocSize
      return buf.toString(enc).replace(new RegExp(`\x00`, 'g'), '')
    }
    allocSize = this.size - this.offset
    const buf = Buffer.alloc(allocSize)
    await this.operator.read({ buffer: buf, position: this.offset, length: allocSize })
    this.offset = 0
    return buf.toString(enc).replace(`\x00`, '')
  }

  /**
   * _Alias to `readUInt8`._
   *
   * Asynchronously reads an unsigned 8-bit value, evaluated as `boolean`.
   * - - - -
   * @returns {Promise<boolean>}
   */
  async readBoolean(): Promise<boolean> {
    this.checkExistence()
    if (Buffer.isBuffer(this.operator)) {
      const buffer = this.operator.subarray(this.offset, this.offset + 1)
      this.offset++
      const value = Boolean(buffer.readUInt8())
      return value
    }
    const buf = Buffer.alloc(1)
    await this.operator.read({ buffer: buf, position: this.offset, length: 1 })
    this.offset++
    const value = Boolean(buf.readUInt8())
    return value
  }

  /**
   * Changes the byte offset used on this class.
   * - - - -
   * @param {number} offset The new byte offset.
   * @returns {void}
   */
  seek(offset: number) {
    this.offset = offset
  }

  /**
   * Closes the `FileHandle` used on this class.
   * - - - -
   * @returns {Promise<void>}
   */
  async close(): Promise<void> {
    if (!Buffer.isBuffer(this.operator)) await this.operator.close()
  }

  /**
   * Returns the length of the content instantiated by this class.
   * - - - -
   * @returns {number}
   */
  get length(): number {
    return this.size
  }
}
