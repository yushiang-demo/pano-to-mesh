import { useCallback, useEffect, useState } from "react";

import { Core } from "@pano-to-mesh/three";

const pointSelector = (x, y, unitParser, threshold) => {
  return ([candidateX, candidateY]) => {
    const normalizedVector = {
      x: candidateX - x,
      y: candidateY - y,
    };
    const pixelVector = unitParser(normalizedVector);
    const distance = Math.sqrt(pixelVector.x ** 2);
    return threshold > distance;
  };
};

const useClick2AddWalls = ({
  defaultData,
  panoramaOrigin,
  geometryInfo,
  selectThresholdPixel,
}) => {
  const [dragging, setDragging] = useState(false);
  const [previewImageCoord, setPreviewImageCoord] = useState(null);
  const [imageCoord, setImageCoord] = useState(defaultData || []);
  const [layout2D, setLayout2D] = useState([]);

  const parser2DCeilingCoordToFloorCoord = ([normalizedX, normalizedY]) => {
    const point = parseMousePointTo3D([normalizedX, normalizedY]);
    const { longitude, latitude } = Core.Math.coordinates.cartesian2Spherical(
      point[0] - panoramaOrigin[0],
      geometryInfo.floorY - panoramaOrigin[1],
      point[1] - panoramaOrigin[2]
    );
    const { x, y } = Core.Math.coordinates.spherical2NormalizedXY(
      longitude,
      latitude
    );
    return [x, y];
  };

  const parseMousePointTo3D = useCallback(
    ([normalizedX, normalizedY]) => {
      const { longitude, latitude } =
        Core.Math.coordinates.normalizedXY2Spherical(normalizedX, normalizedY);
      const { x, y, z } = Core.Math.coordinates.spherical2CartesianDirection(
        longitude,
        latitude
      );

      const geometry = Core.getEmptyRoomGeometry(geometryInfo);
      const point = Core.raycastGeometry(panoramaOrigin, [x, y, z], geometry);
      return point;
    },
    [panoramaOrigin, geometryInfo]
  );

  const onMouseLeave = () => {
    setPreviewImageCoord(null);
    setDragging(false);
  };
  const onMouseMove = ({ normalizedX, normalizedY }) => {
    if (dragging && parseMousePointTo3D([normalizedX, normalizedY]))
      setPreviewImageCoord([normalizedX, normalizedY]);
  };

  const onMouseUp = ({ normalizedX, normalizedY }) => {
    if (dragging) {
      if (parseMousePointTo3D([normalizedX, normalizedY]))
        setImageCoord([
          ...imageCoord,
          parser2DCeilingCoordToFloorCoord([normalizedX, normalizedY]),
        ]);
      setPreviewImageCoord(null);
      setDragging(false);
    }
  };

  const onMouseDown = ({ width, height, normalizedX, normalizedY }) => {
    const points = imageCoord.filter(
      ([x, y]) =>
        !pointSelector(
          normalizedX,
          normalizedY,
          ({ x, y }) => ({
            x: x * width,
            y: y * height,
          }),
          selectThresholdPixel
        )([x, y])
    );
    if (points.length) setImageCoord(points);
    else
      setImageCoord([
        parser2DCeilingCoordToFloorCoord([normalizedX, normalizedY]),
      ]);
    setDragging(true);
    setPreviewImageCoord([normalizedX, normalizedY]);
  };

  useEffect(() => {
    const coord2d = [...imageCoord];
    if (previewImageCoord) coord2d.push(previewImageCoord);
    coord2d.sort(([x1], [x2]) => x1 - x2);

    const pointsXZ = coord2d
      .map((coord) => {
        const point = parseMousePointTo3D(coord);
        if (point) return point;
      })
      .filter((value) => value);
    setLayout2D(pointsXZ);
  }, [imageCoord, previewImageCoord, parseMousePointTo3D]);

  return {
    imageCoord,
    layout2D,
    eventHandlers: {
      onMouseDown,
      onMouseUp,
      onMouseMove,
      onMouseLeave,
    },
  };
};

export default useClick2AddWalls;
