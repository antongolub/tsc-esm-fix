import path from 'node:path'

import { fixContents } from './fixes'
import {
  IFixOptions,
  IFixOptionsNormalized,
  TFixContext,
  TResourceContext
} from './interface'
import {
  existsSync,
  read,
  readJson,
  remove,
  unixify,
  write,
} from './util'

import {
  getLocalModules,
  getExternalModules,
  getTsconfigTargets,
} from './finder'

import {
  normalizeOptions
} from './options'

export const fixFilenameExtensions = (names: string[], ext: string): string[] =>
  names.map((name) =>
    name.endsWith('.d.ts')
      ? name
      : name.replace(/\.[^./\\]+$/, ext))

export const fix = async (opts?: IFixOptions): Promise<void> => {
  const options = normalizeOptions(opts)
  const ctx = await resolve(options)

  await patch(ctx, options)
}

const resolve = async (options: IFixOptionsNormalized): Promise<TFixContext> => {
  const {cwd, target: _targets, src: sources, tsconfig, out = cwd, ext, debug, tsExt, jsExt} = options
  const outDir = path.resolve(cwd, out)
  const targets = _targets.length > 0 ? _targets : getTsconfigTargets(tsconfig, cwd)
  debug('debug:cwd', cwd)
  debug('debug:outdir', outDir)
  debug('debug:sources', sources)
  debug('debug:targets', targets)

  const isSource = sources.length > 0
  const localModules = await getLocalModules(sources, targets, cwd, tsExt)
  const {
    exportedModules,
    anyModules,
    allPackageNames,
  } = await getExternalModules(cwd, jsExt)

  debug('debug:external-package-names', allPackageNames)
  debug('debug:external-exported-modules', exportedModules)
  debug('debug:external-any-modules', anyModules)

  const ignore = [...exportedModules, ...allPackageNames]
  const _localModules = typeof ext === 'string' ? fixFilenameExtensions(localModules, ext) : localModules
  const allModules = [...anyModules, ..._localModules]
  const allJsModules = [...anyModules, ...fixFilenameExtensions(localModules, '.js')]
  debug('debug:local-modules', _localModules)

  return {
    outDir,
    isSource,
    ignore,
    allJsModules,
    allModules,
    _localModules,
    localModules,
    options
  }
}

const patch = async (ctx: TFixContext, options: IFixOptionsNormalized) => {
  const {cwd, unlink, sourceMap, tsExt, jsExt} = options
  const {
    outDir,
    isSource,
    ignore,
    allJsModules,
    allModules,
    _localModules,
    localModules
  } = ctx

  await Promise.all(_localModules.map(async (name, i) => {
    // NOTE d.ts may refer to .js ext only
    const all = name.endsWith('.d.ts') ? allJsModules : allModules
    const originName = localModules[i]
    const nextName = (isSource ? originName : name)
      .replace(
        unixify(cwd),
        unixify(outDir),
      )
    const contents = read(originName)
    const ctx: TResourceContext = {
      options,
      contents,
      isSource,
      ignore,
      filename: name,
      filenames: all,
      originName,
      nextName,
    }

    const {contents: _contents} = fixContents(ctx)

    write(nextName, _contents)

    if (!isSource && unlink && cwd === outDir && nextName !== originName) {
      remove(originName)
    }

    if (sourceMap) {
      patchSourceFile(originName, nextName, unlink && cwd === outDir)
    }
  }))
}

const patchSourceFile = (name: string, nextName: string, unlink = false) => {
  if (name === nextName) {
    return
  }

  const mapfile = `${name}.map`
  if (!existsSync(mapfile)) {
    return
  }

  const nextMapfile = `${nextName}.map`
  const contents = readJson(mapfile)

  contents.file = path.basename(nextName)
  write(nextMapfile, JSON.stringify(contents))

  if (unlink) {
    remove(mapfile)
  }
}
