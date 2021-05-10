import {readFileSync} from 'fs'
import {outputFileSync} from 'fs-extra'

export const read = (file: string): string => readFileSync(file, { encoding: 'utf8' })

export const write = (file: string, contents: string): void => outputFileSync(file, contents, { encoding: 'utf8' })

export const readJson = <D = any>(file: string): D => JSON.parse(read(file))

export const asArray = <T>(value: T): T extends any[] ? T : T[] => (Array.isArray(value) ? value: [value]) as T extends any[] ? T : T[]
