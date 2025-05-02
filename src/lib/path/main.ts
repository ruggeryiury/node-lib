import type { WriteStream } from 'node:fs'
import type { Stream } from 'node:stream'
import type { DirPath, FilePath } from '../../core.exports'

export type PathTypeValues = 'file' | 'directory'

export interface FilePathJSONRepresentation {
  /**
   * The working path of the class instance.
   */
  path: string
  /**
   * A boolean value that tells if the file exists.
   */
  exists: boolean
  /**
   * The root folder of the file where the path evaluates to.
   */
  root: string
  /**
   * The name of the file with extension (if any).
   */
  fullname: string
  /**
   * The name of the file (without the extension).
   */
  name: string
  /**
   * The extension of the file, returns an empty string if the
   * provided path evalutes to a directory.
   */
  ext: string
}

export interface DirPathJSONRepresentation {
  /**
   * The working path of the class instance.
   */
  path: string
  /**
   * A boolean value that tells if the directory exists.
   */
  exists: boolean
  /**
   * The root folder of the directory where the path evaluates to.
   */
  root: string
  /**
   * The name of the directory.
   */
  name: string
}

export type BufferEncodingOrNull = BufferEncoding | null | undefined
export type BufferEncodingBOM = 'utf8-bom' | 'utf-8-bom' | 'utf8bom' | 'utf16le-bom' | 'utf-16le-bom' | 'utf16bom' | undefined
export type BufferEncodingText = 'ascii' | 'latin1' | 'utf8' | 'utf-8' | undefined
export type StringOrBuffer = string | Buffer

export type ReadFileReturnType<T extends BufferEncodingOrNull> = T extends BufferEncoding ? string : T extends null | undefined ? Buffer : StringOrBuffer

export type FileAsyncWriteDataTypes = string | NodeJS.ArrayBufferView | Iterable<string | NodeJS.ArrayBufferView> | AsyncIterable<string | NodeJS.ArrayBufferView> | Stream
export type FileSyncWriteDataTypes = string | NodeJS.ArrayBufferView

/**
 * Types that can be converted using `Path.of()` static method.
 */
export type PathLikeTypes = string | FilePath | DirPath | FilePathJSONRepresentation

export interface FileWriteStreamReturnObject {
  /**
   * The writeable stream of the file.
   */
  stream: WriteStream
  /**
   * A `Promise` that will only be fullfilled when calling `stream.end()`.
   */
  once: Promise<unknown[]>
}
