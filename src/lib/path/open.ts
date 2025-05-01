import { open as nodeOpen, type FileHandle } from 'node:fs/promises'
import { pathLikeToString, type PathLikeTypes } from '../../lib'

/**
 * Asynchronously opens a `FileHandle`.
 * - - - -
 * @param {PathLikeTypes} path The file path that will be opened a `FileHandle`.
 * @param {string | number | undefined} [flags] `OPTIONAL` The file system flag. See the supported flags [here](https://nodejs.org/api/fs.html#file-system-flags). Default is `'r'` (Read).
 * @returns {Promise<FileHandle>} A promise resolving to a `FileHandle` object.
 */
export const openFile = async (path: PathLikeTypes, flags?: string | number): Promise<FileHandle> => {
  const p = pathLikeToString(path)
  return await nodeOpen(p, flags)
}
