# tsc-es2020-fix
Make tsc-compiled `es2020` bundles compatible with `"type": "module"` requirements

[![CI](https://github.com/antongolub/tsc-es2020-fix/workflows/CI/badge.svg)](https://github.com/antongolub/tsc-es2020-fix/actions)
[![David](https://img.shields.io/david/dev/antongolub/tsc-es2020-fix?label=deps)](https://david-dm.org/antongolub/tsc-es2020-fix?type=dev)
[![Maintainability](https://api.codeclimate.com/v1/badges/795c6c62e875c263e2fa/maintainability)](https://codeclimate.com/github/antongolub/tsc-es2020-fix/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/795c6c62e875c263e2fa/test_coverage)](https://codeclimate.com/github/antongolub/tsc-es2020-fix/test_coverage)

### Motivation
This workaround is aimed to bypass a pair of **tsc** and **ts-jest** issues _right here and right now_. 
* [TS/issues/13422](https://github.com/microsoft/TypeScript/issues/13422): tsc should add `.js` extensions for rel module paths.
* [ts-jest/issues/1174](https://github.com/kulshekhar/ts-jest/issues/1174): `import.meta` is not allowed.

Hope one day this library will not be needed.

### Features
* Finds and replaces `__dirname` and `__filename` refs with `import.meta`.
* Injects extentions to relative imports/re-exports statements.
    * `import {foo} from './foo'` → `import {foo} from './foo.js'`
    * `import {baz} from 'external/baz'` → `import {baz} from 'external/baz.js'`
    * Pays attention to index files: `import {bar} from './bar'` → `import {bar} from './bar/index.js'`
* Follows `outDir` found in tsconfig.json.  
* Changes files extentions if specified by opts.
* Supports Windows-based runtimes.

## Requirements
Node.js >= 14

## Install
```shell
yarn add -D tsc-es2020-fix
```

## Usage
```shell
tsc-es2020-fix [options]
```

```typescript
import { fix } from 'tsc-es2020-fix'
await fix({
  dirnameVar: true,
  filenameVar: true,
  ext: true
})
```

## API
### CLI
```shell
tsc-es2020-fix [opts]
```
| Option | Description | Default
|---|---|---|
|`--tsconfig`| Path to project's ts-config(s) | `tsconfig.json`
|`--target` | Entry points where compiled files are placed for modification | If not specified inherited from tsconfig.json **compilerOptions.outDir**
|`--dirnameVar` | Replace `__dirname` usages with `import.meta` | true
|`--filenameVar` | Replace `__filename` var references `import.meta` | true
|`--ext` | Append extension to relative imports/re-exports | `.js`
|`--cwd`| cwd | `process.cwd()`
|`--out`| Output dir. Defaults to cwd, so files will be overridden | <cwd>
|`--debug` | Prints debug notes

### JS/TS
```ts
import { fix, IFixOptions } from 'tsc-es2020-fix'

const fixOptions: IFixOptions = {
  tsconfig: 'tsconfig.build.json',
  dirnameVar: true,
  filenameVar: true,
  ext: true
}

await fix(fixOptions)
```
```typescript
export interface IFixOptions {
  cwd: string
  out?: string,
  target?: string | string[]
  tsconfig: string | string[]
  dirnameVar: boolean
  filenameVar: boolean
  ext: boolean | string
}
```

## License
[MIT](./LICENSE)
