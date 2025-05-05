import { basename as nodeBasename } from 'node:path'
import type { PathLikeTypes } from '../../core.exports'
import { pathLikeToString } from '../../lib.exports'

/**
 * Returns the last portion of a path.
 * - - - -
 * @param {PathLikeTypes} path The path to evaluate.
 * @param {string | undefined} suffix `OPTIONAL` An extension to remove from the result.
 * @returns {string}
 */
export const basename = (path: PathLikeTypes, suffix?: string): string => {
  const p = pathLikeToString(path)
  return nodeBasename(p, suffix)
}
