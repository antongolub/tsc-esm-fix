import path from 'node:path'
import {TFixer} from '../interface'

export const fixSourceMapRef: TFixer = (ctx) => {
  const { contents, originName, filename} = ctx
  const _contents =
    originName === filename
      ? contents
      : contents.replace(
        `//# sourceMappingURL=${path.basename(originName)}.map`,
        `//# sourceMappingURL=${path.basename(filename)}.map`
      )

  return {...ctx, contents: _contents}
}
