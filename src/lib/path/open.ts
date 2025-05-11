import { open as nodeOpen, type FileHandle } from 'node:fs/promises'
import type { FilePathLikeTypes } from '../../core.exports'
import { pathLikeToString } from '../../lib.exports'

/**
 * Asynchronously opens a `FileHandle`.
 * - - - -
 * @param {FilePathLikeTypes} path The file path that will be opened a `FileHandle`.
 * @param {string | number | undefined} [flags] `OPTIONAL` The file system flag. See the supported flags [here](https://nodejs.org/api/fs.html#file-system-flags). Default is `'r'` (Read).
 * @returns {Promise<FileHandle>} A promise resolving to a `FileHandle` object.
 */
export const openFile = async (path: FilePathLikeTypes, flags?: string | number): Promise<FileHandle> => {
  const p = pathLikeToString(path)
  return await nodeOpen(p, flags)
}
