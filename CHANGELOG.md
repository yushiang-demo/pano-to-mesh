# Changelog

All notable changes to this project will be documented in this file.
The format is based on [Keep a Changelog](https://github.com/olivierlacan/keep-a-changelog).

## [Unreleased]

### Changed

- Change `styled-component` babel setting to SWC according to [official document](https://styled-components.com/docs/advanced#with-swc). (https://github.com/yushiang-demo/PanoToMesh/pull/16)

### Fixed

- `PanoramaTextureMesh` frame buffer cause memory leak. (https://github.com/yushiang-demo/PanoToMesh/pull/17)

### Removed

- Remove source code of `OrbitControls` use add-on version from three.(https://github.com/yushiang-demo/PanoToMesh/pull/18)

## [1.0.0] - 2023-08-28

### Added

- Edit ceiling and camera height (https://github.com/yushiang-demo/PanoToMesh/pull/11)
- Export mesh and texture (https://github.com/yushiang-demo/PanoToMesh/pull/9)

### Changed

- Extends 2d editor clickable region to ceiling part. (https://github.com/yushiang-demo/PanoToMesh/pull/7)
- Camera dolly effect won't change cameras position instead of fov. (https://github.com/yushiang-demo/PanoToMesh/pull/10)

### Fixed

- flickering wall when editing layout. (https://github.com/yushiang-demo/PanoToMesh/pull/3)

### Removed

## [0.0.0]

Code which doesn't make changes with pull requests won't be recorded.

[unreleased]: https://github.com/yushiang-demo/PanoToMesh/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/yushiang-demo/PanoToMesh/compare/v0.0.0...v1.0.0
[0.0.0]: https://github.com/yushiang-demo/PanoToMesh/releases/tag/v0.0.0
