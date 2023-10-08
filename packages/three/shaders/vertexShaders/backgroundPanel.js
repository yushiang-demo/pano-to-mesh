const shader = `

void main() {
  gl_Position = vec4(uv*2.0-1.0, 1.0, 1.0);
}
`;

export default shader;
