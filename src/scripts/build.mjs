#!/usr/bin/env node

import esbuild from 'esbuild'
import { nodeExternalsPlugin } from 'esbuild-node-externals'
import { entryChunksPlugin } from 'esbuild-plugin-entry-chunks'
import { extractHelpersPlugin } from 'esbuild-plugin-extract-helpers'
import minimist from 'minimist'
import glob from 'fast-glob'

const argv = minimist(process.argv.slice(2), {
  default: {
    entry:      './src/main/ts/index.ts',
    external:   'node:*',
    bundle:     'src', // 'all' | 'none'
    license:    'eof',
    minify:     false,
    sourcemap:  false,
    format:     'cjs,esm',
    cwd:        process.cwd()
  },
  boolean: ['minify', 'sourcemap', 'banner'],
  string: ['entry', 'external', 'bundle', 'license', 'format', 'map', 'cwd']
})
const { entry, external, bundle, minify, sourcemap, license, format, cwd: _cwd } = argv

const plugins = []
const cwd = Array.isArray(_cwd) ? _cwd[_cwd.length - 1] : _cwd
const entryPoints = entry.includes('*')
  ? await glob(entry.split(':'), { absolute: false, onlyFiles: true, cwd })
  : entry.split(':')

const _bundle = bundle !== 'none' && !process.argv.includes('--no-bundle')
const _external = _bundle
  ? external.split(',')
  : undefined  // https://github.com/evanw/esbuild/issues/1466

if (_bundle && entryPoints.length > 1) {
  plugins.push(entryChunksPlugin())
}

if (bundle === 'src') {
  // https://github.com/evanw/esbuild/issues/619
  // https://github.com/pradel/esbuild-node-externals/pull/52
  plugins.push(nodeExternalsPlugin())
}

plugins.push(extractHelpersPlugin({
  cwd: 'target/cjs',
  include: /\.cjs/,
}),)

const formats = format.split(',')
const banner = argv.banner && bundle === 'all'
  ? {
    js: `
const require = (await import("node:module")).createRequire(import.meta.url);
const __filename = (await import("node:url")).fileURLToPath(import.meta.url);
const __dirname = (await import("node:path")).dirname(__filename);
`
  }
  : {}


const esmConfig = {
  absWorkingDir: cwd,
  entryPoints,
  outdir: './target/esm',
  bundle: _bundle,
  external: _external,
  minify,
  sourcemap,
  sourcesContent: false,
  platform: 'node',
  target: 'esnext',
  format: 'esm',
  outExtension: {
    '.js': '.mjs'
  },
  plugins,
  legalComments: license,
  tsconfig: './tsconfig.json',
  //https://github.com/evanw/esbuild/issues/1921
  banner
}

const cjsConfig = {
  ...esmConfig,
  outdir: './target/cjs',
  target: 'es6',
  format: 'cjs',
  banner: {},
  outExtension: {
    '.js': '.cjs'
  }
}

for (const format of formats) {
  const config = format === 'cjs' ? cjsConfig : esmConfig

  await esbuild
    .build(config)
    .catch(() => process.exit(1))
}

process.exit(0)