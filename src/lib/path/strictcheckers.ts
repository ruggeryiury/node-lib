import type { PathLikeTypes } from '../../core.exports'
import { PathError } from '../../errors'
import { exists, isDir, isFile, isSymLink, pathLikeToString } from '../../lib.exports'

/**
 * Ensures that a given path exists, throwing a `PathError` if it does not.
 *
 * Optionally describes the operation and expected path type in the error message.
 * - - - -
 * @param {PathLikeTypes} path The path to check.
 * @param {string} [operator] `OPTIONAL` The name of the operation being performed (used in the error message).
 * @param {'file' | 'directory'} [checkExistenceAs] `OPTIONAL` The description of the expected path type.
 * @returns {true} Returns `true` if the path exists.
 * @throws {PathError} If the path does not exist.
 */
export const ensurePathExistence = (path: PathLikeTypes, operator?: string, checkExistenceAs?: 'file' | 'directory'): true => {
  const p = pathLikeToString(path)
  if (!exists(p)) throw new PathError(`Provided path ${p} does not exists${operator ? ` to perform ${operator}() operation` : ''}. Please, provide a path that resolves to an actual ${checkExistenceAs ?? 'file or directory'}.`)
  return true
}
/**
 * Ensures that a given path does not exist, throwing a `PathError` if it does.
 *
 * Optionally describes the operation and expected path type in the error message.
 * - - - -
 * @param {PathLikeTypes} path The path to check.
 * @param {string} [operator] `OPTIONAL` The name of the operation being performed (used in the error message).
 * @returns {true} Returns `true` if the path exists.
 * @throws {PathError} If the path does not exist.
 */
export const ensurePathNonExistence = (path: PathLikeTypes, operator?: string): true => {
  const p = pathLikeToString(path)
  if (exists(p)) throw new PathError(`Provided path ${p} already exists${operator ? ` to perform ${operator}() operation` : ''}.`)
  return true
}

/**
 * Ensures that a given path exists and is a file.
 *
 * Throws a `PathError` if the path is not a file.
 * - - - -
 * @param {PathLikeTypes} path The path to check.
 * @param {string} [operator] `OPTIONAL` The name of the operation being performed (used in the error message).
 * @returns {true} Returns `true` if the path is a file.
 * @throws {PathError} If the path is not a file.
 */
export const ensurePathIsFile = (path: PathLikeTypes, operator?: string): true => {
  const p = pathLikeToString(path)
  if (!isFile(p)) throw new PathError(`Provided path ${p} is not a file${operator ? ` to perform file ${operator}() operation` : ''}.`)
  return true
}

/**
 * Ensures that a given path exists and is a directory.
 *
 * Throws a `PathError` if the path is not a directory.
 * - - - -
 * @param {PathLikeTypes} path The path to check.
 * @param {string} [operator] `OPTIONAL` The name of the operation being performed (used in the error message).
 * @returns {true} Returns `true` if the path is a directory.
 * @throws {PathError} If the path is not a directory.
 */
export const ensurePathIsDir = (path: PathLikeTypes, operator?: string): true => {
  const p = pathLikeToString(path)
  if (!isDir(p)) throw new PathError(`Provided path ${p} is not a directory${operator ? ` to perform directory ${operator}() operation` : ''}.`)
  return true
}

/**
 * Ensures that a given path exists and is a symbolic link.
 *
 * Throws a `PathError` if the path is not a symlink.
 * - - - -
 * @param {PathLikeTypes} path The path to check.
 * @param {string} [operator] `OPTIONAL` The name of the operation being performed (used in the error message).
 * @returns {Promise<true>} Returns `true` if the path is a symbolic link.
 * @throws {PathError} If the path is not a symbolic link.
 */
export const ensurePathIsSymLink = async (path: PathLikeTypes, operator?: string): Promise<true> => {
  const p = pathLikeToString(path)
  if (!(await isSymLink(p))) throw new PathError(`Provided path ${p} is not a symbolic link${operator ? ` to perform symlink ${operator}() operation` : ''}.`)
  return true
}
