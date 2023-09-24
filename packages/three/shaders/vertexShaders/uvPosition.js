const shader = `
varying vec3 pos;

void main() {
  pos = vec3(position.x, position.y, position.z);
  gl_Position = vec4(uv*2.0-1.0,-1.0, 1.0);
}
`;

export default shader;
