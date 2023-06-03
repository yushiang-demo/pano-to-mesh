import * as THREE from "three";
import { v4 as uuidv4 } from "uuid";

import OribitControl from "./OribitControl";

const InitThree = ({ canvas, alpha = true }) => {
  const { width, height } = canvas.getBoundingClientRect();
  const scene = new THREE.Scene();

  const renderer = new THREE.WebGLRenderer({ canvas, alpha });
  renderer.setSize(width, height);

  const camera = new THREE.PerspectiveCamera(75, width / height, 0.01, 1000);
  camera.position.set(0, 5, 0);
  const controls = new OribitControl(camera, renderer.domElement);
  controls.target.set(0, 1, 0);
  controls.domElement = renderer.domElement;

  const customRender = {};
  const animate = () => {
    const animeFrame = requestAnimationFrame(animate);
    renderer.render(scene, camera);
    Object.keys(customRender)
      .map((key) => customRender[key])
      .forEach((func) => func(renderer));
    return animeFrame;
  };

  const animeFrame = animate();

  const destroy = () => {
    cancelAnimationFrame(animeFrame);
  };

  const setCanvasSize = (width, height) => {
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  };

  const addRenderFunction = (func) => {
    let id = uuidv4();

    while (customRender[id] !== undefined) {
      id = uuidv4();
    }

    customRender[id] = func;
    return () => {
      delete customRender[id];
    };
  };

  return { destroy, setCanvasSize, scene, addRenderFunction };
};

export default InitThree;
