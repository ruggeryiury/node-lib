import { resolve as nodeResolve } from 'node:path'

/**
 * Resolves a sequence of paths or path segments.
 * - - - -
 * @param {string[]} paths A sequence of paths or path segments.
 * @returns {string}
 */
export const resolve = (...paths: string[]): string => {
  return nodeResolve(...paths)
}
