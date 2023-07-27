import React, { useMemo, useRef, useState } from "react";

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

const downloadImage = (filename, url) => {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

const getCurrentFormattedTime = () => {
  const currentTime = new Date();
  const year = currentTime.getFullYear();
  const month = String(currentTime.getMonth() + 1).padStart(2, "0");
  const date = String(currentTime.getDate()).padStart(2, "0");
  const hours = String(currentTime.getHours()).padStart(2, "0");
  const minutes = String(currentTime.getMinutes()).padStart(2, "0");
  const seconds = String(currentTime.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${date}_${hours}-${minutes}-${seconds}`;
};

const dev = process.env.NODE_ENV === "development";
const Editor = ({ src }) => {
  const textureCanvasRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(src);
  const panorama = Loaders.useTexture({ src: imageSrc });
  const [panoramaOrigin, setPanoramaOrigin] = useState([0, 1.5, 0]);
  const [floorY] = useState(0.0);
  const [ceilingY, setCeilingY] = useState(2.0);
  const geometryInfo = useMemo(
    () => ({
      floorY,
      ceilingY,
    }),
    [floorY, ceilingY]
  );
  const { layout2D, eventHandlers } = useClick2AddWalls({
    panoramaOrigin,
    geometryInfo,
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
    const filename = getCurrentFormattedTime();
    Core.downloadMesh(filename, layout2D, ceilingY, floorY);
    downloadImage(`${filename}.png`, textureCanvasRef.current.getTexture());
  };

  return (
    <PageContainer>
      <Toolbar>
        <Icons.panorama />
        <Input onChange={onChange} value={imageSrc} />
        {!!layout2D.length && (
          <>
            <Icons.cube />
            <input
              type="range"
              value={ceilingY}
              onChange={(e) => setCeilingY(e.target.value)}
              min={0}
              max={10}
              step={1e-2}
            />
            <Icons.camera />
            <input
              type="number"
              value={panoramaOrigin[1]}
              onChange={(e) =>
                setPanoramaOrigin((value) => [
                  value[0],
                  Math.min(parseFloat(e.target.value), ceilingY),
                  value[2],
                ])
              }
              min={1.0}
              max={5.0}
              step={1e-2}
            />

            <Icons.download onClick={onDownload} />
          </>
        )}
      </Toolbar>
      <CanvasSwitch>
        <ThreeCanvas {...eventHandlers} dev={dev}>
          <PanoramaOutline {...props} />
        </ThreeCanvas>
        <ThreeCanvas dev={dev}>
          <PanoramaTextureMesh {...props} ref={textureCanvasRef} />
        </ThreeCanvas>
      </CanvasSwitch>
    </PageContainer>
  );
};

export default Editor;
