import {resolve} from 'path'

import {applyFix, DEFAULT_FIX_OPTIONS, normalizeOptions} from '../../main/ts/fix'

const fakeProject = resolve(__dirname, '../fixtures/ts-project')

describe('normalizeOptions()', () => {
  it('merges DEFAULT_FIX_OPTIONS with specified opts input', () => {
    expect(normalizeOptions()).toEqual(DEFAULT_FIX_OPTIONS)
    expect(normalizeOptions({
      tsconfig: ['foo.json'],
      dirnameVar: false
    })).toEqual({
      cwd: process.cwd(),
      tsconfig: ['foo.json'],
      dirnameVar: false,
      filenameVar: true,
      relativeModuleExt: '.js'
    })
  })
})

describe('applyFix()', () => {
  fit('', async () => {
    await applyFix({
      cwd: fakeProject,
      out: 'fixed',
      tsconfig: ['tsconfig.es5.json', 'tsconfig.es6.json']
    })
  })
})
