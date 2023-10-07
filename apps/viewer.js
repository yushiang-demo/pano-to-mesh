import React, { useRef, useMemo } from "react";

import {
  Loaders,
  ThreeCanvas,
  PanoramaProjectionMesh,
  BackgroundPanel,
} from "@pano-to-mesh/three";
import useClick2AddWalls from "../hooks/useClick2AddWalls";
import MediaManager from "../components/MediaManager";

const dev = process.env.NODE_ENV === "development";
const Viewer = ({ data }) => {
  const threeRef = useRef(null);

  const geometryInfo = useMemo(
    () => ({
      floorY: data.floorY,
      ceilingY: data.ceilingY,
    }),
    [data]
  );
  const { layout2D } = useClick2AddWalls({
    defaultData: data.layout2D,
    panoramaOrigin: data.panoramaOrigin,
    geometryInfo,
    selectThresholdPixel: 5,
  });

  const textureMeshProps = {
    ...data,
    layout2D,
    panorama: Loaders.useTexture({ src: data.panorama }),
  };

  const onLoad = (mesh) => {
    threeRef.current.cameraControls.focus(mesh);
  };

  return (
    <ThreeCanvas dev={dev} ref={threeRef}>
      <BackgroundPanel />
      <PanoramaProjectionMesh {...textureMeshProps} onLoad={onLoad} />
      <MediaManager data={data.media} />
    </ThreeCanvas>
  );
};

const PropsParser = ({ data }) => {
  if (!data) return null;
  return <Viewer data={data} />;
};

export default PropsParser;
