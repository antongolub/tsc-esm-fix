import {TFixer} from '../interface'

import { fixBlankFiles } from './fix-blank-files'
import { fixDefaultExport } from './fix-default-export'
import { fixDirnameVar, fixFilenameVar } from './fix-dirname-var'
import { fixModuleReferences } from './fix-module-ref'
import { fixSourceMapRef } from './fix-sourcemap-ref'

export { fixBlankFiles } from './fix-blank-files'
export { fixFilenameVar, fixDirnameVar } from './fix-dirname-var'
export { fixModuleReferences } from './fix-module-ref'
export { fixSourceMapRef } from './fix-sourcemap-ref'
export { fixDefaultExport } from './fix-default-export'

export const fixContents: TFixer = (
  ctx
) => {
  const {options} = ctx

  let _ctx = ctx

  if (options.ext) _ctx = fixModuleReferences(_ctx)

  if (options.dirnameVar) _ctx = fixDirnameVar(_ctx)

  if (options.filenameVar) _ctx = fixFilenameVar(_ctx)

  if (options.fillBlank) _ctx = fixBlankFiles(_ctx)

  if (options.forceDefaultExport) _ctx = fixDefaultExport(_ctx)

  if (options.sourceMap) _ctx = fixSourceMapRef(_ctx)

  return _ctx
}
