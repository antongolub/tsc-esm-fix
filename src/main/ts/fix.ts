import globby from 'globby'
import {dirname, extname,resolve} from 'path'

import {IFixOptions, IFixOptionsNormalized} from './interface'
import {asArray, read, readJson, unlink,write} from './util'

export const DEFAULT_FIX_OPTIONS: IFixOptionsNormalized = {
  cwd: process.cwd(),
  tsconfig: './tsconfig.json',
  filenameVar: true,
  dirnameVar: true,
  ext: true
}

export const normalizeOptions = (opts?: IFixOptions): IFixOptionsNormalized => ({...DEFAULT_FIX_OPTIONS, ...opts})

export const findTargets = (tsconfig: string | string[], cwd: string): string[] =>
  asArray(tsconfig).reduce<string[]>((targets, file) => {
    const tsconfigJson = readJson(resolve(cwd, file))
    const outDir = tsconfigJson?.compilerOptions?.outDir
    const module = tsconfigJson?.compilerOptions?.module?.toLowerCase()

    if (outDir && (module === 'es2020' || module === 'esnext')) {
      targets.push(outDir)
    }

    return targets
  }, [])

export const resolveDependency = (parent: string, nested: string, files: string[]): string => {
  const dir = dirname(parent)
  const ext = extname(parent)
  const p1 = `${nested}${ext}`
  const p2 = `${nested}/index${ext}`

  if (files.includes(resolve(dir, p1))) {
    return p1
  }

  if (files.includes(resolve(dir, p2))) {
    return p2
  }

  return nested
}

export const fixFileExtensions = (files: string[], ext: string): string[] => files.map((file) => file.replace(/\.[^.]+$/, ext))

export const fixRelativeModuleReferences = (file: string, contents: string, files: string[]): string =>
  contents.replace(/(\sfrom |\simport\()(["'])(\.\/[^"']+)(["'])/g, (matched, control, q1, from, q2) =>
    `${control}${q1}${resolveDependency(file, from, files)}${q2}`
  )

export const fixDirnameVar = (contents: string): string =>
  contents.replace(/__dirname/g, '/file:\/\/(.+)\/[^/]/.exec(import.meta.url)[1]') // eslint-disable-line

export const fixFilenameVar = (contents: string): string =>
  contents.replace(/__filename/g, '/file:\/\/(.+)/.exec(import.meta.url)[1]') // eslint-disable-line

export const fixContents = (name: string, contents: string, { ext, dirnameVar, filenameVar }: IFixOptionsNormalized, files: string[]): string => {
  let _contents = contents

  if (ext) {
    _contents = fixRelativeModuleReferences(name, _contents, files)
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
  const names = await globby(patterns,{cwd: cwd, onlyFiles: true, absolute: true})
  const _names = typeof ext === 'string'
    ? fixFileExtensions(names, ext)
    : names

  _names.forEach((name, i) => {
    const nextName = name.replace(cwd, outDir)
    const contents = read(names[i])
    const _contents = fixContents(name, contents, _opts, _names)

    write(nextName, _contents)

    if (cwd === outDir && nextName !== names[i]) {
      unlink(names[i])
    }
  })
}
