import {applyFix, DEFAULT_FIX_OPTIONS, normalizeOptions} from '../../main/ts/fix'

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
    await applyFix({})
  })
})
