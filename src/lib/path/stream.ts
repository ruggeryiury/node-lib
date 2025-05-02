import { once } from 'node:events'
import { createWriteStream } from 'node:fs'
import { deleteFile, deleteFileSync, exists, pathLikeToString, type BufferEncodingOrNull, type FileWriteStreamReturnObject, type PathLikeTypes } from '../../lib.exports'

/**
 * Asynchronously creates a writable file stream at the specified path.
 *
 * If a file already exists at the path, it will be deleted before creating the stream.
 * Optionally accepts an encoding; if `null` is passed, defaults to `utf8`.
 * - - - -
 * @param {PathLikeTypes} path The path where the file should be written.
 * @param {BufferEncodingOrNull} [encoding] `OPTIONAL` The character encoding to use. If `null`, `utf8` is used.
 * @returns {Promise<FileWriteStreamReturnObject>} A promise that resolves to an object containing the writable stream and a promise that resolves when the stream finishes writing.
 */
export const createFileWriteStream = async (path: PathLikeTypes, encoding?: BufferEncodingOrNull): Promise<FileWriteStreamReturnObject> => {
  const p = pathLikeToString(path)
  if (exists(p)) await deleteFile(p)
  const stream = createWriteStream(p, encoding === null ? 'utf8' : encoding)
  return {
    stream,
    once: once(stream, 'finish'),
  }
}

/**
 * Synchronously creates a writable file stream at the specified path.
 *
 * If a file already exists at the path, it will be deleted before creating the stream.
 * Optionally accepts an encoding; if `null` is passed, defaults to `'utf8'`.
 * - - - -
 * @param {PathLikeTypes} path The path where the file should be written.
 * @param {BufferEncodingOrNull} [encoding] `OPTIONAL` The character encoding to use. If `null`, `'utf8'` is used.
 * @returns {Promise<FileWriteStreamReturnObject>} An object containing the writable stream and a promise that resolves when the stream finishes writing.
 */
export const createFileWriteStreamSync = (path: PathLikeTypes, encoding?: BufferEncodingOrNull): FileWriteStreamReturnObject => {
  const p = pathLikeToString(path)
  if (exists(p)) deleteFileSync(p)
  const stream = createWriteStream(p, encoding === null ? 'utf8' : encoding)
  return {
    stream,
    once: once(stream, 'finish'),
  }
}
