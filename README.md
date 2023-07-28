# Quick start

```
yarn
yarn dev
```

## Introduction

### Demo

![image](./Demo.png)

> Demo image is provided by:
> https://as1.ftcdn.net/v2/jpg/01/89/08/78/1000_F_189087887_OBrl3f117Yicp94SBhFwMyxVgbN5Nfcb.jpg

### Features

- Load panorama from local and url.
- Annotate 3D layout from a panorama.
- Preview 3D mesh.
- Export 3D mesh and texture.

### Algorithm

Following flowchart describes how to get geometry layout and texture.

```mermaid
flowchart LR

    dilatedTexture["dilatedTexture(Anti aliasing)"]

    Panorama --> AnnotatedImage
    Panorama --> Texture

    user --> AnnotatedImage
    AnnotatedImage --> Geometry

    Geometry --> download

    Geometry --> Texture
    Texture --> dilatedTexture
    dilatedTexture --> download
    dilatedTexture --> 3DMesh
    Geometry --> 3DMesh

    Geometry --> WallIndexColorMesh
    WallIndexColorMesh --> PanoramaCapturer
    PanoramaCapturer --> IndexColorPanorama
    IndexColorPanorama --> edgeDetection
    edgeDetection --> Layout
    Layout --> AnnotatedImage

    Panorama[/Panorama/]
    3DMesh[/3DMesh/]
    Layout[/Layout/]
    user((click))
    download((download))
```
