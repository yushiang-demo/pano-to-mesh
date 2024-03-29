import { useEffect, useState } from "react";
import * as THREE from "three";

const loader = new THREE.TextureLoader();

export const useTexture = ({ src }) => {
  const [texture, setTexture] = useState(null);

  useEffect(() => {
    loader.load(src, setTexture);
  }, [src]);

  return texture;
};
