import type { BinaryToTextEncoding } from 'node:crypto'
import type { Stats, WriteStream } from 'node:fs'
import type { FileHandle } from 'node:fs/promises'
import type { Stream } from 'node:stream'
import { PathError } from '../errors'
import { basename, copyFile, copyFileSync, createFileWriteStream, createFileWriteStreamSync, deleteFile, deleteFileSync, dirname, ensurePathExistence, ensurePathIsFile, exists, extname, isAbsolute, openFile, readFile, readFileOffset, readFileSync, readJSON, readJSONSync, readLines, readLinesSync, renameFile, renameFileSync, resolve, stat, statSync, writeFile, writeFileSync, writeFileWithBOM, writeFileWithBOMSync, createHashFromFile, type AllHashAlgorithms, createHashFromFileSync } from '../lib.exports'
import { DirPath } from './DirPath'

export interface FilePathJSONRepresentation {
  /**
   * The working path of the class instance.
   */
  path: string
  /**
   * A boolean value that tells if the file exists.
   */
  exists: boolean
  /**
   * The root folder of the file where the path evaluates to.
   */
  root: string
  /**
   * The name of the file with extension (if any).
   */
  fullname: string
  /**
   * The name of the file (without the extension).
   */
  name: string
  /**
   * The extension of the file, returns an empty string if the
   * provided path evalutes to a directory.
   */
  ext: string
}

export type BufferEncodingOrNull = BufferEncoding | null | undefined
export type BufferEncodingBOM = 'utf8-bom' | 'utf-8-bom' | 'utf8bom' | 'utf16le-bom' | 'utf-16le-bom' | 'utf16bom' | undefined
export type BufferEncodingText = 'ascii' | 'latin1' | 'utf8' | 'utf-8' | undefined
export type StringOrBuffer = string | Buffer

export type ReadFileReturnType<T extends BufferEncodingOrNull> = T extends BufferEncoding ? string : T extends null | undefined ? Buffer : StringOrBuffer

export type FileAsyncWriteDataTypes = string | NodeJS.ArrayBufferView | Iterable<string | NodeJS.ArrayBufferView> | AsyncIterable<string | NodeJS.ArrayBufferView> | Stream
export type FileSyncWriteDataTypes = string | NodeJS.ArrayBufferView

/**
 * Types that can be converted using `FilePath.of()` static method.
 */
export type FilePathLikeTypes = string | FilePath | FilePathJSONRepresentation

export interface FileWriteStreamReturnObject {
  /**
   * The writeable stream of the file.
   */
  stream: WriteStream
  /**
   * A `Promise` that will only be fullfilled when calling `stream.end()`.
   */
  once: Promise<unknown[]>
}

/**
 * A path utility suite that gathers several functions
 * related to a specific file path.
 * - - - -
 */
export class FilePath {
  /**
   * The working path of this class instance.
   */
  readonly path: string

  // #region Constructor

  /**
   * @param {string[]} paths A sequence of paths or path segments.
   * @returns {FilePath}
   * @see [Path-JS GitHub Repository](https://github.com/ruggeryiury/path-js).
   */
  constructor(...paths: string[]) {
    this.path = resolve(...paths)
  }

  // #region Getters

  /**
   * The root directory of the file where the path evaluates to.
   * @returns {string}
   */
  get root(): string {
    return dirname(this.path)
  }
  /**
   * The name of the file with extension (if any).
   * @returns {string}
   */
  get fullname(): string {
    return basename(this.path)
  }
  /**
   * The name of the file (without the extension).
   * @returns {string}
   */
  get name(): string {
    return basename(this.path, extname(this.path))
  }
  /**
   * The extension of the file, returns an empty string if the
   * provided path evalutes to a directory.
   * @returns {string}
   */
  get ext(): string {
    return extname(this.path)
  }

  // #region Static Methods

  /**
   * Instantiate a `FilePath` class using a sequence of paths or path segments.
   * - - - -
   * @param {string[]} paths A sequence of paths or path segments.
   * @returns {FilePath}
   * @throws {PathError} If the provided path doesn't resolve to an existing file.
   */
  static of(...paths: string[]): FilePath {
    return new FilePath(...paths)
  }

  // #region Main Methods

  /**
   * Returns `true` if the instantiated path resolves to an existing file, otherwise `false`.
   * - - - -
   * @returns {boolean}
   */
  get exists(): boolean {
    return exists(this.path)
  }

  /**
   * Asynchronously computes a cryptographic hash from the contents of the file.
   * - - - -
   * @param {AllHashAlgorithms} [algorithm] The hash algorithm to use. Default is `'sha256'`.
   * @param {BinaryToTextEncoding} [digest] The output encoding for the hash. Default is `'hex'`.
   * @returns {Promise<string>} A promise that resolves to the resulting hash string.
   */
  async generateHash(algorithm: AllHashAlgorithms = 'sha256', digest: BinaryToTextEncoding = 'hex'): Promise<string> {
    return await createHashFromFile(this.path, algorithm, digest)
  }

  /**
   * Synchronously computes a cryptographic hash from the contents of the file.
   * - - - -
   * @param {AllHashAlgorithms} [algorithm] The hash algorithm to use. Default is `'sha256'`.
   * @param {BinaryToTextEncoding} [digest] The output encoding for the hash. Default is `'hex'`.
   * @returns {Promise<string>} A promise that resolves to the resulting hash string.
   */
  generateHashSync(algorithm: AllHashAlgorithms = 'sha256', digest: BinaryToTextEncoding = 'hex'): string {
    return createHashFromFileSync(this.path, algorithm, digest)
  }

  /**
   * Returns a new instantiated `DirPath`, resolving the path to a new directory relative from this file root path.
   * - - - -
   * @param {string} directoryName The directory name.
   * @returns {DirPath}
   */
  gotoDir(directoryName: string): DirPath {
    if (isAbsolute(directoryName)) return DirPath.of(directoryName)
    return DirPath.of(this.root, directoryName)
  }

  /**
   * Returns a new instantiated `FilePath`, resolving the path to a new file relative from this file root path.
   * - - - -
   * @param {string} fileName The file name.
   * @returns {DirPath}
   */
  gotoFile(fileName: string): FilePath {
    if (isAbsolute(fileName)) return FilePath.of(fileName)
    return FilePath.of(this.root, fileName)
  }

  /**
   * Changes the file name of this `FilePath` and returns a new instantiated `FilePath` with the new file name.
   * - - - -
   * @param {string | null} fileName The new file name. You can provide `null` as argument to use
   * `fileExt` parameter to change only the file's extension without changing the base name of the file.
   * @param {string | undefined} [fileExt] `OPTIONAL` A new extension for the new file path.
   * @returns {FilePath}
   */
  changeFileName(fileName: string | null, fileExt?: string): FilePath {
    const fn = fileName ?? this.name
    const fext = fileExt?.startsWith('.') ? fileExt.slice(1) : (fileExt ?? this.ext.slice(1))
    return new FilePath(this.root, `${fn}.${fext}`)
  }

  /**
   * Changes the file extension of this `FilePath` and returns a new instantiated `FilePath` with the new file extension.
   * - - - -
   * @param {string} fileExt The new file extension.
   * @returns {FilePath}
   */
  changeFileExt(fileExt: string): FilePath {
    const fext = fileExt.startsWith('.') ? fileExt.slice(1) : fileExt
    return new FilePath(this.root, `${this.name}.${fext}`)
  }

  /**
   * Returns an object with all properties from this `FilePath` instance.
   * - - - -
   * @returns {FilePathJSONRepresentation}
   */
  toJSON(): FilePathJSONRepresentation {
    return {
      path: this.path,
      exists: this.exists,
      root: this.root,
      name: this.name,
      fullname: this.fullname,
      ext: this.ext,
    }
  }

  /**
   * Returns the string of the path of this `FilePath` instance.
   * - - - -
   * @returns {string}
   */
  toString(): string {
    return this.path
  }

  /**
   * Asynchronously returns an object with the path stats.
   * - - - -
   * @returns {Promise<Stats>}
   */
  async stat(): Promise<Stats> {
    ensurePathIsFile(this.path, 'stat')
    ensurePathExistence(this.path, 'stat', 'file')
    return await stat(this.path)
  }
  /**
   * Synchronously returns an object with the path stats.
   * - - - -
   * @returns {Stats}
   */
  statSync(): Stats {
    ensurePathIsFile(this.path, 'statSync')
    ensurePathExistence(this.path, 'statSync', 'file')
    return statSync(this.path)
  }

  // #region Read Methods

  /**
   * Asynchronously opens a `FileHandle`.
   * - - - -
   * @param {string | number | undefined} [flags] `OPTIONAL` The file system flag. See the supported flags [here](https://nodejs.org/api/fs.html#file-system-flags). Default is `'r'` (Read).
   * @returns {Promise<FileHandle>} A promise resolving to a `FileHandle` object.
   */
  async open(flags?: string | number): Promise<FileHandle> {
    ensurePathIsFile(this.path, 'open')
    ensurePathExistence(this.path, 'open', 'file')
    return await openFile(this.path, flags)
  }

  /**
   * Asynchronously reads the entire contents of a file.
   *
   * Returns a `Buffer` or a string depending on the encoding provided.
   * - - - -
   * @template {BufferEncodingOrNull} T
   * @param {T} [encoding] `OPTIONAL` The encoding to use. If `undefined` or `null`, returns a `Buffer`.
   * @returns {Promise<ReadFileReturnType<T>>} A promise resolving to the file contents.
   */
  async read<T extends BufferEncodingOrNull = undefined>(encoding?: T): Promise<ReadFileReturnType<T>> {
    ensurePathIsFile(this.path, 'read')
    ensurePathExistence(this.path, 'read', 'file')
    return await readFile(this.path, encoding)
  }

  /**
   * Synchronously reads the entire contents of a file.
   *
   * Returns a `Buffer` or a string depending on the encoding provided.
   * - - - -
   * @template {BufferEncodingOrNull} T
   * @param {T} [encoding] `OPTIONAL` The encoding to use. If `undefined` or `null`, returns a `Buffer`.
   * @returns {ReadFileReturnType<T>} The file contents.
   */
  readSync<T extends BufferEncodingOrNull = undefined>(encoding?: T): ReadFileReturnType<T> {
    ensurePathIsFile(this.path, 'readSync')
    ensurePathExistence(this.path, 'readSync', 'file')
    return readFileSync(this.path, encoding)
  }

  /**
   * Asynchronously reads a file as a list of lines.
   *
   * Automatically trims and splits the file content on newline characters.
   * Assumes the file content is text (not binary).
   * - - - -
   * @param {BufferEncodingText | undefined} [encoding] `OPTIONAL` The encoding to use. If not provided, defaults to `'utf8'`.
   * @returns {Promise<string[]>} A promise that resolves to an array of trimmed lines.
   */
  async readLines(encoding: BufferEncodingText = 'utf8'): Promise<string[]> {
    ensurePathIsFile(this.path, 'readLines')
    ensurePathExistence(this.path, 'readLines', 'file')
    return await readLines(this.path, encoding)
  }

  /**
   * Synchronously reads a file as a list of lines.
   *
   * Automatically trims and splits the file content on newline characters.
   * Assumes the file content is text (not binary).
   * - - - -
   * @param {BufferEncodingText | undefined} [encoding] `OPTIONAL` The encoding to use. If not provided, defaults to `'utf8'`.
   * @returns {string[]} An array of trimmed lines.
   */
  readLinesSync(encoding: BufferEncodingText = 'utf8'): string[] {
    ensurePathIsFile(this.path, 'readLinesSync')
    ensurePathExistence(this.path, 'readLinesSync', 'file')
    return readLinesSync(this.path, encoding)
  }

  /**
   * Asynchronously reads a JSON file and parses it into an object.
   *
   * Attempts to decode the content using the provided encoding, then parses it using `JSON.parse`.
   * Throws a `PathError` if the JSON is invalid.
   * - - - -
   * @param {BufferEncodingText} [encoding] `OPTIONAL` The encoding to use when reading the file. Defaults to `'utf8'`.
   * @returns {Promise<unknown>} A promise that resolves to the parsed JSON object.
   * @throws {PathError} If the file contains invalid JSON.
   */
  async readJSON(encoding?: BufferEncodingText): Promise<unknown> {
    ensurePathIsFile(this.path, 'readJSON')
    ensurePathExistence(this.path, 'readJSON', 'file')
    return await readJSON(this.path, encoding)
  }

  /**
   * Synchronously reads a JSON file and parses it into an object.
   *
   * Attempts to decode the content using the provided encoding, then parses it using `JSON.parse`.
   * Throws a `PathError` if the JSON is invalid.
   * - - - -
   * @param {BufferEncodingText} [encoding] `OPTIONAL` The encoding to use when reading the file. Defaults to `'utf8'`.
   * @returns {unknown} The parsed JSON object.
   * @throws {PathError} If the file contains invalid JSON.
   */
  readJSONSync(encoding?: BufferEncodingText): unknown {
    ensurePathIsFile(this.path, 'readJSONSync')
    ensurePathExistence(this.path, 'readJSONSync', 'file')
    return readJSONSync(this.path, encoding)
  }

  /**
   * Asynchronously reads a portion of a file starting from a specific byte offset.
   *
   * If `byteLength` is provided, reads that many bytes using a file descriptor.
   * Otherwise, reads the whole file and returns a subarray starting at the offset.
   * - - - -
   * @param {number} byteOffset The byte offset from which to start reading.
   * @param {number} [byteLength] `OPTIONAL` The number of bytes to read. If not provided, reads to the end of the file.
   * @returns {Promise<Buffer>} A promise that resolves to the requested buffer segment.
   */
  async readOffset(byteOffset: number, byteLength?: number): Promise<Buffer> {
    ensurePathIsFile(this.path, 'readJSONSync')
    ensurePathExistence(this.path, 'readJSONSync', 'file')
    return await readFileOffset(this.path, byteOffset, byteLength)
  }

  // #region Write Methods

  /**
   * Asynchronously writes data to a file, optionally replacing it if it already exists.
   *
   * Supports writing strings or buffers to a file with optional encoding.
   * Throws an error if the file exists and `replace` is set to `false`.
   * - - - -
   * @param {FileAsyncWriteDataTypes} data The content to write. Can be a string or a `Buffer`.
   * @param {BufferEncodingOrNull} [encoding] `OPTIONAL` If `null`, writes as a `Buffer`.
   * @param {boolean} [replace] `OPTIONAL` Whether to overwrite the file if it already exists. Default is `true`.
   * @returns {Promise<FilePath>} A promise that resolves to a `FilePath` instance representing the written file.
   * @throws {PathError} If the file exists and `replace` is `false`.
   */
  async write(data: FileAsyncWriteDataTypes, encoding?: BufferEncodingOrNull, replace = true): Promise<FilePath> {
    return await writeFile(this.path, data, encoding, replace)
  }

  /**
   * Synchronously writes data to a file, optionally replacing it if it already exists.
   *
   * Supports writing strings or buffers to a file with optional encoding.
   * Throws an error if the file exists and `replace` is set to `false`.
   * - - - -
   * @param {FileAsyncWriteDataTypes} data The content to write. Can be a string or a `Buffer`.
   * @param {BufferEncodingOrNull} [encoding] `OPTIONAL` If `null`, writes as a `Buffer`.
   * @param {boolean} [replace] `OPTIONAL` Whether to overwrite the file if it already exists. Default is `true`.
   * @returns {FilePath} A `FilePath` instance representing the written file.
   * @throws {PathError} If the file exists and `replace` is `false`.
   */
  writeSync(data: FileSyncWriteDataTypes, encoding?: BufferEncodingOrNull, replace = true): FilePath {
    return writeFileSync(this.path, data, encoding, replace)
  }

  /**
   * Asynchronously writes a UTF-8 or UTF-16 encoded text file with a Byte Order Mark (BOM).
   *
   * Automatically prepends a BOM to the content. If encoding is not specified or is a variant of UTF-8,
   * it uses UTF-8 with BOM. If encoding is `'utf16le'`, it writes the content using UTF-16LE.
   *
   * Throws an error if the file exists and `replace` is set to `false`.
   * - - - -
   * @param {StringOrBuffer} data The text content to write.
   * @param {BufferEncodingBOM} [encoding] `OPTIONAL`Encoding to use, such as `'utf8-bom'`, `'utf16le'`, etc.
   * @param {boolean} [replace] `OPTIONAL` Whether to overwrite the file if it already exists. Default is `true`.
   * @returns {Promise<FilePath>} A promise that resolves to a `FilePath` instance representing the written file.
   * @throws {PathError} If the file exists and `replace` is `false`.
   */
  async writeWithBOM(data: StringOrBuffer, encoding?: BufferEncodingBOM, replace = true): Promise<FilePath> {
    return await writeFileWithBOM(this.path, data, encoding, replace)
  }

  /**
   * Synchronously writes a UTF-8 or UTF-16 encoded text file with a Byte Order Mark (BOM).
   *
   * Automatically prepends a BOM to the content. If encoding is not specified or is a variant of UTF-8,
   * it uses UTF-8 with BOM. If encoding is `'utf16le'`, it writes the content using UTF-16LE.
   *
   * Throws an error if the file exists and `replace` is set to `false`.
   * - - - -
   * @param {StringOrBuffer} data The text content to write.
   * @param {BufferEncodingBOM} [encoding] `OPTIONAL`Encoding to use, such as `'utf8-bom'`, `'utf16le'`, etc.
   * @param {boolean} [replace] `OPTIONAL` Whether to overwrite the file if it already exists. Default is `true`.
   * @returns {FilePath} A `FilePath` instance representing the written file.
   * @throws {PathError} If the file exists and `replace` is `false`.
   */
  writeWithBOMSync(data: StringOrBuffer, encoding?: BufferEncodingBOM, replace = true): FilePath {
    return writeFileWithBOMSync(this.path, data, encoding, replace)
  }

  /**
   * Asynchronously creates a writable file stream at the specified path.
   *
   * If a file already exists at the path, it will be deleted before creating the stream.
   * Optionally accepts an encoding; if `null` is passed, defaults to `utf8`.
   * - - - -
   * @param {BufferEncodingOrNull} [encoding] `OPTIONAL` The character encoding to use. If `null`, `utf8` is used.
   * @returns {Promise<FileWriteStreamReturnObject>} A promise that resolves to an object containing the writable stream and a promise that resolves when the stream finishes writing.
   */
  async createWriteStream(encoding?: BufferEncodingOrNull): Promise<FileWriteStreamReturnObject> {
    return await createFileWriteStream(this.path, encoding)
  }

  /**
   * Synchronously creates a writable file stream at the specified path.
   *
   * If a file already exists at the path, it will be deleted before creating the stream.
   * Optionally accepts an encoding; if `null` is passed, defaults to `'utf8'`.
   * - - - -
   * @param {BufferEncodingOrNull} [encoding] `OPTIONAL` The character encoding to use. If `null`, `'utf8'` is used.
   * @returns {Promise<FileWriteStreamReturnObject>} An object containing the writable stream and a promise that resolves when the stream finishes writing.
   */
  createWriteStreamSync(encoding?: BufferEncodingOrNull): FileWriteStreamReturnObject {
    return createFileWriteStreamSync(this.path, encoding)
  }

  // #region Copy Methods

  /**
   * Asynchronously copies a file from a source path to a destination path.
   *
   * If the destination path already exists:
   * - Throws an error unless `replace` is set to `true`.
   * - If `replace` is `true`, deletes the existing file before copying.
   *
   * Automatically resolves relative destination paths based on the source file's directory.
   * - - - -
   * @param {FilePathLikeTypes} destPath The destination file path to copy to. Can be relative or absolute.
   * @param {boolean} [replace] `OPTIONAL` Whether to replace the destination file if it already exists.
   * @returns {Promise<FilePath>} A promise that resolves to a `FilePath` instance pointing to the newly copied file.
   * @throws {PathError} If the destination file exists and `replace` is `false`.
   */
  async copy(destPath: string, replace = false): Promise<FilePath> {
    ensurePathIsFile(this.path, 'copy')
    ensurePathExistence(this.path, 'copy', 'file')
    return await copyFile(this.path, destPath, replace)
  }

  /**
   * Synchronously copies a file from a source path to a destination path.
   *
   * If the destination path already exists:
   * - Throws an error unless `replace` is set to `true`.
   * - If `replace` is `true`, deletes the existing file before copying.
   *
   * Automatically resolves relative destination paths based on the source file's directory.
   * - - - -
   * @param {FilePathLikeTypes} destPath The destination file path to copy to. Can be relative or absolute.
   * @param {boolean} [replace] `OPTIONAL` Whether to replace the destination file if it already exists.
   * @returns {Promise<FilePath>} A `FilePath` instance pointing to the newly copied file.
   * @throws {PathError} If the destination file exists and `replace` is `false`.
   */
  copySync(destPath: string, replace = false): FilePath {
    ensurePathIsFile(this.path, 'copySync')
    ensurePathExistence(this.path, 'copySync', 'file')
    return copyFileSync(this.path, destPath, replace)
  }

  // #region Rename Methods

  /**
   * Asynchronously renames (or moves) a file from an old path to a new path.
   *
   * If the new path already exists:
   * - Throws an error unless `replace` is `true`.
   * - If `replace` is `true`, deletes the destination file before renaming.
   *
   * Automatically resolves relative `newPath` values based on the directory of the `oldPath`.
   * - - - -
   * @param {FilePathLikeTypes} newPath The new file path. Can be relative or absolute.
   * @param {boolean} [replace] `OPTIONAL` Whether to overwrite the file at the destination if it exists.
   * @returns {Promise<FilePath>} A promise that resolves to a `FilePath` instance representing the new path of the renamed file.
   * @throws {PathError} If the destination file exists and `replace` is `false`.
   */
  async rename(newPath: string, replace = false): Promise<FilePath> {
    ensurePathIsFile(this.path, 'rename')
    ensurePathExistence(this.path, 'rename', 'file')
    return await renameFile(this.path, newPath, replace)
  }

  /**
   * Synchronously renames (or moves) a file from an old path to a new path.
   *
   * If the new path already exists:
   * - Throws an error unless `replace` is `true`.
   * - If `replace` is `true`, deletes the destination file before renaming.
   *
   * Automatically resolves relative `newPath` values based on the directory of the `oldPath`.
   * - - - -
   * @param {FilePathLikeTypes} newPath The new file path. Can be relative or absolute.
   * @param {boolean} [replace] `OPTIONAL` Whether to overwrite the file at the destination if it exists.
   * @returns {Promise<FilePath>} A `FilePath` instance representing the new path of the renamed file.
   * @throws {PathError} If the destination file exists and `replace` is `false`.
   */
  renameSync(newPath: string, replace = false): FilePath {
    ensurePathIsFile(this.path, 'renameSync')
    ensurePathExistence(this.path, 'renameSync', 'file')
    return renameFileSync(this.path, newPath, replace)
  }

  // #region Delete Methods

  /**
   * Asynchronously deletes a file at the specified path if it exists.
   *
   * Resolves the given path and performs a safe check before deletion to avoid errors.
   * - - - -
   * @returns {Promise<void>}
   */
  async delete(): Promise<void> {
    if (this.exists) await deleteFile(this.path)
  }

  /**
   * Synchronously deletes a file at the specified path if it exists.
   *
   * Resolves the given path and performs a safe check before deletion to avoid errors.
   * - - - -
   * @returns {void}
   */
  deleteSync(): void {
    if (this.exists) deleteFileSync(this.path)
  }
}
