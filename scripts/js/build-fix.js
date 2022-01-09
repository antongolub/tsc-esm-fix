import { fix } from '../../packages/core/target/bundle/tsc-esm-fix.mjs'
import path from 'path'

fix({
  // tsconfig: ['tsconfig.es6.json'],
  tsconfig: process.argv.slice(2).map(p => path.join(process.cwd(), p)),
  ext: '.mjs',
  dirnameVar: false,
  filenameVar: false,
})
