import { foo } from '../../../target/es6'

describe('index (es6)', () => {
  it('foo() result equals bar', () => {
    expect(foo()).toBe('bar')
  })
})
