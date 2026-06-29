import crypto, { type CipherInfo, type CipherInfoOptions } from 'node:crypto'
import { promisify } from 'node:util'

/**
 * A wrapper of many internal functions from the `node:crypto` module. All callback-based functions were promisified to use as asynchronous operations.
 */
export class Cryptography {
  /**
   * Returns an array with the names of the supported cipher algorithms.
   * - - - -
   * @returns {string[]}
   */
  static getCiphers = (): string[] => crypto.getCiphers()
  /**
   * Returns information about a given cipher.
   * - - - -
   * @param {string} nameOrID The name or nid of the cipher to query.
   * @param {CipherInfoOptions | undefined} [options] `OPTIONAL` Some ciphers accept variable length keys and initialization vectors. By default, this method will return the default values for these ciphers. To test if a given key length or iv length is acceptable for given cipher, use the keyLength and ivLength options. If the given values are unacceptable, undefined will be returned.
   * @returns {CipherInfo | undefined}
   */
  static getCipherInfo = (nameOrID: string, options?: CipherInfoOptions): CipherInfo | undefined => crypto.getCipherInfo(nameOrID, options)

  /**
   * Generates cryptographically strong pseudorandom data. The `size` argument
   * is a number indicating the number of bytes to generate.
   * @param {number} size The number of bytes to generate. The `size` must not be larger than `2**31 - 1`.
   */
  static randomBytes = async (size: number): Promise<Buffer<ArrayBuffer>> => await promisify(crypto.randomBytes)(size)

  /**
   * Return a random integer `n` such that `min <= n < max`.  This
   * implementation avoids [modulo bias](https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle#Modulo_bias).
   *
   * The range (`max - min`) must be less than 2**48. `min` and `max` must
   * be [safe integers](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isSafeInteger).
   * - - - -
   * @param {number} max End of random range (exclusive).
   * @param {number | undefined} [min] `OPTIONAL` Start of random range (inclusive). Default is `0`.
   * @returns {Promise<number>}
   */
  static randomInt = async (max: number, min: number = 0): Promise<number> => await promisify<number, number, number>(crypto.randomInt)(min, max)

  /**
   * Return a random integer `n` such that `min <= n <= max`.  This
   * implementation avoids [modulo bias](https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle#Modulo_bias).
   *
   * The range (`max - min`) must be less than 2**48. `min` and `max` must
   * be [safe integers](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isSafeInteger).
   * - - - -
   * @param {number} max End of random range (inclusive).
   * @param {number | undefined} [min] `OPTIONAL` Start of random range (inclusive). Default is `0`.
   * @returns {Promise<number>}
   */
  static randomIntMaxInclusive = async (max: number, min: number = 0): Promise<number> => await promisify<number, number, number>(crypto.randomInt)(min, max + 1)
}
