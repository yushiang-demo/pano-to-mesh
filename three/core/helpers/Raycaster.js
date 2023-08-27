import * as THREE from "three";
import { Mesh } from "three";

export const raycastGeometry = (origin, direction, geometry) => {
  const mesh = new Mesh(
    geometry,
    new THREE.MeshBasicMaterial({ color: 0xffffff })
  );

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

export const raycastMeshFromScreen = (
  [normalizedX, normalizedY],
  camera,
  mesh
) => {
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2(normalizedX * 2 - 1, -normalizedY * 2 + 1);
  raycaster.setFromCamera(pointer, camera);
  const intersects = raycaster.intersectObjects(mesh, true);

  const data = intersects.map(({ point, face: { normal } }) => ({
    faceNormal: [normal.x, normal.y, normal.z],
    point: [point.x, point.y, point.z],
  }));

  return data;
};
