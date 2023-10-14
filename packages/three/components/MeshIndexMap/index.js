import { useEffect, useRef, forwardRef } from "react";
import * as THREE from "three";
import Shaders from "../../shaders";
import { RENDER_ORDER } from "../../constant";

const TEXTURE_SIZE = 4096;
const MeshIndexMap = ({ three, meshes, mouse }, ref) => {
  const materialRef = useRef(
    new THREE.ShaderMaterial({
      transparent: true,
      vertexShader: Shaders.vertexShaders.screenPosition,
      fragmentShader: Shaders.fragmentShaders.hoverEffect,
    })
  );
  useEffect(() => {
    const colors = meshes.map((_, index) =>
      Math.trunc((index / meshes.length) * 0xffffff)
    );
    const coloredMesh = meshes
      .filter((mesh) => !!mesh)
      .map((mesh, index) => {
        mesh.object.traverse((child) => {
          if (child.material) {
            child.material.dispose();
            child.material = new THREE.MeshBasicMaterial({
              color: colors[index],
            });
          }
        });
        return mesh;
      });

    const {
      addBeforeRenderEvent,
      cameraControls,
      scene: globalScene,
      renderer,
    } = three;

    const scene = new THREE.Scene();
    const frameBuffer = new THREE.WebGLRenderTarget(TEXTURE_SIZE, TEXTURE_SIZE);
    const render = () => {
      renderer.setRenderTarget(frameBuffer);
      renderer.render(scene, cameraControls.getCamera());
      renderer.setRenderTarget(null);
    };

    const stopRenderTexture = addBeforeRenderEvent(render);

    coloredMesh.forEach((mesh) => scene.add(mesh.object));

    const geometry = new THREE.PlaneGeometry(1, 1);
    const material = materialRef.current;
    Shaders.setUniforms.hoverEffect(material, {
      map: frameBuffer.texture,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.renderOrder = RENDER_ORDER.HOVER_PANEL;
    mesh.frustumCulled = false;
    globalScene.add(mesh);

    const getIndex = (mouseX, mouseY) => {
      const pixel = new Uint8Array(4);
      renderer.readRenderTargetPixels(
        frameBuffer,
        mouseX * TEXTURE_SIZE,
        mouseY * TEXTURE_SIZE,
        1,
        1,
        pixel
      );
      if (!pixel[3]) return null;
      const color = pixel[0] * 2 ** 16 + pixel[1] * 2 ** 8 + pixel[2] * 2 ** 0;
      const findIndexOfNearestNumber = (arr, target) => {
        const diffArr = arr.map((x) => Math.abs(target - x));
        const minNumber = Math.min(...diffArr);
        const index = diffArr.findIndex((x) => x === minNumber);
        return index;
      };
      const index = findIndexOfNearestNumber(colors, color);
      return index;
    };

    if (ref) {
      ref.current = {
        getIndex,
      };
    }

    render();
    return () => {
      coloredMesh.forEach((mesh) => scene.remove(mesh.object));
      coloredMesh.forEach((mesh) => mesh.dispose());

      geometry.dispose();
      globalScene.remove(mesh);
      stopRenderTexture();

      frameBuffer.dispose();
      frameBuffer.texture.dispose();
    };
  }, [three, meshes, ref]);

  useEffect(() => {
    if (!materialRef.current) return;
    const material = materialRef.current;
    const [mouseX, mouseY] = mouse || [-1, -1];
    Shaders.setUniforms.hoverEffect(material, {
      mouse: new THREE.Vector2(mouseX, mouseY),
    });
  }, [mouse]);

  return null;
};

export default forwardRef(MeshIndexMap);
