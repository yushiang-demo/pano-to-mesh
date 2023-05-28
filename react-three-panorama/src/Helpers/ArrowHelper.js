import { useEffect } from "react";
import * as THREE from "three";

const ArrowHelper = ({ three, origin, dir, length, color }) => {
  useEffect(() => {
    const { scene } = three;

    const rayDirection = new THREE.Vector3().fromArray(dir);
    rayDirection.normalize();
    const rayOrigin = new THREE.Vector3().fromArray(origin);

    const arrowHelper = new THREE.ArrowHelper(
      rayDirection,
      rayOrigin,
      length,
      color,
    );
    scene.add(arrowHelper);

    return () => {
      scene.remove(arrowHelper);
    };
  }, [origin, dir, length, color]);
  return null;
};

export default ArrowHelper;
