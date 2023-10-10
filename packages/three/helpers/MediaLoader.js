import * as THREE from "three";
import Shaders from "../shaders";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

THREE.Cache.enabled = true;

const loadGLB = (() => {
  const loader = new GLTFLoader();
  return async (src) => {
    return new Promise(async (resolve) => {
      loader.load(src, (mesh) => {
        resolve(mesh);
      });
    });
  };
})();

const getTransformSetter = (object) => (transformation) => {
  const { position, quaternion, scale } = transformation;
  object.position.fromArray(position);
  object.quaternion.fromArray(quaternion);
  object.scale.fromArray(scale);
};

export const getBoxMesh = () => {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  geometry.translate(0, 0, 0.5);
  const material = new THREE.ShaderMaterial({
    transparent: true,
    vertexShader: Shaders.vertexShaders.worldPosition,
    fragmentShader: Shaders.fragmentShaders.textureBoundary,
  });
  const box = new THREE.Mesh(geometry, material);

  const dispose = () => {
    geometry.dispose();
  };

  return { object: box, setTransform: getTransformSetter(box), dispose };
};

export const getPlaneMesh = () => {
  const geometry = new THREE.PlaneGeometry(1, 1);
  const material = new THREE.ShaderMaterial({
    transparent: true,
    vertexShader: Shaders.vertexShaders.worldPosition,
    fragmentShader: Shaders.fragmentShaders.textureBoundary,
  });
  const object = new THREE.Mesh(geometry, material);

  const dispose = () => {
    geometry.dispose();
  };

  return { object, setTransform: getTransformSetter(object), dispose };
};

export const getModal = async (src) => {
  const modal = await loadGLB(src);

  const normalizeGroup = new THREE.Group();
  normalizeGroup.rotateX(Math.PI / 2);

  const mesh = modal.scene;
  normalizeGroup.add(mesh);

  const boundingBox = new THREE.Box3();

  mesh.traverse((object) => {
    if (object.isMesh) {
      boundingBox.expandByObject(object);
      object.frustumCulled = false;
    }
  });

  const size = new THREE.Vector3();
  boundingBox.getSize(size);
  const normalizeScale = Math.min(1 / size.x, 1 / size.y, 1 / size.z);
  normalizeGroup.scale.set(normalizeScale, normalizeScale, normalizeScale);

  const object = new THREE.Group();
  object.add(normalizeGroup);

  const dispose = () => {
    mesh.traverse((object) => {
      if (object.isMesh) {
        object.geometry.dispose();
        object.material.dispose();
      }
    });
  };

  const setTransform = (transformation) => {
    const { position, quaternion, scale } = transformation;
    object.position.fromArray(position);
    object.quaternion.fromArray(quaternion);

    const minScale = Math.min(...scale);
    const lockRatioScale = [minScale, minScale, minScale];
    object.scale.fromArray(lockRatioScale);
  };

  return {
    object,
    setTransform,
    dispose,
  };
};
