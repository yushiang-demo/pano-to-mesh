import * as THREE from "three";
import { useState, useEffect } from "react";
import ChromaKeyPanel from "../Core";

const Image = ({ data, ...props }) => {
  const [texture, setTexture] = useState(null);

  useEffect(() => {
    const texture = new THREE.TextureLoader().load(data.src);
    setTexture(texture);

    return () => {
      texture.dispose();
    };
  }, [data]);

  return <ChromaKeyPanel {...props} texture={texture} color={data.color} />;
};

export default Image;
