/**
 * Generic `FilePath` and `DirPath` classes error.
 * - - - -
 */
export class PathError extends Error {
  /**
   * @param {string} message `OPTIONAL` A message to be displayed on thrown error.
   * If `undefined`, the message `"An unknown error occured"` will be displayed.
   */
  constructor(message = 'An unknown error occured') {
    super(message)
    this.name = 'PathError'
    Error.captureStackTrace(this, PathError)
    Object.setPrototypeOf(this, PathError.prototype)
  }
}
