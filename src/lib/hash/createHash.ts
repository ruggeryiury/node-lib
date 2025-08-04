import { createHash as nodeCreateHash, type BinaryToTextEncoding } from 'node:crypto'
import { createReadStream } from 'node:fs'
import type { FilePathLikeTypes } from '../../core.exports'
import { pathLikeToFilePath } from '../../lib.exports'

export type AllHashAlgorithms = 'md4' | 'md5' | 'mdc2' | 'ripemd160' | 'rmd160' | 'sha1' | 'sha224' | 'sha256' | 'sha384' | 'sha512' | 'sha3-224' | 'sha3-256' | 'sha3-384' | 'sha3-512' | 'shake128' | 'shake256' | 'sm3' | 'whirlpool' | 'blake2b512' | 'blake2s256' | 'ssl3-md5' | 'ssl3-sha1'

/**
 * Generates a hash from the input string/Buffer using the specified algorithm.
 * - - - -
 * @param {Buffer} input The input to hash.
 * @param {AllHashAlgorithms} [algorithm] The hash algorithm to use. Default is `'sha256'`.
 * @param {BinaryToTextEncoding} [digest] The output encoding for the hash. Default is `'hex'`.
 * @returns {string} The resulting hash string.
 */
export const createHashFromBuffer = (input: Buffer, algorithm: AllHashAlgorithms = 'sha256', digest: BinaryToTextEncoding = 'hex'): string => {
  const hash = nodeCreateHash(algorithm).update(input).digest(digest)
  return hash
}

/**
 * Asynchronously computes a cryptographic hash from the contents of a file.
 *
 * This function uses readable stream object to calculate the file hash by adding chunk by chunk,
 * avoiding reading the entire file into memory.
 * - - - -
 * @param {FilePathLikeTypes} filePath The path to the file.
 * @param {AllHashAlgorithms} [algorithm] The hash algorithm to use. Default is `'sha256'`.
 * @param {BinaryToTextEncoding} [outEncoding] The output encoding for the hash. Default is `'hex'`.
 * @returns {Promise<string>} A promise that resolves to the resulting hash string.
 */
export const createHashFromFile = async (filePath: FilePathLikeTypes, algorithm: AllHashAlgorithms = 'sha256', outEncoding: BinaryToTextEncoding = 'hex'): Promise<string> =>
  new Promise<string>((resolve, reject) => {
    const path = pathLikeToFilePath(filePath)
    const hash = nodeCreateHash(algorithm)
    const stream = createReadStream(path.path)

    stream.on('data', (chunk) => hash.update(chunk))
    stream.on('end', () => resolve(hash.digest(outEncoding)))
    stream.on('err', reject)
  })
