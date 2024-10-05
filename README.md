# tsc-esm-fix
> Make TS projects compatible with [esm/mjs requirements](https://nodejs.org/api/esm.html#esm_packages)

[![CI](https://github.com/antongolub/tsc-esm-fix/workflows/CI/badge.svg)](https://github.com/antongolub/tsc-esm-fix/actions)
[![Maintainability](https://api.codeclimate.com/v1/badges/1ca2196057a3184d63d0/maintainability)](https://codeclimate.com/github/antongolub/tsc-esm-fix/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/1ca2196057a3184d63d0/test_coverage)](https://codeclimate.com/github/antongolub/tsc-esm-fix/test_coverage)
[![npm (tag)](https://img.shields.io/npm/v/tsc-esm-fix)](https://www.npmjs.com/package/tsc-esm-fix)

- [Problem](#problem)
- [Solutions](#solutions)
- [Features](#features)
- [Getting started](#getting-started)
  - [Requirements](#requirements)
  - [Install](#install)
  - [Usage examples](#usage-examples)
  - [CLI](#cli)
  - [JS/TS API](#jsts-api)
- [Alternatives](#alternatives)
- [Contributing](#contributing)
- [References](#references)
- [License](#license)

### Problem
This workaround is aimed to bypass a bunch of **tsc**, **ts-jest** and **esbuild** issues _right here and right now_. 
* [TS/13422](https://github.com/microsoft/TypeScript/issues/13422) / [TS/16577](https://github.com/microsoft/TypeScript/issues/16577): **tsc** should add `.js` extensions for relative module paths if compiled as [`es2020/esnext`](https://www.typescriptlang.org/tsconfig/#module).
* [ts-jest/1174](https://github.com/kulshekhar/ts-jest/issues/1174): `import.meta` is not allowed.
* [esbuild/1043](https://github.com/evanw/esbuild/issues/1043): empty output for interface files that breaks reimport.
* [TS/4433](https://github.com/microsoft/TypeScript/issues/4433): extensions in module declarations force tsconfig changes for dependent projects. See [tsc-dts-fix](https://github.com/antongolub/misc/tree/master/packages/dep/tsc-dts-fix) for details.

#### moduleResolution: nodenext
[Nightly build TypeScript 4.7](https://www.typescriptlang.org/docs/handbook/nightly-builds.html) provides [experimental esm support](https://www.typescriptlang.org/docs/handbook/esm-node.html). But it still forces to add extensions by hand (tested on [4.7.0-dev.20220408](https://www.npmjs.com/package/typescript/v/4.7.0-dev.20220408)).
```shell
src/main/ts/q/u/x/index.ts:1:21 - error TS2835: Relative import paths need explicit file extensions in EcmaScript imports when '--moduleResolution' is 'node12' or 'nodenext'. Did you mean '../../../foo.js'?

1 import { foo } from '../../../foo'
```
Moreover, if understand [TS/49271](https://github.com/microsoft/TypeScript/issues/49271) correctly, `nodenext` + pkg.json `type: module` requires `.js` extension to be added to all `.d.ts` files of **external** ESM packages too. Well, good luck with that.  

### Solutions
1. Post-process tsc-compiled outputs each time after build.
2. Patch project sources once as Sindre recommends in [the ESM migration guide](https://github.com/sindresorhus/meta/discussions/15)
3. Use [ttypescript](https://github.com/cevek/ttypescript) with [transformer-append-js-ext plugin](https://github.com/Zoltu/typescript-transformer-append-js-extension/)

This lib covers options 1 and 2.

### Features
* Injects extensions to imports/re-exports statements.
  * `import {foo} from './foo'` → `import {foo} from './foo.js'`
  * `import {baz} from 'external/baz'` → `import {baz} from 'external/baz.js'`
  * Note, [including the file extension is only necessary for packages without an "exports" field](https://nodejs.org/api/esm.html#esm_packages). So in this case all the external refs remain as are.
  * Pays attention to index files: `import {bar} from './bar'` → `import {bar} from './bar/index.js'`
  * Handles `.` and `..` shortcuts
    * `export * from '.'` → `export * from './index.js'`
    * `export * from '..'` → `export * from '../index.js'`
  * Injects `.js` extensions into  `.d.ts` libdef files
  * Does not affect string literals and comments: [depseek](https://github.com/antongolub/misc/tree/master/packages/dep/depseek)
* Handles conditional exports (https://nodejs.org/api/packages.html#conditional-exports)
* Follows `outDir` found in **tsconfig.json**.  
* Searches and replaces `__dirname` and `__filename` refs with `import.meta`.
* Fills blank files with `export {}` ([esbuild issue 1043](https://github.com/evanw/esbuild/issues/1043))
* Patches source map files to point to the updated files.
* Patches `require` statements with new file refs if ext changes ([hybrid/dual pkg](https://2ality.com/2019/10/hybrid-npm-packages.html))
* Changes file extensions (applied to local deps only).
* Supports Windows-based runtimes.

## Getting started
### Requirements
Node.js `>=16.0.0`

### Install
```shell
npm i -dev tsc-esm-fix
yarn add -D tsc-esm-fix

# or w/o saving to package.json
npx tsc-esm-fix [options]
```

### Usage examples
```shell
tsc-esm-fix [options]

# to post-process outputs each time
tsc-esm-fix --target='target/es6'

# to patch ts sources once
tsc-esm-fix --src='src/main/ts' --ext='.js'
```

```typescript
import { fix } from 'tsc-esm-fix'
await fix({
  dirnameVar: true,
  filenameVar: true,
  ext: true
})
```

**Input**  
[code ref](https://github.com/antongolub/tsc-esm-fix/blob/master/src/test/fixtures/ts-project/src/main/ts/index.ts)
```js
import { foo } from './foo';
import './bar';

// external cjs module
import * as e1def from 'e1/a/b/c';
import * as e1root from 'e1';
const { e1 } = e1def;
const { e1: e1x } = e1root;
export { e1, e1x };

// external esm module with `main` in pkg.json
export { m1 } from 'm1';
export { m1 as m1x } from 'm1/index';

// external esm module with `exports` in pkg.json
export { e2 } from 'e2';
export { e2 as es3 } from 'e2/index';
export { e2 as es4 } from 'e2/alias';
export { e2foo } from 'e2/foo';
export { e2bar } from 'e2/bar-bundle';

export * from './foo';
export * from './baz';
export * from './q/u/x';
export const foobaz = foo + 'baz';
export { foo as foo1 } from './foo.js';

// Dir with index.js file inside: ./qux.js/index.js
export { qux } from './qux.js';

export const dirname = __dirname;
export const filename = __filename;

console.log(foobaz);
```

**Output**
```js
import { foo } from './foo.js';
import './bar.js';

import * as e1def from 'e1/a/b/c/index.js';
import * as e1root from 'e1';
const { e1 } = e1def;
const { e1: e1x } = e1root;
export { e1, e1x };

export { m1 } from 'm1';
export { m1 as m1x } from 'm1/index.js';

export { e2 } from 'e2';
export { e2 as es3 } from 'e2/index';
export { e2 as es4 } from 'e2/alias';
export { e2foo } from 'e2/foo';
export { e2bar } from 'e2/bar-bundle';

export * from './foo.js';
export * from './baz/index.js';
export * from './q/u/x/index.js';
export const foobaz = foo + 'baz';
export { foo as foo1 } from './foo.js';

export { qux } from './qux.js/index.js';

export const dirname = /file:\\\\/\\\\/(.+)\\\\/[^/]/.exec(import.meta.url)[1];
export const filename = /file:\\\\/\\\\/(.+)/.exec(import.meta.url)[1];
```

### CLI
```shell
tsc-esm-fix [opts]
```
| Option                 | Description                                                                                    | Default                                                                  |
|------------------------|------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------|
| `--tsconfig`           | Path to project's ts-config(s)                                                                 | `tsconfig.json`                                                          |
| `--src`                | Entry points where the ts-source files are placed. If defined `src` option suppresses `target` |                                                                          |
| `--target`             | tsc-compiled output directory                                                                  | If not specified inherited from tsconfig.json **compilerOptions.outDir** |
| `--dirnameVar`         | Replace `__dirname` usages with `import.meta`                                                  | true                                                                     |
| `--filenameVar`        | Replace `__filename` var references with `import.meta` statements                              | true                                                                     |
| `--ext`                | Append extension to relative imports/re-exports                                                | `.js`                                                                    |
| `--ts-ext`             | Known TS extensions                                                                            | `.ts,.tsx,.mts,.mtsx,.cts,.ctsx`                                         |
| `--js-ext`             | Known JS extensions                                                                            | `.js,.jsx,.mjs,.mjsx,.cjs,.cjsx`                                         |
| `--unlink`             | Remove original files if ext changes                                                           | true                                                                     |
| `--fillBlank`          | Fill blank files with `export {}`                                                              | false                                                                    |
| `--forceDefaultExport` | Injects `export default undefined` if not present                                              | false                                                                    |
| `--sourceMap`          | Patch source map files to point to the updated files.                                          | false                                                                    |
| `--cwd`                | cwd                                                                                            | `process.cwd()`                                                          |
| `--out`                | Output dir. Defaults to `cwd`, so files would be overwritten                                   | `process.cwd()`                                                          |
| `--debug`              | Prints debug notes                                                                             |                                                                          |

#### --target vs --src
When `--src` option is used, the util just modifies file contents in place.
`--target` also renames files to change their extension.
You may prevent deletion original of files by using `--no-unlink`.

#### glob patterns
By default, the util looks for `ts/tsx` files in `src` directory and `js/d.ts` files in `target`. But you can specify custom patterns via corresponding options. For example: `--src='src/main/ts/**/*.ts'`.
```js
const patterns =
  sources.length > 0
    ? sources.map((src) => src.includes('*') ? src : `${src}/**/*.{ts,tsx}`)
    : targets.map((target) => target.includes('*') ? target : `${target}/**/*.{js,d.ts}`)
```

### JS/TS API
```ts
import { fix, IFixOptions } from 'tsc-esm-fix'

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
  src?: string | string[]
  target?: string | string[]
  out?: string
  tsconfig?: string | string[]
  dirnameVar: boolean
  filenameVar: boolean
  fillBlank?: boolean
  forceDefaultExport?: boolean
  sourceMap?: boolean
  ext: boolean | string
  tsExt: string | string[]
  jsExt: string | string[]
  unlink?: boolean,
  debug?: boolean | IFunction
}
```

## Alternatives
* https://github.com/mothepro/tsc-esm
* https://github.com/digital-loukoum/tsc-esm
* https://github.com/beenotung/fix-esm-import-path

## Contributing
Feel free to open any issues: bug reports, feature requests or questions.
You're always welcome to suggest a PR. Just fork this repo, write some code, add some tests and push your changes.
Any feedback is appreciated.

## References
* [TypeScript/issues/13422: TypeScript and script `type="module"`](https://github.com/microsoft/TypeScript/issues/13422)
* [TypeScript/issues/28288: Feature: disable extensionless imports](https://github.com/microsoft/TypeScript/issues/28288)
* [ts-jest/issues/1174: import.meta not allowed](https://github.com/kulshekhar/ts-jest/issues/1174)
* [esbuild/issues/1043: Empty file bundles as `{ default: {} }`](https://github.com/evanw/esbuild/issues/1043)
* [stackoverflow.com/how-to-use-import-meta-when-testing-with-jest](https://stackoverflow.com/questions/64961387/how-to-use-import-meta-when-testing-with-jest)
* [Pure ESM package](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c)
* [stackoverflow.com/alternative-for-dirname-in-node-when-using-the-experimental-modules-flag](https://stackoverflow.com/questions/46745014/alternative-for-dirname-in-node-when-using-the-experimental-modules-flag)
* [ecma262/#sec-imports](https://tc39.es/ecma262/#sec-imports)
* [ERR_REQUIRE_ESM](https://dev.to/antongolub/errrequireesm-4j0h)
* [Publishing Node modules with TypeScript and ES modules](https://blog.logrocket.com/publishing-node-modules-typescript-es-modules/)

## License
[MIT](./LICENSE)
