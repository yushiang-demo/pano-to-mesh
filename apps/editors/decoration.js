import React, { useEffect, useRef, useMemo } from "react";

import {
  Loaders,
  ThreeCanvas,
  PanoramaProjectionMesh,
  Css3DObject,
} from "../../three";
import useClick2AddWalls from "../../hooks/useClick2AddWalls";

const dev = process.env.NODE_ENV === "development";
const Editor = ({ data }) => {
  const threeRef = useRef(null);

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

  useEffect(() => {
    const removeSceneEvent = threeRef.current.scene.onChange(({ target }) => {
      const scene = target.getScene();
      threeRef.current.cameraControls.focus(scene);
    });

    return () => {
      removeSceneEvent();
    };
  }, []);

  return (
    <ThreeCanvas dev={dev} ref={threeRef}>
      <PanoramaProjectionMesh {...textureMeshProps} />
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
  );
};

const PropsParser = ({ data }) => {
  if (!data) return null;
  return <Editor data={data} />;
};

export default PropsParser;
