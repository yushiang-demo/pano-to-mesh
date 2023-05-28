export default `
varying vec3 pos;
void main() {
    vec3 normal = normalize(cross(dFdx(pos), dFdy(pos)))/2.0f+0.5f;
    gl_FragColor = vec4(normal, 1.0);
}
`;
