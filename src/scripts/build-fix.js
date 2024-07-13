import { fix } from '../../target/cjs/index.cjs'

fix({
  tsconfig: ['tsconfig.es6.json'],
  ext: '.mjs',
  dirnameVar: false,
  filenameVar: false,
})
