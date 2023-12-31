import {dirname, resolve} from 'node:path'
import {TFixer} from '../interface'
import {unixify} from '../util'
import { depseekSync } from 'depseek'

export const fixModuleReferences: TFixer = (ctx) => {
  const { contents, filename, filenames, options: {cwd}, ignore } = ctx
  const deps = depseekSync(contents)
  let pos = 0
  let _contents = ''

  for (const {index, value} of deps) {
    const len = value.length
    const v = value.endsWith('/') ? value.slice(0, -1) : value
    const _value = (v.includes('/') || v === '.' || v === '..') && !ignore.includes(v)
      ? resolveDependency(filename, v, filenames, cwd)
      : value

    _contents = _contents + contents.slice(pos, index) + _value
    pos = index + len
  }
  _contents = _contents + contents.slice(pos)

  return {...ctx, contents: _contents}
}

export const resolveDependency = (
  parent: string,
  nested: string,
  files: string[],
  cwd: string,
): string => {
  const dir = dirname(parent)
  const nmdir = resolve(cwd, 'node_modules')
  const bases = /^\..+\.[^./\\]+$/.test(nested)
    ? [nested, nested.replace(/\.[^./\\]+$/, '')]
    : [nested]
  const variants = ['.js', '.cjs', '.mjs'].reduce<string[]>((m, e) => {
    bases.forEach((v) => m.push(`${v}${e}`, `${v}/index${e}`))
    return m
  }, [])

  return (
    variants.find((f) => files.includes(unixify(resolve(dir, f)))) ||
    variants.find((f) => files.includes(unixify(resolve(nmdir, f)))) ||
    nested
  )
}
