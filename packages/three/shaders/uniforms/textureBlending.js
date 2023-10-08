const setUniforms = (material, { texture0, texture1, percentage }) => {
  if (!material.uniforms.texture0) {
    material.uniforms.texture0 = {};
    material.uniforms.texture1 = {};
    material.uniforms.percentage = {};
  }
  material.uniforms.texture0.value = texture0;
  material.uniforms.texture1.value = texture1;
  material.uniforms.percentage.value = percentage;
};

export default setUniforms;
