import { Options as GlobbyOptions } from 'globby'
import { basename, dirname, resolve } from 'node:path'

import { IFixOptions, IFixOptionsNormalized } from './interface'
import {
  asArray,
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
  names.map((name) => name.replace(/\.[^./\\]+$/, ext))

export const fixModuleReferences = (
  contents: string,
  filename: string,
  filenames: string[],
  cwd: string,
): string =>
  contents.replace(
    /(\sfrom\s|[\s(](?:import|require)[ (])(["'])([^"']+\/[^"']+)(["'])/g,
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

export const fixBlankFiles = (contents: string): string => contents.trim().length === 0
  ? `
export {}
export default undefined
` : contents

export const fixContents = (
  contents: string,
  filename: string,
  filenames: string[],
  { cwd, ext, dirnameVar, filenameVar, fillBlank }: IFixOptionsNormalized,
): string => {
  let _contents = contents

  if (ext) {
    _contents = fixModuleReferences(_contents, filename, filenames, cwd)
  }

  if (dirnameVar) {
    _contents = fixDirnameVar(_contents)
  }

  if (filenameVar) {
    _contents = fixFilenameVar(_contents)
  }

  if (fillBlank) {
    _contents = fixBlankFiles(_contents)
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

export const fix = async (opts?: IFixOptions): Promise<void> => {
  const _opts = normalizeOptions(opts)
  const { cwd, target, src, tsconfig, out = cwd, ext, debug, unlink } = _opts
  const outDir = resolve(cwd, out)
  const sources = asArray<string>(src)
  const targets = [...asArray<string>(target), ...findTargets(tsconfig, cwd)]
  debug('debug:cwd', cwd)
  debug('debug:outdir', outDir)
  debug('debug:sources', sources)
  debug('debug:targets', targets)

  const patterns =
    sources.length > 0
      ? sources.map((src) => `${src}/**/*.ts`)
      : targets.map((target) => `${target}/**/*.js`)

  const names = await globby(patterns, {
    cwd,
    onlyFiles: true,
    absolute: true,
  } as GlobbyOptions)
  const externalNames = await getExtModules(cwd)
  debug('debug:external-names', externalNames)

  const _names =
    typeof ext === 'string' ? fixFilenameExtensions(names, ext) : names
  debug('debug:local-names', _names)

  const allNames = [...externalNames, ..._names]
  _names.forEach((name, i) => {
    const nextName = (!src ? name : names[i]).replace(
      unixify(cwd),
      unixify(outDir),
    )
    const contents = read(names[i])
    const _contents = fixContents(contents, name, allNames, _opts)

    write(nextName, _contents)

    if (!src && unlink && cwd === outDir && nextName !== names[i]) {
      remove(names[i])
    }
  })
}
