import { forwardRef, useEffect, useState } from "react";
import * as THREE from "three";

import { create3DRoom, TexturePostEffect, exportTexture } from "../../core";
import Shaders from "../../shaders";
import { RENDER_ORDER } from "../../constant";

const TEXTURE_SIZE = 4096;
const PanoramaTextureMesh = (
  { three, floorY, ceilingY, layout2D, panorama, panoramaOrigin, onLoad },
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
    const { scene, addBeforeRenderEvent, renderer } = three;

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

      const stopRenderTexture = addBeforeRenderEvent(render);

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

    const renderOnce = (render) => {
      let rendered = false;
      return (props) => {
        if (rendered) return;

        rendered = true;
        return render(props);
      };
    };

    const stopTexturePostEffect = addBeforeRenderEvent(
      renderOnce(renderDilatedTexture)
    );
    Shaders.setUniforms.dilation(dilationMaterial, {
      kernel: 5,
    });

    const material = new THREE.ShaderMaterial({
      vertexShader: Shaders.vertexShaders.worldPosition,
      fragmentShader: Shaders.fragmentShaders.texture,
      transparent: true,
    });
    Shaders.setUniforms.texture(material, {
      map: dilatedTexture,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.renderOrder = RENDER_ORDER.BASE_MESH;
    scene.add(mesh);

    onLoad(mesh);

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
    onLoad,
  ]);

  return null;
};

export default forwardRef(PanoramaTextureMesh);
