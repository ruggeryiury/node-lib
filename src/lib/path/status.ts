import { lstatSync, type Stats } from 'node:fs'
import { lstat } from 'node:fs/promises'
import type { DirPathLikeTypes, FilePathLikeTypes } from '../../core.exports'
import { pathLikeToString } from '../../lib.exports'

/**
 * Asynchronously returns an object with the path stats.
 * - - - -
 * @param {FilePathLikeTypes} path The path to evaluate.
 * @returns {Promise<Stats>}
 */
export const stat = async (path: FilePathLikeTypes | DirPathLikeTypes): Promise<Stats> => {
  const p = pathLikeToString(path)
  return await lstat(p)
}
/**
 * Synchronously returns an object with the path stats.
 * - - - -
 * @param {FilePathLikeTypes} path The path to evaluate.
 * @returns {Stats}
 */
export const statSync = (path: FilePathLikeTypes | DirPathLikeTypes): Stats => {
  const p = pathLikeToString(path)
  return lstatSync(p)
}
/**
 * Returns `true` if the path resolves to a file, `false` otherwise.
 * - - - -
 * @param {FilePathLikeTypes} path The path to evaluate.
 * @returns {boolean}
 */
export const isFile = (path: FilePathLikeTypes | DirPathLikeTypes): boolean => {
  const p = pathLikeToString(path)
  return statSync(p).isFile()
}

/**
 * Returns `true` if the path resolves to a directory, `false` otherwise.
 * - - - -
 * @param {FilePathLikeTypes} path The path to evaluate.
 * @returns {boolean}
 */
export const isDir = (path: FilePathLikeTypes | DirPathLikeTypes): boolean => {
  const p = pathLikeToString(path)
  return statSync(p).isDirectory()
}

/**
 * Returns `true` if the path resolves to a symbolic link, `false` otherwise.
 * - - - -
 * @param {FilePathLikeTypes} path The path to evaluate.
 * @returns {Promise<boolean>}
 */
export const isSymLink = async (path: FilePathLikeTypes | DirPathLikeTypes): Promise<boolean> => {
  const p = pathLikeToString(path)
  return (await stat(p)).isSymbolicLink()
}
