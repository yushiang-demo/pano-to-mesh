import { useEffect, useRef } from "react";
import * as THREE from "three";

import Shaders from "../../../shaders";
import { RENDER_ORDER } from "../../../constant";

const ChromaKeyPanel = ({
  three,
  position,
  scale,
  quaternion,
  texture,
  color,
}) => {
  const materialRef = useRef(null);
  const meshRef = useRef(null);
  useEffect(() => {
    const { scene } = three;

    const geometry = new THREE.PlaneGeometry(1, 1);

    const material = new THREE.ShaderMaterial({
      vertexShader: Shaders.vertexShaders.worldPosition,
      fragmentShader: Shaders.fragmentShaders.chromaKeyTexture,
      transparent: true,
    });
    materialRef.current = material;

    const panel = new THREE.Mesh(geometry, material);
    panel.renderOrder = RENDER_ORDER.MESH;
    meshRef.current = panel;

    scene.add(panel);

    return () => {
      scene.remove(panel);
      geometry.dispose();
      material.dispose();
    };
  }, [three]);

  useEffect(() => {
    if (!meshRef.current) return;

    const object = meshRef.current;
    object.position.fromArray(position);
    object.quaternion.fromArray(quaternion);
    object.scale.fromArray(scale);
  }, [position, scale, quaternion]);

  useEffect(() => {
    if (!materialRef.current) return;

    Shaders.setUniforms.chromaKeyColor(materialRef.current, {
      color: new THREE.Color(color),
    });

    Shaders.setUniforms.texture(materialRef.current, {
      map: texture,
    });
  }, [texture, color]);

  return null;
};

export default ChromaKeyPanel;
