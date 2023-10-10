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
  BackgroundPanel,
  PanoramaProjectionMesh,
  TransformControls,
  TRANSFORM_CONTROLS_MODE,
  Light,
} from "@pano-to-mesh/three";
import useClick2AddWalls from "../../../hooks/useClick2AddWalls";
import useDragTransformation from "../../../hooks/useDragTransformation";
import { useStoreDataToHash } from "../../../hooks/useHash";
import MediaManager from "../../../components/MediaManager";
import { MEDIA_2D, MEDIA_3D } from "../../../components/MediaManager/types";
import { MODE } from "./constant";
import { EditorModeSwitch, TransformModeSwitch } from "./ModeSwitch";
import { getNewMedia } from "./media";
import ToolbarRnd from "../../../components/ToolbarRnd";
import Icons from "../../../components/Icon";
import PropertySetting from "../../../components/PropertySettings";
import ObjectSelector from "../../../components/ObjectSelector";

const dev = process.env.NODE_ENV === "development";
const Editor = ({ data }) => {
  const threeRef = useRef(null);
  const mediaIndexMap = useRef(null);
  const [baseMesh, setBaseMesh] = useState(null);
  const [mouse, setMouse] = useState([0, 0]);
  const [camera, setCamera] = useState(null);
  const [transformMode, setTransformMode] = useState(
    TRANSFORM_CONTROLS_MODE.TRANSLATE
  );
  const [mode, setMode] = useState(null);
  const [focusedIndex, setFocusedIndex] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
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
    [MODE.ADD_3D]: MEDIA_3D.PLACEHOLDER_3D,
    [MODE.ADD_2D]: MEDIA_2D.PLACEHOLDER_2D,
  };
  const { transformation, eventHandlers: handleAddPlaceholder } =
    useDragTransformation({
      raycasterTarget: [baseMesh],
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

    const onMouseDown = ({ normalizedX, normalizedY }) => {
      const index = mediaIndexMap.current.getIndex(
        normalizedX,
        1 - normalizedY
      );
      if (Number.isInteger(index)) {
        setFocusedIndex((prev) => {
          return prev === index ? null : index;
        });
      }
    };

    return {
      onMouseMove,
      onMouseDown,
    };
  })();

  const eventDictionary = {
    [MODE.SELECT]: isDragging ? null : objectSelectorEventHandlers,
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
    setBaseMesh(mesh);
    setCamera(threeRef.current.cameraControls.getCamera());
  }, []);

  useEffect(() => {
    threeRef.current.cameraControls.setEnable(mode === MODE.SELECT);
  }, [mode]);

  const focusedMedia = media[focusedIndex];
  const onFocusedMediaChange = useCallback(
    (transformation) => {
      setMedia((prev) => {
        const oldMedia = [...prev];
        oldMedia[focusedIndex].transformation = transformation;
        return oldMedia;
      });
    },
    [focusedIndex]
  );
  const deleteFocusedMedia = useCallback(() => {
    setMedia((prev) => {
      return prev.filter((_, index) => index !== focusedIndex);
    });
    setFocusedIndex(null);
  }, [focusedIndex]);

  const changeFocusedMedia = useCallback(
    (type, data) => {
      setMedia((prev) => {
        const prevMedia = [...prev];
        prevMedia[focusedIndex].type = type;
        prevMedia[focusedIndex].data = data;
        return prevMedia;
      });
    },
    [focusedIndex]
  );

  return (
    <>
      <ThreeCanvas dev={dev} ref={threeRef} {...eventHandlers}>
        <Light />
        <BackgroundPanel />
        <PanoramaProjectionMesh {...textureMeshProps} onLoad={onLoad} />
        <MediaManager
          data={previewMedia ? [...media, previewMedia] : media}
          readonly
        />
        <ObjectSelector media={media} mouse={mouse} ref={mediaIndexMap} />
        {focusedMedia && (
          <TransformControls
            mode={transformMode}
            position={focusedMedia.transformation.position}
            scale={focusedMedia.transformation.scale}
            quaternion={focusedMedia.transformation.quaternion}
            onChange={onFocusedMediaChange}
            onDraggingChanged={setIsDragging}
          />
        )}
      </ThreeCanvas>
      <ToolbarRnd>
        <EditorModeSwitch mode={mode} setMode={setMode} />
        {focusedMedia && (
          <>
            <TransformModeSwitch
              mode={transformMode}
              setMode={setTransformMode}
            />
            <PropertySetting
              type={focusedMedia.type}
              data={focusedMedia.data}
              onChange={changeFocusedMedia}
            />
            <Icons.trash onClick={deleteFocusedMedia} />
          </>
        )}
      </ToolbarRnd>
    </>
  );
};

const PropsParser = ({ data }) => {
  if (!data) return null;
  return <Editor data={data} />;
};

export default PropsParser;
