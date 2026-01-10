import type { PartialDeep } from 'type-fest'

/**
 * `MyObject` acts as a wrapper to a `Map`, with explicit conversion method to object and enforced typing.
 * - - - -
 */
export class MyObject<T extends object = Record<string, any>> {
  /**
   * The `Map` class which the class' instance will work upon.
   */
  private _map: Map<keyof T, T[keyof T]>

  /**
   * Iterates through all keys and values of an object and return them properly added to the return value itself.
   * - - - -
   * @param obj
   * @returns {Record<string | number, unknown>}
   */
  private _iterateEachNestedObjKey(obj: Record<string | number, unknown>): Record<string | number, unknown> {
    const nestedMap = new Map()
    for (const key of Object.keys(obj)) {
      const val = obj[key]
      if (typeof val === 'object' && val !== null) nestedMap.set(key, this._iterateEachNestedObjKey(val as Record<string | number, unknown>))
      else nestedMap.set(key, val)
    }

    return Object.fromEntries(nestedMap.entries()) as Record<string | number, unknown>
  }

  /**
   * Iterates through all keys and values of an object and adds them directly on the class' map object.
   * - - - -
   * @param {Record<keyof T, unknown>} obj
   */
  private _iterateEachRootObjKey(obj: Record<keyof T, unknown>): void {
    for (const key of Object.keys(obj) as (keyof T)[]) {
      const val = obj[key] as T[keyof T]
      if (typeof val === 'object' && val !== null) this._map.set(key, this._iterateEachNestedObjKey(val as Record<string | number, unknown>) as T[keyof T])
      else this._map.set(key, val)
    }
  }

  /**
   * @param {PartialDeep<T>} initial An object with initial values to be already added to the object map.
   */
  constructor(initial?: PartialDeep<T>) {
    this._map = new Map<keyof T, T[keyof T]>()
    if (initial) this._iterateEachRootObjKey(initial as Record<keyof T, unknown>)
  }

  /**
   * Clears all values added to be map object and returns an object with all the old keys and values from the map object.
   */
  clear(): T {
    const val = this.toJSON()
    this._map.clear()
    return val
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
  get<K extends keyof T>(key: K): T[K] | undefined {
    return this._map.get(key) as T[K] | undefined
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
  set<K extends keyof T>(key: K, value: T[K]): Map<keyof T, T[keyof T]> {
    if (typeof key === 'symbol') throw new Error('MyObject classes does not accept symbols for keys')
    return this._map.set(key as keyof T, value as T[keyof T])
  }

  /**
   * Adds new elements to the map object. If an element with the same key already exists, the element will be updated.
   * - - - -
   * @param {PartialDeep<T>} values An partial object which keys and values respect the type parameter initialized.
   */
  setMany(values: PartialDeep<T>): void {
    this._iterateEachRootObjKey(values as Record<keyof T, unknown>)
  }

  /**
   * Converts the instantiated map to JavaScript object.
   * - - - -
   * @returns {T}
   */
  toJSON(): T {
    return Object.fromEntries(this._map.entries()) as T
  }

  /**
   * Converts a JavaScript value to a JavaScript Object Notation (JSON) string.
   * - - - -
   * @param {string | number} [space] Adds indentation, white space, and line break characters to the return-value JSON text to make it easier to read.
   * @returns {string}
   */
  toString(space?: string | number): string {
    return JSON.stringify(this.toJSON(), null, space)
  }
}
