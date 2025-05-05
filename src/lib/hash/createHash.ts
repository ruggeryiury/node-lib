import { createHash as nodeCreateHash, type BinaryToTextEncoding } from 'node:crypto'
import type { PathLikeTypes } from '../../core.exports'
import { pathLikeToFilePath } from '../../lib.exports'

export type AllHashAlgorithms = 'md4' | 'md5' | 'mdc2' | 'ripemd160' | 'rmd160' | 'sha1' | 'sha224' | 'sha256' | 'sha384' | 'sha512' | 'sha3-224' | 'sha3-256' | 'sha3-384' | 'sha3-512' | 'shake128' | 'shake256' | 'sm3' | 'whirlpool' | 'blake2b512' | 'blake2s256' | 'ssl3-md5' | 'ssl3-sha1'

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
 * Asynchronously computes a cryptographic hash from the contents of a file.
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
 * Synchronously computes a cryptographic hash from the contents of a file.
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
