export default `
varying vec2 vUv;

void main() {
  vUv = vec2(position.x, position.y)+.5;
  gl_Position = vec4(uv*2.0-1.0, 1.0, 1.0);
}
`;
