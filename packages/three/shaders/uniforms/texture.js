const setUniforms = (material, { map }) => {
  if (!material.uniforms.map) {
    material.uniforms.map = {};
  }
  material.uniforms.map.value = map;
};

export default setUniforms;
