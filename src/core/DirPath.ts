import { type Stats } from 'node:fs'
import { FilePath, type BufferEncodingOrNull, type FileAsyncWriteDataTypes, type FileSyncWriteDataTypes } from '../core.exports'
import { basename, deleteDir, deleteDirSync, dirname, ensurePathExistence, ensurePathIsDir, exists, isAbsolute, mkDir, mkDirSync, readDir, readDirSync, resolve, searchInFolder, searchInFolderSync, stat, statSync, writeFileOnDir, writeFileOnDirSync } from '../lib.exports'

export interface DirPathJSONRepresentation {
  /**
   * The working path of the class instance.
   */
  path: string
  /**
   * A boolean value that tells if the directory exists.
   */
  exists: boolean
  /**
   * The root folder of the directory where the path evaluates to.
   */
  root: string
  /**
   * The name of the directory.
   */
  name: string
}

/**
 * Types that can be converted using `DirPath.of()` static method.
 */
export type DirPathLikeTypes = string | DirPath | DirPathJSONRepresentation

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
    if (isAbsolute(directoryName)) return DirPath.of(directoryName)
    return DirPath.of(this.path, directoryName)
  }

  /**
   * Returns a new instantiated `DirPath`, resolving the path to a new directory relative from this directory path.
   * - - - -
   * @param {string} fileName The directory name.
   * @returns {DirPath}
   */
  gotoFile(fileName: string): FilePath {
    if (isAbsolute(fileName)) return FilePath.of(fileName)
    return FilePath.of(this.path, fileName)
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
   * @param {boolean} [recursive] `OPTIONAL` Recursively reads the folder. Default is `false`.
   * @returns {Promise<string[]>} A promise that resolves to an array of directory entries. Entries are either absolute paths or names depending on the flag.
   * @throws {Error} If the directory cannot be read or does not exist.
   */
  async readDir(asAbsolutePaths = true, recursive = false): Promise<string[]> {
    ensurePathIsDir(this.path, 'readDir')
    ensurePathExistence(this.path, 'readDir', 'directory')
    return await readDir(this.path, asAbsolutePaths, recursive)
  }

  /**
   * Synchronously reads the contents of a directory and returns a list of file and folder names.
   *
   * By default, returns absolute paths to each entry. You can change this behavior
   * by setting `asAbsolutePaths` to `false`, in which case it will return only the names.
   * - - - -
   * @param {boolean} [asAbsolutePaths] `OPTIONAL` Whether to return absolute paths or just entry names.
   * @returns {string[]} An array of directory entries. Entries are either absolute paths or names depending on the flag.
   * @throws {Error} If the directory cannot be read or does not exist.
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
   * @throws {Error} If the file already exists and `replace` is `false`.
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
   * @throws {Error} If the file already exists and `replace` is `false`.
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
   * @returns {void} Resolves when the directory has been removed.
   */
  deleteDirSync(recursive = true): void {
    if (this.exists) deleteDirSync(this.path, recursive)
  }

  // #region Search Methods
  /**
   * Asynchronously searches for files and directories in a folder that match a given pattern.
   * - - - -
   * @param {RegExp | string | (RegExp | string)[]} [pattern] `OPTIONAL` A RegExp or string pattern to match file or directory names. If no pattern is provided, all paths will be returned on the array.
   * @param {boolean} [recursive] `OPTIONAL` Whether to search recursively. Defaults to `true`.
   * @returns {Promise<string[]>} An array of absolute paths that match the pattern.
   */
  async searchDir(pattern: RegExp | string | (RegExp | string)[] = '', recursive = true): Promise<string[]> {
    ensurePathIsDir(this.path, 'searchDir')
    ensurePathExistence(this.path, 'searchDir', 'directory')
    return await searchInFolder(this.path, pattern, recursive)
  }

  /**
   * Synchronously searches for files and directories in a folder that match a given pattern.
   * - - - -
   * @param {RegExp | string | (RegExp | string)[]} [pattern] `OPTIONAL` A RegExp or string pattern to match file or directory names. If no pattern is provided, all paths will be returned on the array.
   * @param {boolean} [recursive] `OPTIONAL` Whether to search recursively. Defaults to `true`.
   * @returns {string[]} An array of absolute paths that match the pattern.
   */
  searchDirSync(pattern: RegExp | string | (RegExp | string)[] = '', recursive = true): string[] {
    return searchInFolderSync(this.path, pattern, recursive)
  }
}
