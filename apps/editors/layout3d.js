import React, { useMemo, useRef, useState } from "react";
import ToolbarRnd from "../../components/ToolbarRnd";
import { Loaders, ThreeCanvas, PanoramaTextureMesh, Core } from "../../three";
import useClick2AddWalls from "../../hooks/useClick2AddWalls";
import Icons from "../../components/Icon";
import Toolbar from "../../components/Toolbar";
import { useStoreDataToHash } from "../../hooks/useHash";

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
const Editor = ({ data }) => {
  const canvas3DRef = useRef(null);
  const textureCanvasRef = useRef(null);
  const [panoramaOrigin, setPanoramaOrigin] = useState(data.panoramaOrigin);
  const [floorY] = useState(data.floorY);
  const [ceilingY, setCeilingY] = useState(data.ceilingY);
  const geometryInfo = useMemo(
    () => ({
      floorY,
      ceilingY,
    }),
    [floorY, ceilingY]
  );
  const { layout2D, imageCoord } = useClick2AddWalls({
    defaultData: data.layout2D,
    panoramaOrigin,
    geometryInfo,
    selectThresholdPixel: 5,
  });

  const props = {
    floorY,
    ceilingY,
    layout2D,
    panorama: Loaders.useTexture({ src: data.panorama }),
    panoramaOrigin,
  };

  useStoreDataToHash({
    ...props,
    panorama: data.panorama,
    layout2D: imageCoord,
  });

  const onDownload = () => {
    const filename = getCurrentFormattedTime();
    Core.downloadMesh(filename, layout2D, ceilingY, floorY);
    downloadImage(`${filename}.png`, textureCanvasRef.current.getTexture());
  };

  const onLoad = (mesh) => {
    canvas3DRef.current.cameraControls.focus(mesh, false, false, false);
  };

  return (
    <>
      <ThreeCanvas dev={dev} ref={canvas3DRef}>
        <PanoramaTextureMesh
          {...props}
          ref={textureCanvasRef}
          onLoad={onLoad}
        />
      </ThreeCanvas>
      <ToolbarRnd>
        <Toolbar>
          {!!layout2D.length && (
            <>
              <Icons.cube />
              <input
                type="number"
                value={ceilingY}
                onChange={(e) => setCeilingY(e.target.value)}
                min={panoramaOrigin[1]}
                max={panoramaOrigin[1] + 10}
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
      </ToolbarRnd>
    </>
  );
};

const PropsParser = ({ data }) => {
  if (!data) return null;
  return <Editor data={data} />;
};

export default PropsParser;
