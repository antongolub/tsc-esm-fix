import {dirname, resolve} from 'node:path'
import {TFixer} from '../interface'
import {unixify} from '../util'

export const fixModuleReferences: TFixer = (ctx) => {
  const { contents, filename, filenames, options: {cwd}, ignore } = ctx
  const _contents = contents.replace(
    /((?:\s|^)import\s+|\s+from\s+|\W(?:import|require)\s*\()(["'])([^"']+\/[^"']+|\.{1,2})\/?(["'])/g,
    (_matched, control, q1, from, q2) =>
      `${control}${q1}${ignore.includes(from) ? from : resolveDependency(
        filename,
        from,
        filenames,
        cwd,
      )}${q2}`,
  )

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
