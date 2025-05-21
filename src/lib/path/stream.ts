import { createWriteStream, WriteStream } from 'node:fs'
import type { BufferEncodingOrNull, FilePathLikeTypes } from '../../core.exports'
import { deleteFile, deleteFileSync, exists, pathLikeToString } from '../../lib.exports'

/**
 * Asynchronously creates a writable file stream at the specified path.
 *
 * If a file already exists at the path, it will be deleted before creating the stream.
 * Optionally accepts an encoding; if `null` is passed, defaults to `utf8`.
 * - - - -
 * @param {FilePathLikeTypes} path The path where the file should be written.
 * @param {BufferEncodingOrNull} [encoding] `OPTIONAL` The character encoding to use. If `null`, `utf8` is used.
 * @returns {Promise<WriteStream>} An instance of `fs.WriteStream` that are created and returned using the `fs.createWriteStream` function.
 */
export const createFileWriteStream = async (path: FilePathLikeTypes, encoding?: BufferEncodingOrNull): Promise<WriteStream> => {
  const p = pathLikeToString(path)
  if (exists(p)) await deleteFile(p)
  return createWriteStream(p, encoding === null ? 'utf8' : encoding)
}

/**
 * Synchronously creates a writable file stream at the specified path.
 *
 * If a file already exists at the path, it will be deleted before creating the stream.
 * Optionally accepts an encoding; if `null` is passed, defaults to `'utf8'`.
 * - - - -
 * @param {FilePathLikeTypes} path The path where the file should be written.
 * @param {BufferEncodingOrNull} [encoding] `OPTIONAL` The character encoding to use. If `null`, `'utf8'` is used.
 * @returns {WriteStream} An instance of `fs.WriteStream` that are created and returned using the `fs.createWriteStream` function.
 */
export const createFileWriteStreamSync = (path: FilePathLikeTypes, encoding?: BufferEncodingOrNull): WriteStream => {
  const p = pathLikeToString(path)
  if (exists(p)) deleteFileSync(p)
  return createWriteStream(p, encoding === null ? 'utf8' : encoding)
}
