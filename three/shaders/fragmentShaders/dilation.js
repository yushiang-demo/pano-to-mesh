export const setUniforms = (material, { kernel }) => {
  if (!material.uniforms.kernel) {
    material.uniforms.kernel = {};
  }
  material.uniforms.kernel.value = kernel;
};

const shader = `
uniform sampler2D texture0;
uniform int kernel;
uniform float width;
uniform float height;
varying vec2 vUv;

vec4 getDilatedColor(sampler2D tex, vec2 uv, int kernel){
    vec4 color = texture2D(tex, uv);

    if(color.a <1e-5){
        for(int currentKernel=1;currentKernel<=kernel;currentKernel++){
            float nearestDistance = 1e+3;
            vec4 nearestColor = color;
            bool foundColor = false;
            for(int i=-currentKernel;i<=currentKernel;i++){
                for(int j=-currentKernel;j<=currentKernel;j++){
                    if(i!=-currentKernel && i!=currentKernel && j!=-currentKernel && j!=currentKernel) break;

                    float i_f = float(i);
                    float j_f = float(j);

                    vec4 neighborColor = texture2D(tex, uv+vec2(i_f/width,j_f/height));
                    float distance = length(vec2(i,j));
                    if( (neighborColor.a > 1e-5) && (distance < nearestDistance) ){
                        nearestDistance = distance;
                        nearestColor = neighborColor;
                        foundColor = true;
                    }
                }
            }
            if(foundColor){
                return nearestColor;
            }
        }
    }

    return color;
}

void main()  {
	gl_FragColor =  getDilatedColor(texture0, vUv, kernel);
}
`;

export default shader;
