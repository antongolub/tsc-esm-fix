import {getExportsEntries} from '../../main/ts/finder'

describe('getExportsEntries()', () => {
  it('handles string', () => {
    expect(getExportsEntries('foo'))
      .toEqual([['.', ['foo']]])
  })

  it('handles module map', () => {
    expect(getExportsEntries({
      '.': './foo.js',
      './bar': './bar.js'
    }))
      .toEqual([
        ['.', ['./foo.js']],
        ['./bar', ['./bar.js']]
      ])
  })

  it('handles module map with conditional accessors', () => {
    expect(getExportsEntries({
      require: './foo.cjs',
      import: './foo.mjs'
    }))
      .toEqual([
        ['.', ['./foo.cjs', './foo.mjs']],
      ])

    expect(getExportsEntries({
      '.': {
        require: './foo.cjs',
        import: './foo.mjs'
      },
      './bar': './bar.js'
    }))
      .toEqual([
        ['.', ['./foo.cjs', './foo.mjs']],
        ['./bar', ['./bar.js']]
      ])
  })

  it('ignores falsy entries', () => {
    // @ts-expect-error test
    expect(getExportsEntries({
      '.': null,
      './bar': {
        require: './bar.js',
        import: null
      }
    }))
      .toEqual([
        ['.', []],
        ['./bar', ['./bar.js']]
      ])

    // @ts-expect-error test
    expect(getExportsEntries())
      .toEqual([])
  })
})