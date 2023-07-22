import { useEffect } from "react";
import * as THREE from "three";

import { create3DRoom } from "../../core/RoomGeometry";
import Shaders from "../../shaders";

const PanoramaTexture = ({
  three,
  floorY,
  ceilingY,
  layout2D,
  panorama,
  panoramaOrigin,
}) => {
  useEffect(() => {
    const { scene } = three;

    const geometry = create3DRoom(layout2D, ceilingY, floorY);

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
    scene.add(room);
    return () => {
      scene.remove(room);
    };
  }, [three, floorY, ceilingY, layout2D, panorama, panoramaOrigin]);

  return null;
};

export default PanoramaTexture;
