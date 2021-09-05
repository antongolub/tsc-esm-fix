import assert from 'node:assert'

import { fix } from '../../../target/es6/index.mjs'

assert(typeof fix === 'function', 'fix API is properly exported')
