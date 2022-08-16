import { Options as GlobbyOptions } from 'globby'
import { basename, dirname, resolve } from 'node:path'

import { IFixOptions, IFixOptionsNormalized } from './interface'
import {
  asArray,
  existsSync,
  globby,
  read,
  readJson,
  remove,
  resolveTsConfig,
  unixify,
  write,
} from './util'

export const DEFAULT_FIX_OPTIONS: IFixOptionsNormalized = {
  cwd: process.cwd(),
  tsconfig: './tsconfig.json',
  filenameVar: true,
  dirnameVar: true,
  ext: true,
  unlink: true,
  debug: () => {}, // eslint-disable-line
}

export const normalizeOptions = (
  opts?: IFixOptions,
): IFixOptionsNormalized => ({
  ...DEFAULT_FIX_OPTIONS,
  ...opts,
  debug: typeof opts?.debug === 'function'
    ? opts.debug
    : opts?.debug === true
      ? console.log
      : DEFAULT_FIX_OPTIONS.debug,
})

export const findTargets = (
  tsconfig: string | string[],
  cwd: string,
): string[] =>
  asArray(tsconfig).reduce<string[]>((targets, file) => {
    const tsconfigJson = resolveTsConfig(resolve(cwd, file))
    const outDir = tsconfigJson?.compilerOptions?.outDir
    const module = tsconfigJson?.compilerOptions?.module.toLowerCase?.()

    if (outDir && module.startsWith('es')) {
      targets.push(outDir)
    } else {
      console.warn('tsconfig should declare `outDir` and `module` type es6 or above')
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

export const fixFilenameExtensions = (names: string[], ext: string): string[] =>
  names.map((name) =>
    name.endsWith('.d.ts')
      ? name
      : name.replace(/\.[^./\\]+$/, ext))

export const fixModuleReferences = (
  contents: string,
  filename: string,
  filenames: string[],
  cwd: string,
): string =>
  contents.replace(
    /(\sfrom\s|[\s(:[](?:import|require)[ (])(["'])([^"']+\/[^"']+|\.{1,2})\/?(["'])/g,
    (matched, control, q1, from, q2) =>
      `${control}${q1}${resolveDependency(
        filename,
        from,
        filenames,
        cwd,
      )}${q2}`,
  )

export const fixDirnameVar = (contents: string, isSource?: boolean): string =>
  contents.replace(
    /__dirname/g,
    `/file:\\/{2,3}(.+)\\/[^/]/.exec(import.meta.url)${isSource ? '!' : ''}[1]`,
  ) // eslint-disable-line

export const fixFilenameVar = (contents: string, isSource?: boolean): string =>
  contents.replace(/__filename/g, `/file:\\/{2,3}(.+)/.exec(import.meta.url)${isSource ? '!' : ''}[1]`) // eslint-disable-line

export const fixDefaultExport = (contents: string): string => contents.includes('export default')
    ? contents
    : `${contents}
export default undefined
`

export const fixBlankFiles = (contents: string): string => contents.trim().length === 0
    ? `
export {}
export default undefined
` : contents

export const fixSourceMapRef = (contents: string, originName: string, filename: string): string =>
  originName === filename
    ? contents
    :contents.replace(
      `//# sourceMappingURL=${basename(originName)}.map`,
      `//# sourceMappingURL=${basename(filename)}.map`
    )

export const fixContents = (
  contents: string,
  filename: string,
  filenames: string[],
  { cwd, ext, dirnameVar, filenameVar, fillBlank, forceDefaultExport, sourceMap }: IFixOptionsNormalized,
  originName = filename, // NOTE Weird contract to avoid breaking change
  isSource = false,
): string => {
  let _contents = contents

  if (ext) {
    _contents = fixModuleReferences(_contents, filename, filenames, cwd)
  }

  if (dirnameVar) {
    _contents = fixDirnameVar(_contents, isSource)
  }

  if (filenameVar) {
    _contents = fixFilenameVar(_contents, isSource)
  }

  if (fillBlank) {
    _contents = fixBlankFiles(_contents)
  }

  if (forceDefaultExport) {
    _contents = fixDefaultExport(_contents)
  }

  if (sourceMap) {
    _contents = fixSourceMapRef(_contents, originName, filename)
  }

  return _contents
}

const getExtModulesWithPkgJsonExports = (cwd: string): Promise<string[]> =>
  globby(['node_modules/*/package.json'], {
    cwd,
    onlyFiles: true,
    absolute: true,
  } as GlobbyOptions).then((files: string[]) =>
    files
      .filter((f: string) => readJson(f).exports)
      .map((f: string) => basename(dirname(f))),
  )

const getExtModules = async (cwd: string): Promise<string[]> =>
  globby(
    [
      'node_modules/**/*.(m|c)?js',
      '!node_modules/.cache',
      '!node_modules/.bin',
      '!node_modules/**/node_modules',
      ...(await getExtModulesWithPkgJsonExports(cwd)).map(
        (m: string) => `!node_modules/${m}`,
      ),
    ],
    {
      cwd,
      onlyFiles: true,
      absolute: true,
    } as GlobbyOptions,
  )

export const getPatterns = (sources: string[], targets: string[]): string[] =>
  sources.length > 0
    ? sources.map((src) => src.includes('*') ? src : `${src}/**/*.{ts,tsx}`)
    : targets.map((target) => target.includes('*') ? target : `${target}/**/*.{js,d.ts}`)

export const fix = async (opts?: IFixOptions): Promise<void> => {
  const _opts = normalizeOptions(opts)
  const { cwd, target, src, tsconfig, out = cwd, ext, debug, unlink, sourceMap } = _opts
  const outDir = resolve(cwd, out)
  const sources = asArray<string>(src)
  const targets = [...asArray<string>(target), ...findTargets(tsconfig, cwd)]
  debug('debug:cwd', cwd)
  debug('debug:outdir', outDir)
  debug('debug:sources', sources)
  debug('debug:targets', targets)

  const isSource = sources.length > 0
  const patterns = getPatterns(sources, targets)
  const names = await globby(patterns, {
    cwd,
    onlyFiles: true,
    absolute: true,
  } as GlobbyOptions)
  const externalNames = await getExtModules(cwd)
  debug('debug:external-names', externalNames)

  // NOTE d.ts may refer to .js ext only
  const allJsNames = [...externalNames, ...fixFilenameExtensions(names, '.js')]
  const _names = typeof ext === 'string' ? fixFilenameExtensions(names, ext) : names
  const allNames = [...externalNames, ..._names]
  debug('debug:local-names', _names)

  _names.forEach((name, i) => {
    const all = name.endsWith('.d.ts') ? allJsNames : allNames
    const originName = names[i]
    const nextName = (sources.length === 0 ? name : originName).replace(
      unixify(cwd),
      unixify(outDir),
    )
    const contents = read(originName)
    const _contents = fixContents(contents, name, all, _opts, originName, isSource)

    write(nextName, _contents)

    if (sources.length === 0 && unlink && cwd === outDir && nextName !== originName) {
      remove(originName)
    }

    if (sourceMap) {
      patchSourceFile(originName, nextName, unlink && cwd === outDir)
    }
  })
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

  contents.file = basename(nextName)
  write(nextMapfile, JSON.stringify(contents))

  if (unlink) {
    remove(mapfile)
  }
}
