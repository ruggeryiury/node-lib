import { exec } from 'node:child_process'
import { promisify } from 'node:util'

/**
 * A promisified version of Node.js `child_process.exec`.
 * - - - -
 * @see https://nodejs.org/api/child_process.html#child_processexeccommand-options-callback
 */
export const execAsync = promisify(exec)
