import * as THREE from "three";

import Shaders from "../shaders";

const CaptureCubemap = () => {
  const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(1024);

  const cubeCamera = new THREE.CubeCamera(0.01, 100000, cubeRenderTarget);

  const setCameraPosition = (vec3) => {
    cubeCamera.position.copy(vec3);
  };

  return {
    setCameraPosition,
    cubeCamera,
    cubeTexture: cubeRenderTarget.texture,
  };
};

const CapturePanorama = (targetScene, width, height) => {
  const { setCameraPosition, cubeCamera, cubeTexture } = CaptureCubemap();

  const geometry = new THREE.PlaneGeometry(1, 1);
  const material = new THREE.ShaderMaterial({
    vertexShader: Shaders.vertexShaders.screenPosition,
    fragmentShader: Shaders.fragmentShaders.cubemapToEquirectangular,
  });
  Shaders.setUniforms.cubemapToEquirectangular(material, {
    cubeTexture,
  });
  const mesh = new THREE.Mesh(geometry, material);
  const scene = new THREE.Scene();
  scene.add(mesh);

  const panorama = new THREE.WebGLRenderTarget(width, height);

  const render = (renderer) => {
    renderer.setRenderTarget(panorama);
    renderer.render(scene, new THREE.Camera());

    renderer.setRenderTarget(null);
    cubeCamera.update(renderer, targetScene);
  };

  return { render, setCameraPosition, texture: panorama.texture };
};

export default CapturePanorama;
