import { rmSync, unlinkSync } from 'node:fs'
import { rm, unlink } from 'node:fs/promises'
import type { FilePathLikeTypes } from '../../core.exports'
import { exists, pathLikeToString } from '../../lib.exports'

/**
 * Asynchronously deletes a file at the specified path if it exists.
 *
 * Resolves the given path and performs a safe check before deletion to avoid errors.
 * - - - -
 * @param {FilePathLikeTypes} path The path to the file to delete.
 * @returns {Promise<void>}
 */
export const deleteFile = async (path: FilePathLikeTypes): Promise<void> => {
  const p = pathLikeToString(path)
  if (exists(p)) await unlink(p)
}

/**
 * Synchronously deletes a file at the specified path if it exists.
 *
 * Resolves the given path and performs a safe check before deletion to avoid errors.
 * - - - -
 * @param {FilePathLikeTypes} path The path to the file to delete.
 * @returns {void}
 */
export const deleteFileSync = (path: FilePathLikeTypes): void => {
  const p = pathLikeToString(path)
  if (exists(p)) unlinkSync(p)
}

/**
 * Asynchronously deletes a directory at the specified path.
 *
 * By default, deletes the directory recursively (including its contents).
 * - - - -
 * @param {FilePathLikeTypes} dirPath The directory path to delete.
 * @param {boolean} [recursive] `OPTIONAL` Whether to delete the contents of the directory recursively. Default is `true`.
 * @returns {Promise<void>} Resolves when the directory has been removed.
 */
export const deleteDir = async (dirPath: FilePathLikeTypes, recursive = true): Promise<void> => {
  const dp = pathLikeToString(dirPath)
  await rm(dp, { recursive })
}

/**
 * Synchronously deletes a directory at the specified path.
 *
 * By default, deletes the directory recursively (including its contents).
 * - - - -
 * @param {FilePathLikeTypes} dirPath The directory path to delete.
 * @param {boolean} [recursive] `OPTIONAL` Whether to delete the contents of the directory recursively. Default is `true`.
 * @returns {void}
 */
export const deleteDirSync = (dirPath: FilePathLikeTypes, recursive = true): void => {
  const dp = pathLikeToString(dirPath)
  rmSync(dp, { recursive })
}
