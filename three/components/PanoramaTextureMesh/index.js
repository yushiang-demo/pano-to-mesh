import { forwardRef, useEffect, useState } from "react";
import * as THREE from "three";

import { create3DRoom } from "../../core/RoomGeometry";
import Shaders from "../../shaders";
import TexturePostEffect from "../../core/TexturePostEffect";
import { exportTexture } from "../../core/helpers/Texture";

const TEXTURE_SIZE = 4096;
const PanoramaTextureMesh = (
  { three, floorY, ceilingY, layout2D, panorama, panoramaOrigin },
  ref
) => {
  const [frameBuffer] = useState(
    new THREE.WebGLRenderTarget(TEXTURE_SIZE, TEXTURE_SIZE)
  );

  useEffect(() => {
    return () => {
      frameBuffer.dispose();
    };
  }, [frameBuffer]);

  useEffect(() => {
    const { scene, addBeforeRenderFunction, renderer } = three;

    const geometry = create3DRoom(layout2D, ceilingY, floorY);

    const { dispose: disposeRenderTexture, texture } = ((geometry) => {
      const material = new THREE.ShaderMaterial({
        vertexShader: Shaders.vertexShaders.uvPosition,
        fragmentShader: Shaders.fragmentShaders.equirectangularProjection,
        side: THREE.DoubleSide,
      });
      Shaders.setUniforms.equirectangularProjection(material, {
        texture: panorama,
        cameraPosition: new THREE.Vector3().fromArray(panoramaOrigin),
      });

      const mesh = new THREE.Mesh(geometry, material);

      const scene = new THREE.Scene();
      scene.add(mesh);

      const render = (renderer) => {
        renderer.setRenderTarget(frameBuffer);
        renderer.render(scene, new THREE.Camera());
        renderer.setRenderTarget(null);
      };

      const stopRenderTexture = addBeforeRenderFunction(render);

      const dispose = () => {
        stopRenderTexture();
        scene.remove(mesh);
      };
      return {
        dispose,
        texture: frameBuffer.texture,
      };
    })(geometry);

    const {
      texture: dilatedTexture,
      render: renderDilatedTexture,
      dispose: disposeTexturePostEffect,
      material: dilationMaterial,
    } = TexturePostEffect(texture, Shaders.fragmentShaders.dilation);
    const stopTexturePostEffect = addBeforeRenderFunction(renderDilatedTexture);
    Shaders.setUniforms.dilation(dilationMaterial, {
      kernel: 5,
    });

    const material = new THREE.ShaderMaterial({
      vertexShader: Shaders.vertexShaders.worldPosition,
      fragmentShader: Shaders.fragmentShaders.texture,
    });
    Shaders.setUniforms.texture(material, {
      map: dilatedTexture,
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    if (ref) {
      ref.current = {
        getTexture: () => {
          const dataURL = exportTexture(renderer, dilatedTexture, true);
          return dataURL;
        },
      };
    }

    return () => {
      disposeRenderTexture();
      stopTexturePostEffect();
      disposeTexturePostEffect();
      texture.dispose();
      scene.remove(mesh);
      geometry.dispose();
    };
  }, [
    three,
    floorY,
    ceilingY,
    layout2D,
    panorama,
    panoramaOrigin,
    frameBuffer,
    ref,
  ]);

  return null;
};

export default forwardRef(PanoramaTextureMesh);
