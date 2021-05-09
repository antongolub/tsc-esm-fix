import {readFileSync as read} from 'fs'

export const readJson = <D = any>(file: string): D => JSON.parse(read(file, { encoding: 'utf8' }))

export const asArray = <T>(value: T): T extends any[] ? T : T[] => (Array.isArray(value) ? value: [value]) as T extends any[] ? T : T[]
