import { createReadStream, createWriteStream, ReadStream, type ReadStreamOptions, type WriteStream, type WriteStreamOptions } from 'node:fs'
import type { BufferEncodingOrNull, FilePathLikeTypes } from '../../core.exports'
import { deleteFile, deleteFileSync, exists, pathLikeToString } from '../../lib.exports'

/**
 * Asynchronously creates a writable file stream at the specified path.
 *
 * If a file already exists at the path, it will be deleted before creating the stream.
 * Optionally accepts an encoding; if `null` is passed, defaults to `utf8`.
 * - - - -
 * @param {FilePathLikeTypes} path The path where the file should be written.
 * @param {BufferEncodingOrNull | WriteStreamOptions | undefined} [encodingOrOptions] `OPTIONAL` The character encoding to use or an `WriteStreamOptions` object. If `null`, the `utf8` encoding is used as parameter.
 * @returns {Promise<WriteStream>} An instance of `fs.WriteStream` that are created and returned using the `fs.createWriteStream` function.
 */
export const createFileWriteStream = async (path: FilePathLikeTypes, encodingOrOptions?: BufferEncodingOrNull | WriteStreamOptions): Promise<WriteStream> => {
  const p = pathLikeToString(path)
  if (exists(p)) await deleteFile(p)
  return createWriteStream(p, encodingOrOptions === null ? 'utf8' : encodingOrOptions)
}

/**
 * Synchronously creates a writable file stream at the specified path.
 *
 * If a file already exists at the path, it will be deleted before creating the stream.
 * Optionally accepts an encoding; if `null` is passed, defaults to `'utf8'`.
 * - - - -
 * @param {FilePathLikeTypes} path The path where the file should be written.
 * @param {BufferEncodingOrNull | WriteStreamOptions | undefined} [encodingOrOptions] `OPTIONAL` The character encoding to use or an `WriteStreamOptions` object. If `null`, the `utf8` encoding is used as parameter.
 * @returns {WriteStream} An instance of `fs.WriteStream` that are created and returned using the `fs.createWriteStream` function.
 */
export const createFileWriteStreamSync = (path: FilePathLikeTypes, encodingOrOptions?: BufferEncodingOrNull | WriteStreamOptions): WriteStream => {
  const p = pathLikeToString(path)
  if (exists(p)) deleteFileSync(p)
  return createWriteStream(p, encodingOrOptions === null ? 'utf8' : encodingOrOptions)
}

/**
 * Synchronously creates a readable file stream at the specified path.
 * - - - -
 * @param {FilePathLikeTypes} path The path where the file should open a read stream.
 * @param {BufferEncodingOrNull | ReadStreamOptions | undefined} [encodingOrOptions] `OPTIONAL` The character encoding to use or an `ReadStreamOptions` object. If `null`, the `utf8` encoding is used as parameter.
 * @returns {ReadStream}
 */
export const createFileReadStream = (path: FilePathLikeTypes, encodingOrOptions?: BufferEncodingOrNull | ReadStreamOptions): ReadStream => {
  const p = pathLikeToString(path)
  return createReadStream(p, encodingOrOptions === null ? 'utf8' : encodingOrOptions)
}
