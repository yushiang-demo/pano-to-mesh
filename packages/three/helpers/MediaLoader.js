import * as THREE from "three";
import Shaders from "../shaders";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

THREE.Cache.enabled = true;

const loadGLB = (() => {
  const loader = new GLTFLoader();
  return (src) => {
    return new Promise((resolve) => {
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

const loadAnimations = (gltf) => {
  const model = gltf.scene;
  const animations = gltf.animations;
  const mixer = new THREE.AnimationMixer(model);

  const actions = animations.map((clip) => {
    const { name, duration } = clip;
    const action = mixer.clipAction(clip);
    action.enabled = true;
    action.setEffectiveTimeScale(1);

    return { name, duration, action };
  });

  let current = null;
  const play = (clip) => {
    if (current) {
      current.action.setEffectiveWeight(0);
      current.action.reset();
    }

    current = actions.find(({ name }) => name === clip);
    if (current) {
      current.action.setEffectiveWeight(1);
      current.action.play();
      mixer.update();
    }
  };

  const setTime = (normalizedTime) => {
    if (!current) return;
    const time = current.duration * normalizedTime;
    mixer.setTime(time);
  };

  return { play, setTime };
};

export const getModal = async ({ src }) => {
  const gltf = await loadGLB(src);
  const animation = loadAnimations(gltf);

  const normalizeGroup = new THREE.Group();
  normalizeGroup.rotateX(Math.PI / 2);

  const mesh = gltf.scene;

  mesh.traverse((object) => {
    object.updateMatrixWorld(true);

    if (object.isMesh) {
      object.frustumCulled = false;
      object.castShadow = true;
    }
  });

  const boundingBox = new THREE.Box3();
  boundingBox.setFromObject(mesh, true);
  const size = new THREE.Vector3();
  boundingBox.getSize(size);
  const normalizeScale = Math.min(1 / size.x, 1 / size.y, 1 / size.z);
  normalizeGroup.scale.setScalar(normalizeScale);

  const object = new THREE.Group();
  normalizeGroup.add(mesh);
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
    animation,
    dispose,
  };
};
