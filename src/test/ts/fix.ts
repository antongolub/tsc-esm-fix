import * as cp from 'child_process'
import fse from 'fs-extra'
import { globbySync } from 'globby'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import semver from 'semver'
import { temporaryDirectory } from 'tempy'

import {
  DEFAULT_FIX_OPTIONS,
  fix,
  fixBlankFiles,
  fixContents,
  fixDirnameVar,
  fixFilenameVar,
  fixModuleReferences,
} from '../../main/ts'
import { normalizeOptions } from '../../main/ts/fix'
import { read } from '../../main/ts/util'

const __dirname = dirname(fileURLToPath(import.meta.url))
const fakeProject = resolve(__dirname, '../fixtures/ts-project')
const temp = temporaryDirectory()

afterAll(() => {
  fse.removeSync(temp)
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
      debug: expect.any(Function),
      tsconfig: ['foo.json'],
      dirnameVar: false,
      filenameVar: true,
      ext: true,
      unlink: true,
    })
  })
})

describe('patches', () => {
  describe('fix()', () => {
    it('patches ts sources as required by opts', async () => {
      const cwd = resolve(temp, 't1')

      fse.copySync(fakeProject, cwd)

      await fix({
        cwd,
        src: ['src'],
        ext: '.js',
        debug: true,
        dirnameVar: false,
        filenameVar: false,
      })

      expect(read(resolve(temp, 't1/src/main/ts/index.ts'))).toMatchSnapshot()
    })

    it('patches target (tsc-compiled) files as required by opts', async () => {
      const cwd = resolve(temp, 'from')
      const out = resolve(temp, 'from')

      fse.copySync(fakeProject, cwd)

      await fix({
        cwd,
        out,
        tsconfig: ['tsconfig.es5.json', 'tsconfig.es6.json'],
        ext: '.mjs',
        debug: false,
      })

      const res = resolve(temp, 'from/target/es6/index.mjs')
      const contents = read(res)

      // NodeJS v16.14.0+ requires {assert: {type: 'json'}} for json imports
      // https://github.com/nodejs/node/pull/40250
      // https://github.com/nodejs/node/commit/7b996655cfcb37d732eca3f61c51d701cd97d8d1
      if (semver.gte('16.14.0', cp.execSync('node -v').toString().trim())) {
        fse.writeFileSync(res, contents.replace(` assert { type: 'json' };`, ''))
      }

      expect(contents).toMatchSnapshot()
      expect(
        cp
          .execSync(`node --experimental-top-level-await --experimental-json-modules ${res}`, {
            cwd: temp,
            env: {},
            timeout: 5000,
          })
          .toString()
          .trim(),
      ).toBe('barbaz')
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
        fixModuleReferences(content, file, files, fakeProject),
      ).toMatchSnapshot()
    })

    it('fixDirnameVar() replaces __dirname refs', () => {
      expect(fixDirnameVar(content)).toMatchSnapshot()
    })

    it('fixFilenameVar() replaces __filename refs', () => {
      expect(fixFilenameVar(content)).toMatchSnapshot()
    })

    it('fixBlankFiles() replaces empty contents with empty export statement', () => {
      expect(fixBlankFiles('')).toMatchSnapshot()
    })

    it('fixContents() assembles all content modifiers', () => {
      expect(
        fixContents(content, file, files, {
          ...DEFAULT_FIX_OPTIONS,
          cwd: fakeProject,
        }),
      ).toMatchSnapshot()
    })

    it('fixContents() with no flags does not provide any effects', () => {
      expect(
        fixContents(content, file, files, {
          ext: false,
          cwd: fakeProject,
          filenameVar: false,
          dirnameVar: false,
          tsconfig: './tsconfig.json',
          debug: () => {}, // eslint-disable-line
        }),
      ).toEqual(content)
    })
  })
})
