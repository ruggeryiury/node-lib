import { exec, spawn, type ExecOptions, type SpawnOptionsWithoutStdio } from 'node:child_process'
import type { ObjectEncodingOptions } from 'node:fs'

export type ExecAsyncOptions = ExecOptions & ObjectEncodingOptions
export interface ExecAsyncReturnObject {
  /**
   * The error output of the process.
   */
  stderr?: string
  /**
   * The standard output of the process.
   */
  stdout: string
}
export interface SpawnAsyncReturnObject extends Omit<ExecAsyncReturnObject, 'stderr'> {
  /**
   * The error output of the process.
   */
  stderr: string
  code: number | null
}

/**
 * A promisified version of Node.js `child_process.exec`.
 *
 * This function can return an variable with errors that must be evaluated, and the output (if any).
 * - - - -
 * @param {string} command The command you want to execute.
 * @param {ExecAsyncOptions} [options] `OPTIONAL`
 * @returns {Promise<ExecAsyncReturnObject>}
 */
export const execAsync = (command: string, options?: ExecAsyncOptions): Promise<ExecAsyncReturnObject> =>
  new Promise<ExecAsyncReturnObject>((resolve) => {
    exec(command, options, (err, stdout, stderr) => {
      if (err) resolve({ stderr: Buffer.isBuffer(stderr) ? stderr.toString() : stderr, stdout: Buffer.isBuffer(stdout) ? stdout.toString() : stdout })

      resolve({ stdout: Buffer.isBuffer(stdout) ? stdout.toString() : stdout })
    })
  })

/**
 * A promisified version of Node.js `child_process.spawn`.
 * - - - -
 * @param {string} command The command you want to execute.
 * @param {string[] | undefined} [args] `OPTIONAL` An array of arguments to be passed to the command. If `null`, the `command` parameter will be split: The
 * @param {SpawnOptionsWithoutStdio | undefined} [options] `OPTIONAL`
 * @returns {Promise<SpawnAsyncReturnObject>}
 */
export const spawnAsync = (command: string, args?: string[], options?: SpawnOptionsWithoutStdio): Promise<SpawnAsyncReturnObject> =>
  new Promise<SpawnAsyncReturnObject>((resolve, reject) => {
    const child = spawn(command, args, options)

    let stdout = ''
    let stderr = ''

    child.stdout.on('data', (data: Buffer) => {
      stdout += data.toString()
    })

    child.stderr.on('data', (data: Buffer) => {
      stderr += data.toString()
    })

    child.on('error', (err) => {
      reject(err)
    })

    child.on('close', (code) => {
      resolve({ code, stdout, stderr })
    })
  })
