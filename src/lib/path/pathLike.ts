import { FilePath } from '../../core'
import { resolve, type PathLikeTypes } from '../../lib'

/**
 * Evaluates path-like variables to an instantiated `FilePath` class.
 * - - - -
 * @param {PathLikeTypes} path Any path as string or an instantiated `FilePath` class.
 * @returns {FilePath} An instantiated `Path` class.
 */
export const pathLikeToFilePath = (path: PathLikeTypes): FilePath => {
  if (path instanceof FilePath) return path
  else if (typeof path === 'object' && 'path' in path) return new FilePath(path.path)
  else return new FilePath(path)
}

/**
 * Evaluates path-like variables to `string`.
 * - - - -
 * @param {PathLikeTypes} path Any path as string or an instantiated `Path` class.
 * @returns {string}
 */
export const pathLikeToString = (path: PathLikeTypes): string => {
  if (path instanceof FilePath || (typeof path === 'object' && 'path' in path)) return resolve(path.path)
  else return resolve(path)
}
