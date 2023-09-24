const shader = `
uniform sampler2D texture0;
uniform float width;
uniform float height;
varying vec2 vUv;

float isEdge(sampler2D tex, vec2 uv, float kernel){
    vec4 color = texture2D(tex, uv);

    for(float i=-kernel;i<kernel;i++){
        for(float j=-kernel;j<kernel;j++){
            vec4 neighborColor = texture2D(tex, uv+vec2(i/width,j/height));
            if(distance(color,neighborColor)>1e-5){
                return 1.;
            }
        }
    }
    return 0.;
}

void main()  {
    float color = isEdge(texture0, vUv, 3.);
    
	gl_FragColor = vec4(color,color,color,1.0);
}
`;

export default shader;
