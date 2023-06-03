import * as THREE from "three";

export const setUniforms = (material, { texture, cameraPosition }) => {
  if (!material.uniforms.tEquirect) {
    material.uniforms.tEquirect = {};
    material.uniforms.camerasPosition = new THREE.Vector3();
  }

  material.uniforms.tEquirect.value = texture;
  material.uniforms.tEquirect.value.minFilter = THREE.LinearFilter;
  material.uniforms.camerasPosition.value = cameraPosition;
};

export default `
#define M_PI 3.14159
uniform sampler2D tEquirect;
uniform vec3 camerasPosition;
varying vec3 pos;

vec2 worldToEquirectangularUV(vec3 flatCoord)
{   
    vec2 uv = vec2(
        atan(flatCoord.x, flatCoord.z),
        acos(flatCoord.y)
    ) / vec2(2.*M_PI, M_PI);
    return vec2(mod(uv.x+1.0,1.0),1.0-uv.y);   
}

void main() {
    vec2 uv = worldToEquirectangularUV(normalize(pos-camerasPosition));
    gl_FragColor=texture2D(tEquirect, uv);
}
`;
