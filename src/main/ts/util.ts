import {readFileSync} from 'fs'

export const read = (file: string): string => readFileSync(file, { encoding: 'utf8' })

export const readJson = <D = any>(file: string): D => JSON.parse(read(file))

export const asArray = <T>(value: T): T extends any[] ? T : T[] => (Array.isArray(value) ? value: [value]) as T extends any[] ? T : T[]
