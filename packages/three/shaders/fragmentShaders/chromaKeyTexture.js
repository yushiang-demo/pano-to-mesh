const shader = `
uniform vec3 chromaKeyColor;
uniform sampler2D map;

varying vec2 vUv;

float threshold = 1e-1;
void main()  {
    vec4 pixel = texture2D(map, vUv);
    float diff = distance(vec3(pixel.xyz), chromaKeyColor);
    if(diff<threshold){
        gl_FragColor = vec4(0,0,0,0);
    }else{
        gl_FragColor = pixel;
    }
}
`;

export default shader;
