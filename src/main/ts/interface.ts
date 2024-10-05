type IFunction<A extends any[] = any[], R = any> = (...args: A) => R

export type IFixOptionsNormalized = {
  cwd:          string
  debug:        IFunction
  out?:         string
  src :         string[]
  target:       string[]
  tsconfig:     string | string[]
  dirnameVar:   boolean
  filenameVar:  boolean
  fillBlank?:   boolean
  forceDefaultExport?:  boolean
  sourceMap?:   boolean
  ext:          boolean | string
  tsExt:        string[]
  jsExt:        string[]
  unlink?:      boolean
}

export type TSConfig = {
  extends?: string
  compilerOptions?: Record<string, any>
}

export type IFixOptions = Partial<Omit<IFixOptionsNormalized, 'debug'>>& {
  debug?: boolean | IFunction
  src?:   string | string[]
  target?:string | string[]
  tsExt?: string | string[]
  jsExt?: string | string[]
}

export type TFixContext = {
  outDir:         string
  isSource:       boolean
  ignore:         string[]
  allJsModules:   string[]
  allModules:     string[]
  _localModules:  string[]
  localModules:   string[]
  options:        IFixOptionsNormalized
}

export type TResourceContext = {
  contents:   string
  filename:   string
  filenames:  string[]
  originName: string
  nextName:   string
  isSource:   boolean
  ignore:     string[]
  options:    IFixOptionsNormalized
}

export type TFixer = (ctx: TResourceContext) => TResourceContext
