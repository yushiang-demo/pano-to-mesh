import React, {
  useRef,
  useMemo,
  useState,
  useCallback,
  useEffect,
} from "react";

import {
  Loaders,
  ThreeCanvas,
  PanoramaProjectionMesh,
  Core,
} from "../../three";
import useClick2AddWalls from "../../hooks/useClick2AddWalls";
import useDrag2AddPlane from "../../hooks/useDrag2AddPlane";
import { useStoreDataToHash } from "../../hooks/useHash";
import MediaManager from "../../components/MediaManager";
import ToolbarRnd from "../../components/ToolbarRnd";
import Toolbar from "../../components/Toolbar";
import Icons from "../../components/Icon";

const MODE = {
  VIEW: "VIEW",
  ADD_2D: "ADD_2D",
  ADD_3D: "ADD_3D",
  TRANSFORM: "TRANSFORM",
};

const ModeSwitch = ({ mode, setMode }) => {
  useEffect(() => {
    if (!mode) setMode(MODE.VIEW);
  }, [mode, setMode]);

  const changeMode = (mode) => () => setMode(mode);
  return (
    <ToolbarRnd>
      <Toolbar>
        <Icons.cursor
          highlight={mode === MODE.VIEW}
          onClick={changeMode(MODE.VIEW)}
        />
        <Icons.placeholder
          highlight={mode === MODE.ADD_2D}
          onClick={changeMode(MODE.ADD_2D)}
        />
        <Icons.box
          highlight={mode === MODE.ADD_3D}
          onClick={changeMode(MODE.ADD_3D)}
        />
        <Icons.axis
          highlight={mode === MODE.TRANSFORM}
          onClick={changeMode(MODE.TRANSFORM)}
        />
      </Toolbar>
    </ToolbarRnd>
  );
};

const dev = process.env.NODE_ENV === "development";
const Editor = ({ data }) => {
  const threeRef = useRef(null);
  const [raycasterTarget, setRaycasterTarget] = useState(null);
  const [camera, setCamera] = useState(null);
  const [mode, setMode] = useState(null);
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

  const {
    startPoint,
    endPoint,
    faceNormal,
    eventHandlers: addPlaneEvents,
  } = useDrag2AddPlane({
    raycasterTarget: [raycasterTarget],
    camera,
    onEnd: () => {},
  });

  const previewMedia = ((startPoint, endPoint, faceNormal) => {
    const transformation = Core.Math.transformation.planeMatrixFromAToB(
      startPoint,
      endPoint,
      faceNormal
    );

    if (!transformation) return null;

    return {
      content: `<div style="background:gray; width:100%; height:100%"/>`,
      props: {
        resolution: [1, 1],
        ...transformation,
      },
      type: "HTML",
    };
  })(startPoint, endPoint, faceNormal);

  useStoreDataToHash({
    ...data,
    media,
  });

  const textureMeshProps = {
    ...data,
    layout2D,
    panorama: Loaders.useTexture({ src: data.panorama }),
  };

  const onLoad = useCallback((mesh) => {
    threeRef.current.cameraControls.focus(mesh, false, false, false);
    setRaycasterTarget(mesh);
    setCamera(threeRef.current.cameraControls.getCamera());
  }, []);

  useEffect(() => {
    threeRef.current.cameraControls.setEnable(mode === MODE.VIEW);
  }, [mode]);

  const eventDictionary = {
    [MODE.VIEW]: null,
    [MODE.TRANSFORM]: null,
    [MODE.ADD_3D]: null,
    [MODE.ADD_2D]: addPlaneEvents,
  };
  const eventHandlers = eventDictionary[mode];

  return (
    <>
      <ThreeCanvas dev={dev} ref={threeRef} {...eventHandlers}>
        <PanoramaProjectionMesh {...textureMeshProps} onLoad={onLoad} />
        <MediaManager data={previewMedia ? [...media, previewMedia] : media} />
      </ThreeCanvas>
      <ModeSwitch mode={mode} setMode={setMode} />
    </>
  );
};

const PropsParser = ({ data }) => {
  if (!data) return null;
  return <Editor data={data} />;
};

export default PropsParser;
