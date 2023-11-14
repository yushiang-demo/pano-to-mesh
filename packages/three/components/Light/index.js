import * as THREE from "three";
import { useEffect } from "react";
const Light = ({ three }) => {
  useEffect(() => {
    const { scene } = three;

    const light = new THREE.AmbientLight(0xffffff, 0.5); // soft white light
    scene.add(light);

    const directionalLight = new THREE.DirectionalLight(0xffffff);
    scene.add(directionalLight);

    return () => {
      scene.remove(light);
      scene.remove(directionalLight);
    };
  }, [three]);

  return null;
};

export default Light;
