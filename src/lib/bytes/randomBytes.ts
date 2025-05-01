import { randomBytes } from 'node:crypto'

type RandomByteRangeArray = [number, number]
type RandomBytesCharset = 'lowercase' | 'uppercase' | 'numbers' | 'basicSymbols' | 'extendedSymbols' | 'brackets' | 'braces' | 'base64' | 'base64url' | 'allBytes' | 'lowNibbles' | 'highNibbles' | 'allFullBytes' | 'allNullBytes' | 'c0ControlChars' | 'c1ControlChars' | 'printableChars' | 'punctuationChars' | 'singleBits' | 'powersOfTwo'

const CHARSET_RANGES: Record<RandomBytesCharset, (RandomByteRangeArray | number[])[]> = {
  lowercase: [[97, 122]],
  uppercase: [[65, 90]],
  numbers: [[48, 57]],
  basicSymbols: [[33, 47]],
  extendedSymbols: [[58, 64]],
  brackets: [[91, 96]],
  braces: [[123, 126]],
  base64: [
    [65, 90], // A-Z
    [97, 122], // a-z
    [48, 57], // 0-9
    [43, 43], // +
    [47, 47], // /
  ],
  base64url: [
    [65, 90], // A-Z
    [97, 122], // a-z
    [48, 57], // 0-9
    [45, 45], // -
    [95, 95], // _
  ],
  allBytes: [[0, 255]],
  lowNibbles: [[0, 127]],
  highNibbles: [[128, 255]],
  allFullBytes: [[255, 255]],
  allNullBytes: [[0, 0]],
  c0ControlChars: [
    [0, 31],
    [127, 127],
  ],
  c1ControlChars: [[128, 159]],
  printableChars: [[32, 126]],
  punctuationChars: [
    [33, 47], // !"#$%&'()*+,-./
    [58, 64], // :;<=>?@
    [91, 96], // [\]^_`
    [123, 126], // {|}~
  ],
  singleBits: [
    [0, 0],
    [1, 1],
  ],
  powersOfTwo: [
    [1, 1],
    [2, 2],
    [4, 4],
    [8, 8],
    [16, 16],
    [32, 32],
    [64, 64],
    [128, 128],
  ],
}

/**
 * Generates a Buffer of random bytes, where each byte is picked from the specified character sets or custom byte ranges.
 *
 * You can mix multiple predefined charsets (like 'lowercase', 'base64', 'printableChars', etc.)
 * or define custom numeric byte ranges manually.
 *
 * Predefined charsets include: lowercase, uppercase, numbers, symbols, base64, base64url, control characters, printable characters, etc.
 * - - - -
 * @param {number} length The number of random bytes to generate.
 * @param {(RandomBytesCharset | RandomByteRangeArray)[]} [charsetsOrRanges] `OPTIONAL` An array of either predefined charset names or custom byte ranges ([min, max]). Default is all bytes acceptable.
 * @returns {Buffer} A Buffer containing `length` random bytes chosen from the allowed bytes.
 * @throws {Error} If no valid bytes are available to pick from.
 * @example
 * // Generate 16 random lowercase and numbers bytes
 * randomByteBufferFromRanges(16, ['lowercase', 'numbers']);
 * @example
 * // Generate 10 random bytes from a custom range (ASCII 40-50)
 * randomByteBufferFromRanges(10, [[40, 50]]);
 * @example
 * // Generate 32 random base64url characters
 * randomByteBufferFromRanges(32, ['base64url']);
 */
export const randomByteFromRanges = (length: number, charsetsOrRanges: (RandomBytesCharset | RandomByteRangeArray)[] = ['allBytes']): Buffer => {
  const allowedBytes: number[] = []

  for (const item of charsetsOrRanges) {
    if (typeof item === 'string') {
      const ranges = CHARSET_RANGES[item]
      for (const r of ranges) {
        if (Array.isArray(r[0])) {
          // not possible here, just extra guard
          for (let i = (r as RandomByteRangeArray)[0]; i <= (r as RandomByteRangeArray)[1]; i++) {
            allowedBytes.push(i)
          }
        } else if (typeof r[0] === 'number' && typeof r[1] === 'number') {
          const [min, max] = r as RandomByteRangeArray
          for (let i = min; i <= max; i++) {
            allowedBytes.push(i)
          }
        } else {
          // Handle array of single values like Powers of Two
          allowedBytes.push(...(r as number[]))
        }
      }
    } else {
      const [min, max] = item
      for (let i = min; i <= max; i++) {
        allowedBytes.push(i)
      }
    }
  }

  if (allowedBytes.length === 0) {
    throw new Error('No allowed bytes to pick from.')
  }

  const buf = Buffer.allocUnsafe(length)
  const random = randomBytes(length)

  for (let i = 0; i < length; i++) {
    const randomIndex = random[i] % allowedBytes.length
    buf[i] = allowedBytes[randomIndex]
  }

  return buf
}
