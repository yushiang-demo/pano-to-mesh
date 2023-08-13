import React, { useEffect, useRef } from "react";

import { Loaders, ThreeCanvas, PanoramaProjectionMesh } from "../three";

const dev = process.env.NODE_ENV === "development";
const Viewer = ({ ceilingY, floorY, layout2D, panorama, panoramaOrigin }) => {
  const threeRef = useRef(null);
  const textureMeshProps = {
    ceilingY,
    floorY,
    layout2D,
    panorama: Loaders.useTexture({ src: panorama }),
    panoramaOrigin,
  };

  useEffect(() => {
    threeRef.current.cameraControls.setHemisphereConstraint();
    const removeEvent = threeRef.current.scene.onChange(({ target }) => {
      const scene = target.getScene();
      threeRef.current.cameraControls.focus(scene, true, true);
    });

    return () => removeEvent;
  }, []);

  return (
    <ThreeCanvas dev={dev} ref={threeRef}>
      <PanoramaProjectionMesh {...textureMeshProps} />
    </ThreeCanvas>
  );
};

const PropsParser = ({ data }) => {
  if (!data) return null;
  return <Viewer {...data} />;
};

export default PropsParser;
