import fse from 'fs-extra'
import json5 from 'json5'
import { populateSync } from '@topoconfig/extends'

import { TSConfig } from './interface'

export { default as glob } from 'fast-glob'

export { existsSync } from 'node:fs'

export const read = (file: string): string =>
  fse.readFileSync(file, { encoding: 'utf8' })

export const write = (file: string, contents: string): void =>
  fse.outputFileSync(file, contents, { encoding: 'utf8' })

export const readJson = <D = any>(file: string): D => json5.parse(read(file))

export const asArray = <T>(value: T[] | T | undefined): T[] =>
  value ? (Array.isArray(value) ? value : [value]) : []

export const remove = fse.unlinkSync

export const unixify = (path: string): string => path.replace(/\\/g, '/')

export const resolveTsConfig = (file: string): TSConfig => populateSync(file, {
  parse({contents, ext}) {
    if (ext === '.json')
      return json5.parse(contents)
    throw new Error(`Unsupported format: ${ext}`)
  },
  rules: {
    compilerOptions: 'merge'
  }
})

export const omitUndefinedKeys = <T extends Record<string, any>>(obj: T): T  =>
  Object.fromEntries(Object.entries(obj).filter(([, value]) => value !== undefined)) as T

export const extToGlob = (ext: string[]): string => `**/*.{${ext.map(e => e.slice(1)).join(',')}}`
