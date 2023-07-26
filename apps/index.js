import React, { useRef, useState } from "react";

import {
  Loaders,
  PanoramaOutline,
  ThreeCanvas,
  PanoramaTextureMesh,
  Core,
} from "../three";
import useClick2AddWalls from "../hooks/useClick2AddWalls";
import CanvasSwitch from "../components/CanvasSwitch";
import PageContainer from "../components/PageContainer";
import Input from "../components/Input";
import Icons from "../components/Icon";
import Toolbar from "../components/Toolbar";

const dev = process.env.NODE_ENV === "development";
const Editor = ({ src }) => {
  const textureCanvasRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(src);
  const panorama = Loaders.useTexture({ src: imageSrc });
  const [panoramaOrigin, setPanoramaOrigin] = useState([0, 1.0, 0]);
  const [floorY] = useState(0.0);
  const [ceilingY, setCeilingY] = useState(2.0);
  const { layout2D, eventHandlers } = useClick2AddWalls({
    panoramaOrigin,
    geometryInfo: { floorY, ceilingY },
    selectThresholdPixel: 5,
  });

  const props = {
    floorY,
    ceilingY,
    layout2D,
    panorama,
    panoramaOrigin,
  };

  const onChange = (value) => {
    setImageSrc(value);
  };

  const onDownload = () => {
    const downloadImage = (filename, url) => {
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    };
    Core.downloadMesh("test", layout2D, ceilingY, floorY);
    downloadImage("test.png", textureCanvasRef.current.getTexture());
  };

  return (
    <PageContainer>
      <Toolbar>
        <Icons.panorama />
        <Input onChange={onChange} value={imageSrc} />
        {!!layout2D.length && <Icons.download onClick={onDownload} />}
      </Toolbar>
      <CanvasSwitch>
        <ThreeCanvas {...eventHandlers} dev={dev}>
          <PanoramaOutline {...props} />
        </ThreeCanvas>
        <ThreeCanvas dev={dev}>
          <PanoramaTextureMesh {...props} />
        </ThreeCanvas>
      </CanvasSwitch>
    </PageContainer>
  );
};

export default Editor;
