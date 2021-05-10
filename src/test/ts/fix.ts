import {resolve} from 'path'

import {
  fixRelativeModuleReferences,
  fix,
  DEFAULT_FIX_OPTIONS,
  normalizeOptions,
  fixDirnameVar, fixFilenameVar, fixContents
} from '../../main/ts/fix'
import {read} from '../../main/ts/util'
import globby from 'globby'

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
      ext: true
    })
  })
})

describe('fix()', () => {
  it('patches some files as required by opts', async () => {
    await fix({
      cwd: fakeProject,
      out: 'temp',
      tsconfig: ['tsconfig.es5.json', 'tsconfig.es6.json'],
      ext: '.mjs'
    })

    expect(read(resolve(fakeProject, 'temp/target/es6/index.mjs'))).toMatchSnapshot()
  })
})

describe('contents', () => {
  const files = globby.sync('target/**/*.js',{cwd: fakeProject, onlyFiles: true, absolute: true})
  const file = resolve(fakeProject, 'target/es6/index.js')
  const content = read(file)

  it('fixRelativeModuleReferences() appends file ext to module refs', () => {
    expect(fixRelativeModuleReferences(file, content, files)).toMatchSnapshot()
  })

  it('fixDirnameVar() replaces __dirname refs', () => {
    expect(fixDirnameVar(content)).toMatchSnapshot()
  })

  it('fixFilenameVar() replaces __filename refs', () => {
    expect(fixFilenameVar(content)).toMatchSnapshot()
  })

  it('fixContents() assembles all content modifiers', () => {
    expect(fixContents(file, content, DEFAULT_FIX_OPTIONS, files)).toMatchSnapshot()
  })
})

