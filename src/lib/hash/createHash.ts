import { createHash as nodeCreateHash, type BinaryToTextEncoding } from 'node:crypto'
import { pathLikeToFilePath, type AllHashAlgorithms, type PathLikeTypes } from '../../lib'

/**
 * Generates a hash from the input string/Buffer using the specified algorithm.
 * - - - -
 * @param {Buffer | string} input The input to hash.
 * @param {AllHashAlgorithms} [algorithm] The hash algorithm to use. Default is `'sha256'`.
 * @param {BinaryToTextEncoding} [digest] The output encoding for the hash. Default is `'hex'`.
 * @returns {string} The resulting hash string.
 */
export const createHash = (input: Buffer | string, algorithm: AllHashAlgorithms = 'sha256', digest: BinaryToTextEncoding = 'hex'): string => {
  const hash = nodeCreateHash(algorithm).update(input).digest(digest)
  return hash
}

/**
 * Asynchronously computes a cryptographic hash from the contents of a file .
 * - - - -
 * @param {PathLikeTypes} filePath The path to the file.
 * @param {AllHashAlgorithms} [algorithm] The hash algorithm to use. Default is `'sha256'`.
 * @param {BinaryToTextEncoding} [digest] The output encoding for the hash. Default is `'hex'`.
 * @returns {Promise<string>} A promise that resolves to the resulting hash string.
 */
export const createHashFromFile = async (filePath: PathLikeTypes, algorithm: AllHashAlgorithms = 'sha256', digest: BinaryToTextEncoding = 'hex'): Promise<string> => {
  const path = pathLikeToFilePath(filePath)
  const fileBuffer = await path.read()
  return createHash(fileBuffer, algorithm, digest)
}

/**
 * Synchronously computes a cryptographic hash from the contents of a file .
 * - - - -
 * @param {PathLikeTypes} filePath The path to the file.
 * @param {AllHashAlgorithms} [algorithm] The hash algorithm to use. Default is `'sha256'`.
 * @param {BinaryToTextEncoding} [digest] The output encoding for the hash. Default is `'hex'`.
 * @returns {Promise<string>} The resulting hash string.
 */
export const createHashFromFileSync = (filePath: PathLikeTypes, algorithm: AllHashAlgorithms = 'sha256', digest: BinaryToTextEncoding = 'hex'): string => {
  const path = pathLikeToFilePath(filePath)
  const fileBuffer = path.readSync()
  return createHash(fileBuffer, algorithm, digest)
}
