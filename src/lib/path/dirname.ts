import { dirname as nodeDirname } from 'node:path'
import type { FilePathLikeTypes } from '../../core.exports'
import { pathLikeToString } from '../../lib.exports'

/**
 * Returns the directory name of a path.
 * - - - -
 * @param {FilePathLikeTypes} path The path to evaluate.
 * @returns {string}
 */
export const dirname = (path: FilePathLikeTypes): string => {
  const p = pathLikeToString(path)
  return nodeDirname(p)
}
