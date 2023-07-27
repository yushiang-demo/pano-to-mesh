import { useEffect, useState } from "react";

import { Core } from "../three";

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
  panoramaOrigin,
  geometryInfo,
  selectThresholdPixel,
}) => {
  const [dragging, setDragging] = useState(false);
  const [previewImageCoord, setPreviewImageCoord] = useState(null);
  const [imageCoord, setImageCoord] = useState([]);
  const [layout2D, setLayout2D] = useState([]);

  const parseMousePointTo3D = ([normalizedX, normalizedY]) => {
    const { longitude, latitude } =
      Core.Math.coordinates.normalizedXY2Spherical(normalizedX, normalizedY);
    const { x, y, z } = Core.Math.coordinates.spherical2CartesianDirection(
      longitude,
      latitude
    );

    const geometry = Core.getEmptyRoomGeometry(geometryInfo);
    const point = Core.raycastGeometry(panoramaOrigin, [x, y, z], geometry);
    return point;
  };

  useEffect(() => {
    if (dragging) document.body.style.cursor = "crosshair";
    else document.body.style.cursor = "default";
  }, [dragging]);

  const onMouseLeave = () => {
    setPreviewImageCoord(null);
    setDragging(false);
  };
  const onMouseMove = ({ normalizedX, normalizedY, width, height }) => {
    if (dragging && parseMousePointTo3D([normalizedX, normalizedY]))
      setPreviewImageCoord([normalizedX, normalizedY]);
    else {
      const point = imageCoord.find(
        pointSelector(
          normalizedX,
          normalizedY,
          ({ x, y }) => ({
            x: x * width,
            y: y * height,
          }),
          selectThresholdPixel
        )
      );
      if (point) document.body.style.cursor = "crosshair";
      else document.body.style.cursor = "default";
    }
  };

  const onMouseUp = ({ normalizedX, normalizedY }) => {
    if (dragging) {
      if (parseMousePointTo3D([normalizedX, normalizedY]))
        setImageCoord([...imageCoord, [normalizedX, normalizedY]]);
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
    else setImageCoord([[normalizedX, normalizedY]]);
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
  }, [imageCoord, previewImageCoord]);

  return {
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
