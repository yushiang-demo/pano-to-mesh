import { useCallback, useEffect, useState } from "react";

import { Core } from "@pano-to-mesh/three";

const outOfRange = (value) => {
  return value > 1.0 || value < 0.0;
};

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
  const [previewCoordIndex, setPreviewCoordIndex] = useState(null);
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
      if (outOfRange(normalizedX) || outOfRange(normalizedY)) {
        return null;
      }
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

  const onMouseMove = ({ normalizedX, normalizedY }) => {
    if (dragging && parseMousePointTo3D([normalizedX, normalizedY])) {
      setPreviewImageCoord([normalizedX, normalizedY]);
    } else {
      setPreviewImageCoord(null);
      setPreviewCoordIndex(null);
    }
  };

  const onMouseUp = ({ normalizedX, normalizedY }) => {
    if (dragging) {
      if (parseMousePointTo3D([normalizedX, normalizedY])) {
        const newCoord = [...imageCoord];
        newCoord.splice(
          previewCoordIndex,
          0,
          parser2DCeilingCoordToFloorCoord([normalizedX, normalizedY])
        );

        setImageCoord(newCoord);
      }
      setPreviewImageCoord(null);
      setPreviewCoordIndex(null);
      setDragging(false);
    }
  };

  const onMouseDown = ({ width, height, normalizedX, normalizedY }) => {
    const selectedIndex = imageCoord.findIndex(([x, y]) =>
      pointSelector(
        normalizedX,
        normalizedY,
        ({ x, y }) => ({
          x: x * width,
          y: y * height,
        }),
        selectThresholdPixel
      )([x, y])
    );
    const points = imageCoord.filter((_, index) => index !== selectedIndex);
    if (points.length) setImageCoord(points);
    else
      setImageCoord([
        parser2DCeilingCoordToFloorCoord([normalizedX, normalizedY]),
      ]);
    setDragging(true);
    const targetCoord = [normalizedX, normalizedY];

    const index = (() => {
      if (selectedIndex > -1) return selectedIndex;
      let index = null;
      let boundaryIndex = null;
      let targetWidth = 1; // max coord distance is 1;

      const isEqual = (x, y) => x - y < 1e-3;

      const xArray = imageCoord.map(([x]) => x);
      const minX = Math.min(...xArray);
      const maxX = Math.max(...xArray);

      for (let i = 0; i < imageCoord.length; i++) {
        const start = imageCoord[i][0];
        const end = imageCoord[(i + 1) % imageCoord.length][0];

        if (
          ((isEqual(start, minX) && isEqual(end, maxX)) ||
            (isEqual(end, minX) && isEqual(start, maxX))) &&
          !boundaryIndex
        ) {
          boundaryIndex = i;
        }

        const newX = targetCoord[0];

        const isInRange = isEqual(
          Math.abs(newX - start) + Math.abs(newX - end) - Math.abs(start - end),
          0
        );

        const wallWidth = Math.abs(start - end);

        if (isInRange && wallWidth < targetWidth) {
          index = i;
          targetWidth = wallWidth;
        }
      }

      return (index !== null ? index : boundaryIndex) + 1;
    })();
    setPreviewImageCoord(targetCoord);
    setPreviewCoordIndex(index);
  };

  useEffect(() => {
    const coord2d = [...imageCoord];
    if (previewImageCoord) {
      coord2d.splice(previewCoordIndex, 0, previewImageCoord);
    }

    const pointsXZ = coord2d
      .map((coord) => {
        const point = parseMousePointTo3D(coord);
        if (point) return point;
      })
      .filter((value) => value);
    setLayout2D(pointsXZ);
  }, [imageCoord, previewImageCoord, previewCoordIndex, parseMousePointTo3D]);

  return {
    imageCoord,
    layout2D,
    eventHandlers: {
      onMouseDown,
      onMouseUp,
      onMouseMove,
    },
  };
};

export default useClick2AddWalls;
