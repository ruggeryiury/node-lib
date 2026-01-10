<div align=center>
<img src='https://xesque.rocketseat.dev/platform/tech/javascript.svg' width='36px' title='JavaScript'/> 
<img src='https://xesque.rocketseat.dev/platform/tech/typescript.svg' width='36px' title='TypeScript'/>
</div>

<div align=center>
<img src='https://img.shields.io/github/last-commit/ruggeryiury/node-lib?color=%23DDD&style=for-the-badge' /> <img src='https://img.shields.io/github/repo-size/ruggeryiury/node-lib?style=for-the-badge' /> <img src='https://img.shields.io/github/issues/ruggeryiury/node-lib?style=for-the-badge' /> <img src='https://img.shields.io/github/package-json/v/ruggeryiury/node-lib?style=for-the-badge' /> <img src='https://img.shields.io/github/license/ruggeryiury/node-lib?style=for-the-badge' />
</div>

- [About](#about)
- [Package modules overview](#package-modules-overview)
- [API](#api)
  - [`FilePath`](#filepath)
    - [Class properties](#class-properties)
    - [File stats](#file-stats)
    - [Path manipulation methods](#path-manipulation-methods)
    - [Checking file existence](#checking-file-existence)
    - [File reading methods](#file-reading-methods)
    - [File writing methods](#file-writing-methods)
    - [Other methods](#other-methods)
  - [`DirPath`](#dirpath)
    - [Class properties](#class-properties-1)
    - [Directory stats](#directory-stats)
    - [Path manipulation methods](#path-manipulation-methods-1)
    - [Checking directory existence](#checking-directory-existence)
    - [Directory reading methods](#directory-reading-methods)
    - [Directory writing/creating methods](#directory-writingcreating-methods)
    - [Other methods](#other-methods-1)
  - [`MyObject`](#myobject)

# About

`node-lib` is a package that abstracts many internal NodeJS functions into user-friendly, intuitive class subdivisions. With `node-lib`, things like file and directory path handling, and binary data writing becomes easier to do!

# Package modules overview

- `FilePath` | `DirPath`: Handle file and directory paths easily with built-in handling methods to read, write, copy, modify, and others.
- `BinaryReader` | `BinaryWriter` | `StreamWriter`: Parse and write binary files easily with several format parsing and writing methods.
- `HexStr`: Processes hex string with ease.
- `MyObject`: Create object maps with type assertion, with built-in methods to convert them to JavaScript object or serialized JSON string.

# API

## `FilePath`

`FilePath` makes file path handling easy as it could be!

You can initialize a `FilePath` instance with the class constructor

```ts
import { FilePath } from 'node-lib'

const path = 'path/to/file.bin'
const file = new FilePath(path)
```

or using the static method `FilePath.of()`.

```ts
import { FilePath } from 'node-lib'

const path = 'path/to/file.bin'
const file = FilePath.of(path)
```

`FilePath` accepts both absolute and relative paths. Relative paths will be resolved from the project working directory your initial script will be called upon.

### Class properties

| Property   | Description                                                                                                            |
| ---------- | ---------------------------------------------------------------------------------------------------------------------- |
| _path_     | The working path of this class instance.                                                                               |
| _root_     | The root directory of the file where the path evaluates to.                                                            |
| _fullname_ | The name of the file with extension (if any).                                                                          |
| _name_     | The name of the file (without the extension).                                                                          |
| _ext_      | The extension of the file (if any), returns an empty string if the provided path accidentally evalutes to a directory. |

You can also retrieve all these properties at once as an object using `FilePath.toJSON()` method.

### File stats

You can get systems stats of a file as an object using the `FilePath.stat()` (async) or the `FilePath.statSync()` (sync) method.

### Path manipulation methods

- `changeFileName(fileName: string | null, fileExt?: string)` &mdash; Changes the file name of this `FilePath` and returns a new instantiated `FilePath` with the new file name.
- `changeThisFileName(fileName: string | null, fileExt?: string)` &mdash; Changes the file name of this `FilePath` instance.

---

- `changeFileExt(fileExt: string)` &mdash; Changes the file extension of this `FilePath` and returns a new instantiated `FilePath` with the new file extension.
- `changeThisFileExt(fileExt: string)` &mdash; Changes the file extension of this `FilePath` instance.

---

- `gotoDir(directoryName: string)` &mdash; Returns a new instantiated `DirPath`, resolving the path to a new directory relative from this file root path.
- `gotoFile(fileName: string)` &mdash; Returns a new instantiated `FilePath`, resolving the path to a new file relative from this file root path.

### Checking file existence

You can use the property `FilePath.exists` to check the file existence. `FilePath.exists` is a getter that will always check once it's referenced.

```ts
import { FilePath } from 'node-lib'

const path: string = 'path/to/file.bin'
const file: FilePath = FilePath.of(path)
console.log(file.exists) // <- true

await file.deleteFile()
console.log(file.exists) // <- false
```

### File reading methods

- `open(flags?: string | number)` &mdash; Asynchronously opens a `FileHandle`.

---

- `read(encoding?: BufferEncodingOrNull)` &mdash; Reads the entire contents of a file. Returns a `Buffer` or a string depending on the encoding provided.
- `readSync(encoding?: BufferEncodingOrNull)` &mdash; Synchronous version of `read()`.

---

- `readLines(options?: ReadLinesOptions)` &mdash; Reads a file as a list of lines. Automatically trims and splits the file content on newline characters. Assumes the file content is text (not binary).
- `readLinesSync(options?: ReadLinesOptions)` &mdash; Synchronous version of `readLines()`.

---

- `readJSON(encoding?: BufferEncodingText)` &mdash; Reads a JSON file and parses it into an object. Attempts to decode the content using the provided encoding, then parses it using `JSON.parse`.
- `readJSONSync(encoding?: BufferEncodingText)` &mdash; Synchronous version of `readJSON()`.

---

- `readOffset(byteOffset: number, byteLength?: number)` &mdash; Reads a portion of a file starting from a specific byte offset. If `byteLength` is provided, reads that many bytes using a file descriptor. Otherwise, reads the whole file and returns a subarray starting at the offset.

### File writing methods

- `write(data: FileAsyncWriteDataTypes, encoding?: BufferEncodingOrNull, replace?: boolean)` &mdash; Writes data to a file, optionally replacing it if it already exists. Supports writing strings or buffers to a file with optional encoding. Throws an error if the file exists and `replace` is set to `false`.
- `writeSync(data: FileSyncWriteDataTypes, encoding?: BufferEncodingOrNull, replace?: boolean)` &mdash; Synchronous version of `write()`.

---

- `writeWithBOM(data: StringOrBuffer, encoding?: BufferEncodingBOM, replace?: boolean)` &mdash; Writes a UTF-8 or UTF-16 encoded text file with a Byte Order Mark (BOM). Automatically prepends a BOM to the content. If encoding is not specified or is a variant of UTF-8, it uses UTF-8 with BOM. If encoding is `'utf16le'`, it writes the content using UTF-16LE. Throws an error if the file exists and `replace` is set to `false`.
- `writeWithBOMSync(data: StringOrBuffer, encoding?: BufferEncodingBOM, replace?: boolean)` &mdash; Synchronous version of `writeWithBOM()`.

---

- `createWriteStream(encoding?: BufferEncodingOrNull)` &mdash; Creates a writable file stream at the specified path. If a file already exists at the path, it will be deleted before creating the stream. Optionally accepts an encoding; if `null` is passed, defaults to `utf8`.
- `createWriteStreamSync(encoding?: BufferEncodingOrNull)` &mdash; Synchronous version of `createWriteStream()`.

---

- `pipe<T>(source: PipelineSource<T>, options?: PipelineOptions)` &mdash; Pipes the given source stream or iterable into an internal writable stream and returns a promise that resolves when the piping is complete or rejects on error.

### Other methods

- `copy(destPath: FilePathLikeTypes, replace?: boolean)` &mdash; Copies a file from a source path to a destination path. If the destination path already exists:
  - Throws an error unless `replace` is set to `true`.
  - If `replace` is `true`, deletes the existing file before copying.

  Automatically resolves relative destination paths based on the source file's directory.

- `copySync(destPath: FilePathLikeTypes, replace?: boolean)` &mdash; Synchronous version of `copy()`.

---

- `rename(newPath: FilePathLikeTypes, replace?: boolean)` &mdash; Renames (or moves) a file from an old path to a new path. If the new path already exists:
  - Throws an error unless `replace` is `true`.
  - If `replace` is `true`, deletes the destination file before renaming.

  Automatically resolves relative `newPath` values based on the directory of the `oldPath`.

- `renameSync(newPath: FilePathLikeTypes, replace?: boolean)` &mdash; Synchronous version of `copy()`.
- `move(newPath: FilePathLikeTypes, replace?: boolean)` &mdash; Alias to `rename()`.
- `moveSync(newPath: FilePathLikeTypes, replace?: boolean)` &mdash; Alias to `renameSync()`.

---

- `delete()` &mdash; Deletes a file at the specified path if it exists. Resolves the given path and performs a safe check before deletion to avoid errors.
- `deleteSync()` &mdash; Synchronous version of `delete()`.
- `remove()` &mdash; Alias to `delete().`
- `removeSync()` &mdash; Alias to `deleteSync().`

---

- `generateHash(algorithm: AllHashAlgorithms, digest: BinaryToTextEncoding)` &mdash; Asynchronously computes a cryptographic hash from the contents of the file.

## `DirPath`

You can initialize a `DirPath` instance with the class constructor

```ts
import { DirPath } from 'node-lib'

const path = 'path/to/directory'
const dir = new DirPath(path)
```

or using the static method `DirPath.of()`.

```ts
import { DirPath } from 'node-lib'

const path = 'path/to/directory'
const dir = DirPath.of(path)
```

`DirPath` accepts both absolute and relative paths. Relative paths will be resolved from the project working directory your initial script will be called upon.

### Class properties

| Property | Description                                                 |
| -------- | ----------------------------------------------------------- |
| _path_   | The working path of this class instance.                    |
| _root_   | The root directory of the file where the path evaluates to. |
| _name_   | The name of the file (without the extension).               |

You can also retrieve all these properties at once as an object using `DirPath.toJSON()` method.

### Directory stats

You can get systems stats of a directory as an object using the `DirPath.stat()` (async) or the `DirPath.statSync()` (sync) method.

### Path manipulation methods

- `changeDirName(dirName: string)` &mdash; Changes the directory name of this `DirPath` and returns a new instantiated `DirPath` with the new directory name.
- `changeThisDirName(dirName: string)` &mdash; Changes the directory name of this `DirPath` instance.

---

- `gotoDir(directoryName: string)` &mdash; Returns a new instantiated `DirPath`, resolving the path to a new directory relative from this directory path.
- `gotoFile(fileName: string)` &mdash; Returns a new instantiated `DirPath`, resolving the path to a new directory relative from this directory path.

### Checking directory existence

You can use the property `DirPath.exists` to check the directory existence. `DirPath.exists` is a getter that will always check once it's referenced.

```ts
import { DirPath } from 'node-lib'

const path = 'path/to/directory'
const dir = DirPath.of(path)
console.log(dir.exists) // <- true

await dir.deleteDir()
console.log(dir.exists) // <- false
```

### Directory reading methods

- `readDir(recursive?: boolean, returnValueAsStrings?: boolean)` &mdash; Reads the contents of a directory and returns an array of file/directory paths.
- `readDirSync(recursive?: boolean, returnValueAsStrings?: boolean)` &mdash; Synchronous version of `readDir()`.

### Directory writing/creating methods

- `writeFileOnDir(fileName: string, data?: FileAsyncWriteDataTypes | null, encoding?: BufferEncodingOrNull, replace?: boolean)` &mdash; Writes a file inside a specified directory. Automatically resolves the full file path by combining the directory path and the file name. If the file already exists and `replace` is false, an error is thrown.
- `writeFileOnDirSync(fileName: string, data?: FileSyncWriteDataTypes | null, encoding?: BufferEncodingOrNull, replace?: boolean)` &mdash; Synchronous version of `writeFileOnDir()`.

---

- `mkDir(recursive?: boolean)` &mdash; Creates a directory at the specified path. By default, does not create parent directories unless `recursive` is set to `true`.
- `mkDirSync(recursive?: boolean)` &mdash; Synchronous version of `mkDir()`.

### Other methods

- `deleteDir(recursive?: boolean)` &mdash; Deletes a directory at the specified path. By default, deletes the directory recursively (including its contents).
- `deleteDir(recursive?: boolean)` &mdash; Synchronous version of `deleteDir()`.

---

- `searchDir(pattern?: RegExp | string | (RegExp | string)[], recursive?: boolean)` &mdash; Searches for files and directories in a folder that match a given pattern.
- `searchDirSync(pattern?: RegExp | string | (RegExp | string)[], recursive?: boolean)` &mdash; Synchronous version of `searchDir()`.

## `MyObject`

`MyObject` acts as a wrapper to a `Map`, with explicit conversion method to object and enforced typing.
