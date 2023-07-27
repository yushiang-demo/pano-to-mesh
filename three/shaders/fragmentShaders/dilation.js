export const setUniforms = (material, { kernel }) => {
  if (!material.uniforms.kernel) {
    material.uniforms.kernel = {};
  }
  material.uniforms.kernel.value = kernel;
};

export default `
uniform sampler2D texture0;
uniform float kernel;
uniform float width;
uniform float height;
varying vec2 vUv;

vec4 getDilatedColor(sampler2D tex, vec2 uv, float kernel){
    vec4 color = texture2D(tex, uv);

    if(color.a <1e-5){
        float nearestDistance = 1e+3;
        vec4 nearestColor = color;
        for(float i=-kernel;i<kernel;i++){
            for(float j=-kernel;j<kernel;j++){
                vec4 neighborColor = texture2D(tex, uv+vec2(i/width,j/height));
                float distance = length(vec2(i,j));
                if( (neighborColor.a > 1e-5) && (distance < nearestDistance) ){
                    nearestDistance = distance;
                    nearestColor = neighborColor;
                }
            }
        }

        return nearestColor;
    }

    return color;
}

void main()  {
	gl_FragColor =  getDilatedColor(texture0, vUv, kernel);
}
`;
