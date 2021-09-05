import { globbySync } from 'globby'
import process from 'node:process'

const argv = process.argv.slice(2)
const tests = globbySync(argv, {
  cwd: process.cwd(),
  onlyFiles: true,
  absolute: true,
})

await tests.reduce(async (r, module) => {
  await r
  console.log(`Loading ${module}...`)
  return import(module)
}, Promise.resolve())

console.log('Done')
