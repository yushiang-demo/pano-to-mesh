export const setUniforms = (material, { cubeTexture }) => {
  if (!material.uniforms.cubeTexture) {
    material.uniforms.cubeTexture = {};
  }
  material.uniforms.cubeTexture.value = cubeTexture;
};

const shader = `
precision mediump float;
uniform samplerCube cubeTexture;
varying vec2 vUv;
#define M_PI 3.1415926535897932384626433832795
void main()  {
	vec2 uv = vUv;
	float longitude = uv.x * 2. * M_PI - M_PI;
	float latitude = (1.-uv.y) * M_PI;
	vec3 dir = vec3(
		- sin( longitude ) * sin( latitude ),
		cos( latitude ),
		- cos( longitude ) * sin( latitude )
	);
	normalize( dir );
	gl_FragColor = textureCube( cubeTexture, dir );
}
`;

export default shader;
