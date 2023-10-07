const shader = `
uniform sampler2D texture0;
uniform sampler2D texture1;
uniform float percentage;
varying vec2 vUv;

void main()  {
    
  vec4 color0 = texture2D(texture0, vUv);
  vec4 color1 = texture2D(texture1, vUv);
	gl_FragColor = mix(color0,color1,percentage);
}
`;

export default shader;
