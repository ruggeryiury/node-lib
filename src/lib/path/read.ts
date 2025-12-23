import { readFileSync as nodeReadFileSync, readdirSync } from 'node:fs'
import { readFile as nodeReadFile, open, readdir } from 'node:fs/promises'
import { DirPath, FilePath, type BufferEncodingOrNull, type BufferEncodingText, type DirPathLikeTypes, type FilePathLikeTypes, type ReadFileReturnType } from '../../core.exports'
import { isFile, pathLikeToString, resolve } from '../../lib.exports'

export type NewLineSeparators = '\n' | '\r\n'

export interface ReadLinesOptions {
  /** The encoding used to decode the file `Buffer`. Default is `'utf8'`. */
  encoding?: BufferEncodingText
  /** Trims each line of the file. Default is `true`. */
  trim?: boolean
  /** The new line entity used on the file as line separator. Default is `'\r\n'` */
  newLine?: NewLineSeparators
  /** Removes empty lines from the array. Default is `true`. */
  removeEmptyLines?: boolean
}

export type ReadDirReturnType<T extends boolean> = T extends true ? string[] : (FilePath | DirPath)[]

/**
 * Asynchronously reads the entire contents of a file.
 *
 * Returns a `Buffer` or a string depending on the encoding provided.
 * - - - -
 * @template {BufferEncodingOrNull} T
 * @param {FilePathLikeTypes} path The path to the file to read.
 * @param {T} [encoding] `OPTIONAL` The encoding to use. If `undefined` or `null`, returns a `Buffer`.
 * @returns {Promise<ReadFileReturnType<T>>} A promise resolving to the file contents.
 */
export const readFile = async <T extends BufferEncodingOrNull = undefined>(path: FilePathLikeTypes, encoding?: T): Promise<ReadFileReturnType<T>> => {
  const p = pathLikeToString(path)
  return (await nodeReadFile(p, encoding)) as ReadFileReturnType<T>
}

/**
 * Synchronously reads the entire contents of a file.
 *
 * Returns a `Buffer` or a string depending on the encoding provided.
 * - - - -
 * @template {BufferEncodingOrNull} T
 * @param {FilePathLikeTypes} path The path to the file to read.
 * @param {T} [encoding] `OPTIONAL` The encoding to use. If `undefined` or `null`, returns a `Buffer`.
 * @returns {ReadFileReturnType<T>} The file contents.
 */
export const readFileSync = <T extends BufferEncodingOrNull = undefined>(path: FilePathLikeTypes, encoding?: T): ReadFileReturnType<T> => {
  const p = pathLikeToString(path)
  return nodeReadFileSync(p, encoding) as ReadFileReturnType<T>
}

/**
 * Asynchronously reads a file as a list of lines.
 * - - - -
 * @param {FilePathLikeTypes} path The path to the file.
 * @param {ReadLinesOptions | undefined} [options] `OPTIONAL` An object that changes the behavior of the reading and parsing process.
 * @returns {Promise<string[]>} A promise that resolves to an array of trimmed lines.
 */
export const readLines = async (path: FilePathLikeTypes, options?: ReadLinesOptions): Promise<string[]> => {
  const { encoding, trim, newLine, removeEmptyLines }: Required<ReadLinesOptions> = {
    encoding: 'utf8',
    trim: true,
    newLine: '\r\n',
    removeEmptyLines: true,
    ...options,
  }
  const p = pathLikeToString(path)
  const content = await readFile(p, encoding)
  const contentString = Buffer.isBuffer(content) ? content.toString(encoding) : content
  const splitLines = contentString.split(newLine)
  if (trim) splitLines.map((val) => val.trim())
  return removeEmptyLines ? splitLines.filter((val) => Boolean(val.trim())) : splitLines
}

/**
 * Synchronously reads a file as a list of lines.
 * - - - -
 * @param {FilePathLikeTypes} path The path to the file.
 * @param {ReadLinesOptions | undefined} [options] `OPTIONAL` An object that changes the behavior of the reading and parsing process.
 * @returns {string[]} An array of trimmed lines.
 */
export const readLinesSync = (path: FilePathLikeTypes, options?: ReadLinesOptions): string[] => {
  const { encoding, trim, newLine, removeEmptyLines }: Required<ReadLinesOptions> = {
    encoding: 'utf8',
    trim: true,
    newLine: '\r\n',
    removeEmptyLines: true,
    ...options,
  }
  const p = pathLikeToString(path)
  const content = readFileSync(p, encoding)
  const contentString = Buffer.isBuffer(content) ? content.toString(encoding) : content
  const splitLines = contentString.split(newLine)
  if (trim) splitLines.map((val) => val.trim())
  return removeEmptyLines ? splitLines.filter((val) => Boolean(val.trim())) : splitLines
}

/**
 * Asynchronously reads a JSON file and parses it into an object.
 *
 * Attempts to decode the content using the provided encoding, then parses it using `JSON.parse`.
 * Throws a `Error` if the JSON is invalid.
 * - - - -
 * @param {FilePathLikeTypes} path The path to the JSON file.
 * @param {BufferEncodingText} [encoding] `OPTIONAL` The encoding to use when reading the file. Defaults to `'utf8'`.
 * @returns {Promise<T>} A promise that resolves to the parsed JSON object.
 * @throws {Error} If the file contains invalid JSON.
 */
export const readJSON = async <T>(path: FilePathLikeTypes, encoding?: BufferEncodingText): Promise<T> => {
  const p = pathLikeToString(path)
  const contents = await readFile(p, encoding)
  try {
    return JSON.parse(Buffer.isBuffer(contents) ? contents.toString(encoding) : contents) as T
  } catch (err) {
    if (err instanceof Error) throw new Error(err.message)
    else throw err
  }
}

/**
 * Synchronously reads a JSON file and parses it into an object.
 *
 * Attempts to decode the content using the provided encoding, then parses it using `JSON.parse`.
 * Throws a `Error` if the JSON is invalid.
 * - - - -
 * @param {FilePathLikeTypes} path The path to the JSON file.
 * @param {BufferEncodingText} [encoding] `OPTIONAL` The encoding to use when reading the file. Defaults to `'utf8'`.
 * @returns {T} A parsed JSON object.
 * @throws {Error} If the file contains invalid JSON.
 */
export const readJSONSync = <T>(path: FilePathLikeTypes, encoding?: BufferEncodingText): T => {
  const p = pathLikeToString(path)
  const contents = readFileSync(p, encoding)
  try {
    return JSON.parse(Buffer.isBuffer(contents) ? contents.toString(encoding) : contents) as T
  } catch (err) {
    if (err instanceof Error) throw new Error(err.message)
    else throw err
  }
}

/**
 * Asynchronously reads a portion of a file starting from a specific byte offset.
 *
 * If `byteLength` is provided, reads that many bytes using a file descriptor.
 * Otherwise, reads the whole file and returns a subarray starting at the offset.
 * - - - -
 * @param {FilePathLikeTypes} path The path to the file.
 * @param {number} byteOffset The byte offset from which to start reading.
 * @param {number} [byteLength] `OPTIONAL` The number of bytes to read. If not provided, reads to the end of the file.
 * @returns {Promise<Buffer>} A promise that resolves to the requested buffer segment.
 */
export const readFileOffset = async (path: FilePathLikeTypes, byteOffset: number, byteLength?: number): Promise<Buffer> => {
  const p = pathLikeToString(path)
  let buffer: Buffer
  if (byteLength !== undefined) {
    const fileOpen = await open(p, 'r')
    buffer = Buffer.alloc(byteLength)
    await fileOpen.read(buffer, 0, byteLength, byteOffset)
    await fileOpen.close()
    return buffer
  }

  const fileBuffer = await readFile(p, undefined)
  return fileBuffer.subarray(byteOffset)
}

/**
 * Asynchronously reads the contents of a directory and returns an array of file/directory paths.
 * - - - -
 * @param {DirPathLikeTypes} dirPath The path to the directory to read.
 * @param {boolean} [recursive] `OPTIONAL` Recursively reads the folder. Default is `false`.
 * @param {T} [returnValueAsStrings] `OPTIONAL` Whether to return `FilePath` / `DirPath` objects or absolute path strings. Default is `false`.
 * @returns {Promise<string[]>} A promise that resolves to an array of file/directory entries. It can be `FilePath` / `DirPath` objects if `returnValueAsStrings` is set to `false`.
 * @throws {Error} If the directory cannot be read or does not exist.
 */
export const readDir = async <T extends boolean = false>(dirPath: DirPathLikeTypes, recursive = false, returnValueAsStrings: T = false as T): Promise<ReadDirReturnType<T>> => {
  const path = pathLikeToString(dirPath)
  const results = (await readdir(path, { recursive })).map((val) => resolve(path, val))

  if (returnValueAsStrings) return results as ReadDirReturnType<T>
  return results.map((val) => (isFile(val) ? FilePath.of(val) : DirPath.of(val))) as ReadDirReturnType<T>
}

/**
 * Synchronously reads the contents of a directory and returns an array of file/directory paths.
 * - - - -
 * @param {DirPathLikeTypes} dirPath The path to the directory to read.
 * @param {boolean} [recursive] `OPTIONAL` Recursively reads the folder. Default is `false`.
 * @param {T} [returnValueAsStrings] `OPTIONAL` Whether to return `FilePath` / `DirPath` objects or absolute path strings. Default is `false`.
 * @returns {Promise<string[]>} A promise that resolves to an array of file/directory entries. It can be `FilePath` / `DirPath` objects if `returnValueAsStrings` is set to `false`.
 * @throws {Error} If the directory cannot be read or does not exist.
 */
export const readDirSync = <T extends boolean = false>(dirPath: DirPathLikeTypes, recursive = false, returnValueAsStrings: T = false as T): ReadDirReturnType<T> => {
  const path = pathLikeToString(dirPath)
  const results = readdirSync(path, { recursive }).map((val) => (typeof val === 'string' ? resolve(path, val) : resolve(path, val.toString())))

  if (returnValueAsStrings) return results as ReadDirReturnType<T>
  return results.map((val) => (isFile(val) ? FilePath.of(val) : DirPath.of(val))) as ReadDirReturnType<T>
}
