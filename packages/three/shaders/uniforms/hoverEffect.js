import * as THREE from "three";

const setUniforms = (material, { map, mouse }) => {
  if (!material.uniforms.map) {
    material.uniforms.map = {};
  }

  if (!material.uniforms.mouse) {
    material.uniforms.mouse = new THREE.Vector2();
  }

  if (map) {
    const oldTexture = material.uniforms.map.value;
    material.uniforms.map.value = map;
    oldTexture?.dispose();
  }

  if (mouse) {
    material.uniforms.mouse.value = mouse;
  }
};

export default setUniforms;
