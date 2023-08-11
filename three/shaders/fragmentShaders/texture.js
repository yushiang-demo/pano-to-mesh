export const setUniforms = (material, { map }) => {
  if (!material.uniforms.map) {
    material.uniforms.map = {};
  }
  material.uniforms.map.value = map;
};

const shader = `
uniform sampler2D map;
varying vec2 vUv;

void main()  {
    gl_FragColor = texture2D(map, vUv);
}
`;

export default shader;
