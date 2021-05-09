export interface IFixOptionsNormalized {
  cwd: string
  out?: string,
  target?: string | string[]
  tsconfig: string | string[]
  dirnameVar: boolean
  filenameVar: boolean
  relativeModuleExt: boolean | string
}

export type IFixOptions = Partial<IFixOptionsNormalized>
