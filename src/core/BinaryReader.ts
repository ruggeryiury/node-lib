import type { FileHandle } from 'fs/promises'
import { type DirPath, FilePath, type BinaryWriteEncodings, type FilePathLikeTypes, BinaryWriter } from '../core.exports'
import { pathLikeToString } from '../lib.exports'
import { inspect } from 'util'

export type BinaryReaderSeekMethods = 'start' | 'current' | 'end'
export type BitsArray = [0 | 1, 0 | 1, 0 | 1, 0 | 1, 0 | 1, 0 | 1, 0 | 1, 0 | 1]
export type BitsBooleanArray = [boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean]
export type BinaryReaderOperator = 'fileHandle' | 'buffer'

/**
 * A class with methods to read binary files programmatically, using `FileHandle` operators (when pointing into an existing file) or reading from a `Buffer` object.
 */
export class BinaryReader {
  /**
   * The path of the binary file that will be read. This property is `null` when you initialize this class instance using the static `fromBuffer()` method.
   */
  readonly path: FilePath | null
  /**
   * Populated by either a `FileHandle` or `Buffer`, this is the main operator to read data.
   */
  private _operator: FileHandle | Buffer
  /**
   * The size of the file/buffer that the class is working upon.
   */
  private _length: number
  /**
   * The size of the file/buffer that the class is working upon.
   */
  get length(): number {
    return this._length
  }
  /**
   * The byte offset that all read methods will start reading from.
   */
  private _offset: number
  /**
   * The byte offset that all read methods will start reading from.
   */
  get offset(): number {
    return this._offset
  }
  /**
   * The byte offset that all read methods will start reading from.
   *
   * _Functional alias to `BinaryReader.offset()`._
   */
  tell(): number {
    return this._offset
  }
  /**
   * True is the file handle has already been closed, otherwise false.
   */
  private _isClosed: boolean = false
  /**
   * True is the file handle has already been closed, otherwise false.
   */
  get isClosed(): boolean {
    return this._isClosed
  }

  /**
   * Returns the operator type of this class instance.
   * - - - -
   * @returns {BinaryReaderOperator}
   */
  getOperatorType(): BinaryReaderOperator {
    if (Buffer.isBuffer(this._operator)) return 'buffer'
    return 'fileHandle'
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
  private _checkExistence(): boolean {
    if (this.path && !Buffer.isBuffer(this._operator)) {
      const fileExists = this.path.exists
      if (!fileExists) throw new Error(`File "${this.path.path}" does not exists`)
      return true
    }
    return true
  }

  /**
   * Checks if the `FileHandle` object has already been closed.
   */
  private _checkIfFileHandleIsClosed(): boolean {
    if (this.isClosed) throw new Error('FileHandle object used by BinaryReader has already been closed.')
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
      this._operator = handlerOrBuffer
      this._length = handlerOrBuffer.length
    } else {
      this._operator = handlerOrBuffer
      if (!this.path) throw new Error('BinaryReader received "FileHandle" object to process, but no file path. This error must not happen!!! Contact if this error ever be thrown at you!!!')
      this._length = this.path.statSync().size
    }
    this._offset = 0
  }

  /**
   * Closes the `FileHandle` object instantiated by the class.
   * - - - -
   * @returns {Promise<void>}
   */
  async close(): Promise<void> {
    if (!this._isClosed) {
      if (!Buffer.isBuffer(this._operator)) await this._operator.close()
      else this._operator = Buffer.alloc(0)
    }

    this._isClosed = true
  }

  // #region String/Buffer

  /**
   * Reads the binary file and returns its contents as `Buffer`.
   * - - - -
   * @param {number | undefined} [allocSize] `OPTIONAL` The allocation size of the desired bytes. If `undefined`, the reader will
   * return all bytes from the file, starting by the class `offset` value.
   * @returns {Promise<Buffer>}
   */
  async read(allocSize?: number): Promise<Buffer> {
    this._checkExistence()
    this._checkIfFileHandleIsClosed()
    if (this.isClosed) throw new Error('File Handle is already closed')
    if (Buffer.isBuffer(this._operator)) {
      if (allocSize !== undefined) {
        const buf = this._operator.subarray(this._offset, this._offset + allocSize)
        this._offset += allocSize
        return buf
      }
      const buffer = this._operator.subarray(this._offset)
      this._offset = 0
      return buffer
    }
    if (allocSize !== undefined) {
      const buf = Buffer.alloc(allocSize)
      await this._operator.read({ buffer: buf, position: this._offset, length: allocSize })
      this._offset += allocSize
      return buf
    }
    allocSize = this._length - this._offset
    const buf = Buffer.alloc(allocSize)
    await this._operator.read({ buffer: buf, position: this._offset, length: allocSize })
    this._offset = 0
    return buf
  }

  /**
   * Reads the binary file and returns ASCII-decoded contents as `string`.
   * - - - -
   * @param {number | undefined} [allocSize] `OPTIONAL` The allocation size of the desired bytes. If `undefined`, the reader will
   * return all bytes from the file, starting by the class `offset` value.
   * @returns {Promise<string>}
   */
  async readASCII(allocSize?: number): Promise<string> {
    this._checkExistence()
    this._checkIfFileHandleIsClosed()
    if (Buffer.isBuffer(this._operator)) {
      if (allocSize !== undefined) {
        const buf = this._operator.subarray(this._offset, this._offset + allocSize)
        this._offset += allocSize
        return buf.toString('ascii').replace(new RegExp(`\x00`, 'g'), '')
      }
      const buffer = this._operator.subarray(this._offset)
      this._offset = 0
      return buffer.toString('ascii').replace(new RegExp(`\x00`, 'g'), '')
    }
    if (allocSize !== undefined) {
      const buf = Buffer.alloc(allocSize)
      await this._operator.read({ buffer: buf, position: this._offset, length: allocSize })
      this._offset += allocSize
      return buf.toString('ascii').replace(new RegExp(`\x00`, 'g'), '')
    }
    allocSize = this._length - this._offset
    const buf = Buffer.alloc(allocSize)
    await this._operator.read({ buffer: buf, position: this._offset, length: allocSize })
    this._offset = 0
    return buf.toString('ascii').replace(new RegExp(`\x00`, 'g'), '')
  }

  /**
   * Reads the binary file and returns Latin1-decoded contents as `string`.
   * - - - -
   * @param {number | undefined} [allocSize] `OPTIONAL` The allocation size of the desired bytes. If `undefined`, the reader will
   * return all bytes from the file, starting by the class `offset` value.
   * @returns {Promise<string>}
   */
  async readLatin1(allocSize?: number): Promise<string> {
    this._checkExistence()
    this._checkIfFileHandleIsClosed()
    if (Buffer.isBuffer(this._operator)) {
      if (allocSize !== undefined) {
        const buf = this._operator.subarray(this._offset, this._offset + allocSize)
        this._offset += allocSize
        return buf.toString('latin1').replace(new RegExp(`\x00`, 'g'), '')
      }
      const buffer = this._operator.subarray(this._offset)
      this._offset = 0
      return buffer.toString('latin1').replace(new RegExp(`\x00`, 'g'), '')
    }
    if (allocSize) {
      const buf = Buffer.alloc(allocSize)
      await this._operator.read({ buffer: buf, position: this._offset, length: allocSize })
      this._offset += allocSize
      return buf.toString('latin1').replace(new RegExp(`\x00`, 'g'), '')
    }
    allocSize = this._length - this._offset
    const buf = Buffer.alloc(allocSize)
    await this._operator.read({ buffer: buf, position: this._offset, length: allocSize })
    this._offset = 0
    return buf.toString('latin1').replace(new RegExp(`\x00`, 'g'), '')
  }

  /**
   * Reads the binary file and returns UTF8-decoded contents as `string`.
   * - - - -
   * @param {number | undefined} [allocSize] `OPTIONAL` The allocation size of the desired bytes. If `undefined`, the reader will
   * return all bytes from the file, starting by the class `offset` value.
   * @returns {Promise<string>}
   */
  async readUTF8(allocSize?: number): Promise<string> {
    this._checkExistence()
    this._checkIfFileHandleIsClosed()
    if (Buffer.isBuffer(this._operator)) {
      if (allocSize !== undefined) {
        const buf = this._operator.subarray(this._offset, this._offset + allocSize)
        this._offset += allocSize
        return buf.toString('utf8').replace(new RegExp(`\x00`, 'g'), '')
      }
      const buffer = this._operator.subarray(this._offset)
      this._offset = 0
      return buffer.toString('utf8').replace(new RegExp(`\x00`, 'g'), '')
    }
    if (allocSize) {
      const buf = Buffer.alloc(allocSize)
      await this._operator.read({ buffer: buf, position: this._offset, length: allocSize })
      this._offset += allocSize
      return buf.toString('utf8').replace(new RegExp(`\x00`, 'g'), '')
    }
    allocSize = this._length - this._offset
    const buf = Buffer.alloc(allocSize)
    await this._operator.read({ buffer: buf, position: this._offset, length: allocSize })
    this._offset = 0
    return buf.toString('utf8').replace(new RegExp(`\x00`, 'g'), '')
  }

  /**
   * Reads the binary file and returns HEX-decoded contents as `string`.
   * - - - -
   * @param {number | undefined} [allocSize] `OPTIONAL` The allocation size of the desired bytes. If `undefined`, the reader will
   * return all bytes from the file, starting by the class `offset` value.
   * @param {boolean} [prefix] `OPTIONAL` Adds a `0x` prefix on the string. Default if `true`.
   * @param {boolean} [uppercased] `OPTIONAL` Uppercase all letters of the hexadecimal string. Default if `false`.
   * @returns {Promise<string>}
   */
  async readHex(allocSize?: number, prefix = true, uppercased = false): Promise<string> {
    this._checkExistence()
    this._checkIfFileHandleIsClosed()
    if (Buffer.isBuffer(this._operator)) {
      if (allocSize !== undefined) {
        const buf = this._operator.subarray(this._offset, this._offset + allocSize)
        this._offset += allocSize
        const value = buf.toString('hex').replace(new RegExp(`\x00`, 'g'), '')
        return uppercased ? `${prefix ? '0x' : ''}${value.toUpperCase()}` : `${prefix ? '0x' : ''}${value}`
      }
      const buf = this._operator.subarray(this._offset)
      this._offset = 0
      const value = buf.toString('hex').replace(new RegExp(`\x00`, 'g'), '')
      return uppercased ? `${prefix ? '0x' : ''}${value.toUpperCase()}` : `${prefix ? '0x' : ''}${value}`
    }
    if (allocSize) {
      const buf = Buffer.alloc(allocSize)
      await this._operator.read({ buffer: buf, position: this._offset, length: allocSize })
      this._offset += allocSize
      const value = buf.toString('hex').replace(new RegExp(`\x00`, 'g'), '')
      return uppercased ? `${prefix ? '0x' : ''}${value.toUpperCase()}` : `${prefix ? '0x' : ''}${value}`
    }
    allocSize = this._length - this._offset
    const buf = Buffer.alloc(allocSize)
    await this._operator.read({ buffer: buf, position: this._offset, length: allocSize })
    this._offset = 0
    const value = buf.toString('hex').replace(new RegExp(`\x00`, 'g'), '')
    return uppercased ? `${prefix ? '0x' : ''}${value.toUpperCase()}` : `${prefix ? '0x' : ''}${value}`
  }

  /**
   * Increments the `offset` value of this class by provided `allocSize` bytes.
   * - - - -
   * @param {number} [allocSize] `OPTIONAL` The allocation size to be incremented. Default is `1`.
   * @returns {void}
   */
  padding(allocSize = 1): void {
    this._offset += allocSize
  }

  // #region Integer

  /**
   * Reads an unsigned 8-bit integer.
   * - - - -
   * @returns {Promise<number>}
   */
  async readUInt8(): Promise<number> {
    this._checkExistence()
    this._checkIfFileHandleIsClosed()
    if (Buffer.isBuffer(this._operator)) {
      const buffer = this._operator.subarray(this._offset, this._offset + 1)
      this._offset++
      return buffer.readUInt8()
    }
    const buf = Buffer.alloc(1)
    await this._operator.read({ buffer: buf, position: this._offset, length: 1 })
    this._offset++
    return buf.readUInt8()
  }

  /**
   * Reads an unsigned, little-endian 16-bit integer.
   * - - - -
   * @returns {Promise<number>}
   */
  async readUInt16LE(): Promise<number> {
    this._checkExistence()
    this._checkIfFileHandleIsClosed()
    if (Buffer.isBuffer(this._operator)) {
      const buffer = this._operator.subarray(this._offset, this._offset + 2)
      this._offset += 2
      return buffer.readUInt16LE()
    }
    const buf = Buffer.alloc(2)
    await this._operator.read({ buffer: buf, position: this._offset, length: 2 })
    this._offset += 2
    return buf.readUInt16LE()
  }

  /**
   * Reads an unsigned, big-endian 16-bit integer.
   * - - - -
   * @returns {Promise<number>}
   */
  async readUInt16BE(): Promise<number> {
    this._checkExistence()
    this._checkIfFileHandleIsClosed()
    if (Buffer.isBuffer(this._operator)) {
      const buffer = this._operator.subarray(this._offset, this._offset + 2)
      this._offset += 2
      return buffer.readUInt16BE()
    }
    const buf = Buffer.alloc(2)
    await this._operator.read({ buffer: buf, position: this._offset, length: 2 })
    this._offset += 2
    return buf.readUInt16BE()
  }

  /**
   * Reads an unsigned, little-endian 24-bit integer.
   * - - - -
   * @returns {Promise<number>}
   */
  async readUInt24LE(): Promise<number> {
    this._checkExistence()
    this._checkIfFileHandleIsClosed()
    if (Buffer.isBuffer(this._operator)) {
      const buffer = this._operator.subarray(this._offset, this._offset + 3)
      this._offset += 3
      return buffer.readUIntLE(0, 3)
    }
    const buf = Buffer.alloc(3)
    await this._operator.read({ buffer: buf, position: this._offset, length: 3 })
    this._offset += 3
    return buf.readUIntLE(0, 3)
  }

  /**
   * Reads an unsigned, big-endian 24-bit integer.
   * - - - -
   * @returns {Promise<number>}
   */
  async readUInt24BE(): Promise<number> {
    this._checkExistence()
    this._checkIfFileHandleIsClosed()
    if (Buffer.isBuffer(this._operator)) {
      const buffer = this._operator.subarray(this._offset, this._offset + 3)
      this._offset += 3
      return buffer.readUIntBE(0, 3)
    }
    const buf = Buffer.alloc(3)
    await this._operator.read({ buffer: buf, position: this._offset, length: 3 })
    this._offset += 3
    return buf.readUIntBE(0, 3)
  }

  /**
   * Reads an unsigned, little-endian 32-bit integer.
   * - - - -
   * @returns {Promise<number>}
   */
  async readUInt32LE(): Promise<number> {
    this._checkExistence()
    this._checkIfFileHandleIsClosed()
    if (Buffer.isBuffer(this._operator)) {
      const buffer = this._operator.subarray(this._offset, this._offset + 4)
      this._offset += 4
      return buffer.readUInt32LE()
    }
    const buf = Buffer.alloc(4)
    await this._operator.read({ buffer: buf, position: this._offset, length: 4 })
    this._offset += 4
    return buf.readUInt32LE()
  }

  /**
   * Reads an unsigned, big-endian 32-bit integer.
   * - - - -
   * @returns {Promise<number>}
   */
  async readUInt32BE(): Promise<number> {
    this._checkExistence()
    this._checkIfFileHandleIsClosed()
    if (Buffer.isBuffer(this._operator)) {
      const buffer = this._operator.subarray(this._offset, this._offset + 4)
      this._offset += 4
      return buffer.readUInt32BE()
    }
    const buf = Buffer.alloc(4)
    await this._operator.read({ buffer: buf, position: this._offset, length: 4 })
    this._offset += 4
    return buf.readUInt32BE()
  }

  /**
   * Reads a signed 8-bit integer.
   * - - - -
   * @returns {Promise<number>}
   */
  async readInt8(): Promise<number> {
    this._checkExistence()
    this._checkIfFileHandleIsClosed()
    if (Buffer.isBuffer(this._operator)) {
      const buffer = this._operator.subarray(this._offset, this._offset + 1)
      this._offset++
      return buffer.readInt8()
    }
    const buf = Buffer.alloc(1)
    await this._operator.read({ buffer: buf, position: this._offset, length: 1 })
    this._offset++
    return buf.readInt8()
  }

  /**
   * Reads a signed, little-endian 16-bit integer.
   * - - - -
   * @returns {Promise<number>}
   */
  async readInt16LE(): Promise<number> {
    this._checkExistence()
    this._checkIfFileHandleIsClosed()
    if (Buffer.isBuffer(this._operator)) {
      const buffer = this._operator.subarray(this._offset, this._offset + 2)
      this._offset += 2
      return buffer.readInt16LE()
    }
    const buf = Buffer.alloc(2)
    await this._operator.read({ buffer: buf, position: this._offset, length: 2 })
    this._offset += 2
    return buf.readInt16LE()
  }

  /**
   * Reads a signed, big-endian 16-bit integer.
   * - - - -
   * @returns {Promise<number>}
   */
  async readInt16BE(): Promise<number> {
    this._checkExistence()
    this._checkIfFileHandleIsClosed()
    if (Buffer.isBuffer(this._operator)) {
      const buffer = this._operator.subarray(this._offset, this._offset + 2)
      this._offset += 2
      return buffer.readUInt16BE()
    }
    const buf = Buffer.alloc(2)
    await this._operator.read({ buffer: buf, position: this._offset, length: 2 })
    this._offset += 2
    return buf.readInt16BE()
  }

  /**
   * Reads a signed, little-endian 24-bit integer.
   * - - - -
   * @returns {Promise<number>}
   */
  async readInt24LE(): Promise<number> {
    this._checkExistence()
    this._checkIfFileHandleIsClosed()
    if (Buffer.isBuffer(this._operator)) {
      const buffer = this._operator.subarray(this._offset, this._offset + 3)
      this._offset += 3
      return buffer.readIntLE(0, 3)
    }
    const buf = Buffer.alloc(3)
    await this._operator.read({ buffer: buf, position: this._offset, length: 3 })
    this._offset += 3
    return buf.readIntLE(0, 3)
  }

  /**
   * Reads a signed, big-endian 24-bit integer.
   * - - - -
   * @returns {Promise<number>}
   */
  async readInt24BE(): Promise<number> {
    this._checkExistence()
    this._checkIfFileHandleIsClosed()
    if (Buffer.isBuffer(this._operator)) {
      const buffer = this._operator.subarray(this._offset, this._offset + 3)
      this._offset += 3
      return buffer.readUIntBE(0, 3)
    }
    const buf = Buffer.alloc(3)
    await this._operator.read({ buffer: buf, position: this._offset, length: 3 })
    this._offset += 3
    return buf.readIntBE(0, 3)
  }

  /**
   * Reads a signed, little-endian 32-bit integer.
   * - - - -
   * @returns {Promise<number>}
   */
  async readInt32LE(): Promise<number> {
    this._checkExistence()
    this._checkIfFileHandleIsClosed()
    if (Buffer.isBuffer(this._operator)) {
      const buffer = this._operator.subarray(this._offset, this._offset + 4)
      this._offset += 4
      return buffer.readUInt32LE()
    }
    const buf = Buffer.alloc(4)
    await this._operator.read({ buffer: buf, position: this._offset, length: 4 })
    this._offset += 4
    return buf.readInt32LE()
  }

  /**
   * Reads a signed, big-endian 32-bit integer.
   * - - - -
   * @returns {Promise<number>}
   */
  async readInt32BE(): Promise<number> {
    this._checkExistence()
    this._checkIfFileHandleIsClosed()
    if (Buffer.isBuffer(this._operator)) {
      const buffer = this._operator.subarray(this._offset, this._offset + 4)
      this._offset += 4
      return buffer.readUInt32BE()
    }
    const buf = Buffer.alloc(4)
    await this._operator.read({ buffer: buf, position: this._offset, length: 4 })
    this._offset += 4
    return buf.readInt32BE()
  }

  // #region Float/Double

  /**
   * Reads a float number value (32-bit) in little-endian byte order.
   * - - - -
   * @returns {Promise<number>}
   */
  async readFloatLE(): Promise<number> {
    this._checkExistence()
    this._checkIfFileHandleIsClosed()
    if (Buffer.isBuffer(this._operator)) {
      const buffer = this._operator.subarray(this._offset, this._offset + 4)
      this._offset += 4
      return buffer.readFloatLE()
    }
    const buf = Buffer.alloc(4)
    await this._operator.read({ buffer: buf, position: this._offset, length: 4 })
    this._offset += 4
    return buf.readFloatLE()
  }

  /**
   * Reads a float number value (32-bit) in big-endian byte order.
   * - - - -
   * @returns {Promise<number>}
   */
  async readFloatBE(): Promise<number> {
    this._checkExistence()
    this._checkIfFileHandleIsClosed()
    if (Buffer.isBuffer(this._operator)) {
      const buffer = this._operator.subarray(this._offset, this._offset + 4)
      this._offset += 4
      return buffer.readFloatBE()
    }
    const buf = Buffer.alloc(4)
    await this._operator.read({ buffer: buf, position: this._offset, length: 4 })
    this._offset += 4
    return buf.readFloatBE()
  }

  /**
   * Reads a double float number value (64-bit) in little-endian byte order.
   * - - - -
   * @returns {Promise<number>}
   */
  async readDoubleLE(): Promise<number> {
    this._checkExistence()
    this._checkIfFileHandleIsClosed()
    if (Buffer.isBuffer(this._operator)) {
      const buffer = this._operator.subarray(this._offset, this._offset + 8)
      this._offset += 8
      return buffer.readDoubleLE()
    }
    const buf = Buffer.alloc(8)
    await this._operator.read({ buffer: buf, position: this._offset, length: 8 })
    this._offset += 8
    return buf.readDoubleLE()
  }

  /**
   * Reads a double float number value (64-bit) in big-endian byte order.
   * - - - -
   * @returns {Promise<number>}
   */
  async readDoubleBE(): Promise<number> {
    this._checkExistence()
    this._checkIfFileHandleIsClosed()
    if (Buffer.isBuffer(this._operator)) {
      const buffer = this._operator.subarray(this._offset, this._offset + 8)
      this._offset += 8
      return buffer.readDoubleBE()
    }
    const buf = Buffer.alloc(8)
    await this._operator.read({ buffer: buf, position: this._offset, length: 8 })
    this._offset += 8
    return buf.readDoubleBE()
  }

  // #region BigInts

  /**
   * Reads an unsigned, little-endian 64-bit integer.
   * - - - -
   * @returns {Promise<bigint>}
   */
  async readUInt64LE(): Promise<bigint> {
    this._checkExistence()
    this._checkIfFileHandleIsClosed()
    if (Buffer.isBuffer(this._operator)) {
      const buffer = this._operator.subarray(this._offset, this._offset + 8)
      this._offset += 8
      return buffer.readBigUInt64LE()
    }
    const buf = Buffer.alloc(8)
    await this._operator.read({ buffer: buf, position: this._offset, length: 8 })
    this._offset += 8
    return buf.readBigUInt64LE()
  }

  /**
   * Reads an unsigned, big-endian 64-bit integer.
   * - - - -
   * @returns {Promise<bigint>}
   */
  async readUInt64BE(): Promise<bigint> {
    this._checkExistence()
    this._checkIfFileHandleIsClosed()
    if (Buffer.isBuffer(this._operator)) {
      const buffer = this._operator.subarray(this._offset, this._offset + 8)
      this._offset += 8
      return buffer.readBigUInt64BE()
    }
    const buf = Buffer.alloc(8)
    await this._operator.read({ buffer: buf, position: this._offset, length: 8 })
    this._offset += 8
    return buf.readBigUInt64BE()
  }

  /**
   * Reads an unsigned, big-endian 64-bit integer.
   * - - - -
   * @returns {Promise<bigint>}
   */
  async readInt64LE(): Promise<bigint> {
    this._checkExistence()
    this._checkIfFileHandleIsClosed()
    if (Buffer.isBuffer(this._operator)) {
      const buffer = this._operator.subarray(this._offset, this._offset + 8)
      this._offset += 8
      return buffer.readBigInt64LE()
    }
    const buf = Buffer.alloc(8)
    await this._operator.read({ buffer: buf, position: this._offset, length: 8 })
    this._offset += 8
    return buf.readBigInt64LE()
  }

  /**
   * Reads an unsigned, big-endian 64-bit integer.
   * - - - -
   * @returns {Promise<bigint>}
   */
  async readInt64BE(): Promise<bigint> {
    this._checkExistence()
    this._checkIfFileHandleIsClosed()
    if (Buffer.isBuffer(this._operator)) {
      const buffer = this._operator.subarray(this._offset, this._offset + 8)
      this._offset += 8
      return buffer.readBigInt64BE()
    }
    const buf = Buffer.alloc(8)
    await this._operator.read({ buffer: buf, position: this._offset, length: 8 })
    this._offset += 8
    return buf.readBigInt64BE()
  }

  // #region Byte

  /**
   * Reads an 8-bit value and returns its individual bits as an array of 0s and 1s.
   * - - - -
   * @returns {Promise<BitsArray>}
   */
  async readByteAsBitArray(): Promise<BitsArray> {
    this._checkExistence()
    this._checkIfFileHandleIsClosed()
    const bits: number[] = []
    if (Buffer.isBuffer(this._operator)) {
      const buffer = this._operator.subarray(this._offset, this._offset + 1)
      this._offset++
      for (let i = 7; i >= 0; i--) {
        bits.push((buffer[0] >> i) & 1)
      }
      return bits as BitsArray
    }
    const buf = Buffer.alloc(1)
    await this._operator.read({ buffer: buf, position: this._offset, length: 1 })
    this._offset++
    for (let i = 7; i >= 0; i--) {
      bits.push((buf[0] >> i) & 1)
    }
    return bits as BitsArray
  }

  /**
   * Reads an 8-bit value and returns its individual bits as an array of boolean values.
   * - - - -
   * @returns {Promise<BitsBooleanArray>}
   */
  async readByteAsBooleanArray(): Promise<BitsBooleanArray> {
    this._checkExistence()
    this._checkIfFileHandleIsClosed()
    const bits: boolean[] = []
    if (Buffer.isBuffer(this._operator)) {
      const buffer = this._operator.subarray(this._offset, this._offset + 1)
      this._offset++
      for (let i = 7; i >= 0; i--) {
        bits.push(((buffer[0] >> i) & 1) === 0 ? false : true)
      }
      return bits as BitsBooleanArray
    }
    const buf = Buffer.alloc(1)
    await this._operator.read({ buffer: buf, position: this._offset, length: 1 })
    this._offset++
    for (let i = 7; i >= 0; i--) {
      bits.push(((buf[0] >> i) & 1) === 0 ? false : true)
    }
    return bits as BitsBooleanArray
  }

  /**
   * Reads a byte and returns its bits as a string.
   * - - - -
   * @returns {Promise<string>}
   */
  async readBitString(): Promise<string> {
    const bits = await this.readByteAsBitArray()
    return bits.join('')
  }

  // #region Others

  /**
   * _Alias to `read` with pre-defined utf-8 encoding value._
   *
   * Reads the binary file and returns decoded contents as `string` based on the provided encoding.
   * - - - -
   * @param {number | undefined} [allocSize] `OPTIONAL` The allocation size of the desired bytes. If `undefined`, the reader will
   * return all bytes from the file, starting by the class `offset` value, if `null`, it will read until the first found NULL value (0x0).
   * @param {BinaryWriteEncodings} [encoding] `OPTIONAL` The encoding used to decode the buffer. If `undefined`, the reader will decode the buffer as `utf8`.
   * @returns {Promise<string>}
   */
  async readString(allocSize?: number | null, encoding: BinaryWriteEncodings = 'utf8'): Promise<string> {
    const enc = encoding === 'latin-1' ? 'latin1' : encoding
    this._checkExistence()
    this._checkIfFileHandleIsClosed()
    if (Buffer.isBuffer(this._operator)) {
      if (typeof allocSize === 'number') {
        const buf = this._operator.subarray(this._offset, this._offset + allocSize)
        this._offset += allocSize
        return buf.toString(enc).replace(new RegExp(`\x00`, 'g'), '')
      } else if (allocSize === null) {
        const writer = new BinaryWriter()
        let foundNull = false
        do {
          const buffer = this._operator.subarray(this._offset, this._offset + 1)
          this._offset++
          if (buffer[0] === 0x0) {
            foundNull = true
          } else {
            writer.write(buffer)
          }
        } while (foundNull === false)

        return writer.toBuffer().toString(enc)
      }
      const buffer = this._operator.subarray(this._offset)
      this._offset = 0
      return buffer.toString(enc).replace(new RegExp(`\x00`, 'g'), '')
    }
    if (typeof allocSize === 'number') {
      const buf = Buffer.alloc(allocSize)
      await this._operator.read({ buffer: buf, position: this._offset, length: allocSize })
      this._offset += allocSize
      return buf.toString(enc).replace(new RegExp(`\x00`, 'g'), '')
    } else if (allocSize === null) {
      const writer = new BinaryWriter()
      let foundNull = false
      do {
        const buffer = (await this._operator.read({ offset: this.offset, length: 1 })).buffer
        this._offset++
        if (buffer[0] === 0x0) {
          foundNull = true
        } else {
          writer.write(buffer)
        }
      } while (foundNull === false)

      return writer.toBuffer().toString(enc)
    }
    allocSize = this._length - this._offset
    const buf = Buffer.alloc(allocSize)
    await this._operator.read({ buffer: buf, position: this._offset, length: allocSize })
    this._offset = 0
    return buf.toString(enc).replace(`\x00`, '')
  }

  /**
   * Reads an 8-bit value, evaluated as `boolean`.
   * - - - -
   * @returns {Promise<boolean>}
   */
  async readBooleanFromByte(): Promise<boolean> {
    this._checkExistence()
    this._checkIfFileHandleIsClosed()
    if (Buffer.isBuffer(this._operator)) {
      const buffer = this._operator.subarray(this._offset, this._offset + 1)
      this._offset++
      const value = Boolean(buffer.readUInt8())
      return value
    }
    const buf = Buffer.alloc(1)
    await this._operator.read({ buffer: buf, position: this._offset, length: 1 })
    this._offset++
    const value = Boolean(buf.readUInt8())
    return value
  }

  /**
   * Moves the internal class offset to a new position. If the resulting offset exceeds the length,
   * it wraps around to stay within bounds.
   * - - - -
   * @param {number} offset The number of bytes to move the offset.
   * @param {'start' | 'current' | 'end'} [method] `OPTIONAL` The reference point for the offset:
   *
   * - `'start'`: offset is set relative to the beginning of the stream.
   * - `'current'`: offset is set relative to the current position.
   * - `'end'`: offset is set relative to the end of the stream.
   * @returns {void}
   */
  seek(offset: number, method: BinaryReaderSeekMethods = 'start'): void {
    if (method === 'start') this._offset = offset
    else if (method === 'current') this._offset = this._offset + offset
    else this._offset = this._length + offset

    if (this._offset > this._length) this._offset = this._offset - this._length
  }

  // #region Internal

  [inspect.custom]() {
    return `BinaryReader { ${Buffer.isBuffer(this._operator) ? 'Buffer' : 'FileHandle'} }`
  }

  async [Symbol.asyncDispose](): Promise<void> {
    await this.close()
  }
}
