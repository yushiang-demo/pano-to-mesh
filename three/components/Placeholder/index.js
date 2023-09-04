import { useEffect } from "react";
import * as THREE from "three";
import { RENDER_ORDER } from "../../constant";
import { getBoxMesh } from "../../helpers/MediaLoader";

const Placeholder = ({ three, position, scale, quaternion }) => {
  useEffect(() => {
    const matrix = new THREE.Matrix4().compose(
      new THREE.Vector3().fromArray(position),
      new THREE.Quaternion().fromArray(quaternion),
      new THREE.Vector3().fromArray(scale)
    );

    const { scene } = three;

    const mesh = getBoxMesh();
    mesh.object.renderOrder = RENDER_ORDER.MESH;
    mesh.object.applyMatrix4(matrix);
    scene.add(mesh.object);

    return () => {
      scene.remove(mesh.object);
      mesh.dispose();
    };
  }, [three, position, scale, quaternion]);

  return null;
};

export default Placeholder;
