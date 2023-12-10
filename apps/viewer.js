import React, { useRef, useMemo, useState, useCallback } from "react";
import Animator from "@pano-to-mesh/anime";
import {
  Core,
  Loaders,
  ThreeCanvas,
  PanoramaProjectionMesh,
  BackgroundPanel,
  Light,
} from "@pano-to-mesh/three";
import useClick2AddWalls from "../hooks/useClick2AddWalls";
import MediaManager from "../components/MediaManager";
import { MEDIA_2D, MEDIA_3D } from "../components/MediaManager/types";

const dev = process.env.NODE_ENV === "development";
const Viewer = ({ data }) => {
  const threeRef = useRef(null);
  const [isTopView] = useState(true);
  const [baseMesh, setBaseMesh] = useState(null);
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

  const textureMeshProps = {
    ...data,
    layout2D,
    panorama: Loaders.useTexture({ src: data.panorama }),
  };

  const onLoad = useCallback((mesh) => {
    threeRef.current.cameraControls.focus(mesh);
    setBaseMesh(mesh);
  }, []);

  const media = (data.media || []).filter(
    (data) =>
      ![MEDIA_3D.PLACEHOLDER_3D, MEDIA_2D.PLACEHOLDER_2D].includes(data.type)
  );

  const eventsHandlers = (() => {
    const MOUSE_UP_THRESHOLD = 5;
    let cursorPosition = null;
    let cumulativeDelta = 0;
    const onMouseDown = ({ offsetX, offsetY }) => {
      cursorPosition = { offsetX, offsetY };
      cumulativeDelta = 0;
    };
    const onMouseMove = ({ offsetX, offsetY }) => {
      if (!cursorPosition) return;
      cumulativeDelta += Math.abs(offsetX - cursorPosition.offsetX);
      cumulativeDelta += Math.abs(offsetY - cursorPosition.offsetY);
      cursorPosition = { offsetX, offsetY };
    };
    const onMouseUp = ({ normalizedX, normalizedY }) => {
      cursorPosition = null;
      if (MOUSE_UP_THRESHOLD < cumulativeDelta) return;

      const { cameraControls } = threeRef.current;
      const { animations } = cameraControls;

      if (isTopView) {
        const clip = animations.moveFromTop(data.panoramaOrigin);
        const timeline = Animator.createTimeline();
        timeline.addClip(clip);
        timeline.play();
        return;
      }

      const intersections = Core.raycastMeshFromScreen(
        [normalizedX, normalizedY],
        cameraControls.getCamera(),
        baseMesh
      );

      const firstIntersections = intersections[0];

      if (!firstIntersections) return;

      const { faceNormal, point } = firstIntersections;
      const cameraHeight = data.panoramaOrigin[1];
      const target = [
        point[0] - faceNormal[0] * cameraHeight,
        cameraHeight,
        point[2] - faceNormal[2] * cameraHeight,
      ];
      const clip = animations.moveTo(target);

      const timeline = Animator.createTimeline();
      timeline.addClip(clip);
      timeline.play();
    };

    return {
      onMouseDown,
      onMouseMove,
      onMouseUp,
    };
  })();

  return (
    <ThreeCanvas dev={dev} ref={threeRef} {...eventsHandlers}>
      <BackgroundPanel />
      <Light />
      <PanoramaProjectionMesh {...textureMeshProps} onLoad={onLoad} />
      <MediaManager data={media} />
    </ThreeCanvas>
  );
};

const PropsParser = ({ data }) => {
  if (!data) return null;
  return <Viewer data={data} />;
};

export default PropsParser;
