import { copySync, removeSync } from 'fs-extra'
import globby from 'globby'
import { resolve } from 'path'
import tempy from 'tempy'

import {
  DEFAULT_FIX_OPTIONS,
  fix,
  fixContents,
  fixDirnameVar,
  fixFilenameVar,
  fixRelativeModuleReferences,
  normalizeOptions,
} from '../../main/ts/fix'
import { read } from '../../main/ts/util'

const fakeProject = resolve(__dirname, '../fixtures/ts-project')
const temp = tempy.directory()

afterAll(() => {
  removeSync(temp)
})

describe('normalizeOptions()', () => {
  it('merges DEFAULT_FIX_OPTIONS with specified opts input', () => {
    expect(normalizeOptions()).toEqual(DEFAULT_FIX_OPTIONS)
    expect(
      normalizeOptions({
        tsconfig: ['foo.json'],
        dirnameVar: false,
      }),
    ).toEqual({
      cwd: process.cwd(),
      tsconfig: ['foo.json'],
      dirnameVar: false,
      filenameVar: true,
      ext: true,
    })
  })
})

describe('fix()', () => {
  it('patches some files as required by opts', async () => {
    const cwd = resolve(temp, 'from')
    const out = resolve(temp, 'to')

    copySync(fakeProject, cwd)

    await fix({
      cwd,
      out,
      tsconfig: ['tsconfig.es5.json', 'tsconfig.es6.json'],
      ext: '.mjs',
    })

    expect(read(resolve(temp, 'to/target/es6/index.mjs'))).toMatchSnapshot()
  })
})

describe('contents', () => {
  const files = globby.sync('target/**/*.js', {
    cwd: fakeProject,
    onlyFiles: true,
    absolute: true,
  })
  const file = resolve(fakeProject, 'target/es6/index.js')
  const content = read(file)

  it('fixRelativeModuleReferences() appends file ext to module refs', () => {
    expect(fixRelativeModuleReferences(content, file, files)).toMatchSnapshot()
  })

  it('fixDirnameVar() replaces __dirname refs', () => {
    expect(fixDirnameVar(content)).toMatchSnapshot()
  })

  it('fixFilenameVar() replaces __filename refs', () => {
    expect(fixFilenameVar(content)).toMatchSnapshot()
  })

  it('fixContents() assembles all content modifiers', () => {
    expect(
      fixContents(content, file, files, DEFAULT_FIX_OPTIONS),
    ).toMatchSnapshot()
  })
})
