import { readFileSync as nodeReadFileSync, readdirSync } from 'node:fs'
import { readFile as nodeReadFile, open, readdir } from 'node:fs/promises'
import type { BufferEncodingOrNull, BufferEncodingText, PathLikeTypes, ReadFileReturnType } from '../../core.exports'
import { PathError } from '../../errors'
import { pathLikeToString, resolve } from '../../lib.exports'

/**
 * Asynchronously reads the entire contents of a file.
 *
 * Returns a `Buffer` or a string depending on the encoding provided.
 * - - - -
 * @template {BufferEncodingOrNull} T
 * @param {PathLikeTypes} path The path to the file to read.
 * @param {T} [encoding] `OPTIONAL` The encoding to use. If `undefined` or `null`, returns a `Buffer`.
 * @returns {Promise<ReadFileReturnType<T>>} A promise resolving to the file contents.
 */
export const readFile = async <T extends BufferEncodingOrNull = undefined>(path: PathLikeTypes, encoding?: T): Promise<ReadFileReturnType<T>> => {
  const p = pathLikeToString(path)
  return (await nodeReadFile(p, encoding)) as ReadFileReturnType<T>
}

/**
 * Synchronously reads the entire contents of a file.
 *
 * Returns a `Buffer` or a string depending on the encoding provided.
 * - - - -
 * @template {BufferEncodingOrNull} T
 * @param {PathLikeTypes} path The path to the file to read.
 * @param {T} [encoding] `OPTIONAL` The encoding to use. If `undefined` or `null`, returns a `Buffer`.
 * @returns {ReadFileReturnType<T>} The file contents.
 */
export const readFileSync = <T extends BufferEncodingOrNull = undefined>(path: PathLikeTypes, encoding?: T): ReadFileReturnType<T> => {
  const p = pathLikeToString(path)
  return nodeReadFileSync(p, encoding) as ReadFileReturnType<T>
}

/**
 * Asynchronously reads a file as a list of lines.
 *
 * Automatically trims and splits the file content on newline characters.
 * Assumes the file content is text (not binary).
 * - - - -
 * @param {PathLikeTypes} path The path to the file.
 * @param {BufferEncodingText | undefined} [encoding] `OPTIONAL` The encoding to use. If not provided, defaults to `'utf8'`.
 * @returns {Promise<string[]>} A promise that resolves to an array of trimmed lines.
 */
export const readLines = async (path: PathLikeTypes, encoding: BufferEncodingText = 'utf8'): Promise<string[]> => {
  const p = pathLikeToString(path)
  const content = await readFile(p, encoding)
  return Buffer.isBuffer(content) ? content.toString(encoding).trim().split('\n') : content.trim().split('\n')
}

/**
 * Synchronously reads a file as a list of lines.
 *
 * Automatically trims and splits the file content on newline characters.
 * Assumes the file content is text (not binary).
 * - - - -
 * @param {PathLikeTypes} path The path to the file.
 * @param {BufferEncodingText | undefined} [encoding] `OPTIONAL` The encoding to use. If not provided, defaults to `'utf8'`.
 * @returns {string[]} An array of trimmed lines.
 */
export const readLinesSync = (path: PathLikeTypes, encoding: BufferEncodingText = 'utf8'): string[] => {
  const p = pathLikeToString(path)
  const content = readFileSync(p, encoding)
  return Buffer.isBuffer(content) ? content.toString(encoding).trim().split('\n') : content.trim().split('\n')
}

/**
 * Asynchronously reads a JSON file and parses it into an object.
 *
 * Attempts to decode the content using the provided encoding, then parses it using `JSON.parse`.
 * Throws a `PathError` if the JSON is invalid.
 * - - - -
 * @param {PathLikeTypes} path The path to the JSON file.
 * @param {BufferEncodingText} [encoding] `OPTIONAL` The encoding to use when reading the file. Defaults to `'utf8'`.
 * @returns {Promise<unknown>} A promise that resolves to the parsed JSON object.
 * @throws {PathError} If the file contains invalid JSON.
 */
export const readJSON = async (path: PathLikeTypes, encoding?: BufferEncodingText): Promise<unknown> => {
  const p = pathLikeToString(path)
  const contents = await readFile(p, encoding)
  try {
    return JSON.parse(Buffer.isBuffer(contents) ? contents.toString(encoding) : contents)
  } catch (err) {
    if (err instanceof Error) throw new PathError(err.message)
    else throw err
  }
}

/**
 * Synchronously reads a JSON file and parses it into an object.
 *
 * Attempts to decode the content using the provided encoding, then parses it using `JSON.parse`.
 * Throws a `PathError` if the JSON is invalid.
 * - - - -
 * @param {PathLikeTypes} path The path to the JSON file.
 * @param {BufferEncodingText} [encoding] `OPTIONAL` The encoding to use when reading the file. Defaults to `'utf8'`.
 * @returns {unknown} A parsed JSON object.
 * @throws {PathError} If the file contains invalid JSON.
 */
export const readJSONSync = (path: PathLikeTypes, encoding?: BufferEncodingText): unknown => {
  const p = pathLikeToString(path)
  const contents = readFileSync(p, encoding)
  try {
    return JSON.parse(Buffer.isBuffer(contents) ? contents.toString(encoding) : contents)
  } catch (err) {
    if (err instanceof Error) throw new PathError(err.message)
    else throw err
  }
}

/**
 * Asynchronously reads a portion of a file starting from a specific byte offset.
 *
 * If `byteLength` is provided, reads that many bytes using a file descriptor.
 * Otherwise, reads the whole file and returns a subarray starting at the offset.
 * - - - -
 * @param {PathLikeTypes} path The path to the file.
 * @param {number} byteOffset The byte offset from which to start reading.
 * @param {number} [byteLength] `OPTIONAL` The number of bytes to read. If not provided, reads to the end of the file.
 * @returns {Promise<Buffer>} A promise that resolves to the requested buffer segment.
 */
export const readFileOffset = async (path: PathLikeTypes, byteOffset: number, byteLength?: number) => {
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
 * Asynchronously reads the contents of a directory and returns a list of file and folder names.
 *
 * By default, returns absolute paths to each entry. You can change this behavior
 * by setting `asAbsolutePaths` to `false`, in which case it will return only the names.
 * - - - -
 * @param {PathLikeTypes} dirPath The path to the directory to read.
 * @param {boolean} [asAbsolutePaths] `OPTIONAL` Whether to return absolute paths or just entry names.
 * @returns {Promise<string[]>} A promise that resolves to an array of directory entries. Entries are either absolute paths or names depending on the flag.
 * @throws {PathError} If the directory cannot be read or does not exist.
 */
export const readDir = async (dirPath: PathLikeTypes, asAbsolutePaths = true): Promise<string[]> => {
  const dp = pathLikeToString(dirPath)
  if (asAbsolutePaths) return (await readdir(dp)).map((path) => resolve(dp, path))
  else return await readdir(dp)
}

/**
 * Synchronously reads the contents of a directory and returns a list of file and folder names.
 *
 * By default, returns absolute paths to each entry. You can change this behavior
 * by setting `asAbsolutePaths` to `false`, in which case it will return only the names.
 * - - - -
 * @param {PathLikeTypes} dirPath The path to the directory to read.
 * @param {boolean} [asAbsolutePaths] `OPTIONAL` Whether to return absolute paths or just entry names.
 * @returns {string[]} An array of directory entries. Entries are either absolute paths or names depending on the flag.
 * @throws {PathError} If the directory cannot be read or does not exist.
 */
export const readDirSync = (dirPath: PathLikeTypes, asAbsolutePaths = true): string[] => {
  const dp = pathLikeToString(dirPath)
  if (asAbsolutePaths) return readdirSync(dp).map((path) => resolve(dp, path))
  else return readdirSync(dp)
}
