import * as THREE from "three";
import { useEffect } from "react";
const Light = ({ three }) => {
  useEffect(() => {
    const { scene } = three;

    const light = new THREE.AmbientLight(0x404040); // soft white light
    scene.add(light);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    scene.add(directionalLight);

    return () => {
      scene.remove(light);
      scene.remove(directionalLight);
    };
  }, [three]);

  return null;
};

export default Light;
