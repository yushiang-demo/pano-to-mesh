import * as THREE from "three";

const setUniforms = (material, { map, mouse }) => {
  if (!material.uniforms.map) {
    material.uniforms.map = {};
    material.uniforms.mouse = new THREE.Vector2();
  }
  material.uniforms.map.value = map;
  material.uniforms.mouse.value = mouse;
};

export default setUniforms;
