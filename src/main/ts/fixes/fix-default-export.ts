import {TFixer} from '../interface'

export const fixDefaultExport: TFixer = (ctx) => {
  const {contents} = ctx
  const _contents = contents.includes('export default')
    ? contents
    : `${contents}
export default undefined
`
  return {...ctx, contents: _contents}
}
