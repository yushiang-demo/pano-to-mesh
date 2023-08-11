const shader = `
varying vec4 vertexColor;

void main()  {
	gl_FragColor = vertexColor;
}
`;

export default shader;
