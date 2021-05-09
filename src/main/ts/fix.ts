import globby from 'globby'
import {resolve} from 'path'

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

export const fix = (contents: string, { relativeModuleExt }: IFixOptionsNormalized): string => {
  let _contents = contents

  if (relativeModuleExt) {
    const ext = relativeModuleExt === true ? '.js' : relativeModuleExt
    _contents = _contents.replace(/(\sfrom ["']\.\/[^"']+)(["'])/g, `$1${ext}$2`)
  }

  return _contents
}

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
    const _contents = fix(contents, _opts)

    console.log('nextName=', nextName)
    console.log('_contents=', _contents)
  })

  console.log('files=', files)
}
