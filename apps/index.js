import React, {  useState } from "react";

import {
  Loaders,
  PanoramaOutline,
  PanoramaRoom,
  ThreeCanvas,
} from "../three";
import useClick2AddWalls from "../hooks/useClick2AddWalls"

const Editor = ({ src }) => {
  const panorama = Loaders.useTexture({ src });
  const [panoramaOrigin, setPanoramaOrigin] = useState([0, 1.0, 0]);
  const [floorY, setFloorY] = useState(0.0);
  const [ceilingY, setCeilingY] = useState(2.0);
  const { wall3DCoord, eventHandlers } = useClick2AddWalls({
    panoramaOrigin,
    geometryInfo: { floorY, ceilingY },
    selectThresholdPixel: 5,
  });

  return (
    <>
      <ThreeCanvas {...eventHandlers}>
        <PanoramaOutline
          floorY={floorY}
          ceilingY={ceilingY}
          wallVertices={wall3DCoord}
          panorama={panorama}
          panoramaOrigin={panoramaOrigin}
        />
      </ThreeCanvas>
      <ThreeCanvas>
        <PanoramaRoom
          floorY={floorY}
          ceilingY={ceilingY}
          wallVertices={wall3DCoord}
          panorama={panorama}
          panoramaOrigin={panoramaOrigin}
        />
      </ThreeCanvas>
    </>
  );
};

export default Editor;
