import {resolve} from 'path'

import {IFixOptions, IFixOptionsNormalized} from './interface'
import {asArray, readJson} from './util'
import globby from "globby";

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
    const outDir = readJson(resolve(cwd, file))?.compilerOptions?.outDir

    if (outDir) {
      targets.push(outDir)
    }

    return targets
  }, [])


export const applyFix = async (opts?: IFixOptions): Promise<void> => {
  const _opts = normalizeOptions(opts)
  const targets = findTargets(_opts.tsconfig, _opts.cwd)
  const patterns = targets.map((target) => `${target}/**/*.js`)
  const files = await globby(patterns,{cwd: _opts.cwd, onlyFiles: true})

  console.log('files=', files)
}
