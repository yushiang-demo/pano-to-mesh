const setUniforms = (material, { color }) => {
  if (!material.uniforms.color) {
    material.uniforms.color = {};
  }
  material.uniforms.color.value = color;
};

export default setUniforms;
