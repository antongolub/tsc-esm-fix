import globby from 'globby'
import { dirname, resolve } from 'path'

import { IFixOptions, IFixOptionsNormalized } from './interface'
import { asArray, read, readJson, unixify, unlink, write } from './util'

export const DEFAULT_FIX_OPTIONS: IFixOptionsNormalized = {
  cwd: process.cwd(),
  tsconfig: './tsconfig.json',
  filenameVar: true,
  dirnameVar: true,
  ext: true,
}

export const normalizeOptions = (
  opts?: IFixOptions,
): IFixOptionsNormalized => ({ ...DEFAULT_FIX_OPTIONS, ...opts })

export const findTargets = (
  tsconfig: string | string[],
  cwd: string,
): string[] =>
  asArray(tsconfig).reduce<string[]>((targets, file) => {
    const tsconfigJson = readJson(resolve(cwd, file))
    const outDir = tsconfigJson?.compilerOptions?.outDir
    const module = tsconfigJson?.compilerOptions?.module?.toLowerCase()

    if (outDir && (module === 'es2020' || module === 'esnext')) {
      targets.push(outDir)
    }

    return targets
  }, [])

export const resolveDependency = (
  parent: string,
  nested: string,
  files: string[],
  cwd: string,
): string => {
  const dir = dirname(parent)
  const nmdir = resolve(cwd, 'node_modules')
  const alt = ['.js', '.cjs', '.mjs'].reduce<string[]>((m, e) => {
    m.push(`${nested}${e}`, `${nested}/index${e}`)
    return m
  }, [])

  return (
    alt.find(
      (f) =>
        files.includes(unixify(resolve(nmdir, f))) ||
        files.includes(unixify(resolve(dir, f))),
    ) || nested
  )
}

export const fixFilenameExtensions = (names: string[], ext: string): string[] =>
  names.map((name) => name.replace(/\.[^.]+$/, ext))

export const fixRelativeModuleReferences = (
  contents: string,
  filename: string,
  filenames: string[],
  cwd: string,
): string =>
  contents.replace(
    /(\sfrom |\simport\()(["'])([^"']+\/[^"']+)(["'])/g,
    (matched, control, q1, from, q2) =>
      `${control}${q1}${resolveDependency(
        filename,
        from,
        filenames,
        cwd,
      )}${q2}`,
  )

export const fixDirnameVar = (contents: string): string =>
  contents.replace(
    /__dirname/g,
    '/file:\\/\\/(.+)\\/[^/]/.exec(import.meta.url)[1]',
  ) // eslint-disable-line

export const fixFilenameVar = (contents: string): string =>
  contents.replace(/__filename/g, '/file:\\/\\/(.+)/.exec(import.meta.url)[1]') // eslint-disable-line

export const fixContents = (
  contents: string,
  filename: string,
  filenames: string[],
  { cwd, ext, dirnameVar, filenameVar }: IFixOptionsNormalized,
): string => {
  let _contents = contents

  if (ext) {
    _contents = fixRelativeModuleReferences(_contents, filename, filenames, cwd)
  }

  if (dirnameVar) {
    _contents = fixDirnameVar(_contents)
  }

  if (filenameVar) {
    _contents = fixFilenameVar(_contents)
  }

  return _contents
}

export const fix = async (opts?: IFixOptions): Promise<void> => {
  const _opts = normalizeOptions(opts)
  const { cwd, target, tsconfig, out = cwd, ext } = _opts
  const targets = target ? asArray(target) : findTargets(tsconfig, cwd)
  const patterns = targets.map((target) => `${target}/**/*.js`)
  const outDir = resolve(cwd, out)
  const names = await globby(patterns, {
    cwd: cwd,
    onlyFiles: true,
    absolute: true,
  })
  const externalNames = await globby(
    [
      'node_modules/**/*.(m|c)?js',
      '!node_modules/**/node_modules/**/*.(m|c)?js',
    ],
    {
      cwd: cwd,
      onlyFiles: true,
      absolute: true,
    },
  )
  const _names =
    typeof ext === 'string' ? fixFilenameExtensions(names, ext) : names
  const allNames = [...externalNames, ..._names]

  _names.forEach((name, i) => {
    const nextName = name.replace(unixify(cwd), unixify(outDir))
    const contents = read(names[i])
    const _contents = fixContents(contents, name, allNames, _opts)

    write(nextName, _contents)

    if (cwd === outDir && nextName !== names[i]) {
      unlink(names[i])
    }
  })
}
