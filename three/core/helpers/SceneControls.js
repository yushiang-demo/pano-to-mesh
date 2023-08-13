import * as THREE from "three";

const changeEvent = "change";

function SceneControls() {
  const scene = new THREE.Scene();

  const eventTarget = new EventTarget();

  const dispatchEvent = (eventName) => {
    const event = new CustomEvent(eventName);
    eventTarget.dispatchEvent(event);
  };

  return Object.assign(eventTarget, {
    getScene: () => {
      return scene;
    },
    add: (object) => {
      scene.add(object);
      dispatchEvent(changeEvent);
    },
    remove: (object) => {
      scene.remove(object);
      dispatchEvent(changeEvent);
    },
    onChange: (callback) => {
      eventTarget.addEventListener(changeEvent, callback);
      return () => eventTarget.removeEventListener(changeEvent, callback);
    },
  });
}

export default SceneControls;
