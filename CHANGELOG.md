# Changelog

All notable changes to this project will be documented in this file.
The format is based on [Keep a Changelog](https://github.com/olivierlacan/keep-a-changelog).

## [Unreleased]

### Added

### Changed

### Fixed

- Fix `MeshIndexMap` update single mesh make everything re-render. (https://github.com/yushiang-demo/pano-to-mesh/pull/52) (https://github.com/yushiang-demo/pano-to-mesh/pull/53)

### Removed

- Rename `addBeforeRenderFunction` to `addBeforeRenderEvent`. (https://github.com/yushiang-demo/pano-to-mesh/pull/52)

## [1.3.0] - 2023-10-08

### Added

- Raycaster to new media. (https://github.com/yushiang-demo/PanoToMesh/pull/38)
- Add `TransformControls` to edit media in 3d space. (https://github.com/yushiang-demo/pano-to-mesh/pull/42)
- Add media property menu and default data. (https://github.com/yushiang-demo/pano-to-mesh/pull/43)
- Add media data inputs UI and chromaKey media. (https://github.com/yushiang-demo/pano-to-mesh/pull/46)
- Add github ci to check changelog and docker build. (https://github.com/yushiang-demo/pano-to-mesh/pull/48)

### Changed

- Use yarn workspace for `three`, `js-base64` and `pako` packages. (https://github.com/yushiang-demo/PanoToMesh/pull/41)
- Refactor shader folder structure. (https://github.com/yushiang-demo/pano-to-mesh/pull/44)
- Refactor three/core export route structure. (https://github.com/yushiang-demo/pano-to-mesh/pull/47)

### Fixed

- Avoid creating backface plane and bbox. (https://github.com/yushiang-demo/PanoToMesh/pull/39)
- Hide Css3d elements when rendering back face and change placeholder style. (https://github.com/yushiang-demo/pano-to-mesh/pull/40)
- Add background panel to block css3d layer flicker black block.(https://github.com/yushiang-demo/pano-to-mesh/pull/45)

### Removed

## [1.2.0] - 2023-09-04

### Added

- Show embed htmls in Viewer. (https://github.com/yushiang-demo/PanoToMesh/pull/32)
- Add `react-rnd` for floating toolbar. (https://github.com/yushiang-demo/PanoToMesh/pull/32)
- Add `matrixFromPointsAndNormal` to math for calculating plane transform from two point and face normal. (https://github.com/yushiang-demo/PanoToMesh/pull/32)
- Add `raycastMeshFromScreen` to raycast from current view. (https://github.com/yushiang-demo/PanoToMesh/pull/32)
- Add `.renderOrder` and set material `transparent:true` to make a hole on canvas. (https://github.com/yushiang-demo/PanoToMesh/pull/32)
- Add `MeshIndexMap` as object selector for media. (https://github.com/yushiang-demo/PanoToMesh/pull/33)
- Add `Dockerfile` and github ci to deploy production to Github registry. (https://github.com/yushiang-demo/PanoToMesh/pull/34)

### Changed

- Separate editor page to `editors/layout2d`, `editors/layout3d`, `editors/decoration`. (https://github.com/yushiang-demo/PanoToMesh/pull/32)
- `PanoramaTextureMesh`, `PanoramaProjectionMesh` add `onLoad` to pass mesh to app. (https://github.com/yushiang-demo/PanoToMesh/pull/32)
- Change `vertexShaders/screenPosition` to render plane at the front. (https://github.com/yushiang-demo/PanoToMesh/pull/32)
- Separate algorithms from `README.md` to `DOCUMENT.md`. (https://github.com/yushiang-demo/PanoToMesh/pull/32)

### Fixed

- `CameraControls.focus` lock distance if param is false. (https://github.com/yushiang-demo/PanoToMesh/pull/32)

### Removed

- `SceneControls` is removed use `onLoad` of components to get mesh instead. (https://github.com/yushiang-demo/PanoToMesh/pull/32)

## [1.1.1] - 2023-08-21

### Added

### Changed

### Fixed

- Fix editor's preview viewer and data loader. (https://github.com/yushiang-demo/PanoToMesh/pull/29)

### Removed

## [1.1.0] - 2023-08-19

### Added

- Eslint [working directory](https://nextjs.org/docs/app/building-your-application/configuring/eslint#linting-custom-directories-and-files) and github ci for testing.(https://github.com/yushiang-demo/PanoToMesh/pull/19)
- Use [js-base64](https://github.com/dankogai/js-base64) and [pako](https://github.com/nodeca/pako) as encoder for passing editor result to viewer through query string.(https://github.com/yushiang-demo/PanoToMesh/pull/23)
- Add top view in viewer with auto-fit viewport and constraint camera's `zoom`, `rotate`, `pan`.(https://github.com/yushiang-demo/PanoToMesh/pull/24)
- Recommended panorama when focus on Input.(https://github.com/yushiang-demo/PanoToMesh/pull/25)

### Changed

- Change `styled-component` babel setting to SWC according to [official document](https://styled-components.com/docs/advanced#with-swc). (https://github.com/yushiang-demo/PanoToMesh/pull/16)
- Change share link to load data from hash instead of query string. (https://github.com/yushiang-demo/PanoToMesh/pull/26)

### Fixed

- `PanoramaTextureMesh` frame buffer cause memory leak. (https://github.com/yushiang-demo/PanoToMesh/pull/17)
- `yarn audit` get 1 high vulnerabilities, resolved by remove `react-script`.(https://github.com/yushiang-demo/PanoToMesh/pull/20)

### Removed

- Remove source code of `OrbitControls` use add-on version from three.(https://github.com/yushiang-demo/PanoToMesh/pull/18)

## [1.0.0] - 2023-07-28

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

Codes without pull requests won't be recorded.

### Added

- Initialize panorama annotator.

### Changed

### Fixed

### Removed

[unreleased]: https://github.com/yushiang-demo/PanoToMesh/compare/v1.3.0...HEAD
[1.3.0]: https://github.com/yushiang-demo/PanoToMesh/compare/v1.2.0...v1.3.0
[1.2.0]: https://github.com/yushiang-demo/PanoToMesh/compare/v1.1.1...v1.2.0
[1.1.1]: https://github.com/yushiang-demo/PanoToMesh/compare/v1.1.0...v1.1.1
[1.1.0]: https://github.com/yushiang-demo/PanoToMesh/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/yushiang-demo/PanoToMesh/compare/v0.0.0...v1.0.0
[0.0.0]: https://github.com/yushiang-demo/PanoToMesh/releases/tag/v0.0.0
