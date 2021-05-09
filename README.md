# tsc-es2020-fix
Make tsc-compiled `es2020` bundles compatible with `"type": "module"` requirements

## Motivation
This workaround is aimed to bypass a pair of **tsc** and **ts-jest** issues _right here and right now_. 
* [TS/issues/13422](https://github.com/microsoft/TypeScript/issues/13422): tsc should add `.js` extensions for rel module paths.
* [ts-jest/issues/1174](https://github.com/kulshekhar/ts-jest/issues/1174): `import.meta` is not allowed.

Hope one day this library will not be needed.

## Install
```shell
yarn add -D tsc-es2020-fix
```

## Usage
```shell
tsc-es2020-fix
```

```typescript
import { applyFix } from 'tsc-es2020-fix'
await applyFix({
  dirnameVar: true,
  filenameVar: true,
  relativeModuleExt: true
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
|`--include` | Entry points where compiled files are placed for modification | If not specified inherited from tsconfig.json **compilerOptions.outDir**
|`--dirnameVar` | Replace `__dirname` usages with `import.meta` | true
|`--filenameVar` | Replace `__filename` var references `import.meta` | true
|`--relativeModuleExt` | Append extension to relative imports/re-exports | `.js`

### JS/TS
```ts
import { applyFix, IFixOptions } from 'tsc-es2020-fix'

const fixOptions: IFixOptions = {
  tsconfig: 'tsconfig.build.json',
  dirnameVar: true,
  filenameVar: true,
  relativeModuleExt: true
}

await applyFix(fixOptions)
```
```typescript
export interface IFixOptions {
  tsconfig?: string | string[]
  dirnameVar?: boolean
  filenameVar?: boolean
  relativeModuleExt?: boolean | string
}
```

## License
[MIT](./LICENSE)
