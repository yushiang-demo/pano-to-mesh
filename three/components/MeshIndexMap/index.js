import { useEffect, useState } from "react";
import * as THREE from "three";
import Shaders from "../../shaders";

const TEXTURE_SIZE = 4096;
const MeshIndexMap = ({ three, meshes, mouse }) => {
  const [frameBuffer] = useState(
    new THREE.WebGLRenderTarget(TEXTURE_SIZE, TEXTURE_SIZE)
  );

  useEffect(() => {
    return () => {
      frameBuffer.dispose();
    };
  }, [frameBuffer]);

  useEffect(() => {
    const transformedMeshes = meshes
      .map(({ mesh, transformation }) => {
        const { position, quaternion, scale } = transformation;
        const matrix = new THREE.Matrix4().compose(
          new THREE.Vector3().fromArray(position),
          new THREE.Quaternion().fromArray(quaternion),
          new THREE.Vector3().fromArray(scale)
        );
        mesh.object.applyMatrix4(matrix);
        return mesh;
      })
      .map((mesh, index) => {
        mesh.object.traverse((child) => {
          if (child.material) {
            child.material.dispose();
            const color = Math.trunc((index / meshes.length) * 0xffffff);
            child.material = new THREE.MeshBasicMaterial({
              color,
            });
          }
        });
        return mesh;
      });

    const {
      addBeforeRenderFunction,
      cameraControls,
      scene: globalScene,
    } = three;

    const scene = new THREE.Scene();

    const render = (renderer) => {
      renderer.setRenderTarget(frameBuffer);
      renderer.render(scene, cameraControls.getCamera());
      renderer.setRenderTarget(null);
    };

    const stopRenderTexture = addBeforeRenderFunction(render);

    transformedMeshes.forEach((mesh) => scene.add(mesh.object));

    const geometry = new THREE.PlaneGeometry(1, 1);
    const material = new THREE.ShaderMaterial({
      vertexShader: Shaders.vertexShaders.screenPosition,
      fragmentShader: Shaders.fragmentShaders.hoverEffect,
    });
    const [mouseX, mouseY] = mouse;
    Shaders.setUniforms.hoverEffect(material, {
      map: frameBuffer.texture,
      mouse: new THREE.Vector2(mouseX, mouseY),
    });
    const mesh = new THREE.Mesh(geometry, material);
    globalScene.add(mesh);

    return () => {
      transformedMeshes.forEach((mesh) => scene.remove(mesh.object));
      transformedMeshes.forEach((mesh) => mesh.dispose());

      geometry.dispose();
      globalScene.remove(mesh);
      stopRenderTexture();
    };
  }, [three, meshes, mouse]);

  return null;
};

export default MeshIndexMap;
