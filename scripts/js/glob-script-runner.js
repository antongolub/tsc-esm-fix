import fs from 'fs'
import { globbySync }from 'globby'
import process from 'process'
import semver from 'semver'
import url from 'url'

const nodeVersion = process.version
const argv = process.argv.slice(2)
const tests = globbySync(argv, {
  cwd: process.cwd(),
  onlyFiles: true,
  absolute: true,
})

const engineDirectiveRe = /^\/\/\s*node-engine\s+(.+)\n/

tests.reduce((r, module) =>
  r.then(() =>
    fs.promises.readFile(module, {encoding: 'utf8'}).then(c => {
      const engineDirective = (engineDirectiveRe.exec(c) || [])[1]

      if (engineDirective && !semver.satisfies(nodeVersion, engineDirective)) {
        console.log(`Skipped ${module}. ${nodeVersion} does not satisfy ${engineDirective}`)
        return r
      }

      console.log(`Loading ${module}...`)

      return import(url.pathToFileURL(module))
    })
  )

, Promise.resolve())
  .then(() => console.log('Done'))
