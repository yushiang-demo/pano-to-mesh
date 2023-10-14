import * as THREE from "three";
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

  const getEventRegister = (funcs) => {
    return (func) => {
      let id = THREE.MathUtils.generateUUID();

      while (funcs[id] !== undefined) {
        id = THREE.MathUtils.generateUUID();
      }

      funcs[id] = func;
      return () => {
        delete funcs[id];
      };
    };
  };

  const addBeforeRenderEvent = getEventRegister(customRender);

  return {
    destroy,
    setCanvasSize,
    scene,
    addBeforeRenderEvent,
    renderer,
    cameraControls,
  };
}

export default Three;
