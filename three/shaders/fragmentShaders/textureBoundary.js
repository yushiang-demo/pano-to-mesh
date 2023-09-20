const shader = `
varying vec2 vUv;

void main() {
  float thickness = 5e-3;
  float boundary = 0.5 - thickness;
  float opacity = 1.0;
  
  if (abs(vUv.x - 0.5) > boundary ||
      abs(vUv.y - 0.5) > boundary) {
    gl_FragColor = vec4(0.0, 0.0, 0.0, opacity);
  } else {
    gl_FragColor = vec4(1.0, 1.0, 1.0, opacity);
  }
}
`;

export default shader;
