import { useEffect, useState } from "react";
import * as THREE from "three";

import CapturePanorama from "../../core/CapturePanorama";
import RoomGeometry from "../../core/RoomGeometry";
import TexturePostEffect from "../../core/TexturePostEffect";
import Shaders from "../../shaders";

const ROOM_TEXTURE_WIDTH = 1920;
const ROOM_TEXTURE_HEIGHT = 1080;
const PanoramaOutline = ({
  three,
  floorY,
  ceilingY,
  wallVertices,
  panorama,
  panoramaOrigin,
}) => {
  const [mesh, setMesh] = useState(null);
  useEffect(() => {
    const { scene, addBeforeRenderFunction } = three;

    const setupScene = () => {
      const panoramaScene = new THREE.Scene();

      const material = new THREE.ShaderMaterial({
        vertexShader: Shaders.vertexShaders.worldPosition,
        fragmentShader: Shaders.fragmentShaders.vertexColor,
      });
      const room = new THREE.Mesh(new THREE.BufferGeometry(), material);
      setMesh(room);
      panoramaScene.add(room);
      return panoramaScene;
    };

    const panoramaCapturer = CapturePanorama(
      setupScene(),
      ROOM_TEXTURE_WIDTH,
      ROOM_TEXTURE_HEIGHT
    );
    panoramaCapturer.setCameraPosition(
      new THREE.Vector3().fromArray(panoramaOrigin)
    );
    const stopCapturePanorama = addBeforeRenderFunction((renderer) => {
      panoramaCapturer.render(renderer);
    });

    const { texture: outlineOf3DRoom, render: renderOutline } =
      TexturePostEffect(
        panoramaCapturer.texture,
        Shaders.fragmentShaders.edgeDetection
      );
    const stopTexturePostEffect = addBeforeRenderFunction(renderOutline);

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
    };
  }, [three, panorama, panoramaOrigin]);

  useEffect(() => {
    if (mesh) {
      mesh.geometry = RoomGeometry.create(
        wallVertices.map((vertex) => new THREE.Vector2(vertex[0], vertex[1])),
        ceilingY,
        floorY
      );
    }
  }, [wallVertices, floorY, ceilingY, mesh]);

  return null;
};

export default PanoramaOutline;
