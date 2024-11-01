## [3.1.2](https://github.com/antongolub/tsc-esm-fix/compare/v3.1.1...v3.1.2) (2024-11-01)

### Fixes & improvements
* fix: reenable json5 parser ([4dadb65](https://github.com/antongolub/tsc-esm-fix/commit/4dadb652dab07564a32fa6ecc928634dfc05d22c))

## [3.1.1](https://github.com/antongolub/tsc-esm-fix/compare/v3.1.0...v3.1.1) (2024-10-31)

### Fixes & improvements
* fix: replace custom tsConfig resolver with xtends ([9ef4877](https://github.com/antongolub/tsc-esm-fix/commit/9ef487791dc4646398f7faa3212e2879dc9387e9))

## [3.1.0](https://github.com/antongolub/tsc-esm-fix/compare/v3.0.2...v3.1.0) (2024-10-05)

### Fixes & improvements
* docs: mention `jsExt` and `tsExt` options ([b0fd156](https://github.com/antongolub/tsc-esm-fix/commit/b0fd156a5037b283c547d70dc26d43a719eb77af))

### Features
* feat: allow configure `js` and `ts` extensions lists ([938320f](https://github.com/antongolub/tsc-esm-fix/commit/938320f893806f9469940922acaeb0341fccb972))

## [3.0.2](https://github.com/antongolub/tsc-esm-fix/compare/v3.0.1...v3.0.2) (2024-08-05)

### Fixes & improvements
* fix: `target` opt should override tsconfig specified defaults ([b365c46](https://github.com/antongolub/tsc-esm-fix/commit/b365c466f012f470e1ee84dc9f5b14beed1dba60))

## [3.0.1](https://github.com/antongolub/tsc-esm-fix/compare/v3.0.0...v3.0.1) (2024-07-20)

### Fixes & improvements
* fix(cli): omit empty opts ([a76f044](https://github.com/antongolub/tsc-esm-fix/commit/a76f044bfe1845d9cc4f27fa11aac1509dc17a8b))

## [3.0.0](https://github.com/antongolub/tsc-esm-fix/compare/v2.20.27...v3.0.0) (2024-07-13)

### Features
* feat: update node engine range, require v18 ([5881b67](https://github.com/antongolub/tsc-esm-fix/commit/5881b672ba953c6e9910c6a3722f96b9bbf45d4a))

### BREAKING CHANGES
* following deps, require Node.js >= 18 ([5881b67](https://github.com/antongolub/tsc-esm-fix/commit/5881b672ba953c6e9910c6a3722f96b9bbf45d4a))

### Fixes & improvements
* refactor: update bin entry point ([320a756](https://github.com/antongolub/tsc-esm-fix/commit/320a756fe4c6d3d58ec6e2a0329927d928f20cfe))
* refactor: replace meow → type-flag, microbundle → esbuild ([1cc1a1a](https://github.com/antongolub/tsc-esm-fix/commit/1cc1a1a6fb27769c80f32cc6e1f6159b4f2552d1))
* refactor: replace globby with fast-glob ([2c3b91a](https://github.com/antongolub/tsc-esm-fix/commit/2c3b91a2add5975116b1d0f6d3225d5658024568))

## [2.20.27](https://github.com/antongolub/tsc-esm-fix/compare/v2.20.26...v2.20.27) (2024-04-23)

### Fixes & improvements
* fix: handle malformed exports map ([f845eee](https://github.com/antongolub/tsc-esm-fix/commit/f845eee7056c630911a6a029fb5c4313f0ed4df0))

## [2.20.26](https://github.com/antongolub/tsc-esm-fix/compare/v2.20.25...v2.20.26) (2024-02-20)

### Fixes & improvements
* fix(deps): update dependency depseek to ^0.4.0 ([a024fb9](https://github.com/antongolub/tsc-esm-fix/commit/a024fb92e424c96d854193d257d0fa09c95cfebc))

## [2.20.25](https://github.com/antongolub/tsc-esm-fix/compare/v2.20.24...v2.20.25) (2024-02-20)

### Fixes & improvements
* fix(deps): update dependency depseek to ^0.3.0 ([e30d1e2](https://github.com/antongolub/tsc-esm-fix/commit/e30d1e2ee85171595aaeeb1283fe8a1abe03f77f))

## [2.20.24](https://github.com/antongolub/tsc-esm-fix/compare/v2.20.23...v2.20.24) (2024-02-11)

### Fixes & improvements
* perf: up dev deps, repack ([a5c9e18](https://github.com/antongolub/tsc-esm-fix/commit/a5c9e180d5574dd5bdba70bd60ef6dc4433911de))

## [2.20.23](https://github.com/antongolub/tsc-esm-fix/compare/v2.20.22...v2.20.23) (2024-02-05)

### Fixes & improvements
* perf: tech release to fix readme on npm ([2372dad](https://github.com/antongolub/tsc-esm-fix/commit/2372dad0aad131eb1437c759c7e98fae8ab5c89c))

## [2.20.22](https://github.com/antongolub/tsc-esm-fix/compare/v2.20.21...v2.20.22) (2024-01-28)

### Fixes & improvements
* refactor: use depseek patchRefs api ([96c826a](https://github.com/antongolub/tsc-esm-fix/commit/96c826a3354ca6029fb4f44f5f32b5cfb879d9b0))

## [2.20.21](https://github.com/antongolub/tsc-esm-fix/compare/v2.20.20...v2.20.21) (2023-12-31)

### Fixes & improvements
* docs: fix badges urls ([d49c67a](https://github.com/antongolub/tsc-esm-fix/commit/d49c67a2ef98285fa43152c11fc3c297256e6fea))

## [2.20.20](https://github.com/antongolub/tsc-esm-fix/compare/v2.20.19...v2.20.20) (2023-12-31)

### Fixes & improvements
* fix: use depseek to avoid comments and string literals affects ([6f843ca](https://github.com/antongolub/tsc-esm-fix/commit/6f843cafe979a57f23b400c666a240655f953603))

## [2.20.19](https://github.com/antongolub/tsc-esm-fix/compare/v2.20.18...v2.20.19) (2023-12-30)

### Fixes & improvements
* refactor: separate `fix` into `resolve` and `patch` stages ([925346a](https://github.com/antongolub/tsc-esm-fix/commit/925346ac13231ee4486fa28f09ac5c58c8dec391))
* refactor: decompose fix.ts ([9bebde8](https://github.com/antongolub/tsc-esm-fix/commit/9bebde8e165ccfc93cbea0d694bc1d93071bcdc4))

## [2.20.18](https://github.com/antongolub/tsc-esm-fix/compare/v2.20.17...v2.20.18) (2023-12-02)

### Fixes & improvements
* docs: fix CLI usage example (#142) ([43b77f3](https://github.com/antongolub/tsc-esm-fix/commit/43b77f3caaeab922a7cca7764484c446f51dae95))

## [2.20.17](https://github.com/antongolub/tsc-esm-fix/compare/v2.20.16...v2.20.17) (2023-09-19)

### Fixes & improvements
* fix: tech release to push the prev d.ts fix ([88e071d](https://github.com/antongolub/tsc-esm-fix/commit/88e071ddcc6aef65312059c826390180545d43c1))

## [2.20.16](https://github.com/antongolub/tsc-esm-fix/compare/v2.20.15...v2.20.16) (2023-09-18)

### Fixes & improvements
* perf: up deps ([b69d862](https://github.com/antongolub/tsc-esm-fix/commit/b69d8620aeea0b69d7a716420b42b2c6824e09da))
* fix: provide support for shortened import syntax ([53e493b](https://github.com/antongolub/tsc-esm-fix/commit/53e493bc88c52a9b7c6d2d516226158210af7936))

## [2.20.15](https://github.com/antongolub/tsc-esm-fix/compare/v2.20.14...v2.20.15) (2023-08-12)

### Fixes & improvements
* fix: fix nodejs requirement ([4d965ba](https://github.com/antongolub/tsc-esm-fix/commit/4d965bae716e22039e0972b6cb6799f92a8f5e2e))
* fix: let cjs pkg be referenced by its name as a module ([30a7978](https://github.com/antongolub/tsc-esm-fix/commit/30a7978e31d8690b41fc39f73b436b695d8f1210))

## [2.20.14](https://github.com/antongolub/tsc-esm-fix/compare/v2.20.13...v2.20.14) (2023-05-09)


### Performance Improvements

* up deps ([13c0860](https://github.com/antongolub/tsc-esm-fix/commit/13c0860d5e310e6e6fb499aa2d55161d280d81f8))

## [2.20.13](https://github.com/antongolub/tsc-esm-fix/compare/v2.20.12...v2.20.13) (2023-05-02)


### Bug Fixes

* **deps:** update dependency meow to v12 ([96906a9](https://github.com/antongolub/tsc-esm-fix/commit/96906a97e76a8298e257de53ea572975e76d081e))

## [2.20.5](https://github.com/antongolub/tsc-esm-fix/compare/v2.20.4...v2.20.5) (2022-10-11)


### Bug Fixes

* **deps:** update dependency meow to v11 ([1db4e85](https://github.com/antongolub/tsc-esm-fix/commit/1db4e85799108bbdceee4cf506a894399087fe01))

## [2.20.4](https://github.com/antongolub/tsc-esm-fix/compare/v2.20.3...v2.20.4) (2022-08-16)


### Bug Fixes

* handle require in arrays ([d818d5d](https://github.com/antongolub/tsc-esm-fix/commit/d818d5d26cea7d3ee13f95a07154cc6d91e90080))

## [2.20.3](https://github.com/antongolub/tsc-esm-fix/compare/v2.20.2...v2.20.3) (2022-08-15)


### Performance Improvements

* improve `__dirname` and `__filename` subs for ts sources as input ([73c719e](https://github.com/antongolub/tsc-esm-fix/commit/73c719ef79007962a3b030739554cbbefeb74385)), closes [#90](https://github.com/antongolub/tsc-esm-fix/issues/90)

## [2.20.2](https://github.com/antongolub/tsc-esm-fix/compare/v2.20.1...v2.20.2) (2022-08-14)


### Performance Improvements

* make stricter `__dirname` and `__filename` subtitutions ([8459f27](https://github.com/antongolub/tsc-esm-fix/commit/8459f27679c2d2d431916669edbb7b62f7d7c57e)), closes [#90](https://github.com/antongolub/tsc-esm-fix/issues/90)

## [2.20.1](https://github.com/antongolub/tsc-esm-fix/compare/v2.20.0...v2.20.1) (2022-08-14)


### Bug Fixes

* patch `__dirname` subs for windows paths ([8950b3b](https://github.com/antongolub/tsc-esm-fix/commit/8950b3bc41e2ea072cd4e80988e985d4017606b1)), closes [#89](https://github.com/antongolub/tsc-esm-fix/issues/89)

# [2.20.0](https://github.com/antongolub/tsc-esm-fix/compare/v2.19.1...v2.20.0) (2022-07-21)


### Features

* provide sourcemaps processing ([239929c](https://github.com/antongolub/tsc-esm-fix/commit/239929c7a953d18bf8c87aa472a69fc344422739)), closes [#86](https://github.com/antongolub/tsc-esm-fix/issues/86)

## [2.19.1](https://github.com/antongolub/tsc-esm-fix/compare/v2.19.0...v2.19.1) (2022-07-21)


### Bug Fixes

* handle trailing slash refs ([1d9a03e](https://github.com/antongolub/tsc-esm-fix/commit/1d9a03e7585b5d281e62de97940e3984f16f7633)), closes [#87](https://github.com/antongolub/tsc-esm-fix/issues/87)

# [2.19.0](https://github.com/antongolub/tsc-esm-fix/compare/v2.18.0...v2.19.0) (2022-07-19)


### Features

* introdude `forceDefaultExport` directive ([c81b274](https://github.com/antongolub/tsc-esm-fix/commit/c81b274c8ff595183d5d362b86094e5ff515b469))

# [2.18.0](https://github.com/antongolub/tsc-esm-fix/compare/v2.17.3...v2.18.0) (2022-06-06)


### Features

* support custom glob patterns ([eb2905b](https://github.com/antongolub/tsc-esm-fix/commit/eb2905b188d61ad1b385c1162628a926b133d4a1))

## [2.17.3](https://github.com/antongolub/tsc-esm-fix/compare/v2.17.2...v2.17.3) (2022-06-05)

## [2.17.2](https://github.com/antongolub/tsc-esm-fix/compare/v2.17.1...v2.17.2) (2022-06-05)


### Bug Fixes

* fix one more d.ts check ([576725e](https://github.com/antongolub/tsc-esm-fix/commit/576725e1b05859c92b350cccd16f8c4662d34077)), closes [#82](https://github.com/antongolub/tsc-esm-fix/issues/82)

## [2.17.1](https://github.com/antongolub/tsc-esm-fix/compare/v2.17.0...v2.17.1) (2022-06-05)


### Bug Fixes

* fix d.ts detection ([d00f288](https://github.com/antongolub/tsc-esm-fix/commit/d00f28811851e6f525c946f759f3361dd41ed854))

# [2.17.0](https://github.com/antongolub/tsc-esm-fix/compare/v2.16.0...v2.17.0) (2022-06-05)


### Features

* handle `..` refs ([e7e6f99](https://github.com/antongolub/tsc-esm-fix/commit/e7e6f99195d4b512ce5211c7e0925324e60cdf51)), closes [#80](https://github.com/antongolub/tsc-esm-fix/issues/80)

# [2.16.0](https://github.com/antongolub/tsc-esm-fix/compare/v2.15.1...v2.16.0) (2022-06-03)


### Features

* add `.js` ext to libdef files ([fb03b28](https://github.com/antongolub/tsc-esm-fix/commit/fb03b28c2c06da2f504ed7cd2048dc6b52bc9814))

## [2.15.1](https://github.com/antongolub/tsc-esm-fix/compare/v2.15.0...v2.15.1) (2022-05-31)


### Bug Fixes

* rename with extension ([4889af9](https://github.com/antongolub/tsc-esm-fix/commit/4889af994a72c5d00f38f16e28c52454feb401d6))

# [2.15.0](https://github.com/antongolub/tsc-esm-fix/compare/v2.14.1...v2.15.0) (2022-05-18)


### Features

* handle single `.` case ([4803452](https://github.com/antongolub/tsc-esm-fix/commit/4803452c9994c4a8674acc20cd9fe6972071a02a))

## [2.14.1](https://github.com/antongolub/tsc-esm-fix/compare/v2.14.0...v2.14.1) (2022-05-13)


### Bug Fixes

* add missing `src` option to CLI ([1890f2e](https://github.com/antongolub/tsc-esm-fix/commit/1890f2e69b6a4230b1b8ca429e33d4c89f042378))

# [2.13.0](https://github.com/antongolub/tsc-esm-fix/compare/v2.12.4...v2.13.0) (2022-04-22)


### Features

* add nodejs v18 support ([baafd95](https://github.com/antongolub/tsc-esm-fix/commit/baafd9522b26052a58f3b56770efc05c50477dbc))

## [2.12.4](https://github.com/antongolub/tsc-esm-fix/compare/v2.12.3...v2.12.4) (2022-04-08)

## [2.12.3](https://github.com/antongolub/tsc-esm-fix/compare/v2.12.2...v2.12.3) (2022-04-08)

## [2.12.2](https://github.com/antongolub/tsc-esm-fix/compare/v2.12.1...v2.12.2) (2022-04-08)

## [2.12.1](https://github.com/antongolub/tsc-esm-fix/compare/v2.12.0...v2.12.1) (2022-04-07)

# [2.12.0](https://github.com/antongolub/tsc-esm-fix/compare/v2.11.0...v2.12.0) (2022-04-07)


### Features

* push warning if tsconfig is incompatible ([7641729](https://github.com/antongolub/tsc-esm-fix/commit/76417294b76c9a6f1237fd50fcba30a6b3186503))

# [2.11.0](https://github.com/antongolub/tsc-esm-fix/compare/v2.10.0...v2.11.0) (2022-04-07)


### Bug Fixes

* search variants in local deps before node_modules ([c42fd55](https://github.com/antongolub/tsc-esm-fix/commit/c42fd556d5f94656319d9ffa69b93c4d42a9b493))


### Features

* patch `require` statements ([a43b311](https://github.com/antongolub/tsc-esm-fix/commit/a43b311602e5ceca37feda1703981365920e14fe))

# [2.10.0](https://github.com/antongolub/tsc-esm-fix/compare/v2.9.1...v2.10.0) (2022-04-07)


### Bug Fixes

* fix tsconfigResolver ([2c83f43](https://github.com/antongolub/tsc-esm-fix/commit/2c83f43042bab2f6a5a5e8c1d0af38571745e66e))


### Features

* add support for es2021 and es2022 modules ([7e3384b](https://github.com/antongolub/tsc-esm-fix/commit/7e3384bcb3165d56982ed71c67efb39122730ee2))

## [2.9.1](https://github.com/antongolub/tsc-esm-fix/compare/v2.9.0...v2.9.1) (2022-04-06)

# [2.9.0](https://github.com/antongolub/tsc-esm-fix/compare/v2.8.0...v2.9.0) (2022-04-01)


### Features

* add default export to empty files ([33aeb5c](https://github.com/antongolub/tsc-esm-fix/commit/33aeb5cc3a0b80485785723e7a38773736bb3666))

# [2.8.0](https://github.com/antongolub/tsc-esm-fix/compare/v2.7.8...v2.8.0) (2022-03-31)


### Features

* introduce `fillBlank` options ([bfe2cb7](https://github.com/antongolub/tsc-esm-fix/commit/bfe2cb7400ca2dd7d81b66b7dccd3bff947305de))

## [2.7.8](https://github.com/antongolub/tsc-esm-fix/compare/v2.7.7...v2.7.8) (2022-03-09)


### Bug Fixes

* up deps, fix some vuls ([80fa330](https://github.com/antongolub/tsc-esm-fix/commit/80fa3306ebfb66a95e472559efed243839b6f4bc))

## [2.7.7](https://github.com/antongolub/tsc-esm-fix/compare/v2.7.6...v2.7.7) (2022-01-24)


### Bug Fixes

* **deps:** update dependency globby to v13 ([bf73503](https://github.com/antongolub/tsc-esm-fix/commit/bf735039e5ca2349bd484f3ee3076ee02653f191))

## [2.7.6](https://github.com/antongolub/tsc-esm-fix/compare/v2.7.5...v2.7.6) (2021-12-30)


### Bug Fixes

* move coverals to actions, fix vuls ([7889771](https://github.com/antongolub/tsc-esm-fix/commit/7889771ac8947d589ef8eba489fd164a3aa540cc))

## [2.7.5](https://github.com/antongolub/tsc-esm-fix/compare/v2.7.4...v2.7.5) (2021-12-11)


### Bug Fixes

* do not follow node_modules/.cache ([d9e01c7](https://github.com/antongolub/tsc-esm-fix/commit/d9e01c718bf62fca4d3846b0b7b22b5a07202275)), closes [#48](https://github.com/antongolub/tsc-esm-fix/issues/48)

## [2.7.4](https://github.com/antongolub/tsc-esm-fix/compare/v2.7.3...v2.7.4) (2021-11-12)

## [2.7.3](https://github.com/antongolub/tsc-esm-fix/compare/v2.7.2...v2.7.3) (2021-10-02)

## [2.7.2](https://github.com/antongolub/tsc-esm-fix/compare/v2.7.1...v2.7.2) (2021-09-12)

## [2.7.1](https://github.com/antongolub/tsc-esm-fix/compare/v2.7.0...v2.7.1) (2021-09-07)

# [2.7.0](https://github.com/antongolub/tsc-esm-fix/compare/v2.6.0...v2.7.0) (2021-09-07)


### Features

* add Node.js ^12.20.0 to supported engines ([b213f1c](https://github.com/antongolub/tsc-esm-fix/commit/b213f1c73d013db88b8a4b84213d3d8cfabc20d9))
* support custom debug function ([5eed5c0](https://github.com/antongolub/tsc-esm-fix/commit/5eed5c044f5072c307483a4f3b3387bdb498c455))


### Performance Improvements

* **pkg:** update globby to v12.0.2, update jest to v27.1.0, rm patch-package ([2ed6880](https://github.com/antongolub/tsc-esm-fix/commit/2ed68803d0fd1e85142b2eb7a2ea9d59b23002f7))

# [2.6.0](https://github.com/antongolub/tsc-esm-fix/compare/v2.5.1...v2.6.0) (2021-08-18)


### Features

* provide ts-sources patching ([8bc4ab0](https://github.com/antongolub/tsc-esm-fix/commit/8bc4ab0d2ed1fee46669673eaba8e375a229a945))

## [2.5.1](https://github.com/antongolub/tsc-esm-fix/compare/v2.5.0...v2.5.1) (2021-08-18)

# [2.5.0](https://github.com/antongolub/tsc-esm-fix/compare/v2.4.4...v2.5.0) (2021-08-18)


### Bug Fixes

* handle directories with file-like names ([8c60d3f](https://github.com/antongolub/tsc-esm-fix/commit/8c60d3f4b1913b7880f92017dbbd0f347a8ce4bf))


### Features

* introduce `unlink` CLI flag ([af31516](https://github.com/antongolub/tsc-esm-fix/commit/af31516e3a6af55a293955c0202dc4ed9d37ced4))

## [2.4.4](https://github.com/antongolub/tsc-esm-fix/compare/v2.4.3...v2.4.4) (2021-08-17)

## [2.4.3](https://github.com/antongolub/tsc-esm-fix/compare/v2.4.2...v2.4.3) (2021-08-15)

## [2.4.2](https://github.com/antongolub/tsc-esm-fix/compare/v2.4.1...v2.4.2) (2021-08-15)


### Bug Fixes

* update fast-glob, fix vuls ([cc2f898](https://github.com/antongolub/tsc-esm-fix/commit/cc2f898890b52a0397686c7ac0c9be5a2922dc89))

## [2.4.1](https://github.com/antongolub/tsc-esm-fix/compare/v2.4.0...v2.4.1) (2021-08-15)

# [2.4.0](https://github.com/antongolub/tsc-esm-fix/compare/v2.3.3...v2.4.0) (2021-08-15)


### Bug Fixes

* dont add ext prefix for modules that use `exports` pkg.json directive ([31fdb35](https://github.com/antongolub/tsc-esm-fix/commit/31fdb35b9f7541682aaffc7f29a938cdae8724cc)), closes [#24](https://github.com/antongolub/tsc-esm-fix/issues/24)


### Features

* support json5-formatted tsconfigs ([625a9cb](https://github.com/antongolub/tsc-esm-fix/commit/625a9cb8bff4f2bd9ad5dc6f1ef05f80743b078b)), closes [#17](https://github.com/antongolub/tsc-esm-fix/issues/17)

## [2.3.3](https://github.com/antongolub/tsc-esm-fix/compare/v2.3.2...v2.3.3) (2021-08-15)

## [2.3.2](https://github.com/antongolub/tsc-esm-fix/compare/v2.3.1...v2.3.2) (2021-08-14)

## [2.3.1](https://github.com/antongolub/tsc-esm-fix/compare/v2.3.0...v2.3.1) (2021-08-11)


### Bug Fixes

* **deps:** update dependency globby to v12 ([3801cc2](https://github.com/antongolub/tsc-esm-fix/commit/3801cc2ae3f675250646fde9f583345a4c95441c))

# [2.3.0](https://github.com/antongolub/tsc-esm-fix/compare/v2.2.2...v2.3.0) (2021-07-28)


### Features

* handle import with no vars, downgrade globby to v11 ([b934041](https://github.com/antongolub/tsc-esm-fix/commit/b9340414f75fa5af98dd220207a98c5ed1005a0c))

## [2.2.2](https://github.com/antongolub/tsc-esm-fix/compare/v2.2.1...v2.2.2) (2021-06-10)


### Bug Fixes

* fix target resolution ([5ff6341](https://github.com/antongolub/tsc-esm-fix/commit/5ff6341772a6a3c8a50b7c68ca6b09f138b34097))

## [2.2.1](https://github.com/antongolub/tsc-esm-fix/compare/v2.2.0...v2.2.1) (2021-06-10)


### Bug Fixes

* tweak up tsconfig resolver ([b5829f8](https://github.com/antongolub/tsc-esm-fix/commit/b5829f83182bce41740be884922986839bc47427)), closes [#13](https://github.com/antongolub/tsc-esm-fix/issues/13)

# [2.2.0](https://github.com/antongolub/tsc-esm-fix/compare/v2.1.0...v2.2.0) (2021-06-10)


### Features

* add debugger ([8b4c94c](https://github.com/antongolub/tsc-esm-fix/commit/8b4c94cc96ac3e081bd6b08a3508f6a10a1adc38))

# [2.1.0](https://github.com/antongolub/tsc-esm-fix/compare/v2.0.1...v2.1.0) (2021-06-10)


### Bug Fixes

* **pkg:** up deps ([750039f](https://github.com/antongolub/tsc-esm-fix/commit/750039ffead0d3737e04709b50f1c26716b6f6a5))


### Features

* handle external modules relative paths ([82f287a](https://github.com/antongolub/tsc-esm-fix/commit/82f287ac7aa9d5876380cd96063d16e5ee80792e)), closes [#5](https://github.com/antongolub/tsc-esm-fix/issues/5)

## [2.0.1](https://github.com/antongolub/tsc-esm-fix/compare/v2.0.0...v2.0.1) (2021-06-07)


### Performance Improvements

* mention requirements, deps revision ([8d0f0d8](https://github.com/antongolub/tsc-esm-fix/commit/8d0f0d82e7e8f17e7bba71b5f3f242ec133cdc3b))

# [2.0.0](https://github.com/antongolub/tsc-esm-fix/compare/v1.1.2...v2.0.0) (2021-06-07)


### Bug Fixes

* **pkg:** add missed @types/fs-extra ([71e704c](https://github.com/antongolub/tsc-esm-fix/commit/71e704ca97eb0def785579371976d20f96d82695))


### Performance Improvements

* update deps, migrate to mjs modules ([c9f6c4e](https://github.com/antongolub/tsc-esm-fix/commit/c9f6c4e314cbfde761c65facaaa58c2b7e8a0c84))


### BREAKING CHANGES

* repack as mjs, require Node.js >= 14

## [1.1.2](https://github.com/antongolub/tsc-esm-fix/compare/v1.1.1...v1.1.2) (2021-06-07)


### Bug Fixes

* add upper relative paths for repl regex ([#9](https://github.com/antongolub/tsc-esm-fix/issues/9)) ([3e2c476](https://github.com/antongolub/tsc-esm-fix/commit/3e2c4769044824ef976ae9cef8d2fcea41935185))

## [1.1.1](https://github.com/antongolub/tsc-esm-fix/compare/v1.1.0...v1.1.1) (2021-05-11)

# [1.1.0](https://github.com/antongolub/tsc-esm-fix/compare/v1.0.0...v1.1.0) (2021-05-11)


### Features

* **pkg:** provide dual export ([1257ca0](https://github.com/antongolub/tsc-esm-fix/commit/1257ca075ea335c3885d2740aedd40d87081a805))

# 1.0.0 (2021-05-11)


### Bug Fixes

* add missed backslash escapes ([965ec35](https://github.com/antongolub/tsc-esm-fix/commit/965ec35c84a614da6195da4d7a3041627e857052))


### Features

* add __filename and __dirname replacers ([65ca6e0](https://github.com/antongolub/tsc-esm-fix/commit/65ca6e08c52ee8dcd8217e9a4cf87674de5db92f))
* add impl drafts ([4b0d359](https://github.com/antongolub/tsc-esm-fix/commit/4b0d3595c0454d9478b93248fba818db6125fbb9))
* add relativeModuleExt fix ([502231e](https://github.com/antongolub/tsc-esm-fix/commit/502231e87d3dcdf8e3756bad8d00cf78825094a8))
* add unixify to support win-based runtime ([2a7d424](https://github.com/antongolub/tsc-esm-fix/commit/2a7d424b40e4f87fe82aafb9a433f58d29310310))
* provide CLI ([d2cfc48](https://github.com/antongolub/tsc-esm-fix/commit/d2cfc48a821750a15733a9e4994a353717ef7a2a))
* rm original files on patch ([ebd547c](https://github.com/antongolub/tsc-esm-fix/commit/ebd547cdf283b671074dde714d96e3c87c6ccbfa))
