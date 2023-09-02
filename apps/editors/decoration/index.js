import React, {
  useRef,
  useMemo,
  useState,
  useCallback,
  useEffect,
} from "react";

import { Loaders, ThreeCanvas, PanoramaProjectionMesh } from "../../../three";
import useClick2AddWalls from "../../../hooks/useClick2AddWalls";
import useDragTransformation from "../../../hooks/useDragTransformation";
import { useStoreDataToHash } from "../../../hooks/useHash";
import MediaManager from "../../../components/MediaManager";
import { MODE } from "./constant";
import ModeSwitch from "./ModeSwitch";
import { getNewMedia } from "./media";
import { MEDIA } from "../../../constant/media";

const dev = process.env.NODE_ENV === "development";
const Editor = ({ data }) => {
  const threeRef = useRef(null);
  const [raycasterTarget, setRaycasterTarget] = useState(null);
  const [camera, setCamera] = useState(null);
  const [mode, setMode] = useState(null);
  const [media, setMedia] = useState(data.media || []);

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

  const { transformation, eventHandlers: handleAddPlaceholder } =
    useDragTransformation({
      raycasterTarget: [raycasterTarget],
      camera,
      onEnd: (transformation) => {
        const newMedia = getNewMedia(MEDIA.HTML, transformation);
        setMedia((state) => [...state, newMedia]);
      },
    });

  const previewMedia = getNewMedia(MEDIA.HTML, transformation);

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
    [MODE.ADD_2D]: handleAddPlaceholder,
  };
  const eventHandlers = eventDictionary[mode];

  return (
    <>
      <ThreeCanvas dev={dev} ref={threeRef} {...eventHandlers}>
        <PanoramaProjectionMesh {...textureMeshProps} onLoad={onLoad} />
        <MediaManager
          data={previewMedia ? [...media, previewMedia] : media}
          readonly={mode !== MODE.VIEW}
        />
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
