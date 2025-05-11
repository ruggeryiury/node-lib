import { isAbsolute as nodeIsAbsolute } from 'node:path'
import { FilePath, type FilePathLikeTypes } from '../../core.exports'

/**
 * Determines whether path is an absolute path.
 *
 * An absolute path will always resolve to the same location, regardless of the working directory.
 * - - - -
 * @param {FilePathLikeTypes} path The path to evaluate.
 * @returns {boolean}
 */
export const isAbsolute = (path: FilePathLikeTypes): boolean => {
  if (path instanceof FilePath) return true
  else if (typeof path === 'object') return nodeIsAbsolute(path.path)
  return nodeIsAbsolute(path)
}

/**
 * Determines whether path is a relative path.
 * - - - -
 * @param {FilePathLikeTypes} path The path to evaluate.
 * @returns {boolean}
 */
export const isRelative = (path: FilePathLikeTypes): boolean => {
  return !isAbsolute(path)
}
