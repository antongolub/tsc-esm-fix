import {IFixOptions, IFixOptionsNormalized} from "./interface";

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
