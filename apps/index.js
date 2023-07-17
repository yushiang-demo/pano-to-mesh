import React, { useState } from "react";

import {
  Loaders,
  PanoramaOutline,
  PanoramaRoom,
  ThreeCanvas,
  PanoramaTexture,
} from "../three";
import useClick2AddWalls from "../hooks/useClick2AddWalls";
import CanvasSwitch from "../components/CanvasSwitch";
import PageContainer from "../components/PageContainer";

const Editor = ({ src }) => {
  const panorama = Loaders.useTexture({ src });
  const [panoramaOrigin, setPanoramaOrigin] = useState([0, 1.0, 0]);
  const [floorY] = useState(0.0);
  const [ceilingY, setCeilingY] = useState(2.0);
  const { wall3DCoord, eventHandlers } = useClick2AddWalls({
    panoramaOrigin,
    geometryInfo: { floorY, ceilingY },
    selectThresholdPixel: 5,
  });

  const props = {
    floorY,
    ceilingY,
    wallVertices: wall3DCoord,
    panorama,
    panoramaOrigin,
  };

  return (
    <PageContainer>
      <CanvasSwitch>
        <ThreeCanvas {...eventHandlers}>
          <PanoramaOutline {...props} />
        </ThreeCanvas>
        <ThreeCanvas>
          <PanoramaRoom {...props} />
        </ThreeCanvas>
        <ThreeCanvas>
          <PanoramaTexture {...props} />
        </ThreeCanvas>
      </CanvasSwitch>
    </PageContainer>
  );
};

export default Editor;
