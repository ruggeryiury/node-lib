import { extname as nodeExtname } from 'node:path'
import type { FilePathLikeTypes } from '../../core.exports'
import { pathLikeToString } from '../../lib.exports'

/**
 * Returns the extension of the path, from the last `.` to end of string
 * in the last portion of the path.
 *
 * If there is no `.` in the last portion of the path or the first
 * character of it is `.`, then it returns an empty string.
 * - - - -
 * @param {FilePathLikeTypes} path The path to evaluate.
 * @returns {string}
 */
export const extname = (path: FilePathLikeTypes): string => {
  const p = pathLikeToString(path)
  return nodeExtname(p)
}
