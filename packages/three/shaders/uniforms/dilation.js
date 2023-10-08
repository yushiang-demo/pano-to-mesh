const setUniforms = (material, { kernel }) => {
  if (!material.uniforms.kernel) {
    material.uniforms.kernel = {};
  }
  material.uniforms.kernel.value = kernel;
};

export default setUniforms;
