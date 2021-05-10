import {DEFAULT_FIX_OPTIONS, fix} from '../../main/ts'

describe('index', () => {
  it('has proper export', () => {
    expect(fix).toEqual(expect.any(Function))
    expect(DEFAULT_FIX_OPTIONS).toBeDefined()
  })
})
