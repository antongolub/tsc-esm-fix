import {dirname, resolve} from 'node:path'
import {fileURLToPath} from 'node:url'
import process from 'node:process'
import tempy from 'tempy'
import fse from 'fs-extra'

const __dirname = dirname(fileURLToPath(import.meta.url))
const fakeProject = resolve(__dirname, '../../../../core/src/test/fixtures/ts-project')
const cliPath = resolve(__dirname, '../../main/js/cli.mjs')

let processArgv
let nodePath

beforeAll(() => {
  processArgv = process.argv
  [nodePath] = processArgv
})

afterEach(() => {
  process.argv = processArgv
})

describe('cli', () => {
  it('applies tsc-esm-fix to target dir', async () => {
    const cwd = tempy.directory()
    await fse.copy(fakeProject, cwd)

    process.argv = [nodePath, cliPath, '--cwd', cwd, '--tsconfig', 'tsconfig.json', '--ext', '.mjs', '--target', 'target/es6']
    await import(cliPath)

    const indexPath = resolve(cwd, 'target/es6/index.mjs')
    expect(await fse.readFile(indexPath, 'utf8')).toMatchSnapshot()
  })
})
