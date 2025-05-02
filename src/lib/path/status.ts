import { lstatSync, type Stats } from 'node:fs'
import { lstat } from 'node:fs/promises'
import { pathLikeToString, type PathLikeTypes } from '../../lib.exports'

/**
 * Asynchronously returns an object with the path stats.
 * - - - -
 * @param {PathLikeTypes} path The path to evaluate.
 * @returns {Promise<Stats>}
 */
export const stat = async (path: PathLikeTypes): Promise<Stats> => {
  const p = pathLikeToString(path)
  return await lstat(p)
}
/**
 * Synchronously returns an object with the path stats.
 * - - - -
 * @param {PathLikeTypes} path The path to evaluate.
 * @returns {Stats}
 */
export const statSync = (path: PathLikeTypes): Stats => {
  const p = pathLikeToString(path)
  return lstatSync(p)
}
/**
 * Returns `true` if the path resolves to a file, `false` otherwise.
 * - - - -
 * @param {PathLikeTypes} path The path to evaluate.
 * @returns {boolean}
 */
export const isFile = (path: PathLikeTypes): boolean => {
  const p = pathLikeToString(path)
  return statSync(p).isFile()
}

/**
 * Returns `true` if the path resolves to a directory, `false` otherwise.
 * - - - -
 * @param {PathLikeTypes} path The path to evaluate.
 * @returns {boolean}
 */
export const isDir = (path: PathLikeTypes): boolean => {
  const p = pathLikeToString(path)
  return statSync(p).isDirectory()
}

/**
 * Returns `true` if the path resolves to a symbolic link, `false` otherwise.
 * - - - -
 * @param {PathLikeTypes} path The path to evaluate.
 * @returns {Promise<boolean>}
 */
export const isSymLink = async (path: PathLikeTypes): Promise<boolean> => {
  const p = pathLikeToString(path)
  return (await stat(p)).isSymbolicLink()
}
