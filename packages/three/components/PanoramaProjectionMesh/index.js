import { useEffect } from "react";
import * as THREE from "three";

import { create3DRoom } from "../../core";
import Shaders from "../../shaders";
import { RENDER_ORDER } from "../../constant";

const PanoramaProjectionMesh = ({
  three,
  floorY,
  ceilingY,
  layout2D,
  panorama,
  panoramaOrigin,
  onLoad,
}) => {
  useEffect(() => {
    const { scene } = three;

    const geometry = create3DRoom(layout2D, ceilingY, floorY);

    const material = new THREE.ShaderMaterial({
      vertexShader: Shaders.vertexShaders.worldPosition,
      fragmentShader: Shaders.fragmentShaders.equirectangularProjection,
      transparent: true,
    });
    Shaders.setUniforms.equirectangularProjection(material, {
      texture: panorama,
      cameraPosition: new THREE.Vector3().fromArray(panoramaOrigin),
    });

    const room = new THREE.Mesh(geometry, material);
    room.renderOrder = RENDER_ORDER.MESH;
    scene.add(room);

    onLoad(room);

    return () => {
      scene.remove(room);
    };
  }, [three, floorY, ceilingY, layout2D, panorama, panoramaOrigin, onLoad]);

  return null;
};

export default PanoramaProjectionMesh;
