# Changelog

## [1.2.0](https://github.com/gnugomez/synco/compare/v1.1.0...v1.2.0) (2023-12-10)


### Features

* **crx:** adding chrome extension icons ([374aa25](https://github.com/gnugomez/synco/commit/374aa25b988170882d7d0a1ff5cd16e9307894b3))

## [1.1.0](https://github.com/gnugomez/synco/compare/v1.0.2...v1.1.0) (2023-12-09)


### Features

* adding leave room button ([9c11f75](https://github.com/gnugomez/synco/commit/9c11f7563088a3861cded5aa7ec8c084388f0e57))
* restructuring connections component ([253d22e](https://github.com/gnugomez/synco/commit/253d22e9deadde1f727b7f29ff759fafde983890))


### Bug Fixes

* manifest being malformed due to JSON.stringify from version ([7cc453e](https://github.com/gnugomez/synco/commit/7cc453e49db41b4c7c434c89f42dd17023963ee5))

## [1.0.2](https://github.com/gnugomez/synco/compare/v1.0.1...v1.0.2) (2023-12-06)


### Bug Fixes

* version not showing up correctly in manifest ([3402338](https://github.com/gnugomez/synco/commit/340233842ca909874a2d15dd29ba90a67f902f7a))

## [1.0.1](https://github.com/gnugomez/synco/compare/v1.0.0...v1.0.1) (2023-12-06)


### Bug Fixes

* **release:** add crx artifact on release ([c916ab2](https://github.com/gnugomez/synco/commit/c916ab27cea0710e1875e872a6ab856827b35cd3))

## 1.0.0 (2023-12-06)


### Features

* adding firebase realtime database signaling support ([aa5ae87](https://github.com/gnugomez/synco/commit/aa5ae87660b5464034f8ad26323f446208f5d6ae))
* adding hide functionality and playing peer message ([bfbb433](https://github.com/gnugomez/synco/commit/bfbb433a43cb9312909abf14462162c4b7599ad2))
* adding room domain entity ([326b3e2](https://github.com/gnugomez/synco/commit/326b3e27209935618cdf63908430af1caf28d302))
* adding room view with guards ([1e491ae](https://github.com/gnugomez/synco/commit/1e491ae83b5d6b749b7df06689e02552577a62b7))
* adding tailwindcss dep ([06e8b32](https://github.com/gnugomez/synco/commit/06e8b32daf30b7984fe495b1dbbcbf8264415d44))
* **ci:** adding publish workflow to pack extension into a crx file ([3d8c15e](https://github.com/gnugomez/synco/commit/3d8c15e2d00f31142ed547d3173a728ff1c30ffa))
* **messaging:** webrtc implementation with broadcast channel signaling ([2433b42](https://github.com/gnugomez/synco/commit/2433b425d2f6d302943dc3d007858267edf397ef))
* room api now handles all peer messages in a single data buffer ([2c704a1](https://github.com/gnugomez/synco/commit/2c704a167430cb5e76b8a5b467eb2e87c7baac17))
* updating peer connections signal handling to use same channel as room ([b5b38e1](https://github.com/gnugomez/synco/commit/b5b38e1d7bc0f0fc04f456b8af8beac2a3130be9))
* usign dom shadow in order to isolate the page specific styles ([7cac092](https://github.com/gnugomez/synco/commit/7cac092a2f3a820d6b83cfb98c354122eca9fe22))
