import { foo } from './foo'

import './bar'

export { e1 } from 'e1/a/b/c'

export { e2 } from 'e2'

export { e2 as es3 } from 'e2/index'

export * from './foo'

export * from './baz'

export * from './q/u/x'

export const foobaz = foo + 'baz'

export const dirname = __dirname

export const filename = __filename
