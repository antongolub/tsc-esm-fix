import globby from 'globby'

import {resolve, dirname, extname} from 'path'

import {IFixOptions, IFixOptionsNormalized} from './interface'
import {asArray, read, readJson} from './util'

export const DEFAULT_FIX_OPTIONS: IFixOptionsNormalized = {
  cwd: process.cwd(),
  tsconfig: './tsconfig.json',
  filenameVar: true,
  dirnameVar: true,
  relativeModuleExt: '.js'
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

export const fix = (name: string, contents: string, { relativeModuleExt, dirnameVar, filenameVar }: IFixOptionsNormalized, files: string[]): string => {
  let _contents = contents

  if (relativeModuleExt) {
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

export const fixRelativeModuleReferences = (file: string, contents: string, files: string[]): string =>
  contents.replace(/(\sfrom |\simport\()(["'])(\.\/[^"']+)(["'])/g, (matched, control, q1, from, q2) =>
    `${control}${q1}${resolveDependency(file, from, files)}${q2}`
  )

export const fixFileExtensions = (files: string[], ext: string): string[] => files.map((file) => file.replace(/\.[^.]+$/, ext))

export const fixDirnameVar = (contents: string): string =>
  contents.replace(/__dirname/g, '/file:\\/\\/(.+)\\/[^/]/.exec(import.meta.url)[1]')

export const fixFilenameVar = (contents: string): string =>
  contents.replace(/__filename/g, '/file:\\/\\/(.+)/.exec(import.meta.url)[1]')


export const applyFix = async (opts?: IFixOptions): Promise<void> => {
  const _opts = normalizeOptions(opts)
  const { cwd, target, tsconfig, out = cwd } = _opts
  const targets = target ? asArray(target) : findTargets(tsconfig, cwd)
  const patterns = targets.map((target) => `${target}/**/*.js`)
  const files = await globby(patterns,{cwd: cwd, onlyFiles: true, absolute: true})
  const outDir = resolve(cwd, out)

  // console.log('out=', out)
  // console.log('out=', out)
  // console.log('outDir=', outDir)



  files.forEach((name) => {
    const nextName = name.replace(cwd, outDir)
    const contents = read(name)
    const _contents = fix(name, contents, _opts, files)

    console.log('nextName=', nextName)
    console.log('_contents=', _contents)
  })

  console.log('files=', files)
}
