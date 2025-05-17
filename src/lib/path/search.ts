import { Dirent, readdirSync } from 'fs'
import { readdir } from 'fs/promises'
import type { DirPathLikeTypes } from '../../core.exports'
import { pathLikeToString, resolve } from '../../lib.exports'

/**
 * Synchronously searches for files and directories in a folder that match a given pattern.
 * - - - -
 * @param {DirPathLikeTypes} dirPath The directory to search in.
 * @param {RegExp | string | (RegExp | string)[]} [pattern] `OPTIONAL` A RegExp, a string pattern, or an array of RegExp and string patterns to match file or directory names. If no pattern is provided, all paths will be returned on the array.
 * @param {boolean} [recursive] `OPTIONAL` Whether to search recursively. Defaults to `true`.
 * @returns {string[]} An array of absolute paths that match the pattern.
 */
export const searchInFolderSync = (dirPath: DirPathLikeTypes, pattern: RegExp | string | (RegExp | string)[] = '', recursive = true): string[] => {
  const results: string[] = []
  const regex = pattern ? (Array.isArray(pattern) ? pattern.map((p) => (typeof p === 'string' ? new RegExp(p) : p)) : typeof pattern === 'string' ? new RegExp(pattern) : pattern) : null

  /**
   * Internal helper function to perform the search.
   * @param {string} currentDir The current directory being searched.
   */
  const search = (currentDir: string): void => {
    const entries: Dirent[] = readdirSync(currentDir, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = resolve(currentDir, entry.name)

      if (!regex) results.push(fullPath)
      else if (Array.isArray(regex)) {
        for (const regexp of regex) {
          if (regexp.test(entry.name)) {
            results.push(fullPath)
            break
          }
        }
      } else if (regex.test(entry.name)) {
        results.push(fullPath)
      }

      if (recursive && entry.isDirectory()) {
        search(fullPath)
      }
    }
  }

  search(pathLikeToString(dirPath))
  return results
}

/**
 * Asynchronously searches for files and directories in a folder that match a given pattern.
 * - - - -
 * @param {DirPathLikeTypes} dirPath The directory to search in.
 * @param {RegExp | string | (RegExp | string)[]} [pattern] `OPTIONAL` A RegExp, a string pattern, or an array of RegExp and string patterns to match file or directory names. If no pattern is provided, all paths will be returned on the array.
 * @param {boolean} [recursive] `OPTIONAL` Whether to search recursively. Defaults to `true`.
 * @returns {Promise<string[]>} An array of absolute paths that match the pattern.
 */
export const searchInFolder = async (dirPath: DirPathLikeTypes, pattern: RegExp | string | (RegExp | string)[] = '', recursive = true): Promise<string[]> => {
  const results: string[] = []
  const regex = pattern ? (Array.isArray(pattern) ? pattern.map((p) => (typeof p === 'string' ? new RegExp(p) : p)) : typeof pattern === 'string' ? new RegExp(pattern) : pattern) : null

  /**
   * Internal helper function to perform the search.
   * @param {string} currentDir The current directory being searched.
   */
  const search = async (currentDir: string): Promise<void> => {
    const entries: Dirent[] = await readdir(currentDir, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = resolve(currentDir, entry.name)

      if (!regex) results.push(fullPath)
      else if (Array.isArray(regex)) {
        for (const regexp of regex) {
          if (regexp.test(entry.name)) {
            results.push(fullPath)
            break
          }
        }
      } else if (regex.test(entry.name)) {
        results.push(fullPath)
      }

      if (recursive && entry.isDirectory()) {
        await search(fullPath)
      }
    }
  }

  await search(pathLikeToString(dirPath))
  return results
}
