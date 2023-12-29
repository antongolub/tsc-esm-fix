import { dirname, join, resolve } from 'node:path'
import { asArray, globby, readJson, resolveTsConfig } from './util'
import { Options as GlobbyOptions } from 'globby'

export const getTsconfigTargets = (
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

export const getLocalModules = (sources: string[], targets: string[], cwd: string) => globby(
  getPatterns(sources, targets),
  {
    cwd,
    onlyFiles: true,
    absolute: true,
  } as GlobbyOptions)

export const getExternalModules = async (cwd: string): Promise<{cjsModules: string[], esmModules: string[], allPackages: string[] }> => {
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
    allPackages: names,
  }
}

const getPatterns = (sources: string[], targets: string[]): string[] =>
  sources.length > 0
    ? sources.map((src) => src.includes('*') ? src : `${src}/**/*.{ts,tsx}`)
    : targets.map((target) => target.includes('*') ? target : `${target}/**/*.{js,d.ts}`)

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
          return {name}
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
