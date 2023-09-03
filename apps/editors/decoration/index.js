import React, {
  useRef,
  useMemo,
  useState,
  useCallback,
  useEffect,
} from "react";

import {
  Media,
  Loaders,
  ThreeCanvas,
  PanoramaProjectionMesh,
  MeshIndexMap,
} from "../../../three";
import useClick2AddWalls from "../../../hooks/useClick2AddWalls";
import useDragTransformation from "../../../hooks/useDragTransformation";
import { useStoreDataToHash } from "../../../hooks/useHash";
import MediaManager from "../../../components/MediaManager";
import { MODE } from "./constant";
import ModeSwitch from "./ModeSwitch";
import { getNewMedia } from "./media";
import { MEDIA } from "../../../constant/media";

const mapMediaToMesh = (media) => {
  const { transformation, type } = media;

  const mesh = ((type) => {
    if (type === MEDIA.BBOX) {
      return Media.getBoxMesh();
    } else if (type === MEDIA.HTML) {
      return Media.getPlaneMesh();
    }
  })(type);

  return {
    transformation,
    mesh,
  };
};

const dev = process.env.NODE_ENV === "development";
const Editor = ({ data }) => {
  const threeRef = useRef(null);
  const mediaIndexMap = useRef(null);
  const [raycasterTarget, setRaycasterTarget] = useState(null);
  const [mouse, setMouse] = useState([0, 0]);
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

  const newMediaType = {
    [MODE.ADD_3D]: MEDIA.BBOX,
    [MODE.ADD_2D]: MEDIA.HTML,
  };
  const { transformation, eventHandlers: handleAddPlaceholder } =
    useDragTransformation({
      raycasterTarget: [raycasterTarget],
      camera,
      onEnd: (transformation) => {
        const newMedia = getNewMedia(newMediaType[mode], transformation);
        setMedia((state) => [...state, newMedia]);
      },
    });

  const objectSelectorEventHandlers = (() => {
    const onMouseMove = ({ normalizedX, normalizedY }) => {
      setMouse([normalizedX, 1 - normalizedY]);
    };

    const onMouseUp = ({ normalizedX, normalizedY }) => {
      const index = mediaIndexMap.current.getIndex(
        normalizedX,
        1 - normalizedY
      );
      console.log(index);
    };

    return {
      onMouseMove,
      onMouseUp,
    };
  })();

  const eventDictionary = {
    [MODE.VIEW]: objectSelectorEventHandlers,
    [MODE.TRANSFORM]: null,
    [MODE.ADD_3D]: handleAddPlaceholder,
    [MODE.ADD_2D]: handleAddPlaceholder,
  };
  const eventHandlers = eventDictionary[mode];
  const previewMedia = getNewMedia(newMediaType[mode], transformation);

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

  return (
    <>
      <ThreeCanvas dev={dev} ref={threeRef} {...eventHandlers}>
        <PanoramaProjectionMesh {...textureMeshProps} onLoad={onLoad} />
        <MediaManager
          data={previewMedia ? [...media, previewMedia] : media}
          readonly
        />
        <MeshIndexMap
          meshes={media.map(mapMediaToMesh)}
          mouse={mouse}
          ref={mediaIndexMap}
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
