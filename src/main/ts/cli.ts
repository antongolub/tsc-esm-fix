#!/usr/bin/env node

import meow from 'meow'

import {fix} from './fix'

const cli = meow(`
	Usage
	  $ tsc-es2020-fix [options]

	Options
	  --tsconfig    Prod/bundle tsconfig path to search for 'outDir'
	  --target      Specify target/outDir by hand. Suppresses 'tsconfig.compilerOptions.outDir'.
	  --ext         Append extension (like '.mjs') to relative imports/re-exports
	  --dirnameVar  Replace __dirname refs with import.meta
	  --filenameVar Replace __filename with import.meta
	  --out         Output dir. Defaults to cwd, so files will be overridden
	  --cwd         cwd. process.cwd() by default

	Examples
	  $ tsc-es2020-fix --ext=.mjs --out=foo
`, {
  importMeta: import.meta,
  flags: {
    ext: {
      type: 'string'
    },
    tsconfig: {
      isMultiple: true,
      type: 'string'
    },
    dirnameVar: {
      type: 'boolean',
      default: true
    },
    filenameVar: {
      type: 'boolean',
      default: true
    },
    cwd: {
      type: 'string'
    },
    target: {
      type: 'string',
      isMultiple: true
    }
  }
})

fix(cli.flags)
