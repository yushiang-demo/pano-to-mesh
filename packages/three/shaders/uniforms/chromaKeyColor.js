const setUniforms = (material, { color }) => {
  if (!material.uniforms.color) {
    material.uniforms.chromaKeyColor = {};
  }
  material.uniforms.chromaKeyColor.value = color;
};

export default setUniforms;
