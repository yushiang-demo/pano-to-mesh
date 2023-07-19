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
import Input from "../components/Input";
import Icons from "../components/Icon";
import Toolbar from "../components/Toolbar";

const Editor = ({ src }) => {
  const [imageSrc, setImageSrc] = useState(src);
  const panorama = Loaders.useTexture({ src: imageSrc });
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

  const onChange = (value) => {
    setImageSrc(value);
  };

  return (
    <PageContainer>
      <Toolbar>
        <Icons.panorama />
        <Input onChange={onChange} value={imageSrc} />
        <Icons.download />
      </Toolbar>
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
