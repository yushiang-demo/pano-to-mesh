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
import useMouseSkipDrag from "../hooks/useMouseSkipDrag";
import ToolbarRnd from "../components/ToolbarRnd";
import Toolbar from "../components/Toolbar";
import Icons from "../components/Icon";

const dev = process.env.NODE_ENV === "development";
const Viewer = ({ data }) => {
  const threeRef = useRef(null);
  const [isTopView, setIsTopView] = useState(true);
  const [isCameraMoving, setIsCameraMoving] = useState(false);
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

  const runAnimation = (clips, onfinish) => {
    if (isCameraMoving) return;

    const timeline = Animator.createTimeline();
    clips.forEach(timeline.addClip);
    timeline.play();
    timeline.finished.then(() => {
      setIsCameraMoving(false);
      if (onfinish) onfinish();
    });
    setIsCameraMoving(true);
  };

  const goTop = () => {
    if (isCameraMoving) return;

    const { cameraControls } = threeRef.current;
    const { animations } = cameraControls;
    const clip = animations.moveToTop(baseMesh);

    runAnimation(clip, () => setIsTopView(true));
  };

  const goDown = () => {
    if (isCameraMoving) return;

    const { cameraControls } = threeRef.current;
    const { animations } = cameraControls;
    const clip = animations.moveFromTop(data.panoramaOrigin);

    runAnimation(clip, () => setIsTopView(false));
  };

  const eventsHandlers = useMouseSkipDrag(({ normalizedX, normalizedY }) => {
    const { cameraControls } = threeRef.current;
    const { animations } = cameraControls;

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
      point[0] + faceNormal[0] * cameraHeight,
      cameraHeight,
      point[2] + faceNormal[2] * cameraHeight,
    ];

    runAnimation(
      (isTopView ? animations.moveFromTop : animations.moveTo)(target),
      () => setIsTopView(false)
    );
  });

  return (
    <>
      <ThreeCanvas dev={dev} ref={threeRef} {...eventsHandlers}>
        <BackgroundPanel />
        <Light />
        <PanoramaProjectionMesh {...textureMeshProps} onLoad={onLoad} />
        <MediaManager data={media} />
      </ThreeCanvas>
      {!isCameraMoving && (
        <ToolbarRnd>
          <Toolbar>
            {isTopView ? (
              <Icons.arrowToDown onClick={goDown} />
            ) : (
              <Icons.arrowToTop onClick={goTop} />
            )}
          </Toolbar>
        </ToolbarRnd>
      )}
    </>
  );
};

const PropsParser = ({ data }) => {
  if (!data) return null;
  return <Viewer data={data} />;
};

export default PropsParser;
