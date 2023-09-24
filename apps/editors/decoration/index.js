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
  TransformControls,
  TRANSFORM_CONTROLS_MODE,
} from "@pano-to-mesh/three";
import useClick2AddWalls from "../../../hooks/useClick2AddWalls";
import useDragTransformation from "../../../hooks/useDragTransformation";
import { useStoreDataToHash } from "../../../hooks/useHash";
import MediaManager from "../../../components/MediaManager";
import { MODE } from "./constant";
import { EditorModeSwitch, TransformModeSwitch } from "./ModeSwitch";
import { getNewMedia } from "./media";
import { MEDIA } from "../../../constant/media";
import ToolbarRnd from "../../../components/ToolbarRnd";
import Icons from "../../../components/Icon";

const mapMediaToMesh = (media) => {
  const { transformation, type } = media;

  const mesh = ((type) => {
    if (type === MEDIA.BBOX) {
      return Media.getBoxMesh();
    } else if (type === MEDIA.HTML) {
      return Media.getPlaneMesh();
    }
  })(type);

  mesh.setTransform(transformation);

  return mesh;
};

const dev = process.env.NODE_ENV === "development";
const Editor = ({ data }) => {
  const threeRef = useRef(null);
  const mediaIndexMap = useRef(null);
  const [raycasterTarget, setRaycasterTarget] = useState(null);
  const [mouse, setMouse] = useState([0, 0]);
  const [camera, setCamera] = useState(null);
  const [transformMode, setTransformMode] = useState(
    TRANSFORM_CONTROLS_MODE.TRANSLATE
  );
  const [mode, setMode] = useState(null);
  const [focusedIndex, setFocusedIndex] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [media, setMedia] = useState(data.media || []);
  const meshes = media.map(mapMediaToMesh);
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
      raycasterTarget: [raycasterTarget, ...meshes.map(({ object }) => object)],
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
      setFocusedIndex((prev) => {
        return prev === index ? null : index;
      });
    };

    return {
      onMouseMove,
      onMouseDown,
    };
  })();

  const eventDictionary = {
    [MODE.VIEW]: isDragging ? null : objectSelectorEventHandlers,
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

  return (
    <>
      <ThreeCanvas dev={dev} ref={threeRef} {...eventHandlers}>
        <PanoramaProjectionMesh {...textureMeshProps} onLoad={onLoad} />
        <MediaManager
          data={previewMedia ? [...media, previewMedia] : media}
          readonly
        />
        <MeshIndexMap meshes={meshes} mouse={mouse} ref={mediaIndexMap} />
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
