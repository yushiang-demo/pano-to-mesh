import { useEffect } from "react";
import * as THREE from "three";
import { RENDER_ORDER } from "../../constant";

const Placeholder = ({ three, position, scale, quaternion }) => {
  useEffect(() => {
    const matrix = new THREE.Matrix4().compose(
      new THREE.Vector3().fromArray(position),
      new THREE.Quaternion().fromArray(quaternion),
      new THREE.Vector3().fromArray(scale)
    );

    const { scene } = three;

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    geometry.translate(0, 0, 0.5);
    const material = new THREE.MeshBasicMaterial({
      transparent: true,
      wireframe: true,
      color: new THREE.Color(0, 0, 0),
    });
    const box = new THREE.Mesh(geometry, material);
    box.renderOrder = RENDER_ORDER.MESH;
    box.applyMatrix4(matrix);
    scene.add(box);

    return () => {
      scene.remove(box);
      geometry.dispose();
    };
  }, [three, position, scale, quaternion]);

  return null;
};

export default Placeholder;
