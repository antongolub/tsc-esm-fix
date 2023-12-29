import {basename} from 'node:path'
import {TFixer} from '../interface'

export const fixSourceMapRef: TFixer = (ctx) => {
  const { contents, originName, filename} = ctx
  const _contents =
    originName === filename
      ? contents
      : contents.replace(
        `//# sourceMappingURL=${basename(originName)}.map`,
        `//# sourceMappingURL=${basename(filename)}.map`
      )

  return {...ctx, contents: _contents}
}
