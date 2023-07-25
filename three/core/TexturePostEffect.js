import * as THREE from "three";

import Shaders from "../shaders";

const TexturePostEffect = (texture, fragmentShader) => {
  const { width, height } = texture.image;

  const scene = new THREE.Scene();
  const geometry = new THREE.PlaneGeometry(1, 1);
  const material = new THREE.ShaderMaterial({
    uniforms: {
      texture0: {
        value: texture,
      },
      width: {
        value: width,
      },
      height: {
        value: height,
      },
    },
    vertexShader: Shaders.vertexShaders.screenPosition,
    fragmentShader,
  });

  const panel = new THREE.Mesh(geometry, material);
  scene.add(panel);

  const outline = new THREE.WebGLRenderTarget(width, height);

  const render = (renderer) => {
    renderer.setRenderTarget(outline);
    renderer.render(scene, new THREE.Camera());
    renderer.setRenderTarget(null);
  };

  const dispose = () => {
    outline.dispose();
    geometry.dispose();
  };

  return { render, texture: outline.texture, dispose };
};

export default TexturePostEffect;
