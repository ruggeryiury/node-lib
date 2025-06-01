import type { FilePathLikeTypes } from '../../core.exports'
import { exists, isDir, isFile, isSymLink, pathLikeToString } from '../../lib.exports'

/**
 * Ensures that a given path exists, throwing a `Error` if it does not.
 *
 * Optionally describes the operation and expected path type in the error message.
 * - - - -
 * @param {FilePathLikeTypes} path The path to check.
 * @param {string} [operator] `OPTIONAL` The name of the operation being performed (used in the error message).
 * @param {'file' | 'directory'} [checkExistenceAs] `OPTIONAL` The description of the expected path type.
 * @returns {true} Returns `true` if the path exists.
 * @throws {Error} If the path does not exist.
 */
export const ensurePathExistence = (path: FilePathLikeTypes, operator?: string, checkExistenceAs?: 'file' | 'directory'): true => {
  const p = pathLikeToString(path)
  if (!exists(p)) throw new Error(`Provided path ${p} does not exists${operator ? ` to perform ${operator}() operation` : ''}. Please, provide a path that resolves to an actual ${checkExistenceAs ?? 'file or directory'}.`)
  return true
}
/**
 * Ensures that a given path does not exist, throwing a `Error` if it does.
 *
 * Optionally describes the operation and expected path type in the error message.
 * - - - -
 * @param {FilePathLikeTypes} path The path to check.
 * @param {string} [operator] `OPTIONAL` The name of the operation being performed (used in the error message).
 * @returns {true} Returns `true` if the path exists.
 * @throws {Error} If the path does not exist.
 */
export const ensurePathNonExistence = (path: FilePathLikeTypes, operator?: string): true => {
  const p = pathLikeToString(path)
  if (exists(p)) throw new Error(`Provided path ${p} already exists${operator ? ` to perform ${operator}() operation` : ''}.`)
  return true
}

/**
 * Ensures that a given path exists and is a file.
 *
 * Throws a `Error` if the path is not a file.
 * - - - -
 * @param {FilePathLikeTypes} path The path to check.
 * @param {string} [operator] `OPTIONAL` The name of the operation being performed (used in the error message).
 * @returns {true} Returns `true` if the path is a file.
 * @throws {Error} If the path is not a file.
 */
export const ensurePathIsFile = (path: FilePathLikeTypes, operator?: string): true => {
  const p = pathLikeToString(path)
  if (!isFile(p)) throw new Error(`Provided path ${p} is not a file${operator ? ` to perform file ${operator}() operation` : ''}.`)
  return true
}

/**
 * Ensures that a given path exists and is a directory.
 *
 * Throws a `Error` if the path is not a directory.
 * - - - -
 * @param {FilePathLikeTypes} path The path to check.
 * @param {string} [operator] `OPTIONAL` The name of the operation being performed (used in the error message).
 * @returns {true} Returns `true` if the path is a directory.
 * @throws {Error} If the path is not a directory.
 */
export const ensurePathIsDir = (path: FilePathLikeTypes, operator?: string): true => {
  const p = pathLikeToString(path)
  if (!isDir(p)) throw new Error(`Provided path ${p} is not a directory${operator ? ` to perform directory ${operator}() operation` : ''}.`)
  return true
}

/**
 * Ensures that a given path exists and is a symbolic link.
 *
 * Throws a `Error` if the path is not a symlink.
 * - - - -
 * @param {FilePathLikeTypes} path The path to check.
 * @param {string} [operator] `OPTIONAL` The name of the operation being performed (used in the error message).
 * @returns {Promise<true>} Returns `true` if the path is a symbolic link.
 * @throws {Error} If the path is not a symbolic link.
 */
export const ensurePathIsSymLink = async (path: FilePathLikeTypes, operator?: string): Promise<true> => {
  const p = pathLikeToString(path)
  if (!(await isSymLink(p))) throw new Error(`Provided path ${p} is not a symbolic link${operator ? ` to perform symlink ${operator}() operation` : ''}.`)
  return true
}
