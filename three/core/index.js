import * as THREE from "three";
import { v4 as uuidv4 } from "uuid";
import CameraControls from "./helpers/CameraControls";
import SceneControls from "./helpers/SceneControls";

const InitThree = ({ canvas, alpha = true }) => {
  const { width, height } = canvas.getBoundingClientRect();

  const sceneControls = new SceneControls();
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha,
    preserveDrawingBuffer: true,
  });
  renderer.setSize(width, height);

  const camera = new THREE.PerspectiveCamera(75, width / height, 0.01, 1000);
  const cameraControls = new CameraControls(camera, renderer.domElement);

  const scene = sceneControls.getScene();
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
    scene: sceneControls,
    addBeforeRenderFunction,
    renderer,
    cameraControls,
  };
};

export default InitThree;
