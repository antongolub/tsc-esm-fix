export interface IFixOptionsNormalized {
  cwd: string
  out?: string,
  target?: string | string[]
  tsconfig: string | string[]
  dirnameVar: boolean
  filenameVar: boolean
  ext: boolean | string
}

export type IFixOptions = Partial<IFixOptionsNormalized>
