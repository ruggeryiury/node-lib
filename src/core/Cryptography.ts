import { constants, createCipheriv, createDecipheriv, createPrivateKey, createPublicKey, privateDecrypt, publicEncrypt, sign, verify, createHash, createHmac, createSign, createVerify, hkdf, pbkdf2, scrypt, timingSafeEqual, generateKey, generateKeyPair, randomBytes, randomInt, randomFill, argon2, checkPrime, createDiffieHellman, createDiffieHellmanGroup, createECDH, createSecretKey, diffieHellman, decapsulate, encapsulate, generatePrime, hash } from 'node:crypto'
import { promisify } from 'node:util'

// #region Class
/**
 * Wrapper around the Node.js `crypto` module. All callback-based functions are exposed as Promise-based methods.
 */
export class Cryptography {
  /**
   * Factory methods for creating cryptographic objects and streams.
   */
  static stream = {
    /**
     * Creates a Cipher instance for encryption using the specified algorithm, key, and initialization vector.
     */
    createCipheriv: createCipheriv,
    /**
     * Creates a Decipher instance for decryption using the specified algorithm, key, and initialization vector.
     */
    createDecipheriv: createDecipheriv,
    /**
     * Creates a [Diffie-Hellman key exchange](https://en.wikipedia.org/wiki/Diffie%E2%80%93Hellman_key_exchange) object.
     */
    createDiffieHellman: createDiffieHellman,
    /**
     * _Alias to `stream.createDiffieHellman`._
     *
     * Creates a [Diffie-Hellman key exchange](https://en.wikipedia.org/wiki/Diffie%E2%80%93Hellman_key_exchange) object.
     */
    createDiffieHellmanGroup: createDiffieHellmanGroup,
    /**
     * Creates an [Elliptic Curve Diffie-Hellman (ECDH) key exchange](https://en.wikipedia.org/wiki/Elliptic-curve_Diffie%E2%80%93Hellman) object.
     */
    createECDH: createECDH,
    /**
     * Creates a Hash object for incremental hashing operations.
     */
    createHash: createHash,
    /**
     * Creates an [HMAC](https://en.wikipedia.org/wiki/HMAC) object for keyed hashing operations.
     */
    createHmac: createHmac,
    /**
     * Creates a private key object from the provided key material.
     */
    createPrivateKey: createPrivateKey,
    /**
     * Creates a public key object from the provided key material.
     */
    createPublicKey: createPublicKey,
    /**
     * Creates a secret key object from the provided key material.
     */
    createSecretKey: createSecretKey,
    /**
     * Creates a Sign object for generating digital signatures.
     */
    createSign: createSign,
    /**
     * Creates a Verify object for verifying digital signatures.
     */
    createVerify: createVerify,
  } as const
  /**
   * Derives a cryptographic key using the [Argon2 password hashing algorithm](https://en.wikipedia.org/wiki/Argon2).
   */
  static argon2 = promisify(argon2)
  /**
   * Determines whether the provided value is a prime number.
   */
  static checkPrime = promisify(checkPrime)
  /**
   * Decapsulates a shared secret from a [key encapsulation mechanism (KEM)](https://en.wikipedia.org/wiki/Key_encapsulation_mechanism) ciphertext.
   */
  static decapsulate = promisify(decapsulate)
  /**
   * Computes a shared secret using [Diffie-Hellman key exchange](https://en.wikipedia.org/wiki/Diffie%E2%80%93Hellman_key_exchange).
   */
  static diffieHellman = promisify(diffieHellman)
  /**
   * Encapsulates a shared secret using a [key encapsulation mechanism (KEM)](https://en.wikipedia.org/wiki/Key_encapsulation_mechanism).
   */
  static encapsulate = promisify(encapsulate)
  /**
   * Generates a [symmetric](https://en.wikipedia.org/wiki/Symmetric-key_algorithm) cryptographic key.
   */
  static generateKey = promisify(generateKey)
  /**
   * Generates a public/private key pair ([asymmetric cryptography](https://en.wikipedia.org/wiki/Public-key_cryptography)).
   */
  static generateKeyPair = promisify(generateKeyPair)
  /**
   * Generates a prime number suitable for cryptographic applications.
   */
  static generatePrime = promisify(generatePrime)
  /**
   * Computes a cryptographic hash using a one-shot operation.
   */
  static hash = hash
  /**
   * Derives key material using the[ HMAC-based Key Derivation Function (HKDF)](https://en.wikipedia.org/wiki/HKDF).
   */
  static hkdf = promisify(hkdf)
  /**
   * Derives a key from a password using [Password-Based Key Derivation Function 2 (PBKDF2)](https://en.wikipedia.org/wiki/PBKDF2).
   */
  static pbkdf2 = promisify(pbkdf2)
  /**
   * Decrypts data using a private key.
   */
  static privateDecrypt = privateDecrypt
  /**
   * Encrypts data using a public key.
   */
  static publicEncrypt = publicEncrypt
  /**
   * Generates cryptographically secure random bytes.
   */
  static randomBytes = promisify(randomBytes)
  /**
   * Fills a buffer with cryptographically secure random data.
   */
  static randomFill = promisify(randomFill)
  /**
   * Generates a cryptographically secure random integer.
   */
  static randomInt = promisify(randomInt)
  /**
   * Derives a key from a password using the [scrypt](https://pt.wikipedia.org/wiki/Scrypt) algorithm.
   */
  static scrypt = promisify(scrypt)
  /**
   * Generates a digital signature.
   */
  static sign = sign
  /**
   * Compares two values in constant time to help prevent timing attacks.
   */
  static timingSafeEqual = timingSafeEqual
  /**
   * Verifies a digital signature.
   */
  static verify = verify
  /**
   * Exposes the constants provided by the Node.js `crypto` module.
   */
  static constants = constants
}
