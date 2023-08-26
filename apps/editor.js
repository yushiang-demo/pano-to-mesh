import React, { useEffect, useMemo, useRef, useState } from "react";

import {
  Loaders,
  PanoramaOutline,
  ThreeCanvas,
  PanoramaTextureMesh,
  Core,
  Css3DObject,
} from "../three";
import useClick2AddWalls from "../hooks/useClick2AddWalls";
import PageContainer from "../components/PageContainer";
import Input from "../components/Input";
import Icons from "../components/Icon";
import Toolbar from "../components/Toolbar";
import RatioLockedDiv from "../components/RatioLockedDiv";
import { useStoreDataToHash } from "../hooks/useHash";

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
  const [preview, setPreview] = useState(false);
  const [imageSrc, setImageSrc] = useState(data.panorama);
  const panorama = Loaders.useTexture({ src: imageSrc });
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
  const { layout2D, eventHandlers, imageCoord } = useClick2AddWalls({
    defaultData: data.layout2D,
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
  const hash = useStoreDataToHash({
    ...props,
    layout2D: imageCoord,
    panorama: imageSrc,
  });

  const loadPanoramaFromLocal = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.addEventListener("change", (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();

        reader.onload = (e) => {
          const dataURL = e.target.result;
          setImageSrc(dataURL);
        };

        reader.readAsDataURL(file);
      }
    });

    fileInput.click();
  };

  const onChange = (value) => {
    setImageSrc(value);
  };

  const onDownload = () => {
    const filename = getCurrentFormattedTime();
    Core.downloadMesh(filename, layout2D, ceilingY, floorY);
    downloadImage(`${filename}.png`, textureCanvasRef.current.getTexture());
  };

  const onShare = () => {
    const newTab = window.open(`/#${hash}`);
    if (!newTab) {
      alert("Pop-up blocker prevented opening the new tab.");
    }
  };

  useEffect(() => {
    if (canvas3DRef.current) {
      const removeSceneEvent = canvas3DRef.current.scene.onChange(
        ({ target }) => {
          const scene = target.getScene();
          canvas3DRef.current.cameraControls.focus(scene);
        }
      );

      return () => {
        removeSceneEvent();
      };
    }
  }, [preview]);

  return (
    <PageContainer>
      <Toolbar>
        {!!layout2D.length && (
          <>
            {!preview ? (
              <Icons.activated3D onClick={() => setPreview((data) => !data)} />
            ) : (
              <Icons.inactivated3D
                onClick={() => setPreview((data) => !data)}
              />
            )}
          </>
        )}
        <Icons.panorama onClick={loadPanoramaFromLocal} />
        <Input
          onChange={onChange}
          value={imageSrc}
          candidates={[
            "https://as1.ftcdn.net/v2/jpg/05/34/28/38/1000_F_534283809_qJ4LqArfGQ51g8X3RuwmLpo6ATUdXngR.jpg",
            "https://as1.ftcdn.net/v2/jpg/01/89/08/78/1000_F_189087887_OBrl3f117Yicp94SBhFwMyxVgbN5Nfcb.jpg",
          ]}
        />
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

            {preview && <Icons.download onClick={onDownload} />}
            <Icons.share onClick={onShare} />
          </>
        )}
      </Toolbar>
      <RatioLockedDiv>
        {!preview ? (
          <ThreeCanvas {...eventHandlers} dev={dev}>
            <PanoramaOutline {...props} />
          </ThreeCanvas>
        ) : (
          <ThreeCanvas dev={dev} ref={canvas3DRef}>
            <PanoramaTextureMesh {...props} ref={textureCanvasRef} />
            <Css3DObject
              resolution={[1280, 720]}
              position={[0, 1e-2, 0]}
              scale={[3, 1.8, 1]}
              quaternion={[-0.7071068, 0, 0, 0.7071068]}
            >
              <video width={"100%"} height={"100%"} controls>
                <source
                  src="https://www.w3schools.com/tags/movie.mp4"
                  type="video/mp4"
                />
              </video>
            </Css3DObject>
          </ThreeCanvas>
        )}
      </RatioLockedDiv>
    </PageContainer>
  );
};

const PropsParser = ({ data }) => {
  return (
    <Editor
      data={
        data || {
          panorama: "",
          panoramaOrigin: [0, 1.5, 0],
          floorY: 0,
          ceilingY: 2.0,
          layout2D: [],
        }
      }
    />
  );
};

export default PropsParser;
