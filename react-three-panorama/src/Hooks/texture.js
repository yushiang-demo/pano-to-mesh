import { useEffect, useState } from "react";
import * as THREE from "three";

export const useTexture = ({ src }) => {
  const [texture, setTexture] = useState(null);

  useEffect(() => {
    setTexture(new THREE.TextureLoader().load(src));
  }, [src]);

  return texture;
};
