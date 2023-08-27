import * as THREE from "three";

import {
  CSS3DRenderer,
  CSS3DObject,
} from "three/addons/renderers/CSS3DRenderer.js";

function Css3D({ container, camera }) {
  const renderer = new CSS3DRenderer({
    element: container,
  });
  const scene = new THREE.Scene();

  const setSize = (width, height) => {
    renderer.setSize(width, height);
  };

  const create3DElement = ([width, height]) => {
    const element = document.createElement("div");
    element.style.width = `${width}px`;
    element.style.height = `${height}px`;

    const group = new THREE.Group();
    const object = new CSS3DObject(element);
    object.scale.set(1 / width, 1 / height, 1);

    group.add(object);
    scene.add(group);
    const remove = () => {
      scene.remove(group);
      group.remove(object);
      if (
        object.element instanceof Element &&
        object.element.parentNode !== null
      ) {
        object.element.parentNode.removeChild(object.element);
      }
    };
    return { object3D: group, remove, element };
  };

  const render = () => {
    renderer.render(scene, camera);
  };

  return {
    setSize,
    render,
    create3DElement,
  };
}

export default Css3D;
