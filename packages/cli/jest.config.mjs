// module.exports = {...require('../infra/jest.config.json')}

import {dirname, resolve} from 'node:path'
import {fileURLToPath} from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default { ...(await import(resolve(__dirname, '../infra/jest.config.json'))).default}
