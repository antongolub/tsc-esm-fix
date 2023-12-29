import {TFixer} from '../interface'

export const fixDirnameVar: TFixer = (ctx) => {
  const {contents, isSource} = ctx
  const _contents = contents.replace(
    /__dirname/g,
    `\`\${process.platform === 'win32' ? '' : '/'}\${/file:\\/{2,3}(.+)\\/[^/]/.exec(import.meta.url)${isSource ? '!' : ''}[1]}\`` // eslint-disable-line
  )

  return {...ctx, contents: _contents}
}

export const fixFilenameVar: TFixer = (ctx) => {
  const {contents, isSource} = ctx
  const _contents = contents
    .replace(
      /__filename/g,
      `\`\${process.platform === 'win32' ? '' : '/'}\${/file:\\/{2,3}(.+)/.exec(import.meta.url)${isSource ? '!' : ''}[1]}\`` // eslint-disable-line
    )
  return {...ctx, contents: _contents}
}
