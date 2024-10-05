#!/usr/bin/env node

import { typeFlag } from 'type-flag'

import { fix } from './fix'
import { IFixOptions } from './interface'

const help = `
	Usage
	  $ tsc-esm-fix [options]

	Options
	  --out         Output dir. Defaults to cwd, so files will be overridden
	  --cwd         cwd. process.cwd() by default
	  --tsconfig    Prod/bundle tsconfig path to search for 'outDir'
	  --target      Specify target/outDir. Suppresses 'tsconfig.compilerOptions.outDir'.
	  --src         Specify src dir for patching. Suppresses '--target' option.
	  --ext         Append extension (like '.mjs') to relative imports/re-exports
	  --ts-ext      Specify TS extensions. Defaults to '.ts,.tsx,.mts,.mtsx,.cts,.ctsx'
	  --js-ext      Specify JS extensions. Defaults to '.js,.jsx,.mjs,.mjsx,.cjs,.cjsx'
	  --unlink      Remove original files if ext changes
	  --dirnameVar  Replace __dirname refs with import.meta
	  --filenameVar Replace __filename with import.meta
	  --fillBlank   Fill in blank files with 'export {}'
	  --sourceMap   Patch source map files to point to the updated files
	  --forceDefaultExport  Injects 'export default undefined' if not present

	Examples
	  $ tsc-esm-fix --ext=.mjs --out=foo
`

const parsed = typeFlag(
  {
    ext: {
      type: String,
    },
    tsExt: {
      type: String,
    },
    jsExt: {
      type: String,
    },
    unlink: {
      type: Boolean,
      default: true,
    },
    tsconfig: {
      isMultiple: true,
      type: String,
    },
    dirnameVar: {
      type: Boolean,
      default: true,
    },
    filenameVar: {
      type: Boolean,
      default: true,
    },
    cwd: {
      type: String,
    },
    target: {
      type: [String],
    },
    src: {
      type: [String],
    },
    fillBlank: {
      type: Boolean,
    },
    forceDefaultExport: {
      type: Boolean,
    },
    sourceMap: {
      type: Boolean,
    },
    help: {
      type: Boolean,
      alias: 'h'
    },
  },
)

if (parsed.flags.help) {
  console.log(help)
  process.exit(0)
} else {
  fix(parsed.flags as IFixOptions)
    .then(() => process.exit(0), (e) => {
      console.error(e)
      process.exit(1)
    })
}
