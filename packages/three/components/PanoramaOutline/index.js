import { useEffect, useState } from "react";
import * as THREE from "three";

import { CapturePanorama, create3DRoom, TexturePostEffect } from "../../core";
import Shaders from "../../shaders";

const ROOM_TEXTURE_WIDTH = 1920;
const ROOM_TEXTURE_HEIGHT = 1080;
const PanoramaOutline = ({
  three,
  floorY,
  ceilingY,
  layout2D,
  panorama,
  panoramaOrigin,
}) => {
  const [mesh, setMesh] = useState(null);
  const [panoramaCapturer, setPanoramaCapturer] = useState(null);
  useEffect(() => {
    const { scene, addBeforeRenderEvent } = three;

    const setupScene = () => {
      const panoramaScene = new THREE.Scene();

      const material = new THREE.ShaderMaterial({
        vertexShader: Shaders.vertexShaders.worldPosition,
        fragmentShader: Shaders.fragmentShaders.vertexColor,
      });
      if (!mesh) {
        const room = new THREE.Mesh(new THREE.BufferGeometry(), material);
        setMesh(room);
        panoramaScene.add(room);
      } else {
        panoramaScene.add(mesh);
      }
      return panoramaScene;
    };

    const panoramaCapturer = CapturePanorama(
      setupScene(),
      ROOM_TEXTURE_WIDTH,
      ROOM_TEXTURE_HEIGHT
    );
    setPanoramaCapturer(panoramaCapturer);

    const stopCapturePanorama = addBeforeRenderEvent((renderer) => {
      panoramaCapturer.render(renderer);
    });

    const {
      texture: outlineOf3DRoom,
      render: renderOutline,
      dispose: disposeOutlineTexture,
    } = TexturePostEffect(
      panoramaCapturer.texture,
      Shaders.fragmentShaders.edgeDetection
    );
    const stopTexturePostEffect = addBeforeRenderEvent(renderOutline);

    const geometry1 = new THREE.PlaneGeometry(1, 1);
    const material1 = new THREE.ShaderMaterial({
      vertexShader: Shaders.vertexShaders.screenPosition,
      fragmentShader: Shaders.fragmentShaders.textureBlending,
    });
    Shaders.setUniforms.textureBlending(material1, {
      texture0: panorama,
      texture1: outlineOf3DRoom,
      percentage: 0.5,
    });
    const panel = new THREE.Mesh(geometry1, material1);
    scene.add(panel);

    return () => {
      scene.remove(panel);
      stopCapturePanorama();
      stopTexturePostEffect();
      disposeOutlineTexture();
      panoramaCapturer.dispose();
      geometry1.dispose();
      panorama.dispose();
    };
  }, [three, panorama, mesh]);

  useEffect(() => {
    if (panoramaCapturer) {
      panoramaCapturer.setCameraPosition(
        new THREE.Vector3().fromArray(panoramaOrigin)
      );
    }
  }, [panoramaOrigin, panoramaCapturer]);

  useEffect(() => {
    if (mesh) {
      mesh.geometry.dispose();
      mesh.geometry = create3DRoom(layout2D, ceilingY, floorY);
    }

    return () => {
      if (mesh) {
        mesh.geometry.dispose();
      }
    };
  }, [layout2D, floorY, ceilingY, mesh]);

  return null;
};

export default PanoramaOutline;
