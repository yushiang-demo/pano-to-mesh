const shader = `
uniform sampler2D map;
uniform vec2 mouse;
varying vec2 vUv;

void main() {
  vec4 mouseColor = texture2D(map, mouse);
  if (mouseColor.a < 1e-3) {
    discard;
  }
  if (distance(texture2D(map, vUv), mouseColor) < 1e-3) {
    gl_FragColor = vec4(.0, .0, .0, 0.1);
  } else {
    discard;
  }
}
`;

export default shader;
