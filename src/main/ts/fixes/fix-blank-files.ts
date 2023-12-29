import {TFixer} from '../interface'

export const fixBlankFiles: TFixer = (ctx) => {
  const {contents} = ctx
  const _contents = contents.trim().length === 0
    ? `
export {}
export default undefined
`   : contents

  return {...ctx, contents: _contents}
}
