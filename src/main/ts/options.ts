import { IFixOptions, IFixOptionsNormalized } from './interface'
import { asArray, omitUndefinedKeys } from './util'

export const JS_EXT = ['.js', '.jsx', '.mjs', '.mjsx', '.cjs', '.cjsx']
export const TS_EXT = ['.ts', '.tsx', '.mts', '.mtsx', '.cts', '.ctsx']

export const DEFAULT_FIX_OPTIONS: IFixOptionsNormalized = {
  cwd: process.cwd(),
  tsconfig: ['./tsconfig.json'],
  src: [],
  target: [],
  filenameVar: true,
  dirnameVar: true,
  ext: true,
  tsExt: TS_EXT,
  jsExt: JS_EXT,
  unlink: true,
  debug: () => {}, // eslint-disable-line
}

export const normalizeOptions = (
  opts: IFixOptions = {},
): IFixOptionsNormalized => ({
  ...DEFAULT_FIX_OPTIONS,
  ...omitUndefinedKeys(opts),
  tsconfig: opts.tsconfig ? asArray(opts.tsconfig) : DEFAULT_FIX_OPTIONS.tsconfig,
  src: asArray(opts.src),
  target: asArray(opts.target),
  jsExt: typeof opts.jsExt === 'string' ? opts.jsExt.split(',') : opts.jsExt || DEFAULT_FIX_OPTIONS.jsExt,
  tsExt: typeof opts.tsExt === 'string' ? opts.tsExt.split(',') : opts.tsExt || DEFAULT_FIX_OPTIONS.tsExt,
  debug: typeof opts.debug === 'function'
    ? opts.debug
    : opts.debug === true
      ? console.log
      : DEFAULT_FIX_OPTIONS.debug,
})
