import * as THREE from "three";
import { v4 as uuidv4 } from "uuid";
import CameraControls from "./helpers/CameraControls";

function Three({ canvas, alpha = true, interactElement }) {
  const { width, height } = canvas.getBoundingClientRect();

  const scene = new THREE.Scene();
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha,
    preserveDrawingBuffer: true,
  });
  renderer.setSize(width, height);

  const camera = new THREE.PerspectiveCamera(75, width / height, 0.01, 1000);
  const cameraControls = new CameraControls(camera, interactElement);

  const customRender = {};
  const animate = () => {
    const animeFrame = requestAnimationFrame(animate);
    Object.keys(customRender)
      .map((key) => customRender[key])
      .forEach((func) => func(renderer));
    renderer.render(scene, camera);

    return animeFrame;
  };

  const animeFrame = animate();

  const destroy = () => {
    cancelAnimationFrame(animeFrame);
    cameraControls.destroy();
  };

  const setCanvasSize = (width, height) => {
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  };

  const addBeforeRenderFunction = (func) => {
    let id = uuidv4();

    while (customRender[id] !== undefined) {
      id = uuidv4();
    }

    customRender[id] = func;
    return () => {
      delete customRender[id];
    };
  };

  return {
    destroy,
    setCanvasSize,
    scene,
    addBeforeRenderFunction,
    renderer,
    cameraControls,
  };
}

export default Three;
