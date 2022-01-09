import path from 'path'

import { fix } from '../../packages/core/target/bundle/tsc-esm-fix.mjs'

fix({
  // tsconfig: ['tsconfig.es6.json'],
  tsconfig: process.argv.slice(2).map(p => path.join(process.cwd(), p)),
  ext: '.mjs',
  dirnameVar: false,
  filenameVar: false,
})
