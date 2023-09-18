#!/usr/bin/env node

import './meow.d.ts'
import meow from 'meow'

import { fix } from './fix'
import { IFixOptions } from './interface'

const cli = meow(
  `
	Usage
	  $ tsc-esm-fix [options]

	Options
	  --out         Output dir. Defaults to cwd, so files will be overridden
	  --cwd         cwd. process.cwd() by default
	  --tsconfig    Prod/bundle tsconfig path to search for 'outDir'
	  --target      Specify target/outDir. Suppresses 'tsconfig.compilerOptions.outDir'.
	  --src         Specify src dir for patching. Suppresses '--target' option.
	  --ext         Append extension (like '.mjs') to relative imports/re-exports
	  --unlink      Remove original files if ext changes
	  --dirnameVar  Replace __dirname refs with import.meta
	  --filenameVar Replace __filename with import.meta
	  --fillBlank   Fill in blank files with 'export {}'
	  --sourceMap   Patch source map files to point to the updated files
	  --forceDefaultExport  Injects 'export default undefined' if not present

	Examples
	  $ tsc-es2020-fix --ext=.mjs --out=foo
`,
  {
    importMeta: import.meta,
    flags: {
      ext: {
        type: 'string',
      },
      unlink: {
        type: 'boolean',
        default: true,
      },
      tsconfig: {
        isMultiple: true,
        type: 'string',
      },
      dirnameVar: {
        type: 'boolean',
        default: true,
      },
      filenameVar: {
        type: 'boolean',
        default: true,
      },
      cwd: {
        type: 'string',
      },
      target: {
        type: 'string',
        isMultiple: true,
      },
      src: {
        type: 'string',
        isMultiple: true,
      },
      fillBlank: {
        type: 'boolean',
      },
      forceDefaultExport: {
        type: 'boolean',
      },
      sourceMap: {
        type: 'boolean',
      },
    },
  },
)

fix(cli.flags as IFixOptions)
