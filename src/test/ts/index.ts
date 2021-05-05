import { foo } from '../../main/ts'

describe('index', () => {
  it('foo() result equals bar', () => {
    expect(foo()).toBe('bar')
  })
})
