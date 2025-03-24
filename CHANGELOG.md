# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.11.3](https://github.com/pact-foundation/jest-pact/compare/v0.11.2...v0.11.3) (2025-03-24)


### Bug Fixes

* **peer-deps:** update pact-js to allow 15.x ([561c02c](https://github.com/pact-foundation/jest-pact/commit/561c02ccdbb7544a849f5b766dc72d06cd9e99ba))

### [0.11.2](https://github.com/pact-foundation/jest-pact/compare/v0.11.1...v0.11.2) (2025-02-17)


### Bug Fixes

* **deps:** add pact-js v14 to peer deps ([#343](https://github.com/pact-foundation/jest-pact/issues/343)) ([33480d0](https://github.com/pact-foundation/jest-pact/commit/33480d0ad1783264c26e28e591544d8b8677862f))

### [0.11.1](https://github.com/pact-foundation/jest-pact/compare/v0.11.0...v0.11.1) (2024-06-19)


### Bug Fixes

* Open peer deps for pact-js v13 ([db783ec](https://github.com/pact-foundation/jest-pact/commit/db783ecb6ead20f8ac4d35c8ef3e1442865090ee))

## [0.11.0](https://github.com/pact-foundation/jest-pact/compare/v0.10.3...v0.11.0) (2023-07-11)


### ⚠ BREAKING CHANGES

* require at least node 16

### Features

* Bump pact to 12.0.0 ([165f3ae](https://github.com/pact-foundation/jest-pact/commit/165f3ae8f331ae4d78c30a25ec213452b6986480))


### Bug Fixes

* require at least node 16 ([5c9d7eb](https://github.com/pact-foundation/jest-pact/commit/5c9d7eb972ff3ac25b8160b0888b9b79830aee6b))

### [0.10.3](https://github.com/pact-foundation/jest-pact/compare/v0.10.2...v0.10.3) (2023-03-21)


### Features

* Bump Pact version ([8da6073](https://github.com/pact-foundation/jest-pact/commit/8da607379f2514900af8278431508806c86b8a50))

### [0.10.2](https://github.com/pact-foundation/jest-pact/compare/v0.10.1...v0.10.2) (2022-12-05)


### Features

* **jest:** Add jest 29 support ([017abf3](https://github.com/pact-foundation/jest-pact/commit/017abf3205d204a65a9f5a5ef60d5586872dd197))

### [0.10.1](https://github.com/pact-foundation/jest-pact/compare/v0.9.4...v0.10.1) (2022-08-08)


### Features

* **v3:** Add draft withPact interface for V3 ([8ba6e66](https://github.com/pact-foundation/jest-pact/commit/8ba6e6643821bac85c03d317ccf7d205bfa4649c))

### [0.9.4](https://github.com/pact-foundation/jest-pact/compare/v0.9.3...v0.9.4) (2022-05-20)


### Bug Fixes

* Add Jest@28 to the peer dependencies (and fix a few other issues) ([#211](https://github.com/pact-foundation/jest-pact/issues/211)) ([0bd968e](https://github.com/pact-foundation/jest-pact/commit/0bd968e16f4256a291304ff4341e2e529e0ca83d))

### [0.9.3](https://github.com/pact-foundation/jest-pact/compare/v0.9.2...v0.9.3) (2022-03-21)


### Features

* Release GH actions by removing dryRun flag ([3778ee3](https://github.com/pact-foundation/jest-pact/commit/3778ee32caac1d774bb796ea64742fc049368ec6))

### [0.9.2](https://github.com/pact-foundation/jest-pact/compare/v0.9.1...v0.9.2) (2022-03-21)


### Bug Fixes

* Add GH actions for release pipeline ([af82206](https://github.com/pact-foundation/jest-pact/commit/af822069941c9cf33fd3dc2f9fac794342d43900))

### [0.9.1](https://github.com/pact-foundation/jest-pact/compare/v0.9.0...v0.9.1) (2021-06-16)


### Features

* Mark jest-pact as compatible with jest 27 (and )move jest types to dev dependencies) ([df15f75](https://github.com/pact-foundation/jest-pact/commit/df15f75b3df4f201aed850feda348005d10a61ce))

## [0.9.0](https://github.com/pact-foundation/jest-pact/compare/v0.8.3...v0.9.0) (2021-05-08)


### ⚠ BREAKING CHANGES

* Increased peerdeps for @pact-foundation/pact to 9.12.2 and above

### Bug Fixes

* Fix compile error when used with @pact-foundation/pact version 9.15.0 and above ([b89a114](https://github.com/pact-foundation/jest-pact/commit/b89a114921c126aa291a722d017ec4c44a834550))

### [0.8.3](https://github.com/pact-foundation/jest-pact/compare/v0.8.2...v0.8.3) (2021-02-23)

### [0.8.2](https://github.com/pact-foundation/jest-pact/compare/v0.8.1...v0.8.2) (2021-02-23)


### Features

* **dsl:** Add pactWith.only and pactWith.skip, which behave like their describe counterparts ([540dc3c](https://github.com/pact-foundation/jest-pact/commit/540dc3c692bcb25d1175f73c4d5da1babb001087))
* **messagePact:** Add messagePactWith so that the default options are available for message pact users too ([a8c1943](https://github.com/pact-foundation/jest-pact/commit/a8c19435546f374130eda3c431254911a7142e37))

### [0.8.1](https://github.com/pact-foundation/jest-pact/compare/v0.8.0...v0.8.1) (2020-08-18)


### Bug Fixes

* **jest-26:** Use global object to avoid 'jasmine is undefined' error ([9e46c9b](https://github.com/pact-foundation/jest-pact/commit/9e46c9b0c150396b176fd1d6905a0d63e9d03db1))

## [0.8.0](https://github.com/pact-foundation/jest-pact/compare/v0.7.0...v0.8.0) (2020-08-18)


### Features

* **jest:** Add support for Jest v26.x by using jest.setTimeout() (Fixes [#197](https://github.com/pact-foundation/jest-pact/issues/197)) ([078f0d1](https://github.com/pact-foundation/jest-pact/commit/078f0d112ba5dcf0bdbca3ddc34fbd3d0fa1db2a))
* **options:** Add convienience options logDir and logFileName ([2d61354](https://github.com/pact-foundation/jest-pact/commit/2d61354065ad1bbb4e42238953c51b745297f35f))
* **types:** Add JestProvidedPactFn to improve type safety for callers of withPact ([f63ce87](https://github.com/pact-foundation/jest-pact/commit/f63ce871188e74d54789c6f45e97a36483d5a3ca))


### Bug Fixes

* **peerDeps:** Widen peer deps to include Jest v24.x.x and v25.x.x ([50355e2](https://github.com/pact-foundation/jest-pact/commit/50355e2751cf3b5bd39b8f44998832cdbfa178e8))

## [0.7.0](https://github.com/pact-foundation/jest-pact/compare/v0.6.0...v0.7.0) (2020-07-18)


### Features

* **dsl:** Add xpactWith and fpactWith to improve the experience when skipping tests ([da82056](https://github.com/pact-foundation/jest-pact/commit/da82056a1c56e77e27f4fa52964f943959519310))

## [0.6.0](https://github.com/pact-foundation/jest-pact/compare/v0.5.4...v0.6.0) (2020-06-28)


### Features

* **logs:** Add port number to log file names (mitigates [#193](https://github.com/pact-foundation/jest-pact/issues/193)) ([e8af055](https://github.com/pact-foundation/jest-pact/commit/e8af0551c08c13d09fc96a5fc6360cc45235b483))

### [0.5.4](https://github.com/pact-foundation/jest-pact/compare/v0.5.3...v0.5.4) (2020-05-13)


### Bug Fixes

* **defaults:** Set LogLevel to warn by default (previously was error) ([83a29eb](https://github.com/pact-foundation/jest-pact/commit/83a29eb224dce0c427c881b7b48cd5bdc1af6037))

### [0.5.3](https://github.com/pact-foundation/jest-pact/compare/v0.5.2...v0.5.3) (2020-05-05)


### Bug Fixes

* **deps:** update dependency @types/jest to v25.1.3 ([27731ae](https://github.com/pact-foundation/jest-pact/commit/27731aea77ad2a76c290f2d7a9a35730d6f537bc))
* **deps:** update dependency @types/jest to v25.1.4 ([e601980](https://github.com/pact-foundation/jest-pact/commit/e601980b0b61cb0f6d33cb5cd4deccaaefe22eec))
* **options:** fix a bug where 'dir' wouldn't take absolute paths ([1cec75d](https://github.com/pact-foundation/jest-pact/commit/1cec75d4673a250a3c96ba0385262ebfecaf7e11))
* **options:** remove PactOptions redefinition, introduce JestPactOptions ([b622f01](https://github.com/pact-foundation/jest-pact/commit/b622f0171799745d6aeaf4a3924367f413b3b334))

### [0.5.2](https://github.com/YOU54F/jest-pact/compare/v0.5.1...v0.5.2) (2020-02-18)

### [0.5.1](https://github.com/YOU54F/jest-pact/compare/v0.4.6...v0.5.1) (2020-02-12)

### [0.4.6](https://github.com/YOU54F/jest-pact/compare/v0.4.5...v0.4.6) (2020-02-12)


### Bug Fixes

* **deps:** update dependency @types/jest to v24.0.20 ([4c3ef1e](https://github.com/YOU54F/jest-pact/commit/4c3ef1e))
* **deps:** update dependency @types/jest to v24.0.22 ([e56dca1](https://github.com/YOU54F/jest-pact/commit/e56dca1))
* **deps:** update dependency @types/jest to v24.0.23 ([#130](https://github.com/YOU54F/jest-pact/issues/130)) ([d1b54a7](https://github.com/YOU54F/jest-pact/commit/d1b54a7))
* **deps:** update dependency @types/jest to v24.0.24 ([53935dc](https://github.com/YOU54F/jest-pact/commit/53935dc))
* **deps:** update dependency @types/jest to v24.0.25 ([a7b1ec9](https://github.com/YOU54F/jest-pact/commit/a7b1ec9))
* **deps:** update dependency @types/jest to v24.9.0 ([ac2f6da](https://github.com/YOU54F/jest-pact/commit/ac2f6da))
* **deps:** update dependency @types/jest to v24.9.1 ([0030690](https://github.com/YOU54F/jest-pact/commit/0030690))
* **deps:** update dependency @types/jest to v25 ([#167](https://github.com/YOU54F/jest-pact/issues/167)) ([49d5f69](https://github.com/YOU54F/jest-pact/commit/49d5f69))
* **deps:** update dependency @types/jest to v25.1.2 ([b0862b0](https://github.com/YOU54F/jest-pact/commit/b0862b0))


### Features

* **timeout:** prevent brittle tests by increasing Jasmine timeouts ([51d23cf](https://github.com/YOU54F/jest-pact/commit/51d23cf))

### [0.4.5](https://github.com/YOU54F/jest-pact/compare/v0.4.4...v0.4.5) (2019-10-17)


### Bug Fixes

* **deps:** update dependency @types/jest to v24.0.19 ([9063d84](https://github.com/YOU54F/jest-pact/commit/9063d84))



### [0.4.4](https://github.com/YOU54F/jest-pact/compare/v0.4.3...v0.4.4) (2019-08-07)


### Bug Fixes

* **deps:** update dependency @types/jest to v24.0.17 ([#82](https://github.com/YOU54F/jest-pact/issues/82)) ([9b58ea0](https://github.com/YOU54F/jest-pact/commit/9b58ea0))



### [0.4.3](https://github.com/YOU54F/jest-pact/compare/v0.4.2...v0.4.3) (2019-07-08)


### Bug Fixes

* **deps:** update dependency @types/jest to v24.0.15 ([#66](https://github.com/YOU54F/jest-pact/issues/66)) ([8798aed](https://github.com/YOU54F/jest-pact/commit/8798aed))



### [0.4.2](https://github.com/YOU54F/jest-pact/compare/v0.3.0...v0.4.2) (2019-06-14)


### Bug Fixes

* drop peer dep on Jest to 24.7.1 to match current create-react-app ([e8cc52b](https://github.com/YOU54F/jest-pact/commit/e8cc52b))



### [0.4.1](https://github.com/YOU54F/jest-pact/compare/v0.4.0...v0.4.1) (2019-06-12)


### Bug Fixes

* log path when user specified is writing to file ([30bbba1](https://github.com/YOU54F/jest-pact/commit/30bbba1))



## [0.4.0](https://github.com/YOU54F/jest-pact/compare/v0.3.0...v0.4.0) (2019-06-12)


### Features

* allow configuration of pacts and log dirs ([c4c3b24](https://github.com/YOU54F/jest-pact/commit/c4c3b24))



## [0.3.0](https://github.com/YOU54F/jest-pact/compare/v0.2.0...v0.3.0) (2019-05-31)


### Features

* remove supertest ([#50](https://github.com/YOU54F/jest-pact/issues/50)) ([cc9c606](https://github.com/YOU54F/jest-pact/commit/cc9c606))
* use random ports for provider, if not provided ([#51](https://github.com/YOU54F/jest-pact/issues/51)) ([aeb75e6](https://github.com/YOU54F/jest-pact/commit/aeb75e6))



## 0.2.0 (2019-05-31)


### Bug Fixes

* **dependencies:** Make jest and pact-node peer dependencies ([99abbc1](https://github.com/YOU54F/jest-pact/commit/99abbc1))


### Features

* **options:** Add pactfileWriteMode to options ([6532b11](https://github.com/YOU54F/jest-pact/commit/6532b11))
* expose getProviderBaseUrl ([f0a1db3](https://github.com/YOU54F/jest-pact/commit/f0a1db3))


### Tests

* release v0.1.0, test locally, upload ci test results, plus moving test related files into examples ([d5d9fca](https://github.com/YOU54F/jest-pact/commit/d5d9fca))



### 0.0.10 (2019-05-02)



### 0.0.9 (2019-05-01)
