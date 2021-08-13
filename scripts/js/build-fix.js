import {fix} from '../../target/bundle/tsc-esm-fix.mjs'

fix({
  tsconfig: ['tsconfig.es6.json'],
  ext: '.mjs',
  dirnameVar: false,
  filenameVar: false
})
