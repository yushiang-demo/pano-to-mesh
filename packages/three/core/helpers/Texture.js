import * as THREE from "three";
import shaders from "../../shaders";

const drawWaterMarkToCanvas = (baseImage, numberPerRow = 7) => {
  const canvas = document.createElement("canvas");
  const { width, height } = baseImage;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(baseImage, 0, 0);

  ctx.font = "72px Arial";
  ctx.fillStyle = "rgba(255, 255, 255, 0.2)";

  ctx.save();

  ctx.rotate(Math.PI / 4);
  ctx.translate(0, -height / 2);
  ctx.scale(2, 2);

  for (let i = 0; i < numberPerRow; i++) {
    for (let j = 0; j < numberPerRow; j++) {
      if (i % 2 === j % 2) {
        ctx.save();
        ctx.translate((i / numberPerRow) * width, (j / numberPerRow) * height);
        ctx.fillText("Powered by PanoToMesh", 0, 0);
        ctx.restore();
      }
    }
  }

  ctx.restore();

  return canvas.toDataURL();
};

export const exportTexture = (renderer, texture, withWaterMark) => {
  renderer.domElement.style.display = "none";
  const { width, height } = renderer.domElement;
  const textureSize = texture.image;
  renderer.setSize(textureSize.width, textureSize.height);
  const scene = new THREE.Scene();
  const geometry = new THREE.PlaneGeometry(1, 1, 1);
  const material = new THREE.ShaderMaterial({
    vertexShader: shaders.vertexShaders.screenPosition,
    fragmentShader: shaders.fragmentShaders.texture,
  });
  shaders.setUniforms.texture(material, {
    map: texture,
  });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  renderer.render(scene, new THREE.Camera());
  const dataURL = withWaterMark
    ? drawWaterMarkToCanvas(renderer.domElement)
    : renderer.domElement.toDataURL();

  geometry.dispose();
  renderer.setSize(width, height);
  renderer.domElement.style.display = "block";
  return dataURL;
};
