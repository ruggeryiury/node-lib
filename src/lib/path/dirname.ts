import { dirname as nodeDirname } from 'node:path'
import type { PathLikeTypes } from '../../core.exports'
import { pathLikeToString } from '../../lib.exports'

/**
 * Returns the directory name of a path.
 * - - - -
 * @param {PathLikeTypes} path The path to evaluate.
 * @returns {string}
 */
export const dirname = (path: PathLikeTypes): string => {
  const p = pathLikeToString(path)
  return nodeDirname(p)
}
