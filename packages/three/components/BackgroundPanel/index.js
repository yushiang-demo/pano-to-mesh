import { useEffect } from "react";
import * as THREE from "three";

import Shaders from "../../shaders";
import { RENDER_ORDER } from "../../constant";

const BackgroundPanel = ({ three }) => {
  useEffect(() => {
    const { scene } = three;

    const geometry = new THREE.PlaneGeometry(1, 1);

    const material = new THREE.ShaderMaterial({
      vertexShader: Shaders.vertexShaders.backgroundPanel,
      fragmentShader: Shaders.fragmentShaders.color,
      transparent: true,
    });
    Shaders.setUniforms.color(material, {
      color: new THREE.Color(0xeeeeee),
    });

    const panel = new THREE.Mesh(geometry, material);
    panel.renderOrder = RENDER_ORDER.MESH;
    panel.frustumCulled = false;
    scene.add(panel);

    return () => {
      scene.remove(panel);
    };
  }, [three]);

  return null;
};

export default BackgroundPanel;
