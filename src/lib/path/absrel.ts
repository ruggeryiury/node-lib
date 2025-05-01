import { isAbsolute as nodeIsAbsolute } from 'node:path'
import { FilePath } from '../../core'
import type { PathLikeTypes } from '../../lib'


/**
 * Determines whether path is an absolute path.
 *
 * An absolute path will always resolve to the same location, regardless of the working directory.
 * - - - -
 * @param {PathLikeTypes} path The path to evaluate.
 * @returns {boolean}
 */
export const isAbsolute = (path: PathLikeTypes): boolean => {
  if (path instanceof FilePath) return true
  else if (typeof path === 'object') return nodeIsAbsolute(path.path)
  return nodeIsAbsolute(path)
}

/**
 * Determines whether path is a relative path.
 * - - - -
 * @param {PathLikeTypes} path The path to evaluate.
 * @returns {boolean}
 */
export const isRelative = (path: PathLikeTypes): boolean => {
  return !isAbsolute(path)
}
