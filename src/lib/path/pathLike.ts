import { DirPath, FilePath, type DirPathLikeTypes, type FilePathLikeTypes } from '../../core.exports'
import { resolve } from '../../lib.exports'

/**
 * Evaluates path-like variables to an instantiated `FilePath` class.
 * - - - -
 * @param {FilePathLikeTypes} path Any path as string or an instantiated `FilePath` class.
 * @returns {FilePath} An instantiated `Path` class.
 */
export const pathLikeToFilePath = (path: FilePathLikeTypes): FilePath => {
  if (path instanceof FilePath) return path
  else if (typeof path === 'object' && 'path' in path) return new FilePath(path.path)
  else return new FilePath(path)
}

/**
 * Evaluates path-like variables to an instantiated `DirPath` class.
 * - - - -
 * @param {DirPathLikeTypes} path Any path as string or an instantiated `DirPath` class.
 * @returns {DirPath} An instantiated `Path` class.
 */
export const pathLikeToDirPath = (path: DirPathLikeTypes): DirPath => {
  if (path instanceof DirPath) return path
  else if (typeof path === 'object' && 'path' in path) return new DirPath(path.path)
  else return new DirPath(path)
}
/**
 * Evaluates path-like variables to `string`.
 * - - - -
 * @param {FilePathLikeTypes | DirPathLikeTypes} path Any path as string or an instantiated `Path` class.
 * @returns {string}
 */
export const pathLikeToString = (path: FilePathLikeTypes | DirPathLikeTypes): string => {
  if (path instanceof FilePath || path instanceof DirPath || (typeof path === 'object' && 'path' in path)) return resolve(path.path)
  else return resolve(path)
}
