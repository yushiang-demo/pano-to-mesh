import React from "react";

import { Loaders, ThreeCanvas, PanoramaProjectionMesh } from "../three";

const dev = process.env.NODE_ENV === "development";
const Viewer = ({ ceilingY, floorY, layout2D, panorama, panoramaOrigin }) => {
  const textureMeshProps = {
    ceilingY,
    floorY,
    layout2D,
    panorama: Loaders.useTexture({ src: panorama }),
    panoramaOrigin,
  };

  return (
    <ThreeCanvas dev={dev}>
      <PanoramaProjectionMesh {...textureMeshProps} />
    </ThreeCanvas>
  );
};

const PropsParser = ({ data }) => {
  if (!data) return null;
  return <Viewer {...data} />;
};

export default PropsParser;
