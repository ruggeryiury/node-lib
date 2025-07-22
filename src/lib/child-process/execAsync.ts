import { exec, type ExecOptions } from 'node:child_process'
import type { ObjectEncodingOptions } from 'node:fs'

export type ExecAsyncOptions = ExecOptions & ObjectEncodingOptions
export interface ExecAsyncReturnObject {
  stderr?: string
  stdout: string
}

/**
 * A promisified version of Node.js `child_process.exec`.
 *
 * This function returns an object with errors that must be evaluated, and the output (if any).
 * - - - -
 * @param {string} command The command you want to execute.
 * @param {ExecAsyncOptions} [options] `OPTIONAL`
 * @returns {Promise<ExecAsyncReturnObject>}
 */
export const execAsync = async (command: string, options?: ExecAsyncOptions): Promise<ExecAsyncReturnObject> =>
  new Promise<ExecAsyncReturnObject>((resolve) => {
    exec(command, options, (err, stdout, stderr) => {
      if (err) resolve({ stderr: Buffer.isBuffer(stderr) ? stderr.toString() : stderr, stdout: Buffer.isBuffer(stdout) ? stdout.toString() : stdout })

      resolve({ stdout: Buffer.isBuffer(stdout) ? stdout.toString() : stdout })
    })
  })
