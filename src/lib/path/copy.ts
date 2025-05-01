import { copyFileSync as nodeCopyFileSync } from 'node:fs'
import { copyFile as nodeCopyFile } from 'node:fs/promises'
import { FilePath } from '../../core'
import { PathError } from '../../errors'
import { deleteFile, deleteFileSync, dirname, exists, isAbsolute, pathLikeToString, resolve, type PathLikeTypes } from '../../lib'

/**
 * Asynchronously copies a file from a source path to a destination path.
 *
 * If the destination path already exists:
 * - Throws an error unless `replace` is set to `true`.
 * - If `replace` is `true`, deletes the existing file before copying.
 *
 * Automatically resolves relative destination paths based on the source file's directory.
 * - - - -
 * @param {PathLikeTypes} srcPath The source file path to copy from.
 * @param {PathLikeTypes} destPath The destination file path to copy to. Can be relative or absolute.
 * @param {boolean} [replace] `OPTIONAL` Whether to replace the destination file if it already exists.
 * @returns {Promise<FilePath>} A promise that resolves to a `FilePath` instance pointing to the newly copied file.
 * @throws {PathError} If the destination file exists and `replace` is `false`.
 */
export const copyFile = async (srcPath: PathLikeTypes, destPath: PathLikeTypes, replace = false): Promise<FilePath> => {
  const sp = pathLikeToString(srcPath)
  let dp = ''
  if (typeof destPath === 'object' && 'path' in destPath) {
    if (destPath instanceof FilePath) dp = destPath.path
    else dp = destPath.path
  } else dp = destPath

  if (!isAbsolute(dp)) dp = resolve(dirname(sp), dp)

  if (exists(dp)) {
    if (!replace) throw new PathError(`Provided path ${dp} already exists. Please, choose another file name.`)
    else await deleteFile(dp)
  }
  await nodeCopyFile(sp, dp)
  return new FilePath(dp)
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
 * @param {PathLikeTypes} srcPath The source file path to copy from.
 * @param {PathLikeTypes} destPath The destination file path to copy to. Can be relative or absolute.
 * @param {boolean} [replace] `OPTIONAL` Whether to replace the destination file if it already exists.
 * @returns {Promise<FilePath>} A `FilePath` instance pointing to the newly copied file.
 * @throws {PathError} If the destination file exists and `replace` is `false`.
 */
export const copyFileSync = (srcPath: PathLikeTypes, destPath: PathLikeTypes, replace = false): FilePath => {
  const sp = pathLikeToString(srcPath)
  let dp = ''
  if (typeof destPath === 'object' && 'path' in destPath) {
    if (destPath instanceof FilePath) dp = destPath.path
    else dp = destPath.path
  } else dp = destPath

  if (!isAbsolute(dp)) dp = resolve(dirname(sp), dp)

  if (exists(dp)) {
    if (!replace) throw new PathError(`Provided path ${dp} already exists. Please, choose another file name.`)
    else deleteFileSync(dp)
  }
  nodeCopyFileSync(sp, dp)
  return new FilePath(dp)
}
