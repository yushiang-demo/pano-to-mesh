import * as THREE from "three";
import { Mesh } from "three";

export const findIntersectionOfXZPlane = (origin, direction, floorY) => {
  const floorGeometry = new THREE.PlaneGeometry(100, 100);
  floorGeometry.applyMatrix4(
    new THREE.Matrix4().makeRotationAxis(
      new THREE.Vector3(-1, 0, 0),
      Math.PI / 2,
    ),
  );
  floorGeometry.applyMatrix4(new THREE.Matrix4().makeTranslation(0, floorY, 0));

  const mesh = new Mesh(floorGeometry,   new THREE.MeshBasicMaterial({ color: 0xffffff })  );

  const rayOrigin = new THREE.Vector3().fromArray(origin);
  const rayDirection = new THREE.Vector3().fromArray(direction);
  const raycaster = new THREE.Raycaster(rayOrigin, rayDirection, 1e-5, 1e5);
  const intersect = raycaster.intersectObject(mesh);
  if (intersect[0]) {
    const { x, z } = intersect[0].point;
    return [x, z];
  }
  return null;
};
