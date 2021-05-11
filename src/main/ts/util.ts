import { readFileSync, unlinkSync } from 'fs'
import { default as fse } from 'fs-extra' // eslint-disable-line

export const read = (file: string): string =>
  readFileSync(file, { encoding: 'utf8' })

export const write = (file: string, contents: string): void =>
  fse.outputFileSync(file, contents, { encoding: 'utf8' })

export const readJson = <D = any>(file: string): D => JSON.parse(read(file))

export const asArray = <T>(value: T): T extends any[] ? T : T[] =>
  (Array.isArray(value) ? value : [value]) as T extends any[] ? T : T[]

export const unlink = unlinkSync

export const unixify = (path: string): string => path.replace(/\\/g, '/')
