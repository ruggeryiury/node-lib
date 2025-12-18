import type { LiteralUnion } from 'type-fest'

/**
 * `MyObject` acts as a wrapper to a `Map`, with explicit conversion method to object.
 */
export class MyObject<T> {
  /**
   * The `Map` class which the class' instance will work upon.
   */
  private _map = new Map<keyof T, T[keyof T]>()
  constructor() {}
  clear(): void {
    return this._map.clear()
  }

  /**
   * Deletes a key value from the map.
   * - - - -
   * @param {keyof T} key The key name.
   * @returns {boolean} `true` if an element in the map existed and has been removed, or `false` if the element does not exist.
   */
  delete(key: keyof T): boolean {
    return this._map.delete(key)
  }

  /**
   * Returns a specified element from the Map object. If the value that is associated to the provided key is an object, then you will get a reference to that object and any change made to that object will effectively modify it inside the map.
   * - - - -
   * @param {keyof T} key The key name.
   * @returns {T[keyof T] | undefined} Returns the element associated with the specified key. If no element is associated with the specified key, `undefined` is returned.
   */
  get(key: keyof T): T[keyof T] | undefined {
    return this._map.get(key)
  }

  /**
   * Tells if the map has a specific key value.
   * - - - -
   * @param {keyof T} key The key name.
   * @returns {boolean} A boolean value indicating whether an element with the specified key exists or not.
   */
  has(key: keyof T): boolean {
    return this._map.has(key)
  }

  /**
   * Returns an array of keys in the map.
   * - - - -
   * @returns {(keyof T)[]}
   */
  keys(): (keyof T)[] {
    return Array.from(this._map.keys())
  }

  /**
   * Adds a new element with a specified key and value to the map. If an element with the same key already exists, the element will be updated.
   * - - - -
   * @param {LiteralUnion<keyof T, string | number>} key The key name.
   * @param {unknown} value The key value to be assigned.
   * @returns {Map<keyof T, T[keyof T]>}
   */
  set(key: LiteralUnion<keyof T, string | number>, value: unknown): Map<keyof T, T[keyof T]> {
    if (typeof key === 'symbol') throw new Error('MyObject classes does not accept symbols for keys')
    return this._map.set(key as keyof T, value as T[keyof T])
  }

  /**
   * Converts the map to an object.
   * - - - -
   * @returns {T}
   */
  toObject(): T {
    return Object.fromEntries(this._map.entries()) as T
  }

  /**
   * Converts a JavaScript value to a JavaScript Object Notation (JSON) string.
   * - - - -
   * @param {string | number} [space] Adds indentation, white space, and line break characters to the return-value JSON text to make it easier to read.
   * @returns {string}
   */
  stringify(space?: string | number): string {
    return JSON.stringify(this.toObject(), null, space)
  }
}
