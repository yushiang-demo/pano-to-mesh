const shader = `
attribute vec2 textureUV;
varying vec3 pos;

void main() {
  pos = vec3(position.x, position.y, position.z);
  gl_Position = vec4(textureUV*2.0-1.0,-1.0, 1.0);
}
`;

export default shader;
