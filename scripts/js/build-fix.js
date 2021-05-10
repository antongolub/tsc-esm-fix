import {fix} from '../../target/bundle/tsc-es2020-fix.mjs'

fix({
  tsconfig: ['tsconfig.es6.json'],
  ext: '.mjs',
  dirnameVar: false,
  filenameVar: false
})
