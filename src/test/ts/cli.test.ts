import {$, path} from 'zx'

const __dirname = new URL('.', import.meta.url).pathname
const root = path.resolve(__dirname, '../../../')
const bin = path.resolve(root, 'target/esm/cli.mjs')

describe('CLI', () => {
  it('prints help message', async () => {
    const result = await $`node ${bin} --help`
    expect(result.stdout).toContain('Usage')
  })
})
