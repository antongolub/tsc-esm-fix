// node-engine ^12.20.0 || ^14.13.1 || >=16.0.0
import assert from 'assert' // eslint-disable-line unicorn/prefer-node-protocol

import { fix } from '../../../target/esm/index.mjs'

assert(typeof fix === 'function', 'fix API is properly exported')
