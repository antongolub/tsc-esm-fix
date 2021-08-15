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
