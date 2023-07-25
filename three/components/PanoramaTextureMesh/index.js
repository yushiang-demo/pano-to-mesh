import { useEffect, useState } from "react";
import * as THREE from "three";

import { create3DRoom } from "../../core/RoomGeometry";
import Shaders from "../../shaders";
import TexturePostEffect from "../../core/TexturePostEffect";

const TEXTURE_SIZE = 4096;
const PanoramaTextureMesh = ({
  three,
  floorY,
  ceilingY,
  layout2D,
  panorama,
  panoramaOrigin,
}) => {
  const [frameBuffer] = useState(
    new THREE.WebGLRenderTarget(TEXTURE_SIZE, TEXTURE_SIZE)
  );

  useEffect(() => {
    const { scene, addBeforeRenderFunction } = three;

    const geometry = create3DRoom(layout2D, ceilingY, floorY);

    const { stopRenderTexture, texture } = ((geometry) => {
      const material = new THREE.ShaderMaterial({
        vertexShader: Shaders.vertexShaders.uvPosition,
        fragmentShader: Shaders.fragmentShaders.equirectangularProjection,
        side: THREE.DoubleSide,
      });
      Shaders.setUniforms.equirectangularProjection(material, {
        texture: panorama,
        cameraPosition: new THREE.Vector3().fromArray(panoramaOrigin),
      });

      const room = new THREE.Mesh(geometry, material);

      const scene = new THREE.Scene();
      scene.add(room);

      const render = (renderer) => {
        renderer.setRenderTarget(frameBuffer);
        renderer.render(scene, new THREE.Camera());
        renderer.setRenderTarget(null);
      };

      const stopRenderTexture = addBeforeRenderFunction(render);

      return {
        stopRenderTexture,
        texture: frameBuffer.texture,
      };
    })(geometry);

    const { texture: dilatedTexture, render: renderDilatedTexture } =
      TexturePostEffect(texture, Shaders.fragmentShaders.dilation);
    const stopTexturePostEffect = addBeforeRenderFunction(renderDilatedTexture);

    const material = new THREE.ShaderMaterial({
      vertexShader: Shaders.vertexShaders.worldPosition,
      fragmentShader: Shaders.fragmentShaders.texture,
    });
    Shaders.setUniforms.texture(material, {
      map: dilatedTexture,
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    return () => {
      stopRenderTexture();
      stopTexturePostEffect();
      scene.remove(mesh);
      texture.dispose();
      dilatedTexture.dispose();
    };
  }, [three, floorY, ceilingY, layout2D, panorama, panoramaOrigin]);

  return null;
};

export default PanoramaTextureMesh;
