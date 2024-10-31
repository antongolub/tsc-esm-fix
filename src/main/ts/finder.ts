import path from 'node:path'
import {asArray, extToGlob, glob, readJson, resolveTsConfig} from './util'
import {DEFAULT_FIX_OPTIONS} from "./options";

type TPackageExports = [string, string[]][]

type TPackageEntry = {
  name: string
  root: string
  manifest: any
  main?: string
  exports: TPackageExports
  type?: string
}

export const getTsconfigTargets = (
  tsconfig: string | string[],
  cwd: string,
): string[] =>
  asArray(tsconfig).reduce<string[]>((targets, file) => {
    const tsconfigJson = resolveTsConfig(path.resolve(cwd, file))
    const outDir = tsconfigJson?.compilerOptions?.outDir
    const module = tsconfigJson?.compilerOptions?.module.toLowerCase?.()

    if (outDir && module.startsWith('es')) {
      targets.push(outDir)
    } else {
      console.warn('tsconfig should declare `outDir` and `module` type es6 or above')
    }

    return targets
  }, [])

export const getLocalModules = (sources: string[], targets: string[], cwd: string, tsExt: string[] = DEFAULT_FIX_OPTIONS.tsExt) => glob(
  getPatterns(sources, targets, tsExt),
  {
    cwd,
    onlyFiles: true,
    absolute: true,
  })

export const getExternalModules = async (cwd: string, jsExt: string[] = DEFAULT_FIX_OPTIONS.jsExt): Promise<{exportedModules: string[], anyModules: string[], allPackageNames: string[] }> => {
  const allPackages = await getExternalPackages(cwd)
  const allPackageNames = allPackages.map(p => p.name)
  const exportedModules = (await Promise.all(allPackages.map(getPackageEntryPoints))).flat()
  const anyModules = await getAllModules(cwd, jsExt)

  return {
    exportedModules,
    anyModules,
    allPackageNames,
  }
}

const getAllModules = async (cwd: string, jsExt: string[] = DEFAULT_FIX_OPTIONS.jsExt): Promise<string[]> => glob(
  [
    '!node_modules/.cache',
    '!node_modules/.bin',
    '!node_modules/**/node_modules',
    `node_modules/${extToGlob(jsExt)}`,
  ],
  {
    cwd,
    onlyFiles: true,
    absolute: true,
  },
)

const getPatterns = (sources: string[], targets: string[], tsExt: string[]): string[] =>
  sources.length > 0
    ? sources.map((src) => src.includes('*') ? src : `${src}/${extToGlob(tsExt)}`)
    : targets.map((target) => target.includes('*') ? target : `${target}/**/*.{js,d.ts}`)

// https://nodejs.org/api/packages.html
// https://webpack.js.org/guides/package-exports/
type Entry = string | string[] | Record<string, string | string[] | Record<string, string | string[]>>

export const parseConditional = (e: Entry): string[] => e
  ? typeof e === 'string'
    ? [e]
    : Object.values(e).map(parseConditional).flat(2)
  : []

export const getExportsEntries = (exports: string | Entry): [string, string[]][] => {
  if (!exports) {
    return []
  }

  // has subpaths
  if (Object.keys(exports).some((k) => k.startsWith('.'))) {
    const entries: [string, Entry][] = Object.entries(exports)
    return entries.map(([k, v]) => [k, parseConditional(v)])
  }

  return [['.', parseConditional(exports)]]
}

const getExternalPackages = async (cwd: string): Promise<TPackageEntry[]> =>
  glob(['node_modules/*/package.json', 'node_modules/@*/*/package.json'], {
    cwd,
    onlyFiles: true,
    absolute: true,
  })
    .then(async (files: string[]) => Promise.all(files.map(async file => {
      const manifest = await readJson(file)
      const root = path.dirname(file)
      const exports = getExportsEntries(manifest.exports)

      return {
        name: manifest.name,
        type: manifest.type,
        main: manifest.main,
        manifest,
        file,
        root,
        exports
      }
    })))

const getPackageEntryPoints = async ({name, exports, root, main}: TPackageEntry): Promise<string[]> =>
  (await Promise.all(exports.map(([key, values]) =>
    Promise.all(values.map(async(value) =>
        (await glob(value, {cwd: root, onlyFiles: true, absolute: false}))
          .map(file => path.join(file)
            .replace(
              resolvePrefix('.', value),
              resolvePrefix(name, key)))
      )
    )))).flat(2)

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

  return path.join(prefix, _pattern)
}
