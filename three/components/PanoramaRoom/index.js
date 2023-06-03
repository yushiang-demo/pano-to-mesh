import { useEffect } from "react";
import * as THREE from "three";

import RoomGeometry from "../../core/RoomGeometry";
import Shaders from "../../shaders";

const PanoramaRoom = ({
  three,
  floorY,
  ceilingY,
  wallVertices,
  panorama,
  panoramaOrigin,
}) => {
  useEffect(() => {
    const { scene } = three;

    const geometry = RoomGeometry.create(
      wallVertices.map((vertex) => new THREE.Vector2(vertex[0], vertex[1])),
      ceilingY,
      floorY
    );

    const material = new THREE.ShaderMaterial({
      vertexShader: Shaders.vertexShaders.worldPosition,
      fragmentShader: Shaders.fragmentShaders.equirectangularProjection,
    });
    Shaders.setUniforms.equirectangularProjection(material, {
      texture: panorama,
      cameraPosition: new THREE.Vector3().fromArray(panoramaOrigin),
    });

    const room = new THREE.Mesh(geometry, material);
    scene.add(room);
    return () => {
      scene.remove(room);
    };
  }, [three, floorY, ceilingY, wallVertices, panorama, panoramaOrigin]);

  return null;
};

export default PanoramaRoom;
