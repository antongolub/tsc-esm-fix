export type IFixOptionsNormalized = {
  cwd: string
  debug?: boolean
  out?: string
  target?: string | string[]
  tsconfig: string | string[]
  dirnameVar: boolean
  filenameVar: boolean
  ext: boolean | string
}

export type TSConfig = {
  extends?: string
  compilerOptions?: Record<string, any>
}

export type IFixOptions = Partial<IFixOptionsNormalized>
