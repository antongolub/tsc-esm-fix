import { IFixOptionsNormalized, TResourceContext } from './interface'
import {
  fixBlankFiles as _fixBlankFiles,
  fixContents as _fixContents,
  fixDefaultExport as _fixDefaultExport,
  fixDirnameVar as _fixDirnameVar,
  fixFilenameVar as _fixFilenameVar,
  fixModuleReferences as _fixModuleReferences,
  fixSourceMapRef as _fixSourceMapRef,
} from './fixes'
import {DEFAULT_FIX_OPTIONS} from './options'

export const fixModuleReferences = (
  contents: string,
  filename: string,
  filenames: string[],
  cwd: string,
  ignore: string[],
): string =>
  _fixModuleReferences({
    contents,
    filename,
    filenames,
    options: {
      cwd,
      tsExt: DEFAULT_FIX_OPTIONS.tsExt,
      jsExt: DEFAULT_FIX_OPTIONS.jsExt,
    },
    ignore
  } as TResourceContext).contents

export const fixDirnameVar = (contents: string, isSource?: boolean): string =>
  _fixDirnameVar({contents, isSource} as TResourceContext).contents

export const fixFilenameVar = (contents: string, isSource?: boolean): string =>
  _fixFilenameVar({contents, isSource} as TResourceContext).contents

export const fixDefaultExport = (contents: string): string =>
  _fixDefaultExport({contents} as TResourceContext).contents

export const fixBlankFiles = (contents: string): string =>
  _fixBlankFiles({contents} as TResourceContext).contents

export const fixSourceMapRef = (contents: string, originName: string, filename: string): string =>
  _fixSourceMapRef({contents, originName, filename} as TResourceContext).contents

export const fixContents = (
  contents: string,
  filename: string,
  filenames: string[],
  options: IFixOptionsNormalized,
  originName = filename, // NOTE Weird contract to avoid breaking change
  isSource = false,
  ignore: string[] = [],
): string =>
  _fixContents({contents, filename, filenames, options, originName, isSource, ignore} as TResourceContext).contents
