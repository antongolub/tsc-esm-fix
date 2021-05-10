import { fix } from '../../../target/es6.mjs'

describe('index (es6)', () => {
  it('foo() result equals bar', () => {
    expect(fix).toEqual(expect.any(Function))
  })
})
