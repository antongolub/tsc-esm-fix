export interface IFixOptionsNormalized {
  cwd: string
  tsconfig: string | string[]
  dirnameVar: boolean
  filenameVar: boolean
  relativeModuleExt: boolean | string
}

export type IFixOptions = Partial<IFixOptionsNormalized>
