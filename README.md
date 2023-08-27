# Quick start

```
yarn
yarn dev
```

# Introduction

## Demo

### Editor

- [Panorama to mesh](https://pano-to-mesh.vercel.app/editors/layout2d#eNpdkE9rwzAMxb-Lz8aWHP-Rcyyjt7WHwqCUENKsSTMyJ6TutjL23ecUtrDp8EPiPZ6EPlnTD8O0ZzlwVp-6vgttGlgmtGac9dVtuEb1wPLDAQTav5VxEIZcBriw4MmoQQM6Mg61mmlmo7fGAukf3o1Wg1WzmhqFuPCueufsvxQLhhTgL4uCs7EKw1S9Vunsc4zjJZeyuqBoYv0cRDhF-abky9hKQEleAklHEgGgXJdIHsgRuXK7mvqsQXT7rh693q3O6_fH28dTe9yYTVMfRUpgy67t1LVdSG8BjmJ-RPH1DUTpVnM)
- [Mesh preview and download](https://pano-to-mesh.vercel.app/editors/layout3d#eNpdkE9rwzAMxb-Lz8aWHP-Rcyyjt7WHwqCUENKsSTMyJ6TutjL23ecUtrDp8EPiPZ6EPlnTD8O0ZzlwVp-6vgttGlgmtGac9dVtuEb1wPLDAQTav5VxEIZcBriw4MmoQQM6Mg61mmlmo7fGAukf3o1Wg1WzmhqFuPCueufsvxQLhhTgL4uCs7EKw1S9Vunsc4zjJZeyuqBoYv0cRDhF-abky9hKQEleAklHEgGgXJdIHsgRuXK7mvqsQXT7rh693q3O6_fH28dTe9yYTVMfRUpgy67t1LVdSG8BjmJ-RPH1DUTpVnM)
- [Decoration with media](https://pano-to-mesh.vercel.app/editors/decoration#eNrtlFtr2zAUgP9KEOzN0cV2LKV0g4VSCqMt2-igbULwRbY1HMmV5Hgh5L9PTtom7p62tYNBJDhI56ZzPsFZg7xSSt-CE-yBlItKyMJdQAhpADxQxSvVWP8MnNzfY0ii_go8DEeMBpjs5cxzjiEOMaFsREnod3LUOY6jUYRZ-CS3jlGII7-zuoNPyF5urWNKoxdZIjxiPibPcjbzQB1LpeNF7Moura3NCUKxITC3aSah5BYtffS9LhAmiI0RZogyRDDG8_M5YWPMKGN0fj3RVZATQm9FWo_Dr5PyvL1c_fhWJFejqzxNoMsA9m9da1EI6bBgz4dk7GFXB6_4gksbnBmnX4Naq9qd1kBzo6rGCtX5E59hj_qdf62MeNRi1xom2ywmjSvuVIFHIPOI0zw0seVa7jyHGFJMCY6Yh7v9dJtt3P8paV0BjsNUDh7X6VJkXA1akdny_RS4vt9NwaDkoijt_t5FalWZD_tAF2pUo1N-qBoMjE5d2BPntpVpoGBqEhjXNdq-BRd1OAX9KLuquQvb2tEvdnTw7OkuybMGbLzfQ-nvUPqvj3JwKnL39z0gfa6HlheID019htZwWawaU4pYFrAQtmwSKBSSynKDcr2tJEOHKdBf4xm-AZ-3wdO2LeyGUJNwmKoF4ouEZ-iBJnnAPn28OGtfCcyQ_FMy_SYzLZYcFkoV1a7LXFQcZYhM7Gez_HIzDwMmojsTXhTpTXkplWiT5u62IajWfCl42yf4B9gPybl2FzwT8XGMHcfYcYwdx9j_OsY2PwFlDwVJ)

![image](./Demo.png)

> Demo image is provided by:
> https://as1.ftcdn.net/v2/jpg/01/89/08/78/1000_F_189087887_OBrl3f117Yicp94SBhFwMyxVgbN5Nfcb.jpg

### Viewer

- [Viewer](https://pano-to-mesh.vercel.app#eNqrVkrLyc8vilSyMtBRSk7NzMnMSwdyjHSUchIr80tLjFyUrKJjdZQKEvPyixJzE5WslJQQPP-izPTMPKAKAx1DPVMdg9haABJxGUo#eNpdkMtqwzAQRf9FayGNNJJG8jKU7JosCoUQjFHc2HFxbeOoj1D671W8qeniLGY43Hl8s6Yfx_nACuCsPnd9N7S5YChQMc76eBvfk35gxfEIQjm0zhOhRqMByHAQloxeU_IsBgrWYgBEY0mbcPcC4QqzeA6DAavBGAfBOcvvLcA1i_dPW-YGoBW-LDmb4jDO8S3m_S8pTddCynhVokn1yyCGc5IfWr5OrQQlfZDgJXmpAKDaVsrnDPKeqv1m7rFRig5dPQXztLlsPx9vX8_taWd3TX0SOYH9zdrPXdsN-T_AlcgHlD-_jHJYMQ)

## Features

- Load panorama from local or url.
- Annotate layout from a panorama and preview 3D Mesh.
- Save 3D mesh and texture to local.
- Share result of viewer and editor with data embedded in URL.

## Algorithm

## Mesh and Texture

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
