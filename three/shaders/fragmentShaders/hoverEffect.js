import * as THREE from "three";

export const setUniforms = (material, { map, mouse }) => {
  if (!material.uniforms.map) {
    material.uniforms.map = {};
    material.uniforms.mouse = new THREE.Vector2();
  }
  material.uniforms.map.value = map;
  material.uniforms.mouse.value = mouse;
};

const shader = `
uniform sampler2D map;
uniform vec2 mouse;
varying vec2 vUv;

void main()  {
    vec4 mouseColor = texture2D(map,mouse);
    if(mouseColor.a<1e-3){
        discard;
    }
    if(distance(texture2D(map, vUv),mouseColor)<1e-3){
        gl_FragColor = mouseColor;
    }else{
        discard;
    }
}
`;

export default shader;
