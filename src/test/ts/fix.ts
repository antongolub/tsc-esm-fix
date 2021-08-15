import * as cp from 'child_process'
import { copySync, removeSync } from 'fs-extra'
import { resolve } from 'path'
import tempy from 'tempy'

import {
  DEFAULT_FIX_OPTIONS,
  fix,
  fixContents,
  fixDirnameVar,
  fixFilenameVar,
  fixRelativeModuleReferences,
} from '../../main/ts'
import { normalizeOptions } from '../../main/ts/fix'
import { globbySync, read } from '../../main/ts/util'

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
      debug: false,
      dirnameVar: false,
      filenameVar: true,
      ext: true,
    })
  })
})

describe('fix()', () => {
  it('patches some files as required by opts', async () => {
    const cwd = resolve(temp, 'from')
    const out = resolve(temp, 'from')

    copySync(fakeProject, cwd)

    await fix({
      cwd,
      out,
      tsconfig: ['tsconfig.es5.json', 'tsconfig.es6.json'],
      ext: '.mjs',
      debug: false,
    })

    const res = resolve(temp, 'from/target/es6/index.mjs')

    expect(read(res)).toMatchSnapshot()
    expect(cp.execSync(`node ${res}`).toString().trim()).toBe(
      'barbaz',
    )
  })
})

describe('contents', () => {
  const files = globbySync(
    [
      'target/**/*.(m|c)?js',
      'node_modules/**/*.(m|c)?js',
      '!node_modules/e2',
      '!node_modules/**/node_modules/**/*.(m|c)?js',
    ],
    {
      cwd: fakeProject,
      onlyFiles: true,
      absolute: true,
    },
  )
  const file = resolve(fakeProject, 'target/es6/index.js')
  const content = read(file)

  it('fixRelativeModuleReferences() appends file ext to module refs except for the ones that declare "exports" in pkg.json', () => {
    expect(
      fixRelativeModuleReferences(content, file, files, fakeProject),
    ).toMatchSnapshot()
  })

  it('fixDirnameVar() replaces __dirname refs', () => {
    expect(fixDirnameVar(content)).toMatchSnapshot()
  })

  it('fixFilenameVar() replaces __filename refs', () => {
    expect(fixFilenameVar(content)).toMatchSnapshot()
  })

  it('fixContents() assembles all content modifiers', () => {
    expect(
      fixContents(content, file, files, {...DEFAULT_FIX_OPTIONS, cwd: fakeProject}),
    ).toMatchSnapshot()
  })

  it('fixContents() with no flags does not provide any effects', () => {
    expect(
      fixContents(content, file, files, {
        ext: false,
        cwd: fakeProject,
        filenameVar: false,
        dirnameVar: false,
        tsconfig: './tsconfig.json'
      }),
    ).toEqual(content)
  })
})
