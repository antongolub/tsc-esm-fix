import {resolve} from 'path'

import {fixRelativeModuleReferences, applyFix, DEFAULT_FIX_OPTIONS, normalizeOptions} from '../../main/ts/fix'
import {read} from "../../main/ts/util";
import globby from "globby";

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

describe('fixRelativeModuleReferences()', () => {
  it('appends file ext to module refs', async () => {
    const files = await globby('target/**/*.js',{cwd: fakeProject, onlyFiles: true, absolute: true})
    const file = resolve(fakeProject, 'target/es6/index.js')
    const content = read(file)

    expect(fixRelativeModuleReferences(file, content, files)).toMatchSnapshot()
  })
})
