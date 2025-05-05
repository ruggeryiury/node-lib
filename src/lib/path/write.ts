import { mkdirSync, writeFileSync as nodeWriteFileSync } from 'node:fs'
import { mkdir, writeFile as nodeWriteFile } from 'node:fs/promises'
import { DirPath, FilePath, type BufferEncodingBOM, type BufferEncodingOrNull, type FileAsyncWriteDataTypes, type FileSyncWriteDataTypes, type PathLikeTypes, type StringOrBuffer } from '../../core.exports'
import { PathError } from '../../errors'
import { exists, pathLikeToString, resolve } from '../../lib.exports'

/**
 * Asynchronously writes data to a file, optionally replacing it if it already exists.
 *
 * Supports writing strings or buffers to a file with optional encoding.
 * Throws an error if the file exists and `replace` is set to `false`.
 * - - - -
 * @param {PathLikeTypes} path The target file path to write to.
 * @param {FileAsyncWriteDataTypes} data The content to write. Can be a string or a `Buffer`.
 * @param {BufferEncodingOrNull} [encoding] `OPTIONAL` If `null`, writes as a `Buffer`.
 * @param {boolean} [replace] `OPTIONAL` Whether to overwrite the file if it already exists. Default is `true`.
 * @returns {Promise<FilePath>} A promise that resolves to a `FilePath` instance representing the written file.
 * @throws {PathError} If the file exists and `replace` is `false`.
 */
export const writeFile = async (path: PathLikeTypes, data: FileAsyncWriteDataTypes, encoding?: BufferEncodingOrNull, replace = true): Promise<FilePath> => {
  const p = pathLikeToString(path)
  if (exists(p) && !replace) throw new PathError(`Provided file path ${p} already exists. To automatically replace the file, set the "replace" argument to true.`)
  await nodeWriteFile(p, data, encoding)
  return new FilePath(p)
}

/**
 * Synchronously writes data to a file, optionally replacing it if it already exists.
 *
 * Supports writing strings or buffers to a file with optional encoding.
 * Throws an error if the file exists and `replace` is set to `false`.
 * - - - -
 * @param {PathLikeTypes} path The target file path to write to.
 * @param {FileAsyncWriteDataTypes} data The content to write. Can be a string or a `Buffer`.
 * @param {BufferEncodingOrNull} [encoding] `OPTIONAL` If `null`, writes as a `Buffer`.
 * @param {boolean} [replace] `OPTIONAL` Whether to overwrite the file if it already exists. Default is `true`.
 * @returns {FilePath} A `FilePath` instance representing the written file.
 * @throws {PathError} If the file exists and `replace` is `false`.
 */
export const writeFileSync = (path: PathLikeTypes, data: FileSyncWriteDataTypes, encoding?: BufferEncodingOrNull, replace = true): FilePath => {
  const p = pathLikeToString(path)
  if (exists(p) && !replace) throw new PathError(`Provided file path ${p} already exists. To automatically replace the file, set the "replace" argument to true.`)
  nodeWriteFileSync(p, data, encoding)
  return new FilePath(p)
}

/**
 * Asynchronously writes a UTF-8 or UTF-16 encoded text file with a Byte Order Mark (BOM).
 *
 * Automatically prepends a BOM to the content. If encoding is not specified or is a variant of UTF-8,
 * it uses UTF-8 with BOM. If encoding is `'utf16le'`, it writes the content using UTF-16LE.
 *
 * Throws an error if the file exists and `replace` is set to `false`.
 * - - - -
 * @param {PathLikeTypes} path The file path to write to.
 * @param {StringOrBuffer} data The text content to write.
 * @param {BufferEncodingBOM} [encoding] `OPTIONAL`Encoding to use, such as `'utf8-bom'`, `'utf16le'`, etc.
 * @param {boolean} [replace] `OPTIONAL` Whether to overwrite the file if it already exists. Default is `true`.
 * @returns {Promise<FilePath>} A promise that resolves to a `FilePath` instance representing the written file.
 * @throws {PathError} If the file exists and `replace` is `false`.
 */
export const writeFileWithBOM = async (path: PathLikeTypes, data: StringOrBuffer, encoding?: BufferEncodingBOM, replace = true): Promise<FilePath> => {
  const p = pathLikeToString(path)
  if (exists(p) && !replace) throw new PathError(`Provided file path ${p} already exists. To automatically replace the file, set the "replace" argument to true.`)
  const content = '\ufeff' + (Buffer.isBuffer(data) ? data.toString() : data)
  if (encoding === 'utf-8-bom' || encoding === 'utf8-bom' || encoding === 'utf8bom' || !encoding) await writeFile(p, content)
  else await nodeWriteFile(p, content, 'utf16le')
  return new FilePath(p)
}

/**
 * Synchronously writes a UTF-8 or UTF-16 encoded text file with a Byte Order Mark (BOM).
 *
 * Automatically prepends a BOM to the content. If encoding is not specified or is a variant of UTF-8,
 * it uses UTF-8 with BOM. If encoding is `'utf16le'`, it writes the content using UTF-16LE.
 *
 * Throws an error if the file exists and `replace` is set to `false`.
 * - - - -
 * @param {PathLikeTypes} path The file path to write to.
 * @param {StringOrBuffer} data The text content to write.
 * @param {BufferEncodingBOM} [encoding] `OPTIONAL`Encoding to use, such as `'utf8-bom'`, `'utf16le'`, etc.
 * @param {boolean} [replace] `OPTIONAL` Whether to overwrite the file if it already exists. Default is `true`.
 * @returns {FilePath} A `FilePath` instance representing the written file.
 * @throws {PathError} If the file exists and `replace` is `false`.
 */
export const writeFileWithBOMSync = (path: PathLikeTypes, data: StringOrBuffer, encoding?: BufferEncodingBOM, replace = true): FilePath => {
  const p = pathLikeToString(path)
  if (exists(p) && !replace) throw new PathError(`Provided file path ${p} already exists. To automatically replace the file, set the "replace" argument to true.`)
  const content = '\ufeff' + (Buffer.isBuffer(data) ? data.toString() : data)
  if (encoding === 'utf-8-bom' || encoding === 'utf8-bom' || encoding === 'utf8bom' || !encoding) writeFileSync(p, content)
  else nodeWriteFileSync(p, content, 'utf16le')
  return new FilePath(p)
}

/**
 * Asynchronously writes a file inside a specified directory.
 *
 * Automatically resolves the full file path by combining the directory path and the file name.
 * If the file already exists and `replace` is false, an error is thrown.
 * - - - -
 * @param {PathLikeTypes} dirPath The directory path where the file should be created.
 * @param {string} fileName The name of the file to write.
 * @param {FileAsyncWriteDataTypes | null} [data] `OPTIONAL` The file contents. If `null` or `undefined`, an empty string is written.
 * @param {BufferEncodingOrNull} [encoding] `OPTIONAL` The encoding used when writing the file. Default is `'utf8'`
 * @param {boolean} [replace] `OPTIONAL` Whether to replace the file if it already exists. Default is `true`.
 * @returns {Promise<FilePath>} A promise that resolves to a `FilePath` instance representing the created file.
 * @throws {PathError} If the file already exists and `replace` is `false`.
 */
export const writeFileOnDir = async (dirPath: PathLikeTypes, fileName: string, data?: FileAsyncWriteDataTypes | null, encoding?: BufferEncodingOrNull, replace = true): Promise<FilePath> => {
  const dp = pathLikeToString(dirPath)
  const newFilePath = resolve(dp, fileName)
  if (exists(newFilePath) && !replace) throw new PathError(`Provided file path ${newFilePath} already exists. To automatically replace the file, set the "replace" argument to true.`)
  if (exists(newFilePath)) throw new PathError(`File on path "${newFilePath}" already exists.`)
  await writeFile(newFilePath, data ?? '', encoding)
  return new FilePath(newFilePath)
}

/**
 * Synchronously writes a file inside a specified directory.
 *
 * Automatically resolves the full file path by combining the directory path and the file name.
 * If the file already exists and `replace` is false, an error is thrown.
 * - - - -
 * @param {PathLikeTypes} dirPath The directory path where the file should be created.
 * @param {string} fileName The name of the file to write.
 * @param {FileAsyncWriteDataTypes | null} [data] `OPTIONAL` The file contents. If `null` or `undefined`, an empty string is written.
 * @param {BufferEncodingOrNull} [encoding] `OPTIONAL` The encoding used when writing the file. Default is `'utf8'`
 * @param {boolean} [replace] `OPTIONAL` Whether to replace the file if it already exists. Default is `true`.
 * @returns {FilePath} A `FilePath` instance representing the created file.
 * @throws {PathError} If the file already exists and `replace` is `false`.
 */
export const writeFileOnDirSync = (dirPath: PathLikeTypes, fileName: string, data?: FileSyncWriteDataTypes | null, encoding?: BufferEncodingOrNull, replace = true): FilePath => {
  const dp = pathLikeToString(dirPath)
  const newFilePath = resolve(dp, fileName)
  if (exists(newFilePath) && !replace) throw new PathError(`Provided file path ${newFilePath} already exists. To automatically replace the file, set the "replace" argument to true.`)
  if (exists(newFilePath)) throw new PathError(`File on path "${newFilePath}" already exists.`)
  writeFileSync(newFilePath, data ?? '', encoding)
  return new FilePath(newFilePath)
}

/**
 * Asynchronously creates a directory at the specified path.
 *
 * By default, does not create parent directories unless `recursive` is set to `true`.
 * - - - -
 * @param {PathLikeTypes} dirPath The directory path to create.
 * @param {boolean} [recursive] `OPTIONAL` Whether to create parent directories if they do not exist. Default is `false`.
 * @returns {Promise<DirPath>} A promise that resolves to a `DirPath` instance representing the created directory.
 */
export const mkDir = async (dirPath: PathLikeTypes, recursive = false): Promise<DirPath> => {
  const dp = pathLikeToString(dirPath)
  await mkdir(dp, { recursive })
  return new DirPath(dp)
}

/**
 * Synchronously creates a directory at the specified path.
 *
 * By default, does not create parent directories unless `recursive` is set to `true`.
 * - - - -
 * @param {PathLikeTypes} dirPath The directory path to create.
 * @param {boolean} [recursive] `OPTIONAL` Whether to create parent directories if they do not exist. Default is `false`.
 * @returns {DirPath} A `DirPath` instance representing the created directory.
 */
export const mkDirSync = (dirPath: PathLikeTypes, recursive = false): DirPath => {
  const dp = pathLikeToString(dirPath)
  mkdirSync(dp, { recursive })
  return new DirPath(dp)
}
