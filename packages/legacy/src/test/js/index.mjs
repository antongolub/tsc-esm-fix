import { DEFAULT_FIX_OPTIONS, fix } from '../../main/js/index.mjs'

describe('index', () => {
  it('has proper export', () => {
    expect(fix).toEqual(expect.any(Function))
    expect(DEFAULT_FIX_OPTIONS).toBeDefined()
  })
})
