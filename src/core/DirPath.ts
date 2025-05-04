import { type Stats } from 'node:fs'
import { FilePath } from '../core.exports'
import { PathError } from '../errors'
import { basename, deleteDir, deleteDirSync, dirname, ensurePathExistence, ensurePathIsDir, exists, isAbsolute, mkDir, mkDirSync, readDir, readDirSync, resolve, stat, statSync, writeFileOnDir, writeFileOnDirSync, type BufferEncodingOrNull, type DirPathJSONRepresentation, type FileAsyncWriteDataTypes, type FileSyncWriteDataTypes } from '../lib.exports'

/**
 * A path utility suite that gathers several functions
 * related to a specific directory path.
 * - - - -
 */
export class DirPath {
  /**
   * The working path of this class instance.
   */
  readonly path: string

  // #region Constructor

  /**
   * @param {string[]} paths A sequence of paths or path segments.
   * @returns {DirPath}
   * @see [Path-JS GitHub Repository](https://github.com/ruggeryiury/path-js).
   */
  constructor(...paths: string[]) {
    this.path = resolve(...paths)
  }

  // #region Getters

  /**
   * The root directory of the directory where the path evaluates to.
   * @returns {string}
   */
  get root(): string {
    return dirname(this.path)
  }
  /**
   * The name of the directory.
   * @returns {string}
   */
  get name(): string {
    return basename(this.path)
  }

  // #region Static Methods

  /**
   * Instantiate a `DirPath` class using a sequence of paths or path segments.
   * - - - -
   * @param {string[]} paths A sequence of paths or path segments.
   * @returns {DirPath}
   * @throws {PathError} If the provided path doesn't resolve to an existing directory.
   */
  static of(...paths: string[]): DirPath {
    return new DirPath(...paths)
  }

  // #region Main Methods

  /**
   * Returns `true` if the instantiated path resolves to an existing directory, otherwise `false`.
   * - - - -
   * @returns {boolean}
   */
  get exists(): boolean {
    return exists(this.path)
  }

  /**
   * Returns a new instantiated `DirPath`, resolving the path to a new directory relative from this directory path.
   * - - - -
   * @param {string} directoryName The directory name.
   * @returns {DirPath}
   */
  gotoDir(directoryName: string): DirPath {
    if (isAbsolute(directoryName)) throw new PathError(`Provided path ${directoryName} can't be an absolute path to resolve on gotoDir() operations.`)
    return new DirPath(this.root, directoryName)
  }

  /**
   * Returns a new instantiated `DirPath`, resolving the path to a new directory relative from this directory path.
   * - - - -
   * @param {string} fileName The directory name.
   * @returns {DirPath}
   */
  gotoFile(fileName: string): FilePath {
    if (isAbsolute(fileName)) throw new PathError(`Provided path ${fileName} can't be an absolute path to resolve on gotoFile() operations.`)
    return new FilePath(this.path, fileName)
  }

  /**
   * Returns an object with all properties from this `DirPath` instance.
   * - - - -
   * @returns {DirPathJSONRepresentation}
   */
  toJSON(): DirPathJSONRepresentation {
    return {
      path: this.path,
      exists: this.exists,
      root: this.root,
      name: this.name,
    }
  }

  /**
   * Returns the string of the path of this `DirPath` instance.
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
    ensurePathIsDir(this.path, 'stat')
    ensurePathExistence(this.path, 'stat', 'directory')
    return await stat(this.path)
  }
  /**
   * Synchronously returns an object with the path stats.
   * - - - -
   * @returns {Stats}
   */
  statSync(): Stats {
    ensurePathIsDir(this.path, 'statSync')
    ensurePathExistence(this.path, 'statSync', 'directory')
    return statSync(this.path)
  }
  // #region Read Methods

  /**
   * Asynchronously reads the contents of a directory and returns a list of file and folder names.
   *
   * By default, returns absolute paths to each entry. You can change this behavior
   * by setting `asAbsolutePaths` to `false`, in which case it will return only the names.
   * - - - -
   * @param {boolean} [asAbsolutePaths] `OPTIONAL` Whether to return absolute paths or just entry names.
   * @returns {Promise<string[]>} A promise that resolves to an array of directory entries. Entries are either absolute paths or names depending on the flag.
   * @throws {PathError} If the directory cannot be read or does not exist.
   */
  async readDir(asAbsolutePaths = true): Promise<string[]> {
    ensurePathIsDir(this.path, 'readDir')
    ensurePathExistence(this.path, 'readDir', 'directory')
    return await readDir(this.path, asAbsolutePaths)
  }

  /**
   * Synchronously reads the contents of a directory and returns a list of file and folder names.
   *
   * By default, returns absolute paths to each entry. You can change this behavior
   * by setting `asAbsolutePaths` to `false`, in which case it will return only the names.
   * - - - -
   * @param {boolean} [asAbsolutePaths] `OPTIONAL` Whether to return absolute paths or just entry names.
   * @returns {string[]} An array of directory entries. Entries are either absolute paths or names depending on the flag.
   * @throws {PathError} If the directory cannot be read or does not exist.
   */
  readDirSync(asAbsolutePaths = true): string[] {
    ensurePathIsDir(this.path, 'readDir')
    ensurePathExistence(this.path, 'readDir', 'directory')
    return readDirSync(this.path, asAbsolutePaths)
  }

  // #region Create Methods

  /**
   * Asynchronously writes a file inside a specified directory.
   *
   * Automatically resolves the full file path by combining the directory path and the file name.
   * If the file already exists and `replace` is false, an error is thrown.
   * - - - -
   * @param {string} fileName The name of the file to write.
   * @param {FileAsyncWriteDataTypes | null} [data] `OPTIONAL` The file contents. If `null` or `undefined`, an empty string is written.
   * @param {BufferEncodingOrNull} [encoding] `OPTIONAL` The encoding used when writing the file. Default is `'utf8'`.
   * @param {boolean} [replace] Whether to replace the file if it already exists. Default is `true`.
   * @returns {Promise<FilePath>} A promise that resolves to a `FilePath` instance representing the created file.
   * @throws {PathError} If the file already exists and `replace` is `false`.
   */
  async writeFileOnDir(fileName: string, data?: FileAsyncWriteDataTypes | null, encoding?: BufferEncodingOrNull, replace = true): Promise<FilePath> {
    return await writeFileOnDir(this.path, fileName, data, encoding, replace)
  }

  /**
   * Synchronously writes a file inside a specified directory.
   *
   * Automatically resolves the full file path by combining the directory path and the file name.
   * If the file already exists and `replace` is false, an error is thrown.
   * - - - -
   * @param {string} fileName The name of the file to write.
   * @param {FileAsyncWriteDataTypes | null} [data] `OPTIONAL` The file contents. If `null` or `undefined`, an empty string is written.
   * @param {BufferEncodingOrNull} [encoding] `OPTIONAL` The encoding used when writing the file. Default is `'utf8'`.
   * @param {boolean} [replace] Whether to replace the file if it already exists. Default is `true`.
   * @returns {FilePath} A `FilePath` instance representing the created file.
   * @throws {PathError} If the file already exists and `replace` is `false`.
   */
  writeFileOnDirSync(fileName: string, data?: FileSyncWriteDataTypes | null, encoding?: BufferEncodingOrNull, replace = true): FilePath {
    return writeFileOnDirSync(this.path, fileName, data, encoding, replace)
  }

  /**
   * Asynchronously creates a directory at the specified path.
   *
   * By default, does not create parent directories unless `recursive` is set to `true`.
   * - - - -
   * @param {boolean} [recursive] `OPTIONAL` Whether to create parent directories if they do not exist. Default is `false`.
   * @returns {Promise<DirPath>} A promise that resolves to a `DirPath` instance representing the created directory.
   */
  async mkDir(recursive = false): Promise<DirPath> {
    return await mkDir(this.path, recursive)
  }
  /**
   * Synchronously creates a directory at the specified path.
   *
   * By default, does not create parent directories unless `recursive` is set to `true`.
   * - - - -
   * @param {boolean} [recursive] `OPTIONAL` Whether to create parent directories if they do not exist. Default is `false`.
   * @returns {DirPath} A `DirPath` instance representing the created directory.
   */
  mkDirSync(recursive = false): DirPath {
    return mkDirSync(this.path, recursive)
  }

  // #region Delete Methods

  /**
   * Asynchronously deletes a directory at the specified path.
   *
   * By default, deletes the directory recursively (including its contents).
   * - - - -
   * @param {boolean} [recursive] `OPTIONAL` Whether to delete the contents of the directory recursively. Default is `true`.
   * @returns {Promise<void>} Resolves when the directory has been removed.
   */
  async deleteDir(recursive = true): Promise<void> {
    if (this.exists) await deleteDir(this.path, recursive)
  }
  /**
   * Synchronously deletes a directory at the specified path.
   *
   * By default, deletes the directory recursively (including its contents).
   * - - - -
   * @param {boolean} [recursive] `OPTIONAL` Whether to delete the contents of the directory recursively. Default is `true`.
   * @returns {void}
   */
  deleteDirSync(recursive = true): void {
    if (this.exists) deleteDirSync(this.path, recursive)
  }
}
