export default `
varying vec3 pos;

void main() {
  pos = vec3(position.x, position.y, position.z);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;
