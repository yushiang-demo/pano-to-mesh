import * as THREE from "three";

const withTransform = (callback) => {
  return () => {
    const { object, ...props } = callback();

    const setTransform = (transformation) => {
      const { position, quaternion, scale } = transformation;
      object.position.fromArray(position);
      object.quaternion.fromArray(quaternion);
      object.scale.fromArray(scale);
    };

    return { object, setTransform, ...props };
  };
};

export const getBoxMesh = withTransform(() => {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  geometry.translate(0, 0, 0.5);
  const material = new THREE.MeshBasicMaterial({
    transparent: true,
    polygonOffset: true,
    polygonOffsetFactor: 1,
  });
  const wireframeMaterial = new THREE.MeshBasicMaterial({
    transparent: true,
    wireframe: true,
    color: new THREE.Color(0, 0, 0),
  });
  const box = new THREE.Mesh(geometry, material);
  const boxWireframe = new THREE.Mesh(geometry, wireframeMaterial);

  const object = new THREE.Object3D();
  object.add(box);
  object.add(boxWireframe);

  const dispose = () => {
    geometry.dispose();
  };

  return { object, dispose };
});

export const getPlaneMesh = withTransform(() => {
  const geometry = new THREE.PlaneGeometry(1, 1);
  const material = new THREE.MeshBasicMaterial({
    transparent: true,
    opacity: 0,
  });
  const object = new THREE.Mesh(geometry, material);

  const dispose = () => {
    geometry.dispose();
  };

  return { object, dispose };
});
