const setUniforms = (material, { cubeTexture }) => {
  if (!material.uniforms.cubeTexture) {
    material.uniforms.cubeTexture = {};
  }
  material.uniforms.cubeTexture.value = cubeTexture;
};

export default setUniforms;
