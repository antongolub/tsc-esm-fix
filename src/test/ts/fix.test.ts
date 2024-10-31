import * as cp from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import fse from 'fs-extra'
import semver from 'semver'
import { temporaryDirectory } from 'tempy'

import {
  DEFAULT_FIX_OPTIONS,
  fix,
  fixBlankFiles,
  fixContents,
  fixDefaultExport,
  fixDirnameVar,
  fixFilenameVar,
  fixModuleReferences,
} from '../../main/ts'
import { normalizeOptions} from '../../main/ts/options'
import { read, readJson, glob } from '../../main/ts/util'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const fakeProject = path.resolve(__dirname, '../fixtures/ts-project')
const nestjsSwaggerProject = path.resolve(__dirname, '../fixtures/nestjs-swagger-project')

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
      src: [],
      target: [],
      jsExt: DEFAULT_FIX_OPTIONS.jsExt,
      tsExt: DEFAULT_FIX_OPTIONS.tsExt,
    })
  })
})

describe('patches', () => {
  describe('fix()', () => {
    it('patches ts sources as required by opts', async () => {
      const temp = temporaryDirectory()
      const cwd = path.resolve(temp)

      fse.copySync(fakeProject, cwd)

      await fix({
        cwd,
        src: ['src'],
        ext: '.js',
        debug: true,
        dirnameVar: false,
        filenameVar: false,
      })

      expect(read(path.resolve(temp, 'src/main/ts/index.ts'))).toMatchSnapshot()
      expect(read(path.resolve(temp, 'src/main/ts/index-ref.ts'))).toMatchSnapshot()
      expect(read(path.resolve(temp, 'src/main/ts/index-ref-2/index.ts'))).toMatchSnapshot()
    })

    it('patches target (tsc-compiled) files as required by opts', async () => {
      const temp = temporaryDirectory()
      const cwd = path.resolve(temp)
      const out = path.resolve(temp)

      fse.copySync(fakeProject, cwd)

      await fix({
        cwd,
        out,
        tsconfig: ['tsconfig.es5.json', 'tsconfig.es6.json'],
        ext: '.mjs',
        debug: false,
        fillBlank: true,
        sourceMap: true
      })

      const res = path.resolve(temp, 'target/es6/index.mjs')
      const contents = read(res)

      // NodeJS v16.14.0+ requires {assert: {type: 'json'}} for json imports
      // https://github.com/nodejs/node/pull/40250
      // https://github.com/nodejs/node/commit/7b996655cfcb37d732eca3f61c51d701cd97d8d1
      if (semver.gte('16.14.0', cp.execSync('node -v').toString().trim())) {
        fse.writeFileSync(res, contents.replace(` assert { type: 'json' };`, ''))
      }

      expect(read(path.resolve(temp, 'target/es6/index.d.ts'))).toMatchSnapshot()
      expect(read(path.resolve(temp, 'target/es6/only-types.mjs'))).toMatchSnapshot()
      expect(read(path.resolve(temp, 'target/es6/index.mjs'))).toMatchSnapshot()
      expect(readJson(path.resolve(temp, 'target/es6/index.mjs.map')).file).toBe('index.mjs')
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
    const files = glob.sync(
      [
        'target/**/*.(m|c)?js',
        'node_modules/**/*.(m|c)?js',
        '!node_modules/e2',
        '!node_modules/e3',
        '!node_modules/**/node_modules/**/*.(m|c)?js',
      ],
      {
        cwd: fakeProject,
        onlyFiles: true,
        absolute: true,
      },
    )
    const file = path.resolve(fakeProject, 'target/es6/index.js')
    const content = read(file)

    it('fixRelativeModuleReferences() appends file ext to module refs except for the ones that declare "exports" in pkg.json', () => {
      expect(
        fixModuleReferences(content, file, files, fakeProject, []),
      ).toMatchSnapshot()
    })

    it('fixDirnameVar() replaces __dirname refs', () => {
      expect(fixDirnameVar(content)).toMatchSnapshot()
      expect(fixDirnameVar(content, true)).toMatchSnapshot()
    })

    it('fixFilenameVar() replaces __filename refs', () => {
      expect(fixFilenameVar(content)).toMatchSnapshot()
      expect(fixFilenameVar(content, true)).toMatchSnapshot()
    })

    it('fixBlankFiles() replaces empty contents with empty export statement', () => {
      expect(fixBlankFiles('')).toMatchSnapshot()
    })

    it('fixDefaultExport() injects export default', () => {
      expect(fixDefaultExport('export {};')).toMatchSnapshot()
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
          tsconfig: './tsconfig.json', // eslint-disable-line
          debug(){}, // eslint-disable-line
          jsExt: DEFAULT_FIX_OPTIONS.jsExt,
          tsExt: DEFAULT_FIX_OPTIONS.tsExt,
          src: [],
          target: [],
        }),
      ).toEqual(content)
    })

    it('fixContents() replaces `.` with `./index.cjs`', () => {
      const file = path.resolve(fakeProject, 'target/es6/index-ref.js')
      const content = read(file)
      const _files = files.map(f => f.replace(/\.js$/, '.cjs'))
      expect(
        fixContents(content, file, _files, {
          ext: '.cjs',
          cwd: fakeProject,
          filenameVar: false,
          dirnameVar: false,
          tsconfig: './tsconfig.json',
          debug() {}, // eslint-disable-line
          jsExt: DEFAULT_FIX_OPTIONS.jsExt,
          tsExt: DEFAULT_FIX_OPTIONS.tsExt,
          src: [],
          target: [],
        }),
      ).toMatchSnapshot()
    })

    it('fixContents() patches `require` args', () => {
      const file = path.resolve(nestjsSwaggerProject, 'event.dto.js')
      const content = read(file)
      const files = glob.sync(
          [
            '**/*.js',
          ],
          {
            cwd: nestjsSwaggerProject,
            onlyFiles: true,
            absolute: true,
          },
      )
      expect(
          fixContents(content, file, files, {
            ext: '.js',
            cwd: nestjsSwaggerProject,
            filenameVar: false,
            dirnameVar: false,
            tsconfig: './tsconfig.json', // eslint-disable-line
            debug() {}, // eslint-disable-line @typescript-eslint/no-empty-function,
            jsExt: DEFAULT_FIX_OPTIONS.jsExt,
            tsExt: DEFAULT_FIX_OPTIONS.tsExt,
            src: [],
            target: [],
          }),
      ).toMatchSnapshot()
    })
  })
})
