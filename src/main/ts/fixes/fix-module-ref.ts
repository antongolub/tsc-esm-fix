import path from 'node:path'
import { patchRefs } from 'depseek'
import { TFixer } from '../interface'
import { unixify } from '../util'
import { DEFAULT_FIX_OPTIONS } from '../options'

export const fixModuleReferences: TFixer = (ctx) => {
  const { contents, filename, filenames, options: {cwd, jsExt}, ignore } = ctx
  const _contents = patchRefs(contents, (value) => {
    const v = value.endsWith('/') ? value.slice(0, -1) : value
    return (v.includes('/') || v === '.' || v === '..') && !ignore.includes(v)
      ? resolveDependency(filename, v, filenames, cwd, jsExt)
      : value
  })

  return {...ctx, contents: _contents}
}

export const resolveDependency = (
  parent: string,
  nested: string,
  files: string[],
  cwd: string,
  jsExt: string[] = DEFAULT_FIX_OPTIONS.jsExt,
): string => {
  const dir = path.dirname(parent)
  const nmdir = path.resolve(cwd, 'node_modules')
  const bases = /^\..+\.[^./\\]+$/.test(nested)
    ? [nested, nested.replace(/\.[^./\\]+$/, '')]
    : [nested]
  const variants = jsExt.reduce<string[]>((m, e) => {
    bases.forEach((v) => m.push(`${v}${e}`, `${v}/index${e}`))
    return m
  }, [])

  return (
    variants.find((f) => files.includes(unixify(path.resolve(dir, f)))) ||
    variants.find((f) => files.includes(unixify(path.resolve(nmdir, f)))) ||
    nested
  )
}
