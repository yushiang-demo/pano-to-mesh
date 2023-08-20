import React, { useEffect, useRef, useMemo } from "react";

import { Loaders, ThreeCanvas, PanoramaProjectionMesh } from "../three";
import useClick2AddWalls from "../hooks/useClick2AddWalls";

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

  useEffect(() => {
    const removeSceneEvent = threeRef.current.scene.onChange(({ target }) => {
      const scene = target.getScene();
      threeRef.current.cameraControls.focus(scene);
    });

    return () => {
      removeSceneEvent();
    };
  }, []);

  return (
    <ThreeCanvas dev={dev} ref={threeRef}>
      <PanoramaProjectionMesh {...textureMeshProps} />
    </ThreeCanvas>
  );
};

const PropsParser = ({ data }) => {
  if (!data) return null;
  return <Viewer data={data} />;
};

export default PropsParser;
