import { dirname, resolve } from 'node:path'

import fse from 'fs-extra'
import json5 from 'json5'

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

export const resolveTsConfig = (file: string): TSConfig => {
  const data = readJson<TSConfig>(file)

  if (data.extends) {
    const parent = resolveTsConfig(resolve(dirname(file), data.extends))

    return {
      ...parent,
      ...data,
      compilerOptions: { ...parent.compilerOptions, ...data.compilerOptions },
    }
  }

  return data
}

export const omitUndefinedKeys = <T extends Record<string, any>>(obj: T): T  =>
  Object.fromEntries(Object.entries(obj).filter(([, value]) => value !== undefined)) as T

export const extToGlob = (ext: string[]): string => `**/*.{${ext.map(e => e.slice(1)).join(',')}}`
