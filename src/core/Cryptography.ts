// eslint-disable-next-line no-unused-vars
import { constants, createCipheriv, createDecipheriv, createPrivateKey, createPublicKey, privateDecrypt, publicEncrypt, sign, verify, createHash, createHmac, createSign, createVerify, hkdf, pbkdf2, scrypt, timingSafeEqual, generateKey, generateKeyPair, randomBytes, randomInt, randomFill, argon2, checkPrime, createDiffieHellman, createDiffieHellmanGroup, createECDH, createSecretKey, diffieHellman, decapsulate, encapsulate, generatePrime, hash, type LargeNumberLike, type KeyObject } from 'node:crypto'
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
   * Derives a cryptographic key using the [Argon2 password hashing algorithm](https://en.wikipedia.org/wiki/Argon2). Argon2 is a password-based key derivation function that is designed to be expensive computationally and
   * memory-wise in order to make brute-force attacks unrewarding.
   *
   * The `nonce` should be as unique as possible. It is recommended that a nonce is
   * random and at least 16 bytes long. See [NIST SP 800-132](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-132.pdf) for details.
   *
   * When passing strings for `message`, `nonce`, `secret` or `associatedData`, please
   * consider [caveats when using strings as inputs to cryptographic APIs](https://nodejs.org/docs/latest-v25.x/api/crypto.html#using-strings-as-inputs-to-cryptographic-apis).
   *
   * An exception is thrown when key derivation fails, otherwise the derived key is
   * returned as a `Buffer`.
   *
   * An exception is thrown when any of the input arguments specify invalid values
   * or types.
   */
  static argon2 = promisify(argon2)
  /**
   * Determines whether the provided value is a prime number.
   */
  static checkPrime = promisify<LargeNumberLike, boolean>(checkPrime)
  /**
   * Key decapsulation using a [KEM algorithm](https://en.wikipedia.org/wiki/Key_encapsulation_mechanism) with a private key.
   *
   * Supported key types and their KEM algorithms are:
   *
   * * `'rsa'` RSA Secret Value Encapsulation
   * * `'ec'` DHKEM(P-256, HKDF-SHA256), DHKEM(P-384, HKDF-SHA256), DHKEM(P-521, HKDF-SHA256)
   * * `'x25519'` DHKEM(X25519, HKDF-SHA256)
   * * `'x448'` DHKEM(X448, HKDF-SHA512)
   * * `'ml-kem-512'` ML-KEM
   * * `'ml-kem-768'` ML-KEM
   * * `'ml-kem-1024'` ML-KEM
   *
   * If `key` is not a {@link KeyObject}, this function behaves as if `key` had been
   * passed to `crypto.createPrivateKey()`.
   */
  static decapsulate = promisify(decapsulate)
  /**
   * Computes the [Diffie-Hellman](https://en.wikipedia.org/wiki/Diffie%E2%80%93Hellman_key_exchange) shared secret based on a `privateKey` and a `publicKey`. Both keys must have the same `asymmetricKeyType` and must support either the DH or ECDH operation.
   */
  static diffieHellman = promisify(diffieHellman)
  /**
   * Key encapsulation using a [KEM algorithm](https://en.wikipedia.org/wiki/Key_encapsulation_mechanism) with a public key.
   *
   * Supported key types and their KEM algorithms are:
   *
   * * `'rsa'` RSA Secret Value Encapsulation
   * * `'ec'` DHKEM(P-256, HKDF-SHA256), DHKEM(P-384, HKDF-SHA256), DHKEM(P-521, HKDF-SHA256)
   * * `'x25519'` DHKEM(X25519, HKDF-SHA256)
   * * `'x448'` DHKEM(X448, HKDF-SHA512)
   * * `'ml-kem-512'` ML-KEM
   * * `'ml-kem-768'` ML-KEM
   * * `'ml-kem-1024'` ML-KEM
   *
   * If `key` is not a {@link KeyObject}, this function behaves as if `key` had been
   * passed to `crypto.createPublicKey()`.
   */
  static encapsulate = promisify(encapsulate)
  /**
   * Generates a [symmetric](https://en.wikipedia.org/wiki/Symmetric-key_algorithm) cryptographic key.
   */
  static generateKey = promisify(generateKey)
  /**
   * Generates a new [asymmetric](https://en.wikipedia.org/wiki/Public-key_cryptography) key pair of the given `type`. See the supported [asymmetric key types](https://nodejs.org/docs/latest-v25.x/api/crypto.html#asymmetric-key-types).
   *
   * If a `publicKeyEncoding` or `privateKeyEncoding` was specified, this function
   * behaves as if `keyObject.export()` had been called on its result. Otherwise,
   * the respective part of the key is returned as a `KeyObject`.
   *
   * It is recommended to encode public keys as `'spki'` and private keys as `'pkcs8'` with encryption for long-term storage.
   */
  static generateKeyPair = promisify(generateKeyPair)
  /**
   * Generates a prime number suitable for cryptographic applications.
   */
  static generatePrime = promisify(generatePrime)
  /**
   * A utility for creating one-shot hash digests of data. It can be faster than the object-based crypto.createHash() when hashing a smaller amount of data (<= 5MB) that's readily available. If the data can be big or if it is streamed, it's still recommended to use crypto.createHash() instead.
   *
   * The algorithm is dependent on the available algorithms supported by the version of OpenSSL on the platform. Examples are 'sha256', 'sha512', etc. On recent releases of OpenSSL, openssl list -digest-algorithms will display the available digest algorithms.
   */
  static hash = hash
  /**
   * Derives key material using the [HMAC-based Key Derivation Function (HKDF)](https://en.wikipedia.org/wiki/HKDF).
   */
  static hkdf = promisify(hkdf)
  /**
   * Derives a key from a password using [Password-Based Key Derivation Function 2 (PBKDF2)](https://en.wikipedia.org/wiki/PBKDF2).
   */
  static pbkdf2 = promisify(pbkdf2)
  /**
   * Decrypts `buffer` with `privateKey`. `buffer` was previously encrypted using
   * the corresponding public key, for example using {@link publicEncrypt}.
   *
   * If `privateKey` is not a `KeyObject`, this function behaves as if `privateKey` had been passed to {@link createPrivateKey}. If it is an
   * object, the `padding` property can be passed. Otherwise, this function uses `RSA_PKCS1_OAEP_PADDING`.
   */
  static privateDecrypt = privateDecrypt
  /**
   * Encrypts the content of `buffer` with `key` and returns a new `Buffer` with encrypted content. The returned data can be decrypted using
   * the corresponding private key, for example using {@link privateDecrypt}.
   *
   * If `key` is not a `KeyObject`, this function behaves as if `key` had been passed to {@link createPublicKey}. If it is an
   * object, the `padding` property can be passed. Otherwise, this function uses `RSA_PKCS1_OAEP_PADDING`.
   *
   * Because RSA public keys can be derived from private keys, a private key may
   * be passed instead of a public key.
   */
  static publicEncrypt = publicEncrypt
  /**
   * Generates cryptographically strong pseudorandom data.
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
   * Calculates and returns the signature for `data` using the given private key and algorithm.
   */
  static sign = sign
  /**
   * Compares two values in constant time to help prevent timing attacks.
   */
  static timingSafeEqual = timingSafeEqual
  /**
   * Verifies the given signature for `data` using the given key and algorithm. If
   * `algorithm` is `null` or `undefined`, then the algorithm is dependent upon the
   * key type.
   */
  static verify = verify
  /**
   * Exposes the constants provided by the Node.js `crypto` module.
   */
  static constants = constants
}
