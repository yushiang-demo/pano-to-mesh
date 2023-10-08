const shader = `
attribute vec3 color;
varying vec3 pos;
varying vec4 vertexColor;
varying vec2 vUv;

void main() {
  vUv = uv;
  pos = vec3(position.x, position.y, position.z);
  vertexColor = vec4(color,1.0);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export default shader;
