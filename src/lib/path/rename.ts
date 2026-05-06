import { renameSync } from 'node:fs'
import { rename } from 'node:fs/promises'
import { deleteDir, deleteDirSync, deleteFile, deleteFileSync, dirname, exists, isAbsolute, pathLikeToString, resolve } from '../../lib.exports'
import { type DirPathLikeTypes, type FilePathLikeTypes, DirPath, FilePath } from '../../core.exports'

/**
 * Asynchronously renames (or moves) a file from an old path to a new path.
 *
 * If the new path already exists:
 * - Throws an error unless `replace` is `true`.
 * - If `replace` is `true`, deletes the destination file before renaming.
 *
 * Automatically resolves relative `newPath` values based on the directory of the `oldPath`.
 * - - - -
 * @param {FilePathLikeTypes} oldPath The current file path.
 * @param {FilePathLikeTypes} newPath The new file path. Can be relative or absolute.
 * @param {boolean} [replace] `OPTIONAL` Whether to overwrite the file at the destination if it exists. Default is `false`.
 * @returns {Promise<FilePath>} A promise that resolves to a `FilePath` instance representing the new path of the renamed file.
 * @throws {Error} If the destination file exists and `replace` is `false`.
 */
export const renameFile = async (oldPath: FilePathLikeTypes, newPath: FilePathLikeTypes, replace: boolean = false): Promise<FilePath> => {
  const p = pathLikeToString(oldPath)
  let np = ''
  if (typeof newPath === 'object' && 'path' in newPath) {
    if (newPath instanceof FilePath) np = newPath.path
    else np = newPath.path
  } else np = newPath

  if (!isAbsolute(np)) np = resolve(dirname(p), np)

  if (exists(np)) {
    if (!replace) throw new Error(`Provided path ${np} already exists. Please, choose another file name.`)
    else await deleteFile(np)
  }
  await rename(p, np)
  return new FilePath(np)
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
 * @param {FilePathLikeTypes} oldPath The current file path.
 * @param {FilePathLikeTypes} newPath The new file path. Can be relative or absolute.
 * @param {boolean} [replace] `OPTIONAL` Whether to overwrite the file at the destination if it exists.
 * @returns {FilePath} A `FilePath` instance representing the new path of the renamed file.
 * @throws {Error} If the destination file exists and `replace` is `false`.
 */
export const renameFileSync = (oldPath: FilePathLikeTypes, newPath: FilePathLikeTypes, replace: boolean = false): FilePath => {
  const op = pathLikeToString(oldPath)
  let np = ''
  if (typeof newPath === 'object' && 'path' in newPath) {
    if (newPath instanceof FilePath) np = newPath.path
    else np = newPath.path
  } else np = newPath

  if (!isAbsolute(np)) np = resolve(dirname(op), np)

  if (exists(np)) {
    if (!replace) throw new Error(`Provided path ${np} already exists. Please, choose another file name.`)
    else deleteFileSync(np)
  }
  renameSync(op, np)
  return new FilePath(np)
}

/**
 * Asynchronously renames (or moves) a directory from an old path to a new path.
 *
 * If the new path already exists:
 * - Throws an error unless `replace` is `true`.
 * - If `replace` is `true`, deletes the destination folder before renaming.
 *
 * Automatically resolves relative `newPath` values based on the `oldPath`.
 * - - - -
 * @param {DirPathLikeTypes} oldPath The current directory path.
 * @param {DirPathLikeTypes} newPath The new directory path. Can be relative or absolute.
 * @param {boolean} [replace] `OPTIONAL` Whether to overwrite the directory at the destination if it exists. Default is `false`.
 * @returns {Promise<DirPath>} A promise that resolves to a `DirPath` instance representing the new path of the renamed file.
 * @throws {Error} If the destination directory exists and `replace` is `false`.
 */
export const renameDir = async (oldPath: DirPathLikeTypes, newPath: DirPathLikeTypes, replace: boolean = false): Promise<DirPath> => {
  const p = pathLikeToString(oldPath)
  let np = ''
  if (typeof newPath === 'object' && 'path' in newPath) {
    if (newPath instanceof DirPath) np = newPath.path
    else np = newPath.path
  } else np = newPath

  if (!isAbsolute(np)) np = resolve(dirname(p), np)

  if (exists(np)) {
    if (!replace) throw new Error(`Provided path ${np} already exists. Please, choose another file name.`)
    else await deleteDir(np, true)
  }
  await rename(p, np)
  return new DirPath(np)
}

/**
 * Synchronously renames (or moves) a directory from an old path to a new path.
 *
 * If the new path already exists:
 * - Throws an error unless `replace` is `true`.
 * - If `replace` is `true`, deletes the destination folder before renaming.
 *
 * Automatically resolves relative `newPath` values based on the `oldPath`.
 * - - - -
 * @param {DirPathLikeTypes} oldPath The current directory path.
 * @param {DirPathLikeTypes} newPath The new directory path. Can be relative or absolute.
 * @param {boolean} [replace] `OPTIONAL` Whether to overwrite the directory at the destination if it exists. Default is `false`.
 * @returns {DirPath} A promise that resolves to a `DirPath` instance representing the new path of the renamed file.
 * @throws {Error} If the destination directory exists and `replace` is `false`.
 */
export const renameDirSync = (oldPath: DirPathLikeTypes, newPath: DirPathLikeTypes, replace: boolean = false): DirPath => {
  const p = pathLikeToString(oldPath)
  let np = ''
  if (typeof newPath === 'object' && 'path' in newPath) {
    if (newPath instanceof DirPath) np = newPath.path
    else np = newPath.path
  } else np = newPath

  if (!isAbsolute(np)) np = resolve(dirname(p), np)

  if (exists(np)) {
    if (!replace) throw new Error(`Provided path ${np} already exists. Please, choose another file name.`)
    else deleteDirSync(np)
  }
  renameSync(p, np)
  return new DirPath(np)
}
