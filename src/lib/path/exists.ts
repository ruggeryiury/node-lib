import { existsSync } from 'node:fs'
import { resolve } from '../../lib.exports'

/**
 * Returns `true` if the path exists, `false` otherwise.
 * - - - -
 * @param {string[]} paths A sequence of paths or path segments.
 * @returns {boolean}
 */
export const exists = (...paths: string[]): boolean => {
  return existsSync(resolve(...paths))
}
