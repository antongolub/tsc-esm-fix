type IFunction<A extends any[] = any[], R = any> = (...args: A) => R

export type IFixOptionsNormalized = {
  cwd: string
  debug: IFunction
  out?: string
  src?: string | string[]
  target?: string | string[]
  tsconfig: string | string[]
  dirnameVar: boolean
  filenameVar: boolean
  fillBlank?: boolean
  sourceMap?: boolean
  forceDefaultExport?: boolean
  ext: boolean | string
  unlink?: boolean
}

export type TSConfig = {
  extends?: string
  compilerOptions?: Record<string, any>
}

export type IFixOptions = Partial<Omit<IFixOptionsNormalized, 'debug'>> & {debug?: boolean | IFunction}
