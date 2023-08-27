import React, { useRef, useMemo, useState } from "react";

import { Loaders, ThreeCanvas, PanoramaProjectionMesh } from "../../three";
import useClick2AddWalls from "../../hooks/useClick2AddWalls";
import { useStoreDataToHash } from "../../hooks/useHash";
import MediaManager from "../../components/MediaManager";

const dev = process.env.NODE_ENV === "development";
const Editor = ({ data }) => {
  const threeRef = useRef(null);
  const [media] = useState(data.media);
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

  useStoreDataToHash({
    ...data,
    media,
  });

  const textureMeshProps = {
    ...data,
    layout2D,
    panorama: Loaders.useTexture({ src: data.panorama }),
  };

  const onLoad = (mesh) => {
    threeRef.current.cameraControls.focus(mesh, false, false, false);
  };

  return (
    <ThreeCanvas dev={dev} ref={threeRef}>
      <PanoramaProjectionMesh {...textureMeshProps} onLoad={onLoad} />
      <MediaManager data={media} />
    </ThreeCanvas>
  );
};

const PropsParser = ({ data }) => {
  if (!data) return null;
  return <Editor data={data} />;
};

export default PropsParser;
