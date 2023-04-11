import {basename, dirname, join,resolve} from 'node:path'

import {Options as GlobbyOptions} from 'globby'

import {IFixOptions, IFixOptionsNormalized} from './interface'
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
  ignore: string[],
): string =>
  contents.replace(
    /(\sfrom\s|[\s(:[](?:import|require)[ (])(["'])([^"']+\/[^"']+|\.{1,2})\/?(["'])/g,
    (matched, control, q1, from, q2) =>
      `${control}${q1}${ignore.includes(from) ? from : resolveDependency(
        filename,
        from,
        filenames,
        cwd,
      )}${q2}`,
  )

export const fixDirnameVar = (contents: string, isSource?: boolean): string =>
  contents.replace(
    /__dirname/g,
    `\`\${process.platform === 'win32' ? '' : '/'}\${/file:\\/{2,3}(.+)\\/[^/]/.exec(import.meta.url)${isSource ? '!' : ''}[1]}\``,
  ) // eslint-disable-line

export const fixFilenameVar = (contents: string, isSource?: boolean): string =>
  contents.replace(/__filename/g, `\`\${process.platform === 'win32' ? '' : '/'}\${/file:\\/{2,3}(.+)/.exec(import.meta.url)${isSource ? '!' : ''}[1]}\``) // eslint-disable-line

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
    : contents.replace(
      `//# sourceMappingURL=${basename(originName)}.map`,
      `//# sourceMappingURL=${basename(filename)}.map`
    )

export const fixContents = (
  contents: string,
  filename: string,
  filenames: string[],
  {cwd, ext, dirnameVar, filenameVar, fillBlank, forceDefaultExport, sourceMap}: IFixOptionsNormalized,
  originName = filename, // NOTE Weird contract to avoid breaking change
  isSource = false,
  ignore: string[] = [],
): string => {
  let _contents = contents

  if (ext) {
    _contents = fixModuleReferences(_contents, filename, filenames, cwd, ignore)
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

const resolvePrefix = (prefix: string, pattern?: string): string => {
  if (!pattern) {
    return prefix
  }

  let _pattern = pattern

  if (_pattern.includes('*')) {
    _pattern = _pattern.slice(0, _pattern.indexOf('*'))

    if (_pattern.includes('/')) {
      _pattern = _pattern.slice(0, _pattern.lastIndexOf('/'))
    }
  }

  return join(prefix, _pattern)
}

// https://nodejs.org/api/packages.html
// https://webpack.js.org/guides/package-exports/
type Entry = string | string[] | Record<string, string | string[] | Record<string, string | string[]>>

const getExportsEntries = (exports: string | Entry): [string, string[]][] => {
  const entries: [string, Entry][] = Object.entries(exports)
  const parseConditional = (e: Entry): string[] => typeof e === 'string' ? [e] : Object.values(e).map(parseConditional).flat(2)

  // has subpaths
  if (typeof exports !== 'string' && Object.keys(exports).some((k) => k.startsWith('.'))) {
    return entries.map(([k, v]) => [k, parseConditional(v)])
  }

  return [['.', parseConditional(exports)]]
}

const getExternalEsmModules = (cwd: string): Promise<{ names: string[], files: string[] }> =>
  globby(['node_modules/*/package.json', 'node_modules/@*/*/package.json'], {
    cwd,
    onlyFiles: true,
    absolute: true,
  } as GlobbyOptions).then(async (files: string[]) =>
    (await Promise.all(files
      .map(async (f: string): Promise<{ name?: string, files?: string[] }> => {
        const {name, exports} = await readJson(f)

        if (!exports) {
          return {}
        }

        const _dir = dirname(f)
        const exportsEntries = getExportsEntries(exports)

        return {
          name,
          files: (await Promise.all(exportsEntries.map(([key, values]) =>

            Promise.all(values.map(async(value) =>
              (await globby(value, {cwd: _dir, onlyFiles: true, absolute: false}))
                .map(file => join(file)
                  .replace(
                    resolvePrefix('.', value),
                    resolvePrefix(name, key)))
            )

          )))).flat(2)
        }

      }))).reduce<{ names: string[], files: string[] }>((m, {name, files: _files}) => {
      if (name) {
        m.names.push(name)
      }

      if (_files) {
        m.files.push(..._files)
      }

      return m
    }, {names: [], files: []}),
  )

const getExternalModules = async (cwd: string): Promise<{cjsModules: string[], esmModules: string[] }> => {
  const {names, files: esmModules} = await getExternalEsmModules(cwd)
  const cjsModules = await globby(
    [
      '!node_modules/.cache',
      '!node_modules/.bin',
      '!node_modules/**/node_modules',
      ...names.map(m => `!node_modules/${m}`),
      'node_modules/**/*.(m|c)?js',
    ],
    {
      cwd,
      onlyFiles: true,
      absolute: true,
    } as GlobbyOptions,
  )

  return {
    cjsModules,
    esmModules,
  }
}

export const getPatterns = (sources: string[], targets: string[]): string[] =>
  sources.length > 0
    ? sources.map((src) => src.includes('*') ? src : `${src}/**/*.{ts,tsx}`)
    : targets.map((target) => target.includes('*') ? target : `${target}/**/*.{js,d.ts}`)

export const fix = async (opts?: IFixOptions): Promise<void> => {
  const _opts = normalizeOptions(opts)
  const {cwd, target, src, tsconfig, out = cwd, ext, debug, unlink, sourceMap} = _opts
  const outDir = resolve(cwd, out)
  const sources = asArray<string>(src)
  const targets = [...asArray<string>(target), ...findTargets(tsconfig, cwd)]
  debug('debug:cwd', cwd)
  debug('debug:outdir', outDir)
  debug('debug:sources', sources)
  debug('debug:targets', targets)

  const isSource = sources.length > 0
  const patterns = getPatterns(sources, targets)
  const localModules = await globby(patterns, {
    cwd,
    onlyFiles: true,
    absolute: true,
  } as GlobbyOptions)
  const {
    cjsModules,
    esmModules
  } = await getExternalModules(cwd)
  debug('debug:external-cjs-modules', cjsModules)
  debug('debug:external-esm-modules', esmModules)

  const _localModules = typeof ext === 'string' ? fixFilenameExtensions(localModules, ext) : localModules
  const allModules = [...cjsModules, ..._localModules]
  const allJsModules = [...cjsModules, ...fixFilenameExtensions(localModules, '.js')]
  debug('debug:local-modules', _localModules)

  _localModules.forEach((name, i) => {
    // NOTE d.ts may refer to .js ext only
    const all = name.endsWith('.d.ts') ? allJsModules : allModules
    const originName = localModules[i]
    const nextName = (sources.length === 0 ? name : originName).replace(
      unixify(cwd),
      unixify(outDir),
    )
    const contents = read(originName)
    const _contents = fixContents(contents, name, all, _opts, originName, isSource, esmModules)

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
