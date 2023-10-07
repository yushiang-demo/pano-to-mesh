import * as THREE from "three";

const setUniforms = (material, { texture, cameraPosition }) => {
  if (!material.uniforms.tEquirect) {
    material.uniforms.tEquirect = {};
    material.uniforms.camerasPosition = new THREE.Vector3();
  }

  material.uniforms.tEquirect.value = texture;
  material.uniforms.tEquirect.value.minFilter = THREE.LinearFilter;
  material.uniforms.camerasPosition.value = cameraPosition;
};

export default setUniforms;
